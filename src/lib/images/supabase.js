import { createClient } from '@supabase/supabase-js'

// const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
// const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY
const supabaseUrl = 'https://gusgsxbzqbbcctrowvcj.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd1c2dzeGJ6cWJiY2N0cm93dmNqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkzNDkzNjksImV4cCI6MjA2NDkyNTM2OX0.v_DGfH7eTQQbMNJwO26Jng23UKoJt1OjIPVrQz10Llw'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)