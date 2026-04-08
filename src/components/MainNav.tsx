import Image from "next/image";
import Link from "next/link";
import styles from "./MainNav.module.css";

export function MainNav() {
  return (
    <nav className={styles.nav}>
      <div className={styles.logo}>
        <Image
          width={250}
          height={170}
          className={styles.logoImage}
          src="/img/logo.png"
          alt={"logo"}
        />
      </div>
      <div className={styles.burger}>
        <span className={styles.burgerLine}></span>
        <span className={styles.burgerLine}></span>
        <span className={styles.burgerLine}></span>
      </div>
      <div className={styles.menu}>
        <ul className={styles.menuList}>
          <li className={styles.menuItem}>
            <Link href="#" className={styles.menuLink}>
              Главное
            </Link>
          </li>
          <li className={styles.menuItem}>
            <Link href="#" className={styles.menuLink}>
              Мой плейлист
            </Link>
          </li>
          <li className={styles.menuItem}>
            <Link href="/signin.html" className={styles.menuLink}>
              Войти
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}
