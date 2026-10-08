import { NextRequest, NextResponse } from 'next/server';
import { readFileSync, writeFileSync } from 'fs';
import path from 'path';

const settingsPath = path.join(process.cwd(), 'lib', 'settings.json');

export async function GET() {
  try {
    const settings = JSON.parse(readFileSync(settingsPath, 'utf-8'));
    return NextResponse.json(settings);
  } catch {
    return NextResponse.json({ error: 'Failed to read settings' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    // Merge with existing settings (never delete keys)
    const existing = JSON.parse(readFileSync(settingsPath, 'utf-8'));
    const merged = { ...existing, ...body };
    writeFileSync(settingsPath, JSON.stringify(merged, null, 2), 'utf-8');
    return NextResponse.json(merged);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
