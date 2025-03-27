"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Users, Briefcase, Bell, Plus, MapPin, LogOut } from "lucide-react"
import { useAuth } from "@/lib/auth/AuthContext"

export default function Sidebar() {
  const pathname = usePathname()
  const { logout, user } = useAuth()

  const navItems = [
    { href: "/dashboard", label: "Dashboard", icon: Home },
    { href: "/customers", label: "Kunden", icon: Users },
    { href: "/cases", label: "Fälle", icon: Briefcase },
    { href: "/locations", label: "Standorte", icon: MapPin },
    { href: "/notifications", label: "Benachrichtigungen", icon: Bell },
  ]

  return (
    <nav className="w-64 bg-card text-card-foreground h-screen overflow-y-auto p-4 flex flex-col border-r border-border">
      <h2 className="text-xl font-bold mb-8">FUNK Risikomanagement</h2>

      {/* User info */}
      {user && (
        <div className="mb-6 p-3 bg-background rounded-md">
          <p className="font-medium">{user.name}</p>
          <p className="text-sm text-muted-foreground">{user.email}</p>
        </div>
      )}

      <ul className="flex-grow space-y-2">
        {navItems.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className={`flex items-center p-2 rounded-md transition-colors ${
                pathname.includes(item.href) ? "bg-primary text-primary-foreground" : "hover:bg-muted"
              }`}
            >
              <item.icon className="mr-2 h-5 w-5" />
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
      <div className="pt-4 mt-4 border-t border-border space-y-2">
        <Link
          href="/cases/new"
          className="flex items-center justify-center p-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
        >
          <Plus className="mr-2 h-5 w-5" />
          Neuen Fall erstellen
        </Link>

        <button
          onClick={logout}
          className="flex items-center justify-center w-full p-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/90 transition-colors"
        >
          <LogOut className="mr-2 h-5 w-5" />
          Abmelden
        </button>
      </div>
    </nav>
  )
}

