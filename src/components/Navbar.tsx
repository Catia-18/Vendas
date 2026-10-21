import React, { useState } from 'react';
import { MessageCircle, Menu, X, Shield, Search, ShoppingBag, Play, Palette } from 'lucide-react';
import { StoreSettings, AppTab } from '../types';

interface NavbarProps {
  settings: StoreSettings | null;
  activeTab: AppTab;
  onSelectTab: (tab: AppTab) => void;
  onOpenLogin: () => void;
  onOpenVideo?: () => void;
  onOpenThemeSelector?: () => void;
  activeThemeName?: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  settings,
  activeTab,
  onSelectTab,
  onOpenLogin,
  onOpenVideo,
  onOpenThemeSelector,
  activeThemeName
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const whatsappHref = settings?.whatsappNumber
    ? `https://wa.me/${settings.whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
        'Olá LUMORA, gostaria de mais informações sobre a luminária LED.'
      )}`
    : '#';

  const navItems: { id: AppTab; label: string }[] = [
    { id: 'home', label: 'Início' },
    { id: 'product', label: 'O Produto & Preço' },
    { id: 'benefits', label: 'Benefícios' },
    { id: 'how_it_works', label: 'Como Funciona' },
    { id: 'testimonials', label: 'Depoimentos' },
    { id: 'faq', label: 'Perguntas Frequentes' }
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#17191C]/95 backdrop-blur-md border-b border-white/10 text-[#F8F8F6]">
      {/* Top micro-bar reassuring guest shopping */}
      <div className="bg-[#111315] border-b border-white/5 py-1.5 px-4 text-center text-[11px] text-[#F8F8F6]/70 flex items-center justify-center gap-2">
        <span className="text-[#C6A66B]">✓ Compra directa para clientes:</span>
        <span>sem criação de conta nem registo obrigatório. Entregas em Luanda e províncias.</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-6">
        {/* Brand Wordmark (Clicking switches to Home tab) */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => onSelectTab('home')}
            className="flex items-center gap-2.5 text-2xl font-bold tracking-widest font-display text-[#F8F8F6] hover:text-[#C6A66B] transition-colors whitespace-nowrap text-left"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-[#C6A66B] inline-block" />
            LUMORA
          </button>
        </div>

        {/* Tab navigation links */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium">
          {navItems.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelectTab(item.id)}
              className={`py-2 px-1 transition-all whitespace-nowrap shrink-0 border-b-2 text-xs uppercase tracking-wider font-semibold ${
                activeTab === item.id
                  ? 'border-[#C6A66B] text-[#C6A66B]'
                  : 'border-transparent text-[#F8F8F6]/75 hover:text-white'
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* Primary Actions */}
        <div className="hidden sm:flex items-center gap-3 shrink-0">
          {onOpenVideo && (
            <button
              type="button"
              onClick={onOpenVideo}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-white/90 hover:text-white border border-[#C6A66B]/50 hover:border-[#C6A66B] rounded-md bg-[#C6A66B]/10 hover:bg-[#C6A66B]/20 transition-colors whitespace-nowrap cursor-pointer shadow-sm group"
              title="Assistir aos 5 vídeos demonstrativos da luminária na plataforma (sem restrições)"
            >
              <Play className="w-3.5 h-3.5 fill-[#C6A66B] text-[#C6A66B] group-hover:scale-110 transition-transform" />
              <span>5 Vídeos da Luminária</span>
            </button>
          )}

          {/* Tracking / Admin Portal Access */}
          <button
            type="button"
            onClick={onOpenLogin}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-[#F8F8F6]/80 hover:text-white border border-white/15 rounded-md hover:bg-white/5 transition-colors whitespace-nowrap"
            title="Acompanhar Encomenda (Cliente) ou Painel de Gestão (Admin)"
          >
            <Search className="w-3.5 h-3.5 text-[#C6A66B]" />
            <span>Seguir Pedido</span>
          </button>

          {/* Background Theme Customizer */}
          {onOpenThemeSelector && (
            <button
              type="button"
              onClick={onOpenThemeSelector}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-[#F8F8F6]/90 hover:text-white border border-[#C6A66B]/40 hover:border-[#C6A66B] rounded-md bg-[#C6A66B]/10 hover:bg-[#C6A66B]/20 transition-all whitespace-nowrap cursor-pointer shadow-sm group"
              title="Escolher o fundo visual da plataforma (Predefinido: Padrão LUMORA)"
            >
              <Palette className="w-3.5 h-3.5 text-[#C6A66B] group-hover:rotate-45 transition-transform" />
              <span>Fundo:</span>
              <span className="text-[#C6A66B] font-bold">{activeThemeName || 'Padrão'}</span>
            </button>
          )}

          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-[#F8F8F6]/80 hover:text-white border border-white/15 rounded-md hover:bg-white/5 transition-colors whitespace-nowrap"
            title="WhatsApp da Loja"
          >
            <MessageCircle className="w-3.5 h-3.5 text-[#25D366]" />
            <span>WhatsApp</span>
          </a>

          {/* Buy without account CTA */}
          <button
            type="button"
            onClick={() => onSelectTab('checkout')}
            className={`px-4 py-2.5 text-xs font-bold uppercase tracking-wider rounded-md transition-all whitespace-nowrap flex items-center gap-1.5 shadow-sm ${
              activeTab === 'checkout'
                ? 'bg-white text-[#17191C]'
                : 'text-[#17191C] bg-[#C6A66B] hover:bg-[#d8b87c] active:scale-[0.98]'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Comprar sem Registo</span>
          </button>
        </div>

        {/* Mobile menu trigger */}
        <div className="flex lg:hidden items-center gap-2">
          {onOpenThemeSelector && (
            <button
              type="button"
              onClick={onOpenThemeSelector}
              className="p-2 text-[#F8F8F6]/90 hover:text-[#C6A66B] rounded border border-white/15 bg-white/5"
              title="Escolher Fundo"
            >
              <Palette className="w-4 h-4 text-[#C6A66B]" />
            </button>
          )}

          <button
            type="button"
            onClick={onOpenLogin}
            className="p-2 text-[#F8F8F6]/80 hover:text-white rounded border border-white/10"
            title="Seguir Pedido / Admin"
          >
            <Search className="w-4 h-4 text-[#C6A66B]" />
          </button>

          <button
            type="button"
            onClick={() => onSelectTab('checkout')}
            className="px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-[#17191C] bg-[#C6A66B] rounded whitespace-nowrap"
          >
            Comprar
          </button>

          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-[#F8F8F6] hover:text-[#C6A66B]"
            aria-label="Abrir menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-white/10 bg-[#17191C] px-4 pt-3 pb-6 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                onSelectTab(item.id);
                setMobileMenuOpen(false);
              }}
              className={`w-full text-left py-2.5 px-3 rounded-md text-sm font-semibold transition-colors flex items-center justify-between ${
                activeTab === item.id
                  ? 'bg-white/10 text-[#C6A66B]'
                  : 'text-[#F8F8F6]/80 hover:bg-white/5 hover:text-white'
              }`}
            >
              <span>{item.label}</span>
              {activeTab === item.id && <span className="w-1.5 h-1.5 rounded-full bg-[#C6A66B]" />}
            </button>
          ))}

          <div className="pt-3 border-t border-white/10 space-y-2">
            {onOpenVideo && (
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenVideo();
                }}
                className="w-full py-2.5 px-3 rounded-md text-xs font-bold uppercase tracking-wider bg-[#C6A66B]/15 border border-[#C6A66B]/40 text-[#F8F8F6] flex items-center justify-center gap-2 hover:bg-[#C6A66B]/25 transition-colors cursor-pointer"
              >
                <Play className="w-4 h-4 fill-[#C6A66B] text-[#C6A66B]" />
                <span>Ver 5 Vídeos da Luminária (Sem Restrições)</span>
              </button>
            )}
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onSelectTab('checkout');
              }}
              className="w-full py-2.5 px-3 rounded-md text-xs font-bold uppercase tracking-wider bg-[#C6A66B] text-[#17191C] flex items-center justify-center gap-2"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Comprar sem Registo (Checkout Rápido)</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenLogin();
              }}
              className="w-full py-2 px-3 rounded-md text-xs font-medium bg-white/5 text-white/80 hover:text-white flex items-center gap-2"
            >
              <Search className="w-4 h-4 text-[#C6A66B]" />
              <span>Acompanhar Pedido / Gestão Administrativa</span>
            </button>

            {onOpenThemeSelector && (
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenThemeSelector();
                }}
                className="w-full py-2.5 px-3 rounded-md text-xs font-semibold bg-[#C6A66B]/10 border border-[#C6A66B]/40 text-white flex items-center justify-between hover:bg-[#C6A66B]/20 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <Palette className="w-4 h-4 text-[#C6A66B]" />
                  <span>Escolher Fundo da Plataforma</span>
                </div>
                <span className="text-[11px] px-2 py-0.5 rounded bg-[#C6A66B]/20 text-[#C6A66B] font-bold">
                  {activeThemeName || 'Padrão'}
                </span>
              </button>
            )}

            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2 px-3 text-xs font-medium text-[#25D366] flex items-center gap-2"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp de Apoio ({settings?.whatsappDisplay || '+244'})</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
