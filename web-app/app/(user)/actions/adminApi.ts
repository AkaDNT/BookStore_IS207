"use server";

import { fetchWrapper } from "@/lib/fetchWrapper";

export type ApiError = { error: { status: string; message: string } };

// ===== DASHBOARD =====
export type DashboardStats = {
  usersCount: number;
  customersCount: number;
  employeesCount: number;
  booksCount: number;
  ordersCount: number;
  revenueAll: number;
  revenuePaid: number;
};

export async function getDashboardStats(): Promise<DashboardStats | ApiError> {
  return await fetchWrapper.get("/manage/dashboard-stats");
}

// ===== USERS =====
export type AdminUser = {
  id: number;
  userName: string;
  email: string;
  roles: string[];
};

export type CreateUserPayload = {
  userName: string;
  email: string;
  password: string;
  roles?: string[];
};

export type UpdateUserPayload = {
  updatedUserId: number;
  userName?: string;
  email?: string;
  roles?: string[];
};

export async function getAllUsers(): Promise<AdminUser[] | ApiError> {
  return await fetchWrapper.get("/manage/get-all-users");
}
export async function searchUsers(
  term: string
): Promise<AdminUser[] | ApiError> {
  const q = encodeURIComponent(term ?? "");
  return await fetchWrapper.get(`/manage/search/users?searchTerm=${q}`);
}

export async function getAllCustomers(): Promise<AdminUser[] | ApiError> {
  return await fetchWrapper.get("/manage/get-all-customers");
}
export async function searchCustomers(
  term: string
): Promise<AdminUser[] | ApiError> {
  const q = encodeURIComponent(term ?? "");
  return await fetchWrapper.get(`/manage/search/customers?searchTerm=${q}`);
}

export async function getAllEmployees(): Promise<AdminUser[] | ApiError> {
  return await fetchWrapper.get("/manage/get-all-employees");
}
export async function searchEmployees(
  term: string
): Promise<AdminUser[] | ApiError> {
  const q = encodeURIComponent(term ?? "");
  return await fetchWrapper.get(`/manage/search/employees?searchTerm=${q}`);
}

export async function createUser(
  payload: CreateUserPayload
): Promise<AdminUser | ApiError> {
  return await fetchWrapper.post("/manage/user", payload);
}
export async function updateUser(
  payload: UpdateUserPayload
): Promise<AdminUser | ApiError> {
  return await fetchWrapper.patch("/manage/user", payload);
}
export async function deleteUser(userId: number): Promise<unknown | ApiError> {
  return await fetchWrapper.del(`/manage/user/${userId}`);
}

// ===== ORDERS =====
export type AdminOrderItem = {
  orderItemId: number;
  bookId: number;
  title: string | null;
  quantity: number;
  discount: number;
  orderedBookPrice: number;
  imageUrl?: string | null;
};

export type AdminPayment = {
  paymentId: number;
  paymentMethod: string;
  pgPaymentId?: string | null;
  pgStatus?: string | null;
  pgResponseMessage?: string | null;
  pgName?: string | null;
} | null;

export type AdminOrder = {
  orderId: number;
  orderCode: string;
  email: string;
  orderDate: string; // backend trả string
  createdAt?: string | null;
  paidAt?: string | null;
  totalAmount: number;
  orderStatus: string;
  paymentStatus: string;
  addressId: number;
  payment: AdminPayment;
  orderItems: AdminOrderItem[];
};

export async function getAllOrders(): Promise<AdminOrder[] | ApiError> {
  return await fetchWrapper.get("/manage/orders");
}

export async function getOrderById(
  orderId: number
): Promise<AdminOrder | ApiError> {
  return await fetchWrapper.get(`/manage/orders/${orderId}`);
}

export async function getOrderByCode(
  orderCode: string
): Promise<AdminOrder | ApiError> {
  const c = encodeURIComponent(orderCode);
  return await fetchWrapper.get(`/manage/orders/by-code/${c}`);
}

export async function updateOrderStatus(
  orderId: number,
  orderStatus: string
): Promise<AdminOrder | ApiError> {
  return await fetchWrapper.patch(`/manage/orders/${orderId}/status`, {
    orderStatus,
  });
}

export async function updatePaymentStatus(
  orderId: number,
  paymentStatus: string
): Promise<AdminOrder | ApiError> {
  return await fetchWrapper.patch(`/manage/orders/${orderId}/payment-status`, {
    paymentStatus,
  });
}

export async function searchOrders(
  term: string
): Promise<AdminOrder[] | ApiError> {
  const q = encodeURIComponent(term ?? "");
  return await fetchWrapper.get(`/manage/orders/search?searchTerm=${q}`);
}
