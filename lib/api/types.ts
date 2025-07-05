// Room Types
export enum RoomStatus {
  AVAILABLE = 'AVAILABLE',
  FULL = 'FULL'
}

export interface Room {
  _id: string
  number: string
  status?: RoomStatus
  tenant: string | null
  price: number
  deposit: number
  isDepositPaid: boolean
  currentTenants: number
  moveInDate?: string
  moveOutDate?: string
  __v: number
}

export type TenantStatus = "STAYING" | "DEBT" | "MOVED_OUT"

export interface Tenant {
  _id: string
  fullName: string
  phoneNumber: string
  room: Room | string
  moveInDate: Date
  moveOutDate?: Date
  status: TenantStatus
  isDeleted: boolean
  createdAt: string
  updatedAt: string
}

export interface CreateTenantDto {
  fullName: string
  phoneNumber: string
  room: string
  moveInDate: Date
  moveOutDate?: Date
  status: TenantStatus
}

export interface CreateRoomDto {
  number: string
  status?: RoomStatus
  tenant?: string | null
  price: number
  deposit: number
  isDepositPaid: boolean
  currentTenants?: number
}

// Invoice Types
export interface Invoice {
  id: number
  roomId: number
  tenantId: number
  amount: number
  dueDate: string
  status: 'paid' | 'unpaid' | 'overdue'
  createdAt: string
  paidAt?: string
}

// Dashboard Types
export interface DashboardStats {
  totalRooms: number
  occupiedRooms: number
  emptyRooms: number
  overdueRooms: number
  monthlyRevenue: number
  unpaidInvoices: number
}

// API Response Types
export interface ApiResponse<T> {
  data: T
  error?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
}

export interface ApiError {
  message: string
  status: number
} 