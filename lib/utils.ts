import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function toDate(value: string): Date | null {
  const parsed = Date.parse(value);
  return isNaN(parsed) ? null : new Date(parsed);
}

export function toMoney(value: string): number {
  return parseFloat(
    value.replace(/[^\d.-]+/g, '').replace(',', '.')
  ) || 0;
}

export function toNumber(value: string): number {
  return parseFloat(value.replace(/[^\d.-]+/g, '').replace(',', '.')) || 0;
}

export function formatSaldoBesar(amount: number) {
  if (amount >= 1_000_000_000_000) return (amount / 1_000_000_000_000).toFixed(0) + "T";
  if (amount >= 1_000_000_000) return (amount / 1_000_000_000).toFixed(0) + "Mlyr";
  if (amount >= 1_000_000) return (amount / 1_000_000).toFixed(0) + "Jt";
  return amount.toString();
}

export function toIDR(number: number) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 2,
  }).format(number);
}

export function parseIndonesianDate(dateStr: string): Date | null {
  const months: Record<string, number> = {
    Januari: 0,
    Februari: 1,
    Maret: 2,
    April: 3,
    Mei: 4,
    Juni: 5,
    Juli: 6,
    Agustus: 7,
    September: 8,
    Oktober: 9,
    November: 10,
    Desember: 11,
  };

  // Expecting format "01 Januari 2003"
  const parts = dateStr.trim().split(' ');
  if (parts.length !== 3) return null;

  const day = parseInt(parts[0], 10);
  const monthName = parts[1];
  const year = parseInt(parts[2], 10);

  const month = months[monthName];
  if (month === undefined || isNaN(day) || isNaN(year)) return null;

  return new Date(year, month, day);
}
