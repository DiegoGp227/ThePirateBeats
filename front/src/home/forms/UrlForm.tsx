"use client";
import { useForm } from "react-hook-form"
import { useSongInfo } from "../hooks/useSongInfo"

type FormData = {
    url: string
}

export default function UrlForm() {
    const { register, handleSubmit, formState: { errors } } = useForm<FormData>()

    const { error, getInfo, loading } = useSongInfo()

    const onSubmit = (data: FormData) => {
        getInfo(data.url)
    }

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
            {errors.url && (
                <span className="text-red-bright text-sm mt-1">URL is required</span>
            )}
            {error && (
                <span className="text-red-bright text-sm mt-1">{error}</span>
            )}
        </form>
    )
}