import Link from "next/link";
import styles from "./playerBar.module.css";

export default function PlayerBar() {
  return (
    <div className={styles.bar}>
      <div className={styles.content}>
        <div className={styles.playerProgress} />
        <div className={styles.playerBlock}>
          <div className={styles.player}>
            <div className={styles.controls}>
              <div className={styles.btnPrev}>
                <svg className={styles.btnPrevSvg}>
                  <use xlinkHref="/img/icon/sprite.svg#icon-prev"></use>
                </svg>
              </div>
              <div className={`${styles.btnPlay} btn`}>
                <svg className={styles.btnPlaySvg}>
                  <use xlinkHref="/img/icon/sprite.svg#icon-play"></use>
                </svg>
              </div>
              <div className={styles.btnNext}>
                <svg className={styles.btnNextSvg}>
                  <use xlinkHref="/img/icon/sprite.svg#icon-next"></use>
                </svg>
              </div>
              <div className={`${styles.btnRepeat} ${styles.iconButton}`}>
                <svg className={styles.btnRepeatSvg}>
                  <use xlinkHref="/img/icon/sprite.svg#icon-repeat"></use>
                </svg>
              </div>
              <div className={`${styles.btnShuffle} ${styles.iconButton}`}>
                <svg className={styles.btnShuffleSvg}>
                  <use xlinkHref="/img/icon/sprite.svg#icon-shuffle"></use>
                </svg>
              </div>
            </div>

            <div className={styles.trackPlay}>
              <div className={styles.trackContain}>
                <div className={styles.trackImage}>
                  <svg className={styles.trackSvg}>
                    <use xlinkHref="/img/icon/sprite.svg#icon-note"></use>
                  </svg>
                </div>
                <div className={styles.trackAuthor}>
                  <Link className={styles.trackAuthorLink} href="#">
                    Ты та...
                  </Link>
                </div>
                <div className={styles.trackAlbum}>
                  <Link className={styles.trackAlbumLink} href="#">
                    Баста
                  </Link>
                </div>
              </div>

              <div className={styles.trackActions}>
                <div className={styles.iconButton}>
                  <svg className={styles.likeSvg}>
                    <use xlinkHref="/img/icon/sprite.svg#icon-like"></use>
                  </svg>
                </div>
                <div className={`${styles.iconButton} ${styles.dislikeSpaced}`}>
                  <svg className={styles.dislikeSvg}>
                    <use xlinkHref="/img/icon/sprite.svg#icon-dislike"></use>
                  </svg>
                </div>
              </div>
            </div>
          </div>
          <div className={styles.volumeBlock}>
            <div className={styles.volumeContent}>
              <div className={styles.volumeImage}>
                <svg className={styles.volumeSvg}>
                  <use xlinkHref="/img/icon/sprite.svg#icon-volume"></use>
                </svg>
              </div>
              <div className={`${styles.volumeProgress} btn`}>
                <input
                  className={`${styles.volumeProgressLine} btn`}
                  type="range"
                  name="range"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
