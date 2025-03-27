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
          position: "Risk Assessment Specialist",
        },
        report: {
          title: `${caseItem.title} Report`,
          overview:
            "This comprehensive risk assessment report identifies potential hazards and provides detailed recommendations for risk mitigation. The assessment was conducted according to industry standards and regulatory requirements.",
          date: new Date().toISOString(),
          riskAssessments: [
            {
              id: "risk-1",
              title: "Safety Concerns",
              description:
                "Several safety issues were identified during the inspection, including inadequate emergency exits, missing fire extinguishers, and poor lighting in stairwells. These issues pose significant risks to employees and visitors in case of emergency situations.",
              severity: "High",
              impactAreas: ["Employee Safety", "Regulatory Compliance", "Liability"],
              potentialConsequences: "Injuries, regulatory fines, potential lawsuits",
            },
            {
              id: "risk-2",
              title: "Maintenance Issues",
              description:
                "Regular maintenance procedures are not being followed for critical equipment. Documentation shows gaps in maintenance schedules, and several pieces of equipment show signs of wear beyond acceptable limits. This increases the likelihood of equipment failure and potential safety incidents.",
              severity: "Medium",
              impactAreas: ["Operational Continuity", "Equipment Lifespan", "Safety"],
              potentialConsequences: "Equipment failure, production delays, increased repair costs",
            },
            {
              id: "risk-3",
              title: "Data Security Vulnerabilities",
              description:
                "The assessment identified several potential vulnerabilities in the data security protocols. These include outdated software, weak password policies, and insufficient access controls for sensitive information.",
              severity: "High",
              impactAreas: ["Data Protection", "Customer Trust", "Regulatory Compliance"],
              potentialConsequences: "Data breaches, regulatory penalties, reputation damage",
            },
          ],
          suggestions: [
            {
              id: "sug-1",
              riskId: "risk-1",
              description:
                "Implement a comprehensive safety training program for all employees. Ensure all emergency exits are clearly marked and unobstructed. Install additional fire extinguishers in identified areas and implement a monthly inspection schedule.",
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
                "Create a maintenance schedule and assign responsible personnel. Implement a digital maintenance tracking system to ensure regular maintenance is performed and documented. Conduct training for maintenance staff on proper procedures.",
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
                "Update all software to the latest versions and implement a regular update schedule. Strengthen password policies and implement multi-factor authentication for all accounts with access to sensitive data. Conduct security awareness training for all employees.",
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
          conclusion:
            "This risk assessment has identified several areas requiring attention to ensure compliance with safety regulations and industry best practices. Addressing these issues promptly will significantly reduce potential risks and improve overall safety and operational efficiency.",
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
          title: "New Risk Assessment",
          description: "Description of the risk",
          severity: "Medium",
          impactAreas: ["Area 1", "Area 2"],
          potentialConsequences: "Potential consequences of the risk",
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
          description: "New recommendation for addressing the risk",
          priority: "Medium",
          estimatedCost: "Medium",
          timeframe: "1-2 months",
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
    return <div className="p-8">Case not found</div>
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

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      {/* Navigation and actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between">
        <Link href={`/cases/${caseId}/full-view`} className="inline-flex items-center text-primary hover:underline">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Case
        </Link>

        <div className="mt-4 sm:mt-0 flex items-center space-x-2">
          {isEditing ? (
            <button
              onClick={handleSaveChanges}
              className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
            >
              <Save className="h-4 w-4 mr-1" />
              Save Changes
            </button>
          ) : (
            <>
              <Link
                href={`/cases/${caseId}/report?mode=edit`}
                className="inline-flex items-center px-3 py-1 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
              >
                <Edit className="h-4 w-4 mr-1" />
                Edit Report
              </Link>
              <button className="inline-flex items-center px-3 py-1 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/90 transition-colors">
                <Printer className="h-4 w-4 mr-1" />
                Print
              </button>
              <button className="inline-flex items-center px-3 py-1 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/90 transition-colors">
                <Download className="h-4 w-4 mr-1" />
                Download PDF
              </button>
              <button className="inline-flex items-center px-3 py-1 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/90 transition-colors">
                <Share2 className="h-4 w-4 mr-1" />
                Share
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
            <p className="text-muted-foreground mt-1">Case #{caseData.id}</p>
          </div>

          <div className="mt-4 md:mt-0 flex flex-col items-start md:items-end">
            <div className="flex items-center text-sm">
              <Calendar className="h-4 w-4 mr-1" />
              <span>Report Date: {new Date(reportData.date).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center text-sm mt-1">
              <User className="h-4 w-4 mr-1" />
              <span>Prepared by: {caseData.assignedEmployee.name}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Customer and location info */}
      <div className="bg-background rounded-xl shadow-md border border-border overflow-hidden">
        <div className="bg-muted/30 px-4 py-3 border-b border-border">
          <h2 className="font-medium">Assessment Information</h2>
        </div>
        <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-card p-4 rounded-lg">
            <h3 className="text-sm font-medium flex items-center">
              <Building className="h-4 w-4 mr-1 text-muted-foreground" />
              Customer
            </h3>
            <p className="font-semibold mt-1">{caseData.customer?.name}</p>
            <p className="text-sm text-muted-foreground">{caseData.customer?.industry}</p>
            <p className="text-sm text-muted-foreground">{caseData.customer?.email}</p>
            <p className="text-sm text-muted-foreground">{caseData.customer?.phone}</p>
          </div>

          <div className="bg-card p-4 rounded-lg">
            <h3 className="text-sm font-medium flex items-center">
              <MapPin className="h-4 w-4 mr-1 text-muted-foreground" />
              Location
            </h3>
            <p className="font-semibold mt-1">{caseData.location?.name}</p>
            <p className="text-sm text-muted-foreground">{caseData.location?.address}</p>
          </div>
        </div>
      </div>

      {/* Report overview */}
      <div className="bg-background rounded-xl shadow-md border border-border overflow-hidden">
        <div className="bg-muted/30 px-4 py-3 border-b border-border">
          <h2 className="font-medium">Executive Summary</h2>
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
            Risk Assessments
          </h2>
          {isEditing && (
            <button
              onClick={addRiskAssessment}
              className="inline-flex items-center px-2 py-1 text-xs bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
            >
              <Plus className="h-3 w-3 mr-1" />
              Add Risk
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
                      placeholder="Risk title"
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
                      <option value="High">High Risk</option>
                      <option value="Medium">Medium Risk</option>
                      <option value="Low">Low Risk</option>
                    </select>
                    <button
                      onClick={() => deleteRiskAssessment(risk.id)}
                      className="ml-2 p-1 text-destructive hover:bg-destructive/10 rounded-md"
                      title="Delete risk"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getSeverityColor(risk.severity)}`}>
                    {risk.severity} Risk
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
                    placeholder="Risk description"
                  />
                ) : (
                  <p className="mb-4">{risk.description}</p>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div className="bg-background p-3 rounded-md">
                    <h4 className="text-sm font-medium text-muted-foreground">Impact Areas</h4>
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
                        placeholder="Impact areas (comma separated)"
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
                    <h4 className="text-sm font-medium text-muted-foreground">Potential Consequences</h4>
                    {isEditing ? (
                      <input
                        type="text"
                        value={risk.potentialConsequences}
                        onChange={(e) => updateRiskAssessment(risk.id, { potentialConsequences: e.target.value })}
                        className="w-full p-2 mt-1 rounded-md border border-input bg-background text-sm"
                        placeholder="Potential consequences"
                      />
                    ) : (
                      <p className="text-sm mt-1">{risk.potentialConsequences}</p>
                    )}
                  </div>
                </div>

                {/* Recommendations for this risk */}
                <div className="mt-4">
                  <div className="flex items-center justify-between border-b pb-2 mb-3">
                    <h4 className="text-sm font-medium">Recommendations</h4>
                    {isEditing && (
                      <button
                        onClick={() => addSuggestion(risk.id)}
                        className="inline-flex items-center px-2 py-1 text-xs bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/90 transition-colors"
                      >
                        <Plus className="h-3 w-3 mr-1" />
                        Add Recommendation
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
                                placeholder="Recommendation description"
                              />
                              <button
                                onClick={() => deleteSuggestion(suggestion.id)}
                                className="ml-2 p-1 text-destructive hover:bg-destructive/10 rounded-md self-start"
                                title="Delete recommendation"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                            <div className="grid grid-cols-3 gap-2">
                              <div>
                                <label className="text-xs text-muted-foreground">Priority</label>
                                <select
                                  value={suggestion.priority}
                                  onChange={(e) => updateSuggestion(suggestion.id, { priority: e.target.value })}
                                  className="w-full p-1 rounded-md border border-input bg-background text-xs"
                                >
                                  <option value="High">High</option>
                                  <option value="Medium">Medium</option>
                                  <option value="Low">Low</option>
                                </select>
                              </div>
                              <div>
                                <label className="text-xs text-muted-foreground">Est. Cost</label>
                                <select
                                  value={suggestion.estimatedCost}
                                  onChange={(e) => updateSuggestion(suggestion.id, { estimatedCost: e.target.value })}
                                  className="w-full p-1 rounded-md border border-input bg-background text-xs"
                                >
                                  <option value="High">High</option>
                                  <option value="Medium">Medium</option>
                                  <option value="Low">Low</option>
                                </select>
                              </div>
                              <div>
                                <label className="text-xs text-muted-foreground">Timeframe</label>
                                <input
                                  type="text"
                                  value={suggestion.timeframe}
                                  onChange={(e) => updateSuggestion(suggestion.id, { timeframe: e.target.value })}
                                  className="w-full p-1 rounded-md border border-input bg-background text-xs"
                                  placeholder="e.g. 1-2 months"
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
                                  Priority:
                                </span>
                                <span className="ml-1">{suggestion.priority}</span>
                              </span>
                              <span className="text-xs inline-flex items-center">
                                <span className="font-medium">Est. Cost:</span>
                                <span className="ml-1">{suggestion.estimatedCost}</span>
                              </span>
                              <span className="text-xs inline-flex items-center">
                                <span className="font-medium">Timeframe:</span>
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
          <h2 className="font-medium">Conclusion</h2>
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
            <p className="text-sm text-muted-foreground">Prepared by:</p>
            <p className="font-medium">{caseData.assignedEmployee.name}</p>
            <p className="text-sm text-muted-foreground">{caseData.assignedEmployee.position}</p>
            <p className="text-sm text-muted-foreground">{new Date(reportData.date).toLocaleDateString()}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

