export default function Loading() {
  return (
    <div className="space-y-6">
      <div className="h-10 w-48 bg-muted rounded-custom animate-pulse"></div>

      <div className="bg-card p-6 rounded-custom shadow">
        <div className="h-8 w-1/3 bg-muted rounded-custom animate-pulse mb-6"></div>
        <div className="h-[500px] bg-muted rounded-custom animate-pulse"></div>
      </div>
    </div>
  )
}

