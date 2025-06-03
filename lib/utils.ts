import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { Availability, Gangguan, Perawatan } from "./definitions";

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

export function toInt(value: string | number | null | undefined): number {
  if (value === null || value === undefined) return 0;

  let stringValue: string;

  if (typeof value === 'number') {
    // Convert to fixed to prevent precision loss
    stringValue = Math.floor(value).toString();
  } else {
    // Already string
    stringValue = value;
  }

  // Remove thousand separators (dot or comma), but preserve minus
  const cleaned = stringValue.replace(/[^\d-]/g, '');

  const parsed = parseInt(cleaned, 10);
  return isNaN(parsed) ? 0 : parsed;
}


export function trimDecimal(num: number): string {
  return num % 1 === 0 ? num.toFixed(0) : num.toFixed(2).replace(/\.?0+$/, '');
}

export function countPercentage(...args: [number, number]): number {
  const [total, part] = args;
  if (total === 0) return 0;
  return (part / total) * 100;
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

export function toIDR(number: number | bigint, decimalDigits = 0) {
  if (typeof number === "bigint") {
    // Warning: This may lose precision if bigint too big!
    number = Number(number);
  }
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

export function calculatePersenAvailability(sgo: number, so: number): number {
  return sgo !== 0 ? (so / sgo) * 100 : 0;
}

export function calculatePersenUtilisasi(so: number, sf: number): number {
  return so !== 0 ? sf / so : 0;
}

export function calculateAvailabilityPercentages(data: Availability[]): Availability[] {
  return data.map(item => ({
    ...item,
    persen_Availability: calculatePersenAvailability(item.sgo, item.so),
    persen_Utilisasi: calculatePersenUtilisasi(item.so, item.sf),
  }));
}

export function mergeAndRecalculatesAvailability(
  data1: Availability[],
  data2: Availability[]
): Availability[] {
  const mergedMap = new Map<string, Availability>();

  for (const item of data1) {
    mergedMap.set(item.bulan, { ...item });
  }

  for (const item of data2) {
    const key = item.bulan;
    const existing = mergedMap.get(key);

    if (existing) {
      const kirimAsistensi = item.kirimAsistensi ?? 0;
      const terimaAsistensi = item.terimaAsistensi ?? 0;
      const oldKirim = existing.kirimAsistensi ?? 0;
      const oldTerima = existing.terimaAsistensi ?? 0;

      const merged: Availability = {
        bulan: item.bulan,
        armada: existing.armada + item.armada,
        tsgo: existing.tsgo + item.tsgo,
        sgo: existing.sgo + item.sgo,
        tso: existing.tso + item.tso,
        so: existing.so + item.so,
        sf: existing.sf + item.sf,
        kirimAsistensi: oldKirim + kirimAsistensi,
        terimaAsistensi: oldTerima + terimaAsistensi,
        cadangan: existing.cadangan + item.cadangan,
        persen_ProgramAvailability:
          (existing.persen_ProgramAvailability || 0) === 0 && (item.persen_ProgramAvailability || 0) === 0
            ? 0
            : ((existing.persen_ProgramAvailability || 0) + (item.persen_ProgramAvailability || 0)) /
            ((existing.persen_ProgramAvailability ? 1 : 0) + (item.persen_ProgramAvailability ? 1 : 0)),
        persen_Availability: 0,
        persen_Utilisasi: 0,
      };

      merged.persen_Availability = calculatePersenAvailability(merged.sgo, merged.so);
      merged.persen_Utilisasi = calculatePersenUtilisasi(merged.so, merged.sf);

      mergedMap.set(key, merged);
    } else {
      const newItem: Availability = {
        ...item,
        persen_ProgramAvailability: item.persen_ProgramAvailability,
        persen_Availability: calculatePersenAvailability(item.sgo, item.so),
        persen_Utilisasi: calculatePersenUtilisasi(item.so, item.sf),
      };

      mergedMap.set(key, newItem);
    }
  }

  return Array.from(mergedMap.values());
}

export function mergeAndRecalculatePerawatan(
  data1: Perawatan[],
  data2: Perawatan[]
): Perawatan[] {
  const mergedMap = new Map<string, Perawatan>();

  for (const item of data1) {
    const key = `${item.bulan}`.toLowerCase();
    mergedMap.set(key, { ...item });
  }

  for (const item of data2) {
    const key = `${item.bulan}`.toLowerCase();
    const existing = mergedMap.get(key);

    if (existing) {
      const sumP1 = existing.p1 + item.p1;
      const sumRp1 = existing.rp1 + item.rp1;
      const sumP3 = existing.p3 + item.p3;
      const sumRp3 = existing.rp3 + item.rp3;
      const sumP6 = existing.p6 + item.p6;
      const sumRp6 = existing.rp6 + item.rp6;
      const sumP12 = existing.p12 + item.p12;
      const sumRp12 = existing.rp12 + item.rp12;

      mergedMap.set(key, {
        bulan: existing.bulan,
        p1: sumP1,
        rp1: sumRp1,
        persen_1: countPercentage(sumP1, sumRp1),
        p3: sumP3,
        rp3: sumRp3,
        persen_3: countPercentage(sumP3, sumRp3),
        p6: sumP6,
        rp6: sumRp6,
        persen_6: countPercentage(sumP6, sumRp6),
        p12: sumP12,
        rp12: sumRp12,
        persen_12: countPercentage(sumP12, sumRp12),
      });
    } else {
      mergedMap.set(key, {
        ...item,
        persen_1: countPercentage(item.p1, item.rp1),
        persen_3: countPercentage(item.p3, item.rp3),
        persen_6: countPercentage(item.p6, item.rp6),
        persen_12: countPercentage(item.p12, item.rp12),
      });
    }
  }


  return Array.from(mergedMap.values());
}

export function calculatePerawatanPercentage(data: Perawatan[]): Perawatan[] {
  return data.map(item => ({
    ...item,
    persen_1: countPercentage(item.p1, item.rp1),
    persen_3: countPercentage(item.p3, item.rp3),
    persen_6: countPercentage(item.p6, item.rp6),
    persen_12: countPercentage(item.p12, item.rp12),
  }));
}

export function mergeGangguan(data1: Gangguan[], data2: Gangguan[]): Gangguan[] {
  const mergedMap = new Map<string, Gangguan>();

  function addOrMerge(g: Gangguan) {
    if (!mergedMap.has(g.bulan)) {
      mergedMap.set(g.bulan, { ...g });
    } else {
      const existing = mergedMap.get(g.bulan)!;
      mergedMap.set(g.bulan, {
        bulan: g.bulan,
        toleransi: existing.toleransi + g.toleransi,
        realisasi: existing.realisasi + g.realisasi,
        toleransiKereta: existing.toleransiKereta + g.toleransiKereta,
        realisasiKereta: existing.realisasiKereta + g.realisasiKereta,
        toleransiGenset: existing.toleransiGenset + g.toleransiGenset,
        realisasiGenset: existing.realisasiGenset + g.realisasiGenset,
        toleransiLPT: existing.toleransiLPT + g.toleransiLPT,
        realisasiLPT: existing.realisasiLPT + g.realisasiLPT,
        realisasiNonLPT: existing.realisasiNonLPT + g.realisasiNonLPT,
      });
    }
  }

  data1.forEach(addOrMerge);
  data2.forEach(addOrMerge);

  return Array.from(mergedMap.values());
}