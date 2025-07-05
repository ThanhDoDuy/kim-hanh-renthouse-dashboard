"use client"

import { BarChart3, Building2, Home, Receipt, Users, Zap } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import Link from "next/link"

const menuItems = [
  {
    title: "Dashboard",
    url: "/",
    icon: Home,
  },
  {
    title: "Quản lý phòng",
    url: "/rooms",
    icon: Building2,
  },
  {
    title: "Quản lý người thuê",
    url: "/tenants",
    icon: Users,
  },
  {
    title: "Chỉ số điện nước",
    url: "/utilities",
    icon: Zap,
  },
  {
    title: "Hóa đơn",
    url: "/invoices",
    icon: Receipt,
  },
  {
    title: "Báo cáo",
    url: "/reports",
    icon: BarChart3,
  },
]

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader className="border-b p-4">
        <div className="flex items-center gap-2">
          <Building2 className="h-6 w-6" />
          <span className="font-semibold text-lg">Quản lý nhà trọ</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu chính</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
