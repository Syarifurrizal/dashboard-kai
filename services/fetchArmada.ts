import { Armada } from "@/lib/definitions";
import { fetchSheetData } from "@/lib/googlesheet";
import { toInt } from "@/lib/utils";

export async function fetchArmada(range: string, depo: string): Promise<Armada[]> {
    const rows = await fetchSheetData({ range: range });

    return rows
        .filter(row => row[0] != null)
        .map((row) => {
            return {
                jenisKereta: row[0].toUpperCase(),
                depo: depo,
                jumlah: toInt(row[1]),
            };
        });
}