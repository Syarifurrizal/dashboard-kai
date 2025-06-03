"use client";

import { useEffect, useState } from "react";

import { Availability } from "@/lib/definitions";
import AvailabilityTable from "@/components/availability/AvailabilityTable";
import AvailabilityTableSkeleton from "@/components/availability/AvailabilityTableSkeleton";
import DistribusiChart from "@/components/availability/DistribusiChart";
import { AvailabilityChart } from "@/components/availability/AvailabilityChart";
import AvailabiltyChartSkeleton from "@/components/availability/AvailabilityChartSkeleton";
import DistribusiChartSkeleton from "@/components/availability/DistribusiChartSkeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { calculateAvailabilityPercentages, mergeAndRecalculatesAvailability } from "@/lib/utils";

export default function Page() {

    const range1 = "AVAILABILITY KDK SLO!S3:AC14";
    const range2 = "AVAILABILITY KDK YK!S3:AC14";

    const [mergedData, setMergeData] = useState<Availability[]>([]);
    const [data1, setData1] = useState<Availability[]>([]);
    const [data2, setData2] = useState<Availability[]>([]);

    const [selectedSource, setSelectedSource] = useState<string>('All');

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

                setData1(calculateAvailabilityPercentages(data1));
                setData2(calculateAvailabilityPercentages(data2));

                const tempMergedData = mergeAndRecalculatesAvailability(data1, data2);
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
                <h1 className="font-bold text-2xl">Availability KDK</h1>
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