import { NextResponse } from "next/server"
import { getValidators } from "@/lib/tpn-client"

// Helper function to measure latency to a validator
async function pingValidator(host: string): Promise<number> {
  const url = `http://${host}/api/config/countries`
  const start = Date.now()

  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 2000)

    const response = await fetch(url, {
      signal: controller.signal,
      cache: "no-store",
    })

    clearTimeout(timeoutId)

    if (!response.ok) {
      return Number.POSITIVE_INFINITY
    }

    return Date.now() - start
  } catch (error) {
    console.error(`Error pinging validator ${host}:`, error)
    return Number.POSITIVE_INFINITY
  }
}

export async function GET() {
  try {
    const validators = getValidators()

    const results = await Promise.all(
      validators.map(async (validator) => ({
        uid: validator.UID,
        host: validator.Axon,
        latency: await pingValidator(validator.Axon),
      })),
    )

    return NextResponse.json(results.sort((a, b) => a.latency - b.latency))
  } catch (error) {
    console.error("Error fetching validator metrics:", error)
    return NextResponse.json({ error: "Failed to fetch validator metrics" }, { status: 500 })
  }
}
