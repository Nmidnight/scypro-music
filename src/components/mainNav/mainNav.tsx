"use client";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { logout } from "@/store/features/authSlice";
import { useAppDispatch, useAppSelector } from "@/store/store";
import styles from "./mainNav.module.css";
export default function MainNav() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const user = useAppSelector((state) => state.auth.user);

  const handleClick = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    dispatch(logout());
    router.push("/signin");
  };

  return (
    <nav className={styles.main__nav}>
      <div className={styles.nav__logo}>
        <Image
          width={250}
          height={150}
          className={styles.logo__image}
          src="/img/logo.png"
          alt="Логотип"
          style={{ width: "113.33px", height: "17px" }}
          priority
        />
      </div>
      <div className={styles.nav__burger} onClick={handleClick}>
        <span className={styles.burger__line}></span>
        <span className={styles.burger__line}></span>
        <span className={styles.burger__line}></span>
      </div>
      <div className={`${styles.nav__menu} ${isMenuOpen ? styles.active : ""}`}>
        <ul className={styles.menu__list}>
          <li className={styles.menu__item}>
            <Link href="#" className={styles.menu__link}>
              Главное
            </Link>
          </li>
          <li className={styles.menu__item}>
            <Link href="#" className={styles.menu__link}>
              Мой плейлист
            </Link>
          </li>
          <li className={styles.menu__item}>
            {user ? (
              <button
                type="button"
                className={styles.menu__link}
                onClick={handleLogout}
              >
                Выйти
              </button>
            ) : (
              <Link href="/signin" className={styles.menu__link}>
                Войти
              </Link>
            )}
          </li>
        </ul>
      </div>
    </nav>
  );
}
