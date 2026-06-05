export type SortOrder = "default" | "newer" | "older";

export type ActiveFilterPanel = "author" | "release_date" | "genre" | null;

export type TrackFilterState = {
  searchQuery: string;
  selectedAuthor: string | null;
  selectedGenre: string | null;
  sortOrder: SortOrder;
  activePanel: ActiveFilterPanel;
};

export const DEFAULT_TRACK_FILTER_STATE: TrackFilterState = {
  searchQuery: "",
  selectedAuthor: null,
  selectedGenre: null,
  sortOrder: "default",
  activePanel: null,
};
