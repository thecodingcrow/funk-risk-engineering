import type { Metadata } from "next"
import { Noto_Sans } from "next/font/google"
import "./globals.css"
import Layout from "../components/Layout"
import { AuthProvider } from "@/lib/auth/AuthContext"
import type React from "react"

const notoSans = Noto_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
})

export const metadata: Metadata = {
  title: "Case Management System",
  description: "Employee portal for case management",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={notoSans.className}>
        <AuthProvider>
          <Layout>{children}</Layout>
        </AuthProvider>
      </body>
    </html>
  )
}

