import {
  Html,
  Head,
  Body,
  Container,
  Heading,
  Text,
  Img,
  Section,
  Row,
  Column,
  Hr,
  Preview,
} from "@react-email/components";

export type EmailTranslations = {
  preview: string;
  greeting: string;
  description: string;
  verificationCodeLabel: string;
  expiresIn: string;
  tenMinutes: string;
  ignoreMessage: string;
  copyright: string;
};

// Default English translations
const defaultTranslations: EmailTranslations = {
  preview: "Your password reset code:",
  greeting: "Hello,",
  description:
    "We received a request to reset your password. Use the code below to complete the process.",
  verificationCodeLabel: "Your verification code",
  expiresIn: "This code expires in",
  tenMinutes: "10 minutes",
  ignoreMessage:
    "If you didn't request this password reset, you can safely ignore this email. Your account remains secure.",
  copyright: "All rights reserved.",
};

const PasswordChangeCode = ({
  name,
  code,
  translations = defaultTranslations,
}: {
  name: string;
  code: string;
  translations?: EmailTranslations;
}) => {
  const t = translations;

  const colors = {
    // Backgrounds
    outerBg: "#f8f9fa",
    cardBg: "#ffffff",
    codeBoxBg: "#1a1a1a",
    accentGradient: "linear-gradient(135deg, #cd4527 0%, #b03821 100%)",

    // Text
    heading: "#1a1a1a",
    primary: "#2d3748",
    secondary: "#718096",
    accent: "#cd4527",
    white: "#ffffff",

    // Borders & accents
    border: "#e2e8f0",
    divider: "#edf2f7",
  };

  return (
    <Html>
      <Head>
        <meta name="color-scheme" content="light only" />
        <meta name="supported-color-schemes" content="light only" />
      </Head>
      <Preview>
        {t.preview} {code}
      </Preview>
      <Body
        style={{
          fontFamily:
            '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
          margin: 0,
          padding: "40px 20px",
          backgroundColor: colors.outerBg,
        }}
      >
        <Container
          style={{
            maxWidth: "480px",
            margin: "0 auto",
          }}
        >
          {/* Logo Header */}
          <Section style={{ textAlign: "center", marginBottom: "32px" }}>
            <Img
              src="https://raw.githubusercontent.com/BlendiGR/autospa-opus/refs/heads/main/public/logo-opus.png?token=GHSAT0AAAAAADPB2SKD4SQRNUY6C5SHUBRA2KQCFJQ"
              alt="AutoSpa Opus"
              width="120"
              style={{ margin: "0 auto" }}
            />
          </Section>

          {/* Main Card */}
          <Section
            style={{
              backgroundColor: colors.cardBg,
              borderRadius: "16px",
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
              overflow: "hidden",
            }}
          >
            {/* Gradient accent bar */}
            <Row>
              <Column
                style={{
                  height: "4px",
                  background: colors.accentGradient,
                }}
              />
            </Row>

            {/* Content */}
            <Section style={{ padding: "40px 32px" }}>
              <Heading
                style={{
                  fontSize: "24px",
                  fontWeight: "700",
                  color: colors.heading,
                  margin: "0 0 8px 0",
                  letterSpacing: "-0.025em",
                }}
              >
                {t.greeting} {name}
              </Heading>

              <Text
                style={{
                  fontSize: "16px",
                  lineHeight: "24px",
                  color: colors.secondary,
                  margin: "0 0 32px 0",
                }}
              >
                {t.description}
              </Text>

              {/* Code Box */}
              <Section
                style={{
                  backgroundColor: colors.codeBoxBg,
                  borderRadius: "12px",
                  padding: "24px",
                  textAlign: "center",
                  margin: "0 0 32px 0",
                }}
              >
                <Text
                  style={{
                    fontSize: "11px",
                    fontWeight: "600",
                    textTransform: "uppercase" as const,
                    letterSpacing: "0.1em",
                    color: colors.accent,
                    margin: "0 0 12px 0",
                  }}
                >
                  {t.verificationCodeLabel}
                </Text>
                <Text
                  style={{
                    fontSize: "36px",
                    fontWeight: "700",
                    fontFamily: '"SF Mono", "Fira Code", "Fira Mono", Menlo, Monaco, monospace',
                    letterSpacing: "0.3em",
                    color: colors.white,
                    margin: 0,
                    padding: 0,
                  }}
                >
                  {code}
                </Text>
              </Section>

              {/* Timer warning */}
              <Section
                style={{
                  backgroundColor: "#fef3cd",
                  border: "1px solid #ffc107",
                  borderRadius: "8px",
                  padding: "12px 16px",
                  margin: "0 0 24px 0",
                }}
              >
                <Text
                  style={{
                    fontSize: "14px",
                    color: "#856404",
                    margin: 0,
                    textAlign: "center",
                  }}
                >
                  {t.expiresIn} <strong>{t.tenMinutes}</strong>
                </Text>
              </Section>

              <Hr
                style={{
                  borderColor: colors.divider,
                  borderWidth: "1px",
                  margin: "24px 0",
                }}
              />

              <Text
                style={{
                  fontSize: "14px",
                  lineHeight: "22px",
                  color: colors.secondary,
                  margin: 0,
                }}
              >
                {t.ignoreMessage}
              </Text>
            </Section>
          </Section>

          {/* Footer */}
          <Section
            style={{
              textAlign: "center",
              padding: "32px 0 0 0",
            }}
          >
            <Text
              style={{
                fontSize: "12px",
                color: "#a0aec0",
                margin: 0,
              }}
            >
              © {new Date().getFullYear()} AutoSpa Opus. {t.copyright}
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default PasswordChangeCode;
