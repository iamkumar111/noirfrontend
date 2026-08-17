export type ReservationStatus =
  | "Reservation Confirmed"
  | "Preparing"
  | "Dispatched"
  | "Delivered"
  | "Payment Pending"

export type ReservationItem = {
  name: string
  quantity: number
  unitPrice: number
}

export type ReservationTimelineEntry = {
  label: string
  date: string
  note: string
}

export type Reservation = {
  id: string
  date: string
  status: ReservationStatus
  total: number
  subtotal: number
  shipping: number
  tax: number
  paymentStatus: "Payment confirmed" | "Payment pending"
  paymentMethod: string
  items: ReservationItem[]
  deliveryAddress?: string[]
  timeline: ReservationTimelineEntry[]
}

export type DemoReservationInput = {
  items: ReservationItem[]
  paymentMethod: string
  deliveryAddress: string[]
}

const DEMO_RESERVATIONS_STORAGE_KEY = "noir_oak_demo_reservations"

// TODO: replace these member-history previews with Medusa customer orders when
// customer order access is configured. Keep all storefront data client-safe.
export const demoReservations: Reservation[] = [
  {
    id: "NOIR-OAK-001",
    date: "10 Sept 2026",
    status: "Reservation Confirmed",
    subtotal: 2499,
    shipping: 0,
    tax: 0,
    total: 2499,
    paymentStatus: "Payment confirmed",
    paymentMethod: "UPI",
    items: [{ name: "The Curated Collection Box", quantity: 1, unitPrice: 2499 }],
    deliveryAddress: ["Member delivery address", "New Delhi, Delhi 110001", "India"],
    timeline: [
      { label: "Reservation confirmed", date: "10 Sept 2026", note: "Your pre-paid reservation was secured." },
      { label: "Release allocation", date: "11 Sept 2026", note: "A numbered Lot 1 batch card is being assigned." },
    ],
  },
  {
    id: "NOIR-OAK-002",
    date: "12 Sept 2026",
    status: "Preparing",
    subtotal: 1498,
    shipping: 0,
    tax: 0,
    total: 1498,
    paymentStatus: "Payment confirmed",
    paymentMethod: "Card",
    items: [
      { name: "Dark Chocolate Coated Almonds", quantity: 1, unitPrice: 899 },
      { name: "Parmesan Cheese Makhana", quantity: 1, unitPrice: 599 },
    ],
    deliveryAddress: ["Member delivery address", "Mumbai, Maharashtra 400001", "India"],
    timeline: [
      { label: "Reservation confirmed", date: "12 Sept 2026", note: "Your payment and private selection were recorded." },
      { label: "Preparing release", date: "13 Sept 2026", note: "The selected Lot 1 pieces are being prepared for dispatch." },
    ],
  },
]

function storedDemoReservations(): Reservation[] {
  if (typeof window === "undefined") return []
  try {
    const value = window.localStorage.getItem(DEMO_RESERVATIONS_STORAGE_KEY)
    const reservations = value ? JSON.parse(value) : []
    return Array.isArray(reservations) ? reservations as Reservation[] : []
  } catch {
    return []
  }
}

export function getReservations() {
  return [...storedDemoReservations(), ...demoReservations]
}

export function getReservationById(id: string) {
  return getReservations().find((reservation) => reservation.id === id) || null
}

export function createDemoReservation({ items, paymentMethod, deliveryAddress }: DemoReservationInput): Reservation {
  const now = new Date()
  const total = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0)
  const reservation: Reservation = {
    id: `NOIR-OAK-DEMO-${now.getTime().toString(36).toUpperCase()}`,
    date: new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", year: "numeric" }).format(now),
    status: "Reservation Confirmed",
    subtotal: total,
    shipping: 0,
    tax: 0,
    total,
    paymentStatus: "Payment confirmed",
    paymentMethod: `${paymentMethod} · Demo`,
    items,
    deliveryAddress,
    timeline: [
      { label: "Demo order confirmed", date: now.toLocaleDateString("en-IN"), note: "This local demo order was created without collecting or processing payment." },
      { label: "Release allocation", date: "Next step", note: "A production reservation will use the live order and payment service." },
    ],
  }
  if (typeof window !== "undefined") {
    window.localStorage.setItem(DEMO_RESERVATIONS_STORAGE_KEY, JSON.stringify([reservation, ...storedDemoReservations()]))
  }
  return reservation
}

export function formatReservationTotal(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount)
}
