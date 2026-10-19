import React from 'react';
import { StoreSettings, AppTab } from '../types';
import { MessageCircle, Mail, MapPin, Shield, Star, Play, Sparkles } from 'lucide-react';

interface FooterProps {
  settings: StoreSettings | null;
  onOpenPolicy: (policyKey: 'terms' | 'privacy' | 'delivery' | 'returns') => void;
  onOpenAdmin: () => void;
  onSelectTab?: (tab: AppTab) => void;
}

export const Footer: React.FC<FooterProps> = ({
  settings,
  onOpenPolicy,
  onOpenAdmin,
  onSelectTab
}) => {
  const whatsappHref = settings?.whatsappNumber
    ? `https://wa.me/${settings.whatsappNumber.replace(/[^0-9]/g, '')}`
    : '#';

  return (
    <footer className="bg-[#111315] text-[#F8F8F6] pt-16 pb-12 border-t border-white/10 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-white/10">
          {/* Col 1: Brand & Identity */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-xl font-bold font-display tracking-widest text-[#F8F8F6]">
              <span className="w-2.5 h-2.5 rounded-full bg-[#C6A66B] inline-block" />
              LUMORA
            </div>
            <p className="text-[#F8F8F6]/70 leading-relaxed text-xs">
              {settings?.slogan || 'Iluminação inteligente. Mais conforto no teu dia.'}
            </p>
            <p className="text-[#F8F8F6]/50 text-[11px] leading-relaxed">
              Marca angolana focada em soluções práticas, tecnológicas e elegantes para o conforto da tua casa. Luminária LED recarregável com sensor de movimento inteligente.
            </p>
            {onSelectTab && (
              <div className="pt-1">
                <button
                  type="button"
                  onClick={() => onSelectTab('testimonials')}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#C6A66B]/15 hover:bg-[#C6A66B]/25 text-[#C6A66B] text-[11px] font-semibold border border-[#C6A66B]/40 transition-colors"
                >
                  <Star className="w-3.5 h-3.5 fill-[#C6A66B]" />
                  <span>Ver Depoimentos de Clientes</span>
                </button>
              </div>
            )}
          </div>

          {/* Col 2: Legal & Policies */}
          <div className="space-y-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#C6A66B] block">
              Informações & Políticas
            </span>
            <ul className="space-y-2 text-[#F8F8F6]/75">
              <li>
                <button
                  type="button"
                  onClick={() => onOpenPolicy('terms')}
                  className="hover:text-white transition-colors"
                >
                  Termos e Condições
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onOpenPolicy('privacy')}
                  className="hover:text-white transition-colors"
                >
                  Política de Privacidade
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onOpenPolicy('delivery')}
                  className="hover:text-white transition-colors"
                >
                  Política de Entrega & Zonas
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onOpenPolicy('returns')}
                  className="hover:text-white transition-colors"
                >
                  Política de Trocas e Devoluções
                </button>
              </li>
              {onSelectTab && (
                <li>
                  <button
                    type="button"
                    onClick={() => onSelectTab('testimonials')}
                    className="hover:text-[#C6A66B] text-[#F8F8F6]/90 font-medium transition-colors inline-flex items-center gap-1.5"
                  >
                    <span>Avaliações de Clientes</span>
                    <span className="px-1.5 py-0.2 bg-[#C6A66B]/20 text-[#C6A66B] text-[10px] rounded font-bold">
                      Novo
                    </span>
                  </button>
                </li>
              )}
            </ul>
          </div>

          {/* Col 3: Contact Channels */}
          <div className="space-y-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#C6A66B] block">
              Canais de Atendimento
            </span>
            <ul className="space-y-2.5 text-[#F8F8F6]/75">
              <li className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-[#C6A66B] shrink-0" />
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  WhatsApp: {settings?.whatsappDisplay || '+244 923 456 789'}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#C6A66B] shrink-0" />
                <a
                  href={`mailto:${settings?.email || 'contacto@lumora.ao'}`}
                  className="hover:text-white transition-colors"
                >
                  {settings?.email || 'contacto@lumora.ao'}
                </a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#C6A66B] shrink-0 mt-0.5" />
                <span>Base de operações em Luanda, Angola</span>
              </li>
            </ul>
          </div>

          {/* Col 4: Operations & Security */}
          <div className="space-y-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#C6A66B] block">
              Garantia & Pagamento
            </span>
            <p className="text-[#F8F8F6]/70 leading-relaxed text-xs">
              Aceitamos TPA Multicaixa e numerário na entrega em Luanda. Transferências seguras via BAI e BFA.
            </p>
            <div className="pt-2">
              <button
                type="button"
                onClick={onOpenAdmin}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-white/10 text-[#F8F8F6]/70 hover:text-[#C6A66B] rounded border border-white/10 transition-colors text-[11px]"
              >
                <Shield className="w-3.5 h-3.5" />
                <span>Acesso Administrativo</span>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Todos os direitos reservados a Cátia Catumbela */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#F8F8F6]/70">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 text-center sm:text-left">
            <span>© {new Date().getFullYear()} LUMORA.</span>
            <span className="text-[#F8F8F6] font-medium">Todos os direitos reservados a Cátia Catumbela.</span>
          </div>

          <div className="text-[#F8F8F6]/50 text-center sm:text-right">
            Moeda Oficial: Kwanza Angolano (Kz / AOA)
          </div>
        </div>
      </div>
    </footer>
  );
};
