import React, { useState } from 'react';
import { Product, AppTab } from '../types';
import { Info, CheckCircle2, ArrowRight, ShoppingBag, Play } from 'lucide-react';

interface ProductGalleryProps {
  product: Product | null;
  onSelectTab: (tab: AppTab) => void;
  onOpenVideo?: (videoId?: string) => void;
}

export const ProductGallery: React.FC<ProductGalleryProps> = ({
  product,
  onSelectTab,
  onOpenVideo
}) => {
  const images = [
    {
      url: '/src/assets/images/product_lumora_isolated_1792262011015.jpg',
      title: 'Produto Isolado em Alumínio',
      caption: 'Barra LED em acabamento de alumínio acetinado com difusor fosco e lente PIR'
    },
    {
      url: '/src/assets/images/hero_lumora_wardrobe_1792262010537.jpg',
      title: 'Instalado em Roupeiro / Closet',
      caption: 'Iluminação orientada para baixo, facilitando a escolha da roupa sem sombras'
    },
    {
      url: '/src/assets/images/lumora_kitchen_undercabinet_1792359686505.jpg',
      title: 'Cozinha & Sob Armários',
      caption: 'Iluminação potente e confortável sobre a bancada de preparação culinária'
    },
    {
      url: '/src/assets/images/lumora_magnetic_mount_1792262011714.jpg',
      title: 'Sistema de Fixação Magnética',
      caption: 'Fixação por adesivo 3M na superfície e engate magnético direto na luminária'
    },
    {
      url: '/src/assets/images/lumora_usbc_charging_1792262012537.jpg',
      title: 'Porta USB-C & Bateria',
      caption: 'Conector de carregamento rápido USB-C, sem pilhas e autonomia de até 60 dias'
    },
    {
      url: '/src/assets/images/lumora_staircase_night_1792359733537.jpg',
      title: 'Degraus & Escadas à Noite',
      caption: 'Acendimento automático no escuro para circulação segura de crianças e idosos'
    },
    {
      url: '/src/assets/images/lumora_modes_display_1792359745079.jpg',
      title: '3 Tonalidades de Luz',
      caption: 'Luz Quente (3000K), Neutra Natural (4000K) e Branca Fria (6000K) ajustáveis'
    },
    {
      url: '/src/assets/images/lumora_hallway_lighting_1792262011603.jpg',
      title: 'Corredores & Rodapé',
      caption: 'Acionamento automático por movimento à noite para maior segurança doméstica'
    }
  ];

  const [activeIndex, setActiveIndex] = useState(0);

  const formattedPrice = product
    ? new Intl.NumberFormat('pt-AO').format(product.price)
    : '29.900';

  return (
    <div className="py-12 bg-white text-[#17191C]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header with Title and Pricing Banner */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-6 border-b border-[#E4E4E7]">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-[#C6A66B] mb-2 flex items-center gap-2">
              <span>Detalhes Técnicos & Galeria</span>
              {onOpenVideo && (
                <button
                  type="button"
                  onClick={onOpenVideo}
                  className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#C6A66B]/15 text-[#C6A66B] hover:bg-[#C6A66B] hover:text-[#17191C] text-[11px] font-bold transition-colors cursor-pointer border border-[#C6A66B]/30"
                >
                  <Play className="w-2.5 h-2.5 fill-current" />
                  <span>Ver Vídeo da Luminária</span>
                </button>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-display tracking-tight text-[#17191C]">
              {product?.name || 'Luminária LED Recarregável com Sensor de Movimento'}
            </h1>
            <p className="mt-2 text-sm sm:text-base text-[#52525B] max-w-2xl">
              {product?.description ||
                'Uma solução de iluminação prática e sofisticada para os espaços da tua casa onde precisas de mais luz.'}
            </p>
          </div>

          {/* Pricing Card with Buy & Video CTAs */}
          <div className="p-5 bg-[#17191C] text-[#F8F8F6] rounded-xl flex flex-wrap sm:flex-nowrap items-center justify-between sm:justify-end gap-4 sm:gap-6 shrink-0 shadow-md">
            <div>
              <span className="text-[11px] uppercase tracking-wider text-[#F8F8F6]/60 block">
                Preço de Referência
              </span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl sm:text-3xl font-bold font-display font-mono text-[#C6A66B] tabular-nums">
                  {formattedPrice} Kz
                </span>
                <span className="text-xs text-[#F8F8F6]/60">/ unidade</span>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
              {onOpenVideo && (
                <button
                  type="button"
                  onClick={onOpenVideo}
                  className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-[#F8F8F6] hover:text-[#C6A66B] bg-white/10 hover:bg-white/15 border border-[#C6A66B]/50 hover:border-[#C6A66B] active:scale-[0.98] transition-all rounded-md shadow flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer flex-1 sm:flex-initial"
                  title="Assistir demonstração da luminária na plataforma (sem restrições)"
                >
                  <Play className="w-3.5 h-3.5 fill-[#C6A66B] text-[#C6A66B]" />
                  <span>Vídeo da Luminária</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => onSelectTab('checkout')}
                className="px-5 py-3 text-xs font-bold uppercase tracking-wider text-[#17191C] bg-[#C6A66B] hover:bg-[#d8b87c] active:scale-[0.98] transition-all rounded-md shadow flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer flex-1 sm:flex-initial"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Encomendar</span>
              </button>
            </div>
          </div>
        </div>

        {/* Gallery Visual Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Visual Display */}
          <div className="lg:col-span-7 space-y-4">
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
              title="Clica na Luminária para ver o vídeo da demonstração"
              className="relative rounded-xl overflow-hidden bg-[#17191C] border border-[#E4E4E7] hover:border-[#C6A66B] aspect-[4/3] flex items-center justify-center shadow-md group cursor-pointer transition-all duration-300"
            >
              <img
                src={images[activeIndex].url}
                alt={images[activeIndex].title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
              />

              {/* YouTube Play Icon on Hover / Clickable Banner */}
              {onOpenVideo && (
                <div className="absolute top-4 right-4 z-10">
                  <div className="px-3 py-1.5 rounded-full bg-[#17191C]/85 backdrop-blur-md border border-[#C6A66B]/50 text-white text-[11px] font-bold shadow-lg flex items-center gap-2 group-hover:bg-[#C6A66B] group-hover:text-[#17191C] group-hover:border-[#C6A66B] transition-colors">
                    <Play className="w-3 h-3 fill-current" />
                    <span>Ver Vídeo da Luminária</span>
                  </div>
                </div>
              )}

              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/85 via-black/50 to-transparent p-4 sm:p-5 text-white flex items-end justify-between">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#C6A66B] block">
                    {images[activeIndex].title}
                  </span>
                  <p className="text-xs text-white/90 mt-0.5">
                    {images[activeIndex].caption}
                  </p>
                </div>
                {onOpenVideo && (
                  <span className="text-[11px] text-[#C6A66B] font-semibold flex items-center gap-1 shrink-0 ml-3">
                    <Play className="w-3 h-3 fill-current" />
                    <span className="hidden sm:inline">Assistir Vídeo</span>
                  </span>
                )}
              </div>
            </div>

            {/* Thumbnail Selectors (8 images) */}
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveIndex(idx)}
                  className={`relative rounded-md overflow-hidden aspect-square border-2 transition-all cursor-pointer ${
                    activeIndex === idx
                      ? 'border-[#C6A66B] ring-2 ring-[#C6A66B]/20'
                      : 'border-[#E4E4E7] hover:border-slate-400 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img
                    src={img.url}
                    alt={img.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>

            {/* 5 Distinct Videos Selector Box */}
            {onOpenVideo && product?.videos && product.videos.length > 0 && (
              <div className="p-4 bg-[#17191C] rounded-xl border border-[#C6A66B]/40 text-[#F8F8F6] space-y-3 shadow-md">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-xs font-bold uppercase tracking-wider text-[#C6A66B]">
                      {product.videos.length} Vídeos Demonstrativos Diferentes (Sem Restrições)
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => onOpenVideo(product.videos![0].id)}
                    className="text-[11px] font-semibold text-white/70 hover:text-[#C6A66B] transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <span>Ver todos</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
                  {product.videos.map((vid, vIdx) => (
                    <button
                      key={vid.id}
                      type="button"
                      onClick={() => onOpenVideo(vid.id)}
                      className="p-2 rounded-lg bg-white/5 hover:bg-[#C6A66B]/20 border border-white/10 hover:border-[#C6A66B] text-left transition-all group/v cursor-pointer"
                    >
                      <div className="relative aspect-video rounded overflow-hidden mb-1.5 bg-black">
                        <img
                          src={vid.thumbnail}
                          alt={vid.shortTitle}
                          className="w-full h-full object-cover group-hover/v:scale-105 transition-transform"
                        />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                          <div className="w-5 h-5 rounded-full bg-[#C6A66B] text-[#17191C] flex items-center justify-center">
                            <Play className="w-2.5 h-2.5 fill-current translate-x-0.5" />
                          </div>
                        </div>
                        <span className="absolute bottom-1 right-1 text-[9px] font-mono bg-black/80 px-1 rounded text-white/80">
                          {vid.durationFormatted}
                        </span>
                      </div>
                      <span className="text-[10px] font-bold text-white/90 group-hover/v:text-[#C6A66B] line-clamp-1 block">
                        {vIdx + 1}. {vid.shortTitle}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="p-3.5 bg-[#F8F8F6] rounded-md border border-[#E4E4E7] flex items-start gap-2.5 text-xs text-[#52525B]">
              <Info className="w-4 h-4 text-[#C6A66B] shrink-0 mt-0.5" />
              <span>
                As imagens e vídeos demonstram o modelo oficial LUMORA em testes reais de iluminação, fixação magnética e detecção por movimento.
              </span>
            </div>
          </div>

          {/* Technical Specifications Sheet */}
          <div className="lg:col-span-5 bg-[#F8F8F6] p-6 rounded-xl border border-[#E4E4E7] space-y-6">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-[#C6A66B]">
                Ficha Técnica
              </span>
              <h3 className="text-xl font-bold font-display text-[#17191C] mt-1">
                Especificações do Modelo
              </h3>
            </div>

            <div className="divide-y divide-[#E4E4E7] text-xs">
              {(product?.specs || []).map((spec, index) => (
                <div key={index} className="py-3 flex flex-col sm:flex-row sm:justify-between gap-1">
                  <span className="font-medium text-[#71717A]">{spec.label}</span>
                  <div className="sm:text-right">
                    <span className="font-semibold text-[#17191C]">{spec.value}</span>
                    {spec.needsConfirmation && (
                      <span className="block text-[11px] text-amber-700 font-normal">
                        * Sob teste contínuo de durabilidade
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Box Contents Checklist */}
            <div className="pt-4 border-t border-[#E4E4E7] space-y-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#17191C]">
                O que vem na caixa:
              </span>
              <ul className="space-y-1.5 text-xs text-[#52525B]">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#C6A66B]" />
                  <span>1x Luminária LED recarregável LUMORA</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#C6A66B]" />
                  <span>2x Bases metálicas adesivas para fixação</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#C6A66B]" />
                  <span>1x Cabo de carregamento USB-C</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#C6A66B]" />
                  <span>1x Guia rápido de utilização em português</span>
                </li>
              </ul>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => onSelectTab('checkout')}
                className="w-full py-3 text-xs font-bold uppercase tracking-wider text-[#17191C] bg-[#C6A66B] hover:bg-[#d8b87c] rounded-md transition-all flex items-center justify-center gap-2"
              >
                <span>Avançar para Encomenda ({formattedPrice} Kz)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
