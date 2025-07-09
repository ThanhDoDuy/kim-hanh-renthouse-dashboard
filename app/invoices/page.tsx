"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Eye, Check, Send, FileText, Plus } from "lucide-react"
import { invoiceService, settingsService, utilityReadingService } from "@/lib/api/services"
import type { Invoice, InvoiceResponse, UtilityReading, Settings } from "@/lib/api/types"
import { toast } from "sonner"

function getRecentMonths(count: number = 12) {
  const months = []
  const today = new Date()
  
  for (let i = 0; i < count; i++) {
    const date = new Date(today.getFullYear(), today.getMonth() - i, 1)
    const monthNum = date.getMonth() + 1
    const year = date.getFullYear()
    const month = `${year}-${monthNum.toString().padStart(2, '0')}`
    const label = `Tháng ${monthNum}/${year}`
    months.push({ value: month, label })
  }
  
  return months
}

function getStatusBadge(status: string) {
  switch (status) {
    case "PAID":
      return (
        <Badge variant="default" className="bg-green-500">
          Đã thanh toán
        </Badge>
      )
    case "PENDING":
      return <Badge variant="secondary">Chưa thanh toán</Badge>
    case "OVERDUE":
      return <Badge variant="destructive">Quá hạn</Badge>
    default:
      return <Badge variant="outline">Không xác định</Badge>
  }
}

function getVietQRUrl(amount: number, month: string) {
  const BANK_ID = process.env.NEXT_PUBLIC_BANK_ID || '970443';
  const ACCOUNT_NO = process.env.NEXT_PUBLIC_ACCOUNT_NO || '02022122';
  const ACCOUNT_NAME = process.env.NEXT_PUBLIC_ACCOUNT_NAME || 'NGUYEN THI HONG VAN';
  const template = 'compact2';
  const addInfo = `tien phong thang ${month.split('-')[1]}/${month.split('-')[0]}`;
  return `https://img.vietqr.io/image/${BANK_ID}-${ACCOUNT_NO}-${template}.png?amount=${amount}&addInfo=${encodeURIComponent(addInfo)}&accountName=${encodeURIComponent(ACCOUNT_NAME || '')}`;
}

