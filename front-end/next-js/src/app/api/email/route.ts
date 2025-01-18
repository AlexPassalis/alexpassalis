import { NextResponse } from 'next/server'

type RequestBody = {
  email: string
}

export async function POST(req: Request) {
  const { email }: RequestBody = await req.json()
  console.log(email)

  return NextResponse.json({ json: { response: email } }, { status: 200 })
}
