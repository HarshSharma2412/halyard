import Link from 'next/link';
import settings from '@/lib/settings.json';

export function SiteFooter() {
  const brandName = settings.brandName || 'Halyard';
  const footerDesc = settings.footerDescription ||
    'Engineering permanent, sculptural jewelry in recycled marine-grade 316L stainless steel and certified 925 sterling silver. Built to withstand saltwater, sweat, and time.';
  const location = settings.studioLocation || 'DESIGNED IN COPENHAGEN • CAST RESPONSIBLY';
  const email = settings.supportEmail || 'concierge@halyard.studio';

  return (
    <footer aria-label="Site footer">
      <div className="site-footer">
        <div className="footer-col">
          <h4>{brandName} Studio</h4>
          <p
            style={{
              fontSize: '0.82rem',
              color: 'var(--text-muted)',
              lineHeight: 1.6,
              marginBottom: '16px',
            }}
          >
            {footerDesc}
          </p>
          <span
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '0.65rem',
              color: 'var(--accent-hi)',
              letterSpacing: '0.06em',
            }}
          >
            {location}
          </span>
        </div>

        <div className="footer-col">
          <h4>Collections</h4>
          <Link href="/bracelets">All Bracelets</Link>
          <Link href="/stack-builder">Stack Builder (Save 10%)</Link>
          <Link href="/gift-guide">Gift Guide</Link>
          <Link href="/bracelets?material=silver">925 Sterling Silver</Link>
          <Link href="/bracelets?material=steel">Recycled 316L Steel</Link>
        </div>

        <div className="footer-col">
          <h4>Integrity &amp; Sizing</h4>
          <Link href="/fit-finder">Fit &amp; Size Finder</Link>
          <Link href="/our-story#metallurgy">Metallurgy Specs</Link>
          <Link href="/our-story#sustainability">Recycled Materials</Link>
          <Link href="/our-story#care">Care Guide</Link>
          <Link href="/our-story">Our Story &amp; Philosophy</Link>
        </div>

        <div className="footer-col">
          <h4>Customer Care</h4>
          <Link href="/our-story#warranty">Lifetime Guarantee</Link>
          <Link href="/our-story#shipping">Global Shipping &amp; Duties</Link>
          <Link href="/our-story#returns">30-Day Hassle-Free Returns</Link>
          <Link href="/saved">Saved Items</Link>
          <a href={`mailto:${email}`}>{email}</a>
        </div>
      </div>

      <div className="footer-bottom">
        <div>
          &copy; 2026 {brandName.toUpperCase()} JEWELRY CO. ALL RIGHTS RESERVED.
        </div>

        <div className="payment-icons" aria-label="Accepted payment methods">
          <span className="payment-icon">STRIPE</span>
          <span className="payment-icon">VISA</span>
          <span className="payment-icon">MC</span>
          <span className="payment-icon">AMEX</span>
          <span className="payment-icon">APPLE PAY</span>
          <span className="payment-icon">GOOGLE PAY</span>
        </div>
      </div>
    </footer>
  );
}
