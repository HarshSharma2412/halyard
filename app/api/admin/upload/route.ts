import { NextRequest, NextResponse } from 'next/server';
import { writeFileSync, mkdirSync, readdirSync, unlinkSync, existsSync } from 'fs';
import path from 'path';

const uploadDir = path.join(process.cwd(), 'public', 'products');

function ensureDir() {
  if (!existsSync(uploadDir)) {
    mkdirSync(uploadDir, { recursive: true });
  }
}

// Upload image
export async function POST(req: NextRequest) {
  try {
    ensureDir();
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Sanitize filename
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '-').toLowerCase();
    const timestamp = Date.now();
    const filename = `${timestamp}-${safeName}`;
    const filePath = path.join(uploadDir, filename);

    const buffer = Buffer.from(await file.arrayBuffer());
    writeFileSync(filePath, buffer);

    return NextResponse.json({ url: `/products/${filename}`, name: filename });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// List all uploaded images
export async function GET() {
  try {
    ensureDir();
    const files = readdirSync(uploadDir);
    const images = files
      .filter((f) => /\.(jpg|jpeg|png|webp|gif|avif)$/i.test(f))
      .map((f) => ({ name: f, url: `/products/${f}` }));
    return NextResponse.json(images);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// Delete image
export async function DELETE(req: NextRequest) {
  try {
    const { name } = await req.json();
    if (!name || name.includes('..') || name.includes('/')) {
      return NextResponse.json({ error: 'Invalid filename' }, { status: 400 });
    }
    const filePath = path.join(uploadDir, name);
    if (existsSync(filePath)) {
      unlinkSync(filePath);
    }
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
