export default function SkeletonCard() {
  return (
    <div className="rounded-xl bg-white p-4 shadow-sm">
      <div className="shimmer h-4 w-1/3 rounded mb-3" />
      <div className="shimmer h-3 w-2/3 rounded mb-2" />
      <div className="shimmer h-6 w-1/4 rounded" />
    </div>
  );
}
