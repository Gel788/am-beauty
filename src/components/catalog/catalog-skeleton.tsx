export function CatalogSkeleton() {
  return (
    <div className="animate-pulse bg-cream">
      <div className="h-[min(52vh,520px)] bg-black/10" />
      <div className="border-b border-border bg-white py-5">
        <div className="container-page flex gap-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-12 w-32 shrink-0 bg-cream" />
          ))}
        </div>
      </div>
      <div className="container-page py-16">
        <div className="h-4 w-40 bg-cream" />
        <div className="mt-12 grid gap-12 lg:grid-cols-[260px_1fr]">
          <div className="hidden h-96 bg-white lg:block" />
          <div className="grid grid-cols-2 gap-6 md:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i}>
                <div className="aspect-[3/4] bg-white" />
                <div className="mx-auto mt-4 h-3 w-24 bg-white" />
                <div className="mx-auto mt-2 h-4 w-16 bg-white" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
