export type OrderStatus =
  | 'new'
  | 'awaiting_confirmation'
  | 'confirmed'
  | 'preparing'
  | 'shipped'
  | 'delivered'
  | 'cancelled';

export type PaymentStatus = 'pending' | 'paid' | 'cancelled';

export type PaymentMethodType = 'cash_on_delivery' | 'bank_transfer' | 'stripe';

export type AppTab = 'home' | 'product' | 'benefits' | 'how_it_works' | 'faq' | 'checkout';

export interface ProductSpec {
  label: string;
  value: string;
  needsConfirmation?: boolean;
}

export interface Product {
  id: string;
  name: string;
  tagline: string;
  price: number;
  currency: string;
  stock: number;
  inStock: boolean;
  isActive: boolean;
  description: string;
  features: string[];
  specs: ProductSpec[];
  images: string[];
  platformVideoUrl?: string;
  youtubeVideoUrl?: string;
  youtubeVideoTitle?: string;
  updatedAt: string;
}

export interface DeliveryZone {
  id: string;
  province: string;
  municipality: string;
  zoneName: string;
  fee: number;
  estimatedTime: string;
  isActive: boolean;
  notes?: string;
}

export interface BankAccount {
  id: string;
  bank: string;
  holder: string;
  iban: string;
  accountNumber?: string;
}

export interface StripeConfig {
  enabled: boolean;
  publishableKey: string;
  secretKey?: string;
  currency?: string;
}

export interface PaymentMethodConfig {
  id: 'cash_on_delivery' | 'bank_transfer' | 'stripe';
  name: string;
  enabled: boolean;
  description: string;
  allowedProvinces?: string[];
  accounts?: BankAccount[];
  instructions?: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  order: number;
}

export interface StorePolicies {
  terms: string;
  privacy: string;
  delivery: string;
  returns: string;
}

export interface StoreSettings {
  brandName: string;
  slogan: string;
  whatsappNumber: string;
  whatsappDisplay: string;
  email: string;
  currency: string;
  faqs: FAQItem[];
  stripeConfig: StripeConfig;
  paymentMethods: {
    cash_on_delivery: PaymentMethodConfig;
    bank_transfer: PaymentMethodConfig;
    stripe?: PaymentMethodConfig;
  };
  policies: StorePolicies;
}

export interface OrderStatusHistory {
  timestamp: string;
  action: string;
  note?: string;
}

export interface Order {
  id: string;
  customerName: string;
  customerPhone: string;
  province: string;
  municipality: string;
  neighborhood: string;
  address: string;
  referencePoint: string;
  notes?: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  deliveryFee: number;
  total: number;
  paymentMethod: PaymentMethodType;
  stripePaymentIntentId?: string;
  orderStatus: OrderStatus;
  paymentStatus: PaymentStatus;
  internalNotes?: string;
  history: OrderStatusHistory[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrderPayload {
  customerName: string;
  customerPhone: string;
  province: string;
  municipality: string;
  neighborhood: string;
  address: string;
  referencePoint: string;
  notes?: string;
  quantity: number;
  paymentMethod: PaymentMethodType;
  stripePaymentIntentId?: string;
}

export interface OrderConfirmationResult {
  order: Order;
  whatsappMessage: string;
  bankTransferDetails?: {
    accounts: BankAccount[];
    instructions?: string;
  };
  stripeDetails?: {
    paid: boolean;
    receiptNotice?: string;
  };
}

export interface SalesAnalytics {
  totalOrders: number;
  confirmedOrders: number;
  deliveredOrders: number;
  cancelledOrders: number;
  actualRevenue: number;
  potentialBilling: number;
  averageOrderValue: number;
  unitsSold: number;
}
