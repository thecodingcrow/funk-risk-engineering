"use client"

import { useEffect, useState } from "react"
import { useParams, useSearchParams } from "next/navigation"
import CustomerView from "../../cases/[caseId]/components/CustomerView"
import { getCaseById, getCustomerById, getLocationById } from "@/lib/data"

export default function CustomerReportPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const reportId = params.reportId as string
  const token = searchParams.get("token")

  const [isLoading, setIsLoading] = useState(true)
  const [isValid, setIsValid] = useState(false)
  const [caseData, setCaseData] = useState<any>(null)

  useEffect(() => {
    // In a real app, this would validate the token with your API
    console.log(`Validating token ${token} for report ${reportId}`)

    // For demo purposes, we'll simulate a valid token check
    if (token === "demo-token") {
      setIsValid(true)

      // Fetch the case data (using mock data for demo)
      const caseId = Number(reportId)
      const caseItem = getCaseById(caseId)

      if (caseItem) {
        const customerData = getCustomerById(caseItem.customerId)
        const locationData = getLocationById(caseItem.locationId)

        // Create a full case object with all the necessary data
        setCaseData({
          id: caseId,
          status: caseItem.status,
          createdAt: caseItem.createdAt,
          customerId: caseItem.customerId,
          locationId: caseItem.locationId,
          title: caseItem.title,
          customer: customerData,
          location: locationData,
          report: {
            title: `${caseItem.title} Risikobewertungsbericht`,
            overview:
              "Dieser Bericht bewertet verschiedene Risiken und bietet Empfehlungen zur Risikominderung. Bitte überprüfen Sie jede Empfehlung und geben Sie an, ob Sie diese umgesetzt haben.",
            riskAssessments: [
              {
                id: "risk-1",
                title: "Sicherheitsbedenken",
                description:
                  "Bei der Inspektion wurden mehrere Sicherheitsprobleme festgestellt, darunter unzureichende Notausgänge, fehlende Feuerlöscher und schlechte Beleuchtung in Treppenhäusern.",
                severity: "High",
              },
              {
                id: "risk-2",
                title: "Wartungsprobleme",
                description:
                  "Regelmäßige Wartungsverfahren werden für kritische Geräte nicht eingehalten. Die Dokumentation zeigt Lücken in den Wartungsplänen.",
                severity: "Medium",
              },
              {
                id: "risk-3",
                title: "Datensicherheitslücken",
                description:
                  "Die Bewertung hat mehrere potenzielle Schwachstellen in den Datensicherheitsprotokollen identifiziert, darunter veraltete Software und schwache Passwortrichtlinien.",
                severity: "High",
              },
            ],
            suggestions: [
              {
                id: "sug-1",
                riskId: "risk-1",
                description:
                  "Implementieren Sie ein umfassendes Sicherheitsschulungsprogramm für alle Mitarbeiter. Stellen Sie sicher, dass alle Notausgänge deutlich gekennzeichnet und nicht blockiert sind.",
                priority: "High",
                estimatedCost: "Medium",
                timeframe: "1-3 Monate",
                customerResponse: {
                  followed: null,
                  explanation: "",
                  attachments: [],
                },
              },
              {
                id: "sug-2",
                riskId: "risk-2",
                description:
                  "Erstellen Sie einen Wartungsplan und weisen Sie verantwortliches Personal zu. Implementieren Sie ein digitales Wartungsverfolgungssystem.",
                priority: "Medium",
                estimatedCost: "Low",
                timeframe: "1-2 Monate",
                customerResponse: {
                  followed: null,
                  explanation: "",
                  attachments: [],
                },
              },
              {
                id: "sug-3",
                riskId: "risk-3",
                description:
                  "Aktualisieren Sie alle Software auf die neuesten Versionen und implementieren Sie einen regelmäßigen Aktualisierungsplan. Stärken Sie die Passwortrichtlinien.",
                priority: "High",
                estimatedCost: "Medium",
                timeframe: "1 Monat",
                customerResponse: {
                  followed: null,
                  explanation: "",
                  attachments: [],
                },
              },
            ],
          },
        })
      }

      setIsLoading(false)
    } else {
      setIsValid(false)
      setIsLoading(false)
    }
  }, [reportId, token])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!isValid) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <h1 className="text-2xl font-bold text-red-500">Ungültiger oder abgelaufener Link</h1>
        <p className="mt-2">Der Link, auf den Sie zugreifen möchten, ist ungültig oder abgelaufen.</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Bitte kontaktieren Sie Ihren Risikobewertungsanbieter für einen neuen Link.
        </p>
      </div>
    )
  }

  if (!caseData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <h1 className="text-2xl font-bold text-red-500">Bericht nicht gefunden</h1>
        <p className="mt-2">Der angeforderte Bericht konnte nicht gefunden werden.</p>
      </div>
    )
  }

  return (
    <CustomerView
      caseData={caseData}
      onSubmit={(updatedCase) => {
        // In a real app, this would send the data to your API
        console.log("Kunde hat Antworten eingereicht:", updatedCase)

        // Show success message
        alert("Vielen Dank für Ihre Einreichung! Ihre Antworten wurden erfasst.")

        // In a real app, you might redirect to a thank you page
      }}
    />
  )
}

