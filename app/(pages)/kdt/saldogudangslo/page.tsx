"use client";

import { TrendingUp } from "lucide-react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { useEffect, useState } from "react";
const chartConfig = {
  desktop: {
    label: "Nilai Saldo Gudang",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig

type ChartRow = {
  [key: string]: string | number;
};

export default function Component() {
  const [chartData, setChartData] = useState<ChartRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const range = 'SALDO GUDANG KDT SLO!A1:B367';
        const res = await fetch(`/api?range=${encodeURIComponent(range)}`);
        const data = await res.json();

        if (data.values) {
          const headers: string[] = data.values[0];
          const rows: string[][] = data.values.slice(1);

          const parsedData = rows.map((row: string[]) => {
            return {
              [headers[0]]: row[0],
              [headers[1]]: Number(row[1]?.replace(/[^0-9]/g, "")),
            };
          });

          setChartData(parsedData);
        } else {
          setError('No data found.');
        }
      } catch (err) {
        setError('Failed to load data. ' + (err as Error).message);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);


  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;


  return (
    <>
      <div>
        <Card>
          <CardHeader>
            <CardTitle>Area Chart</CardTitle>
            <CardDescription>
              Showing total visitors for the last 6 months
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig}>
              <AreaChart
                accessibilityLayer
                data={chartData}
                margin={{
                  left: 12,
                  right: 12,
                }}
              >
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="Time"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tickFormatter={(value) => value.slice(0, 3)}
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent indicator="line" />}
                />
                <Area
                  dataKey="Nilai Saldo Gudang"
                  type="natural"
                  fill="oklch(0.488 0.243 264.376)"
                  fillOpacity={0.4}
                  stroke="hsl(var(--chart-1))"
                />
              </AreaChart>
            </ChartContainer>
          </CardContent>
          <CardFooter>
            <div className="flex w-full items-start gap-2 text-sm">
              <div className="grid gap-2">
                <div className="flex items-center gap-2 font-medium leading-none">
                  Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
                </div>
                <div className="flex items-center gap-2 leading-none text-muted-foreground">
                  January - June 2024
                </div>
              </div>
            </div>
          </CardFooter>
        </Card>
      </div>

    </>
  )
}
