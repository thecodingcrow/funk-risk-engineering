"use client"

import { useEffect, useRef } from "react"

interface Location {
  id: string
  name: string
  address: string
  lat: number
  lng: number
}

interface CustomerMapProps {
  locations: Location[]
}

export default function CustomerMap({ locations }: CustomerMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)
  const markersRef = useRef<any[]>([])

  useEffect(() => {
    // Load Google Maps script
    const loadGoogleMaps = () => {
      const script = document.createElement("script")
      script.src = `https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&callback=initMap`
      script.async = true
      script.defer = true
      window.initMap = initMap
      document.head.appendChild(script)
    }

    // Initialize map
    const initMap = () => {
      if (!mapRef.current) return

      // Find center of all locations
      const bounds = new (window as any).google.maps.LatLngBounds()
      locations.forEach((location) => {
        bounds.extend({ lat: location.lat, lng: location.lng })
      })

      // Create map
      mapInstanceRef.current = new (window as any).google.maps.Map(mapRef.current, {
        center: bounds.getCenter(),
        zoom: 8,
        styles: [
          {
            featureType: "all",
            elementType: "geometry",
            stylers: [{ color: "#242f3e" }],
          },
          {
            featureType: "all",
            elementType: "labels.text.fill",
            stylers: [{ color: "#746855" }],
          },
          {
            featureType: "all",
            elementType: "labels.text.stroke",
            stylers: [{ color: "#242f3e" }],
          },
          {
            featureType: "water",
            elementType: "geometry",
            stylers: [{ color: "#17263c" }],
          },
        ],
      })

      // Add markers
      locations.forEach((location) => {
        const marker = new (window as any).google.maps.Marker({
          position: { lat: location.lat, lng: location.lng },
          map: mapInstanceRef.current,
          title: location.name,
          animation: (window as any).google.maps.Animation.DROP,
        })

        // Add info window
        const infoWindow = new (window as any).google.maps.InfoWindow({
          content: `
            <div style="padding: 8px;">
              <h3 style="margin: 0 0 8px 0; font-weight: bold;">${location.name}</h3>
              <p style="margin: 0;">${location.address}</p>
            </div>
          `,
        })

        marker.addListener("click", () => {
          infoWindow.open(mapInstanceRef.current, marker)
        })

        markersRef.current.push(marker)
      })

      // Fit map to markers
      mapInstanceRef.current.fitBounds(bounds)

      // Adjust zoom if there's only one location
      if (locations.length === 1) {
        mapInstanceRef.current.setZoom(14)
      }
    }

    // For demo purposes, we'll use a mock map instead of loading Google Maps
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

      // Find min/max coordinates to scale the points
      let minLat = Math.min(...locations.map((l) => l.lat))
      let maxLat = Math.max(...locations.map((l) => l.lat))
      let minLng = Math.min(...locations.map((l) => l.lng))
      let maxLng = Math.max(...locations.map((l) => l.lng))

      // Add some padding
      const padding = 0.1
      const latRange = maxLat - minLat
      const lngRange = maxLng - minLng
      minLat -= latRange * padding
      maxLat += latRange * padding
      minLng -= lngRange * padding
      maxLng += lngRange * padding

      // Draw markers for each location
      locations.forEach((location) => {
        // Scale coordinates to canvas size
        const x = ((location.lng - minLng) / (maxLng - minLng)) * canvas.width
        const y = ((maxLat - location.lat) / (maxLat - minLat)) * canvas.height

        // Draw marker
        ctx.fillStyle = "#e74c3c"
        ctx.beginPath()
        ctx.arc(x, y, 8, 0, Math.PI * 2)
        ctx.fill()

        // Draw marker border
        ctx.strokeStyle = "#ffffff"
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.arc(x, y, 8, 0, Math.PI * 2)
        ctx.stroke()

        // Draw location name
        ctx.fillStyle = "#ffffff"
        ctx.font = "12px Arial"
        ctx.textAlign = "center"
        ctx.fillText(location.name, x, y - 15)
      })

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

    // In a real app, you would use:
    // loadGoogleMaps()

    return () => {
      // Cleanup
      markersRef.current = []
    }
  }, [locations])

  return <div ref={mapRef} className="w-full h-full bg-muted"></div>
}

