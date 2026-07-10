const raw = process.env.NEXT_PUBLIC_API_URL ?? "https://api-the-pirate-beats.devdiego.work/api";
export const BaseURL = raw.replace(/\/+$/, "") + "/";
