import React from 'react';
import { Eye, Layers, Compass, BatteryCharging, Radio, Check } from 'lucide-react';
import { Product } from '../types';

interface BenefitsProps {
  product: Product | null;
}

export const Benefits: React.FC<BenefitsProps> = ({ product }) => {
  const verifiedBenefits = [
    {
      icon: Eye,
      title: 'Iluminação para armários e roupeiros',
      description:
        'Localiza peças de vestuário e acessórios com facilidade sem acender a lâmpada principal do quarto nem incomodar quem dorme.'
    },
    {
      icon: Layers,
      title: 'Instalação prática sem furar paredes',
      description:
        'Acompanha base metálica adesiva de alto poder de aderência. Basta colar onde precisares e a luminária acopla-se magneticamente.'
    },
    {
      icon: Compass,
      title: 'Ideal para espaços com pouca luz',
      description:
        'Perfeita para corredores, escadas, despensas, gaveteiros e recantos onde não existem tomadas nem fiação embutida.'
    },
    {
      icon: BatteryCharging,
      title: 'Funcionamento recarregável via USB-C',
      description:
        'Economiza dinheiro e protege o ambiente dispensando pilhas descartáveis. Recarrega comodamente com o cabo USB-C incluído.'
    },
    {
      icon: Radio,
      title: 'Sensor inteligente de movimento',
      description:
        'Detecta a tua aproximação em ambientes com pouca luz e acende a iluminação de imediato, desligando-se após um período de inactividade.'
    }
  ];

  return (
    <section id="beneficios" className="py-20 bg-[#F8F8F6] text-[#17191C] border-b border-[#E4E4E7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-16">
          <div className="text-xs font-semibold uppercase tracking-wider text-[#C6A66B] mb-2">
            Vantagens Comprovadas
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-display tracking-tight text-[#17191C] text-balance">
            Desenhada para os momentos em que precisas de luz sem complicações
          </h2>
          <p className="mt-4 text-base text-[#52525B] leading-relaxed">
            Elimina zonas escuras da tua casa com uma peça minimalista em alumínio anodizado,
            pronta a instalar em menos de um minuto.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {verifiedBenefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <div
                key={index}
                className="bg-white p-6 rounded-lg border border-[#E4E4E7] hover:border-[#C6A66B]/50 transition-colors shadow-xs"
              >
                <div className="w-10 h-10 rounded-md bg-[#17191C] text-[#C6A66B] flex items-center justify-center mb-5">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-semibold text-[#17191C] mb-2">
                  {benefit.title}
                </h3>
                <p className="text-sm text-[#52525B] leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            );
          })}

          {/* Verification Transparency Box */}
          <div className="bg-[#17191C] text-[#F8F8F6] p-6 rounded-lg flex flex-col justify-between">
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-[#C6A66B] mb-2">
                Compromisso LUMORA
              </div>
              <h3 className="text-lg font-semibold text-[#F8F8F6] mb-3">
                Transparência com o cliente
              </h3>
              <p className="text-xs text-[#F8F8F6]/80 leading-relaxed space-y-2">
                Na LUMORA comunicamos apenas as características verificadas do produto.
                Não inventamos durações de bateria fantasiosas nem resistências sem certificação.
                Recebes exatamente o produto conforme apresentado.
              </p>
            </div>
            <div className="mt-4 pt-4 border-t border-white/10 flex items-center gap-2 text-xs text-[#C6A66B]">
              <Check className="w-4 h-4" />
              <span>Garantia de conformidade na entrega</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
