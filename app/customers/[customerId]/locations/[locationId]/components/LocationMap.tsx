"use client"

import { useEffect, useRef } from "react"

interface LocationMapProps {
  location: {
    id: string
    name: string
    address: string
    lat: number
    lng: number
  }
}

export default function LocationMap({ location }: LocationMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // For demo purposes, we'll use a mock map
    const mockMap = () => {
      if (!mapRef.current) return

      // Create a canvas element to draw a simple map visualization
      const canvas = document.createElement("canvas")
      canvas.width = mapRef.current.clientWidth
      canvas.height = mapRef.current.clientHeight
      canvas.style.width = "100%"
      canvas.style.height = "100%"

      const ctx = canvas.getContext("2d")
      if (!ctx) return

      // Draw background
      ctx.fillStyle = "#242f3e"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Draw some random lines to simulate roads
      ctx.strokeStyle = "#3a4b5c"
      ctx.lineWidth = 2

      for (let i = 0; i < 20; i++) {
        ctx.beginPath()
        ctx.moveTo(Math.random() * canvas.width, Math.random() * canvas.height)
        ctx.lineTo(Math.random() * canvas.width, Math.random() * canvas.height)
        ctx.stroke()
      }

      // Draw marker for the location
      const x = canvas.width / 2
      const y = canvas.height / 2

      // Draw marker
      ctx.fillStyle = "#e74c3c"
      ctx.beginPath()
      ctx.arc(x, y, 12, 0, Math.PI * 2)
      ctx.fill()

      // Draw marker border
      ctx.strokeStyle = "#ffffff"
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.arc(x, y, 12, 0, Math.PI * 2)
      ctx.stroke()

      // Draw location name
      ctx.fillStyle = "#ffffff"
      ctx.font = "14px Arial"
      ctx.textAlign = "center"
      ctx.fillText(location.name, x, y - 20)

      // Draw address
      ctx.font = "12px Arial"
      ctx.fillText(location.address, x, y + 25)

      // Add a note that this is a mock map
      ctx.fillStyle = "rgba(255, 255, 255, 0.7)"
      ctx.fillRect(10, 10, 180, 30)
      ctx.fillStyle = "#000000"
      ctx.font = "12px Arial"
      ctx.textAlign = "left"
      ctx.fillText("Mock Map (Demo Only)", 20, 30)

      // Clear the container and add the canvas
      if (mapRef.current) {
        mapRef.current.innerHTML = ""
        mapRef.current.appendChild(canvas)
      }
    }

    // Use mock map for demo
    mockMap()

    // In a real app, you would use Google Maps or another mapping service
  }, [location])

  return <div ref={mapRef} className="w-full h-full bg-muted"></div>
}

