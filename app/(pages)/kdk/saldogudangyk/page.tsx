'use client';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { fetchBalanceMovement } from '@/lib/datas';
import { BalanceMovement } from '@/lib/definitions';
import { formatSaldoBesar, toIDR } from '@/lib/utils';
import { TrendingUp } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts';

const chartConfig = {
  saldo: {
    label: "Saldo",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

export default function Page() {
  const [chartData, setData] = useState<BalanceMovement[]>([])

  useEffect(() => {
    const fetchData = async () => {
      const fetchedData = await fetchBalanceMovement({
        sheet: "KDK YK 2025",
        range: "A3:F15"
      });
      setData(fetchedData);
    };

    fetchData();
  }, []);

  const totalAwal = chartData.reduce((acc, cur) => acc + (cur.awal ?? 0), 0);
  const totalTerima = chartData.reduce((acc, cur) => acc + (cur.terima ?? 0), 0);
  const totalPakai = chartData.reduce((acc, cur) => acc + (cur.pakai ?? 0), 0);
  const totalSaldo = chartData.reduce((acc, cur) => acc + (cur.saldo ?? 0), 0);

  if (!chartData.length) return <p>Loading...</p>;

  return (
    <>
      <div className='w-full h-fit flex flex-col gap-4'>
        <Card>
          <CardHeader>
            <CardTitle>Area Chart</CardTitle>
            <CardDescription>
              Showing total visitors for the last 6 months
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className='w-full h-90'>
              <AreaChart
                accessibilityLayer
                data={chartData}
                margin={{ left: 12, right: 12 }}
              >
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="bulan"
                  type='category'
                  tickLine={true}
                  axisLine={true}
                  tickMargin={8}
                  tickFormatter={(value) => value?.slice?.(0, 3) ?? ""}
                />
                <YAxis
                  dataKey="saldo"
                  type="number"
                  tickFormatter={(value) => formatSaldoBesar(value)}

                />
                <ChartTooltip
                  cursor={true}
                  content={<ChartTooltipContent indicator="line" />}
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
        </Card >
        <Card>
          <CardHeader>
            <CardTitle>Table</CardTitle>
            <CardDescription>
              Showing total visitors for the last 6 months
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Bulan</TableHead>
                  <TableHead>Awal</TableHead>
                  <TableHead>Terima</TableHead>
                  <TableHead>Pakai</TableHead>
                  <TableHead>Saldo</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {chartData.map((item) => (
                  <TableRow key={item.bulan}>
                    <TableCell>{item.bulan}</TableCell>
                    <TableCell>{toIDR(item.awal)}</TableCell>
                    <TableCell>{toIDR(item.terima)}</TableCell>
                    <TableCell>{toIDR(item.pakai)}</TableCell>
                    <TableCell>{toIDR(item.saldo)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>

            </Table>
            <div>
              <Separator className="my-4" />
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell className='font-semibold'>Grand Total</TableCell>
                    <TableCell>{toIDR(totalAwal)}</TableCell>
                    <TableCell>{toIDR(totalTerima)}</TableCell>
                    <TableCell>{toIDR(totalPakai)}</TableCell>
                    <TableCell>{toIDR(totalSaldo)}</TableCell>
                  </TableRow>
                </TableBody>

              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
