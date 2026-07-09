import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { SongInfo } from "./download.store";

const MAX_CACHE = 3;

export interface CachedSong extends SongInfo {
  url: string;
}

interface CacheStore {
  songs: CachedSong[];
  pushSong: (song: SongInfo, url: string) => void;
}

export const useCacheStore = create<CacheStore>()(
  persist(
    (set) => ({
      songs: [],
      pushSong: (song, url) =>
        set((state) => ({
          songs: [{ ...song, url }, ...state.songs.filter((s) => s.title !== song.title)].slice(0, MAX_CACHE),
        })),
    }),
    { name: "song-cache" },
  ),
);
