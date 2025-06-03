"use client";
import BalanceMovementChart from "@/components/balancemovement/BalanceMovementChart";
import BalanceMovementChartSkeleton from "@/components/balancemovement/BalanceMovementChartSkeleton";
import BalanceMovementTable from "@/components/balancemovement/BalanceMovementTable";
import BalanceMovementTableSkeleton from "@/components/balancemovement/BalanceMovementTableSkeleton";
import { BalanceMovement } from "@/lib/definitions";
import { useEffect, useState } from "react";

export default function Page() {

    const range = "KDK YK 2025!B4:F15";

    const [data, setData] = useState<BalanceMovement[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            try {
                setError(null);
                const res = await fetch(`/api/balancemovement?range=${encodeURIComponent(range)}`);
                if (!res.ok) throw new Error("Failed to fetch data");

                const json: BalanceMovement[] = await res.json();
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
<<<<<<<< HEAD:app/(pages)/kdk/balancemovementyk/page.tsx
                <h1 className="font-bold text-2xl">Balance Movement KDK YK</h1>
========
                <h1 className="font-bold text-2xl">Balance Movement KDT YK</h1>
>>>>>>>> develop:app/(pages)/kdt/balancemovementyk/page.tsx
                {loading ? (
                    <div className="flex flex-col w-full gap-4">
                        <BalanceMovementChartSkeleton />
                        <BalanceMovementTableSkeleton />
                    </div>
                ) : (
                    <div className="flex flex-col w-full gap-4">
                        <BalanceMovementChart data={data} />
                        <BalanceMovementTable data={data} />
                    </div>
                )}
            </main>
        </>
    );
}