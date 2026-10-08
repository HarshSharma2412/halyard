import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin Panel | Halyard',
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontFamily: "'JetBrains Mono', 'Courier New', monospace" }}>
      {children}
    </div>
  );
}
