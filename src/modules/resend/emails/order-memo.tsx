// External packages
import { Fragment } from 'react';
import {
  Text,
  Column,
  Heading,
  Row,
  Section,
  Hr,
} from '@react-email/components';
import { HttpTypes } from '@medusajs/framework/types';
import EmailLayout, { EmailLayoutProps } from './components/EmailLayout';

export type OrderMemoEmailProps = {
  order: Pick<
    HttpTypes.AdminOrder,
    | 'currency_code'
    | 'email'
    | 'shipping_total'
    | 'subtotal'
    | 'total'
    | 'tax_total'
  > & {
    display_id: string | number;
    created_at?: string | Date;
    shipping_address:
      | (Pick<
          HttpTypes.AdminOrderAddress,
          | 'first_name'
          | 'last_name'
          | 'address_1'
          | 'address_2'
          | 'city'
          | 'postal_code'
          | 'province'
          | 'phone'
        > & {
          country?: Pick<
            HttpTypes.AdminRegionCountry,
            'iso_2' | 'name' | 'display_name'
          >;
        })
      | null;
    items: Pick<
      HttpTypes.AdminOrder['items'][number],
      | 'id'
      | 'product_title'
      | 'variant_title'
      | 'total'
      | 'quantity'
      | 'variant_option_values'
    >[];
  };
} & EmailLayoutProps;

