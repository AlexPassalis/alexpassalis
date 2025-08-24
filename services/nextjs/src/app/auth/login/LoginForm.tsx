'use client'

import { useForm } from '@mantine/form'
import { zodResolver } from 'mantine-form-zod-resolver'
import {
  Button,
  Checkbox,
  PasswordInput,
  TextInput,
  Text,
  Anchor,
} from '@mantine/core'
import Link from 'next/link'

export function LoginForm() {
  const form = useForm({
    mode: 'uncontrolled',
    initialValues: { email: '', password: '' },
    validate: zodResolver(),
  })

  return (
    <form onSubmit={form.onSubmit(async (values) => {})}>
      <TextInput
        label="Email address"
        placeholder="hello@gmail.com"
        size="md"
        radius="md"
      />
      <PasswordInput
        label="Password"
        placeholder="Your password"
        mt="md"
        size="md"
        radius="md"
      />
      <Checkbox label="Keep me logged in" mt="xl" size="md" />
      <Button type="submit" fullWidth mt="xl" size="md" radius="md">
        Login
      </Button>

      <Text ta="center" mt="md">
        Don&apos;t have an account?{' '}
        <Anchor
          component={Link}
          href="/auth/register"
          target="_blank"
          fw={500}
          prefetch
        >
          Register
        </Anchor>
      </Text>
    </form>
  )
}
