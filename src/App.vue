<template>
  <!-- Environment Configuration Warning -->
  <div v-if="!isConfigured" class="bg-red-600 text-white p-4 text-center font-bold shadow-lg sticky top-0 z-50">
    ⚠️ Configuration Error: Missing Supabase Environment Variables
    <div class="text-xs font-normal mt-1 opacity-90">
      Please check your .env.local file. Missing: {{ missingVars.join(', ') }}
    </div>
  </div>

  <nav class="p-4 bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
    <div class="flex gap-4">
      <router-link to="/" class="hover:text-blue-600 transition-colors">Home</router-link>
    </div>
    <div class="flex items-center gap-4">
      <span v-if="user" class="text-sm text-gray-500">{{ user.email }}</span>
      <router-link v-if="!user" to="/login" class="hover:text-blue-600 transition-colors border-2 border-blue-600 px-4 py-1 rounded-lg">Login</router-link>
      <button v-else @click="handleLogout" class="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded-lg transition-colors text-sm font-medium">
        Logout
      </button>
    </div>
  </nav>

  <router-view></router-view>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from './utils/supabase'

const router = useRouter()
const user = ref(null)

const handleLogout = async () => {
  await supabase.auth.signOut()
  user.value = null
  router.push('/login')
}

const isConfigured = computed(() => {
  const url = import.meta.env.VITE_SUPABASE_URL
  const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY
  return url && url !== 'YOUR_SUPABASE_URL' && key && key !== 'YOUR_SUPABASE_PUBLISHABLE_KEY'
})

const missingVars = computed(() => {
  const missing = []
  if (!import.meta.env.VITE_SUPABASE_URL || import.meta.env.VITE_SUPABASE_URL === 'YOUR_SUPABASE_URL') missing.push('VITE_SUPABASE_URL')
  if (!import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY === 'YOUR_SUPABASE_PUBLISHABLE_KEY') missing.push('VITE_SUPABASE_PUBLISHABLE_KEY')
  return missing
})

onMounted(async () => {
  const { data: { session } } = await supabase.auth.getSession()
  user.value = session?.user || null

  supabase.auth.onAuthStateChange((event, session) => {
    user.value = session?.user || null
  })
})
</script>
