// External packages
import { Text, Heading } from '@react-email/components';
import { CustomerDTO } from '@medusajs/framework/types';

// Components
import EmailLayout, { EmailLayoutProps } from './components/EmailLayout';

type Props = {
  customer: Pick<CustomerDTO, 'id' | 'email' | 'first_name' | 'last_name'>;
};

export default function WelcomeEmail({
  customer,
  ...emailLayoutProps
}: Props & EmailLayoutProps) {
  const firstName = customer.first_name || 'there';

  return (
    <EmailLayout {...emailLayoutProps}>
      <Heading
        className="text-ink mt-0 mb-8 font-semibold"
        style={{ fontSize: '26px', letterSpacing: '-0.01em', fontWeight: 600 }}
      >
        Welcome to Kravex, {firstName}.
      </Heading>

      <Text className="text-md text-ink !mb-6">
        Your account is ready. You now have access to our full catalog of
        katanas, blades, and replica weapons — crafted for collectors and
        enthusiasts who know the difference.
      </Text>

      <Text className="text-md text-ink !mb-2 font-semibold">
        Here's what's waiting for you:
      </Text>

      <Text className="text-md text-ink !mt-0 !mb-1" style={{ paddingLeft: '16px' }}>
        — Authentic replica katanas &amp; blades, anime and game-inspired
      </Text>
      <Text className="text-md text-ink !mt-0 !mb-1" style={{ paddingLeft: '16px' }}>
        — Curated collections updated regularly
      </Text>
      <Text className="text-md text-ink !mt-0 !mb-1" style={{ paddingLeft: '16px' }}>
        — Fast delivery across Bangladesh
      </Text>
      <Text className="text-md text-ink !mt-0 !mb-10" style={{ paddingLeft: '16px' }}>
        — Dedicated support when you need it
      </Text>

      <Text className="text-md text-ink m-0">
        The Kravex Team
      </Text>
    </EmailLayout>
  );
}

WelcomeEmail.PreviewProps = {
  customer: {
    id: '1',
    email: 'example@kravex.com',
    first_name: 'Rayhan',
    last_name: 'Ahmed',
  },
} satisfies Props;
