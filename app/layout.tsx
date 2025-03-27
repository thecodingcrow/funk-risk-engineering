import type { Metadata } from "next"
import { Noto_Sans } from "next/font/google"
import "./globals.css"
import Layout from "../components/Layout"
import { AuthProvider } from "@/lib/auth/AuthContext"
import type React from "react"
import { ThemeProvider } from "@/components/theme-provider"

const notoSans = Noto_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
})

export const metadata: Metadata = {
  title: "FUNK Risikomanagement",
  description: "Mitarbeiterportal für Fallverwaltung",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="de" suppressHydrationWarning>
      <body className={notoSans.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <AuthProvider>
            <Layout>{children}</Layout>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

