
import { SaldoGudang } from "@/lib/definitions";
import { fetchSheetData } from "@/lib/googlesheet";
import { toDate, toInt } from "@/lib/utils";

export async function fetchSaldoGudang(range: string): Promise<SaldoGudang[]> {
    const rows = await fetchSheetData({ range: range });

    // Filter out rows with empty date or saldo before map
    const filteredRows = rows.filter(row => {
        // row[0] should be non-empty string and valid date
        if (!row[0]) return false;
        const date = toDate(row[0]);
        if (!date || isNaN(date.getTime())) return false;

        // row[1] should not be empty or null; or you may allow zero saldo rows if needed
        if (!row[1] || row[1].toString().trim() === "") return false;

        return true;
    });

    return filteredRows.map(row => {
        return {
            tanggal: row[0],
            realDate: toDate(row[0]),
            saldo: toInt(row[1]),
        };
    });
}
