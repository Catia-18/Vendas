import React, { useState } from 'react';
import { StoreSettings, BankAccount, FAQItem } from '../../types';
import { updateAdminSettings } from '../../services/api';
import {
  Save,
  Plus,
  Trash2,
  CheckCircle,
  Building2,
  MessageCircle,
  HelpCircle,
  FileText,
  Lock,
  CreditCard,
  Key
} from 'lucide-react';

interface AdminSettingsProps {
  token: string;
  settings: StoreSettings;
  onSettingsUpdated: (settings: StoreSettings) => void;
}

export const AdminSettings: React.FC<AdminSettingsProps> = ({
  token,
  settings,
  onSettingsUpdated
}) => {
  const [brandName, setBrandName] = useState(settings.brandName);
  const [slogan, setSlogan] = useState(settings.slogan);
  const [whatsappNumber, setWhatsappNumber] = useState(settings.whatsappNumber);
  const [whatsappDisplay, setWhatsappDisplay] = useState(settings.whatsappDisplay);
  const [email, setEmail] = useState(settings.email);

  // Stripe config
  const [stripeEnabled, setStripeEnabled] = useState(settings.stripeConfig?.enabled !== false);
  const [stripePublishableKey, setStripePublishableKey] = useState(
    settings.stripeConfig?.publishableKey || 'pk_test_51URbpVK5OaHHhzp50Sgkh7Etx'
  );
  const [stripeSecretKey, setStripeSecretKey] = useState(
    settings.stripeConfig?.secretKey || 'sk_test_51URbpVK'
  );
  const [stripeCurrency, setStripeCurrency] = useState(settings.stripeConfig?.currency || 'usd');

  // Bank accounts
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>(
    settings.paymentMethods?.bank_transfer?.accounts || []
  );
  const [transferInstructions, setTransferInstructions] = useState(
    settings.paymentMethods?.bank_transfer?.instructions || ''
  );

  // FAQs
  const [faqs, setFaqs] = useState<FAQItem[]>(settings.faqs || []);

  // Policies
  const [terms, setTerms] = useState(settings.policies?.terms || '');
  const [privacy, setPrivacy] = useState(settings.policies?.privacy || '');
  const [deliveryPolicy, setDeliveryPolicy] = useState(settings.policies?.delivery || '');
  const [returnsPolicy, setReturnsPolicy] = useState(settings.policies?.returns || '');

  // Passcode change
  const [adminPasscode, setAdminPasscode] = useState('');

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  // Add Bank Account
  const handleAddAccount = () => {
    const newAcc: BankAccount = {
      id: `acc-${Date.now()}`,
      bank: 'Banco Angolano (BAI / BFA / BIC)',
      holder: brandName,
      iban: 'AO06 ...',
      accountNumber: ''
    };
    setBankAccounts([...bankAccounts, newAcc]);
  };

  const handleUpdateAccount = (idx: number, field: keyof BankAccount, val: string) => {
    const copy = [...bankAccounts];
    copy[idx] = { ...copy[idx], [field]: val };
    setBankAccounts(copy);
  };

  const handleRemoveAccount = (idx: number) => {
    setBankAccounts(bankAccounts.filter((_, i) => i !== idx));
  };

  // Add FAQ
  const handleAddFaq = () => {
    const newFaq: FAQItem = {
      id: `faq-${Date.now()}`,
      question: 'Nova Pergunta?',
      answer: 'Resposta detalhada aqui.',
      order: faqs.length + 1
    };
    setFaqs([...faqs, newFaq]);
  };

  const handleUpdateFaq = (idx: number, field: keyof FAQItem, val: any) => {
    const copy = [...faqs];
    copy[idx] = { ...copy[idx], [field]: val };
    setFaqs(copy);
  };

  const handleRemoveFaq = (idx: number) => {
    setFaqs(faqs.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      const payload: any = {
        brandName,
        slogan,
        whatsappNumber,
        whatsappDisplay,
        email,
        stripeConfig: {
          enabled: stripeEnabled,
          publishableKey: stripePublishableKey.trim(),
          secretKey: stripeSecretKey.trim(),
          currency: stripeCurrency
        },
        paymentMethods: {
          ...settings.paymentMethods,
          bank_transfer: {
            ...settings.paymentMethods.bank_transfer,
            accounts: bankAccounts,
            instructions: transferInstructions
          },
          stripe: {
            id: 'stripe',
            name: 'Cartão de Débito / Crédito (Stripe)',
            enabled: stripeEnabled,
            description: 'Pagamentos internacionais seguros com Visa, Mastercard e outros cartões.'
          }
        },
        faqs,
        policies: {
          terms,
          privacy,
          delivery: deliveryPolicy,
          returns: returnsPolicy
        }
      };

      if (adminPasscode.trim().length >= 4) {
        payload.adminPasscode = adminPasscode.trim();
      }

      const res = await updateAdminSettings(token, payload);
      onSettingsUpdated(res.settings);
      setMessage('Configurações actualizadas com sucesso!');
      setAdminPasscode('');
      setTimeout(() => setMessage(null), 3000);
    } catch (err: any) {
      alert(err.message || 'Erro ao guardar configurações');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold font-display text-[#17191C]">
          Configurações Comerciais & Suporte
        </h2>
        <p className="text-xs text-[#71717A]">
          Gere os canais de contacto oficiais, integração da API Stripe, contas bancárias (BAI/BFA), perguntas frequentes e políticas.
        </p>
      </div>

      {message && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-600" />
          <span>{message}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Stripe API Configuration Section */}
        <div className="bg-white p-6 rounded-xl border border-indigo-100 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-[#E4E4E7] pb-2">
            <div className="flex items-center gap-2 text-sm font-bold text-[#17191C]">
              <CreditCard className="w-4 h-4 text-indigo-600" />
              <span>Integração com API Stripe (Pagamento com Cartão)</span>
            </div>

            <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
              <input
                type="checkbox"
                checked={stripeEnabled}
                onChange={(e) => setStripeEnabled(e.target.checked)}
                className="rounded text-indigo-600 focus:ring-indigo-500"
              />
              <span>Ativar Stripe no Checkout</span>
            </label>
          </div>

          <p className="text-xs text-[#71717A]">
            Conecta a tua conta Stripe para receber pagamentos de cartões Visa e Mastercard diretamente na loja.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-[#17191C] mb-1">
                Chave Publicável (Publishable Key)
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="pk_test_..."
                  value={stripePublishableKey}
                  onChange={(e) => setStripePublishableKey(e.target.value)}
                  className="w-full px-3 py-2 rounded border border-[#E4E4E7] font-mono"
                />
              </div>
              <span className="text-[11px] text-[#71717A] mt-1 block">
                Exibida no teu Dashboard Stripe (ex: pk_test_51URbp...)
              </span>
            </div>

            <div>
              <label className="block font-semibold text-[#17191C] mb-1">
                Chave Secreta (Secret Key)
              </label>
              <div className="relative">
                <input
                  type="password"
                  placeholder="sk_test_..."
                  value={stripeSecretKey}
                  onChange={(e) => setStripeSecretKey(e.target.value)}
                  className="w-full px-3 py-2 rounded border border-[#E4E4E7] font-mono"
                />
              </div>
              <span className="text-[11px] text-[#71717A] mt-1 block">
                Mantida em segurança no servidor para processar os pagamentos
              </span>
            </div>
          </div>
        </div>

        {/* Contact & Brand Settings */}
        <div className="bg-white p-6 rounded-xl border border-[#E4E4E7] shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-[#E4E4E7] pb-2 text-sm font-bold text-[#17191C]">
            <MessageCircle className="w-4 h-4 text-[#C6A66B]" />
            <span>Contacto & WhatsApp Oficial</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-[#17191C] mb-1">
                Número do WhatsApp (com indicativo)
              </label>
              <input
                type="text"
                required
                placeholder="+244923456789"
                value={whatsappNumber}
                onChange={(e) => setWhatsappNumber(e.target.value)}
                className="w-full px-3 py-2 rounded border border-[#E4E4E7] font-mono"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#17191C] mb-1">
                Apresentação do Número no Site
              </label>
              <input
                type="text"
                required
                placeholder="+244 923 456 789"
                value={whatsappDisplay}
                onChange={(e) => setWhatsappDisplay(e.target.value)}
                className="w-full px-3 py-2 rounded border border-[#E4E4E7]"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#17191C] mb-1">
                Email de Atendimento
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 rounded border border-[#E4E4E7]"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#17191C] mb-1">
                Nome Oficial da Marca
              </label>
              <input
                type="text"
                value={brandName}
                onChange={(e) => setBrandName(e.target.value)}
                className="w-full px-3 py-2 rounded border border-[#E4E4E7]"
              />
            </div>
          </div>
        </div>

        {/* Bank Accounts Settings */}
        <div className="bg-white p-6 rounded-xl border border-[#E4E4E7] shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-[#E4E4E7] pb-2">
            <div className="flex items-center gap-2 text-sm font-bold text-[#17191C]">
              <Building2 className="w-4 h-4 text-[#C6A66B]" />
              <span>Contas Bancárias de Angola (BAI / BFA)</span>
            </div>

            <button
              type="button"
              onClick={handleAddAccount}
              className="inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold text-[#17191C] bg-[#F8F8F6] hover:bg-slate-200 border border-[#E4E4E7] rounded"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Adicionar Conta</span>
            </button>
          </div>

          <div className="space-y-4">
            {bankAccounts.map((acc, idx) => (
              <div
                key={acc.id || idx}
                className="p-4 bg-[#F8F8F6] rounded-lg border border-[#E4E4E7] grid grid-cols-1 sm:grid-cols-12 gap-3 text-xs items-end"
              >
                <div className="sm:col-span-3">
                  <label className="block font-semibold text-[#17191C] mb-1">Banco</label>
                  <input
                    type="text"
                    value={acc.bank}
                    onChange={(e) => handleUpdateAccount(idx, 'bank', e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-white rounded border border-[#E4E4E7]"
                  />
                </div>

                <div className="sm:col-span-3">
                  <label className="block font-semibold text-[#17191C] mb-1">Titular</label>
                  <input
                    type="text"
                    value={acc.holder}
                    onChange={(e) => handleUpdateAccount(idx, 'holder', e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-white rounded border border-[#E4E4E7]"
                  />
                </div>

                <div className="sm:col-span-5">
                  <label className="block font-semibold text-[#17191C] mb-1">IBAN Completo</label>
                  <input
                    type="text"
                    value={acc.iban}
                    onChange={(e) => handleUpdateAccount(idx, 'iban', e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-white rounded border border-[#E4E4E7] font-mono"
                  />
                </div>

                <div className="sm:col-span-1 flex justify-end">
                  <button
                    type="button"
                    onClick={() => handleRemoveAccount(idx)}
                    className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#17191C] mb-1">
              Instruções de Comprovativo para o Cliente
            </label>
            <textarea
              rows={2}
              value={transferInstructions}
              onChange={(e) => setTransferInstructions(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded border border-[#E4E4E7]"
            />
          </div>
        </div>

        {/* FAQs Editor */}
        <div className="bg-white p-6 rounded-xl border border-[#E4E4E7] shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-[#E4E4E7] pb-2">
            <div className="flex items-center gap-2 text-sm font-bold text-[#17191C]">
              <HelpCircle className="w-4 h-4 text-[#C6A66B]" />
              <span>Perguntas Frequentes (FAQ)</span>
            </div>

            <button
              type="button"
              onClick={handleAddFaq}
              className="inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold text-[#17191C] bg-[#F8F8F6] hover:bg-slate-200 border border-[#E4E4E7] rounded"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Adicionar Pergunta</span>
            </button>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <div
                key={faq.id || idx}
                className="p-3 bg-[#F8F8F6] rounded-lg border border-[#E4E4E7] space-y-2 text-xs"
              >
                <div className="flex items-center justify-between gap-3">
                  <input
                    type="text"
                    value={faq.question}
                    onChange={(e) => handleUpdateFaq(idx, 'question', e.target.value)}
                    className="flex-1 font-semibold text-[#17191C] px-2.5 py-1.5 bg-white rounded border border-[#E4E4E7]"
                    placeholder="Pergunta"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveFaq(idx)}
                    className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <textarea
                  rows={2}
                  value={faq.answer}
                  onChange={(e) => handleUpdateFaq(idx, 'answer', e.target.value)}
                  className="w-full text-[#52525B] px-2.5 py-1.5 bg-white rounded border border-[#E4E4E7]"
                  placeholder="Resposta"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Policies Editor */}
        <div className="bg-white p-6 rounded-xl border border-[#E4E4E7] shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-[#E4E4E7] pb-2 text-sm font-bold text-[#17191C]">
            <FileText className="w-4 h-4 text-[#C6A66B]" />
            <span>Políticas da Loja</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-[#17191C] mb-1">Termos e Condições</label>
              <textarea
                rows={3}
                value={terms}
                onChange={(e) => setTerms(e.target.value)}
                className="w-full px-3 py-2 rounded border border-[#E4E4E7]"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#17191C] mb-1">
                Política de Privacidade
              </label>
              <textarea
                rows={3}
                value={privacy}
                onChange={(e) => setPrivacy(e.target.value)}
                className="w-full px-3 py-2 rounded border border-[#E4E4E7]"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#17191C] mb-1">Política de Entrega</label>
              <textarea
                rows={3}
                value={deliveryPolicy}
                onChange={(e) => setDeliveryPolicy(e.target.value)}
                className="w-full px-3 py-2 rounded border border-[#E4E4E7]"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#17191C] mb-1">
                Trocas e Devoluções
              </label>
              <textarea
                rows={3}
                value={returnsPolicy}
                onChange={(e) => setReturnsPolicy(e.target.value)}
                className="w-full px-3 py-2 rounded border border-[#E4E4E7]"
              />
            </div>
          </div>
        </div>

        {/* Change Admin Passcode */}
        <div className="bg-white p-6 rounded-xl border border-[#E4E4E7] shadow-xs space-y-3">
          <div className="flex items-center gap-2 border-b border-[#E4E4E7] pb-2 text-sm font-bold text-[#17191C]">
            <Lock className="w-4 h-4 text-[#C6A66B]" />
            <span>Segurança: Alterar Palavra-passe de Administrador</span>
          </div>

          <div className="max-w-md text-xs">
            <label className="block font-semibold text-[#17191C] mb-1">
              Nova Palavra-passe (Deixa em branco para manter a actual)
            </label>
            <input
              type="password"
              placeholder="Nova palavra-passe (mínimo 4 caracteres)"
              value={adminPasscode}
              onChange={(e) => setAdminPasscode(e.target.value)}
              className="w-full px-3 py-2 rounded border border-[#E4E4E7]"
            />
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-3 text-xs font-bold uppercase tracking-wider text-[#17191C] bg-[#C6A66B] hover:bg-[#d8b87c] rounded-md transition-all shadow-md flex items-center gap-2 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'A Guardar...' : 'Guardar Configurações Comerciais'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
