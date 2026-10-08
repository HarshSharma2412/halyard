import { Metadata } from 'next';
import Link from 'next/link';
import { Package, ShieldCheck, Clock, CheckCircle } from 'lucide-react';
import products from '@/lib/products.json';
import type { Product } from '@/lib/types';
import { ProductCard } from '@/components/ProductCard';
import { SiteFooter } from '@/components/SiteFooter';

export const metadata: Metadata = {
  title: 'Gift Guide — Sizing-Proof Jewelry & Presentation | Halyard',
  description:
    'Thoughtful, permanent gifts in recycled 316L steel and solid 925 sterling silver. Includes unisize chains with zero sizing stress, signature gift packaging, and extended returns.',
};

export default function GiftGuidePage() {
  const unisizePieces = (products as Product[]).filter((p) => p.unisize).slice(0, 4);
  const silverPieces = (products as Product[]).filter((p) => p.material === 'silver').slice(0, 4);
  const under30Pieces = (products as Product[]).filter((p) => p.basePrice <= 30).slice(0, 4);

  return (
    <main>
      <section className="hero" style={{ minHeight: '60vh' }}>
        <div className="hero-content">
          <div className="section-label">Curated Selection</div>
          <h1 className="hero-headline" style={{ fontSize: 'clamp(3.5rem, 8vw, 7rem)' }}>
            Gift Guide
            <span className="count">/ FAIL-SAFE EDITS</span>
          </h1>
          <p className="hero-lede">
            Zero sizing guesswork. Every unisize chain includes our 4 cm micro-extension clasp,
            delivered in signature rigid gift presentation with unconditional guarantee.
          </p>
          <div className="hero-btns">
            <a href="#unisize" className="btn-primary">
              Unisize Gifts (No Sizing Needed)
            </a>
            <a href="#silver" className="btn-outline">
              The 925 Silver Edit
            </a>
          </div>
        </div>

        <div
          style={{
            background: 'var(--bg-2)',
            border: '1px solid var(--border)',
            padding: '36px',
            borderRadius: '4px',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
          }}
        >
          <h3 style={{ fontFamily: "'Archivo', sans-serif", fontSize: '1.2rem', textTransform: 'uppercase' }}>
            The Halyard Gifting Standard
          </h3>
          <div style={{ display: 'flex', gap: '12px' }}>
            <Package size={22} color="var(--accent-hi)" style={{ flexShrink: 0 }} />
            <div>
              <strong style={{ fontSize: '0.85rem', display: 'block' }}>Signature Presentation Box</strong>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                Rigid slide drawer box with high-density velvet cushioning and embossed sleeve. Plastic-free.
              </span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <Clock size={22} color="var(--accent-hi)" style={{ flexShrink: 0 }} />
            <div>
              <strong style={{ fontSize: '0.85rem', display: 'block' }}>Extended 60-Day Returns</strong>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                Hassle-free exchange or refund if the recipient prefers a different finish or width.
              </span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <ShieldCheck size={22} color="var(--accent-hi)" style={{ flexShrink: 0 }} />
            <div>
              <strong style={{ fontSize: '0.85rem', display: 'block' }}>Transferable Lifetime Guarantee</strong>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                The warranty travels with the piece. Clasp or metal issues replaced with no receipts required.
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Edit 1: Risk-Free Unisize Pieces */}
      <section id="unisize" style={{ padding: '64px 48px', borderTop: '1px solid var(--border)' }}>
        <div className="section-label">Zero Sizing Guesswork</div>
        <h2
          style={{
            fontFamily: "'Archivo', sans-serif",
            fontWeight: 900,
            fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)',
            textTransform: 'uppercase',
            letterSpacing: '-0.02em',
          }}
        >
          Adjustable Unisize Pieces
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', maxWidth: '44ch', marginTop: '6px', marginBottom: '32px' }}>
          Equipped with an integrated 4 cm micro-extension link (17–21 cm) that fits 95% of wrists perfectly out of the box.
        </p>
        <div className="product-grid" style={{ borderBottom: '1px solid var(--border)' }}>
          {unisizePieces.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* Edit 2: The 925 Sterling Silver Edit */}
      <section id="silver" style={{ padding: '64px 48px', borderTop: '1px solid var(--border)' }}>
        <div className="section-label">Precious Metal Heirlooms</div>
        <h2
          style={{
            fontFamily: "'Archivo', sans-serif",
            fontWeight: 900,
            fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)',
            textTransform: 'uppercase',
            letterSpacing: '-0.02em',
          }}
        >
          The 925 Sterling Silver Edit
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', maxWidth: '44ch', marginTop: '6px', marginBottom: '32px' }}>
          Certified 92.5% pure solid silver with authentic hallmarks. Cast for weight, tactile warmth, and lifelong patina.
        </p>
        <div className="product-grid" style={{ borderBottom: '1px solid var(--border)' }}>
          {silverPieces.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* Edit 3: Under €30 Staples */}
      <section id="under-30" style={{ padding: '64px 48px', borderTop: '1px solid var(--border)' }}>
        <div className="section-label">Daily Foundations</div>
        <h2
          style={{
            fontFamily: "'Archivo', sans-serif",
            fontWeight: 900,
            fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)',
            textTransform: 'uppercase',
            letterSpacing: '-0.02em',
          }}
        >
          Under &euro;30 Everyday Staples
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', maxWidth: '44ch', marginTop: '6px', marginBottom: '32px' }}>
          Recycled 316L stainless steel that never oxidizes or discolors, even when worn in the ocean.
        </p>
        <div className="product-grid" style={{ borderBottom: '1px solid var(--border)' }}>
          {under30Pieces.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
