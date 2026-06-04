import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import type { Track } from "@/types";
import TrackList from "./trackList";

vi.mock("@/components/trackItem/trackItem", () => ({
  default: ({ track }: { track: Track }) => <div>{track.name}</div>,
}));

const tracks: Track[] = [
  {
    _id: 1,
    name: "Track One",
    author: "Author",
    release_date: "2020-01-01",
    genre: ["Pop"],
    duration_in_seconds: 100,
    album: "Album",
    logo: null,
    track_file: "",
  },
  {
    _id: 2,
    name: "Track Two",
    author: "Author",
    release_date: "2021-01-01",
    genre: ["Rock"],
    duration_in_seconds: 120,
    album: "Album",
    logo: null,
    track_file: "",
  },
];

describe("TrackList", () => {
  it("renders column headers", () => {
    render(<TrackList tracks={tracks} />);
    expect(screen.getByText("Трек")).toBeInTheDocument();
    expect(screen.getByText("Исполнитель")).toBeInTheDocument();
    expect(screen.getByText("Альбом")).toBeInTheDocument();
  });

  it("renders all tracks", () => {
    render(<TrackList tracks={tracks} />);
    expect(screen.getByText("Track One")).toBeInTheDocument();
    expect(screen.getByText("Track Two")).toBeInTheDocument();
  });

  it("renders empty list without tracks", () => {
    render(<TrackList tracks={[]} />);
    expect(screen.getByText("Трек")).toBeInTheDocument();
    expect(screen.queryByText("Track One")).not.toBeInTheDocument();
  });
});
