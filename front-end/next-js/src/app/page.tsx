'use client'

export default function HomePage() {
  return (
    <form
      className="flex flex-col gap-2 w-96 place-self-center mt-96"
      onSubmit={async e => {
        e.preventDefault()
        const formData = new FormData(e.currentTarget)
        const email = formData.get('email') as string

        try {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_BASE_URL}/api/email`,
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(email),
            }
          )
          if (!res.ok) {
            throw new Error('!ok')
          }
          console.log('success')
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
  )
}
