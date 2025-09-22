import type {
  ApiOrder,
  ApiProduct,
  ApiUser,
  Role,
  SupportResponse,
  SupportTicket,
  SupportStatus,
  ApiCatalog,
} from "@/types/api";

const API_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:5000/api";

type JsonBody = Record<string, unknown> | Array<unknown>;

async function request<TResponse>(path: string, options: RequestInit = {}) {
  const endpoint = `${API_BASE}${path}`;
  const headers = new Headers(options.headers ?? {});
  const isJsonBody =
    options.body &&
    !(
      options.body instanceof FormData ||
      options.body instanceof URLSearchParams ||
      options.body instanceof Blob
    );

  if (isJsonBody && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(endpoint, {
    credentials: "include",
    ...options,
    headers,
  });

  let payload: unknown = null;
  const contentType = response.headers.get("Content-Type") ?? "";

  if (contentType.includes("application/json")) {
    payload = await response.json();
  }

  if (!response.ok) {
    const errorMessage =
      typeof payload === "object" && payload && "message" in payload
        ? String((payload as { message: unknown }).message)
        : `Request failed with status ${response.status}`;

    throw new Error(errorMessage);
  }

  return payload as TResponse;
}

export const AuthApi = {
  register: (body: JsonBody) => request<{ success: true; user: ApiUser }>("/auth/register", {
    method: "POST",
    body: JSON.stringify(body),
  }),
  login: (body: JsonBody) => request<{ success: true; user: ApiUser }>("/auth/login", {
    method: "POST",
    body: JSON.stringify(body),
  }),
  logout: () => request<{ success: true }>("/auth/logout", { method: "POST" }),
  me: () => request<{ success: true; user: ApiUser }>("/auth/me"),
  listUsers: () => request<{ success: true; users: ApiUser[] }>("/auth/users"),
};

export const ProductApi = {
  list: () => request<{ success: true; products: ApiProduct[] }>("/products"),
  create: (body: JsonBody) =>
    request<{ success: true; product: ApiProduct }>("/products", {
      method: "POST",
      body: JSON.stringify(body),
    }),
  update: (id: string, body: JsonBody) =>
    request<{ success: true; product: ApiProduct }>(`/products/${id}`, {
      method: "PUT",
      body: JSON.stringify(body),
    }),
  remove: (id: string) => request<void>(`/products/${id}`, { method: "DELETE" }),
};

export const CatalogApi = {
  list: () => request<{ success: true; catalogs: ApiCatalog[] }>("/catalogs"),
  get: (id: string) => request<{ success: true; catalog: ApiCatalog }>(`/catalogs/${id}`),
  create: (body: JsonBody) =>
    request<{ success: true; catalog: ApiCatalog }>("/catalogs", {
      method: "POST",
      body: JSON.stringify(body),
    }),
  update: (id: string, body: JsonBody) =>
    request<{ success: true; catalog: ApiCatalog }>(`/catalogs/${id}`, {
      method: "PUT",
      body: JSON.stringify(body),
    }),
  setProducts: (id: string, productIds: string[]) =>
    request<{ success: true; catalog: ApiCatalog }>(`/catalogs/${id}/products`, {
      method: "PUT",
      body: JSON.stringify({ productIds }),
    }),
  remove: (id: string) => request<void>(`/catalogs/${id}`, { method: "DELETE" }),
};

export const OrderApi = {
  list: () => request<{ success: true; orders: ApiOrder[] }>("/orders"),
  get: (id: string) => request<{ success: true; order: ApiOrder }>(`/orders/${id}`),
  create: (body: JsonBody) =>
    request<{ success: true; order: ApiOrder }>("/orders", {
      method: "POST",
      body: JSON.stringify(body),
    }),
  updateStatus: (id: string, status: string) =>
    request<{ success: true; order: ApiOrder }>(`/orders/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    }),
  upsertDelivery: (id: string, delivery: JsonBody) =>
    request<{ success: true; delivery: ApiOrder["delivery"] }>(`/orders/${id}/delivery`, {
      method: "PUT",
      body: JSON.stringify({ delivery }),
    }),
};

export const SupportApi = {
  list: () => request<{ success: true; tickets: SupportTicket[] }>("/support"),
  create: (body: JsonBody) =>
    request<{ success: true; ticket: SupportTicket }>("/support", {
      method: "POST",
      body: JSON.stringify(body),
    }),
  get: (id: string) => request<{ success: true; ticket: SupportTicket }>(`/support/${id}`),
  respond: (id: string, message: string, status?: SupportStatus) =>
    request<{ success: true; response: SupportResponse }>(`/support/${id}/respond`, {
      method: "POST",
      body: JSON.stringify({ message, status }),
    }),
  updateStatus: (id: string, status: SupportStatus) =>
    request<{ success: true; ticket: SupportTicket }>(`/support/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    }),
};

export const ApiUtils = {
  formatCurrency(value: string | number, currency = "INR") {
    const amount = typeof value === "string" ? Number(value) : value;
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency,
      minimumFractionDigits: 2,
    }).format(amount);
  },
};

export const UploadApi = {
  images: (files: File[]) => {
    const fd = new FormData();
    files.forEach((file) => fd.append("files", file));
    return request<{ success: true; files: Array<{ url: string; filename: string; size: number }> }>(
      "/uploads/images",
      {
        method: "POST",
        body: fd,
      }
    );
  },
};
