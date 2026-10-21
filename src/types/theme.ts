export type ThemeId = 'default' | 'dark_noir' | 'light_minimal' | 'warm_amber' | 'modern_slate';

export interface ThemeOption {
  id: ThemeId;
  name: string;
  tagline: string;
  description: string;
  badge?: string;
  isDefault?: boolean;
  colors: {
    bg: string;
    card: string;
    accent: string;
    text: string;
    border: string;
  };
  // CSS classes applied to root app container
  containerClass: string;
  cardClass: string;
  headerClass: string;
}

export const THEME_OPTIONS: ThemeOption[] = [
  {
    id: 'default',
    name: 'Padrão LUMORA',
    tagline: 'O visual oficial de fábrica da plataforma',
    description: 'Design premium equilibrado com cabeçalho carvão escuro #17191C, realces a ouro acetinado e páginas limpas.',
    badge: 'Predefinido da Plataforma',
    isDefault: true,
    colors: {
      bg: '#F8F8F6',
      card: '#FFFFFF',
      accent: '#C6A66B',
      text: '#17191C',
      border: '#E4E4E7'
    },
    containerClass: 'theme-default bg-[#F8F8F6] text-[#17191C]',
    cardClass: 'bg-white border-[#E4E4E7] text-[#17191C]',
    headerClass: 'bg-[#17191C]/95'
  },
  {
    id: 'dark_noir',
    name: 'Noite Imersiva (Onyx Noir)',
    tagline: 'Fundo ultra-escuro aveludado e cinematográfico',
    description: 'Imersão completa em preto profundo #0B0C0E. Ideal para apreciar o brilho da luminária LED como na noite escura.',
    badge: 'Escuro Profundo',
    colors: {
      bg: '#0B0C0E',
      card: '#14161B',
      accent: '#D4AF37',
      text: '#F3F4F6',
      border: '#252932'
    },
    containerClass: 'theme-dark-noir bg-[#0B0C0E] text-[#F3F4F6]',
    cardClass: 'bg-[#14161B] border-[#252932] text-[#F3F4F6]',
    headerClass: 'bg-[#07080A]/95'
  },
  {
    id: 'light_minimal',
    name: 'Luz Clara Minimalista',
    tagline: 'Fundo suave, luminoso e altamente arejado',
    description: 'Tons claros acolhedores com marfim e branco puro, mantendo os toques dourados discretos e limpos.',
    badge: 'Modo Claro',
    colors: {
      bg: '#FAF9F6',
      card: '#FFFFFF',
      accent: '#B89352',
      text: '#18191B',
      border: '#E2E2DC'
    },
    containerClass: 'theme-light-minimal bg-[#FAF9F6] text-[#18191B]',
    cardClass: 'bg-white border-[#E2E2DC] text-[#18191B]',
    headerClass: 'bg-[#1F2227]/95'
  },
  {
    id: 'warm_amber',
    name: 'Âmbar Aconchegante (3000K)',
    tagline: 'Tons quentes de café e brilho suave de 3000K',
    description: 'Inspirado na temperatura de cor quente da luminária LUMORA. Conforto térmico visual relaxante para os olhos.',
    badge: 'Luz Quente 3000K',
    colors: {
      bg: '#181411',
      card: '#221C17',
      accent: '#E2A850',
      text: '#FAF5ED',
      border: '#3B3026'
    },
    containerClass: 'theme-warm-amber bg-[#181411] text-[#FAF5ED]',
    cardClass: 'bg-[#221C17] border-[#3B3026] text-[#FAF5ED]',
    headerClass: 'bg-[#100D0B]/95'
  },
  {
    id: 'modern_slate',
    name: 'Ardósia Nórdica',
    tagline: 'Cinza ardósia contemporâneo e sofisticado',
    description: 'Estilo arquitetónico moderno com base mineral escura #161A20 e realces em champanhe acetinado.',
    badge: 'Cinza Arquitetónico',
    colors: {
      bg: '#151920',
      card: '#1D232C',
      accent: '#CBB07E',
      text: '#F1F4F8',
      border: '#2C3442'
    },
    containerClass: 'theme-modern-slate bg-[#151920] text-[#F1F4F8]',
    cardClass: 'bg-[#1D232C] border-[#2C3442] text-[#F1F4F8]',
    headerClass: 'bg-[#0E1116]/95'
  }
];
