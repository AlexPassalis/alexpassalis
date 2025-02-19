export default async function ErrorPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const error = (await searchParams).error || 'unexpected error'

  return <h1>{error}</h1>
}
