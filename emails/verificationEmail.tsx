import {
    Html,
    Head,
    Font,
    Preview,
    Heading,
    Row,
    Section,
    Text,
    Button,
    Column,
} from '@react-email/components';

interface VerificationEmailProps {
    username: string;
    otp: string;
}

export default function VerificationEmail({ username, otp }: VerificationEmailProps) {
    return (
        <Html lang="en" dir="ltr">
            <Head>
                <title>Verify Your Account</title>
                <Font
                    fontFamily="Inter"
                    fallbackFontFamily={["Arial", "sans-serif"]}
                    webFont={{
                        url: 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiA.woff2',
                        format: 'woff2',
                    }}
                    fontWeight={400}
                    fontStyle="normal"
                />
            </Head>
            <Preview>Your verification code: {otp}</Preview>
            <Section style={container}>
                {/* Header */}
                <Section style={header}>
                    <Text style={logo}>YourApp</Text>
                </Section>

                {/* Main Content */}
                <Section style={content}>
                    <Row>
                        <Heading as="h1" style={heading}>
                            Verify Your Email Address
                        </Heading>
                    </Row>

                    <Row>
                        <Text style={greeting}>
                            Hello <strong>{username}</strong>,
                        </Text>
                    </Row>

                    <Row>
                        <Text style={paragraph}>
                            Thank you for registering! To complete your account setup,
                            please use the following verification code:
                        </Text>
                    </Row>

                    {/* OTP Code Box */}
                    <Row>
                        <Section style={otpContainer}>
                            <Text style={otpCode}>{otp}</Text>
                        </Section>
                    </Row>

                    <Row>
                        <Text style={paragraph}>
                            This code will expire in 10 minutes. Enter this code in the
                            verification page to complete your registration.
                        </Text>
                    </Row>

                    {/* CTA Button */}
                    <Row>
                        <Button href="#" style={button}>
                            Go to Verification Page
                        </Button>
                    </Row>

                    {/* Security Notice */}
                    <Row>
                        <Section style={notice}>
                            <Text style={noticeText}>
                                <strong>Security Tip:</strong> Never share this code with anyone.
                                Our team will never ask for your verification code.
                            </Text>
                        </Section>
                    </Row>
                </Section>

                {/* Footer */}
                <Section style={footer}>
                    <Row>
                        <Text style={footerText}>
                            If you didn't request this code, please ignore this email.
                        </Text>
                    </Row>
                    <Row>
                        <Text style={footerText}>
                            Need help? Contact our{' '}
                            <a href="mailto:support@yourapp.com" style={link}>
                                support team
                            </a>
                        </Text>
                    </Row>
                    <Row>
                        <Text style={copyright}>
                            © {new Date().getFullYear()} YourApp. All rights reserved.
                        </Text>
                    </Row>
                </Section>
            </Section>
        </Html>
    );
}

// Styles
const container = {
    backgroundColor: '#f9fafb',
    padding: '20px 0',
    fontFamily: 'Inter, Arial, sans-serif',
};

const header = {
    backgroundColor: '#ffffff',
    padding: '20px 30px',
    borderBottom: '1px solid #e5e7eb',
};

const logo = {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#2563eb',
    margin: '0',
};

const content = {
    backgroundColor: '#ffffff',
    margin: '20px auto',
    padding: '40px 30px',
    borderRadius: '8px',
    maxWidth: '500px',
    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
};

const heading = {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#111827',
    textAlign: 'center' as const,
    margin: '0 0 20px 0',
};

const greeting = {
    fontSize: '16px',
    color: '#374151',
    margin: '0 0 20px 0',
};

const paragraph = {
    fontSize: '16px',
    lineHeight: '1.5',
    color: '#6b7280',
    margin: '0 0 20px 0',
    textAlign: 'center' as const,
};

const otpContainer = {
    backgroundColor: '#f8fafc',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    padding: '20px',
    margin: '30px 0',
    textAlign: 'center' as const,
};

const otpCode = {
    fontSize: '32px',
    fontWeight: 'bold',
    letterSpacing: '8px',
    color: '#2563eb',
    margin: '0',
    fontFamily: 'monospace',
};

const button = {
    backgroundColor: '#2563eb',
    borderRadius: '6px',
    color: '#ffffff',
    fontSize: '16px',
    fontWeight: 'bold',
    textDecoration: 'none',
    textAlign: 'center' as const,
    display: 'block',
    padding: '12px 24px',
    margin: '20px 0',
};

const notice = {
    backgroundColor: '#fef3c7',
    border: '1px solid #f59e0b',
    borderRadius: '6px',
    padding: '16px',
    margin: '20px 0',
};

const noticeText = {
    fontSize: '14px',
    color: '#92400e',
    margin: '0',
    lineHeight: '1.5',
};

const footer = {
    textAlign: 'center' as const,
    padding: '20px 30px',
    color: '#9ca3af',
};

const footerText = {
    fontSize: '14px',
    color: '#9ca3af',
    margin: '8px 0',
    lineHeight: '1.5',
};

const copyright = {
    fontSize: '12px',
    color: '#9ca3af',
    margin: '16px 0 0 0',
};

const link = {
    color: '#2563eb',
    textDecoration: 'underline',
};