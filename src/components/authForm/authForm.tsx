"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

import {
  clearAuthError,
  loginUser,
  registerUser,
} from "@/store/features/authSlice";
import { useAppDispatch, useAppSelector } from "@/store/store";
import styles from "./authForm.module.css";

type AuthFormProps = {
  mode: "login" | "register";
};

export default function AuthForm({ mode }: AuthFormProps) {
  const isRegister = mode === "register";
  const router = useRouter();
  const dispatch = useAppDispatch();

  const isLoading = useAppSelector((state) => state.auth.isLoading);
  const serverError = useAppSelector((state) => state.auth.error);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);

  useEffect(() => {
    dispatch(clearAuthError());
  }, [dispatch, mode]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLocalError(null);

    if (!email.trim() || !password.trim()) {
      setLocalError("Заполните почту и пароль.");
      return;
    }

    if (isRegister) {
      if (!username.trim()) {
        setLocalError("Введите имя пользователя.");
        return;
      }
      if (password !== repeatPassword) {
        setLocalError("Пароли не совпадают.");
        return;
      }

      try {
        await dispatch(
          registerUser({ email, password, username }),
        ).unwrap();
        router.push("/signin");
      } catch {}
      return;
    }

    try {
      await dispatch(loginUser({ email, password })).unwrap();
      router.push("/");
    } catch {}
  };

  const errorMessage = localError ?? serverError;

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <div className={styles.block}>
          <form className={styles.form} onSubmit={handleSubmit} noValidate>
            <Link href="/" className={styles.logo}>
              <Image
                className={styles.logoImage}
                src="/img/logo_modal.png"
                alt="Логотип"
                width={140}
                height={21}
                priority
              />
            </Link>

            {isRegister ? (
              <input
                className={styles.input}
                type="text"
                name="username"
                placeholder="Имя пользователя"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                autoComplete="username"
              />
            ) : null}

            <input
              className={styles.input}
              type="email"
              name="email"
              placeholder="Почта"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="email"
            />
            <input
              className={styles.input}
              type="password"
              name="password"
              placeholder="Пароль"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete={isRegister ? "new-password" : "current-password"}
            />

            {isRegister ? (
              <input
                className={styles.input}
                type="password"
                name="repeatPassword"
                placeholder="Повторите пароль"
                value={repeatPassword}
                onChange={(event) => setRepeatPassword(event.target.value)}
                autoComplete="new-password"
              />
            ) : null}

            {errorMessage ? (
              <p className={styles.error}>{errorMessage}</p>
            ) : null}

            <button
              type="submit"
              className={styles.primaryBtn}
              disabled={isLoading}
            >
              {isRegister
                ? isLoading
                  ? "Регистрация…"
                  : "Зарегистрироваться"
                : isLoading
                  ? "Вход…"
                  : "Войти"}
            </button>

            {isRegister ? (
              <Link href="/signin" className={styles.secondaryBtn}>
                Войти
              </Link>
            ) : (
              <Link href="/signup" className={styles.secondaryBtn}>
                Зарегистрироваться
              </Link>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
