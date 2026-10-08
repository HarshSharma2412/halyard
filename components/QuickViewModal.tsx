'use client';
import { useEffect, useCallback } from 'react';
import { X, Heart, ShoppingBag } from 'lucide-react';
import { useUIStore, useCartStore, useSavedStore } from '@/lib/store';
import { formatPrice, getProductPrice } from '@/lib/types';
import type { Product } from '@/lib/types';
import products from '@/lib/products.json';
import { BraceletSVG } from './BraceletSVG';
import { useState } from 'react';
import Link from 'next/link';

export function QuickViewModal() {
  const { quickViewId, setQuickView, currency } = useUIStore();
  const addItem = useCartStore(s => s.addItem);
  const { toggle, isSaved } = useSavedStore();
  const triggerBagPop = useUIStore(s => s.triggerBagPop);
  const setCartOpen = useUIStore(s => s.setCartOpen);

  const product = products.find(p => p.id === quickViewId) as Product | undefined;
  const [finishId, setFinishId] = useState(product?.defaultFinish ?? '');
  const [size, setSize] = useState<string>('');
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);

  useEffect(() => {
    if (product) {
      setFinishId(product.defaultFinish);
      setSize('');
      setOpenAccordion(null);
    }
  }, [product]);

  const close = useCallback(() => setQuickView(null), [setQuickView]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') close(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [close]);

  if (!product) return null;

  const price = getProductPrice(product as Product, finishId);
  const finish = product.finishes.find(f => f.id === finishId) ?? product.finishes[0];
  const saved = isSaved(product.id, finishId);

  const handleAdd = () => {
    if (!product.unisize && !size) return;
    addItem({
      productId: product.id,
      finishId,
      size: product.unisize ? undefined : size,
      quantity: 1,
      price,
      name: product.name,
      finishLabel: finish.label,
    });
    close();
    triggerBagPop();
    setCartOpen(true);
  };

  const sizes = ['S', 'M', 'L'];

  const accordions = [
    { id: 'specs', label: 'Specifications', content: (
      <ul className="spec-list">
        <li><span className="row-label">Finish</span><strong>{finish.label}</strong></li>
        <li><span className="row-label">Width</span><strong>{product.specs.width} mm</strong></li>
        <li><span className="row-label">Weight</span><strong>~{product.specs.weight} g</strong></li>
        <li><span className="row-label">Fit</span><strong>{product.specs.fit}</strong></li>
        <li><span className="row-label">Warranty</span><strong>Lifetime</strong></li>
      </ul>
    )},
    { id: 'care', label: 'Care', content: <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>{product.care}</p> },
  ];

  return (
    <div
      className="modal-backdrop"
      onClick={e => { if (e.target === e.currentTarget) close(); }}
      role="dialog"
      aria-modal="true"
      aria-label={`Quick view: ${product.name}`}
    >
      <div className="modal">
        <button className="modal-close" onClick={close} aria-label="Close">
          <X size={14} />
        </button>

        {/* Image */}
        <div className="modal-image">
          <BraceletSVG finishId={finishId} size={200} type={product.type} />
        </div>

        {/* Body */}
        <div className="modal-body">
          <div>
            <div style={{ display: 'flex', gap: '6px', marginBottom: '8px' }}>
              {product.badge.map(b => (
                <span key={b} className="card-badge">{b}</span>
              ))}
            </div>
            <h2 className="modal-name">{product.name}</h2>
            <p className="modal-price">{formatPrice(price, currency)}</p>
          </div>

          <p className="modal-desc">{product.description}</p>

          {/* Finish switcher */}
          <div>
            <p className="font-mono" style={{ fontSize: '0.65rem', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '8px' }}>
              Finish — {finish.label}
            </p>
            <div className="finish-dots">
              {product.finishes.map(f => (
                <button
                  key={f.id}
                  className={`finish-dot ${finishId === f.id ? 'active' : ''}`}
                  style={{ background: f.gradient }}
                  onClick={() => setFinishId(f.id)}
                  aria-label={`Select ${f.label} finish`}
                  aria-pressed={finishId === f.id}
                />
              ))}
            </div>
          </div>

          {/* Size selector */}
          {!product.unisize && (
            <div>
              <p className="font-mono" style={{ fontSize: '0.65rem', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '8px' }}>
                Size{size ? ` — ${size}` : ' — Select'}
              </p>
              <div className="size-selector">
                {sizes.map(s => (
                  <button
                    key={s}
                    className={`size-btn ${size === s ? 'active' : ''}`}
                    onClick={() => setSize(s)}
                    aria-pressed={size === s}
                  >
                    {s}
                  </button>
                ))}
              </div>
              <Link
                href="/fit-finder"
                className="font-mono"
                style={{ fontSize: '0.65rem', color: 'var(--accent-hi)', textDecoration: 'none', display: 'inline-block', marginTop: '8px' }}
                onClick={close}
              >
                Find your fit →
              </Link>
            </div>
          )}

          {/* Accordions */}
          {accordions.map(a => (
            <div key={a.id} className="accordion-item">
              <button
                className="accordion-trigger"
                onClick={() => setOpenAccordion(openAccordion === a.id ? null : a.id)}
                aria-expanded={openAccordion === a.id}
              >
                {a.label}
                <span aria-hidden="true">{openAccordion === a.id ? '−' : '+'}</span>
              </button>
              <div
                className="accordion-content"
                style={{ maxHeight: openAccordion === a.id ? '400px' : '0', overflow: 'hidden' }}
              >
                {a.content}
              </div>
            </div>
          ))}

          {/* Actions */}
          <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
            <button
              className="btn-primary"
              style={{ flex: 1, justifyContent: 'center' }}
              onClick={handleAdd}
              disabled={!product.unisize && !size}
              id={`quick-add-${product.id}`}
            >
              <ShoppingBag size={14} />
              Add to bag
            </button>
            <button
              className="icon-btn"
              style={{ border: '1px solid var(--border)', borderRadius: '999px', width: 46, height: 46 }}
              onClick={() => toggle(product.id, finishId)}
              aria-label={saved ? 'Remove from saved' : 'Save item'}
              aria-pressed={saved}
            >
              <Heart size={16} fill={saved ? 'currentColor' : 'none'} style={{ color: saved ? 'hsl(350 70% 60%)' : undefined }} />
            </button>
          </div>

          <Link
            href={`/bracelets/${product.slug}`}
            className="font-mono"
            style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textDecoration: 'none', letterSpacing: '0.06em' }}
            onClick={close}
          >
            View full details →
          </Link>
        </div>
      </div>
    </div>
  );
}
