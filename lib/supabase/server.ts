import { createClient } from '@supabase/supabase-js'

/** Cliente con anon key para Server Components y Route Handlers. */
export function getServerClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
