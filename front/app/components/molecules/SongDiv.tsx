import { Music2Icon, Music4 } from "lucide-react";
import SongInfo from "./SongInfo";
import MusicLogo from "../atoms/MusicLogo";

export default function SongDiv() {
    return (
        <div className="flex justify-between items-center h-16 bg-bg-white hover:bg-[#0e0808] border border-border-dim">
            <div className="w-20"><span className="text-text-dim flex justify-center items-center h-full">01</span></div>
            <MusicLogo />
            <SongInfo />
            <div className="w-20"><span className="text-text-dim">8.3 MB</span></div>
        </div>
    )
}