"use client"

import { useState } from "react"
import { useApiQuery } from "@/hooks/use-api-query"
import { roomService, tenantService } from "@/lib/api/services"
import type { Room, Tenant, TenantStatus, CreateTenantDto } from "@/lib/api/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Edit, Eye, Phone, Pencil, Trash2 } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"
import { format } from "date-fns"
import { vi } from "date-fns/locale"
import { TenantDatesDialog } from "@/components/ui/tenant-dates-dialog"
import { TenantDialog } from "@/components/ui/tenant-dialog"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"

// Mock data
const tenants = [
  {
    id: 1,
    name: "Nguyễn Văn A",
    phone: "0901234567",
    room: "101",
    moveInDate: "2023-01-15",
    idCard: "123456789",
    status: "active",
    deposit: 7000000,
  },
  {
    id: 2,
    name: "Trần Thị B",
    phone: "0912345678",
    room: "103",
    moveInDate: "2023-02-01",
    idCard: "987654321",
    status: "overdue",
    deposit: 7600000,
  },
  {
    id: 3,
    name: "Lê Văn C",
    phone: "0923456789",
    room: "201",
    moveInDate: "2023-03-10",
    idCard: "456789123",
    status: "active",
    deposit: 8000000,
  },
]

const availableRooms = ["102", "203", "301", "302"]

function getStatusBadge(status: TenantStatus) {
  switch (status) {
    case "STAYING":
      return (
        <Badge variant="default" className="bg-green-500">
          Đang ở
        </Badge>
      )
    case "DEBT":
      return <Badge variant="destructive">Nợ tiền</Badge>
    case "MOVED_OUT":
      return (
        <Badge variant="default" className="bg-amber-800">
          Đã chuyển đi
        </Badge>
      )
    default:
      return <Badge variant="outline">Không xác định</Badge>
  }
}

export default function TenantsPage() {
  const { data: tenants, isLoading: isLoadingTenants, error: tenantsError, mutate: mutateTenants } = useApiQuery<Tenant[]>(tenantService.getAll, [])
  const { data: rooms, isLoading: isLoadingRooms } = useApiQuery<Room[]>(roomService.getAll, [])
  
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [selectedTenantId, setSelectedTenantId] = useState<string | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  // Fetch selected tenant details
  const { data: selectedTenant, isLoading: isLoadingSelectedTenant } = useApiQuery<Tenant | null>(
    () => selectedTenantId ? tenantService.getById(selectedTenantId) : Promise.resolve(null),
    [selectedTenantId]
  )

  const handleAddTenant = async (data: CreateTenantDto) => {
    try {
      await tenantService.create(data)
      toast.success("Thêm người thuê thành công")
      setIsAddDialogOpen(false)
      mutateTenants()
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message)
      } else {
        toast.error("Có lỗi xảy ra khi thêm người thuê")
      }
    }
  }

  const handleEditTenant = async (id: string, data: Partial<CreateTenantDto>) => {
    try {
      await tenantService.update(id, data)
      toast.success("Cập nhật thông tin thành công")
      setIsEditDialogOpen(false)
      setSelectedTenantId(null)
      mutateTenants()
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message)
      } else {
        toast.error("Có lỗi xảy ra khi cập nhật thông tin")
      }
    }
  }

  const handleDeleteTenant = async () => {
    if (!selectedTenantId) return

    try {
      await tenantService.delete(selectedTenantId)
      toast.success("Xóa người thuê thành công")
      setIsDeleteDialogOpen(false)
      setSelectedTenantId(null)
      mutateTenants()
    } catch (error) {
      toast.error("Có lỗi xảy ra khi xóa người thuê")
    }
  }

  const isLoading = isLoadingTenants || isLoadingRooms
  const activeTenants = tenants?.filter(tenant => !tenant.isDeleted) || []

  return (
    <>
      {/* Header */}
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <h1 className="text-xl font-semibold">Quản lý người thuê</h1>
        <div className="ml-auto">
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Thêm người thuê
              </Button>
            </DialogTrigger>
          </Dialog>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Danh sách người thuê {activeTenants ? `(${activeTenants.length} người)` : ''}</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-4">Đang tải...</div>
              ) : tenantsError ? (
                <div className="text-center text-red-500 py-4">
                  Có lỗi xảy ra khi tải dữ liệu: {tenantsError.toString()}
                </div>
              ) : !activeTenants || activeTenants.length === 0 ? (
                <div className="text-center py-4">Chưa có người thuê nào</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Họ tên</TableHead>
                      <TableHead>Số điện thoại</TableHead>
                      <TableHead>Phòng</TableHead>
                      <TableHead>Trạng thái</TableHead>
                      <TableHead>Ngày chuyển vào</TableHead>
                      <TableHead>Ngày chuyển ra</TableHead>
                      <TableHead className="text-center">Thao tác</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {activeTenants.map((tenant) => (
                      <TableRow key={tenant._id}>
                        <TableCell className="font-medium">{tenant.fullName}</TableCell>
                        <TableCell>{tenant.phoneNumber}</TableCell>
                        <TableCell>
                          {tenant.room instanceof Object ? `Phòng ${tenant.room.number}` : "Không xác định"}
                        </TableCell>
                        <TableCell>{getStatusBadge(tenant.status)}</TableCell>
                        <TableCell>
                          {format(new Date(tenant.moveInDate), 'dd/MM/yyyy', { locale: vi })}
                        </TableCell>
                        <TableCell>
                          {tenant.moveOutDate ? format(new Date(tenant.moveOutDate), 'dd/MM/yyyy', { locale: vi }) : "-"}
                        </TableCell>
                        <TableCell>
                          <div className="flex justify-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedTenantId(tenant._id)
                                setIsEditDialogOpen(true)
                              }}
                            >
                              <Pencil className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedTenantId(tenant._id)
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
        </div>
      </div>

      {rooms && (
        <TenantDialog
          open={isAddDialogOpen}
          onOpenChange={setIsAddDialogOpen}
          rooms={rooms}
          onSubmit={handleAddTenant}
        />
      )}

      {selectedTenant && rooms && (
        <>
          <TenantDialog
            open={isEditDialogOpen}
            onOpenChange={(open) => {
              setIsEditDialogOpen(open)
              if (!open) setSelectedTenantId(null)
            }}
            defaultValues={selectedTenant}
            rooms={rooms}
            onSubmit={(data) => handleEditTenant(selectedTenant._id, data)}
          />

          <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
                <AlertDialogDescription>
                  Bạn có chắc chắn muốn xóa {selectedTenant.fullName} khỏi danh sách người thuê?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel onClick={() => setSelectedTenantId(null)}>Hủy</AlertDialogCancel>
                <AlertDialogAction onClick={handleDeleteTenant}>Xóa</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </>
      )}
    </>
  )
}
