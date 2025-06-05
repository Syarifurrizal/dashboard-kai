"use client";

import ArmadaChart from "@/components/armada/ArmadaChart";
import ArmadaChartSkeleton from "@/components/armada/ArmadaChartSkeleton";
import ArmadaTable from "@/components/armada/ArmadaTable";
import ArmadaTableSkeleton from "@/components/armada/ArmadaTableSkeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Armada } from "@/lib/definitions";
import { mergeArmadaArrays } from "@/lib/utils";
import { useEffect, useState } from "react";

export default function Page() {

    const rangekDKYK = "ARMADA!B3:C22";
    const depoKdkYK = "DEPO KERETA YOGYAKARTA";

    const rangekDKSLO = "ARMADA!F3:G23";
    const depoKdkSLO = "DEPO KERETA SOLOBALAPAN";

    const rangekDTYK = "ARMADA!J3:K8";
    const depoKdtYK = "DEPO LOKOMOTIF YOGYAKARTA";

    const rangekDTSLO = "ARMADA!N3:O6";
    const depoKdtSLO = "DEPO LOKOMOTIF SOLOBALAPAN";

    const rangekDGRWL = "ARMADA!R3:S5";
    const depoKdgRWL = "DEPO GERBONG REWULU";

    const [mergedData, setMergeData] = useState<Armada[]>([]);

    const [dataKDKYK, setDataKDKYK] = useState<Armada[]>([]);
    const [dataKDKSLO, setDataKDKSLO] = useState<Armada[]>([]);
    const [dataKDTYK, setDataKDTYK] = useState<Armada[]>([]);
    const [dataKDTSLO, setDataKDTSLO] = useState<Armada[]>([]);
    const [dataKDGRWL, setDataKDGRWL] = useState<Armada[]>([]);

    const [selectedSource, setSelectedSource] = useState<string>('All');

    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            try {
                setError(null);

                const [res1, res2, res3, res4, res5] = await Promise.all([
                    fetch(`/api/armada?range=${encodeURIComponent(rangekDKYK)}&depo=${encodeURIComponent(depoKdkYK)}`),
                    fetch(`/api/armada?range=${encodeURIComponent(rangekDKSLO)}&depo=${encodeURIComponent(depoKdkSLO)}`),
                    fetch(`/api/armada?range=${encodeURIComponent(rangekDTYK)}&depo=${encodeURIComponent(depoKdtYK)}`),
                    fetch(`/api/armada?range=${encodeURIComponent(rangekDTSLO)}&depo=${encodeURIComponent(depoKdtSLO)}`),
                    fetch(`/api/armada?range=${encodeURIComponent(rangekDGRWL)}&depo=${encodeURIComponent(depoKdgRWL)}`),
                ]);

                if (!res1.ok || !res2.ok || !res3.ok || !res4.ok || !res5.ok) throw new Error("Failed to fetch one or both datasets");

                const [dataResKDKYK, dataResKDKSLO, dataResKDTYK, dataResKDTSLO, dataResKDGRWL]: [Armada[], Armada[], Armada[], Armada[], Armada[]] = await Promise.all([
                    res1.json(),
                    res2.json(),
                    res3.json(),
                    res4.json(),
                    res5.json(),
                ]);

                setDataKDKYK(dataResKDKYK);
                setDataKDKSLO(dataResKDKSLO);
                setDataKDTYK(dataResKDTYK);
                setDataKDTSLO(dataResKDTSLO);
                setDataKDGRWL(dataResKDGRWL);

                const tempMergedData = mergeArmadaArrays(dataResKDKYK, dataResKDKSLO, dataResKDTYK, dataResKDTSLO, dataResKDGRWL);
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
    }, [rangekDKYK, rangekDKSLO, rangekDTYK, rangekDTSLO, rangekDGRWL]);


    if (error) return <p>Error: {error}</p>;

    const dataMap = {
        "KDK YK": dataKDKYK,
        "KDK SLO": dataKDKSLO,
        "KDT YK": dataKDTYK,
        "KDT SLO": dataKDTSLO,
        "KDG RWL": dataKDGRWL,
        "All": mergedData
    } as const;

    type SourceKey = keyof typeof dataMap;

    const data = dataMap[selectedSource as SourceKey] || mergedData;

    return (

        <>
            <main className="w-full flex flex-col gap-4">
                <h1 className="font-bold text-2xl">Armada Sarana</h1>
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
                            <SelectItem value="KDT YK">KDT YK</SelectItem>
                            <SelectItem value="KDT SLO">KDT SLO</SelectItem>
                            <SelectItem value="KDG RWL">KDG RWL</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                {loading ? (
                    <div className="flex flex-col w-full gap-4">
                        <ArmadaChartSkeleton />
                        <ArmadaTableSkeleton />
                    </div>
                ) : (
                    <div className="flex flex-col w-full gap-4">
                        <ArmadaChart data={data} />
                        <ArmadaTable data={data} />
                    </div>
                )}
            </main>
        </>
    );
}