'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface Settings {
  brandName: string;
  logoText: string;
  logoUrl?: string;
  tagline: string;
  accentColor: string;
  accentHi: string;
  accentLo: string;
  bgDark: string;
  bgDark2: string;
  bgDark3: string;
  announcementText: string;
  announcementCtaText: string;
  announcementCtaLink: string;
  newsletterHeadline: string;
  newsletterDescription: string;
  supportEmail: string;
  studioLocation: string;
  footerDescription: string;
}

// AdminShell duplicated here to avoid cross-page import complexities
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

// Color Swatch Picker
function ColorPicker({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  const [raw, setRaw] = useState(value);

  return (
    <div>
      <div style={{ fontSize: '0.6rem', color: '#555', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '8px' }}>{label}</div>
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        <div style={{ width: '36px', height: '36px', borderRadius: '6px', background: value, border: '1px solid #333', flexShrink: 0 }} />
        <input
          value={raw}
          onChange={(e) => { setRaw(e.target.value); onChange(e.target.value); }}
          placeholder="e.g. hsl(192 60% 38%) or #2dd4bf"
          style={{ flex: 1, background: '#0f0f0f', border: '1px solid #2a2a2a', borderRadius: '6px', padding: '8px 12px', color: '#e8e8e8', fontSize: '0.75rem', fontFamily: 'inherit', outline: 'none' }}
        />
        <input
          type="color"
          onChange={(e) => { const v = e.target.value; setRaw(v); onChange(v); }}
          style={{ width: '36px', height: '36px', background: 'none', border: '1px solid #333', borderRadius: '6px', cursor: 'pointer', padding: '2px' }}
        />
      </div>
    </div>
  );
}

// Text input helper
function Field({ label, value, onChange, multiline, placeholder }: { label: string; value: string; onChange: (v: string) => void; multiline?: boolean; placeholder?: string }) {
  const base: React.CSSProperties = {
    background: '#0f0f0f', border: '1px solid #2a2a2a', borderRadius: '6px',
    padding: '9px 12px', color: '#e8e8e8', fontSize: '0.82rem',
    fontFamily: "'JetBrains Mono', monospace", outline: 'none', width: '100%', boxSizing: 'border-box',
  };
  return (
    <div>
      <div style={{ fontSize: '0.6rem', color: '#555', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '8px' }}>{label}</div>
      {multiline
        ? <textarea style={{ ...base, minHeight: '80px', resize: 'vertical' }} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} />
        : <input style={base} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} />}
    </div>
  );
}

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState('');
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState('');

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 3500); };

  useEffect(() => {
    fetch('/api/admin/settings')
      .then((r) => r.json())
      .then((data: Settings) => {
        setSettings(data);
        if (data.logoUrl) {
          setLogoPreview(data.logoUrl);
        }
      })
      .catch(() => {});
  }, []);

  const update = (key: keyof Settings, value: string) => {
    setSettings((prev) => prev ? { ...prev, [key]: value } : prev);
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLogoFile(file);
    setLogoPreview(URL.createObjectURL(file));
  };

  const handleSave = async () => {
    if (!settings) return;
    setSaving(true);

    let currentLogoUrl = settings.logoUrl || '';

    // Upload logo if changed
    if (logoFile) {
      const fd = new FormData();
      const renamed = new File([logoFile], `logo-${logoFile.name}`, { type: logoFile.type });
      fd.append('file', renamed);
      const upRes = await fetch('/api/admin/upload', { method: 'POST', body: fd });
      const upData = await upRes.json();
      if (upData.url) {
        currentLogoUrl = upData.url;
      }
    } else if (!logoPreview) {
      currentLogoUrl = '';
    }

    const payload = { ...settings, logoUrl: currentLogoUrl };

    const res = await fetch('/api/admin/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      setSettings(payload);
      setLogoFile(null);
      showToast('✓ Settings saved. Changes are now live on the storefront.');
    } else {
      showToast('⚠ Save failed. Check the console.');
    }
    setSaving(false);
  };

  if (!settings) {
    return (
      <AdminShell active="settings">
        <div style={{ textAlign: 'center', padding: '80px', color: '#444', fontSize: '0.75rem' }}>Loading settings...</div>
      </AdminShell>
    );
  }

  const sectionTitle = (t: string) => (
    <div style={{ fontSize: '0.62rem', color: '#2dd4bf', letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: '16px', paddingBottom: '8px', borderBottom: '1px solid #1a1a1a' }}>
      {t}
    </div>
  );

  return (
    <AdminShell active="settings">
      {toast && (
        <div style={{ position: 'fixed', bottom: '24px', right: '24px', background: '#0d3330', border: '1px solid #2dd4bf', borderRadius: '8px', padding: '12px 20px', color: '#2dd4bf', fontSize: '0.75rem', zIndex: 300, maxWidth: '360px' }}>
          {toast}
        </div>
      )}

      {/* Header */}
      <div style={{ padding: '28px 32px', borderBottom: '1px solid #1a1a1a', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontSize: '1.1rem', fontWeight: 700, letterSpacing: '-0.02em' }}>Brand &amp; Appearance</h1>
          <div style={{ fontSize: '0.65rem', color: '#555', marginTop: '4px' }}>
            Changes write to <code>lib/settings.json</code> — reload storefront to apply
          </div>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          style={{ background: saving ? '#1a5f5a' : '#0d9488', border: 'none', borderRadius: '6px', padding: '10px 24px', color: '#fff', fontSize: '0.72rem', letterSpacing: '0.06em', textTransform: 'uppercase', cursor: 'pointer', fontFamily: 'inherit' }}
        >
          {saving ? 'Saving...' : '💾  Save All Changes'}
        </button>
      </div>

      <div style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '36px', maxWidth: '900px' }}>

        {/* Live preview banner */}
        <div style={{ background: '#1a1a0a', border: '1px solid #3a3a10', borderRadius: '8px', padding: '20px 24px', display: 'flex', gap: '16px', alignItems: 'center' }}>
          <div style={{ fontSize: '1.5rem', flexShrink: 0 }}>👁️</div>
          <div>
            <div style={{ fontSize: '0.72rem', color: '#d4d48e', marginBottom: '4px', fontWeight: 600 }}>Live Preview</div>
            <div style={{ fontSize: '0.65rem', color: '#888', lineHeight: 1.6 }}>
              After saving, open the storefront in a new tab to see your changes. In development mode, Next.js picks up file changes automatically within seconds.
            </div>
            <Link href="/" target="_blank" style={{ display: 'inline-block', marginTop: '8px', fontSize: '0.65rem', color: '#2dd4bf', textDecoration: 'none' }}>
              ↗ Open Storefront in New Tab
            </Link>
          </div>
        </div>

        {/* Brand Identity */}
        <div style={{ background: '#111', border: '1px solid #1a1a1a', borderRadius: '10px', padding: '24px' }}>
          {sectionTitle('🏷️ Brand Identity')}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
            <Field label="Brand Name" value={settings.brandName} onChange={(v) => update('brandName', v)} placeholder="Halyard" />
            <Field label="Logo Text (uppercase)" value={settings.logoText} onChange={(v) => update('logoText', v)} placeholder="HALYARD" />
            <Field label="Tagline" value={settings.tagline} onChange={(v) => update('tagline', v)} placeholder="Engineered Men's & Unisex Jewelry" />
            <Field label="Studio Location Text" value={settings.studioLocation} onChange={(v) => update('studioLocation', v)} />
          </div>

          {/* Logo image upload */}
          <div>
            <div style={{ fontSize: '0.6rem', color: '#555', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '8px' }}>Logo Image (optional — replaces text logo)</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              {logoPreview ? (
                <img src={logoPreview} alt="Logo" style={{ height: '40px', objectFit: 'contain', borderRadius: '4px', background: '#1a1a1a', padding: '4px 8px' }} />
              ) : (
                <div style={{ height: '40px', width: '80px', background: '#1a1a1a', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.65rem', color: '#444' }}>No logo</div>
              )}
              <label style={{ background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: '6px', padding: '8px 16px', fontSize: '0.65rem', color: '#888', cursor: 'pointer', letterSpacing: '0.06em' }}>
                Upload Logo (PNG/SVG/WebP)
                <input type="file" accept="image/*" onChange={handleLogoChange} style={{ display: 'none' }} />
              </label>
              {logoPreview && (
                <button onClick={() => { setLogoPreview(''); setLogoFile(null); update('logoUrl', ''); }} style={{ background: 'none', border: 'none', color: '#555', cursor: 'pointer', fontSize: '0.65rem', fontFamily: 'inherit' }}>
                  Remove
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Colours */}
        <div style={{ background: '#111', border: '1px solid #1a1a1a', borderRadius: '10px', padding: '24px' }}>
          {sectionTitle('🎨 Colour Palette')}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <ColorPicker label="Accent Color (primary teal)" value={settings.accentColor} onChange={(v) => update('accentColor', v)} />
            <ColorPicker label="Accent High (hover, emphasis)" value={settings.accentHi} onChange={(v) => update('accentHi', v)} />
            <ColorPicker label="Accent Low (background tint)" value={settings.accentLo} onChange={(v) => update('accentLo', v)} />
            <ColorPicker label="Background Dark (main)" value={settings.bgDark} onChange={(v) => update('bgDark', v)} />
            <ColorPicker label="Background Surface" value={settings.bgDark2} onChange={(v) => update('bgDark2', v)} />
            <ColorPicker label="Background Elevated" value={settings.bgDark3} onChange={(v) => update('bgDark3', v)} />
          </div>

          {/* Color preview bar */}
          <div style={{ marginTop: '20px', display: 'flex', gap: '8px' }}>
            {[settings.bgDark, settings.bgDark2, settings.bgDark3, settings.accentLo, settings.accentColor, settings.accentHi].map((c, i) => (
              <div key={i} title={c} style={{ flex: 1, height: '32px', borderRadius: '4px', background: c, border: '1px solid rgba(255,255,255,0.05)' }} />
            ))}
          </div>
          <div style={{ fontSize: '0.6rem', color: '#444', marginTop: '4px', textAlign: 'center' }}>
            Background → Surfaces → Accent range preview
          </div>
        </div>

        {/* Announcement Bar */}
        <div style={{ background: '#111', border: '1px solid #1a1a1a', borderRadius: '10px', padding: '24px' }}>
          {sectionTitle('📢 Announcement Bar')}
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '16px' }}>
            <Field label="Announcement Message" value={settings.announcementText} onChange={(v) => update('announcementText', v)} placeholder="Free shipping on orders over €40..." />
            <Field label="CTA Button Text" value={settings.announcementCtaText} onChange={(v) => update('announcementCtaText', v)} placeholder="SHOP NOW →" />
            <Field label="CTA Link URL" value={settings.announcementCtaLink} onChange={(v) => update('announcementCtaLink', v)} placeholder="/bracelets" />
          </div>
        </div>

        {/* Newsletter */}
        <div style={{ background: '#111', border: '1px solid #1a1a1a', borderRadius: '10px', padding: '24px' }}>
          {sectionTitle('📧 Newsletter Section')}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <Field label="Newsletter Headline" value={settings.newsletterHeadline} onChange={(v) => update('newsletterHeadline', v)} />
            <Field label="Newsletter Description" value={settings.newsletterDescription} onChange={(v) => update('newsletterDescription', v)} multiline />
          </div>
        </div>

        {/* Footer */}
        <div style={{ background: '#111', border: '1px solid #1a1a1a', borderRadius: '10px', padding: '24px' }}>
          {sectionTitle('🦶 Footer')}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <Field label="Footer Studio Description" value={settings.footerDescription} onChange={(v) => update('footerDescription', v)} multiline />
            <Field label="Support Email" value={settings.supportEmail} onChange={(v) => update('supportEmail', v)} placeholder="support@yourstore.com" />
          </div>
        </div>

        {/* Save footer button */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', paddingBottom: '48px' }}>
          <button
            onClick={handleSave}
            disabled={saving}
            style={{ background: saving ? '#1a5f5a' : '#0d9488', border: 'none', borderRadius: '6px', padding: '13px 32px', color: '#fff', fontSize: '0.75rem', letterSpacing: '0.08em', textTransform: 'uppercase', cursor: 'pointer', fontFamily: 'inherit' }}
          >
            {saving ? 'Saving...' : '💾  Save All Changes'}
          </button>
        </div>
      </div>
    </AdminShell>
  );
}
