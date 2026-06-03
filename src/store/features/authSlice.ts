import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { getTokens, login, signup } from "@/api/authApi";
import type {
  AuthCredentials,
  SignupCredentials,
  Tokens,
  User,
} from "@/types";

const USER_KEY = "music-user";
const TOKENS_KEY = "music-tokens";

export type AuthState = {
  user: User | null;
  tokens: Tokens | null;
  isLoading: boolean;
  error: string | null;
  isHydrated: boolean;
};

function readFromStorage<T>(key: string): T | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

const initialState: AuthState = {
  user: null,
  tokens: null,
  isLoading: false,
  error: null,
  isHydrated: false,
};

export const loginUser = createAsyncThunk<
  { user: User; tokens: Tokens },
  AuthCredentials,
  { rejectValue: string }
>("auth/login", async (credentials, { rejectWithValue }) => {
  try {
    const user = await login(credentials);
    const tokens = await getTokens(credentials);
    return { user, tokens };
  } catch (error) {
    return rejectWithValue(
      error instanceof Error ? error.message : "Ошибка авторизации",
    );
  }
});

export const registerUser = createAsyncThunk<
  User,
  SignupCredentials,
  { rejectValue: string }
>("auth/register", async (credentials, { rejectWithValue }) => {
  try {
    return await signup(credentials);
  } catch (error) {
    return rejectWithValue(
      error instanceof Error ? error.message : "Ошибка регистрации",
    );
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    hydrateAuthFromStorage: (state) => {
      state.user = readFromStorage<User>(USER_KEY);
      state.tokens = readFromStorage<Tokens>(TOKENS_KEY);
      state.isHydrated = true;
    },
    setAccessToken: (state, action: { payload: string }) => {
      if (!state.tokens) return;
      state.tokens = { ...state.tokens, access: action.payload };
      if (typeof window !== "undefined") {
        window.localStorage.setItem(
          TOKENS_KEY,
          JSON.stringify(state.tokens),
        );
      }
    },
    logout: (state) => {
      state.user = null;
      state.tokens = null;
      state.error = null;
      if (typeof window !== "undefined") {
        window.localStorage.removeItem(USER_KEY);
        window.localStorage.removeItem(TOKENS_KEY);
      }
    },
    clearAuthError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.tokens = action.payload.tokens;
        if (typeof window !== "undefined") {
          window.localStorage.setItem(
            USER_KEY,
            JSON.stringify(action.payload.user),
          );
          window.localStorage.setItem(
            TOKENS_KEY,
            JSON.stringify(action.payload.tokens),
          );
        }
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? "Ошибка авторизации";
      })
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? "Ошибка регистрации";
      });
  },
});

export const {
  logout,
  clearAuthError,
  setAccessToken,
  hydrateAuthFromStorage,
} = authSlice.actions;
export const authReducer = authSlice.reducer;
