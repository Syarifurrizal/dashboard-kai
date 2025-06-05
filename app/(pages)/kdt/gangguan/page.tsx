"use client";
import GangguanChart from "@/components/gangguan/GangguanChart";
import GangguanChartSkeleton from "@/components/gangguan/GangguanChartSkeleton";
import GangguanTable from "@/components/gangguan/GangguanTable";
import GangguanTableSkeleton from "@/components/gangguan/GangguanTableSkeleton";
import { Gangguan } from "@/lib/definitions";
import { useEffect, useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { gangguanKDGToKDT, mergeGangguan } from "@/lib/utils";

export default function Page() {

    const rangeYKLok = "KDT YK LOK 2025!B22:E33";
    const rangeYKKrd = "KDT YK KRD 2025!B6:D17";
    const rangeSLO = "KDT SLO 2025!B22:E33";

    const [mergedData, setMergeData] = useState<Gangguan[]>([]);

    const [dataYK, setDataYK] = useState<Gangguan[]>([]);
    const [dataYKLok, setDataYKLok] = useState<Gangguan[]>([]);
    const [dataYKKrd, setDataYKKrd] = useState<Gangguan[]>([]);
    const [dataSLO, setDataSLO] = useState<Gangguan[]>([]);

    const [selectedSource, setSelectedSource] = useState<string>('All');

    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            try {
                setError(null);

                const [resYKLok, resYKKrd, resSLO] = await Promise.all([
                    fetch(`/api/gangguan?range=${encodeURIComponent(rangeYKLok)}&type=KDT`),
                    fetch(`/api/gangguan?range=${encodeURIComponent(rangeYKKrd)}&type=KDG`),
                    fetch(`/api/gangguan?range=${encodeURIComponent(rangeSLO)}&type=KDT`),
                ]);

                if (!resYKLok.ok || !resYKKrd.ok || !resSLO.ok) throw new Error("Failed to fetch one or both datasets");


                const [dataYKLok, dataYKKrd, dataSLO]: [Gangguan[], Gangguan[], Gangguan[]] = await Promise.all([
                    resYKLok.json(),
                    resYKKrd.json(),
                    resSLO.json()
                ]);

                setDataYKLok(dataYKLok);
                const dataKRD = gangguanKDGToKDT(dataYKKrd);
                setDataYKKrd(dataKRD);
                setDataSLO(dataSLO);

                const tempMergeYK = mergeGangguan(dataYKLok, dataKRD)
                setDataYK(tempMergeYK);

                const tempMergedData = mergeGangguan(tempMergeYK, dataSLO);
                setMergeData(tempMergedData);

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
    }, [rangeYKLok, rangeYKKrd, rangeSLO]);

    if (error) return <p>Error: {error}</p>;

    const dataMap = {
        "KDT SLO": dataSLO,
        "KDT YK": dataYK,
        "KDT YK LOK": dataYKLok,
        "KDT YK KRD": dataYKKrd,
        "All": mergedData
    } as const;

    type SourceKey = keyof typeof dataMap;

    const data = dataMap[selectedSource as SourceKey] || mergedData;

    return (
        <>
            <main className="w-full flex flex-col gap-4">
                <h1 className="font-bold text-2xl">Gangguan KDT</h1>
                <div className="flex flex-col gap-2">
                    <h1 className="font-medium text-md">Pilih data:</h1>
                    <Select
                        value={selectedSource}
                        onValueChange={(val) => {
                            setSelectedSource(val);
                        }}
                    >
                        <SelectTrigger className="w-fit">
                            <SelectValue placeholder="Pilih sumber data" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="All">Gabungan</SelectItem>
                            <SelectItem value="KDT YK">KDT YK</SelectItem>
                            <SelectItem value="KDT YK LOK">KDT YK LOK</SelectItem>
                            <SelectItem value="KDT YK KRD">KDT YK KRD</SelectItem>
                            <SelectItem value="KDT SLO">KDT SLO</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                {loading ? (
                    <div className="flex flex-col w-full gap-4">
                        <GangguanChartSkeleton />
                        <GangguanTableSkeleton />
                    </div>
                ) : (
                    <div className="flex flex-col w-full gap-4">
                        <GangguanChart data={data} variant="KDT" />
                        <GangguanTable data={data} variant="KDT" />
                    </div>
                )}
            </main>
        </>
    );
}