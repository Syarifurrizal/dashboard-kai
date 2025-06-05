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

    const rangeYKLok = "AVAILABILITY LOK KDT YK!AD3:AN14";
    const rangeYKKrd = " AVAILABILITY KRD KDT YK!AC3:AM14";
    const rangeSLO = "AVAILABILITY KDT SLO!T3:AD14";

    const [mergedData, setMergeData] = useState<Availability[]>([]);
    const [mergedDataYK, setMergeDataYK] = useState<Availability[]>([]);

    const [dataYKLok, setDataYKLok] = useState<Availability[]>([]);
    const [dataYKKrd, setDataYKKrd] = useState<Availability[]>([]);
    const [dataSLO, setDataSLO] = useState<Availability[]>([]);

    const [selectedSource, setSelectedSource] = useState<string>('All');

    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            try {
                setError(null);

                const [res1, res2, res3] = await Promise.all([
                    fetch(`/api/availability?range=${encodeURIComponent(rangeYKLok)}`),
                    fetch(`/api/availability?range=${encodeURIComponent(rangeYKKrd)}`),
                    fetch(`/api/availability?range=${encodeURIComponent(rangeSLO)}`)
                ]);

                if (!res1.ok || !res2.ok || !res3.ok) throw new Error("Failed to fetch one or both datasets");

                const [dataResYKLok, dataResYKKrd, dataResSLO]: [Availability[], Availability[], Availability[]] = await Promise.all([
                    res1.json(),
                    res2.json(),
                    res3.json(),
                ]);

                setDataYKLok(calculateAvailabilityPercentages(dataResYKLok));
                setDataYKKrd(calculateAvailabilityPercentages(dataResYKKrd));
                setDataSLO(calculateAvailabilityPercentages(dataResSLO));

                const tempMergedDataYK = mergeAndRecalculatesAvailability(dataResYKLok, dataResYKKrd);
                setMergeDataYK(calculateAvailabilityPercentages(tempMergedDataYK));

                const tempMergedData = mergeAndRecalculatesAvailability(tempMergedDataYK, dataResSLO);
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
        "KDT YK": mergedDataYK,
        "KDT YK LOK": dataYKLok,
        "KDT YK KRD": dataYKKrd,
        "All": mergedData
    } as const;

    type SourceKey = keyof typeof dataMap;

    const data = dataMap[selectedSource as SourceKey] || mergedData;

    return (

        <>
            <main className="w-full flex flex-col gap-4">
                <h1 className="font-bold text-2xl">Availability KDT</h1>
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