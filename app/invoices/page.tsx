"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Eye, Check, Send, FileText } from "lucide-react"

// Mock data
const invoices = [
  {
    id: 1,
    room: "101",
    tenant: "Nguyễn Văn A",
    month: "2024-01",
    roomRent: 3500000,
    electricCost: 150000,
    waterCost: 60000,
    otherFees: 100000,
    total: 3810000,
    status: "paid",
    paidDate: "2024-01-15",
    dueDate: "2024-01-31",
  },
  {
    id: 2,
    room: "102",
    tenant: "Trần Thị B",
    month: "2024-01",
    roomRent: 3500000,
    electricCost: 125000,
    waterCost: 60000,
    otherFees: 100000,
    total: 3785000,
    status: "unpaid",
    paidDate: null,
    dueDate: "2024-01-31",
  },
  {
    id: 3,
    room: "103",
    tenant: "Lê Văn C",
    month: "2024-01",
    roomRent: 3800000,
    electricCost: 180000,
    waterCost: 75000,
    otherFees: 100000,
    total: 4155000,
    status: "overdue",
    paidDate: null,
    dueDate: "2024-01-31",
  },
]

function getStatusBadge(status: string) {
  switch (status) {
    case "paid":
      return (
        <Badge variant="default" className="bg-green-500">
          Đã thanh toán
        </Badge>
      )
    case "unpaid":
      return <Badge variant="secondary">Chưa thanh toán</Badge>
    case "overdue":
      return <Badge variant="destructive">Quá hạn</Badge>
    default:
      return <Badge variant="outline">Không xác định</Badge>
  }
}

export default function InvoicesPage() {
  const [selectedMonth, setSelectedMonth] = useState("2024-01")
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null)

  const handleViewInvoice = (invoice: any) => {
    setSelectedInvoice(invoice)
    setIsViewDialogOpen(true)
  }

  const handleMarkAsPaid = (invoiceId: number) => {
    // API call to mark invoice as paid
    console.log("Marking invoice as paid:", invoiceId)
  }

  const handleSendReminder = (invoiceId: number) => {
    // API call to send reminder
    console.log("Sending reminder for invoice:", invoiceId)
  }

  return (
    <div className="space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <SidebarTrigger />
          <h2 className="text-3xl font-bold tracking-tight">Hóa đơn và thanh toán</h2>
        </div>
        <Select value={selectedMonth} onValueChange={setSelectedMonth}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="2024-01">Tháng 1/2024</SelectItem>
            <SelectItem value="2023-12">Tháng 12/2023</SelectItem>
            <SelectItem value="2023-11">Tháng 11/2023</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng hóa đơn</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{invoices.length}</div>
            <p className="text-xs text-muted-foreground">Tháng {selectedMonth}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Đã thanh toán</CardTitle>
            <Check className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {invoices.filter((inv) => inv.status === "paid").length}
            </div>
            <p className="text-xs text-muted-foreground">
              {((invoices.filter((inv) => inv.status === "paid").length / invoices.length) * 100).toFixed(1)}% tổng số
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Chưa thanh toán</CardTitle>
            <Send className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {invoices.filter((inv) => inv.status !== "paid").length}
            </div>
            <p className="text-xs text-muted-foreground">Cần thu tiền</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Danh sách hóa đơn tháng {selectedMonth}</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Phòng</TableHead>
                <TableHead>Người thuê</TableHead>
                <TableHead className="text-right">Tiền phòng</TableHead>
                <TableHead className="text-right">Tiền điện</TableHead>
                <TableHead className="text-right">Tiền nước</TableHead>
                <TableHead className="text-right">Phí khác</TableHead>
                <TableHead className="text-right">Tổng cộng</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell className="font-medium">Phòng {invoice.room}</TableCell>
                  <TableCell>{invoice.tenant}</TableCell>
                  <TableCell className="text-right">{invoice.roomRent.toLocaleString("vi-VN")}đ</TableCell>
                  <TableCell className="text-right">{invoice.electricCost.toLocaleString("vi-VN")}đ</TableCell>
                  <TableCell className="text-right">{invoice.waterCost.toLocaleString("vi-VN")}đ</TableCell>
                  <TableCell className="text-right">{invoice.otherFees.toLocaleString("vi-VN")}đ</TableCell>
                  <TableCell className="text-right font-bold">{invoice.total.toLocaleString("vi-VN")}đ</TableCell>
                  <TableCell>{getStatusBadge(invoice.status)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleViewInvoice(invoice)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      {invoice.status !== "paid" && (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-green-600 bg-transparent"
                            onClick={() => handleMarkAsPaid(invoice.id)}
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-blue-600 bg-transparent"
                            onClick={() => handleSendReminder(invoice.id)}
                          >
                            <Send className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* View Invoice Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Chi tiết hóa đơn</DialogTitle>
          </DialogHeader>
          {selectedInvoice && (
            <div className="grid gap-4 py-4">
              <div className="text-center border-b pb-4">
                <h3 className="text-lg font-bold">HÓA ĐƠN TIỀN PHÒNG</h3>
                <p className="text-sm text-muted-foreground">Tháng {selectedInvoice.month}</p>
              </div>

              <div className="grid gap-3">
                <div className="flex justify-between">
                  <span>Phòng:</span>
                  <span className="font-medium">Phòng {selectedInvoice.room}</span>
                </div>
                <div className="flex justify-between">
                  <span>Người thuê:</span>
                  <span className="font-medium">{selectedInvoice.tenant}</span>
                </div>
                <div className="flex justify-between">
                  <span>Hạn thanh toán:</span>
                  <span className="font-medium">{selectedInvoice.dueDate}</span>
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="grid gap-2">
                  <div className="flex justify-between">
                    <span>Tiền phòng:</span>
                    <span>{selectedInvoice.roomRent.toLocaleString("vi-VN")}đ</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tiền điện:</span>
                    <span>{selectedInvoice.electricCost.toLocaleString("vi-VN")}đ</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tiền nước:</span>
                    <span>{selectedInvoice.waterCost.toLocaleString("vi-VN")}đ</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Phí khác:</span>
                    <span>{selectedInvoice.otherFees.toLocaleString("vi-VN")}đ</span>
                  </div>
                  <div className="flex justify-between border-t pt-2 font-bold text-lg">
                    <span>Tổng cộng:</span>
                    <span>{selectedInvoice.total.toLocaleString("vi-VN")}đ</span>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between items-center">
                  <span>Trạng thái:</span>
                  {getStatusBadge(selectedInvoice.status)}
                </div>
                {selectedInvoice.paidDate && (
                  <div className="flex justify-between mt-2">
                    <span>Ngày thanh toán:</span>
                    <span className="font-medium">{selectedInvoice.paidDate}</span>
                  </div>
                )}
              </div>
            </div>
          )}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
              Đóng
            </Button>
            <Button>In hóa đơn</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
