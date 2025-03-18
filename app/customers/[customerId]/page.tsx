"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { MapPin, Building, Phone, Mail, Globe, Briefcase } from "lucide-react"
import { getCustomerById, getCustomerLocations, getCasesByCustomer } from "@/lib/data"
import CustomerMap from "./components/CustomerMap"

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
    return <div className="p-8">Loading customer data...</div>
  }

  if (!customer) {
    return <div className="p-8">Customer not found</div>
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
              Locations ({locations.length})
            </h2>

            <div className="h-[400px] rounded-md overflow-hidden mb-6">
              <CustomerMap locations={locations} />
            </div>

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
                      {cases.filter((c) => c.locationId === location.id).length} cases
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
              Recent Cases
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

              {cases.length > 5 && (
                <Link
                  href={`/cases?customerId=${customerId}`}
                  className="block text-center text-sm text-primary hover:underline"
                >
                  View all {cases.length} cases
                </Link>
              )}

              {cases.length === 0 && <p className="text-muted-foreground text-sm">No cases found for this customer.</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

