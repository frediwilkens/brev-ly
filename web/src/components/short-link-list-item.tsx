import { CopyIcon, TrashIcon } from "@phosphor-icons/react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { env } from "../config/env";
import type { ShortLink } from "../types/short-link";
import { IconActionButton } from "./icon-action-button";
import { LinksDivider } from "./links-divider";

interface ShortLinkListItemProps {
  link: ShortLink;
  onDelete: (shortCode: string) => void;
  isDeleting: boolean;
}

export function ShortLinkListItem({ link, onDelete, isDeleting }: ShortLinkListItemProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(
      `${env.VITE_FRONTEND_URL}/${encodeURIComponent(link.shortCode)}`,
    );
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  return (
    <li className="flex w-full flex-col gap-3 sm:gap-4">
      <LinksDivider />
      <div className="flex w-full items-center gap-4 py-0.5 sm:gap-5">
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <Link
            className="truncate text-sm font-semibold leading-4.5 text-blue-basic hover:underline"
            to={`/${encodeURIComponent(link.shortCode)}`}
          >
            brev.ly/{link.shortCode}
          </Link>
          <span className="truncate text-xs leading-4 text-gray-500">
            {link.originalUrl.replace(/^https?:\/\//i, "")}
          </span>
        </div>

        <span className="shrink-0 whitespace-nowrap text-right text-xs leading-4 text-gray-500">
          {link.accessCount} {link.accessCount === 1 ? "acesso" : "acessos"}
        </span>

        <div className="flex shrink-0 items-center gap-1">
          <IconActionButton
            label={copied ? "Link copiado" : `Copiar link brev.ly/${link.shortCode}`}
            onClick={() => void handleCopy()}
          >
            <CopyIcon size={16} color="#1F2025" aria-hidden="true" />
          </IconActionButton>
          <IconActionButton
            label={`Excluir link brev.ly/${link.shortCode}`}
            onClick={() => onDelete(link.shortCode)}
            disabled={isDeleting}
          >
            <TrashIcon size={16} color="#1F2025" aria-hidden="true" />
          </IconActionButton>
        </div>
      </div>
    </li>
  );
}
