"use client";

import Image from "next/image";
import Link from "next/link";
import { useLogout } from "@/hooks/useLogout";
import { useAppSelector } from "@/store/store";
import styles from "./sidebar.module.css";

const PLAYLISTS = [
  { id: "2", src: "/img/playlist01.png" },
  { id: "3", src: "/img/playlist02.png" },
  { id: "4", src: "/img/playlist03.png" },
] as const;

export default function Sidebar() {
  const user = useAppSelector((state) => state.auth.user);
  const isHydrated = useAppSelector((state) => state.auth.isHydrated);
  const displayUser = isHydrated ? user : null;
  const handleLogout = useLogout();

  return (
    <div className={styles.root}>
      <div className={styles.personal}>
        <p className={styles.personalName}>{displayUser?.username ?? "Гость"}</p>
        {displayUser ? (
          <button
            type="button"
            className={styles.icon}
            onClick={handleLogout}
            aria-label="Выйти"
          >
            <svg>
              <use href="/img/icon/sprite.svg#icon-user"></use>
            </svg>
          </button>
        ) : (
          <Link className={styles.icon} href="/signin" aria-label="Войти">
            <svg>
              <use href="/img/icon/sprite.svg#icon-user"></use>
            </svg>
          </Link>
        )}
      </div>
      <div className={styles.block}>
        <div className={styles.list}>
          {displayUser ? (
            <div className={styles.item}>
              <Link className={styles.link} href="/favorites">
                <span className={styles.favoritesLabel}>Мои треки</span>
              </Link>
            </div>
          ) : null}
          {PLAYLISTS.map((item) => (
            <div key={item.id} className={styles.item}>
              <Link className={styles.link} href={`/category/${item.id}`}>
                <Image
                  className={styles.img}
                  src={item.src}
                  alt="day's playlist"
                  width={250}
                  height={150}
                  style={{ width: "100%", height: "auto" }}
                />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
