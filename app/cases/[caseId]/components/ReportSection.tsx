"use client"

import { useState } from "react"
import { FileText, AlertTriangle, Plus, Trash2, Edit2 } from "lucide-react"

interface ReportSectionProps {
  report: any
  isEditing: boolean
  onUpdate: (updatedReport: any) => void
}

export default function ReportSection({ report, isEditing, onUpdate }: ReportSectionProps) {
  const [editingRiskId, setEditingRiskId] = useState<string | null>(null)
  const [editingSuggestionId, setEditingSuggestionId] = useState<string | null>(null)
  const [newRisk, setNewRisk] = useState({ title: "", description: "", severity: "Mittel" })
  const [newSuggestion, setNewSuggestion] = useState({ riskId: "", description: "" })

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

  const handleAddRisk = () => {
    if (!newRisk.title || !newRisk.description) return

    const newRiskId = `risk-${report.riskAssessments.length + 1}`
    onUpdate({
      ...report,
      riskAssessments: [
        ...report.riskAssessments,
        {
          id: newRiskId,
          title: newRisk.title,
          description: newRisk.description,
          severity: newRisk.severity,
        },
      ],
    })

    setNewRisk({ title: "", description: "", severity: "Mittel" })
  }

  const handleAddSuggestion = () => {
    if (!newSuggestion.riskId || !newSuggestion.description) return

    const newSuggestionId = `sug-${report.suggestions.length + 1}`
    onUpdate({
      ...report,
      suggestions: [
        ...report.suggestions,
        {
          id: newSuggestionId,
          riskId: newSuggestion.riskId,
          description: newSuggestion.description,
          customerResponse: {
            followed: null,
            explanation: "",
            attachments: [],
          },
        },
      ],
    })

    setNewSuggestion({ riskId: "", description: "" })
  }

  const handleUpdateRisk = (riskId: string, updatedFields: any) => {
    onUpdate({
      ...report,
      riskAssessments: report.riskAssessments.map((risk: any) =>
        risk.id === riskId ? { ...risk, ...updatedFields } : risk,
      ),
    })
    setEditingRiskId(null)
  }

  const handleUpdateSuggestion = (suggestionId: string, updatedFields: any) => {
    onUpdate({
      ...report,
      suggestions: report.suggestions.map((suggestion: any) =>
        suggestion.id === suggestionId ? { ...suggestion, ...updatedFields } : suggestion,
      ),
    })
    setEditingSuggestionId(null)
  }

  const handleDeleteRisk = (riskId: string) => {
    // Also delete associated suggestions
    onUpdate({
      ...report,
      riskAssessments: report.riskAssessments.filter((risk: any) => risk.id !== riskId),
      suggestions: report.suggestions.filter((suggestion: any) => suggestion.riskId !== riskId),
    })
  }

  const handleDeleteSuggestion = (suggestionId: string) => {
    onUpdate({
      ...report,
      suggestions: report.suggestions.filter((suggestion: any) => suggestion.id !== suggestionId),
    })
  }

  return (
    <div className="bg-card p-6 rounded-lg shadow">
      <h2 className="text-xl font-semibold flex items-center">
        <FileText className="h-5 w-5 mr-2" />
        Bericht: {report.title}
      </h2>

      <p className="mt-2 text-muted-foreground">{report.overview}</p>

      <div className="mt-6">
        <h3 className="text-lg font-medium flex items-center">
          <AlertTriangle className="h-4 w-4 mr-2" />
          Risikobewertungen
        </h3>

        <div className="mt-4 space-y-4">
          {report.riskAssessments.map((risk: any) => (
            <div key={risk.id} className="bg-background p-4 rounded-md">
              {editingRiskId === risk.id ? (
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium mb-1">Titel</label>
                    <input
                      type="text"
                      value={risk.title}
                      onChange={(e) => handleUpdateRisk(risk.id, { title: e.target.value })}
                      className="w-full p-2 rounded-md border border-input bg-background"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Beschreibung</label>
                    <textarea
                      value={risk.description}
                      onChange={(e) => handleUpdateRisk(risk.id, { description: e.target.value })}
                      className="w-full p-2 rounded-md border border-input bg-background"
                      rows={2}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Schweregrad</label>
                    <select
                      value={risk.severity}
                      onChange={(e) => handleUpdateRisk(risk.id, { severity: e.target.value })}
                      className="w-full p-2 rounded-md border border-input bg-background"
                    >
                      <option value="Low">Niedrig</option>
                      <option value="Medium">Mittel</option>
                      <option value="High">Hoch</option>
                    </select>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() => setEditingRiskId(null)}
                      className="px-3 py-1 bg-secondary text-secondary-foreground rounded-md"
                    >
                      Abbrechen
                    </button>
                    <button
                      onClick={() => setEditingRiskId(null)}
                      className="px-3 py-1 bg-primary text-primary-foreground rounded-md"
                    >
                      Speichern
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex justify-between">
                    <h4 className="font-semibold flex items-center">
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
                    </h4>

                    {isEditing && (
                      <div className="flex space-x-2">
                        <button
                          onClick={() => setEditingRiskId(risk.id)}
                          className="p-1 text-muted-foreground hover:text-foreground"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteRisk(risk.id)}
                          className="p-1 text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    )}
                  </div>
                  <p className="mt-1 text-sm">{risk.description}</p>
                </>
              )}

              <div className="mt-3">
                <h5 className="text-sm font-medium">Empfehlungen:</h5>
                <ul className="mt-2 space-y-2">
                  {report.suggestions
                    .filter((suggestion: any) => suggestion.riskId === risk.id)
                    .map((suggestion: any) => (
                      <li key={suggestion.id} className="pl-4 border-l-2 border-muted">
                        {editingSuggestionId === suggestion.id ? (
                          <div className="space-y-3">
                            <div>
                              <label className="block text-sm font-medium mb-1">Beschreibung</label>
                              <textarea
                                value={suggestion.description}
                                onChange={(e) => handleUpdateSuggestion(suggestion.id, { description: e.target.value })}
                                className="w-full p-2 rounded-md border border-input bg-background"
                                rows={2}
                              />
                            </div>
                            <div className="flex justify-end space-x-2">
                              <button
                                onClick={() => setEditingSuggestionId(null)}
                                className="px-3 py-1 bg-secondary text-secondary-foreground rounded-md"
                              >
                                Abbrechen
                              </button>
                              <button
                                onClick={() => setEditingSuggestionId(null)}
                                className="px-3 py-1 bg-primary text-primary-foreground rounded-md"
                              >
                                Speichern
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex justify-between">
                            <p className="text-sm">{suggestion.description}</p>

                            {isEditing && (
                              <div className="flex space-x-2">
                                <button
                                  onClick={() => setEditingSuggestionId(suggestion.id)}
                                  className="p-1 text-muted-foreground hover:text-foreground"
                                >
                                  <Edit2 className="h-3 w-3" />
                                </button>
                                <button
                                  onClick={() => handleDeleteSuggestion(suggestion.id)}
                                  className="p-1 text-muted-foreground hover:text-destructive"
                                >
                                  <Trash2 className="h-3 w-3" />
                                </button>
                              </div>
                            )}
                          </div>
                        )}

                        {suggestion.customerResponse.followed !== null && (
                          <div className="mt-2 text-xs">
                            <p
                              className={`font-medium ${
                                suggestion.customerResponse.followed ? "text-green-500" : "text-red-500"
                              }`}
                            >
                              {suggestion.customerResponse.followed ? "Umgesetzt" : "Nicht umgesetzt"}
                            </p>
                            {suggestion.customerResponse.explanation && (
                              <p className="mt-1">{suggestion.customerResponse.explanation}</p>
                            )}
                            {suggestion.customerResponse.attachments.length > 0 && (
                              <div className="mt-1">
                                <p className="font-medium">Anhänge:</p>
                                <ul className="list-disc list-inside">
                                  {suggestion.customerResponse.attachments.map((attachment: any) => (
                                    <li key={attachment.id}>{attachment.fileName}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        )}
                      </li>
                    ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {isEditing && (
          <>
            <div className="mt-6 p-4 bg-background rounded-md">
              <h4 className="font-medium">Neues Risiko hinzufügen</h4>
              <div className="mt-3 space-y-3">
                <div>
                  <label className="block text-sm font-medium mb-1">Titel</label>
                  <input
                    type="text"
                    value={newRisk.title}
                    onChange={(e) => setNewRisk({ ...newRisk, title: e.target.value })}
                    className="w-full p-2 rounded-md border border-input bg-background"
                    placeholder="Risikotitel"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Beschreibung</label>
                  <textarea
                    value={newRisk.description}
                    onChange={(e) => setNewRisk({ ...newRisk, description: e.target.value })}
                    className="w-full p-2 rounded-md border border-input bg-background"
                    rows={2}
                    placeholder="Beschreiben Sie das Risiko"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Schweregrad</label>
                  <select
                    value={newRisk.severity}
                    onChange={(e) => setNewRisk({ ...newRisk, severity: e.target.value })}
                    className="w-full p-2 rounded-md border border-input bg-background"
                  >
                    <option value="Low">Niedrig</option>
                    <option value="Medium">Mittel</option>
                    <option value="High">Hoch</option>
                  </select>
                </div>
                <button
                  onClick={handleAddRisk}
                  className="flex items-center px-3 py-1 bg-primary text-primary-foreground rounded-md"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Risiko hinzufügen
                </button>
              </div>
            </div>

            <div className="mt-4 p-4 bg-background rounded-md">
              <h4 className="font-medium">Neue Empfehlung hinzufügen</h4>
              <div className="mt-3 space-y-3">
                <div>
                  <label className="block text-sm font-medium mb-1">Zugehöriges Risiko</label>
                  <select
                    value={newSuggestion.riskId}
                    onChange={(e) => setNewSuggestion({ ...newSuggestion, riskId: e.target.value })}
                    className="w-full p-2 rounded-md border border-input bg-background"
                  >
                    <option value="">Risiko auswählen</option>
                    {report.riskAssessments.map((risk: any) => (
                      <option key={risk.id} value={risk.id}>
                        {risk.title}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Beschreibung</label>
                  <textarea
                    value={newSuggestion.description}
                    onChange={(e) => setNewSuggestion({ ...newSuggestion, description: e.target.value })}
                    className="w-full p-2 rounded-md border border-input bg-background"
                    rows={2}
                    placeholder="Beschreiben Sie die Empfehlung"
                  />
                </div>
                <button
                  onClick={handleAddSuggestion}
                  className="flex items-center px-3 py-1 bg-primary text-primary-foreground rounded-md"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Empfehlung hinzufügen
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

