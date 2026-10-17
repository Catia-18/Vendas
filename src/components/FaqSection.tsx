import React, { useState } from 'react';
import { FAQItem } from '../types';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';

interface FaqSectionProps {
  faqs: FAQItem[];
}

export const FaqSection: React.FC<FaqSectionProps> = ({ faqs }) => {
  const [openId, setOpenId] = useState<string | null>(faqs[0]?.id || null);

  const toggleFaq = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section id="faq" className="py-20 bg-white text-[#17191C] border-b border-[#E4E4E7]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#C6A66B] block mb-2">
            Esclarecimentos Frequentes
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-display tracking-tight text-[#17191C]">
            Perguntas Frequentes
          </h2>
          <p className="mt-3 text-sm sm:text-base text-[#52525B]">
            Respostas claras e transparentes sobre o funcionamento, entregas e pagamentos da LUMORA.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq) => {
            const isOpen = openId === faq.id;
            return (
              <div
                key={faq.id}
                className="rounded-lg border border-[#E4E4E7] overflow-hidden transition-colors"
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(faq.id)}
                  className="w-full px-6 py-4.5 text-left flex items-center justify-between gap-4 bg-[#F8F8F6] hover:bg-slate-100 transition-colors"
                >
                  <span className="text-sm sm:text-base font-semibold text-[#17191C]">
                    {faq.question}
                  </span>
                  <div className="text-[#C6A66B] shrink-0">
                    {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </div>
                </button>

                {isOpen && (
                  <div className="px-6 py-4 bg-white text-xs sm:text-sm text-[#52525B] leading-relaxed border-t border-[#E4E4E7]">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
