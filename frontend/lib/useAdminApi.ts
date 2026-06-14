"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { api, ApiError } from "@/lib/api";
import { clearAdminToken, getAdminToken } from "@/lib/adminAuth";

export function useAdminApi() {
  const router = useRouter();

  const handleAuthError = useCallback(
    (err: unknown) => {
      if (err instanceof ApiError && (err.status === 401 || err.status === 403)) {
        clearAdminToken();
        router.push("/admin/login");
      }
      throw err;
    },
    [router]
  );

  const get = useCallback(
    async <T,>(path: string) => {
      const token = getAdminToken();
      try {
        return await api.get<T>(path, token ?? undefined);
      } catch (err) {
        return handleAuthError(err) as never;
      }
    },
    [handleAuthError]
  );

  const post = useCallback(
    async <T,>(path: string, body: unknown) => {
      const token = getAdminToken();
      try {
        return await api.post<T>(path, body, token ?? undefined);
      } catch (err) {
        return handleAuthError(err) as never;
      }
    },
    [handleAuthError]
  );

  const put = useCallback(
    async <T,>(path: string, body: unknown) => {
      const token = getAdminToken();
      try {
        return await api.put<T>(path, body, token ?? undefined);
      } catch (err) {
        return handleAuthError(err) as never;
      }
    },
    [handleAuthError]
  );

  const patch = useCallback(
    async <T,>(path: string, body: unknown) => {
      const token = getAdminToken();
      try {
        return await api.patch<T>(path, body, token ?? undefined);
      } catch (err) {
        return handleAuthError(err) as never;
      }
    },
    [handleAuthError]
  );

  const del = useCallback(
    async <T,>(path: string) => {
      const token = getAdminToken();
      try {
        return await api.delete<T>(path, token ?? undefined);
      } catch (err) {
        return handleAuthError(err) as never;
      }
    },
    [handleAuthError]
  );

  return { get, post, put, patch, delete: del };
}
