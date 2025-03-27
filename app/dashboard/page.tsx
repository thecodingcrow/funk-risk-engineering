"use client"

import type React from "react"

import { useMemo } from "react"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js"
import { cases, customers, locations } from "@/lib/data"
import { Calendar, Users, Briefcase, Clock } from "lucide-react"
import { useAuth } from "@/lib/auth/AuthContext"

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
)

// Function to generate case activity data
function generateCaseActivityData(days: number) {
  const data = []
  const today = new Date()

  // Start from the past and move toward today
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)

    // Generate some realistic data
    const newCases = Math.floor(Math.random() * 5) + 1
    const resolvedCases = Math.floor(Math.random() * 4)

    data.push({
      date,
      newCases,
      resolvedCases,
    })
  }

  return data
}

// Function to calculate case statistics
function calculateCaseStats() {
  const openCases = cases.filter((c) => c.status === "Open").length
  const inProgressCases = cases.filter((c) => c.status === "In Progress").length
  const closedCases = cases.filter((c) => c.status === "Closed").length
  const totalCases = cases.length
  const avgResolutionDays = 3.2 // In a real app, this would be calculated

  // Calculate cases by customer
  const casesByCustomer = customers
    .map((customer) => {
      const customerCases = cases.filter((c) => c.customerId === customer.id)
      return {
        name: customer.name,
        count: customerCases.length,
      }
    })
    .sort((a, b) => b.count - a.count)

  // Calculate cases by location
  const casesByLocation = locations
    .map((location) => {
      const locationCases = cases.filter((c) => c.locationId === location.id)
      return {
        name: location.name,
        count: locationCases.length,
      }
    })
    .sort((a, b) => b.count - a.count)
    .slice(0, 5) // Top 5 locations

  return {
    openCases,
    inProgressCases,
    closedCases,
    totalCases,
    avgResolutionDays,
    casesByCustomer,
    casesByLocation,
  }
}

// Dashboard widget types
type WidgetType = "caseActivity" | "caseStatus" | "casesByCustomer" | "casesByLocation" | "caseStats"

export default function Dashboard() {
  const { isLoading } = useAuth()
  const caseStats = useMemo(() => calculateCaseStats(), [])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between">
        <h1 className="text-3xl font-bold">Dashboard</h1>
      </div>

      {/* Case Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard
          title="Total Cases"
          value={caseStats.totalCases.toString()}
          icon={<Briefcase className="h-8 w-8 text-blue-500" />}
        />
        <StatCard
          title="Open Cases"
          value={caseStats.openCases.toString()}
          icon={<Calendar className="h-8 w-8 text-yellow-500" />}
        />
        <StatCard
          title="Active Customers"
          value={customers.length.toString()}
          icon={<Users className="h-8 w-8 text-green-500" />}
        />
        <StatCard
          title="Avg. Resolution Time"
          value={`${caseStats.avgResolutionDays} days`}
          icon={<Clock className="h-8 w-8 text-purple-500" />}
        />
      </div>

      {/* Cases by Customer */}
      <div className="bg-card p-6 rounded-custom shadow">
        <h2 className="text-xl font-semibold mb-4">Cases by Customer</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {caseStats.casesByCustomer.slice(0, 6).map((customer, index) => (
            <div key={index} className="bg-background p-4 rounded-custom">
              <h3 className="font-medium">{customer.name}</h3>
              <p className="text-2xl font-bold mt-2">{customer.count}</p>
              <p className="text-xs text-muted-foreground">cases</p>
            </div>
          ))}
        </div>
      </div>

      {/* Top Locations */}
      <div className="bg-card p-6 rounded-custom shadow">
        <h2 className="text-xl font-semibold mb-4">Top 5 Locations by Case Volume</h2>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {caseStats.casesByLocation.map((location, index) => (
            <div key={index} className="bg-background p-4 rounded-custom text-center">
              <h3 className="font-medium text-sm mb-2">{location.name}</h3>
              <p className="text-2xl font-bold">{location.count}</p>
              <p className="text-xs text-muted-foreground">cases</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-card p-6 rounded-custom shadow">
        <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
        <ActivityFeed />
      </div>
    </div>
  )
}

function StatCard({ title, value, icon }: { title: string; value: string; icon: React.ReactNode }) {
  return (
    <div className="bg-card p-6 rounded-custom shadow">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium text-muted-foreground">{title}</h3>
          <p className="text-3xl font-bold mt-2">{value}</p>
        </div>
        <div className="bg-background p-3 rounded-custom">{icon}</div>
      </div>
    </div>
  )
}

function ActivityFeed() {
  const activities = [
    { id: 1, text: "New case opened for Acme Corp", time: "2 hours ago" },
    { id: 2, text: "Case #1234 resolved", time: "4 hours ago" },
    { id: 3, text: "New customer: TechStart Inc", time: "1 day ago" },
    { id: 4, text: "Follow-up scheduled for case #5678", time: "2 days ago" },
  ]

  return (
    <ul className="space-y-4">
      {activities.map((activity) => (
        <li key={activity.id} className="flex justify-between items-center p-3 bg-background rounded-custom">
          <span>{activity.text}</span>
          <span className="text-sm text-muted-foreground">{activity.time}</span>
        </li>
      ))}
    </ul>
  )
}

