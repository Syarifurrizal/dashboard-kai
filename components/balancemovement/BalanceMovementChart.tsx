"use client";

import { BalanceMovement } from "@/lib/definitions";
import React from "react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { ChartConfig, ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from "../ui/chart";

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"
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
            <Card>
                <CardHeader>
                    <CardTitle>Saldo Gudang</CardTitle>
                    <CardDescription>Januari - Desember</CardDescription>
                </CardHeader>
                <CardContent >
                    <ChartContainer className="max-h-110 w-full" config={chartConfig}>
                        <AreaChart
                            accessibilityLayer
                            data={data}
                            margin={{
                                left: 12,
                                right: 12,
                            }}
                        >
                            <CartesianGrid vertical={false} />
                            <XAxis
                                dataKey="bulan"
                                tickLine={true}
                                axisLine={true}
                                tickMargin={8}
                                tickFormatter={(value) => value.slice(0, 3)}
                            />
                            <YAxis
                                tickLine={true}
                                axisLine={true}
                                tickMargin={10}
                                tickCount={8}
                                tickFormatter={(value) => formatSaldoBesar(Number(value), 1)}
                            />
                            <ChartTooltip cursor={true} content={<ChartTooltipContent />} />
                            <ChartLegend content={<ChartLegendContent />} />
                            <defs>
                                <linearGradient id="fillAwal" x1="0" y1="0" x2="0" y2="1">
                                    <stop
                                        offset="5%"
                                        stopColor="hsl(var(--chart-blue))"
                                        stopOpacity={0.8}
                                    />
                                    <stop
                                        offset="95%"
                                        stopColor="hsl(var(--chart-blue))"
                                        stopOpacity={0.1}
                                    />
                                </linearGradient>
                                <linearGradient id="fillTerima" x1="0" y1="0" x2="0" y2="1">
                                    <stop
                                        offset="5%"
                                        stopColor="hsl(var(--chart-green))"
                                        stopOpacity={0.8}
                                    />
                                    <stop
                                        offset="95%"
                                        stopColor="hsl(var(--chart-green))"
                                        stopOpacity={0.1}
                                    />
                                </linearGradient>
                                <linearGradient id="fillPakai" x1="0" y1="0" x2="0" y2="1">
                                    <stop
                                        offset="5%"
                                        stopColor="hsl(var(--chart-red))"
                                        stopOpacity={0.8}
                                    />
                                    <stop
                                        offset="95%"
                                        stopColor="hsl(var(--chart-red))"
                                        stopOpacity={0.1}
                                    />
                                </linearGradient>
                                <linearGradient id="fillSaldo" x1="0" y1="0" x2="0" y2="1">
                                    <stop
                                        offset="5%"
                                        stopColor="hsl(var(--chart-yellow))"
                                        stopOpacity={0.8}
                                    />
                                    <stop
                                        offset="95%"
                                        stopColor="hsl(var(--chart-yellow))"
                                        stopOpacity={0.1}
                                    />
                                </linearGradient>
                            </defs>
                            <Area
                                dataKey="awal"
                                type="natural"
                                fill="url(#fillAwal)"
                                fillOpacity={0.4}
                                stroke="var(--color-awal)"
                                dot={{
                                    fill: "var(--color-awal)",
                                }}
                                activeDot={{
                                    r: 6,
                                }}
                            />
                            <Area
                                dataKey="terima"
                                type="natural"
                                fill="url(#fillTerima)"
                                fillOpacity={0.4}
                                stroke="var(--color-terima)"
                                dot={{
                                    fill: "var(--color-terima)",
                                }}
                                activeDot={{
                                    r: 6,
                                }}
                            />
                            <Area
                                dataKey="pakai"
                                type="natural"
                                fill="url(#fillPakai)"
                                fillOpacity={0.4}
                                stroke="var(--color-pakai)"
                                dot={{
                                    fill: "var(--color-pakai)",
                                }}
                                activeDot={{
                                    r: 6,
                                }}
                            />
                            <Area
                                dataKey="saldo"
                                type="natural"
                                fill="url(#fillSaldo)"
                                fillOpacity={0.4}
                                stroke="var(--color-saldo)"
                                dot={{
                                    fill: "var(--color-saldo)",
                                }}
                                activeDot={{
                                    r: 6,
                                }}
                            />
                        </AreaChart>
                    </ChartContainer>
                </CardContent>
            </Card>
        </>
    );
}
