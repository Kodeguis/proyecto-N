import { supabase } from './supabase';

// Tipos de datos
export interface User {
  id: string;
  username: string;
  password_hash: string;
  is_admin: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserPoints {
  id: string;
  user_id: string;
  points: number;
  total_points_earned: number;
  updated_at: string;
}

export interface UserDailyMessage {
  id: string;
  user_id: string;
  day_number: number;
  opened_at: string;
}

export interface UserCoupon {
  id: string;
  user_id: string;
  coupon_id: number;
  used_at: string;
}

export interface UserTriviaAnswer {
  id: string;
  user_id: string;
  question_id: number;
  is_correct: boolean;
  answered_at: string;
}

// Funciones de autenticación
export const authAPI = {
  async login(username: string, password: string): Promise<User | null> {
    // Verificar si el usuario existe
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('username', username)
      .single();

    if (error || !data) {
      console.error('Error en login:', error);
      return null;
    }

    // En producción, deberías verificar el hash de la contraseña
    // Por ahora, haremos una comparación simple (NO recomendado para producción)
    if (data.password_hash === password) {
      return data;
    }

    return null;
  },

  async register(username: string, password: string): Promise<User | null> {
    // Crear nuevo usuario
    const { data, error } = await supabase
      .from('users')
      .insert([{
        username,
        password_hash: password, // En producción usa bcrypt o similar
        is_admin: false
      }])
      .select()
      .single();

    if (error) {
      console.error('Error en registro:', error);
      return null;
    }

    // Crear registro de puntos para el nuevo usuario
    if (data) {
      await pointsAPI.createUserPoints(data.id);
    }

    return data;
  },

  async getAllUsers(): Promise<User[]> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error obteniendo usuarios:', error);
      return [];
    }

    return data || [];
  }
};

// Funciones de puntos
export const pointsAPI = {
  async getAllUserPoints(): Promise<Array<User & { user_points: UserPoints | null }>> {
    const { data, error } = await supabase
      .from('users')
      .select(`
        *,
        user_points!inner(*)
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error obteniendo puntos de usuarios:', error);
      return [];
    }

    return data || [];
  },

  async getUserPoints(userId: string): Promise<UserPoints | null> {
    const { data, error } = await supabase
      .from('user_points')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) {
      console.error('Error obteniendo puntos:', error);
      return null;
    }

    return data;
  },

  async createUserPoints(userId: string): Promise<UserPoints | null> {
    const { data, error } = await supabase
      .from('user_points')
      .insert([{
        user_id: userId,
        points: 0,
        total_points_earned: 0
      }])
      .select()
      .single();

    if (error) {
      console.error('Error creando puntos:', error);
      return null;
    }

    return data;
  },

  async updatePoints(userId: string, points: number): Promise<boolean> {
    // Primero obtener los puntos actuales
    const currentPoints = await this.getUserPoints(userId);
    
    if (!currentPoints) {
      return false;
    }

    const newTotal = currentPoints.total_points_earned + points;
    const newPoints = currentPoints.points + points;

    const { error } = await supabase
      .from('user_points')
      .update({
        points: newPoints,
        total_points_earned: newTotal,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', userId);

    if (error) {
      console.error('Error actualizando puntos:', error);
      return false;
    }

    return true;
  },

  async spendPoints(userId: string, points: number): Promise<boolean> {
    // Primero obtener los puntos actuales
    const currentPoints = await this.getUserPoints(userId);
    
    if (!currentPoints || currentPoints.points < points) {
      return false; // No hay suficientes puntos
    }

    const newPoints = currentPoints.points - points;

    const { error } = await supabase
      .from('user_points')
      .update({
        points: newPoints,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', userId);

    if (error) {
      console.error('Error gastando puntos:', error);
      return false;
    }

    return true;
  }
};

// Funciones de mensajes diarios
export const dailyMessagesAPI = {
  async getOpenedDays(userId: string): Promise<number[]> {
    const { data, error } = await supabase
      .from('user_daily_messages')
      .select('day_number')
      .eq('user_id', userId)
      .order('day_number', { ascending: true });

    if (error) {
      console.error('Error obteniendo días abiertos:', error);
      return [];
    }

    return data.map(item => item.day_number);
  },

  async openDay(userId: string, dayNumber: number): Promise<boolean> {
    const { error } = await supabase
      .from('user_daily_messages')
      .insert([{
        user_id: userId,
        day_number: dayNumber
      }]);

    if (error) {
      console.error('Error abriendo día:', error);
      return false;
    }

    return true;
  }
};

// Funciones de cupones
export const couponsAPI = {
  async getUsedCoupons(userId: string): Promise<number[]> {
    const { data, error } = await supabase
      .from('user_coupons')
      .select('coupon_id')
      .eq('user_id', userId);

    if (error) {
      console.error('Error obteniendo cupones usados:', error);
      return [];
    }

    return data.map(item => item.coupon_id);
  },

  async useCoupon(userId: string, couponId: number): Promise<boolean> {
    const { error } = await supabase
      .from('user_coupons')
      .insert([{
        user_id: userId,
        coupon_id: couponId
      }]);

    if (error) {
      console.error('Error usando cupón:', error);
      return false;
    }

    return true;
  }
};

// Funciones de trivia
export const triviaAPI = {
  async getAnsweredQuestions(userId: string): Promise<{questionId: number, isCorrect: boolean}[]> {
    const { data, error } = await supabase
      .from('user_trivia_answers')
      .select('question_id, is_correct')
      .eq('user_id', userId);

    if (error) {
      console.error('Error obteniendo respuestas:', error);
      return [];
    }

    return data.map(item => ({
      questionId: item.question_id,
      isCorrect: item.is_correct
    }));
  },

  async answerQuestion(userId: string, questionId: number, isCorrect: boolean): Promise<boolean> {
    const { error } = await supabase
      .from('user_trivia_answers')
      .insert([{
        user_id: userId,
        question_id: questionId,
        is_correct: isCorrect
      }]);

    if (error) {
      console.error('Error guardando respuesta:', error);
      return false;
    }

    return true;
  }
};

export default {
  authAPI,
  pointsAPI,
  dailyMessagesAPI,
  couponsAPI,
  triviaAPI
};