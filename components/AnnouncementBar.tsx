'use client';
import Link from 'next/link';
import settings from '@/lib/settings.json';

export function AnnouncementBar() {
  const text = settings.announcementText || 'Free shipping on orders over €40 · Lifetime warranty on all pieces';
  const ctaText = settings.announcementCtaText;
  const ctaLink = settings.announcementCtaLink;

  return (
    <div className="announce-bar" role="marquee" aria-label="Site announcements">
      <span>{text}</span>
      {ctaText && ctaLink && (
        <>
          {' '}
          <span style={{ opacity: 0.6 }}>·</span>{' '}
          <Link
            href={ctaLink}
            style={{
              color: '#fff',
              textDecoration: 'underline',
              fontWeight: 600,
              marginLeft: '6px',
            }}
          >
            {ctaText}
          </Link>
        </>
      )}
    </div>
  );
}
