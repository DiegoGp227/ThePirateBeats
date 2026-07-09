"use client";

import SongDiv from "../molecules/SongDiv";
import { useCacheStore } from "@/store/cache.store";

export default function HistorySistem() {
    const songs = useCacheStore((s) => s.songs);

    if (songs.length === 0) return null;

    return (
        <div className="flex flex-col max-w-240 w-full">
            {songs.map((song, i) => (
                <SongDiv key={`${song.title}-${i}`} song={song} index={i} />
            ))}
        </div>
    )
}