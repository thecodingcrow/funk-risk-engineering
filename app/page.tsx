"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/lib/auth/AuthContext"

export default function Home() {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()

  // If authenticated, redirect to dashboard
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push("/dashboard")
    }
  }, [isAuthenticated, isLoading, router])

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)]">
      <h1 className="text-4xl font-bold mb-8">Welcome to Case Management System</h1>
      <div className="space-y-4 text-center">
        <p className="text-lg text-muted-foreground max-w-md">
          A comprehensive solution for managing cases, customers, and locations.
        </p>
        <Link
          href="/login"
          className="inline-block px-6 py-3 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
        >
          Login to Dashboard
        </Link>
      </div>
    </div>
  )
}

