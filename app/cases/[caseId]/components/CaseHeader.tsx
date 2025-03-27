import { Clock, User } from "lucide-react"

interface CaseHeaderProps {
  caseData: any
}

export default function CaseHeader({ caseData }: CaseHeaderProps) {
  // Function to translate status
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

  // Function to get status pill class
  const getStatusClass = (status: string) => {
    switch (status) {
      case "Open":
        return "bg-primary text-primary-foreground"
      case "In Progress":
        return "bg-accent text-accent-foreground"
      case "Closed":
        return "bg-success text-success-foreground"
      default:
        return "bg-primary text-primary-foreground"
    }
  }

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between">
      <div>
        <div className="flex items-center">
          <h1 className="text-2xl font-bold">{caseData.title}</h1>
          <span className={`ml-3 px-3 py-1 text-xs rounded-full ${getStatusClass(caseData.status)}`}>
            {translateStatus(caseData.status)}
          </span>
        </div>
        <p className="text-muted-foreground mt-1">Fall #{caseData.id}</p>
      </div>

      <div className="mt-4 md:mt-0 flex flex-col items-start md:items-end">
        <div className="flex items-center text-sm text-muted-foreground">
          <Clock className="h-4 w-4 mr-1" />
          <span>Erstellt: {new Date(caseData.createdAt).toLocaleDateString()}</span>
        </div>
        <div className="flex items-center text-sm text-muted-foreground mt-1">
          <User className="h-4 w-4 mr-1" />
          <span>Zugewiesen an: {caseData.assignedEmployee?.name}</span>
        </div>
      </div>
    </div>
  )
}

