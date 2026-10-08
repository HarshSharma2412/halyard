'use client';
import Link from 'next/link';
import { CheckCircle2, ArrowRight, ShieldCheck, KeyRound } from 'lucide-react';
import { useCartStore } from '@/lib/store';
import { SiteFooter } from '@/components/SiteFooter';

export default function CheckoutMockSuccessPage() {
  const clearCart = useCartStore((s) => s.clearCart);

  return (
    <main>
      <div
        style={{
          maxWidth: '680px',
          margin: '80px auto',
          padding: '40px 24px',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '20px',
        }}
      >
        <div
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: 'var(--accent-lo)',
            border: '1px solid var(--accent)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--accent-hi)',
          }}
        >
          <CheckCircle2 size={32} />
        </div>

        <div className="section-label">Checkout Integration Point</div>
        <h1
          style={{
            fontFamily: "'Archivo', sans-serif",
            fontWeight: 900,
            fontSize: 'clamp(2rem, 5vw, 3rem)',
            textTransform: 'uppercase',
            letterSpacing: '-0.02em',
          }}
        >
          Order Mock Confirmed
        </h1>

        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.6 }}>
          This is the demonstration endpoint for the Halyard checkout flow.
          Your cart items and discounts were calculated accurately.
        </p>

        {/* Integration Instructions */}
        <div
          style={{
            background: 'var(--bg-2)',
            border: '1px solid var(--border)',
            borderRadius: '4px',
            padding: '24px',
            textAlign: 'left',
            width: '100%',
            marginTop: '12px',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '0.75rem',
              color: 'var(--accent-hi)',
              textTransform: 'uppercase',
              marginBottom: '12px',
            }}
          >
            <KeyRound size={16} /> Connecting Real Stripe Payments
          </div>

          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
            To activate real credit card, Apple Pay, and Google Pay processing:
          </p>
          <ol
            style={{
              fontSize: '0.8rem',
              color: 'var(--text-muted)',
              lineHeight: 1.8,
              paddingLeft: '20px',
              marginTop: '8px',
            }}
          >
            <li>
              Add your Stripe Secret Key to <code>.env.local</code>:
              <pre
                style={{
                  background: 'var(--bg-3)',
                  padding: '8px 12px',
                  borderRadius: '3px',
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: '0.72rem',
                  color: 'var(--text)',
                  marginTop: '4px',
                }}
              >
                STRIPE_SECRET_KEY=sk_test_...
              </pre>
            </li>
            <li>
              Set your public publishable key:
              <pre
                style={{
                  background: 'var(--bg-3)',
                  padding: '8px 12px',
                  borderRadius: '3px',
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: '0.72rem',
                  color: 'var(--text)',
                  marginTop: '4px',
                }}
              >
                NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
              </pre>
            </li>
            <li>
              The route at <code>/app/api/checkout/route.ts</code> will automatically redirect clients to the hosted Stripe Checkout portal.
            </li>
          </ol>
        </div>

        <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
          <button
            type="button"
            className="btn-outline"
            onClick={() => clearCart()}
          >
            Clear Test Cart
          </button>
          <Link href="/bracelets" className="btn-primary">
            Return to Bracelets <ArrowRight size={14} />
          </Link>
        </div>
      </div>

      <SiteFooter />
    </main>
  );
}
