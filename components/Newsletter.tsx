'use client';
import { useState } from 'react';
import { Check } from 'lucide-react';

export function Newsletter() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;
    setSubmitted(true);
  };

  return (
    <section className="newsletter-band" aria-labelledby="newsletter-heading">
      <div className="section-label">Editorial &amp; Releases</div>
      <h2 id="newsletter-heading">First Run Drops &amp; Private Previews</h2>
      <p
        style={{
          color: 'var(--text-muted)',
          fontSize: '0.92rem',
          maxWidth: '44ch',
          lineHeight: 1.6,
          marginTop: '-8px',
        }}
      >
        Receive advance notice when limited batch runs in 925 sterling silver are cast.
        Direct dispatches only, no marketing clutter.
      </p>

      {submitted ? (
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '12px 24px',
            background: 'var(--accent-lo)',
            border: '1px solid var(--accent)',
            borderRadius: 'var(--radius-btn)',
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '0.8rem',
            color: 'var(--accent-hi)',
          }}
        >
          <Check size={16} /> Confirmed. You are on the registry for the next release.
        </div>
      ) : (
        <form className="newsletter-form" onSubmit={handleSubmit}>
          <input
            type="email"
            className="newsletter-input"
            placeholder="Enter your email address..."
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            aria-label="Email address"
          />
          <button type="submit" className="btn-primary">
            Subscribe
          </button>
        </form>
      )}

      <span
        style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: '0.62rem',
          color: 'var(--text-muted)',
          letterSpacing: '0.04em',
        }}
      >
        Unsubscribe at any moment. Zero algorithmic tracking.
      </span>
    </section>
  );
}
