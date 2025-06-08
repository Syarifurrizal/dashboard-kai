"use client"

import { ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from "../ui/chart"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Label, Pie, PieChart } from "recharts";
import React from "react";
import { Jabatan } from "@/lib/definitions";

function generateDynamicChartConfig(categories: string[]) {
    const baseHue = 220
    const hueStep = 360 / categories.length

    const config: Record<string, { label: string; color: string }> = {}

    categories.forEach((category, index) => {
        const hue = Math.round((baseHue + index * hueStep) % 360)
        config[category] = {
            label: category,
            color: `hsl(${hue}, 70%, 50%)`,
        }
    })

    return config
}


function countPenempatanToArray(
    jabatanList: Jabatan[],
    chartConfig: Record<string, { label: string; color: string }>
) {
    const counts = jabatanList.reduce((acc, item) => {
        acc[item.penempatan] = (acc[item.penempatan] || 0) + 1
        return acc
    }, {} as Record<string, number>)

    return Object.entries(counts).map(([penempatan, jumlah]) => ({
        penempatan,
        jumlah,
        fill: chartConfig[penempatan]?.color ?? "#ccc",
    }))
}



export function JabatanChart({ chartData }: { chartData: Jabatan[] }) {

    const uniquePenempatans = Array.from(
        new Set(chartData.map((j) => j.penempatan))
    )

    const chartConfig = React.useMemo(
        () => generateDynamicChartConfig(uniquePenempatans),
        [chartData]
    )

    const newChartData = countPenempatanToArray(chartData, chartConfig)

    return (
        <Card>
            <CardHeader>
                <CardTitle>Jabatan DAOP 6</CardTitle>
                <CardDescription>Menampilkan daftar karyawan</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 pb-0">
                <ChartContainer
                    className="mx-auto aspect-square max-h-[450px]"
                    config={chartConfig}
                >
                    <PieChart>
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent hideLabel />}
                        />
                        <Pie
                            data={newChartData}
                            dataKey="jumlah"
                            nameKey="penempatan"
                            innerRadius={80}
                            strokeWidth={5}
                        >
                            <Label
                                content={({ viewBox }) => {
                                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                                        return (
                                            <text
                                                x={viewBox.cx}
                                                y={viewBox.cy}
                                                textAnchor="middle"
                                                dominantBaseline="middle"
                                            >
                                                <tspan
                                                    x={viewBox.cx}
                                                    y={viewBox.cy}
                                                    className="fill-foreground text-3xl font-bold"
                                                >
                                                    {chartData.length.toLocaleString()}
                                                </tspan>
                                                <tspan
                                                    x={viewBox.cx}
                                                    y={(viewBox.cy || 0) + 24}
                                                    className="fill-muted-foreground"
                                                >
                                                    Pegawai
                                                </tspan>
                                            </text>
                                        )
                                    }
                                }}
                            />
                        </Pie>
                        <ChartLegend
                            content={<ChartLegendContent nameKey="penempatan" />}
                            className="-translate-y-2 flex-wrap gap-2 *:basis-1/4 *:justify-center"
                        />
                    </PieChart>
                </ChartContainer>
            </CardContent>
        </Card >
    )
}