"use client"

import * as React from "react"
import { Label, Pie, PieChart, Sector } from "recharts"
import { PieSectorDataItem } from "recharts/types/polar/Pie"

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    ChartConfig,
    ChartContainer,
    ChartStyle,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

import { Jabatan } from "@/lib/definitions"

function generateDynamicChartConfig(categories: string[]) {
    const baseHue = 220
    const hueStep = 360 / categories.length

    const config: ChartConfig = {}

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
    chartConfig: ChartConfig
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

export function JabatanChart({
    chartData,
    activePenempatan,
    setActivePenempatan,
}: {
    chartData: Jabatan[]
    activePenempatan: string
    setActivePenempatan: (value: string) => void
}) {

    const id = "jabatan-chart-interactive"

    const uniquePenempatans = React.useMemo(
        () => Array.from(new Set(chartData.map((j) => j.penempatan))),
        [chartData]
    )

    const chartConfig = React.useMemo(
        () => generateDynamicChartConfig(uniquePenempatans),
        [chartData, uniquePenempatans]
    )


    const newChartData = React.useMemo(
        () => countPenempatanToArray(chartData, chartConfig),
        [chartData, chartConfig]
    )

    const activeIndex = React.useMemo(
        () => newChartData.findIndex((item) => item.penempatan === activePenempatan),
        [activePenempatan, newChartData]
    )

    return (
        <Card data-chart={id} className="flex flex-col">
            <ChartStyle id={id} config={chartConfig} />
            <CardHeader className="flex-row items-start space-y-0 pb-0">
                <div className="grid gap-1">
                    <CardTitle>Jabatan DAOP 6</CardTitle>
                    <CardDescription>Distribusi pegawai berdasarkan penempatan</CardDescription>
                </div>
            </CardHeader>
            <CardContent className="flex flex-1 flex-col justify-center pb-0">
                <ChartContainer
                    id={id}
                    config={chartConfig}
                    className="mx-auto aspect-square w-full max-w-[300px]"
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
                            innerRadius={60}
                            strokeWidth={5}
                            activeIndex={activeIndex}
                            activeShape={({
                                outerRadius = 0,
                                ...props
                            }: PieSectorDataItem) => (
                                <g>
                                    <Sector {...props} outerRadius={outerRadius + 10} />
                                    <Sector
                                        {...props}
                                        outerRadius={outerRadius + 25}
                                        innerRadius={outerRadius + 12}
                                    />
                                </g>
                            )}
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
                                                    {activePenempatan === "all"
                                                        ? chartData.length.toLocaleString()
                                                        : newChartData[activeIndex]?.jumlah.toLocaleString()}
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
                    </PieChart>
                </ChartContainer>
                <div className="w-full flex justify-center items-center">
                    <Select value={activePenempatan} onValueChange={setActivePenempatan} >
                        <SelectTrigger
                            className="h-fit w-fit rounded-lg pl-2.5"
                            aria-label="Select a value"
                        >
                            <SelectValue placeholder="Pilih penempatan" />
                        </SelectTrigger>
                        <SelectContent align="end" className="rounded-xl">
                            <SelectItem value="all" className="rounded-lg [&_span]:flex">
                                <div className="flex items-center gap-2 text-xs">
                                    <span className="flex h-3 w-3 shrink-0 rounded-xs bg-muted" />
                                    Semua
                                </div>
                            </SelectItem>
                            {uniquePenempatans.map((key) => {
                                const config = chartConfig[key]

                                if (!config) return null

                                return (
                                    <SelectItem
                                        key={key}
                                        value={key}
                                        className="rounded-lg [&_span]:flex"
                                    >
                                        <div className="flex items-center gap-2 text-xs">
                                            <span
                                                className="flex h-3 w-3 shrink-0 rounded-xs"
                                                style={{ backgroundColor: chartConfig[key]?.color }}
                                            />
                                            {config.label}
                                        </div>
                                    </SelectItem>
                                )
                            })}
                        </SelectContent>
                    </Select>
                </div>
            </CardContent>
        </Card>
    )
}
