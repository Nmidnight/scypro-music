export type SortOrder = "default" | "newer" | "older";

export type ActiveFilterPanel = "author" | "release_date" | "genre" | null;

export type TrackFilterState = {
  searchQuery: string;
  selectedAuthors: string[];
  selectedGenres: string[];
  sortOrder: SortOrder;
  activePanel: ActiveFilterPanel;
};

export const DEFAULT_TRACK_FILTER_STATE: TrackFilterState = {
  searchQuery: "",
  selectedAuthors: [],
  selectedGenres: [],
  sortOrder: "default",
  activePanel: null,
};

export function toggleFilterValue(values: string[], value: string): string[] {
  return values.includes(value)
    ? values.filter((item) => item !== value)
    : [...values, value];
}
