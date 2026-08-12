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

export function getReservationById(id: string) {
  return demoReservations.find((reservation) => reservation.id === id) || null
}

export function formatReservationTotal(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount)
}
