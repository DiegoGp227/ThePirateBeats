export default function UrlForm() {
    return (
        <form action="" className="flex w-full">
            <input type="text" className="bg-black px-4 py-2 text-text placeholder:text-text-dim w-full border border-transparent focus:outline-none focus:border-red transition-all duration-300" placeholder="Write your URL"/>
            <button className="text-white bg-red-dim hover:bg-red-light px-5 transition-all duration-300">Send</button>
        </form>
    )
}