'use client';
import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import products from '@/lib/products.json';
import type { Product } from '@/lib/types';
import { getProductPrice } from '@/lib/types';
import { Hero } from './Hero';
import { FilterBar, type FilterState } from './FilterBar';
import { ProductGrid } from './ProductGrid';
import { MaterialsTable } from './MaterialsTable';
import { FitFinder } from './FitFinder';
import { Newsletter } from './Newsletter';
import { SiteFooter } from './SiteFooter';

export function BraceletsCollectionClient() {
  const searchParams = useSearchParams();

  const [filters, setFilters] = useState<FilterState>({
    type: 'all',
    material: 'all',
    finish: 'all',
    search: '',
    sort: 'featured',
  });

  // Sync initial query params (e.g. ?material=silver or ?type=cuff)
  useEffect(() => {
    const materialParam = searchParams.get('material');
    const typeParam = searchParams.get('type');
    const finishParam = searchParams.get('finish');

    if (materialParam || typeParam || finishParam) {
      setFilters((prev) => ({
        ...prev,
        material: materialParam || prev.material,
        type: typeParam || prev.type,
        finish: finishParam || prev.finish,
      }));
    }
  }, [searchParams]);

  // Compute category counts
  const allProducts = products as Product[];
  const counts = useMemo(() => {
    return {
      all: allProducts.length,
      chain: allProducts.filter((p) => p.type === 'chain').length,
      cuff: allProducts.filter((p) => p.type === 'cuff').length,
      signet: allProducts.filter((p) => p.type === 'signet').length,
    };
  }, [allProducts]);

  // Filtered & Sorted items
  const filteredProducts = useMemo(() => {
    return allProducts
      .filter((p) => {
        if (filters.type !== 'all' && p.type !== filters.type) return false;
        if (filters.material !== 'all' && p.material !== filters.material) return false;
        if (
          filters.finish !== 'all' &&
          !p.finishes.some((f) => f.id === filters.finish)
        )
          return false;
        if (filters.search.trim()) {
          const q = filters.search.toLowerCase();
          const matches =
            p.name.toLowerCase().includes(q) ||
            p.description.toLowerCase().includes(q) ||
            p.type.toLowerCase().includes(q);
          if (!matches) return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (filters.sort === 'price-asc') {
          return (
            getProductPrice(a, a.defaultFinish) - getProductPrice(b, b.defaultFinish)
          );
        }
        if (filters.sort === 'price-desc') {
          return (
            getProductPrice(b, b.defaultFinish) - getProductPrice(a, a.defaultFinish)
          );
        }
        if (filters.sort === 'name') {
          return a.name.localeCompare(b.name);
        }
        return 0;
      });
  }, [allProducts, filters]);

  const handleResetFilters = () => {
    setFilters({
      type: 'all',
      material: 'all',
      finish: 'all',
      search: '',
      sort: 'featured',
    });
  };

  return (
    <main>
      <Hero />
      <FilterBar
        filters={filters}
        onChange={setFilters}
        counts={counts}
        totalFiltered={filteredProducts.length}
      />
      <ProductGrid
        products={filteredProducts}
        onResetFilters={handleResetFilters}
      />
      <MaterialsTable />
      <FitFinder />
      <Newsletter />
      <SiteFooter />
    </main>
  );
}
