"use client";

import { BalanceMovement } from "@/lib/definitions";
import React from "react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { ChartConfig, ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from "../ui/chart";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
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

export default function BalanceMovementChart({ data }: Props) {

    return (
        <>
            <Card >
                <CardHeader>
                    <CardTitle>Saldo Gudang</CardTitle>
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
                            <ChartTooltip
                                cursor={true}
                                content={<ChartTooltipContent indicator="line" />}
                            />
                            <ChartLegend content={<ChartLegendContent />} />
                            <YAxis
                                tickLine={true}
                                axisLine={true}
                                tickMargin={10}
                                tickCount={8}
                                tickFormatter={(value) => formatSaldoBesar(Number(value), 1)}
                            />
                            <Bar dataKey="awal" fill="var(--color-awal)" radius={4} />
                            <Bar dataKey="terima" fill="var(--color-terima)" radius={4} />
                            <Bar dataKey="pakai" fill="var(--color-pakai)" radius={4} />
                            <Bar dataKey="saldo" fill="var(--color-saldo)" radius={4} />
                        </BarChart>
                    </ChartContainer>
                </CardContent>
            </Card>
        </>
    );
}
