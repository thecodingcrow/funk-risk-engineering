"use client"

import { useState } from "react"
import Link from "next/link"
import { Building, MapPin, Briefcase, Search, Phone, Mail, Globe, ChevronRight } from "lucide-react"
import { customers, getCustomerLocations, getCasesByCustomer } from "@/lib/data"

export default function Customers() {
  const [searchTerm, setSearchTerm] = useState("")

  // Kunden basierend auf Suchbegriff filtern
  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.industry.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Funktion zum Abrufen einer eindeutigen Farbe für jede Branche
  const getIndustryColor = (industry: string) => {
    const colors = {
      Einzelhandel: "border-secondary",
      Technologie: "border-primary",
      Dienstleistungen: "border-accent",
      default: "border-muted",
    }
    return colors[industry as keyof typeof colors] || colors.default
  }

  // Funktion zum Abrufen einer eindeutigen Hintergrundfarbe für jede Branche
  const getIndustryBgColor = (industry: string) => {
    const colors = {
      Einzelhandel: "bg-secondary/10 text-secondary",
      Technologie: "bg-primary/10 text-primary",
      Dienstleistungen: "bg-accent/10 text-accent",
      default: "bg-muted text-muted-foreground",
    }
    return colors[industry as keyof typeof colors] || colors.default
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between">
        <h1 className="text-3xl font-bold">Kunden</h1>

        <div className="mt-4 sm:mt-0 relative w-full sm:w-64 md:w-80">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Kunden durchsuchen..."
            className="w-full p-2 pl-8 rounded-custom border border-input bg-background"
          />
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        </div>
      </div>

      {filteredCustomers.length === 0 ? (
        <div className="bg-card p-8 rounded-custom shadow-md text-center border border-border">
          <Building className="h-12 w-12 mx-auto text-muted-foreground opacity-50" />
          <p className="mt-4 text-muted-foreground">Keine Kunden gefunden, die Ihrer Suche entsprechen.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCustomers.map((customer) => {
            const customerLocations = getCustomerLocations(customer.id)
            const customerCases = getCasesByCustomer(customer.id)
            const openCases = customerCases.filter((c) => c.status === "Offen").length
            const industryBgColor = getIndustryBgColor(customer.industry)

            return (
              <Link
                key={customer.id}
                href={`/customers/${customer.id}`}
                className="bg-card rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden group border border-border/50 transform hover:-translate-y-1"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-grow">
                      <h2 className="text-xl font-semibold group-hover:text-primary transition-colors flex items-center">
                        {customer.name}
                        <ChevronRight className="h-4 w-4 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </h2>
                      <div className="inline-block px-2 py-1 bg-background rounded-full text-xs mt-2 border border-border/30">
                        {customer.industry}
                      </div>
                    </div>
                    <div className={`p-3 rounded-full ${industryBgColor}`}>
                      <Building className="h-6 w-6" />
                    </div>
                  </div>

                  <div className="mt-4 space-y-2">
                    <div className="flex items-center text-sm">
                      <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>{customer.phone}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>{customer.email}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <Globe className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>{customer.website}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-background p-4 border-t border-border">
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="bg-card p-2 rounded-lg border border-border/30">
                      <div className="flex items-center justify-center">
                        <MapPin className="h-4 w-4 mr-1 text-primary" />
                        <span className="text-lg font-semibold">{customerLocations.length}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">Standorte</p>
                    </div>
                    <div className="bg-card p-2 rounded-lg border border-border/30">
                      <div className="flex items-center justify-center">
                        <Briefcase className="h-4 w-4 mr-1 text-primary" />
                        <span className="text-lg font-semibold">{customerCases.length}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">Fälle</p>
                    </div>
                    <div className="bg-card p-2 rounded-lg border border-border/30">
                      <div className="flex items-center justify-center">
                        <div
                          className={`h-2 w-2 rounded-full mr-1 ${openCases > 0 ? "bg-primary" : "bg-success"}`}
                        ></div>
                        <span className="text-lg font-semibold">{openCases}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">Offen</p>
                    </div>
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

