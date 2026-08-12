import type { Actualite, AdmissionPayload, ContactPayload } from "./types";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8001";

async function req<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: { "Content-Type": "application/json", ...(options.headers ?? {}) },
  });
  if (!res.ok) {
    const detail = await res.json().catch(() => ({}));
    throw new Error(detail.detail ?? `Erreur ${res.status}`);
  }
  if (res.status === 204) return undefined as T;
  return res.json();
}

export const api = {
  actualitesPubliques: () => req<Actualite[]>("/api/public/actualites"),
  deposerAdmission: (payload: AdmissionPayload) =>
    req("/api/public/admissions", { method: "POST", body: JSON.stringify(payload) }),
  contact: (payload: ContactPayload) =>
    req("/api/public/contact", { method: "POST", body: JSON.stringify(payload) }),
};
