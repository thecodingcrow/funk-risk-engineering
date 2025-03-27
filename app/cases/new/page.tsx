"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { customers, getCustomerLocations } from "@/lib/data"
import {
  ArrowLeft,
  Building,
  Briefcase,
  AlertTriangle,
  ChevronRight,
  ChevronLeft,
  Plus,
  Trash2,
  FileText,
  CheckCircle,
} from "lucide-react"

export default function CreateCase() {
  const router = useRouter()
  const searchParams = useSearchParams()

  // Get initial values from query params if available
  const initialCustomerId = searchParams.get("customerId") ? Number(searchParams.get("customerId")) : 0
  const initialLocationId = searchParams.get("locationId") || ""

  // Form state
  const [currentStep, setCurrentStep] = useState(1)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [customerId, setCustomerId] = useState(initialCustomerId)
  const [locationId, setLocationId] = useState(initialLocationId)
  const [caseType, setCaseType] = useState("Risk Assessment")
  const [priority, setPriority] = useState("Medium")
  const [dueDate, setDueDate] = useState("")
  const [customerLocations, setCustomerLocations] = useState<any[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({})

  // Risk assessment state
  const [risks, setRisks] = useState<any[]>([
    {
      id: "risk-1",
      title: "",
      description: "",
      severity: "Medium",
      impactAreas: "",
      potentialConsequences: "",
      recommendations: [
        {
          id: "rec-1-1",
          description: "",
          priority: "Medium",
          estimatedCost: "Medium",
          timeframe: "1-3 months",
        },
      ],
    },
  ])

  // Update available locations when customer changes
  useEffect(() => {
    if (customerId) {
      const locations = getCustomerLocations(customerId)
      setCustomerLocations(locations)

      // If current location doesn't belong to the selected customer, reset it
      if (locationId && !locations.some((loc) => loc.id === locationId)) {
        setLocationId("")
      }
    } else {
      setCustomerLocations([])
      setLocationId("")
    }
  }, [customerId, locationId])

  const validateStep1 = () => {
    const errors: { [key: string]: string } = {}

    if (!customerId) errors.customerId = "Please select a customer"
    if (!locationId) errors.locationId = "Please select a location"
    if (!title.trim()) errors.title = "Please enter a case title"
    if (!description.trim()) errors.description = "Please enter a case description"
    if (!dueDate) errors.dueDate = "Please select a due date"

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const validateStep2 = () => {
    // Check if at least one risk is properly filled out
    if (risks.length === 0) {
      alert("Please add at least one risk assessment")
      return false
    }

    // Check if all risks have titles and descriptions
    for (const risk of risks) {
      if (!risk.title.trim() || !risk.description.trim()) {
        alert("Please fill out all risk titles and descriptions")
        return false
      }

      // Check if each risk has at least one recommendation
      if (risk.recommendations.length === 0) {
        alert(`Please add at least one recommendation for risk "${risk.title}"`)
        return false
      }

      // Check if all recommendations have descriptions
      for (const rec of risk.recommendations) {
        if (!rec.description.trim()) {
          alert(`Please fill out all recommendation descriptions for risk "${risk.title}"`)
          return false
        }
      }
    }

    return true
  }

  const handleNextStep = () => {
    if (currentStep === 1) {
      if (validateStep1()) {
        setCurrentStep(2)
        window.scrollTo(0, 0)
      }
    }
  }

  const handlePrevStep = () => {
    setCurrentStep(1)
    window.scrollTo(0, 0)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (currentStep === 1) {
      handleNextStep()
      return
    }

    if (!validateStep2()) {
      return
    }

    setIsSubmitting(true)

    // Format the risks data for submission
    const formattedRisks = risks.map((risk) => ({
      ...risk,
      impactAreas: risk.impactAreas
        .split(",")
        .map((area: string) => area.trim())
        .filter(Boolean),
      recommendations: risk.recommendations,
    }))

    // In a real app, this would be an API call to create the case
    console.log("Creating case:", {
      title,
      description,
      customerId,
      locationId,
      caseType,
      priority,
      dueDate,
      status: "Open",
      createdAt: new Date().toISOString(),
      riskAssessments: formattedRisks,
    })

    // Simulate API delay
    setTimeout(() => {
      // Navigate to cases list
      router.push("/cases")
    }, 1000)
  }

  const addRisk = () => {
    const newRiskId = `risk-${risks.length + 1}-${Date.now()}`
    setRisks([
      ...risks,
      {
        id: newRiskId,
        title: "",
        description: "",
        severity: "Medium",
        impactAreas: "",
        potentialConsequences: "",
        recommendations: [
          {
            id: `rec-${risks.length + 1}-1-${Date.now()}`,
            description: "",
            priority: "Medium",
            estimatedCost: "Medium",
            timeframe: "1-3 months",
          },
        ],
      },
    ])
  }

  const removeRisk = (riskId: string) => {
    if (risks.length <= 1) {
      alert("You must have at least one risk assessment")
      return
    }
    setRisks(risks.filter((risk) => risk.id !== riskId))
  }

  const updateRisk = (riskId: string, field: string, value: string) => {
    setRisks(risks.map((risk) => (risk.id === riskId ? { ...risk, [field]: value } : risk)))
  }

  const addRecommendation = (riskId: string) => {
    setRisks(
      risks.map((risk) => {
        if (risk.id === riskId) {
          const newRecId = `rec-${risk.recommendations.length + 1}-${Date.now()}`
          return {
            ...risk,
            recommendations: [
              ...risk.recommendations,
              {
                id: newRecId,
                description: "",
                priority: "Medium",
                estimatedCost: "Medium",
                timeframe: "1-3 months",
              },
            ],
          }
        }
        return risk
      }),
    )
  }

  const removeRecommendation = (riskId: string, recId: string) => {
    setRisks(
      risks.map((risk) => {
        if (risk.id === riskId) {
          if (risk.recommendations.length <= 1) {
            alert("Each risk must have at least one recommendation")
            return risk
          }
          return {
            ...risk,
            recommendations: risk.recommendations.filter((rec) => rec.id !== recId),
          }
        }
        return risk
      }),
    )
  }

  const updateRecommendation = (riskId: string, recId: string, field: string, value: string) => {
    setRisks(
      risks.map((risk) => {
        if (risk.id === riskId) {
          return {
            ...risk,
            recommendations: risk.recommendations.map((rec) => (rec.id === recId ? { ...rec, [field]: value } : rec)),
          }
        }
        return risk
      }),
    )
  }

  const selectedCustomer = customers.find((c) => c.id === customerId)

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6 flex items-center">
        <Link href="/cases" className="inline-flex items-center text-sm text-primary hover:underline">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Cases
        </Link>
      </div>

      <div className="bg-primary/5 border border-primary/20 rounded-xl p-6 shadow-md mb-6">
        <h1 className="text-2xl font-bold flex items-center">
          <Briefcase className="mr-2 h-6 w-6 text-primary" />
          Create New Case
        </h1>
        <p className="text-muted-foreground mt-1">Create a new case for a customer location</p>
      </div>

      {/* Step indicator */}
      <div className="mb-6">
        <div className="flex items-center">
          <div
            className={`flex items-center justify-center w-8 h-8 rounded-full ${currentStep === 1 ? "bg-primary text-primary-foreground" : "bg-primary text-primary-foreground"}`}
          >
            1
          </div>
          <div className={`flex-1 h-1 mx-2 ${currentStep === 2 ? "bg-primary" : "bg-muted"}`}></div>
          <div
            className={`flex items-center justify-center w-8 h-8 rounded-full ${currentStep === 2 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}
          >
            2
          </div>
        </div>
        <div className="flex justify-between mt-2 text-sm">
          <div className={currentStep === 1 ? "font-medium" : "text-muted-foreground"}>Case Details</div>
          <div className={currentStep === 2 ? "font-medium" : "text-muted-foreground"}>Risk Assessment</div>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {currentStep === 1 && (
          <div className="space-y-6 animate-in">
            <div className="bg-background rounded-xl shadow-md border border-border overflow-hidden">
              <div className="bg-muted/30 px-4 py-3 border-b border-border">
                <h2 className="font-medium flex items-center">
                  <Building className="h-5 w-5 mr-2 text-muted-foreground" />
                  Customer & Location
                </h2>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label htmlFor="customerId" className="block text-sm font-medium mb-2">
                    Customer <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="customerId"
                    value={customerId || ""}
                    onChange={(e) => setCustomerId(Number(e.target.value))}
                    className={`w-full p-2 rounded-md border ${formErrors.customerId ? "border-red-500" : "border-input"} bg-background`}
                    required
                  >
                    <option value="">Select a customer</option>
                    {customers.map((customer) => (
                      <option key={customer.id} value={customer.id}>
                        {customer.name} - {customer.industry}
                      </option>
                    ))}
                  </select>
                  {formErrors.customerId && <p className="text-red-500 text-sm mt-1">{formErrors.customerId}</p>}
                </div>

                <div>
                  <label htmlFor="locationId" className="block text-sm font-medium mb-2">
                    Location <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="locationId"
                    value={locationId}
                    onChange={(e) => setLocationId(e.target.value)}
                    className={`w-full p-2 rounded-md border ${formErrors.locationId ? "border-red-500" : "border-input"} bg-background`}
                    required
                    disabled={!customerId}
                  >
                    <option value="">Select a location</option>
                    {customerLocations.map((location) => (
                      <option key={location.id} value={location.id}>
                        {location.name} - {location.address}
                      </option>
                    ))}
                  </select>
                  {formErrors.locationId ? (
                    <p className="text-red-500 text-sm mt-1">{formErrors.locationId}</p>
                  ) : !customerId ? (
                    <p className="text-sm text-muted-foreground mt-1">Please select a customer first</p>
                  ) : null}
                </div>

                {selectedCustomer && (
                  <div className="bg-muted/30 p-3 rounded-md mt-2">
                    <p className="text-sm">
                      <span className="font-medium">Selected Customer:</span> {selectedCustomer.name}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Contact:</span> {selectedCustomer.email} | {selectedCustomer.phone}
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-background rounded-xl shadow-md border border-border overflow-hidden">
              <div className="bg-muted/30 px-4 py-3 border-b border-border">
                <h2 className="font-medium flex items-center">
                  <Briefcase className="h-5 w-5 mr-2 text-muted-foreground" />
                  Case Details
                </h2>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium mb-2">
                    Case Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className={`w-full p-2 rounded-md border ${formErrors.title ? "border-red-500" : "border-input"} bg-background`}
                    placeholder="e.g. Annual Safety Inspection"
                    required
                  />
                  {formErrors.title && <p className="text-red-500 text-sm mt-1">{formErrors.title}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label htmlFor="caseType" className="block text-sm font-medium mb-2">
                      Case Type
                    </label>
                    <select
                      id="caseType"
                      value={caseType}
                      onChange={(e) => setCaseType(e.target.value)}
                      className="w-full p-2 rounded-md border border-input bg-background"
                    >
                      <option value="Risk Assessment">Risk Assessment</option>
                      <option value="Safety Inspection">Safety Inspection</option>
                      <option value="Compliance Review">Compliance Review</option>
                      <option value="Equipment Maintenance">Equipment Maintenance</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="priority" className="block text-sm font-medium mb-2">
                      Priority
                    </label>
                    <select
                      id="priority"
                      value={priority}
                      onChange={(e) => setPriority(e.target.value)}
                      className="w-full p-2 rounded-md border border-input bg-background"
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="dueDate" className="block text-sm font-medium mb-2">
                      Due Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      id="dueDate"
                      value={dueDate}
                      onChange={(e) => setDueDate(e.target.value)}
                      className={`w-full p-2 rounded-md border ${formErrors.dueDate ? "border-red-500" : "border-input"} bg-background`}
                      required
                    />
                    {formErrors.dueDate && <p className="text-red-500 text-sm mt-1">{formErrors.dueDate}</p>}
                  </div>
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium mb-2">
                    Case Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className={`w-full p-2 rounded-md border ${formErrors.description ? "border-red-500" : "border-input"} bg-background`}
                    rows={4}
                    placeholder="Provide a detailed description of the case..."
                    required
                  ></textarea>
                  {formErrors.description && <p className="text-red-500 text-sm mt-1">{formErrors.description}</p>}
                </div>
              </div>
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-6 animate-in">
            <div className="bg-background rounded-xl shadow-md border border-border overflow-hidden">
              <div className="bg-muted/30 px-4 py-3 border-b border-border flex justify-between items-center">
                <h2 className="font-medium flex items-center">
                  <AlertTriangle className="h-5 w-5 mr-2 text-muted-foreground" />
                  Risk Assessment
                </h2>
                <button
                  type="button"
                  onClick={addRisk}
                  className="px-2 py-1 bg-primary text-primary-foreground rounded-md text-sm flex items-center"
                >
                  <Plus className="h-3 w-3 mr-1" />
                  Add Risk
                </button>
              </div>
              <div className="p-6">
                <div className="mb-4 bg-muted/30 p-4 rounded-md">
                  <h3 className="text-sm font-medium flex items-center mb-2">
                    <FileText className="h-4 w-4 mr-1" />
                    Insurer Report Information
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Based on the insurer's report, add the identified risks and recommendations. Each risk should have
                    at least one recommendation.
                  </p>
                </div>

                <div className="space-y-8">
                  {risks.map((risk, index) => (
                    <div key={risk.id} className="bg-card rounded-lg border border-border overflow-hidden">
                      <div className="bg-muted/30 px-4 py-3 border-b border-border flex justify-between items-center">
                        <h3 className="font-medium">Risk #{index + 1}</h3>
                        <button
                          type="button"
                          onClick={() => removeRisk(risk.id)}
                          className="p-1 text-muted-foreground hover:text-destructive rounded-md"
                          title="Remove risk"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="p-4 space-y-4">
                        <div>
                          <label htmlFor={`risk-title-${risk.id}`} className="block text-sm font-medium mb-2">
                            Risk Title <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            id={`risk-title-${risk.id}`}
                            value={risk.title}
                            onChange={(e) => updateRisk(risk.id, "title", e.target.value)}
                            className="w-full p-2 rounded-md border border-input bg-background"
                            placeholder="e.g. Safety Concerns"
                            required
                          />
                        </div>

                        <div>
                          <label htmlFor={`risk-desc-${risk.id}`} className="block text-sm font-medium mb-2">
                            Risk Description <span className="text-red-500">*</span>
                          </label>
                          <textarea
                            id={`risk-desc-${risk.id}`}
                            value={risk.description}
                            onChange={(e) => updateRisk(risk.id, "description", e.target.value)}
                            className="w-full p-2 rounded-md border border-input bg-background"
                            rows={3}
                            placeholder="Describe the risk in detail..."
                            required
                          ></textarea>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <label htmlFor={`risk-severity-${risk.id}`} className="block text-sm font-medium mb-2">
                              Severity
                            </label>
                            <select
                              id={`risk-severity-${risk.id}`}
                              value={risk.severity}
                              onChange={(e) => updateRisk(risk.id, "severity", e.target.value)}
                              className="w-full p-2 rounded-md border border-input bg-background"
                            >
                              <option value="Low">Low</option>
                              <option value="Medium">Medium</option>
                              <option value="High">High</option>
                            </select>
                          </div>

                          <div className="md:col-span-2">
                            <label htmlFor={`risk-impact-${risk.id}`} className="block text-sm font-medium mb-2">
                              Impact Areas (comma separated)
                            </label>
                            <input
                              type="text"
                              id={`risk-impact-${risk.id}`}
                              value={risk.impactAreas}
                              onChange={(e) => updateRisk(risk.id, "impactAreas", e.target.value)}
                              className="w-full p-2 rounded-md border border-input bg-background"
                              placeholder="e.g. Employee Safety, Regulatory Compliance, Liability"
                            />
                          </div>
                        </div>

                        <div>
                          <label htmlFor={`risk-consequences-${risk.id}`} className="block text-sm font-medium mb-2">
                            Potential Consequences
                          </label>
                          <input
                            type="text"
                            id={`risk-consequences-${risk.id}`}
                            value={risk.potentialConsequences}
                            onChange={(e) => updateRisk(risk.id, "potentialConsequences", e.target.value)}
                            className="w-full p-2 rounded-md border border-input bg-background"
                            placeholder="e.g. Injuries, regulatory fines, potential lawsuits"
                          />
                        </div>

                        {/* Recommendations */}
                        <div className="mt-4">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="text-sm font-medium">Recommendations</h4>
                            <button
                              type="button"
                              onClick={() => addRecommendation(risk.id)}
                              className="px-2 py-1 bg-secondary text-secondary-foreground rounded-md text-xs flex items-center"
                            >
                              <Plus className="h-3 w-3 mr-1" />
                              Add Recommendation
                            </button>
                          </div>

                          <div className="space-y-4">
                            {risk.recommendations.map((rec, recIndex) => (
                              <div key={rec.id} className="bg-background p-3 rounded-md border border-border">
                                <div className="flex justify-between items-start mb-2">
                                  <h5 className="text-sm font-medium">Recommendation #{recIndex + 1}</h5>
                                  <button
                                    type="button"
                                    onClick={() => removeRecommendation(risk.id, rec.id)}
                                    className="p-1 text-muted-foreground hover:text-destructive rounded-md"
                                    title="Remove recommendation"
                                  >
                                    <Trash2 className="h-3 w-3" />
                                  </button>
                                </div>

                                <div className="space-y-3">
                                  <div>
                                    <label htmlFor={`rec-desc-${rec.id}`} className="block text-xs font-medium mb-1">
                                      Description <span className="text-red-500">*</span>
                                    </label>
                                    <textarea
                                      id={`rec-desc-${rec.id}`}
                                      value={rec.description}
                                      onChange={(e) =>
                                        updateRecommendation(risk.id, rec.id, "description", e.target.value)
                                      }
                                      className="w-full p-2 rounded-md border border-input bg-background text-sm"
                                      rows={2}
                                      placeholder="Describe the recommendation..."
                                      required
                                    ></textarea>
                                  </div>

                                  <div className="grid grid-cols-3 gap-2">
                                    <div>
                                      <label
                                        htmlFor={`rec-priority-${rec.id}`}
                                        className="block text-xs font-medium mb-1"
                                      >
                                        Priority
                                      </label>
                                      <select
                                        id={`rec-priority-${rec.id}`}
                                        value={rec.priority}
                                        onChange={(e) =>
                                          updateRecommendation(risk.id, rec.id, "priority", e.target.value)
                                        }
                                        className="w-full p-1 rounded-md border border-input bg-background text-sm"
                                      >
                                        <option value="Low">Low</option>
                                        <option value="Medium">Medium</option>
                                        <option value="High">High</option>
                                      </select>
                                    </div>
                                    <div>
                                      <label htmlFor={`rec-cost-${rec.id}`} className="block text-xs font-medium mb-1">
                                        Est. Cost
                                      </label>
                                      <select
                                        id={`rec-cost-${rec.id}`}
                                        value={rec.estimatedCost}
                                        onChange={(e) =>
                                          updateRecommendation(risk.id, rec.id, "estimatedCost", e.target.value)
                                        }
                                        className="w-full p-1 rounded-md border border-input bg-background text-sm"
                                      >
                                        <option value="Low">Low</option>
                                        <option value="Medium">Medium</option>
                                        <option value="High">High</option>
                                      </select>
                                    </div>
                                    <div>
                                      <label
                                        htmlFor={`rec-timeframe-${rec.id}`}
                                        className="block text-xs font-medium mb-1"
                                      >
                                        Timeframe
                                      </label>
                                      <input
                                        type="text"
                                        id={`rec-timeframe-${rec.id}`}
                                        value={rec.timeframe}
                                        onChange={(e) =>
                                          updateRecommendation(risk.id, rec.id, "timeframe", e.target.value)
                                        }
                                        className="w-full p-1 rounded-md border border-input bg-background text-sm"
                                        placeholder="e.g. 1-3 months"
                                      />
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between mt-6">
          {currentStep === 1 ? (
            <Link
              href="/cases"
              className="px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/90 transition-colors"
            >
              Cancel
            </Link>
          ) : (
            <button
              type="button"
              onClick={handlePrevStep}
              className="px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/90 transition-colors flex items-center"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back
            </button>
          )}

          {currentStep === 1 ? (
            <button
              type="button"
              onClick={handleNextStep}
              className="px-6 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors flex items-center"
            >
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </button>
          ) : (
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors disabled:opacity-70 flex items-center"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                  Creating...
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Create Case
                </>
              )}
            </button>
          )}
        </div>
      </form>
    </div>
  )
}

