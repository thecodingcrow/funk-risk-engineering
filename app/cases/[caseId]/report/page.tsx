import { notFound } from "next/navigation"
import Link from "next/link"

export default function ReportManagement({ params }: { params: { caseId: string } }) {
  const caseId = params.caseId

  // Simple validation - in a real app, you would check if the case exists
  if (!caseId || isNaN(Number(caseId))) {
    notFound()
  }

  // Mock data - in a real app, this would come from an API or database
  const report = {
    id: caseId,
    caseId: caseId,
    content: "Report content goes here...",
    suggestions: [
      { id: 1, text: "Suggestion 1" },
      { id: 2, text: "Suggestion 2" },
    ],
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Report for Case {caseId}</h1>
      <div className="mb-4">
        <h2 className="text-xl mb-2">Content</h2>
        <div className="p-4 bg-card rounded-md">
          <p>{report.content}</p>
        </div>
      </div>
      <div>
        <h2 className="text-xl mb-2">Suggestions</h2>
        <ul className="space-y-2">
          {report.suggestions.map((suggestion) => (
            <li key={suggestion.id} className="p-4 bg-card rounded-md">
              {suggestion.text}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-6">
        <Link
          href={`/cases/${caseId}`}
          className="px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/90 transition-colors"
        >
          Back to Case
        </Link>
      </div>
    </div>
  )
}

