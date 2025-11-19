-- Debug version of admin_update_user_points with better error handling
CREATE OR REPLACE FUNCTION admin_update_user_points_debug(
    target_user_id UUID,
    points_to_add INTEGER
)
RETURNS TABLE (
    success BOOLEAN,
    error_message TEXT,
    old_points INTEGER,
    new_points INTEGER
) AS $$
DECLARE
    current_points INTEGER := 0;
    new_total_points INTEGER;
    user_exists BOOLEAN := FALSE;
BEGIN
    -- Verificar si el usuario existe
    SELECT EXISTS(SELECT 1 FROM users WHERE id = target_user_id) INTO user_exists;
    
    IF NOT user_exists THEN
        RETURN QUERY SELECT FALSE, 'Usuario no existe', 0, 0;
        RETURN;
    END IF;
    
    -- Obtener puntos actuales
    SELECT COALESCE(points, 0) INTO current_points
    FROM user_points 
    WHERE user_id = target_user_id;
    
    -- Si no hay registro, crearlo
    IF NOT FOUND THEN
        BEGIN
            INSERT INTO user_points (user_id, points, total_points_earned, created_at, updated_at)
            VALUES (target_user_id, GREATEST(points_to_add, 0), GREATEST(points_to_add, 0), NOW(), NOW());
            
            RETURN QUERY SELECT TRUE, 'Nuevo registro creado', 0, GREATEST(points_to_add, 0);
            RETURN;
        EXCEPTION
            WHEN OTHERS THEN
                RETURN QUERY SELECT FALSE, 'Error creando nuevo registro: ' || SQLERRM, 0, 0;
                RETURN;
        END;
    ELSE
        -- Actualizar puntos existentes
        new_total_points := current_points + points_to_add;
        
        UPDATE user_points 
        SET 
            points = new_total_points,
            total_points_earned = total_points_earned + GREATEST(points_to_add, 0),
            updated_at = NOW()
        WHERE user_id = target_user_id;
        
        IF FOUND THEN
            RETURN QUERY SELECT TRUE, 'Puntos actualizados exitosamente', current_points, new_total_points;
        ELSE
            RETURN QUERY SELECT FALSE, 'No se pudo actualizar el registro', current_points, current_points;
        END IF;
    END IF;
EXCEPTION
    WHEN OTHERS THEN
        RETURN QUERY SELECT FALSE, 'Error general: ' || SQLERRM, current_points, current_points;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant permissions
GRANT EXECUTE ON FUNCTION admin_update_user_points_debug(UUID, INTEGER) TO authenticated;
GRANT EXECUTE ON FUNCTION admin_update_user_points_debug(UUID, INTEGER) TO anon;