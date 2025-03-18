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
import AustriaMap from "./components/AustriaMap"
import Link from "next/link"

export default function LocationsPage() {
  const [selectedCustomerId, setSelectedCustomerId] = useState<number | null>(null)
  const [selectedLocationId, setSelectedLocationId] = useState<string | null>(null)
  const [customerLocations, setCustomerLocations] = useState<any[]>([])
  const [locationCases, setLocationCases] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState("")

  // Update customer locations when customer changes
  useEffect(() => {
    if (selectedCustomerId) {
      const locations = getCustomerLocations(selectedCustomerId)
      setCustomerLocations(locations)

      // Reset selected location if it doesn't belong to the new customer
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

  // Update location cases when location changes
  useEffect(() => {
    if (selectedLocationId) {
      const cases = getCasesByLocation(selectedLocationId)
      setLocationCases(cases)
    } else {
      setLocationCases([])
    }
  }, [selectedLocationId])

  // Filter cases by search term
  const filteredCases = locationCases.filter((caseItem) => {
    if (!searchTerm) return true
    return caseItem.title.toLowerCase().includes(searchTerm.toLowerCase())
  })

  // Handle location selection
  const handleLocationSelect = (locationId: string | null) => {
    setSelectedLocationId(locationId)
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Locations</h1>

      <div className="bg-card p-6 rounded-custom shadow">
        <div className="mb-6">
          <label htmlFor="customerSelect" className="block text-sm font-medium mb-2">
            Select Customer
          </label>
          <select
            id="customerSelect"
            value={selectedCustomerId || ""}
            onChange={(e) => setSelectedCustomerId(e.target.value ? Number(e.target.value) : null)}
            className="w-full md:w-1/3 p-2 rounded-custom border border-input bg-background"
          >
            <option value="">All Customers</option>
            {customers.map((customer) => (
              <option key={customer.id} value={customer.id}>
                {customer.name}
              </option>
            ))}
          </select>
        </div>

        <div className="h-[500px] bg-background rounded-custom overflow-hidden mb-6">
          <AustriaMap
            locations={customerLocations.length > 0 ? customerLocations : locations}
            selectedLocationId={selectedLocationId}
            onLocationSelect={handleLocationSelect}
            highlightAll={!selectedCustomerId}
          />
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
                    <span className="text-muted-foreground">Customer: </span>
                    <Link href={`/customers/${selectedCustomerId}`} className="text-primary hover:underline">
                      {getCustomerById(selectedCustomerId)?.name}
                    </Link>
                  </p>
                )}
              </div>
              <div className="mt-2 md:mt-0 flex items-center gap-2">
                <button
                  onClick={() => setSelectedLocationId(null)}
                  className="px-3 py-1 bg-secondary text-secondary-foreground rounded-custom hover:bg-secondary/90 transition-colors flex items-center"
                >
                  <X className="mr-1 h-4 w-4" />
                  Deselect
                </button>
                <Link
                  href={`/customers/${selectedCustomerId || getLocationById(selectedLocationId)?.customerId}/locations/${selectedLocationId}`}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-custom hover:bg-primary/90 transition-colors"
                >
                  View Details
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
              Cases for {getLocationById(selectedLocationId)?.name}
            </h2>
            <div className="mt-2 md:mt-0 relative w-full md:w-1/3">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search cases..."
                className="w-full p-2 pl-8 rounded-custom border border-input bg-background"
              />
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            </div>
          </div>

          {filteredCases.length === 0 ? (
            <div className="text-center py-8 bg-background rounded-custom">
              <p className="text-muted-foreground">No cases found for this location.</p>
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
                        caseItem.status === "Open"
                          ? "status-pill-open"
                          : caseItem.status === "In Progress"
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

