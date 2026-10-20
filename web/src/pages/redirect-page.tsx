import { useEffect } from "react";

interface RedirectPageProps {
  redirectUrl: string;
}

export function RedirectPage({ redirectUrl }: RedirectPageProps) {
  useEffect(() => {
    const timeout = window.setTimeout(() => {
      window.location.assign(redirectUrl);
    }, 3000);

    return () => window.clearTimeout(timeout);
  }, [redirectUrl]);

  return (
    <main className="flex min-h-dvh items-center justify-center bg-gray-200 px-3 font-open-sans">
      <section className="flex w-full max-w-145 translate-y-[-17.5px] flex-col items-center justify-center gap-6 rounded-lg bg-gray-100 px-5 py-12 text-center sm:px-12 sm:py-16">
        <img
          className="size-12"
          src="/assets/brevly-redirect-desktop.svg"
          alt=""
          width="48"
          height="48"
        />
        <h1 className="text-2xl font-bold leading-8 text-gray-600">
          Redirecionando...
        </h1>
        <div className="flex w-full flex-col items-center gap-1 text-sm font-semibold leading-4.5 text-gray-500">
          <p>O link será aberto automaticamente em alguns instantes.</p>
          <p>
            Não foi redirecionado?{" "}
            <a className="text-blue-basic underline" href={redirectUrl}>
              Acesse aqui
            </a>
          </p>
        </div>
      </section>
    </main>
  );
}
