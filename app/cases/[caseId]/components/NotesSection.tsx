"use client"

import type React from "react"
import { useState } from "react"
import { MessageSquare, Send } from "lucide-react"

interface NotesSectionProps {
  notes: any[]
  onAddNote: (note: string) => void
}

export default function NotesSection({ notes, onAddNote }: NotesSectionProps) {
  const [newNote, setNewNote] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newNote.trim()) return

    onAddNote(newNote)
    setNewNote("")
  }

  return (
    <div className="bg-card p-6 rounded-lg shadow">
      <h2 className="text-xl font-semibold flex items-center">
        <MessageSquare className="h-5 w-5 mr-2" />
        Notes
      </h2>

      <div className="mt-4 max-h-80 overflow-y-auto">
        {notes.length === 0 ? (
          <p className="text-muted-foreground">No notes yet.</p>
        ) : (
          <ul className="space-y-4">
            {notes.map((note) => (
              <li key={note.id} className="bg-background p-3 rounded-md">
                <p>{note.content}</p>
                <div className="mt-2 flex justify-between text-xs text-muted-foreground">
                  <span>By: {note.createdBy}</span>
                  <span>{new Date(note.createdAt).toLocaleString()}</span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <form onSubmit={handleSubmit} className="mt-4">
        <div className="flex">
          <input
            type="text"
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            placeholder="Add a note..."
            className="flex-1 p-2 rounded-l-md border border-input bg-background"
          />
          <button
            type="submit"
            className="p-2 bg-primary text-primary-foreground rounded-r-md hover:bg-primary/90 transition-colors"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </form>
    </div>
  )
}

