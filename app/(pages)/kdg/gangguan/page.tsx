"use client";
import GangguanChart from "@/components/gangguan/GangguanChart";
import GangguanChartSkeleton from "@/components/gangguan/GangguanChartSkeleton";
import GangguanTable from "@/components/gangguan/GangguanTable";
import GangguanTableSkeleton from "@/components/gangguan/GangguanTableSkeleton";
import { Gangguan } from "@/lib/definitions";
import { useEffect, useState } from "react";

export default function Page() {

    const range = "KDG RWL 2025!B21:D32";

    const [data, setData] = useState<Gangguan[]>([]);

    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            try {
                setError(null);

                const res = await fetch(`/api/gangguan?range=${encodeURIComponent(range)}&type=KDG`);

                if (!res.ok) throw new Error("Failed to fetch datasets");

                const json: Gangguan[] = await res.json();
                setData(json);

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
                <h1 className="font-bold text-2xl">Gangguan KDG RWL</h1>
                {loading ? (
                    <div className="flex flex-col w-full gap-4">
                        <GangguanChartSkeleton />
                        <GangguanTableSkeleton />
                    </div>
                ) : (
                    <div className="flex flex-col w-full gap-4">
                        <GangguanChart data={data} variant="KDG" />
                        <GangguanTable data={data} variant="KDG" />
                    </div>
                )}
            </main>
        </>
    );
}