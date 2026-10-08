'use client';
import Link from 'next/link';
import { Layers } from 'lucide-react';
import type { Product } from '@/lib/types';
import { ProductCard } from './ProductCard';

interface ProductGridProps {
  products: Product[];
  onResetFilters?: () => void;
}

export function ProductGrid({ products, onResetFilters }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div
        style={{
          padding: '80px 24px',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '16px',
        }}
      >
        <h3
          style={{
            fontFamily: "'Archivo', sans-serif",
            fontSize: '1.4rem',
            textTransform: 'uppercase',
            letterSpacing: '-0.02em',
          }}
        >
          No bracelets match your criteria
        </h3>
        <p
          style={{
            color: 'var(--text-muted)',
            fontSize: '0.9rem',
            maxWidth: '36ch',
          }}
        >
          Try clearing search filters or selecting different materials and finishes.
        </p>
        {onResetFilters && (
          <button
            type="button"
            className="btn-outline"
            onClick={onResetFilters}
            style={{ marginTop: '8px' }}
          >
            Reset Filters
          </button>
        )}
      </div>
    );
  }

  // Render cards with Bundle Tile injected after the 4th item
  const renderItems = () => {
    const items: React.ReactNode[] = [];

    products.forEach((product, idx) => {
      items.push(<ProductCard key={product.id} product={product} />);

      // Insert bundle tile after index 3 (4th item)
      if (idx === 3) {
        items.push(
          <div key="bundle-tile" className="bundle-tile">
            <span className="label">Stack Promotion</span>
            <h3>Stack Three, Save 10%</h3>
            <p
              style={{
                fontSize: '0.82rem',
                color: 'var(--text-muted)',
                maxWidth: '24ch',
                lineHeight: 1.5,
              }}
            >
              Layer any 3 bracelets in your bag. A 10% discount applies automatically in your cart.
            </p>
            <Link
              href="/stack-builder"
              className="btn-primary"
              style={{ marginTop: '8px', padding: '10px 20px', fontSize: '0.7rem' }}
            >
              <Layers size={14} /> Open Stack Builder
            </Link>
          </div>
        );
      }
    });

    return items;
  };

  return (
    <section className="product-grid" id="collection" aria-label="Bracelets collection">
      {renderItems()}
    </section>
  );
}
