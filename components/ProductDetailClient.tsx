'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Heart, ShoppingBag, ShieldCheck, Droplets, RotateCcw, ChevronDown, Ruler, ArrowRight } from 'lucide-react';
import type { Product } from '@/lib/types';
import { formatPrice, getProductPrice } from '@/lib/types';
import { useCartStore, useSavedStore, useUIStore } from '@/lib/store';
import { BraceletSVG } from './BraceletSVG';
import { ProductCard } from './ProductCard';

interface ProductDetailClientProps {
  product: Product;
  wearWithProducts: Product[];
}

export function ProductDetailClient({ product, wearWithProducts }: ProductDetailClientProps) {
  const [activeFinishId, setActiveFinishId] = useState(product.defaultFinish);
  const [selectedSize, setSelectedSize] = useState<string>(product.unisize ? 'Unisize' : 'M');
  const [openAccordion, setOpenAccordion] = useState<string | null>('specs');

  const currency = useUIStore((s) => s.currency);
  const addItem = useCartStore((s) => s.addItem);
  const triggerBagPop = useUIStore((s) => s.triggerBagPop);
  const setCartOpen = useUIStore((s) => s.setCartOpen);
  const { toggle, isSaved } = useSavedStore();

  const currentPrice = getProductPrice(product, activeFinishId);
  const activeFinish = product.finishes.find((f) => f.id === activeFinishId) ?? product.finishes[0];
  const saved = isSaved(product.id, activeFinishId);

  const handleAdd = () => {
    addItem({
      productId: product.id,
      finishId: activeFinishId,
      size: product.unisize ? undefined : selectedSize,
      quantity: 1,
      price: currentPrice,
      name: product.name,
      finishLabel: activeFinish.label,
    });
    triggerBagPop();
    setCartOpen(true);
  };

  const toggleAccordion = (id: string) => {
    setOpenAccordion((prev) => (prev === id ? null : id));
  };

  return (
    <div className="pdp-container">
      <div className="pdp-grid">
        {/* Gallery / Interactive Visual Stage */}
        <div className="pdp-gallery">
          <div
            style={{
              width: 'min(420px, 90vw)',
              height: 'min(420px, 90vw)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <BraceletSVG product={product} finishId={activeFinishId} size={320} />
          </div>

          {/* Finish switch thumbnails */}
          {product.finishes.length > 1 && (
            <div className="pdp-thumb" aria-label="Select finish visual">
              {product.finishes.map((f) => (
                <button
                  key={f.id}
                  type="button"
                  className={`pdp-thumb-item ${f.id === activeFinishId ? 'active' : ''}`}
                  onClick={() => setActiveFinishId(f.id)}
                  title={f.label}
                  aria-label={f.label}
                >
                  <div
                    style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      background: f.gradient,
                    }}
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info & Purchase Column */}
        <div className="pdp-body">
          <div className="pdp-badges">
            <span className={`card-badge ${product.material === 'silver' ? 'silver-badge' : ''}`}>
              {product.material === 'silver' ? '925 Sterling Silver' : 'Recycled 316L Steel'}
            </span>
            {product.badge?.map((b) => (
              <span key={b} className="card-badge">
                {b}
              </span>
            ))}
          </div>

          <div>
            <h1 className="pdp-name">{product.name}</h1>
            <div className="pdp-price" style={{ marginTop: '8px' }}>
              {formatPrice(currentPrice, currency)}
            </div>
          </div>

          <p className="pdp-desc">{product.description}</p>

          {/* Finish Selection */}
          <div>
            <div
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '0.72rem',
                textTransform: 'uppercase',
                color: 'var(--text-muted)',
                marginBottom: '8px',
              }}
            >
              Finish: <strong style={{ color: 'var(--text)' }}>{activeFinish.label}</strong>
              {activeFinish.priceAdj > 0 && ` (+€${activeFinish.priceAdj})`}
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              {product.finishes.map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setActiveFinishId(f.id)}
                  className={`finish-dot ${f.id === activeFinishId ? 'active' : ''}`}
                  style={{
                    background: f.gradient,
                    width: '28px',
                    height: '28px',
                  }}
                  title={f.label}
                  aria-label={f.label}
                />
              ))}
            </div>
          </div>

          {/* Size Selection */}
          <div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '8px',
              }}
            >
              <span
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: '0.72rem',
                  textTransform: 'uppercase',
                  color: 'var(--text-muted)',
                }}
              >
                Size: <strong style={{ color: 'var(--text)' }}>{selectedSize}</strong>
              </span>
              <Link
                href="/fit-finder"
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: '0.68rem',
                  color: 'var(--accent-hi)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  textDecoration: 'none',
                }}
              >
                <Ruler size={12} /> Fit Guide
              </Link>
            </div>

            {product.unisize ? (
              <div
                style={{
                  background: 'var(--bg-3)',
                  border: '1px solid var(--border)',
                  padding: '10px 14px',
                  borderRadius: '4px',
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: '0.75rem',
                  color: 'var(--text-muted)',
                }}
              >
                {product.specs.fit} (Adjustable extension link included)
              </div>
            ) : (
              <div className="size-selector">
                {['S', 'M', 'L', 'XL'].map((s) => (
                  <button
                    key={s}
                    type="button"
                    className={`size-btn ${selectedSize === s ? 'active' : ''}`}
                    onClick={() => setSelectedSize(s)}
                  >
                    Size {s}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Actions: Add to Bag + Wishlist */}
          <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
            <button
              type="button"
              className="btn-primary"
              style={{ flex: 1, justifyContent: 'center' }}
              onClick={handleAdd}
            >
              <ShoppingBag size={16} /> Add to Bag &bull; {formatPrice(currentPrice, currency)}
            </button>
            <button
              type="button"
              className={`icon-btn ${saved ? 'pop' : ''}`}
              style={{
                border: '1px solid var(--border)',
                width: '46px',
                height: '46px',
                color: saved ? 'hsl(350 70% 60%)' : 'var(--text)',
              }}
              onClick={() => toggle(product.id, activeFinishId)}
              aria-label={saved ? 'Remove from saved' : 'Save item'}
            >
              <Heart size={20} fill={saved ? 'currentColor' : 'none'} />
            </button>
          </div>

          {/* Quick Assurance Badges */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '12px',
              padding: '14px 0',
              borderTop: '1px solid var(--border)',
              borderBottom: '1px solid var(--border)',
              marginTop: '12px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.68rem', color: 'var(--text-muted)', fontFamily: "'JetBrains Mono', monospace" }}>
              <ShieldCheck size={14} color="var(--accent-hi)" /> Lifetime Warranty
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.68rem', color: 'var(--text-muted)', fontFamily: "'JetBrains Mono', monospace" }}>
              <Droplets size={14} color="var(--accent-hi)" /> 100% Water Safe
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.68rem', color: 'var(--text-muted)', fontFamily: "'JetBrains Mono', monospace" }}>
              <RotateCcw size={14} color="var(--accent-hi)" /> 30-Day Returns
            </div>
          </div>

          {/* Product Accordions */}
          <div style={{ marginTop: '12px' }}>
            {/* 1. Specifications */}
            <div className="accordion-item">
              <button
                type="button"
                className="accordion-trigger"
                onClick={() => toggleAccordion('specs')}
                aria-expanded={openAccordion === 'specs'}
              >
                <span>Technical Specifications</span>
                <ChevronDown
                  size={16}
                  style={{
                    transform: openAccordion === 'specs' ? 'rotate(180deg)' : 'none',
                    transition: 'transform 0.2s',
                  }}
                />
              </button>
              {openAccordion === 'specs' && (
                <div className="accordion-content">
                  <ul className="spec-list">
                    <li>
                      <span>Profile Width</span>
                      <strong>{product.specs.width} mm</strong>
                    </li>
                    <li>
                      <span>Average Weight</span>
                      <strong>{product.specs.weight} grams</strong>
                    </li>
                    <li>
                      <span>Sizing &amp; Drape</span>
                      <strong>{product.specs.fit}</strong>
                    </li>
                    <li>
                      <span>Material Grade</span>
                      <strong>
                        {product.material === 'silver' ? 'Solid 925 Sterling Silver' : 'Recycled 316L Stainless Steel'}
                      </strong>
                    </li>
                  </ul>
                </div>
              )}
            </div>

            {/* 2. Care & Preservation */}
            <div className="accordion-item">
              <button
                type="button"
                className="accordion-trigger"
                onClick={() => toggleAccordion('care')}
                aria-expanded={openAccordion === 'care'}
              >
                <span>Care &amp; Longevity</span>
                <ChevronDown
                  size={16}
                  style={{
                    transform: openAccordion === 'care' ? 'rotate(180deg)' : 'none',
                    transition: 'transform 0.2s',
                  }}
                />
              </button>
              {openAccordion === 'care' && (
                <div className="accordion-content">
                  <p>{product.care}</p>
                  <p style={{ marginTop: '8px' }}>
                    Engineered to endure fresh water, sweat, and daily life. Rinse with clean water following exposure to chlorinated pools or ocean saltwater.
                  </p>
                </div>
              )}
            </div>

            {/* 3. Delivery & Guarantee */}
            <div className="accordion-item">
              <button
                type="button"
                className="accordion-trigger"
                onClick={() => toggleAccordion('shipping')}
                aria-expanded={openAccordion === 'shipping'}
              >
                <span>Shipping &amp; Lifetime Guarantee</span>
                <ChevronDown
                  size={16}
                  style={{
                    transform: openAccordion === 'shipping' ? 'rotate(180deg)' : 'none',
                    transition: 'transform 0.2s',
                  }}
                />
              </button>
              {openAccordion === 'shipping' && (
                <div className="accordion-content">
                  <p>
                    Complimentary express dispatch on all orders exceeding &euro;40. Delivered in our signature matte-black rigid presentation drawer box.
                  </p>
                  <p style={{ marginTop: '8px' }}>
                    Backed by Halyard&apos;s unconditional lifetime warranty against structural defects, broken clasps, or abnormal discoloration.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Wear It With Section */}
      {wearWithProducts.length > 0 && (
        <section
          style={{
            padding: '64px 48px',
            borderTop: '1px solid var(--border)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px' }}>
            <div>
              <div className="section-label">Curated Pairings</div>
              <h2
                style={{
                  fontFamily: "'Archivo', sans-serif",
                  fontWeight: 900,
                  fontSize: 'clamp(1.8rem, 3vw, 2.5rem)',
                  textTransform: 'uppercase',
                  letterSpacing: '-0.02em',
                }}
              >
                Wear It With
              </h2>
            </div>
            <Link
              href="/stack-builder"
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '0.72rem',
                color: 'var(--accent-hi)',
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              Build a custom stack <ArrowRight size={14} />
            </Link>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
              gap: '1px',
              background: 'var(--border)',
            }}
          >
            {wearWithProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
