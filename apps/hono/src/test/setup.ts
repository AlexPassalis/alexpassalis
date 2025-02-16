import {
  PostgreSqlContainer,
  StartedPostgreSqlContainer,
} from '@testcontainers/postgresql'
import { RedisContainer, StartedRedisContainer } from '@testcontainers/redis'
import { beforeEach, afterAll, beforeAll } from 'vitest'
import path from 'path'
import {
  Postgres,
  PostgresPool,
  postgresBuildUp,
  postgresTearDown,
} from '@/lib/postgres/index'
import { migrate } from 'drizzle-orm/node-postgres/migrator'
import Redis from 'ioredis'
import { redisBuildUp, redisTeardown } from '@/lib/redis/index'
import { sql } from 'drizzle-orm'

let postgresContainer: StartedPostgreSqlContainer
let postgresPool: PostgresPool
let postgres: Postgres

let redisContainer: StartedRedisContainer
let redis: Redis

const timeout = 30_000

beforeAll(async () => {
  postgresContainer = await new PostgreSqlContainer().start()
  const postgresBuild = postgresBuildUp(
    postgresContainer.getConnectionUri(),
    false
  )
  postgresPool = postgresBuild.postgresPool
  postgres = postgresBuild.postgres

  const migrationsFolder = path.join(
    process.cwd(),
    'src',
    'lib',
    'postgres',
    'migrations'
  )
  await migrate(postgres, {
    migrationsFolder,
  })

  redisContainer = await new RedisContainer().start()
  redis = redisBuildUp(
    redisContainer.getHost(),
    redisContainer.getPort(),
    redisContainer.getPassword()
  )
}, timeout)

beforeEach(async () => {
  await postgres.execute(sql`
    TRUNCATE TABLE auth.users CASCADE;
  `)
  await redis.flushall()
})

afterAll(async () => {
  await postgresTearDown(postgresPool)
  await postgresContainer?.stop()
  await redisTeardown(redis)
  await redisContainer?.stop()
}, timeout)

export { postgres, redis }
