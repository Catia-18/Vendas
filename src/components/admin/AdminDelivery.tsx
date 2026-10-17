import React, { useState } from 'react';
import { DeliveryZone } from '../../types';
import {
  createAdminZone,
  updateAdminZone,
  deleteAdminZone
} from '../../services/api';
import { Plus, Trash2, Edit2, Save, X, CheckCircle, AlertCircle, MapPin } from 'lucide-react';

interface AdminDeliveryProps {
  token: string;
  zones: DeliveryZone[];
  onZonesUpdated: (zones: DeliveryZone[]) => void;
}

export const AdminDelivery: React.FC<AdminDeliveryProps> = ({
  token,
  zones,
  onZonesUpdated
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<DeliveryZone>>({});
  const [showAddForm, setShowAddForm] = useState(false);
  const [newZone, setNewZone] = useState<Partial<DeliveryZone>>({
    province: 'Luanda',
    municipality: '',
    zoneName: '',
    fee: 2500,
    estimatedTime: '24h a 48h úteis',
    isActive: true,
    notes: ''
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const formatKz = (val: number) => new Intl.NumberFormat('pt-AO').format(val);

  const startEdit = (zone: DeliveryZone) => {
    setEditingId(zone.id);
    setEditForm({ ...zone });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({});
  };

  const handleSaveEdit = async () => {
    if (!editingId) return;
    setLoading(true);
    try {
      const res = await updateAdminZone(token, editingId, editForm);
      onZonesUpdated(zones.map((z) => (z.id === editingId ? res.zone : z)));
      setEditingId(null);
      setMessage('Zona de entrega actualizada com sucesso!');
      setTimeout(() => setMessage(null), 3000);
    } catch (err: any) {
      alert(err.message || 'Erro ao guardar zona');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleActive = async (zone: DeliveryZone) => {
    try {
      const res = await updateAdminZone(token, zone.id, { isActive: !zone.isActive });
      onZonesUpdated(zones.map((z) => (z.id === zone.id ? res.zone : z)));
    } catch (err: any) {
      alert(err.message || 'Erro ao alterar estado da zona');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tens a certeza que desejas remover esta zona de entrega?')) return;
    try {
      await deleteAdminZone(token, id);
      onZonesUpdated(zones.filter((z) => z.id !== id));
      setMessage('Zona removida');
      setTimeout(() => setMessage(null), 2000);
    } catch (err: any) {
      alert(err.message || 'Erro ao remover zona');
    }
  };

  const handleCreateZone = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newZone.municipality || typeof newZone.fee !== 'number') {
      alert('Por favor preenche o município e a taxa.');
      return;
    }

    setLoading(true);
    try {
      const res = await createAdminZone(token, newZone);
      onZonesUpdated([...zones, res.zone]);
      setShowAddForm(false);
      setNewZone({
        province: 'Luanda',
        municipality: '',
        zoneName: '',
        fee: 2500,
        estimatedTime: '24h a 48h úteis',
        isActive: true,
        notes: ''
      });
      setMessage('Nova zona de entrega criada com sucesso!');
      setTimeout(() => setMessage(null), 3000);
    } catch (err: any) {
      alert(err.message || 'Erro ao criar zona');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold font-display text-[#17191C]">
            Gestão de Zonas & Custos de Entrega
          </h2>
          <p className="text-xs text-[#71717A]">
            Define preços de frete em Kwanzas, prazos reais e activa ou suspende rotas de entrega.
          </p>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#17191C] bg-[#C6A66B] hover:bg-[#d8b87c] rounded-md transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>{showAddForm ? 'Fechar Formulário' : 'Adicionar Nova Zona'}</span>
        </button>
      </div>

      {message && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-600" />
          <span>{message}</span>
        </div>
      )}

      {/* Add New Zone Form */}
      {showAddForm && (
        <form
          onSubmit={handleCreateZone}
          className="bg-white p-6 rounded-xl border border-[#E4E4E7] shadow-xs space-y-4 animate-in fade-in duration-200"
        >
          <h3 className="font-bold text-sm text-[#17191C] border-b border-[#E4E4E7] pb-2">
            Registar Nova Rota de Entrega
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-[#17191C] mb-1">
                Província <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="Ex: Luanda, Benguela, Huambo"
                value={newZone.province}
                onChange={(e) => setNewZone({ ...newZone, province: e.target.value })}
                className="w-full px-3 py-2 rounded border border-[#E4E4E7]"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#17191C] mb-1">
                Município <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="Ex: Talatona, Viana, Lobito"
                value={newZone.municipality}
                onChange={(e) => setNewZone({ ...newZone, municipality: e.target.value })}
                className="w-full px-3 py-2 rounded border border-[#E4E4E7]"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#17191C] mb-1">
                Nome da Zona / Descritivo
              </label>
              <input
                type="text"
                placeholder="Ex: Benfica / Morro Bento"
                value={newZone.zoneName}
                onChange={(e) => setNewZone({ ...newZone, zoneName: e.target.value })}
                className="w-full px-3 py-2 rounded border border-[#E4E4E7]"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#17191C] mb-1">
                Taxa de Entrega (Kz) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                required
                min={0}
                value={newZone.fee}
                onChange={(e) => setNewZone({ ...newZone, fee: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded border border-[#E4E4E7] font-mono font-bold"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#17191C] mb-1">
                Prazo Estimado <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="Ex: 24h a 48h úteis"
                value={newZone.estimatedTime}
                onChange={(e) => setNewZone({ ...newZone, estimatedTime: e.target.value })}
                className="w-full px-3 py-2 rounded border border-[#E4E4E7]"
              />
            </div>

            <div className="flex items-center gap-2 pt-5">
              <label className="flex items-center gap-2 cursor-pointer font-semibold text-[#17191C]">
                <input
                  type="checkbox"
                  checked={newZone.isActive}
                  onChange={(e) => setNewZone({ ...newZone, isActive: e.target.checked })}
                  className="rounded text-[#C6A66B]"
                />
                <span>Zona Activa para Encomendas</span>
              </label>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 text-xs font-semibold text-[#52525B] hover:bg-slate-100 rounded"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 text-xs font-bold uppercase tracking-wider text-[#17191C] bg-[#C6A66B] hover:bg-[#d8b87c] rounded"
            >
              Gravar Nova Zona
            </button>
          </div>
        </form>
      )}

      {/* Zones List */}
      <div className="bg-white rounded-xl border border-[#E4E4E7] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#F8F8F6] text-[#71717A] border-b border-[#E4E4E7] uppercase tracking-wider text-[11px] font-semibold">
                <th className="py-3 px-4">Província / Município</th>
                <th className="py-3 px-4">Zona / Detalhes</th>
                <th className="py-3 px-4">Taxa de Entrega</th>
                <th className="py-3 px-4">Prazo Estimado</th>
                <th className="py-3 px-4 text-center">Disponibilidade</th>
                <th className="py-3 px-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E4E4E7]">
              {zones.map((zone) => {
                const isEditing = editingId === zone.id;

                if (isEditing) {
                  return (
                    <tr key={zone.id} className="bg-amber-50/50">
                      <td className="py-3 px-4 space-y-1">
                        <input
                          type="text"
                          value={editForm.province || ''}
                          onChange={(e) =>
                            setEditForm({ ...editForm, province: e.target.value })
                          }
                          className="w-full px-2 py-1 bg-white border border-[#E4E4E7] rounded text-xs"
                          placeholder="Província"
                        />
                        <input
                          type="text"
                          value={editForm.municipality || ''}
                          onChange={(e) =>
                            setEditForm({ ...editForm, municipality: e.target.value })
                          }
                          className="w-full px-2 py-1 bg-white border border-[#E4E4E7] rounded text-xs"
                          placeholder="Município"
                        />
                      </td>

                      <td className="py-3 px-4">
                        <input
                          type="text"
                          value={editForm.zoneName || ''}
                          onChange={(e) =>
                            setEditForm({ ...editForm, zoneName: e.target.value })
                          }
                          className="w-full px-2 py-1 bg-white border border-[#E4E4E7] rounded text-xs"
                          placeholder="Zona / Descrição"
                        />
                      </td>

                      <td className="py-3 px-4">
                        <input
                          type="number"
                          value={editForm.fee || 0}
                          onChange={(e) =>
                            setEditForm({ ...editForm, fee: Number(e.target.value) })
                          }
                          className="w-28 px-2 py-1 bg-white border border-[#E4E4E7] rounded text-xs font-mono font-bold"
                        />
                      </td>

                      <td className="py-3 px-4">
                        <input
                          type="text"
                          value={editForm.estimatedTime || ''}
                          onChange={(e) =>
                            setEditForm({ ...editForm, estimatedTime: e.target.value })
                          }
                          className="w-full px-2 py-1 bg-white border border-[#E4E4E7] rounded text-xs"
                          placeholder="Prazo"
                        />
                      </td>

                      <td className="py-3 px-4 text-center">
                        <input
                          type="checkbox"
                          checked={editForm.isActive}
                          onChange={(e) =>
                            setEditForm({ ...editForm, isActive: e.target.checked })
                          }
                          className="rounded text-[#C6A66B]"
                        />
                      </td>

                      <td className="py-3 px-4 text-right space-x-1">
                        <button
                          onClick={handleSaveEdit}
                          disabled={loading}
                          className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded"
                          title="Guardar"
                        >
                          <Save className="w-4 h-4" />
                        </button>
                        <button
                          onClick={cancelEdit}
                          className="p-1.5 text-slate-500 hover:bg-slate-100 rounded"
                          title="Cancelar"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                }

                return (
                  <tr key={zone.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3 px-4">
                      <span className="font-semibold text-[#17191C] block">
                        {zone.province}
                      </span>
                      <span className="text-[11px] text-[#71717A]">{zone.municipality}</span>
                    </td>

                    <td className="py-3 px-4">
                      <span className="font-medium text-[#17191C] block">{zone.zoneName}</span>
                      {zone.notes && (
                        <span className="text-[11px] text-[#71717A] italic">{zone.notes}</span>
                      )}
                    </td>

                    <td className="py-3 px-4 font-mono font-bold text-[#17191C] tabular-nums">
                      {formatKz(zone.fee)} Kz
                    </td>

                    <td className="py-3 px-4 text-[#52525B]">{zone.estimatedTime}</td>

                    <td className="py-3 px-4 text-center">
                      <button
                        type="button"
                        onClick={() => handleToggleActive(zone)}
                        className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold transition-colors ${
                          zone.isActive
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-red-50 text-red-700 border border-red-200'
                        }`}
                      >
                        {zone.isActive ? 'Disponível' : 'Indisponível'}
                      </button>
                    </td>

                    <td className="py-3 px-4 text-right space-x-1">
                      <button
                        type="button"
                        onClick={() => startEdit(zone)}
                        className="p-1.5 text-[#52525B] hover:text-[#17191C] hover:bg-slate-100 rounded transition-colors"
                        title="Editar Zona"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(zone.id)}
                        className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                        title="Eliminar Zona"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
