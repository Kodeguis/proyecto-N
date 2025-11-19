-- Función para obtener todos los usuarios con sus puntos
CREATE OR REPLACE FUNCTION get_all_users_with_points()
RETURNS TABLE (
    id UUID,
    username TEXT,
    points INTEGER,
    total_points_earned INTEGER,
    created_at TIMESTAMPTZ
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        u.id,
        u.username,
        COALESCE(up.points, 0) as points,
        COALESCE(up.total_points_earned, 0) as total_points_earned,
        u.created_at
    FROM users u
    LEFT JOIN user_points up ON u.id = up.user_id
    ORDER BY u.created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Dar permisos a la función
GRANT EXECUTE ON FUNCTION get_all_users_with_points() TO authenticated;
GRANT EXECUTE ON FUNCTION get_all_users_with_points() TO anon;

-- Función para que el admin pueda actualizar puntos de cualquier usuario
CREATE OR REPLACE FUNCTION admin_update_user_points(
    target_user_id UUID,
    points_to_add INTEGER
)
RETURNS BOOLEAN AS $$
DECLARE
    current_points INTEGER;
    new_total_points INTEGER;
BEGIN
    -- Obtener puntos actuales
    SELECT COALESCE(points, 0) INTO current_points
    FROM user_points 
    WHERE user_id = target_user_id;
    
    -- Actualizar puntos
    UPDATE user_points 
    SET 
        points = current_points + points_to_add,
        total_points_earned = total_points_earned + GREATEST(points_to_add, 0),
        updated_at = NOW()
    WHERE user_id = target_user_id;
    
    -- Si no existe el registro, crearlo
    IF NOT FOUND THEN
        INSERT INTO user_points (user_id, points, total_points_earned, created_at, updated_at)
        VALUES (target_user_id, GREATEST(points_to_add, 0), GREATEST(points_to_add, 0), NOW(), NOW());
    END IF;
    
    RETURN TRUE;
EXCEPTION
    WHEN OTHERS THEN
        RETURN FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Dar permisos a la función admin
GRANT EXECUTE ON FUNCTION admin_update_user_points(UUID, INTEGER) TO authenticated;
GRANT EXECUTE ON FUNCTION admin_update_user_points(UUID, INTEGER) TO anon;