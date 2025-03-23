"use client"

import type React from "react"

import { useState, useMemo } from "react"
import { Line, Bar, Doughnut } from "react-chartjs-2"
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
import { Calendar, Users, Briefcase, Clock, Filter } from "lucide-react"
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
  const [timeframe, setTimeframe] = useState("30") // Default to 30 days
  const [activeWidgets, setActiveWidgets] = useState<WidgetType[]>([
    "caseActivity",
    "caseStatus",
    "casesByCustomer",
    "casesByLocation",
    "caseStats",
  ])
  const [isConfiguring, setIsConfiguring] = useState(false)

  // Generate case activity data
  const allCaseActivityData = useMemo(() => generateCaseActivityData(365), [])

  // Calculate case statistics
  const caseStats = useMemo(() => calculateCaseStats(), [])

  // Prepare chart data for case activity
  const caseActivityChartData = useMemo(() => {
    const filteredData = allCaseActivityData.slice(-Number.parseInt(timeframe))
    return {
      labels: filteredData.map((d) => d.date.toLocaleDateString()),
      datasets: [
        {
          label: "New Cases",
          data: filteredData.map((d) => d.newCases),
          borderColor: "rgba(75, 192, 192, 1)",
          backgroundColor: "rgba(75, 192, 192, 0.2)",
          tension: 0.4,
          fill: true,
        },
        {
          label: "Resolved Cases",
          data: filteredData.map((d) => d.resolvedCases),
          borderColor: "rgba(153, 102, 255, 1)",
          backgroundColor: "rgba(153, 102, 255, 0.2)",
          tension: 0.4,
          fill: true,
        },
      ],
    }
  }, [allCaseActivityData, timeframe])

  // Prepare chart data for case status
  const caseStatusChartData = useMemo(() => {
    return {
      labels: ["Open", "In Progress", "Closed"],
      datasets: [
        {
          data: [caseStats.openCases, caseStats.inProgressCases, caseStats.closedCases],
          backgroundColor: ["rgba(54, 162, 235, 0.8)", "rgba(255, 206, 86, 0.8)", "rgba(75, 192, 192, 0.8)"],
          borderColor: ["rgba(54, 162, 235, 1)", "rgba(255, 206, 86, 1)", "rgba(75, 192, 192, 1)"],
          borderWidth: 1,
        },
      ],
    }
  }, [caseStats])

  // Prepare chart data for cases by customer
  const casesByCustomerChartData = useMemo(() => {
    return {
      labels: caseStats.casesByCustomer.map((c) => c.name),
      datasets: [
        {
          label: "Number of Cases",
          data: caseStats.casesByCustomer.map((c) => c.count),
          backgroundColor: "rgba(153, 102, 255, 0.6)",
          borderColor: "rgba(153, 102, 255, 1)",
          borderWidth: 1,
        },
      ],
    }
  }, [caseStats])

  // Prepare chart data for cases by location
  const casesByLocationChartData = useMemo(() => {
    return {
      labels: caseStats.casesByLocation.map((l) => l.name),
      datasets: [
        {
          label: "Number of Cases",
          data: caseStats.casesByLocation.map((l) => l.count),
          backgroundColor: [
            "rgba(255, 99, 132, 0.6)",
            "rgba(54, 162, 235, 0.6)",
            "rgba(255, 206, 86, 0.6)",
            "rgba(75, 192, 192, 0.6)",
            "rgba(153, 102, 255, 0.6)",
          ],
          borderColor: [
            "rgba(255, 99, 132, 1)",
            "rgba(54, 162, 235, 1)",
            "rgba(255, 206, 86, 1)",
            "rgba(75, 192, 192, 1)",
            "rgba(153, 102, 255, 1)",
          ],
          borderWidth: 1,
        },
      ],
    }
  }, [caseStats])

  // Chart options
  const lineChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Case Activity Over Time",
      },
      tooltip: {
        mode: "index" as const,
        intersect: false,
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        titleColor: "white",
        bodyColor: "white",
        borderColor: "white",
        borderWidth: 1,
        padding: 10,
        displayColors: true,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: "rgba(255, 255, 255, 0.1)",
        },
      },
      x: {
        grid: {
          color: "rgba(255, 255, 255, 0.1)",
        },
        ticks: {
          maxTicksLimit: 10, // Limit the number of x-axis labels
        },
      },
    },
    interaction: {
      mode: "nearest" as const,
      axis: "x" as const,
      intersect: false,
    },
  }

  const doughnutChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Case Status Distribution",
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        titleColor: "white",
        bodyColor: "white",
        borderColor: "white",
        borderWidth: 1,
        padding: 10,
      },
    },
  }

  const barChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: "Cases by Customer",
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        titleColor: "white",
        bodyColor: "white",
        borderColor: "white",
        borderWidth: 1,
        padding: 10,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: "rgba(255, 255, 255, 0.1)",
        },
      },
      x: {
        grid: {
          color: "rgba(255, 255, 255, 0.1)",
        },
      },
    },
  }

  // Toggle widget visibility
  const toggleWidget = (widgetType: WidgetType) => {
    setActiveWidgets((prevActiveWidgets) => {
      if (prevActiveWidgets.includes(widgetType)) {
        return prevActiveWidgets.filter((w) => w !== widgetType)
      } else {
        return [...prevActiveWidgets, widgetType]
      }
    })
  }

  const renderWidget = (widgetType: WidgetType) => {
    if (!activeWidgets.includes(widgetType)) {
      return null
    }

    switch (widgetType) {
      case "caseActivity":
        return (
          <div className="bg-card p-6 rounded-custom shadow">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Case Activity</h2>
              <select
                value={timeframe}
                onChange={(e) => setTimeframe(e.target.value)}
                className="bg-background text-foreground border border-input rounded-custom px-2 py-1"
              >
                <option value="7">Last 7 days</option>
                <option value="30">Last 30 days</option>
                <option value="90">Last 90 days</option>
                <option value="180">Last 180 days</option>
                <option value="365">Last 365 days</option>
              </select>
            </div>
            <Line data={caseActivityChartData} options={lineChartOptions} />
          </div>
        )
      case "caseStats":
        return (
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
        )
      case "caseStatus":
        return (
          <div className="bg-card p-6 rounded-custom shadow">
            <h2 className="text-xl font-semibold mb-4">Case Status Distribution</h2>
            <div className="h-[300px] flex items-center justify-center">
              <Doughnut data={caseStatusChartData} options={doughnutChartOptions} />
            </div>
          </div>
        )
      case "casesByCustomer":
        return (
          <div className="bg-card p-6 rounded-custom shadow">
            <h2 className="text-xl font-semibold mb-4">Cases by Customer</h2>
            <div className="h-[300px]">
              <Bar data={casesByCustomerChartData} options={barChartOptions} />
            </div>
          </div>
        )
      case "casesByLocation":
        return (
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
        )
      default:
        return null
    }
  }

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

        <button
          onClick={() => setIsConfiguring(!isConfiguring)}
          className="mt-2 sm:mt-0 flex items-center px-4 py-2 bg-secondary text-secondary-foreground rounded-custom hover:bg-secondary/90 transition-colors"
        >
          <Filter className="mr-2 h-4 w-4" />
          {isConfiguring ? "Done" : "Configure Dashboard"}
        </button>
      </div>

      {isConfiguring && (
        <div className="bg-card p-4 rounded-custom shadow">
          <h2 className="text-lg font-medium mb-3">Dashboard Configuration</h2>
          <p className="text-sm text-muted-foreground mb-4">Select which widgets to display on your dashboard:</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            <label className="flex items-center space-x-2 p-2 rounded-custom bg-background">
              <input
                type="checkbox"
                checked={activeWidgets.includes("caseActivity")}
                onChange={() => toggleWidget("caseActivity")}
                className="rounded-custom"
              />
              <span>Case Activity Chart</span>
            </label>

            <label className="flex items-center space-x-2 p-2 rounded-custom bg-background">
              <input
                type="checkbox"
                checked={activeWidgets.includes("caseStatus")}
                onChange={() => toggleWidget("caseStatus")}
                className="rounded-custom"
              />
              <span>Case Status Distribution</span>
            </label>

            <label className="flex items-center space-x-2 p-2 rounded-custom bg-background">
              <input
                type="checkbox"
                checked={activeWidgets.includes("casesByCustomer")}
                onChange={() => toggleWidget("casesByCustomer")}
                className="rounded-custom"
              />
              <span>Cases by Customer</span>
            </label>

            <label className="flex items-center space-x-2 p-2 rounded-custom bg-background">
              <input
                type="checkbox"
                checked={activeWidgets.includes("casesByLocation")}
                onChange={() => toggleWidget("casesByLocation")}
                className="rounded-custom"
              />
              <span>Top 5 Locations</span>
            </label>

            <label className="flex items-center space-x-2 p-2 rounded-custom bg-background">
              <input
                type="checkbox"
                checked={activeWidgets.includes("caseStats")}
                onChange={() => toggleWidget("caseStats")}
                className="rounded-custom"
              />
              <span>Case Statistics</span>
            </label>
          </div>
        </div>
      )}

      {renderWidget("caseActivity")}
      {renderWidget("caseStats")}

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {renderWidget("caseStatus")}
        {renderWidget("casesByCustomer")}
      </div>

      {renderWidget("casesByLocation")}

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

