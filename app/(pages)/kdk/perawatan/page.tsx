"use client";

import { useState, useEffect } from "react";

export default function Page() {
  const [rows, setRows] = useState<string[][]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const rangeYK = 'PERAWATAN KDK YK!AC2:AO16';
        const rangeSLO = 'PERAWATAN KDK SLO!AC2:AO16';

        const [resYK, resSLO] = await Promise.all([
          fetch(`/api?range=${encodeURIComponent(rangeYK)}`),
          fetch(`/api?range=${encodeURIComponent(rangeSLO)}`)
        ]);

        const [dataYK, dataSLO] = await Promise.all([
          resYK.json(),
          resSLO.json()
        ]);

        const valuesYK = dataYK.values || [];
        const valuesSLO = dataSLO.values || [];

        const header = valuesYK[0];
        const bodyYK = valuesYK.slice(1);
        const bodySLO = valuesSLO.slice(1);

        const result: string[][] = [];

        for (let i = 0; i < bodyYK.length; i++) {
          const rowYK = bodyYK[i];
          const rowSLO = bodySLO[i];

          const rowResult: string[] = [];

          for (let j = 0; j < rowYK.length; j++) {
            if (j === 0) {
              rowResult.push(rowYK[j]); // Nama layanan
            } else if (header[j].includes('%')) {
              rowResult.push(rowYK[j]); // Ambil persen dari YK saja
            } else {
              const numYK = parseFloat(rowYK[j] || '0');
              const numSLO = parseFloat(rowSLO?.[j] || '0');
              rowResult.push((numYK + numSLO).toString());
            }
          }

          result.push(rowResult);
        }

        setRows([header, ...result]);
      } catch (err) {
        setError('Failed to load data. ' + (err as Error).message);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  return (
    <main style={{ padding: '2rem' }}>
      <h1>Rekap Bulanan Gabungan</h1>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {!loading && !error && (
        <table border={1} cellPadding={10}>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i}>
                {row.map((cell, j) => (
                  <td key={j}>{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  );
}
