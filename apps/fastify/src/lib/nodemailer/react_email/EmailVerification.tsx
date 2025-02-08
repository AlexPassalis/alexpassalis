import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components'
import * as React from 'react'
import { URL_SIGNUP_FINAL } from './../../../data/urls'

type EmailVerification = {
  token: string
}

export default function EmailVerification({ token }: EmailVerification) {
  const url = `${URL_SIGNUP_FINAL}?token=${token}`

  return (
    <Html>
      <Head />
      <Preview>Email Verification</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={coverSection}>
            <Section style={upperSection}>
              <Heading style={h1}>Verify your email address</Heading>
              <Text style={mainText}>
                Thanks for starting your alexpassalis.com account creation
                process. We want to make sure it's really you. Please click the
                following verification url to continue with your account
                creation. If you don&apos;t want to create an account, you can
                ignore this message.
              </Text>
              <Section style={verificationSection}>
                <Link style={codeText} href={url}>
                  {URL_SIGNUP_FINAL}
                </Link>
                <Text style={validityText}>(This url is valid for 1 hour)</Text>
              </Section>
            </Section>
            <Hr />
            <Section style={lowerSection}>
              <Text style={cautionText}>
                alexpassalis.com will never email you and ask you to disclose or
                verify your password, credit card, or banking account number.
              </Text>
            </Section>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

const main = {
  backgroundColor: '#fff',
  color: '#212121',
}

const container = {
  padding: '20px',
  margin: '0 auto',
  backgroundColor: '#eee',
}

const h1 = {
  color: '#333',
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
  fontSize: '20px',
  fontWeight: 'bold',
  marginBottom: '15px',
}

const text = {
  color: '#333',
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
  fontSize: '14px',
  margin: '24px 0',
}

const coverSection = { backgroundColor: '#fff' }

const upperSection = { padding: '25px 35px' }

const lowerSection = { padding: '25px 35px' }

const codeText = {
  ...text,
  color: 'blue',
  fontWeight: 'bold',
  fontSize: '36px',
  margin: '10px 0',
  textAlign: 'center' as const,
}

const validityText = {
  ...text,
  margin: '0px',
  textAlign: 'center' as const,
}

const verificationSection = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}

const mainText = { ...text, marginBottom: '14px' }

const cautionText = { ...text, margin: '0px' }
