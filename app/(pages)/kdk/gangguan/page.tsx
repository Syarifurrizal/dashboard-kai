"use client";
import GangguanChart from "@/components/gangguan/GangguanChart";
import GangguanChartSkeleton from "@/components/gangguan/GangguanChartSkeleton";
import GangguanTable from "@/components/gangguan/GangguanTable";
import GangguanTableSkeleton from "@/components/gangguan/GangguanTableSkeleton";
import { Gangguan } from "@/lib/definitions";
import { useEffect, useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { mergeGangguan } from "@/lib/utils";

export default function Page() {

    const range1 = "KDK YK 2025!B21:F32";
    const range2 = "KDK  SLO 2025!B22:F33";

    const [mergedData, setMergeData] = useState<Gangguan[]>([]);
    const [data1, setData1] = useState<Gangguan[]>([]);
    const [data2, setData2] = useState<Gangguan[]>([]);

    const [selectedSource, setSelectedSource] = useState<string>('All');

    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            try {
                setError(null);

                const [res1, res2] = await Promise.all([
                    fetch(`/api/gangguan?range=${encodeURIComponent(range1)}&type=KDK`),
                    fetch(`/api/gangguan?range=${encodeURIComponent(range2)}&type=KDK`)
                ]);

                if (!res1.ok || !res2.ok) throw new Error("Failed to fetch one or both datasets");


                const [data1, data2]: [Gangguan[], Gangguan[]] = await Promise.all([
                    res1.json(),
                    res2.json()
                ]);

                setData1(data1);
                setData2(data2);

                const tempMergedData = mergeGangguan(data1, data2);
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
    }, [range1, range2]);

    if (error) return <p>Error: {error}</p>;

    const data =
        selectedSource === "KDK SLO"
            ? data1
            : selectedSource === "KDK YK"
                ? data2
                : mergedData

    return (
        <>
            <main className="w-full flex flex-col gap-4">
                <h1 className="font-bold text-2xl">Gangguan KDK</h1>
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
                            <SelectItem value="KDK YK">KDK YK</SelectItem>
                            <SelectItem value="KDK SLO">KDK SLO</SelectItem>
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
                        <GangguanChart data={data} variant="KDK" />
                        <GangguanTable data={data} variant="KDK" />
                    </div>
                )}
            </main>
        </>
    );
}