import { Link } from "react-router-dom";

export function NotFoundPage() {
  return (
    <main className="flex min-h-dvh items-center justify-center bg-gray-200 px-3 font-open-sans">
      <section className="flex w-full max-w-145 translate-y-[-17.5px] flex-col items-center justify-center gap-6 rounded-lg bg-gray-100 px-5 py-12 text-center sm:px-12 sm:py-16">
        <img
          className="h-18 w-41 object-fill sm:h-21.25 sm:w-48.5"
          src="/assets/not-found-404-desktop.svg"
          alt="404"
        />
        <h1 className="text-center text-2xl font-bold leading-8 text-gray-600">
          Link não encontrado
        </h1>
        <p className="w-full text-center text-sm font-semibold leading-4.5 text-gray-500">
          O link que você está tentando acessar não existe, foi removido ou é uma URL inválida.
          Saiba mais em{" "}
          <Link className="text-blue-basic underline" to="/">
            brev.ly
          </Link>
          .
        </p>
      </section>
    </main>
  );
}
