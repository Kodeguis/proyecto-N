-- Fix RLS policies for user_points table

-- Enable RLS if not already enabled
ALTER TABLE user_points ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own points" ON user_points;
DROP POLICY IF EXISTS "Users can update own points" ON user_points;
DROP POLICY IF EXISTS "Allow insert for authenticated users" ON user_points;
DROP POLICY IF EXISTS "Allow all operations for admin" ON user_points;

-- Create policies for users to manage their own points
CREATE POLICY "Users can view own points" ON user_points
    FOR SELECT
    USING (auth.uid() = user_id OR EXISTS (
        SELECT 1 FROM users WHERE id = auth.uid() AND is_admin = true
    ));

CREATE POLICY "Users can update own points" ON user_points
    FOR UPDATE
    USING (auth.uid() = user_id OR EXISTS (
        SELECT 1 FROM users WHERE id = auth.uid() AND is_admin = true
    ));

-- Allow authenticated users to create their own points record
CREATE POLICY "Allow insert for authenticated users" ON user_points
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Allow admin to do anything
CREATE POLICY "Allow all operations for admin" ON user_points
    FOR ALL
    USING (EXISTS (
        SELECT 1 FROM users WHERE id = auth.uid() AND is_admin = true
    ));

-- Grant permissions to anon and authenticated roles
GRANT SELECT ON user_points TO anon;
GRANT SELECT, INSERT, UPDATE ON user_points TO authenticated;

-- Also grant permissions on the function
GRANT EXECUTE ON FUNCTION admin_update_user_points(UUID, INTEGER) TO authenticated;
GRANT EXECUTE ON FUNCTION admin_update_user_points(UUID, INTEGER) TO anon;

-- Create function to safely create user points record
CREATE OR REPLACE FUNCTION create_user_points_safe(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    INSERT INTO user_points (user_id, points, total_points_earned, created_at, updated_at)
    VALUES (user_id, 0, 0, NOW(), NOW())
    ON CONFLICT (user_id) DO NOTHING;
    
    RETURN TRUE;
EXCEPTION
    WHEN OTHERS THEN
        RETURN FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION create_user_points_safe(UUID) TO authenticated;