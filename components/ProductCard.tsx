'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Heart } from 'lucide-react';
import type { Product } from '@/lib/types';
import { formatPrice, getProductPrice } from '@/lib/types';
import { useCartStore, useSavedStore, useUIStore } from '@/lib/store';
import { BraceletSVG } from './BraceletSVG';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const [activeFinishId, setActiveFinishId] = useState(product.defaultFinish);
  const currency = useUIStore((s) => s.currency);
  const setQuickView = useUIStore((s) => s.setQuickView);
  const setCartOpen = useUIStore((s) => s.setCartOpen);
  const triggerBagPop = useUIStore((s) => s.triggerBagPop);

  const addItem = useCartStore((s) => s.addItem);
  const { toggle, isSaved } = useSavedStore();

  const currentPrice = getProductPrice(product, activeFinishId);
  const activeFinish = product.finishes.find((f) => f.id === activeFinishId) ?? product.finishes[0];
  const saved = isSaved(product.id, activeFinishId);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    addItem({
      productId: product.id,
      finishId: activeFinishId,
      size: product.unisize ? undefined : 'M',
      quantity: 1,
      price: currentPrice,
      name: product.name,
      finishLabel: activeFinish.label,
    });
    triggerBagPop();
    setCartOpen(true);
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setQuickView(product.id);
  };

  return (
    <article className="product-card card-enter" id={`product-${product.slug}`}>
      <div className="card-image">
        <Link href={`/bracelets/${product.slug}`} tabIndex={-1} aria-hidden="true">
          <div className="card-image-inner">
            <BraceletSVG product={product} finishId={activeFinishId} size={180} />
          </div>
        </Link>

        {/* Badges */}
        <div className="card-badges">
          {product.material === 'silver' && (
            <span className="card-badge silver-badge">925 Silver</span>
          )}
          {product.badge?.map((b) => (
            <span key={b} className="card-badge">
              {b}
            </span>
          ))}
        </div>

        {/* Wishlist toggle */}
        <button
          type="button"
          className={`card-heart ${saved ? 'saved' : ''}`}
          aria-label={saved ? `Remove ${product.name} from saved` : `Save ${product.name}`}
          onClick={(e) => {
            e.preventDefault();
            toggle(product.id, activeFinishId);
          }}
        >
          <Heart size={16} fill={saved ? 'currentColor' : 'none'} />
        </button>

        {/* Hover slide-up quick actions */}
        <div className="card-actions">
          <button
            type="button"
            className="card-action-btn"
            onClick={handleQuickAdd}
          >
            Quick Add
          </button>
          <button
            type="button"
            className="card-action-btn outline"
            onClick={handleQuickView}
          >
            Quick View
          </button>
        </div>
      </div>

      <div className="card-body">
        <Link href={`/bracelets/${product.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
          <h3 className="card-name">{product.name}</h3>
        </Link>
        <div className="card-price">{formatPrice(currentPrice, currency)}</div>
        <div className="card-spec">
          {product.specs.width}mm • {product.material === 'steel' ? '316L Steel' : '925 Sterling Silver'}
        </div>

        {/* Finish swatches */}
        {product.finishes.length > 1 && (
          <div className="card-finishes" aria-label="Available finishes">
            {product.finishes.map((f) => (
              <button
                key={f.id}
                type="button"
                className={`card-finish-dot ${f.id === activeFinishId ? 'active' : ''}`}
                style={{ background: f.gradient }}
                title={`${f.label}${f.priceAdj > 0 ? ` (+€${f.priceAdj})` : ''}`}
                aria-label={`Select ${f.label} finish`}
                onClick={() => setActiveFinishId(f.id)}
              />
            ))}
          </div>
        )}
      </div>
    </article>
  );
}
