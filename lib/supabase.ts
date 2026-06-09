/* eslint-disable @typescript-eslint/no-explicit-any */
// Re-exports para compatibilidad. Preferir lib/supabase/* en código nuevo.
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? 'https://placeholder.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? 'placeholder'

export const supabase = createClient<any>(supabaseUrl, supabaseAnonKey)

export { getServiceClient } from './supabase/service'
