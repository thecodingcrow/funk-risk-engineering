"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Users, Briefcase, Settings, Bell, Plus, MapPin } from "lucide-react"

export default function Sidebar() {
  const pathname = usePathname()

  const navItems = [
    { href: "/dashboard", label: "Dashboard", icon: Home },
    { href: "/customers", label: "Customers", icon: Users },
    { href: "/cases", label: "Cases", icon: Briefcase },
    { href: "/locations", label: "Locations", icon: MapPin },
    { href: "/settings", label: "Settings", icon: Settings },
    { href: "/notifications", label: "Notifications", icon: Bell },
  ]

  return (
    <nav className="w-64 bg-card text-card-foreground h-screen overflow-y-auto p-4 flex flex-col border-r border-border">
      <h2 className="text-xl font-bold mb-8">Case Management</h2>
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
      <div className="pt-4 mt-4 border-t border-border">
        <Link
          href="/cases/new"
          className="flex items-center justify-center p-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
        >
          <Plus className="mr-2 h-5 w-5" />
          Create New Case
        </Link>
      </div>
    </nav>
  )
}

