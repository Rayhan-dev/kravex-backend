// External packages
import {
  Body,
  Column,
  Container,
  Font,
  Head,
  Hr,
  Html,
  Link,
  Row,
  Section,
  Text,
  Tailwind,
} from '@react-email/components';

export type EmailLayoutProps = {
  siteTitle?: string;
  companyName?: string;
  footerLinks?: {
    url: string;
    label: string;
  }[];
};

export default function EmailLayout(
  props: {
    children: React.ReactNode;
  } & EmailLayoutProps
) {
  const storeName = props.siteTitle || 'Kravex';
  const companyName = props.companyName || 'Kravex';

  return (
    <Html>
      <Head>
        <Font
          fontFamily="Inter"
          fallbackFontFamily={['Arial', 'Helvetica', 'sans-serif']}
          webFont={{
            url: 'https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiJ-Ek-_EeA.woff2',
            format: 'woff2',
          }}
          fontWeight={400}
          fontStyle="normal"
        />
        <Font
          fontFamily="Inter"
          fallbackFontFamily={['Arial', 'Helvetica', 'sans-serif']}
          webFont={{
            url: 'https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuI6fAZ9hiJ-Ek-_EeA.woff2',
            format: 'woff2',
          }}
          fontWeight={600}
          fontStyle="normal"
        />
      </Head>
      <Tailwind
        config={{
          theme: {
            fontFamily: {
              sans: ['Inter', 'Arial', 'Helvetica', 'sans-serif'],
            },
            extend: {
              spacing: {
                18: '4.5rem',
                22: '5.5rem',
              },
              colors: {
                cream: '#f0ebe0',
                container: '#fdfcf8',
                gold: '#c9a84c',
                ink: '#0d0d0d',
                muted: '#7a6e5f',
                border: '#d9d3c5',
              },
              borderRadius: {
                xs: '2px',
                sm: '12px',
              },
              maxWidth: {
                37: '9.25rem',
                228: '57rem',
              },
              fontSize: {
                '2xl': ['2rem', '1.4'],
                xl: ['1.5rem', '1.4'],
                lg: ['1.25rem', '1.5'],
                md: ['1.0625rem', '1.6'],
                base: ['0.9375rem', '1.6'],
                sm: ['0.875rem', '1.5'],
                xs: ['0.75rem', '1.5'],
              },
            },
          },
        }}
      >
        <Body className="bg-cream font-sans font-normal m-0 p-0">
          <Container className="bg-container py-10 px-10 max-w-228 w-full" style={{ margin: '32px auto' }}>

            {/* ── Brand header ── */}
            <Section className="mb-10 pb-8 border-b-2 border-solid border-gold">
              <Link
                href={process.env.STOREFRONT_URL || 'http://localhost:8000'}
                className="text-ink no-underline"
                style={{ textDecoration: 'none' }}
              >
                <Text
                  className="m-0 font-semibold tracking-widest text-ink"
                  style={{
                    fontSize: '22px',
                    letterSpacing: '0.18em',
                    textTransform: 'uppercase',
                    fontWeight: 700,
                  }}
                >
                  {storeName}
                </Text>
              </Link>
            </Section>

            {/* ── Email content ── */}
            {props.children}

            {/* ── Footer ── */}
            <Hr className="mt-12 mb-6 border-border" />
            <Section>
              <Row>
                <Column className="w-full">
                  <Text className="text-xs text-muted m-0 mb-1">
                    &copy; {new Date().getFullYear()} {companyName}. All rights reserved.
                  </Text>
                  {props.footerLinks && props.footerLinks.length > 0 && (
                    <Row>
                      {props.footerLinks.map((link, index) => (
                        <Column className="pr-4" key={index}>
                          <Link
                            href={link.url}
                            className="text-muted text-xs"
                            style={{ textDecoration: 'underline', color: '#7a6e5f' }}
                          >
                            {link.label}
                          </Link>
                        </Column>
                      ))}
                    </Row>
                  )}
                </Column>
              </Row>
            </Section>

          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
