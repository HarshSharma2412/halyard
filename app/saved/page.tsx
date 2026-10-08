'use client';
import Link from 'next/link';
import { Heart, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import products from '@/lib/products.json';
import type { Product } from '@/lib/types';
import { formatPrice, getProductPrice } from '@/lib/types';
import { useSavedStore, useCartStore, useUIStore } from '@/lib/store';
import { BraceletSVG } from '@/components/BraceletSVG';
import { SiteFooter } from '@/components/SiteFooter';

export default function SavedPage() {
  const { items, toggle } = useSavedStore();
  const currency = useUIStore((s) => s.currency);
  const addItem = useCartStore((s) => s.addItem);
  const triggerBagPop = useUIStore((s) => s.triggerBagPop);
  const setCartOpen = useUIStore((s) => s.setCartOpen);

  const savedProducts = items
    .map((item) => {
      const prod = (products as Product[]).find((p) => p.id === item.productId);
      if (!prod) return null;
      const finish = prod.finishes.find((f) => f.id === item.finishId) || prod.finishes[0];
      const price = getProductPrice(prod, finish.id);
      return { item, product: prod, finish, price };
    })
    .filter(Boolean) as {
    item: { productId: string; finishId: string };
    product: Product;
    finish: Product['finishes'][0];
    price: number;
  }[];

  const handleMoveToBag = (p: Product, finishId: string, finishLabel: string, price: number) => {
    addItem({
      productId: p.id,
      finishId,
      size: p.unisize ? undefined : 'M',
      quantity: 1,
      price,
      name: p.name,
      finishLabel,
    });
    triggerBagPop();
    setCartOpen(true);
  };

  return (
    <main>
      <section style={{ padding: '64px 48px', minHeight: '60vh' }}>
        <div className="section-label">Your Wishlist</div>
        <h1
          style={{
            fontFamily: "'Archivo', sans-serif",
            fontWeight: 900,
            fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
            textTransform: 'uppercase',
            letterSpacing: '-0.03em',
            marginBottom: '16px',
          }}
        >
          Saved Items ({savedProducts.length})
        </h1>

        {savedProducts.length === 0 ? (
          <div
            style={{
              padding: '64px 0',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '16px',
            }}
          >
            <Heart size={48} strokeWidth={1} color="var(--text-muted)" />
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', maxWidth: '36ch' }}>
              You haven&apos;t saved any bracelets yet. Click the heart icon on any piece to curate your selection.
            </p>
            <Link href="/bracelets" className="btn-primary" style={{ marginTop: '8px' }}>
              Explore Collection <ArrowRight size={14} />
            </Link>
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '24px',
              marginTop: '36px',
            }}
          >
            {savedProducts.map(({ item, product, finish, price }) => (
              <div
                key={`${item.productId}-${item.finishId}`}
                style={{
                  background: 'var(--bg-2)',
                  border: '1px solid var(--border)',
                  borderRadius: '4px',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <div
                  style={{
                    aspectRatio: '1',
                    background: 'radial-gradient(circle at 40% 35%, var(--bg-3), var(--bg))',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                  }}
                >
                  <BraceletSVG product={product} finishId={finish.id} size={180} />
                  <button
                    type="button"
                    onClick={() => toggle(item.productId, item.finishId)}
                    style={{
                      position: 'absolute',
                      top: '12px',
                      right: '12px',
                      background: 'var(--bg-3)',
                      border: 'none',
                      color: 'var(--text-muted)',
                      cursor: 'pointer',
                      borderRadius: '50%',
                      padding: '8px',
                      display: 'flex',
                    }}
                    title="Remove from saved"
                    aria-label={`Remove ${product.name} from saved`}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                <div style={{ padding: '16px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <Link
                    href={`/bracelets/${product.slug}`}
                    style={{
                      fontFamily: "'Archivo', sans-serif",
                      fontWeight: 700,
                      fontSize: '0.95rem',
                      textTransform: 'uppercase',
                      color: 'inherit',
                      textDecoration: 'none',
                    }}
                  >
                    {product.name}
                  </Link>

                  <div
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: '0.7rem',
                      color: 'var(--text-muted)',
                      marginTop: '4px',
                    }}
                  >
                    {finish.label} Finish &bull; {product.specs.width}mm
                  </div>

                  <div
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: '0.9rem',
                      color: 'var(--accent-hi)',
                      marginTop: '8px',
                      marginBottom: '16px',
                    }}
                  >
                    {formatPrice(price, currency)}
                  </div>

                  <button
                    type="button"
                    className="btn-primary"
                    style={{ marginTop: 'auto', justifyContent: 'center' }}
                    onClick={() => handleMoveToBag(product, finish.id, finish.label, price)}
                  >
                    <ShoppingBag size={14} /> Add to Bag
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <SiteFooter />
    </main>
  );
}
