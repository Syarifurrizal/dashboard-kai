"use client";

import { BalanceMovement } from "@/lib/definitions";
import React from "react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { ChartConfig, ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from "../ui/chart";

import { Bar, BarChart, CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts"
import { formatSaldoBesar } from "@/lib/utils";

interface Props {
    data: BalanceMovement[];
}

const chartConfig = {
    awal: {
        label: "Awal",
        color: "hsl(var(--chart-blue))",
    },
    terima: {
        label: "Terima",
        color: "hsl(var(--chart-green))",
    },
    pakai: {
        label: "Pakai",
        color: "hsl(var(--chart-red))",
    },
    saldo: {
        label: "Saldo",
        color: "hsl(var(--chart-yellow))",
    },
} satisfies ChartConfig

export default function BalanceMovementChartBar({ data }: Props) {
    const maxYValue = Math.max(
        ...data.flatMap((item) =>
            [item.awal, item.terima, item.pakai, item.saldo].filter((val) => val > 0)
        )
    );


    return (
        <>
            <Card>
                <CardHeader>
                    <CardTitle>Balance Movement</CardTitle>
                    <CardDescription>Januari - Desember</CardDescription>
                </CardHeader>
                <CardContent >
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
                            <YAxis
                                tickLine={true}
                                tickFormatter={(value) => formatSaldoBesar(Number(value), 1)}
                                domain={[0, maxYValue]}
                                tickCount={6}
                            />
                            <ChartTooltip cursor={true} content={<ChartTooltipContent indicator="line" />} />
                            <ChartLegend content={<ChartLegendContent />} />
                            <YAxis tickLine={true} axisLine={true} />
                            <Bar key="awal" dataKey="awal" fill={chartConfig.awal.color} radius={4} />,
                            <Bar key="terima" dataKey="terima" fill={chartConfig.terima.color} radius={4} />,
                            <Bar key="pakai" dataKey="pakai" fill={chartConfig.pakai.color} radius={4} />,
                            <Bar key="saldo" dataKey="saldo" fill={chartConfig.saldo.color} radius={4} />,
                        </BarChart>
                    </ChartContainer>
                </CardContent>
            </Card>
        </>
    );
}
