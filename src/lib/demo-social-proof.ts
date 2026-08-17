import { fallbackProducts } from "@/lib/noir-products/fallback-products"

type DemoProfile = {
  id: string
  firstName: string
  state: string
  productId: string
  productName: string
  productImage?: string
}

const names = [
  "Arjun", "Aditi", "Kabir", "Meera", "Aditya", "Ishita", "Vivaan", "Kavya", "Rohan", "Ananya",
  "Siddharth", "Priya", "Akshay", "Nisha", "Rahul", "Neha", "Manav", "Riya", "Tanvi", "Aarav",
  "Diya", "Karan", "Mira", "Ved", "Ira", "Reyansh", "Avni", "Yash", "Saanvi", "Dev",
  "Aanya", "Krish", "Nivaan", "Tara", "Arnav", "Myra", "Vihaan", "Anika", "Rudra", "Kiara",
  "Aarohi", "Atharv", "Charvi", "Daksh", "Esha", "Farhan", "Gauri", "Harsh", "Inaya", "Jai",
  "Lavanya", "Madhav", "Navya", "Om", "Pari", "Raghav", "Samaira", "Tejas", "Urvi", "Zoya",
]

const states = [
  "Andhra Pradesh", "Assam", "Bihar", "Chandigarh", "Chhattisgarh", "Delhi", "Goa", "Gujarat",
  "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra",
  "Odisha", "Punjab", "Rajasthan", "Tamil Nadu", "Telangana", "Uttar Pradesh", "Uttarakhand", "West Bengal",
]

function seededShuffle<T>(values: T[], seed = 0x4e4f4952) {
  const output = [...values]
  let state = seed >>> 0
  for (let index = output.length - 1; index > 0; index -= 1) {
    state = (state * 1664525 + 1013904223) >>> 0
    const swapIndex = state % (index + 1)
    ;[output[index], output[swapIndex]] = [output[swapIndex], output[index]]
  }
  return output
}

function createDemoProfiles(): DemoProfile[] {
  const combinations: DemoProfile[] = []
  for (const firstName of names) {
    for (const state of states) {
      for (const product of fallbackProducts) {
        combinations.push({
          id: `demo:${firstName}:${state}:${product.slug}`.toLowerCase().replace(/[^a-z0-9:]+/g, "-"),
          firstName,
          state,
          productId: product.slug,
          productName: product.name,
          productImage: product.images[0],
        })
      }
    }
  }
  return combinations
}

// 60 names × 23 states × the current catalogue gives more than 10,000 stable
// combinations. The seeded shuffle keeps the sequence deterministic.
const profiles = seededShuffle(createDemoProfiles()).slice(0, 10_000)

function rotatingSlice<T>(items: T[], count: number) {
  // Advance demo pages between API polls without React render-time randomness.
  const offset = Math.floor(Date.now() / 20_000) % items.length
  return Array.from({ length: Math.min(count, items.length) }, (_, index) => items[(offset + index) % items.length])
}

export function getDemoPurchaseProfiles(limit = 20): DemoProfile[] {
  return rotatingSlice(profiles, limit)
}

export function getDemoViewingProducts() {
  return rotatingSlice(profiles, 10).map((profile, index) => ({
    productId: profile.productId,
    productName: profile.productName,
    productImage: profile.productImage,
    viewerCount: 2 + ((index * 3 + 2) % 7),
    states: [{ state: profile.state, count: 2 + ((index * 3 + 2) % 7) }],
  }))
}
