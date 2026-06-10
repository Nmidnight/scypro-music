import { extractError } from "@/api/extractError";
import { API_URL } from "./baseUrl";
import type {
  AuthCredentials,
  SignupCredentials,
  Tokens,
  User,
} from "@/types";

export async function signup(credentials: SignupCredentials): Promise<User> {
  const response = await fetch(`${API_URL}/user/signup/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    throw new Error(await extractError(response));
  }

  const result: { success: boolean; message: string; result: User } =
    await response.json();
  return result.result;
}

export async function login(credentials: AuthCredentials): Promise<User> {
  const response = await fetch(`${API_URL}/user/login/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    throw new Error(await extractError(response));
  }

  const user: User = await response.json();
  return user;
}

export async function getTokens(credentials: AuthCredentials): Promise<Tokens> {
  const response = await fetch(`${API_URL}/user/token/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    throw new Error(await extractError(response));
  }

  return response.json();
}

export async function refreshToken(refresh: string): Promise<{ access: string }> {
  const response = await fetch(`${API_URL}/user/token/refresh/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh }),
  });

  if (!response.ok) {
    throw new Error(await extractError(response));
  }

  return response.json();
}
