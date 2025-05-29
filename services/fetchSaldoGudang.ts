
import { SaldoGudang } from "@/lib/definitions";
import { fetchSheetData } from "@/lib/googlesheet";
import { toDate, toInt } from "@/lib/utils";

export async function fetchSaldoGudang(range: string): Promise<SaldoGudang[]> {
    const rows = await fetchSheetData({ range: range });

    return rows.map((row) => {
        const date = toDate(row[0]);

        return {
            tanggal: row[0],
            realDate: date,
            saldo: row[1] == null ? 0 : toInt(row[1]),
        }
    });
}