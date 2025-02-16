import { Hono } from 'hono'
import { apiBindings } from '@/data/types'

export default function newHono() {
  return new Hono<apiBindings>()
}
