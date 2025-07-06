import { api } from "./api-client"
import type {
  DashboardStats,
  Room,
  Tenant,
  Invoice,
  CreateRoomDto,
  CreateTenantDto,
  UtilityReading,
  CreateUtilityReadingDto,
  UpdateUtilityReadingDto,
  InvoiceResponse,
  DashboardResponse,
  Settings,
  UpdateSettingsDto,
} from "./types"
// Dashboard Services
export const dashboardService = {
  getDashboard: () => api.get<DashboardResponse>('/dashboard'),
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
  getAll: () => api.get<InvoiceResponse>('/invoices'),
  getById: (id: string) => api.get<Invoice>(`/invoices/${id}`),
  create: (data: Omit<Invoice, 'invoiceId'>) => api.post<Invoice>('/invoices', data),
  update: (id: string, data: Partial<Invoice>) => api.put<Invoice>(`/invoices/${id}`, data),
  delete: (id: string) => api.delete<void>(`/invoices/${id}`),
  markAsPaid: (id: string) => api.put<Invoice>(`/invoices/${id}/mark-paid`, {}),
  sendReminder: (id: string) => api.post<void>(`/invoices/${id}/send-reminder`, {}),
  getByRoom: (roomId: string) => api.get<Invoice[]>(`/rooms/${roomId}/invoices`),
  getByTenant: (tenantId: string) => api.get<Invoice[]>(`/tenants/${tenantId}/invoices`),
  getByMonth: (month: string) => api.get<InvoiceResponse>(`/invoices?month=${month}`),
  generateMonth: (month: string) => api.post<void>(`/invoices/generate-month`, { month }),
}

export const utilityReadingService = {
  getAll: () => api.get<UtilityReading[]>("/utility-readings"),
  getByMonth: (month: string) => api.get<UtilityReading[]>(`/utility-readings?month=${month}`),
  getById: (id: string) => api.get<UtilityReading>(`/utility-readings/${id}`),
  create: (data: CreateUtilityReadingDto) => api.post<UtilityReading>("/utility-readings", data),
  update: (id: string, data: UpdateUtilityReadingDto) => api.put<UtilityReading>(`/utility-readings/${id}`, data),
  delete: (id: string) => api.delete<void>(`/utility-readings/${id}`),
}

export const settingsService = {
  get: () => api.get<Settings>('/house-settings'),
  update: (data: UpdateSettingsDto) => api.put<Settings>('/house-settings', data),
}