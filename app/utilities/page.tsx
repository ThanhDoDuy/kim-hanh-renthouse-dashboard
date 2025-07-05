"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Zap, Droplets } from "lucide-react"

// Mock data
const utilityReadings = [
  {
    id: 1,
    room: "101",
    month: "2024-01",
    electricPrevious: 150,
    electricCurrent: 180,
    electricUsage: 30,
    waterPrevious: 25,
    waterCurrent: 28,
    waterUsage: 3,
    status: "recorded",
  },
  {
    id: 2,
    room: "102",
    month: "2024-01",
    electricPrevious: 120,
    electricCurrent: 145,
    electricUsage: 25,
    waterPrevious: 20,
    waterCurrent: 23,
    waterUsage: 3,
    status: "recorded",
  },
  {
    id: 3,
    room: "103",
    month: "2024-01",
    electricPrevious: 200,
    electricCurrent: null,
    electricUsage: null,
    waterPrevious: 35,
    waterCurrent: null,
    waterUsage: null,
    status: "pending",
  },
]

const rooms = ["101", "102", "103", "201", "202", "203"]

export default function UtilitiesPage() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [selectedMonth, setSelectedMonth] = useState("2024-01")

  return (
    <div className="space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <SidebarTrigger />
          <h2 className="text-3xl font-bold tracking-tight">Chỉ số điện nước</h2>
        </div>
        <div className="flex gap-2">
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
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Ghi chỉ số
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Ghi chỉ số điện nước</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="room">Phòng</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn phòng" />
                    </SelectTrigger>
                    <SelectContent>
                      {rooms.map((room) => (
                        <SelectItem key={room} value={room}>
                          Phòng {room}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="month">Tháng</Label>
                  <Input id="month" type="month" defaultValue="2024-01" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="electricPrevious">Điện đầu kỳ</Label>
                    <Input id="electricPrevious" placeholder="150" type="number" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="electricCurrent">Điện cuối kỳ</Label>
                    <Input id="electricCurrent" placeholder="180" type="number" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="waterPrevious">Nước đầu kỳ</Label>
                    <Input id="waterPrevious" placeholder="25" type="number" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="waterCurrent">Nước cuối kỳ</Label>
                    <Input id="waterCurrent" placeholder="28" type="number" />
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Hủy
                </Button>
                <Button onClick={() => setIsAddDialogOpen(false)}>Lưu chỉ số</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Chỉ số điện nước tháng {selectedMonth}
          </CardTitle>
        </CardHeader>
        <CardContent>
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
                <TableHead className="text-center">Trạng thái</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {utilityReadings.map((reading) => (
                <TableRow key={reading.id}>
                  <TableCell className="font-medium">Phòng {reading.room}</TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-1">
                      <Zap className="h-4 w-4 text-yellow-500" />
                      {reading.electricPrevious}
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-1">
                      <Zap className="h-4 w-4 text-yellow-500" />
                      {reading.electricCurrent || "Chưa ghi"}
                    </div>
                  </TableCell>
                  <TableCell className="text-center font-medium">
                    {reading.electricUsage ? `${reading.electricUsage} kWh` : "-"}
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-1">
                      <Droplets className="h-4 w-4 text-blue-500" />
                      {reading.waterPrevious}
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-1">
                      <Droplets className="h-4 w-4 text-blue-500" />
                      {reading.waterCurrent || "Chưa ghi"}
                    </div>
                  </TableCell>
                  <TableCell className="text-center font-medium">
                    {reading.waterUsage ? `${reading.waterUsage} m³` : "-"}
                  </TableCell>
                  <TableCell className="text-center">
                    {reading.status === "recorded" ? (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                        Đã ghi
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800">
                        Chưa ghi
                      </span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
