'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      if (res.ok) {
        router.push('/admin/products');
      } else {
        const data = await res.json();
        setError(data.error || 'Invalid password');
      }
    } catch {
      setError('Connection error. Make sure the dev server is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0a0a0a',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: "'JetBrains Mono', 'Courier New', monospace",
    }}>
      <div style={{
        background: '#151515',
        border: '1px solid #2a2a2a',
        borderRadius: '8px',
        padding: '48px',
        width: '100%',
        maxWidth: '420px',
        boxShadow: '0 24px 64px rgba(0,0,0,0.6)',
      }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{
            fontFamily: "'Arial', sans-serif",
            fontWeight: 900,
            fontSize: '2rem',
            letterSpacing: '-0.04em',
            color: '#fff',
            textTransform: 'uppercase',
            marginBottom: '8px',
          }}>
            HALYARD
          </div>
          <div style={{
            fontSize: '0.65rem',
            color: '#2dd4bf',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
          }}>
            ADMIN PANEL
          </div>
        </div>

        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              fontSize: '0.65rem',
              color: '#666',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              marginBottom: '8px',
            }}>
              Admin Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password..."
              autoFocus
              required
              style={{
                width: '100%',
                background: '#0f0f0f',
                border: `1px solid ${error ? '#ef4444' : '#2a2a2a'}`,
                borderRadius: '6px',
                padding: '12px 16px',
                color: '#e8e8e8',
                fontSize: '0.9rem',
                fontFamily: 'inherit',
                outline: 'none',
                boxSizing: 'border-box',
                transition: 'border-color 0.15s',
              }}
              onFocus={(e) => { e.target.style.borderColor = '#2dd4bf'; }}
              onBlur={(e) => { e.target.style.borderColor = error ? '#ef4444' : '#2a2a2a'; }}
            />
            {error && (
              <div style={{ color: '#ef4444', fontSize: '0.72rem', marginTop: '8px' }}>
                {error}
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading || !password}
            style={{
              width: '100%',
              background: loading ? '#1a5f5a' : '#0d9488',
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              padding: '13px',
              fontSize: '0.72rem',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              cursor: loading ? 'wait' : 'pointer',
              fontFamily: 'inherit',
              transition: 'background 0.15s',
            }}
          >
            {loading ? 'Authenticating...' : 'Enter Admin Panel →'}
          </button>
        </form>

        <p style={{
          textAlign: 'center',
          fontSize: '0.62rem',
          color: '#444',
          marginTop: '24px',
          lineHeight: 1.5,
        }}>
          Default password is <code style={{ color: '#666' }}>halyard-admin</code><br />
          Set <code style={{ color: '#666' }}>ADMIN_PASSWORD</code> in .env.local to change it
        </p>
      </div>
    </div>
  );
}
