import type { EventItem, EventPayload, LoginPayload, RegisterPayload, User } from "../types";

const API_BASE = (import.meta.env.VITE_API_URL as string | undefined) || "http://localhost:5000/api";

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

async function request<T>(path: string, method: HttpMethod, token?: string, body?: BodyInit): Promise<T> {
  const headers = new Headers();

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  if (!(body instanceof FormData) && body) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body
  });

  const raw = await response.text();
  const data = raw ? JSON.parse(raw) : null;

  if (!response.ok) {
    const message = data?.message || "Request failed";
    throw new ApiError(message, response.status);
  }

  return data as T;
}

export async function registerUser(payload: RegisterPayload): Promise<{ token: string; user?: User }> {
  return request<{ token: string; user?: User }>("/auth/register", "POST", undefined, JSON.stringify(payload));
}

export async function loginUser(payload: LoginPayload): Promise<{ token: string; message: string }> {
  return request<{ token: string; message: string }>("/auth/login", "POST", undefined, JSON.stringify(payload));
}

export async function fetchProfile(token: string): Promise<User> {
  const response = await request<{ user: User }>("/user/profile", "GET", token);
  return response.user;
}

export async function fetchEvents(): Promise<EventItem[]> {
  return request<EventItem[]>("/events", "GET");
}

export async function fetchEventById(id: string): Promise<EventItem> {
  return request<EventItem>(`/events/${id}`, "POST");
}

export async function createEvent(token: string, payload: EventPayload): Promise<EventItem> {
  const form = new FormData();
  form.append("title", payload.title);
  form.append("description", payload.description);
  form.append("date", payload.date);
  form.append("location", payload.location);
  if (payload.image) {
    form.append("image", payload.image);
  }

  return request<EventItem>("/events", "POST", token, form);
}

export async function updateEvent(token: string, id: string, payload: EventPayload): Promise<EventItem> {
  const form = new FormData();
  form.append("title", payload.title);
  form.append("description", payload.description);
  form.append("date", payload.date);
  form.append("location", payload.location);
  if (payload.image) {
    form.append("image", payload.image);
  }

  return request<EventItem>(`/events/${id}`, "PUT", token, form);
}

export async function deleteEvent(token: string, id: string): Promise<{ message: string }> {
  return request<{ message: string }>(`/events/${id}`, "DELETE", token);
}

export { ApiError, API_BASE };