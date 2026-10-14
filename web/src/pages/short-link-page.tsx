import { CircleNotchIcon } from "@phosphor-icons/react";
import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ApiError, getAccessUrl, getShortLink } from "../services/short-url-api";
import type { ShortLink } from "../types/short-link";
import { NotFoundPage } from "./not-found-page";
import { RedirectPage } from "./redirect-page";

export function ShortLinkPage() {
  const { shortCode = "" } = useParams();
  const [shortLink, setShortLink] = useState<ShortLink | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const loadShortLink = useCallback(async (signal?: AbortSignal) => {
    if (!/^[a-z0-9]{1,32}$/.test(shortCode)) {
      setIsLoading(false);
      setShortLink(null);
      setError(new ApiError("Link não encontrado", 404));
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      setShortLink(await getShortLink(shortCode, signal));
    } catch (cause) {
      if (cause instanceof Error && cause.name === "AbortError") return;
      setError(cause instanceof Error ? cause : new Error("Falha ao consultar o link."));
    } finally {
      if (!signal?.aborted) setIsLoading(false);
    }
  }, [shortCode]);

  useEffect(() => {
    const controller = new AbortController();
    void loadShortLink(controller.signal);
    return () => controller.abort();
  }, [loadShortLink]);

  if (isLoading) {
    return (
      <main className="flex min-h-dvh items-center justify-center bg-gray-200 px-4 font-open-sans">
        <div className="flex items-center gap-3 text-sm font-semibold text-gray-500" role="status">
          <CircleNotchIcon className="animate-spin" size={24} aria-hidden="true" />
          <span>Buscando link...</span>
        </div>
      </main>
    );
  }

  if (error instanceof ApiError && error.status === 404) {
    return <NotFoundPage />;
  }

  if (error) {
    return (
      <main className="flex min-h-dvh flex-col items-center justify-center gap-4 bg-gray-200 px-4 font-open-sans text-center">
        <p className="text-sm text-danger" role="alert">Não foi possível consultar este link. Verifique sua conexão e tente novamente.</p>
        <button className="rounded-lg bg-blue-basic px-5 py-3 text-sm font-semibold text-white" type="button" onClick={() => void loadShortLink()}>
          Tentar novamente
        </button>
      </main>
    );
  }

  return shortLink ? <RedirectPage redirectUrl={getAccessUrl(shortLink.shortCode)} /> : <NotFoundPage />;
}
