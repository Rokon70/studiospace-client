// All calls go through Next.js rewrites: /api/server/* -> Express /api/*
export async function api<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`/api/server${path}`, {
    credentials: "include",
    ...options,
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error((data as { message?: string }).message || "Something went wrong. Please try again.");
  return data as T;
}
