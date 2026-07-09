import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { SongInfo } from "./download.store";

const MAX_CACHE = 3;

interface CacheStore {
  songs: SongInfo[];
  pushSong: (song: SongInfo) => void;
}

export const useCacheStore = create<CacheStore>()(
  persist(
    (set) => ({
      songs: [],
      pushSong: (song) =>
        set((state) => ({
          songs: [song, ...state.songs.filter((s) => s.title !== song.title)].slice(0, MAX_CACHE),
        })),
    }),
    { name: "song-cache" },
  ),
);
