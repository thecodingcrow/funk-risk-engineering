"use client"

import type React from "react"
import { useState } from "react"
import { FileText, AlertTriangle, Upload, CheckCircle, XCircle } from "lucide-react"

interface CustomerViewProps {
  caseData: any
  onSubmit: (updatedCase: any) => void
}

export default function CustomerView({ caseData, onSubmit }: CustomerViewProps) {
  const [responses, setResponses] = useState<
    Record<string, { followed: boolean | null; explanation: string; attachments: any[] }>
  >(() => {
    // Initialize responses from caseData
    const initialResponses: Record<string, { followed: boolean | null; explanation: string; attachments: any[] }> = {}
    caseData.report.suggestions.forEach((suggestion: any) => {
      initialResponses[suggestion.id] = { ...suggestion.customerResponse }
    })
    return initialResponses
  })

  const handleResponseChange = (suggestionId: string, field: string, value: any) => {
    setResponses((prev) => ({
      ...prev,
      [suggestionId]: {
        ...prev[suggestionId],
        [field]: value,
      },
    }))
  }

  const handleFileUpload = (suggestionId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return

    const file = e.target.files[0]

    // Create a new attachment object
    const newAttachment = {
      id: `att-cust-${Date.now()}`,
      fileName: file.name,
      uploadedBy: "customer",
      uploadedAt: new Date().toISOString(),
      fileSize: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
      fileType: file.type,
    }

    handleResponseChange(suggestionId, "attachments", [...responses[suggestionId].attachments, newAttachment])

    // Reset the file input
    e.target.value = ""
  }

  const handleSubmit = () => {
    // Check if all suggestions have responses
    const allResponded = caseData.report.suggestions.every(
      (suggestion: any) => responses[suggestion.id].followed !== null,
    )

    if (!allResponded) {
      alert("Please respond to all suggestions before submitting.")
      return
    }

    // Update the case data with customer responses
    const updatedCase = {
      ...caseData,
      report: {
        ...caseData.report,
        suggestions: caseData.report.suggestions.map((suggestion: any) => ({
          ...suggestion,
          customerResponse: responses[suggestion.id],
        })),
      },
    }

    onSubmit(updatedCase)
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-card p-6 rounded-lg shadow mb-6">
        <h1 className="text-2xl font-bold">Risk Assessment Report</h1>
        <p className="text-muted-foreground mt-2">For: {caseData.customer.name}</p>
        <p className="text-muted-foreground">Created: {new Date(caseData.createdAt).toLocaleDateString()}</p>
      </div>

      <div className="bg-card p-6 rounded-lg shadow mb-6">
        <h2 className="text-xl font-semibold flex items-center">
          <FileText className="h-5 w-5 mr-2" />
          {caseData.report.title}
        </h2>
        <p className="mt-2">{caseData.report.overview}</p>
      </div>

      <div className="bg-card p-6 rounded-lg shadow mb-6">
        <h2 className="text-xl font-semibold flex items-center">
          <AlertTriangle className="h-5 w-5 mr-2" />
          Risk Assessments & Recommendations
        </h2>

        <div className="mt-4 space-y-6">
          {caseData.report.riskAssessments.map((risk: any) => (
            <div key={risk.id} className="bg-background p-4 rounded-md">
              <h3 className="font-semibold flex items-center">
                {risk.title}
                <span
                  className={`ml-2 px-2 py-0.5 text-xs rounded-full ${
                    risk.severity === "High"
                      ? "bg-red-500 text-white"
                      : risk.severity === "Medium"
                        ? "bg-yellow-500 text-black"
                        : "bg-green-500 text-white"
                  }`}
                >
                  {risk.severity}
                </span>
              </h3>
              <p className="mt-1 text-sm">{risk.description}</p>

              <div className="mt-4">
                <h4 className="text-sm font-medium">Recommendations:</h4>
                <ul className="mt-2 space-y-6">
                  {caseData.report.suggestions
                    .filter((suggestion: any) => suggestion.riskId === risk.id)
                    .map((suggestion: any) => (
                      <li key={suggestion.id} className="pl-4 border-l-2 border-muted">
                        <p className="text-sm">{suggestion.description}</p>

                        <div className="mt-3 p-3 bg-card rounded-md">
                          <h5 className="text-sm font-medium">Your Response:</h5>

                          <div className="mt-2 space-y-3">
                            <div>
                              <p className="text-sm mb-2">Have you implemented this recommendation?</p>
                              <div className="flex space-x-4">
                                <button
                                  onClick={() => handleResponseChange(suggestion.id, "followed", true)}
                                  className={`flex items-center px-3 py-1 rounded-md ${
                                    responses[suggestion.id].followed === true
                                      ? "bg-green-500 text-white"
                                      : "bg-secondary text-secondary-foreground"
                                  }`}
                                >
                                  <CheckCircle className="h-4 w-4 mr-1" />
                                  Yes
                                </button>
                                <button
                                  onClick={() => handleResponseChange(suggestion.id, "followed", false)}
                                  className={`flex items-center px-3 py-1 rounded-md ${
                                    responses[suggestion.id].followed === false
                                      ? "bg-red-500 text-white"
                                      : "bg-secondary text-secondary-foreground"
                                  }`}
                                >
                                  <XCircle className="h-4 w-4 mr-1" />
                                  No
                                </button>
                              </div>
                            </div>

                            <div>
                              <label className="block text-sm mb-1">Please explain your response:</label>
                              <textarea
                                value={responses[suggestion.id].explanation}
                                onChange={(e) => handleResponseChange(suggestion.id, "explanation", e.target.value)}
                                className="w-full p-2 rounded-md border border-input bg-background"
                                rows={3}
                                placeholder="Provide details about your implementation or why you couldn't implement this recommendation..."
                              />
                            </div>

                            <div>
                              <label className="block text-sm mb-1">Upload supporting documents (optional):</label>
                              <input
                                type="file"
                                onChange={(e) => handleFileUpload(suggestion.id, e)}
                                className="w-full p-2 rounded-md border border-input bg-background"
                              />

                              {responses[suggestion.id].attachments.length > 0 && (
                                <ul className="mt-2 space-y-1">
                                  {responses[suggestion.id].attachments.map((attachment: any) => (
                                    <li key={attachment.id} className="text-xs flex items-center">
                                      <Upload className="h-3 w-3 mr-1" />
                                      {attachment.fileName}
                                    </li>
                                  ))}
                                </ul>
                              )}
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleSubmit}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
        >
          Submit Responses
        </button>
      </div>
    </div>
  )
}

