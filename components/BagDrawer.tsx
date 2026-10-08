'use client';
import { useState } from 'react';
import { X, Minus, Plus, ShoppingBag } from 'lucide-react';
import { useCartStore, useUIStore } from '@/lib/store';
import { formatPrice } from '@/lib/types';
import { BraceletSVG } from './BraceletSVG';

const FREE_SHIPPING = 40;
const FREE_GIFT = 100;
const BUNDLE_THRESHOLD = 3;
const BUNDLE_DISCOUNT = 0.10;

export function BagDrawer() {
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const { cartOpen, setCartOpen, currency } = useUIStore();
  const { items, removeItem, updateQty, subtotal, totalItems } = useCartStore();
  const sub = subtotal();

  const totalQty = items.reduce((s, i) => s + i.quantity, 0);
  const hasDiscount = totalQty >= BUNDLE_THRESHOLD;
  const discount = hasDiscount ? sub * BUNDLE_DISCOUNT : 0;
  const total = sub - discount;

  const progressPct = Math.min(100, (total / FREE_GIFT) * 100);
  const shippingPct = Math.min(100, (total / FREE_SHIPPING) * 100);

  if (!cartOpen) return null;

  return (
    <>
      <div
        className="drawer-backdrop"
        onClick={() => setCartOpen(false)}
        aria-hidden="true"
      />
      <aside
        className="bag-drawer"
        role="dialog"
        aria-label="Shopping bag"
        aria-modal="true"
      >
        <div className="drawer-header">
          <span className="drawer-title">
            Bag&nbsp;
            <span className="font-mono" style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              ({totalItems()} items)
            </span>
          </span>
          <button
            className="icon-btn"
            onClick={() => setCartOpen(false)}
            aria-label="Close bag"
          >
            <X size={18} />
          </button>
        </div>

        {/* Progress bars */}
        {items.length > 0 && (
          <div style={{ padding: '12px 20px 0', flexShrink: 0 }}>
            <div className="progress-bar-wrap" style={{ marginTop: '20px' }}>
              <div
                className="progress-bar-fill"
                style={{ width: `${progressPct}%` }}
              />
              <span className="progress-milestone" style={{ left: `${(FREE_SHIPPING / FREE_GIFT) * 100}%` }}>
                Free ship €{FREE_SHIPPING}
              </span>
              <span className="progress-milestone" style={{ left: '100%' }}>
                Free gift €{FREE_GIFT}
              </span>
            </div>
            <p className="font-mono" style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: '8px' }}>
              {total >= FREE_GIFT
                ? 'Free gift included.'
                : total >= FREE_SHIPPING
                ? `${formatPrice(FREE_GIFT - total, currency)} away from a free gift.`
                : `${formatPrice(FREE_SHIPPING - total, currency)} away from free shipping.`}
            </p>
          </div>
        )}

        <div className="drawer-body">
          {items.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>
              <ShoppingBag size={40} style={{ margin: '0 auto 16px', opacity: 0.3 }} />
              <p className="font-mono" style={{ fontSize: '0.78rem' }}>Your bag is empty.</p>
            </div>
          ) : (
            items.map(item => (
              <div key={`${item.productId}-${item.finishId}-${item.size}`} className="cart-item">
                <div className="cart-item-image">
                  <BraceletSVG finishId={item.finishId} size={40} />
                </div>
                <div>
                  <div className="cart-item-name">{item.name}</div>
                  <div className="cart-item-meta">
                    {item.finishLabel}{item.size ? ` · ${item.size}` : ''}
                  </div>
                  <div className="qty-stepper" style={{ marginTop: '6px' }}>
                    <button
                      className="qty-btn"
                      onClick={() => updateQty(item.productId, item.finishId, item.size, item.quantity - 1)}
                      aria-label="Decrease quantity"
                    >
                      <Minus size={10} />
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      className="qty-btn"
                      onClick={() => updateQty(item.productId, item.finishId, item.size, item.quantity + 1)}
                      aria-label="Increase quantity"
                    >
                      <Plus size={10} />
                    </button>
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
                  <span className="font-mono" style={{ fontSize: '0.85rem' }}>
                    {formatPrice(item.price * item.quantity, currency)}
                  </span>
                  <button
                    className="icon-btn"
                    style={{ width: 24, height: 24 }}
                    onClick={() => removeItem(item.productId, item.finishId, item.size)}
                    aria-label={`Remove ${item.name}`}
                  >
                    <X size={12} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className="drawer-footer">
            {hasDiscount && (
              <div className="totals-row discount">
                <span>Stack discount (10%)</span>
                <span>−{formatPrice(discount, currency)}</span>
              </div>
            )}
            <div className="totals-row">
              <span>Subtotal</span>
              <span>{formatPrice(sub, currency)}</span>
            </div>
            {hasDiscount && (
              <div className="totals-row total">
                <span>Total</span>
                <span>{formatPrice(total, currency)}</span>
              </div>
            )}
            {/* INTEGRATION POINT: Connects to /api/checkout for Stripe or custom processor */}
            <button
              type="button"
              className="btn-primary"
              style={{ textAlign: 'center', justifyContent: 'center', cursor: 'pointer' }}
              id="checkout-btn"
              disabled={isCheckingOut}
              onClick={async () => {
                try {
                  setIsCheckingOut(true);
                  const res = await fetch('/api/checkout', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ items, currency }),
                  });
                  const data = await res.json();
                  if (data?.url) {
                    window.location.href = data.url;
                  } else {
                    window.location.href = '/checkout/mock-success';
                  }
                } catch {
                  window.location.href = '/checkout/mock-success';
                } finally {
                  setIsCheckingOut(false);
                }
              }}
            >
              {isCheckingOut ? 'Preparing Checkout...' : 'Checkout'}
            </button>
            <p className="font-mono" style={{ fontSize: '0.6rem', color: 'var(--text-muted)', textAlign: 'center' }}>
              Taxes calculated at checkout · Secure payment
            </p>
          </div>
        )}
      </aside>
    </>
  );
}
