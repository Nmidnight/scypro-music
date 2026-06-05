import type { SortOrder } from "@/types/filters";
import type { Track } from "@/types";

export type TrackFilterCriteria = {
  searchQuery: string;
  selectedAuthor: string | null;
  selectedGenre: string | null;
  sortOrder: SortOrder;
};

export function getUniqueAuthors(tracks: Track[]): string[] {
  return Array.from(new Set(tracks.map((track) => track.author))).sort((a, b) =>
    a.localeCompare(b, "ru"),
  );
}

export function getUniqueGenres(tracks: Track[]): string[] {
  return Array.from(new Set(tracks.flatMap((track) => track.genre))).sort((a, b) =>
    a.localeCompare(b, "ru"),
  );
}

export function matchesSearch(track: Track, searchQuery: string): boolean {
  const query = searchQuery.trim().toLowerCase();
  if (!query) return true;
  return track.name.toLowerCase().startsWith(query);
}

export function matchesAuthor(track: Track, author: string | null): boolean {
  if (!author) return true;
  return track.author === author;
}

export function matchesGenre(track: Track, genre: string | null): boolean {
  if (!genre) return true;
  return track.genre.includes(genre);
}

export function compareByReleaseDate(a: Track, b: Track): number {
  return (
    new Date(a.release_date).getTime() - new Date(b.release_date).getTime()
  );
}

export function sortTracksByDate(tracks: Track[], sortOrder: SortOrder): Track[] {
  if (sortOrder === "default") {
    return tracks;
  }

  const sorted = [...tracks].sort(compareByReleaseDate);
  return sortOrder === "newer" ? sorted.reverse() : sorted;
}

export function hasActiveFilters(criteria: TrackFilterCriteria): boolean {
  return (
    criteria.searchQuery.trim().length > 0 ||
    criteria.selectedAuthor !== null ||
    criteria.selectedGenre !== null ||
    criteria.sortOrder !== "default"
  );
}

export function filterTracks(
  tracks: Track[],
  criteria: TrackFilterCriteria,
): Track[] {
  const filtered = tracks.filter(
    (track) =>
      matchesSearch(track, criteria.searchQuery) &&
      matchesAuthor(track, criteria.selectedAuthor) &&
      matchesGenre(track, criteria.selectedGenre),
  );

  return sortTracksByDate(filtered, criteria.sortOrder);
}
