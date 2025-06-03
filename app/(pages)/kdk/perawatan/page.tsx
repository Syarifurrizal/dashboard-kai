"use client";
import PerawatanChart from "@/components/perawatan/PerawatanChart";
import PerawatanChartSkeleton from "@/components/perawatan/PerawatanChartSkeleton";
import PerawatanTable from "@/components/perawatan/PerawatanTable";
import PerawatanTableSkeleton from "@/components/perawatan/PerawatanTableSkeleton";
import { Perawatan } from "@/lib/definitions";
import { calculatePerawatanPercentage, mergeAndRecalculatePerawatan } from "@/lib/utils";
import { useEffect, useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function Page() {

    const range1 = "PERAWATAN KDK YK!AC4:BG20";
    const range2 = "PERAWATAN KDK SLO!AC4:AO15";

    const [mergedData, setMergeData] = useState<Perawatan[]>([]);
    const [data1, setData1] = useState<Perawatan[]>([]);
    const [data2, setData2] = useState<Perawatan[]>([]);

    const [selectedSource, setSelectedSource] = useState<string>('All');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            try {
                setError(null);

                const [res1, res2] = await Promise.all([
                    fetch(`/api/perawatan?range=${encodeURIComponent(range1)}&type=persen`),
                    fetch(`/api/perawatan?range=${encodeURIComponent(range2)}&type=persen`)
                ]);

                if (!res1.ok || !res2.ok) throw new Error("Failed to fetch data");

                const [data1, data2]: [Perawatan[], Perawatan[]] = await Promise.all([
                    res1.json(),
                    res2.json()
                ]);

                setData1(calculatePerawatanPercentage(data1));
                setData2(calculatePerawatanPercentage(data2));

                const tempMergedData = mergeAndRecalculatePerawatan(data1, data2);
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
        selectedSource === "KDK YK"
            ? data1
            : selectedSource === "KDK SLO"
                ? data2
                : mergedData

    return (
        <>
            <main className="w-full flex flex-col gap-4">
                <h1 className="font-bold text-2xl">Perawatan KDK</h1>
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
                        <PerawatanChartSkeleton />
                        <PerawatanTableSkeleton />
                    </div>
                ) : (
                    <div className="flex flex-col w-full gap-4">
                        <PerawatanChart data={data} />
                        <PerawatanTable data={data} />
                    </div>
                )}
            </main>
        </>
    );
}