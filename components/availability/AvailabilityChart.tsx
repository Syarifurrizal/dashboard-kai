"use client";

import { CartesianGrid, XAxis, YAxis, Bar, LabelList, Cell, BarChart, } from "recharts";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, } from "../ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent, } from "../ui/chart";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from "../ui/select";
import { Availability } from "@/lib/definitions";
import { useEffect, useState, useMemo } from "react";

const colorCycle = ["hsl(var(--chart-1))", "hsl(var(--chart-2))", "hsl(var(--chart-3))", "hsl(var(--chart-4))"];

interface Props {
    chartTitle: string;
    chartData: Availability[];
}

export function AvailabilityChart({ chartTitle, chartData }: Props) {

    const [selectedMonthName, setSelectedMonthName] = useState<string>("");

    const availableMonthNames = useMemo(() => {
        const unique = Array.from(new Set(chartData.map(item => item.bulan)));
        return unique;
    }, [chartData]);

    useEffect(() => {
        if (availableMonthNames.length > 0 && !selectedMonthName) {
            const now = new Date();

            const formatter = new Intl.DateTimeFormat("id-ID", {
                month: "long",
            });

            const currentMonthName = formatter.format(now);

            const matchedMonth = availableMonthNames.find(
                (bulan) => bulan.toLowerCase() === currentMonthName.toLowerCase()
            );

            setSelectedMonthName(matchedMonth || availableMonthNames[0]);
        }
    }, [availableMonthNames, selectedMonthName]);

    const selectedMonthData = chartData.find((item) => item.bulan === selectedMonthName);

    const barChartData = selectedMonthData
        ? [
            { jenisPerforma: "Armada", nilaiPerforma: selectedMonthData.armada },
            { jenisPerforma: "Kirim Asistensi", nilaiPerforma: selectedMonthData.kirimAsistensi },
            { jenisPerforma: "Terima Asistensi", nilaiPerforma: selectedMonthData.terimaAsistensi },
            { jenisPerforma: "Cadangan", nilaiPerforma: selectedMonthData.cadangan },
        ]
        : [];

    return (
        <Card>
            <CardHeader>
                <div className="flex flex-col gap-4 items-start">
                    <CardTitle>{chartTitle}</CardTitle>
                    <Select
                        value={selectedMonthName}
                        onValueChange={(val) => setSelectedMonthName(val)}
                    >
                        <SelectTrigger className="w-[140px]">
                            <SelectValue placeholder="Pilih Bulan" />
                        </SelectTrigger>
                        <SelectContent>
                            {availableMonthNames.map((monthName) => (
                                <SelectItem key={monthName} value={monthName}>
                                    {monthName}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <CardDescription className="text-center">
                    {selectedMonthName || "Tidak ada bulan yang dipilih"}
                </CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
                <ChartContainer config={{}} className="h-full w-full">
                    <BarChart data={barChartData}>
                        <CartesianGrid vertical={false} />
                        <XAxis dataKey="jenisPerforma" tickLine={false} tickMargin={10} axisLine={false} />
                        <YAxis />
                        <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                        <Bar dataKey="nilaiPerforma" radius={8} isAnimationActive={true}>
                            <LabelList
                                dataKey="nilaiPerforma"
                                position="inside"
                                offset={12}
                                fill="white"
                                fontSize={12}
                            />
                            {barChartData.map((_, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={colorCycle[index % colorCycle.length]}
                                />
                            ))}
                        </Bar>
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}
