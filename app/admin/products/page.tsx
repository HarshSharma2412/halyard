'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

// ── Types ───────────────────────────────────────────────────────
interface Finish {
  id: string;
  label: string;
  priceAdj: number;
  gradient: string;
}

interface Product {
  id: string;
  slug: string;
  name: string;
  type: 'chain' | 'cuff' | 'signet';
  material: 'steel' | 'silver';
  badge: string[];
  unisize: boolean;
  basePrice: number;
  finishes: Finish[];
  defaultFinish: string;
  specs: { width: number; weight: number; fit: string };
  description: string;
  care: string;
  images: string[];
  wearWith: string[];
}

// ── Sidebar ─────────────────────────────────────────────────────
function AdminShell({ active, children }: { active: string; children: React.ReactNode }) {
  const router = useRouter();

  const logout = async () => {
    await fetch('/api/admin/auth', { method: 'DELETE' });
    router.push('/admin');
  };

  const nav = [
    { href: '/admin/products', label: '📦  Products', key: 'products' },
    { href: '/admin/settings', label: '🎨  Brand & Appearance', key: 'settings' },
    { href: '/admin/media', label: '🖼️  Media Library', key: 'media' },
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0a0a0a', color: '#e8e8e8' }}>
      {/* Sidebar */}
      <aside style={{
        width: '240px',
        background: '#111',
        borderRight: '1px solid #1f1f1f',
        display: 'flex',
        flexDirection: 'column',
        position: 'fixed',
        top: 0, left: 0, bottom: 0,
        zIndex: 50,
      }}>
        <div style={{ padding: '24px 20px', borderBottom: '1px solid #1f1f1f' }}>
          <div style={{ fontWeight: 900, fontSize: '1.1rem', letterSpacing: '-0.02em', color: '#fff' }}>
            HALYARD
          </div>
          <div style={{ fontSize: '0.6rem', color: '#2dd4bf', letterSpacing: '0.15em', marginTop: '4px' }}>
            ADMIN PANEL
          </div>
        </div>

        <nav style={{ padding: '12px 0', flex: 1 }}>
          {nav.map((item) => (
            <Link
              key={item.key}
              href={item.href}
              style={{
                display: 'block',
                padding: '10px 20px',
                fontSize: '0.72rem',
                textDecoration: 'none',
                letterSpacing: '0.04em',
                color: active === item.key ? '#fff' : '#666',
                background: active === item.key ? '#1a1a1a' : 'transparent',
                borderLeft: active === item.key ? '2px solid #2dd4bf' : '2px solid transparent',
                transition: 'all 0.15s',
              }}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div style={{ padding: '16px 20px', borderTop: '1px solid #1f1f1f', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <Link
            href="/"
            target="_blank"
            style={{
              fontSize: '0.62rem',
              color: '#2dd4bf',
              textDecoration: 'none',
              letterSpacing: '0.04em',
            }}
          >
            ↗ View Storefront
          </Link>
          <button
            onClick={logout}
            style={{
              background: 'none',
              border: 'none',
              color: '#555',
              fontSize: '0.62rem',
              cursor: 'pointer',
              textAlign: 'left',
              padding: 0,
              fontFamily: 'inherit',
              letterSpacing: '0.04em',
            }}
          >
            ↩ Sign Out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main style={{ marginLeft: '240px', flex: 1, minWidth: 0 }}>
        {children}
      </main>
    </div>
  );
}

// ── Product Edit Modal ───────────────────────────────────────────
function ProductModal({
  product,
  allProducts,
  onClose,
  onSave,
}: {
  product: Partial<Product> | null;
  allProducts: Product[];
  onClose: () => void;
  onSave: (p: Product) => void;
}) {
  const isNew = !product?.id;
  const [form, setForm] = useState<Partial<Product>>(
    product ?? {
      name: '', slug: '', type: 'chain', material: 'steel', badge: [],
      unisize: true, basePrice: 25,
      finishes: [
        { id: 'silver', label: 'Silver', priceAdj: 0, gradient: 'linear-gradient(135deg,#e8eaf0,#a0a8b8,#d0d4de)' },
        { id: 'gold', label: 'Gold', priceAdj: 2, gradient: 'linear-gradient(135deg,#f5d98e,#b8942a,#f0c94c)' },
        { id: 'black', label: 'Black', priceAdj: 0, gradient: 'linear-gradient(135deg,#3a3a3a,#111,#555)' },
      ],
      defaultFinish: 'silver',
      specs: { width: 4, weight: 14, fit: 'Unisize 17–21 cm' },
      description: '', care: 'Rinse after saltwater. Polish with a dry cloth. Avoid bleach.',
      images: [], wearWith: [],
    }
  );
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const set = (key: keyof Product, val: unknown) => setForm((f) => ({ ...f, [key]: val }));

  const handleUpload = async (files: FileList | null) => {
    if (!files?.length) return;
    setUploading(true);
    const urls: string[] = [...(form.images ?? [])];

    for (const file of Array.from(files)) {
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch('/api/admin/upload', { method: 'POST', body: fd });
      const data = await res.json();
      if (data.url) urls.push(data.url);
    }

    set('images', urls);
    setUploading(false);
  };

  const removeImage = (url: string) => {
    set('images', (form.images ?? []).filter((u) => u !== url));
  };

  const handleSave = async () => {
    if (!form.name || !form.slug) { setError('Name and slug are required.'); return; }
    setSaving(true);
    setError('');

    const method = isNew ? 'POST' : 'PUT';
    const url = isNew ? '/api/admin/products' : `/api/admin/products/${product!.id}`;

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      const saved = await res.json();
      onSave(saved);
    } else {
      const d = await res.json();
      setError(d.error || 'Save failed');
    }
    setSaving(false);
  };

  const inp: React.CSSProperties = {
    background: '#0f0f0f', border: '1px solid #2a2a2a', borderRadius: '6px',
    padding: '9px 12px', color: '#e8e8e8', fontSize: '0.82rem', fontFamily: 'inherit',
    outline: 'none', width: '100%', boxSizing: 'border-box',
  };

  const label: React.CSSProperties = {
    display: 'block', fontSize: '0.6rem', color: '#555',
    letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '6px',
  };

  return (
    <div
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 200, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', overflowY: 'auto', padding: '40px 24px' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div style={{ background: '#141414', border: '1px solid #222', borderRadius: '12px', width: '100%', maxWidth: '780px', padding: '32px' }} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
          <h2 style={{ fontSize: '1rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '-0.01em' }}>
            {isNew ? '+ New Product' : `Edit: ${form.name}`}
          </h2>
          <button onClick={onClose} style={{ background: '#1f1f1f', border: '1px solid #2a2a2a', borderRadius: '50%', width: '32px', height: '32px', cursor: 'pointer', color: '#666', fontSize: '1rem', fontFamily: 'inherit' }}>×</button>
        </div>

        {error && <div style={{ background: '#2a0a0a', border: '1px solid #5a1a1a', borderRadius: '6px', padding: '10px 14px', color: '#f87171', fontSize: '0.75rem', marginBottom: '16px' }}>{error}</div>}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          {/* Name */}
          <div>
            <label style={label}>Product Name *</label>
            <input style={inp} value={form.name ?? ''} onChange={(e) => { set('name', e.target.value); if (!form.id) set('slug', e.target.value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') + '-bracelet'); }} placeholder="e.g. Cuban Chain" />
          </div>
          {/* Slug */}
          <div>
            <label style={label}>URL Slug *</label>
            <input style={inp} value={form.slug ?? ''} onChange={(e) => set('slug', e.target.value)} placeholder="e.g. cuban-chain-bracelet" />
          </div>
          {/* Type */}
          <div>
            <label style={label}>Type</label>
            <select style={inp} value={form.type} onChange={(e) => set('type', e.target.value as Product['type'])}>
              <option value="chain">Chain</option>
              <option value="cuff">Cuff</option>
              <option value="signet">Signet</option>
            </select>
          </div>
          {/* Material */}
          <div>
            <label style={label}>Material</label>
            <select style={inp} value={form.material} onChange={(e) => set('material', e.target.value as Product['material'])}>
              <option value="steel">Recycled 316L Stainless Steel</option>
              <option value="silver">925 Sterling Silver</option>
            </select>
          </div>
          {/* Base price */}
          <div>
            <label style={label}>Base Price (€)</label>
            <input style={inp} type="number" value={form.basePrice ?? 25} onChange={(e) => set('basePrice', parseFloat(e.target.value))} />
          </div>
          {/* Badge */}
          <div>
            <label style={label}>Badge (comma-separated)</label>
            <input style={inp} value={(form.badge ?? []).join(', ')} onChange={(e) => set('badge', e.target.value.split(',').map((s) => s.trim()).filter(Boolean))} placeholder="New, Best Seller" />
          </div>
          {/* Unisize */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <label style={{ ...label, marginBottom: 0 }}>Unisize</label>
            <input type="checkbox" checked={form.unisize ?? true} onChange={(e) => set('unisize', e.target.checked)} style={{ width: '16px', height: '16px', accentColor: '#2dd4bf' }} />
          </div>
          {/* Default finish */}
          <div>
            <label style={label}>Default Finish</label>
            <select style={inp} value={form.defaultFinish ?? 'silver'} onChange={(e) => set('defaultFinish', e.target.value)}>
              {(form.finishes ?? []).map((f) => <option key={f.id} value={f.id}>{f.label}</option>)}
            </select>
          </div>
        </div>

        {/* Specs */}
        <div style={{ marginTop: '20px' }}>
          <div style={{ ...label, marginBottom: '12px' }}>Specifications</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 2fr', gap: '12px' }}>
            <div>
              <label style={label}>Width (mm)</label>
              <input style={inp} type="number" value={form.specs?.width ?? 4} onChange={(e) => set('specs', { ...form.specs, width: parseFloat(e.target.value) })} />
            </div>
            <div>
              <label style={label}>Weight (g)</label>
              <input style={inp} type="number" value={form.specs?.weight ?? 14} onChange={(e) => set('specs', { ...form.specs, weight: parseFloat(e.target.value) })} />
            </div>
            <div>
              <label style={label}>Fit Description</label>
              <input style={inp} value={form.specs?.fit ?? ''} onChange={(e) => set('specs', { ...form.specs, fit: e.target.value })} placeholder="Unisize 17–21 cm" />
            </div>
          </div>
        </div>

        {/* Description */}
        <div style={{ marginTop: '20px' }}>
          <label style={label}>Description</label>
          <textarea style={{ ...inp, minHeight: '80px', resize: 'vertical' }} value={form.description ?? ''} onChange={(e) => set('description', e.target.value)} placeholder="Product description..." />
        </div>

        {/* Care */}
        <div style={{ marginTop: '16px' }}>
          <label style={label}>Care Instructions</label>
          <input style={inp} value={form.care ?? ''} onChange={(e) => set('care', e.target.value)} />
        </div>

        {/* Photo Upload Zone */}
        <div style={{ marginTop: '24px' }}>
          <label style={label}>Product Photos</label>
          <div
            style={{ border: '2px dashed #2a2a2a', borderRadius: '8px', padding: '24px', textAlign: 'center', cursor: 'pointer', transition: 'border-color 0.15s' }}
            onClick={() => fileRef.current?.click()}
            onDragOver={(e) => { e.preventDefault(); (e.currentTarget as HTMLElement).style.borderColor = '#2dd4bf'; }}
            onDragLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = '#2a2a2a'; }}
            onDrop={(e) => { e.preventDefault(); (e.currentTarget as HTMLElement).style.borderColor = '#2a2a2a'; handleUpload(e.dataTransfer.files); }}
          >
            <div style={{ fontSize: '1.5rem' }}>📸</div>
            <div style={{ fontSize: '0.72rem', color: '#555', marginTop: '8px' }}>
              {uploading ? 'Uploading...' : 'Drag & drop or click to upload JPG, PNG, WebP'}
            </div>
          </div>
          <input ref={fileRef} type="file" accept="image/*" multiple style={{ display: 'none' }} onChange={(e) => handleUpload(e.target.files)} />

          {/* Image thumbnails */}
          {(form.images ?? []).length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '12px' }}>
              {(form.images ?? []).map((url) => (
                <div key={url} style={{ position: 'relative', width: '80px', height: '80px' }}>
                  <img src={url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '6px', border: '1px solid #2a2a2a' }} />
                  <button
                    onClick={() => removeImage(url)}
                    style={{ position: 'absolute', top: '-6px', right: '-6px', background: '#ef4444', border: 'none', borderRadius: '50%', width: '18px', height: '18px', cursor: 'pointer', color: '#fff', fontSize: '0.65rem', fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  >×</button>
                </div>
              ))}
            </div>
          )}
          {(form.images ?? []).length === 0 && (
            <div style={{ fontSize: '0.65rem', color: '#444', marginTop: '8px' }}>No photos — SVG placeholder renders automatically</div>
          )}
        </div>

        {/* Wear With */}
        <div style={{ marginTop: '20px' }}>
          <label style={label}>Wear With (select complementary products)</label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {allProducts.filter((p) => p.id !== form.id).map((p) => {
              const selected = (form.wearWith ?? []).includes(p.id);
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => {
                    const current = form.wearWith ?? [];
                    set('wearWith', selected ? current.filter((id) => id !== p.id) : [...current, p.id]);
                  }}
                  style={{
                    background: selected ? '#0d3330' : '#1a1a1a',
                    border: `1px solid ${selected ? '#2dd4bf' : '#2a2a2a'}`,
                    borderRadius: '99px',
                    padding: '4px 12px',
                    fontSize: '0.65rem',
                    color: selected ? '#2dd4bf' : '#555',
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                  }}
                >
                  {p.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: '12px', marginTop: '32px', justifyContent: 'flex-end' }}>
          <button onClick={onClose} style={{ background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: '6px', padding: '10px 20px', color: '#888', fontSize: '0.72rem', cursor: 'pointer', fontFamily: 'inherit' }}>
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            style={{ background: saving ? '#1a5f5a' : '#0d9488', border: 'none', borderRadius: '6px', padding: '10px 24px', color: '#fff', fontSize: '0.72rem', letterSpacing: '0.06em', textTransform: 'uppercase', cursor: 'pointer', fontFamily: 'inherit' }}
          >
            {saving ? 'Saving...' : isNew ? 'Create Product' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main Products Page ────────────────────────────────────────────
export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null | false>(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [toast, setToast] = useState('');

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const loadProducts = useCallback(async () => {
    const res = await fetch('/api/admin/products');
    if (res.ok) setProducts(await res.json());
    setLoading(false);
  }, []);

  useEffect(() => { loadProducts(); }, [loadProducts]);

  const handleSave = (saved: Product) => {
    setProducts((prev) => {
      const idx = prev.findIndex((p) => p.id === saved.id);
      if (idx >= 0) { const next = [...prev]; next[idx] = saved; return next; }
      return [...prev, saved];
    });
    setEditingProduct(false);
    showToast(`✓ "${saved.name}" saved successfully`);
  };

  const handleDelete = async (id: string) => {
    const res = await fetch(`/api/admin/products/${id}`, { method: 'DELETE' });
    if (res.ok) {
      setProducts((prev) => prev.filter((p) => p.id !== id));
      showToast('Product deleted');
    }
    setDeleteId(null);
  };

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.type.toLowerCase().includes(search.toLowerCase()) ||
    p.material.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminShell active="products">
      {/* Toast */}
      {toast && (
        <div style={{ position: 'fixed', bottom: '24px', right: '24px', background: '#0d3330', border: '1px solid #2dd4bf', borderRadius: '8px', padding: '12px 20px', color: '#2dd4bf', fontSize: '0.75rem', zIndex: 300 }}>
          {toast}
        </div>
      )}

      {/* Header */}
      <div style={{ padding: '28px 32px', borderBottom: '1px solid #1a1a1a', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
        <div>
          <h1 style={{ fontSize: '1.1rem', fontWeight: 700, letterSpacing: '-0.02em' }}>Products</h1>
          <div style={{ fontSize: '0.65rem', color: '#555', marginTop: '4px' }}>{products.length} items in catalog</div>
        </div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ background: '#111', border: '1px solid #222', borderRadius: '6px', padding: '8px 14px', color: '#e8e8e8', fontSize: '0.75rem', fontFamily: 'inherit', outline: 'none', width: '180px' }}
          />
          <button
            onClick={() => setEditingProduct({})}
            style={{ background: '#0d9488', border: 'none', borderRadius: '6px', padding: '9px 18px', color: '#fff', fontSize: '0.72rem', letterSpacing: '0.06em', textTransform: 'uppercase', cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap' }}
          >
            + New Product
          </button>
        </div>
      </div>

      {/* Table */}
      <div style={{ padding: '24px 32px' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '80px', color: '#444', fontSize: '0.75rem' }}>Loading products...</div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px', color: '#444', fontSize: '0.75rem' }}>No products found.</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {/* Table header */}
            <div style={{ display: 'grid', gridTemplateColumns: '60px 1fr 100px 100px 80px 80px auto', gap: '12px', padding: '8px 16px', fontSize: '0.6rem', color: '#444', letterSpacing: '0.1em', textTransform: 'uppercase', borderBottom: '1px solid #1a1a1a' }}>
              <span>Photo</span><span>Product</span><span>Type</span><span>Material</span><span>Price</span><span>Finishes</span><span>Actions</span>
            </div>

            {filtered.map((p) => (
              <div
                key={p.id}
                style={{ display: 'grid', gridTemplateColumns: '60px 1fr 100px 100px 80px 80px auto', gap: '12px', padding: '12px 16px', background: '#111', borderRadius: '8px', border: '1px solid #1a1a1a', alignItems: 'center' }}
              >
                {/* Thumbnail */}
                <div style={{ width: '52px', height: '52px', background: '#1a1a1a', borderRadius: '6px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {p.images[0] ? (
                    <img src={p.images[0]} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <span style={{ fontSize: '1.4rem' }}>💍</span>
                  )}
                </div>

                {/* Name & badges */}
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.82rem', color: '#e8e8e8' }}>{p.name}</div>
                  <div style={{ fontSize: '0.6rem', color: '#555', marginTop: '3px' }}>{p.slug}</div>
                  {p.badge.length > 0 && (
                    <div style={{ display: 'flex', gap: '4px', marginTop: '4px' }}>
                      {p.badge.map((b) => (
                        <span key={b} style={{ background: '#0d3330', color: '#2dd4bf', fontSize: '0.55rem', padding: '2px 6px', borderRadius: '3px', letterSpacing: '0.06em' }}>{b}</span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Type */}
                <div style={{ fontSize: '0.72rem', color: '#888', textTransform: 'capitalize' }}>{p.type}</div>

                {/* Material */}
                <div style={{ fontSize: '0.65rem', color: '#888' }}>
                  {p.material === 'silver' ? '925 Silver' : '316L Steel'}
                </div>

                {/* Price */}
                <div style={{ fontSize: '0.82rem', color: '#2dd4bf', fontWeight: 600 }}>€{p.basePrice}</div>

                {/* Finish dots */}
                <div style={{ display: 'flex', gap: '4px' }}>
                  {p.finishes.map((f) => (
                    <div key={f.id} title={f.label} style={{ width: '16px', height: '16px', borderRadius: '50%', background: f.gradient, border: '1px solid #333' }} />
                  ))}
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={() => setEditingProduct(p)}
                    style={{ background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: '6px', padding: '6px 14px', color: '#e8e8e8', fontSize: '0.65rem', cursor: 'pointer', fontFamily: 'inherit' }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => setDeleteId(p.id)}
                    style={{ background: 'transparent', border: '1px solid #3a1a1a', borderRadius: '6px', padding: '6px 12px', color: '#ef4444', fontSize: '0.65rem', cursor: 'pointer', fontFamily: 'inherit' }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Edit / New Modal */}
      {editingProduct !== false && (
        <ProductModal
          product={editingProduct}
          allProducts={products}
          onClose={() => setEditingProduct(false)}
          onSave={handleSave}
        />
      )}

      {/* Delete Confirmation */}
      {deleteId && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
          <div style={{ background: '#141414', border: '1px solid #2a0a0a', borderRadius: '10px', padding: '32px', maxWidth: '400px', width: '100%' }}>
            <h3 style={{ fontSize: '0.95rem', marginBottom: '12px', color: '#f87171' }}>Delete Product?</h3>
            <p style={{ fontSize: '0.78rem', color: '#666', lineHeight: 1.6 }}>
              This will permanently remove the product from <code>lib/products.json</code>. This action cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: '12px', marginTop: '24px', justifyContent: 'flex-end' }}>
              <button onClick={() => setDeleteId(null)} style={{ background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: '6px', padding: '9px 18px', color: '#888', fontSize: '0.72rem', cursor: 'pointer', fontFamily: 'inherit' }}>
                Cancel
              </button>
              <button onClick={() => handleDelete(deleteId)} style={{ background: '#7f1d1d', border: 'none', borderRadius: '6px', padding: '9px 18px', color: '#fff', fontSize: '0.72rem', cursor: 'pointer', fontFamily: 'inherit' }}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminShell>
  );
}
