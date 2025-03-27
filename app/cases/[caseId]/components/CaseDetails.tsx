interface CaseDetailsProps {
  caseData: any
  isEditing: boolean
}

export default function CaseDetails({ caseData, isEditing }: CaseDetailsProps) {
  // Function to translate metadata keys and values
  const translateMetadata = (key: string, value: string) => {
    // Translate keys
    const keyTranslations: Record<string, string> = {
      caseType: "Falltyp",
      priority: "Priorität",
      industry: "Branche",
    }

    // Translate values
    const valueTranslations: Record<string, string> = {
      "Risk Assessment": "Risikobewertung",
      Medium: "Mittel",
      High: "Hoch",
      Low: "Niedrig",
    }

    const translatedKey = keyTranslations[key] || key
    const translatedValue = valueTranslations[value] || value

    return { key: translatedKey, value: translatedValue }
  }

  return (
    <div>
      <div className="mb-4">
        <p className="text-muted-foreground mb-2">Fallbeschreibung:</p>
        <p className="bg-muted/30 p-3 rounded-lg">
          {caseData.description ||
            "Dies ist eine Beispielbeschreibung für Demonstrationszwecke. In einer echten Anwendung würde hier detaillierte Informationen zum Fall stehen."}
        </p>
      </div>

      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {Object.entries(caseData.metadata).map(([key, value]) => {
          const { key: translatedKey, value: translatedValue } = translateMetadata(key, value as string)
          return (
            <div key={key} className="bg-muted/30 p-3 rounded-lg">
              <h3 className="text-sm font-medium text-muted-foreground capitalize">{translatedKey}</h3>
              <p className="font-medium">{translatedValue}</p>
            </div>
          )
        })}
      </div>

      {isEditing && (
        <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500 rounded-md">
          <p className="text-sm">Die Bearbeitung von Falldetails ist in dieser Demo nicht implementiert.</p>
        </div>
      )}
    </div>
  )
}

