'use client'

import { authClient } from '@/lib/better-auth/index'
import { useRouter } from 'next/navigation'
import { ROUTE_LOGIN } from '@/data/routes'
import { useEffect, useState } from 'react'
import { User } from '@/data/zod/type'

export default function HomePage() {
  const router = useRouter()
  const [onRequest, setOnRequest] = useState(true)
  const [user, setUser] = useState<User | null>(null)
  useEffect(() => {
    async function getSession() {
      try {
        const { data } = await authClient.getSession()
        if (!data) {
          router.push(ROUTE_LOGIN)
        }
        setOnRequest(false)
        setUser(data!.user)
      } catch (e) {
        setOnRequest(false)
        console.log(e)
      }
    }
    getSession()
  }, [router])

  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
      <div className="flex w-full items-center max-w-xs flex-col gap-4 p-4 text-center">
        <h1 className="p-4 text-white text-lg bg-blue-500 border border-black">
          {onRequest ? 'Loading ...' : `Welcome back ${user!.name}.`}
        </h1>
      </div>
    </div>
  )
}
