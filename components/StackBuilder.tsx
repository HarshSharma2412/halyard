'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Plus, X, ShoppingBag, Check } from 'lucide-react';
import products from '@/lib/products.json';
import type { Product } from '@/lib/types';
import { formatPrice, getProductPrice } from '@/lib/types';
import { useCartStore, useUIStore } from '@/lib/store';
import { BraceletSVG } from './BraceletSVG';

export function StackBuilder() {
  const currency = useUIStore((s) => s.currency);
  const addItem = useCartStore((s) => s.addItem);
  const triggerBagPop = useUIStore((s) => s.triggerBagPop);
  const setCartOpen = useUIStore((s) => s.setCartOpen);

  // Slots can hold a product ID or null
  const [selectedIds, setSelectedIds] = useState<(string | null)[]>([
    'cuban-chain-steel',
    'stack-cuff-steel',
    'rope-chain-steel',
  ]);

  const [activeSlotModal, setActiveSlotModal] = useState<number | null>(null);

  const selectedProducts = selectedIds.map((id) =>
    id ? (products.find((p) => p.id === id) as Product | undefined) : null
  );

  const rawSubtotal = selectedProducts.reduce((sum, p) => {
    return sum + (p ? getProductPrice(p, p.defaultFinish) : 0);
  }, 0);

  const discount = selectedProducts.filter(Boolean).length === 3 ? rawSubtotal * 0.1 : 0;
  const finalPrice = rawSubtotal - discount;

  const handleSelectProduct = (slotIdx: number, productId: string) => {
    const next = [...selectedIds];
    next[slotIdx] = productId;
    setSelectedIds(next);
    setActiveSlotModal(null);
  };

  const handleRemoveSlot = (slotIdx: number) => {
    const next = [...selectedIds];
    next[slotIdx] = null;
    setSelectedIds(next);
  };

  const handleAddStackToBag = () => {
    selectedProducts.forEach((p) => {
      if (p) {
        addItem({
          productId: p.id,
          finishId: p.defaultFinish,
          size: p.unisize ? undefined : 'M',
          quantity: 1,
          price: getProductPrice(p, p.defaultFinish),
          name: p.name,
          finishLabel: p.finishes.find((f) => f.id === p.defaultFinish)?.label || 'Silver',
        });
      }
    });
    triggerBagPop();
    setCartOpen(true);
  };

  return (
    <div className="stack-builder">
      <div className="section-label">Custom Layering</div>
      <h2 className="section-title">Stack Builder &amp; Save 10%</h2>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', maxWidth: '48ch', lineHeight: 1.6 }}>
        Combine three complementary silhouettes for balanced textural contrast.
        A 10% bundle discount is applied automatically when all three slots are filled.
      </p>

      {/* 3 Slots */}
      <div className="stack-slots">
        {[0, 1, 2].map((slotIdx) => {
          const item = selectedProducts[slotIdx];

          if (item) {
            return (
              <div
                key={slotIdx}
                className="stack-slot filled"
                style={{ position: 'relative', flexDirection: 'column', padding: '8px' }}
              >
                <button
                  type="button"
                  onClick={() => handleRemoveSlot(slotIdx)}
                  style={{
                    position: 'absolute',
                    top: '4px',
                    right: '4px',
                    background: 'var(--bg-3)',
                    border: 'none',
                    borderRadius: '50%',
                    color: 'var(--text)',
                    cursor: 'pointer',
                    padding: '3px',
                    display: 'flex',
                  }}
                  aria-label={`Remove ${item.name}`}
                >
                  <X size={12} />
                </button>
                <BraceletSVG product={item} finishId={item.defaultFinish} size={64} />
                <span
                  style={{
                    fontSize: '0.62rem',
                    textAlign: 'center',
                    marginTop: '4px',
                    textTransform: 'uppercase',
                    color: 'var(--text)',
                    fontWeight: 600,
                  }}
                >
                  {item.name}
                </span>
                <span style={{ fontSize: '0.6rem', color: 'var(--text-muted)' }}>
                  {formatPrice(getProductPrice(item, item.defaultFinish), currency)}
                </span>
              </div>
            );
          }

          return (
            <button
              key={slotIdx}
              type="button"
              className="stack-slot"
              onClick={() => setActiveSlotModal(slotIdx)}
              aria-label={`Select item for slot ${slotIdx + 1}`}
            >
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                <Plus size={20} />
                <span>Slot {slotIdx + 1}</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Price and CTA */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '24px',
          flexWrap: 'wrap',
          marginTop: '16px',
        }}
      >
        <div>
          {discount > 0 && (
            <div
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '0.72rem',
                color: 'var(--text-muted)',
                textDecoration: 'line-through',
              }}
            >
              {formatPrice(rawSubtotal, currency)}
            </div>
          )}
          <div className="stack-price-display">
            {formatPrice(finalPrice, currency)}
            {discount > 0 && (
              <span
                style={{
                  fontSize: '0.65rem',
                  marginLeft: '8px',
                  color: 'var(--accent-hi)',
                  letterSpacing: '0.04em',
                }}
              >
                (10% SAVINGS APPLIED)
              </span>
            )}
          </div>
        </div>

        <button
          type="button"
          className="btn-primary"
          disabled={selectedProducts.filter(Boolean).length === 0}
          onClick={handleAddStackToBag}
          style={{ opacity: selectedProducts.filter(Boolean).length === 0 ? 0.5 : 1 }}
        >
          <ShoppingBag size={14} /> Add Stack to Bag
        </button>
      </div>

      {/* Modal / Selector drawer for choosing a product for slot */}
      {activeSlotModal !== null && (
        <div className="modal-backdrop" onClick={() => setActiveSlotModal(null)}>
          <div
            className="modal"
            style={{ display: 'block', padding: '24px', maxWidth: '640px' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '16px',
                borderBottom: '1px solid var(--border)',
                paddingBottom: '12px',
              }}
            >
              <h3
                style={{
                  fontFamily: "'Archivo', sans-serif",
                  fontSize: '1.1rem',
                  textTransform: 'uppercase',
                }}
              >
                Select Bracelet for Slot {activeSlotModal + 1}
              </h3>
              <button
                type="button"
                className="modal-close"
                onClick={() => setActiveSlotModal(null)}
                style={{ position: 'static' }}
              >
                <X size={16} />
              </button>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
                gap: '12px',
                maxHeight: '60vh',
                overflowY: 'auto',
                paddingRight: '6px',
              }}
            >
              {(products as Product[]).map((p) => {
                const isChosen = selectedIds.includes(p.id);
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => handleSelectProduct(activeSlotModal, p.id)}
                    style={{
                      background: isChosen ? 'var(--accent-lo)' : 'var(--bg-3)',
                      border: isChosen ? '1px solid var(--accent)' : '1px solid var(--border)',
                      borderRadius: '4px',
                      padding: '12px 8px',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      textAlign: 'center',
                      color: 'var(--text)',
                    }}
                  >
                    <BraceletSVG product={p} finishId={p.defaultFinish} size={64} />
                    <span
                      style={{
                        fontFamily: "'Archivo', sans-serif",
                        fontWeight: 700,
                        fontSize: '0.72rem',
                        textTransform: 'uppercase',
                        marginTop: '6px',
                      }}
                    >
                      {p.name}
                    </span>
                    <span
                      style={{
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: '0.65rem',
                        color: 'var(--accent-hi)',
                        marginTop: '2px',
                      }}
                    >
                      {formatPrice(getProductPrice(p, p.defaultFinish), currency)}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
