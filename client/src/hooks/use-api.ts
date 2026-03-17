import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  UserProfile,
  InsertUserProfile,
  TattooStyle,
  Drawing,
  InsertDrawing,
  UpdateDrawing,
  UserProgress,
  InsertProgress,
} from "@shared/schema";

const API_BASE = "/api";

async function fetchApi<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${url}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: "Request failed" }));
    throw new Error(error.message || "Request failed");
  }

  if (response.status === 204) {
    return {} as T;
  }

  return response.json();
}

// ============ PROFILE ============

export function useProfile() {
  return useQuery({
    queryKey: ["profile"],
    queryFn: () => fetchApi<UserProfile>("/profile"),
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<InsertUserProfile>) =>
      fetchApi<UserProfile>("/profile", {
        method: "PATCH",
        body: JSON.stringify(data),
      }),
    onSuccess: (data) => {
      queryClient.setQueryData(["profile"], data);
    },
  });
}

// ============ STYLES ============

export function useStyles() {
  return useQuery({
    queryKey: ["styles"],
    queryFn: () => fetchApi<TattooStyle[]>("/styles"),
  });
}

export function useStyle(id: string) {
  return useQuery({
    queryKey: ["styles", id],
    queryFn: () => fetchApi<TattooStyle>(`/styles/${id}`),
    enabled: !!id,
  });
}

// ============ DRAWINGS ============

export function useDrawings() {
  return useQuery({
    queryKey: ["drawings"],
    queryFn: () => fetchApi<Drawing[]>("/drawings"),
  });
}

export function useDrawing(id: string) {
  return useQuery({
    queryKey: ["drawings", id],
    queryFn: () => fetchApi<Drawing>(`/drawings/${id}`),
    enabled: !!id,
  });
}

export function useCreateDrawing() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: InsertDrawing) =>
      fetchApi<Drawing>("/drawings", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["drawings"] });
    },
  });
}

export function useUpdateDrawing() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateDrawing }) =>
      fetchApi<Drawing>(`/drawings/${id}`, {
        method: "PATCH",
        body: JSON.stringify(data),
      }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["drawings"] });
      queryClient.invalidateQueries({ queryKey: ["drawings", variables.id] });
    },
  });
}

export function useDeleteDrawing() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      fetchApi<void>(`/drawings/${id}`, {
        method: "DELETE",
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["drawings"] });
    },
  });
}

// ============ PROGRESS ============

export function useProgress() {
  return useQuery({
    queryKey: ["progress"],
    queryFn: () => fetchApi<UserProgress[]>("/progress"),
  });
}

export function useUpdateProgress() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: InsertProgress) =>
      fetchApi<UserProgress>("/progress", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["progress"] });
    },
  });
}
