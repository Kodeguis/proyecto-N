-- Crear tabla de usuarios
CREATE TABLE users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  is_admin BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear tabla de puntos
CREATE TABLE user_points (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  points INTEGER DEFAULT 0,
  total_points_earned INTEGER DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Crear tabla de mensajes diarios desbloqueados
CREATE TABLE user_daily_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  day_number INTEGER NOT NULL,
  opened_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, day_number)
);

-- Crear tabla de cupones usados
CREATE TABLE user_coupons (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  coupon_id INTEGER NOT NULL,
  used_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, coupon_id)
);

-- Crear tabla de trivia respondida
CREATE TABLE user_trivia_answers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  question_id INTEGER NOT NULL,
  is_correct BOOLEAN NOT NULL,
  answered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS (Row Level Security)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_points ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_daily_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_trivia_answers ENABLE ROW LEVEL SECURITY;

-- Políticas de seguridad para usuarios anónimos
CREATE POLICY "Permitir lectura de usuarios" ON users FOR SELECT USING (true);
CREATE POLICY "Permitir inserción de usuarios" ON users FOR INSERT WITH CHECK (true);
CREATE POLICY "Permitir actualización propia" ON users FOR UPDATE USING (auth.uid() = id);

-- Políticas para puntos
CREATE POLICY "Ver puntos propios" ON user_points FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Actualizar puntos propios" ON user_points FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Insertar puntos propios" ON user_points FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Políticas para mensajes diarios
CREATE POLICY "Ver mensajes propios" ON user_daily_messages FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Insertar mensajes propios" ON user_daily_messages FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Políticas para cupones
CREATE POLICY "Ver cupones propios" ON user_coupons FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Insertar cupones propios" ON user_coupons FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Políticas para trivia
CREATE POLICY "Ver respuestas propias" ON user_trivia_answers FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Insertar respuestas propias" ON user_trivia_answers FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Insertar usuario admin por defecto
INSERT INTO users (username, password_hash, is_admin) 
VALUES ('admin', '$2b$10$YourHashedPasswordHere', true);

-- Otorgar permisos
GRANT ALL ON users TO anon;
GRANT ALL ON user_points TO anon;
GRANT ALL ON user_daily_messages TO anon;
GRANT ALL ON user_coupons TO anon;
GRANT ALL ON user_trivia_answers TO anon;