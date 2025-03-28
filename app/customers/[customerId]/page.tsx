"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { MapPin, Building, Phone, Mail, Globe, Briefcase } from "lucide-react"
import { getCustomerById, getCustomerLocations, getCasesByCustomer } from "@/lib/data"

export default function CustomerDetail() {
  const params = useParams()
  const customerId = Number(params.customerId)

  const [customer, setCustomer] = useState<any>(null)
  const [locations, setLocations] = useState<any[]>([])
  const [cases, setCases] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // In a real app, this would be an API call
    const customerData = getCustomerById(customerId)
    const locationData = getCustomerLocations(customerId)
    const caseData = getCasesByCustomer(customerId)

    setCustomer(customerData)
    setLocations(locationData)
    setCases(caseData)
    setIsLoading(false)
  }, [customerId])

  if (isLoading) {
    return <div className="p-8">Kundendaten werden geladen...</div>
  }

  if (!customer) {
    return <div className="p-8">Kunde nicht gefunden</div>
  }

  // Function to translate status
  const translateStatus = (status: string) => {
    switch (status) {
      case "Open":
        return "Offen"
      case "In Progress":
        return "In Bearbeitung"
      case "Closed":
        return "Abgeschlossen"
      default:
        return status
    }
  }

  return (
    <div className="space-y-6">
      <div className="bg-card p-6 rounded-lg shadow">
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold flex items-center">
              <Building className="mr-2 h-6 w-6" />
              {customer.name}
            </h1>
            <p className="text-muted-foreground mt-1">{customer.industry}</p>
          </div>

          <div className="mt-4 md:mt-0 space-y-1">
            <div className="flex items-center text-sm">
              <Phone className="h-4 w-4 mr-2" />
              <span>{customer.phone}</span>
            </div>
            <div className="flex items-center text-sm">
              <Mail className="h-4 w-4 mr-2" />
              <span>{customer.email}</span>
            </div>
            <div className="flex items-center text-sm">
              <Globe className="h-4 w-4 mr-2" />
              <span>{customer.website}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-card p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <MapPin className="mr-2 h-5 w-5" />
              Standorte ({locations.length})
            </h2>

            <div className="space-y-3">
              {locations.map((location) => (
                <Link
                  key={location.id}
                  href={`/customers/${customerId}/locations/${location.id}`}
                  className="block p-4 bg-background rounded-md hover:bg-muted transition-colors"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">{location.name}</h3>
                      <p className="text-sm text-muted-foreground">{location.address}</p>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {cases.filter((c) => c.locationId === location.id).length} Fälle
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-card p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Briefcase className="mr-2 h-5 w-5" />
              Aktuelle Fälle
            </h2>

            <div className="space-y-3">
              {cases.slice(0, 5).map((caseItem) => (
                <Link
                  key={caseItem.id}
                  href={`/cases/${caseItem.id}/full-view`}
                  className="block p-3 bg-background rounded-md hover:bg-muted transition-colors"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">{caseItem.title}</h3>
                      <p className="text-xs text-muted-foreground">
                        {new Date(caseItem.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <span
                      className={`status-pill ${
                        caseItem.status === "Open" || caseItem.status === "Offen"
                          ? "status-pill-open"
                          : caseItem.status === "In Progress" || caseItem.status === "In Bearbeitung"
                            ? "status-pill-in-progress"
                            : "status-pill-closed"
                      }`}
                    >
                      {translateStatus(caseItem.status)}
                    </span>
                  </div>
                </Link>
              ))}

              {cases.length > 5 && (
                <Link
                  href={`/cases?customerId=${customerId}`}
                  className="block text-center text-sm text-primary hover:underline"
                >
                  Alle {cases.length} Fälle anzeigen
                </Link>
              )}

              {cases.length === 0 && (
                <p className="text-muted-foreground text-sm">Keine Fälle für diesen Kunden gefunden.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

