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

  // Apply filters
  useEffect(() => {
    let result = [...cases]

    // Filter by customer
    if (customerFilter) {
      result = result.filter((caseItem) => caseItem.customerId === customerFilter)
    }

    // Filter by location
    if (locationFilter) {
      result = result.filter((caseItem) => caseItem.locationId === locationFilter)
    }

    // Filter by status
    if (statusFilter) {
      result = result.filter((caseItem) => caseItem.status === statusFilter)
    }

    // Filter by search term
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

  // Clear all filters
  const clearFilters = () => {
    setCustomerFilter(null)
    setLocationFilter(null)
    setStatusFilter(null)
    setSearchTerm("")
  }

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Open":
        return "bg-blue-500 text-white"
      case "In Progress":
        return "bg-yellow-500 text-black"
      case "Closed":
        return "bg-green-500 text-white"
      default:
        return "bg-gray-500 text-white"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between">
        <h1 className="text-3xl font-bold">Cases</h1>

        <Link
          href="/cases/new"
          className="mt-2 sm:mt-0 px-4 py-2 bg-primary text-primary-foreground rounded-custom hover:bg-primary/90 transition-colors flex items-center"
        >
          <Plus className="h-4 w-4 mr-1" />
          Create New Case
        </Link>
      </div>

      <div className="bg-card p-4 rounded-custom shadow">
        <div className="flex flex-col md:flex-row md:items-end gap-4">
          <div className="flex-1">
            <label htmlFor="search" className="block text-sm font-medium mb-1">
              Search
            </label>
            <div className="relative">
              <input
                type="text"
                id="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search cases..."
                className="w-full p-2 pl-8 rounded-custom border border-input bg-background"
              />
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            </div>
          </div>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className="px-4 py-2 bg-secondary text-secondary-foreground rounded-custom hover:bg-secondary/90 transition-colors flex items-center"
          >
            <Filter className="h-4 w-4 mr-1" />
            {showFilters ? "Hide Filters" : "Show Filters"}
          </button>

          {(customerFilter || locationFilter || statusFilter || searchTerm) && (
            <button
              onClick={clearFilters}
              className="px-4 py-2 bg-secondary text-secondary-foreground rounded-custom hover:bg-secondary/90 transition-colors"
            >
              <X className="h-4 w-4 mr-1 inline-block" />
              Clear Filters
            </button>
          )}
        </div>

        {showFilters && (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="customerFilter" className="block text-sm font-medium mb-1">
                Customer
              </label>
              <select
                id="customerFilter"
                value={customerFilter || ""}
                onChange={(e) => setCustomerFilter(e.target.value ? Number(e.target.value) : null)}
                className="w-full p-2 rounded-custom border border-input bg-background"
              >
                <option value="">All Customers</option>
                {customers.map((customer) => (
                  <option key={customer.id} value={customer.id}>
                    {customer.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="locationFilter" className="block text-sm font-medium mb-1">
                Location
              </label>
              <select
                id="locationFilter"
                value={locationFilter || ""}
                onChange={(e) => setLocationFilter(e.target.value || null)}
                className="w-full p-2 rounded-custom border border-input bg-background"
              >
                <option value="">All Locations</option>
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
                <option value="">All Statuses</option>
                <option value="Open">Open</option>
                <option value="In Progress">In Progress</option>
                <option value="Closed">Closed</option>
              </select>
            </div>
          </div>
        )}

        {(customerFilter || locationFilter || statusFilter || searchTerm) && (
          <div className="mt-2 text-sm">
            <span className="text-muted-foreground">Showing </span>
            <span className="font-medium">{filteredCases.length}</span>
            <span className="text-muted-foreground"> of </span>
            <span className="font-medium">{cases.length}</span>
            <span className="text-muted-foreground"> cases</span>
          </div>
        )}
      </div>

      {filteredCases.length === 0 ? (
        <div className="bg-card p-8 rounded-custom shadow text-center">
          <p className="text-muted-foreground">No cases found matching your filters.</p>
          <button onClick={clearFilters} className="mt-2 text-primary hover:underline">
            Clear filters and show all cases
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
                className="block bg-card p-4 rounded-custom shadow hover:shadow-md transition-shadow border border-border/50 hover:border-border"
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
                    <div className={`px-3 py-1 text-xs rounded-full font-medium ${getStatusColor(caseItem.status)}`}>
                      {caseItem.status}
                    </div>
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

