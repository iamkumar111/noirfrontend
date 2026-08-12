import { medusa } from "./client"
import { isNoirOakProduct, mapMedusaProductToNoirProduct } from "./mappers"
import { getDefaultRegion } from "./regions"
import { fallbackProducts, getFallbackProductBySlug } from "@/lib/noir-products/fallback-products"
import type { NoirProduct } from "./types"
import { PRICE_PREVIEW_MESSAGE } from "./types"

const PRODUCT_FIELDS =
  "id,title,handle,description,thumbnail,metadata,*images,*variants,*variants.calculated_price,*collection"
const PRODUCT_FIELDS_WITHOUT_PRICES =
  "id,title,handle,description,thumbnail,metadata,*images,*variants,*collection"

async function productQueryContext() {
  const region = await getDefaultRegion()
  return {
    fields: region ? PRODUCT_FIELDS : PRODUCT_FIELDS_WITHOUT_PRICES,
    ...(region ? { region_id: region.id } : {}),
  }
}

export async function listProducts(): Promise<NoirProduct[]> {
  try {
    const context = await productQueryContext()
    const { products } = await medusa.store.product.list({ limit: 100, ...context })
    const noirProducts = products.filter(isNoirOakProduct).map(mapMedusaProductToNoirProduct)
    if (noirProducts.length) return noirProducts
  } catch (error) {
    console.warn("Medusa catalog is unavailable. Using fallback NOIR & OAK product data.", error)
    return fallbackProducts
  }

  console.warn("No NOIR & OAK products found in Medusa. Using fallback product data.")
  return fallbackProducts
}

export async function getProductByHandle(handle: string): Promise<NoirProduct | null> {
  const fallback = getFallbackProductBySlug(handle)
  try {
    const context = await productQueryContext()
    const { products } = await medusa.store.product.list({ handle, limit: 1, ...context })
    const product = products[0]
    return product && isNoirOakProduct(product) ? mapMedusaProductToNoirProduct(product) : fallback
  } catch {
    return fallback
  }
}

export async function getProductById(id: string): Promise<NoirProduct | null> {
  try {
    const context = await productQueryContext()
    const { product } = await medusa.store.product.retrieve(id, context)
    return isNoirOakProduct(product) ? mapMedusaProductToNoirProduct(product) : null
  } catch {
    return null
  }
}

export async function listCollections() {
  const { collections } = await medusa.store.collection.list({ limit: 100 })
  return collections
}

export async function listCategories() {
  const { product_categories } = await medusa.store.category.list({ limit: 100 })
  return product_categories
}

export function formatPrice(amount: number | null, currencyCode: string | null) {
  if (amount === null || !currencyCode) return PRICE_PREVIEW_MESSAGE
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: currencyCode.toUpperCase(),
    maximumFractionDigits: currencyCode.toLowerCase() === "inr" ? 0 : 2,
  }).format(amount)
}
