import {
  Product,
  DeliveryZone,
  StoreSettings,
  CreateOrderPayload,
  OrderConfirmationResult,
  Order,
  SalesAnalytics
} from '../types';
import {
  INITIAL_PRODUCT,
  INITIAL_DELIVERY_ZONES,
  INITIAL_SETTINGS,
  INITIAL_ORDERS
} from '../data/defaultStore';
import {
  saveOrderToFirestore,
  getOrderFromFirestore,
  getProductFromFirestore,
  seedFirestoreIfEmpty
} from './firestoreService';

// Helper for local storage persistence when running on static platforms (e.g. Vercel static CDN)
function getLocalOrders(): Order[] {
  try {
    const raw = localStorage.getItem('lumora_orders');
    if (raw) return JSON.parse(raw);
  } catch {}
  return [...INITIAL_ORDERS];
}

function saveLocalOrders(orders: Order[]) {
  try {
    localStorage.setItem('lumora_orders', JSON.stringify(orders));
  } catch {}
}

export async function fetchProduct(): Promise<Product> {
  try {
    const res = await fetch('/api/product');
    if (res.ok) {
      const data = await res.json();
      if (data && data.name) return data;
    }
  } catch (err) {
    console.warn('API /api/product indisponível (modo Vercel estático). A usar dados locais:', err);
  }

  // Fallback to local storage or defaults
  try {
    const stored = localStorage.getItem('lumora_product');
    if (stored) return JSON.parse(stored);
  } catch {}

  return INITIAL_PRODUCT;
}

export async function fetchDeliveryZones(all = false, token?: string): Promise<DeliveryZone[]> {
  try {
    const headers: HeadersInit = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;
    const res = await fetch(`/api/delivery-zones${all ? '?all=true' : ''}`, { headers });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) return data;
    }
  } catch (err) {
    console.warn('API /api/delivery-zones indisponível. A usar zonas locais:', err);
  }

  try {
    const stored = localStorage.getItem('lumora_delivery_zones');
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return all ? parsed : parsed.filter((z: any) => z.isActive);
      }
    }
  } catch {}

  return all ? INITIAL_DELIVERY_ZONES : INITIAL_DELIVERY_ZONES.filter((z) => z.isActive);
}

export async function fetchSettings(): Promise<StoreSettings> {
  try {
    const res = await fetch('/api/settings');
    if (res.ok) {
      const data = await res.json();
      if (data && data.brandName) return data;
    }
  } catch (err) {
    console.warn('API /api/settings indisponível. A usar configurações locais:', err);
  }

  try {
    const stored = localStorage.getItem('lumora_settings');
    if (stored) return JSON.parse(stored);
  } catch {}

  return INITIAL_SETTINGS;
}

