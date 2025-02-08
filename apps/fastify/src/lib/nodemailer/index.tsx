import React from 'react'
import { render } from '@react-email/components'
import nodemailer from 'nodemailer'
import env from './../../../env'
import EmailVerification from './react_email/EmailVerification'

const transporter = nodemailer.createTransport({
  host: env.NODEMAILER_HOST,
  port: env.NODEMAILER_PORT,
  secure: env.NODEMAILER_SECURE,
  auth: {
    user: env.NODEMAILER_AUTH_USER,
    pass: env.NODEMAILER_AUTH_PASS,
  },
})

export async function sendVeficationEmail(token: string, email: string) {
  const emailHtml = await render(<EmailVerification token={token} />)
  const options = {
    from: env.NODEMAILER_AUTH_USER,
    to: email,
    subject: 'alexpassalis.com',
    html: emailHtml,
  }
  await transporter.sendMail(options)
}
