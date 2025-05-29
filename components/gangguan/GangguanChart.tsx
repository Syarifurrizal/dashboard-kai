"use client";

import { Gangguan } from "@/lib/definitions";
import React from "react";

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "../ui/card";
import {
    ChartConfig,
    ChartContainer,
    ChartLegend,
    ChartLegendContent,
    ChartTooltip,
    ChartTooltipContent,
} from "../ui/chart";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

interface Props {
    data: Gangguan[];
    variant: "KDK" | "KDT" | "KDG";
}

const chartConfig = {
    toleransi: {
        label: "Toleransi",
        color: "hsl(var(--chart-blue))",
    },
    realisasi: {
        label: "Realisasi",
        color: "hsl(var(--chart-green))",
    },
    toleransiKereta: {
        label: "Toleransi Kereta",
        color: "hsl(var(--chart-blue))",
    },
    realisasiKereta: {
        label: "Realisasi Kereta",
        color: "hsl(var(--chart-red))",
    },
    toleransiGenset: {
        label: "Toleransi Genset",
        color: "hsl(var(--chart-green))",
    },
    realisasiGenset: {
        label: "Realisasi Genset",
        color: "hsl(var(--chart-yellow))",
    },
    toleransiLPT: {
        label: "Toleransi LPT",
        color: "hsl(var(--chart-blue))",
    },
    realisasiLPT: {
        label: "Realisasi LPT",
        color: "hsl(var(--chart-green))",
    },
    realisasiNonLPT: {
        label: "Realisasi Non LPT",
        color: "hsl(var(--chart-yellow))",
    },
} satisfies ChartConfig;

function getBars(variant: Props["variant"]) {
    switch (variant) {
        case "KDK":
            return [
                <Bar key="toleransiKereta" dataKey="toleransiKereta" fill={chartConfig.toleransiKereta.color} radius={4} />,
                <Bar key="realisasiKereta" dataKey="realisasiKereta" fill={chartConfig.realisasiKereta.color} radius={4} />,
                <Bar key="toleransiGenset" dataKey="toleransiGenset" fill={chartConfig.toleransiGenset.color} radius={4} />,
                <Bar key="realisasiGenset" dataKey="realisasiGenset" fill={chartConfig.realisasiGenset.color} radius={4} />,
            ];
        case "KDT":
            return [
                <Bar key="toleransiLPT" dataKey="toleransiLPT" fill={chartConfig.toleransiLPT.color} radius={4} />,
                <Bar key="realisasiLPT" dataKey="realisasiLPT" fill={chartConfig.realisasiLPT.color} radius={4} />,
                <Bar key="realisasiNonLPT" dataKey="realisasiNonLPT" fill={chartConfig.realisasiNonLPT.color} radius={4} />,
            ];
        case "KDG":
        default:
            return [
                <Bar key="toleransi" dataKey="toleransi" fill={chartConfig.toleransi.color} radius={4} />,
                <Bar key="realisasi" dataKey="realisasi" fill={chartConfig.realisasi.color} radius={4} />,
            ];
    }
}


export default function GangguanChart({ data, variant }: Props) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Gangguan</CardTitle>
                <CardDescription>Januari - Desember</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig} className="max-h-[450px] w-full">
                    <BarChart accessibilityLayer data={data}>
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="bulan"
                            tickLine={true}
                            tickMargin={10}
                            axisLine={false}
                            tickFormatter={(value) => value.slice(0, 3)}
                        />
                        <ChartTooltip cursor={true} content={<ChartTooltipContent indicator="line" />} />
                        <ChartLegend content={<ChartLegendContent />} />
                        <YAxis tickLine={true} axisLine={true} />
                        {(() => getBars(variant))()}
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}
