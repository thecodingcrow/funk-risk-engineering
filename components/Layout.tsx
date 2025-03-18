import type React from "react"
import Sidebar from "./Sidebar"

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
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
  )
}

