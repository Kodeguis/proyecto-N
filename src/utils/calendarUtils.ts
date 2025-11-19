// Funciones de utilidad para el calendario de mensajes diarios

/**
 * Verifica si un día está desbloqueado según la fecha actual
 * Los días se desbloquean progresivamente según avanza el mes
 * @param dayNumber - Número del día (1-31)
 * @returns true si el día está desbloqueado, false si no
 */
export function isDayUnlocked(dayNumber: number): boolean {
  const today = new Date();
  const currentDay = today.getDate();
  
  // El día está desbloqueado si es igual o menor al día actual
  return dayNumber <= currentDay;
}

/**
 * Obtiene el día actual del mes
 * @returns Número del día actual (1-31)
 */
export function getCurrentDay(): number {
  return new Date().getDate();
}

/**
 * Verifica si un día es futuro (no desbloqueado aún)
 * @param dayNumber - Número del día (1-31)
 * @returns true si el día es futuro, false si no
 */
export function isFutureDay(dayNumber: number): boolean {
  return !isDayUnlocked(dayNumber);
}

/**
 * Formatea la fecha para mostrar en la interfaz
 * @param date - Fecha a formatear
 * @returns Fecha formateada en español
 */
export function formatDate(date: Date): string {
  return date.toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

/**
 * Obtiene el nombre del mes actual
 * @returns Nombre del mes en español
 */
export function getCurrentMonthName(): string {
  return new Date().toLocaleDateString('es-ES', { month: 'long' });
}