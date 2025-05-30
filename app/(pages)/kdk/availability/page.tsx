"use client";

import { useEffect, useState } from "react";

import { Availability } from "@/lib/definitions";
import AvailabilityTable from "@/components/availability/AvailabilityTable";
import AvailabilityTableSkeleton from "@/components/availability/AvailabilityTableSkeleton";
import { mergeAndCalculateAvailability } from "@/lib/utils";
import DistribusiChart from "@/components/availability/DistribusiChart";
import { AvailabilityChart } from "@/components/availability/AvailabilityChart";
import AvailabiltyChartSkeleton from "@/components/availability/AvailabilityChartSkeleton";
import DistribusiChartSkeleton from "@/components/availability/DistribusiChartSkeleton";

export default function Page() {

    const range1 = "AVAILABILITY KDK SLO!S3:AB14";
    const range2 = "AVAILABILITY KDK YK!S3:AB14";

    const [data, setData] = useState<Availability[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            try {
                setError(null);

                const [res1, res2] = await Promise.all([
                    fetch(`/api/availability?range=${encodeURIComponent(range1)}`),
                    fetch(`/api/availability?range=${encodeURIComponent(range2)}`)
                ]);

                if (!res1.ok || !res2.ok) throw new Error("Failed to fetch one or both datasets");

                const [data1, data2]: [Availability[], Availability[]] = await Promise.all([
                    res1.json(),
                    res2.json()
                ]);

                const mergedData = mergeAndCalculateAvailability(data1, data2);
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
            <main className="w-full flex flex-col gap-4">
                <h1 className="font-bold text-2xl">Availability KDK</h1>
                {loading ? (
                    <div className="flex flex-col w-full gap-4">
                        <div className="flex flex-col md:flex-row w-full gap-4">
                            <DistribusiChartSkeleton />
                            <DistribusiChartSkeleton />
                            <DistribusiChartSkeleton />
                            <DistribusiChartSkeleton />
                            <DistribusiChartSkeleton />
                        </div>
                        <AvailabiltyChartSkeleton />
                        <AvailabilityTableSkeleton />
                    </div>
                ) : (
                    <div className="flex flex-col w-full gap-4">
                        <div className="flex flex-col md:flex-row w-full gap-4">
                            <DistribusiChart chartData={data} chartKey="sf" label="Distribusi SF" />
                            <DistribusiChart chartData={data} chartKey="so" label="Distribusi SO" />
                            <DistribusiChart chartData={data} chartKey="sgo" label="Distribusi SGO" />
                            <DistribusiChart chartData={data} chartKey="tso" label="Distribusi TSO" />
                            <DistribusiChart chartData={data} chartKey="tsgo" label="Distribusi TSGO" />
                        </div>
                        <AvailabilityChart chartTitle="Performa Armada" chartData={data} />
                        <AvailabilityTable data={data} />
                    </div>
                )}
            </main>
        </>
    );
}