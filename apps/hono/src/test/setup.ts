import {
  PostgreSqlContainer,
  StartedPostgreSqlContainer,
} from '@testcontainers/postgresql'
import { RedisContainer, StartedRedisContainer } from '@testcontainers/redis'
import { beforeEach, afterAll, beforeAll, expect } from 'vitest'
import path from 'path'
import { Postgres } from '@/lib/postgres/index'
import { migrate } from 'drizzle-orm/node-postgres/migrator'
import Redis from 'ioredis'
import { sql } from 'drizzle-orm'
import { Server, serverBuildUp } from '@/server'
import { EmailInfo, newNodemailer, Nodemailer } from '@/lib/nodemailer'
import env from '@/env'
import { HonoInstance } from '@/config/newHono'
import { account, session, user, verification } from '@/api/auth/auth.schema'

let postgresContainerTest: StartedPostgreSqlContainer
let postgresTest: Postgres

let redisContainerTest: StartedRedisContainer
let redisTest: Redis

let nodemailerTest: Nodemailer
let emailInfoTest: undefined | EmailInfo

let apiTest: HonoInstance

let serverTest: Server

const timeout = 60_000

if (process.env.NODE_ENV !== 'test') {
  console.error('NODE_ENV must be "test"')
  process.exit(1)
}

beforeAll(async () => {
  // creates a new server instance between each test file, which might not be optimal
  postgresContainerTest = await new PostgreSqlContainer().start()
  redisContainerTest = await new RedisContainer().start()
  nodemailerTest = newNodemailer()
  const nodemailerAccountTest = await nodemailerTest.createTestAccount()

  const server = await serverBuildUp(
    postgresContainerTest.getConnectionUri(),
    false,
    redisContainerTest.getHost(),
    redisContainerTest.getPort(),
    redisContainerTest.getPassword(),
    nodemailerTest,
    nodemailerAccountTest.smtp.host,
    nodemailerAccountTest.smtp.port,
    nodemailerAccountTest.smtp.secure,
    nodemailerAccountTest.user,
    nodemailerAccountTest.pass,
    env.HOSTNAME,
    env.PORT
  )

  postgresTest = server.postgres
  redisTest = server.redis
  emailInfoTest = server.emailInfo
  apiTest = server.api
  serverTest = server.server

  const migrationsFolder = path.join(
    process.cwd(),
    'src',
    'lib',
    'postgres',
    'migrations'
  )
  await migrate(postgresTest, {
    migrationsFolder,
  })
}, timeout)

async function postgresEmptyCheck() {
  expect((await postgresTest.select().from(user)).length).toBe(0)
  expect((await postgresTest.select().from(session)).length).toBe(0)
  expect((await postgresTest.select().from(account)).length).toBe(0)
  expect((await postgresTest.select().from(verification)).length).toBe(0)
}

beforeEach(async () => {
  await postgresTest.execute(sql`
    TRUNCATE TABLE auth.user CASCADE;
    TRUNCATE TABLE auth.session CASCADE;
    TRUNCATE TABLE auth.account CASCADE;
    TRUNCATE TABLE auth.verification CASCADE;
  `)
  await postgresEmptyCheck()
  await redisTest.flushall()
})

afterAll(async () => {
  await new Promise<void>((resolve, reject) => {
    serverTest.close(err => {
      if (err) return reject(err)
      resolve()
    })
  })
  await postgresContainerTest?.stop()
  await redisContainerTest?.stop()
}, timeout)

export { postgresTest, redisTest, apiTest, nodemailerTest, emailInfoTest }
