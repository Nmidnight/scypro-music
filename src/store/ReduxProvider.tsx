"use client";

import { useEffect, useMemo } from "react";
import { Provider } from "react-redux";

import { hydrateAuthFromStorage } from "@/store/features/authSlice";
import { makeStore } from "./store";

export default function ReduxProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const store = useMemo(() => makeStore(), []);

  useEffect(() => {
    store.dispatch(hydrateAuthFromStorage());
  }, [store]);

  return <Provider store={store}>{children}</Provider>;
}
