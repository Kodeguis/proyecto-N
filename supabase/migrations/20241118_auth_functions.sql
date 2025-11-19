-- Función para registrar usuarios
CREATE OR REPLACE FUNCTION register_user(
  p_username TEXT,
  p_password_hash TEXT
)
RETURNS TABLE (
  id UUID,
  username TEXT,
  is_admin BOOLEAN,
  created_at TIMESTAMPTZ
) AS $$
BEGIN
  -- Insertar nuevo usuario
  RETURN QUERY
  INSERT INTO users (username, password_hash, is_admin)
  VALUES (p_username, p_password_hash, false)
  RETURNING users.id, users.username, users.is_admin, users.created_at;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Función para login de usuarios
CREATE OR REPLACE FUNCTION login_user(
  p_username TEXT,
  p_password_hash TEXT
)
RETURNS TABLE (
  id UUID,
  username TEXT,
  is_admin BOOLEAN,
  created_at TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY
  SELECT u.id, u.username, u.is_admin, u.created_at
  FROM users u
  WHERE u.username = p_username 
    AND u.password_hash = p_password_hash
  LIMIT 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Función para obtener o crear puntos de usuario
CREATE OR REPLACE FUNCTION get_or_create_user_points(
  p_user_id UUID
)
RETURNS TABLE (
  id UUID,
  user_id UUID,
  points INTEGER,
  total_points_earned INTEGER,
  updated_at TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY
  INSERT INTO user_points (user_id, points, total_points_earned)
  VALUES (p_user_id, 0, 0)
  ON CONFLICT (user_id) DO NOTHING
  RETURNING user_points.id, user_points.user_id, user_points.points, user_points.total_points_earned, user_points.updated_at;
  
  IF NOT FOUND THEN
    RETURN QUERY
    SELECT up.id, up.user_id, up.points, up.total_points_earned, up.updated_at
    FROM user_points up
    WHERE up.user_id = p_user_id;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Función para actualizar puntos
CREATE OR REPLACE FUNCTION update_user_points(
  p_user_id UUID,
  p_points INTEGER
)
RETURNS BOOLEAN AS $$
BEGIN
  UPDATE user_points
  SET points = p_points,
      total_points_earned = total_points_earned + GREATEST(0, p_points - points),
      updated_at = NOW()
  WHERE user_id = p_user_id;
  
  RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Otorgar permisos
GRANT EXECUTE ON FUNCTION register_user TO anon;
GRANT EXECUTE ON FUNCTION login_user TO anon;
GRANT EXECUTE ON FUNCTION get_or_create_user_points TO anon;
GRANT EXECUTE ON FUNCTION update_user_points TO anon;