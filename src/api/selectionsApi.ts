import { API_URL } from "./baseUrl";
import type { ApiResponse, Selection } from "@/types";

export async function getSelectionById(id: string | number): Promise<Selection> {
  const response = await fetch(`${API_URL}/catalog/selection/${id}/`);

  if (!response.ok) {
    throw new Error("Не удалось загрузить подборку. Попробуйте позже.");
  }

  const result: ApiResponse<Selection | null> = await response.json();

  if (!result.data) {
    throw new Error("Подборка не найдена.");
  }

  return result.data;
}
