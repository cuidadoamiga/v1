/* eslint-disable @typescript-eslint/no-explicit-any */
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? 'https://placeholder.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? 'placeholder'

export const supabase = createClient<any>(supabaseUrl, supabaseAnonKey)

export function getServiceClient() {
  return createClient<any>(supabaseUrl, process.env.SUPABASE_SERVICE_ROLE_KEY ?? 'placeholder')
}
