"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"
import { useApiQuery } from "@/hooks/use-api-query"
import { settingsService } from "@/lib/api/services"
import type { Settings } from "@/lib/api/types"

const formSchema = z.object({
  electricityUnitPrice: z.coerce
    .number()
    .min(0, "Giá điện không được âm")
    .max(100000, "Giá điện không hợp lệ"),
  waterUnitPrice: z.coerce
    .number()
    .min(0, "Giá nước không được âm")
    .max(100000, "Giá nước không hợp lệ"),
  garbageCharge: z.coerce
    .number()
    .min(0, "Phí rác không được âm")
    .max(1000000, "Phí rác không hợp lệ"),
})

export default function SettingsPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { data: settings, isLoading, mutate } = useApiQuery(settingsService.get)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      electricityUnitPrice: 0,
      waterUnitPrice: 0,
      garbageCharge: 0,
    },
  })

  // Cập nhật form khi có dữ liệu từ API
  useEffect(() => {
    if (settings) {
      form.reset({
        electricityUnitPrice: settings.electricityUnitPrice,
        waterUnitPrice: settings.waterUnitPrice,
        garbageCharge: settings.garbageCharge,
      })
    }
  }, [settings, form])

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsSubmitting(true)
      await settingsService.update(values)
      toast.success("Đã lưu cài đặt")
      mutate()
    } catch (error) {
      console.error("Failed to save settings:", error)
      toast.error("Không thể lưu cài đặt")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      {/* Header */}
      <header className="flex h-16 items-center gap-4 border-b px-6">
        <SidebarTrigger />
        <Separator orientation="vertical" className="h-6" />
        <div>
          <h1 className="text-lg font-semibold">Cài đặt hệ thống</h1>
          <p className="text-sm text-muted-foreground">
            Quản lý các thông số cài đặt của hệ thống
          </p>
        </div>
      </header>

      {/* Main Content */}
      <div className="p-6">
        <Card className="max-w-2xl">
          <CardHeader>
            <CardTitle>Cài đặt giá dịch vụ</CardTitle>
            <CardDescription>
              Thiết lập giá điện, nước và các dịch vụ khác
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-4">Đang tải...</div>
            ) : (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="electricityUnitPrice"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Giá điện (VND/kWh)</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="Nhập giá điện..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="waterUnitPrice"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Giá nước (VND/m³)</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="Nhập giá nước..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="garbageCharge"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phí rác (VND/phòng/tháng)</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="Nhập phí rác..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Đang lưu..." : "Lưu cài đặt"}
                  </Button>
                </form>
              </Form>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  )
} 