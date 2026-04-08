import Image from "next/image";
import Link from "next/link";
import styles from "./Sidebar.module.css";

const SIDEBAR_PLAYLISTS = [
  { id: "1", src: "/img/playlist01.png", alt: "day's playlist" },
  { id: "2", src: "/img/playlist02.png", alt: "day's playlist" },
  { id: "3", src: "/img/playlist03.png", alt: "day's playlist" },
] as const;

export function Sidebar() {
  return (
    <div className={styles.root}>
      <div className={styles.personal}>
        <p className={styles.personalName}>Sergey.Ivanov</p>
        <div className={styles.icon}>
          <svg>
            <use xlinkHref="/img/icon/sprite.svg#logout"></use>
          </svg>
        </div>
      </div>
      <div className={styles.block}>
        <div className={styles.list}>
          {SIDEBAR_PLAYLISTS.map((item) => (
            <div key={item.id} className={styles.item}>
              <Link className={styles.link} href="#">
                <Image
                  className={styles.img}
                  src={item.src}
                  alt={item.alt}
                  width={250}
                  height={170}
                />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
