// External components
import { Text, Heading, Button } from '@react-email/components';

// Types
import { CustomerDTO } from '@medusajs/framework/types';

// Components
import EmailLayout, { EmailLayoutProps } from './components/EmailLayout';

type Props = {
  customer: Pick<CustomerDTO, 'id' | 'email' | 'first_name' | 'last_name'>;
  token: string;
};

export default function AuthPasswordResetEmail({
  customer,
  token,
  ...emailLayoutProps
}: Props & EmailLayoutProps) {
  const resetUrl = `${
    process.env.STOREFRONT_URL || 'http://localhost:8000'
  }/auth/reset-password?email=${encodeURIComponent(
    customer.email,
  )}&token=${encodeURIComponent(token)}`;

  return (
    <EmailLayout {...emailLayoutProps}>
      <Heading
        className="text-ink mt-0 mb-8 font-semibold"
        style={{ fontSize: '26px', letterSpacing: '-0.01em', fontWeight: 600 }}
      >
        Reset your password.
      </Heading>

      <Text className="text-md text-ink !mb-10">
        We received a request to reset the password for your Kravex account
        ({customer.email}). Click the button below to choose a new one:
      </Text>

      <Button
        href={resetUrl}
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
        Reset password
      </Button>

      <Text className="text-sm text-muted m-0">
        This link expires in 24 hours. If you didn&apos;t request a password
        reset, you can safely ignore this email — your password won&apos;t
        change.
      </Text>
    </EmailLayout>
  );
}

AuthPasswordResetEmail.PreviewProps = {
  customer: {
    id: '1',
    email: 'rayhan@example.com',
    first_name: 'Rayhan',
    last_name: 'Ahmed',
  },
  token: '1234567789012345677890',
} satisfies Props;
