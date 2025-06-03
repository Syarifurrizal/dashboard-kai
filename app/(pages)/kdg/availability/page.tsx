"use client";

import { useEffect, useState } from "react";

import { Availability } from "@/lib/definitions";
import AvailabilityTable from "@/components/availability/AvailabilityTable";
import AvailabilityTableSkeleton from "@/components/availability/AvailabilityTableSkeleton";
import DistribusiChart from "@/components/availability/DistribusiChart";
import { AvailabilityChart } from "@/components/availability/AvailabilityChart";
import AvailabiltyChartSkeleton from "@/components/availability/AvailabilityChartSkeleton";
import DistribusiChartSkeleton from "@/components/availability/DistribusiChartSkeleton";
import { calculateAvailabilityPercentages } from "@/lib/utils";

export default function Page() {

    const range = "AVAILABILITY KDG RWL!S3:AC14";

    const [data, setData] = useState<Availability[]>([]);

    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            try {
                setError(null);

                const res = await fetch(`/api/availability?range=${encodeURIComponent(range)}`);

                if (!res.ok) throw new Error("Failed to fetch datasets");

                const json: Availability[] = await res.json();
                setData(calculateAvailabilityPercentages(json));

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
                <h1 className="font-bold text-2xl">Availability KDG RWL</h1>
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