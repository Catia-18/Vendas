import React, { useState } from 'react';
import { OrderConfirmationResult } from '../types';
import {
  CheckCircle2,
  Copy,
  Check,
  MessageCircle,
  Truck,
  CreditCard,
  Building2,
  X
} from 'lucide-react';

interface OrderConfirmationModalProps {
  result: OrderConfirmationResult | null;
  whatsappNumber: string;
  onClose: () => void;
}

export const OrderConfirmationModal: React.FC<OrderConfirmationModalProps> = ({
  result,
  whatsappNumber,
  onClose
}) => {
  if (!result) return null;

  const { order, whatsappMessage, bankTransferDetails } = result;
  const [copiedIban, setCopiedIban] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);

  const formatKz = (val: number) => new Intl.NumberFormat('pt-AO').format(val);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    if (id === 'code') {
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    } else {
      setCopiedIban(id);
      setTimeout(() => setCopiedIban(null), 2000);
    }
  };

  const whatsappHref = `https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}?text=${whatsappMessage}`;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full border border-[#E4E4E7] shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-[#17191C] text-[#F8F8F6] p-6 sm:p-8 relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 text-white/70 hover:text-white rounded-md hover:bg-white/10 transition-colors"
            aria-label="Fechar"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-[#C6A66B]/20 text-[#C6A66B] flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-[#C6A66B]">
                Encomenda Registada com Sucesso
              </span>
              <h2 className="text-xl sm:text-2xl font-bold font-display text-[#F8F8F6]">
                Obrigado pela tua compra, {order.customerName.split(' ')[0]}!
              </h2>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-[#F8F8F6]/75 mt-2">
            A tua encomenda foi guardada de forma segura na nossa base de dados.
          </p>

          {/* Unique Order Code Box */}
          <div className="mt-5 p-3.5 bg-white/5 border border-white/15 rounded-lg flex items-center justify-between">
            <div>
              <span className="text-[11px] uppercase tracking-wider text-[#F8F8F6]/60 block">
                Código Único da Encomenda
              </span>
              <span className="text-lg sm:text-xl font-bold font-mono text-[#C6A66B] tracking-wider">
                {order.id}
              </span>
            </div>

            <button
              onClick={() => copyToClipboard(order.id, 'code')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-white/10 hover:bg-white/20 text-[#F8F8F6] rounded transition-colors"
            >
              {copiedCode ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Copiado!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copiar</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 space-y-6 text-[#17191C]">
          {/* Order Details Grid */}
          <div className="bg-[#F8F8F6] p-4 rounded-xl border border-[#E4E4E7] space-y-3 text-xs sm:text-sm">
            <div className="flex justify-between items-center pb-2 border-b border-[#E4E4E7]">
              <span className="text-[#71717A]">Produto:</span>
              <span className="font-semibold text-[#17191C]">
                Luminária LED Recarregável ({order.quantity}x)
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-[#71717A]">Subtotal:</span>
              <span className="font-mono tabular-nums">{formatKz(order.subtotal)} Kz</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-[#71717A]">Custo de Entrega ({order.municipality}):</span>
              <span className="font-mono tabular-nums">{formatKz(order.deliveryFee)} Kz</span>
            </div>

            <div className="flex justify-between items-center pt-2 border-t border-[#E4E4E7] text-base font-bold">
              <span>Total da Encomenda:</span>
              <span className="font-mono text-[#17191C] tabular-nums text-lg">
                {formatKz(order.total)} Kz
              </span>
            </div>

            <div className="pt-2 border-t border-[#E4E4E7] text-xs text-[#52525B]">
              <span className="font-semibold text-[#17191C] block">Endereço de Entrega:</span>
              <span>
                {order.address}, Bairro {order.neighborhood}, {order.municipality}, {order.province}
              </span>
              <div className="text-[#71717A] mt-0.5">
                Ref: {order.referencePoint}
              </div>
            </div>
          </div>

          {/* Payment Specific Instructions */}
          {order.paymentMethod === 'bank_transfer' ? (
            <div className="bg-amber-50/70 border border-amber-200 p-5 rounded-xl space-y-4">
              <div className="flex items-center gap-2 text-amber-900 font-semibold text-sm">
                <Building2 className="w-4 h-4 text-[#C6A66B]" />
                <span>Instruções para Transferência Bancária / Multicaixa Express</span>
              </div>

              <p className="text-xs text-amber-900/80 leading-relaxed">
                Por favor efectua a transferência do valor total (
                <strong className="font-mono">{formatKz(order.total)} Kz</strong>) para uma das
                contas oficiais da LUMORA:
              </p>

              <div className="space-y-3">
                {(bankTransferDetails?.accounts || []).map((acc) => (
                  <div
                    key={acc.id}
                    className="p-3 bg-white rounded-lg border border-amber-200/80 text-xs space-y-1.5"
                  >
                    <div className="flex justify-between items-center font-semibold text-[#17191C]">
                      <span>{acc.bank}</span>
                      <button
                        type="button"
                        onClick={() => copyToClipboard(acc.iban, acc.id)}
                        className="text-[11px] text-[#C6A66B] hover:underline flex items-center gap-1"
                      >
                        {copiedIban === acc.id ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-600" />
                            <span>IBAN Copiado</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Copiar IBAN</span>
                          </>
                        )}
                      </button>
                    </div>
                    <div className="text-[#52525B]">Titular: {acc.holder}</div>
                    <div className="font-mono text-[#17191C] font-medium tracking-wide break-all">
                      IBAN: {acc.iban}
                    </div>
                  </div>
                ))}
              </div>

              <div className="text-xs text-amber-900/90 font-medium bg-amber-100/60 p-3 rounded-lg">
                ⚠️ Importante: Coloca o código <span className="font-mono font-bold">{order.id}</span>{' '}
                na descrição da transferência e envia o comprovativo no WhatsApp da loja.
              </div>
            </div>
          ) : (
            <div className="bg-blue-50/70 border border-blue-200 p-5 rounded-xl space-y-2">
              <div className="flex items-center gap-2 text-blue-900 font-semibold text-sm">
                <Truck className="w-4 h-4 text-blue-700" />
                <span>Pagamento na Recepção da Encomenda</span>
              </div>
              <p className="text-xs text-blue-900/80 leading-relaxed">
                A tua encomenda está com o estado <strong>Aguardando Confirmação</strong>. O nosso
                estafeta entrará em contacto para o número <strong>{order.customerPhone}</strong>{' '}
                antes da entrega. Podes pagar no momento por <strong>TPA Multicaixa</strong> ou em{' '}
                <strong>dinheiro</strong> no valor exacto de {formatKz(order.total)} Kz.
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row gap-3">
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 py-3.5 px-4 text-xs font-bold uppercase tracking-wider text-white bg-[#25D366] hover:bg-[#20ba59] active:scale-[0.98] transition-all rounded-md shadow-sm flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Contactar Loja no WhatsApp</span>
            </a>

            <button
              onClick={onClose}
              className="py-3.5 px-6 text-xs font-semibold uppercase tracking-wider text-[#17191C] bg-[#F8F8F6] hover:bg-slate-200 transition-colors rounded-md border border-[#E4E4E7]"
            >
              Fechar Resumo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
