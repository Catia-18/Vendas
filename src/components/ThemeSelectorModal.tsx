import React from 'react';
import { X, Check, Palette, Sparkles, RotateCcw, Moon, Sun, Flame, Layers } from 'lucide-react';
import { ThemeId, THEME_OPTIONS } from '../types/theme';

interface ThemeSelectorModalProps {
  isOpen: boolean;
  activeTheme: ThemeId;
  onSelectTheme: (theme: ThemeId) => void;
  onClose: () => void;
}

export const ThemeSelectorModal: React.FC<ThemeSelectorModalProps> = ({
  isOpen,
  activeTheme,
  onSelectTheme,
  onClose
}) => {
  if (!isOpen) return null;

  const getThemeIcon = (id: ThemeId) => {
    switch (id) {
      case 'default':
        return <Sparkles className="w-4 h-4 text-[#C6A66B]" />;
      case 'dark_noir':
        return <Moon className="w-4 h-4 text-[#D4AF37]" />;
      case 'light_minimal':
        return <Sun className="w-4 h-4 text-[#B89352]" />;
      case 'warm_amber':
        return <Flame className="w-4 h-4 text-[#E2A850]" />;
      case 'modern_slate':
        return <Layers className="w-4 h-4 text-[#CBB07E]" />;
      default:
        return <Palette className="w-4 h-4 text-[#C6A66B]" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-[#17191C] text-[#F8F8F6] rounded-2xl max-w-xl w-full border border-white/10 shadow-2xl overflow-hidden relative">
        {/* Modal Header */}
        <div className="p-6 border-b border-white/10 relative">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-5 right-5 p-1.5 text-white/50 hover:text-white rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Fechar janela"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-1.5">
            <div className="w-7 h-7 rounded-lg bg-[#C6A66B]/20 text-[#C6A66B] flex items-center justify-center border border-[#C6A66B]/30">
              <Palette className="w-4 h-4" />
            </div>
            <span className="text-xs uppercase tracking-widest text-[#C6A66B] font-mono font-bold">
              Personalização Visual
            </span>
          </div>

          <h3 className="text-xl font-bold font-display text-white">
            Escolhe o Fundo da Plataforma
          </h3>
          <p className="text-xs text-white/70 mt-1 leading-relaxed">
            Podes alternar livremente entre diferentes ambientes visuais. Ao entrar na plataforma, o fundo predefinido é sempre o <strong className="text-[#C6A66B]">Padrão LUMORA</strong>.
          </p>
        </div>

        {/* Theme Cards List */}
        <div className="p-6 space-y-3 max-h-[60vh] overflow-y-auto scrollbar-thin">
          {THEME_OPTIONS.map((opt) => {
            const isSelected = activeTheme === opt.id;
            return (
              <div
                key={opt.id}
                onClick={() => onSelectTheme(opt.id)}
                className={`p-4 rounded-xl border transition-all cursor-pointer relative group flex items-start gap-4 ${
                  isSelected
                    ? 'border-[#C6A66B] bg-white/10 shadow-lg shadow-[#C6A66B]/10 ring-1 ring-[#C6A66B]'
                    : 'border-white/10 bg-white/5 hover:border-white/25 hover:bg-white/8'
                }`}
              >
                {/* Visual Swatch Preview Box */}
                <div
                  className="w-14 h-14 rounded-lg shrink-0 border border-white/20 p-1 flex flex-col justify-between shadow-inner"
                  style={{ backgroundColor: opt.colors.bg }}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className="w-2.5 h-2.5 rounded-full inline-block"
                      style={{ backgroundColor: opt.colors.accent }}
                    />
                    <span
                      className="text-[8px] font-bold font-mono px-1 rounded"
                      style={{
                        backgroundColor: opt.colors.card,
                        color: opt.colors.text
                      }}
                    >
                      LED
                    </span>
                  </div>
                  <div
                    className="w-full h-3 rounded text-[7px] flex items-center justify-center font-medium"
                    style={{
                      backgroundColor: opt.colors.card,
                      color: opt.colors.text,
                      border: `1px solid ${opt.colors.border}`
                    }}
                  >
                    LUMORA
                  </div>
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      {getThemeIcon(opt.id)}
                      <h4 className="font-bold text-sm text-white group-hover:text-[#C6A66B] transition-colors">
                        {opt.name}
                      </h4>
                    </div>

                    {opt.isDefault && (
                      <span className="px-2 py-0.5 rounded-full bg-[#C6A66B]/20 border border-[#C6A66B]/50 text-[#C6A66B] text-[10px] font-bold shrink-0">
                        Predefinido
                      </span>
                    )}
                    {!opt.isDefault && opt.badge && (
                      <span className="px-2 py-0.5 rounded-full bg-white/10 text-white/70 text-[10px] font-medium shrink-0">
                        {opt.badge}
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-white/60 mt-1 leading-snug">
                    {opt.description}
                  </p>
                </div>

                {/* Selection Indicator */}
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 border transition-colors mt-1 ${
                    isSelected
                      ? 'bg-[#C6A66B] border-[#C6A66B] text-[#17191C]'
                      : 'border-white/20 group-hover:border-white/40'
                  }`}
                >
                  {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </div>
              </div>
            );
          })}
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-6 border-t border-white/10 bg-[#111315] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <button
            type="button"
            onClick={() => onSelectTheme('default')}
            disabled={activeTheme === 'default'}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-white/70 hover:text-white hover:bg-white/5 transition-colors disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed border border-white/10"
          >
            <RotateCcw className="w-3.5 h-3.5 text-[#C6A66B]" />
            <span>Restaurar Padrão da Plataforma</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2.5 rounded-lg bg-[#C6A66B] hover:bg-[#d8b87c] text-[#17191C] font-bold uppercase tracking-wider text-xs transition-colors shadow-md cursor-pointer"
          >
            Confirmar & Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
