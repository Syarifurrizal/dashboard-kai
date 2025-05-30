export interface Availability {
    bulan: string;
    armada: number;
    tsgo: number;
    sgo: number;
    tso: number;
    so: number;
    sf: number;
    kirimAsistensi: number;
    terimaAsistensi: number;
    cadangan: number;
    persen_ProgramAvailability: number;
    persen_Availability: number;
    persen_Utilisasi: number;
}

export interface BalanceMovement {
    bulan: string;
    awal: number;
    terima: number;
    pakai: number;
    saldo: number;
}

export interface Gangguan {
    bulan: string,
    toleransi: number,
    realisasi: number,
    toleransiKereta: number,
    realisasiKereta: number,
    toleransiGenset: number,
    realisasiGenset: number,
    toleransiLPT: number,
    realisasiLPT: number,
    realisasiNonLPT: number,
}

export interface Perawatan {
    bulan: string;
    p1: number;
    rp1: number;
    persen_1: number;
    p3: number;
    rp3: number
    persen_3: number;
    p6: number;
    rp6: number
    persen_6: number;
    p12: number;
    rp12: number;
    persen_12: number;
}

export interface SaldoGudang {
    tanggal: string;
    realDate: Date;
    saldo: number;
}