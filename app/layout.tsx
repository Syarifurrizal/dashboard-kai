import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink } from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Sarana Prasarana KAI DAOP 6",
    template: "%s | KAI DAOP 6",
  },
  description: "Offical Website of Infrastructure Division Regional 6 of PT. Kereta API Indonesia",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
    <SidebarProvider>
      <AppSidebar />
      <main className="w-full">
        <div className="bg-white flex flex-row items-center gap-4 p-2">
          <SidebarTrigger />
          <Breadcrumb className="">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Home</BreadcrumbLink>
              </BreadcrumbItem >
            </BreadcrumbList >
          </Breadcrumb >
        </div >
        <div>
          <Separator />
        </div>
        <div className="w-full p-4 min-h-screen">
          {children}
        </div>
      </main>
    </SidebarProvider>
      </body>
    </html>
  );
}
