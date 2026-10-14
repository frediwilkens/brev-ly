import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ApiError } from "../services/short-url-api";
import { UrlShortenerFormInput } from "./url-shortener-form-input";

const urlShortenerSchema = z.object({
  originalUrl: z
    .string()
    .trim()
    .min(1, { error: "Informe o link original" })
    .transform((value) => (/^https?:\/\//i.test(value) ? value : `https://${value}`))
    .pipe(z.url({ error: "Informe uma URL válida" })),
  shortCode: z
    .string()
    .trim()
    .min(1, { error: "Informe o link encurtado" })
    .max(32, { error: "Use no máximo 32 caracteres" })
    .transform((value) => value.toLowerCase())
    .pipe(
      z.string().regex(/^[a-z0-9]+$/, {
        error: "Use apenas letras minúsculas e números",
      }),
    ),
});

type UrlShortenerFormValues = z.infer<typeof urlShortenerSchema>;

interface UrlShortenerFormProps {
  onCreateLink: (originalUrl: string, shortCode: string) => Promise<void>;
}

export function UrlShortenerForm({ onCreateLink }: UrlShortenerFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isValid, isSubmitting },
  } = useForm<UrlShortenerFormValues>({
    resolver: zodResolver(urlShortenerSchema),
    mode: "onChange",
    defaultValues: {
      originalUrl: "",
      shortCode: "",
    },
  });

  const onSubmit = async (values: UrlShortenerFormValues) => {
    try {
      await onCreateLink(values.originalUrl, values.shortCode);
      reset();
    } catch (error) {
      if (error instanceof ApiError && error.status === 409) {
        setError("shortCode", { message: "Esse link encurtado já está em uso" });
        return;
      }
      setError("root.server", {
        message: "Não foi possível criar o link. Verifique sua conexão e tente novamente.",
      });
    }
  };

  return (
    <div className="flex flex-col gap-5 min-[1040px]:gap-6">
      <form
        id="new-short-url"
        className="flex flex-col gap-4"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
      >
        {errors.root?.server?.message && (
          <p className="text-sm text-danger" role="alert">
            {errors.root.server.message}
          </p>
        )}
        <UrlShortenerFormInput
          label="LINK ORIGINAL"
          type="text"
          inputMode="url"
          placeholder="www.exemplo.com.br"
          {...register("originalUrl")}
          error={errors.originalUrl?.message}
        />

        <UrlShortenerFormInput
          label="LINK ENCURTADO"
          type="text"
          prefix="brev.ly/"
          {...register("shortCode")}
          error={errors.shortCode?.message}
        />
      </form>
      <button
        className="h-12 w-full rounded-lg bg-blue-basic px-5 disabled:opacity-50"
        type="submit"
        form="new-short-url"
        disabled={!isValid || isSubmitting}
      >
        <span className="text-sm font-semibold leading-4.5 text-white">
          {isSubmitting ? "Salvando..." : "Salvar link"}
        </span>
      </button>
    </div>
  );
}