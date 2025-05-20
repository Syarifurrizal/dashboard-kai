// "use client";

// import { useState, useEffect } from "react";

// export default function Page() {
//   const [rows, setRows] = useState<string[][]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     async function fetchData() {
//       try {
//         const range = 'KDT SLO 2025!A3:F16';
//         const res = await fetch(`/api?range=${encodeURIComponent(range)}`);
//         const data = await res.json();

//         if (data.values) {
//           setRows(data.values);
//         } else {
//           setError('No data found.');
//         }
//       } catch (err) {
//         setError('Failed to load data. ' + (err as Error).message);
//       } finally {
//         setLoading(false);
//       }
//     }

//     fetchData();
//   }, []);

//   return (
//     <>
//       <h1 className="font-medium text-xl">Gangguan</h1>
//     </>
//   );

// }