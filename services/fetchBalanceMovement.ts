import { BalanceMovement } from "@/lib/definitions";
import { fetchSheetData } from "@/lib/googlesheet";
import { capitalizeFirstLetter, cleanRupiahToNumber } from "@/lib/utils";

export async function fetchBalanceMovement(range: string): Promise<BalanceMovement[]> {
    const rows = await fetchSheetData({ range: range });

    return rows.map((row) => {
        return {
            bulan: capitalizeFirstLetter(row[0]),
            awal: (cleanRupiahToNumber(row[1])),
            terima: (cleanRupiahToNumber(row[2])),
            pakai: (cleanRupiahToNumber(row[3])),
            saldo: (cleanRupiahToNumber(row[4])),
        }
    });
}