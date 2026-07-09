import MusicLogo from "../atoms/MusicLogo";

export default function PlayerSistem() {
    return (
        <div className="max-w-240 w-full border border-border-dim">
            <div className="bg-surface px-3 py-1 w-full">
                <span className="text-text-dim">PLAYER DROP</span>
            </div>
            <div className="bg-bg-white p-5 border-t border-border-dim">
                <div className="flex justify-center gap-5">
                    <MusicLogo />
                    <div className="flex-1 flex flex-col">
                        <span className="text-text-bright">texto de prueba</span>
                        <span className="text-text-dim">Queen</span>
                    </div>
                </div>
                <div></div>
            </div>
        </div>
    )
}