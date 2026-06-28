// External packages
import { Fragment } from 'react';
import {
  Text,
  Column,
  Heading,
  Img,
  Row,
  Section,
  Link,
  Hr,
} from '@react-email/components';
import { HttpTypes } from '@medusajs/framework/types';
import EmailLayout, { EmailLayoutProps } from './components/EmailLayout';

export type OrderPlacedEmailProps = {
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
      | 'thumbnail'
      | 'product_title'
      | 'variant_title'
      | 'total'
      | 'quantity'
      | 'variant_option_values'
    >[];
  };
} & EmailLayoutProps;

export default function OrderPlacedEmail({
  order,
  ...emailLayoutProps
}: OrderPlacedEmailProps) {
  const formatter = new Intl.NumberFormat('en-BD', {
    style: 'currency',
    currencyDisplay: 'narrowSymbol',
    currency: order.currency_code.toUpperCase(),
  });

  const fullName = [
    order.shipping_address?.first_name,
    order.shipping_address?.last_name,
  ]
    .filter(Boolean)
    .join(' ');

  const addressLine = [
    order.shipping_address?.address_1,
    order.shipping_address?.address_2,
    order.shipping_address?.city,
    order.shipping_address?.country?.display_name,
  ]
    .filter(Boolean)
    .join(', ');

  return (
    <EmailLayout {...emailLayoutProps}>
      <Heading
        className="text-ink mt-0 mb-6 font-semibold"
        style={{ fontSize: '26px', letterSpacing: '-0.01em', fontWeight: 600 }}
      >
        Order confirmed.
      </Heading>

      <Text className="text-md text-ink !mb-4">
        Your order <strong>#{order.display_id}</strong> has been received and is
        being prepared.
      </Text>

      <Text className="text-md text-ink !mb-10">
        We'll send you another email when your order ships. For questions, reply
        to this email or reach us at{' '}
        <Link href="mailto:support@kravex.com" className="text-ink">
          support@kravex.com
        </Link>
        .
      </Text>

      {/* ── Delivery address ── */}
      {order.shipping_address && (
        <Section
          className="mb-6 p-4 border border-solid border-border"
          style={{ borderRadius: '2px' }}
        >
          <Text
            className="text-xs text-muted !mt-0 !mb-3"
            style={{ textTransform: 'uppercase', letterSpacing: '0.12em' }}
          >
            Delivery address
          </Text>
          {fullName && (
            <Text className="text-base text-ink m-0 leading-tight">{fullName}</Text>
          )}
          {addressLine && (
            <Text className="text-base text-ink m-0 leading-tight">{addressLine}</Text>
          )}
          {order.shipping_address.phone && (
            <Text className="text-base text-ink m-0 leading-tight">
              {order.shipping_address.phone}
            </Text>
          )}
        </Section>
      )}

      {/* ── Order items ── */}
      <Section
        className="border border-solid border-border mb-6"
        style={{ borderRadius: '2px' }}
      >
        {order.items.map((item, index) => (
          <Fragment key={item.id}>
            {index > 0 && (
              <Hr className="border-t border-solid border-border m-0" />
            )}
            <Row className="py-4 px-4">
              <Column style={{ width: '80px', verticalAlign: 'top' }}>
                {!!item.thumbnail && (
                  <Img
                    src={item.thumbnail}
                    alt={item.product_title}
                    width="72"
                    height="96"
                    style={{ objectFit: 'cover', display: 'block' }}
                  />
                )}
              </Column>
              <Column className="pl-4" style={{ verticalAlign: 'top' }}>
                <Text className="text-base text-ink font-semibold !mt-0 !mb-1">
                  {item.product_title}
                </Text>
                {Object.entries(item.variant_option_values ?? {}).flatMap(
                  ([key, value]) =>
                    typeof value === 'string'
                      ? [
                          <Text key={key} className="text-xs text-muted !m-0 !mb-0.5">
                            {key}: {value}
                          </Text>,
                        ]
                      : [],
                )}
                <Text className="text-xs text-muted !m-0 !mt-1">
                  Qty: {item.quantity}
                </Text>
              </Column>
              <Column style={{ verticalAlign: 'bottom', textAlign: 'right', whiteSpace: 'nowrap' }}>
                <Text className="text-base text-ink m-0 font-semibold">
                  {formatter.format(item.total)}
                </Text>
              </Column>
            </Row>
          </Fragment>
        ))}
      </Section>

      {/* ── Order totals ── */}
      <Section
        className="border border-solid border-border p-4 mb-2"
        style={{ borderRadius: '2px' }}
      >
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

      <Text className="text-sm text-muted mt-8 m-0">
        Thank you for choosing Kravex.
      </Text>
    </EmailLayout>
  );
}

OrderPlacedEmail.PreviewProps = {
  order: {
    display_id: 1042,
    currency_code: 'bdt',
    email: 'rayhan@example.com',
    shipping_address: {
      first_name: 'Rayhan',
      last_name: 'Ahmed',
      address_1: 'Road 12, House 5, Dhanmondi',
      address_2: '',
      city: 'Dhaka',
      postal_code: '',
      country: {
        iso_2: 'bd',
        name: 'Bangladesh',
        display_name: 'Bangladesh',
      },
      phone: '+880 17XX XXX XXX',
      province: '',
    },
    items: [
      {
        id: '1',
        thumbnail:
          'https://fashion-starter-demo.s3.eu-central-1.amazonaws.com/belime-estate-01JAR3JYD68D1YYR0BN7HHMAZE.png',
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
} satisfies OrderPlacedEmailProps;
