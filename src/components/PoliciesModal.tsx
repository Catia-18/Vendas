import React from 'react';
import { StorePolicies } from '../types';
import { X, ShieldAlert, FileText, Truck, RotateCcw } from 'lucide-react';

interface PoliciesModalProps {
  policyKey: 'terms' | 'privacy' | 'delivery' | 'returns' | null;
  policies?: StorePolicies;
  onClose: () => void;
}

export const PoliciesModal: React.FC<PoliciesModalProps> = ({
  policyKey,
  policies,
  onClose
}) => {
  if (!policyKey) return null;

  const titles: Record<string, { title: string; icon: any; content: string }> = {
    terms: {
      title: 'Termos e Condições Comerciais',
      icon: FileText,
      content:
        policies?.terms ||
        'Ao submeter uma encomenda na LUMORA, o cliente aceita as condições de entrega, confirmação telefónica e pagamento no acto da entrega ou via transferência bancária.'
    },
    privacy: {
      title: 'Política de Privacidade e Dados',
      icon: ShieldAlert,
      content:
        policies?.privacy ||
        'A LUMORA trata os dados pessoais dos clientes (nome, contacto telefónico e morada) de forma estritamente confidencial, usando-os exclusivamente para a expedição e contacto sobre as encomendas.'
    },
    delivery: {
      title: 'Política de Entrega e Prazos',
      icon: Truck,
      content:
        policies?.delivery ||
        'As entregas na província de Luanda são coordenadas via estafeta próprio com prazo habitual de 24h a 48h úteis. Para outras províncias, o transporte é efetuado através de transportadora autorizada parceira.'
    },
    returns: {
      title: 'Política de Trocas e Devoluções',
      icon: RotateCcw,
      content:
        policies?.returns ||
        'Em caso de anomalia de fabrico comprovada na recepção, a LUMORA assegura a troca da luminária no prazo de 7 dias úteis, com o produto preservado na embalagem original.'
    }
  };

  const item = titles[policyKey];
  const Icon = item.icon;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-lg w-full border border-[#E4E4E7] shadow-xl overflow-hidden p-6 sm:p-8 space-y-5 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between pb-3 border-b border-[#E4E4E7]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-md bg-[#17191C] text-[#C6A66B] flex items-center justify-center">
              <Icon className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold font-display text-[#17191C]">{item.title}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#71717A] hover:text-[#17191C] rounded hover:bg-slate-100 transition-colors"
            aria-label="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="text-xs sm:text-sm text-[#52525B] leading-relaxed whitespace-pre-line space-y-3">
          <p>{item.content}</p>
        </div>

        <div className="pt-3 border-t border-[#E4E4E7] flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-semibold uppercase tracking-wider text-white bg-[#17191C] hover:bg-black rounded-md transition-colors"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
};
