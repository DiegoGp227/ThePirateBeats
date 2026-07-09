"use client";

import Image from "next/image";
import SongInfo from "./SongInfo";
import MusicLogo from "../atoms/MusicLogo";
import type { CachedSong } from "@/store/cache.store";
import { useDownloadStore } from "@/store/download.store";

interface SongDivProps {
  song: CachedSong;
  index: number;
}

export default function SongDiv({ song, index }: SongDivProps) {
    const selectSong = useDownloadStore((s) => s.selectSong);

    return (
        <div
            onClick={() => selectSong(song, song.url)}
            className="flex justify-between items-center h-16 bg-bg-white hover:bg-[#0e0808] border border-border-dim cursor-pointer group"
        >
            <div className="w-20"><span className="text-text-dim flex justify-center items-center h-full">{String(index + 1).padStart(2, "0")}</span></div>
            {song.thumbnail ? (
                <div className="w-11 h-11 shrink-0 overflow-hidden">
                    <Image src={song.thumbnail} alt={song.title} width={44} height={44} className="object-cover w-full h-full" />
                </div>
            ) : (
                <MusicLogo />
            )}
            <SongInfo title={song.title} duration={song.duration} author={song.author} />
            <div className="w-20 text-center">
                <span className="text-red-dim text-[0.6rem] uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                    ↓ dl
                </span>
            </div>
        </div>
    )
}