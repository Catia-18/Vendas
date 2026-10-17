import React, { useState } from 'react';
import { Product, DeliveryZone, StoreSettings } from '../../types';
import { AdminOrders } from './AdminOrders';
import { AdminProduct } from './AdminProduct';
import { AdminDelivery } from './AdminDelivery';
import { AdminSettings } from './AdminSettings';
import { AdminStats } from './AdminStats';
import {
  Package,
  Sliders,
  Truck,
  Settings,
  BarChart3,
  LogOut,
  ArrowLeft,
  ShieldCheck
} from 'lucide-react';

interface AdminDashboardProps {
  token: string;
  product: Product;
  zones: DeliveryZone[];
  settings: StoreSettings;
  onProductUpdated: (product: Product) => void;
  onZonesUpdated: (zones: DeliveryZone[]) => void;
  onSettingsUpdated: (settings: StoreSettings) => void;
  onLogout: () => void;
  onBackToStore: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  token,
  product,
  zones,
  settings,
  onProductUpdated,
  onZonesUpdated,
  onSettingsUpdated,
  onLogout,
  onBackToStore
}) => {
  const [activeTab, setActiveTab] = useState<
    'orders' | 'product' | 'delivery' | 'settings' | 'stats'
  >('orders');

  return (
    <div className="min-h-screen bg-[#F8F8F6] text-[#17191C] flex flex-col">
      {/* Top Admin Navigation Header */}
      <header className="bg-[#17191C] text-[#F8F8F6] border-b border-white/10 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={onBackToStore}
              className="inline-flex items-center gap-1.5 text-xs text-[#F8F8F6]/70 hover:text-white transition-colors px-2 py-1 rounded hover:bg-white/5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Ver Loja</span>
            </button>

            <div className="h-5 w-px bg-white/15 hidden sm:block" />

            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#C6A66B]" />
              <span className="font-display font-bold tracking-wider text-base sm:text-lg">
                LUMORA
              </span>
              <span className="text-[11px] font-mono text-[#C6A66B] bg-white/5 px-2 py-0.5 rounded border border-white/10">
                Painel Gestão
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-1.5 text-xs text-[#F8F8F6]/60">
              <ShieldCheck className="w-4 h-4 text-[#C6A66B]" />
              <span>Sessão Segura</span>
            </div>

            <button
              onClick={onLogout}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-red-200 hover:text-white bg-red-950/40 hover:bg-red-900/60 rounded border border-red-800/60 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Terminar Sessão</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex overflow-x-auto gap-1 border-t border-white/5 text-xs">
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-3 font-semibold whitespace-nowrap transition-colors border-b-2 flex items-center gap-2 ${
              activeTab === 'orders'
                ? 'border-[#C6A66B] text-[#C6A66B]'
                : 'border-transparent text-[#F8F8F6]/70 hover:text-white'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Encomendas</span>
          </button>

          <button
            onClick={() => setActiveTab('stats')}
            className={`px-4 py-3 font-semibold whitespace-nowrap transition-colors border-b-2 flex items-center gap-2 ${
              activeTab === 'stats'
                ? 'border-[#C6A66B] text-[#C6A66B]'
                : 'border-transparent text-[#F8F8F6]/70 hover:text-white'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Estatísticas de Vendas</span>
          </button>

          <button
            onClick={() => setActiveTab('product')}
            className={`px-4 py-3 font-semibold whitespace-nowrap transition-colors border-b-2 flex items-center gap-2 ${
              activeTab === 'product'
                ? 'border-[#C6A66B] text-[#C6A66B]'
                : 'border-transparent text-[#F8F8F6]/70 hover:text-white'
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span>Produto & Preço</span>
          </button>

          <button
            onClick={() => setActiveTab('delivery')}
            className={`px-4 py-3 font-semibold whitespace-nowrap transition-colors border-b-2 flex items-center gap-2 ${
              activeTab === 'delivery'
                ? 'border-[#C6A66B] text-[#C6A66B]'
                : 'border-transparent text-[#F8F8F6]/70 hover:text-white'
            }`}
          >
            <Truck className="w-4 h-4" />
            <span>Zonas de Entrega</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`px-4 py-3 font-semibold whitespace-nowrap transition-colors border-b-2 flex items-center gap-2 ${
              activeTab === 'settings'
                ? 'border-[#C6A66B] text-[#C6A66B]'
                : 'border-transparent text-[#F8F8F6]/70 hover:text-white'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>Configurações & Bancos</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'orders' && <AdminOrders token={token} />}
        {activeTab === 'stats' && <AdminStats token={token} />}
        {activeTab === 'product' && (
          <AdminProduct
            token={token}
            product={product}
            onProductUpdated={onProductUpdated}
          />
        )}
        {activeTab === 'delivery' && (
          <AdminDelivery
            token={token}
            zones={zones}
            onZonesUpdated={onZonesUpdated}
          />
        )}
        {activeTab === 'settings' && (
          <AdminSettings
            token={token}
            settings={settings}
            onSettingsUpdated={onSettingsUpdated}
          />
        )}
      </main>
    </div>
  );
};
