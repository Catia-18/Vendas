import React, { useState } from 'react';
import { Product, ProductSpec } from '../../types';
import { updateAdminProduct, extractYouTubeId, fetchYouTubeVideoInfo } from '../../services/api';
import { Save, Plus, Trash2, CheckCircle, AlertCircle, Info, Play, Video, ExternalLink, RefreshCw } from 'lucide-react';

interface AdminProductProps {
  token: string;
  product: Product;
  onProductUpdated: (product: Product) => void;
}

export const AdminProduct: React.FC<AdminProductProps> = ({
  token,
  product,
  onProductUpdated
}) => {
  const [name, setName] = useState(product.name);
  const [tagline, setTagline] = useState(product.tagline);
  const [price, setPrice] = useState<number>(product.price);
  const [stock, setStock] = useState<number>(product.stock);
  const [inStock, setInStock] = useState<boolean>(product.inStock);
  const [isActive, setIsActive] = useState<boolean>(product.isActive);
  const [description, setDescription] = useState(product.description);
  const [specs, setSpecs] = useState<ProductSpec[]>(product.specs || []);
  const [platformVideoUrl, setPlatformVideoUrl] = useState(
    product.platformVideoUrl || '/assets/videos/luminaria_lumora_demonstracao.mp4'
  );
  const [youtubeVideoUrl, setYoutubeVideoUrl] = useState(
    product.youtubeVideoUrl || 'https://www.youtube.com/watch?v=L24CqW2Hx34'
  );
  const [youtubeVideoTitle, setYoutubeVideoTitle] = useState(
    product.youtubeVideoTitle || 'Demonstração da Luminária LED Recarregável com Sensor de Movimento'
  );
  const [newSpecLabel, setNewSpecLabel] = useState('');
  const [newSpecValue, setNewSpecValue] = useState('');
  const [newSpecNeedsConfirm, setNewSpecNeedsConfirm] = useState(false);

  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [testingVideo, setTestingVideo] = useState(false);
  const [videoApiFeedback, setVideoApiFeedback] = useState<string | null>(null);

  const handleTestYouTubeVideo = async () => {
    if (!youtubeVideoUrl.trim()) return;
    setTestingVideo(true);
    setVideoApiFeedback(null);
    try {
      const info = await fetchYouTubeVideoInfo(youtubeVideoUrl);
      if (info && info.title) {
        setYoutubeVideoTitle(info.title);
        setVideoApiFeedback(`Vídeo reconhecido pela API do YouTube: "${info.title}"`);
      } else {
        setVideoApiFeedback('Vídeo carregado. Verifica a pré-visualização abaixo.');
      }
    } catch {
      setVideoApiFeedback('Não foi possível verificar via API. O leitor padrão do YouTube tentará reproduzir o link.');
    } finally {
      setTestingVideo(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      const res = await updateAdminProduct(token, {
        name,
        tagline,
        price: Number(price),
        stock: Number(stock),
        inStock,
        isActive,
        description,
        specs,
        platformVideoUrl,
        youtubeVideoUrl,
        youtubeVideoTitle
      });
      onProductUpdated(res.product);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message || 'Erro ao guardar dados do produto');
    } finally {
      setSaving(false);
    }
  };

  const handleAddSpec = () => {
    if (!newSpecLabel.trim() || !newSpecValue.trim()) return;
    setSpecs([
      ...specs,
      {
        label: newSpecLabel.trim(),
        value: newSpecValue.trim(),
        needsConfirmation: newSpecNeedsConfirm
      }
    ]);
    setNewSpecLabel('');
    setNewSpecValue('');
    setNewSpecNeedsConfirm(false);
  };

  const handleRemoveSpec = (index: number) => {
    setSpecs(specs.filter((_, idx) => idx !== index));
  };

  const formatKz = (val: number) => new Intl.NumberFormat('pt-AO').format(val);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold font-display text-[#17191C]">
          Gestão do Produto LUMORA
        </h2>
        <p className="text-xs text-[#71717A]">
          Edita o preço de referência em Kwanzas, gere a disponibilidade de stock e as especificações técnicas verificadas.
        </p>
      </div>

      {success && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg flex items-center gap-2 text-xs">
          <CheckCircle className="w-4 h-4 text-emerald-600" />
          <span>Alterações do produto guardadas e actualizadas no site com sucesso!</span>
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-800 rounded-lg flex items-center gap-2 text-xs">
          <AlertCircle className="w-4 h-4 text-red-600" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Core Pricing & Stock Module */}
        <div className="bg-white p-6 rounded-xl border border-[#E4E4E7] shadow-xs space-y-4">
          <h3 className="font-bold text-sm text-[#17191C] border-b border-[#E4E4E7] pb-2">
            Preço & Controlo de Stock
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#17191C] mb-1">
                Preço de Referência (Kz) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  required
                  min={1}
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  className="w-full px-3 py-2 text-sm rounded border border-[#E4E4E7] font-mono font-bold focus:ring-1 focus:ring-[#C6A66B]"
                />
                <span className="absolute right-3 top-2.5 text-xs text-[#71717A] font-semibold">
                  Kz
                </span>
              </div>
              <span className="text-[11px] text-[#71717A] mt-1 block">
                Valor formatado: <strong>{formatKz(price)} Kz</strong>
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#17191C] mb-1">
                Unidades em Stock
              </label>
              <input
                type="number"
                min={0}
                value={stock}
                onChange={(e) => setStock(Number(e.target.value))}
                className="w-full px-3 py-2 text-sm rounded border border-[#E4E4E7] font-mono focus:ring-1 focus:ring-[#C6A66B]"
              />
              <span className="text-[11px] text-[#71717A] mt-1 block">
                Diminui automaticamente a cada encomenda
              </span>
            </div>

            <div className="flex flex-col justify-end space-y-2">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-[#17191C]">
                <input
                  type="checkbox"
                  checked={inStock}
                  onChange={(e) => setInStock(e.target.checked)}
                  className="rounded text-[#C6A66B] focus:ring-[#C6A66B]"
                />
                <span>Produto em Stock Disponível</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-[#17191C]">
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="rounded text-[#C6A66B] focus:ring-[#C6A66B]"
                />
                <span>Activar Apresentação no Site</span>
              </label>
            </div>
          </div>
        </div>

        {/* Product Identity */}
        <div className="bg-white p-6 rounded-xl border border-[#E4E4E7] shadow-xs space-y-4">
          <h3 className="font-bold text-sm text-[#17191C] border-b border-[#E4E4E7] pb-2">
            Identidade & Textos de Venda
          </h3>

          <div>
            <label className="block text-xs font-semibold text-[#17191C] mb-1">
              Nome do Produto Principal
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded border border-[#E4E4E7] focus:ring-1 focus:ring-[#C6A66B]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#17191C] mb-1">
              Slogan / Subtítulo Comercial
            </label>
            <input
              type="text"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded border border-[#E4E4E7] focus:ring-1 focus:ring-[#C6A66B]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#17191C] mb-1">
              Descrição Comercial
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded border border-[#E4E4E7] focus:ring-1 focus:ring-[#C6A66B]"
            />
          </div>
        </div>

        {/* Specifications Editor */}
        <div className="bg-white p-6 rounded-xl border border-[#E4E4E7] shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-[#E4E4E7] pb-2">
            <h3 className="font-bold text-sm text-[#17191C]">
              Ficha Técnica & Especificações
            </h3>
            <span className="text-[11px] text-[#71717A]">
              Transparência total com características reais
            </span>
          </div>

          <div className="space-y-2">
            {specs.map((s, idx) => (
              <div
                key={idx}
                className="p-3 bg-[#F8F8F6] rounded-lg border border-[#E4E4E7] flex items-center justify-between gap-3 text-xs"
              >
                <div className="flex-1">
                  <span className="font-semibold text-[#17191C]">{s.label}: </span>
                  <span className="text-[#52525B]">{s.value}</span>
                  {s.needsConfirmation && (
                    <span className="ml-2 text-amber-700 font-medium">
                      [Requer Confirmação]
                    </span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveSpec(idx)}
                  className="p-1 text-red-500 hover:text-red-700 rounded hover:bg-red-50 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>

          {/* Add new spec line */}
          <div className="pt-3 border-t border-[#E4E4E7] grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
            <div className="sm:col-span-4">
              <label className="block text-[11px] font-semibold text-[#71717A] mb-1">
                Propriedade (ex: Bateria)
              </label>
              <input
                type="text"
                placeholder="Ex: Sensor"
                value={newSpecLabel}
                onChange={(e) => setNewSpecLabel(e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs rounded border border-[#E4E4E7]"
              />
            </div>

            <div className="sm:col-span-5">
              <label className="block text-[11px] font-semibold text-[#71717A] mb-1">
                Valor Verificado
              </label>
              <input
                type="text"
                placeholder="Ex: Sensor PIR infravermelho"
                value={newSpecValue}
                onChange={(e) => setNewSpecValue(e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs rounded border border-[#E4E4E7]"
              />
            </div>

            <div className="sm:col-span-3 flex items-center gap-2">
              <label className="flex items-center gap-1.5 text-[11px] text-[#71717A] cursor-pointer">
                <input
                  type="checkbox"
                  checked={newSpecNeedsConfirm}
                  onChange={(e) => setNewSpecNeedsConfirm(e.target.checked)}
                  className="rounded text-[#C6A66B]"
                />
                <span>Confirmar</span>
              </label>
              <button
                type="button"
                onClick={handleAddSpec}
                className="px-3 py-1.5 text-xs bg-[#17191C] text-white rounded hover:bg-black transition-colors"
              >
                Adicionar
              </button>
            </div>
          </div>
        </div>

        {/* Video da Plataforma & YouTube Section */}
        <div className="bg-white p-6 rounded-xl border border-[#E4E4E7] shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-[#E4E4E7] pb-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-md bg-[#C6A66B] flex items-center justify-center text-[#17191C]">
                <Play className="w-3.5 h-3.5 fill-[#17191C] translate-x-0.5" />
              </div>
              <h3 className="font-bold text-sm text-[#17191C]">
                Vídeo da Luminária (Plataforma & YouTube)
              </h3>
            </div>
            <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
              ✓ 100% Disponível na Plataforma
            </span>
          </div>

          <div className="p-3 bg-emerald-50/70 border border-emerald-200/80 rounded-lg text-xs text-emerald-900 space-y-1">
            <span className="font-bold block">✓ Vídeo Integrado na Plataforma (Sem Restrições):</span>
            <p className="text-[11px] text-emerald-800">
              O vídeo nativo da luminária LUMORA encontra-se hospedado directamente na plataforma em <code className="bg-emerald-100 px-1 py-0.5 rounded font-mono font-bold">/assets/videos/luminaria_lumora_demonstracao.mp4</code>. Funciona 100% sem restrições de idade, sem bloqueios de reprodução externa e sem anúncios.
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#17191C] mb-1">
              Ficheiro do Vídeo da Plataforma (MP4)
            </label>
            <input
              type="text"
              value={platformVideoUrl}
              onChange={(e) => setPlatformVideoUrl(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded border border-[#E4E4E7] font-mono focus:ring-1 focus:ring-[#C6A66B]"
            />
            <span className="text-[11px] text-[#71717A] mt-1 block">
              Caminho relativo ou URL do vídeo MP4 nativo da loja.
            </span>
          </div>

          <div className="pt-2 border-t border-[#E4E4E7]">
            <span className="font-bold text-xs text-[#17191C] block mb-1">
              Ligação com a API do YouTube (Opcional):
            </span>
            <p className="text-xs text-[#52525B]">
              Podes também associar um link do YouTube. No leitor de vídeo da loja, os clientes podem alternar entre o vídeo nativo da plataforma e o leitor oficial do YouTube.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
            <div className="sm:col-span-8">
              <label className="block text-xs font-semibold text-[#17191C] mb-1">
                Link do Vídeo no YouTube (ou ID do vídeo)
              </label>
              <input
                type="text"
                placeholder="Ex: https://www.youtube.com/watch?v=kY0wU68qVQI"
                value={youtubeVideoUrl}
                onChange={(e) => setYoutubeVideoUrl(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded border border-[#E4E4E7] focus:ring-1 focus:ring-[#C6A66B]"
              />
            </div>

            <div className="sm:col-span-4 flex items-center gap-2">
              <button
                type="button"
                onClick={handleTestYouTubeVideo}
                disabled={testingVideo || !youtubeVideoUrl.trim()}
                className="w-full px-4 py-2 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded transition-colors flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${testingVideo ? 'animate-spin' : ''}`} />
                <span>{testingVideo ? 'A verificar...' : 'Testar com API'}</span>
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#17191C] mb-1">
              Título de Exibição do Vídeo
            </label>
            <input
              type="text"
              placeholder="Ex: Demonstração da Luminária LED Recarregável com Sensor de Movimento"
              value={youtubeVideoTitle}
              onChange={(e) => setYoutubeVideoTitle(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded border border-[#E4E4E7] focus:ring-1 focus:ring-[#C6A66B]"
            />
          </div>

          {videoApiFeedback && (
            <div className="p-3 bg-red-50 text-red-800 rounded-lg text-xs flex items-center gap-2 border border-red-200">
              <Info className="w-4 h-4 shrink-0 text-red-600" />
              <span>{videoApiFeedback}</span>
            </div>
          )}

          {/* Embedded Live Video Preview in Admin */}
          {extractYouTubeId(youtubeVideoUrl) && (
            <div className="pt-2">
              <span className="block text-xs font-semibold text-[#71717A] mb-2">
                Pré-visualização do Leitor YouTube:
              </span>
              <div className="relative aspect-video max-w-lg rounded-lg overflow-hidden border border-[#E4E4E7] bg-black shadow-inner">
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${extractYouTubeId(youtubeVideoUrl)}?rel=0&modestbranding=1`}
                  title="Pré-visualização do YouTube"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full border-0"
                />
              </div>
            </div>
          )}
        </div>

        {/* Action Save Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-3 text-xs font-bold uppercase tracking-wider text-[#17191C] bg-[#C6A66B] hover:bg-[#d8b87c] rounded-md transition-all shadow-md flex items-center gap-2 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'A Guardar...' : 'Guardar Alterações do Produto'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
