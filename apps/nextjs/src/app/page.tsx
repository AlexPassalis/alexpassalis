import { authClient } from '@/lib/better-auth/index'
import { redirect } from 'next/navigation'
import { ROUTE_LOGIN } from '@/data/routes'

export default async function HomePage() {
  const { data: session } = await authClient.getSession()
  if (!session) {
    redirect(ROUTE_LOGIN)
  }

  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
      <div className="flex w-full items-center max-w-xs flex-col gap-4 p-4 text-center">
        <h1 className="p-4 text-white text-lg bg-blue-500 border border-black">
          You are logged in
        </h1>
      </div>
    </div>
  )
}
