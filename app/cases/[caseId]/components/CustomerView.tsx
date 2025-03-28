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
      alert("Bitte beantworten Sie alle Empfehlungen, bevor Sie absenden.")
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

  // Function to translate severity
  const translateSeverity = (severity: string) => {
    switch (severity) {
      case "High":
        return "Hoch"
      case "Medium":
        return "Mittel"
      case "Low":
        return "Niedrig"
      default:
        return severity
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-card p-6 rounded-lg shadow mb-6">
        <h1 className="text-2xl font-bold">Risikobewertungsbericht</h1>
        <p className="text-muted-foreground mt-2">Für: {caseData.customer.name}</p>
        <p className="text-muted-foreground">Standort: {caseData.location.name}</p>
        <p className="text-muted-foreground">Erstellt: {new Date(caseData.createdAt).toLocaleDateString()}</p>
      </div>

      {/* Progress indicator */}
      <div className="bg-card p-6 rounded-lg shadow mb-6">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-lg font-medium">Ihr Fortschritt</h2>
          <span className="text-sm font-medium">
            {respondedCount} von {totalCount} abgeschlossen
          </span>
        </div>
        <div className="w-full bg-muted rounded-full h-2.5">
          <div className="bg-primary h-2.5 rounded-full" style={{ width: `${progressPercentage}%` }}></div>
        </div>
        <p className="text-sm text-muted-foreground mt-2">
          Bitte beantworten Sie alle Empfehlungen unten und stellen Sie gegebenenfalls unterstützende Dokumente bereit.
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
          Risikobewertungen & Empfehlungen
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
                  {translateSeverity(risk.severity)}
                </span>
              </h3>
              <p className="mt-1 text-sm">{risk.description}</p>

              <div className="mt-4">
                <h4 className="text-sm font-medium">Empfehlungen:</h4>
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
                                Priorität: <span className="font-medium">{translateSeverity(suggestion.priority)}</span>{" "}
                                • Geschätzte Kosten:{" "}
                                <span className="font-medium">{translateSeverity(suggestion.estimatedCost)}</span> •
                                Zeitrahmen: <span className="font-medium">{suggestion.timeframe}</span>
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="mt-3 p-3 bg-card rounded-md">
                          <h5 className="text-sm font-medium">Ihre Antwort:</h5>

                          <div className="mt-2 space-y-3">
                            <div>
                              <p className="text-sm mb-2">Haben Sie diese Empfehlung umgesetzt?</p>
                              <div className="flex space-x-4">
                                <button
                                  onClick={() => handleResponseChange(suggestion.id, "followed", true)}
                                  className={`flex items-center px-3 py-1 rounded-md ${
                                    responses[suggestion.id].followed === true
                                      ? "bg-success text-success-foreground"
                                      : "bg-primary text-primary-foreground"
                                  }`}
                                >
                                  <CheckCircle className="h-4 w-4 mr-1" />
                                  Ja
                                </button>
                                <button
                                  onClick={() => handleResponseChange(suggestion.id, "followed", false)}
                                  className={`flex items-center px-3 py-1 rounded-md ${
                                    responses[suggestion.id].followed === false
                                      ? "bg-destructive text-destructive-foreground"
                                      : "bg-primary text-primary-foreground"
                                  }`}
                                >
                                  <XCircle className="h-4 w-4 mr-1" />
                                  Nein
                                </button>
                              </div>
                            </div>

                            <div>
                              <label className="block text-sm mb-1">Bitte erläutern Sie Ihre Antwort:</label>
                              <textarea
                                value={responses[suggestion.id].explanation}
                                onChange={(e) => handleResponseChange(suggestion.id, "explanation", e.target.value)}
                                className="w-full p-2 rounded-md border border-input bg-background"
                                rows={3}
                                placeholder={
                                  responses[suggestion.id].followed === true
                                    ? "Beschreiben Sie, wie Sie diese Empfehlung umgesetzt haben..."
                                    : responses[suggestion.id].followed === false
                                      ? "Erklären Sie, warum Sie diese Empfehlung nicht umsetzen konnten..."
                                      : "Geben Sie Details zu Ihrer Umsetzung an..."
                                }
                              />
                            </div>

                            <div>
                              <label className="block text-sm mb-1 flex items-center">
                                <Paperclip className="h-4 w-4 mr-1" />
                                Unterstützende Dokumente:
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
            ? "Alle Empfehlungen wurden beantwortet. Sie können jetzt Ihre Antworten absenden."
            : `Bitte beantworten Sie die verbleibenden ${totalCount - respondedCount} Empfehlungen.`}
        </p>
        <button
          onClick={handleSubmit}
          disabled={respondedCount < totalCount}
          className={`px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors ${
            respondedCount < totalCount ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          Antworten absenden
        </button>
      </div>
    </div>
  )
}

