import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "./dialog"
import { Button } from "./button"
import { Label } from "./label"
import { Input } from "./input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./select"
import type { UtilityReading, CreateUtilityReadingDto, UpdateUtilityReadingDto, Room } from "@/lib/api/types"
import { useState, useEffect } from "react"

interface UtilityReadingDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  defaultValues?: UtilityReading
  onSubmit: (data: CreateUtilityReadingDto | UpdateUtilityReadingDto) => Promise<void>
  rooms: Room[]
}

interface FormData {
  room: string
  month: string
  electricityStart: number | string
  electricityEnd: number | string
  waterStart: number | string
  waterEnd: number | string
}

export function UtilityReadingDialog({ open, onOpenChange, defaultValues, onSubmit, rooms }: UtilityReadingDialogProps) {
  const [formData, setFormData] = useState<FormData>({
    room: typeof defaultValues?.room === 'string' ? defaultValues.room : 
          typeof defaultValues?.room === 'object' ? defaultValues.room._id : "",
    month: defaultValues?.month || new Date().toISOString().slice(0, 7),
    electricityStart: defaultValues?.electricityStart || "",
    electricityEnd: defaultValues?.electricityEnd || "",
    waterStart: defaultValues?.waterStart || "",
    waterEnd: defaultValues?.waterEnd || "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [electricityUsage, setElectricityUsage] = useState<number | null>(null)
  const [waterUsage, setWaterUsage] = useState<number | null>(null)

  useEffect(() => {
    // Calculate usage when start or end values change
    const eStart = Number(formData.electricityStart)
    const eEnd = Number(formData.electricityEnd)
    const wStart = Number(formData.waterStart)
    const wEnd = Number(formData.waterEnd)

    if (!isNaN(eStart) && !isNaN(eEnd) && eEnd >= eStart) {
      setElectricityUsage(eEnd - eStart)
    } else {
      setElectricityUsage(null)
    }

    if (!isNaN(wStart) && !isNaN(wEnd) && wEnd >= wStart) {
      setWaterUsage(wEnd - wStart)
    } else {
      setWaterUsage(null)
    }
  }, [formData])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const dataToSubmit: CreateUtilityReadingDto = {
      room: formData.room,
      month: formData.month,
      electricityStart: Number(formData.electricityStart),
      electricityEnd: Number(formData.electricityEnd),
      waterStart: Number(formData.waterStart),
      waterEnd: Number(formData.waterEnd),
    }
    
    try {
      setIsLoading(true)
      await onSubmit(dataToSubmit)
      onOpenChange(false)
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
            {defaultValues ? "Chỉnh sửa chỉ số điện nước" : "Thêm chỉ số điện nước"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="room">Phòng</Label>
              <Select
                value={formData.room}
                onValueChange={(value) => setFormData({ ...formData, room: value })}
                disabled={!!defaultValues}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn phòng" />
                </SelectTrigger>
                <SelectContent>
                  {rooms.map((room) => (
                    <SelectItem key={room._id} value={room._id}>
                      Phòng {room.number}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="month">Tháng</Label>
              <Input
                id="month"
                type="month"
                value={formData.month}
                onChange={(e) => setFormData({ ...formData, month: e.target.value })}
                disabled={!!defaultValues}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="electricityStart">Điện đầu kỳ</Label>
                <Input
                  id="electricityStart"
                  type="number"
                  min="0"
                  value={formData.electricityStart}
                  onChange={(e) => handleNumberChange(e, "electricityStart")}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="electricityEnd">Điện cuối kỳ</Label>
                <Input
                  id="electricityEnd"
                  type="number"
                  min="0"
                  value={formData.electricityEnd}
                  onChange={(e) => handleNumberChange(e, "electricityEnd")}
                  required
                />
              </div>
            </div>
            {electricityUsage !== null && (
              <div className="text-sm text-muted-foreground">
                Tiêu thụ điện: {electricityUsage} kWh
              </div>
            )}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="waterStart">Nước đầu kỳ</Label>
                <Input
                  id="waterStart"
                  type="number"
                  min="0"
                  value={formData.waterStart}
                  onChange={(e) => handleNumberChange(e, "waterStart")}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="waterEnd">Nước cuối kỳ</Label>
                <Input
                  id="waterEnd"
                  type="number"
                  min="0"
                  value={formData.waterEnd}
                  onChange={(e) => handleNumberChange(e, "waterEnd")}
                  required
                />
              </div>
            </div>
            {waterUsage !== null && (
              <div className="text-sm text-muted-foreground">
                Tiêu thụ nước: {waterUsage} m³
              </div>
            )}
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