"use client"

import { useEffect, useState } from "react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "./ui/select"
import { dateToIDString } from "@/lib/utils";

interface Props {
    data: (string | Date)[];
    value?: string;
    onChange?: (monthKey: string) => void;
}

export default function SelectBulan({ data, value, onChange }: Props) {
    const [monthOptions, setMonthOptions] = useState<
        { value: string; label: string }[]
    >([]);

    useEffect(() => {
        const monthMap = new Map<string, string>();

        data.forEach(date => {
            const newDate = new Date(date);
            const key = dateToIDString(newDate);
            if (!monthMap.has(key)) {
                monthMap.set(key, key);
            }
        });

        const options = Array.from(monthMap.entries()).map(([key, label]) => ({
            value: key,
            label: label.charAt(0).toUpperCase() + label.slice(1),
        }));

        options.sort(
            (a, b) =>
                new Date("1 " + a.value).getTime() - new Date("1 " + b.value).getTime()
        );

        // Add "Januari - Sekarang" option at the top
        const allOption = { value: "all", label: "Januari - Sekarang" };
        setMonthOptions([allOption, ...options]);

        // If no value is set yet, trigger onChange with default
        if (!value && onChange) {
            onChange(allOption.value);
        }
    }, [data, value, onChange]);

    return (
        <Select
            value={value || "All"}
            onValueChange={(val) => {
                onChange?.(val);
            }}
        >
            <SelectTrigger className="w-fit">
                <SelectValue placeholder="Pilih bulan" />
            </SelectTrigger>
            <SelectContent>
                {monthOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
}
