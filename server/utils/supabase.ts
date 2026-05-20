import { createClient } from '@supabase/supabase-js'

export function useSupabaseAdmin() {
  const config = useRuntimeConfig()
  return createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  )
}
