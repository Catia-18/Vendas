import React, { useState } from 'react';
import { adminLogin } from '../../services/api';
import { Lock, X, AlertCircle, Eye, EyeOff } from 'lucide-react';

interface AdminLoginModalProps {
  isOpen: boolean;
  onSuccess: (token: string) => void;
  onClose: () => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onSuccess,
  onClose
}) => {
  const [passcode, setPasscode] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await adminLogin(passcode);
      onSuccess(res.token);
      setPasscode('');
    } catch (err: any) {
      setError('Senha incorreta. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#17191C] text-[#F8F8F6] rounded-xl max-w-sm w-full border border-white/10 shadow-2xl p-6 sm:p-7 relative animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-white/50 hover:text-white rounded hover:bg-white/10 transition-colors"
          aria-label="Fechar"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-[#C6A66B]/20 text-[#C6A66B] flex items-center justify-center border border-[#C6A66B]/30">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold font-display text-[#F8F8F6]">Painel LUMORA</h3>
            <span className="text-xs text-[#F8F8F6]/60">Área de Gestão & Controlo</span>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-950/50 border border-red-800/80 rounded text-xs text-red-200 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#F8F8F6]/80 mb-1.5">
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
            disabled={loading}
            className="w-full py-3 text-xs font-bold uppercase tracking-wider text-[#17191C] bg-[#C6A66B] hover:bg-[#d8b87c] active:scale-[0.98] transition-all rounded-md shadow-md disabled:opacity-50"
          >
            {loading ? 'A validar...' : 'Entrar no Painel'}
          </button>
        </form>
      </div>
    </div>
  );
};
