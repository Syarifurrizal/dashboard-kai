"use client";

import { Table, TableCaption, TableHeader, TableRow, TableHead, TableBody, TableCell } from "../ui/table";
import { Card } from "../ui/card";

import { Gangguan } from "@/lib/definitions";
import React from "react";

interface Props {
    data: Gangguan[];
    variant: "KDK" | "KDT" | "KDG";
}

export default function GangguanTable({ data, variant }: Props) {
    const renderHeaders = () => {
        const base = [
            "Bulan",
        ];

        const map: Record<string, string[]> = {
            KDK: [
                "Toleransi Kereta", "Realisasi Kereta",
                "Toleransi Genset", "Realisasi Genset",
            ],
            KDT: [
                "Toleransi LPT", "Realisasi LPT", "Realisasi Non LPT",
            ],
            KDG: [
                "Toleransi", "Realisasi",
            ]
        };

        return [...base, ...(map[variant] || [])];
    };

    const renderRow = (row: Gangguan, index: number) => {
        const base = [
            <TableCell key={`bulan-${index}`}>{row.bulan}</TableCell>,
        ];

        const map: Record<string, React.ReactNode[]> = {
            KDK: [
                <TableCell key={`tk-${index}`}>{row.toleransiKereta}</TableCell>,
                <TableCell key={`rk-${index}`}>{row.realisasiKereta}</TableCell>,
                <TableCell key={`tg-${index}`}>{row.toleransiGenset}</TableCell>,
                <TableCell key={`rg-${index}`}>{row.realisasiGenset}</TableCell>,
            ],
            KDT: [
                <TableCell key={`tlpt-${index}`}>{row.toleransiLPT}</TableCell>,
                <TableCell key={`rlpt-${index}`}>{row.realisasiLPT}</TableCell>,
                <TableCell key={`rnlpt-${index}`}>{row.realisasiNonLPT}</TableCell>,
            ],
            KDG: [
                <TableCell key={`tol-${index}`}>{row.toleransi}</TableCell>,
                <TableCell key={`real-${index}`}>{row.realisasi}</TableCell>,
            ],
        };

        return [...base, ...(map[variant] || [])];
    };

    return (
        <>
            <Card className="p-4">
                <Table>
                    <TableCaption>
                        {data.length === 0 ? ("Tidak ada data.") : ("Data gangguan terbaru.")}
                    </TableCaption>
                    <TableHeader>
                        <TableRow>
                            {renderHeaders().map((header, i) => (
                                <TableHead key={i}>{header}</TableHead>
                            ))}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data.length === 0 ? (
                            <TableRow>
                                <TableCell>
                                    No items or data available.
                                </TableCell>
                            </TableRow>
                        ) : (
                            data.map((row, i) => (
                                <TableRow key={i}>
                                    {renderRow(row, i)}
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </Card>
        </>
    );
}
