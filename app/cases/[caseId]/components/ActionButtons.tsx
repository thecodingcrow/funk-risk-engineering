"use client"

import { useState } from "react"
import Link from "next/link"
import { Edit, Send, CheckCircle, FileText, Users } from "lucide-react"

interface ActionButtonsProps {
  caseData: any
  onStatusChange: (newStatus: string) => void
}

export default function ActionButtons({ caseData, onStatusChange }: ActionButtonsProps) {
  const [linkCopied, setLinkCopied] = useState(false)
  const [linkGenerated, setLinkGenerated] = useState(false)

  const handleGenerateLink = () => {
    // In a real app, this would generate a secure one-time link
    const customerLink = `${window.location.origin}/customer-report/${caseData.id}?token=demo-token`

    // Copy to clipboard
    navigator.clipboard.writeText(customerLink)
    setLinkCopied(true)
    setLinkGenerated(true)

    setTimeout(() => {
      setLinkCopied(false)
    }, 3000)

    // In a real app, this would also trigger an email to the customer
    console.log("Email sent to customer with link:", customerLink)
  }

  const handleCloseCase = () => {
    onStatusChange("Closed")
  }

  return (
    <div className="bg-card p-6 rounded-lg shadow">
      <h2 className="text-xl font-semibold">Actions</h2>

      <div className="mt-4 space-y-3">
        <Link
          href={`/cases/${caseData.id}/report?mode=edit`}
          className="flex items-center justify-center w-full p-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
        >
          <Edit className="h-4 w-4 mr-2" />
          Edit Report
        </Link>

        <Link
          href={`/cases/${caseData.id}/report`}
          className="flex items-center justify-center w-full p-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/90 transition-colors"
        >
          <FileText className="h-4 w-4 mr-2" />
          View Full Report
        </Link>

        <div className="border-t border-border pt-3">
          <h3 className="text-sm font-medium mb-2 flex items-center">
            <Users className="h-4 w-4 mr-1" />
            Customer Actions
          </h3>

          <button
            onClick={handleGenerateLink}
            className="flex items-center justify-center w-full p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            {linkCopied ? (
              <>
                <CheckCircle className="h-4 w-4 mr-2" />
                Link Copied!
              </>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                {linkGenerated ? "Copy Customer Link" : "Generate Customer Link"}
              </>
            )}
          </button>

          {linkGenerated && (
            <p className="text-xs text-muted-foreground mt-1 text-center">
              Link sent to customer. They can now respond to recommendations.
            </p>
          )}
        </div>

        {caseData.status !== "Closed" && (
          <button
            onClick={handleCloseCase}
            className="flex items-center justify-center w-full p-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors mt-4"
          >
            <CheckCircle className="h-4 w-4 mr-2" />
            Close Case
          </button>
        )}
      </div>
    </div>
  )
}

