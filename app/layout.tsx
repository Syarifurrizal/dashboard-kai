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
    <html lang="en" className="h-full">
      <body
        className={`${geistSans.variable} ${geistMono.variable} h-full min-h-screen antialiased`}
      >
        <SidebarProvider>
          <AppSidebar />
          <div className="flex flex-col min-h-screen w-full">
            {/* Header Section */}
            <div className="bg-white flex flex-row items-center gap-4 p-2">
              <SidebarTrigger />
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink href="/">Home</BreadcrumbLink>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
            <Separator />

            {/* Main Content */}
            <div className="flex-1 p-4">
              {children}
            </div>
          </div>
        </SidebarProvider>
      </body>
    </html>
  );
}
