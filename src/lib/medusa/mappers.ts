import type { HttpTypes } from "@medusajs/types"
import { fallbackProducts } from "@/lib/noir-products/fallback-products"
import { PRICE_PREVIEW_MESSAGE, type NoirProduct } from "./types"

export const NOIR_PRODUCT_HANDLES = new Set([
  "dark-chocolate-coated-almonds",
  "milk-chocolate-coated-almonds",
  "parmesan-cheese-makhana",
  "himalayan-pink-salt-makhana",
  "curated-collection-box",
  "signature-almond-duo",
  "makhana-reserve-pair",
  "corporate-gifting-vault",
])

const MEDUSA_SEED_HANDLES = new Set(["t-shirt", "shorts", "sweatpants", "sweatshirt"])
const MEDUSA_SEED_TITLES = new Set([
  "medusa t-shirt",
  "medusa shorts",
  "medusa sweatpants",
  "medusa sweatshirt",
])

const metadataOf = (product: HttpTypes.StoreProduct) =>
  (product.metadata || {}) as Record<string, unknown>

const metadataText = (metadata: Record<string, unknown>, key: string) => {
  const value = metadata[key]
  return typeof value === "string" && value.trim() ? value.trim() : undefined
}

export function isNoirOakProduct(product: HttpTypes.StoreProduct) {
  const metadata = metadataOf(product)
  const brand = typeof metadata.brand === "string" ? metadata.brand.trim().toUpperCase() : ""
  const collectionTitle = product.collection?.title?.toUpperCase() || ""
  if (
    (product.handle && MEDUSA_SEED_HANDLES.has(product.handle)) ||
    MEDUSA_SEED_TITLES.has((product.title || "").trim().toLowerCase())
  ) {
    return false
  }
  return (
    brand === "NOIR & OAK" ||
    metadata.noirOak === true ||
    collectionTitle.includes("NOIR") ||
    Boolean(product.handle && NOIR_PRODUCT_HANDLES.has(product.handle))
  )
}

function formattedPrice(product: HttpTypes.StoreProduct) {
  const calculated = product.variants?.find((variant) => variant.calculated_price)?.calculated_price
  if (typeof calculated?.calculated_amount !== "number" || !calculated.currency_code) return undefined
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: calculated.currency_code.toUpperCase(),
    maximumFractionDigits: calculated.currency_code.toLowerCase() === "inr" ? 0 : 2,
  }).format(calculated.calculated_amount)
}

export function mapMedusaProductToNoirProduct(product: HttpTypes.StoreProduct): NoirProduct {
  const metadata = metadataOf(product)
  const brandedFallback = fallbackProducts.find((item) => item.slug === product.handle)
  const images = [product.thumbnail, ...(product.images || []).map((image) => image.url)]
    .filter((url, index, all): url is string => Boolean(url) && all.indexOf(url) === index)
  const variantId = product.variants?.[0]?.id
  const fallbackDescription = brandedFallback?.shortDescription ||
    "A considered NOIR & OAK piece prepared for the current private release."
  const category = metadataText(metadata, "category") || product.collection?.title || brandedFallback?.category || "Member Preview"
  const batchCode = metadataText(metadata, "batchCode") || brandedFallback?.batchCode || "LOT 1"
  const finish = metadataText(metadata, "finish") || brandedFallback?.finish || "Refined finish selected for the current release"
  const texture = metadataText(metadata, "texture") || brandedFallback?.texture || "Crafted for premium gifting presentation"
  const packaging = metadataText(metadata, "packaging") || brandedFallback?.packaging || "Matte black NOIR & OAK packaging"

  return {
    id: brandedFallback?.id || product.handle || product.id,
    medusaId: product.id,
    variantId,
    slug: product.handle || brandedFallback?.slug || product.id,
    name: product.title || brandedFallback?.name || "NOIR & OAK Selection",
    category,
    badge: metadataText(metadata, "badge") || brandedFallback?.badge || "Member Preview",
    batchCode,
    finish,
    texture,
    packaging,
    weight: metadataText(metadata, "weight") || brandedFallback?.weight || "See product details",
    status: metadataText(metadata, "status") || metadataText(metadata, "availability") || brandedFallback?.status || "Member Preview",
    shortDescription: product.description?.trim() || brandedFallback?.shortDescription || fallbackDescription,
    longDescription: product.description?.trim() || brandedFallback?.longDescription || fallbackDescription,
    price: formattedPrice(product) || brandedFallback?.price,
    images: images.length ? images : brandedFallback?.images || ["/images/products/curated-collection-box.png"],
    availableForSale: Boolean(variantId),
    source: "medusa",
    lockedPrice: PRICE_PREVIEW_MESSAGE,
    imagePlaceholder: brandedFallback?.imagePlaceholder || "linear-gradient(to bottom right, #171512, #050403)",
    batchNumber: brandedFallback?.batchNumber || `LOT 1 / ${batchCode}`,
    storage: metadataText(metadata, "storage") || brandedFallback?.storage || "Store cool and dry, away from direct sunlight",
    pairing: metadataText(metadata, "pairing") || brandedFallback?.pairing || "Prepared for considered table and gifting service",
    giftingUse: metadataText(metadata, "giftingUse") || brandedFallback?.giftingUse || "Private table or gifting selection",
    reserveStatus: brandedFallback?.reserveStatus || "Pre-paid reservation",
    releaseStatus: brandedFallback?.releaseStatus || "Lot 1 preview",
    ingredientNote: brandedFallback?.ingredientNote || "Ingredient details are confirmed on the product label.",
    sensory: brandedFallback?.sensory || {
      see: finish,
      touch: texture,
      aroma: "A considered aroma profile for this selection",
      sound: "A clean opening and tasting experience",
      taste: product.description?.trim() || fallbackDescription,
    },
    stock: brandedFallback?.stock ?? null,
    isPrivate: brandedFallback?.isPrivate ?? true,
    isFeatured: brandedFallback?.isFeatured ?? false,
  }
}
