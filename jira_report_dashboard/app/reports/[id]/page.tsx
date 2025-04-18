"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft, Download, FileText } from "lucide-react"
import { getReportContent } from "@/lib/api"
import ReactMarkdown from "react-markdown"
import { motion } from "framer-motion"

export default function ReportDetailPage() {
  const params = useParams<{ id: string }>()
  const router = useRouter()
  const [content, setContent] = useState<string>("")
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    async function fetchReportContent() {
      try {
        const data = await getReportContent(params.id)
        setContent(data)
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch report content",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchReportContent()
    }
  }, [params.id, toast])

  return (
    <div className="container py-8 space-y-8">
      <motion.div
        className="flex items-center gap-2"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Button variant="outline" size="icon" onClick={() => router.back()} className="rounded-full">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">Report Details</h1>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <Card className="overflow-hidden shadow-sm hover:shadow-md transition-shadow gradient-card">
          <CardHeader className="bg-muted/30 border-b">
            <CardTitle className="flex items-center gap-2">
              <div className="bg-primary/10 p-1.5 rounded-full">
                <FileText className="h-5 w-5 text-primary" />
              </div>
              Report {params.id}
            </CardTitle>
            <CardDescription>Detailed view of the generated report</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            {loading ? (
              <div className="space-y-4">
                <Skeleton className="h-6 w-[80%]" />
                <Skeleton className="h-6 w-[60%]" />
                <Skeleton className="h-6 w-[70%]" />
                <Skeleton className="h-6 w-[40%]" />
                <Skeleton className="h-6 w-[90%]" />
                <Skeleton className="h-6 w-[50%]" />
                <Skeleton className="h-6 w-[75%]" />
              </div>
            ) : (
              <div className="prose dark:prose-invert max-w-none">
                <ReactMarkdown>{content}</ReactMarkdown>
              </div>
            )}
          </CardContent>
          <CardFooter className="border-t bg-muted/30 p-4">
            <div className="flex justify-end w-full">
              <Button variant="default" className="gradient-bg-blue hover:opacity-90 transition-opacity">
                <Download className="mr-2 h-4 w-4" />
                Download PDF
              </Button>
            </div>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  )
}
