"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { useAppSelector } from "@/store/store";
import styles from "./authGuard.module.css";

type AuthGuardProps = {
  children: React.ReactNode;
};

export default function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter();
  const user = useAppSelector((state) => state.auth.user);

  useEffect(() => {
    if (!user) {
      router.replace("/signin");
    }
  }, [router, user]);

  if (!user) {
    return <div className={styles.loading} aria-hidden />;
  }

  return children;
}
