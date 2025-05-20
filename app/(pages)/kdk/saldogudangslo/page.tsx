"use client";

import { parseIndonesianDate } from "@/lib/utils";
import { useState, useEffect } from "react";
import { AreaChart, Area, XAxis, CartesianGrid, ResponsiveContainer } from "recharts";

export type SaldoGudang = {
  stringTanggal: string,
  tanggal: Date,
  stringNilai: string,
  nilai: number,
};

export default function Page() {
  const [data, setData] = useState<SaldoGudang[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const range = 'SALDO GUDANG KDK SLO!A1:B367';
        const res = await fetch(`/api?range=${encodeURIComponent(range)}`);
        const result = await res.json();

        if (result.values && result.values.length > 1) {
          const [...rows] = result.values;

          const parsed: SaldoGudang[] = rows
            .filter((row: (string | string)[]) => row.length >= 2 && row[0] && row[1])
            .map(([tanggalStr, nilaiStr]: [string, string]) => {
              // Buang "Rp" dan titik dari nilaiStr, lalu parse ke number
              const nilai = Number(nilaiStr.replace(/[^0-9]/g, ''));

              return {
                stringTanggal: tanggalStr,
                tanggal: parseIndonesianDate(tanggalStr), // parseIndonesianDate harus hasilkan string yang bisa diparse Date()
                stringNilai: nilaiStr,
                nilai, // numeric untuk chart
              };
            });



          setData(parsed);
        } else {
          setError("No data found.");
        }
      } catch (err) {
        setError("Failed to load data. " + (err as Error).message);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  return (
    <main style={{ padding: '2rem' }}>
      <h1>Saldo Gudang KDK SLO</h1>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {!loading && !error && (
        <>
          <div style={{ width: "100%", height: 400 }}>
            <ResponsiveContainer>
              <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorSaldo" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="stringTanggal" tickFormatter={(val) => val?.slice?.(0, 10)} />
                <Area
                  type="monotone"
                  dataKey="nilai"
                  stroke="#8884d8"
                  fillOpacity={1}
                  fill="url(#colorSaldo)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <table border={1} cellPadding={10} style={{ marginTop: "2rem", width: "100%" }}>
            <thead>
              <tr>
                <th>Tanggal</th>
                <th>Saldo</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, i) => (
                <tr key={i}>
                  <td>{item.stringTanggal}</td>
                  <td>{item.stringNilai}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </main>
  );
}
