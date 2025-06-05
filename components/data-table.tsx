// components/data-table.tsx
"use client";

import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    getSortedRowModel,
    getFilteredRowModel,
    useReactTable,
    SortingState,
    ColumnFiltersState,
} from "@tanstack/react-table";
import * as React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { ArrowUpIcon, ArrowDownIcon, ChevronsUpDownIcon } from "lucide-react";

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
}

export function DataTable<TData, TValue>({ columns, data }: DataTableProps<TData, TValue>) {
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
    const [globalFilter, setGlobalFilter] = React.useState("");

    const table = useReactTable({
        data,
        columns,
        state: {
            sorting,
            columnFilters,
            globalFilter,
        },
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        onGlobalFilterChange: setGlobalFilter,
    });

    return (
        <div className="space-y-4">

            <Input
                placeholder="Cari data..."
                value={globalFilter ?? ""}
                onChange={(e) => setGlobalFilter(e.target.value)}
                className="w-full"
            />

            <div className="rounded-md border md:w-full overflow-hidden">
                <Table className="w-full">
                    <>
                        <TableHeader>
                            {table.getHeaderGroups().map((headerGroup) => (
                                <TableRow key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => {
                                        const canSort = header.column.getCanSort();
                                        let newStyle = {};
                                        if (header.id === "number") {
                                            newStyle = { width: "1%", whiteSpace: "nowrap" };
                                        } else if (header.id === "description") {
                                            newStyle = { minWidth: "200px" };
                                        }

                                        return (
                                            <TableHead
                                                key={header.id}
                                                onClick={canSort ? header.column.getToggleSortingHandler() : undefined}
                                                style={newStyle}
                                                className={`${canSort ? "cursor-pointer select-none px-4" : ""} px-4 break-words whitespace-nowrap`}
                                            >
                                                <div className="flex items-center gap-1">
                                                    {flexRender(header.column.columnDef.header, header.getContext())}
                                                    {canSort && (
                                                        header.column.getIsSorted() === "asc" ? (
                                                            <ArrowUpIcon className="w-4 h-4 opacity-30" />
                                                        ) : header.column.getIsSorted() === "desc" ? (
                                                            <ArrowDownIcon className="w-4 h-4 opacity-30" />
                                                        ) : (
                                                            <ChevronsUpDownIcon className="w-4 h-4 opacity-30" />
                                                        )
                                                    )}
                                                </div>
                                            </TableHead>

                                        );
                                    })}
                                </TableRow>
                            ))}
                        </TableHeader>
                        <TableBody>
                            {table.getRowModel().rows.length ? (
                                table.getRowModel().rows.map((row) => (
                                    <TableRow key={row.id}>
                                        {row.getVisibleCells().map((cell) => {
                                            let style = {};
                                            if (cell.column.id === "number") {
                                                style = { whiteSpace: "nowrap" };
                                            }
                                            return (
                                                <TableCell
                                                    key={cell.id}
                                                    style={style}
                                                    className="px-4 break-words whitespace-normal leading-6"
                                                >
                                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                </TableCell>
                                            );
                                        })}
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={columns.length} className="text-center">
                                        Tidak ada data.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </>
                </Table>

            </div>
        </div>
    );
}
