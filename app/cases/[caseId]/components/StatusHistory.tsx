import { History } from "lucide-react"

interface StatusHistoryProps {
  history: any[]
}

export default function StatusHistory({ history }: StatusHistoryProps) {
  // Function to translate status to German
  const translateStatus = (status: string) => {
    switch (status) {
      case "Open":
        return "Offen"
      case "In Progress":
        return "In Bearbeitung"
      case "Closed":
        return "Abgeschlossen"
      default:
        return status
    }
  }

  return (
    <div className="bg-card p-6 rounded-lg shadow">
      <h2 className="text-xl font-semibold flex items-center">
        <History className="h-5 w-5 mr-2" />
        Statusverlauf
      </h2>

      <div className="mt-4">
        <ul className="space-y-4">
          {history.map((entry, index) => (
            <li key={index} className="relative pl-6 pb-4">
              {/* Timeline connector */}
              {index < history.length - 1 && (
                <div className="absolute left-2 top-2 bottom-0 w-0.5 bg-muted-foreground/30" />
              )}

              {/* Status dot */}
              <div
                className={`absolute left-0 top-2 h-4 w-4 rounded-full ${
                  entry.status === "Open"
                    ? "bg-blue-500"
                    : entry.status === "In Progress"
                      ? "bg-yellow-500"
                      : "bg-green-500"
                }`}
              />

              <div>
                <p className="font-medium">{translateStatus(entry.status)}</p>
                <p className="text-xs text-muted-foreground">{new Date(entry.timestamp).toLocaleString()}</p>
                {entry.notes && (
                  <p className="mt-1 text-sm">{entry.notes === "Case created" ? "Fall erstellt" : entry.notes}</p>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

