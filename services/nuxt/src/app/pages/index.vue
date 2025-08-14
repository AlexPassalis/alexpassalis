<script setup lang="ts">
import { env } from '@/data/env'
import type { paths } from '@/lib/openapi/schema'

const { pending, error, data } = await useFetch<
  paths['/api/blogs/']['get']['responses']['200']['content']['application/json']
>(() => `${env.API_URL}/blogs/`, { default: () => [] })
</script>

<template>
  <pre v-if="pending">Fetching...</pre>
  <pre v-else-if="error">{{ error }}</pre>
  <pre v-else>{{ data[0] }}</pre>
</template>
