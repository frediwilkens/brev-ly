import {
  DownloadSimpleIcon,
} from "@phosphor-icons/react";
import { env } from "../config/env";
import type { ShortLink } from "../types/short-link";
import { EmptyLinksState } from "./empty-links-state";
import { ShortLinkListItem } from "./short-link-list-item";

interface MyLinksProps {
  links: ShortLink[];
  isLoading: boolean;
  loadError: string | null;
  deletingShortCode: string | null;
  onRetry: () => void;
  onDeleteLink: (shortCode: string) => void | Promise<void>;
}

export function MyLinks({
  links,
  isLoading,
  loadError,
  deletingShortCode,
  onRetry,
  onDeleteLink,
}: MyLinksProps) {
  const handleDownloadCsv = () => {
    const rows = [
      ["Link encurtado", "Link original", "Acessos", "Criado em"],
      ...links.map((link) => [
        `${env.VITE_FRONTEND_URL}/${encodeURIComponent(link.shortCode)}`,
        link.originalUrl,
        String(link.accessCount),
        link.createdAt,
      ]),
    ];
    const csv = rows
      .map((row) =>
        row.map((value) => `"${value.replaceAll('"', '""')}"`).join(","),
      )
      .join("\n");
    const url = URL.createObjectURL(
      new Blob([csv], { type: "text/csv;charset=utf-8" }),
    );
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "brevly-links.csv";
    anchor.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 0);
  };

  return (
    <section className="flex w-full flex-col gap-4 rounded-lg bg-gray-100 p-6 shadow-shape sm:gap-5 sm:p-8 min-[1040px]:w-145">
      <header className="flex w-full items-center justify-between">
        <h2 className="text-lg font-bold leading-6 text-gray-600">
          Meus links
        </h2>
        <button
          className="flex h-8 items-center justify-center gap-1.5 rounded bg-gray-200 px-2 enabled:hover:bg-gray-300 disabled:opacity-50"
          type="button"
          disabled={links.length === 0 || isLoading}
          onClick={handleDownloadCsv}
        >
          <DownloadSimpleIcon size={16} aria-hidden="true" />
          <span className="text-xs font-semibold leading-4 text-gray-500">
            Baixar CSV
          </span>
        </button>
      </header>

      {loadError ? (
        <div className="flex flex-col items-start gap-3" role="alert">
          <p className="text-sm text-danger">{loadError}</p>
          <button
            className="rounded bg-gray-200 px-3 py-2 text-sm font-semibold text-gray-500 hover:bg-gray-300"
            type="button"
            onClick={onRetry}
          >
            Tentar novamente
          </button>
        </div>
      ) : isLoading ? (
        <p className="py-6 text-center text-sm text-gray-500" role="status">
          Carregando links...
        </p>
      ) : links.length === 0 ? (
        <EmptyLinksState />
      ) : (
        <ul className="flex w-full flex-col gap-3 sm:gap-4">
          {links.map((link) => (
            <ShortLinkListItem
              key={link.id}
              link={link}
              onDelete={onDeleteLink}
              isDeleting={deletingShortCode === link.shortCode}
            />
          ))}
        </ul>
      )}
    </section>
  );
}
