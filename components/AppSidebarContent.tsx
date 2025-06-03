"use client"

import { usePathname } from "next/navigation"
import { SidebarMenuButton, SidebarMenuItem } from "./ui/sidebar";
import Link from "next/link";

interface Props {
    title: string
    url: string
    icon: React.ElementType
}


export default function AppSidebarContent({ title, url, icon: Icon }: Props) {
    const pathname = usePathname();
    const isActive = pathname === url

    return (
        <>
            <SidebarMenuItem key={title}>
                <SidebarMenuButton
                    asChild
                    className={`flex items-center gap-2 pl-6 py-1 rounded-md transition-colors ${isActive
                        ? "bg-[#2d2a70] text-white hover:bg-[#ed6b23] hover:text-white"
                        : "hover:text-primary"
                        }`}
                >
                    <Link href={url}>
                        <Icon size={16} />
                        <span>{title}</span>
                    </Link>
                </SidebarMenuButton>
            </SidebarMenuItem>
        </>
    );
}