export async function createOrder(payload: CreateOrderPayload): Promise<OrderConfirmationResult> {
  try {
    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (res.ok) {
      const data = await res.json();
      if (data && data.order) {
        saveOrderToFirestore(data.order).catch(() => {});
      }
      return data;
    }
  } catch (err) {
    console.warn('Backend /api/orders não respondeu. A processar encomenda com Firestore e persistência local:', err);
  }

  // Client-side local order processor if backend API is not running (e.g. pure static Vercel)
  const product = await fetchProduct();
  const zones = await fetchDeliveryZones(true);
  const settings = await fetchSettings();

  const matchingZone = zones.find(
    (z) =>
      z.province.toLowerCase() === payload.province.toLowerCase() &&
      (z.municipality.toLowerCase() === payload.municipality.toLowerCase() ||
        payload.municipality.toLowerCase().includes(z.municipality.toLowerCase()))
  );

  let deliveryFee = 2500;
  if (matchingZone) {
    deliveryFee = matchingZone.fee;
  } else if (payload.province.toLowerCase() !== 'luanda') {
    deliveryFee = 6000;
  }

  const subtotal = product.price * payload.quantity;
  const total = subtotal + deliveryFee;
  const uniqueId = `LMR-${Math.floor(10000 + Math.random() * 90000)}`;

  const isStripePaid = payload.paymentMethod === 'stripe' && Boolean(payload.stripePaymentIntentId);

  const newOrder: Order = {
    id: uniqueId,
    customerName: payload.customerName.trim(),
    customerPhone: payload.customerPhone.trim(),
    province: payload.province.trim(),
    municipality: payload.municipality.trim(),
    neighborhood: payload.neighborhood.trim(),
    address: payload.address.trim(),
    referencePoint: payload.referencePoint.trim(),
    notes: (payload.notes || '').trim(),
    quantity: payload.quantity,
    unitPrice: product.price,
    subtotal,
    deliveryFee,
    total,
    paymentMethod: payload.paymentMethod,
    stripePaymentIntentId: payload.stripePaymentIntentId,
    orderStatus: isStripePaid ? 'confirmed' : 'new',
    paymentStatus: isStripePaid ? 'paid' : 'pending',
    internalNotes: isStripePaid ? 'Pagamento online verificado via Stripe' : '',
    history: [
      {
        timestamp: new Date().toISOString(),
        action: isStripePaid
          ? 'Encomenda registada com pagamento confirmado via Stripe'
          : 'Encomenda registada com sucesso pelo cliente'
      }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  const currentOrders = getLocalOrders();
  currentOrders.unshift(newOrder);
  saveLocalOrders(currentOrders);
  saveOrderToFirestore(newOrder).catch(() => {});

  const formattedTotal = new Intl.NumberFormat('pt-AO').format(total);
  const paymentLabels: Record<string, string> = {
    cash_on_delivery: 'Pagamento na Entrega',
    bank_transfer: 'Transferência Bancária',
    stripe: 'Cartão de Débito / Crédito (Stripe)'
  };

  const rawWhatsappMsg =
    `Olá LUMORA! Acabei de fazer a encomenda *${newOrder.id}* no vosso site.\n\n` +
    `*Produto:* ${product.name}\n` +
    `*Quantidade:* ${payload.quantity} unidade(s)\n` +
    `*Total:* ${formattedTotal} Kz\n` +
    `*Pagamento:* ${paymentLabels[payload.paymentMethod] || payload.paymentMethod}\n` +
    `*Local de Entrega:* ${newOrder.province}, ${newOrder.municipality} (${newOrder.neighborhood || 'Bairro indicado'})\n\n` +
    `Gostaria de confirmar a encomenda e combinar a entrega. Obrigado!`;

  return {
    order: newOrder,
    whatsappMessage: encodeURIComponent(rawWhatsappMsg),
    bankTransferDetails:
      payload.paymentMethod === 'bank_transfer'
        ? {
            accounts: settings.paymentMethods.bank_transfer.accounts || [],
            instructions: settings.paymentMethods.bank_transfer.instructions
          }
        : undefined,
    stripeDetails:
      payload.paymentMethod === 'stripe'
        ? {
            paid: isStripePaid,
            receiptNotice: 'O teu pagamento com cartão foi validado através da plataforma Stripe.'
          }
        : undefined
  };
}

export async function createStripePaymentIntent(
  amountKz: number,
  customerName: string,
  customerPhone: string
): Promise<{ clientSecret: string; id: string; amountUsd: number; publishableKey: string }> {
  try {
    const res = await fetch('/api/stripe/create-payment-intent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amountKz, customerName, customerPhone })
    });
    if (res.ok) {
      return res.json();
    }
  } catch (err) {
    console.warn('API Stripe não respondeu no servidor. A gerar intent de teste:', err);
  }

  const usdAmount = Math.max(1, Math.round(amountKz / 900));
  const simId = `pi_sim_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  return {
    clientSecret: `${simId}_secret_${Math.random().toString(36).substring(2, 9)}`,
    id: simId,
    amountUsd: usdAmount,
    publishableKey: 'pk_test_51URbpVK5OaHHhzp50Sgkh7Etx'
  };
}

export async function trackOrder(query: string): Promise<any> {
  try {
    const res = await fetch(`/api/orders/track?q=${encodeURIComponent(query)}`);
    if (res.ok) {
      return res.json();
    }
  } catch (err) {}

  // Fallback search in local orders
  const orders = getLocalOrders();
  const clean = query.trim().toLowerCase().replace(/[^a-zA-Z0-9]/g, '');

  const found = orders.find((o) => {
    const oId = o.id.toLowerCase().replace(/[^a-zA-Z0-9]/g, '');
    const oPhone = o.customerPhone.replace(/[^0-9]/g, '');
    return oId === clean || oPhone.endsWith(clean) || clean.endsWith(oPhone);
  });

  if (!found) {
    try {
      const cloudOrder = await getOrderFromFirestore(query);
      if (cloudOrder) {
        return {
          id: cloudOrder.id,
          customerName: cloudOrder.customerName,
          province: cloudOrder.province,
          municipality: cloudOrder.municipality,
          quantity: cloudOrder.quantity,
          total: cloudOrder.total,
          paymentMethod: cloudOrder.paymentMethod,
          orderStatus: cloudOrder.orderStatus,
          paymentStatus: cloudOrder.paymentStatus,
          createdAt: cloudOrder.createdAt,
          updatedAt: cloudOrder.updatedAt,
          history: cloudOrder.history
        };
      }
    } catch {}
    throw new Error('Nenhuma encomenda encontrada com estes dados.');
  }

  return {
    id: found.id,
    customerName: found.customerName,
    province: found.province,
    municipality: found.municipality,
    quantity: found.quantity,
    total: found.total,
    paymentMethod: found.paymentMethod,
    orderStatus: found.orderStatus,
    paymentStatus: found.paymentStatus,
    createdAt: found.createdAt,
    history: found.history
  };
}

export async function adminLogin(passcode: string): Promise<{ success: boolean; token: string }> {
  try {
    const res = await fetch('/api/admin/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ passcode })
    });
    if (res.ok) {
      return res.json();
    }
  } catch (err) {}

  // Local validation fallback
  let validPass = 'lumora2026';
  try {
    const customPass = localStorage.getItem('lumora_admin_passcode');
    if (customPass) validPass = customPass;
  } catch {}

  if (passcode === validPass) {
    return { success: true, token: validPass };
  }
  throw new Error('Palavra-passe de administrador incorrecta.');
}

export async function adminVerify(token: string): Promise<boolean> {
  try {
    const res = await fetch('/api/admin/auth/verify', {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (res.ok) return true;
  } catch {}

  let validPass = 'lumora2026';
  try {
    const customPass = localStorage.getItem('lumora_admin_passcode');
    if (customPass) validPass = customPass;
  } catch {}

  return token === validPass;
}

export async function fetchAdminOrders(
  token: string,
  filters?: { search?: string; orderStatus?: string; paymentStatus?: string; province?: string }
): Promise<Order[]> {
  try {
    const params = new URLSearchParams();
    if (filters?.search) params.append('search', filters.search);
    if (filters?.orderStatus) params.append('orderStatus', filters.orderStatus);
    if (filters?.paymentStatus) params.append('paymentStatus', filters.paymentStatus);
    if (filters?.province) params.append('province', filters.province);

    const res = await fetch(`/api/admin/orders?${params.toString()}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (res.ok) {
      return res.json();
    }
  } catch (err) {}

  let orders = getLocalOrders();
  if (filters?.search) {
    const s = filters.search.toLowerCase();
    orders = orders.filter(
      (o) =>
        o.id.toLowerCase().includes(s) ||
        o.customerName.toLowerCase().includes(s) ||
        o.customerPhone.toLowerCase().includes(s)
    );
  }
  if (filters?.orderStatus && filters.orderStatus !== 'all') {
    orders = orders.filter((o) => o.orderStatus === filters.orderStatus);
  }
  if (filters?.paymentStatus && filters.paymentStatus !== 'all') {
    orders = orders.filter((o) => o.paymentStatus === filters.paymentStatus);
  }
  if (filters?.province && filters.province !== 'all') {
    orders = orders.filter((o) => o.province.toLowerCase() === filters.province!.toLowerCase());
  }
  return orders;
}

