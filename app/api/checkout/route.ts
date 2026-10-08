import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import type { CartItem } from '@/lib/types';

// Integration point: Stripe Checkout Session creation
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { items, currency = 'eur' }: { items: CartItem[]; currency: string } = body;

    const stripeKey = process.env.STRIPE_SECRET_KEY;

    if (!stripeKey || stripeKey.includes('placeholder')) {
      // Mock checkout response when Stripe keys are not yet configured
      return NextResponse.json({
        mock: true,
        message: 'Stripe keys not detected. To enable live payments, set STRIPE_SECRET_KEY in .env.local.',
        url: '/checkout/mock-success',
      });
    }

    const stripe = new Stripe(stripeKey, {
      apiVersion: '2025-02-24.acacia' as any,
    });

    const origin = req.headers.get('origin') || 'http://localhost:3000';

    // Calculate bundle discount if 3 or more items
    const totalQty = (items || []).reduce((sum, item) => sum + item.quantity, 0);
    const hasDiscount = totalQty >= 3;

    const lineItems = (items || []).map((item) => {
      const unitAmount = Math.round(
        item.price * (hasDiscount ? 0.9 : 1) * 100
      );

      return {
        price_data: {
          currency: currency.toLowerCase(),
          product_data: {
            name: `${item.name} (${item.finishLabel})`,
            description: item.size ? `Size: ${item.size}` : 'Unisize (17–21 cm)',
          },
          unit_amount: unitAmount,
        },
        quantity: item.quantity,
      };
    });

    const session = await stripe.checkout.sessions.create({
      line_items: lineItems,
      mode: 'payment',
      shipping_address_collection: {
        allowed_countries: ['US', 'CA', 'GB', 'DE', 'FR', 'DK', 'SE', 'NO', 'NL', 'AU', 'IN'],
      },
      success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/bracelets`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error('Stripe Checkout Error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error creating checkout session' },
      { status: 500 }
    );
  }
}

// Fallback GET route for direct link clicks
export async function GET(req: NextRequest) {
  return NextResponse.redirect(new URL('/checkout/mock-success', req.url));
}
