"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import {
  MapPin,
  Building,
  ArrowLeft,
  FileText,
  Clipboard,
  AlertTriangle,
  Paperclip,
  Clock,
  ExternalLink,
  Users,
} from "lucide-react"
import { getCaseById, getCustomerById, getLocationById } from "@/lib/data"
import CaseHeader from "../components/CaseHeader"
import CaseDetails from "../components/CaseDetails"
import ReportSection from "../components/ReportSection"
import AttachmentsSection from "../components/AttachmentsSection"
import ActionButtons from "../components/ActionButtons"
import StatusHistory from "../components/StatusHistory"
import CustomerView from "../components/CustomerView"

export default function CaseFullView() {
  const params = useParams()
  const caseId = Number(params.caseId)

  // In a real app, you would determine user type through authentication
  const [userType, setUserType] = useState<"employee" | "customer">("employee")
  const [caseData, setCaseData] = useState<any>(null)
  const [customer, setCustomer] = useState<any>(null)
  const [location, setLocation] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  // In a real app, you would fetch the case data from your API
  useEffect(() => {
    // Simulating API fetch
    const caseItem = getCaseById(caseId)

    if (caseItem) {
      const customerData = getCustomerById(caseItem.customerId)
      const locationData = getLocationById(caseItem.locationId)

      setCaseData({
        ...caseItem,
        customer: customerData,
        location: locationData,
        // Add other mock data for the case detail view
        assignedEmployee: {
          id: "emp-456",
          name: "John Doe",
          email: "john.doe@company.com",
          position: "Risikobewertungsspezialist",
        },
        metadata: {
          caseType: "Risikobewertung",
          priority: "Mittel",
          industry: customerData?.industry || "Unbekannt",
        },
        report: {
          title: `${caseItem.title} Bericht`,
          overview: "Dieser Bericht bewertet verschiedene Risiken und bietet Empfehlungen zur Risikominderung.",
          riskAssessments: [
            {
              id: "risk-1",
              title: "Sicherheitsbedenken",
              description: "Bei der Inspektion wurden mehrere Sicherheitsprobleme festgestellt.",
              severity: "Hoch",
            },
            {
              id: "risk-2",
              title: "Wartungsprobleme",
              description: "Regelmäßige Wartungsverfahren werden nicht eingehalten.",
              severity: "Mittel",
            },
          ],
          suggestions: [
            {
              id: "sug-1",
              riskId: "risk-1",
              description: "Implementieren Sie ein umfassendes Sicherheitsschulungsprogramm für alle Mitarbeiter.",
              priority: "Hoch",
              estimatedCost: "Mittel",
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
              description: "Erstellen Sie einen Wartungsplan und weisen Sie verantwortliches Personal zu.",
              priority: "Mittel",
              estimatedCost: "Niedrig",
              timeframe: "1-2 Monate",
              customerResponse: {
                followed: null,
                explanation: "",
                attachments: [],
              },
            },
          ],
        },
        attachments: [],
        statusHistory: [
          {
            status: "Open",
            timestamp: caseItem.createdAt,
            updatedBy: "emp-456",
            notes: "Case created",
          },
        ],
      })

      setCustomer(customerData)
      setLocation(locationData)
    }

    setIsLoading(false)
  }, [caseId])

  // For demo purposes, add a toggle button to switch between employee and customer views
  const toggleUserType = () => {
    setUserType(userType === "employee" ? "customer" : "employee")
  }

  // Handle updates to the case data
  const updateCaseData = (newData: any) => {
    setCaseData(newData)
    // In a real app, you would also send this data to your API
    console.log("Updating case data:", newData)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!caseData) {
    return <div className="p-8">Fall nicht gefunden</div>
  }

  // If this is a customer view, show the simplified customer interface
  if (userType === "customer") {
    return (
      <div className="animate-in">
        {/* For demo purposes only */}
        <div className="fixed top-4 right-4 z-50 bg-card p-2 rounded-md shadow-md border border-border">
          <button
            onClick={toggleUserType}
            className="px-3 py-1 bg-primary text-primary-foreground rounded-md text-xs flex items-center"
          >
            <Users className="h-3 w-3 mr-1" />
            Zur Mitarbeiteransicht wechseln
          </button>
          <p className="text-xs text-muted-foreground mt-1">Demo-Modus: Kundenberichtsansicht</p>
        </div>

        <CustomerView
          caseData={caseData}
          onSubmit={(updatedCase) => {
            updateCaseData(updatedCase)
            // In a real app, you would redirect or show a success message
            alert("Vielen Dank für Ihre Einreichung! Ihre Antworten wurden erfasst.")
          }}
        />
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-in">
      {/* For demo purposes only */}
      <div className="fixed top-4 right-4 z-50 bg-card p-2 rounded-md shadow-md border border-border">
        <button
          onClick={toggleUserType}
          className="px-3 py-1 bg-blue-600 text-white rounded-md text-xs flex items-center"
        >
          <Users className="h-3 w-3 mr-1" />
          Kundenansicht anzeigen
        </button>
        <p className="text-xs text-muted-foreground mt-1">Sehen Sie, worauf Kunden antworten werden</p>
      </div>

      {/* Back button */}
      <div className="mb-4">
        <Link href="/cases" className="inline-flex items-center text-sm text-primary hover:underline">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Zurück zur Fallübersicht
        </Link>
      </div>

      {/* Case header with status */}
      <div className="bg-primary/5 border border-primary/20 rounded-xl p-6 shadow-md">
        <CaseHeader caseData={caseData} />
      </div>

      {/* Location and Customer Info */}
      <div className="bg-background rounded-xl shadow-md border border-border overflow-hidden">
        <div className="bg-muted/30 px-4 py-3 border-b border-border">
          <h2 className="font-medium">Fallinformationen</h2>
        </div>
        <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-card p-4 rounded-lg flex items-start">
            <div className="bg-primary/10 p-2 rounded-full mr-3">
              <MapPin className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Standort</p>
              <Link
                href={`/customers/${caseData.customerId}/locations/${caseData.locationId}`}
                className="text-primary hover:underline font-medium"
              >
                {caseData.location?.name}
              </Link>
              <p className="text-xs text-muted-foreground">{caseData.location?.address}</p>
            </div>
          </div>

          <div className="bg-card p-4 rounded-lg flex items-start">
            <div className="bg-primary/10 p-2 rounded-full mr-3">
              <Building className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Kunde</p>
              <Link href={`/customers/${caseData.customerId}`} className="text-primary hover:underline font-medium">
                {caseData.customer?.name}
              </Link>
              <p className="text-xs text-muted-foreground">{caseData.customer?.industry}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Case Details Section */}
          <div className="bg-background rounded-xl shadow-md border border-border overflow-hidden">
            <div className="bg-muted/30 px-4 py-3 border-b border-border flex items-center">
              <Clipboard className="h-5 w-5 mr-2 text-muted-foreground" />
              <h2 className="font-medium">Falldetails</h2>
            </div>
            <div className="p-4">
              <CaseDetails caseData={caseData} isEditing={false} />
            </div>
          </div>

          {/* Report Section */}
          <div className="bg-background rounded-xl shadow-md border border-border overflow-hidden">
            <div className="bg-muted/30 px-4 py-3 border-b border-border flex items-center justify-between">
              <div className="flex items-center">
                <FileText className="h-5 w-5 mr-2 text-muted-foreground" />
                <h2 className="font-medium">Risikobewertungsbericht</h2>
              </div>
              <Link
                href={`/cases/${caseId}/report`}
                className="inline-flex items-center text-sm text-primary hover:underline"
              >
                Vollständigen Bericht anzeigen
                <ExternalLink className="h-3 w-3 ml-1" />
              </Link>
            </div>
            <div className="p-4">
              <ReportSection
                report={caseData.report}
                isEditing={false}
                onUpdate={(updatedReport) => {
                  updateCaseData({
                    ...caseData,
                    report: updatedReport,
                  })
                }}
              />
            </div>
          </div>

          {/* Attachments Section */}
          <div className="bg-background rounded-xl shadow-md border border-border overflow-hidden">
            <div className="bg-muted/30 px-4 py-3 border-b border-border flex items-center">
              <Paperclip className="h-5 w-5 mr-2 text-muted-foreground" />
              <h2 className="font-medium">Anhänge</h2>
            </div>
            <div className="p-4">
              <AttachmentsSection
                attachments={caseData.attachments}
                isEditing={false}
                onUpdate={(updatedAttachments) => {
                  updateCaseData({
                    ...caseData,
                    attachments: updatedAttachments,
                  })
                }}
              />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Action Buttons */}
          <div className="bg-background rounded-xl shadow-md border border-border overflow-hidden">
            <div className="bg-muted/30 px-4 py-3 border-b border-border flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2 text-muted-foreground" />
              <h2 className="font-medium">Aktionen</h2>
            </div>
            <div className="p-4">
              <ActionButtons
                caseData={caseData}
                onStatusChange={(newStatus) => {
                  const now = new Date().toISOString()
                  updateCaseData({
                    ...caseData,
                    status: newStatus,
                    statusHistory: [
                      ...caseData.statusHistory,
                      {
                        status: newStatus,
                        timestamp: now,
                        updatedBy: "emp-456", // In a real app, this would be the current user
                        notes: `Status geändert zu ${newStatus === "Closed" ? "Abgeschlossen" : newStatus}`,
                      },
                    ],
                  })
                }}
              />
            </div>
          </div>

          {/* Status History */}
          <div className="bg-background rounded-xl shadow-md border border-border overflow-hidden">
            <div className="bg-muted/30 px-4 py-3 border-b border-border flex items-center">
              <Clock className="h-5 w-5 mr-2 text-muted-foreground" />
              <h2 className="font-medium">Statusverlauf</h2>
            </div>
            <div className="p-4">
              <StatusHistory history={caseData.statusHistory} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

