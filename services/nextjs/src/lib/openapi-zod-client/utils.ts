import { endpoints } from '@/lib/openapi-zod-client/client'

type Endpoint = (typeof endpoints)[number]

type EndpointWithBody = Endpoint extends infer E
  ? E extends { parameters: readonly any[] }
    ? Extract<
        E['parameters'][number],
        { type: 'Body'; schema: any }
      > extends never
      ? never
      : E
    : never
  : never

export type PathWithBody = EndpointWithBody['path']
type MethodForPath<P extends PathWithBody> = Extract<
  EndpointWithBody,
  { path: P }
>['method']
type BodySchemaOf<P extends PathWithBody, M extends MethodForPath<P>> = Extract<
  Extract<EndpointWithBody, { path: P; method: M }>['parameters'][number],
  { type: 'Body' }
>['schema']

export function requestBodyZodSchema<
  P extends PathWithBody,
  M extends MethodForPath<P>,
>(path: P, method: M): BodySchemaOf<P, M> {
  const endpoint = (endpoints as readonly Endpoint[]).find(
    (endpoint) => endpoint.path === path && endpoint.method === method,
  )
  const parameter = (endpoint as any).parameters?.find(
    (parameter: any) => parameter?.type === 'Body' && parameter?.schema,
  )
  return parameter.schema as BodySchemaOf<P, M>
}
