import { BalanceMovement } from "@/lib/definitions";
import { fetchSheetData } from "@/lib/googlesheet";
import { capitalizeFirstLetter, toInt } from "@/lib/utils";

export async function fetchBalanceMovement(range: string): Promise<BalanceMovement[]> {
    const rows = await fetchSheetData({ range: range });

    return rows.map((row) => {
        return {
            bulan: capitalizeFirstLetter(row[0]),
            awal: (toInt(row[1])),
            terima: (toInt(row[2])),
            pakai: (toInt(row[3])),
            saldo: (toInt(row[4])),
        }
    });
}