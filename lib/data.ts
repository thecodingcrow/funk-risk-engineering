export const locations = [
  { id: "loc-1", name: "Wien Zentrum", address: "Stephansplatz 1, 1010 Wien", lat: 48.2082, lng: 16.3738 },
  { id: "loc-2", name: "Wien West", address: "Mariahilfer Straße 100, 1070 Wien", lat: 48.1975, lng: 16.3447 },
  { id: "loc-3", name: "Salzburg Hauptsitz", address: "Getreidegasse 9, 5020 Salzburg", lat: 47.8031, lng: 13.0447 },
  { id: "loc-4", name: "Graz Innenstadt", address: "Hauptplatz 1, 8010 Graz", lat: 47.0707, lng: 15.4395 },
  {
    id: "loc-5",
    name: "Innsbruck Geschäft",
    address: "Maria-Theresien-Straße 18, 6020 Innsbruck",
    lat: 47.2654,
    lng: 11.3927,
  },
  { id: "loc-6", name: "Linz Zentrum", address: "Landstraße 17, 4020 Linz", lat: 48.3064, lng: 14.2858 },
  {
    id: "loc-7",
    name: "Klagenfurt Einkaufszentrum",
    address: "Völkermarkter Straße 1, 9020 Klagenfurt",
    lat: 46.6228,
    lng: 14.3051,
  },
  { id: "loc-8", name: "Bregenz Seeufer", address: "Seestraße 5, 6900 Bregenz", lat: 47.5031, lng: 9.7471 },
  { id: "loc-9", name: "Eisenstadt Platz", address: "Hauptstraße 10, 7000 Eisenstadt", lat: 47.845, lng: 16.5336 },
  { id: "loc-10", name: "St. Pölten Zentrum", address: "Rathausplatz 1, 3100 St. Pölten", lat: 48.2047, lng: 15.6256 },
]

// Kundendaten mit mehreren Standorten
export const customers = [
  {
    id: 1,
    name: "Acme GmbH",
    email: "kontakt@acmegmbh.com",
    phone: "+43 1 234567890",
    website: "www.acmegmbh.com",
    industry: "Einzelhandel",
    locationIds: ["loc-1", "loc-3", "loc-5", "loc-7", "loc-9"],
  },
  {
    id: 2,
    name: "TechStart AG",
    email: "info@techstart.com",
    phone: "+43 662 9876543",
    website: "www.techstart.com",
    industry: "Technologie",
    locationIds: ["loc-2", "loc-4", "loc-6"],
  },
  {
    id: 3,
    name: "Globale Dienstleistungen",
    email: "support@globaledienstleistungen.com",
    phone: "+43 512 1122334",
    website: "www.globaledienstleistungen.com",
    industry: "Dienstleistungen",
    locationIds: ["loc-8", "loc-10"],
  },
]

// Falldaten mit Standortreferenzen
export const cases = [
  {
    id: 1,
    customerId: 1,
    locationId: "loc-1",
    title: "Jährliche Sicherheitsinspektion",
    status: "Offen",
    createdAt: "2023-05-15T10:30:00Z",
  },
  {
    id: 2,
    customerId: 1,
    locationId: "loc-3",
    title: "Geräte-Wartung",
    status: "In Bearbeitung",
    createdAt: "2023-05-20T14:45:00Z",
  },
  {
    id: 3,
    customerId: 2,
    locationId: "loc-2",
    title: "Sicherheitsbewertung",
    status: "Abgeschlossen",
    createdAt: "2023-04-10T09:15:00Z",
  },
  {
    id: 4,
    customerId: 2,
    locationId: "loc-4",
    title: "Mitarbeiterschulung",
    status: "Offen",
    createdAt: "2023-06-01T11:00:00Z",
  },
  {
    id: 5,
    customerId: 3,
    locationId: "loc-8",
    title: "Risikobewertung",
    status: "In Bearbeitung",
    createdAt: "2023-05-25T16:30:00Z",
  },
  {
    id: 6,
    customerId: 1,
    locationId: "loc-5",
    title: "Compliance-Überprüfung",
    status: "Offen",
    createdAt: "2023-06-05T13:20:00Z",
  },
  {
    id: 7,
    customerId: 2,
    locationId: "loc-6",
    title: "Notfallplan",
    status: "In Bearbeitung",
    createdAt: "2023-05-18T10:00:00Z",
  },
  {
    id: 8,
    customerId: 3,
    locationId: "loc-10",
    title: "Arbeitsplatzbewertung",
    status: "Abgeschlossen",
    createdAt: "2023-04-22T15:45:00Z",
  },
]

// Hilfsfunktion zum Abrufen eines Kunden anhand der ID
export function getCustomerById(id: number) {
  return customers.find((customer) => customer.id === id)
}

// Hilfsfunktion zum Abrufen eines Standorts anhand der ID
export function getLocationById(id: string) {
  return locations.find((location) => location.id === id)
}

// Hilfsfunktion zum Abrufen der Kundenstandorte
export function getCustomerLocations(customerId: number) {
  const customer = getCustomerById(customerId)
  if (!customer) return []

  return customer.locationIds.map((locId) => getLocationById(locId)).filter(Boolean)
}

// Hilfsfunktion zum Abrufen von Fällen nach Standort
export function getCasesByLocation(locationId: string) {
  return cases.filter((caseItem) => caseItem.locationId === locationId)
}

// Hilfsfunktion zum Abrufen von Fällen nach Kunde
export function getCasesByCustomer(customerId: number) {
  return cases.filter((caseItem) => caseItem.customerId === customerId)
}

// Hilfsfunktion zum Abrufen eines Falls anhand der ID
export function getCaseById(id: number) {
  return cases.find((caseItem) => caseItem.id === id)
}

