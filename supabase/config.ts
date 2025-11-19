import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://jqhkzlqezukxqumwrazm.supabase.co'
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpxaGt6bHFlenVreHF1bXdyYXptIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MzQ5MTQxNywiZXhwIjoyMDc5MDY3NDE3fQ.XA_vs7KXuohNh3gUap-9ZBcUL7VYkP_UuKuYuP-nia4'

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)