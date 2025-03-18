"use client"

import { useRef, useEffect, useState } from "react"
import { Briefcase, X } from "lucide-react"

interface Location {
  id: string
  name: string
  address: string
  lat: number
  lng: number
}

interface AustriaMapProps {
  locations: Location[]
  selectedLocationId: string | null
  onLocationSelect: (locationId: string | null) => void
  highlightAll?: boolean
}

export default function AustriaMap({
  locations,
  selectedLocationId,
  onLocationSelect,
  highlightAll = false,
}: AustriaMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [hoveredLocation, setHoveredLocation] = useState<Location | null>(null)
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 })
  const [mapDimensions, setMapDimensions] = useState({ width: 0, height: 0 })

  // Austria's approximate bounding box
  const austriaBounds = {
    minLat: 46.3,
    maxLat: 49.0,
    minLng: 9.5,
    maxLng: 17.2,
  }

  // Draw the map
  useEffect(() => {
    if (!mapRef.current) return

    const width = mapRef.current.clientWidth
    const height = mapRef.current.clientHeight
    setMapDimensions({ width, height })

    // Create canvas if it doesn't exist
    if (!canvasRef.current) {
      const canvas = document.createElement("canvas")
      canvas.width = width
      canvas.height = height
      canvas.style.width = "100%"
      canvas.style.height = "100%"
      mapRef.current.innerHTML = ""
      mapRef.current.appendChild(canvas)
      canvasRef.current = canvas

      // Add event listeners for mouse interactions
      canvas.addEventListener("mousemove", handleMouseMove)
      canvas.addEventListener("click", handleClick)
    }

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, width, height)

    // Draw background with gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, height)
    gradient.addColorStop(0, "#1a2e3b")
    gradient.addColorStop(1, "#0f1c24")
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, width, height)

    // Add subtle grid pattern
    drawGridPattern(ctx, width, height)

    // Draw Austria outline with improved styling
    drawAustriaOutline(ctx, width, height)

    // Draw major cities
    drawMajorCities(ctx, width, height)

    // Draw location markers
    drawLocationMarkers(ctx, width, height, locations, selectedLocationId, highlightAll)

    // Draw borders
    ctx.strokeStyle = "#3a4b5c"
    ctx.lineWidth = 2
    ctx.strokeRect(0, 0, width, height)

    // Add a note that this is a mock map
    ctx.fillStyle = "rgba(255, 255, 255, 0.1)"
    ctx.fillRect(10, 10, 180, 30)
    ctx.fillStyle = "rgba(255, 255, 255, 0.7)"
    ctx.font = '12px "Noto Sans", sans-serif'
    ctx.textAlign = "left"
    ctx.fillText("Austria Map (Demo Only)", 20, 30)

    // Add deselect button if a location is selected
    if (selectedLocationId) {
      const btnX = width - 40
      const btnY = 30

      // Draw button background
      ctx.fillStyle = "rgba(255, 255, 255, 0.1)"
      ctx.beginPath()
      ctx.arc(btnX, btnY, 15, 0, Math.PI * 2)
      ctx.fill()

      // Draw X
      ctx.strokeStyle = "rgba(255, 255, 255, 0.7)"
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.moveTo(btnX - 5, btnY - 5)
      ctx.lineTo(btnX + 5, btnY + 5)
      ctx.moveTo(btnX + 5, btnY - 5)
      ctx.lineTo(btnX - 5, btnY + 5)
      ctx.stroke()
    }
  }, [locations, selectedLocationId, highlightAll])

  // Draw grid pattern
  const drawGridPattern = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    ctx.strokeStyle = "rgba(255, 255, 255, 0.03)"
    ctx.lineWidth = 1

    // Draw vertical lines
    for (let x = 0; x < width; x += 50) {
      ctx.beginPath()
      ctx.moveTo(x, 0)
      ctx.lineTo(x, height)
      ctx.stroke()
    }

    // Draw horizontal lines
    for (let y = 0; y < height; y += 50) {
      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(width, y)
      ctx.stroke()
    }
  }

  // Handle mouse move for tooltips
  const handleMouseMove = (e: MouseEvent) => {
    if (!mapRef.current || !canvasRef.current) return

    const rect = canvasRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    // Check if mouse is over the deselect button
    if (selectedLocationId) {
      const btnX = canvasRef.current.width - 40
      const btnY = 30
      const distance = Math.sqrt(Math.pow(x - btnX, 2) + Math.pow(y - btnY, 2))

      if (distance <= 15) {
        // Mouse is over the deselect button
        setHoveredLocation(null)
        return
      }
    }

    // Find if mouse is over a location marker
    const hovered = locations.find((loc) => {
      const markerX = convertLngToX(loc.lng, canvasRef.current!.width)
      const markerY = convertLatToY(loc.lat, canvasRef.current!.height)

      // Check if mouse is within 15px of marker
      return Math.sqrt(Math.pow(x - markerX, 2) + Math.pow(y - markerY, 2)) < 15
    })

    if (hovered) {
      setHoveredLocation(hovered)

      // Calculate tooltip position with boundary checking
      let tooltipX = e.clientX
      let tooltipY = e.clientY - 100

      // Ensure tooltip stays within map boundaries
      const tooltipWidth = 200 // Approximate tooltip width
      const tooltipHeight = 100 // Approximate tooltip height

      if (tooltipX - tooltipWidth / 2 < rect.left) {
        tooltipX = rect.left + tooltipWidth / 2 + 10
      } else if (tooltipX + tooltipWidth / 2 > rect.right) {
        tooltipX = rect.right - tooltipWidth / 2 - 10
      }

      if (tooltipY < rect.top) {
        tooltipY = e.clientY + 20 // Show below cursor instead
      }

      setTooltipPosition({ x: tooltipX, y: tooltipY })
    } else {
      setHoveredLocation(null)
    }
  }

  // Handle click to select or deselect a location
  const handleClick = (e: MouseEvent) => {
    if (!mapRef.current || !canvasRef.current) return

    const rect = canvasRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    // Check if click is on the deselect button
    if (selectedLocationId) {
      const btnX = canvasRef.current.width - 40
      const btnY = 30
      const distance = Math.sqrt(Math.pow(x - btnX, 2) + Math.pow(y - btnY, 2))

      if (distance <= 15) {
        // Clicked on the deselect button
        onLocationSelect(null)
        return
      }
    }

    // Find if click is on a location marker
    const clicked = locations.find((loc) => {
      const markerX = convertLngToX(loc.lng, canvasRef.current!.width)
      const markerY = convertLatToY(loc.lat, canvasRef.current!.height)

      // Check if click is within 15px of marker
      return Math.sqrt(Math.pow(x - markerX, 2) + Math.pow(y - markerY, 2)) < 15
    })

    if (clicked) {
      // If clicking on already selected location, deselect it
      if (clicked.id === selectedLocationId) {
        onLocationSelect(null)
      } else {
        onLocationSelect(clicked.id)
      }
    }
  }

  // Helper functions to convert between lat/lng and x/y
  const convertLngToX = (lng: number, width: number) => {
    return ((lng - austriaBounds.minLng) / (austriaBounds.maxLng - austriaBounds.minLng)) * width
  }

  const convertLatToY = (lat: number, height: number) => {
    return ((austriaBounds.maxLat - lat) / (austriaBounds.maxLat - austriaBounds.minLat)) * height
  }

  const convertXToLng = (x: number, width: number) => {
    return austriaBounds.minLng + (x / width) * (austriaBounds.maxLng - austriaBounds.minLng)
  }

  const convertYToLat = (y: number, height: number) => {
    return austriaBounds.maxLat - (y / height) * (austriaBounds.maxLat - austriaBounds.minLat)
  }

  // Draw Austria outline with improved styling
  const drawAustriaOutline = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    // More detailed Austria outline coordinates
    const austriaOutline = [
      { lat: 46.77, lng: 9.6 }, // West
      { lat: 47.5, lng: 9.73 }, // Bodensee
      { lat: 47.58, lng: 10.12 }, // Vorarlberg
      { lat: 47.55, lng: 10.68 }, // Tyrol West
      { lat: 47.4, lng: 11.18 }, // Tyrol
      { lat: 47.3, lng: 11.87 }, // Tyrol East
      { lat: 47.56, lng: 12.35 }, // Salzburg
      { lat: 47.72, lng: 12.75 }, // Salzburg East
      { lat: 48.31, lng: 13.28 }, // Upper Austria
      { lat: 48.56, lng: 13.73 }, // Upper Austria North
      { lat: 48.67, lng: 14.63 }, // Lower Austria North
      { lat: 48.78, lng: 15.32 }, // Waldviertel
      { lat: 48.72, lng: 16.12 }, // Weinviertel
      { lat: 48.52, lng: 16.98 }, // Vienna North
      { lat: 48.01, lng: 17.16 }, // Burgenland
      { lat: 47.08, lng: 16.45 }, // Burgenland South
      { lat: 46.63, lng: 15.7 }, // Styria South
      { lat: 46.52, lng: 14.55 }, // Carinthia
      { lat: 46.62, lng: 13.85 }, // Carinthia West
      { lat: 46.75, lng: 12.97 }, // Carinthia/Tyrol Border
      { lat: 46.85, lng: 12.18 }, // East Tyrol
      { lat: 46.92, lng: 10.5 }, // South Tyrol (border)
      { lat: 46.77, lng: 9.6 }, // Back to start
    ]

    // Draw water bodies first (lakes)
    const lakes = [
      {
        name: "Neusiedler See",
        points: [
          { lat: 47.8, lng: 16.7 },
          { lat: 47.9, lng: 16.8 },
          { lat: 47.8, lng: 16.9 },
          { lat: 47.7, lng: 16.8 },
        ],
      },
      {
        name: "Attersee",
        points: [
          { lat: 47.8, lng: 13.5 },
          { lat: 47.9, lng: 13.6 },
          { lat: 47.8, lng: 13.6 },
          { lat: 47.7, lng: 13.5 },
        ],
      },
      {
        name: "Bodensee",
        points: [
          { lat: 47.5, lng: 9.6 },
          { lat: 47.6, lng: 9.7 },
          { lat: 47.5, lng: 9.8 },
          { lat: 47.4, lng: 9.7 },
        ],
      },
    ]

    // Draw lakes
    lakes.forEach((lake) => {
      ctx.beginPath()
      lake.points.forEach((point, index) => {
        const x = convertLngToX(point.lng, width)
        const y = convertLatToY(point.lat, height)

        if (index === 0) {
          ctx.moveTo(x, y)
        } else {
          ctx.lineTo(x, y)
        }
      })
      ctx.closePath()

      // Fill with blue color
      ctx.fillStyle = "rgba(52, 152, 219, 0.3)"
      ctx.fill()
    })

    // Draw the outline with a gradient fill
    ctx.beginPath()
    austriaOutline.forEach((point, index) => {
      const x = convertLngToX(point.lng, width)
      const y = convertLatToY(point.lat, height)

      if (index === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
    })
    ctx.closePath()

    // Create gradient fill
    const gradient = ctx.createLinearGradient(0, 0, width, height)
    gradient.addColorStop(0, "rgba(255, 255, 255, 0.1)")
    gradient.addColorStop(1, "rgba(255, 255, 255, 0.05)")
    ctx.fillStyle = gradient
    ctx.fill()

    // Draw border with glow effect
    ctx.shadowColor = "rgba(255, 255, 255, 0.3)"
    ctx.shadowBlur = 5
    ctx.strokeStyle = "rgba(255, 255, 255, 0.4)"
    ctx.lineWidth = 1.5
    ctx.stroke()
    ctx.shadowBlur = 0

    // Draw internal borders (federal states)
    const internalBorders = [
      // Vorarlberg/Tyrol
      [
        { lat: 47.3, lng: 10.2 },
        { lat: 47.5, lng: 10.2 },
      ],
      // Tyrol/Salzburg
      [
        { lat: 47.3, lng: 12.2 },
        { lat: 47.8, lng: 12.2 },
      ],
      // Salzburg/Upper Austria
      [
        { lat: 47.8, lng: 13.2 },
        { lat: 48.3, lng: 13.2 },
      ],
      // Upper Austria/Lower Austria
      [
        { lat: 48.3, lng: 14.5 },
        { lat: 48.7, lng: 14.5 },
      ],
      // Lower Austria/Vienna
      [
        { lat: 48.1, lng: 16.3 },
        { lat: 48.4, lng: 16.3 },
      ],
      // Styria/Burgenland
      [
        { lat: 47.0, lng: 16.0 },
        { lat: 47.5, lng: 16.0 },
      ],
      // Carinthia/Styria
      [
        { lat: 46.8, lng: 14.8 },
        { lat: 47.2, lng: 14.8 },
      ],
    ]

    ctx.strokeStyle = "rgba(255, 255, 255, 0.15)"
    ctx.lineWidth = 0.8

    internalBorders.forEach((border) => {
      ctx.beginPath()
      border.forEach((point, index) => {
        const x = convertLngToX(point.lng, width)
        const y = convertLatToY(point.lat, height)

        if (index === 0) {
          ctx.moveTo(x, y)
        } else {
          ctx.lineTo(x, y)
        }
      })
      ctx.stroke()
    })

    // Add terrain texture
    addTerrainTexture(ctx, width, height)
  }

  // Add terrain texture
  const addTerrainTexture = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    // Draw mountain ranges
    const mountains = [
      // Alps
      { lat: 47.2, lng: 10.8, size: 30 },
      { lat: 47.3, lng: 11.5, size: 25 },
      { lat: 47.1, lng: 12.3, size: 28 },
      { lat: 47.0, lng: 13.2, size: 22 },
      // Other mountain ranges
      { lat: 47.7, lng: 14.2, size: 20 },
      { lat: 47.5, lng: 15.0, size: 18 },
      { lat: 46.8, lng: 13.8, size: 24 },
    ]

    mountains.forEach((mountain) => {
      const x = convertLngToX(mountain.lng, width)
      const y = convertLatToY(mountain.lat, height)

      // Draw mountain symbol
      const mountainGradient = ctx.createRadialGradient(x, y, 0, x, y, mountain.size)
      mountainGradient.addColorStop(0, "rgba(255, 255, 255, 0.1)")
      mountainGradient.addColorStop(1, "rgba(255, 255, 255, 0)")

      ctx.fillStyle = mountainGradient
      ctx.beginPath()
      ctx.arc(x, y, mountain.size, 0, Math.PI * 2)
      ctx.fill()

      // Draw mountain peak
      ctx.fillStyle = "rgba(255, 255, 255, 0.2)"
      ctx.beginPath()
      ctx.moveTo(x - 5, y + 5)
      ctx.lineTo(x, y - 5)
      ctx.lineTo(x + 5, y + 5)
      ctx.closePath()
      ctx.fill()
    })

    // Draw rivers
    const rivers = [
      // Danube
      [
        { lat: 48.6, lng: 13.7 },
        { lat: 48.5, lng: 14.5 },
        { lat: 48.3, lng: 15.3 },
        { lat: 48.2, lng: 16.4 },
        { lat: 48.1, lng: 17.0 },
      ],
      // Inn
      [
        { lat: 47.3, lng: 10.2 },
        { lat: 47.4, lng: 10.7 },
        { lat: 47.5, lng: 11.3 },
        { lat: 47.7, lng: 12.0 },
      ],
      // Mur
      [
        { lat: 47.1, lng: 14.2 },
        { lat: 47.0, lng: 15.0 },
        { lat: 46.8, lng: 15.5 },
        { lat: 46.7, lng: 16.0 },
      ],
    ]

    ctx.strokeStyle = "rgba(52, 152, 219, 0.4)"
    ctx.lineWidth = 1.5

    rivers.forEach((river) => {
      ctx.beginPath()
      river.forEach((point, index) => {
        const x = convertLngToX(point.lng, width)
        const y = convertLatToY(point.lat, height)

        if (index === 0) {
          ctx.moveTo(x, y)
        } else {
          ctx.lineTo(x, y)
        }
      })
      ctx.stroke()
    })
  }

  // Draw major Austrian cities with improved styling
  const drawMajorCities = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const cities = [
      { name: "Vienna", lat: 48.2082, lng: 16.3738, size: 6 },
      { name: "Graz", lat: 47.0707, lng: 15.4395, size: 5 },
      { name: "Linz", lat: 48.3064, lng: 14.2858, size: 5 },
      { name: "Salzburg", lat: 47.8031, lng: 13.0447, size: 5 },
      { name: "Innsbruck", lat: 47.2654, lng: 11.3927, size: 5 },
      { name: "Klagenfurt", lat: 46.6228, lng: 14.3051, size: 4 },
      { name: "Villach", lat: 46.6111, lng: 13.8558, size: 4 },
      { name: "Wels", lat: 48.1575, lng: 14.0289, size: 4 },
      { name: "St. Pölten", lat: 48.2047, lng: 15.6256, size: 4 },
      { name: "Dornbirn", lat: 47.4125, lng: 9.7417, size: 4 },
    ]

    cities.forEach((city) => {
      const x = convertLngToX(city.lng, width)
      const y = convertLatToY(city.lat, height)

      // Draw city glow
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, city.size * 3)
      gradient.addColorStop(0, "rgba(255, 255, 255, 0.3)")
      gradient.addColorStop(1, "rgba(255, 255, 255, 0)")

      ctx.fillStyle = gradient
      ctx.beginPath()
      ctx.arc(x, y, city.size * 3, 0, Math.PI * 2)
      ctx.fill()

      // Draw city dot
      ctx.beginPath()
      ctx.arc(x, y, city.size, 0, Math.PI * 2)
      ctx.fillStyle = "rgba(255, 255, 255, 0.8)"
      ctx.fill()

      // Draw city name with shadow
      ctx.shadowColor = "rgba(0, 0, 0, 0.5)"
      ctx.shadowBlur = 2
      ctx.shadowOffsetX = 1
      ctx.shadowOffsetY = 1
      ctx.font = `${city.size + 4}px "Noto Sans", sans-serif`
      ctx.fillStyle = "rgba(255, 255, 255, 0.9)"
      ctx.textAlign = "center"
      ctx.fillText(city.name, x, y - city.size - 5)
      ctx.shadowBlur = 0
      ctx.shadowOffsetX = 0
      ctx.shadowOffsetY = 0
    })
  }

  // Draw location markers with improved styling
  const drawLocationMarkers = (
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    locations: Location[],
    selectedLocationId: string | null,
    highlightAll: boolean,
  ) => {
    locations.forEach((location) => {
      const x = convertLngToX(location.lng, width)
      const y = convertLatToY(location.lat, height)

      const isSelected = location.id === selectedLocationId
      const shouldHighlight = highlightAll || isSelected

      // Draw marker glow
      const glowSize = isSelected ? 25 : 20
      const glowColor = shouldHighlight ? "rgba(231, 76, 60, 0.3)" : "rgba(52, 152, 219, 0.3)"

      const gradient = ctx.createRadialGradient(x, y, 0, x, y, glowSize)
      gradient.addColorStop(0, glowColor)
      gradient.addColorStop(1, "rgba(0, 0, 0, 0)")

      ctx.fillStyle = gradient
      ctx.beginPath()
      ctx.arc(x, y, glowSize, 0, Math.PI * 2)
      ctx.fill()

      // Draw marker pin
      const pinSize = isSelected ? 12 : 10

      // Draw pin head
      ctx.beginPath()
      ctx.arc(x, y, pinSize, 0, Math.PI * 2)
      ctx.fillStyle = shouldHighlight ? "rgba(231, 76, 60, 0.9)" : "rgba(52, 152, 219, 0.9)"
      ctx.fill()

      // Draw pin border
      ctx.strokeStyle = shouldHighlight ? "rgba(231, 76, 60, 1)" : "rgba(52, 152, 219, 1)"
      ctx.lineWidth = 2
      ctx.stroke()

      // Draw inner circle
      ctx.beginPath()
      ctx.arc(x, y, pinSize * 0.6, 0, Math.PI * 2)
      ctx.fillStyle = "rgba(255, 255, 255, 0.7)"
      ctx.fill()

      // Draw location name if selected
      if (isSelected) {
        // Draw name background
        const nameWidth = location.name.length * 7 + 20
        const nameHeight = 24

        ctx.fillStyle = "rgba(0, 0, 0, 0.6)"
        ctx.beginPath()
        ctx.roundRect(x - nameWidth / 2, y - nameHeight - 15, nameWidth, nameHeight, 5)
        ctx.fill()

        // Draw name text with shadow
        ctx.shadowColor = "rgba(0, 0, 0, 0.5)"
        ctx.shadowBlur = 2
        ctx.font = 'bold 14px "Noto Sans", sans-serif'
        ctx.fillStyle = "#ffffff"
        ctx.textAlign = "center"
        ctx.fillText(location.name, x, y - 25)
        ctx.shadowBlur = 0
      }
    })
  }

  return (
    <div className="relative w-full h-full">
      <div ref={mapRef} className="w-full h-full bg-muted"></div>

      {/* Tooltip */}
      {hoveredLocation && (
        <div
          className="absolute z-10 bg-card p-3 rounded-custom shadow-lg text-sm"
          style={{
            left: `${tooltipPosition.x}px`,
            top: `${tooltipPosition.y}px`,
            transform: "translate(-50%, -100%)",
            pointerEvents: "none",
            maxWidth: "250px",
          }}
        >
          <h3 className="font-medium">{hoveredLocation.name}</h3>
          <p className="text-muted-foreground text-xs">{hoveredLocation.address}</p>
          <div className="mt-1 flex items-center">
            <Briefcase className="h-3 w-3 mr-1" />
            <span className="text-xs">{locations.filter((loc) => loc.id === hoveredLocation.id).length} cases</span>
          </div>
        </div>
      )}

      {/* Deselect button for mobile */}
      {selectedLocationId && (
        <button
          onClick={() => onLocationSelect(null)}
          className="absolute top-4 right-4 z-10 p-2 bg-card rounded-full shadow-lg md:hidden"
          aria-label="Deselect location"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  )
}

