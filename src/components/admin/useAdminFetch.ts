"use client";

import { useCallback, useState } from "react";

type ApiOk<T> = { ok: true; data: T };
type ApiFail = { ok: false; error: string };
export type ApiResponse<T> = ApiOk<T> | ApiFail;

export function useAdminFetch() {
  const [loading, setLoading] = useState(false);

  const request = useCallback(async <T>(url: string, init?: RequestInit): Promise<ApiResponse<T>> => {
    setLoading(true);
    try {
      const res = await fetch(url, init);
      const json = (await res.json()) as ApiResponse<T>;
      return json;
    } catch {
      return { ok: false, error: "Error de conexión." };
    } finally {
      setLoading(false);
    }
  }, []);

  return { request, loading };
}
