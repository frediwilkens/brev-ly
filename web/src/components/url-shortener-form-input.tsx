import type { ComponentProps } from "react";

interface UrlShortenerFormInputProps extends ComponentProps<"input"> {
  label: string;
  error?: string;
  prefix?: string;
}

export function UrlShortenerFormInput({ label, error, prefix, className, id, ...inputProps }: UrlShortenerFormInputProps) {
  const inputId = id ?? inputProps.name;

  return (
    <label className="flex flex-col gap-2" htmlFor={inputId}>
      <span className="text-gray-500 text-xxs leading-3.5">{label}</span>
      {prefix ? (
        <div className="flex h-12 w-full items-center rounded-lg border border-gray-300 focus-within:border-blue-basic">
          <span className="shrink-0 pl-4 text-sm leading-4.5 text-gray-400">{prefix}</span>
          <input
            {...inputProps}
            id={inputId}
            className={`min-w-0 flex-1 bg-transparent p-4 pl-0 text-sm leading-4.5 text-gray-600 outline-none ${className ?? ""}`}
            aria-invalid={Boolean(error)}
            aria-describedby={error && inputId ? `${inputId}-error` : undefined}
          />
        </div>
      ) : (
        <input
          {...inputProps}
          id={inputId}
          className={`h-12 w-full rounded-lg border border-gray-300 p-4 text-sm leading-4.5 text-gray-600 placeholder:text-gray-400 placeholder:opacity-100 ${className ?? ""}`}
          aria-invalid={Boolean(error)}
          aria-describedby={error && inputId ? `${inputId}-error` : undefined}
        />
      )}
      {error && <span id={`${inputId}-error`} className="text-danger text-xs" role="alert">{error}</span>}
    </label>
  )
}