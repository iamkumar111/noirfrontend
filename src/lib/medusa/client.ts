import Medusa from "@medusajs/js-sdk"

const backendUrl = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL
const publishableKey = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY

if (!backendUrl) {
  throw new Error(
    "Missing NEXT_PUBLIC_MEDUSA_BACKEND_URL. Add the local Medusa URL to the frontend environment."
  )
}

if (!publishableKey) {
  throw new Error(
    "Missing NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY. Create a publishable API key in Medusa Admin and add it to the frontend environment."
  )
}

export const medusa = new Medusa({
  baseUrl: backendUrl.replace(/\/$/, ""),
  publishableKey,
  auth: {
    type: "jwt",
    // The module is imported by Server and Client Components. Never ask the SDK
    // for browser storage while rendering on the server.
    jwtTokenStorageMethod: typeof window === "undefined" ? "memory" : "local",
    jwtTokenStorageKey: "noir_oak_medusa_customer_token",
  },
})

export const medusaBackendUrl = backendUrl.replace(/\/$/, "")

