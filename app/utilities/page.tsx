"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Zap, Droplets, Pencil, Trash2 } from "lucide-react"
import { utilityReadingService, roomService } from "@/lib/api/services"
import { UtilityReading, Room } from "@/lib/api/types"
import { toast } from "sonner"
import { UtilityReadingDialog } from "@/components/ui/utility-reading-dialog"

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

function formatMonthLabel(month: string) {
  const [year, monthNum] = month.split('-')
  return `Tháng ${parseInt(monthNum)}/${year}`
}

export default function UtilitiesPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const today = new Date()
    const month = today.getMonth() + 1
    const year = today.getFullYear()
    return `${year}-${month.toString().padStart(2, '0')}`
  })
  const [utilityReadings, setUtilityReadings] = useState<UtilityReading[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedReading, setSelectedReading] = useState<UtilityReading | undefined>(undefined)
  const [rooms, setRooms] = useState<Room[]>([])

  const months = getRecentMonths()

  useEffect(() => {
    loadUtilityReadings()
  }, [selectedMonth])

  useEffect(() => {
    loadRooms()
  }, [])

  const loadRooms = async () => {
    try {
      const data = await roomService.getAll()
      // Lọc các phòng có người ở (có tenant)
      const occupiedRooms = data.filter(room => room.tenant !== null)
      setRooms(occupiedRooms)
    } catch (error) {
      console.error('Failed to load rooms:', error)
      toast.error('Không thể tải danh sách phòng')
    }
  }

  const loadUtilityReadings = async () => {
    try {
      setIsLoading(true)
      const data = await utilityReadingService.getByMonth(selectedMonth)
      setUtilityReadings(data)
    } catch (error) {
      console.error('Failed to load utility readings:', error)
      toast.error('Không thể tải dữ liệu chỉ số điện nước')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSaveReading = async (data: any) => {
    try {
      if (selectedReading?._id) {
        await utilityReadingService.update(selectedReading._id, data)
        toast.success('Đã cập nhật chỉ số điện nước')
      } else {
        await utilityReadingService.create(data)
        toast.success('Đã thêm chỉ số điện nước')
      }
      setIsDialogOpen(false)
      loadUtilityReadings()
    } catch (error) {
      console.error('Failed to save utility reading:', error)
      toast.error('Không thể lưu chỉ số điện nước')
    }
  }

  const handleEdit = (reading: UtilityReading) => {
    setSelectedReading(reading)
    setIsDialogOpen(true)
  }

  const handleAdd = () => {
    setSelectedReading(undefined)
    setIsDialogOpen(true)
  }

  const handleDelete = async (reading: UtilityReading) => {
    if (!confirm('Bạn có chắc chắn muốn xóa bản ghi này?')) {
      return
    }
    
    try {
      await utilityReadingService.delete(reading._id)
      toast.success('Đã xóa bản ghi')
      loadUtilityReadings()
    } catch (error) {
      console.error('Failed to delete utility reading:', error)
      toast.error('Không thể xóa bản ghi')
    }
  }

  return (
    <div className="space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <SidebarTrigger />
          <h2 className="text-3xl font-bold tracking-tight">Chỉ số điện nước</h2>
        </div>
        <div className="flex gap-2">
          <Select value={selectedMonth} onValueChange={setSelectedMonth}>
            <SelectTrigger className="w-[180px]">
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
          <Button onClick={handleAdd}>
            <Plus className="mr-2 h-4 w-4" />
            Ghi chỉ số
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Chỉ số điện nước {formatMonthLabel(selectedMonth)}
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
                  <TableHead className="text-center">Điện đầu kỳ</TableHead>
                  <TableHead className="text-center">Điện cuối kỳ</TableHead>
                  <TableHead className="text-center">Tiêu thụ điện</TableHead>
                  <TableHead className="text-center">Nước đầu kỳ</TableHead>
                  <TableHead className="text-center">Nước cuối kỳ</TableHead>
                  <TableHead className="text-center">Tiêu thụ nước</TableHead>
                  <TableHead className="text-center">Chỉnh sửa</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {utilityReadings.map((reading) => (
                  <TableRow key={reading._id}>
                    <TableCell className="font-medium">
                      Phòng {typeof reading.room === 'string' ? reading.room : reading.room.number}
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Zap className="h-4 w-4 text-yellow-500" />
                        {reading.electricityStart}
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Zap className="h-4 w-4 text-yellow-500" />
                        {reading.electricityEnd || "Chưa ghi"}
                      </div>
                    </TableCell>
                    <TableCell className="text-center font-medium">
                      {reading.electricityConsumption ? `${reading.electricityConsumption} kWh` : "-"}
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Droplets className="h-4 w-4 text-blue-500" />
                        {reading.waterStart}
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Droplets className="h-4 w-4 text-blue-500" />
                        {reading.waterEnd || "Chưa ghi"}
                      </div>
                    </TableCell>
                    <TableCell className="text-center font-medium">
                      {reading.waterConsumption ? `${reading.waterConsumption} m³` : "-"}
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(reading)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(reading)}
                          className="text-red-500 hover:text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <UtilityReadingDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        defaultValues={selectedReading}
        onSubmit={handleSaveReading}
        rooms={rooms}
      />
    </div>
  )
}
