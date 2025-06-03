"use client";

import { BalanceMovement } from "@/lib/definitions";
import React from "react";

import { Table, TableCaption, TableHeader, TableRow, TableHead, TableBody, TableCell } from "../ui/table";
import { Card } from "../ui/card";
import { toIDR } from "@/lib/utils";

interface Props {
    data: BalanceMovement[];
}

export default function BalanceMovementTable({ data }: Props) {

    return (
        <>
            <Card className="p-4">
                <Table>
                    <TableCaption>
                        {data.length === 0 ? ("Tidak ada data.") : ("Data balance movement terbaru.")}
                    </TableCaption>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[200px]">Bulan</TableHead>
                            <TableHead>Awal</TableHead>
                            <TableHead>Terima</TableHead>
                            <TableHead>Pakai</TableHead>
                            <TableHead>Saldo</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {
                            data.map((row, i) => (
                                <TableRow key={i}>
                                    <TableCell>{row.bulan}</TableCell>
                                    <TableCell>{toIDR(row.awal, 2)}</TableCell>
                                    <TableCell>{toIDR(row.terima, 2)}</TableCell>
                                    <TableCell>{toIDR(row.pakai, 2)}</TableCell>
                                    <TableCell>{toIDR(row.saldo, 2)}</TableCell>
                                </TableRow>
                            ))
                        }
                    </TableBody>
                </Table>
            </Card>
        </>
    );
}
