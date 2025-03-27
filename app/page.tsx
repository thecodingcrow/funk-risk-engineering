import Link from "next/link"

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)]">
      <h1 className="text-4xl font-bold mb-8">Willkommen bei FUNK Risikomanagement</h1>
      <div className="space-y-4 text-center">
        <p className="text-lg text-muted-foreground max-w-md">
          Eine umfassende Lösung für die Verwaltung von Fällen, Kunden und Standorten.
        </p>
        <Link
          href="/login"
          className="inline-block px-6 py-3 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
        >
          Zum Dashboard anmelden
        </Link>
      </div>
    </div>
  )
}

