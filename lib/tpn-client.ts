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
  TH: { lat: 15.8700, lng: 100.9925, name: "Thailand" },
  KH: { lat: 12.5657, lng: 104.9910, name: "Cambodia" },
  MD: { lat: 47.4116, lng: 28.3699, name: "Moldova" },
  ZA: { lat: -30.5595, lng: 22.9375, name: "South Africa" },
  KZ: { lat: 48.0196, lng: 66.9237, name: "Kazakhstan" },
  KW: { lat: 29.3759, lng: 47.9774, name: "Kuwait" },
  CA: { lat: 56.1304, lng: -106.3468, name: "Canada" },
  TR: { lat: 38.9637, lng: 35.2433, name: "Turkey" },
  DE: { lat: 51.1657, lng: 10.4515, name: "Germany" },
  EG: { lat: 26.8206, lng: 30.8025, name: "Egypt" },
  MK: { lat: 41.6086, lng: 21.7453, name: "North Macedonia" },
  QA: { lat: 25.276987, lng: 51.520008, name: "Qatar" },
  MM: { lat: 21.9162, lng: 95.9560, name: "Myanmar" },
  PH: { lat: 12.8797, lng: 121.7740, name: "Philippines" },
  BH: { lat: 26.0667, lng: 50.5577, name: "Bahrain" },
  BR: { lat: -14.2350, lng: -51.9253, name: "Brazil" },
  IN: { lat: 20.5937, lng: 78.9629, name: "India" },
  IS: { lat: 64.9631, lng: -19.0208, name: "Iceland" },
  JM: { lat: 18.1096, lng: -77.2975, name: "Jamaica" },
  SI: { lat: 46.1512, lng: 14.9955, name: "Slovenia" },
  SG: { lat: 1.3521, lng: 103.8198, name: "Singapore" },
  BE: { lat: 50.5039, lng: 4.4699, name: "Belgium" },
  UZ: { lat: 41.3775, lng: 64.5853, name: "Uzbekistan" },
  FI: { lat: 61.9241, lng: 25.7482, name: "Finland" },
  BG: { lat: 42.7339, lng: 25.4858, name: "Bulgaria" },
  NP: { lat: 28.3949, lng: 84.1240, name: "Nepal" },
  SA: { lat: 23.8859, lng: 45.0792, name: "Saudi Arabia" },
  MT: { lat: 35.9375, lng: 14.3754, name: "Malta" },
  AT: { lat: 47.5162, lng: 14.5501, name: "Austria" },
  NL: { lat: 52.1326, lng: 5.2913, name: "Netherlands" },
  US: { lat: 37.0902, lng: -95.7129, name: "United States" },
  PE: { lat: -9.1900, lng: -75.0152, name: "Peru" },
  CO: { lat: 4.5709, lng: -74.2973, name: "Colombia" },
  PY: { lat: -23.4425, lng: -58.4438, name: "Paraguay" },
  TW: { lat: 23.6978, lng: 120.9605, name: "Taiwan" },
  BY: { lat: 53.7098, lng: 27.9534, name: "Belarus" },
  OM: { lat: 21.4735, lng: 55.9754, name: "Oman" },
  NG: { lat: 9.0820, lng: 8.6753, name: "Nigeria" },
  CY: { lat: 35.1264, lng: 33.4299, name: "Cyprus" },
  FR: { lat: 46.6034, lng: 1.8883, name: "France" },
  KG: { lat: 41.2044, lng: 74.7661, name: "Kyrgyzstan" },
  NO: { lat: 60.4720, lng: 8.4689, name: "Norway" },
  KR: { lat: 35.9078, lng: 127.7669, name: "South Korea" },
  IL: { lat: 31.0461, lng: 34.8516, name: "Israel" },
  PK: { lat: 30.3753, lng: 69.3451, name: "Pakistan" },
  BO: { lat: -16.2902, lng: -63.5887, name: "Bolivia" },
  AZ: { lat: 40.1431, lng: 47.5769, name: "Azerbaijan" },
  GE: { lat: 42.3154, lng: 43.3569, name: "Georgia" },
  VN: { lat: 14.0583, lng: 108.2772, name: "Vietnam" },
  GR: { lat: 39.0742, lng: 21.8243, name: "Greece" },
  HR: { lat: 45.1000, lng: 15.2000, name: "Croatia" },
  IQ: { lat: 33.2232, lng: 43.6793, name: "Iraq" },
  HU: { lat: 47.1625, lng: 19.5033, name: "Hungary" },
  AM: { lat: 40.0691, lng: 45.0382, name: "Armenia" },
  DK: { lat: 56.2639, lng: 9.5018, name: "Denmark" },
  CZ: { lat: 49.8175, lng: 15.4730, name: "Czech Republic" },
  IE: { lat: 53.4129, lng: -8.2439, name: "Ireland" },
  CL: { lat: -35.6751, lng: -71.5430, name: "Chile" },
  ES: { lat: 40.4637, lng: -3.7492, name: "Spain" },
  MY: { lat: 4.2105, lng: 101.9758, name: "Malaysia" },
  BA: { lat: 43.9159, lng: 17.6791, name: "Bosnia and Herzegovina" },
  LT: { lat: 55.1694, lng: 23.8813, name: "Lithuania" },
  MX: { lat: 23.6345, lng: -102.5528, name: "Mexico" },
  RO: { lat: 45.9432, lng: 24.9668, name: "Romania" },
  ID: { lat: -0.7893, lng: 113.9213, name: "Indonesia" },
  SE: { lat: 60.1282, lng: 18.6435, name: "Sweden" },
  RU: { lat: 61.5240, lng: 105.3188, name: "Russia" },
  MA: { lat: 31.7917, lng: -7.0926, name: "Morocco" },
  AL: { lat: 41.1533, lng: 20.1683, name: "Albania" },
  LU: { lat: 49.8153, lng: 6.1296, name: "Luxembourg" },
  PT: { lat: 39.3999, lng: -8.2245, name: "Portugal" },
  GT: { lat: 15.7835, lng: -90.2308, name: "Guatemala" },
  EE: { lat: 58.5953, lng: 25.0136, name: "Estonia" },
  IT: { lat: 41.8719, lng: 12.5674, name: "Italy" },
  SK: { lat: 48.6690, lng: 19.6990, name: "Slovakia" },
  GB: { lat: 55.3781, lng: -3.4360, name: "United Kingdom" },
  RS: { lat: 44.0165, lng: 21.0059, name: "Serbia" },
  UA: { lat: 48.3794, lng: 31.1656, name: "Ukraine" },
  AE: { lat: 23.4241, lng: 53.8478, name: "United Arab Emirates" },
  CR: { lat: 9.7489, lng: -83.7534, name: "Costa Rica" },
  NZ: { lat: -40.9006, lng: 174.8860, name: "New Zealand" },
  JP: { lat: 36.2048, lng: 138.2529, name: "Japan" },
  PR: { lat: 18.2208, lng: -66.5901, name: "Puerto Rico" },
  PL: { lat: 51.9194, lng: 19.1451, name: "Poland" },
  AU: { lat: -25.2744, lng: 133.7751, name: "Australia" },
  EC: { lat: -1.8312, lng: -78.1834, name: "Ecuador" },
  LV: { lat: 56.8796, lng: 24.6032, name: "Latvia" },
  HK: { lat: 22.3193, lng: 114.1694, name: "Hong Kong" },
  CH: { lat: 46.8182, lng: 8.2275, name: "Switzerland" }
};


// Convert lat/lng to 3D coordinates
export function latLngToVector3(lat: number, lng: number, radius: number) {
  const phi = (90 - lat) * (Math.PI / 180)
  const theta = (lng + 180) * (Math.PI / 180)

  const x = -(radius * Math.sin(phi) * Math.cos(theta))
  const z = radius * Math.sin(phi) * Math.sin(theta)
  const y = radius * Math.cos(phi)

  return [x, y, z]
}
