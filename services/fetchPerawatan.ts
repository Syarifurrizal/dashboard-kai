import { Perawatan } from "@/lib/definitions";
import { fetchSheetData } from "@/lib/googlesheet";
import { countPercentage, toInt } from "@/lib/utils";

export async function fetchPerawatanNormal(range: string): Promise<Perawatan[]> {
    const rows = await fetchSheetData({ range: range });

    return rows
        .filter(row => row[0] != null)
        .map((row) => {
            return {
                bulan: row[0],
                p1: toInt(row[1]),
                rp1: toInt(row[2]),
                p3: toInt(row[3]),
                rp3: toInt(row[4]),
                p6: toInt(row[5]),
                rp6: toInt(row[6]),
                p12: toInt(row[7]),
                rp12: toInt(row[8]),
                persen_1: 0,
                persen_3: 0,
                persen_6: 0,
                persen_12: 0,
            };
        });
}

export async function fetchPerawatanPersen(range: string): Promise<Perawatan[]> {
    const rows = await fetchSheetData({ range: range });

    return rows
        .filter(row => row[0] != null)
        .map((row) => {
            return {
                bulan: row[0],
                p1: toInt(row[1]),
                rp1: toInt(row[2]),
                p3: toInt(row[4]),
                rp3: toInt(row[5]),
                p6: toInt(row[7]),
                rp6: toInt(row[8]),
                p12: toInt(row[10]),
                rp12: toInt(row[11]),
                persen_1: 0,
                persen_3: 0,
                persen_6: 0,
                persen_12: 0,
            };
        });
}