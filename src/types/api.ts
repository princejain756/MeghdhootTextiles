export type Role = "ADMIN" | "USER";

export interface ApiUser {
  id: string;
  email: string;
  username: string;
  role: Role;
  fullName?: string | null;
  phone?: string | null;
  companyName?: string | null;
  createdAt: string;
}

export interface ProductImage {
  id: string;
  url: string;
  alt?: string | null;
  position: number;
}

export interface ProductVideo {
  id: string;
  url: string;
  position: number;
}

export interface Category {
  id: string;
  name: string;
  description?: string | null;
}

export interface ProductCategory {
  category: Category;
}

export interface ApiProduct {
  id: string;
  name: string;
  slug: string;
  summary?: string | null;
  description?: string | null;
  price: string;
  currency: string;
  sku?: string | null;
  stock: number;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
  images: ProductImage[];
  videos: ProductVideo[];
  categories: ProductCategory[];
}

export interface CatalogItem {
  product: ApiProduct;
  position: number;
}

export interface ApiCatalog {
  id: string;
  title: string;
  slug: string;
  description?: string | null;
  category?: string | null;
  status: string;
  downloads: number;
  createdAt: string;
  updatedAt: string;
  items: CatalogItem[];
}

export type OrderStatus = "PENDING" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED";

export interface DeliveryInfo {
  id: string;
  orderId: string;
  courier?: string | null;
  trackingNumber?: string | null;
  status: string;
  estimatedDelivery?: string | null;
  addressLine1: string;
  addressLine2?: string | null;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  instructions?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  id: string;
  quantity: number;
  price: string;
  product: ApiProduct;
}

export interface ApiOrder {
  id: string;
  userId: string;
  status: OrderStatus;
  total: string;
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
  delivery?: DeliveryInfo | null;
}

export type SupportStatus = "OPEN" | "IN_PROGRESS" | "RESOLVED" | "CLOSED";

export interface SupportResponse {
  id: string;
  authorRole: Role;
  author?: ApiUser | null;
  message: string;
  createdAt: string;
}

export interface SupportTicket {
  id: string;
  subject: string;
  message: string;
  status: SupportStatus;
  orderId?: string | null;
  createdAt: string;
  updatedAt: string;
  responses: SupportResponse[];
}

export interface ApiSuccess<TData> {
  success: true;
  [key: string]: TData | boolean;
}

export type ApiError = {
  success: false;
  message: string;
};
