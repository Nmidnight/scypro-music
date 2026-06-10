import type { AuthContext } from "@/api/withReAuth";
import { withReAuth } from "@/api/withReAuth";
import { API_URL } from "./baseUrl";
import type { ApiResponse, Track } from "@/types";

export async function getAllTracks(): Promise<Track[]> {
  const response = await fetch(`${API_URL}/catalog/track/all/`);

  if (!response.ok) {
    throw new Error("Не удалось загрузить треки. Попробуйте позже.");
  }

  const result: ApiResponse<Track[]> = await response.json();
  return result.data;
}

export async function getFavoriteTracks(ctx: AuthContext): Promise<Track[]> {
  return withReAuth(
    ctx,
    (accessToken) =>
      fetch(`${API_URL}/catalog/track/favorite/all/`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      }),
    async (response) => {
      const result: ApiResponse<Track[]> = await response.json();
      return result.data;
    },
  );
}

export async function addTrackToFavorites(
  ctx: AuthContext,
  trackId: number,
): Promise<void> {
  await withReAuth(
    ctx,
    (accessToken) =>
      fetch(`${API_URL}/catalog/track/${trackId}/favorite/`, {
        method: "POST",
        headers: { Authorization: `Bearer ${accessToken}` },
      }),
    async () => undefined,
  );
}

export async function removeTrackFromFavorites(
  ctx: AuthContext,
  trackId: number,
): Promise<void> {
  await withReAuth(
    ctx,
    (accessToken) =>
      fetch(`${API_URL}/catalog/track/${trackId}/favorite/`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${accessToken}` },
      }),
    async () => undefined,
  );
}
