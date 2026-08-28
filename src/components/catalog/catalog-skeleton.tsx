export function CatalogSkeleton() {
  return (
    <div className="container-page section-pad animate-pulse">
      <div className="mx-auto h-8 w-48 bg-cream" />
      <div className="mx-auto mt-4 h-10 w-64 bg-cream" />
      <div className="mt-12 grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i}>
            <div className="aspect-[3/4] bg-cream" />
            <div className="mx-auto mt-4 h-3 w-24 bg-cream" />
            <div className="mx-auto mt-2 h-4 w-16 bg-cream" />
          </div>
        ))}
      </div>
    </div>
  );
}
