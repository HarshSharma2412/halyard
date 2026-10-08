'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

function AdminShell({ active, children }: { active: string; children: React.ReactNode }) {
  const router = useRouter();
  const logout = async () => { await fetch('/api/admin/auth', { method: 'DELETE' }); router.push('/admin'); };
  const nav = [
    { href: '/admin/products', label: '📦  Products', key: 'products' },
    { href: '/admin/settings', label: '🎨  Brand & Appearance', key: 'settings' },
    { href: '/admin/media', label: '🖼️  Media Library', key: 'media' },
  ];
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0a0a0a', color: '#e8e8e8', fontFamily: "'JetBrains Mono', monospace" }}>
      <aside style={{ width: '240px', background: '#111', borderRight: '1px solid #1f1f1f', display: 'flex', flexDirection: 'column', position: 'fixed', top: 0, left: 0, bottom: 0, zIndex: 50 }}>
        <div style={{ padding: '24px 20px', borderBottom: '1px solid #1f1f1f' }}>
          <div style={{ fontWeight: 900, fontSize: '1.1rem', letterSpacing: '-0.02em', color: '#fff' }}>HALYARD</div>
          <div style={{ fontSize: '0.6rem', color: '#2dd4bf', letterSpacing: '0.15em', marginTop: '4px' }}>ADMIN PANEL</div>
        </div>
        <nav style={{ padding: '12px 0', flex: 1 }}>
          {nav.map((item) => (
            <Link key={item.key} href={item.href} style={{ display: 'block', padding: '10px 20px', fontSize: '0.72rem', textDecoration: 'none', letterSpacing: '0.04em', color: active === item.key ? '#fff' : '#666', background: active === item.key ? '#1a1a1a' : 'transparent', borderLeft: active === item.key ? '2px solid #2dd4bf' : '2px solid transparent' }}>
              {item.label}
            </Link>
          ))}
        </nav>
        <div style={{ padding: '16px 20px', borderTop: '1px solid #1f1f1f', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <Link href="/" target="_blank" style={{ fontSize: '0.62rem', color: '#2dd4bf', textDecoration: 'none' }}>↗ View Storefront</Link>
          <button onClick={logout} style={{ background: 'none', border: 'none', color: '#555', fontSize: '0.62rem', cursor: 'pointer', textAlign: 'left', padding: 0, fontFamily: 'inherit' }}>↩ Sign Out</button>
        </div>
      </aside>
      <main style={{ marginLeft: '240px', flex: 1, minWidth: 0 }}>{children}</main>
    </div>
  );
}

interface MediaItem { name: string; url: string; }

export default function AdminMediaPage() {
  const [images, setImages] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<MediaItem | null>(null);
  const [copied, setCopied] = useState('');
  const [toast, setToast] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  const loadImages = async () => {
    setLoading(true);
    const res = await fetch('/api/admin/upload');
    if (res.ok) setImages(await res.json());
    setLoading(false);
  };

  useEffect(() => { loadImages(); }, []);

  const handleUpload = async (files: FileList | null) => {
    if (!files?.length) return;
    setUploading(true);
    for (const file of Array.from(files)) {
      const fd = new FormData();
      fd.append('file', file);
      await fetch('/api/admin/upload', { method: 'POST', body: fd });
    }
    await loadImages();
    setUploading(false);
    showToast(`✓ ${files.length} image${files.length > 1 ? 's' : ''} uploaded`);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    await fetch('/api/admin/upload', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: deleteTarget.name }),
    });
    setDeleteTarget(null);
    await loadImages();
    showToast('Image deleted');
  };

  const copyPath = (url: string) => {
    navigator.clipboard.writeText(url).then(() => {
      setCopied(url);
      setTimeout(() => setCopied(''), 2000);
    });
  };

  return (
    <AdminShell active="media">
      {toast && (
        <div style={{ position: 'fixed', bottom: '24px', right: '24px', background: '#0d3330', border: '1px solid #2dd4bf', borderRadius: '8px', padding: '12px 20px', color: '#2dd4bf', fontSize: '0.75rem', zIndex: 300 }}>
          {toast}
        </div>
      )}

      {/* Header */}
      <div style={{ padding: '28px 32px', borderBottom: '1px solid #1a1a1a', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontSize: '1.1rem', fontWeight: 700, letterSpacing: '-0.02em' }}>Media Library</h1>
          <div style={{ fontSize: '0.65rem', color: '#555', marginTop: '4px' }}>{images.length} files in <code>public/products/</code></div>
        </div>
        <button
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          style={{ background: '#0d9488', border: 'none', borderRadius: '6px', padding: '9px 18px', color: '#fff', fontSize: '0.72rem', letterSpacing: '0.06em', textTransform: 'uppercase', cursor: 'pointer', fontFamily: 'inherit' }}
        >
          {uploading ? 'Uploading...' : '+ Upload Images'}
        </button>
        <input ref={fileRef} type="file" accept="image/*" multiple style={{ display: 'none' }} onChange={(e) => handleUpload(e.target.files)} />
      </div>

      <div style={{ padding: '28px 32px' }}>
        {/* Drop zone */}
        <div
          style={{ border: '2px dashed #222', borderRadius: '10px', padding: '32px', textAlign: 'center', cursor: 'pointer', marginBottom: '28px', transition: 'border-color 0.15s' }}
          onClick={() => fileRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); (e.currentTarget as HTMLElement).style.borderColor = '#2dd4bf'; }}
          onDragLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = '#222'; }}
          onDrop={(e) => { e.preventDefault(); (e.currentTarget as HTMLElement).style.borderColor = '#222'; handleUpload(e.dataTransfer.files); }}
        >
          <div style={{ fontSize: '2rem' }}>{uploading ? '⏳' : '📁'}</div>
          <div style={{ fontSize: '0.72rem', color: '#555', marginTop: '10px' }}>
            {uploading ? 'Uploading your images...' : 'Drag & drop product photos here, or click to browse'}
          </div>
          <div style={{ fontSize: '0.62rem', color: '#3a3a3a', marginTop: '6px' }}>JPG, PNG, WebP, AVIF supported</div>
        </div>

        {/* How to use */}
        <div style={{ background: '#111', border: '1px solid #1a1a1a', borderRadius: '8px', padding: '16px 20px', marginBottom: '28px', fontSize: '0.68rem', color: '#666', lineHeight: 1.7 }}>
          <strong style={{ color: '#888' }}>How to attach photos to a product:</strong> After uploading, copy the path below (e.g. <code style={{ color: '#2dd4bf' }}>/products/my-photo.jpg</code>), then go to <strong>Products</strong> → Edit the product → the image will appear in the editor. Alternatively, images uploaded via the product editor are automatically linked.
        </div>

        {/* Grid */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px', color: '#444', fontSize: '0.75rem' }}>Loading media...</div>
        ) : images.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px', color: '#333', fontSize: '0.75rem' }}>
            <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🖼️</div>
            No images uploaded yet. Drop some photos above to get started.
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '16px' }}>
            {images.map((img) => (
              <div key={img.name} style={{ background: '#111', border: '1px solid #1a1a1a', borderRadius: '8px', overflow: 'hidden' }}>
                <div style={{ aspectRatio: '1', background: '#0f0f0f', position: 'relative', overflow: 'hidden' }}>
                  <img src={img.url} alt={img.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div style={{ padding: '10px 12px' }}>
                  <div style={{ fontSize: '0.6rem', color: '#555', marginBottom: '8px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={img.name}>
                    {img.name}
                  </div>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button
                      onClick={() => copyPath(img.url)}
                      style={{ flex: 1, background: copied === img.url ? '#0d3330' : '#1a1a1a', border: `1px solid ${copied === img.url ? '#2dd4bf' : '#2a2a2a'}`, borderRadius: '4px', padding: '6px 0', fontSize: '0.6rem', color: copied === img.url ? '#2dd4bf' : '#666', cursor: 'pointer', fontFamily: 'inherit', textAlign: 'center' }}
                    >
                      {copied === img.url ? '✓ Copied' : 'Copy Path'}
                    </button>
                    <button
                      onClick={() => setDeleteTarget(img)}
                      style={{ background: 'transparent', border: '1px solid #2a0a0a', borderRadius: '4px', padding: '6px 10px', fontSize: '0.6rem', color: '#ef4444', cursor: 'pointer', fontFamily: 'inherit' }}
                    >
                      🗑
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete confirmation */}
      {deleteTarget && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
          <div style={{ background: '#141414', border: '1px solid #2a0a0a', borderRadius: '10px', padding: '32px', maxWidth: '360px', width: '100%' }}>
            <h3 style={{ fontSize: '0.9rem', color: '#f87171', marginBottom: '12px' }}>Delete Image?</h3>
            <div style={{ background: '#0f0f0f', borderRadius: '6px', overflow: 'hidden', marginBottom: '16px' }}>
              <img src={deleteTarget.url} alt="" style={{ width: '100%', maxHeight: '160px', objectFit: 'cover' }} />
            </div>
            <p style={{ fontSize: '0.72rem', color: '#666', lineHeight: 1.6 }}>
              <code>{deleteTarget.name}</code> will be permanently removed from <code>public/products/</code>. Products currently using this image will fall back to the SVG placeholder.
            </p>
            <div style={{ display: 'flex', gap: '10px', marginTop: '20px', justifyContent: 'flex-end' }}>
              <button onClick={() => setDeleteTarget(null)} style={{ background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: '6px', padding: '9px 18px', color: '#888', fontSize: '0.72rem', cursor: 'pointer', fontFamily: 'inherit' }}>Cancel</button>
              <button onClick={handleDelete} style={{ background: '#7f1d1d', border: 'none', borderRadius: '6px', padding: '9px 18px', color: '#fff', fontSize: '0.72rem', cursor: 'pointer', fontFamily: 'inherit' }}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </AdminShell>
  );
}
