import { NextRequest, NextResponse } from 'next/server';
import { readFileSync, writeFileSync } from 'fs';
import path from 'path';

const productsPath = path.join(process.cwd(), 'lib', 'products.json');

function readProducts() {
  return JSON.parse(readFileSync(productsPath, 'utf-8')) as any[];
}

function writeProducts(data: unknown[]) {
  writeFileSync(productsPath, JSON.stringify(data, null, 2), 'utf-8');
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function PUT(req: NextRequest, { params }: PageProps) {
  try {
    const { id } = await params;
    const body = await req.json();
    const products = readProducts();
    const idx = products.findIndex((p) => p.id === id);

    if (idx === -1) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    products[idx] = { ...products[idx], ...body, id };
    writeProducts(products);
    return NextResponse.json(products[idx]);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: PageProps) {
  try {
    const { id } = await params;
    const products = readProducts();
    const filtered = products.filter((p) => p.id !== id);

    if (filtered.length === products.length) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    writeProducts(filtered);
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
