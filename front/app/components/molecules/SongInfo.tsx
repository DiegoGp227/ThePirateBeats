export default function SongInfo() {
    return (
        <div className="flex-1 pl-3">
            <div>
                <p className="text-text-bright">Song Name</p>
            </div>
            <div className="flex gap-4">
                <div>
                    <span className="text-text-dim">
                        Autor
                    </span>
                </div>
                <div>
                    <span className="text-text-dim">
                        Time
                    </span>
                </div>
            </div>
        </div>
    )
}