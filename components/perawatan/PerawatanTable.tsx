"use client";

import { Table, TableCaption, TableHeader, TableRow, TableHead, TableBody, TableCell } from "../ui/table";
import { Card } from "../ui/card";

import { Perawatan } from "@/lib/definitions";
import React from "react";
import { capitalizeFirstLetter } from "@/lib/utils";

interface Props {
    data: Perawatan[];
}

export default function PerawatanTable({ data }: Props) {

    return (
        <>
            <Card className="p-4">
                <Table>
                    <TableCaption>
                        {data.length === 0 ? ("Tidak ada data.") : ("Data perawatan terbaru.")}
                    </TableCaption>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Bulan</TableHead>
                            <TableHead>P 1</TableHead>
                            <TableHead>RP 1</TableHead>
                            <TableHead>% 1</TableHead>
                            <TableHead>P 3</TableHead>
                            <TableHead>RP 3</TableHead>
                            <TableHead>% 3</TableHead>
                            <TableHead>P 6</TableHead>
                            <TableHead>RP 6</TableHead>
                            <TableHead>% 6</TableHead>
                            <TableHead>P 12</TableHead>
                            <TableHead>RP 12</TableHead>
                            <TableHead>% 12</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {
                            data.map((row, i) => (
                                <TableRow key={i}>
                                    <TableCell>{capitalizeFirstLetter(row.bulan)}</TableCell>
                                    <TableCell>{row.p1}</TableCell>
                                    <TableCell>{row.rp1}</TableCell>
                                    <TableCell>{row.persen_1.toFixed(0)} %</TableCell>
                                    <TableCell>{row.p3}</TableCell>
                                    <TableCell>{row.rp3}</TableCell>
                                    <TableCell>{row.persen_3.toFixed(0)} %</TableCell>
                                    <TableCell>{row.p6}</TableCell>
                                    <TableCell>{row.rp6}</TableCell>
                                    <TableCell>{row.persen_6.toFixed(0)} %</TableCell>
                                    <TableCell>{row.p12}</TableCell>
                                    <TableCell>{row.rp12}</TableCell>
                                    <TableCell>{row.persen_12.toFixed(0)} %</TableCell>
                                </TableRow>
                            ))
                        }
                    </TableBody>
                </Table>
            </Card>
        </>
    );
}
