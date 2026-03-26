import { useState, useCallback, useEffect } from "react";

function getWatchlist(): string[] {
  try {
    return JSON.parse(localStorage.getItem("cryptopedia-watchlist") || "[]");
  } catch {
    return [];
  }
}

export function useWatchlist() {
  const [watchlist, setWatchlist] = useState<string[]>(getWatchlist);

  useEffect(() => {
    localStorage.setItem("cryptopedia-watchlist", JSON.stringify(watchlist));
  }, [watchlist]);

  const toggleWatchlist = useCallback((projectId: string) => {
    setWatchlist((prev) =>
      prev.includes(projectId)
        ? prev.filter((id) => id !== projectId)
        : [...prev, projectId]
    );
  }, []);

  const isWatching = useCallback(
    (projectId: string) => watchlist.includes(projectId),
    [watchlist]
  );

  return { watchlist, toggleWatchlist, isWatching };
}
