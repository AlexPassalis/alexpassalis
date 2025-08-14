<script setup lang="ts">
import { reactive } from 'vue'
import { env } from '@/data/env'

const form = reactive({
  username: '',
  password: '',
})

async function onSubmit() {
  await $fetch(`${env.API_URL}/user/register/`, { method: 'POST', body: form })
}
</script>

<template>
  <main class="flex justify-center h-screen items-center">
    <form
      @submit.prevent="onSubmit"
      class="flex flex-col p-4 border border-black"
    >
      <label for="username" class="mb-1">Username</label>
      <input
        v-model="form.username"
        id="username"
        type="username"
        autocomplete="username"
        required
        class="p-1 border border-black mb-2"
      />
      <label for="password" class="mb-1">Password</label>
      <input
        v-model="form.password"
        id="password"
        type="password"
        autocomplete="current-password"
        required
        class="p-1 border border-black mb-2"
      />
      <button type="submit" class="p-1 border border-black rounded-lg mt-2">
        Submit
      </button>
    </form>
  </main>
</template>
