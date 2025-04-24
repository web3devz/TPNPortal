import { NextResponse } from "next/server"
import { pickValidator } from "@/lib/tpn-client"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const countryCode = searchParams.get("geo")
    const minutes = searchParams.get("lease_minutes")

    if (!countryCode || !minutes) {
      return NextResponse.json({ error: "Missing required parameters: geo and lease_minutes" }, { status: 400 })
    }

    const host = pickValidator()
    const url = `http://${host}/api/config/new`
    const params = new URLSearchParams({
      format: "json",
      geo: countryCode,
      lease_minutes: minutes,
    })

    const response = await fetch(`${url}?${params}`, { cache: "no-store" })

    if (!response.ok) {
      throw new Error(`Failed to create lease: ${response.statusText}`)
    }

    const data = await response.json()
    return NextResponse.json({
      config: data.peer_config,
      expiresAt: data.expires_at,
    })
  } catch (error) {
    console.error("Error creating lease:", error)
    return NextResponse.json({ error: "Failed to create lease" }, { status: 500 })
  }
}
