import { redirect } from 'next/navigation'
import { fetchServer } from '@/lib/openapi-fetch/server'
import { Form } from '@/app/blogs/Form'

export default async function BlogsPage() {
  let blogs
  try {
    const { error, data } = await fetchServer.GET('/api/blogs/')
    if (error) {
      console.error(error)
      redirect('/error')
    }

    blogs = data
  } catch (err) {
    console.error(err)
    redirect('/error')
  }

  console.log(blogs)

  return (
    <main>
      <Form />
    </main>
  )
}
