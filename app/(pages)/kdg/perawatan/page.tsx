"use client";
import PerawatanChart from "@/components/perawatan/PerawatanChart";
import PerawatanChartSkeleton from "@/components/perawatan/PerawatanChartSkeleton";
import PerawatanTable from "@/components/perawatan/PerawatanTable";
import PerawatanTableSkeleton from "@/components/perawatan/PerawatanTableSkeleton";
import { Perawatan } from "@/lib/definitions";
import { calculatePerawatanPercentage } from "@/lib/utils";
import { useEffect, useState } from "react";

export default function Page() {

    const range = "PERAWATAN KDG RWL!AC4:AO15";
    const [data, setData] = useState<Perawatan[]>([]);

    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            try {
                setError(null);

                const res = await fetch(`/api/perawatan?range=${encodeURIComponent(range)}&type=persen`);

                if (!res.ok) throw new Error("Failed to fetch data");
                const json: Perawatan[] = await res.json();

                setData(calculatePerawatanPercentage(json));

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
    }, [range]);


    if (error) return <p>Error: {error}</p>;

    return (
        <>
            <main className="w-full flex flex-col gap-4">
                <h1 className="font-bold text-2xl">Perawatan KDG</h1>
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