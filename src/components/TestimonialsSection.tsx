import React, { useState, useEffect } from 'react';
import {
  Star,
  CheckCircle2,
  ThumbsUp,
  MessageSquare,
  Sparkles,
  ShieldCheck,
  PlusCircle,
  X,
  Send,
  SlidersHorizontal,
  Home,
  Utensils,
  Moon,
  Layers,
  ArrowRight
} from 'lucide-react';
import { CustomerTestimonial, AppTab } from '../types';
import { DEFAULT_TESTIMONIALS } from '../data/defaultStore';
import {
  saveTestimonialToFirestore,
  getTestimonialsFromFirestore
} from '../services/firestoreService';

interface TestimonialsSectionProps {
  onGoToCheckout?: () => void;
  onSelectTab?: (tab: AppTab) => void;
}

export const TestimonialsSection: React.FC<TestimonialsSectionProps> = ({
  onGoToCheckout,
  onSelectTab
}) => {
  // Load testimonials with user persistence in localStorage
  const [testimonials, setTestimonials] = useState<CustomerTestimonial[]>(() => {
    try {
      const saved = localStorage.getItem('lumora_user_testimonials');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return [...parsed, ...DEFAULT_TESTIMONIALS];
        }
      }
    } catch (e) {
      console.warn('Could not read user testimonials from localStorage', e);
    }
    return DEFAULT_TESTIMONIALS;
  });

  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [helpfulLiked, setHelpfulLiked] = useState<Record<string, boolean>>({});
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [submitSuccess, setSubmitSuccess] = useState<boolean>(false);

  // New review form state
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    rating: 5,
    title: '',
    comment: '',
    useCase: 'roupeiro' as 'roupeiro' | 'cozinha' | 'sensor_noturno' | 'escadas_corredor' | 'geral',
    useCaseLabel: 'Roupeiro & Closet'
  });

  // Sync with Firestore cloud database
  useEffect(() => {
    getTestimonialsFromFirestore()
      .then((cloudList) => {
        if (cloudList && cloudList.length > 0) {
          setTestimonials((prev) => {
            const userOnly = prev.filter((p) => p.id.startsWith('user-testim-'));
            const cloudIds = new Set(cloudList.map((c) => c.id));
            const uniqueUserOnly = userOnly.filter((u) => !cloudIds.has(u.id));
            return [...uniqueUserOnly, ...cloudList];
          });
        }
      })
      .catch((err) => console.warn('[Testimonials] Using cached testimonials:', err));
  }, []);

  const handleHelpfulClick = (id: string) => {
    if (helpfulLiked[id]) return;
    setHelpfulLiked((prev) => ({ ...prev, [id]: true }));
    setTestimonials((prev) =>
      prev.map((t) => (t.id === id ? { ...t, helpfulCount: (t.helpfulCount || 0) + 1 } : t))
    );
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.comment.trim() || !formData.title.trim()) {
      return;
    }

    const nameParts = formData.name.trim().split(' ');
    const initials =
      nameParts.length > 1
        ? `${nameParts[0][0]}${nameParts[nameParts.length - 1][0]}`.toUpperCase()
        : formData.name.slice(0, 2).toUpperCase();

    const newTestimonial: CustomerTestimonial = {
      id: `user-testim-${Date.now()}`,
      name: formData.name.trim(),
      location: formData.location.trim() || 'Luanda, Angola',
      rating: formData.rating,
      date: 'Hoje mesmo',
      verifiedPurchase: true,
      initials,
      title: formData.title.trim(),
      comment: formData.comment.trim(),
      useCase: formData.useCase,
      useCaseLabel: formData.useCaseLabel,
      productModel: 'LUMORA LED Recarregável 40cm',
      helpfulCount: 1
    };

    const updated = [newTestimonial, ...testimonials];
    setTestimonials(updated);

    // Save to Firestore cloud database
    saveTestimonialToFirestore(newTestimonial).catch((err) =>
      console.warn('[Firestore] Testimonial stored locally:', err)
    );

    try {
      const existingUser = JSON.parse(localStorage.getItem('lumora_user_testimonials') || '[]');
      localStorage.setItem(
        'lumora_user_testimonials',
        JSON.stringify([newTestimonial, ...existingUser])
      );
    } catch (err) {
      console.warn('Failed to save testimonial to localStorage', err);
    }

    setSubmitSuccess(true);
    setTimeout(() => {
      setSubmitSuccess(false);
      setIsModalOpen(false);
      setFormData({
        name: '',
        location: '',
        rating: 5,
        title: '',
        comment: '',
        useCase: 'roupeiro',
        useCaseLabel: 'Roupeiro & Closet'
      });
    }, 1800);
  };

  // Filter logic
  const filteredTestimonials = testimonials.filter((t) => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'roupeiro') return t.useCase === 'roupeiro';
    if (activeFilter === 'cozinha') return t.useCase === 'cozinha';
    if (activeFilter === 'sensor_noturno') return t.useCase === 'sensor_noturno';
    if (activeFilter === 'escadas_corredor') return t.useCase === 'escadas_corredor' || t.useCase === 'geral';
    return true;
  });

  const categories = [
    { id: 'all', label: 'Todos os Depoimentos', icon: Layers, count: testimonials.length },
    { id: 'roupeiro', label: 'Roupeiro & Closet', icon: Home, count: testimonials.filter((t) => t.useCase === 'roupeiro').length },
    { id: 'cozinha', label: 'Cozinha & Bancada', icon: Utensils, count: testimonials.filter((t) => t.useCase === 'cozinha').length },
    { id: 'sensor_noturno', label: 'Sensor Noturno & Escadas', icon: Moon, count: testimonials.filter((t) => t.useCase === 'sensor_noturno').length },
    { id: 'escadas_corredor', label: 'Instalação & Bateria', icon: Sparkles, count: testimonials.filter((t) => t.useCase === 'escadas_corredor' || t.useCase === 'geral').length }
  ];

  return (
    <section id="depoimentos" className="py-20 bg-[#F4F4F1] border-b border-[#E4E4E7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#17191C] text-[#C6A66B] text-xs font-bold uppercase tracking-wider mb-4 border border-[#C6A66B]/30 shadow-sm">
              <Star className="w-3.5 h-3.5 fill-[#C6A66B] text-[#C6A66B]" />
              <span>Depoimentos & Avaliações de Clientes</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-display tracking-tight text-[#17191C]">
              Experiências Reais com a LUMORA
            </h2>
            <p className="text-sm sm:text-base text-[#52525B] mt-3 leading-relaxed">
              Descobre como clientes em Luanda e em várias províncias de Angola utilizam a Luminária LED Recarregável com Sensor de Movimento para transformar os seus armários, cozinhas e corredores.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#17191C] hover:bg-[#25282C] text-[#F8F8F6] hover:text-[#C6A66B] font-semibold text-xs uppercase tracking-wider transition-all shadow-md border border-[#C6A66B]/40 hover:border-[#C6A66B] cursor-pointer group"
            >
              <PlusCircle className="w-4 h-4 text-[#C6A66B] group-hover:rotate-90 transition-transform" />
              <span>Partilhar a Minha Experiência</span>
            </button>
          </div>
        </div>

        {/* Aggregate Ratings & Highlights Banner */}
        <div className="bg-[#17191C] text-white rounded-2xl p-6 sm:p-8 mb-12 border border-white/10 shadow-xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
            {/* Score box */}
            <div className="flex flex-col items-center md:items-start md:border-r border-white/10 md:pr-6 text-center md:text-left">
              <div className="flex items-baseline gap-2">
                <span className="text-4xl sm:text-5xl font-extrabold font-display text-[#F8F8F6]">4.9</span>
                <span className="text-sm text-[#F8F8F6]/60">/ 5.0</span>
              </div>
              <div className="flex items-center gap-1 mt-2 text-[#C6A66B]">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-[#C6A66B]" />
                ))}
              </div>
              <p className="text-xs text-[#F8F8F6]/70 mt-2 font-medium">
                Baseado em mais de 380 clientes em Angola
              </p>
            </div>

            {/* Stat 1 */}
            <div className="flex items-start gap-4 p-3 rounded-xl bg-white/5 border border-white/5">
              <div className="w-10 h-10 rounded-lg bg-[#C6A66B]/20 text-[#C6A66B] flex items-center justify-center shrink-0 mt-0.5">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <span className="text-lg font-bold text-white block">98% Satisfação</span>
                <p className="text-xs text-white/70 mt-0.5 leading-relaxed">
                  Recomendam a compra para amigos e familiares em Luanda.
                </p>
              </div>
            </div>

            {/* Stat 2 */}
            <div className="flex items-start gap-4 p-3 rounded-xl bg-white/5 border border-white/5">
              <div className="w-10 h-10 rounded-lg bg-[#C6A66B]/20 text-[#C6A66B] flex items-center justify-center shrink-0 mt-0.5">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <span className="text-lg font-bold text-white block">100% Sem Furos</span>
                <p className="text-xs text-white/70 mt-0.5 leading-relaxed">
                  Fixação magnética 3M sem danificar paredes ou móveis.
                </p>
              </div>
            </div>

            {/* Stat 3 */}
            <div className="flex items-start gap-4 p-3 rounded-xl bg-white/5 border border-white/5">
              <div className="w-10 h-10 rounded-lg bg-[#C6A66B]/20 text-[#C6A66B] flex items-center justify-center shrink-0 mt-0.5">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <span className="text-lg font-bold text-white block">Compra Protegida</span>
                <p className="text-xs text-white/70 mt-0.5 leading-relaxed">
                  Pagamento na entrega por TPA Multicaixa ou transferência segura.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isActive = activeFilter === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveFilter(cat.id)}
                className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
                  isActive
                    ? 'bg-[#17191C] text-[#C6A66B] border-[#17191C] shadow-sm'
                    : 'bg-white text-[#52525B] border-[#E4E4E7] hover:border-[#C6A66B]/50 hover:text-[#17191C]'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#C6A66B]' : 'text-[#71717A]'}`} />
                <span>{cat.label}</span>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full ${
                    isActive ? 'bg-[#C6A66B]/20 text-[#C6A66B]' : 'bg-[#F4F4F5] text-[#71717A]'
                  }`}
                >
                  {cat.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Testimonial Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTestimonials.map((item) => {
            const isLiked = helpfulLiked[item.id];
            return (
              <article
                key={item.id}
                className="bg-white rounded-2xl p-6 border border-[#E4E4E7] shadow-sm hover:shadow-md hover:border-[#C6A66B]/50 transition-all flex flex-col justify-between group"
              >
                <div>
                  {/* Card Header: Avatar & Verified Info */}
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-full bg-[#17191C] text-[#C6A66B] font-bold text-sm flex items-center justify-center border border-[#C6A66B]/40 shrink-0">
                        {item.initials}
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-[#17191C] leading-snug">
                          {item.name}
                        </h4>
                        <div className="flex items-center gap-1.5 text-[11px] text-[#71717A] mt-0.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span className="font-medium text-emerald-700">Compra Verificada</span>
                          <span>•</span>
                          <span>{item.location}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Rating Stars & Date */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-1 text-[#C6A66B]">
                      {[...Array(item.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-[#C6A66B]" />
                      ))}
                    </div>
                    <span className="text-[11px] text-[#A1A1AA]">{item.date}</span>
                  </div>

                  {/* Testimonial Title */}
                  <h5 className="font-bold text-sm text-[#17191C] mb-2 group-hover:text-[#C6A66B] transition-colors leading-snug">
                    "{item.title}"
                  </h5>

                  {/* Testimonial Body */}
                  <p className="text-xs sm:text-sm text-[#52525B] leading-relaxed">
                    {item.comment}
                  </p>
                </div>

                {/* Card Footer: Use-case tag + Helpful button */}
                <div className="mt-5 pt-4 border-t border-[#F4F4F5] flex items-center justify-between gap-2 text-xs">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#F4F4F5] text-[#52525B] text-[11px] font-medium border border-[#E4E4E7]">
                    <Sparkles className="w-3 h-3 text-[#C6A66B]" />
                    <span>{item.useCaseLabel}</span>
                  </span>

                  <button
                    type="button"
                    onClick={() => handleHelpfulClick(item.id)}
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] transition-colors ${
                      isLiked
                        ? 'text-emerald-700 bg-emerald-50 font-semibold'
                        : 'text-[#71717A] hover:text-[#17191C] hover:bg-[#F4F4F5]'
                    }`}
                    title="Esta avaliação foi útil?"
                  >
                    <ThumbsUp className={`w-3.5 h-3.5 ${isLiked ? 'fill-emerald-600 text-emerald-600' : ''}`} />
                    <span>Útil ({item.helpfulCount || 0})</span>
                  </button>
                </div>
              </article>
            );
          })}
        </div>

        {/* Bottom Banner with CTA to Purchase / Inquire */}
        <div className="mt-14 bg-gradient-to-r from-[#17191C] via-[#202327] to-[#17191C] rounded-2xl p-6 sm:p-10 border border-[#C6A66B]/30 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="max-w-xl text-center md:text-left">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#C6A66B] block mb-2">
              Junta-te a centenas de lares satisfeitos
            </span>
            <h3 className="text-xl sm:text-2xl font-bold font-display text-white">
              Pronto para transformar a iluminação da tua casa?
            </h3>
            <p className="text-xs sm:text-sm text-white/70 mt-2 leading-relaxed">
              Recebe a tua Luminária LED Recarregável com Sensor de Movimento à porta de casa em Luanda com pagamento no acto da entrega ou envio rápido para qualquer província.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto shrink-0">
            {onGoToCheckout && (
              <button
                type="button"
                onClick={onGoToCheckout}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#C6A66B] hover:bg-[#d8b87c] text-[#17191C] font-bold text-xs uppercase tracking-wider transition-all shadow-lg hover:shadow-xl cursor-pointer"
              >
                <span>Fazer Encomenda Agora</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
            {onSelectTab && (
              <button
                type="button"
                onClick={() => onSelectTab('product')}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-xs uppercase tracking-wider transition-all border border-white/20"
              >
                <span>Ver Galeria & Preço</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Review Submission Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl border border-[#E4E4E7] relative">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 transition-colors p-1"
            >
              <X className="w-5 h-5" />
            </button>

            {submitSuccess ? (
              <div className="py-10 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold font-display text-[#17191C]">
                  Avaliação Enviada com Sucesso!
                </h3>
                <p className="text-sm text-[#52525B]">
                  Muito obrigado por partilhar a sua experiência com a LUMORA. O seu depoimento foi publicado e ajudará outros clientes a iluminar as suas casas com conforto.
                </p>
              </div>
            ) : (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Star className="w-5 h-5 text-[#C6A66B] fill-[#C6A66B]" />
                  <span className="text-xs font-bold uppercase tracking-wider text-[#C6A66B]">
                    Comunidade LUMORA Angola
                  </span>
                </div>
                <h3 className="text-xl font-bold font-display text-[#17191C] mb-1">
                  Deixar a sua Avaliação
                </h3>
                <p className="text-xs text-[#71717A] mb-6">
                  Conte-nos como tem sido a sua experiência com a Luminária LED Recarregável com Sensor de Movimento.
                </p>

                <form onSubmit={handleFormSubmit} className="space-y-4">
                  {/* Rating Selector */}
                  <div>
                    <label className="block text-xs font-semibold text-[#17191C] mb-1.5">
                      A tua Classificação Geral
                    </label>
                    <div className="flex items-center gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setFormData((prev) => ({ ...prev, rating: star }))}
                          className="p-1 hover:scale-110 transition-transform cursor-pointer"
                        >
                          <Star
                            className={`w-7 h-7 ${
                              star <= formData.rating
                                ? 'fill-[#C6A66B] text-[#C6A66B]'
                                : 'text-gray-300'
                            }`}
                          />
                        </button>
                      ))}
                      <span className="ml-2 text-xs font-semibold text-[#17191C]">
                        {formData.rating === 5 && 'Excelente (5/5)'}
                        {formData.rating === 4 && 'Muito Bom (4/5)'}
                        {formData.rating === 3 && 'Bom (3/5)'}
                        {formData.rating === 2 && 'Regular (2/5)'}
                        {formData.rating === 1 && 'Insatisfeito (1/5)'}
                      </span>
                    </div>
                  </div>

                  {/* Name & Location */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-[#17191C] mb-1">
                        O teu Nome Completo *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Ex: Maria António"
                        value={formData.name}
                        onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                        className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-[#E4E4E7] focus:border-[#C6A66B] focus:ring-1 focus:ring-[#C6A66B] outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#17191C] mb-1">
                        Localização em Angola *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Ex: Luanda (Kilamba) ou Benguela"
                        value={formData.location}
                        onChange={(e) =>
                          setFormData((prev) => ({ ...prev, location: e.target.value }))
                        }
                        className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-[#E4E4E7] focus:border-[#C6A66B] focus:ring-1 focus:ring-[#C6A66B] outline-none"
                      />
                    </div>
                  </div>

                  {/* Where Installed */}
                  <div>
                    <label className="block text-xs font-semibold text-[#17191C] mb-1">
                      Onde instalaste a luminária?
                    </label>
                    <select
                      value={formData.useCase}
                      onChange={(e) => {
                        const val = e.target.value as any;
                        const labels: Record<string, string> = {
                          roupeiro: 'Roupeiro & Closet',
                          cozinha: 'Cozinha & Bancada',
                          sensor_noturno: 'Sensor Noturno & Escadas',
                          escadas_corredor: 'Instalação Sem Furos',
                          geral: 'Outro Espaço da Casa'
                        };
                        setFormData((prev) => ({
                          ...prev,
                          useCase: val,
                          useCaseLabel: labels[val] || 'Aplicação Residencial'
                        }));
                      }}
                      className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-[#E4E4E7] focus:border-[#C6A66B] focus:ring-1 focus:ring-[#C6A66B] outline-none bg-white"
                    >
                      <option value="roupeiro">Dentro do Roupeiro / Armário / Closet</option>
                      <option value="cozinha">Sob o Armário da Cozinha / Bancada</option>
                      <option value="sensor_noturno">No Corredor / Junto às Escadas (Sensor Noturno)</option>
                      <option value="escadas_corredor">Na Parede / Despensa (Sem Furos)</option>
                      <option value="geral">Outro Espaço (Cabeceira, Secretária, etc.)</option>
                    </select>
                  </div>

                  {/* Review Title */}
                  <div>
                    <label className="block text-xs font-semibold text-[#17191C] mb-1">
                      Título da Avaliação *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Perfeita para ver roupas de manhã sem ligar luz forte"
                      value={formData.title}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, title: e.target.value }))
                      }
                      className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-[#E4E4E7] focus:border-[#C6A66B] focus:ring-1 focus:ring-[#C6A66B] outline-none"
                    />
                  </div>

                  {/* Review Comment */}
                  <div>
                    <label className="block text-xs font-semibold text-[#17191C] mb-1">
                      A tua Experiência Detalhada *
                    </label>
                    <textarea
                      required
                      rows={4}
                      placeholder="Conta como tem sido a autonomia da bateria, a sensibilidade do sensor no escuro, facilidade da fixação magnética ou a rapidez da entrega..."
                      value={formData.comment}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, comment: e.target.value }))
                      }
                      className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-[#E4E4E7] focus:border-[#C6A66B] focus:ring-1 focus:ring-[#C6A66B] outline-none resize-none"
                    />
                  </div>

                  {/* Submission Button */}
                  <div className="pt-2 flex items-center justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="px-4 py-2 text-xs font-semibold text-[#71717A] hover:text-[#17191C] transition-colors"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#C6A66B] hover:bg-[#d8b87c] text-[#17191C] font-bold text-xs uppercase tracking-wider transition-colors shadow-md"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Publicar Avaliação</span>
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
};
