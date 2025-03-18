export const locations = [
  { id: "loc-1", name: "Vienna Central", address: "Stephansplatz 1, 1010 Vienna", lat: 48.2082, lng: 16.3738 },
  { id: "loc-2", name: "Vienna West", address: "Mariahilfer Straße 100, 1070 Vienna", lat: 48.1975, lng: 16.3447 },
  { id: "loc-3", name: "Salzburg Main", address: "Getreidegasse 9, 5020 Salzburg", lat: 47.8031, lng: 13.0447 },
  { id: "loc-4", name: "Graz Downtown", address: "Hauptplatz 1, 8010 Graz", lat: 47.0707, lng: 15.4395 },
  {
    id: "loc-5",
    name: "Innsbruck Shop",
    address: "Maria-Theresien-Straße 18, 6020 Innsbruck",
    lat: 47.2654,
    lng: 11.3927,
  },
  { id: "loc-6", name: "Linz Center", address: "Landstraße 17, 4020 Linz", lat: 48.3064, lng: 14.2858 },
  {
    id: "loc-7",
    name: "Klagenfurt Mall",
    address: "Völkermarkter Straße 1, 9020 Klagenfurt",
    lat: 46.6228,
    lng: 14.3051,
  },
  { id: "loc-8", name: "Bregenz Lakeside", address: "Seestraße 5, 6900 Bregenz", lat: 47.5031, lng: 9.7471 },
  { id: "loc-9", name: "Eisenstadt Plaza", address: "Hauptstraße 10, 7000 Eisenstadt", lat: 47.845, lng: 16.5336 },
  { id: "loc-10", name: "St. Pölten Center", address: "Rathausplatz 1, 3100 St. Pölten", lat: 48.2047, lng: 15.6256 },
]

// Customer data with multiple locations
export const customers = [
  {
    id: 1,
    name: "Acme Corp",
    email: "contact@acmecorp.com",
    phone: "+43 1 234567890",
    website: "www.acmecorp.com",
    industry: "Retail",
    locationIds: ["loc-1", "loc-3", "loc-5", "loc-7", "loc-9"],
  },
  {
    id: 2,
    name: "TechStart Inc",
    email: "info@techstart.com",
    phone: "+43 662 9876543",
    website: "www.techstart.com",
    industry: "Technology",
    locationIds: ["loc-2", "loc-4", "loc-6"],
  },
  {
    id: 3,
    name: "Global Services",
    email: "support@globalservices.com",
    phone: "+43 512 1122334",
    website: "www.globalservices.com",
    industry: "Services",
    locationIds: ["loc-8", "loc-10"],
  },
]

// Case data with location references
export const cases = [
  {
    id: 1,
    customerId: 1,
    locationId: "loc-1",
    title: "Annual Safety Inspection",
    status: "Open",
    createdAt: "2023-05-15T10:30:00Z",
  },
  {
    id: 2,
    customerId: 1,
    locationId: "loc-3",
    title: "Equipment Maintenance",
    status: "In Progress",
    createdAt: "2023-05-20T14:45:00Z",
  },
  {
    id: 3,
    customerId: 2,
    locationId: "loc-2",
    title: "Security Assessment",
    status: "Closed",
    createdAt: "2023-04-10T09:15:00Z",
  },
  {
    id: 4,
    customerId: 2,
    locationId: "loc-4",
    title: "Staff Training",
    status: "Open",
    createdAt: "2023-06-01T11:00:00Z",
  },
  {
    id: 5,
    customerId: 3,
    locationId: "loc-8",
    title: "Risk Evaluation",
    status: "In Progress",
    createdAt: "2023-05-25T16:30:00Z",
  },
  {
    id: 6,
    customerId: 1,
    locationId: "loc-5",
    title: "Compliance Review",
    status: "Open",
    createdAt: "2023-06-05T13:20:00Z",
  },
  {
    id: 7,
    customerId: 2,
    locationId: "loc-6",
    title: "Emergency Response Plan",
    status: "In Progress",
    createdAt: "2023-05-18T10:00:00Z",
  },
  {
    id: 8,
    customerId: 3,
    locationId: "loc-10",
    title: "Workplace Assessment",
    status: "Closed",
    createdAt: "2023-04-22T15:45:00Z",
  },
]

// Helper function to get customer by ID
export function getCustomerById(id: number) {
  return customers.find((customer) => customer.id === id)
}

// Helper function to get location by ID
export function getLocationById(id: string) {
  return locations.find((location) => location.id === id)
}

// Helper function to get customer locations
export function getCustomerLocations(customerId: number) {
  const customer = getCustomerById(customerId)
  if (!customer) return []

  return customer.locationIds.map((locId) => getLocationById(locId)).filter(Boolean)
}

// Helper function to get cases by location
export function getCasesByLocation(locationId: string) {
  return cases.filter((caseItem) => caseItem.locationId === locationId)
}

// Helper function to get cases by customer
export function getCasesByCustomer(customerId: number) {
  return cases.filter((caseItem) => caseItem.customerId === customerId)
}

// Helper function to get case by ID
export function getCaseById(id: number) {
  return cases.find((caseItem) => caseItem.id === id)
}

