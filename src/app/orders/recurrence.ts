import { RecurrenceType } from './orders.data';

export function toISODate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function parseISODate(iso: string): Date {
  const [year, month, day] = iso.split('-').map(Number);
  return new Date(year, month - 1, day);
}

export function nextOccurrence(iso: string, type: RecurrenceType): string {
  const date = parseISODate(iso);
  if (Number.isNaN(date.getTime())) {
    return iso;
  }
  switch (type) {
    case 'diario':
      date.setDate(date.getDate() + 1);
      break;
    case 'semanal':
      date.setDate(date.getDate() + 7);
      break;
    case 'quincenal':
      date.setDate(date.getDate() + 14);
      break;
    case 'mensual': {
      const day = date.getDate();
      date.setMonth(date.getMonth() + 1);
      if (date.getDate() < day) {
        date.setDate(0);
      }
      break;
    }
  }
  return toISODate(date);
}

export function weekdayName(iso: string): string {
  const date = parseISODate(iso);
  if (Number.isNaN(date.getTime())) {
    return '';
  }
  const weekday = new Intl.DateTimeFormat('es-MX', { weekday: 'long' }).format(date);
  return weekday.charAt(0).toUpperCase() + weekday.slice(1);
}

export function dayOfMonth(iso: string): number {
  const date = parseISODate(iso);
  if (Number.isNaN(date.getTime())) {
    return 1;
  }
  return date.getDate();
}

export function recurrenceLabel(type: RecurrenceType, date: string): string {
  switch (type) {
    case 'diario':
      return 'Todos los días';
    case 'semanal':
      return `Cada ${weekdayName(date)}`;
    case 'quincenal':
      return 'Cada 2 semanas';
    case 'mensual':
      return `Cada ${dayOfMonth(date)} de cada mes`;
  }
}
