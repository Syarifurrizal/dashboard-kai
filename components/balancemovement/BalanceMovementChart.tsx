"use client";

import { BalanceMovement } from "@/lib/definitions";
import React from "react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { ChartConfig, ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from "../ui/chart";

import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts"
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
                    <ChartContainer className="max-h-110 w-full" config={chartConfig}>
                        <LineChart
                            accessibilityLayer
                            data={data}
                            margin={{
                                left: 12,
                                right: 12,
                                top: 12,
                            }}
                        >
                            <CartesianGrid vertical={false} />
                            <XAxis
                                dataKey="bulan"
                                tickLine={true}
                                tickFormatter={(value) => value.slice(0, 3)}
                            />
                            <YAxis
                                tickLine={true}
                                tickFormatter={(value) => formatSaldoBesar(Number(value), 1)}
                                domain={[0, maxYValue]}
                                tickCount={6}
                            />

                            <ChartTooltip cursor={true} content={<ChartTooltipContent />} />
                            <ChartLegend content={<ChartLegendContent />} />
                            <Line
                                dataKey="awal"
                                type="linear"
                                stroke="var(--color-awal)"
                                strokeWidth={2}
                                dot={{
                                    fill: "var(--color-awal)",
                                }}
                                activeDot={{
                                    r: 6,
                                }}
                            />
                            <Line
                                dataKey="terima"
                                type="linear"
                                stroke="var(--color-terima)"
                                strokeWidth={2}
                                dot={{
                                    fill: "var(--color-terima)",
                                }}
                                activeDot={{
                                    r: 6,
                                }}
                            />
                            <Line
                                dataKey="pakai"
                                type="linear"
                                stroke="var(--color-pakai)"
                                strokeWidth={2}
                                dot={{
                                    fill: "var(--color-pakai)",
                                }}
                                activeDot={{
                                    r: 6,
                                }}
                            />
                            <Line
                                dataKey="saldo"
                                type="linear"
                                stroke="var(--color-saldo)"
                                strokeWidth={2}
                                dot={{
                                    fill: "var(--color-saldo)",
                                }}
                                activeDot={{
                                    r: 6,
                                }}
                            />
                        </LineChart>
                    </ChartContainer>
                </CardContent>
            </Card>
        </>
    );
}
