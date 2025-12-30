import {
  Html,
  Head,
  Body,
  Container,
  Heading,
  Text,
  Img,
  Section,
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

/** Default English translations */
const defaultTranslations: EmailTranslations = {
  preview: "Your password reset code:",
  greeting: "Hello",
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
          backgroundColor: "#f5f5f5",
        }}
      >
        <Container
          style={{
            maxWidth: "480px",
            margin: "0 auto",
            backgroundColor: "#ffffff",
            border: "1px solid #e0e0e0",
          }}
        >
          {/* Header with Logo */}
          <Section
            style={{
              padding: "32px 40px",
              borderBottom: "1px solid #e0e0e0",
              textAlign: "center",
            }}
          >
            <Img
              src="https://raw.githubusercontent.com/BlendiGR/autospa-opus/refs/heads/main/public/logo-opus.png?token=GHSAT0AAAAAADPB2SKD4SQRNUY6C5SHUBRA2KQCFJQ"
              alt="AutoSpa Opus"
              width="100"
              style={{ margin: "0 auto" }}
            />
          </Section>

          {/* Main Content */}
          <Section style={{ padding: "32px 40px" }}>
            <Heading
              style={{
                fontSize: "18px",
                fontWeight: "600",
                color: "#333333",
                margin: "0 0 16px 0",
              }}
            >
              {t.greeting}, {name}
            </Heading>

            <Text
              style={{
                fontSize: "14px",
                lineHeight: "22px",
                color: "#666666",
                margin: "0 0 24px 0",
              }}
            >
              {t.description}
            </Text>

            {/* Code Box */}
            <Section
              style={{
                backgroundColor: "#fafafa",
                border: "1px solid #e0e0e0",
                padding: "24px",
                textAlign: "center",
                marginBottom: "24px",
              }}
            >
              <Text
                style={{
                  fontSize: "11px",
                  fontWeight: "600",
                  textTransform: "uppercase" as const,
                  letterSpacing: "0.05em",
                  color: "#666666",
                  margin: "0 0 8px 0",
                }}
              >
                {t.verificationCodeLabel}
              </Text>
              <Text
                style={{
                  fontSize: "32px",
                  fontWeight: "700",
                  fontFamily: "monospace",
                  letterSpacing: "0.2em",
                  color: "#333333",
                  margin: 0,
                }}
              >
                {code}
              </Text>
            </Section>

            {/* Expiry Notice */}
            <Text
              style={{
                fontSize: "13px",
                color: "#666666",
                margin: "0 0 24px 0",
                textAlign: "center",
              }}
            >
              {t.expiresIn} <strong>{t.tenMinutes}</strong>.
            </Text>

            <Hr
              style={{
                borderColor: "#e0e0e0",
                borderWidth: "1px",
                margin: "24px 0",
              }}
            />

            <Text
              style={{
                fontSize: "13px",
                lineHeight: "20px",
                color: "#999999",
                margin: 0,
              }}
            >
              {t.ignoreMessage}
            </Text>
          </Section>

          {/* Footer */}
          <Section
            style={{
              padding: "20px 40px",
              borderTop: "1px solid #e0e0e0",
              backgroundColor: "#fafafa",
            }}
          >
            <Text
              style={{
                fontSize: "11px",
                color: "#999999",
                margin: 0,
                textAlign: "center",
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
