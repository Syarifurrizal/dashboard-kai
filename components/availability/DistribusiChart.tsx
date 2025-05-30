import { Cell, Pie, PieChart } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "../ui/chart";
import { Availability } from "@/lib/definitions";

interface Props {
    chartKey: keyof Availability,
    label: string,
    chartData: Availability[]
}

const chartConfig = {
    Januari: {
        label: "Januari",
        color: "hsl(var(--chart-1))",
    },
    Februari: {
        label: "Februari",
        color: "hsl(var(--chart-3))",
    },
    Maret: {
        label: "Maret",
        color: "hsl(var(--chart-4))",
    },
    April: {
        label: "April",
        color: "hsl(var(--chart-5))",
    },
    Mei: {
        label: "Mei",
        color: "hsl(var(--chart-red-1))",
    },
    Juni: {
        label: "Juni",
        color: "hsl(var(--chart-red-2))",
    },
    Juli: {
        label: "Juli",
        color: "hsl(var(--chart-red-3))",
    },
    Agustus: {
        label: "Agustus",
        color: "hsl(var(--chart-red-4))",
    },
    September: {
        label: "September",
        color: "hsl(var(--chart-green-1))",
    },
    Oktober: {
        label: "Oktober",
        color: "hsl(var(--chart-green-2))",
    },
    November: {
        label: "November",
        color: "hsl(var(--chart-green-3))",
    },
    Desember: {
        label: "Desember",
        color: "hsl(var(--chart-green-4))",
    },
} satisfies ChartConfig


export default function DistribusiChart({ label, chartKey, chartData }: Props) {

    const data = chartData.map(row => ({
        bulan: row.bulan,
        value: row[chartKey] ?? 0,
    }));


    return (
        <>
            <Card className="flex flex-col w-full">
                <CardHeader className="items-center pb-0">
                    <CardTitle>{label}</CardTitle>
                    <CardDescription>Januari - Desember</CardDescription>
                </CardHeader>
                <CardContent className="flex-1 pb-0">
                    <ChartContainer
                        config={chartConfig}
                        className="mx-auto aspect-square"
                    >
                        <PieChart>
                            <ChartTooltip
                                cursor={false}
                                content={<ChartTooltipContent hideLabel />}
                            />
                            <Pie
                                data={data}
                                dataKey="value"
                                nameKey="bulan"
                                innerRadius={40}
                            >
                                {data.map((entry) => {
                                    const color = chartConfig[entry.bulan as keyof typeof chartConfig]?.color ?? "#8884d8";
                                    return <Cell key={entry.bulan} fill={color} />;
                                })}
                            </Pie>
                        </PieChart>
                    </ChartContainer>
                </CardContent>
            </Card>
        </>
    );
}