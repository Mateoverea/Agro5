import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function SignIn() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background">
      <h1 className="text-2xl font-bold mb-6">Sign In</h1>
      <p className="mb-4">Sign-in functionality coming soon</p>
      <Button asChild>
        <Link href="/">Back to Home</Link>
      </Button>
    </div>
  )
}

