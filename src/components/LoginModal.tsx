import React, { useState } from 'react';
import { adminLogin, trackOrder } from '../services/api';
import {
  Lock,
  X,
  AlertCircle,
  Eye,
  EyeOff,
  Search,
  Package,
  CheckCircle,
  Truck,
  ShieldCheck,
  Info
} from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onAdminLoginSuccess: (token: string) => void;
  onClose: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onAdminLoginSuccess,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<'customer' | 'admin'>('customer');

  // Customer order tracking state
  const [searchQuery, setSearchQuery] = useState('');
  const [trackingLoading, setTrackingLoading] = useState(false);
  const [trackedOrder, setTrackedOrder] = useState<any | null>(null);
  const [trackingError, setTrackingError] = useState<string | null>(null);

  // Admin login state
  const [passcode, setPasscode] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [adminLoading, setAdminLoading] = useState(false);
  const [adminError, setAdminError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleTrackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTrackingError(null);
    setTrackedOrder(null);
    if (!searchQuery.trim()) return;

    setTrackingLoading(true);
    try {
      const data = await trackOrder(searchQuery.trim());
      setTrackedOrder(data);
    } catch (err: any) {
      setTrackingError(err.message || 'Nenhuma encomenda encontrada com estes dados.');
    } finally {
      setTrackingLoading(false);
    }
  };

  const handleAdminSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdminError(null);
    setAdminLoading(true);

    try {
      const res = await adminLogin(passcode);
      onAdminLoginSuccess(res.token);
      setPasscode('');
    } catch (err: any) {
      setAdminError('Senha incorreta. Tente novamente.');
    } finally {
      setAdminLoading(false);
    }
  };

  const formatKz = (val: number) => new Intl.NumberFormat('pt-AO').format(val);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#17191C] text-[#F8F8F6] rounded-2xl max-w-md w-full border border-white/10 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Top Header */}
        <div className="p-6 border-b border-white/10 relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-1.5 text-white/50 hover:text-white rounded hover:bg-white/10 transition-colors"
            aria-label="Fechar"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-[#C6A66B]" />
            <span className="text-xs uppercase tracking-widest text-[#C6A66B] font-mono">
              LUMORA Angola
            </span>
          </div>

          <h3 className="text-xl font-bold font-display text-white">
            {activeTab === 'customer' ? 'Acompanhar Encomenda' : 'Acesso de Gestão'}
          </h3>
          <p className="text-xs text-white/60 mt-1">
            {activeTab === 'customer'
              ? 'Não precisas de login para comprar. Consulta aqui o teu pedido feito na loja.'
              : 'Autenticação obrigatória para administração de pedidos, produtos e stock.'}
          </p>

          {/* Tab Selector */}
          <div className="mt-5 grid grid-cols-2 p-1 bg-white/5 rounded-lg border border-white/10 text-xs font-semibold">
            <button
              type="button"
              onClick={() => {
                setActiveTab('customer');
                setAdminError(null);
              }}
              className={`py-2 rounded-md transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'customer'
                  ? 'bg-[#C6A66B] text-[#17191C] shadow-sm'
                  : 'text-white/70 hover:text-white'
              }`}
            >
              <Package className="w-3.5 h-3.5" />
              <span>Consultar Pedido</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab('admin');
                setTrackingError(null);
              }}
              className={`py-2 rounded-md transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'admin'
                  ? 'bg-[#C6A66B] text-[#17191C] shadow-sm'
                  : 'text-white/70 hover:text-white'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Painel Admin</span>
            </button>
          </div>
        </div>

        {/* Tab 1: Customer Order Tracking (No password needed) */}
        {activeTab === 'customer' && (
          <div className="p-6 space-y-4">
            <div className="p-3 bg-white/5 border border-white/10 rounded-lg text-xs text-white/75 flex items-start gap-2.5">
              <Info className="w-4 h-4 text-[#C6A66B] shrink-0 mt-0.5" />
              <span>
                As compras na LUMORA não exigem palavra-passe. Basta indicares o código que recebeste (ex: <strong>LMR-10492</strong>) ou o teu telefone.
              </span>
            </div>

            <form onSubmit={handleTrackSubmit} className="space-y-3">
              <label className="block text-xs font-semibold text-white/80">
                Código da Encomenda ou Telefone
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="Ex: LMR-10492 ou 923 112 233"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-3.5 pr-10 py-2.5 bg-white/5 border border-white/15 rounded-md text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#C6A66B]"
                />
                <button
                  type="submit"
                  disabled={trackingLoading}
                  className="absolute right-2 top-2 p-1 text-[#C6A66B] hover:text-white"
                  title="Pesquisar"
                >
                  <Search className="w-4 h-4" />
                </button>
              </div>

              <button
                type="submit"
                disabled={trackingLoading}
                className="w-full py-2.5 text-xs font-bold uppercase tracking-wider text-[#17191C] bg-[#C6A66B] hover:bg-[#d8b87c] active:scale-[0.98] transition-all rounded-md shadow-md disabled:opacity-50"
              >
                {trackingLoading ? 'A consultar...' : 'Ver Estado do Pedido'}
              </button>
            </form>

            {trackingError && (
              <div className="p-3 bg-red-950/50 border border-red-800/80 rounded text-xs text-red-200 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                <span>{trackingError}</span>
              </div>
            )}

            {trackedOrder && (
              <div className="p-4 bg-white/5 border border-white/10 rounded-xl space-y-3 text-xs animate-in fade-in duration-200">
                <div className="flex justify-between items-start pb-2 border-b border-white/10">
                  <div>
                    <span className="font-mono font-bold text-sm text-[#C6A66B] block">
                      {trackedOrder.id}
                    </span>
                    <span className="text-[11px] text-white/60">
                      Cliente: {trackedOrder.customerName}
                    </span>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-white/10 text-white font-mono">
                    {formatKz(trackedOrder.total)} Kz
                  </span>
                </div>

                <div className="space-y-1.5 text-white/80 text-[11px]">
                  <div>
                    <strong>Localidade:</strong> {trackedOrder.municipality}, {trackedOrder.province}
                  </div>
                  <div>
                    <strong>Estado da Encomenda:</strong>{' '}
                    <span className="text-[#C6A66B] font-semibold uppercase">
                      {trackedOrder.orderStatus}
                    </span>
                  </div>
                  <div>
                    <strong>Pagamento:</strong>{' '}
                    <span className="capitalize">{trackedOrder.paymentStatus}</span>
                  </div>
                </div>

                {trackedOrder.history && trackedOrder.history.length > 0 && (
                  <div className="pt-2 border-t border-white/10 space-y-1">
                    <span className="text-[10px] uppercase tracking-wider text-white/50 block font-semibold">
                      Último Registo
                    </span>
                    <div className="text-[11px] text-white/90">
                      {trackedOrder.history[trackedOrder.history.length - 1].action}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Admin Authentication (Strictly for manager) */}
        {activeTab === 'admin' && (
          <div className="p-6 space-y-4">
            <div className="p-3 bg-amber-950/40 border border-amber-800/50 rounded-lg text-xs text-amber-200 flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-[#C6A66B] shrink-0 mt-0.5" />
              <span>
                Área reservada exclusivamente aos gestores da loja para controlo de stock, preços, zonas de entrega e validação de transferências.
              </span>
            </div>

            {adminError && (
              <div className="p-3 bg-red-950/50 border border-red-800/80 rounded text-xs text-red-200 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                <span>{adminError}</span>
              </div>
            )}

            <form onSubmit={handleAdminSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-white/80 mb-1.5">
                  Palavra-passe de Administrador
                </label>
                <div className="relative">
                  <input
                    type={showPass ? 'text' : 'password'}
                    required
                    placeholder="Introduza a sua senha"
                    value={passcode}
                    onChange={(e) => setPasscode(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white/5 border border-white/15 rounded-md text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#C6A66B] pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-2.5 top-2.5 text-white/50 hover:text-white"
                  >
                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={adminLoading}
                className="w-full py-3 text-xs font-bold uppercase tracking-wider text-[#17191C] bg-[#C6A66B] hover:bg-[#d8b87c] active:scale-[0.98] transition-all rounded-md shadow-md disabled:opacity-50"
              >
                {adminLoading ? 'A verificar...' : 'Entrar na Gestão'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
