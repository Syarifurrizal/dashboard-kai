import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { Availability, Perawatan } from "./definitions";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function cleanToAlphabets(input: string): string {
  const cleaned = input.replace(/[^a-zA-Z]/g, '');
  return capitalizeFirstLetter(cleaned);
}

export function capitalizeFirstLetter(word: string): string {
  if (!word) return '';
  return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
}

export function toFloat(input: string): number {
  const cleaned = input.replace(/[^\d.-]+/g, "")
  const result = parseFloat(cleaned)
  return isNaN(result) ? 0 : result
}

export function toInt(input: string): number {
  const cleaned = input.replace(/[^\d-]+/g, "")
  const result = parseInt(cleaned, 10)
  return isNaN(result) ? 0 : result
}

export function formatSaldoBesar(amount: number, precision: number = 0, useComma: boolean = true): string {
  let value: number;
  let suffix: string = "";

  if (amount >= 1_000_000_000_000) {
    value = amount / 1_000_000_000_000;
    suffix = " T";
  } else if (amount >= 1_000_000_000) {
    value = amount / 1_000_000_000;
    suffix = " M";
  } else if (amount >= 1_000_000) {
    value = amount / 1_000_000;
    suffix = " Jt";
  } else {
    value = amount;
  }

  let result = value.toFixed(precision);

  if (useComma) {
    result = result.replace(".", ",");
  }

  if ((useComma && result.endsWith(",0")) || (!useComma && result.endsWith(".0"))) {
    result = result.slice(0, -2);
  }

  return result + suffix;
}

export function toIDR(number: number, decimalDigits = 0) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: decimalDigits,
  }).format(number);
}

export function dateToIDString(date: Date): string {
  return date.toLocaleString("id-ID", { month: "long" });
}

export function toDate(dateStr: string): Date {
  const months: Record<string, number> = {
    januari: 0,
    februari: 1,
    maret: 2,
    april: 3,
    mei: 4,
    juni: 5,
    juli: 6,
    agustus: 7,
    september: 8,
    oktober: 9,
    november: 10,
    desember: 11,
  };

  if (!dateStr || typeof dateStr !== "string") return new Date(NaN);

  const parts = dateStr
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  const currentYear = new Date().getUTCFullYear();

  if (parts.length === 1) {
    const month = months[parts[0].toLowerCase()];
    if (month === undefined) {
      console.warn("💥 Invalid month hehehe:", parts[0]);
      return new Date(NaN);
    }
    return new Date(Date.UTC(currentYear, month, 1));
  }

  let day = parseInt(parts[0], 10);
  if (isNaN(day) || day <= 0) day = 1;

  const month = months[parts[1]?.toLowerCase()];
  if (month === undefined) {
    console.warn("💥 Invalid month:", parts[1]);
    return new Date(NaN);
  }

  let year = parseInt(parts[2], 10);
  if (isNaN(year) || year <= 0) year = currentYear;

  const date = new Date(Date.UTC(year, month, day));
  return date;
}

export function mergeAndCalculateAvailability(
  data1: Availability[],
  data2: Availability[]
): Availability[] {
  const mergedMap = new Map<string, Availability>();

  // Initialize map with data1
  for (const item of data1) {
    const key = `${item.bulan}`;
    mergedMap.set(key, { ...item });
  }

  // Merge and sum data2
  for (const item of data2) {
    const key = `${item.bulan}`;
    const existing = mergedMap.get(key);

    if (existing) {
      // Sum numeric fields
      const summed: Availability = {
        bulan: item.bulan,
        armada: existing.armada + item.armada,
        tsgo: existing.tsgo + item.tsgo,
        sgo: existing.sgo + item.sgo,
        tso: existing.tso + item.tso,
        so: existing.so + item.so,
        sf: existing.sf + item.sf,
        kirimAsistensi: existing.kirimAsistensi + (item.kirimAsistensi ?? 0),
        terimaAsistensi: existing.terimaAsistensi + (item.terimaAsistensi ?? 0),
        cadangan: existing.cadangan + item.cadangan,
        persen_ProgramAvailability: 0,
        persen_Availability: 0,
        persen_Utilisasi: 0,
      };

      // Calculate totals
      const total = summed.tsgo + summed.sgo + summed.tso + summed.so + summed.sf + summed.kirimAsistensi + summed.terimaAsistensi + summed.cadangan;
      const available = summed.so + summed.sf;
      const active = summed.so + summed.sf + summed.terimaAsistensi;

      if (total > 0) {
        summed.persen_ProgramAvailability = +(available / total * 100).toFixed(2);
        summed.persen_Availability = +(summed.so / total * 100).toFixed(2);
        summed.persen_Utilisasi = +(active / total * 100).toFixed(2);
      }

      mergedMap.set(key, summed);
    } else {
      // If key not exist in map, just add item from data2 with percentage calculated
      const kirimAsistensi = item.kirimAsistensi ?? 0;
      const terimaAsistensi = item.terimaAsistensi ?? 0;

      const total = item.tsgo + item.sgo + item.tso + item.so + item.sf + kirimAsistensi + terimaAsistensi + item.cadangan;
      const available = item.so + item.sf;
      const active = item.so + item.sf + terimaAsistensi;

      const newItem: Availability = {
        ...item,
        persen_ProgramAvailability: total > 0 ? +(available / total * 100).toFixed(2) : 0,
        persen_Availability: total > 0 ? +(item.so / total * 100).toFixed(2) : 0,
        persen_Utilisasi: total > 0 ? +(active / total * 100).toFixed(2) : 0,
      };

      mergedMap.set(key, newItem);
    }
  }

  return Array.from(mergedMap.values());
}

export function mergeAndCalculatePerawatan(
  data1: Perawatan[],
  data2: Perawatan[]
): Perawatan[] {

  const mergedMap = new Map<string, Perawatan>();

  // First dataset (initialize map)
  for (const item of data1) {
    const key = `${item.bulan}`;
    mergedMap.set(key, { ...item });
  }

  // Second dataset (sum into map)
  for (const item of data2) {
    const key = `${item.bulan}`;
    const existing = mergedMap.get(key);

    if (existing) {
      // Sum all numeric fields
      const summed: Perawatan = {
        bulan: item.bulan,
        p1: existing.p1 + item.p1,
        rp1: existing.rp1 + item.rp1,
        p3: existing.p3 + item.p3,
        rp3: existing.rp3 + item.rp3,
        p6: existing.p6 + item.p6,
        rp6: existing.rp6 + item.rp6,
        p12: existing.p12 + item.p12,
        rp12: existing.rp12 + item.rp12,
      };

      mergedMap.set(key, summed);
    }
  }

  return Array.from(mergedMap.values());

}