export type BalanceMovement = {
    bulan: string,
    awal: number,
    terima: number,
    pakai: number,
    saldo: number,
};

export type SaldoGudang = {
    stringTanggal: string,
    tanggal: Date,
    stringNilai: string,
    nilai: number,
};