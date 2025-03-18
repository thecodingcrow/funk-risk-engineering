import { notFound } from "next/navigation"
import Link from "next/link"

export default function CaseDetail({ params }: { params: { caseId: string } }) {
  const caseId = params.caseId

  // Simple validation - in a real app, you would check if the case exists
  if (!caseId || isNaN(Number(caseId))) {
    notFound()
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Case: {caseId}</h1>
      <div className="bg-card p-6 rounded-lg shadow mb-6">
        <p>
          <strong>Customer:</strong> Customer {caseId}
        </p>
        <p>
          <strong>Status:</strong> Open
        </p>
        <p>
          <strong>Description:</strong> This is a sample case description
        </p>
      </div>

      <div className="flex space-x-4">
        <Link
          href="/cases"
          className="px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/90 transition-colors"
        >
          Back to Cases
        </Link>
        <Link
          href={`/cases/${caseId}/full-view`}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
        >
          View Full Case Details
        </Link>
      </div>
    </div>
  )
}

