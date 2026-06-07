import { createClient, SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ''

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyClient = SupabaseClient<any>

let _supabase: AnyClient | null = null

function getClient(): AnyClient {
  if (!_supabase) {
    _supabase = createClient(supabaseUrl, supabaseAnonKey)
  }
  return _supabase
}

export const supabase: AnyClient = new Proxy({} as AnyClient, {
  get(_target, prop) {
    return getClient()[prop as keyof AnyClient]
  },
})

export function getServiceClient(): AnyClient {
  return createClient(supabaseUrl, process.env.SUPABASE_SERVICE_ROLE_KEY ?? '')
}
