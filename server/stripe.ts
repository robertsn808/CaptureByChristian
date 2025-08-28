import Stripe from 'stripe';

let stripeSingleton: Stripe | null = null;

export function getStripe(): Stripe | null {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  if (stripeSingleton) return stripeSingleton;
  stripeSingleton = new Stripe(key, {
    apiVersion: '2024-06-20',
  });
  return stripeSingleton;
}

export async function createCheckoutSessionUrl(params: {
  customerEmail?: string;
  invoiceNumber: string;
  items: Array<{ description: string; quantity: number; rate: number; }>;
  total?: number; // optional fallback when items are not detailed
  successUrl: string;
  cancelUrl: string;
}): Promise<string | null> {
  const stripe = getStripe();
  if (!stripe) return null;

  const lineItems = (params.items && params.items.length > 0)
    ? params.items.map((it) => ({
        price_data: {
          currency: 'usd',
          product_data: { name: it.description || `Invoice ${params.invoiceNumber}` },
          unit_amount: Math.max(0, Math.round((Number(it.rate) || 0) * 100)),
        },
        quantity: Math.max(1, Number(it.quantity) || 1),
      }))
    : [{
        price_data: {
          currency: 'usd',
          product_data: { name: `Invoice ${params.invoiceNumber}` },
          unit_amount: Math.max(0, Math.round((Number(params.total) || 0) * 100)),
        },
        quantity: 1,
      }];

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    line_items: lineItems,
    success_url: params.successUrl,
    cancel_url: params.cancelUrl,
    customer_email: params.customerEmail,
    metadata: { invoiceNumber: params.invoiceNumber },
  });

  return session.url || null;
}

