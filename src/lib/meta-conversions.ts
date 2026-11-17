import { createHash } from 'node:crypto';

type MetaOrder = {
  id: string;
  email?: string | null;
  total?: unknown;
  currency_code?: string | null;
  shipping_address?: {
    first_name?: string | null;
    last_name?: string | null;
    phone?: string | null;
    city?: string | null;
    state?: string | null;
    postal_code?: string | null;
    country_code?: string | null;
  } | null;
  items?: Array<{
    product_id?: string | null;
    quantity?: unknown;
    unit_price?: unknown;
  }>;
};

const hash = (value: string | null | undefined) => {
  const normalized = value?.trim().toLowerCase();
  return normalized
    ? createHash('sha256').update(normalized).digest('hex')
    : undefined;
};

const asNumber = (value: unknown) => Number(value ?? 0);

export async function sendMetaPurchase(order: MetaOrder) {
  const pixelId = process.env.META_PIXEL_ID;
  const accessToken = process.env.META_CONVERSIONS_API_ACCESS_TOKEN;
  const graphApiVersion = process.env.META_GRAPH_API_VERSION ?? 'v25.0';

  if (!pixelId || !accessToken) {
    console.warn(
      'Meta CAPI skipped: META_PIXEL_ID or META_CONVERSIONS_API_ACCESS_TOKEN is missing',
    );
    return;
  }

  const address = order.shipping_address;
  const value = asNumber(order.total);
  const currency = (order.currency_code ?? '').trim().toUpperCase();
  if (!Number.isFinite(value) || value <= 0) {
    throw new Error(`Meta CAPI Purchase has invalid order value: ${order.total}`);
  }
  if (!/^[A-Z]{3}$/.test(currency)) {
    throw new Error(`Meta CAPI Purchase has invalid currency: ${order.currency_code}`);
  }

  const contents = (order.items ?? [])
    .filter((item) => item.product_id)
    .map((item) => ({
      id: item.product_id,
      quantity: Math.trunc(asNumber(item.quantity)),
      item_price: asNumber(item.unit_price),
    }));

  const userData = {
    em: hash(order.email),
    ph: hash(address?.phone),
    fn: hash(address?.first_name),
    ln: hash(address?.last_name),
    ct: hash(address?.city),
    st: hash(address?.state),
    zp: hash(address?.postal_code),
    country: hash(address?.country_code),
  };

  const response = await fetch(
    `https://graph.facebook.com/${graphApiVersion}/${pixelId}/events?access_token=${encodeURIComponent(accessToken)}`,
    {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        data: [
          {
            event_name: 'Purchase',
            event_time: Math.floor(Date.now() / 1000),
            event_id: `purchase_${order.id}`,
            action_source: 'website',
            event_source_url: `${process.env.STOREFRONT_URL ?? ''}/bd/order/confirmed/${order.id}`,
            client_user_agent: 'Kravex/Medusa server',
            user_data: userData,
            custom_data: {
              currency,
              value,
              content_type: 'product',
              content_ids: contents.map((item) => item.id),
              contents,
            },
          },
        ],
      }),
    },
  );

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Meta CAPI Purchase failed (${response.status}): ${body}`);
  }
}
