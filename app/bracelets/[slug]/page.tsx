import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import products from '@/lib/products.json';
import type { Product } from '@/lib/types';
import { ProductDetailClient } from '@/components/ProductDetailClient';
import { SiteFooter } from '@/components/SiteFooter';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return products.map((product) => ({
    slug: product.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = products.find((p) => p.slug === slug);

  if (!product) {
    return { title: 'Product Not Found | Halyard' };
  }

  const materialName =
    product.material === 'silver' ? '925 Sterling Silver' : 'Recycled 316L Stainless Steel';

  return {
    title: `${product.name} — ${materialName} | Halyard`,
    description: product.description,
    openGraph: {
      title: `${product.name} | Halyard`,
      description: product.description,
      type: 'website',
    },
  };
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const product = products.find((p) => p.slug === slug) as Product | undefined;

  if (!product) {
    notFound();
  }

  const wearWithProducts = (product.wearWith || [])
    .map((id) => products.find((p) => p.id === id) as Product | undefined)
    .filter(Boolean) as Product[];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    sku: product.id,
    brand: {
      '@type': 'Brand',
      name: 'Halyard',
    },
    material: product.material === 'silver' ? '925 Sterling Silver' : 'Recycled 316L Stainless Steel',
    offers: {
      '@type': 'Offer',
      priceCurrency: 'EUR',
      price: product.basePrice,
      availability: 'https://schema.org/InStock',
      url: `https://halyard.studio/bracelets/${product.slug}`,
    },
  };

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ProductDetailClient
        product={product}
        wearWithProducts={wearWithProducts}
      />
      <SiteFooter />
    </main>
  );
}
