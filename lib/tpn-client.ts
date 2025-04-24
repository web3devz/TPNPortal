// TPN Client for interacting with validators

// List of available validators
const validators = [
  { UID: "0", Axon: "185.189.44.166:3000" },
  { UID: "4", Axon: "185.141.218.102:3000" },
  { UID: "117", Axon: "34.130.136.222:3000" },
  { UID: "186", Axon: "161.35.91.172:3000" },
  { UID: "212", Axon: "192.150.253.122:3000" },
]

// Pick a validator at random
export function pickValidator() {
  const idx = Math.floor(Math.random() * validators.length)
  return validators[idx].Axon
}

// Get all validators
export function getValidators() {
  return validators
}

// Fetch country codes from our API proxy
export async function getCountries() {
  try {
    const response = await fetch("/api/countries")
    if (!response.ok) {
      throw new Error(`Failed to fetch countries: ${response.statusText}`)
    }
    return await response.json()
  } catch (error) {
    console.error("Error fetching countries:", error)
    throw error
  }
}

// Create a lease through our API proxy
export async function createLease(countryCode: string, minutes: number) {
  try {
    const params = new URLSearchParams({
      geo: countryCode,
      lease_minutes: minutes.toString(),
    })

    const response = await fetch(`/api/lease?${params}`)

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.error || `Failed to create lease: ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Error creating lease:", error)
    throw error
  }
}

// Get metrics for all validators through our API proxy
export async function getValidatorMetrics() {
  try {
    const response = await fetch("/api/metrics")

    if (!response.ok) {
      throw new Error(`Failed to fetch validator metrics: ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Error fetching validator metrics:", error)
    throw error
  }
}

// Country data for the globe
export const countryPositions = {
  US: { lat: 37.0902, lng: -95.7129, name: "United States" },
  NL: { lat: 52.1326, lng: 5.2913, name: "Netherlands" },
  DE: { lat: 51.1657, lng: 10.4515, name: "Germany" },
  GB: { lat: 55.3781, lng: -3.436, name: "United Kingdom" },
  JP: { lat: 36.2048, lng: 138.2529, name: "Japan" },
  SG: { lat: 1.3521, lng: 103.8198, name: "Singapore" },
  AU: { lat: -25.2744, lng: 133.7751, name: "Australia" },
  BR: { lat: -14.235, lng: -51.9253, name: "Brazil" },
  IN: { lat: 20.5937, lng: 78.9629, name: "India" },
  ZA: { lat: -30.5595, lng: 22.9375, name: "South Africa" },
}

// Convert lat/lng to 3D coordinates
export function latLngToVector3(lat: number, lng: number, radius: number) {
  const phi = (90 - lat) * (Math.PI / 180)
  const theta = (lng + 180) * (Math.PI / 180)

  const x = -(radius * Math.sin(phi) * Math.cos(theta))
  const z = radius * Math.sin(phi) * Math.sin(theta)
  const y = radius * Math.cos(phi)

  return [x, y, z]
}
