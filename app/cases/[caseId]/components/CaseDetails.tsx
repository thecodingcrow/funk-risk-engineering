import { ClipboardList } from "lucide-react"

interface CaseDetailsProps {
  caseData: any
  isEditing: boolean
}

export default function CaseDetails({ caseData, isEditing }: CaseDetailsProps) {
  return (
    <div className="bg-card p-6 rounded-lg shadow">
      <h2 className="text-xl font-semibold flex items-center">
        <ClipboardList className="h-5 w-5 mr-2" />
        Case Details
      </h2>

      <div className="mt-4 grid grid-cols-2 gap-4">
        {Object.entries(caseData.metadata).map(([key, value]) => (
          <div key={key} className="bg-background p-3 rounded-md">
            <h3 className="text-sm font-medium text-muted-foreground capitalize">{key}</h3>
            <p className="font-medium">{value as string}</p>
          </div>
        ))}
      </div>

      {isEditing && (
        <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500 rounded-md">
          <p className="text-sm">Editing case details is not implemented in this demo.</p>
        </div>
      )}
    </div>
  )
}

