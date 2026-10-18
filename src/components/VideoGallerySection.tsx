import React from 'react';
import { Play, Sparkles, CheckCircle2, ShieldCheck, Zap, Radio, Film, Layers } from 'lucide-react';
import { LuminariaVideo } from '../types';

interface VideoGallerySectionProps {
  videos?: LuminariaVideo[];
  onSelectVideo: (videoId: string) => void;
  onGoToCheckout?: () => void;
}

export const VideoGallerySection: React.FC<VideoGallerySectionProps> = ({
  videos = [],
  onSelectVideo,
  onGoToCheckout
}) => {
  if (!videos || videos.length === 0) return null;

  return (
    <section id="videos-demonstrativos" className="py-16 md:py-24 bg-[#111315] relative overflow-hidden border-t border-b border-white/10">
      {/* Decorative ambient lights */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#C6A66B]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-[#C6A66B]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#C6A66B]/15 border border-[#C6A66B]/30 text-[#C6A66B] text-xs font-bold uppercase tracking-wider mb-4">
            <Film className="w-3.5 h-3.5" />
            <span>Vídeos Demonstrativos Oficiais</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#F8F8F6] tracking-tight font-display mb-4">
            Vê a Luminária em Diferentes Ambientes e Aplicações
          </h2>
          <p className="text-sm sm:text-base text-white/70 max-w-2xl mx-auto leading-relaxed">
            Confere {videos.length} vídeos diferentes mostrando o teste real do sensor de movimento, a instalação sem furos, a autonomia da bateria e o resultado em roupeiros, bancadas e escadas.
          </p>

          {/* Guarantee Badges */}
          <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold bg-emerald-950/60 text-emerald-300 border border-emerald-500/30">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              100% Disponível na Plataforma (Sem Bloqueios)
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold bg-white/5 text-white/80 border border-white/10">
              <Sparkles className="w-3.5 h-3.5 text-[#C6A66B]" />
              Áudio e Legendas em Português
            </span>
          </div>
        </div>

        {/* Video Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {videos.map((vid, idx) => (
            <div
              key={vid.id}
              onClick={() => onSelectVideo(vid.id)}
              className="group bg-[#17191C] border border-white/10 hover:border-[#C6A66B]/60 rounded-2xl overflow-hidden shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl flex flex-col cursor-pointer"
            >
              {/* Thumbnail Container with Play Overlay */}
              <div className="relative aspect-video w-full bg-black overflow-hidden">
                <img
                  src={vid.thumbnail}
                  alt={vid.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />

                {/* Gradient Overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#17191C] via-black/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />

                {/* Category & Badge */}
                <div className="absolute top-3 left-3 flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-black/75 backdrop-blur-md text-[#C6A66B] border border-[#C6A66B]/40">
                    {vid.category}
                  </span>
                </div>

                <div className="absolute top-3 right-3">
                  <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-black/80 backdrop-blur-md text-white/90 border border-white/10">
                    {vid.durationFormatted}
                  </span>
                </div>

                {/* Big Center Play Button */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-14 h-14 rounded-full bg-[#C6A66B] group-hover:bg-[#d8b87c] text-[#17191C] flex items-center justify-center shadow-2xl transition-transform duration-300 group-hover:scale-110">
                    <Play className="w-6 h-6 fill-current translate-x-0.5" />
                  </div>
                </div>

                {/* Bottom Bar on Thumbnail */}
                <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between text-[11px] text-white/80">
                  <span className="flex items-center gap-1 font-semibold text-emerald-400">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    Sem restrições
                  </span>
                  <span className="text-white/60">Vídeo #{idx + 1}</span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="text-base font-bold text-[#F8F8F6] group-hover:text-[#C6A66B] transition-colors leading-snug">
                    {vid.title}
                  </h3>
                  <p className="mt-2 text-xs sm:text-sm text-white/70 line-clamp-2 leading-relaxed">
                    {vid.description}
                  </p>
                </div>

                {/* Key Benefits List */}
                <div className="space-y-1.5 pt-2 border-t border-white/10">
                  {vid.keyBenefits.map((benefit) => (
                    <div key={benefit} className="flex items-center gap-2 text-xs text-white/80">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#C6A66B] shrink-0" />
                      <span>{benefit}</span>
                    </div>
                  ))}
                </div>

                {/* Action Button */}
                <div className="pt-2">
                  <button
                    type="button"
                    className="w-full py-2.5 px-4 rounded-lg bg-white/5 hover:bg-[#C6A66B] text-white/90 hover:text-[#17191C] text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 border border-white/10 group-hover:border-[#C6A66B]"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Assistir a este Vídeo</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA at the bottom of the video gallery */}
        {onGoToCheckout && (
          <div className="mt-14 p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-[#17191C] via-[#1f2327] to-[#17191C] border border-[#C6A66B]/30 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
            <div className="text-center sm:text-left">
              <h3 className="text-lg sm:text-xl font-bold text-[#F8F8F6] font-display">
                Gostaste do que viste na demonstração?
              </h3>
              <p className="text-xs sm:text-sm text-white/70 mt-1">
                Aproveita a entrega rápida em Luanda com pagamento no ato da entrega ou transferência.
              </p>
            </div>
            <button
              type="button"
              onClick={onGoToCheckout}
              className="px-6 py-3 rounded-lg bg-[#C6A66B] hover:bg-[#d8b87c] text-[#17191C] font-bold text-xs uppercase tracking-wider transition-transform active:scale-95 shadow-lg shrink-0 cursor-pointer"
            >
              Comprar Luminária Agora
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
