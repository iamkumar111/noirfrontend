import type { HttpTypes } from "@medusajs/types"
import { medusa } from "./client"

export async function loginCustomer(email: string, password: string) {
  const result = await medusa.auth.login("customer", "emailpass", { email, password })
  if (typeof result !== "string") throw new Error("Customer login requires an additional authentication step.")
  return getCustomer()
}

export async function registerCustomer(data: HttpTypes.StoreCreateCustomer & { password: string }) {
  const { password, ...customer } = data
  const token = await medusa.auth.register("customer", "emailpass", {
    email: customer.email,
    password,
  })
  if (typeof token !== "string") throw new Error("Customer registration could not be completed.")
  return medusa.store.customer.create(customer, {}, { Authorization: `Bearer ${token}` })
}

export async function getCustomer() {
  const { customer } = await medusa.store.customer.retrieve()
  return customer
}

export async function logoutCustomer() {
  await medusa.auth.logout()
}

