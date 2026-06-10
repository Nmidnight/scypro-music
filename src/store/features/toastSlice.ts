import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type ToastType = "error" | "success" | "warning" | "info";

export type ToastPayload = {
  message: string;
  type?: ToastType;
};

export type ToastState = {
  message: string | null;
  type: ToastType;
};

const initialState: ToastState = {
  message: null,
  type: "info",
};

const toastSlice = createSlice({
  name: "toast",
  initialState,
  reducers: {
    showToast: (state, action: PayloadAction<ToastPayload>) => {
      state.message = action.payload.message;
      state.type = action.payload.type ?? "info";
    },
    clearToast: (state) => {
      state.message = null;
    },
  },
});

export const { showToast, clearToast } = toastSlice.actions;
export const toastReducer = toastSlice.reducer;
