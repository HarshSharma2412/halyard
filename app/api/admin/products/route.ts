import { NextRequest, NextResponse } from 'next/server';
import { readFileSync, writeFileSync } from 'fs';
import path from 'path';

const productsPath = path.join(process.cwd(), 'lib', 'products.json');

function readProducts() {
  return JSON.parse(readFileSync(productsPath, 'utf-8'));
}

function writeProducts(data: unknown[]) {
  writeFileSync(productsPath, JSON.stringify(data, null, 2), 'utf-8');
}

export async function GET() {
  try {
    const products = readProducts();
    return NextResponse.json(products);
  } catch {
    return NextResponse.json({ error: 'Failed to read products' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const products = readProducts();

    // Generate a unique id from slug
    const newProduct = {
      ...body,
      id: body.slug.replace(/-/g, '-'),
    };

    products.push(newProduct);
    writeProducts(products);
    return NextResponse.json(newProduct, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
