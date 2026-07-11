import { useRef, useState, useEffect, useCallback } from "react";

export function useAudioPlayer(fileUrl: string, isReady: boolean) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    audioRef.current = new Audio();
    return () => {
      audioRef.current?.pause();
      audioRef.current = null;
    };
  }, []);

  useEffect(() => {
    setError(null);
    if (!isReady || !fileUrl || !audioRef.current) return;
    const audio = audioRef.current;
    audio.src = fileUrl;
    audio.load();
    setPlaying(false);
    setProgress(0);
    setDuration(0);
  }, [isReady, fileUrl]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onTimeUpdate = () => setProgress(audio.currentTime);
    const onLoadedMeta = () => setDuration(audio.duration);
    const onEnded = () => {
      setPlaying(false);
      setProgress(0);
    };
    const onError = () => setError("Failed to load audio");

    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("loadedmetadata", onLoadedMeta);
    audio.addEventListener("ended", onEnded);
    audio.addEventListener("error", onError);

    return () => {
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("loadedmetadata", onLoadedMeta);
      audio.removeEventListener("ended", onEnded);
      audio.removeEventListener("error", onError);
    };
  }, []);

  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || error) return;
    if (playing) audio.pause();
    else audio.play().catch(() => {});
    setPlaying((p) => !p);
  }, [playing, error]);

  return { playing, progress, duration, error, togglePlay };
}
