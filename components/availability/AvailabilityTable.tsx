"use client";

import { Availability } from "@/lib/definitions";
import React from "react";

import { Table, TableCaption, TableHeader, TableRow, TableHead, TableBody, TableCell } from "../ui/table";
import { Card } from "../ui/card";

interface Props {
    data: Availability[];
}

export default function AvailabilityTable({ data }: Props) {

    return (
        <>
            <Card className="p-4">
                <Table>
                    <TableCaption>
                        {data.length === 0 ? ("Tidak ada data.") : ("Data Availability terbaru.")}
                    </TableCaption>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[200px]">Bulan</TableHead>
                            <TableHead>Armada</TableHead>
                            <TableHead>TSGO</TableHead>
                            <TableHead>SGO</TableHead>
                            <TableHead>TSO</TableHead>
                            <TableHead>SO</TableHead>
                            <TableHead>SF</TableHead>
                            <TableHead>Asistensi</TableHead>
                            <TableHead>Cadangan</TableHead>
                            <TableHead>Program Availability</TableHead>
                            <TableHead>Availability</TableHead>
                            <TableHead>Utilisasi</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {
                            data.map((row, i) => (
                                <TableRow key={i}>
                                    <TableCell>{row.bulan}</TableCell>
                                    <TableCell>{row.armada}</TableCell>
                                    <TableCell>{row.tsgo}</TableCell>
                                    <TableCell>{row.sgo}</TableCell>
                                    <TableCell>{row.tso}</TableCell>
                                    <TableCell>{row.so}</TableCell>
                                    <TableCell>{row.sf}</TableCell>
                                    <TableCell>{row.asistensi}</TableCell>
                                    <TableCell>{row.cadangan}</TableCell>
                                    <TableCell>{isNaN(row.programAvailability) ? "Invalid" : row.programAvailability + " %"}</TableCell>
                                    <TableCell>{isNaN(row.availability) ? "Invalid" : row.availability + " %"}</TableCell>
                                    <TableCell>{isNaN(row.utilisasi) ? "Invalid" : row.utilisasi + " %"}</TableCell>
                                </TableRow>
                            ))
                        }
                    </TableBody>
                </Table>
            </Card>
        </>
    );
}
