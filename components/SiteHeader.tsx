'use client';
import Link from 'next/link';
import { useState } from 'react';
import { ShoppingBag, Heart, Sun, Moon, X, Menu } from 'lucide-react';
import { useCartStore, useSavedStore, useUIStore } from '@/lib/store';
import { CURRENCY_SYMBOLS, type Currency } from '@/lib/types';

const NAV_LINKS = [
  { href: '/bracelets', label: 'Bracelets' },
  { href: '/rings', label: 'Rings' },
  { href: '/necklaces', label: 'Necklaces' },
  { href: '/sets', label: 'Sets' },
  { href: '/our-story', label: 'Our Story' },
];

const CURRENCIES: Currency[] = ['EUR', 'USD', 'INR'];

export function SiteHeader() {
  const totalItems = useCartStore(s => s.totalItems());
  const savedCount = useSavedStore(s => s.items.length);
  const { cartOpen, setCartOpen, currency, setCurrency, theme, toggleTheme, bagPop } = useUIStore();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <header className="site-header">
        {/* Nav */}
        <nav className="header-nav" aria-label="Main navigation">
          {NAV_LINKS.map(l => (
            <Link key={l.href} href={l.href}>{l.label}</Link>
          ))}
        </nav>

        {/* Logo */}
        <Link href="/" className="site-logo" aria-label="Halyard home">
          Halyard
        </Link>

        {/* Actions */}
        <div className="header-actions">
          {/* Currency */}
          <select
            className="currency-select"
            value={currency}
            onChange={e => setCurrency(e.target.value as Currency)}
            aria-label="Select currency"
          >
            {CURRENCIES.map(c => (
              <option key={c} value={c}>{c} {CURRENCY_SYMBOLS[c]}</option>
            ))}
          </select>

          {/* Theme toggle */}
          <button
            className="icon-btn"
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {/* Saved */}
          <Link href="/saved" className="icon-btn" aria-label={`Saved items (${savedCount})`}>
            <Heart size={18} />
            {savedCount > 0 && <span className="badge" aria-hidden="true">{savedCount}</span>}
          </Link>

          {/* Bag */}
          <button
            className={`icon-btn ${bagPop ? 'pop' : ''}`}
            onClick={() => setCartOpen(!cartOpen)}
            aria-label={`Shopping bag (${totalItems} items)`}
            id="bag-btn"
          >
            <ShoppingBag size={18} />
            {totalItems > 0 && <span className="badge" aria-hidden="true">{totalItems}</span>}
          </button>

          {/* Hamburger */}
          <button
            className="icon-btn hamburger"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <Menu size={20} />
          </button>
        </div>
      </header>

      {/* Mobile nav */}
      {mobileOpen && (
        <div className="mobile-nav" role="dialog" aria-label="Mobile navigation">
          <button
            className="icon-btn"
            style={{ alignSelf: 'flex-end' }}
            onClick={() => setMobileOpen(false)}
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
          {NAV_LINKS.map(l => (
            <Link key={l.href} href={l.href} onClick={() => setMobileOpen(false)}>
              {l.label}
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
