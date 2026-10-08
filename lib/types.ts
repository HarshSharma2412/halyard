export interface ProductFinish {
  id: string;
  label: string;
  priceAdj: number;
  gradient: string;
}

export interface ProductSpecs {
  width: number;
  weight: number;
  fit: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  type: 'chain' | 'cuff' | 'signet';
  material: 'steel' | 'silver';
  badge: string[];
  unisize: boolean;
  basePrice: number;
  finishes: ProductFinish[];
  defaultFinish: string;
  specs: ProductSpecs;
  description: string;
  care: string;
  images: string[];
  wearWith: string[];
}

export interface CartItem {
  productId: string;
  finishId: string;
  size?: string;
  quantity: number;
  price: number;
  name: string;
  finishLabel: string;
}

export interface SavedItem {
  productId: string;
  finishId: string;
}

export type Currency = 'EUR' | 'USD' | 'INR';

export const CURRENCY_SYMBOLS: Record<Currency, string> = {
  EUR: '€',
  USD: '$',
  INR: '₹',
};

export const CURRENCY_RATES: Record<Currency, number> = {
  EUR: 1,
  USD: 1.09,
  INR: 91.5,
};

export function formatPrice(eur: number, currency: Currency): string {
  const symbol = CURRENCY_SYMBOLS[currency];
  const rate = CURRENCY_RATES[currency];
  const amount = eur * rate;
  if (currency === 'INR') return `${symbol}${Math.round(amount).toLocaleString('en-IN')}`;
  return `${symbol}${amount.toFixed(2)}`;
}

export function getProductPrice(product: Product, finishId: string): number {
  const finish = product.finishes.find(f => f.id === finishId);
  return product.basePrice + (finish?.priceAdj ?? 0);
}
