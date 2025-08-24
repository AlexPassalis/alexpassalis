'use client'

import { useForm } from '@mantine/form'
import { zod4Resolver } from 'mantine-form-zod-resolver'
import { requestBodyZodSchema } from '@/lib/openapi-zod-client/utils'

import { Button, PasswordInput, TextInput, Text, Anchor } from '@mantine/core'
import Link from 'next/link'
import { fetchClient } from '@/lib/openapi-fetch/client'
import { redirect } from 'next/navigation'

export function RegisterForm() {
  const zodSchema = requestBodyZodSchema('/api/user/register/', 'post')
  const form = useForm({
    mode: 'uncontrolled',
    initialValues: {
      first_name: '',
      last_name: '',
      username: '',
      email: '',
      password: '',
    },
    validate: zod4Resolver(zodSchema),
  })

  return (
    <form
      onSubmit={form.onSubmit(async (formValues) => {
        console.log(formValues)

        const { error, data } = await fetchClient.POST('/api/user/register/', {
          body: formValues,
        })

        if (error) {
          if (error?.first_name) {
            form.setFieldError('first_name', error.first_name)
          }
          if (error?.last_name) {
            form.setFieldError('last_name', error.last_name)
          }
          if (error?.username) {
            form.setFieldError('username', error.username)
          }
          if (error?.email) {
            form.setFieldError('email', error.email)
          }
          if (error?.password) {
            form.setFieldError(
              'password',
              <>
                {error.password.map((message, index) => (
                  <li key={index}>{message}</li>
                ))}
              </>,
            )
          }
        } else {
          console.log(data)
        }
      })}
      className="flex flex-col gap-4"
    >
      <TextInput
        label="First Name"
        placeholder="Your first name"
        size="md"
        radius="md"
        autoComplete="name"
        key={form.key('first_name')}
        {...form.getInputProps('first_name')}
      />
      <TextInput
        label="Last Name"
        placeholder="Your last name"
        size="md"
        radius="md"
        autoComplete="family-name"
        key={form.key('last_name')}
        {...form.getInputProps('last_name')}
      />
      <TextInput
        label="Username"
        placeholder="Your username"
        size="md"
        radius="md"
        autoComplete="username"
        key={form.key('username')}
        {...form.getInputProps('username')}
      />
      <TextInput
        label="Email"
        placeholder="email@domain.com"
        size="md"
        radius="md"
        autoComplete="email"
        key={form.key('email')}
        {...form.getInputProps('email')}
      />
      <PasswordInput
        label="Password"
        placeholder="Your password"
        size="md"
        radius="md"
        autoComplete="new-password"
        key={form.key('password')}
        {...form.getInputProps('password')}
        styles={{
          error: {
            lineHeight: 1.5,
          },
        }}
      />
      <Button type="submit" fullWidth mt="lg" size="md" radius="md">
        Register
      </Button>
      <Text ta="center" mt="md">
        Already have an account?{' '}
        <Anchor
          component={Link}
          href="/auth/login"
          target="_blank"
          fw={500}
          prefetch
        >
          Login
        </Anchor>
      </Text>
    </form>
  )
}
