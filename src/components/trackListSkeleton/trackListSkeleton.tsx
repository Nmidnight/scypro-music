import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

import styles from "./trackListSkeleton.module.css";

const SKELETON_ROW_COUNT = 10;

export default function TrackListSkeleton() {
  return (
    <SkeletonTheme baseColor="#2a2a2a" highlightColor="#3d3d3d">
      <div className={styles.root} aria-busy="true" aria-label="Загрузка треков">
        <div className={styles.contentTitle}>
          <Skeleton width={40} height={14} />
          <Skeleton width={90} height={14} />
          <Skeleton width={60} height={14} />
          <Skeleton circle width={12} height={12} />
        </div>
        <div className={styles.list}>
          {Array.from({ length: SKELETON_ROW_COUNT }, (_, index) => (
            <div key={index} className={styles.row}>
              <div className={styles.trackTitle}>
                <Skeleton circle width={12} height={12} />
                <Skeleton width={51} height={51} borderRadius={4} />
                <Skeleton width="70%" height={20} />
              </div>
              <Skeleton width="55%" height={18} />
              <Skeleton width="45%" height={18} />
              <Skeleton width={40} height={18} className={styles.time} />
            </div>
          ))}
        </div>
      </div>
    </SkeletonTheme>
  );
}
