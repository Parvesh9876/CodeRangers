export type UserRole = "admin" | "user";

export interface User {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface EventItem {
  _id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  image?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface EventPayload {
  title: string;
  description: string;
  date: string;
  location: string;
  image?: File | null;
}