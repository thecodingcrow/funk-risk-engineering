import Link from "next/link"

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)]">
      <h1 className="text-4xl font-bold mb-8">Welcome to Case Management System</h1>
      <Link href="/login" className="text-blue-500 hover:underline">
        Login
      </Link>
    </div>
  )
}

