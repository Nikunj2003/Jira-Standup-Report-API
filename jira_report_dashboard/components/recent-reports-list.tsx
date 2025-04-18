"use client"

import Link from "next/link"
import type { Report } from "@/lib/api"
import { FileText, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"

interface RecentReportsListProps {
  reports: Report[]
}

export function RecentReportsList({ reports }: RecentReportsListProps) {
  if (reports.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="rounded-full bg-primary/10 p-4 mb-4">
          <FileText className="h-10 w-10 text-primary" />
        </div>
        <h3 className="text-lg font-medium">No reports available</h3>
        <p className="text-sm text-muted-foreground mt-2">Reports will appear here once generated</p>
      </div>
    )
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 },
  }

  return (
    <motion.div className="space-y-4" variants={container} initial="hidden" animate="show">
      {reports.map((report) => (
        <motion.div
          key={report.id}
          variants={item}
          className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
        >
          <div className="flex items-start space-x-4">
            <div className="rounded-full bg-primary/10 p-2">
              <FileText className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h4 className="font-medium">{report.subject}</h4>
              <p className="text-sm text-muted-foreground">{new Date(report.date).toLocaleString()}</p>
              {report.hasPdf && (
                <Badge variant="outline" className="mt-1">
                  PDF Available
                </Badge>
              )}
            </div>
          </div>
          <div className="flex space-x-2">
            {report.hasPdf && (
              <Button variant="outline" size="sm" className="hover:bg-primary/10 transition-colors">
                <Download className="h-4 w-4 mr-1" />
                PDF
              </Button>
            )}
            <Button
              variant="default"
              size="sm"
              asChild
              className="gradient-bg-blue hover:opacity-90 transition-opacity"
            >
              <Link href={`/reports/${report.id}`}>View</Link>
            </Button>
          </div>
        </motion.div>
      ))}
    </motion.div>
  )
}
