import { Metadata } from 'next';
import { StackBuilder } from '@/components/StackBuilder';
import { SiteFooter } from '@/components/SiteFooter';
import products from '@/lib/products.json';
import type { Product } from '@/lib/types';
import { ProductCard } from '@/components/ProductCard';

export const metadata: Metadata = {
  title: 'Stack Builder — Save 10% on 3 Bracelets | Halyard',
  description:
    'Build your signature bracelet stack. Mix chains, cuffs, and textures. When you select 3 pieces, an automatic 10% bundle discount is applied.',
};

export default function StackBuilderPage() {
  const chains = (products as Product[]).filter((p) => p.type === 'chain').slice(0, 4);

  return (
    <main>
      <div style={{ paddingTop: '32px' }}>
        <StackBuilder />
      </div>

      <section style={{ padding: '64px 48px', borderTop: '1px solid var(--border)' }}>
        <div className="section-label">Stacking Principles</div>
        <h2
          style={{
            fontFamily: "'Archivo', sans-serif",
            fontWeight: 900,
            fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)',
            textTransform: 'uppercase',
            letterSpacing: '-0.02em',
            marginBottom: '16px',
          }}
        >
          How to Construct a Balanced Stack
        </h2>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '24px',
            marginTop: '28px',
          }}
        >
          <div style={{ background: 'var(--bg-2)', padding: '24px', border: '1px solid var(--border)' }}>
            <span
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '0.72rem',
                color: 'var(--accent-hi)',
              }}
            >
              01 &bull; ANCHOR PIECE
            </span>
            <h3 style={{ fontFamily: "'Archivo', sans-serif", fontSize: '1.1rem', marginTop: '8px' }}>
              Heavy or Textured Chain
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: 1.6, marginTop: '8px' }}>
              Begin with a substantial foundation like the Cuban Chain or Square Chain (5–7mm). This provides visual weight and defines the wrist silhouette.
            </p>
          </div>

          <div style={{ background: 'var(--bg-2)', padding: '24px', border: '1px solid var(--border)' }}>
            <span
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '0.72rem',
                color: 'var(--accent-hi)',
              }}
            >
              02 &bull; RIGID CONTRAST
            </span>
            <h3 style={{ fontFamily: "'Archivo', sans-serif", fontSize: '1.1rem', marginTop: '8px' }}>
              Minimalist Cuff
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: 1.6, marginTop: '8px' }}>
              Introduce a rigid cuff (Stack Cuff or Minimal Cuff) alongside the flexible links. The contrast between solid metal and articulated links prevents clumping.
            </p>
          </div>

          <div style={{ background: 'var(--bg-2)', padding: '24px', border: '1px solid var(--border)' }}>
            <span
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '0.72rem',
                color: 'var(--accent-hi)',
              }}
            >
              03 &bull; SLIM ACCENT
            </span>
            <h3 style={{ fontFamily: "'Archivo', sans-serif", fontSize: '1.1rem', marginTop: '8px' }}>
              Fine Linear or Rope Drape
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: 1.6, marginTop: '8px' }}>
              Finish with a low-profile 2–3mm chain like the Linear Chain or Rope Chain to catch highlights and add micro-detail.
            </p>
          </div>
        </div>
      </section>

      <section style={{ padding: '64px 48px', borderTop: '1px solid var(--border)' }}>
        <div className="section-label">Recommended Staples</div>
        <h2
          style={{
            fontFamily: "'Archivo', sans-serif",
            fontWeight: 900,
            fontSize: 'clamp(1.8rem, 3.5vw, 2.5rem)',
            textTransform: 'uppercase',
            letterSpacing: '-0.02em',
            marginBottom: '32px',
          }}
        >
          Popular Foundation Pieces
        </h2>
        <div className="product-grid" style={{ borderBottom: '1px solid var(--border)' }}>
          {chains.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
