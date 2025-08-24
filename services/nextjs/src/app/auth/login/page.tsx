import classes from '@/data/css/AuthenticationImage.module.css'

import { Paper, Title } from '@mantine/core'
import { LoginForm } from '@/app/auth/login/LoginForm'

export default function LogInPage() {
  return (
    <main className={classes.wrapper}>
      <Paper className={classes.form}>
        <Title order={2} className={classes.title}>
          Welcome back!
        </Title>
        <LoginForm />
      </Paper>
    </main>
  )
}
