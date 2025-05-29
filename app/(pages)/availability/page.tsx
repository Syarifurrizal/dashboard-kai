"use client";
import { useEffect, useState } from "react";

import { Availability } from "@/lib/definitions";
import AvailabilityTable from "@/components/availability/AvailabilityTable";
import AvailabilityTableSkeleton from "@/components/availability/AvailabilityTableSkeleton";
import { mergeAndCalculateAvailability } from "@/lib/utils";

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
            <main className="w-full flex flex-col gap-4 p-6">
                {loading ? (
                    <div className="flex flex-col w-full gap-4">
                        <AvailabilityTableSkeleton />
                    </div>
                ) : (
                    <div className="flex flex-col w-full gap-4">
                        <AvailabilityTable data={data} />
                    </div>
                )}
            </main>
        </>
    );
}