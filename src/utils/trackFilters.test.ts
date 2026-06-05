import { describe, expect, it } from "vitest";

import type { Track } from "@/types";
import {
  compareByReleaseDate,
  filterTracks,
  getUniqueAuthors,
  getUniqueGenres,
  hasActiveFilters,
  matchesAuthor,
  matchesGenre,
  matchesSearch,
  sortTracksByDate,
} from "./trackFilters";

const tracks: Track[] = [
  {
    _id: 1,
    name: "Elektro",
    author: "Alice",
    release_date: "2020-01-01",
    genre: ["Pop"],
    duration_in_seconds: 100,
    album: "A",
    logo: null,
    track_file: "",
  },
  {
    _id: 2,
    name: "Troelf",
    author: "Bob",
    release_date: "2018-06-15",
    genre: ["Rock"],
    duration_in_seconds: 120,
    album: "B",
    logo: null,
    track_file: "",
  },
  {
    _id: 3,
    name: "Hard Metal",
    author: "Alice",
    release_date: "2022-03-10",
    genre: ["Metal", "Rock"],
    duration_in_seconds: 90,
    album: "C",
    logo: null,
    track_file: "",
  },
];

describe("getUniqueAuthors", () => {
  it("returns sorted unique authors", () => {
    expect(getUniqueAuthors(tracks)).toEqual(["Alice", "Bob"]);
  });

  it("returns empty array for empty input", () => {
    expect(getUniqueAuthors([])).toEqual([]);
  });
});

describe("getUniqueGenres", () => {
  it("returns sorted unique genres", () => {
    expect(getUniqueGenres(tracks)).toEqual(["Metal", "Pop", "Rock"]);
  });
});

describe("matchesSearch", () => {
  it("matches track name from the first letters", () => {
    expect(matchesSearch(tracks[0], "el")).toBe(true);
    expect(matchesSearch(tracks[1], "tro")).toBe(true);
  });

  it("does not match when query is not a prefix", () => {
    expect(matchesSearch(tracks[0], "ekt")).toBe(false);
    expect(matchesSearch(tracks[1], "elf")).toBe(false);
  });

  it("returns true for empty query", () => {
    expect(matchesSearch(tracks[0], "   ")).toBe(true);
  });
});

describe("matchesAuthor", () => {
  it("filters by selected author", () => {
    expect(matchesAuthor(tracks[0], "Alice")).toBe(true);
    expect(matchesAuthor(tracks[1], "Alice")).toBe(false);
    expect(matchesAuthor(tracks[0], null)).toBe(true);
  });
});

describe("matchesGenre", () => {
  it("filters by selected genre", () => {
    expect(matchesGenre(tracks[2], "Rock")).toBe(true);
    expect(matchesGenre(tracks[0], "Rock")).toBe(false);
    expect(matchesGenre(tracks[0], null)).toBe(true);
  });
});

describe("compareByReleaseDate", () => {
  it("sorts tracks chronologically", () => {
    expect(compareByReleaseDate(tracks[1], tracks[0])).toBeLessThan(0);
    expect(compareByReleaseDate(tracks[2], tracks[0])).toBeGreaterThan(0);
  });
});

describe("sortTracksByDate", () => {
  it("keeps original order by default", () => {
    expect(sortTracksByDate(tracks, "default").map((track) => track._id)).toEqual([
      1, 2, 3,
    ]);
  });

  it("sorts from older to newer", () => {
    expect(sortTracksByDate(tracks, "older").map((track) => track._id)).toEqual([
      2, 1, 3,
    ]);
  });

  it("sorts from newer to older", () => {
    expect(sortTracksByDate(tracks, "newer").map((track) => track._id)).toEqual([
      3, 1, 2,
    ]);
  });
});

describe("hasActiveFilters", () => {
  it("detects active filters", () => {
    expect(
      hasActiveFilters({
        searchQuery: "",
        selectedAuthor: null,
        selectedGenre: null,
        sortOrder: "default",
      }),
    ).toBe(false);

    expect(
      hasActiveFilters({
        searchQuery: "el",
        selectedAuthor: null,
        selectedGenre: null,
        sortOrder: "default",
      }),
    ).toBe(true);
  });
});

describe("filterTracks", () => {
  it("combines search, author, genre and sort", () => {
    const result = filterTracks(tracks, {
      searchQuery: "t",
      selectedAuthor: "Bob",
      selectedGenre: "Rock",
      sortOrder: "older",
    });

    expect(result.map((track) => track._id)).toEqual([2]);
  });

  it("returns all tracks when filters are empty", () => {
    expect(
      filterTracks(tracks, {
        searchQuery: "",
        selectedAuthor: null,
        selectedGenre: null,
        sortOrder: "default",
      }),
    ).toHaveLength(3);
  });

  it("returns empty list when nothing matches", () => {
    expect(
      filterTracks(tracks, {
        searchQuery: "zzz",
        selectedAuthor: null,
        selectedGenre: null,
        sortOrder: "default",
      }),
    ).toEqual([]);
  });
});
