import { defineStore } from 'pinia'
import { ref } from 'vue'
import { supabase } from '../utils/supabase'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const session = ref(null)
  const loading = ref(true)

  async function initialize() {
    loading.value = true
    const { data } = await supabase.auth.getSession()
    session.value = data.session
    user.value = data.session?.user || null
    loading.value = false

    supabase.auth.onAuthStateChange((_event, _session) => {
      session.value = _session
      user.value = _session?.user || null
    })
  }

  return { user, session, loading, initialize }
})
