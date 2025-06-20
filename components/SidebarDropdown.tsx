"use client"

import { useEffect, useState } from "react"
import {
    SidebarGroupContent,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton
} from "@/components/ui/sidebar"
import { ChevronDown, ChevronRight } from "lucide-react"
import AppSidebarContent from "./AppSidebarContent"

interface SidebarDropdownProps {
    label: string
    items: {
        title: string
        url: string
        icon: React.ElementType
    }[]
}

export function SidebarDropdown({ label, items }: SidebarDropdownProps) {
    const key = `sidebar-dropdown-${label.toLowerCase().replace(/\s/g, "-")}`
    const [open, setOpen] = useState<boolean>(false)

    useEffect(() => {
        const saved = localStorage.getItem(key)
        if (saved !== null) setOpen(saved === "true")
    }, [key])

    const toggleDropdown = () => {
        const newState = !open
        setOpen(newState)
        localStorage.setItem(key, newState.toString())
    }

    return (
        <SidebarGroupContent>
            <SidebarMenu>
                <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                        <button
                            onClick={toggleDropdown}
                            className="flex w-full items-center gap-2 text-sm font-medium hover:bg-muted rounded-md p-2 transition justify-start"
                        >
                            {open ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                            <span>{label}</span>
                        </button>
                    </SidebarMenuButton>
                </SidebarMenuItem>

                {open &&
                    items.map((item) => {

                        return (
                            <AppSidebarContent key={item.title} title={item.title} url={item.url} icon={item.icon} />
                        )
                    })}
            </SidebarMenu>
        </SidebarGroupContent>
    )
}
