import { Router } from 'express';
import { supabaseAdmin } from '../supabase/config';

const router = Router();

// Login endpoint
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ 
        success: false, 
        error: 'Usuario y contraseña son requeridos' 
      });
    }

    // Llamar a la función de PostgreSQL para login
    const { data, error } = await supabaseAdmin
      .rpc('login_user', {
        p_username: username,
        p_password: password
      });

    if (error) {
      console.error('Error en login:', error);
      return res.status(401).json({ 
        success: false, 
        error: 'Usuario o contraseña incorrectos' 
      });
    }

    if (!data || data.length === 0) {
      return res.status(401).json({ 
        success: false, 
        error: 'Usuario o contraseña incorrectos' 
      });
    }

    const user = data[0];
    
    res.json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        is_admin: user.is_admin,
        created_at: user.created_at
      }
    });

  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Error interno del servidor' 
    });
  }
});

// Register endpoint
router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ 
        success: false, 
        error: 'Usuario y contraseña son requeridos' 
      });
    }

    if (username.length < 3 || password.length < 6) {
      return res.status(400).json({ 
        success: false, 
        error: 'Usuario mínimo 3 caracteres, contraseña mínimo 6 caracteres' 
      });
    }

    // Llamar a la función de PostgreSQL para registro
    const { data, error } = await supabaseAdmin
      .rpc('register_user', {
        p_username: username,
        p_password: password
      });

    if (error) {
      console.error('Error en registro:', error);
      
      if (error.message.includes('already exists')) {
        return res.status(409).json({ 
          success: false, 
          error: 'El nombre de usuario ya está en uso' 
        });
      }
      
      return res.status(400).json({ 
        success: false, 
        error: 'Error al crear el usuario' 
      });
    }

    if (!data || data.length === 0) {
      return res.status(400).json({ 
        success: false, 
        error: 'Error al crear el usuario' 
      });
    }

    const user = data[0];
    
    res.json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        is_admin: user.is_admin,
        created_at: user.created_at
      }
    });

  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Error interno del servidor' 
    });
  }
});

export default router;