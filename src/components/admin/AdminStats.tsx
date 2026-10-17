import React, { useState, useEffect } from 'react';
import { SalesAnalytics } from '../../types';
import { fetchAdminStats } from '../../services/api';
import {
  TrendingUp,
  DollarSign,
  PackageCheck,
  ShoppingBag,
  Clock,
  XCircle,
  Truck,
  Layers,
  RefreshCw
} from 'lucide-react';

interface AdminStatsProps {
  token: string;
}

export const AdminStats: React.FC<AdminStatsProps> = ({ token }) => {
  const [stats, setStats] = useState<SalesAnalytics | null>(null);
  const [loading, setLoading] = useState(true);

  const loadStats = async () => {
    try {
      setLoading(true);
      const data = await fetchAdminStats(token);
      setStats(data);
    } catch (err) {
      console.error('Error loading stats', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, [token]);

  const formatKz = (val: number) => new Intl.NumberFormat('pt-AO').format(val);

  if (loading || !stats) {
    return (
      <div className="py-16 text-center text-xs text-[#71717A]">
        A carregar métricas de vendas...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold font-display text-[#17191C]">
            Estatísticas Comerciais & Facturação
          </h2>
          <p className="text-xs text-[#71717A]">
            Monitorização de vendas em Angola com distinção clara entre receita recebida e facturação prevista.
          </p>
        </div>

        <button
          onClick={loadStats}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#17191C] bg-white border border-[#E4E4E7] rounded-md hover:bg-slate-50 transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Actualizar</span>
        </button>
      </div>

      {/* Primary KPI Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Actual Received Revenue */}
        <div className="bg-white p-5 rounded-xl border border-emerald-200 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between text-xs text-[#71717A] mb-2">
            <span className="font-semibold text-emerald-800 uppercase tracking-wider text-[11px]">
              Receita Efectiva
            </span>
            <div className="w-8 h-8 rounded-md bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold font-display text-[#17191C] font-mono tabular-nums">
            {formatKz(stats.actualRevenue)} Kz
          </div>
          <span className="text-[11px] text-emerald-700 mt-1 block">
            ✓ Montante confirmado e pago
          </span>
        </div>

        {/* Potential Billing */}
        <div className="bg-white p-5 rounded-xl border border-indigo-200 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between text-xs text-[#71717A] mb-2">
            <span className="font-semibold text-indigo-800 uppercase tracking-wider text-[11px]">
              Facturação Prevista
            </span>
            <div className="w-8 h-8 rounded-md bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold font-display text-[#17191C] font-mono tabular-nums">
            {formatKz(stats.potentialBilling)} Kz
          </div>
          <span className="text-[11px] text-indigo-700 mt-1 block">
            Todas encomendas não canceladas
          </span>
        </div>

        {/* Total Units Sold */}
        <div className="bg-white p-5 rounded-xl border border-[#E4E4E7] shadow-xs">
          <div className="flex items-center justify-between text-xs text-[#71717A] mb-2">
            <span className="font-semibold text-[#17191C] uppercase tracking-wider text-[11px]">
              Unidades Vendidas
            </span>
            <div className="w-8 h-8 rounded-md bg-slate-100 text-[#17191C] flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold font-display text-[#17191C] font-mono tabular-nums">
            {stats.unitsSold}
          </div>
          <span className="text-[11px] text-[#71717A] mt-1 block">
            Luminárias encomendadas
          </span>
        </div>

        {/* Average Order Value (AOV) */}
        <div className="bg-white p-5 rounded-xl border border-[#E4E4E7] shadow-xs">
          <div className="flex items-center justify-between text-xs text-[#71717A] mb-2">
            <span className="font-semibold text-[#17191C] uppercase tracking-wider text-[11px]">
              Valor Médio / Pedido
            </span>
            <div className="w-8 h-8 rounded-md bg-slate-100 text-[#17191C] flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold font-display text-[#17191C] font-mono tabular-nums">
            {formatKz(stats.averageOrderValue)} Kz
          </div>
          <span className="text-[11px] text-[#71717A] mt-1 block">
            Ticket médio com portes
          </span>
        </div>
      </div>

      {/* Orders Volume Funnel Breakdown */}
      <div className="bg-white p-6 rounded-xl border border-[#E4E4E7] shadow-xs space-y-4">
        <h3 className="font-bold text-sm text-[#17191C] border-b border-[#E4E4E7] pb-2">
          Distribuição dos Volumes de Encomenda
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div className="p-4 bg-[#F8F8F6] rounded-lg border border-[#E4E4E7]">
            <span className="text-xs text-[#71717A] block">Total de Pedidos</span>
            <span className="text-2xl font-bold font-mono text-[#17191C] tabular-nums mt-1 block">
              {stats.totalOrders}
            </span>
          </div>

          <div className="p-4 bg-indigo-50/50 rounded-lg border border-indigo-100">
            <span className="text-xs text-indigo-800 block">Confirmadas</span>
            <span className="text-2xl font-bold font-mono text-indigo-900 tabular-nums mt-1 block">
              {stats.confirmedOrders}
            </span>
          </div>

          <div className="p-4 bg-emerald-50/50 rounded-lg border border-emerald-100">
            <span className="text-xs text-emerald-800 block">Entregues com Sucesso</span>
            <span className="text-2xl font-bold font-mono text-emerald-900 tabular-nums mt-1 block">
              {stats.deliveredOrders}
            </span>
          </div>

          <div className="p-4 bg-red-50/50 rounded-lg border border-red-100">
            <span className="text-xs text-red-800 block">Canceladas</span>
            <span className="text-2xl font-bold font-mono text-red-900 tabular-nums mt-1 block">
              {stats.cancelledOrders}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
