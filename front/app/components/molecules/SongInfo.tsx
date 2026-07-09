interface SongInfoProps {
  title: string;
  duration: string;
  author?: string;
}

export default function SongInfo({ title, duration, author }: SongInfoProps) {
    return (
        <div className="flex-1 pl-3">
            <div>
                <p className="text-text-bright truncate max-w-96">{title}</p>
            </div>
            <div className="flex gap-4">
                {author && (
                    <div>
                        <span className="text-text-dim">{author}</span>
                    </div>
                )}
                <div>
                    <span className="text-text-dim">{duration}</span>
                </div>
            </div>
        </div>
    )
}