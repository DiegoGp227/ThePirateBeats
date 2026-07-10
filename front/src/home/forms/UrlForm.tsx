"use client";
import { useForm } from "react-hook-form"
import { useSongInfo } from "../hooks/useSongInfo"
import { useEffect } from "react";

type FormData = {
    url: string
}

interface UrlFormProps {
    setTextInfo: React.Dispatch<React.SetStateAction<string>>;
}

export default function UrlForm({ setTextInfo }: UrlFormProps) {
    const { register, handleSubmit, formState: { errors } } = useForm<FormData>()

    const { error, getInfo, loading } = useSongInfo()

    const onSubmit = (data: FormData) => {
        getInfo(data.url)
    }

    useEffect(() => {
        const msg = errors.url ? "URL is required" : (error ?? "Paste a YouTube or SoundCloud link to get started")
        setTextInfo(msg)
    }, [errors.url?.type, error, setTextInfo]);


    return (
        <form onSubmit={handleSubmit(onSubmit)} className="flex w-full flex-col">
            <div className="flex w-full">
                <input
                    type="text"
                    className="bg-black px-4 py-2 text-text placeholder:text-text-dim w-full border border-transparent focus:outline-none focus:border-red transition-all duration-300"
                    placeholder="Write your URL"
                    {...register("url", { required: true })}
                />
                <button
                    className="text-white bg-red-dim hover:bg-red-light px-5 transition-all duration-300 disabled:opacity-50"
                    type="submit"
                    disabled={loading}
                >
                    {loading ? "Loading..." : "Send"}
                </button>
            </div>
        </form>
    )
}