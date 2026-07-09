import SongInfo from "./SongInfo";
import MusicLogo from "../atoms/MusicLogo";
import type { SongInfo as SongInfoType } from "@/store/download.store";

interface SongDivProps {
  song: SongInfoType;
  index: number;
}

export default function SongDiv({ song, index }: SongDivProps) {
    return (
        <div className="flex justify-between items-center h-16 bg-bg-white hover:bg-[#0e0808] border border-border-dim">
            <div className="w-20"><span className="text-text-dim flex justify-center items-center h-full">{String(index + 1).padStart(2, "0")}</span></div>
            <MusicLogo />
            <SongInfo title={song.title} duration={song.duration} author={song.author} />
            <div className="w-20"><span className="text-text-dim">—</span></div>
        </div>
    )
}