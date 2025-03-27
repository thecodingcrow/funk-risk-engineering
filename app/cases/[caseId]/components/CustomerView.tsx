"use client"

import type React from "react"
import { useState } from "react"
import { FileText, AlertTriangle, Upload, CheckCircle, XCircle, Paperclip } from "lucide-react"

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
      alert("Please respond to all recommendations before submitting.")
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

  // Count how many recommendations have been responded to
  const respondedCount = Object.values(responses).filter((response) => response.followed !== null).length
  const totalCount = caseData.report.suggestions.length
  const progressPercentage = totalCount > 0 ? (respondedCount / totalCount) * 100 : 0

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-card p-6 rounded-lg shadow mb-6">
        <h1 className="text-2xl font-bold">Risk Assessment Report</h1>
        <p className="text-muted-foreground mt-2">For: {caseData.customer.name}</p>
        <p className="text-muted-foreground">Location: {caseData.location.name}</p>
        <p className="text-muted-foreground">Created: {new Date(caseData.createdAt).toLocaleDateString()}</p>
      </div>

      {/* Progress indicator */}
      <div className="bg-card p-6 rounded-lg shadow mb-6">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-lg font-medium">Your Progress</h2>
          <span className="text-sm font-medium">
            {respondedCount} of {totalCount} completed
          </span>
        </div>
        <div className="w-full bg-muted rounded-full h-2.5">
          <div className="bg-primary h-2.5 rounded-full" style={{ width: `${progressPercentage}%` }}></div>
        </div>
        <p className="text-sm text-muted-foreground mt-2">
          Please respond to all recommendations below and provide supporting documentation where applicable.
        </p>
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
                        <div className="flex items-start">
                          <div className="flex-grow">
                            <p className="text-sm font-medium">{suggestion.description}</p>
                            {suggestion.priority && (
                              <p className="text-xs text-muted-foreground mt-1">
                                Priority: <span className="font-medium">{suggestion.priority}</span> • Estimated Cost:{" "}
                                <span className="font-medium">{suggestion.estimatedCost}</span> • Timeframe:{" "}
                                <span className="font-medium">{suggestion.timeframe}</span>
                              </p>
                            )}
                          </div>
                        </div>

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
                                placeholder={
                                  responses[suggestion.id].followed === true
                                    ? "Describe how you implemented this recommendation..."
                                    : responses[suggestion.id].followed === false
                                      ? "Explain why you couldn't implement this recommendation..."
                                      : "Provide details about your implementation..."
                                }
                              />
                            </div>

                            <div>
                              <label className="block text-sm mb-1 flex items-center">
                                <Paperclip className="h-4 w-4 mr-1" />
                                Supporting documents:
                              </label>
                              <input
                                type="file"
                                onChange={(e) => handleFileUpload(suggestion.id, e)}
                                className="w-full p-2 rounded-md border border-input bg-background"
                              />

                              {responses[suggestion.id].attachments.length > 0 && (
                                <ul className="mt-2 space-y-1 bg-background p-2 rounded-md">
                                  {responses[suggestion.id].attachments.map((attachment: any) => (
                                    <li key={attachment.id} className="text-xs flex items-center">
                                      <Upload className="h-3 w-3 mr-1 text-primary" />
                                      <span className="font-medium">{attachment.fileName}</span>
                                      <span className="ml-1 text-muted-foreground">({attachment.fileSize})</span>
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

      <div className="flex justify-between items-center">
        <p className="text-sm text-muted-foreground">
          {respondedCount === totalCount
            ? "All recommendations have been addressed. You can now submit your responses."
            : `Please address the remaining ${totalCount - respondedCount} recommendations.`}
        </p>
        <button
          onClick={handleSubmit}
          disabled={respondedCount < totalCount}
          className={`px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors ${
            respondedCount < totalCount ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          Submit Responses
        </button>
      </div>
    </div>
  )
}

