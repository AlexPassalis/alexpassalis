'use client'

import { signUp } from './../../lib/auth-client'

export default function SignUpPage() {
  return (
    <form
      onSubmit={async e => {
        e.preventDefault()

        const formData = new FormData(e.currentTarget)

        const email = formData.get('email')
        const password = formData.get('password')
        const name = formData.get('name')

        if (
          typeof email !== 'string' ||
          typeof password !== 'string' ||
          typeof name !== 'string'
        ) {
          return
        }

        console.log(email)
        console.log(password)
        console.log(name)

        await signUp.email({ email, password, name })

        console.log(data)
        console.log(error)
      }}
      className="flex flex-col items-center justify-center h-screen"
    >
      <label htmlFor="email">email</label>
      <input name="email" type="email" />
      <label htmlFor="password">password</label>
      <input name="password" type="text" />
      <label htmlFor="name">name</label>
      <input name="name" type="text" />
      <button type="submit">submit</button>
    </form>
  )
}
