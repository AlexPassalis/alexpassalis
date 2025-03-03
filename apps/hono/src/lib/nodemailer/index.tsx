import nodemailerInstance from 'nodemailer'
import React from 'react'
import { render } from '@react-email/components'
import EmailOTP from '@/lib/nodemailer/react-email/EmailOTP'

export function newNodemailer() {
  return nodemailerInstance
}

export type Nodemailer = ReturnType<typeof newNodemailer>

export function nodemailerTransporterBuildUp(
  nodemailer: Nodemailer,
  nodemailer_host: string,
  nodemailer_port: number,
  nodemailer_secure: boolean,
  nodemailer_auth_user: string,
  nodemailer_auth_pass: string
) {
  const transporter = nodemailer.createTransport({
    host: nodemailer_host,
    port: nodemailer_port,
    secure: nodemailer_secure,
    auth: {
      user: nodemailer_auth_user,
      pass: nodemailer_auth_pass,
    },
    tls: {
      ciphers: 'SSLv3',
      rejectUnauthorized: true,
    },
  })
  return transporter
}

export type Transporter = ReturnType<typeof nodemailerTransporterBuildUp>

export async function sendEmailOTP(
  otp: string,
  nodemailer_auth_user: string,
  email: string,
  transporter: Transporter
) {
  const emailHtml = await render(<EmailOTP otp={otp} />)
  const options = {
    from: nodemailer_auth_user,
    to: email,
    subject: 'alexpassalis.com',
    text: 'This is the text field',
    html: emailHtml,
  }
  const info = await transporter.sendMail(options)
  return info
}

export type Info = Awaited<ReturnType<typeof sendEmailOTP>>
