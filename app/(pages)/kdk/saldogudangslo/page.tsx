"use client";

import SaldoGudangChart from "@/components/saldogudang/SaldoGudangChart";
import SaldoGudangChartSkeleton from "@/components/saldogudang/SaldoGudangChartSkeleton";
import SaldoGudangTable from "@/components/saldogudang/SaldoGudangTable";
import SaldoGudangTableSkeleton from "@/components/saldogudang/SaldoGudangTableSkeleton";
import SelectBulan from "@/components/SelectBulan";
import { SaldoGudang } from "@/lib/definitions";
import { dateToIDString } from "@/lib/utils";
import { useEffect, useState } from "react";

export default function Page() {
    const range = "SALDO GUDANG KDK SLO!A2:B";

    const [data, setData] = useState<SaldoGudang[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [selectedMonth, setSelectedMonth] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        async function fetchData() {
            try {
                setError(null);
                setLoading(true);

                const res = await fetch(`/api/saldogudang?range=${encodeURIComponent(range)}`);
                if (!res.ok) throw new Error("Failed to fetch data");
                const json: SaldoGudang[] = await res.json();

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


    useEffect(() => {
        if (!selectedMonth) return;

        setLoading(true);
        const timeout = setTimeout(() => {
            setLoading(false);
        }, 300);

        return () => clearTimeout(timeout);
    }, [selectedMonth]);

    if (error) return <p>Error: {error}</p>;

    const normalize = (s: string) => s.trim().toLowerCase();

    const filteredData = selectedMonth === "Semua"
        ? data
        : data.filter(d => {
            const dDate = new Date(d.realDate);
            const monthName = dateToIDString(dDate);
            return normalize(monthName) === normalize(selectedMonth);
        });


    return (
        <main className="w-full flex flex-col gap-4">
            <h1 className="font-bold text-2xl pb-2">Availability KDK SLO</h1>
            <div className="flex flex-col gap-2">
                <h1 className="font-medium text-md">Pilih data:</h1>
                <SelectBulan
                    data={data.map(d => d.realDate)}
                    value={selectedMonth}
                    onChange={setSelectedMonth}
                />
            </div>

            {loading ? (
                <div className="flex flex-col w-full gap-4">
                    <SaldoGudangChartSkeleton />
                    <SaldoGudangTableSkeleton />
                </div>
            ) : (
                <div className="flex flex-col w-full gap-4">
                    <SaldoGudangChart data={filteredData} selected={selectedMonth} />
                    <SaldoGudangTable data={filteredData} />
                </div>
            )}
        </main>
    );
}
