import { LogInForm } from '@/app/auth/login/LogInForm'

interface LogInPageProps {
  searchParams: Promise<{ [key: string]: undefined | string }>
}

export default async function LogInPage({ searchParams }: LogInPageProps) {
  const searchParamsEmail = (await searchParams)['email']
  const searchParamsCountdownStart = (await searchParams)['countdownStart']

  return (
    <LogInForm
      searchParamsEmail={searchParamsEmail}
      searchParamsCountdownStart={searchParamsCountdownStart}
    />
  )
}
