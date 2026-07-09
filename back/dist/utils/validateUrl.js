const YOUTUBE_URL_REGEX = /^(https?:\/\/)?(www\.|m\.)?(youtube\.com\/(watch\?v=|shorts\/)|youtu\.be\/)[\w-]{11}([&?].*)?$/;
export function isValidYoutubeUrl(url) {
    if (typeof url !== "string")
        return false;
    return YOUTUBE_URL_REGEX.test(url.trim());
}
//# sourceMappingURL=validateUrl.js.map