import { Router } from 'express';
import { supabaseAdmin } from '../supabase/config';

const router = Router();

// Obtener puntos del usuario
router.get('/points/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ 
        success: false, 
        error: 'ID de usuario requerido' 
      });
    }

    // Llamar a la función para obtener puntos
    const { data, error } = await supabaseAdmin
      .rpc('get_or_create_user_points', {
        p_user_id: userId
      });

    if (error) {
      console.error('Error obteniendo puntos:', error);
      return res.status(500).json({ 
        success: false, 
        error: 'Error al obtener puntos' 
      });
    }

    if (!data || data.length === 0) {
      return res.status(404).json({ 
        success: false, 
        error: 'Usuario no encontrado' 
      });
    }

    const points = data[0];
    
    res.json({
      success: true,
      points: {
        id: points.id,
        user_id: points.user_id,
        total_points: points.total_points,
        trivia_points: points.trivia_points,
        messages_points: points.messages_points,
        created_at: points.created_at,
        updated_at: points.updated_at
      }
    });

  } catch (error) {
    console.error('Error obteniendo puntos:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Error interno del servidor' 
    });
  }
});

// Actualizar puntos del usuario
router.put('/points/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { points_to_add, source } = req.body;

    if (!userId || points_to_add === undefined) {
      return res.status(400).json({ 
        success: false, 
        error: 'ID de usuario y puntos a agregar son requeridos' 
      });
    }

    if (!source || !['trivia', 'messages'].includes(source)) {
      return res.status(400).json({ 
        success: false, 
        error: 'Fuente de puntos inválida' 
      });
    }

    // Llamar a la función para actualizar puntos
    const { data, error } = await supabaseAdmin
      .rpc('update_user_points', {
        p_user_id: userId,
        p_points_to_add: points_to_add,
        p_source: source
      });

    if (error) {
      console.error('Error actualizando puntos:', error);
      return res.status(500).json({ 
        success: false, 
        error: 'Error al actualizar puntos' 
      });
    }

    if (!data || data.length === 0) {
      return res.status(404).json({ 
        success: false, 
        error: 'Usuario no encontrado' 
      });
    }

    const updatedPoints = data[0];
    
    res.json({
      success: true,
      points: {
        id: updatedPoints.id,
        user_id: updatedPoints.user_id,
        total_points: updatedPoints.total_points,
        trivia_points: updatedPoints.trivia_points,
        messages_points: updatedPoints.messages_points,
        created_at: updatedPoints.created_at,
        updated_at: updatedPoints.updated_at
      }
    });

  } catch (error) {
    console.error('Error actualizando puntos:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Error interno del servidor' 
    });
  }
});

export default router;