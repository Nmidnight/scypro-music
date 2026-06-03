import { refreshToken } from "@/api/authApi";
import { extractError } from "@/api/extractError";

export type AuthContext = {
  getAccessToken: () => string | null;
  getRefreshToken: () => string | null;
  setAccessToken: (access: string) => void;
  onSessionExpired: () => void;
};

export async function withReAuth<T>(
  ctx: AuthContext,
  request: (accessToken: string) => Promise<Response>,
  parse: (response: Response) => Promise<T>,
): Promise<T> {
  const access = ctx.getAccessToken();
  if (!access) {
    throw new Error("Войдите в аккаунт, чтобы выполнить действие.");
  }

  let response = await request(access);

  if (response.status === 401) {
    const refresh = ctx.getRefreshToken();
    if (!refresh) {
      ctx.onSessionExpired();
      throw new Error("Сессия истекла. Войдите снова.");
    }

    try {
      const { access: newAccess } = await refreshToken(refresh);
      ctx.setAccessToken(newAccess);
      response = await request(newAccess);

      if (response.status === 401) {
        ctx.onSessionExpired();
        throw new Error("Сессия истекла. Войдите снова.");
      }
    } catch (error) {
      if (error instanceof Error && error.message === "Сессия истекла. Войдите снова.") {
        throw error;
      }
      ctx.onSessionExpired();
      throw new Error("Сессия истекла. Войдите снова.");
    }
  }

  if (!response.ok) {
    throw new Error(await extractError(response));
  }

  return parse(response);
}
