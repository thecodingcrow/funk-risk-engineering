"use client"

import { useState, useEffect } from "react"
import { MapPin, Briefcase, Calendar, Search, X } from "lucide-react"
import {
  customers,
  locations,
  getCustomerById,
  getLocationById,
  getCustomerLocations,
  getCasesByLocation,
} from "@/lib/data"
import Link from "next/link"

export default function LocationsPage() {
  const [selectedCustomerId, setSelectedCustomerId] = useState<number | null>(null)
  const [selectedLocationId, setSelectedLocationId] = useState<string | null>(null)
  const [customerLocations, setCustomerLocations] = useState<any[]>([])
  const [locationCases, setLocationCases] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState("")

  // Kundenstandorte aktualisieren, wenn sich der Kunde ändert
  useEffect(() => {
    if (selectedCustomerId) {
      const locations = getCustomerLocations(selectedCustomerId)
      setCustomerLocations(locations)

      // Ausgewählten Standort zurücksetzen, wenn er nicht zum neuen Kunden gehört
      if (selectedLocationId && !locations.some((loc) => loc.id === selectedLocationId)) {
        setSelectedLocationId(null)
        setLocationCases([])
      }
    } else {
      setCustomerLocations([])
      setSelectedLocationId(null)
      setLocationCases([])
    }
  }, [selectedCustomerId, selectedLocationId])

  // Standortfälle aktualisieren, wenn sich der Standort ändert
  useEffect(() => {
    if (selectedLocationId) {
      const cases = getCasesByLocation(selectedLocationId)
      setLocationCases(cases)
    } else {
      setLocationCases([])
    }
  }, [selectedLocationId])

  // Fälle nach Suchbegriff filtern
  const filteredCases = locationCases.filter((caseItem) => {
    if (!searchTerm) return true
    return caseItem.title.toLowerCase().includes(searchTerm.toLowerCase())
  })

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Standorte</h1>

      <div className="bg-card p-6 rounded-custom shadow">
        <div className="mb-6">
          <label htmlFor="customerSelect" className="block text-sm font-medium mb-2">
            Kunde auswählen
          </label>
          <select
            id="customerSelect"
            value={selectedCustomerId || ""}
            onChange={(e) => setSelectedCustomerId(e.target.value ? Number(e.target.value) : null)}
            className="w-full md:w-1/3 p-2 rounded-custom border border-input bg-background"
          >
            <option value="">Alle Kunden</option>
            {customers.map((customer) => (
              <option key={customer.id} value={customer.id}>
                {customer.name}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-6">
          <label htmlFor="locationSelect" className="block text-sm font-medium mb-2">
            Standort auswählen
          </label>
          <select
            id="locationSelect"
            value={selectedLocationId || ""}
            onChange={(e) => setSelectedLocationId(e.target.value || null)}
            className="w-full md:w-1/3 p-2 rounded-custom border border-input bg-background"
            disabled={!selectedCustomerId && customerLocations.length === 0}
          >
            <option value="">Standort auswählen</option>
            {(customerLocations.length > 0 ? customerLocations : locations).map((location) => (
              <option key={location.id} value={location.id}>
                {location.name} - {location.address}
              </option>
            ))}
          </select>
        </div>

        {selectedLocationId && (
          <div className="bg-background p-4 rounded-custom">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-semibold flex items-center">
                  <MapPin className="mr-2 h-5 w-5" />
                  {getLocationById(selectedLocationId)?.name}
                </h2>
                <p className="text-muted-foreground">{getLocationById(selectedLocationId)?.address}</p>
                {selectedCustomerId && (
                  <p className="text-sm mt-1">
                    <span className="text-muted-foreground">Kunde: </span>
                    <Link href={`/customers/${selectedCustomerId}`} className="text-primary hover:underline">
                      {getCustomerById(selectedCustomerId)?.name}
                    </Link>
                  </p>
                )}
              </div>
              <div className="mt-2 md:mt-0 flex items-center gap-2">
                <button
                  onClick={() => setSelectedLocationId(null)}
                  className="px-3 py-1 bg-primary text-primary-foreground rounded-custom hover:bg-primary/90 transition-colors flex items-center"
                >
                  <X className="mr-1 h-4 w-4" />
                  Abwählen
                </button>
                <Link
                  href={`/customers/${selectedCustomerId || getLocationById(selectedLocationId)?.customerId}/locations/${selectedLocationId}`}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-custom hover:bg-primary/90 transition-colors"
                >
                  Details anzeigen
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>

      {selectedLocationId && (
        <div className="bg-card p-6 rounded-custom shadow">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
            <h2 className="text-xl font-semibold flex items-center">
              <Briefcase className="mr-2 h-5 w-5" />
              Fälle für {getLocationById(selectedLocationId)?.name}
            </h2>
            <div className="mt-2 md:mt-0 relative w-full md:w-1/3">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Fälle durchsuchen..."
                className="w-full p-2 pl-8 rounded-custom border border-input bg-background"
              />
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            </div>
          </div>

          {filteredCases.length === 0 ? (
            <div className="text-center py-8 bg-background rounded-custom">
              <p className="text-muted-foreground">Keine Fälle für diesen Standort gefunden.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredCases.map((caseItem) => (
                <Link
                  key={caseItem.id}
                  href={`/cases/${caseItem.id}/full-view`}
                  className="block bg-background p-4 rounded-custom hover:bg-muted transition-colors"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between">
                    <div>
                      <h3 className="font-medium">{caseItem.title}</h3>
                      <div className="flex items-center mt-1 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4 mr-1" />
                        <span>{new Date(caseItem.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div
                      className={`mt-2 md:mt-0 status-pill ${
                        caseItem.status === "Offen"
                          ? "status-pill-open"
                          : caseItem.status === "In Bearbeitung"
                            ? "status-pill-in-progress"
                            : "status-pill-closed"
                      }`}
                    >
                      {caseItem.status}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

