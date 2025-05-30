"use client";

import { Perawatan } from "@/lib/definitions";
import React from "react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { ChartConfig, ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from "../ui/chart";

import { Bar, BarChart, CartesianGrid, ComposedChart, LabelList, Line, XAxis, YAxis } from "recharts"
import { formatSaldoBesar } from "@/lib/utils";

interface Props {
    data: Perawatan[];
}

const chartConfig = {
    p1: {
        label: "P 1",
        color: "hsl(var(--chart-blue))",
    },
    rp1: {
        label: "RP 1",
        color: "hsl(var(--chart-blue))",
    },
    p3: {
        label: "P 3",
        color: "hsl(var(--chart-green))",
    },
    rp3: {
        label: "RP 3",
        color: "hsl(var(--chart-green))",
    },
    p6: {
        label: "P 6",
        color: "hsl(var(--chart-yellow))",
    },
    rp6: {
        label: "RP 6",
        color: "hsl(var(--chart-yellow))",
    },
    p12: {
        label: "P 12",
        color: "hsl(var(--chart-red))",
    },
    rp12: {
        label: "RP 12",
        color: "hsl(var(--chart-red))",
    },
} satisfies ChartConfig

export default function PerawatanChart({ data }: Props) {

    return (
        <>
            <Card >
                <CardHeader>
                    <CardTitle>Perawatan</CardTitle>
                    <CardDescription>Januari - Desember</CardDescription>
                </CardHeader>
                <CardContent >
                    <ChartContainer config={chartConfig} className="max-h-[450px] w-full">
                        <ComposedChart
                            data={data}
                            margin={{ top: 20, right: 20, bottom: 20, left: 0 }}
                        >
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
                                axisLine={true}
                                tickMargin={10}
                                tickCount={8}
                                tickFormatter={(value) => formatSaldoBesar(Number(value), 1)}
                            />
                            <ChartTooltip
                                cursor={true}
                                content={<ChartTooltipContent indicator="line" />}
                            />
                            <ChartLegend content={<ChartLegendContent />} />

                            {/* Bars */}
                            <Bar dataKey="p1" fill="var(--color-p1)" radius={4} strokeWidth={2} />
                            <Bar dataKey="p3" fill="var(--color-p3)" radius={4} strokeWidth={2} />
                            <Bar dataKey="p6" fill="var(--color-p6)" radius={4} strokeWidth={2} />
                            <Bar dataKey="p12" fill="var(--color-p12)" radius={4} strokeWidth={2} />


                            {/* Lines */}
                            <Line
                                dataKey="rp1"
                                type="linear"
                                stroke="var(--color-rp1)"
                                strokeWidth={2}
                                dot={true}
                            />
                            <Line
                                dataKey="rp3"
                                type="linear"
                                stroke="var(--color-rp3)"
                                strokeWidth={2}
                                dot={true}
                            />
                            <Line
                                dataKey="rp6"
                                type="linear"
                                stroke="var(--color-rp6)"
                                strokeWidth={2}
                                dot={true}
                            />
                            <Line
                                dataKey="rp12"
                                type="linear"
                                stroke="var(--color-rp12)"
                                strokeWidth={2}
                                dot={true}
                            />
                        </ComposedChart>
                    </ChartContainer>
                </CardContent>
            </Card>
        </>
    );
}
