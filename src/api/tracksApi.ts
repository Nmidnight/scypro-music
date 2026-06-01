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
