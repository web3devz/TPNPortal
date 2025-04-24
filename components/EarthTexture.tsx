"use client"

import { useEffect, useRef } from "react"

// This component creates a canvas with a simple Earth texture
export default function EarthTexture() {
  const canvasRef = useRef(null)

  useEffect(() => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")

    // Set canvas size
    canvas.width = 1024
    canvas.height = 512

    // Create a gradient background (ocean)
    const bgGradient = ctx.createLinearGradient(0, 0, 0, canvas.height)
    bgGradient.addColorStop(0, "#0077be")
    bgGradient.addColorStop(1, "#023e73")

    ctx.fillStyle = bgGradient
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Draw some simple continents
    ctx.fillStyle = "#2d862d"

    // North America
    ctx.beginPath()
    ctx.moveTo(200, 100)
    ctx.bezierCurveTo(220, 150, 250, 180, 280, 200)
    ctx.bezierCurveTo(300, 220, 320, 240, 300, 280)
    ctx.bezierCurveTo(280, 300, 250, 280, 220, 260)
    ctx.bezierCurveTo(180, 240, 150, 200, 180, 150)
    ctx.closePath()
    ctx.fill()

    // South America
    ctx.beginPath()
    ctx.moveTo(300, 300)
    ctx.bezierCurveTo(320, 350, 330, 400, 300, 420)
    ctx.bezierCurveTo(270, 430, 250, 400, 260, 350)
    ctx.closePath()
    ctx.fill()

    // Europe & Africa
    ctx.beginPath()
    ctx.moveTo(500, 150)
    ctx.bezierCurveTo(530, 180, 550, 220, 540, 280)
    ctx.bezierCurveTo(520, 350, 500, 400, 480, 380)
    ctx.bezierCurveTo(450, 350, 470, 300, 480, 250)
    ctx.bezierCurveTo(490, 200, 480, 170, 500, 150)
    ctx.closePath()
    ctx.fill()

    // Asia & Australia
    ctx.beginPath()
    ctx.moveTo(600, 150)
    ctx.bezierCurveTo(650, 180, 700, 200, 750, 180)
    ctx.bezierCurveTo(800, 160, 820, 200, 800, 240)
    ctx.bezierCurveTo(780, 280, 750, 300, 700, 280)
    ctx.bezierCurveTo(650, 260, 620, 240, 600, 200)
    ctx.closePath()
    ctx.fill()

    // Australia
    ctx.beginPath()
    ctx.moveTo(750, 350)
    ctx.bezierCurveTo(780, 370, 800, 380, 780, 400)
    ctx.bezierCurveTo(760, 420, 730, 410, 740, 380)
    ctx.closePath()
    ctx.fill()

    // Add some cloud patterns
    ctx.fillStyle = "rgba(255, 255, 255, 0.3)"
    for (let i = 0; i < 20; i++) {
      const x = Math.random() * canvas.width
      const y = Math.random() * canvas.height
      const radius = 10 + Math.random() * 30

      ctx.beginPath()
      ctx.arc(x, y, radius, 0, Math.PI * 2)
      ctx.fill()
    }

    // Export the canvas as a blob
    canvas.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob)

        // Create a link to download the texture for debugging
        const link = document.createElement("a")
        link.href = url
        link.download = "earth-texture.jpg"
        // Uncomment to auto-download: link.click()

        // Store the URL in localStorage so Globe.tsx can use it
        localStorage.setItem("earthTextureUrl", url)
      }
    }, "image/jpeg")
  }, [])

  return <canvas ref={canvasRef} style={{ display: "none" }} />
}
