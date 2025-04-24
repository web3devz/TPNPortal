import { NextResponse } from "next/server"
import { pickValidator } from "@/lib/tpn-client"

export async function GET() {
  try {
    const host = pickValidator()
    const url = `http://${host}/api/config/countries`

    const response = await fetch(url, { cache: "no-store" })

    if (!response.ok) {
      throw new Error(`Failed to fetch countries: ${response.statusText}`)
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error fetching countries:", error)
    return NextResponse.json({ error: "Failed to fetch countries" }, { status: 500 })
  }
}
