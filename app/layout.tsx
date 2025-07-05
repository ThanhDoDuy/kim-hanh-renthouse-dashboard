import type React from "react"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import "./globals.css"
import { Toaster } from "sonner"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="vi">
      <body>
        <SidebarProvider>
          <AppSidebar />
          <SidebarInset>{children}</SidebarInset>
          <Toaster richColors position="top-right" />
        </SidebarProvider>
      </body>
    </html>
  )
}

export const metadata = {
  generator: 'v0.dev',
  title: "Quản lý nhà trọ",
  description: "Hệ thống quản lý nhà trọ",
};
