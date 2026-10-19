import React from 'react';
import { ArrowRight, Truck, ShieldCheck, Zap, Check, Play, Star } from 'lucide-react';
import { Product, AppTab } from '../types';

interface HeroProps {
  product: Product | null;
  onSelectTab: (tab: AppTab) => void;
  onOpenVideo?: () => void;
}

export const Hero: React.FC<HeroProps> = ({ product, onSelectTab, onOpenVideo }) => {
  return (
    <section className="relative bg-[#17191C] text-[#F8F8F6] pt-14 pb-20 lg:pt-20 lg:pb-28 overflow-hidden">
      {/* Subtle architectural ambient illumination */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#C6A66B]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Copy & Actions */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#C6A66B] uppercase tracking-wider">
                <span>LUMORA</span>
                <span aria-hidden="true">·</span>
                <span>Iluminação Inteligente</span>
                <span aria-hidden="true">·</span>
                <span>Angola</span>
              </div>

              <button
                type="button"
                onClick={() => onSelectTab('testimonials')}
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#C6A66B]/50 transition-all text-xs cursor-pointer group"
                title="Ver todas as avaliações e depoimentos de clientes em Angola"
              >
                <div className="flex items-center gap-0.5 text-[#C6A66B]">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3 h-3 fill-[#C6A66B]" />
                  ))}
                </div>
                <span className="font-bold text-white text-[11px]">4.9</span>
                <span className="text-white/40 text-[10px]">•</span>
                <span className="text-white/70 group-hover:text-white transition-colors text-[11px]">
                  380+ Depoimentos de Clientes
                </span>
              </button>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-display tracking-tight text-[#F8F8F6] leading-[1.15] text-balance">
              Ilumina o teu espaço. Simplifica a tua rotina.
            </h1>

            <p className="text-base sm:text-lg text-[#F8F8F6]/80 max-w-xl leading-relaxed">
              Uma solução de iluminação prática para os espaços da tua casa onde precisas de mais luz.
              Sem fios eléctricos visíveis, sem furos em paredes e com fixação magnética instantânea.
            </p>

            {/* Quality Statement Box */}
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

            {/* Navigational CTA cluster */}
            <div className="pt-2 flex flex-wrap items-center gap-3 sm:gap-4">
              <button
                type="button"
                onClick={() => onSelectTab('product')}
                className="inline-flex justify-center items-center gap-2 px-7 py-4 text-xs font-bold uppercase tracking-wider text-[#17191C] bg-[#C6A66B] hover:bg-[#d8b87c] active:scale-[0.98] transition-all rounded-md shadow-lg shadow-[#C6A66B]/15 cursor-pointer"
              >
                <span>Conhecer o Produto</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {onOpenVideo && (
                <button
                  type="button"
                  onClick={onOpenVideo}
                  className="inline-flex justify-center items-center gap-2.5 px-6 py-4 text-xs font-bold uppercase tracking-wider text-[#F8F8F6] hover:text-[#C6A66B] bg-[#C6A66B]/15 hover:bg-[#C6A66B]/25 border border-[#C6A66B]/50 hover:border-[#C6A66B] transition-all rounded-md shadow group cursor-pointer"
                  title="Assistir aos 5 vídeos demonstrativos da luminária na plataforma (sem restrições)"
                >
                  <span className="w-6 h-6 rounded-full bg-[#C6A66B] text-[#17191C] flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                    <Play className="w-3 h-3 fill-[#17191C] translate-x-0.5" />
                  </span>
                  <span>Ver 5 Vídeos da Luminária</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => onSelectTab('checkout')}
                className="inline-flex justify-center items-center px-5 py-4 text-xs font-semibold uppercase tracking-wider text-[#F8F8F6]/80 hover:text-[#C6A66B] border border-white/20 hover:border-[#C6A66B]/50 transition-colors rounded-md cursor-pointer"
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

          {/* Right Column: Hero High-Fidelity Showcase (Clicking on it opens the video) */}
          <div className="lg:col-span-5 relative">
            <div
              onClick={onOpenVideo}
              role={onOpenVideo ? 'button' : undefined}
              tabIndex={onOpenVideo ? 0 : undefined}
              onKeyDown={(e) => {
                if (onOpenVideo && (e.key === 'Enter' || e.key === ' ')) {
                  e.preventDefault();
                  onOpenVideo();
                }
              }}
              aria-label="Clica na luminária para assistir ao vídeo de demonstração"
              className="relative rounded-2xl overflow-hidden border border-white/10 hover:border-[#C6A66B]/60 shadow-2xl bg-[#23272B] aspect-[4/3] sm:aspect-[4/3] lg:aspect-[4/5] flex items-center justify-center group cursor-pointer transition-all duration-300"
            >
              <img
                src={product?.images?.[0] || '/src/assets/images/hero_lumora_wardrobe_1792262010537.jpg'}
                alt="Luminária LED LUMORA instalada num roupeiro moderno"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
              />

              {/* Gradient Scrim */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#17191C]/90 via-[#17191C]/20 to-black/20 group-hover:via-[#17191C]/30 transition-colors pointer-events-none" />

              {/* Central Pulsing Play Button Overlay */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="flex flex-col items-center gap-2.5 text-center">
                  <div className="relative group-hover:scale-110 transition-transform duration-300">
                    <div className="absolute -inset-3 bg-[#C6A66B]/30 rounded-full blur-md animate-pulse" />
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#C6A66B] text-[#17191C] flex items-center justify-center shadow-2xl border-2 border-white/40">
                      <Play className="w-7 h-7 sm:w-9 sm:h-9 fill-[#17191C] translate-x-0.5" />
                    </div>
                  </div>

                  <div className="px-4 py-1.5 rounded-full bg-[#17191C]/90 backdrop-blur-md border border-[#C6A66B]/50 text-xs font-bold text-[#F8F8F6] shadow-xl flex items-center gap-2 group-hover:border-[#C6A66B] transition-colors">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    <span>Ver 5 Vídeos Demonstrativos na Plataforma</span>
                  </div>
                </div>
              </div>

              {/* Bottom Details Tag */}
              <div className="absolute bottom-4 left-4 right-4 p-4 bg-[#17191C]/90 backdrop-blur-md rounded-xl border border-white/10 text-xs pointer-events-auto">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-[#F8F8F6]">Testes Reais em Armário, Cozinha & Escadas</span>
                  <span className="text-[#C6A66B] font-mono text-[11px] px-2 py-0.5 rounded bg-[#C6A66B]/15 border border-[#C6A66B]/30">
                    5 Vídeos Disponíveis
                  </span>
                </div>
                <p className="text-[11px] text-[#F8F8F6]/70 mt-1">
                  Confira instalação magnética sem furos, teste do sensor no escuro e autonomia USB-C
                </p>
                <div className="mt-3 pt-2 border-t border-white/10 flex justify-between items-center text-[11px]">
                  <span className="text-white/80 flex items-center gap-1.5">
                    <Play className="w-3 h-3 text-[#C6A66B] fill-[#C6A66B]" />
                    <span>Vídeos na plataforma (100% Sem Restrições)</span>
                  </span>
                  <span className="text-[#C6A66B] font-semibold hover:underline flex items-center gap-1">
                    <span>Assistir Todos</span>
                    <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
