"use client";
import PerawatanTable from "@/components/perawatan/PerawatanTable";
import PerawatanTableSkeleton from "@/components/perawatan/PerawatanTableSkeleton";
import { Perawatan } from "@/lib/definitions";
import { mergeAndCalculatePerawatan } from "@/lib/utils";
import { useEffect, useState } from "react";

export default function Page() {

    const range1 = "PERAWATAN KDT YK!AC3:AK14";
    const range2 = "PERAWATAN KDT SLO!AC5:AO16";

    const [data, setData] = useState<Perawatan[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            try {
                setError(null);

                const [res1, res2] = await Promise.all([
                    fetch(`/api/perawatan?range=${encodeURIComponent(range1)}&type=normal`),
                    fetch(`/api/perawatan?range=${encodeURIComponent(range2)}&type=persen`)
                ]);

                if (!res1.ok || !res2.ok) throw new Error("Failed to fetch data");

                const [data1, data2]: [Perawatan[], Perawatan[]] = await Promise.all([
                    res1.json(),
                    res2.json()
                ]);

                const mergedData: Perawatan[] = mergeAndCalculatePerawatan(data1, data2);
                setData(mergedData);
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

    return (
        <>
            <main className="w-full flex flex-col gap-4 p-6">
                {loading ? (
                    <div className="flex flex-col w-full gap-4">
                        <PerawatanTableSkeleton />
                    </div>
                ) : (
                    <div className="flex flex-col w-full gap-4">
                        <PerawatanTable data={data} />
                    </div>
                )}
            </main>
        </>
    );
}