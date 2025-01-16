import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const email = await req.json()
  console.log(email)

  return NextResponse.json(null, { status: 200 })
}
