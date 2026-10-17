import {
  Product,
  DeliveryZone,
  StoreSettings,
  CreateOrderPayload,
  OrderConfirmationResult,
  Order,
  SalesAnalytics
} from '../types';

export async function fetchProduct(): Promise<Product> {
  const res = await fetch('/api/product');
  if (!res.ok) throw new Error('Não foi possível carregar as informações do produto.');
  return res.json();
}

export async function fetchDeliveryZones(all = false, token?: string): Promise<DeliveryZone[]> {
  const headers: HeadersInit = {};
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(`/api/delivery-zones${all ? '?all=true' : ''}`, { headers });
  if (!res.ok) throw new Error('Não foi possível carregar as zonas de entrega.');
  return res.json();
}

export async function fetchSettings(): Promise<StoreSettings> {
  const res = await fetch('/api/settings');
  if (!res.ok) throw new Error('Não foi possível carregar as configurações da loja.');
  return res.json();
}

export async function createOrder(payload: CreateOrderPayload): Promise<OrderConfirmationResult> {
  const res = await fetch('/api/orders', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Ocorreu um erro ao submeter a tua encomenda.');
  }
  return data;
}

export async function createStripePaymentIntent(
  amountKz: number,
  customerName: string,
  customerPhone: string
): Promise<{ clientSecret: string; id: string; amountUsd: number; publishableKey: string }> {
  const res = await fetch('/api/stripe/create-payment-intent', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ amountKz, customerName, customerPhone })
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Erro ao comunicar com a Stripe.');
  }
  return data;
}

export async function trackOrder(query: string): Promise<any> {
  const res = await fetch(`/api/orders/track?q=${encodeURIComponent(query)}`);
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Encomenda não encontrada.');
  }
  return data;
}

export async function adminLogin(passcode: string): Promise<{ success: boolean; token: string }> {
  const res = await fetch('/api/admin/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ passcode })
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Palavra-passe inválida');
  }
  return data;
}

export async function adminVerify(token: string): Promise<boolean> {
  try {
    const res = await fetch('/api/admin/auth/verify', {
      headers: { Authorization: `Bearer ${token}` }
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function fetchAdminOrders(
  token: string,
  filters?: { search?: string; orderStatus?: string; paymentStatus?: string; province?: string }
): Promise<Order[]> {
  const params = new URLSearchParams();
  if (filters?.search) params.append('search', filters.search);
  if (filters?.orderStatus) params.append('orderStatus', filters.orderStatus);
  if (filters?.paymentStatus) params.append('paymentStatus', filters.paymentStatus);
  if (filters?.province) params.append('province', filters.province);

  const res = await fetch(`/api/admin/orders?${params.toString()}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) throw new Error('Falha ao carregar encomendas.');
  return res.json();
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
  const res = await fetch(`/api/admin/orders/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(data)
  });
  const result = await res.json();
  if (!res.ok) throw new Error(result.error || 'Erro ao actualizar encomenda');
  return result;
}

export async function updateAdminProduct(
  token: string,
  product: Partial<Product>
): Promise<{ success: boolean; product: Product }> {
  const res = await fetch('/api/admin/product', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(product)
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Erro ao actualizar produto');
  return data;
}

export async function updateAdminSettings(
  token: string,
  settings: any
): Promise<{ success: boolean; settings: StoreSettings }> {
  const res = await fetch('/api/admin/settings', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(settings)
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Erro ao actualizar configurações');
  return data;
}

export async function fetchAdminStats(token: string): Promise<SalesAnalytics> {
  const res = await fetch('/api/admin/stats', {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) throw new Error('Falha ao carregar métricas.');
  return res.json();
}

export async function createAdminZone(
  token: string,
  zone: Partial<DeliveryZone>
): Promise<{ success: boolean; zone: DeliveryZone }> {
  const res = await fetch('/api/admin/delivery-zones', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(zone)
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Erro ao criar zona');
  return data;
}

export async function updateAdminZone(
  token: string,
  id: string,
  zone: Partial<DeliveryZone>
): Promise<{ success: boolean; zone: DeliveryZone }> {
  const res = await fetch(`/api/admin/delivery-zones/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(zone)
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Erro ao actualizar zona');
  return data;
}

export async function deleteAdminZone(token: string, id: string): Promise<{ success: boolean }> {
  const res = await fetch(`/api/admin/delivery-zones/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` }
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Erro ao apagar zona');
  return data;
}
