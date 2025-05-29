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
                                    <TableCell>{isNaN(row.awal) ? "Invalid" : toIDR(row.awal, 2)}</TableCell>
                                    <TableCell>{isNaN(row.terima) ? "Invalid" : toIDR(row.terima, 2)}</TableCell>
                                    <TableCell>{isNaN(row.pakai) ? "Invalid" : toIDR(row.pakai, 2)}</TableCell>
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
