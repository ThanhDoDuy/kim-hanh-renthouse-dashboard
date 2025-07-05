import { api } from "./api-client"
import type {
  DashboardStats,
  Room,
  RoomStatus,
  Tenant,
  Invoice,
  PaginatedResponse,
  CreateRoomDto,
  CreateTenantDto,
} from "./types"
// Dashboard Services
export const dashboardService = {
  getStats: () => api.get<DashboardStats>('/dashboard/stats'),
  getRecentRooms: () => api.get<Room[]>('/dashboard/recent-rooms'),
  getUnpaidInvoices: () => api.get<Invoice[]>('/dashboard/unpaid-invoices'),
}

// Room Services
export const roomService = {
  getAll: () => api.get<Room[]>("/rooms"),
  getById: (id: string) => api.get<Room>(`/rooms/${id}`),
  create: (data: CreateRoomDto) => api.post<Room>("/rooms", data),
  update: (id: string, data: Partial<Room>) => api.put<Room>(`/rooms/${id}`, data),
  delete: (id: string) => api.delete<void>(`/rooms/${id}`),
  updateTenantDates: (roomId: string, data: { moveInDate?: string; moveOutDate?: string }) => 
    api.put<Room>(`/rooms/${roomId}/tenant-dates`, data),
}

// Tenant Services
export const tenantService = {
  getAll: () => api.get<Tenant[]>("/tenants"),
  getById: (id: string) => api.get<Tenant>(`/tenants/${id}`),
  create: (data: CreateTenantDto) => api.post<Tenant>("/tenants", data),
  update: (id: string, data: Partial<CreateTenantDto>) => api.put<Tenant>(`/tenants/${id}`, data),
  delete: (id: string) => api.delete<void>(`/tenants/${id}`),
}

// Invoice Services
export const invoiceService = {
  getAll: (page = 1, pageSize = 10) =>
    api.get<PaginatedResponse<Invoice>>(`/invoices?page=${page}&pageSize=${pageSize}`),
  getById: (id: number) => api.get<Invoice>(`/invoices/${id}`),
  create: (data: Omit<Invoice, 'id'>) => api.post<Invoice>('/invoices', data),
  update: (id: number, data: Partial<Invoice>) => api.put<Invoice>(`/invoices/${id}`, data),
  delete: (id: number) => api.delete<void>(`/invoices/${id}`),
  markAsPaid: (id: number) => api.put<Invoice>(`/invoices/${id}/pay`, {}),
  getByRoom: (roomId: number) => api.get<Invoice[]>(`/rooms/${roomId}/invoices`),
  getByTenant: (tenantId: number) => api.get<Invoice[]>(`/tenants/${tenantId}/invoices`),
} 