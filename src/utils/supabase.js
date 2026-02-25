import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY

// Provide a dummy client if config is missing to prevent total app crash
const isConfigured = supabaseUrl && supabaseUrl.startsWith('http')

export const supabase = isConfigured 
  ? createClient(supabaseUrl, supabaseKey) 
  : { 
      auth: { 
        signInWithOtp: async () => ({ error: { message: 'Supabase URL not configured' } }),
        signInWithOAuth: async () => ({ error: { message: 'Supabase URL not configured' } }),
        getSession: async () => ({ data: { session: null }, error: null }),
        onAuthStateChange: (cb) => {
          setTimeout(() => cb('INITIAL_CHECK', null), 0)
          return { data: { subscription: { unsubscribe: () => {} } } }
        }
      }, 
      from: () => ({ 
        select: () => ({ 
          in: () => ({}), 
          eq: () => ({}),
          single: () => ({})
        }),
        single: () => ({})
      }) 
    }
