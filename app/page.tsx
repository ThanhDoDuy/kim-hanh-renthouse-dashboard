"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Building2, DollarSign, AlertTriangle, Users } from "lucide-react"
import { useApiQuery } from "@/hooks/use-api-query"
import { dashboardService } from "@/lib/api/services"
import type { Room, Invoice } from "@/lib/api/types"

function getStatusBadge(status: string | undefined) {
  switch (status) {
    case "occupied":
      return (
        <Badge variant="default" className="bg-green-500">
          Có người
        </Badge>
      )
    case "empty":
      return <Badge variant="secondary">Trống</Badge>
    case "overdue":
      return <Badge variant="destructive">Nợ tiền</Badge>
    default:
      return <Badge variant="outline">Không xác định</Badge>
  }
}

export default function Dashboard() {
  const { data: stats, isLoading: statsLoading } = useApiQuery(dashboardService.getStats)
  const { data: recentRooms, isLoading: roomsLoading } = useApiQuery(dashboardService.getRecentRooms)
  const { data: unpaidInvoices, isLoading: invoicesLoading } = useApiQuery(dashboardService.getUnpaidInvoices)

  const isLoading = statsLoading || roomsLoading || invoicesLoading

  return (
    <>
      {/* Header */}
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <h1 className="text-xl font-semibold">Dashboard</h1>
      </header>

      {/* Main Content */}
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="space-y-4 pt-4">
          {/* Stats Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Tổng số phòng</CardTitle>
                <Building2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.totalRooms ?? '-'}</div>
                <p className="text-xs text-muted-foreground">{stats?.occupiedRooms ?? '-'} phòng có người</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Doanh thu tháng</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {stats?.monthlyRevenue ? stats.monthlyRevenue.toLocaleString("vi-VN") + 'đ' : '-'}
                </div>
                <p className="text-xs text-muted-foreground">+12% so với tháng trước</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Phòng trống</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.emptyRooms ?? '-'}</div>
                <p className="text-xs text-muted-foreground">
                  {stats ? ((stats.emptyRooms / stats.totalRooms) * 100).toFixed(1) + '% tổng số phòng' : '-'}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Phòng nợ tiền</CardTitle>
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">{stats?.overdueRooms ?? '-'}</div>
                <p className="text-xs text-muted-foreground">Cần thu tiền gấp</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            {/* Room Status Table */}
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Tình trạng phòng</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Số phòng</TableHead>
                      <TableHead>Trạng thái</TableHead>
                      <TableHead>Người thuê</TableHead>
                      <TableHead className="text-right">Giá thuê</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center">Đang tải...</TableCell>
                      </TableRow>
                    ) : recentRooms?.map((room) => (
                      <TableRow key={room._id}>
                        <TableCell className="font-medium">{room.number}</TableCell>
                        <TableCell>{getStatusBadge(room.status)}</TableCell>
                        <TableCell>{room.tenant || "Trống"}</TableCell>
                        <TableCell className="text-right">{room.price.toLocaleString("vi-VN")}đ</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Unpaid Invoices */}
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Hóa đơn chưa thanh toán</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {isLoading ? (
                    <div className="text-center">Đang tải...</div>
                  ) : unpaidInvoices?.map((invoice) => (
                    <div key={invoice.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">Phòng {invoice.roomId}</p>
                        <p className="text-sm text-muted-foreground">{invoice.tenantId}</p>
                        <p className="text-xs text-red-600">Hạn: {new Date(invoice.dueDate).toLocaleDateString("vi-VN")}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-red-600">{invoice.amount.toLocaleString("vi-VN")}đ</p>
                        <Button size="sm" variant="outline" className="mt-1 bg-transparent">
                          Nhắc nhở
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  )
}
