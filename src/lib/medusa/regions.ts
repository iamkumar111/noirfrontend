import { medusa } from "./client"
import type { MedusaRegion } from "./types"

export const NO_REGION_WARNING =
  "No Medusa region found. Please create a region in Medusa Admin."

export async function listRegions(): Promise<MedusaRegion[]> {
  const { regions } = await medusa.store.region.list({
    fields: "id,name,currency_code,*countries",
    limit: 100,
  })
  return regions
}

export async function getDefaultRegion(): Promise<MedusaRegion | null> {
  const regions = await listRegions()
  if (!regions.length) {
    console.warn(NO_REGION_WARNING)
    return null
  }

  const countryCode = (
    process.env.NEXT_PUBLIC_DEFAULT_COUNTRY_CODE || "in"
  ).toLowerCase()
  const countryRegion = regions.find((region) =>
    region.countries?.some((country) => country.iso_2?.toLowerCase() === countryCode)
  )

  if (!countryRegion) {
    console.warn(
      `No Medusa region contains country code ${countryCode.toUpperCase()}. Falling back to ${regions[0].name}.`
    )
  }

  return countryRegion || regions[0]
}

