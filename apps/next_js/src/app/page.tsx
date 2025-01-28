'use client'

import { tsr } from '@/lib/tsr'

export default function HomePage() {
  const tsrQueryClient = tsr.useQueryClient()

  const { data, isLoading } = tsr.users.get.useQuery({
    queryKey: ['users'],
  })

  const { mutate } = tsr.user.create.useMutation({
    onMutate: async newUser => {
      const currentUsers = tsrQueryClient.users.get.getQueryData(['users'])

      tsrQueryClient.users.get.setQueryData(['users'], old => {
        const previousData = old || {
          status: 200,
          body: [],
          headers: new Headers(),
        }

        return {
          ...previousData,
          body: [
            ...previousData.body,
            {
              ...newUser.body,
              uid: 'Loading ...',
            },
          ],
        }
      })

      return { currentUsers }
    },
    onError: (error, newUser, context) => {
      if (context?.currentUsers) {
        tsrQueryClient.users.get.setQueryData(['users'], context.currentUsers)
      }
    },
    onSettled: () => {
      tsrQueryClient.invalidateQueries({ queryKey: ['users'] })
    },
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="border border-black p-4 bg-white">
          <h1 className="font-bold">Loading ...</h1>
        </div>
      </div>
    )
  }

  if (data) {
    return (
      <div className="flex flex-col gap-10 items-center justify-center h-screen">
        <form
          onSubmit={e => {
            e.preventDefault()
            const formData = new FormData(e.currentTarget)
            const email = formData.get('email') as string
            const username = formData.get('username') as string

            mutate({ body: { email, username } })
          }}
          className="flex flex-col w-60 border border-black p-4 bg-white"
        >
          <label htmlFor="email">Email</label>
          <input
            name="email"
            type="email"
            className="border border-black text-center mb-2"
          />

          <label htmlFor="username">Username</label>
          <input
            name="username"
            type="text"
            minLength={6}
            maxLength={12}
            className="border border-black text-center mb-2"
          />

          <button
            type="submit"
            className="border border-black self-center w-1/2 mt-2 bg-orange-500 hover:bg-green-500"
          >
            Submit
          </button>
        </form>

        <div className="inline-flex gap-4 border border-black p-4 bg-white overflow-y-auto max-h-[50vh] w-11/12">
          <div className="flex-1">
            <h1 className="text-center font-bold mb-2">UID</h1>
            <div className="flex flex-col gap-2">
              {data.body.map((user, index) => {
                return (
                  <span
                    key={index}
                    className="text-center text-xs sm:text-sm md:text-md lg:text-lg"
                  >
                    {user.uid}
                  </span>
                )
              })}
            </div>
          </div>
          <div className="flex-1">
            <h1 className="justify-self-center font-bold mb-2">Email</h1>
            <div className="flex flex-col gap-2">
              {data.body.map((user, index) => {
                return (
                  <span
                    key={index}
                    className="text-center text-xs sm:text-sm md:text-md lg:text-lg"
                  >
                    {user.email}
                  </span>
                )
              })}
            </div>
          </div>
          <div className="flex-1">
            <h1 className="justify-self-center font-bold mb-2">Username</h1>
            <div className="flex flex-col gap-2">
              {data.body.map((user, index) => {
                return (
                  <span
                    key={index}
                    className="text-center text-xs sm:text-sm md:text-md lg:text-lg"
                  >
                    {user.username}
                  </span>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="border border-black p-4 bg-white">
        <h1 className="font-bold">Error</h1>
      </div>
    </div>
  )
}
