'use client';
import { useState } from 'react';
import Link from 'next/link';
import { ArrowDown, Ruler } from 'lucide-react';
import products from '@/lib/products.json';
import type { Product } from '@/lib/types';
import { BraceletSVG } from './BraceletSVG';

const HERO_FINISHES = [
  { id: 'silver', label: 'Silver', gradient: 'linear-gradient(135deg,#e8eaf0,#a0a8b8,#d0d4de)' },
  { id: 'gold', label: 'Gold', gradient: 'linear-gradient(135deg,#f5d98e,#b8942a,#f0c94c)' },
  { id: 'black', label: 'Black', gradient: 'linear-gradient(135deg,#3a3a3a,#111,#555)' },
];

export function Hero() {
  const [selectedFinish, setSelectedFinish] = useState('silver');

  // Featured flagship product (e.g. Heavy Cuban Chain or Square Chain)
  const featuredProduct = (products.find((p) => p.id === 'cuban-chain-steel') ||
    products[0]) as Product;

  return (
    <section className="hero">
      <div className="hero-content">
        <h1 className="hero-headline">
          Bracelets
          <span className="count">/ {products.length} ESSENTIAL PIECES</span>
        </h1>
        <p className="hero-lede">
          Cut from recycled 316L marine stainless steel and certified solid 925 sterling silver.
          Non-tarnish, water-resistant, calibrated for effortless daily wear.
        </p>

        <div className="hero-btns">
          <a href="#collection" className="btn-primary">
            Explore All <ArrowDown size={14} />
          </a>
          <Link href="/fit-finder" className="btn-outline">
            Fit Finder <Ruler size={14} />
          </Link>
        </div>

        <div className="proof-strip">
          <div className="proof-item">
            <span className="dot" />
            Lifetime Warranty
          </div>
          <div className="proof-item">
            <span className="dot" />
            Recycled 316L &amp; 925 Silver
          </div>
          <div className="proof-item">
            <span className="dot" />
            Free Shipping Over €40
          </div>
        </div>
      </div>

      <div className="hero-stage" aria-hidden="true">
        <div className="bracelet-stage">
          <div className="bracelet-svg">
            <BraceletSVG
              product={featuredProduct}
              finishId={selectedFinish}
              size={260}
            />
          </div>
        </div>

        <div className="finish-dots">
          {HERO_FINISHES.map((f) => (
            <button
              key={f.id}
              type="button"
              className={`finish-dot ${f.id === selectedFinish ? 'active' : ''}`}
              style={{ background: f.gradient }}
              title={`Preview in ${f.label}`}
              aria-label={`Select ${f.label}`}
              onClick={() => setSelectedFinish(f.id)}
            />
          ))}
        </div>
        <span
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '0.68rem',
            color: 'var(--text-muted)',
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
          }}
        >
          {featuredProduct.name} • {HERO_FINISHES.find(f => f.id === selectedFinish)?.label} Finish
        </span>
      </div>
    </section>
  );
}
