"use client"

import { useState } from "react"
import Link from "next/link"
import { Edit, Send, FileIcon as FilePdf, CheckCircle } from "lucide-react"

interface ActionButtonsProps {
  caseData: any
  mode: string
  onStatusChange: (newStatus: string) => void
}

export default function ActionButtons({ caseData, mode, onStatusChange }: ActionButtonsProps) {
  const [linkCopied, setLinkCopied] = useState(false)

  const handleGenerateLink = () => {
    // In a real app, this would generate a secure one-time link
    const customerLink = `${window.location.origin}/customer-report/${caseData.id}?token=demo-token`

    // Copy to clipboard
    navigator.clipboard.writeText(customerLink)
    setLinkCopied(true)

    setTimeout(() => {
      setLinkCopied(false)
    }, 3000)

    // In a real app, this would also trigger an email to the customer
    console.log("Email sent to customer with link:", customerLink)
  }

  const handleCloseCase = () => {
    onStatusChange("Closed")
  }

  const handleGeneratePdf = () => {
    // In a real app, this would generate a PDF
    console.log("Generating PDF for case:", caseData.id)
    alert("PDF generation would happen here in a real app.")
  }

  return (
    <div className="bg-card p-6 rounded-lg shadow">
      <h2 className="text-xl font-semibold">Actions</h2>

      <div className="mt-4 space-y-3">
        {mode === "view" ? (
          <Link
            href={`/cases/${caseData.id}?mode=edit`}
            className="flex items-center justify-center w-full p-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit Report
          </Link>
        ) : (
          <Link
            href={`/cases/${caseData.id}`}
            className="flex items-center justify-center w-full p-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
          >
            <CheckCircle className="h-4 w-4 mr-2" />
            Save Changes
          </Link>
        )}

        <button
          onClick={handleGenerateLink}
          className="flex items-center justify-center w-full p-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/90 transition-colors"
        >
          {linkCopied ? (
            <>
              <CheckCircle className="h-4 w-4 mr-2" />
              Link Copied!
            </>
          ) : (
            <>
              <Send className="h-4 w-4 mr-2" />
              Generate Customer Link
            </>
          )}
        </button>

        {caseData.status !== "Closed" && (
          <button
            onClick={handleCloseCase}
            className="flex items-center justify-center w-full p-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
          >
            <CheckCircle className="h-4 w-4 mr-2" />
            Close Case
          </button>
        )}

        <button
          onClick={handleGeneratePdf}
          className="flex items-center justify-center w-full p-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/90 transition-colors"
        >
          <FilePdf className="h-4 w-4 mr-2" />
          Generate PDF Report
        </button>
      </div>
    </div>
  )
}

