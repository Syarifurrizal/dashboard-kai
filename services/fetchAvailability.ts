import { Availability } from "@/lib/definitions";
import { fetchSheetData } from "@/lib/googlesheet";
import { capitalizeFirstLetter, cleanToAlphabets, toDate, toFloat, toInt } from "@/lib/utils";

export async function fetchAvailability(range: string): Promise<Availability[]> {
    const rows = await fetchSheetData({ range: range });

    return rows.map((row) => {
        const rawBulan = row[0];
        const bulan = typeof rawBulan === 'string' ? cleanToAlphabets(rawBulan) : '';
        const cleanBulan = capitalizeFirstLetter(bulan);

        return {
            bulan: cleanBulan,
            armada: toInt(row[1]),
            tsgo: toInt(row[2]),
            sgo: toInt(row[3]),
            tso: toInt(row[4]),
            so: toInt(row[5]),
            sf: toInt(row[6]),
            asistensi: toInt(row[7]),
            cadangan: toInt(row[9]),
            programAvailability: 0,
            availability: 0,
            utilisasi: 0,
        }
    });
}
