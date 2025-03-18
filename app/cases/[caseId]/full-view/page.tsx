"use client"

import { useState, useEffect } from "react"
import { useParams, useSearchParams } from "next/navigation"
import Link from "next/link"
import { MapPin, Building } from "lucide-react"
import { getCaseById, getCustomerById, getLocationById } from "@/lib/data"
import CaseHeader from "../components/CaseHeader"
import CaseDetails from "../components/CaseDetails"
import ReportSection from "../components/ReportSection"
import AttachmentsSection from "../components/AttachmentsSection"
import ActionButtons from "../components/ActionButtons"
import StatusHistory from "../components/StatusHistory"
import NotesSection from "../components/NotesSection"
import CustomerView from "../components/CustomerView"

export default function CaseFullView() {
  const params = useParams()
  const searchParams = useSearchParams()
  const caseId = Number(params.caseId)
  const mode = searchParams.get("mode") || "view"

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
        },
        metadata: {
          caseType: "Risk Assessment",
          priority: "Medium",
          industry: customerData?.industry || "Unknown",
        },
        report: {
          title: `${caseItem.title} Report`,
          overview: "This report assesses various risks and provides recommendations for mitigation.",
          riskAssessments: [
            {
              id: "risk-1",
              title: "Safety Concerns",
              description: "Several safety issues were identified during the inspection.",
              severity: "High",
            },
            {
              id: "risk-2",
              title: "Maintenance Issues",
              description: "Regular maintenance procedures are not being followed.",
              severity: "Medium",
            },
          ],
          suggestions: [
            {
              id: "sug-1",
              riskId: "risk-1",
              description: "Implement a comprehensive safety training program for all employees.",
              customerResponse: {
                followed: null,
                explanation: "",
                attachments: [],
              },
            },
            {
              id: "sug-2",
              riskId: "risk-2",
              description: "Create a maintenance schedule and assign responsible personnel.",
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
        notes: [],
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
    return <div className="p-8">Loading case data...</div>
  }

  if (!caseData) {
    return <div className="p-8">Case not found</div>
  }

  // If this is a customer view, show the simplified customer interface
  if (userType === "customer") {
    return (
      <div className="animate-in">
        {/* For demo purposes only */}
        <button
          onClick={toggleUserType}
          className="fixed top-4 right-4 px-3 py-1 bg-yellow-500 text-black rounded-md text-xs"
        >
          Switch to Employee View (Demo)
        </button>

        <CustomerView
          caseData={caseData}
          onSubmit={(updatedCase) => {
            updateCaseData(updatedCase)
            // In a real app, you would redirect or show a success message
            alert("Thank you for your submission!")
          }}
        />
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-in">
      {/* For demo purposes only */}
      <button
        onClick={toggleUserType}
        className="fixed top-4 right-4 px-3 py-1 bg-yellow-500 text-black rounded-md text-xs"
      >
        Switch to Customer View (Demo)
      </button>

      <CaseHeader caseData={caseData} />

      {/* Location and Customer Info */}
      <div className="bg-card p-4 rounded-lg shadow">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between">
          <div className="flex items-center">
            <MapPin className="h-5 w-5 mr-2 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Location:</p>
              <Link
                href={`/customers/${caseData.customerId}/locations/${caseData.locationId}`}
                className="text-primary hover:underline"
              >
                {caseData.location?.name}
              </Link>
              <p className="text-xs text-muted-foreground">{caseData.location?.address}</p>
            </div>
          </div>

          <div className="flex items-center mt-2 sm:mt-0">
            <Building className="h-5 w-5 mr-2 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Customer:</p>
              <Link href={`/customers/${caseData.customerId}`} className="text-primary hover:underline">
                {caseData.customer?.name}
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <CaseDetails caseData={caseData} isEditing={mode === "edit"} />

          <ReportSection
            report={caseData.report}
            isEditing={mode === "edit"}
            onUpdate={(updatedReport) => {
              updateCaseData({
                ...caseData,
                report: updatedReport,
              })
            }}
          />

          <AttachmentsSection
            attachments={caseData.attachments}
            isEditing={mode === "edit"}
            onUpdate={(updatedAttachments) => {
              updateCaseData({
                ...caseData,
                attachments: updatedAttachments,
              })
            }}
          />
        </div>

        <div className="space-y-6">
          <ActionButtons
            caseData={caseData}
            mode={mode}
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
                    notes: `Status changed to ${newStatus}`,
                  },
                ],
              })
            }}
          />

          <StatusHistory history={caseData.statusHistory} />

          <NotesSection
            notes={caseData.notes}
            onAddNote={(note) => {
              updateCaseData({
                ...caseData,
                notes: [
                  ...caseData.notes,
                  {
                    id: `note-${caseData.notes.length + 1}`,
                    content: note,
                    createdBy: "emp-456", // In a real app, this would be the current user
                    createdAt: new Date().toISOString(),
                  },
                ],
              })
            }}
          />
        </div>
      </div>
    </div>
  )
}

