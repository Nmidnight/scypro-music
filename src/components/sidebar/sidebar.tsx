import Image from "next/image";
import Link from "next/link";
import styles from "./sidebar.module.css";

const PLAYLISTS = [
  { id: "1", src: "/img/playlist01.png" },
  { id: "2", src: "/img/playlist02.png" },
  { id: "3", src: "/img/playlist03.png" },
] as const;

export default function Sidebar() {
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
          {PLAYLISTS.map((item) => (
            <div key={item.id} className={styles.item}>
              <Link className={styles.link} href="#">
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
