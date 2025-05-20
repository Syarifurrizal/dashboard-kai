"use client"

import {
  BadgeDollarSign,
  ChartCandlestick,
  ShieldAlert,
  ShieldCheck,
  Wrench,
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
} from "@/components/ui/sidebar"
import Link from "next/link"
import { Separator } from "./ui/separator"
import Image from "next/image"

import Logo from "@/public/KAI.svg"
import { SidebarDropdown } from "./SidebarDropdown"

const kdk = [

  { title: "Availability", url: "/kdk/availability", icon: ShieldCheck },
  { title: "Perawatan", url: "/kdk/perawatan", icon: Wrench },
  { title: "Saldo Gudang YK", url: "/kdk/saldogudangyk", icon: BadgeDollarSign },
  { title: "Saldo Gudang SLO", url: "/kdk/saldogudangslo", icon: BadgeDollarSign },
  { title: "Balance Movement YK", url: "/kdk/balancemovementyk", icon: ChartCandlestick },
  { title: "Balance Movement SLO", url: "/kdk/balancemovementslo", icon: ChartCandlestick },
  { title: "Gangguan", url: "/kdk/gangguan", icon: ShieldAlert },
]

// const kdg = [

//   { title: "Availability", url: "/kdg/availability", icon: ShieldCheck },
//   { title: "Perawatan", url: "/kdg/perawatan", icon: Wrench },
//   { title: "Saldo Gudang", url: "/kdg/saldogudang", icon: BadgeDollarSign },
//   { title: "Balance Movement", url: "/kdg/balancemovement", icon: ChartCandlestick },
//   { title: "Gangguan", url: "/kdg/gangguan", icon: ShieldAlert },
// ]

// const kdt = [

//   { title: "Availability", url: "/kdt/availability", icon: ShieldCheck },
//   { title: "Perawatan", url: "/kdt/perawatan", icon: Wrench },
//   { title: "Saldo Gudang YK", url: "/kdt/saldogudangyk", icon: BadgeDollarSign },
//   { title: "Balance Movement YK", url: "/kdt/balancemovementyk", icon: ChartCandlestick },
//   { title: "Saldo Gudang SLO", url: "/kdt/saldogudangslo", icon: BadgeDollarSign },
//   { title: "Balance Movement SLO", url: "/kdt/balancemovementslo", icon: ChartCandlestick },
//   { title: "Gangguan", url: "/kdt/gangguan", icon: ShieldAlert },
//   { title: "Gangguan krd", url: "/kdt/gangguankrd", icon: ShieldAlert },
// ]

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarContent>
        <Link href="/" className="flex flex-col items-center justify-center pt-4 pb-1 gap-2">
          <Image src={Logo} width={125} priority alt="Logo KAI" />
          <h1 className="text-center font-lg font-bold text-lg">SARANA DAOP 6</h1>
        </Link>

        <Separator />
        <SidebarGroup>
          {/* <SidebarGroupLabel>Application</SidebarGroupLabel> */}
          <SidebarGroupContent>
            <SidebarMenu>

              <SidebarDropdown label="KDK" items={kdk} />
              {/* <SidebarDropdown label="KDT" items={kdt} />
              <SidebarDropdown label="KDG" items={kdg} /> */}

            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
