import { Jabatan } from "@/lib/definitions";
import { fetchSheetData } from "@/lib/googlesheet";
import { toInt } from "@/lib/utils";

export async function fetchJabatan(range: string): Promise<Jabatan[]> {
    const rows = await fetchSheetData({ range: range });

    return rows
        .filter(row => {
            const value = String(row[0] ?? "").trim().toLowerCase();
            return value !== "" && value !== "nipp";
        })
        .map((row) => {
            return {
                nipp: toInt(row[0]),
                nama: row[1] ?? "-",
                posisi: row[2] ?? "-",
                subgroup: row[3] ?? "-",
                penempatan: row[4] ?? "-",
            };
        });
}
