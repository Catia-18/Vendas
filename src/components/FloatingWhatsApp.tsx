import React from 'react';
import { MessageCircle } from 'lucide-react';

interface FloatingWhatsAppProps {
  whatsappNumber: string;
}

export const FloatingWhatsApp: React.FC<FloatingWhatsAppProps> = ({ whatsappNumber }) => {
  const cleanNumber = whatsappNumber ? whatsappNumber.replace(/[^0-9]/g, '') : '';
  const message = encodeURIComponent(
    'Olá LUMORA! Gostaria de saber mais informações sobre a luminária LED recarregável.'
  );
  const href = cleanNumber ? `https://wa.me/${cleanNumber}?text=${message}` : '#';

  return (
    <aside aria-label="Apoio ao cliente no WhatsApp" className="fixed bottom-6 right-6 z-40">
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Falar com a LUMORA no WhatsApp"
        className="flex items-center gap-2.5 px-4 py-3 bg-[#25D366] text-white rounded-full shadow-lg hover:bg-[#20ba59] active:scale-95 transition-all group"
      >
        <MessageCircle className="w-5 h-5 fill-current shrink-0" />
        <span className="hidden sm:inline text-xs font-semibold tracking-wide whitespace-nowrap">
          Falar no WhatsApp
        </span>
      </a>
    </aside>
  );
};
