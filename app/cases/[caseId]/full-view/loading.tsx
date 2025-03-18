export default function Loading() {
  return (
    <div className="p-8">
      <div className="h-8 w-48 bg-muted rounded animate-pulse mb-6"></div>
      <div className="space-y-4">
        <div className="h-24 bg-muted rounded animate-pulse"></div>
        <div className="h-64 bg-muted rounded animate-pulse"></div>
        <div className="h-32 bg-muted rounded animate-pulse"></div>
      </div>
    </div>
  )
}

