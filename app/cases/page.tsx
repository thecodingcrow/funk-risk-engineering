"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { MapPin, Building, Search, X, Plus, Filter } from "lucide-react"
import { cases, customers, locations, getCustomerById, getLocationById } from "@/lib/data"

export default function Cases() {
  const searchParams = useSearchParams()
  const initialCustomerId = searchParams.get("customerId") ? Number(searchParams.get("customerId")) : null
  const initialLocationId = searchParams.get("locationId") || null

  const [filteredCases, setFilteredCases] = useState(cases)
  const [customerFilter, setCustomerFilter] = useState<number | null>(initialCustomerId)
  const [locationFilter, setLocationFilter] = useState<string | null>(initialLocationId)
  const [statusFilter, setStatusFilter] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [showFilters, setShowFilters] = useState(false)

  // Filter anwenden
  useEffect(() => {
    let result = [...cases]

    // Nach Kunde filtern
    if (customerFilter) {
      result = result.filter((caseItem) => caseItem.customerId === customerFilter)
    }

    // Nach Standort filtern
    if (locationFilter) {
      result = result.filter((caseItem) => caseItem.locationId === locationFilter)
    }

    // Nach Status filtern
    if (statusFilter) {
      result = result.filter((caseItem) => caseItem.status === statusFilter)
    }

    // Nach Suchbegriff filtern
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      result = result.filter(
        (caseItem) =>
          caseItem.title.toLowerCase().includes(term) ||
          getCustomerById(caseItem.customerId)?.name.toLowerCase().includes(term) ||
          getLocationById(caseItem.locationId)?.name.toLowerCase().includes(term),
      )
    }

    setFilteredCases(result)
  }, [customerFilter, locationFilter, statusFilter, searchTerm])

  // Alle Filter löschen
  const clearFilters = () => {
    setCustomerFilter(null)
    setLocationFilter(null)
    setStatusFilter(null)
    setSearchTerm("")
  }

  // Status-Farbe abrufen
  const getStatusClass = (status: string) => {
    switch (status) {
      case "Offen":
        return "status-pill-open"
      case "In Bearbeitung":
        return "status-pill-in-progress"
      case "Abgeschlossen":
        return "status-pill-closed"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between">
        <h1 className="text-3xl font-bold">Fälle</h1>

        <Link
          href="/cases/new"
          className="mt-2 sm:mt-0 px-4 py-2 bg-primary text-primary-foreground rounded-custom hover:bg-primary/90 transition-colors flex items-center"
        >
          <Plus className="h-4 w-4 mr-1" />
          Neuen Fall erstellen
        </Link>
      </div>

      <div className="bg-card p-4 rounded-custom shadow-md border border-border/50">
        <div className="flex flex-col md:flex-row md:items-end gap-4">
          <div className="flex-1">
            <label htmlFor="search" className="block text-sm font-medium mb-1">
              Suche
            </label>
            <div className="relative">
              <input
                type="text"
                id="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Fälle durchsuchen..."
                className="w-full p-2 pl-8 rounded-custom border border-input bg-background"
              />
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            </div>
          </div>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-custom hover:bg-primary/90 transition-colors flex items-center"
          >
            <Filter className="h-4 w-4 mr-1" />
            {showFilters ? "Filter ausblenden" : "Filter anzeigen"}
          </button>

          {(customerFilter || locationFilter || statusFilter || searchTerm) && (
            <button
              onClick={clearFilters}
              className="px-4 py-2 bg-muted text-muted-foreground rounded-custom hover:bg-muted/90 transition-colors"
            >
              <X className="h-4 w-4 mr-1 inline-block" />
              Filter löschen
            </button>
          )}
        </div>

        {showFilters && (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="customerFilter" className="block text-sm font-medium mb-1">
                Kunde
              </label>
              <select
                id="customerFilter"
                value={customerFilter || ""}
                onChange={(e) => setCustomerFilter(e.target.value ? Number(e.target.value) : null)}
                className="w-full p-2 rounded-custom border border-input bg-background"
              >
                <option value="">Alle Kunden</option>
                {customers.map((customer) => (
                  <option key={customer.id} value={customer.id}>
                    {customer.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="locationFilter" className="block text-sm font-medium mb-1">
                Standort
              </label>
              <select
                id="locationFilter"
                value={locationFilter || ""}
                onChange={(e) => setLocationFilter(e.target.value || null)}
                className="w-full p-2 rounded-custom border border-input bg-background"
              >
                <option value="">Alle Standorte</option>
                {locations.map((location) => (
                  <option key={location.id} value={location.id}>
                    {location.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="statusFilter" className="block text-sm font-medium mb-1">
                Status
              </label>
              <select
                id="statusFilter"
                value={statusFilter || ""}
                onChange={(e) => setStatusFilter(e.target.value || null)}
                className="w-full p-2 rounded-custom border border-input bg-background"
              >
                <option value="">Alle Status</option>
                <option value="Offen">Offen</option>
                <option value="In Bearbeitung">In Bearbeitung</option>
                <option value="Abgeschlossen">Abgeschlossen</option>
              </select>
            </div>
          </div>
        )}

        {(customerFilter || locationFilter || statusFilter || searchTerm) && (
          <div className="mt-2 text-sm">
            <span className="text-muted-foreground">Zeige </span>
            <span className="font-medium">{filteredCases.length}</span>
            <span className="text-muted-foreground"> von </span>
            <span className="font-medium">{cases.length}</span>
            <span className="text-muted-foreground"> Fällen</span>
          </div>
        )}
      </div>

      {filteredCases.length === 0 ? (
        <div className="bg-card p-8 rounded-custom shadow-md text-center border border-border/50">
          <p className="text-muted-foreground">Keine Fälle gefunden, die Ihren Filtern entsprechen.</p>
          <button onClick={clearFilters} className="mt-2 text-primary hover:underline">
            Filter löschen und alle Fälle anzeigen
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredCases.map((caseItem) => {
            const customer = getCustomerById(caseItem.customerId)
            const location = getLocationById(caseItem.locationId)

            return (
              <Link
                key={caseItem.id}
                href={`/cases/${caseItem.id}/full-view`}
                className="block bg-card p-4 rounded-custom shadow-md hover:shadow-lg transition-shadow border border-border/50 hover:border-primary/30"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                  <div className="flex-grow">
                    <h2 className="font-medium">{caseItem.title}</h2>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mt-1 text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <Building className="h-4 w-4 mr-1" />
                        <span>{customer?.name}</span>
                      </div>
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-1" />
                        <span>{location?.name}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-2 sm:mt-0 flex flex-col sm:flex-row items-end sm:items-center gap-2">
                    <div className={`status-pill ${getStatusClass(caseItem.status)}`}>{caseItem.status}</div>
                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                      {new Date(caseItem.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}

