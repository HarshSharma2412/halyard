import { Metadata } from 'next';
import { Suspense } from 'react';
import products from '@/lib/products.json';
import { BraceletsCollectionClient } from '@/components/BraceletsCollectionClient';

export const metadata: Metadata = {
  title: "Men's & Unisex Bracelets | Recycled 316L & 925 Sterling Silver | Halyard",
  description:
    'Explore our collection of sculptural chains, cuffs, and signet bracelets cut from recycled 316L stainless steel and certified solid 925 sterling silver. Lifetime guarantee.',
  keywords: [
    'mens bracelets',
    'unisex jewelry',
    '316L stainless steel bracelet',
    '925 sterling silver chain',
    'cuban link bracelet',
    'cuff bracelet',
    'waterproof jewelry',
  ],
  openGraph: {
    title: "Bracelets Collection — Halyard",
    description:
      'Engineered in recycled 316L steel & solid 925 sterling silver. Water-resistant, sweat-proof, lifetime guarantee.',
    type: 'website',
  },
};

export default function BraceletsPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: "Halyard Men's & Unisex Bracelets",
    description:
      'Engineered bracelets in recycled 316L stainless steel and 925 sterling silver.',
    numberOfItems: products.length,
    itemListElement: products.map((product, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'Product',
        name: product.name,
        description: product.description,
        sku: product.id,
        offers: {
          '@type': 'Offer',
          priceCurrency: 'EUR',
          price: product.basePrice,
          availability: 'https://schema.org/InStock',
        },
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Suspense fallback={<div style={{ padding: '64px', textAlign: 'center' }}>Loading collection...</div>}>
        <BraceletsCollectionClient />
      </Suspense>
    </>
  );
}
