import React from 'react';
import { ArrowRight, Truck, ShieldCheck, Zap, Compass, Check } from 'lucide-react';
import { Product, AppTab } from '../types';

interface HeroProps {
  product: Product | null;
  onSelectTab: (tab: AppTab) => void;
}

export const Hero: React.FC<HeroProps> = ({ product, onSelectTab }) => {
  return (
    <section className="relative bg-[#17191C] text-[#F8F8F6] pt-14 pb-20 lg:pt-20 lg:pb-28 overflow-hidden">
      {/* Subtle architectural ambient illumination */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#C6A66B]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Copy & Actions (NO PRICE on main screen as requested) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#C6A66B] uppercase tracking-wider">
              <span>LUMORA</span>
              <span aria-hidden="true">·</span>
              <span>Iluminação Inteligente</span>
              <span aria-hidden="true">·</span>
              <span>Angola</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-display tracking-tight text-[#F8F8F6] leading-[1.15] text-balance">
              Ilumina o teu espaço. Simplifica a tua rotina.
            </h1>

            <p className="text-base sm:text-lg text-[#F8F8F6]/80 max-w-xl leading-relaxed">
              Uma solução de iluminação prática para os espaços da tua casa onde precisas de mais luz.
              Sem fios eléctricos visíveis, sem furos em paredes e com fixação magnética instantânea.
            </p>

            {/* Quality Statement Box (Clean value proposition without price) */}
            <div className="py-4 border-y border-white/10 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-[#F8F8F6]/80">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-[#C6A66B] shrink-0" />
                <span>Sensor inteligente de presença e movimento</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-[#C6A66B] shrink-0" />
                <span>Bateria de longa duração recarregável via USB-C</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-[#C6A66B] shrink-0" />
                <span>Instalação magnética adesiva em segundos</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-[#C6A66B] shrink-0" />
                <span>Entregas coordenadas em Luanda e províncias</span>
              </div>
            </div>

            {/* Navigational CTA cluster to separate sections */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <button
                type="button"
                onClick={() => onSelectTab('product')}
                className="inline-flex justify-center items-center gap-2 px-8 py-4 text-xs font-bold uppercase tracking-wider text-[#17191C] bg-[#C6A66B] hover:bg-[#d8b87c] active:scale-[0.98] transition-all rounded-md shadow-lg shadow-[#C6A66B]/15"
              >
                <span>Conhecer o Produto</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => onSelectTab('checkout')}
                className="inline-flex justify-center items-center px-6 py-4 text-xs font-semibold uppercase tracking-wider text-[#F8F8F6] hover:text-[#C6A66B] border border-white/20 hover:border-[#C6A66B]/50 transition-colors rounded-md"
              >
                Fazer Encomenda
              </button>
            </div>

            {/* Reassurance points */}
            <div className="pt-4 grid grid-cols-3 gap-3 text-xs text-[#F8F8F6]/70">
              <div className="flex items-start gap-2">
                <Truck className="w-4 h-4 text-[#C6A66B] shrink-0 mt-0.5" />
                <span>Entregas rápidas ao domicílio</span>
              </div>
              <div className="flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-[#C6A66B] shrink-0 mt-0.5" />
                <span>Pagamento na entrega ou online</span>
              </div>
              <div className="flex items-start gap-2">
                <Zap className="w-4 h-4 text-[#C6A66B] shrink-0 mt-0.5" />
                <span>Sem obras nem furos em casa</span>
              </div>
            </div>
          </div>

          {/* Right Column: Hero High-Fidelity Showcase */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-[#23272B] aspect-[4/3] sm:aspect-[4/3] lg:aspect-[4/5] flex items-center justify-center group">
              <img
                src={product?.images?.[0] || '/src/assets/images/hero_lumora_wardrobe_1792262010537.jpg'}
                alt="Luminária LED LUMORA instalada num roupeiro moderno"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center group-hover:scale-[1.02] transition-transform duration-700 ease-out"
              />

              {/* Gradient Scrim */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#17191C]/90 via-transparent to-black/10 pointer-events-none" />

              <div className="absolute bottom-4 left-4 right-4 p-4 bg-[#17191C]/85 backdrop-blur-md rounded-xl border border-white/10 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-[#F8F8F6]">Aplicação em Roupeiro & Closet</span>
                  <span className="text-[#C6A66B] font-mono">Modo Inteligente</span>
                </div>
                <p className="text-[11px] text-[#F8F8F6]/70 mt-1">
                  Acende suavemente ao abrir a porta ou ao aproximar a mão
                </p>
                <div className="mt-3 pt-2 border-t border-white/10 flex justify-between items-center">
                  <span className="text-[11px] text-white/50">Ver fotos e detalhes</span>
                  <button
                    type="button"
                    onClick={() => onSelectTab('product')}
                    className="text-[11px] text-[#C6A66B] font-semibold hover:underline flex items-center gap-1"
                  >
                    <span>Abrir Galeria</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
