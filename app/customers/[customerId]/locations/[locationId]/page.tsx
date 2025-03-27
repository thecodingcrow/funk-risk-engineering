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
    return <div className="p-8">Loading location data...</div>
  }

  if (!customer || !location) {
    return <div className="p-8">Location not found</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center mb-4">
        <Link href={`/customers/${customerId}`} className="flex items-center text-primary hover:underline">
          <ArrowLeft className="mr-1 h-4 w-4" />
          Back to {customer.name}
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
            Cases ({cases.length})
          </h2>

          <Link
            href={`/cases/new?customerId=${customerId}&locationId=${locationId}`}
            className="flex items-center px-3 py-1 text-sm bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
          >
            <Plus className="mr-1 h-4 w-4" />
            New Case
          </Link>
        </div>

        {cases.length === 0 ? (
          <div className="p-4 bg-background rounded-md text-center">
            <p className="text-muted-foreground">No cases found for this location.</p>
            <p className="text-sm mt-2">Click the "New Case" button to create a case for this location.</p>
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
                      Created: {new Date(caseItem.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      caseItem.status === "Open"
                        ? "bg-blue-500 text-white"
                        : caseItem.status === "In Progress"
                          ? "bg-yellow-500 text-black"
                          : "bg-green-500 text-white"
                    }`}
                  >
                    {caseItem.status}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      <div className="bg-card p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Location Details</h2>

        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Address</h3>
            <p>{location.address}</p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Customer</h3>
            <p>{customer.name}</p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Contact</h3>
            <p>{customer.phone}</p>
            <p>{customer.email}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

