'use client'

import { useState } from 'react'

export default function HomePage() {
  const [responseEmail, setResponseEmail] = useState(
    'This is the where the response email will be displayed.'
  )

  return (
    <>
      <form
        className="flex flex-col gap-2 w-96 place-self-center mt-96"
        onSubmit={async e => {
          e.preventDefault()
          const formData = new FormData(e.currentTarget)
          const email = formData.get('email') as string

          try {
            const res = await fetch('/api/email', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ email }),
            })
            if (!res.ok) {
              throw new Error('!ok')
            }

            const { response }: ResponseBody = await res.json()
            setResponseEmail(response)
          } catch (error) {
            console.log(error)
          }
        }}
      >
        <label htmlFor="email" className="text-center">
          Email
        </label>
        <input
          name="email"
          type="email"
          className="border border-black text-center"
        />
        <button type="submit" className="border border-black">
          submit
        </button>
      </form>

      <h1>{responseEmail}</h1>
    </>
  )
}

type ResponseBody = {
  response: string
}
