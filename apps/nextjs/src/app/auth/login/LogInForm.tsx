'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

import { ROUTE_SIGNUP, ROUTE_LOGIN, ROUTE_HOME } from '@/data/routes'
import { typeEmail, typeOTP } from '@/data/zod/type'

import { ComponentPropsWithoutRef, useEffect, useMemo, useState } from 'react'
import { cn } from '@/lib/shadcn-ui/index'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

import { errorInvalidEmail } from '@/data/zod/error'
import { authClient } from '@/lib/better-auth'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Countdown } from '@/components/ui/countdown'

interface LogInProps extends ComponentPropsWithoutRef<'div'> {
  searchParamsEmail: undefined | string
  searchParamsCountdownStart: undefined | string
}

export function LogInForm({
  searchParamsEmail,
  searchParamsCountdownStart,
  className,
  ...props
}: LogInProps) {
  const router = useRouter()
  const [, setOnRequest] = useState(false)
  const [email, setEmail] = useState<undefined | string>(searchParamsEmail)
  const [countdownStart, setCountdownStart] = useState<undefined | number>(
    Number(searchParamsCountdownStart)
  )
  const otpSent = useMemo(
    () => !!(email && countdownStart),
    [email, countdownStart]
  )

  useEffect(() => {
    setEmail(searchParamsEmail)
    setCountdownStart(Number(searchParamsCountdownStart))
  }, [searchParamsEmail, searchParamsCountdownStart])

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card>
        {otpSent ? (
          <>
            <CardHeader className="text-center">
              <CardTitle className="text-xl">Email OTP</CardTitle>
              <CardDescription>
                Enter your One Time Password to log in
              </CardDescription>
            </CardHeader>
            <CardContent>
              <>
                <div className="grid gap-6">
                  <div className="grid gap-6">
                    <div className="grid gap-2">
                      <form
                        onSubmit={async e => {
                          e.preventDefault()
                          const otpSubmitted = e.currentTarget.otp.value

                          const { data: emailValidated } =
                            typeEmail.safeParse(email)
                          if (!emailValidated) {
                            console.error(errorInvalidEmail)
                            return
                          }

                          const { data: otpValidated } =
                            typeOTP.safeParse(otpSubmitted)
                          if (!otpValidated) {
                            console.error(otpValidated)
                            return
                          }

                          await authClient.signIn.emailOtp(
                            {
                              email: emailValidated,
                              otp: otpValidated,
                            },
                            {
                              onRequest: () => {
                                setOnRequest(true)
                              },
                              onError: response => {
                                setOnRequest(false)
                                console.error(response)
                              },
                              onSuccess: () => {
                                setOnRequest(false)
                                router.push(ROUTE_HOME)
                              },
                            }
                          )
                        }}
                      >
                        <div className="grid gap-6">
                          <div className="grid gap-6">
                            <div className="grid gap-2">
                              <Label htmlFor="otp">OTP</Label>
                              <Input
                                id="otp"
                                type="number"
                                maxLength={6}
                                placeholder="123456"
                                required
                              />
                            </div>
                            <Button type="submit" className="w-full">
                              Log in
                            </Button>
                            <Countdown countdownStart={countdownStart!} />
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </>
            </CardContent>
          </>
        ) : (
          <>
            <CardHeader className="text-center">
              <CardTitle className="text-xl">Welcome Back</CardTitle>
              <CardDescription>Log in with your Google account</CardDescription>
            </CardHeader>
            <CardContent>
              <>
                <div className="grid gap-6">
                  <div className="flex flex-col gap-4">
                    <Button
                      onClick={async () => {
                        await authClient.signIn.social({ provider: 'google' })
                      }}
                      variant="outline"
                      className="w-full"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                      >
                        <path
                          d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                          fill="currentColor"
                        />
                      </svg>
                      Log in with Google
                    </Button>
                  </div>
                  <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
                    <span className="relative z-10 bg-background px-2 text-muted-foreground">
                      Or with
                    </span>
                  </div>
                  <div className="grid gap-6">
                    <div className="grid gap-2">
                      <form
                        onSubmit={async e => {
                          e.preventDefault()
                          const emailSubmitted = e.currentTarget.email.value

                          const { data: emailValidated } =
                            typeEmail.safeParse(emailSubmitted)
                          if (!emailValidated) {
                            console.error(errorInvalidEmail)
                            return
                          }

                          await authClient.emailOtp.sendVerificationOtp(
                            {
                              email: emailValidated,
                              type: 'sign-in',
                            },
                            {
                              onRequest: () => {
                                setOnRequest(true)
                              },
                              onError: response => {
                                setOnRequest(false)
                                console.error(response)
                              },
                              onSuccess: () => {
                                setOnRequest(false)
                                router.push(
                                  `${ROUTE_LOGIN}?email=${emailValidated}&countdownStart=${Math.floor(
                                    Date.now() / 1000
                                  )}`,
                                  { scroll: false }
                                )
                              },
                            }
                          )
                        }}
                      >
                        <div className="grid gap-6">
                          <div className="grid gap-6">
                            <div className="grid gap-2">
                              <Label htmlFor="email">Email</Label>
                              <Input
                                id="email"
                                type="email"
                                placeholder="m@example.com"
                                required
                              />
                            </div>
                            <Button type="submit" className="w-full">
                              Log in
                            </Button>
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>
                  <div className="text-center text-sm">
                    Don&apos;t have an account?{' '}
                    <Link
                      href={ROUTE_SIGNUP}
                      className="underline underline-offset-4"
                    >
                      Sign up
                    </Link>
                  </div>
                </div>
              </>
            </CardContent>
          </>
        )}
      </Card>
      {/* <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-primary  ">
  By clicking continue, you agree to our <a href="#">Terms of Service</a>{' '}
  and <a href="#">Privacy Policy</a>.
  </div> */}
    </div>
  )
}
