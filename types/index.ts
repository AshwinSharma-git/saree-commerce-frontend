export type SareeFabric =
  | "Banarasi Silk"
  | "Kanjivaram Silk"
  | "Mulberry Silk"
  | "Tussar Silk"
  | "Organic Cotton"
  | "Linen"
  | "Chiffon"
  | "Georgette";

export type SareeOccasion = "Wedding" | "Festive" | "Casual" | "Party" | "Office";

export interface Product {
  id: string;
  code: string;
  name: string;
  collection: string;
  fabric: SareeFabric;
  price: number;
  originalPrice?: number;
  rating: number;
  reviews: number;
  image: string;
  gallery: string[];
  colors: string[];
  occasion: SareeOccasion[];
  description: string;
  story?: string;
  craftedIn: string;
  stock: number;
  sku: string;
  tags: string[];
  isNew?: boolean;
  isBestseller?: boolean;
  isLimited?: boolean;
}

export interface CartItem {
  productId: string;
  qty: number;
  size: string;
}

export type OrderStatus =
  | "Placed"
  | "Confirmed"
  | "Packed"
  | "Shipped"
  | "Out for Delivery"
  | "Delivered"
  | "Cancelled";

export interface Order {
  id: string;
  customer: string;
  email?: string;
  phone?: string;
  channel: "Website" | "WhatsApp" | "Instagram";
  items: { productId: string; name: string; image: string; qty: number; price: number }[];
  total: number;
  status: OrderStatus;
  placedAt: string;
  expectedDelivery?: string;
  address?: string;
  trackingId?: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  channel: "Website" | "WhatsApp" | "Instagram";
  totalOrders: number;
  totalSpend: number;
  joinedAt: string;
  segment: "VIP" | "Regular" | "New";
  city: string;
}

export interface Insight {
  id: string;
  title: string;
  description: string;
  impact: "high" | "medium" | "low";
  category: "Sales" | "Inventory" | "Customer" | "Marketing";
}
