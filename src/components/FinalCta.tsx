import React from 'react';
import { Product } from '../types';
import { ArrowDown, Sparkles } from 'lucide-react';

interface FinalCtaProps {
  product: Product | null;
  onNavigateToCheckout: () => void;
}

export const FinalCta: React.FC<FinalCtaProps> = ({ product, onNavigateToCheckout }) => {
  const formattedPrice = product
    ? new Intl.NumberFormat('pt-AO').format(product.price)
    : '29.900';

  return (
    <section className="py-20 bg-[#17191C] text-[#F8F8F6] relative overflow-hidden border-b border-white/10">
      <div className="absolute inset-0 bg-radial from-[#C6A66B]/10 to-transparent pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-6">
        <span className="text-xs font-semibold uppercase tracking-wider text-[#C6A66B] block">
          LUMORA · Angola
        </span>

        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-display tracking-tight text-[#F8F8F6] text-balance">
          Leva uma iluminação mais prática para o teu espaço.
        </h2>

        <p className="text-base sm:text-lg text-[#F8F8F6]/80 max-w-2xl mx-auto leading-relaxed">
          Instalação imediata sem furos nem obras. Experimenta a conveniência do sensor de movimento
          no teu armário, roupeiro ou corredor.
        </p>

        <div className="pt-4 flex flex-col items-center gap-4">
          <div className="flex items-baseline gap-2">
            <span className="text-xs uppercase tracking-wider text-[#F8F8F6]/60">Apenas</span>
            <span className="text-3xl sm:text-4xl font-bold font-display text-[#F8F8F6] font-mono tabular-nums">
              {formattedPrice} Kz
            </span>
            <span className="text-xs text-[#F8F8F6]/60">/ unidade</span>
          </div>

          <button
            onClick={onNavigateToCheckout}
            className="inline-flex justify-center items-center gap-2 px-10 py-4.5 text-xs font-bold uppercase tracking-wider text-[#17191C] bg-[#C6A66B] hover:bg-[#d8b87c] active:scale-[0.98] transition-all rounded-md shadow-xl shadow-[#C6A66B]/20"
          >
            Encomendar Agora
            <ArrowDown className="w-4 h-4" />
          </button>
        </div>

        <div className="pt-2 text-xs text-[#F8F8F6]/60 flex items-center justify-center gap-4 flex-wrap">
          <span>✓ Pagamento na Entrega (Luanda)</span>
          <span aria-hidden="true">·</span>
          <span>✓ Transferência Bancária (BAI / BFA)</span>
          <span aria-hidden="true">·</span>
          <span>✓ Stock em Luanda</span>
        </div>
      </div>
    </section>
  );
};
