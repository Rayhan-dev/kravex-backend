// External packages
import { Text, Heading, Button, Link } from '@react-email/components';

// Types
import { CustomerDTO, OrderDTO } from '@medusajs/framework/types';

// Components
import EmailLayout, { EmailLayoutProps } from './components/EmailLayout';

type Props = {
  customer: Pick<CustomerDTO, 'id' | 'email' | 'first_name' | 'last_name'>;
  order: Pick<OrderDTO, 'id' | 'display_id'>;
};

export default function OrderUpdateEmail({
  customer,
  order,
  ...emailLayoutProps
}: Props & EmailLayoutProps) {
  const orderUrl = `${
    process.env.STOREFRONT_URL || 'http://localhost:8000'
  }/account/my-orders/${order.id}`;

  return (
    <EmailLayout {...emailLayoutProps}>
      <Heading
        className="text-ink mt-0 mb-8 font-semibold"
        style={{ fontSize: '26px', letterSpacing: '-0.01em', fontWeight: 600 }}
      >
        Your order is on its way.
      </Heading>

      <Text className="text-md text-ink !mb-4">
        Great news — order <strong>#{order.display_id}</strong> has been shipped
        and is now on its way to you.
      </Text>

      <Text className="text-md text-ink !mb-10">
        Track your package or view your order details below:
      </Text>

      <Button
        href={orderUrl}
        style={{
          display: 'inline-block',
          backgroundColor: '#0d0d0d',
          color: '#ffffff',
          padding: '12px 28px',
          fontWeight: 600,
          fontSize: '14px',
          textDecoration: 'none',
          borderRadius: '2px',
          marginBottom: '32px',
          letterSpacing: '0.04em',
        }}
      >
        View order
      </Button>

      <Text className="text-md text-ink m-0">
        Questions? Reply to this email or reach us at{' '}
        <Link href="mailto:support@kravex.com" className="text-ink">
          support@kravex.com
        </Link>
        .
      </Text>
    </EmailLayout>
  );
}

OrderUpdateEmail.PreviewProps = {
  customer: {
    id: '1',
    email: 'rayhan@example.com',
    first_name: 'Rayhan',
    last_name: 'Ahmed',
  },
  order: {
    id: 'order_01JCNYH6VADAK90W7CBSPV5BT6',
    display_id: 1042,
  },
} satisfies Props;
