"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { FileText, Home, Settings } from "lucide-react"
import { motion } from "framer-motion"

export function MainNav() {
  const pathname = usePathname()

  const routes = [
    {
      href: "/",
      label: "Dashboard",
      icon: <Home className="mr-2 h-4 w-4" />,
      active: pathname === "/",
    },
    {
      href: "/reports",
      label: "Reports",
      icon: <FileText className="mr-2 h-4 w-4" />,
      active: pathname === "/reports" || pathname.startsWith("/reports/"),
    },
    {
      href: "/settings",
      label: "Settings",
      icon: <Settings className="mr-2 h-4 w-4" />,
      active: pathname === "/settings",
    },
  ]

  return (
    <nav className="flex items-center space-x-4 lg:space-x-6">
      <Link href="/" className="flex items-center space-x-2 transition-colors hover:text-primary">
        <div className="rounded-full bg-primary p-1.5">
          <FileText className="h-5 w-5 text-white" />
        </div>
        <span className="font-bold inline-block text-lg">Jira Report</span>
      </Link>
      <div className="flex items-center space-x-1 lg:space-x-2 ml-6">
        {routes.map((route) => (
          <Link
            key={route.href}
            href={route.href}
            className={cn(
              "relative flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors hover:text-primary",
              route.active ? "text-primary" : "text-muted-foreground",
            )}
          >
            {route.active && (
              <motion.div
                className="absolute inset-0 rounded-md bg-primary/10"
                layoutId="nav-highlight"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
              />
            )}
            <span className="relative flex items-center">
              {route.icon}
              {route.label}
            </span>
          </Link>
        ))}
      </div>
    </nav>
  )
}
