"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { customers, getCustomerLocations } from "@/lib/data"

export default function CreateCase() {
  const router = useRouter()
  const searchParams = useSearchParams()

  // Get initial values from query params if available
  const initialCustomerId = searchParams.get("customerId") ? Number(searchParams.get("customerId")) : 0
  const initialLocationId = searchParams.get("locationId") || ""

  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [customerId, setCustomerId] = useState(initialCustomerId)
  const [locationId, setLocationId] = useState(initialLocationId)
  const [customerLocations, setCustomerLocations] = useState<any[]>([])

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!customerId || !locationId || !title || !description) {
      alert("Please fill in all required fields")
      return
    }

    // In a real app, this would be an API call to create the case
    console.log("Creating case:", {
      title,
      description,
      customerId,
      locationId,
      status: "Open",
      createdAt: new Date().toISOString(),
    })

    // Navigate back to cases list
    router.push("/cases")
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Create New Case</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="customerId" className="block text-sm font-medium mb-2">
            Customer <span className="text-red-500">*</span>
          </label>
          <select
            id="customerId"
            value={customerId || ""}
            onChange={(e) => setCustomerId(Number(e.target.value))}
            className="w-full p-2 rounded-md border border-input bg-background"
            required
          >
            <option value="">Select a customer</option>
            {customers.map((customer) => (
              <option key={customer.id} value={customer.id}>
                {customer.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="locationId" className="block text-sm font-medium mb-2">
            Location <span className="text-red-500">*</span>
          </label>
          <select
            id="locationId"
            value={locationId}
            onChange={(e) => setLocationId(e.target.value)}
            className="w-full p-2 rounded-md border border-input bg-background"
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
          {!customerId && <p className="text-sm text-muted-foreground mt-1">Please select a customer first</p>}
        </div>

        <div>
          <label htmlFor="title" className="block text-sm font-medium mb-2">
            Case Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 rounded-md border border-input bg-background"
            required
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium mb-2">
            Case Description <span className="text-red-500">*</span>
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 rounded-md border border-input bg-background"
            rows={4}
            required
          ></textarea>
        </div>

        <button
          type="submit"
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
        >
          Create Case
        </button>
      </form>
    </div>
  )
}

