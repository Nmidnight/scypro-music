import type { Track } from "@/types";

export function getLikeCount(track: Track): number {
  return track.staredUser?.length ?? 0;
}

export function isTrackLikedByUser(
  track: Track,
  userId: number | undefined,
): boolean {
  if (userId == null) return false;
  return track.staredUser?.includes(userId) ?? false;
}

export function applyLikeToTrack(
  track: Track,
  userId: number,
  liked: boolean,
): Track {
  const staredUser = track.staredUser ?? [];

  if (liked) {
    if (staredUser.includes(userId)) return track;
    return { ...track, staredUser: [...staredUser, userId] };
  }

  return {
    ...track,
    staredUser: staredUser.filter((id) => id !== userId),
  };
}
