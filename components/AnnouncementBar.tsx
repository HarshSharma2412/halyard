'use client';

const MESSAGES = [
  'Free shipping on orders over €40',
  'Lifetime warranty on every piece',
  '30-day returns, no questions asked',
];

export function AnnouncementBar() {
  return (
    <div className="announce-bar" role="marquee" aria-label="Site announcements">
      {MESSAGES.join('  ·  ')}
    </div>
  );
}
