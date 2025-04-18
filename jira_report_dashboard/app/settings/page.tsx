"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/hooks/use-toast"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Clock, RefreshCw, Save, Info } from "lucide-react"
import { getCurrentSchedule, setCronTime, triggerManualReport } from "@/lib/api"
import { motion } from "framer-motion"

export default function SettingsPage() {
  const [currentSchedule, setCurrentSchedule] = useState<string>("")
  const [newSchedule, setNewSchedule] = useState<string>("")
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [generating, setGenerating] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    async function fetchCurrentSchedule() {
      try {
        const schedule = await getCurrentSchedule()
        setCurrentSchedule(schedule)
        setNewSchedule(schedule)
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch current schedule",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchCurrentSchedule()
  }, [toast])

  const handleSaveSchedule = async () => {
    if (!newSchedule.trim()) {
      toast({
        title: "Error",
        description: "Schedule cannot be empty",
        variant: "destructive",
      })
      return
    }

    setSaving(true)
    try {
      const message = await setCronTime(newSchedule)
      setCurrentSchedule(newSchedule)
      toast({
        title: "Success",
        description: message || "Schedule updated successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update schedule",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const handleGenerateReport = async () => {
    setGenerating(true)
    try {
      const message = await triggerManualReport()
      toast({
        title: "Success",
        description: message || "Report generated successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate report",
        variant: "destructive",
      })
    } finally {
      setGenerating(false)
    }
  }

  return (
    <div className="container py-8 space-y-8">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <Card className="shadow-sm hover:shadow-md transition-shadow gradient-card overflow-hidden">
          <CardHeader className="bg-muted/30 border-b">
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              Report Schedule
            </CardTitle>
            <CardDescription>Configure when the Jira report should be automatically generated</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 p-6">
            <div className="space-y-2">
              <Label htmlFor="current-schedule" className="text-sm font-medium">
                Current Schedule (Cron Format)
              </Label>
              {loading ? (
                <Skeleton className="h-10 w-full" />
              ) : (
                <div className="flex h-10 w-full rounded-md border border-input bg-muted/50 px-3 py-2 text-sm">
                  <code className="font-mono">{currentSchedule}</code>
                </div>
              )}
              <p className="text-sm text-muted-foreground">
                The current schedule in cron format (e.g., "0 9 * * *" for daily at 9 AM)
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="new-schedule" className="text-sm font-medium">
                New Schedule
              </Label>
              <Input
                id="new-schedule"
                placeholder="0 9 * * *"
                value={newSchedule}
                onChange={(e) => setNewSchedule(e.target.value)}
                disabled={loading}
                className="font-mono"
              />
              <p className="text-sm text-muted-foreground">Enter a new cron schedule pattern</p>
            </div>

            <Alert className="bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-900">
              <Info className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              <AlertTitle>Cron Format Help</AlertTitle>
              <AlertDescription>
                <p className="text-sm">
                  Cron format consists of 5 fields: minute, hour, day of month, month, day of week
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                  <div className="bg-white dark:bg-slate-900 p-2 rounded-md text-sm">
                    <code className="font-mono text-primary">0 9 * * *</code>
                    <p className="text-xs mt-1">Every day at 9:00 AM</p>
                  </div>
                  <div className="bg-white dark:bg-slate-900 p-2 rounded-md text-sm">
                    <code className="font-mono text-primary">0 9 * * 1-5</code>
                    <p className="text-xs mt-1">Every weekday at 9:00 AM</p>
                  </div>
                  <div className="bg-white dark:bg-slate-900 p-2 rounded-md text-sm">
                    <code className="font-mono text-primary">0 9 1 * *</code>
                    <p className="text-xs mt-1">First day of every month at 9:00 AM</p>
                  </div>
                  <div className="bg-white dark:bg-slate-900 p-2 rounded-md text-sm">
                    <code className="font-mono text-primary">0 */3 * * *</code>
                    <p className="text-xs mt-1">Every 3 hours (at 0 minutes)</p>
                  </div>
                </div>
              </AlertDescription>
            </Alert>
          </CardContent>
          <CardFooter className="flex justify-between gap-4 border-t bg-muted/30 p-4">
            <Button variant="outline" onClick={handleGenerateReport} disabled={generating} className="transition-all">
              {generating ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Generate Now
                </>
              )}
            </Button>
            <Button
              onClick={handleSaveSchedule}
              disabled={saving || loading || newSchedule === currentSchedule}
              className="gradient-bg-blue hover:opacity-90 transition-opacity"
            >
              {saving ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Schedule
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  )
}
