'use client';
import { X, Search } from 'lucide-react';

export interface FilterState {
  type: string;
  material: string;
  finish: string;
  search: string;
  sort: string;
}

interface FilterBarProps {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
  counts: {
    all: number;
    chain: number;
    cuff: number;
    signet: number;
  };
  totalFiltered: number;
}

const FINISH_SWATCHES = [
  { id: 'silver', label: 'Silver', gradient: 'linear-gradient(135deg,#e8eaf0,#a0a8b8,#d0d4de)' },
  { id: 'gold', label: 'Gold', gradient: 'linear-gradient(135deg,#f5d98e,#b8942a,#f0c94c)' },
  { id: 'black', label: 'Black', gradient: 'linear-gradient(135deg,#3a3a3a,#111,#555)' },
];

export function FilterBar({ filters, onChange, counts, totalFiltered }: FilterBarProps) {
  const isFiltered =
    filters.type !== 'all' ||
    filters.material !== 'all' ||
    filters.finish !== 'all' ||
    filters.search !== '' ||
    filters.sort !== 'featured';

  const resetFilters = () => {
    onChange({
      type: 'all',
      material: 'all',
      finish: 'all',
      search: '',
      sort: 'featured',
    });
  };

  return (
    <nav className="filter-bar" aria-label="Product filters">
      {/* Type Tabs */}
      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }} role="tablist" aria-label="Filter by type">
        <button
          type="button"
          className={`tab-chip ${filters.type === 'all' ? 'active' : ''}`}
          onClick={() => onChange({ ...filters, type: 'all' })}
        >
          All ({counts.all})
        </button>
        <button
          type="button"
          className={`tab-chip ${filters.type === 'chain' ? 'active' : ''}`}
          onClick={() => onChange({ ...filters, type: 'chain' })}
        >
          Chains ({counts.chain})
        </button>
        <button
          type="button"
          className={`tab-chip ${filters.type === 'cuff' ? 'active' : ''}`}
          onClick={() => onChange({ ...filters, type: 'cuff' })}
        >
          Cuffs ({counts.cuff})
        </button>
        {counts.signet > 0 && (
          <button
            type="button"
            className={`tab-chip ${filters.type === 'signet' ? 'active' : ''}`}
            onClick={() => onChange({ ...filters, type: 'signet' })}
          >
            Signets ({counts.signet})
          </button>
        )}
      </div>

      {/* Material Chips */}
      <div style={{ display: 'flex', gap: '6px' }}>
        <button
          type="button"
          className={`tab-chip ${filters.material === 'steel' ? 'active' : ''}`}
          onClick={() =>
            onChange({
              ...filters,
              material: filters.material === 'steel' ? 'all' : 'steel',
            })
          }
        >
          316L Steel
        </button>
        <button
          type="button"
          className={`tab-chip ${filters.material === 'silver' ? 'active' : ''}`}
          onClick={() =>
            onChange({
              ...filters,
              material: filters.material === 'silver' ? 'all' : 'silver',
            })
          }
        >
          925 Silver
        </button>
      </div>

      {/* Finish Swatches */}
      <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
        {FINISH_SWATCHES.map((swatch) => (
          <button
            key={swatch.id}
            type="button"
            className={`filter-swatch ${filters.finish === swatch.id ? 'active' : ''}`}
            style={{ background: swatch.gradient }}
            title={`Filter by ${swatch.label}`}
            aria-label={`Filter by ${swatch.label}`}
            onClick={() =>
              onChange({
                ...filters,
                finish: filters.finish === swatch.id ? 'all' : swatch.id,
              })
            }
          />
        ))}
      </div>

      {/* Search Input */}
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
        <input
          type="text"
          className="filter-search"
          placeholder="Search bracelets..."
          value={filters.search}
          onChange={(e) => onChange({ ...filters, search: e.target.value })}
        />
        {filters.search && (
          <button
            type="button"
            onClick={() => onChange({ ...filters, search: '' })}
            style={{
              position: 'absolute',
              right: '8px',
              background: 'transparent',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
            }}
            aria-label="Clear search"
          >
            <X size={12} />
          </button>
        )}
      </div>

      {/* Sort Dropdown */}
      <select
        className="filter-sort"
        value={filters.sort}
        onChange={(e) => onChange({ ...filters, sort: e.target.value })}
        aria-label="Sort products"
      >
        <option value="featured">Sort: Featured</option>
        <option value="price-asc">Price: Low to High</option>
        <option value="price-desc">Price: High to Low</option>
        <option value="name">Name: A to Z</option>
      </select>

      {/* Live Count & Clear */}
      <div className="filter-count">
        <span>{totalFiltered} {totalFiltered === 1 ? 'item' : 'items'}</span>
        {isFiltered && (
          <button
            type="button"
            onClick={resetFilters}
            style={{
              marginLeft: '12px',
              background: 'transparent',
              border: 'none',
              color: 'var(--accent-hi)',
              cursor: 'pointer',
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '0.68rem',
              textDecoration: 'underline',
            }}
          >
            Clear all
          </button>
        )}
      </div>
    </nav>
  );
}
