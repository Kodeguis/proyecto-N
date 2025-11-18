import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://jqhkzlqezukxqumwrazm.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpxaGt6bHFlenVreHF1bXdyYXptIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM0OTE0MTcsImV4cCI6MjA3OTA2NzQxN30.pZl4te_a0D3E_0Tbri-aMoLwBKGaFK1tw0BCu926HyE'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)