/**
 * API DTOs — mirrors the Prisma shapes the backend returns. Money fields
 * are paise (integer); use `formatINR` from `lib/format` to display.
 */

export interface ApiUser {
  id: string;
  email: string | null;
  phone: string | null;
  firstName: string | null;
  lastName: string | null;
  role: "CUSTOMER" | "STAFF" | "ADMIN";
  status: "ACTIVE" | "SUSPENDED" | "DELETED";
  emailVerified: boolean;
  phoneVerified: boolean;
  avatarUrl: string | null;
  createdAt: string;
}

export interface ApiProductImage {
  id: string;
  url: string;
  alt: string | null;
  position: number;
  isPrimary: boolean;
}

export interface ApiInventory {
  id: string;
  productId: string;
  onHand: number;
  reserved: number;
  reorderPoint: number;
}

export interface ApiVariant {
  id: string;
  productId: string;
  sku: string;
  blouseSize: string | null;
  color: string | null;
  priceDelta: number;
  stock: number;
  isActive: boolean;
}

export interface ApiCategoryRef {
  id: string;
  name: string;
  slug: string;
}

export interface ApiProduct {
  id: string;
  code: string;
  slug: string;
  title: string;
  shortDescription: string | null;
  description: string;
  story: string | null;
  categoryId: string;
  category?: ApiCategoryRef;
  fabric: string;
  collection: string | null;
  craftedIn: string | null;
  price: number;
  comparePrice: number | null;
  status: "DRAFT" | "ACTIVE" | "ARCHIVED";
  isFeatured: boolean;
  isTrending: boolean;
  isLimited: boolean;
  tags: string[];
  occasions: string[];
  colors: string[];
  rating: number;
  reviewCount: number;
  images: ApiProductImage[];
  videos?: { id: string; url: string; poster: string | null }[];
  variants?: ApiVariant[];
  inventory?: ApiInventory;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ApiCategory {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  imageUrl: string | null;
  parentId: string | null;
  position: number;
  isActive: boolean;
  children?: ApiCategory[];
}

export type OrderStatus =
  | "PLACED"
  | "CONFIRMED"
  | "PACKED"
  | "SHIPPED"
  | "OUT_FOR_DELIVERY"
  | "DELIVERED"
  | "CANCELLED"
  | "RETURNED"
  | "REFUNDED";

export interface ApiOrderItem {
  id: string;
  productId: string;
  variantId: string | null;
  productCode: string;
  title: string;
  imageUrl: string | null;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
}

export interface ApiOrderTimelineEntry {
  id: string;
  orderId: string;
  status: OrderStatus;
  note: string | null;
  createdAt: string;
}

export interface ApiShipment {
  id: string;
  orderId: string;
  carrier: string | null;
  awbNumber: string | null;
  trackingUrl: string | null;
  status: string;
  pickedUpAt: string | null;
  expectedAt: string | null;
  deliveredAt: string | null;
}

export interface ApiOrder {
  id: string;
  number: string;
  userId: string | null;
  channel: "WEB" | "WHATSAPP" | "INSTAGRAM" | "ADMIN";
  status: OrderStatus;
  subtotal: number;
  discount: number;
  shippingFee: number;
  tax: number;
  total: number;
  items: ApiOrderItem[];
  timeline?: ApiOrderTimelineEntry[];
  shipment?: ApiShipment | null;
  user?: { id: string; email: string | null; firstName: string | null; lastName: string | null } | null;
  placedAt: string;
  confirmedAt: string | null;
  packedAt: string | null;
  shippedAt: string | null;
  deliveredAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ApiAdminOverview {
  generatedAt: string;
  mode: { payment: string; tracking: string; whatsapp: string };
  revenue: { today: number; thisMonth: number };
  orders: { total: number; pending: number; inTransit: number; last7Days: number };
  inventory: { lowStock: number };
  customers: { activeLast30Days: number };
  recentOrders: Array<Pick<ApiOrder, "id" | "number" | "status" | "channel" | "total" | "placedAt"> & {
    user: { id: string; firstName: string | null; lastName: string | null; email: string | null } | null;
    items: { title: string; productCode: string; imageUrl: string | null; quantity: number }[];
  }>;
  topProducts: Array<{
    productId: string;
    product: { id: string; code: string; title: string; slug: string; price: number; images: { url: string }[] } | null;
    unitsSold: number;
    revenue: number;
  }>;
  revenueSeries: { day: string; revenue: number }[];
  channelMix: { channel: string; count: number }[];
}
