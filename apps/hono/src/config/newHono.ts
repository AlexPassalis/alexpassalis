import { Hono } from 'hono'
import { apiBindings } from '@/data/types'

export default function newHono() {
  const app = new Hono<apiBindings>()
  return app
}

export type HonoInstance = ReturnType<typeof newHono>
