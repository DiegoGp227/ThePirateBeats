import Image from "next/image";
import UrlSIstem from "./components/organism/UrlSIstem";
import HistorySistem from "./components/organism/HistorySistem";
import PlayerSystem from "./components/organism/PlayerSystem";

export default function HomePage() {
    return (
        <main className="flex items-center flex-col gap-5">
            <div className="max-w-240 my-10">
                <Image
                    src="/MainLogo.png"
                    width={0}
                    height={0}
                    sizes="100vw"
                    style={{ width: '500px', height: 'auto' }}
                    alt="ThePirateBeats Image"
                    loading="eager"
                />
            </div>
            <UrlSIstem />
            <HistorySistem />
            <PlayerSystem />
        </main>
    )
}