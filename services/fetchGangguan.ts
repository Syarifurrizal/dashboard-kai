import { Gangguan } from "@/lib/definitions";
import { fetchSheetData } from "@/lib/googlesheet";
import { cleanToAlphabets, toDate, toInt } from "@/lib/utils";

export async function fetchGangguanKDT(range: string): Promise<Gangguan[]> {
    const rows = await fetchSheetData({ range: range });

    return rows.map((row) => {
        const rawBulan = row[0];
        const bulan = typeof rawBulan === 'string' ? cleanToAlphabets(rawBulan) : '';

        return {
            bulan: bulan,
            toleransi: 0,
            realisasi: 0,
            toleransiKereta: 0,
            realisasiKereta: 0,
            toleransiGenset: 0,
            realisasiGenset: 0,
            toleransiLPT: row[1] == null ? 0 : toInt(row[1]),
            realisasiLPT: row[2] == null ? 0 : toInt(row[2]),
            realisasiNonLPT: row[3] == null ? 0 : toInt(row[3]),
        }
    });
}

export async function fetchGangguanKDK(range: string): Promise<Gangguan[]> {
    const rows = await fetchSheetData({ range: range });

    return rows.map((row) => {
        const rawBulan = row[0];
        const bulan = typeof rawBulan === 'string' ? cleanToAlphabets(rawBulan) : '';

        return {
            bulan: bulan,
            toleransi: 0,
            realisasi: 0,
            toleransiKereta: row[1] == null ? 0 : toInt(row[1]),
            realisasiKereta: row[2] == null ? 0 : toInt(row[2]),
            toleransiGenset: row[3] == null ? 0 : toInt(row[3]),
            realisasiGenset: row[4] == null ? 0 : toInt(row[4]),
            toleransiLPT: 0,
            realisasiLPT: 0,
            realisasiNonLPT: 0,
        }
    });
}

export async function fetchGangguanKDG(range: string): Promise<Gangguan[]> {
    const rows = await fetchSheetData({ range: range });

    return rows.map((row) => {
        const rawBulan = row[0];
        const bulan = typeof rawBulan === 'string' ? cleanToAlphabets(rawBulan) : '';

        return {
            bulan: bulan,
            toleransi: row[1] == null ? 0 : toInt(row[1]),
            realisasi: row[2] == null ? 0 : toInt(row[2]),
            toleransiKereta: 0,
            realisasiKereta: 0,
            toleransiGenset: 0,
            realisasiGenset: 0,
            toleransiLPT: 0,
            realisasiLPT: 0,
            realisasiNonLPT: 0,
        }
    });
}