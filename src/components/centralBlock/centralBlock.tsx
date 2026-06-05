"use client";

import { useCallback, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import classNames from "classnames";

import FilterBar from "@/components/filterBar/filterBar";
import Search from "@/components/search/search";
import TrackList from "@/components/trackList/trackList";
import TrackListSkeleton from "@/components/trackListSkeleton/trackListSkeleton";
import {
  DEFAULT_TRACK_FILTER_STATE,
  type ActiveFilterPanel,
  type SortOrder,
  type TrackFilterState,
  toggleFilterValue,
} from "@/types/filters";
import type { Track } from "@/types";
import {
  filterTracks,
  getUniqueAuthors,
  getUniqueGenres,
} from "@/utils/trackFilters";
import styles from "./centralBlock.module.css";

type CentralBlockProps = {
  title: string;
  tracks: Track[];
  isLoading: boolean;
  error: string | null;
};

function CentralBlockContent({
  title,
  tracks,
  isLoading,
  error,
}: CentralBlockProps) {
  const [filters, setFilters] = useState<TrackFilterState>(
    DEFAULT_TRACK_FILTER_STATE,
  );

  const uniqueAuthors = useMemo(() => getUniqueAuthors(tracks), [tracks]);
  const uniqueGenres = useMemo(() => getUniqueGenres(tracks), [tracks]);

  const filteredTracks = useMemo(
    () =>
      filterTracks(tracks, {
        searchQuery: filters.searchQuery,
        selectedAuthors: filters.selectedAuthors,
        selectedGenres: filters.selectedGenres,
        sortOrder: filters.sortOrder,
      }),
    [tracks, filters],
  );

  const handleSearchChange = useCallback((value: string) => {
    setFilters((prev) => ({ ...prev, searchQuery: value }));
  }, []);

  const handleTogglePanel = useCallback(
    (panel: Exclude<ActiveFilterPanel, null>) => {
      setFilters((prev) => ({
        ...prev,
        activePanel: prev.activePanel === panel ? null : panel,
      }));
    },
    [],
  );

  const handleSelectAuthor = useCallback((author: string) => {
    setFilters((prev) => ({
      ...prev,
      selectedAuthors: toggleFilterValue(prev.selectedAuthors, author),
    }));
  }, []);

  const handleSelectGenre = useCallback((genre: string) => {
    setFilters((prev) => ({
      ...prev,
      selectedGenres: toggleFilterValue(prev.selectedGenres, genre),
    }));
  }, []);

  const handleSelectSortOrder = useCallback(
    (order: Exclude<SortOrder, "default">) => {
      setFilters((prev) => ({
        ...prev,
        sortOrder: prev.sortOrder === order ? "default" : order,
        activePanel: null,
      }));
    },
    [],
  );

  return (
    <div className={styles.centerblock}>
      <Search value={filters.searchQuery} onChange={handleSearchChange} />
      <h2 className={styles.centerblockH2}>{title}</h2>
      <FilterBar
        activePanel={filters.activePanel}
        selectedAuthors={filters.selectedAuthors}
        selectedGenres={filters.selectedGenres}
        sortOrder={filters.sortOrder}
        authors={uniqueAuthors}
        genres={uniqueGenres}
        onTogglePanel={handleTogglePanel}
        onSelectAuthor={handleSelectAuthor}
        onSelectGenre={handleSelectGenre}
        onSelectSortOrder={handleSelectSortOrder}
      />

      {isLoading ? (
        <div className={styles.listSection}>
          <TrackListSkeleton />
        </div>
      ) : error ? (
        <p className={classNames(styles.stateMessage, styles.stateError)}>
          {error}
        </p>
      ) : tracks.length === 0 ? (
        <p className={styles.stateMessage}>Треки не найдены.</p>
      ) : filteredTracks.length === 0 ? (
        <p className={styles.stateMessage}>Нет подходящих треков</p>
      ) : (
        <div className={styles.listSection}>
          <TrackList tracks={filteredTracks} />
        </div>
      )}
    </div>
  );
}

export default function CentralBlock(props: CentralBlockProps) {
  const pathname = usePathname();
  return <CentralBlockContent key={pathname} {...props} />;
}
