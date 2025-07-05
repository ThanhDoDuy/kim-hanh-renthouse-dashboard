"use client"

import { useState } from "react"
import { useApiQuery } from "@/hooks/use-api-query"
import { roomService } from "@/lib/api/services"
import type { Room, CreateRoomDto } from "@/lib/api/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Plus, Pencil, Trash2 } from "lucide-react"
import { toast } from "sonner"
import { RoomDialog } from "@/components/ui/room-dialog"
import { formatCurrency } from "@/lib/utils"
import { RoomStatus } from "@/lib/api/room-status"

interface RoomStatusBadgeProps {
  status?: RoomStatus
}

function RoomStatusBadge({ status }: RoomStatusBadgeProps) {
  switch (status) {
    case RoomStatus.FULL:
      return (
        <Badge variant="default" className="bg-red-500">
          Đã đủ người
        </Badge>
      )
    case RoomStatus.AVAILABLE:
      return <Badge variant="default" className="bg-green-500">Còn trống</Badge>
    default:
      return <Badge variant="outline">Không xác định</Badge>
  }
}

export default function RoomsPage() {
  const { data: rooms, isLoading, error, mutate } = useApiQuery<Room[]>(roomService.getAll, [])
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  const handleAddRoom = async (data: CreateRoomDto) => {
    try {
      await roomService.create(data)
      toast.success("Thêm phòng thành công")
      setIsAddDialogOpen(false)
      mutate()
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message)
      } else {
        toast.error("Có lỗi xảy ra khi thêm phòng")
      }
    }
  }

  const handleEditRoom = async (id: string, data: Partial<Room>) => {
    try {
      await roomService.update(id, data)
      toast.success("Cập nhật phòng thành công")
      setIsEditDialogOpen(false)
      setSelectedRoom(null)
      mutate()
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message)
      } else {
        toast.error("Có lỗi xảy ra khi cập nhật phòng")
      }
    }
  }

  const handleDeleteRoom = async () => {
    if (!selectedRoom) return

    try {
      await roomService.delete(selectedRoom._id)
      toast.success("Xóa phòng thành công")
      setIsDeleteDialogOpen(false)
      setSelectedRoom(null)
      mutate()
    } catch (error) {
      toast.error("Có lỗi xảy ra khi xóa phòng")
    }
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Danh sách phòng</h1>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Thêm phòng
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Danh sách phòng {rooms ? `(${rooms.length} phòng)` : ''}</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-4">Đang tải...</div>
          ) : error ? (
            <div className="text-center text-red-500 py-4">
              Có lỗi xảy ra khi tải dữ liệu: {error.toString()}
            </div>
          ) : !rooms || rooms.length === 0 ? (
            <div className="text-center py-4">Chưa có phòng nào</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Số phòng</TableHead>
                  <TableHead>Số người hiện tại</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead className="text-right">Giá phòng</TableHead>
                  <TableHead className="text-right">Tiền cọc</TableHead>
                  <TableHead className="text-right">Trạng thái cọc</TableHead>
                  <TableHead className="text-center">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rooms.map((room) => (
                  <TableRow key={room._id}>
                    <TableCell className="font-medium">{room.number}</TableCell>
                    <TableCell>{room.currentTenants || 0} người</TableCell>
                    <TableCell>{RoomStatusBadge({ status: room.status })}</TableCell>
                    <TableCell className="text-right">{formatCurrency(room.price)}</TableCell>
                    <TableCell className="text-right">{formatCurrency(room.deposit)}</TableCell>
                    <TableCell className="text-right">
                      <Badge variant={room.isDepositPaid ? "default" : "secondary"} className={room.isDepositPaid ? "bg-green-500" : ""}>
                        {room.isDepositPaid ? "Đã đóng" : "Chưa đóng"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedRoom(room)
                            setIsEditDialogOpen(true)
                          }}
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedRoom(room)
                            setIsDeleteDialogOpen(true)
                          }}
                        >
                          <Trash2 className="w-4 h-4" />
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

      <RoomDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onSubmit={handleAddRoom}
      />

      {selectedRoom && (
        <>
          <RoomDialog
            open={isEditDialogOpen}
            onOpenChange={setIsEditDialogOpen}
            defaultValues={selectedRoom}
            onSubmit={(data) => handleEditRoom(selectedRoom._id, data)}
          />

          <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Bạn có chắc chắn?</AlertDialogTitle>
                <AlertDialogDescription>
                  Hành động này không thể hoàn tác. Phòng số {selectedRoom.number} sẽ bị xóa vĩnh viễn.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Hủy</AlertDialogCancel>
                <AlertDialogAction onClick={handleDeleteRoom}>Xóa</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </>
      )}
    </div>
  )
}
