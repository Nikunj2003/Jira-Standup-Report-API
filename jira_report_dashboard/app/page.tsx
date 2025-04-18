"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/hooks/use-toast"
import { BarChart, Calendar, CheckCircle, Clock, FileText, RefreshCw } from "lucide-react"
import { getRecentReports, getHealthStatus, triggerManualReport, type Report } from "@/lib/api"
import { DashboardChart } from "@/components/dashboard-chart"
import { ReportStatusCard } from "@/components/report-status-card"
import { RecentReportsList } from "@/components/recent-reports-list"
import { motion } from "framer-motion"

export default function DashboardPage() {
  const [reports, setReports] = useState<Report[]>([])
  const [loading, setLoading] = useState(true)
  const [healthStatus, setHealthStatus] = useState<{ status: string; timestamp: string } | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    async function fetchData() {
      try {
        const [reportsData, healthData] = await Promise.all([getRecentReports(), getHealthStatus()])
        setReports(reportsData)
        setHealthStatus(healthData)
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch dashboard data",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [toast])

  const handleGenerateReport = async () => {
    setIsGenerating(true)
    try {
      const message = await triggerManualReport()
      toast({
        title: "Success",
        description: message || "Report generated successfully",
      })
      // Refresh reports list
      const reportsData = await getRecentReports()
      setReports(reportsData)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate report",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  // Calculate some basic metrics for the dashboard
  const totalReports = reports.length
  const latestReportDate = reports.length > 0 ? new Date(reports[0].date).toLocaleDateString() : "No reports yet"

  // Group reports by day for the chart
  const reportsByDay = reports.reduce(
    (acc, report) => {
      const date = new Date(report.date).toLocaleDateString()
      acc[date] = (acc[date] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

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
        className="flex justify-between items-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <Button
          onClick={handleGenerateReport}
          disabled={isGenerating}
          className="gradient-bg-blue hover:opacity-90 transition-opacity"
        >
          {isGenerating ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <FileText className="mr-2 h-4 w-4" />
              Generate Report Now
            </>
          )}
        </Button>
      </motion.div>

      {healthStatus && healthStatus.status === "OK" ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Alert className="bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-900 shadow-sm">
            <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
            <AlertTitle>API Status: Online</AlertTitle>
            <AlertDescription>Last checked: {new Date(healthStatus.timestamp).toLocaleString()}</AlertDescription>
          </Alert>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Alert variant="destructive" className="shadow-sm">
            <AlertTitle>API Status: Offline or Unreachable</AlertTitle>
            <AlertDescription>Please check your connection to the API server.</AlertDescription>
          </Alert>
        </motion.div>
      )}

      <motion.div
        className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
        variants={container}
        initial="hidden"
        animate="show"
      >
        <motion.div variants={item}>
          <ReportStatusCard
            title="Total Reports"
            value={loading ? "-" : totalReports.toString()}
            icon={<FileText className="h-4 w-4 text-muted-foreground" />}
            loading={loading}
            className="gradient-card hover:shadow-md transition-shadow"
          />
        </motion.div>
        <motion.div variants={item}>
          <ReportStatusCard
            title="Latest Report"
            value={loading ? "-" : latestReportDate}
            icon={<Calendar className="h-4 w-4 text-muted-foreground" />}
            loading={loading}
            className="gradient-card hover:shadow-md transition-shadow"
          />
        </motion.div>
        <motion.div variants={item}>
          <ReportStatusCard
            title="Report Frequency"
            value={loading ? "-" : "Daily"}
            icon={<Clock className="h-4 w-4 text-muted-foreground" />}
            loading={loading}
            className="gradient-card hover:shadow-md transition-shadow"
          />
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
      >
        <Tabs defaultValue="chart" className="w-full">
          <TabsList className="w-full max-w-md mx-auto grid grid-cols-2 mb-6">
            <TabsTrigger value="chart" className="data-[state=active]:gradient-bg-blue data-[state=active]:text-white">
              <BarChart className="mr-2 h-4 w-4" />
              Report Analytics
            </TabsTrigger>
            <TabsTrigger value="recent" className="data-[state=active]:gradient-bg-blue data-[state=active]:text-white">
              <FileText className="mr-2 h-4 w-4" />
              Recent Reports
            </TabsTrigger>
          </TabsList>
          <TabsContent value="chart" className="space-y-4">
            <Card className="shadow-sm hover:shadow-md transition-shadow gradient-card">
              <CardHeader>
                <CardTitle>Report Generation Trend</CardTitle>
                <CardDescription>Number of reports generated over time</CardDescription>
              </CardHeader>
              <CardContent className="h-[350px]">
                {loading ? (
                  <div className="space-y-2">
                    <Skeleton className="h-[300px] w-full" />
                  </div>
                ) : (
                  <DashboardChart data={reportsByDay} />
                )}
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="recent">
            <Card className="shadow-sm hover:shadow-md transition-shadow gradient-card">
              <CardHeader>
                <CardTitle>Recent Reports</CardTitle>
                <CardDescription>The 5 most recent reports generated</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="space-y-2">
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                  </div>
                ) : (
                  <RecentReportsList reports={reports} />
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  )
}
