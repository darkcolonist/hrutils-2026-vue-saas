<template>
  <div class="p-8 max-w-4xl mx-auto">
    <h1 class="text-3xl font-bold mb-4">Home</h1>
    <p class="mb-4 text-gray-600 dark:text-gray-400">Welcome to the migrated HR Utils SPA.</p>
    <button @click="goToLogin" class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">Go to Login</button>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
const router = useRouter()
const goToLogin = () => {
  console.log('Navigating to login...')
  router.push('/login')
}
</script>
