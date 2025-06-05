// components/jabatan-table.tsx
"use client";

import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/data-table";
import { jabatanColumns } from "@/components/columns/jabatan-columns";
import { Jabatan } from "@/lib/definitions";

interface Props {
    data: Jabatan[];
    title: string;
}

export default function JabatanTable({ data, title }: Props) {
    return (
        <Card className="p-4 w-full overflow-hidden">
            <CardHeader>
                <CardTitle className="text-center">{title}</CardTitle>
            </CardHeader>
            <DataTable columns={jabatanColumns} data={data} />
        </Card>
    );
}
