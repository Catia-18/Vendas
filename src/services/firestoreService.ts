import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  addDoc,
  query,
  orderBy,
  limit,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '../firebase/config';
import {
  Product,
  DeliveryZone,
  StoreSettings,
  Order,
  CustomerTestimonial
} from '../types';
import {
  INITIAL_PRODUCT,
  INITIAL_DELIVERY_ZONES,
  INITIAL_SETTINGS,
  DEFAULT_TESTIMONIALS
} from '../data/defaultStore';

// Collection references
const PRODUCTS_COL = 'products';
const ORDERS_COL = 'orders';
const ZONES_COL = 'delivery_zones';
const SETTINGS_COL = 'settings';
const TESTIMONIALS_COL = 'testimonials';

/**
 * Initializes and seeds Firestore with initial LUMORA store data if not already populated.
 */
export async function seedFirestoreIfEmpty(): Promise<void> {
  try {
    const prodDocRef = doc(db, PRODUCTS_COL, INITIAL_PRODUCT.id);
    const prodSnap = await getDoc(prodDocRef);

    if (!prodSnap.exists()) {
      console.info('[Firestore] A inicializar base de dados LUMORA no Firestore...');
      // 1. Seed Product
      await setDoc(prodDocRef, {
        ...INITIAL_PRODUCT,
        updatedAt: new Date().toISOString()
      });

      // 2. Seed Settings
      await setDoc(doc(db, SETTINGS_COL, 'store_config'), {
        ...INITIAL_SETTINGS,
        updatedAt: new Date().toISOString()
      });

      // 3. Seed Delivery Zones
      for (const zone of INITIAL_DELIVERY_ZONES) {
        await setDoc(doc(db, ZONES_COL, zone.id), zone);
      }

      // 4. Seed Testimonials
      for (const item of DEFAULT_TESTIMONIALS) {
        await setDoc(doc(db, TESTIMONIALS_COL, item.id), {
          ...item,
          createdAt: new Date().toISOString()
        });
      }

      console.info('[Firestore] Base de dados configurada e povoada com sucesso!');
    }
  } catch (error) {
    console.warn('[Firestore] Seed automático não necessário ou já existente:', error);
  }
}

/**
 * Fetches the official LUMORA product from Firestore.
 */
export async function getProductFromFirestore(): Promise<Product | null> {
  try {
    const prodDocRef = doc(db, PRODUCTS_COL, INITIAL_PRODUCT.id);
    const snap = await getDoc(prodDocRef);
    if (snap.exists()) {
      return snap.data() as Product;
    }
  } catch (error) {
    console.warn('[Firestore] Erro ao carregar produto do Firestore:', error);
  }
  return null;
}

/**
 * Saves or updates a customer order in Firestore.
 */
export async function saveOrderToFirestore(order: Order): Promise<boolean> {
  try {
    const orderDocRef = doc(db, ORDERS_COL, order.id);
    await setDoc(orderDocRef, {
      ...order,
      syncedToCloud: true,
      updatedAt: new Date().toISOString()
    });
    console.info(`[Firestore] Encomenda ${order.id} gravada com sucesso na base de dados!`);
    return true;
  } catch (error) {
    console.error('[Firestore] Falha ao gravar encomenda no Firestore:', error);
    return false;
  }
}

/**
 * Fetches an order by tracking ID from Firestore.
 */
export async function getOrderFromFirestore(orderId: string): Promise<Order | null> {
  try {
    const cleanId = orderId.trim().toUpperCase();
    const snap = await getDoc(doc(db, ORDERS_COL, cleanId));
    if (snap.exists()) {
      return snap.data() as Order;
    }
  } catch (error) {
    console.warn('[Firestore] Erro ao buscar encomenda no Firestore:', error);
  }
  return null;
}

/**
 * Saves a new customer review/testimonial in Firestore.
 */
export async function saveTestimonialToFirestore(
  testimonial: CustomerTestimonial
): Promise<boolean> {
  try {
    const ref = doc(db, TESTIMONIALS_COL, testimonial.id);
    await setDoc(ref, {
      ...testimonial,
      createdAt: new Date().toISOString()
    });
    return true;
  } catch (error) {
    console.error('[Firestore] Erro ao gravar depoimento no Firestore:', error);
    return false;
  }
}

/**
 * Fetches all customer testimonials from Firestore.
 */
export async function getTestimonialsFromFirestore(): Promise<CustomerTestimonial[]> {
  try {
    const q = query(collection(db, TESTIMONIALS_COL), limit(50));
    const querySnapshot = await getDocs(q);
    const results: CustomerTestimonial[] = [];
    querySnapshot.forEach((d) => {
      results.push(d.data() as CustomerTestimonial);
    });
    if (results.length > 0) return results;
  } catch (error) {
    console.warn('[Firestore] Usando dados padrão de depoimentos:', error);
  }
  return DEFAULT_TESTIMONIALS;
}