export default function InvoicesPage() {
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const today = new Date()
    const month = today.getMonth() + 1
    const year = today.getFullYear()
    return `${year}-${month.toString().padStart(2, '0')}`
  })
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null)
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [summary, setSummary] = useState<InvoiceResponse['summary'] | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isGenerating, setIsGenerating] = useState(false)
  const [utilityReading, setUtilityReading] = useState<UtilityReading | null>(null);
  const [settings, setSettings] = useState<Settings | null>(null);

  const months = getRecentMonths()

  useEffect(() => {
    loadInvoices()
  }, [selectedMonth])

  useEffect(() => {
    if (selectedInvoice && selectedMonth) {
      // Lấy UtilityReading cho phòng và tháng
      utilityReadingService.getByMonth(selectedMonth)
        .then((readings) => {
          const reading = readings.find(
            (r) => {
              if (typeof r.room === 'string') return r.room === selectedInvoice.roomName;
              return r.room.number === selectedInvoice.roomName;
            }
          );
          setUtilityReading(reading || null);
        });
      // Lấy Settings
      settingsService.get().then(setSettings);
    } else {
      setUtilityReading(null);
      setSettings(null);
    }
  }, [selectedInvoice, selectedMonth]);

  const loadInvoices = async () => {
    try {
      setIsLoading(true)
      const response = await invoiceService.getByMonth(selectedMonth)
      setInvoices(response.data)
      setSummary(response.summary)
    } catch (error) {
      console.error('Failed to load invoices:', error)
      toast.error('Không thể tải danh sách hóa đơn')
    } finally {
      setIsLoading(false)
    }
  }

  const handleGenerateInvoices = async () => {
    try {
      setIsGenerating(true)
      await invoiceService.generateMonth(selectedMonth)
      toast.success('Đã tạo hóa đơn thành công')
      loadInvoices()
    } catch (error) {
      console.error('Failed to generate invoices:', error)
      toast.error('Không thể tạo hóa đơn')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleViewInvoice = (invoice: Invoice) => {
    setSelectedInvoice(invoice)
    setIsViewDialogOpen(true)
  }

  const handleMarkAsPaid = async (invoiceId: string) => {
    try {
      await invoiceService.markAsPaid(invoiceId)
      toast.success('Đã cập nhật trạng thái thanh toán')
      loadInvoices()
    } catch (error) {
      console.error('Failed to mark invoice as paid:', error)
      toast.error('Không thể cập nhật trạng thái thanh toán')
    }
  }

  const handleSendReminder = async (invoiceId: string) => {
    try {
      await invoiceService.sendReminder(invoiceId)
      toast.success('Đã gửi nhắc nhở thanh toán')
    } catch (error) {
      console.error('Failed to send reminder:', error)
      toast.error('Không thể gửi nhắc nhở')
    }
  }

  return (
    <div className="space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <SidebarTrigger />
          <h2 className="text-3xl font-bold tracking-tight">Hóa đơn và thanh toán</h2>
        </div>
        <div className="flex items-center gap-2">
          <Select value={selectedMonth} onValueChange={setSelectedMonth}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {months.map(({ value, label }) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button 
            onClick={handleGenerateInvoices} 
            disabled={isGenerating}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            <Plus className="mr-2 h-4 w-4" />
            {isGenerating ? 'Đang tạo...' : 'Tạo hóa đơn tháng'}
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng hóa đơn</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary?.total || 0}</div>
            <p className="text-xs text-muted-foreground">
              Tổng tiền: {(summary?.totalAmount || 0).toLocaleString("vi-VN")}đ
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Đã thanh toán</CardTitle>
            <Check className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{summary?.paid || 0}</div>
            <p className="text-xs text-muted-foreground">
              Đã thu: {(summary?.paidAmount || 0).toLocaleString("vi-VN")}đ
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Chưa thanh toán</CardTitle>
            <Send className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{(summary?.pending || 0) + (summary?.overdue || 0)}</div>
            <p className="text-xs text-muted-foreground">
              Cần thu: {(summary?.pendingAmount || 0).toLocaleString("vi-VN")}đ
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            Danh sách hóa đơn tháng {selectedMonth.split('-')[1]}/{selectedMonth.split('-')[0]}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-4">Đang tải...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Phòng</TableHead>
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
                {invoices?.map((invoice) => (
                  <TableRow key={invoice.invoiceId}>
                    <TableCell className="font-medium">
                      {invoice.roomName}
                    </TableCell>
                    <TableCell className="text-right">{invoice.roomCharge.toLocaleString("vi-VN")}đ</TableCell>
                    <TableCell className="text-right">{invoice.electricityCharge.toLocaleString("vi-VN")}đ</TableCell>
                    <TableCell className="text-right">{invoice.waterCharge.toLocaleString("vi-VN")}đ</TableCell>
                    <TableCell className="text-right">{invoice.otherCharges.toLocaleString("vi-VN")}đ</TableCell>
                    <TableCell className="text-right font-bold">{invoice.totalAmount.toLocaleString("vi-VN")}đ</TableCell>
                    <TableCell>{getStatusBadge(invoice.status)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleViewInvoice(invoice)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        {invoice.status !== "PAID" && (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-green-600 bg-transparent"
                              onClick={() => handleMarkAsPaid(invoice.invoiceId)}
                            >
                              <Check className="h-4 w-4" />
                            </Button>
                            {/* Temporarily disabled reminder button
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-blue-600 bg-transparent"
                              onClick={() => handleSendReminder(invoice.invoiceId)}
                            >
                              <Send className="h-4 w-4" />
                            </Button>
                            */}
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* View Invoice Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Chi tiết hóa đơn</DialogTitle>
          </DialogHeader>
          {selectedInvoice && (
            <div className="grid gap-4 py-4 print-invoice-modal">
              {/* Header hóa đơn */}
              <div className="text-center border-b pb-2">
                <h3 className="text-xl font-bold">PHIẾU THU TIỀN TRỌ</h3>
                <div className="flex justify-between text-sm mt-2">
                  <span>Phòng số: {selectedInvoice.roomName}</span>
                  <span>Thời gian: {selectedMonth.split('-')[1]}/{selectedMonth.split('-')[0]}</span>
                </div>
                <div className="flex justify-between text-sm mt-1">
                  <span>Số TK: {process.env.NEXT_PUBLIC_ACCOUNT_NO}</span>
                  <span>{process.env.NEXT_PUBLIC_ACCOUNT_NAME}</span>
                </div>
                <div className="text-sm mt-1">{process.env.NEXT_PUBLIC_BANK_NAME || ''}</div>
              </div>

              {/* Bảng chi tiết hóa đơn */}
              <div className="overflow-x-auto mt-2">
                <table className="invoice-table w-full border border-black text-sm">
                  <thead>
                    <tr>
                      <th className="border border-black px-1 py-1">STT</th>
                      <th className="border border-black px-1 py-1">Nội dung</th>
                      <th className="border border-black px-1 py-1">Chỉ số đầu</th>
                      <th className="border border-black px-1 py-1">Chỉ số cuối</th>
                      <th className="border border-black px-1 py-1">Số lượng</th>
                      <th className="border border-black px-1 py-1">Đơn giá</th>
                      <th className="border border-black px-1 py-1">Thành tiền</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-black px-1 py-1 text-center">1</td>
                      <td className="border border-black px-1 py-1">Tiền phòng</td>
                      <td className="border border-black px-1 py-1"></td>
                      <td className="border border-black px-1 py-1"></td>
                      <td className="border border-black px-1 py-1"></td>
                      <td className="border border-black px-1 py-1"></td>
                      <td className="border border-black px-1 py-1 text-right">{selectedInvoice.roomCharge.toLocaleString("vi-VN")}đ</td>
                    </tr>
                    <tr>
                      <td className="border border-black px-1 py-1 text-center">2</td>
                      <td className="border border-black px-1 py-1">Tiền điện</td>
                      <td className="border border-black px-1 py-1 text-right">{utilityReading?.electricityStart ?? ''}</td>
                      <td className="border border-black px-1 py-1 text-right">{utilityReading?.electricityEnd ?? ''}</td>
                      <td className="border border-black px-1 py-1 text-right">{utilityReading?.electricityConsumption ?? ''}</td>
                      <td className="border border-black px-1 py-1 text-right">{settings?.electricityUnitPrice ? settings.electricityUnitPrice.toLocaleString("vi-VN") : ''}</td>
                      <td className="border border-black px-1 py-1 text-right">{selectedInvoice.electricityCharge.toLocaleString("vi-VN")}đ</td>
                    </tr>
                    <tr>
                      <td className="border border-black px-1 py-1 text-center">3</td>
                      <td className="border border-black px-1 py-1">Tiền nước</td>
                      <td className="border border-black px-1 py-1 text-right">{utilityReading?.waterStart ?? ''}</td>
                      <td className="border border-black px-1 py-1 text-right">{utilityReading?.waterEnd ?? ''}</td>
                      <td className="border border-black px-1 py-1 text-right">{utilityReading?.waterConsumption ?? ''}</td>
                      <td className="border border-black px-1 py-1 text-right">{settings?.waterUnitPrice ? settings.waterUnitPrice.toLocaleString("vi-VN") : ''}</td>
                      <td className="border border-black px-1 py-1 text-right">{selectedInvoice.waterCharge.toLocaleString("vi-VN")}đ</td>
                    </tr>
                    <tr>
                      <td className="border border-black px-1 py-1 text-center">4</td>
                      <td className="border border-black px-1 py-1">Tiền rác</td>
                      <td className="border border-black px-1 py-1"></td>
                      <td className="border border-black px-1 py-1"></td>
                      <td className="border border-black px-1 py-1"></td>
                      <td className="border border-black px-1 py-1 text-right">{settings?.garbageCharge ? settings.garbageCharge.toLocaleString("vi-VN") : ''}</td>
                      <td className="border border-black px-1 py-1 text-right">{selectedInvoice.otherCharges.toLocaleString("vi-VN")}đ</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Tổng cộng */}
              <div className="flex justify-end mt-2 font-bold text-base">
                Tổng cộng: {selectedInvoice.totalAmount.toLocaleString("vi-VN")}đ
              </div>

              {/* Trạng thái */}
              <div className="flex justify-between items-center pt-2">
                <div className="text-sm text-muted-foreground">Trạng thái:</div>
                {getStatusBadge(selectedInvoice.status)}
              </div>

              {/* QR chuyển khoản chỉ hiện khi in */}
              <div className="print-qr flex flex-col items-center mt-6">
                <img
                  src={getVietQRUrl(selectedInvoice.totalAmount, selectedMonth)}
                  alt="QR chuyển khoản"
                  style={{ width: 200, height: 200 }}
                />
                <div className="text-sm mt-2">
                  Quét mã để thanh toán tiền phòng
                </div>
              </div>

              {/* Nút In hóa đơn */}
              <div className="flex justify-center pt-2 no-print">
                <Button onClick={() => window.print()} type="button">
                  In hóa đơn
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
