import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://fapyqvwlxvbvjzhbezpz.supabase.co"
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZhcHlxdndseHZidmp6aGJlenB6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2NTM3NTM0OTQsImV4cCI6MTk2OTMyOTQ5NH0.JLJZt6X7mXD7KB8olU9muJ6Yl_LjCw_z4ci1ng73d28'
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export const appUrl = 'exp://exp.host/@earth_is_flat/tastiNUS'

export class Guest {
  static email = "tastinusguestacc@gmail.com"
  static password = '12345678'
  static id ='5fd28dbd-cbe0-4fce-b4bc-315200d747b9'
}