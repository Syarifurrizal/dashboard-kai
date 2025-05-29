"use client";

import { SaldoGudang } from "@/lib/definitions";
import { toIDR } from "@/lib/utils";
import React from "react";
import { Table, TableCaption, TableHeader, TableRow, TableHead, TableBody, TableCell } from "../ui/table";
import { Card } from "../ui/card";

interface Props {
    data: SaldoGudang[];
}

export default function SaldoGudangTable({ data }: Props) {

    return (
        <>
            <Card className="p-4">
                <Table>
                    <TableCaption>
                        {data.length === 0 ? ("Tidak ada data.") : ("Data saldo gudang terbaru.")}
                    </TableCaption>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[200px]">Tanggal</TableHead>
                            <TableHead>Saldo</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {
                            data.map((row, i) => (
                                <TableRow key={i}>
                                    <TableCell>{row.tanggal}</TableCell>
                                    <TableCell>{isNaN(row.saldo) ? "Invalid" : toIDR(row.saldo, 2)}</TableCell>
                                </TableRow>
                            ))
                        }
                    </TableBody>
                </Table>
            </Card>
        </>
    );
}
