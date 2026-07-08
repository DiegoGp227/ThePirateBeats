import Image from "next/image";
import UrlSIstem from "./components/organism/UrlSIstem";

export default function HomePage() {
    return (
        <main className="flex items-center flex-col gap-5">
            <div className="max-w-240 my-10">
                <Image
                    src="/MainLogo.png"
                    width={0}
                    height={0}
                    sizes="100vw"
                    style={{ width: '400px', height: 'auto' }}
                    alt="ThePirateBeats Image"
                    loading="eager"
                />
            </div>
            <UrlSIstem />
            <UrlSIstem />

        </main>
    )
}