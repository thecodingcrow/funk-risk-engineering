"use client"

import { useState, useEffect } from "react"
import { useParams, useSearchParams } from "next/navigation"
import Link from "next/link"
import {
  ArrowLeft,
  FileText,
  AlertTriangle,
  Download,
  Printer,
  Share2,
  Building,
  MapPin,
  Calendar,
  User,
  Save,
  Edit,
  Plus,
  Trash2,
} from "lucide-react"
import { getCaseById, getCustomerById, getLocationById } from "@/lib/data"

export default function ReportPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const caseId = Number(params.caseId)
  const mode = searchParams.get("mode") || "view"
  const isEditing = mode === "edit"

  const [caseData, setCaseData] = useState<any>(null)
  const [reportData, setReportData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulating API fetch
    const caseItem = getCaseById(caseId)

    if (caseItem) {
      const customerData = getCustomerById(caseItem.customerId)
      const locationData = getLocationById(caseItem.locationId)

      const fullCaseData = {
        ...caseItem,
        customer: customerData,
        location: locationData,
        assignedEmployee: {
          id: "emp-456",
          name: "John Doe",
          email: "john.doe@company.com",
          position: "Risikobewertungsspezialist",
        },
        report: {
          title: `${caseItem.title} Bericht`,
          overview:
            "Dieser umfassende Risikobewertungsbericht identifiziert potenzielle Gefahren und bietet detaillierte Empfehlungen zur Risikominderung. Die Bewertung wurde gemäß Branchenstandards und regulatorischen Anforderungen durchgeführt.",
          date: new Date().toISOString(),
          riskAssessments: [
            {
              id: "risk-1",
              title: "Sicherheitsbedenken",
              description:
                "Bei der Inspektion wurden mehrere Sicherheitsprobleme festgestellt, darunter unzureichende Notausgänge, fehlende Feuerlöscher und schlechte Beleuchtung in Treppenhäusern. Diese Probleme stellen erhebliche Risiken für Mitarbeiter und Besucher im Notfall dar.",
              severity: "High",
              impactAreas: ["Mitarbeitersicherheit", "Regulatorische Compliance", "Haftung"],
              potentialConsequences: "Verletzungen, behördliche Bußgelder, potenzielle Klagen",
            },
            {
              id: "risk-2",
              title: "Wartungsprobleme",
              description:
                "Regelmäßige Wartungsverfahren werden für kritische Geräte nicht eingehalten. Die Dokumentation zeigt Lücken in den Wartungsplänen, und mehrere Geräte zeigen Verschleißerscheinungen über akzeptable Grenzen hinaus. Dies erhöht die Wahrscheinlichkeit von Geräteausfällen und potenziellen Sicherheitsvorfällen.",
              severity: "Medium",
              impactAreas: ["Betriebliche Kontinuität", "Geräte-Lebensdauer", "Sicherheit"],
              potentialConsequences: "Geräteausfall, Produktionsverzögerungen, erhöhte Reparaturkosten",
            },
            {
              id: "risk-3",
              title: "Datensicherheitslücken",
              description:
                "Die Bewertung hat mehrere potenzielle Schwachstellen in den Datensicherheitsprotokollen identifiziert. Dazu gehören veraltete Software, schwache Passwortrichtlinien und unzureichende Zugriffskontrollen für sensible Informationen.",
              severity: "High",
              impactAreas: ["Datenschutz", "Kundenvertrauen", "Regulatorische Compliance"],
              potentialConsequences: "Datenschutzverletzungen, behördliche Strafen, Reputationsschäden",
            },
          ],
          suggestions: [
            {
              id: "sug-1",
              riskId: "risk-1",
              description:
                "Implementieren Sie ein umfassendes Sicherheitsschulungsprogramm für alle Mitarbeiter. Stellen Sie sicher, dass alle Notausgänge deutlich gekennzeichnet und nicht blockiert sind. Installieren Sie zusätzliche Feuerlöscher in den identifizierten Bereichen und implementieren Sie einen monatlichen Inspektionsplan.",
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
                "Erstellen Sie einen Wartungsplan und weisen Sie verantwortliches Personal zu. Implementieren Sie ein digitales Wartungsverfolgungssystem, um sicherzustellen, dass regelmäßige Wartungen durchgeführt und dokumentiert werden. Führen Sie Schulungen für das Wartungspersonal zu den richtigen Verfahren durch.",
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
                "Aktualisieren Sie alle Software auf die neuesten Versionen und implementieren Sie einen regelmäßigen Aktualisierungsplan. Stärken Sie die Passwortrichtlinien und implementieren Sie eine Zwei-Faktor-Authentifizierung für alle Konten mit Zugriff auf sensible Daten. Führen Sie Sicherheitsbewusstseinstraining für alle Mitarbeiter durch.",
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
          conclusion:
            "Diese Risikobewertung hat mehrere Bereiche identifiziert, die Aufmerksamkeit erfordern, um die Einhaltung von Sicherheitsvorschriften und Branchenstandards zu gewährleisten. Die umgehende Behebung dieser Probleme wird potenzielle Risiken erheblich reduzieren und die allgemeine Sicherheit und betriebliche Effizienz verbessern.",
        },
      }

      setCaseData(fullCaseData)
      setReportData({ ...fullCaseData.report })
    }

    setIsLoading(false)
  }, [caseId])

  const handleSaveChanges = () => {
    // In a real app, this would save the changes to the API
    setCaseData({
      ...caseData,
      report: reportData,
    })

    // Redirect to view mode
    window.location.href = `/cases/${caseId}/report`
  }

  const updateRiskAssessment = (riskId: string, updatedData: any) => {
    setReportData({
      ...reportData,
      riskAssessments: reportData.riskAssessments.map((risk: any) =>
        risk.id === riskId ? { ...risk, ...updatedData } : risk,
      ),
    })
  }

  const updateSuggestion = (suggestionId: string, updatedData: any) => {
    setReportData({
      ...reportData,
      suggestions: reportData.suggestions.map((suggestion: any) =>
        suggestion.id === suggestionId ? { ...suggestion, ...updatedData } : suggestion,
      ),
    })
  }

  const addRiskAssessment = () => {
    const newRiskId = `risk-${reportData.riskAssessments.length + 1}-${Date.now()}`
    setReportData({
      ...reportData,
      riskAssessments: [
        ...reportData.riskAssessments,
        {
          id: newRiskId,
          title: "Neue Risikobewertung",
          description: "Beschreibung des Risikos",
          severity: "Medium",
          impactAreas: ["Bereich 1", "Bereich 2"],
          potentialConsequences: "Potenzielle Konsequenzen des Risikos",
        },
      ],
    })
  }

  const addSuggestion = (riskId: string) => {
    const newSuggestionId = `sug-${reportData.suggestions.length + 1}-${Date.now()}`
    setReportData({
      ...reportData,
      suggestions: [
        ...reportData.suggestions,
        {
          id: newSuggestionId,
          riskId: riskId,
          description: "Neue Empfehlung zur Behebung des Risikos",
          priority: "Medium",
          estimatedCost: "Medium",
          timeframe: "1-2 Monate",
          customerResponse: {
            followed: null,
            explanation: "",
            attachments: [],
          },
        },
      ],
    })
  }

  const deleteRiskAssessment = (riskId: string) => {
    setReportData({
      ...reportData,
      riskAssessments: reportData.riskAssessments.filter((risk: any) => risk.id !== riskId),
      // Also remove associated suggestions
      suggestions: reportData.suggestions.filter((suggestion: any) => suggestion.riskId !== riskId),
    })
  }

  const deleteSuggestion = (suggestionId: string) => {
    setReportData({
      ...reportData,
      suggestions: reportData.suggestions.filter((suggestion: any) => suggestion.id !== suggestionId),
    })
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!caseData || !reportData) {
    return <div className="p-8">Fall nicht gefunden</div>
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "High":
        return "bg-red-500 text-white"
      case "Medium":
        return "bg-yellow-500 text-black"
      case "Low":
        return "bg-green-500 text-white"
      default:
        return "bg-blue-500 text-white"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "text-red-500"
      case "Medium":
        return "text-yellow-500"
      case "Low":
        return "text-green-500"
      default:
        return "text-blue-500"
    }
  }

  // Function to translate severity and priority
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
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      {/* Navigation and actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between">
        <Link href={`/cases/${caseId}/full-view`} className="inline-flex items-center text-primary hover:underline">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Zurück zum Fall
        </Link>

        <div className="mt-4 sm:mt-0 flex items-center space-x-2">
          {isEditing ? (
            <button
              onClick={handleSaveChanges}
              className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
            >
              <Save className="h-4 w-4 mr-1" />
              Änderungen speichern
            </button>
          ) : (
            <>
              <Link
                href={`/cases/${caseId}/report?mode=edit`}
                className="inline-flex items-center px-3 py-1 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
              >
                <Edit className="h-4 w-4 mr-1" />
                Bericht bearbeiten
              </Link>
              <button className="inline-flex items-center px-3 py-1 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/90 transition-colors">
                <Printer className="h-4 w-4 mr-1" />
                Drucken
              </button>
              <button className="inline-flex items-center px-3 py-1 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/90 transition-colors">
                <Download className="h-4 w-4 mr-1" />
                PDF herunterladen
              </button>
              <button className="inline-flex items-center px-3 py-1 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/90 transition-colors">
                <Share2 className="h-4 w-4 mr-1" />
                Teilen
              </button>
            </>
          )}
        </div>
      </div>

      {/* Report header */}
      <div className="bg-primary/5 border border-primary/20 rounded-xl p-6 shadow-md">
        <div className="flex flex-col md:flex-row md:items-start justify-between">
          <div>
            {isEditing ? (
              <input
                type="text"
                value={reportData.title}
                onChange={(e) => setReportData({ ...reportData, title: e.target.value })}
                className="text-2xl font-bold bg-background border border-input p-2 rounded-md w-full md:w-auto"
              />
            ) : (
              <h1 className="text-2xl font-bold flex items-center">
                <FileText className="h-6 w-6 mr-2 text-primary" />
                {reportData.title}
              </h1>
            )}
            <p className="text-muted-foreground mt-1">Fall #{caseData.id}</p>
          </div>

          <div className="mt-4 md:mt-0 flex flex-col items-start md:items-end">
            <div className="flex items-center text-sm">
              <Calendar className="h-4 w-4 mr-1" />
              <span>Berichtsdatum: {new Date(reportData.date).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center text-sm mt-1">
              <User className="h-4 w-4 mr-1" />
              <span>Erstellt von: {caseData.assignedEmployee.name}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Customer and location info */}
      <div className="bg-background rounded-xl shadow-md border border-border overflow-hidden">
        <div className="bg-muted/30 px-4 py-3 border-b border-border">
          <h2 className="font-medium">Bewertungsinformationen</h2>
        </div>
        <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-card p-4 rounded-lg">
            <h3 className="text-sm font-medium flex items-center">
              <Building className="h-4 w-4 mr-1 text-muted-foreground" />
              Kunde
            </h3>
            <p className="font-semibold mt-1">{caseData.customer?.name}</p>
            <p className="text-sm text-muted-foreground">{caseData.customer?.industry}</p>
            <p className="text-sm text-muted-foreground">{caseData.customer?.email}</p>
            <p className="text-sm text-muted-foreground">{caseData.customer?.phone}</p>
          </div>

          <div className="bg-card p-4 rounded-lg">
            <h3 className="text-sm font-medium flex items-center">
              <MapPin className="h-4 w-4 mr-1 text-muted-foreground" />
              Standort
            </h3>
            <p className="font-semibold mt-1">{caseData.location?.name}</p>
            <p className="text-sm text-muted-foreground">{caseData.location?.address}</p>
          </div>
        </div>
      </div>

      {/* Report overview */}
      <div className="bg-background rounded-xl shadow-md border border-border overflow-hidden">
        <div className="bg-muted/30 px-4 py-3 border-b border-border">
          <h2 className="font-medium">Zusammenfassung</h2>
        </div>
        <div className="p-6">
          {isEditing ? (
            <textarea
              value={reportData.overview}
              onChange={(e) => setReportData({ ...reportData, overview: e.target.value })}
              className="w-full p-3 rounded-md border border-input bg-background min-h-[100px]"
            />
          ) : (
            <p className="leading-relaxed">{reportData.overview}</p>
          )}
        </div>
      </div>

      {/* Risk assessments */}
      <div className="bg-background rounded-xl shadow-md border border-border overflow-hidden">
        <div className="bg-muted/30 px-4 py-3 border-b border-border flex items-center justify-between">
          <h2 className="font-medium flex items-center">
            <AlertTriangle className="h-5 w-5 mr-2 text-muted-foreground" />
            Risikobewertungen
          </h2>
          {isEditing && (
            <button
              onClick={addRiskAssessment}
              className="inline-flex items-center px-2 py-1 text-xs bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
            >
              <Plus className="h-3 w-3 mr-1" />
              Risiko hinzufügen
            </button>
          )}
        </div>
        <div className="p-4 space-y-6">
          {reportData.riskAssessments.map((risk: any, index: number) => (
            <div key={risk.id} className="bg-card rounded-lg overflow-hidden border border-border">
              <div className="flex items-center justify-between p-4 border-b border-border">
                {isEditing ? (
                  <div className="flex-grow">
                    <input
                      type="text"
                      value={risk.title}
                      onChange={(e) => updateRiskAssessment(risk.id, { title: e.target.value })}
                      className="w-full p-2 rounded-md border border-input bg-background font-semibold"
                      placeholder="Risikotitel"
                    />
                  </div>
                ) : (
                  <h3 className="font-semibold text-lg flex items-center">
                    <span className="mr-2">{index + 1}.</span>
                    {risk.title}
                  </h3>
                )}

                {isEditing ? (
                  <div className="flex items-center ml-2">
                    <select
                      value={risk.severity}
                      onChange={(e) => updateRiskAssessment(risk.id, { severity: e.target.value })}
                      className="p-1 rounded-md border border-input bg-background text-sm"
                    >
                      <option value="High">Hohes Risiko</option>
                      <option value="Medium">Mittleres Risiko</option>
                      <option value="Low">Niedriges Risiko</option>
                    </select>
                    <button
                      onClick={() => deleteRiskAssessment(risk.id)}
                      className="ml-2 p-1 text-destructive hover:bg-destructive/10 rounded-md"
                      title="Risiko löschen"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getSeverityColor(risk.severity)}`}>
                    {translateSeverity(risk.severity)}es Risiko
                  </span>
                )}
              </div>
              <div className="p-4">
                {isEditing ? (
                  <textarea
                    value={risk.description}
                    onChange={(e) => updateRiskAssessment(risk.id, { description: e.target.value })}
                    className="w-full p-2 rounded-md border border-input bg-background mb-4"
                    rows={3}
                    placeholder="Risikobeschreibung"
                  />
                ) : (
                  <p className="mb-4">{risk.description}</p>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div className="bg-background p-3 rounded-md">
                    <h4 className="text-sm font-medium text-muted-foreground">Auswirkungsbereiche</h4>
                    {isEditing ? (
                      <input
                        type="text"
                        value={risk.impactAreas.join(", ")}
                        onChange={(e) =>
                          updateRiskAssessment(risk.id, {
                            impactAreas: e.target.value.split(",").map((item: string) => item.trim()),
                          })
                        }
                        className="w-full p-2 mt-1 rounded-md border border-input bg-background text-sm"
                        placeholder="Auswirkungsbereiche (durch Komma getrennt)"
                      />
                    ) : (
                      <ul className="mt-1 list-disc list-inside">
                        {risk.impactAreas.map((area: string, i: number) => (
                          <li key={i} className="text-sm">
                            {area}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                  <div className="bg-background p-3 rounded-md">
                    <h4 className="text-sm font-medium text-muted-foreground">Mögliche Konsequenzen</h4>
                    {isEditing ? (
                      <input
                        type="text"
                        value={risk.potentialConsequences}
                        onChange={(e) => updateRiskAssessment(risk.id, { potentialConsequences: e.target.value })}
                        className="w-full p-2 mt-1 rounded-md border border-input bg-background text-sm"
                        placeholder="Mögliche Konsequenzen"
                      />
                    ) : (
                      <p className="text-sm mt-1">{risk.potentialConsequences}</p>
                    )}
                  </div>
                </div>

                {/* Recommendations for this risk */}
                <div className="mt-4">
                  <div className="flex items-center justify-between border-b pb-2 mb-3">
                    <h4 className="text-sm font-medium">Empfehlungen</h4>
                    {isEditing && (
                      <button
                        onClick={() => addSuggestion(risk.id)}
                        className="inline-flex items-center px-2 py-1 text-xs bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/90 transition-colors"
                      >
                        <Plus className="h-3 w-3 mr-1" />
                        Empfehlung hinzufügen
                      </button>
                    )}
                  </div>
                  {reportData.suggestions
                    .filter((suggestion: any) => suggestion.riskId === risk.id)
                    .map((suggestion: any) => (
                      <div
                        key={suggestion.id}
                        className="bg-background p-3 rounded-md mb-3 border-l-4 border-primary/30"
                      >
                        {isEditing ? (
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <textarea
                                value={suggestion.description}
                                onChange={(e) => updateSuggestion(suggestion.id, { description: e.target.value })}
                                className="w-full p-2 rounded-md border border-input bg-background text-sm"
                                rows={2}
                                placeholder="Empfehlungsbeschreibung"
                              />
                              <button
                                onClick={() => deleteSuggestion(suggestion.id)}
                                className="ml-2 p-1 text-destructive hover:bg-destructive/10 rounded-md self-start"
                                title="Empfehlung löschen"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                            <div className="grid grid-cols-3 gap-2">
                              <div>
                                <label className="text-xs text-muted-foreground">Priorität</label>
                                <select
                                  value={suggestion.priority}
                                  onChange={(e) => updateSuggestion(suggestion.id, { priority: e.target.value })}
                                  className="w-full p-1 rounded-md border border-input bg-background text-xs"
                                >
                                  <option value="High">Hoch</option>
                                  <option value="Medium">Mittel</option>
                                  <option value="Low">Niedrig</option>
                                </select>
                              </div>
                              <div>
                                <label className="text-xs text-muted-foreground">Geschätzte Kosten</label>
                                <select
                                  value={suggestion.estimatedCost}
                                  onChange={(e) => updateSuggestion(suggestion.id, { estimatedCost: e.target.value })}
                                  className="w-full p-1 rounded-md border border-input bg-background text-xs"
                                >
                                  <option value="High">Hoch</option>
                                  <option value="Medium">Mittel</option>
                                  <option value="Low">Niedrig</option>
                                </select>
                              </div>
                              <div>
                                <label className="text-xs text-muted-foreground">Zeitrahmen</label>
                                <input
                                  type="text"
                                  value={suggestion.timeframe}
                                  onChange={(e) => updateSuggestion(suggestion.id, { timeframe: e.target.value })}
                                  className="w-full p-1 rounded-md border border-input bg-background text-xs"
                                  placeholder="z.B. 1-2 Monate"
                                />
                              </div>
                            </div>
                          </div>
                        ) : (
                          <>
                            <p className="text-sm">{suggestion.description}</p>
                            <div className="flex flex-wrap gap-3 mt-2">
                              <span className="text-xs inline-flex items-center">
                                <span className={`font-medium ${getPriorityColor(suggestion.priority)}`}>
                                  Priorität:
                                </span>
                                <span className="ml-1">{translateSeverity(suggestion.priority)}</span>
                              </span>
                              <span className="text-xs inline-flex items-center">
                                <span className="font-medium">Geschätzte Kosten:</span>
                                <span className="ml-1">{translateSeverity(suggestion.estimatedCost)}</span>
                              </span>
                              <span className="text-xs inline-flex items-center">
                                <span className="font-medium">Zeitrahmen:</span>
                                <span className="ml-1">{suggestion.timeframe}</span>
                              </span>
                            </div>
                          </>
                        )}
                      </div>
                    ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Conclusion */}
      <div className="bg-background rounded-xl shadow-md border border-border overflow-hidden">
        <div className="bg-muted/30 px-4 py-3 border-b border-border">
          <h2 className="font-medium">Fazit</h2>
        </div>
        <div className="p-6">
          {isEditing ? (
            <textarea
              value={reportData.conclusion}
              onChange={(e) => setReportData({ ...reportData, conclusion: e.target.value })}
              className="w-full p-3 rounded-md border border-input bg-background min-h-[100px]"
            />
          ) : (
            <p className="leading-relaxed">{reportData.conclusion}</p>
          )}
        </div>
      </div>

      {/* Signature */}
      <div className="bg-background rounded-xl shadow-md border border-border overflow-hidden">
        <div className="p-6">
          <div className="flex flex-col items-end">
            <p className="text-sm text-muted-foreground">Erstellt von:</p>
            <p className="font-medium">{caseData.assignedEmployee.name}</p>
            <p className="text-sm text-muted-foreground">{caseData.assignedEmployee.position}</p>
            <p className="text-sm text-muted-foreground">{new Date(reportData.date).toLocaleDateString()}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

