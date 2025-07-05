import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "./dialog"
import { Button } from "./button"
import { Label } from "./label"
import { Input } from "./input"
import { format } from "date-fns"
import { toast } from "sonner"
import { roomService } from "@/lib/api/services"
import type { Room } from "@/lib/api/types"

interface TenantDatesDialogProps {
  room: Room
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export function TenantDatesDialog({ room, isOpen, onClose, onSuccess }: TenantDatesDialogProps) {
  const [moveInDate, setMoveInDate] = useState(room.moveInDate ? format(new Date(room.moveInDate), "yyyy-MM-dd") : "")
  const [moveOutDate, setMoveOutDate] = useState(room.moveOutDate ? format(new Date(room.moveOutDate), "yyyy-MM-dd") : "")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validation
    if (moveInDate && moveOutDate) {
      const moveIn = new Date(moveInDate)
      const moveOut = new Date(moveOutDate)
      
      if (moveOut < moveIn) {
        toast.error("Ngày chuyển ra phải sau ngày chuyển vào")
        return
      }
    }

    try {
      setIsLoading(true)
      await roomService.updateTenantDates(room._id, {
        moveInDate: moveInDate || undefined,
        moveOutDate: moveOutDate || undefined,
      })
      toast.success("Cập nhật thành công")
      onSuccess()
      onClose()
    } catch (error) {
      toast.error("Có lỗi xảy ra khi cập nhật")
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Cập nhật ngày chuyển vào/ra</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="moveInDate" className="text-right">
                Ngày chuyển vào
              </Label>
              <Input
                id="moveInDate"
                type="date"
                value={moveInDate}
                onChange={(e) => setMoveInDate(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="moveOutDate" className="text-right">
                Ngày chuyển ra
              </Label>
              <Input
                id="moveOutDate"
                type="date"
                value={moveOutDate}
                onChange={(e) => setMoveOutDate(e.target.value)}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" type="button" onClick={onClose}>
              Hủy
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Đang lưu..." : "Lưu"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
} 