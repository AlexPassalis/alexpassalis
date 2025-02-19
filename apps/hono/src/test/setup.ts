import {
  PostgreSqlContainer,
  StartedPostgreSqlContainer,
} from '@testcontainers/postgresql'
import { RedisContainer, StartedRedisContainer } from '@testcontainers/redis'
import { beforeEach, afterAll, beforeAll } from 'vitest'
import path from 'path'
import { Postgres, PostgresPool, postgresTearDown } from '@/lib/postgres/index'
import { migrate } from 'drizzle-orm/node-postgres/migrator'
import Redis from 'ioredis'
import { redisTeardown } from '@/lib/redis/index'
import { sql } from 'drizzle-orm'
import { serverBuildUp } from '@/server'
import { newNodemailer, Nodemailer, Transporter } from '@/lib/nodemailer'
import appBuildUp from '@/app'
import { HonoInstance } from '@/config/newHono'

let postgresContainerTest: StartedPostgreSqlContainer
let postgresPoolTest: PostgresPool
let postgresTest: Postgres

let redisContainerTest: StartedRedisContainer
let redisTest: Redis

let nodemailerTest: Nodemailer
let transporterTest: Transporter

let apiTest: HonoInstance

const timeout = 30_000

if (process.env.NODE_ENV !== 'test') {
  throw new Error('NODE_ENV must be "test"')
}

beforeAll(async () => {
  postgresContainerTest = await new PostgreSqlContainer().start()
  redisContainerTest = await new RedisContainer().start()
  nodemailerTest = newNodemailer()
  const nodemailerAccountTest = await nodemailerTest.createTestAccount()

  const server = serverBuildUp(
    postgresContainerTest.getConnectionUri(),
    false,
    redisContainerTest.getHost(),
    redisContainerTest.getPort(),
    redisContainerTest.getPassword(),
    nodemailerAccountTest.smtp.host,
    nodemailerAccountTest.smtp.port,
    nodemailerAccountTest.smtp.secure,
    nodemailerAccountTest.user,
    nodemailerAccountTest.pass
  )

  postgresPoolTest = server.postgresPool
  postgresTest = server.postgres
  redisTest = server.redis

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

  apiTest = await appBuildUp(
    postgresTest,
    redisTest,
    nodemailerAccountTest.user,
    server.transporter
  )
}, timeout)

beforeEach(async () => {
  await postgresTest.execute(sql`
    TRUNCATE TABLE auth.user CASCADE;
    TRUNCATE TABLE auth.session CASCADE;
    TRUNCATE TABLE auth.account CASCADE;
    TRUNCATE TABLE auth.verification CASCADE;
  `)
  await redisTest.flushall()
})

afterAll(async () => {
  await postgresTearDown(postgresPoolTest)
  await postgresContainerTest?.stop()
  await redisTeardown(redisTest)
  await redisContainerTest?.stop()
}, timeout)

export { apiTest, postgresTest, redisTest, transporterTest, nodemailerTest }
