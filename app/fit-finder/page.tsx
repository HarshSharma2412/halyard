import { Metadata } from 'next';
import Link from 'next/link';
import { Ruler, CheckCircle2, ArrowRight } from 'lucide-react';
import { FitFinder } from '@/components/FitFinder';
import { SiteFooter } from '@/components/SiteFooter';

export const metadata: Metadata = {
  title: 'Fit & Size Finder — Calibrate Your Wrist Measurement | Halyard',
  description:
    'Interactive wrist measurement calculator and bracelet size guide. Determine your exact fit in under 60 seconds with our measurement methods.',
};

export default function FitFinderPage() {
  return (
    <main>
      <div style={{ paddingTop: '32px', display: 'flex', justifyContent: 'center' }}>
        <FitFinder />
      </div>

      <section style={{ padding: '64px 48px', borderTop: '1px solid var(--border)' }}>
        <div className="section-label">Measurement Methods</div>
        <h2
          style={{
            fontFamily: "'Archivo', sans-serif",
            fontWeight: 900,
            fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)',
            textTransform: 'uppercase',
            letterSpacing: '-0.02em',
            marginBottom: '32px',
          }}
        >
          Three Accurate Ways to Measure Your Wrist
        </h2>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '24px',
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
              METHOD A
            </span>
            <h3 style={{ fontFamily: "'Archivo', sans-serif", fontSize: '1.1rem', marginTop: '8px' }}>
              Flexible Measuring Tape
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: 1.6, marginTop: '8px' }}>
              Wrap a flexible tailor&apos;s tape snugly around your wrist just above your wrist bone (towards your elbow).
              Read the measurement without pulling too tight.
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
              METHOD B
            </span>
            <h3 style={{ fontFamily: "'Archivo', sans-serif", fontSize: '1.1rem', marginTop: '8px' }}>
              Paper Strip &amp; Ruler
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: 1.6, marginTop: '8px' }}>
              Cut a strip of paper 1.5 cm wide. Wrap it around your wrist bone, mark where the ends overlap with a pencil,
              then lay it flat against any standard ruler in centimeters.
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
              METHOD C
            </span>
            <h3 style={{ fontFamily: "'Archivo', sans-serif", fontSize: '1.1rem', marginTop: '8px' }}>
              Existing Bracelet Comparison
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: 1.6, marginTop: '8px' }}>
              Take a bracelet that already fits you comfortably. Lay it completely straight and measure the total length
              from the tip of the clasp to the end ring.
            </p>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: '48px' }}>
          <Link href="/bracelets" className="btn-primary">
            Explore All Bracelets <ArrowRight size={14} />
          </Link>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
