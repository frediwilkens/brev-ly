import { useCallback, useEffect, useState } from "react";
import { MyLinks } from "../components/my-links";
import { UrlShortener } from "../components/url-shortener";
import { createShortLink, deleteShortLink, getShortLinks } from "../services/short-url-api";
import type { ShortLink } from "../types/short-link";

export function HomePage() {
  const [links, setLinks] = useState<ShortLink[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [deletingShortCode, setDeletingShortCode] = useState<string | null>(null);

  const refreshLinks = useCallback(async (signal?: AbortSignal) => {
    setIsLoading(true);
    setLoadError(null);
    try {
      const result = await getShortLinks(signal);
      setLinks(result.shortUrls);
    } catch (cause) {
      if (cause instanceof Error && cause.name === "AbortError") return;
      setLoadError("Não foi possível carregar seus links. Tente novamente.");
    } finally {
      if (!signal?.aborted) setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    void refreshLinks(controller.signal);
    return () => controller.abort();
  }, [refreshLinks]);

  const handleCreateLink = async (originalUrl: string, shortCode: string) => {
    await createShortLink({ originalUrl, shortCode });
    await refreshLinks();
  };

  const handleDeleteLink = async (shortCode: string) => {
    setDeletingShortCode(shortCode);
    setActionError(null);
    try {
      await deleteShortLink(shortCode);
      setLinks((current) => current.filter((link) => link.shortCode !== shortCode));
    } catch {
      setActionError("Não foi possível excluir o link. Tente novamente.");
    } finally {
      setDeletingShortCode(null);
    }
  };

  return (
    <main className="min-h-dvh bg-gray-200 px-3 pb-10 pt-8 font-open-sans sm:px-8 min-[1040px]:pt-22">
      <div className="mx-auto flex w-full max-w-244 flex-col">
        <header className="mb-6 flex h-6 items-center gap-2 min-[1040px]:mb-8">
          <img className="w-[26.667px]" src="/assets/brevly-mark.svg" alt="" />
          <span className="font-quicksand text-[18.667px] font-bold leading-6 text-blue-basic">
            brev.ly
          </span>
        </header>

        <div className="flex flex-col items-stretch gap-3 min-[1040px]:flex-row min-[1040px]:items-start min-[1040px]:gap-4">
          <UrlShortener onCreateLink={handleCreateLink} />
          <MyLinks
            links={links}
            isLoading={isLoading}
            loadError={loadError ?? actionError}
            deletingShortCode={deletingShortCode}
            onRetry={() => void refreshLinks()}
            onDeleteLink={handleDeleteLink}
          />
        </div>
      </div>
    </main>
  );
}
