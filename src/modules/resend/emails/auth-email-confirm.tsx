// External packages
import { Text, Heading, Button } from '@react-email/components';

// Components
import EmailLayout, { EmailLayoutProps } from './components/EmailLayout';

type Props = {
  customer?: { email?: string; first_name?: string };
  confirmUrl?: string;
};

export default function AuthEmailConfirm({
  customer,
  confirmUrl,
  ...emailLayoutProps
}: Props & EmailLayoutProps) {
  const firstName = customer?.first_name || 'there';

  return (
    <EmailLayout {...emailLayoutProps}>
      <Heading
        className="text-ink mt-0 mb-8 font-semibold"
        style={{ fontSize: '26px', letterSpacing: '-0.01em', fontWeight: 600 }}
      >
        Verify your email.
      </Heading>

      <Text className="text-md text-ink !mb-6">
        Hey {firstName}, thanks for registering with Kravex! Before we get
        started, we need to confirm your email address.
      </Text>

      <Text className="text-md text-ink !mb-10">
        Click the button below to verify:
      </Text>

      <Button
        href={confirmUrl || '#'}
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
        Verify email
      </Button>

      <Text className="text-sm text-muted m-0">
        If you didn&apos;t create a Kravex account, you can safely ignore this
        email.
      </Text>
    </EmailLayout>
  );
}
