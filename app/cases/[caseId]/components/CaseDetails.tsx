interface CaseDetailsProps {
  caseData: any
  isEditing: boolean
}

export default function CaseDetails({ caseData, isEditing }: CaseDetailsProps) {
  return (
    <div>
      <div className="mb-4">
        <p className="text-muted-foreground mb-2">Case Description:</p>
        <p className="bg-muted/30 p-3 rounded-lg">
          {caseData.description ||
            "This is a sample case description for demonstration purposes. In a real application, this would contain detailed information about the case."}
        </p>
      </div>

      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {Object.entries(caseData.metadata).map(([key, value]) => (
          <div key={key} className="bg-muted/30 p-3 rounded-lg">
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

