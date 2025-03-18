"use client"

import type React from "react"
import { Paperclip, FileText, Download, Trash2 } from "lucide-react"

interface AttachmentsSectionProps {
  attachments: any[]
  isEditing: boolean
  onUpdate: (updatedAttachments: any[]) => void
}

export default function AttachmentsSection({ attachments, isEditing, onUpdate }: AttachmentsSectionProps) {
  const handleDeleteAttachment = (attachmentId: string) => {
    onUpdate(attachments.filter((attachment) => attachment.id !== attachmentId))
  }

  const handleAddAttachment = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return

    const file = e.target.files[0]

    // Create a new attachment object
    const newAttachment = {
      id: `att-${attachments.length + 1}`,
      fileName: file.name,
      uploadedBy: "emp-456", // In a real app, this would be the current user
      uploadedAt: new Date().toISOString(),
      fileSize: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
      fileType: file.type,
    }

    onUpdate([...attachments, newAttachment])

    // Reset the file input
    e.target.value = ""
  }

  return (
    <div className="bg-card p-6 rounded-lg shadow">
      <h2 className="text-xl font-semibold flex items-center">
        <Paperclip className="h-5 w-5 mr-2" />
        Attachments
      </h2>

      <div className="mt-4">
        {attachments.length === 0 ? (
          <p className="text-muted-foreground">No attachments yet.</p>
        ) : (
          <ul className="space-y-2">
            {attachments.map((attachment) => (
              <li key={attachment.id} className="bg-background p-3 rounded-md flex items-center justify-between">
                <div className="flex items-center">
                  <FileText className="h-5 w-5 mr-2 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{attachment.fileName}</p>
                    <p className="text-xs text-muted-foreground">
                      {attachment.fileSize} • Uploaded {new Date(attachment.uploadedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button className="p-1 text-muted-foreground hover:text-foreground">
                    <Download className="h-4 w-4" />
                  </button>
                  {isEditing && (
                    <button
                      onClick={() => handleDeleteAttachment(attachment.id)}
                      className="p-1 text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {isEditing && (
        <div className="mt-4">
          <label className="block text-sm font-medium mb-2">Upload New Attachment</label>
          <input
            type="file"
            onChange={handleAddAttachment}
            className="w-full p-2 rounded-md border border-input bg-background"
          />
        </div>
      )}
    </div>
  )
}

