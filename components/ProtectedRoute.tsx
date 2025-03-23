"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth/AuthContext"

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()
  const [redirectInProgress, setRedirectInProgress] = useState(false)

  useEffect(() => {
    // Only redirect if authentication check is complete and not already redirecting
    if (!redirectInProgress && !isLoading) {
      if (!isAuthenticated) {
        setRedirectInProgress(true)

        // Add a small delay before redirecting
        const redirectTimer = setTimeout(() => {
          router.push("/login")
        }, 100)

        return () => clearTimeout(redirectTimer)
      }
    }
  }, [isAuthenticated, isLoading, router, redirectInProgress])

  // Show loading state while checking authentication
  if (isLoading || (!isAuthenticated && !redirectInProgress)) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  // If authenticated, render children
  return isAuthenticated ? <>{children}</> : null
}

