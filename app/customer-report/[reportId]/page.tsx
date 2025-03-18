"use client"

import { useEffect, useState } from "react"
import { useParams, useSearchParams } from "next/navigation"
import CustomerView from "../../cases/[caseId]/components/CustomerView"

// This is a simplified version that redirects to the customer view
// In a real app, this would validate the token and fetch the report data

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
      // In a real app, this would be an API call
      import("../../cases/[caseId]/page").then((module) => {
        // Access the mock data from the case page
        const mockCase = (module as any).default.mockCase || {
          id: reportId,
          status: "In Progress",
          createdAt: "2023-01-15T10:30:00Z",
          updatedAt: "2023-06-01T14:45:00Z",
          customer: {
            id: "cust-123",
            name: "Acme Corporation",
            email: "contact@acmecorp.com",
            phone: "+1 (555) 123-4567",
            location: "New York, NY",
          },
          report: {
            title: "Risk Assessment Report",
            overview: "This report assesses various risks and provides recommendations.",
            riskAssessments: [],
            suggestions: [],
          },
        }

        setCaseData(mockCase)
        setIsLoading(false)
      })
    } else {
      setIsValid(false)
      setIsLoading(false)
    }
  }, [reportId, token])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading...</p>
      </div>
    )
  }

  if (!isValid) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold text-red-500">Invalid or Expired Link</h1>
        <p className="mt-2">The link you are trying to access is invalid or has expired.</p>
      </div>
    )
  }

  return (
    <CustomerView
      caseData={caseData}
      onSubmit={(updatedCase) => {
        // In a real app, this would send the data to your API
        console.log("Customer submitted responses:", updatedCase)
        alert("Thank you for your submission! Your responses have been recorded.")
      }}
    />
  )
}

