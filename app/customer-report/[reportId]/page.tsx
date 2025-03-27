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
            title: `${caseItem.title} Risk Assessment Report`,
            overview:
              "This report assesses various risks and provides recommendations for mitigation. Please review each recommendation and indicate whether you have implemented it.",
            riskAssessments: [
              {
                id: "risk-1",
                title: "Safety Concerns",
                description:
                  "Several safety issues were identified during the inspection, including inadequate emergency exits, missing fire extinguishers, and poor lighting in stairwells.",
                severity: "High",
              },
              {
                id: "risk-2",
                title: "Maintenance Issues",
                description:
                  "Regular maintenance procedures are not being followed for critical equipment. Documentation shows gaps in maintenance schedules.",
                severity: "Medium",
              },
              {
                id: "risk-3",
                title: "Data Security Vulnerabilities",
                description:
                  "The assessment identified several potential vulnerabilities in the data security protocols including outdated software and weak password policies.",
                severity: "High",
              },
            ],
            suggestions: [
              {
                id: "sug-1",
                riskId: "risk-1",
                description:
                  "Implement a comprehensive safety training program for all employees. Ensure all emergency exits are clearly marked and unobstructed.",
                priority: "High",
                estimatedCost: "Medium",
                timeframe: "1-3 months",
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
                  "Create a maintenance schedule and assign responsible personnel. Implement a digital maintenance tracking system.",
                priority: "Medium",
                estimatedCost: "Low",
                timeframe: "1-2 months",
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
                  "Update all software to the latest versions and implement a regular update schedule. Strengthen password policies.",
                priority: "High",
                estimatedCost: "Medium",
                timeframe: "1 month",
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
        <h1 className="text-2xl font-bold text-red-500">Invalid or Expired Link</h1>
        <p className="mt-2">The link you are trying to access is invalid or has expired.</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Please contact your risk assessment provider for a new link.
        </p>
      </div>
    )
  }

  if (!caseData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <h1 className="text-2xl font-bold text-red-500">Report Not Found</h1>
        <p className="mt-2">The requested report could not be found.</p>
      </div>
    )
  }

  return (
    <CustomerView
      caseData={caseData}
      onSubmit={(updatedCase) => {
        // In a real app, this would send the data to your API
        console.log("Customer submitted responses:", updatedCase)

        // Show success message
        alert("Thank you for your submission! Your responses have been recorded.")

        // In a real app, you might redirect to a thank you page
      }}
    />
  )
}

