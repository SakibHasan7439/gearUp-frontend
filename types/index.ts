export type Role = "CUSTOMER" | "ADMIN" | "PROVIDER";
export type RentalStatus = "PENDING" | "CONFIRMED" | "PICKED_UP" | "RETURNED" | "CANCELLED";
export type PaymentMethod = "STRIPE";
export type PaymentStatus = "PENDING" | "CONFIRMED" | "FAILED";

export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
}

export interface GearItem {
  id: string;
  userId: string;
  categoryId: string;
  category?: Category;
  name: string;
  brand: string;
  price: number;
  description: string;
  totalQuantity: number;
  availableQuantity: number;
  createdAt: string;
  updatedAt: string;
}

export interface RentalOrderItem {
    id: string;
    rentalOrderId: string;
    gearItemId: string;
    gearItem?: GearItem;
    quantity: number;
    startDate: string;
    endDate: string;
    pricePerDay: number;
}

export interface RentalOrder {
  id: string;
  customerId: string;
  status: RentalStatus;
  totalAmount: number;
  createdAt: string;
  updatedAt: string;
  items: RentalOrderItem[];
  payments?: Payment[];
}


export interface Payment {
  id: string;
  transactionId: string;
  rentalOrderId: string;
  amount: number;
  method: PaymentMethod;
  status: PaymentStatus;
  paidAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  id: string;
  customerId: string;
  gearItemId: string;
  rating: number;
  comment: string;
}

export interface JwtUserPayload {
  id: string;
  name: string;
  email: string;
  role: Role;
}

export interface ApiErrorResponse {
  message: string;
  success?: boolean;
}