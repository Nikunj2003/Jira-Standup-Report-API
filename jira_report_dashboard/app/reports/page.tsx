"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/hooks/use-toast"
import { FileText, Search } from "lucide-react"
import { getRecentReports, type Report } from "@/lib/api"
import Link from "next/link"
import { motion } from "framer-motion"

export default function ReportsPage() {
  const [reports, setReports] = useState<Report[]>([])
  const [filteredReports, setFilteredReports] = useState<Report[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const { toast } = useToast()

  useEffect(() => {
    async function fetchReports() {
      try {
        const data = await getRecentReports()
        setReports(data)
        setFilteredReports(data)
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch reports",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchReports()
  }, [toast])

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredReports(reports)
    } else {
      const filtered = reports.filter(
        (report) =>
          report.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
          report.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
          new Date(report.date).toLocaleDateString().includes(searchQuery),
      )
      setFilteredReports(filtered)
    }
  }, [searchQuery, reports])

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
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  }

  return (
    <div className="container py-8 space-y-8">
      <motion.div
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
        <div className="relative w-full sm:w-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search reports..."
            className="w-full sm:w-[280px] pl-9 pr-4 rounded-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <Card className="shadow-sm hover:shadow-md transition-shadow gradient-card overflow-hidden">
          <CardHeader className="bg-muted/30">
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Report History
            </CardTitle>
            <CardDescription>View and access all generated Jira reports</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            {loading ? (
              <div className="space-y-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex items-center space-x-4 p-4 border rounded-lg">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-[250px]" />
                      <Skeleton className="h-4 w-[200px]" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredReports.length > 0 ? (
              <motion.div className="space-y-4" variants={container} initial="hidden" animate="show">
                {filteredReports.map((report) => (
                  <motion.div
                    key={report.id}
                    variants={item}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-all duration-200"
                  >
                    <div className="flex items-start space-x-4">
                      <div className="bg-primary/10 p-2 rounded-full">
                        <FileText className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium">{report.subject}</h4>
                        <p className="text-sm text-muted-foreground">
                          Generated on {new Date(report.date).toLocaleString()}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">ID: {report.id}</p>
                      </div>
                    </div>
                    <div className="flex space-x-2 self-end sm:self-auto mt-4 sm:mt-0">
                      <Button
                        variant="default"
                        size="sm"
                        asChild
                        className="gradient-bg-blue hover:opacity-90 transition-opacity"
                      >
                        <Link href={`/reports/${report.id}`}>View Report</Link>
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="rounded-full bg-primary/10 p-4 mb-4">
                  <FileText className="h-10 w-10 text-primary" />
                </div>
                <h3 className="text-lg font-medium">No reports found</h3>
                <p className="text-sm text-muted-foreground mt-2">
                  {searchQuery ? "Try adjusting your search query" : "Reports will appear here once generated"}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
