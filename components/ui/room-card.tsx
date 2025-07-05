import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./card"
import { Badge } from "./badge"
import type { Room } from "@/lib/api/types"
import { formatCurrency } from "@/lib/utils"
import { RoomStatus } from "@/lib/api/room-status"

interface RoomCardProps {
  room: Room
}

const statusColorMap = {
  [RoomStatus.AVAILABLE]: "bg-green-500",
  [RoomStatus.FULL]: "bg-red-500",
}

export function RoomCard({ room }: RoomCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Phòng {room.number}</CardTitle>
          <Badge className={statusColorMap[room.status || RoomStatus.AVAILABLE]}>
            {room.status === RoomStatus.AVAILABLE ? "Còn trống" : "Đã đủ người"}
          </Badge>
        </div>
        <CardDescription>
          {room.currentTenants || 0} người
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-2">
        <div className="flex items-center justify-between">
          <span className="text-sm">Giá phòng:</span>
          <span className="font-medium">{formatCurrency(room.price)}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm">Tiền cọc:</span>
          <span className="font-medium">{formatCurrency(room.deposit)}</span>
        </div>
      </CardContent>
    </Card>
  )
} 