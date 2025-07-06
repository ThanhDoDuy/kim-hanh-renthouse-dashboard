"use client"

import { useState } from "react"
import { format } from "date-fns"
import { vi } from "date-fns/locale"
import { useApiQuery } from "@/hooks/use-api-query"
import { roomService, utilityReadingService } from "@/lib/api/services"
import type { Room, UtilityReading, CreateUtilityReadingDto } from "@/lib/api/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Pencil, Zap, Droplets } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"
import { UtilityReadingDialog } from "@/components/ui/utility-reading-dialog"

export default function UtilityReadingsPage() {
  const [selectedMonth, setSelectedMonth] = useState(format(new Date(), 'yyyy-MM'))
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [selectedReading, setSelectedReading] = useState<UtilityReading | null>(null)
  
  const { data: rooms, isLoading: isLoadingRooms } = useApiQuery<Room[]>(roomService.getAll, [])
  const { 
    data: readings, 
    isLoading: isLoadingReadings,
    mutate: mutateReadings
  } = useApiQuery<UtilityReading[]>(
    () => utilityReadingService.getByMonth(selectedMonth),
    [selectedMonth]
  )

  const isLoading = isLoadingRooms || isLoadingReadings

  // Tạo danh sách tháng để chọn (6 tháng gần nhất)
  const months = Array.from({ length: 6 }, (_, i) => {
    const date = new Date()
    date.setMonth(date.getMonth() - i)
    return format(date, 'yyyy-MM')
  })

  const handleAddReading = async (data: CreateUtilityReadingDto) => {
    try {
      await utilityReadingService.create(data)
      toast.success("Ghi chỉ số thành công")
      setIsAddDialogOpen(false)
      mutateReadings()
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message)
      } else {
        toast.error("Có lỗi xảy ra khi ghi chỉ số")
      }
    }
  }

  const handleEditReading = async (data: CreateUtilityReadingDto) => {
    if (!selectedReading) return

    try {
      await utilityReadingService.update(selectedReading._id, data)
      toast.success("Cập nhật chỉ số thành công")
      setIsEditDialogOpen(false)
      setSelectedReading(null)
      mutateReadings()
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message)
      } else {
        toast.error("Có lỗi xảy ra khi cập nhật chỉ số")
      }
    }
  }

  return (
    <>
      {/* Header */}
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <h1 className="text-xl font-semibold">Chỉ số điện nước</h1>
        <div className="ml-auto flex items-center gap-2">
          <Select value={selectedMonth} onValueChange={setSelectedMonth}>
            <SelectTrigger className="w-[180px]">
              <SelectValue>
                {format(new Date(selectedMonth), 'MMMM yyyy', { locale: vi })}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {months.map(month => (
                <SelectItem key={month} value={month}>
                  {format(new Date(month), 'MMMM yyyy', { locale: vi })}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Ghi chỉ số
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>
                Chỉ số điện nước tháng {format(new Date(selectedMonth), 'MM/yyyy')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-4">Đang tải...</div>
              ) : !readings || readings.length === 0 ? (
                <div className="text-center py-4">Chưa có dữ liệu</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Phòng</TableHead>
                      <TableHead>
                        <div className="flex items-center gap-2">
                          <Zap className="h-4 w-4" />
                          Điện đầu kỳ
                        </div>
                      </TableHead>
                      <TableHead>
                        <div className="flex items-center gap-2">
                          <Zap className="h-4 w-4" />
                          Điện cuối kỳ
                        </div>
                      </TableHead>
                      <TableHead>
                        <div className="flex items-center gap-2">
                          <Zap className="h-4 w-4" />
                          Tiêu thụ điện
                        </div>
                      </TableHead>
                      <TableHead>
                        <div className="flex items-center gap-2">
                          <Droplets className="h-4 w-4" />
                          Nước đầu kỳ
                        </div>
                      </TableHead>
                      <TableHead>
                        <div className="flex items-center gap-2">
                          <Droplets className="h-4 w-4" />
                          Nước cuối kỳ
                        </div>
                      </TableHead>
                      <TableHead>
                        <div className="flex items-center gap-2">
                          <Droplets className="h-4 w-4" />
                          Tiêu thụ nước
                        </div>
                      </TableHead>
                      <TableHead>Trạng thái</TableHead>
                      <TableHead className="text-center">Thao tác</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {readings.map((reading) => (
                      <TableRow key={reading._id}>
                        <TableCell className="font-medium">
                          {reading.room instanceof Object ? `Phòng ${reading.room.number}` : "Không xác định"}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Zap className="h-4 w-4" />
                            {reading.electricityStart.toLocaleString()}
                          </div>
                        </TableCell>
                        <TableCell>
                          {reading.electricityEnd ? (
                            <div className="flex items-center gap-2">
                              <Zap className="h-4 w-4" />
                              {reading.electricityEnd.toLocaleString()}
                            </div>
                          ) : (
                            <Badge variant="secondary">Chưa ghi</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          {reading.electricityUsage ? (
                            <div className="flex items-center gap-2">
                              <Zap className="h-4 w-4" />
                              {reading.electricityUsage.toLocaleString()} kWh
                            </div>
                          ) : "-"}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Droplets className="h-4 w-4" />
                            {reading.waterStart.toLocaleString()}
                          </div>
                        </TableCell>
                        <TableCell>
                          {reading.waterEnd ? (
                            <div className="flex items-center gap-2">
                              <Droplets className="h-4 w-4" />
                              {reading.waterEnd.toLocaleString()}
                            </div>
                          ) : (
                            <Badge variant="secondary">Chưa ghi</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          {reading.waterUsage ? (
                            <div className="flex items-center gap-2">
                              <Droplets className="h-4 w-4" />
                              {reading.waterUsage.toLocaleString()} m³
                            </div>
                          ) : "-"}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={reading.isCompleted ? "default" : "secondary"}
                            className={reading.isCompleted ? "bg-green-500" : undefined}
                          >
                            {reading.isCompleted ? "Đã ghi" : "Chưa ghi"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex justify-center">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedReading(reading)
                                setIsEditDialogOpen(true)
                              }}
                            >
                              <Pencil className="h-4 w-4" />
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
        </div>
      </div>

      {rooms && (
        <>
          <UtilityReadingDialog
            open={isAddDialogOpen}
            onOpenChange={setIsAddDialogOpen}
            rooms={rooms}
            month={selectedMonth}
            onSubmit={handleAddReading}
          />

          {selectedReading && (
            <UtilityReadingDialog
              open={isEditDialogOpen}
              onOpenChange={(open) => {
                setIsEditDialogOpen(open)
                if (!open) setSelectedReading(null)
              }}
              defaultValues={selectedReading}
              rooms={rooms}
              month={selectedMonth}
              onSubmit={handleEditReading}
            />
          )}
        </>
      )}
    </>
  )
} 