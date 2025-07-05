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
  roomName: string
  roomCharge: number
  electricityCharge: number
  waterCharge: number
  otherCharges: number
  totalAmount: number
  invoiceId: string
  status: 'PENDING' | 'PAID' | 'OVERDUE'
}

export interface InvoiceResponse {
  data: Invoice[]
  summary: {
    total: number
    paid: number
    pending: number
    overdue: number
    totalAmount: number
    paidAmount: number
    pendingAmount: number
  }
}

// Dashboard Types
export interface DashboardStats {
  // Tổng quan phòng
  totalRooms: number
  occupiedRooms: number
  emptyRooms: number
  
  // Doanh thu
  monthlyRevenue: number
  revenueGrowth: number // Phần trăm tăng/giảm so với tháng trước
  
  // Phòng nợ tiền
  overdueRooms: number
  urgentCollections: boolean // Cần thu tiền gấp
  
  // Thống kê hóa đơn
  unpaidInvoices: number
}

export interface RoomStatusItem {
  roomNumber: string
  status: RoomStatus
  tenantName: string | null
  price: number
}

export interface DashboardResponse {
  stats: DashboardStats
  roomStatusList: RoomStatusItem[]
  unpaidInvoices: Invoice[]
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

export interface UtilityReading {
  _id: string
  room: Room | string
  month: string
  electricityStart: number
  electricityEnd: number | null
  electricityConsumption: number | null
  waterStart: number
  waterEnd: number | null
  waterConsumption: number | null
  isDeleted: boolean
  createdAt: string
  updatedAt: string
}

export type CreateUtilityReadingDto = {
  room: string
  month: string
  electricityStart: number
  electricityEnd?: number
  waterStart: number
  waterEnd?: number
}

export type UpdateUtilityReadingDto = Partial<CreateUtilityReadingDto> 

// Settings Types
export interface Settings {
  _id: string
  electricityUnitPrice: number    // Giá điện (VND/kWh)
  waterUnitPrice: number         // Giá nước (VND/m3)
  garbageCharge: number         // Phí rác (VND/phòng/tháng)
  isDeleted: boolean
  createdAt: string
  updatedAt: string
  __v: number
}

export type UpdateSettingsDto = Pick<Settings, 'electricityUnitPrice' | 'waterUnitPrice' | 'garbageCharge'>