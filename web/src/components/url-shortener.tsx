import { UrlShortenerForm } from "./url-shortener-form";

interface UrlShortenerProps {
  onCreateLink: (originalUrl: string, shortCode: string) => Promise<void>;
}

export function UrlShortener({ onCreateLink }: UrlShortenerProps) {
  return (
    <section className="flex w-full shrink-0 flex-col gap-5 rounded-lg bg-gray-100 p-6 shadow-shape sm:gap-6 sm:p-8 min-[1040px]:w-95">
      <h1 className="w-full text-lg font-bold leading-6 text-gray-600">Novo link</h1>
      <UrlShortenerForm onCreateLink={onCreateLink} />
    </section>
  )
}