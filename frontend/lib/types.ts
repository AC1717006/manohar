export interface Category {
  id: string;
  name: string;
  slug: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: string;
  discountPrice: string | null;
  stock: number;
  images: string[];
  featured: boolean;
  categoryId: string;
  category: Category;
  createdAt: string;
  updatedAt: string;
}

export type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "PROCESSING"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED";

export type PaymentMethod = "COD" | "UPI" | "QR";

export interface Customer {
  id: string;
  name: string;
  mobile: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  orders?: { id: string; orderNumber: string; total: string; status: OrderStatus; createdAt: string }[];
}

export interface OrderItem {
  id: string;
  productId: string;
  name: string;
  price: string;
  qty: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  customer: Customer;
  customerId: string;
  items: OrderItem[];
  status: OrderStatus;
  subtotal: string;
  gst: string;
  deliveryCharge: string;
  total: string;
  paymentMethod: PaymentMethod;
  createdAt: string;
}

export interface AdminStats {
  totalOrders: number;
  totalProducts: number;
  pendingOrders: number;
  completedOrders: number;
  revenue: string | number;
}
