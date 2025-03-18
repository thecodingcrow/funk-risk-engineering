import type { Metadata } from "next"
import { Noto_Sans } from "next/font/google"
import "./globals.css"
import Layout from "../components/Layout"
import type React from "react"

const notoSans = Noto_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
})

export const metadata: Metadata = {
  title: "Case Management System",
  description: "Employee portal for case management",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={notoSans.className}>
        <Layout>{children}</Layout>
      </body>
    </html>
  )
}



import './globals.css'