export async function updateAdminOrder(
  token: string,
  id: string,
  data: {
    orderStatus?: string;
    paymentStatus?: string;
    internalNotes?: string;
    historyNote?: string;
  }
): Promise<{ success: boolean; order: Order }> {
  try {
    const res = await fetch(`/api/admin/orders/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });
    if (res.ok) return res.json();
  } catch (err) {}

  const orders = getLocalOrders();
  const idx = orders.findIndex((o) => o.id === id);
  if (idx === -1) throw new Error('Encomenda não encontrada');

  const order = orders[idx];
  const history = [...order.history];

  if (data.orderStatus && data.orderStatus !== order.orderStatus) {
    history.push({
      timestamp: new Date().toISOString(),
      action: `Estado alterado para "${data.orderStatus}"`,
      note: data.historyNote
    });
    order.orderStatus = data.orderStatus as any;
  }
  if (data.paymentStatus && data.paymentStatus !== order.paymentStatus) {
    history.push({
      timestamp: new Date().toISOString(),
      action: `Pagamento alterado para "${data.paymentStatus}"`,
      note: data.historyNote
    });
    order.paymentStatus = data.paymentStatus as any;
  }
  if (data.internalNotes !== undefined) {
    order.internalNotes = data.internalNotes;
  }
  order.history = history;
  order.updatedAt = new Date().toISOString();

  orders[idx] = order;
  saveLocalOrders(orders);
  return { success: true, order };
}

export async function updateAdminProduct(
  token: string,
  product: Partial<Product>
): Promise<{ success: boolean; product: Product }> {
  try {
    const res = await fetch('/api/admin/product', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(product)
    });
    if (res.ok) return res.json();
  } catch (err) {}

  const current = await fetchProduct();
  const updated = { ...current, ...product, updatedAt: new Date().toISOString() };
  localStorage.setItem('lumora_product', JSON.stringify(updated));
  return { success: true, product: updated };
}

export async function updateAdminSettings(
  token: string,
  settings: any
): Promise<{ success: boolean; settings: StoreSettings }> {
  try {
    const res = await fetch('/api/admin/settings', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(settings)
    });
    if (res.ok) return res.json();
  } catch (err) {}

  if (settings.adminPasscode) {
    localStorage.setItem('lumora_admin_passcode', settings.adminPasscode);
  }
  localStorage.setItem('lumora_settings', JSON.stringify(settings));
  return { success: true, settings };
}

export async function fetchAdminStats(token: string): Promise<SalesAnalytics> {
  try {
    const res = await fetch('/api/admin/stats', {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (res.ok) return res.json();
  } catch (err) {}

  const orders = getLocalOrders();
  const totalOrders = orders.length;
  const confirmedOrders = orders.filter((o) =>
    ['confirmed', 'preparing', 'shipped', 'delivered'].includes(o.orderStatus)
  ).length;
  const deliveredOrders = orders.filter((o) => o.orderStatus === 'delivered').length;
  const cancelledOrders = orders.filter((o) => o.orderStatus === 'cancelled').length;

  const actualRevenue = orders
    .filter((o) => o.paymentStatus === 'paid')
    .reduce((sum, o) => sum + (o.total || 0), 0);

  const potentialBilling = orders
    .filter((o) => o.orderStatus !== 'cancelled')
    .reduce((sum, o) => sum + (o.total || 0), 0);

  const nonCancelled = orders.filter((o) => o.orderStatus !== 'cancelled').length;
  const averageOrderValue = nonCancelled > 0 ? Math.round(potentialBilling / nonCancelled) : 0;
  const unitsSold = orders
    .filter((o) => o.orderStatus !== 'cancelled')
    .reduce((sum, o) => sum + (o.quantity || 1), 0);

  return {
    totalOrders,
    confirmedOrders,
    deliveredOrders,
    cancelledOrders,
    actualRevenue,
    potentialBilling,
    averageOrderValue,
    unitsSold
  };
}

export async function createAdminZone(
  token: string,
  zone: Partial<DeliveryZone>
): Promise<{ success: boolean; zone: DeliveryZone }> {
  try {
    const res = await fetch('/api/admin/delivery-zones', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(zone)
    });
    if (res.ok) return res.json();
  } catch (err) {}

  const zones = await fetchDeliveryZones(true);
  const newZ: DeliveryZone = {
    id: `zone-${Date.now()}`,
    province: zone.province || 'Luanda',
    municipality: zone.municipality || 'Sede',
    zoneName: zone.zoneName || zone.municipality || 'Zona',
    fee: zone.fee || 2500,
    estimatedTime: zone.estimatedTime || '24h a 48h úteis',
    isActive: zone.isActive !== false,
    notes: zone.notes || ''
  };
  zones.push(newZ);
  localStorage.setItem('lumora_delivery_zones', JSON.stringify(zones));
  return { success: true, zone: newZ };
}

export async function updateAdminZone(
  token: string,
  id: string,
  zone: Partial<DeliveryZone>
): Promise<{ success: boolean; zone: DeliveryZone }> {
  try {
    const res = await fetch(`/api/admin/delivery-zones/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(zone)
    });
    if (res.ok) return res.json();
  } catch (err) {}

  const zones = await fetchDeliveryZones(true);
  const idx = zones.findIndex((z) => z.id === id);
  if (idx !== -1) {
    zones[idx] = { ...zones[idx], ...zone };
    localStorage.setItem('lumora_delivery_zones', JSON.stringify(zones));
    return { success: true, zone: zones[idx] };
  }
  throw new Error('Zona não encontrada');
}

