import { Metadata } from 'next';
import Link from 'next/link';
import { Shield, Recycle, Compass, Sparkles, Droplet, ArrowRight } from 'lucide-react';
import { SiteFooter } from '@/components/SiteFooter';
import { MaterialsTable } from '@/components/MaterialsTable';

export const metadata: Metadata = {
  title: 'Our Story & Metallurgy Integrity | Halyard',
  description:
    'The engineering philosophy behind Halyard jewelry. Recycled 316L marine stainless steel, solid 925 sterling silver, lifetime guarantee, and zero luxury inflation.',
};

export default function OurStoryPage() {
  return (
    <main>
      <section className="hero" style={{ minHeight: '65vh' }}>
        <div className="hero-content">
          <div className="section-label">Founding Principles</div>
          <h1 className="hero-headline" style={{ fontSize: 'clamp(3.5rem, 8vw, 7.5rem)' }}>
            Our Story
            <span className="count">/ NO COMPROMISES</span>
          </h1>
          <p className="hero-lede">
            Most jewelry is engineered for the display cabinet, not human life.
            We construct permanent pieces calibrated for the ocean, the gym, the workshop,
            and decades of relentless daily wear.
          </p>
          <div className="hero-btns">
            <Link href="/bracelets" className="btn-primary">
              Shop Collection <ArrowRight size={14} />
            </Link>
            <a href="#metallurgy" className="btn-outline">
              Metallurgy Standards
            </a>
          </div>
        </div>

        <div
          style={{
            background: 'var(--bg-2)',
            border: '1px solid var(--border)',
            padding: '40px',
            borderRadius: '4px',
            display: 'flex',
            flexDirection: 'column',
            gap: '24px',
          }}
        >
          <div style={{ display: 'flex', gap: '16px' }}>
            <Compass size={28} color="var(--accent-hi)" style={{ flexShrink: 0 }} />
            <div>
              <h3 style={{ fontFamily: "'Archivo', sans-serif", fontSize: '1rem', textTransform: 'uppercase' }}>
                Industrial Rigor
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: 1.6, marginTop: '4px' }}>
                We specify tolerances in tenths of a millimeter. Every link, weld, and clasp is mechanical first, aesthetic second.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '16px' }}>
            <Recycle size={28} color="var(--accent-hi)" style={{ flexShrink: 0 }} />
            <div>
              <h3 style={{ fontFamily: "'Archivo', sans-serif", fontSize: '1rem', textTransform: 'uppercase' }}>
                Circularity Over Extraction
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: 1.6, marginTop: '4px' }}>
                Our 316L stainless steel is 100% post-consumer recycled. Our sterling silver is reclaimed through certified closed-loop refiners.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '16px' }}>
            <Shield size={28} color="var(--accent-hi)" style={{ flexShrink: 0 }} />
            <div>
              <h3 style={{ fontFamily: "'Archivo', sans-serif", fontSize: '1rem', textTransform: 'uppercase' }}>
                Direct Accountability
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: 1.6, marginTop: '4px' }}>
                No licensing middle-men or retail markup inflation. We manufacture directly and stand behind every single piece with a lifetime guarantee.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Metallurgy Section */}
      <MaterialsTable />

      {/* Sustainability Section */}
      <section id="sustainability" style={{ padding: '80px 48px', borderTop: '1px solid var(--border)' }}>
        <div className="section-label">Circular Production</div>
        <h2
          style={{
            fontFamily: "'Archivo', sans-serif",
            fontWeight: 900,
            fontSize: 'clamp(2rem, 4vw, 3.2rem)',
            textTransform: 'uppercase',
            letterSpacing: '-0.03em',
            marginBottom: '20px',
          }}
        >
          Zero Virgin Extraction
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', maxWidth: '64ch', lineHeight: 1.7 }}>
          Traditional jewelry mining leaves monumental environmental scars. Stainless steel, by contrast, is one of the most recyclable metals on Earth.
          Our pieces are cast from recovered architectural and medical scrap that has been purified to implant-grade standards.
          When packaged, we utilize 100% FSC-certified unbleached paperboard with plant-based soy inks. Zero foam, zero single-use plastics.
        </p>
      </section>

      {/* Warranty & Care Section */}
      <section
        id="warranty"
        style={{
          padding: '80px 48px',
          borderTop: '1px solid var(--border)',
          background: 'var(--bg-2)',
        }}
      >
        <div style={{ maxWidth: '800px' }}>
          <div className="section-label">Our Commitment</div>
          <h2
            style={{
              fontFamily: "'Archivo', sans-serif",
              fontWeight: 900,
              fontSize: 'clamp(2rem, 4vw, 3.2rem)',
              textTransform: 'uppercase',
              letterSpacing: '-0.03em',
              marginBottom: '20px',
            }}
          >
            The Halyard Lifetime Guarantee
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.7 }}>
            If your bracelet ever breaks, snags, loses a link, or fails under normal wear, we will repair or replace it at no charge.
            We don&apos;t ask for original receipt paperwork—the hallmark engraving on the clasp is all the proof we need.
          </p>

          <div
            id="shipping"
            style={{
              marginTop: '40px',
              paddingTop: '32px',
              borderTop: '1px solid var(--border)',
            }}
          >
            <h3 style={{ fontFamily: "'Archivo', sans-serif", fontSize: '1.2rem', textTransform: 'uppercase', marginBottom: '8px' }}>
              Shipping, Duties &amp; 30-Day Returns
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', lineHeight: 1.6 }}>
              Orders over &euro;40 ship free worldwide with tracked courier dispatch.
              If the fit, weight, or drape isn&apos;t exactly what you anticipated, you have 30 days to exchange or return the unworn piece in original packaging.
            </p>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
