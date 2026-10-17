import React from 'react';
import { ClipboardList, CheckCircle, PackageCheck } from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      number: '01',
      icon: ClipboardList,
      title: 'Escolhe a quantidade e preenche os teus dados',
      description:
        'Indica quantas unidades desejas e introduz o teu nome, telefone e endereço exacto em Luanda ou noutra província de Angola.'
    },
    {
      number: '02',
      icon: CheckCircle,
      title: 'Confirma a encomenda e os custos de entrega',
      description:
        'A taxa de entrega é calculada com clareza para o teu município antes de finalizares. Não existem custos ocultos.'
    },
    {
      number: '03',
      icon: PackageCheck,
      title: 'Recebe o produto e paga pelo método escolhido',
      description:
        'O estafeta contacta-te antes da entrega. Paga comodamente na recepção (TPA Multicaixa ou dinheiro) ou por transferência bancária.'
    }
  ];

  return (
    <section id="como-funciona" className="py-20 bg-[#17191C] text-[#F8F8F6] border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#C6A66B] block mb-2">
            Processo Transparente
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-display tracking-tight text-[#F8F8F6]">
            Como comprar em 3 passos simples
          </h2>
          <p className="mt-3 text-sm sm:text-base text-[#F8F8F6]/75">
            Sem necessidade de criar contas ou preencher cadastros demorados. Simples, rápido e seguro.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={idx}
                className="bg-[#23272B] p-8 rounded-xl border border-white/10 relative flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-3xl font-bold font-display text-[#C6A66B]/50 font-mono">
                      {step.number}
                    </span>
                    <div className="w-10 h-10 rounded-md bg-[#17191C] text-[#C6A66B] flex items-center justify-center border border-white/10">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  <h3 className="text-lg font-semibold text-[#F8F8F6] mb-3">
                    {step.title}
                  </h3>

                  <p className="text-sm text-[#F8F8F6]/75 leading-relaxed">
                    {step.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-white/10 text-xs text-[#C6A66B] font-medium">
                  Passo {idx + 1} de 3
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