export default function OrderMemoEmail({
  order,
  ...emailLayoutProps
}: OrderMemoEmailProps) {
  const formatter = new Intl.NumberFormat('en-BD', {
    style: 'currency',
    currencyDisplay: 'narrowSymbol',
    currency: order.currency_code.toUpperCase(),
  });

  const orderDate = order.created_at
    ? new Date(order.created_at).toLocaleString('en-BD', {
        dateStyle: 'medium',
        timeStyle: 'short',
      })
    : '';

  const fullName = [
    order.shipping_address?.first_name,
    order.shipping_address?.last_name,
  ]
    .filter(Boolean)
    .join(' ');

  const addressLines = [
    order.shipping_address?.address_1,
    order.shipping_address?.address_2,
    [order.shipping_address?.city, order.shipping_address?.province]
      .filter(Boolean)
      .join(', '),
    [
      order.shipping_address?.postal_code,
      order.shipping_address?.country?.display_name,
    ]
      .filter(Boolean)
      .join(' '),
  ].filter(Boolean);

  const totalQuantity = order.items.reduce(
    (sum, item) => sum + item.quantity,
    0,
  );

  return (
    <EmailLayout
      previewText={`Fulfillment memo — order #${order.display_id}`}
      {...emailLayoutProps}
    >
      <Heading
        className="text-ink mt-0 mb-2 font-semibold"
        style={{ fontSize: '24px', letterSpacing: '-0.01em', fontWeight: 600 }}
      >
        Fulfillment memo
      </Heading>

      <Row className="mb-8">
        <Column>
          <Text className="text-sm text-ink m-0">
            Order <strong>#{order.display_id}</strong>
          </Text>
          {orderDate && (
            <Text className="text-xs text-muted m-0">{orderDate}</Text>
          )}
        </Column>
      </Row>

      {/* ── Ship to ── */}
      <Section
        className="mb-6 p-4 border border-solid border-border"
        style={{ borderRadius: '2px' }}
      >
        <Text
          className="text-xs text-muted !mt-0 !mb-3"
          style={{ textTransform: 'uppercase', letterSpacing: '0.12em' }}
        >
          Ship to
        </Text>
        {fullName && (
          <Text className="text-base text-ink m-0 leading-tight font-semibold">
            {fullName}
          </Text>
        )}
        {addressLines.map((line, index) => (
          <Text key={index} className="text-base text-ink m-0 leading-tight">
            {line}
          </Text>
        ))}
        {order.shipping_address?.phone && (
          <Text className="text-base text-ink m-0 leading-tight">
            Phone: {order.shipping_address.phone}
          </Text>
        )}
        {order.email && (
          <Text className="text-base text-ink m-0 leading-tight">
            Email: {order.email}
          </Text>
        )}
      </Section>

      {/* ── Items to pick ── */}
      <Section
        className="border border-solid border-border mb-6"
        style={{ borderRadius: '2px' }}
      >
        <Row className="py-3 px-4 border-b border-solid border-border">
          <Column>
            <Text
              className="text-xs text-muted m-0"
              style={{ textTransform: 'uppercase', letterSpacing: '0.12em' }}
            >
              Item
            </Text>
          </Column>
          <Column style={{ width: '60px', textAlign: 'center' }}>
            <Text
              className="text-xs text-muted m-0"
              style={{ textTransform: 'uppercase', letterSpacing: '0.12em' }}
            >
              Qty
            </Text>
          </Column>
          <Column style={{ width: '100px', textAlign: 'right' }}>
            <Text
              className="text-xs text-muted m-0"
              style={{ textTransform: 'uppercase', letterSpacing: '0.12em' }}
            >
              Amount
            </Text>
          </Column>
        </Row>
        {order.items.map((item, index) => (
          <Fragment key={item.id}>
            {index > 0 && (
              <Hr className="border-t border-solid border-border m-0" />
            )}
            <Row className="py-4 px-4">
              <Column style={{ verticalAlign: 'top' }}>
                <Text className="text-base text-ink font-semibold !mt-0 !mb-1">
                  {item.product_title}
                </Text>
                {Object.entries(item.variant_option_values ?? {}).flatMap(
                  ([key, value]) =>
                    typeof value === 'string'
                      ? [
                          <Text
                            key={key}
                            className="text-xs text-muted !m-0 !mb-0.5"
                          >
                            {key}: {value}
                          </Text>,
                        ]
                      : [],
                )}
              </Column>
              <Column
                style={{
                  width: '60px',
                  textAlign: 'center',
                  verticalAlign: 'top',
                }}
              >
                <Text className="text-base text-ink m-0 font-semibold">
                  {item.quantity}
                </Text>
              </Column>
              <Column
                style={{
                  width: '100px',
                  textAlign: 'right',
                  verticalAlign: 'top',
                  whiteSpace: 'nowrap',
                }}
              >
                <Text className="text-base text-ink m-0">
                  {formatter.format(item.total)}
                </Text>
              </Column>
            </Row>
          </Fragment>
        ))}
      </Section>

      {/* ── Totals ── */}
      <Section
        className="border border-solid border-border p-4 mb-2"
        style={{ borderRadius: '2px' }}
      >
        <Row className="mb-2">
          <Column>
            <Text className="text-sm text-muted m-0">Total items</Text>
          </Column>
          <Column style={{ textAlign: 'right' }}>
            <Text className="text-sm text-ink m-0">{totalQuantity}</Text>
          </Column>
        </Row>
        <Row className="mb-2">
          <Column>
            <Text className="text-sm text-muted m-0">Subtotal</Text>
          </Column>
          <Column style={{ textAlign: 'right' }}>
            <Text className="text-sm text-ink m-0">
              {formatter.format(order.subtotal)}
            </Text>
          </Column>
        </Row>
        <Row className="mb-4">
          <Column>
            <Text className="text-sm text-muted m-0">Shipping</Text>
          </Column>
          <Column style={{ textAlign: 'right' }}>
            <Text className="text-sm text-ink m-0">
              {formatter.format(order.shipping_total)}
            </Text>
          </Column>
        </Row>
        <Hr className="border-border m-0 mb-4" />
        <Row>
          <Column>
            <Text className="text-base text-ink font-semibold m-0">Total</Text>
          </Column>
          <Column style={{ textAlign: 'right' }}>
            <Text className="text-base text-ink font-semibold m-0">
              {formatter.format(order.total)}
            </Text>
          </Column>
        </Row>
        {order.tax_total > 0 && (
          <Row>
            <Column>
              <Text className="text-xs text-muted m-0 mt-1">
                Including {formatter.format(order.tax_total)} tax
              </Text>
            </Column>
          </Row>
        )}
      </Section>

      <Text className="text-xs text-muted mt-8 m-0">
        Internal fulfillment copy — order #{order.display_id}.
      </Text>
    </EmailLayout>
  );
}

OrderMemoEmail.PreviewProps = {
  order: {
    display_id: 1042,
    created_at: new Date(),
    currency_code: 'bdt',
    email: 'rayhan@example.com',
    shipping_address: {
      first_name: 'Rayhan',
      last_name: 'Ahmed',
      address_1: 'Road 12, House 5, Dhanmondi',
      address_2: '',
      city: 'Dhaka',
      postal_code: '1209',
      province: 'Dhaka',
      country: {
        iso_2: 'bd',
        name: 'Bangladesh',
        display_name: 'Bangladesh',
      },
      phone: '+880 17XX XXX XXX',
    },
    items: [
      {
        id: '1',
        product_title: 'Demon Slayer — Tanjiro Kamado Katana',
        variant_title: 'Black / 40 inch',
        total: 4500,
        quantity: 1,
        variant_option_values: {
          Color: 'Black',
          Size: '40 inch',
        },
      },
    ],
    shipping_total: 120,
    subtotal: 4380,
    total: 4500,
    tax_total: 0,
  },
} satisfies OrderMemoEmailProps;
