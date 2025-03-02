'use client'

import {
  Card,
  CardHeader,
  CardDescription,
  CardContent,
} from '@/components/ui/card'
import { ROUTE_LOGIN } from '@/data/routes'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export function Countdown({ countdownStart }: { countdownStart: number }) {
  const router = useRouter()
  const expiresIn = 300
  const expired = countdownStart + 300
  const [secondsLeft, setSecondsLeft] = useState<number>(expiresIn)

  useEffect(() => {
    setSecondsLeft(expired - Math.floor(Date.now() / 1000))
    const countdown = setInterval(() => {
      setSecondsLeft(expired - Math.floor(Date.now() / 1000))
    }, 1000)
    return () => clearInterval(countdown)
  }, [expired])

  useEffect(() => {
    if (secondsLeft !== null && secondsLeft <= 0) {
      router.push(`${ROUTE_LOGIN}?message=otp-expired`)
    }
  }, [secondsLeft, router])

  return (
    <Card>
      <CardHeader>
        <CardDescription className="text-center">
          The OTP will be invalidated in
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
