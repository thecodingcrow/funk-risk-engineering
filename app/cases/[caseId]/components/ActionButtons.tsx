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
      <h2 className="text-xl font-semibold">Aktionen</h2>

      <div className="mt-4 space-y-3">
        <Link
          href={`/cases/${caseData.id}/report?mode=edit`}
          className="flex items-center justify-center w-full p-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
        >
          <Edit className="h-4 w-4 mr-2" />
          Bericht bearbeiten
        </Link>

        <Link
          href={`/cases/${caseData.id}/report`}
          className="flex items-center justify-center w-full p-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
        >
          <FileText className="h-4 w-4 mr-2" />
          Vollständigen Bericht anzeigen
        </Link>

        <div className="border-t border-border pt-3">
          <h3 className="text-sm font-medium mb-2 flex items-center">
            <Users className="h-4 w-4 mr-1" />
            Kundenaktionen
          </h3>

          <button
            onClick={handleGenerateLink}
            className="flex items-center justify-center w-full p-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
          >
            {linkCopied ? (
              <>
                <CheckCircle className="h-4 w-4 mr-2" />
                Link kopiert!
              </>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                {linkGenerated ? "Kundenlink kopieren" : "Kundenlink generieren"}
              </>
            )}
          </button>

          {linkGenerated && (
            <p className="text-xs text-muted-foreground mt-1 text-center">
              Link an Kunden gesendet. Sie können jetzt auf Empfehlungen antworten.
            </p>
          )}
        </div>

        {caseData.status !== "Closed" && (
          <button
            onClick={handleCloseCase}
            className="flex items-center justify-center w-full p-2 bg-success text-success-foreground rounded-md hover:bg-success/90 transition-colors mt-4"
          >
            <CheckCircle className="h-4 w-4 mr-2" />
            Fall abschließen
          </button>
        )}
      </div>
    </div>
  )
}

