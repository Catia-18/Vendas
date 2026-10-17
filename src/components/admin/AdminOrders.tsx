import React, { useState, useEffect } from 'react';
import { Order, OrderStatus, PaymentStatus } from '../../types';
import { fetchAdminOrders, updateAdminOrder } from '../../services/api';
import {
  Search,
  Filter,
  MessageCircle,
  Clock,
  CheckCircle,
  Truck,
  XCircle,
  FileText,
  Save,
  X,
  RefreshCw,
  Phone
} from 'lucide-react';

interface AdminOrdersProps {
  token: string;
}

export const AdminOrders: React.FC<AdminOrdersProps> = ({ token }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [paymentFilter, setPaymentFilter] = useState('all');
  const [provinceFilter, setProvinceFilter] = useState('all');

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [newOrderStatus, setNewOrderStatus] = useState<OrderStatus>('new');
  const [newPaymentStatus, setNewPaymentStatus] = useState<PaymentStatus>('pending');
  const [internalNotes, setInternalNotes] = useState('');
  const [historyNote, setHistoryNote] = useState('');
  const [updating, setUpdating] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const data = await fetchAdminOrders(token, {
        search,
        orderStatus: statusFilter,
        paymentStatus: paymentFilter,
        province: provinceFilter
      });
      setOrders(data);
    } catch (err) {
      console.error('Failed to load orders', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, [search, statusFilter, paymentFilter, provinceFilter]);

  const openOrderDrawer = (order: Order) => {
    setSelectedOrder(order);
    setNewOrderStatus(order.orderStatus);
    setNewPaymentStatus(order.paymentStatus);
    setInternalNotes(order.internalNotes || '');
    setHistoryNote('');
    setSaveSuccess(false);
  };

  const handleUpdateOrder = async () => {
    if (!selectedOrder) return;
    setUpdating(true);
    setSaveSuccess(false);

    try {
      const res = await updateAdminOrder(token, selectedOrder.id, {
        orderStatus: newOrderStatus,
        paymentStatus: newPaymentStatus,
        internalNotes,
        historyNote: historyNote.trim() || undefined
      });

      setSelectedOrder(res.order);
      setOrders((prev) => prev.map((o) => (o.id === res.order.id ? res.order : o)));
      setSaveSuccess(true);
      setHistoryNote('');
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      alert('Erro ao guardar alterações');
    } finally {
      setUpdating(false);
    }
  };

  const formatKz = (val: number) => new Intl.NumberFormat('pt-AO').format(val);

  const getOrderStatusLabel = (status: OrderStatus) => {
    const map: Record<OrderStatus, string> = {
      new: 'Nova Encomenda',
      awaiting_confirmation: 'Aguardando Confirmação',
      confirmed: 'Confirmada',
      preparing: 'Em Preparação',
      shipped: 'Enviada',
      delivered: 'Entregue',
      cancelled: 'Cancelada'
    };
    return map[status] || status;
  };

  const getOrderStatusColor = (status: OrderStatus) => {
    switch (status) {
      case 'new':
        return 'text-blue-700 bg-blue-50 border-blue-200';
      case 'awaiting_confirmation':
        return 'text-amber-800 bg-amber-50 border-amber-200';
      case 'confirmed':
        return 'text-indigo-700 bg-indigo-50 border-indigo-200';
      case 'preparing':
        return 'text-purple-700 bg-purple-50 border-purple-200';
      case 'shipped':
        return 'text-cyan-700 bg-cyan-50 border-cyan-200';
      case 'delivered':
        return 'text-emerald-700 bg-emerald-50 border-emerald-200';
      case 'cancelled':
        return 'text-red-700 bg-red-50 border-red-200';
      default:
        return 'text-slate-700 bg-slate-50 border-slate-200';
    }
  };

  const getPaymentStatusLabel = (status: PaymentStatus) => {
    switch (status) {
      case 'paid':
        return 'Pago';
      case 'pending':
        return 'Pendente';
      case 'cancelled':
        return 'Cancelado / Reembolsado';
    }
  };

  const getPaymentStatusColor = (status: PaymentStatus) => {
    switch (status) {
      case 'paid':
        return 'text-emerald-700 bg-emerald-50 border-emerald-200';
      case 'pending':
        return 'text-amber-800 bg-amber-50 border-amber-200';
      case 'cancelled':
        return 'text-red-700 bg-red-50 border-red-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold font-display text-[#17191C]">
            Gestão de Encomendas ({orders.length})
          </h2>
          <p className="text-xs text-[#71717A]">
            Acompanha pedidos recebidos, actualiza estados de envio e valida pagamentos.
          </p>
        </div>

        <button
          onClick={loadOrders}
          disabled={loading}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#17191C] bg-white border border-[#E4E4E7] rounded-md hover:bg-slate-50 transition-colors"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Actualizar Lista</span>
        </button>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-xl border border-[#E4E4E7] shadow-xs grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 text-[#71717A] absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Pesquisar por código, cliente ou telefone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-[#F8F8F6] rounded-md border border-[#E4E4E7] focus:outline-none focus:ring-1 focus:ring-[#C6A66B]"
          />
        </div>

        {/* Order Status */}
        <div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-3 py-2 bg-[#F8F8F6] rounded-md border border-[#E4E4E7] focus:outline-none focus:ring-1 focus:ring-[#C6A66B]"
          >
            <option value="all">Todos os Estados de Encomenda</option>
            <option value="new">Nova Encomenda</option>
            <option value="awaiting_confirmation">Aguardando Confirmação</option>
            <option value="confirmed">Confirmada</option>
            <option value="preparing">Em Preparação</option>
            <option value="shipped">Enviada</option>
            <option value="delivered">Entregue</option>
            <option value="cancelled">Cancelada</option>
          </select>
        </div>

        {/* Payment Status */}
        <div>
          <select
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value)}
            className="w-full px-3 py-2 bg-[#F8F8F6] rounded-md border border-[#E4E4E7] focus:outline-none focus:ring-1 focus:ring-[#C6A66B]"
          >
            <option value="all">Todos os Pagamentos</option>
            <option value="pending">Pagamento Pendente</option>
            <option value="paid">Pagamento Confirmado (Pago)</option>
            <option value="cancelled">Pagamento Cancelado</option>
          </select>
        </div>

        {/* Province Filter */}
        <div>
          <select
            value={provinceFilter}
            onChange={(e) => setProvinceFilter(e.target.value)}
            className="w-full px-3 py-2 bg-[#F8F8F6] rounded-md border border-[#E4E4E7] focus:outline-none focus:ring-1 focus:ring-[#C6A66B]"
          >
            <option value="all">Todas as Províncias</option>
            <option value="Luanda">Luanda</option>
            <option value="Benguela">Benguela</option>
            <option value="Huambo">Huambo</option>
            <option value="Huíla">Huíla</option>
            <option value="Cabinda">Cabinda</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-xl border border-[#E4E4E7] shadow-xs overflow-hidden">
        {loading ? (
          <div className="py-16 text-center text-xs text-[#71717A]">
            A carregar encomendas...
          </div>
        ) : orders.length === 0 ? (
          <div className="py-16 text-center text-xs text-[#71717A] space-y-1">
            <p className="font-semibold text-sm text-[#17191C]">Nenhuma encomenda encontrada</p>
            <p>Tenta ajustar os filtros de pesquisa ou aguarda novos pedidos.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#F8F8F6] text-[#71717A] border-b border-[#E4E4E7] uppercase tracking-wider text-[11px] font-semibold">
                  <th className="py-3 px-4">Código / Data</th>
                  <th className="py-3 px-4">Cliente & Contacto</th>
                  <th className="py-3 px-4">Localização</th>
                  <th className="py-3 px-4 text-center">Qtd</th>
                  <th className="py-3 px-4">Total</th>
                  <th className="py-3 px-4">Estado Encomenda</th>
                  <th className="py-3 px-4">Pagamento</th>
                  <th className="py-3 px-4 text-right">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E4E4E7]">
                {orders.map((order) => {
                  const dateStr = new Date(order.createdAt).toLocaleDateString('pt-AO', {
                    day: '2-digit',
                    month: 'short',
                    hour: '2-digit',
                    minute: '2-digit'
                  });

                  return (
                    <tr
                      key={order.id}
                      onClick={() => openOrderDrawer(order)}
                      className="hover:bg-slate-50/80 cursor-pointer transition-colors"
                    >
                      <td className="py-3.5 px-4">
                        <span className="font-mono font-bold text-[#17191C] block">
                          {order.id}
                        </span>
                        <span className="text-[11px] text-[#71717A]">{dateStr}</span>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="font-semibold text-[#17191C] block">
                          {order.customerName}
                        </span>
                        <span className="text-[11px] text-[#71717A] font-mono">
                          {order.customerPhone}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="font-medium text-[#17191C] block">
                          {order.municipality}, {order.province}
                        </span>
                        <span className="text-[11px] text-[#71717A] truncate max-w-xs block">
                          {order.neighborhood || order.address}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-center font-mono font-bold">
                        {order.quantity}
                      </td>

                      <td className="py-3.5 px-4 font-mono font-bold text-[#17191C] tabular-nums">
                        {formatKz(order.total)} Kz
                      </td>

                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold border ${getOrderStatusColor(
                            order.orderStatus
                          )}`}
                        >
                          {getOrderStatusLabel(order.orderStatus)}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold border ${getPaymentStatusColor(
                            order.paymentStatus
                          )}`}
                        >
                          {getPaymentStatusLabel(order.paymentStatus)}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            openOrderDrawer(order);
                          }}
                          className="px-2.5 py-1 text-xs font-medium text-[#17191C] bg-[#F8F8F6] hover:bg-slate-200 border border-[#E4E4E7] rounded transition-colors"
                        >
                          Gerir
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Order Detail Modal / Drawer */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full border border-[#E4E4E7] shadow-2xl overflow-hidden my-6 space-y-5 animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="bg-[#17191C] text-[#F8F8F6] p-6 flex items-center justify-between">
              <div>
                <span className="text-xs uppercase tracking-wider text-[#C6A66B] font-mono block">
                  Detalhes da Encomenda
                </span>
                <h3 className="text-xl font-bold font-display text-[#F8F8F6]">
                  {selectedOrder.id} · {selectedOrder.customerName}
                </h3>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-1.5 text-white/60 hover:text-white rounded hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6 text-xs max-h-[75vh] overflow-y-auto">
              {saveSuccess && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  <span>Estado e notas actualizados com sucesso!</span>
                </div>
              )}

              {/* Customer & Delivery Data */}
              <div className="bg-[#F8F8F6] p-4 rounded-lg border border-[#E4E4E7] space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="font-bold text-sm text-[#17191C] block">
                      {selectedOrder.customerName}
                    </span>
                    <a
                      href={`tel:${selectedOrder.customerPhone}`}
                      className="text-[#C6A66B] font-mono font-medium hover:underline flex items-center gap-1 mt-0.5"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      {selectedOrder.customerPhone}
                    </a>
                  </div>

                  <a
                    href={`https://wa.me/${selectedOrder.customerPhone.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 px-3 py-1 bg-[#25D366] text-white rounded font-medium hover:bg-[#20ba59] transition-colors"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    Abrir no WhatsApp
                  </a>
                </div>

                <div className="pt-2 border-t border-[#E4E4E7] space-y-1 text-[#52525B]">
                  <div>
                    <strong>Endereço:</strong> {selectedOrder.address}, Bairro{' '}
                    {selectedOrder.neighborhood || 'N/A'}, {selectedOrder.municipality},{' '}
                    {selectedOrder.province}
                  </div>
                  <div>
                    <strong>Ponto de Referência:</strong> {selectedOrder.referencePoint}
                  </div>
                  {selectedOrder.notes && (
                    <div>
                      <strong>Observações do Cliente:</strong>{' '}
                      <span className="italic">{selectedOrder.notes}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Financial Breakup */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                <div className="p-3 bg-slate-50 rounded border border-[#E4E4E7]">
                  <span className="text-[11px] text-[#71717A] block">Quantidade</span>
                  <span className="font-mono font-bold text-base text-[#17191C]">
                    {selectedOrder.quantity} un.
                  </span>
                </div>
                <div className="p-3 bg-slate-50 rounded border border-[#E4E4E7]">
                  <span className="text-[11px] text-[#71717A] block">Subtotal</span>
                  <span className="font-mono font-bold text-sm text-[#17191C]">
                    {formatKz(selectedOrder.subtotal)} Kz
                  </span>
                </div>
                <div className="p-3 bg-slate-50 rounded border border-[#E4E4E7]">
                  <span className="text-[11px] text-[#71717A] block">Entrega</span>
                  <span className="font-mono font-bold text-sm text-[#17191C]">
                    {formatKz(selectedOrder.deliveryFee)} Kz
                  </span>
                </div>
                <div className="p-3 bg-[#17191C] text-white rounded">
                  <span className="text-[11px] text-[#C6A66B] block">Total Geral</span>
                  <span className="font-mono font-bold text-base text-[#C6A66B]">
                    {formatKz(selectedOrder.total)} Kz
                  </span>
                </div>
              </div>

              {/* Status Update Form */}
              <div className="border border-[#E4E4E7] rounded-lg p-4 space-y-4">
                <h4 className="font-bold text-sm text-[#17191C]">
                  Actualizar Estados Operacionais
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#17191C] mb-1">
                      Estado da Encomenda (Entrega)
                    </label>
                    <select
                      value={newOrderStatus}
                      onChange={(e) => setNewOrderStatus(e.target.value as OrderStatus)}
                      className="w-full px-3 py-2 bg-white rounded border border-[#E4E4E7] focus:ring-1 focus:ring-[#C6A66B]"
                    >
                      <option value="new">Nova Encomenda</option>
                      <option value="awaiting_confirmation">Aguardando Confirmação</option>
                      <option value="confirmed">Confirmada</option>
                      <option value="preparing">Em Preparação</option>
                      <option value="shipped">Enviada</option>
                      <option value="delivered">Entregue</option>
                      <option value="cancelled">Cancelada</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#17191C] mb-1">
                      Estado do Pagamento
                    </label>
                    <select
                      value={newPaymentStatus}
                      onChange={(e) => setNewPaymentStatus(e.target.value as PaymentStatus)}
                      className="w-full px-3 py-2 bg-white rounded border border-[#E4E4E7] focus:ring-1 focus:ring-[#C6A66B]"
                    >
                      <option value="pending">Pendente</option>
                      <option value="paid">Confirmado / Pago</option>
                      <option value="cancelled">Cancelado / Reembolsado</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#17191C] mb-1">
                    Nota para o Histórico de Alteração (Opcional)
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: Comprovativo BAI #3942 validado; estafeta saiu para entrega"
                    value={historyNote}
                    onChange={(e) => setHistoryNote(e.target.value)}
                    className="w-full px-3 py-2 bg-white rounded border border-[#E4E4E7] focus:ring-1 focus:ring-[#C6A66B]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#17191C] mb-1">
                    Notas Internas da Equipa (Visível apenas para administradores)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Regista aqui detalhes da coordenação, estafeta escalado ou preferências do cliente..."
                    value={internalNotes}
                    onChange={(e) => setInternalNotes(e.target.value)}
                    className="w-full px-3 py-2 bg-white rounded border border-[#E4E4E7] focus:ring-1 focus:ring-[#C6A66B]"
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={handleUpdateOrder}
                    disabled={updating}
                    className="px-5 py-2 text-xs font-bold uppercase tracking-wider text-[#17191C] bg-[#C6A66B] hover:bg-[#d8b87c] rounded transition-colors flex items-center gap-1.5 disabled:opacity-50"
                  >
                    <Save className="w-4 h-4" />
                    <span>{updating ? 'A Guardar...' : 'Guardar Alterações'}</span>
                  </button>
                </div>
              </div>

              {/* Status History / Audit Trail */}
              <div className="space-y-2">
                <h4 className="font-bold text-xs uppercase tracking-wider text-[#71717A]">
                  Histórico de Alterações (Auditoria)
                </h4>
                <div className="border border-[#E4E4E7] rounded-lg divide-y divide-[#E4E4E7]">
                  {selectedOrder.history.map((h, i) => (
                    <div key={i} className="p-3 text-[11px] flex items-start justify-between gap-4">
                      <div>
                        <span className="font-semibold text-[#17191C] block">{h.action}</span>
                        {h.note && <span className="text-[#52525B] block italic">"{h.note}"</span>}
                      </div>
                      <span className="text-[#71717A] shrink-0 font-mono">
                        {new Date(h.timestamp).toLocaleString('pt-AO')}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
