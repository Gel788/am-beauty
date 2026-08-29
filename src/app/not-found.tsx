import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container-page flex min-h-[60vh] flex-col items-center justify-center py-24 text-center">
      <p className="text-[10px] tracking-[0.28em] text-grey uppercase">404</p>
      <h1 className="mt-4 font-display text-4xl tracking-[0.02em] md:text-5xl">Страница не найдена</h1>
      <p className="mt-4 max-w-md text-sm text-grey">
        Возможно, ссылка устарела или товар снят с продажи. Вернитесь в каталог или на главную.
      </p>
      <div className="mt-10 flex flex-wrap justify-center gap-3">
        <Link href="/catalog" className="btn-chanel">
          В каталог
        </Link>
        <Link href="/" className="btn-chanel-outline">
          На главную
        </Link>
      </div>
    </div>
  );
}
