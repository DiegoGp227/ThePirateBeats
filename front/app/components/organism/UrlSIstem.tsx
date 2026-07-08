import UrlForm from "@/src/home/forms/UrlForm";

export default function UrlSIstem() {
    return (
        <div className="max-w-240 w-full border border-border-dim">
            <div className="bg-surface px-3 py-1 w-full">
                <span className="text-text-dim">URL DROP</span>
            </div>
            <div className="bg-bg-white p-5 border-y border-border-dim">
                <UrlForm />
            </div>
            <div className="px-3 py-1">
                <span className="text-red-bright">url drop</span>
            </div>
        </div>
    )
}