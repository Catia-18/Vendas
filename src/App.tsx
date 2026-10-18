import React, { useState, useEffect } from 'react';
import { Product, DeliveryZone, StoreSettings, OrderConfirmationResult, AppTab } from './types';
import { fetchProduct, fetchDeliveryZones, fetchSettings, adminVerify } from './services/api';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Benefits } from './components/Benefits';
import { ProductGallery } from './components/ProductGallery';
import { HowItWorks } from './components/HowItWorks';
import { CheckoutForm } from './components/CheckoutForm';
import { OrderConfirmationModal } from './components/OrderConfirmationModal';
import { FaqSection } from './components/FaqSection';
import { Footer } from './components/Footer';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';
import { PoliciesModal } from './components/PoliciesModal';
import { LoginModal } from './components/LoginModal';
import { YouTubeVideoModal } from './components/YouTubeVideoModal';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { AlertCircle, RefreshCw, ArrowRight, Sparkles, Layers, ShieldCheck } from 'lucide-react';

import {
  INITIAL_PRODUCT,
  INITIAL_DELIVERY_ZONES,
  INITIAL_SETTINGS
} from './data/defaultStore';

export default function App() {
  const [product, setProduct] = useState<Product>(INITIAL_PRODUCT);
  const [deliveryZones, setDeliveryZones] = useState<DeliveryZone[]>(INITIAL_DELIVERY_ZONES);
  const [settings, setSettings] = useState<StoreSettings>(INITIAL_SETTINGS);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Active Navigation Tab: 'home' | 'product' | 'benefits' | 'how_it_works' | 'faq' | 'checkout'
  const [activeTab, setActiveTab] = useState<AppTab>('home');

  // Modals & Authentication
  const [isVideoModalOpen, setIsVideoModalOpen] = useState<boolean>(false);
  const [orderResult, setOrderResult] = useState<OrderConfirmationResult | null>(null);
  const [activePolicyKey, setActivePolicyKey] = useState<
    'terms' | 'privacy' | 'delivery' | 'returns' | null
  >(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);
  const [adminToken, setAdminToken] = useState<string | null>(() =>
    localStorage.getItem('lumora_admin_token')
  );
  const [isAdminView, setIsAdminView] = useState<boolean>(false);

  // Load store data
  const loadStoreData = async () => {
    try {
      setError(null);
      const [prodData, zonesData, settingsData] = await Promise.all([
        fetchProduct(),
        fetchDeliveryZones(false),
        fetchSettings()
      ]);
      if (prodData) setProduct(prodData);
      if (zonesData && zonesData.length > 0) setDeliveryZones(zonesData);
      if (settingsData) setSettings(settingsData);
    } catch (err: any) {
      console.warn('Usando dados predefinidos da loja (modo Vercel resiliente):', err);
      setProduct(INITIAL_PRODUCT);
      setDeliveryZones(INITIAL_DELIVERY_ZONES);
      setSettings(INITIAL_SETTINGS);
    }
  };

  useEffect(() => {
    loadStoreData();
  }, []);

  // Verify saved admin session on boot
  useEffect(() => {
    if (adminToken) {
      adminVerify(adminToken).then((isValid) => {
        if (!isValid) {
          setAdminToken(null);
          localStorage.removeItem('lumora_admin_token');
        }
      });
    }
  }, [adminToken]);

  const handleAdminLoginSuccess = (token: string) => {
    setAdminToken(token);
    localStorage.setItem('lumora_admin_token', token);
    setIsLoginModalOpen(false);
    setIsAdminView(true);
  };

  const handleAdminLogout = () => {
    setAdminToken(null);
    localStorage.removeItem('lumora_admin_token');
    setIsAdminView(false);
  };

  const handleOpenLogin = () => {
    if (adminToken) {
      setIsAdminView(true);
    } else {
      setIsLoginModalOpen(true);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#17191C] text-[#F8F8F6] flex flex-col items-center justify-center p-4">
        <div className="w-12 h-12 rounded-full border-2 border-[#C6A66B] border-t-transparent animate-spin mb-4" />
        <h1 className="text-xl font-bold font-display tracking-widest text-[#F8F8F6]">
          LUMORA
        </h1>
        <p className="text-xs text-[#F8F8F6]/60 mt-1">A carregar plataforma oficial de Angola...</p>
      </div>
    );
  }

  if (error || !product || !settings) {
    return (
      <div className="min-h-screen bg-[#F8F8F6] text-[#17191C] flex flex-col items-center justify-center p-6 text-center">
        <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
        <h2 className="text-xl font-bold font-display text-[#17191C]">
          Ocorreu um problema ao carregar a LUMORA
        </h2>
        <p className="text-sm text-[#52525B] mt-2 max-w-md">
          {error || 'Por favor verifica a tua ligação e tenta novamente.'}
        </p>
        <button
          onClick={loadStoreData}
          className="mt-6 px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-[#17191C] bg-[#C6A66B] hover:bg-[#d8b87c] rounded-md transition-colors flex items-center gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Tentar Novamente</span>
        </button>
      </div>
    );
  }

  // Admin Dashboard View
  if (isAdminView && adminToken) {
    return (
      <AdminDashboard
        token={adminToken}
        product={product}
        zones={deliveryZones}
        settings={settings}
        onProductUpdated={(updated) => setProduct(updated)}
        onZonesUpdated={(updated) => setDeliveryZones(updated)}
        onSettingsUpdated={(updated) => setSettings(updated)}
        onLogout={handleAdminLogout}
        onBackToStore={() => setIsAdminView(false)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F8F6] text-[#17191C] flex flex-col selection:bg-[#C6A66B]/30">
      {/* Navigation with structured tabs & Login button */}
      <Navbar
        settings={settings}
        activeTab={activeTab}
        onSelectTab={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenLogin={handleOpenLogin}
        onOpenVideo={() => setIsVideoModalOpen(true)}
      />

      {/* Main Content: Shows strictly the selected tab */}
      <main className="flex-1">
        {/* Tab 1: Início (LUMORA) -> Shows ONLY the brand hero and concept without price */}
        {activeTab === 'home' && (
          <div className="space-y-0 animate-in fade-in duration-150">
            <Hero
              product={product}
              onSelectTab={(tab) => {
                setActiveTab(tab);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onOpenVideo={() => setIsVideoModalOpen(true)}
            />

            {/* Quick Explore Chapters on Home */}
            <section className="py-16 bg-white border-b border-[#E4E4E7]">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-2xl mx-auto mb-12">
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#C6A66B] block mb-1">
                    Navegação da Plataforma
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-bold font-display tracking-tight text-[#17191C]">
                    Explora a Experiência LUMORA
                  </h2>
                  <p className="text-sm text-[#52525B] mt-2">
                    Clica nas secções acima ou nos atalhos abaixo para consultar especificações, benefícios ou finalizar a tua encomenda.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Card 1: O Produto */}
                  <div
                    onClick={() => {
                      setActiveTab('product');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="p-6 rounded-xl border border-[#E4E4E7] bg-[#F8F8F6] hover:border-[#C6A66B] hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
                  >
                    <div>
                      <div className="w-10 h-10 rounded-lg bg-[#17191C] text-[#C6A66B] flex items-center justify-center mb-4">
                        <Sparkles className="w-5 h-5" />
                      </div>
                      <h3 className="font-bold text-base text-[#17191C] group-hover:text-[#C6A66B] transition-colors">
                        O Produto & Galeria
                      </h3>
                      <p className="text-xs text-[#52525B] mt-2 leading-relaxed">
                        Conhece as dimensões, sistema magnético, acabamento em alumínio e detalhes da bateria recarregável.
                      </p>
                    </div>
                    <div className="mt-5 pt-3 border-t border-[#E4E4E7] flex items-center justify-between text-xs font-semibold text-[#17191C]">
                      <span>Ver Ficha Técnica</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>

                  {/* Card 2: Benefícios */}
                  <div
                    onClick={() => {
                      setActiveTab('benefits');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="p-6 rounded-xl border border-[#E4E4E7] bg-[#F8F8F6] hover:border-[#C6A66B] hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
                  >
                    <div>
                      <div className="w-10 h-10 rounded-lg bg-[#17191C] text-[#C6A66B] flex items-center justify-center mb-4">
                        <Layers className="w-5 h-5" />
                      </div>
                      <h3 className="font-bold text-base text-[#17191C] group-hover:text-[#C6A66B] transition-colors">
                        Vantagens & Aplicações
                      </h3>
                      <p className="text-xs text-[#52525B] mt-2 leading-relaxed">
                        Descobre como a luminária resolve a falta de luz em roupeiros, closets, corredores e despensas.
                      </p>
                    </div>
                    <div className="mt-5 pt-3 border-t border-[#E4E4E7] flex items-center justify-between text-xs font-semibold text-[#17191C]">
                      <span>Ver Vantagens</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>

                  {/* Card 3: Checkout */}
                  <div
                    onClick={() => {
                      setActiveTab('checkout');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="p-6 rounded-xl border border-[#C6A66B]/50 bg-[#17191C] text-white hover:shadow-lg transition-all cursor-pointer group flex flex-col justify-between"
                  >
                    <div>
                      <div className="w-10 h-10 rounded-lg bg-[#C6A66B] text-[#17191C] flex items-center justify-center mb-4 font-bold">
                        <ShieldCheck className="w-5 h-5" />
                      </div>
                      <h3 className="font-bold text-base text-[#F8F8F6] group-hover:text-[#C6A66B] transition-colors">
                        Fazer Encomenda Imediata
                      </h3>
                      <p className="text-xs text-white/70 mt-2 leading-relaxed">
                        Preenche os teus dados de entrega em Luanda ou províncias. Paga na entrega, por transferência ou cartão Stripe.
                      </p>
                    </div>
                    <div className="mt-5 pt-3 border-t border-white/10 flex items-center justify-between text-xs font-semibold text-[#C6A66B]">
                      <span>Ir para Checkout</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* Tab 2: O Produto */}
        {activeTab === 'product' && (
          <div className="animate-in fade-in duration-150">
            <ProductGallery
              product={product}
              onSelectTab={(tab) => {
                setActiveTab(tab);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onOpenVideo={() => setIsVideoModalOpen(true)}
            />
          </div>
        )}

        {/* Tab 3: Benefícios */}
        {activeTab === 'benefits' && (
          <div className="animate-in fade-in duration-150">
            <Benefits product={product} />
          </div>
        )}

        {/* Tab 4: Como Funciona */}
        {activeTab === 'how_it_works' && (
          <div className="animate-in fade-in duration-150">
            <HowItWorks />
          </div>
        )}

        {/* Tab 5: Perguntas Frequentes */}
        {activeTab === 'faq' && (
          <div className="animate-in fade-in duration-150">
            <FaqSection faqs={settings.faqs || []} />
          </div>
        )}

        {/* Tab 6: Fazer Encomenda */}
        {activeTab === 'checkout' && (
          <div className="animate-in fade-in duration-150">
            <CheckoutForm
              product={product}
              deliveryZones={deliveryZones}
              onOrderSuccess={(res) => setOrderResult(res)}
            />
          </div>
        )}
      </main>

      {/* Footer */}
      <Footer
        settings={settings}
        onOpenPolicy={(policy) => setActivePolicyKey(policy)}
        onOpenAdmin={handleOpenLogin}
      />

      {/* Floating WhatsApp Action */}
      <FloatingWhatsApp whatsappNumber={settings.whatsappNumber} />

      {/* Interactive Video Modal (Platform Native + YouTube API) */}
      <YouTubeVideoModal
        isOpen={isVideoModalOpen}
        videoUrl={product?.youtubeVideoUrl || 'https://www.youtube.com/watch?v=L24CqW2Hx34'}
        platformVideoUrl={product?.platformVideoUrl || '/assets/videos/luminaria_lumora_demonstracao.mp4'}
        productName={product?.name}
        onClose={() => setIsVideoModalOpen(false)}
        onGoToCheckout={() => {
          setActiveTab('checkout');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Order Confirmation Receipt Modal */}
      <OrderConfirmationModal
        result={orderResult}
        whatsappNumber={settings.whatsappNumber}
        onClose={() => setOrderResult(null)}
      />

      {/* Dedicated Login & Tracking Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onAdminLoginSuccess={handleAdminLoginSuccess}
        onClose={() => setIsLoginModalOpen(false)}
      />

      {/* Policies Modal */}
      <PoliciesModal
        policyKey={activePolicyKey}
        policies={settings.policies}
        onClose={() => setActivePolicyKey(null)}
      />
    </div>
  );
}
