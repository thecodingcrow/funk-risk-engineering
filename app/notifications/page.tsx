"use client"

import { useState } from "react"
import { Bell, AlertTriangle, CheckCircle, Calendar } from "lucide-react"
import { cases, getCustomerById } from "@/lib/data"
import Link from "next/link"

// Mock-Benachrichtigungsdaten generieren
function generateNotifications() {
  return [
    {
      id: 1,
      type: "response",
      message: "Kunde Acme GmbH hat Antworten für Fall #1 eingereicht",
      caseId: 1,
      customerId: 1,
      date: "2023-06-01T14:30:00Z",
      isRead: false,
    },
    {
      id: 2,
      type: "missed",
      message: "Kunde TechStart AG hat die Frist für Fall #3 verpasst",
      caseId: 3,
      customerId: 2,
      date: "2023-05-30T09:15:00Z",
      isRead: true,
    },
    {
      id: 3,
      type: "response",
      message: "Kunde Global Dienstleistungen hat Antworten für Fall #5 eingereicht",
      caseId: 5,
      customerId: 3,
      date: "2023-05-28T16:45:00Z",
      isRead: false,
    },
    {
      id: 4,
      type: "missed",
      message: "Kunde Acme GmbH hat die Frist für Fall #6 verpasst",
      caseId: 6,
      customerId: 1,
      date: "2023-05-25T11:20:00Z",
      isRead: true,
    },
    {
      id: 5,
      type: "response",
      message: "Kunde TechStart AG hat Antworten für Fall #7 eingereicht",
      caseId: 7,
      customerId: 2,
      date: "2023-05-22T13:10:00Z",
      isRead: true,
    },
  ]
}

export default function Notifications() {
  const [notifications, setNotifications] = useState(generateNotifications())
  const [filter, setFilter] = useState<"all" | "response" | "missed">("all")

  // Benachrichtigungen basierend auf ausgewähltem Filter filtern
  const filteredNotifications = notifications.filter((notification) => filter === "all" || notification.type === filter)

  // Benachrichtigung als gelesen markieren
  const markAsRead = (id: number) => {
    setNotifications((prev) =>
      prev.map((notification) => (notification.id === id ? { ...notification, isRead: true } : notification)),
    )
  }

  // Ungelesene Benachrichtigungen zählen
  const unreadCount = notifications.filter((n) => !n.isRead).length

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between">
        <div className="flex items-center">
          <h1 className="text-3xl font-bold">Benachrichtigungen</h1>
          {unreadCount > 0 && (
            <span className="ml-3 px-2 py-1 text-xs bg-primary text-primary-foreground rounded-full">
              {unreadCount} ungelesen
            </span>
          )}
        </div>

        <div className="mt-4 sm:mt-0 flex items-center space-x-2">
          <div className="bg-card p-1 rounded-md flex">
            <button
              onClick={() => setFilter("all")}
              className={`px-3 py-1 text-sm rounded-md ${
                filter === "all" ? "bg-primary text-primary-foreground" : "hover:bg-muted"
              }`}
            >
              Alle
            </button>
            <button
              onClick={() => setFilter("response")}
              className={`px-3 py-1 text-sm rounded-md ${
                filter === "response" ? "bg-primary text-primary-foreground" : "hover:bg-muted"
              }`}
            >
              Antworten
            </button>
            <button
              onClick={() => setFilter("missed")}
              className={`px-3 py-1 text-sm rounded-md ${
                filter === "missed" ? "bg-primary text-primary-foreground" : "hover:bg-muted"
              }`}
            >
              Verpasste Fristen
            </button>
          </div>
        </div>
      </div>

      {filteredNotifications.length === 0 ? (
        <div className="bg-card p-8 rounded-custom shadow text-center">
          <Bell className="h-12 w-12 mx-auto text-muted-foreground opacity-50" />
          <p className="mt-4 text-muted-foreground">Keine Benachrichtigungen gefunden.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredNotifications.map((notification) => {
            const customer = getCustomerById(notification.customerId)
            const caseItem = cases.find((c) => c.id === notification.caseId)

            return (
              <div
                key={notification.id}
                className={`bg-card p-4 rounded-custom shadow flex items-start ${
                  !notification.isRead ? "border-l-4 border-primary" : ""
                }`}
                onClick={() => markAsRead(notification.id)}
              >
                <div
                  className={`p-2 rounded-full mr-4 ${
                    notification.type === "response"
                      ? "bg-green-500/10 text-green-500"
                      : "bg-yellow-500/10 text-yellow-500"
                  }`}
                >
                  {notification.type === "response" ? (
                    <CheckCircle className="h-6 w-6" />
                  ) : (
                    <AlertTriangle className="h-6 w-6" />
                  )}
                </div>

                <div className="flex-grow">
                  <p className={`${!notification.isRead ? "font-medium" : ""}`}>{notification.message}</p>

                  <div className="mt-2 flex items-center text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span>{new Date(notification.date).toLocaleString()}</span>
                  </div>

                  {caseItem && (
                    <div className="mt-3">
                      <Link
                        href={`/cases/${notification.caseId}/full-view`}
                        className="px-3 py-1 text-xs bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/90 transition-colors inline-flex items-center"
                      >
                        Fall anzeigen
                      </Link>
                    </div>
                  )}
                </div>

                {!notification.isRead && <span className="h-2 w-2 rounded-full bg-primary flex-shrink-0"></span>}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

