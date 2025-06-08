"use client";

import { JabatanChart } from "@/components/jabatan/JabatanChart";
import JabatanChartSkeleton from "@/components/jabatan/JabatanChartSkeleton";
import JabatanTable from "@/components/jabatan/JabatanTable";
import JabatanTableSkeleton from "@/components/jabatan/JabatanTableSkeleton";
import { Jabatan } from "@/lib/definitions";
import { useEffect, useState } from "react";

export default function Page() {

    const rangePusat = "DAFNOM_FEB!A2:E9";
    const rangeKaryawan = "DAFNOM_FEB!A12:E";

    const [dataCombine, setDataCombine] = useState<Jabatan[]>([]);
    const [dataPusat, setDataPusat] = useState<Jabatan[]>([]);
    const [dataKaryawan, setDataKaryawan] = useState<Jabatan[]>([]);

    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            try {
                setError(null);

                const [res1, res2] = await Promise.all([
                    fetch(`/api/jabatan?range=${encodeURIComponent(rangePusat)}`),
                    fetch(`/api/jabatan?range=${encodeURIComponent(rangeKaryawan)}`)
                ]);

                if (!res1.ok || !res2.ok) throw new Error("Failed to fetch one or both datasets");

                const [dataResPusat, dataResKaryawan]: [Jabatan[], Jabatan[]] = await Promise.all([
                    res1.json(),
                    res2.json(),
                ]);

                setDataPusat(dataResPusat);
                setDataKaryawan(dataResKaryawan);
                setDataCombine([...dataResPusat, ...dataResKaryawan]);

            } catch (err) {
                if (err instanceof Error) {
                    setError(err.message);
                } else {
                    setError('An unknown error occurred');
                }
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, [rangePusat, rangeKaryawan]);


    if (error) return <p>Error: {error}</p>;

    return (

        <>
            <main className="w-full flex flex-col gap-4">
                <h1 className="font-bold text-2xl">Jabatan</h1>
                {loading ? (
                    <div className="flex flex-col w-full gap-4">
                        <JabatanChartSkeleton />
                        <JabatanTableSkeleton />
                        <JabatanTableSkeleton />
                    </div>
                ) : (
                    <div className="flex flex-col w-full gap-4">
                        <JabatanChart chartData={dataCombine} />
                        <JabatanTable title={"Jabatan Pusat"} data={dataPusat} />
                        <JabatanTable title={"Jabatan Lapangan"} data={dataKaryawan} />
                    </div>
                )}
            </main>
        </>
    );
}