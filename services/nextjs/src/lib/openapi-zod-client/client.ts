import { makeApi, Zodios, type ZodiosOptions } from '@zodios/core'
import { z } from 'zod'

const BlogRead = z
  .object({
    id: z.string().uuid(),
    slug: z.string().regex(/^[-a-zA-Z0-9_]+$/),
    author: z.number().int(),
    title: z.string().max(255),
    content: z.string(),
    created_at: z.string().datetime({ offset: true }),
    last_updated_at: z.string().datetime({ offset: true }),
  })
  .passthrough()
const BlogWrite = z
  .object({ title: z.string().max(255), content: z.string() })
  .passthrough()
const TokenObtainPair = z
  .object({
    username: z.string(),
    password: z.string(),
    access: z.string(),
    refresh: z.string(),
  })
  .passthrough()
const TokenRefresh = z
  .object({ access: z.string(), refresh: z.string() })
  .passthrough()
const UserWrite = z
  .object({
    first_name: z
      .string()
      .min(1)
      .max(32)
      .regex(/^[^\W\d_]+$/),
    last_name: z
      .string()
      .min(1)
      .max(32)
      .regex(/^[^\W\d_]+$/),
    username: z
      .string()
      .min(6)
      .max(16)
      .regex(/^[\w.@+-]+$/),
    email: z.string().max(254).email(),
    password: z.string().min(8).max(64),
  })
  .passthrough()
const UserRead = z
  .object({
    id: z.number().int(),
    username: z
      .string()
      .min(6)
      .max(16)
      .regex(/^[\w.@+-]+$/),
  })
  .passthrough()
const ValidationError = z
  .object({
    first_name: z.array(z.string()),
    last_name: z.array(z.string()),
    username: z.array(z.string()),
    email: z.array(z.string()),
    password: z.array(z.string()),
  })
  .partial()
  .passthrough()

export const schemas = {
  BlogRead,
  BlogWrite,
  TokenObtainPair,
  TokenRefresh,
  UserWrite,
  UserRead,
  ValidationError,
}

export const endpoints = makeApi([
  {
    method: 'get',
    path: '/api/blogs/',
    alias: 'blogs_list',
    description: `List public blogs.`,
    requestFormat: 'json',
    response: z.array(BlogRead),
  },
  {
    method: 'post',
    path: '/api/blogs/',
    alias: 'blogs_create',
    description: `Create a blog post.`,
    requestFormat: 'json',
    parameters: [
      {
        name: 'body',
        type: 'Body',
        schema: BlogWrite,
      },
    ],
    response: BlogRead,
    errors: [
      {
        status: 400,
        description: `Validation errors (field -&gt; list of errors).`,
        schema: z.object({}).partial().passthrough(),
      },
      {
        status: 401,
        description: `Not authenticated. Log in and try again.`,
        schema: z.void(),
      },
    ],
  },
  {
    method: 'post',
    path: '/api/token/',
    alias: 'token_create',
    description: `Takes a set of user credentials and returns an access and refresh JSON web
token pair to prove the authentication of those credentials.`,
    requestFormat: 'json',
    parameters: [
      {
        name: 'body',
        type: 'Body',
        schema: TokenObtainPair,
      },
    ],
    response: TokenObtainPair,
  },
  {
    method: 'post',
    path: '/api/token/refresh/',
    alias: 'token_refresh_create',
    description: `Takes a refresh type JSON web token and returns an access type JSON web
token if the refresh token is valid.`,
    requestFormat: 'json',
    parameters: [
      {
        name: 'body',
        type: 'Body',
        schema: TokenRefresh,
      },
    ],
    response: TokenRefresh,
  },
  {
    method: 'post',
    path: '/api/user/register/',
    alias: 'user_register_create',
    description: `Register a new user.`,
    requestFormat: 'json',
    parameters: [
      {
        name: 'body',
        type: 'Body',
        schema: UserWrite,
      },
    ],
    response: UserRead,
    errors: [
      {
        status: 400,
        description: `Validation errors: mapping from field to list of messages.`,
        schema: ValidationError,
      },
    ],
  },
])

export const api = new Zodios(endpoints)

export function createApiClient(baseUrl: string, options?: ZodiosOptions) {
  return new Zodios(baseUrl, endpoints, options)
}
