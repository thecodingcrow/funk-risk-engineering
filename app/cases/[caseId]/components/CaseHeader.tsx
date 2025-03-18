import { Clock, User, Building } from "lucide-react"

interface CaseHeaderProps {
  caseData: any
}

export default function CaseHeader({ caseData }: CaseHeaderProps) {
  return (
    <div className="bg-card p-6 rounded-lg shadow">
      <div className="flex flex-col md:flex-row md:items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center">
            Case #{caseData.id}
            <span
              className={`ml-3 px-2 py-1 text-xs rounded-full ${
                caseData.status === "Open"
                  ? "bg-blue-500 text-white"
                  : caseData.status === "In Progress"
                    ? "bg-yellow-500 text-black"
                    : "bg-green-500 text-white"
              }`}
            >
              {caseData.status}
            </span>
          </h1>
          <p className="text-muted-foreground mt-1">{caseData.description}</p>
        </div>

        <div className="mt-4 md:mt-0 flex flex-col items-start md:items-end">
          <div className="flex items-center text-sm text-muted-foreground">
            <Clock className="h-4 w-4 mr-1" />
            <span>Created: {new Date(caseData.createdAt).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center text-sm text-muted-foreground mt-1">
            <Clock className="h-4 w-4 mr-1" />
            <span>Updated: {new Date(caseData.updatedAt).toLocaleDateString()}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        <div className="bg-background p-4 rounded-md">
          <h3 className="text-sm font-medium flex items-center">
            <Building className="h-4 w-4 mr-1" />
            Customer
          </h3>
          <p className="font-semibold mt-1">{caseData.customer.name}</p>
          <p className="text-sm text-muted-foreground">{caseData.customer.email}</p>
          <p className="text-sm text-muted-foreground">{caseData.customer.phone}</p>
          <p className="text-sm text-muted-foreground">{caseData.customer.location}</p>
        </div>

        <div className="bg-background p-4 rounded-md">
          <h3 className="text-sm font-medium flex items-center">
            <User className="h-4 w-4 mr-1" />
            Assigned Employee
          </h3>
          <p className="font-semibold mt-1">{caseData.assignedEmployee.name}</p>
          <p className="text-sm text-muted-foreground">{caseData.assignedEmployee.email}</p>
        </div>
      </div>
    </div>
  )
}

