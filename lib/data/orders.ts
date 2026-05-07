import type { Order, Customer, Insight } from "@/types";
import { products } from "./products";

const item = (id: string, qty: number) => {
  const p = products.find((x) => x.id === id)!;
  return { productId: p.id, name: p.name, image: p.image, qty, price: p.price };
};

export const orders: Order[] = [
  {
    id: "ORD-10472",
    customer: "Anaya Kapoor",
    email: "anaya.k@example.com",
    phone: "+91 98765 43210",
    channel: "Website",
    items: [item("p_001", 1), item("p_006", 1)],
    total: 32000 + 9800,
    status: "Out for Delivery",
    placedAt: "2026-05-02T10:24:00Z",
    expectedDelivery: "2026-05-06",
    address: "12 Walkeshwar Road, Mumbai 400006",
    trackingId: "BD-IN-9824413",
  },
  {
    id: "ORD-10471",
    customer: "Priya Mehta",
    phone: "+91 90876 23456",
    channel: "WhatsApp",
    items: [item("p_003", 1)],
    total: 28900,
    status: "Packed",
    placedAt: "2026-05-04T08:10:00Z",
    expectedDelivery: "2026-05-08",
    address: "Banjara Hills, Hyderabad 500034",
  },
  {
    id: "ORD-10470",
    customer: "Sneha Iyer",
    email: "sneha.iyer@example.com",
    channel: "Instagram",
    items: [item("p_002", 1), item("p_011", 1)],
    total: 14500 + 11200,
    status: "Shipped",
    placedAt: "2026-05-03T16:42:00Z",
    expectedDelivery: "2026-05-07",
    address: "T. Nagar, Chennai 600017",
    trackingId: "BD-IN-9824338",
  },
  {
    id: "ORD-10469",
    customer: "Ritika Bansal",
    email: "ritika.b@example.com",
    channel: "Website",
    items: [item("p_005", 1)],
    total: 41500,
    status: "Confirmed",
    placedAt: "2026-05-05T11:00:00Z",
    expectedDelivery: "2026-05-10",
  },
  {
    id: "ORD-10468",
    customer: "Meera Nair",
    channel: "WhatsApp",
    items: [item("p_009", 2), item("p_008", 1)],
    total: 4200 * 2 + 5400,
    status: "Delivered",
    placedAt: "2026-04-28T09:15:00Z",
  },
  {
    id: "ORD-10467",
    customer: "Aditi Rao",
    channel: "Website",
    items: [item("p_012", 1)],
    total: 29900,
    status: "Placed",
    placedAt: "2026-05-05T20:30:00Z",
  },
  {
    id: "ORD-10466",
    customer: "Tara Singh",
    channel: "Instagram",
    items: [item("p_004", 1)],
    total: 12900,
    status: "Delivered",
    placedAt: "2026-04-25T13:00:00Z",
  },
];

export const customers: Customer[] = [
  {
    id: "C-1001",
    name: "Anaya Kapoor",
    email: "anaya.k@example.com",
    phone: "+91 98765 43210",
    channel: "Website",
    totalOrders: 9,
    totalSpend: 184500,
    joinedAt: "2024-08-12",
    segment: "VIP",
    city: "Mumbai",
  },
  {
    id: "C-1002",
    name: "Priya Mehta",
    email: "priya.m@example.com",
    phone: "+91 90876 23456",
    channel: "WhatsApp",
    totalOrders: 6,
    totalSpend: 122400,
    joinedAt: "2025-01-04",
    segment: "VIP",
    city: "Hyderabad",
  },
  {
    id: "C-1003",
    name: "Sneha Iyer",
    email: "sneha.iyer@example.com",
    phone: "+91 99887 76655",
    channel: "Instagram",
    totalOrders: 3,
    totalSpend: 47200,
    joinedAt: "2025-09-02",
    segment: "Regular",
    city: "Chennai",
  },
  {
    id: "C-1004",
    name: "Ritika Bansal",
    email: "ritika.b@example.com",
    phone: "+91 91234 56789",
    channel: "Website",
    totalOrders: 1,
    totalSpend: 41500,
    joinedAt: "2026-04-30",
    segment: "New",
    city: "Delhi",
  },
  {
    id: "C-1005",
    name: "Meera Nair",
    email: "meera.n@example.com",
    phone: "+91 98876 11223",
    channel: "WhatsApp",
    totalOrders: 12,
    totalSpend: 96400,
    joinedAt: "2024-03-21",
    segment: "VIP",
    city: "Kochi",
  },
];

export const insights: Insight[] = [
  {
    id: "ins-1",
    title: "Bridal collection trending up",
    description:
      "Heritage Bridal saree views are up 38% this week. Suggest pinning a bridal-only WhatsApp broadcast tonight.",
    impact: "high",
    category: "Sales",
  },
  {
    id: "ins-2",
    title: "Restock Crimson Royal Banarasi",
    description: "Only 4 left of best-selling RV-2401. Average 5/day dispatched — restock by Friday.",
    impact: "high",
    category: "Inventory",
  },
  {
    id: "ins-3",
    title: "Repeat buyer momentum",
    description: "VIP segment grew 12 customers this month. Send a private preview of the Earth Edit drop.",
    impact: "medium",
    category: "Customer",
  },
  {
    id: "ins-4",
    title: "Instagram → Website conversion lifted",
    description: "Reels referrals are converting at 4.2% (vs 2.8% last month). Double down on reel #SR2412.",
    impact: "medium",
    category: "Marketing",
  },
];

export const monthlyRevenue = [
  { month: "Nov", value: 412000 },
  { month: "Dec", value: 538000 },
  { month: "Jan", value: 481000 },
  { month: "Feb", value: 620000 },
  { month: "Mar", value: 715000 },
  { month: "Apr", value: 802000 },
  { month: "May", value: 924000 },
];

export const channelMix = [
  { name: "Website", value: 52 },
  { name: "WhatsApp", value: 28 },
  { name: "Instagram", value: 20 },
];
