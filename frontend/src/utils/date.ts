import { format, parseISO, isValid, startOfDay, endOfDay, subDays } from "date-fns";
import { ptBR } from "date-fns/locale";

export function toISOString(date: Date): string {
  return date.toISOString();
}

export function parseDate(dateStr: string | null | undefined): Date | null {
  if (!dateStr) return null;
  const d = parseISO(dateStr);
  return isValid(d) ? d : null;
}

export function formatRelative(date: string | Date): string {
  const d = typeof date === "string" ? parseISO(date) : date;
  if (!isValid(d)) return "—";
  return format(d, "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
}

export function getDateRange(days: number): { start: Date; end: Date } {
  const end = endOfDay(new Date());
  const start = startOfDay(subDays(new Date(), days));
  return { start, end };
}

export function isExpired(dateStr: string): boolean {
  const d = parseISO(dateStr);
  return isValid(d) && d < new Date();
}
