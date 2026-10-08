'use client';
import { useState } from 'react';

export function FitFinder() {
  const [wristCm, setWristCm] = useState(17.5);
  const [preference, setPreference] = useState<'classic' | 'snug' | 'relaxed'>('classic');

  // Calculate recommended sizing based on measurement + preference
  let effectiveCm = wristCm;
  if (preference === 'snug') effectiveCm -= 0.5;
  if (preference === 'relaxed') effectiveCm += 1.5;

  let recommendedSize = 'M (Medium)';
  let sizeDetails = 'Standard balanced profile. Fits comfortably with subtle wrist movement.';
  let chainLengthCm = '19 cm';

  if (effectiveCm < 16.5) {
    recommendedSize = 'S (Small)';
    sizeDetails = 'Tailored for leaner wrists (15–16.5 cm circumference).';
    chainLengthCm = '17.5 cm';
  } else if (effectiveCm <= 18.5) {
    recommendedSize = 'M (Medium)';
    sizeDetails = 'Our most common universal fit (17–18.5 cm circumference).';
    chainLengthCm = '19 cm';
  } else if (effectiveCm <= 20.5) {
    recommendedSize = 'L (Large)';
    sizeDetails = 'Generous cut for broader wrists (19–20.5 cm circumference).';
    chainLengthCm = '20.5 cm';
  } else {
    recommendedSize = 'XL (Extra Large)';
    sizeDetails = 'Extended profile for wrists over 20.5 cm circumference.';
    chainLengthCm = '22 cm';
  }

  const inches = (wristCm / 2.54).toFixed(1);

  return (
    <section className="fit-section" id="fit-finder" aria-labelledby="fit-heading">
      <div className="section-label">Proportions &amp; Measurements</div>
      <h2 className="section-title" id="fit-heading">Find Your Fit</h2>

      <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', lineHeight: 1.6 }}>
        Use a tape measure or wrap a strip of paper around your wrist bone to find your exact measurement.
        Slide to view your calibrated size.
      </p>

      <div style={{ marginTop: '28px' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '0.85rem',
          }}
        >
          <span>Wrist Circumference</span>
          <strong style={{ color: 'var(--accent-hi)' }}>
            {wristCm.toFixed(1)} cm / {inches}&quot;
          </strong>
        </div>

        <input
          type="range"
          min="14"
          max="22"
          step="0.5"
          value={wristCm}
          onChange={(e) => setWristCm(parseFloat(e.target.value))}
          className="wrist-slider"
          aria-label="Wrist circumference in centimeters"
        />

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '0.65rem',
            color: 'var(--text-muted)',
          }}
        >
          <span>14 cm (5.5&quot;)</span>
          <span>18 cm (7.1&quot;)</span>
          <span>22 cm (8.7&quot;)</span>
        </div>
      </div>

      {/* Drape Preference selector */}
      <div style={{ marginTop: '24px' }}>
        <div
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '0.72rem',
            color: 'var(--text-muted)',
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            marginBottom: '8px',
          }}
        >
          Drape Preference:
        </div>
        <div className="fit-scale">
          <button
            type="button"
            className={`fit-scale-item ${preference === 'snug' ? 'fits' : ''}`}
            onClick={() => setPreference('snug')}
          >
            Snug (No Drape)
          </button>
          <button
            type="button"
            className={`fit-scale-item ${preference === 'classic' ? 'fits' : ''}`}
            onClick={() => setPreference('classic')}
          >
            Classic (1-Finger Drape)
          </button>
          <button
            type="button"
            className={`fit-scale-item ${preference === 'relaxed' ? 'fits' : ''}`}
            onClick={() => setPreference('relaxed')}
          >
            Relaxed (Loose Drape)
          </button>
        </div>
      </div>

      {/* Result Card */}
      <div
        style={{
          marginTop: '28px',
          padding: '20px',
          background: 'var(--bg-2)',
          border: '1px solid var(--border)',
          borderRadius: '4px',
        }}
      >
        <div
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '0.68rem',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            color: 'var(--text-muted)',
          }}
        >
          Recommended Size
        </div>
        <div
          style={{
            fontFamily: "'Archivo', sans-serif",
            fontWeight: 900,
            fontSize: '1.6rem',
            textTransform: 'uppercase',
            letterSpacing: '-0.02em',
            marginTop: '4px',
            color: 'var(--accent-hi)',
          }}
        >
          {recommendedSize}
        </div>
        <div className="fit-result" style={{ marginTop: '6px' }}>
          Suggested chain length: {chainLengthCm}
        </div>
        <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '8px', lineHeight: 1.5 }}>
          {sizeDetails}
        </p>
        <p
          style={{
            fontSize: '0.75rem',
            fontFamily: "'JetBrains Mono', monospace",
            color: 'var(--text-muted)',
            marginTop: '12px',
            borderTop: '1px solid var(--border)',
            paddingTop: '10px',
          }}
        >
          * Unisize models feature a 4 cm micro-extension link (17–21 cm) accommodating 95% of wrists without sizing.
        </p>
      </div>
    </section>
  );
}
