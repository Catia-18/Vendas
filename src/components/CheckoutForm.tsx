import React, { useState, useEffect } from 'react';
import {
  Product,
  DeliveryZone,
  CreateOrderPayload,
  OrderConfirmationResult,
  PaymentMethodType
} from '../types';
import {
  CreditCard,
  Banknote,
  Truck,
  Plus,
  Minus,
  AlertCircle,
  ShieldCheck,
  Check,
  Lock,
  Building2
} from 'lucide-react';
import { createOrder, createStripePaymentIntent } from '../services/api';

interface CheckoutFormProps {
  product: Product | null;
  deliveryZones: DeliveryZone[];
  onOrderSuccess: (result: OrderConfirmationResult) => void;
}

export const CheckoutForm: React.FC<CheckoutFormProps> = ({
  product,
  deliveryZones,
  onOrderSuccess
}) => {
  const [quantity, setQuantity] = useState<number>(1);
  const [customerName, setCustomerName] = useState<string>('');
  const [customerPhone, setCustomerPhone] = useState<string>('');
  const [province, setProvince] = useState<string>('Luanda');
  const [municipality, setMunicipality] = useState<string>('Luanda');
  const [neighborhood, setNeighborhood] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [referencePoint, setReferencePoint] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType>('cash_on_delivery');

  // Stripe Card simulated inputs for inline card entry
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');
  const [stripeProcessing, setStripeProcessing] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const zonesForProvince = deliveryZones.filter(
    (z) => z.province.toLowerCase() === province.toLowerCase()
  );

  const currentZone =
    zonesForProvince.find(
      (z) =>
        z.municipality.toLowerCase() === municipality.toLowerCase() ||
        municipality.toLowerCase().includes(z.municipality.toLowerCase())
    ) || zonesForProvince[0];

  useEffect(() => {
    if (zonesForProvince.length > 0) {
      if (!zonesForProvince.some((z) => z.municipality === municipality)) {
        setMunicipality(zonesForProvince[0].municipality);
      }
    } else {
      setMunicipality('');
    }

    if (province !== 'Luanda' && paymentMethod === 'cash_on_delivery') {
      setPaymentMethod('bank_transfer');
    }
  }, [province]);

  const unitPrice = product?.price || 29900;
  const subtotal = unitPrice * quantity;
  const deliveryFee = currentZone ? currentZone.fee : province === 'Luanda' ? 2500 : 6000;
  const total = subtotal + deliveryFee;

  const formatKz = (val: number) => new Intl.NumberFormat('pt-AO').format(val);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/[^0-9+\s]/g, '');
    setCustomerPhone(val);
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, '').substring(0, 16);
    val = val.replace(/(\d{4})/g, '$1 ').trim();
    setCardNumber(val);
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, '').substring(0, 4);
    if (val.length >= 3) {
      val = `${val.substring(0, 2)}/${val.substring(2)}`;
    }
    setCardExpiry(val);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!customerName.trim()) {
      setErrorMessage('Por favor, indica o teu nome completo.');
      return;
    }

    const cleanPhone = customerPhone.replace(/\s+/g, '');
    const angolaPhoneRegex = /^(\+?244)?9\d{8}$/;
    if (!angolaPhoneRegex.test(cleanPhone)) {
      setErrorMessage(
        'Por favor, introduz um número de telefone angolano válido (ex: 923 456 789 ou +244 923 456 789).'
      );
      return;
    }

    if (!province) {
      setErrorMessage('Por favor, selecciona a tua província.');
      return;
    }

    if (!municipality && province === 'Luanda') {
      setErrorMessage('Por favor, selecciona o teu município em Luanda.');
      return;
    }

    if (!address.trim()) {
      setErrorMessage('Por favor, indica a tua rua, condomínio ou número de casa.');
      return;
    }

    if (!referencePoint.trim()) {
      setErrorMessage(
        'Por favor, fornece um ponto de referência para a equipa de entrega localizar a morada.'
      );
      return;
    }

    let stripeIntentId: string | undefined = undefined;

    // Handle Stripe processing if selected
    if (paymentMethod === 'stripe') {
      if (cardNumber.replace(/\s/g, '').length < 15) {
        setErrorMessage('Por favor, insere um número de cartão de crédito/débito válido para pagamento via Stripe.');
        return;
      }
      if (cardExpiry.length < 5) {
        setErrorMessage('Por favor, indica o mês e ano de validade do cartão (MM/AA).');
        return;
      }
      if (cardCvc.length < 3) {
        setErrorMessage('Por favor, indica o código de segurança CVC do cartão.');
        return;
      }

      setStripeProcessing(true);
      try {
        const stripeRes = await createStripePaymentIntent(
          total,
          customerName.trim(),
          cleanPhone
        );
        stripeIntentId = stripeRes.id;
      } catch (err: any) {
        setErrorMessage('Erro ao processar transacção na Stripe: ' + err.message);
        setStripeProcessing(false);
        return;
      }
    }

    setIsSubmitting(true);

    try {
      const payload: CreateOrderPayload = {
        customerName: customerName.trim(),
        customerPhone: cleanPhone,
        province: province.trim(),
        municipality: municipality.trim() || 'Sede',
        neighborhood: neighborhood.trim(),
        address: address.trim(),
        referencePoint: referencePoint.trim(),
        notes: notes.trim(),
        quantity,
        paymentMethod,
        stripePaymentIntentId: stripeIntentId
      };

      const result = await createOrder(payload);
      onOrderSuccess(result);
    } catch (err: any) {
      setErrorMessage(err.message || 'Ocorreu um erro ao processar a encomenda.');
    } finally {
      setIsSubmitting(false);
      setStripeProcessing(false);
    }
  };

  return (
    <div className="py-12 bg-[#F8F8F6] text-[#17191C]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#C6A66B] block mb-2">
            Área de Encomenda
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold font-display tracking-tight text-[#17191C]">
            Finalizar a Tua Compra
          </h1>
          <p className="mt-2 text-sm text-[#52525B]">
            Indica a tua morada em Angola e escolhe o teu método de pagamento preferido (Entrega, Transferência ou Cartão Stripe).
          </p>
        </div>

        <div className="mb-8 p-3.5 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center justify-center gap-2 text-xs text-emerald-800 text-center font-medium">
          <Check className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Compra Rápida de Convidado: Não precisas de criar conta nem iniciar sessão para encomendar.</span>
        </div>

        {errorMessage && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3 text-sm text-red-800">
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <div className="flex-1 font-medium">{errorMessage}</div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Customer & Delivery Inputs */}
          <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-xl border border-[#E4E4E7] shadow-xs space-y-6">
            <h3 className="text-base font-bold font-display text-[#17191C] border-b border-[#E4E4E7] pb-3">
              1. Dados do Destinatário & Morada
            </h3>

            {/* Quantity Selector */}
            <div className="p-4 bg-[#F8F8F6] rounded-lg border border-[#E4E4E7] flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-[#71717A] block">
                  Luminária LED LUMORA
                </span>
                <span className="text-sm font-semibold text-[#17191C] font-mono">
                  {formatKz(unitPrice)} Kz / un.
                </span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-9 h-9 rounded-md border border-[#E4E4E7] bg-white flex items-center justify-center text-[#17191C] hover:bg-slate-50 transition-colors disabled:opacity-40"
                  disabled={quantity <= 1}
                  aria-label="Diminuir quantidade"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="text-lg font-bold font-mono tabular-nums text-[#17191C] min-w-8 text-center">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity(Math.min(20, quantity + 1))}
                  className="w-9 h-9 rounded-md border border-[#E4E4E7] bg-white flex items-center justify-center text-[#17191C] hover:bg-slate-50 transition-colors"
                  aria-label="Aumentar quantidade"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Name and Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#17191C] mb-1.5">
                  Nome Completo <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Manuel de Almeida"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm rounded-md border border-[#E4E4E7] focus:outline-none focus:ring-2 focus:ring-[#C6A66B]/50 focus:border-[#C6A66B]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#17191C] mb-1.5">
                  Telefone (Angola) <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  placeholder="Ex: 923 456 789 ou +244 923 456 789"
                  value={customerPhone}
                  onChange={handlePhoneChange}
                  className="w-full px-3.5 py-2.5 text-sm rounded-md border border-[#E4E4E7] focus:outline-none focus:ring-2 focus:ring-[#C6A66B]/50 focus:border-[#C6A66B]"
                />
              </div>
            </div>

            {/* Province & Municipality */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#17191C] mb-1.5">
                  Província <span className="text-red-500">*</span>
                </label>
                <select
                  value={province}
                  onChange={(e) => setProvince(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm rounded-md border border-[#E4E4E7] bg-white focus:outline-none focus:ring-2 focus:ring-[#C6A66B]/50 focus:border-[#C6A66B]"
                >
                  <option value="Luanda">Luanda (Foco Prioritário)</option>
                  <option value="Benguela">Benguela (Lobito / Benguela)</option>
                  <option value="Huambo">Huambo</option>
                  <option value="Huíla">Huíla (Lubango)</option>
                  <option value="Cabinda">Cabinda</option>
                  <option value="Outra Província">Outra Província (Sob Consulta)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#17191C] mb-1.5">
                  Município / Zona <span className="text-red-500">*</span>
                </label>
                {zonesForProvince.length > 0 ? (
                  <select
                    value={municipality}
                    onChange={(e) => setMunicipality(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm rounded-md border border-[#E4E4E7] bg-white focus:outline-none focus:ring-2 focus:ring-[#C6A66B]/50 focus:border-[#C6A66B]"
                  >
                    {zonesForProvince.map((zone) => (
                      <option key={zone.id} value={zone.municipality}>
                        {zone.zoneName} ({formatKz(zone.fee)} Kz)
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    required
                    placeholder="Indica o teu município"
                    value={municipality}
                    onChange={(e) => setMunicipality(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm rounded-md border border-[#E4E4E7] focus:outline-none focus:ring-2 focus:ring-[#C6A66B]/50 focus:border-[#C6A66B]"
                  />
                )}
              </div>
            </div>

            {/* Neighborhood */}
            <div>
              <label className="block text-xs font-semibold text-[#17191C] mb-1.5">
                Bairro <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="Ex: Maianga, Talatona, Benfica, Kilamba, Alvalade"
                value={neighborhood}
                onChange={(e) => setNeighborhood(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm rounded-md border border-[#E4E4E7] focus:outline-none focus:ring-2 focus:ring-[#C6A66B]/50 focus:border-[#C6A66B]"
              />
            </div>

            {/* Address & Reference */}
            <div>
              <label className="block text-xs font-semibold text-[#17191C] mb-1.5">
                Endereço Completo (Rua / Condomínio / Casa) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="Ex: Rua Direita, Edifício Solar, Apt 3B"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm rounded-md border border-[#E4E4E7] focus:outline-none focus:ring-2 focus:ring-[#C6A66B]/50 focus:border-[#C6A66B]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#17191C] mb-1.5">
                Ponto de Referência <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="Ex: Próximo à bomba da Sonangol, em frente ao supermercado Kero"
                value={referencePoint}
                onChange={(e) => setReferencePoint(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm rounded-md border border-[#E4E4E7] focus:outline-none focus:ring-2 focus:ring-[#C6A66B]/50 focus:border-[#C6A66B]"
              />
            </div>

            {/* Optional Notes */}
            <div>
              <label className="block text-xs font-semibold text-[#17191C] mb-1.5">
                Observações para a Entrega (Opcional)
              </label>
              <textarea
                rows={2}
                placeholder="Ex: Ligar 15 minutos antes de chegar"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm rounded-md border border-[#E4E4E7] focus:outline-none focus:ring-2 focus:ring-[#C6A66B]/50 focus:border-[#C6A66B]"
              />
            </div>

            {/* Payment Methods */}
            <div className="pt-4 border-t border-[#E4E4E7] space-y-3">
              <h3 className="text-sm font-bold uppercase tracking-wider text-[#17191C]">
                2. Método de Pagamento
              </h3>

              <div className="space-y-3">
                {/* 1. Cash on Delivery */}
                <label
                  className={`block p-4 rounded-lg border transition-all cursor-pointer ${
                    paymentMethod === 'cash_on_delivery'
                      ? 'border-[#C6A66B] bg-[#C6A66B]/5'
                      : 'border-[#E4E4E7] hover:border-slate-300'
                  } ${province !== 'Luanda' ? 'opacity-50 pointer-events-none' : ''}`}
                >
                  <div className="flex items-start gap-3">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cash_on_delivery"
                      checked={paymentMethod === 'cash_on_delivery'}
                      onChange={() => setPaymentMethod('cash_on_delivery')}
                      disabled={province !== 'Luanda'}
                      className="mt-1 text-[#C6A66B] focus:ring-[#C6A66B]"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Banknote className="w-4 h-4 text-[#C6A66B]" />
                        <span className="text-sm font-semibold text-[#17191C]">
                          Pagamento na Entrega (TPA Multicaixa ou Dinheiro em Luanda)
                        </span>
                      </div>
                      <p className="text-xs text-[#52525B] mt-1">
                        Paga no teu endereço apenas ao receber o produto em mão.
                      </p>
                    </div>
                  </div>
                </label>

                {/* 2. Bank Transfer */}
                <label
                  className={`block p-4 rounded-lg border transition-all cursor-pointer ${
                    paymentMethod === 'bank_transfer'
                      ? 'border-[#C6A66B] bg-[#C6A66B]/5'
                      : 'border-[#E4E4E7] hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="bank_transfer"
                      checked={paymentMethod === 'bank_transfer'}
                      onChange={() => setPaymentMethod('bank_transfer')}
                      className="mt-1 text-[#C6A66B] focus:ring-[#C6A66B]"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-[#C6A66B]" />
                        <span className="text-sm font-semibold text-[#17191C]">
                          Transferência Bancária / Multicaixa Express (BAI / BFA)
                        </span>
                      </div>
                      <p className="text-xs text-[#52525B] mt-1">
                        Recebes as contas oficiais da LUMORA para transferência e envias o comprovativo.
                      </p>
                    </div>
                  </div>
                </label>

                {/* 3. Stripe Online Payment */}
                <label
                  className={`block p-4 rounded-lg border transition-all cursor-pointer ${
                    paymentMethod === 'stripe'
                      ? 'border-[#C6A66B] bg-[#C6A66B]/5'
                      : 'border-[#E4E4E7] hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="stripe"
                      checked={paymentMethod === 'stripe'}
                      onChange={() => setPaymentMethod('stripe')}
                      className="mt-1 text-[#C6A66B] focus:ring-[#C6A66B]"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <CreditCard className="w-4 h-4 text-[#C6A66B]" />
                        <span className="text-sm font-semibold text-[#17191C]">
                          Cartão de Crédito / Débito (Stripe API)
                        </span>
                        <span className="text-[10px] uppercase font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                          Visa / Mastercard
                        </span>
                      </div>
                      <p className="text-xs text-[#52525B] mt-1">
                        Processamento imediato com cartão através da plataforma global Stripe.
                      </p>
                    </div>
                  </div>
                </label>

                {/* Stripe Card Entry Fields if selected */}
                {paymentMethod === 'stripe' && (
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-3 text-xs animate-in fade-in duration-150">
                    <div className="flex items-center justify-between text-[#71717A] pb-1 border-b border-slate-200">
                      <span className="font-semibold text-[#17191C]">Dados do Cartão (Stripe)</span>
                      <div className="flex items-center gap-1 text-[11px] text-emerald-700">
                        <Lock className="w-3.5 h-3.5" />
                        <span>Criptografia 256-bit</span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-[#17191C] mb-1">
                        Número do Cartão
                      </label>
                      <input
                        type="text"
                        placeholder="4242 4242 4242 4242"
                        value={cardNumber}
                        onChange={handleCardNumberChange}
                        className="w-full px-3 py-2 bg-white rounded border border-[#E4E4E7] font-mono text-sm"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-semibold text-[#17191C] mb-1">
                          Validade (MM/AA)
                        </label>
                        <input
                          type="text"
                          placeholder="12/28"
                          value={cardExpiry}
                          onChange={handleExpiryChange}
                          className="w-full px-3 py-2 bg-white rounded border border-[#E4E4E7] font-mono text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-[#17191C] mb-1">
                          CVC / CVV
                        </label>
                        <input
                          type="password"
                          maxLength={4}
                          placeholder="123"
                          value={cardCvc}
                          onChange={(e) => setCardCvc(e.target.value.replace(/\D/g, ''))}
                          className="w-full px-3 py-2 bg-white rounded border border-[#E4E4E7] font-mono text-sm"
                        />
                      </div>
                    </div>

                    <div className="text-[11px] text-[#71717A] pt-1">
                      O valor da encomenda será liquidado em segurança via Stripe API.
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Order Summary & Confirmation Box */}
          <div className="lg:col-span-5 sticky top-24 space-y-4">
            <div className="bg-[#17191C] text-[#F8F8F6] p-6 rounded-xl border border-white/10 shadow-lg space-y-6">
              <h3 className="text-base font-bold font-display text-[#F8F8F6] border-b border-white/10 pb-3 flex items-center justify-between">
                <span>Resumo da Encomenda</span>
                <span className="text-xs font-mono text-[#C6A66B]">Angola (Kz)</span>
              </h3>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="font-medium text-[#F8F8F6]">LUMORA Luminária LED</span>
                    <span className="block text-xs text-[#F8F8F6]/60">
                      {quantity} x {formatKz(unitPrice)} Kz
                    </span>
                  </div>
                  <span className="font-mono font-semibold tabular-nums">
                    {formatKz(subtotal)} Kz
                  </span>
                </div>

                <div className="flex justify-between items-center text-xs text-[#F8F8F6]/80 pt-2 border-t border-white/10">
                  <div className="flex items-center gap-1.5">
                    <Truck className="w-3.5 h-3.5 text-[#C6A66B]" />
                    <span>Taxa de Entrega ({currentZone?.zoneName || province}):</span>
                  </div>
                  <span className="font-mono font-medium tabular-nums">
                    {formatKz(deliveryFee)} Kz
                  </span>
                </div>

                {currentZone && (
                  <div className="text-[11px] text-[#C6A66B] flex items-center gap-1">
                    <span>Prazo estimado: {currentZone.estimatedTime}</span>
                  </div>
                )}

                <div className="pt-3 border-t border-white/15 flex justify-between items-baseline">
                  <div>
                    <span className="text-sm font-semibold uppercase tracking-wider text-[#F8F8F6]">
                      Total Final
                    </span>
                    <span className="block text-[11px] text-[#F8F8F6]/60">
                      (Produto + Custo de Entrega)
                    </span>
                  </div>
                  <span className="text-2xl font-bold font-display text-[#C6A66B] font-mono tabular-nums">
                    {formatKz(total)} Kz
                  </span>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting || stripeProcessing}
                className="w-full py-4 text-xs font-bold uppercase tracking-wider text-[#17191C] bg-[#C6A66B] hover:bg-[#d8b87c] active:scale-[0.98] transition-all rounded-md shadow-md disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2"
              >
                {stripeProcessing ? (
                  <span>A Processar Pagamento Stripe...</span>
                ) : isSubmitting ? (
                  <span>A Registar Encomenda...</span>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    <span>
                      {paymentMethod === 'stripe' ? 'Pagar com Cartão' : 'Confirmar Encomenda'} (
                      {formatKz(total)} Kz)
                    </span>
                  </>
                )}
              </button>

              <div className="text-[11px] text-[#F8F8F6]/60 space-y-1.5 text-center">
                <p>🔒 Transacção e dados de entrega protegidos.</p>
                <p>Recebes confirmação imediata e acompanhamento da encomenda.</p>
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg border border-[#E4E4E7] text-xs text-[#52525B] flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-[#C6A66B] shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-[#17191C] block">Suporte Angolano</span>
                Qualquer questão sobre a tua encomenda em Luanda ou províncias, poderás falar directamente com a nossa equipa.
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
