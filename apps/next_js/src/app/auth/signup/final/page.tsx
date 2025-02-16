import { z } from 'zod'
import { redirect } from 'next/navigation'

import jwt from 'jsonwebtoken'

import SignUpFinalForm from './SignUpFinalForm'
import { ROUTE_ERROR, ROUTE_SIGNUP } from '@/data/routes'
import { typeEmail } from '@/data/zod/type'

export default async function SignUpFinalPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>
}) {
  const token = (await searchParams).token as string

  let payload
  try {
    payload = jwt.decode(token) as { email: string; iat: number; exp: number }
    console.log(payload)
    typeEmail.parse(payload.email)
    z.number().parse(payload.exp)
  } catch {
    redirect(`${ROUTE_ERROR}?error=token-invalid`)
  }

  if (Math.floor(Date.now() / 1000) > payload.exp) {
    redirect(`${ROUTE_SIGNUP}?message=token-expired`)
  }

  return <SignUpFinalForm token={token} exp={payload.exp} />
}
