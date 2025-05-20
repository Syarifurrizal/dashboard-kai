import { BalanceMovement, SaldoGudang } from "./definitions";
import { parseIndonesianDate } from "./utils";

type QueryParams = {
    sheet: string;
    range: string;
};

const numericKeys = ["awal", "terima", "pakai", "saldo"];

export async function fetchBalanceMovement({ sheet, range }: QueryParams): Promise<BalanceMovement[]> {
    const url = `/api/sheet?sheet=${encodeURIComponent(sheet)}&range=${range}`;
    const res = await fetch(url);
    const rawData = await res.json();

    const converted: BalanceMovement[] = rawData.map((entry: Record<string, string>) => {
        const convertedEntry: Record<string, unknown> = {};

        Object.entries(entry).forEach(([key, value]) => {
            if (numericKeys.includes(key.toLowerCase())) {
                convertedEntry[key] = parseFloat(value.replace(/\./g, '')) || 0;
            } else {
                convertedEntry[key] = value;
            }
        });

        return convertedEntry as BalanceMovement;
    });

    return converted;
}

export async function fetchSaldoGudang({ sheet, range }: QueryParams): Promise<SaldoGudang[]> {
    const url = `/api/sheet?sheet=${encodeURIComponent(sheet)}&range=${encodeURIComponent(range)}`;
    const res = await fetch(url);
    const rawData = await res.json();

    // Log rawData to debug
    console.log("rawData from fetchSaldoGudang", rawData);

    // Determine the actual data array from the response
    // (Prefer values property if exists, else fallback to rawData if it is an array)
    const rows = Array.isArray(rawData.values)
        ? rawData.values
        : Array.isArray(rawData)
            ? rawData
            : [];

    const validRows = rows.filter(row => Array.isArray(row) && row.length >= 2);

    const converted: SaldoGudang[] = validRows.map(([stringTanggal, stringNilai]) => {
        const tanggal = parseIndonesianDate(stringTanggal);
        if (!tanggal) throw new Error(`Invalid date: ${stringTanggal}`);

        const nilai = Number(stringNilai.replace(/^Rp/, '').replace(/\./g, ''));

        return {
            stringTanggal,
            tanggal,
            stringNilai,
            nilai,
        };
    });

    return converted;
}
