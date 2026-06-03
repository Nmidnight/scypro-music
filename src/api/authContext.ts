import type { AuthContext } from "@/api/withReAuth";
import { logout, setAccessToken } from "@/store/features/authSlice";
import type { AppDispatch, RootState } from "@/store/store";

export function createAuthContext(
  getState: () => RootState,
  dispatch: AppDispatch,
): AuthContext {
  return {
    getAccessToken: () => getState().auth.tokens?.access ?? null,
    getRefreshToken: () => getState().auth.tokens?.refresh ?? null,
    setAccessToken: (access) => {
      dispatch(setAccessToken(access));
    },
    onSessionExpired: () => {
      dispatch(logout());
    },
  };
}
