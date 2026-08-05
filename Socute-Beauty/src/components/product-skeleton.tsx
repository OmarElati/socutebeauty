export function ProductSkeleton() {
  return (
    <div className="group block space-y-4">
      <div className="relative aspect-[4/5] w-full overflow-hidden border border-gold/10 velvet-shimmer rounded-sm" />
      <div className="space-y-2">
        <div className="h-4 w-3/4 velvet-shimmer rounded-xs" />
        <div className="h-3 w-1/2 velvet-shimmer rounded-xs opacity-60" />
        <div className="h-4 w-1/4 velvet-shimmer rounded-xs opacity-80" />
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <ProductSkeleton key={i} />
      ))}
    </div>
  );
}
