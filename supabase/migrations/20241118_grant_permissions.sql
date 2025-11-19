-- Otorgar permisos de lectura y escritura a las tablas principales
GRANT SELECT, INSERT, UPDATE ON users TO anon;
GRANT SELECT, INSERT, UPDATE ON user_points TO anon;
GRANT SELECT, INSERT, UPDATE ON user_daily_messages TO anon;
GRANT SELECT, INSERT, UPDATE ON user_coupons TO anon;
GRANT SELECT, INSERT, UPDATE ON user_trivia_answers TO anon;

-- Otorgar permisos a las funciones
GRANT EXECUTE ON FUNCTION register_user TO anon;
GRANT EXECUTE ON FUNCTION login_user TO anon;
GRANT EXECUTE ON FUNCTION get_or_create_user_points TO anon;
GRANT EXECUTE ON FUNCTION update_user_points TO anon;