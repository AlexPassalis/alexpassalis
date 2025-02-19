'use client'

import {
  Card,
  CardHeader,
  CardDescription,
  CardContent,
} from '@/components/ui/card'
import { ROUTE_SIGNUP } from '@/data/routes'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export function Countdown({ exp }: { exp: number }) {
  const router = useRouter()
  const [secondsLeft, setSecondsLeft] = useState<null | number>(null)

  useEffect(() => {
    setSecondsLeft(exp - Math.floor(Date.now() / 1000))
    const countdown = setInterval(() => {
      setSecondsLeft(exp - Math.floor(Date.now() / 1000))
    }, 1000)
    return () => clearInterval(countdown)
  }, [exp])

  useEffect(() => {
    if (secondsLeft !== null && secondsLeft <= 0) {
      router.push(`${ROUTE_SIGNUP}?message=token-expired`)
    }
  }, [secondsLeft, router])

  return (
    <Card>
      <CardHeader>
        <CardDescription className="text-center">
          The token will be invalidated in
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center space-y-4">
        <div className="text-4xl font-bold leading-none">
          {String(Math.floor((secondsLeft || 0) / 60)).padStart(2, '0')}:
          {String((secondsLeft || 0) % 60).padStart(2, '0')}
        </div>
      </CardContent>
    </Card>
  )
}
