'use client'

import { useMutation } from '@tanstack/react-query'

import axios, { AxiosError } from 'axios'
import env from '@/../../env'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import { Countdown } from '@/components/ui/countdown'

import { ComponentPropsWithoutRef } from 'react'
import { cn } from '@/lib/utils'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

import {
  emailInUse,
  emailCooldown,
  emailSuccess,
} from './../../../../data/zod/expected'

import {
  errorInvalidEmail,
  errorPostgres,
  errorRedis,
  errorSendingEmail,
} from './../../../../data/zod/error'

export default function SignUpFinalForm({
  token,
  exp,
  className,
  ...props
}: { token: string; exp: number } & ComponentPropsWithoutRef<'div'>) {
  const mutation = useMutation({
    mutationFn: async ({
      token,
      username,
    }: {
      token: string
      username: string
    }) => {
      const response = await axios.post(
        `${env.NEXT_PUBLIC_FASTIFY_ORIGIN}/auth/signup/email/final`,
        {
          token,
          username,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )
      return response.data
    },
    onSuccess: data => {
      const message = data?.message as
        | typeof emailInUse
        | typeof emailCooldown
        | typeof emailSuccess
      console.log(message)
    },
    onError: e => {
      if (e instanceof AxiosError) {
        const message = e.response?.data?.message as
          | typeof errorInvalidEmail
          | typeof errorPostgres
          | typeof errorRedis
          | typeof errorSendingEmail
        console.log(message)
      } else {
        console.error(e)
      }
    },
  })

  return mutation.isPending ? (
    <Progress value={66} />
  ) : (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Welcome Back</CardTitle>
          <CardDescription>
            Enter your username to set up your account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={async e => {
              e.preventDefault()
              const username = e.currentTarget.username.value
              mutation.mutate({ token, username })
            }}
          >
            <div className="grid gap-6">
              <div className="grid gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    type="text"
                    placeholder="username"
                    minLength={4}
                    maxLength={20}
                    required
                  />
                </div>
                <Button type="submit" className="w-full">
                  Sign up
                </Button>
              </div>
              <Countdown exp={exp} />
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
