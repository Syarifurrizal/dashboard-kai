// components/columns/jabatan-columns.ts
import { ColumnDef } from "@tanstack/react-table";
import { Jabatan } from "@/lib/definitions";

export const jabatanColumns: ColumnDef<Jabatan>[] = [
    {
        header: "NIPP",
        accessorKey: "nipp",
    },
    {
        header: "Nama",
        accessorKey: "nama",
    },
    {
        header: "Posisi",
        accessorKey: "posisi",
    },
    {
        header: "Sub Group",
        accessorKey: "subgroup",
    },
    {
        header: "Penempatan",
        accessorKey: "penempatan",
    },
];
