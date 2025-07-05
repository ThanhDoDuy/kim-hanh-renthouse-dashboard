import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "./dialog"
import { Button } from "./button"
import { Label } from "./label"
import { Input } from "./input"
import { Switch } from "./switch"
import { RoomStatus } from "@/lib/api/room-status"
import type { Room, CreateRoomDto } from "@/lib/api/types"
import { useState } from "react"
import { formatMoneyText } from "@/lib/utils"

interface RoomDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  defaultValues?: Room
  onSubmit: (data: CreateRoomDto) => Promise<void>
}

interface FormData {
  number: string
  tenant?: string | null
  price: number | string
  deposit: number | string
  isDepositPaid: boolean
  currentTenants?: number
}

export function RoomDialog({ open, onOpenChange, defaultValues, onSubmit }: RoomDialogProps) {
  const [formData, setFormData] = useState<FormData>({
    number: defaultValues?.number || "",
    tenant: defaultValues?.tenant || null,
    price: defaultValues?.price || "",
    deposit: defaultValues?.deposit || "",
    isDepositPaid: defaultValues?.isDepositPaid || false,
  })
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Convert string values to numbers before submitting
    const dataToSubmit: CreateRoomDto = {
      ...formData,
      status: RoomStatus.AVAILABLE, // Mặc định là AVAILABLE khi tạo mới
      price: Number(formData.price) || 0,
      deposit: Number(formData.deposit) || 0,
    }
    
    try {
      setIsLoading(true)
      await onSubmit(dataToSubmit)
    } catch (error) {
      // Error will be handled by parent component
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>, field: keyof FormData) => {
    const value = e.target.value
    setFormData({
      ...formData,
      [field]: value,
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {defaultValues ? `Chỉnh sửa phòng ${defaultValues.number}` : "Thêm phòng mới"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="number" className="text-right">
                Số phòng
              </Label>
              <Input
                id="number"
                value={formData.number}
                onChange={(e) => setFormData({ ...formData, number: e.target.value })}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="price" className="text-right">
                Giá phòng
              </Label>
              <div className="col-span-3 flex items-center gap-2">
                <Input
                  id="price"
                  type="number"
                  min="0"
                  value={formData.price}
                  onChange={(e) => handleNumberChange(e, "price")}
                  required
                />
                {Number(formData.price) > 0 && (
                  <span className="text-sm text-muted-foreground whitespace-nowrap">
                    ({formatMoneyText(Number(formData.price))})
                  </span>
                )}
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="deposit" className="text-right">
                Tiền cọc
              </Label>
              <div className="col-span-3 flex items-center gap-2">
                <Input
                  id="deposit"
                  type="number"
                  min="0"
                  value={formData.deposit}
                  onChange={(e) => handleNumberChange(e, "deposit")}
                  required
                />
                {Number(formData.deposit) > 0 && (
                  <span className="text-sm text-muted-foreground whitespace-nowrap">
                    ({formatMoneyText(Number(formData.deposit))})
                  </span>
                )}
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="isDepositPaid" className="text-right">
                Đã đóng cọc
              </Label>
              <div className="col-span-3">
                <Switch
                  id="isDepositPaid"
                  checked={formData.isDepositPaid}
                  onCheckedChange={(checked) => setFormData({ ...formData, isDepositPaid: checked })}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>
              Hủy
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Đang lưu..." : defaultValues ? "Cập nhật" : "Thêm"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
} 