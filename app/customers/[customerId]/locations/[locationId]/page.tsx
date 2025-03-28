"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { MapPin, Building, ArrowLeft, Briefcase, Plus } from "lucide-react"
import { getCustomerById, getLocationById, getCasesByLocation } from "@/lib/data"

export default function LocationDetail() {
  const params = useParams()
  const customerId = Number(params.customerId)
  const locationId = params.locationId as string

  const [customer, setCustomer] = useState<any>(null)
  const [location, setLocation] = useState<any>(null)
  const [cases, setCases] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // In a real app, this would be an API call
    const customerData = getCustomerById(customerId)
    const locationData = getLocationById(locationId)
    const caseData = getCasesByLocation(locationId)

    setCustomer(customerData)
    setLocation(locationData)
    setCases(caseData)
    setIsLoading(false)
  }, [customerId, locationId])

  if (isLoading) {
    return <div className="p-8">Standortdaten werden geladen...</div>
  }

  if (!customer || !location) {
    return <div className="p-8">Standort nicht gefunden</div>
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

  // Function to get status pill class
  const getStatusClass = (status: string) => {
    switch (status) {
      case "Open":
      case "Offen":
        return "bg-primary text-primary-foreground"
      case "In Progress":
      case "In Bearbeitung":
        return "bg-accent text-accent-foreground"
      case "Closed":
      case "Abgeschlossen":
        return "bg-success text-success-foreground"
      default:
        return "bg-primary text-primary-foreground"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center mb-4">
        <Link href={`/customers/${customerId}`} className="flex items-center text-primary hover:underline">
          <ArrowLeft className="mr-1 h-4 w-4" />
          Zurück zu {customer.name}
        </Link>
      </div>

      <div className="bg-card p-6 rounded-lg shadow">
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold flex items-center">
              <MapPin className="mr-2 h-6 w-6" />
              {location.name}
            </h1>
            <p className="text-muted-foreground mt-1">{location.address}</p>
          </div>

          <div className="mt-4 md:mt-0">
            <div className="flex items-center text-sm">
              <Building className="h-4 w-4 mr-2" />
              <span>{customer.name}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-card p-6 rounded-lg shadow">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold flex items-center">
            <Briefcase className="mr-2 h-5 w-5" />
            Fälle ({cases.length})
          </h2>

          <Link
            href={`/cases/new?customerId=${customerId}&locationId=${locationId}`}
            className="flex items-center px-3 py-1 text-sm bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
          >
            <Plus className="mr-1 h-4 w-4" />
            Neuen Fall erstellen
          </Link>
        </div>

        {cases.length === 0 ? (
          <div className="p-4 bg-background rounded-md text-center">
            <p className="text-muted-foreground">Keine Fälle für diesen Standort gefunden.</p>
            <p className="text-sm mt-2">
              Klicken Sie auf "Neuen Fall erstellen", um einen Fall für diesen Standort zu erstellen.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {cases.map((caseItem) => (
              <Link
                key={caseItem.id}
                href={`/cases/${caseItem.id}/full-view`}
                className="block p-4 bg-background rounded-md hover:bg-muted transition-colors"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">{caseItem.title}</h3>
                    <p className="text-xs text-muted-foreground">
                      Erstellt: {new Date(caseItem.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full ${getStatusClass(caseItem.status)}`}>
                    {translateStatus(caseItem.status)}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      <div className="bg-card p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Standortdetails</h2>

        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Adresse</h3>
            <p>{location.address}</p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Kunde</h3>
            <p>{customer.name}</p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Kontakt</h3>
            <p>{customer.phone}</p>
            <p>{customer.email}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

