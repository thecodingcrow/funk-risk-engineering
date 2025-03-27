import { Clock, User } from "lucide-react"

interface CaseHeaderProps {
  caseData: any
}

export default function CaseHeader({ caseData }: CaseHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between">
      <div>
        <div className="flex items-center">
          <h1 className="text-2xl font-bold">{caseData.title}</h1>
          <span
            className={`ml-3 px-3 py-1 text-xs rounded-full ${
              caseData.status === "Open"
                ? "bg-blue-500 text-white"
                : caseData.status === "In Progress"
                  ? "bg-yellow-500 text-black"
                  : "bg-green-500 text-white"
            }`}
          >
            {caseData.status}
          </span>
        </div>
        <p className="text-muted-foreground mt-1">Case #{caseData.id}</p>
      </div>

      <div className="mt-4 md:mt-0 flex flex-col items-start md:items-end">
        <div className="flex items-center text-sm text-muted-foreground">
          <Clock className="h-4 w-4 mr-1" />
          <span>Created: {new Date(caseData.createdAt).toLocaleDateString()}</span>
        </div>
        <div className="flex items-center text-sm text-muted-foreground mt-1">
          <User className="h-4 w-4 mr-1" />
          <span>Assigned to: {caseData.assignedEmployee?.name}</span>
        </div>
      </div>
    </div>
  )
}

