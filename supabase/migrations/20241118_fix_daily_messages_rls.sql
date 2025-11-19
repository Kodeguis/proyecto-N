-- Fix RLS policies for user_daily_messages table to work with anon access

-- Drop existing policies that require authentication
DROP POLICY IF EXISTS "Ver mensajes propios" ON user_daily_messages;
DROP POLICY IF EXISTS "Insertar mensajes propios" ON user_daily_messages;

-- Create permissive policies for anon access (since we're using user_id from application)
CREATE POLICY "Allow select for all" ON user_daily_messages FOR SELECT 
USING (true);

CREATE POLICY "Allow insert for all" ON user_daily_messages FOR INSERT 
WITH CHECK (true);

-- Grant proper permissions
GRANT SELECT, INSERT ON user_daily_messages TO anon;
GRANT SELECT, INSERT ON user_daily_messages TO authenticated;