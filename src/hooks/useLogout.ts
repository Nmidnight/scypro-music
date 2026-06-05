"use client";

import { useCallback } from "react";
import { usePathname, useRouter } from "next/navigation";

import { logout } from "@/store/features/authSlice";
import { useAppDispatch } from "@/store/store";

export function useLogout() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const pathname = usePathname();

  return useCallback(() => {
    dispatch(logout());

    if (pathname === "/favorites") {
      router.push("/");
    }
  }, [dispatch, pathname, router]);
}
