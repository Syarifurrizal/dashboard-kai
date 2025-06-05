"use client";

import React from "react";

import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from "../ui/chart";

import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis } from "recharts";
import { Armada } from "@/lib/definitions";

interface Props {
    data: Armada[];
}

const chartConfig = {
    "DEPO KERETA YOGYAKARTA": {
        label: "Kereta Yogyakarta",
        color: "hsl(var(--chart-blue))",
    },
    "DEPO KERETA SOLOBALAPAN": {
        label: "Kereta Solobalapan",
        color: "hsl(var(--chart-green))",
    },
    "DEPO LOKOMOTIF YOGYAKARTA": {
        label: "Lokomotif Yogyakarta",
        color: "hsl(var(--chart-red))",
    },
    "DEPO LOKOMOTIF SOLOBALAPAN": {
        label: "Lokomotif Solobalapan",
        color: "hsl(var(--chart-yellow))",
    },
    "DEPO GERBONG REWULU": {
        label: "Gerbong Rewulu",
        color: "#8B5CF6",
    },
};


export default function ArmadaChart({ data }: Props) {

    interface GroupedEntry {
        jenisKereta: string;
        [depo: string]: string | number;
    }

    const grouped = new Map<string, GroupedEntry>();

    for (const item of data) {
        const key = item.jenisKereta;
        const existing = grouped.get(key) ?? { jenisKereta: key } as GroupedEntry;
        existing[item.depo] = ((existing[item.depo] as number) ?? 0) + item.jumlah;
        grouped.set(key, existing);
    }


    // Convert Map to Array
    let chartData = Array.from(grouped.values());

    // Calculate total stack for each bar and add 'total' property
    chartData = chartData.map((entry) => {
        const total = Object.keys(chartConfig).reduce((sum, depo) => {
            const value = entry[depo];
            return sum + (typeof value === "number" ? value : 0);
        }, 0);
        return { ...entry, total };
    });

    const depoList = Object.keys(chartConfig);

    return (
        <Card>
            <CardHeader>
                <CardTitle>Grafik Armada</CardTitle>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig} className="max-h-[450px] w-full">
                    <BarChart accessibilityLayer data={chartData}>
                        <CartesianGrid vertical={false} />
                        <XAxis dataKey="jenisKereta" tickLine={false} axisLine={false} tickMargin={10} />
                        <YAxis tickLine={false} axisLine={false} />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <ChartLegend content={<ChartLegendContent />} />
                        {depoList.map((depo, index) => (

                            <Bar
                                key={depo}
                                dataKey={depo}
                                stackId="a"
                                fill={(chartConfig as Record<string, { label: string; color: string }>)[depo]?.color}
                            >
                                {index === depoList.length - 1 && (
                                    <LabelList
                                        dataKey="total"
                                        position="top"
                                        formatter={(value: number) => value.toString()}
                                    />
                                )}
                            </Bar>
                        ))}
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}