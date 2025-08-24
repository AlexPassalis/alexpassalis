'use client'

import { useForm } from '@mantine/form'
import { zodResolver } from 'mantine-form-zod-resolver'
import { requestBodyZodSchema } from '@/lib/openapi-zod-client/utils'
import { fetchClient } from '@/lib/openapi-fetch/client'

export function Form() {
  const zodSchema = requestBodyZodSchema('/api/blogs/', 'post')

  const form = useForm({
    mode: 'uncontrolled',
    initialValues: {
      title: '',
      content: '',
    },
    validate: zodResolver(zodSchema),
  })

  return (
    <form
      onSubmit={form.onSubmit(async (values) => {
        console.log(values)

        const { error, data } = await fetchClient.POST('/api/blogs/', {
          body: values,
        })
        if (error) {
          console.error(error)
        }
      })}
    ></form>
  )
}
