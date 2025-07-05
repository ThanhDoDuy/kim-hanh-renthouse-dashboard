import { useState, useMemo } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "./dialog"
import { Button } from "./button"
import { Label } from "./label"
import { Input } from "./input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./select"
import type { Room, Tenant, TenantStatus, CreateTenantDto } from "@/lib/api/types"
import { format, parseISO } from "date-fns"
import { toast } from "sonner"
import { RoomStatus } from "@/lib/api/room-status"

interface TenantDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  defaultValues?: Tenant
  rooms: Room[]
  onSubmit: (data: CreateTenantDto) => Promise<void>
}

export function TenantDialog({ open, onOpenChange, defaultValues, rooms, onSubmit }: TenantDialogProps) {
  const [formData, setFormData] = useState<Omit<CreateTenantDto, 'moveInDate' | 'moveOutDate'> & {
    moveInDate: string
    moveOutDate: string
  }>({
    fullName: defaultValues?.fullName || "",
    phoneNumber: defaultValues?.phoneNumber || "",
    room: defaultValues?.room instanceof Object ? defaultValues.room._id : (defaultValues?.room || ""),
    moveInDate: defaultValues?.moveInDate ? format(defaultValues.moveInDate, "yyyy-MM-dd") : "",
    moveOutDate: defaultValues?.moveOutDate ? format(defaultValues.moveOutDate, "yyyy-MM-dd") : "",
    status: defaultValues?.status || "STAYING",
  })
  const [isLoading, setIsLoading] = useState(false)

  // Filter available rooms
  const availableRooms = useMemo(() => {
    if (defaultValues) {
      // Khi chỉnh sửa: hiển thị phòng hiện tại và các phòng còn trống
      return rooms.filter(room => 
        room.status === RoomStatus.AVAILABLE || 
        (defaultValues.room instanceof Object && room._id === defaultValues.room._id)
      )
    }
    // Khi thêm mới: chỉ hiển thị phòng trống
    return rooms.filter(room => room.status === RoomStatus.AVAILABLE)
  }, [rooms, defaultValues])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.moveInDate) {
      toast.error("Vui lòng chọn ngày chuyển vào")
      return
    }

    // Chỉ validate phòng khi thêm mới
    if (!defaultValues && !formData.room) {
      toast.error("Vui lòng chọn phòng")
      return
    }

    // Validation
    if (formData.moveOutDate) {
      const moveIn = parseISO(formData.moveInDate)
      const moveOut = parseISO(formData.moveOutDate)
      
      if (moveOut < moveIn) {
        toast.error("Ngày chuyển ra phải sau ngày chuyển vào")
        return
      }
    }

    try {
      setIsLoading(true)
      const { moveOutDate, ...rest } = formData
      const submitData: CreateTenantDto = {
        ...rest,
        // Nếu đang edit và không chọn phòng mới, giữ nguyên phòng cũ
        room: formData.room || (defaultValues?.room instanceof Object ? defaultValues.room._id : ""),
        moveInDate: parseISO(formData.moveInDate),
      }

      if (moveOutDate) {
        submitData.moveOutDate = parseISO(moveOutDate)
      }

      await onSubmit(submitData)
    } catch (error) {
      // Error will be handled by parent component
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {defaultValues ? `Chỉnh sửa thông tin ${defaultValues.fullName}` : "Thêm người thuê mới"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="fullName" className="text-right">
                Họ tên
              </Label>
              <Input
                id="fullName"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="phoneNumber" className="text-right">
                Số điện thoại
              </Label>
              <Input
                id="phoneNumber"
                value={formData.phoneNumber}
                onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="room" className="text-right">
                Phòng
              </Label>
              {defaultValues || availableRooms.length > 0 ? (
                <Select
                  value={formData.room}
                  onValueChange={(value) => setFormData({ ...formData, room: value })}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder={
                      defaultValues?.room instanceof Object 
                        ? `Phòng ${defaultValues.room.number}`
                        : "Chọn phòng"
                    } />
                  </SelectTrigger>
                  <SelectContent>
                    {availableRooms
                      .filter(room => !defaultValues || room._id !== (defaultValues.room instanceof Object ? defaultValues.room._id : null))
                      .map((room) => (
                        <SelectItem key={room._id} value={room._id}>
                          Phòng {room.number} ({room.currentTenants || 0} người)
                        </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <div className="col-span-3 text-red-500">
                  Hiện tại không có phòng trống, đề nghị tạo phòng mới
                </div>
              )}
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="moveInDate" className="text-right">
                Ngày chuyển vào
              </Label>
              <Input
                id="moveInDate"
                type="date"
                value={formData.moveInDate}
                onChange={(e) => setFormData({ ...formData, moveInDate: e.target.value })}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="moveOutDate" className="text-right">
                Ngày chuyển ra
              </Label>
              <Input
                id="moveOutDate"
                type="date"
                value={formData.moveOutDate}
                onChange={(e) => setFormData({ ...formData, moveOutDate: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right">
                Trạng thái
              </Label>
              <Select
                value={formData.status}
                onValueChange={(value: TenantStatus) => setFormData({ ...formData, status: value })}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="STAYING">Đang ở</SelectItem>
                  <SelectItem value="DEBT">Nợ tiền</SelectItem>
                  <SelectItem value="MOVED_OUT">Đã chuyển đi</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>
              Hủy
            </Button>
            <Button type="submit" disabled={isLoading || (!defaultValues && availableRooms.length === 0)}>
              {isLoading ? "Đang lưu..." : defaultValues ? "Cập nhật" : "Thêm"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
} 