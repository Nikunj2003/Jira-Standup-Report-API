import type React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

interface ReportStatusCardProps {
  title: string
  value: string
  icon: React.ReactNode
  loading?: boolean
  className?: string
}

export function ReportStatusCard({ title, value, icon, loading = false, className }: ReportStatusCardProps) {
  return (
    <Card className={cn("overflow-hidden transition-all", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="rounded-full bg-primary/10 p-1">{icon}</div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <Skeleton className="h-8 w-[100px]" />
        ) : (
          <div className="text-3xl font-bold tracking-tight">{value}</div>
        )}
      </CardContent>
    </Card>
  )
}
