"use client"

import { Table, TableCaption, TableHeader, TableRow, TableHead, TableBody, TableCell } from "../ui/table";
import { Card } from "../ui/card";
import { Armada } from "@/lib/definitions";

interface Props {
    data: Armada[];
}

export default function ArmadaTable({ data }: Props) {

    return (
        <>
            <Card className="p-4">
                <Table>
                    <TableCaption>
                        {data.length === 0 ? ("Tidak ada data.") : ("Data armada sarana terbaru.")}
                    </TableCaption>
                    <TableHeader>
                        <TableRow>
                            <TableHead>No</TableHead>
                            <TableHead>Jenis Kereta</TableHead>
                            <TableHead>Depo Kereta</TableHead>
                            <TableHead>Jumlah</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {
                            data.map((row, i) => (
                                <TableRow key={i}>
                                    <TableCell>{i + 1}</TableCell>
                                    <TableCell>{row.jenisKereta}</TableCell>
                                    <TableCell>{row.depo}</TableCell>
                                    <TableCell>{isNaN(row.jumlah) ? "Invalid" : row.jumlah}</TableCell>
                                </TableRow>
                            ))
                        }
                    </TableBody>
                </Table>
            </Card>
        </>
    );
}
