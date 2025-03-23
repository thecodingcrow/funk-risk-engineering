"use client"

import type React from "react"

import { usePathname } from "next/navigation"
import Sidebar from "./Sidebar"
import { useAuth } from "@/lib/auth/AuthContext"
import ProtectedRoute from "./ProtectedRoute"

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const { isAuthenticated } = useAuth()

  // List of public routes that don't need authentication
  const publicRoutes = ["/login", "/"]
  const isPublicRoute = publicRoutes.some((route) => pathname === route)

  // For public routes, render without protection
  if (isPublicRoute) {
    return (
      <div className="flex min-h-screen bg-background text-foreground">
        {isAuthenticated && pathname === "/" && (
          <div className="fixed left-0 top-0 z-30 h-screen">
            <Sidebar />
          </div>
        )}
        <main className={`flex-1 overflow-y-auto ${isAuthenticated && pathname === "/" ? "ml-64" : ""}`}>
          <div className="container mx-auto px-4 py-8">
            <div className="animate-in">{children}</div>
          </div>
        </main>
      </div>
    )
  }

  // For protected routes, wrap with ProtectedRoute component
  return (
    <ProtectedRoute>
      <div className="flex min-h-screen bg-background text-foreground">
        <div className="fixed left-0 top-0 z-30 h-screen">
          <Sidebar />
        </div>
        <main className="flex-1 overflow-y-auto ml-64">
          <div className="container mx-auto px-4 py-8">
            <div className="animate-in">{children}</div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  )
}