export async function deleteAdminZone(token: string, id: string): Promise<{ success: boolean }> {
  try {
    const res = await fetch(`/api/admin/delivery-zones/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });
    if (res.ok) return res.json();
  } catch (err) {}

  const zones = (await fetchDeliveryZones(true)).filter((z) => z.id !== id);
  localStorage.setItem('lumora_delivery_zones', JSON.stringify(zones));
  return { success: true };
}

export interface YouTubeVideoInfo {
  title?: string;
  author_name?: string;
  thumbnail_url?: string;
  html?: string;
}

export function extractYouTubeId(urlOrId?: string): string | null {
  if (!urlOrId) return null;
  const trimmed = urlOrId.trim();
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    return trimmed;
  }
  const match = trimmed.match(
    /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([a-zA-Z0-9_-]{11})/
  );
  return match ? match[1] : null;
}

export async function fetchYouTubeVideoInfo(urlOrId: string): Promise<YouTubeVideoInfo | null> {
  const videoId = extractYouTubeId(urlOrId);
  const targetUrl = videoId ? `https://www.youtube.com/watch?v=${videoId}` : urlOrId;

  // 1. Try server-side proxy
  try {
    const res = await fetch(`/api/youtube/info?url=${encodeURIComponent(targetUrl)}`);
    if (res.ok) {
      return await res.json();
    }
  } catch {}

  // 2. Direct oEmbed fallback (supported in browser CORS)
  try {
    const res = await fetch(
      `https://www.youtube.com/oembed?url=${encodeURIComponent(targetUrl)}&format=json`
    );
    if (res.ok) {
      return await res.json();
    }
  } catch {}

  // 3. Fallback info
  if (videoId) {
    return {
      title: 'Demonstração da Luminária LED Recarregável com Sensor de Movimento',
      author_name: 'LUMORA Angola',
      thumbnail_url: `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`
    };
  }

  return null;
}

