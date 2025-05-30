"use client";

import { SaldoGudang } from "@/lib/definitions";
import React from "react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "../ui/chart";

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { formatSaldoBesar, toDate } from "@/lib/utils";

interface Props {
    data: SaldoGudang[];
    selected: string;
}

const chartConfig = {
    saldo: {
        label: "Saldo",
        color: "hsl(var(--chart-1))",
    },
} satisfies ChartConfig

export default function SaldoGudangChart({ data, selected }: Props) {

    return (
        <>
            <Card >
                <CardHeader>
                    <CardTitle>Saldo Gudang</CardTitle>
                    <CardDescription>{selected}</CardDescription>
                </CardHeader>
                <CardContent >
                    <ChartContainer config={chartConfig} className="max-h-[350px] w-full">
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
                                dataKey="tanggal"
                                tickLine={true}
                                tickMargin={10}
                                axisLine={true}
                                tickFormatter={(value: string) => {
                                    const date = toDate(value);
                                    return selected === "Semua"
                                        ? date.toLocaleString("id-ID", { month: "short" })
                                        : date.getDate().toString();
                                }}
                                ticks={
                                    selected === "Semua"
                                        ? Array.from(
                                            new Map(
                                                data.map((item) => {
                                                    const date = toDate(item.tanggal);
                                                    const key = `${date.getFullYear()}-${date.getMonth()}`;
                                                    return [key, item.tanggal]; // keep the first tanggal per month
                                                })
                                            ).values()
                                        ).slice(0, 12)
                                        : undefined
                                }
                            />


                            <ChartTooltip
                                cursor={true}
                                content={<ChartTooltipContent indicator="line" />}
                            />
                            <YAxis
                                tickLine={false}
                                axisLine={true}
                                tickMargin={10}
                                tickCount={8}
                                tickFormatter={(value) => formatSaldoBesar(Number(value), 1)}
                            />
                            <Area
                                dataKey="saldo"
                                type="linear"
                                fill="var(--color-saldo)"
                                fillOpacity={0.4}
                                stroke="var(--color-saldo)"
                            />
                        </AreaChart>
                    </ChartContainer>
                </CardContent>
            </Card>
        </>
    );
}
