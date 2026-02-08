"use client"

import { useState, useEffect } from "react"
import { signIn } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    const errorParam = searchParams.get("error")
    if (errorParam === "unauthorized") {
      toast.error("Anda harus login terlebih dahulu")
    }
  }, [searchParams])

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError("")

    const formData = new FormData(e.currentTarget)

    const res = await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirect: false,
    })

    setLoading(false)

    if (res?.error) {
      setError("Email atau password salah")
      return
    }

    router.push("/dashboard")
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Login</CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label>Email</Label>
              <Input name="email" type="email" required />
            </div>

            <div>
              <Label>Password</Label>
              <Input name="password" type="password" required />
            </div>

            {error && (
              <p className="text-sm text-red-500">{error}</p>
            )}

            <Button className="w-full" disabled={loading}>
              {loading ? "Loading..." : "Login"}
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              Belum punya akun?{" "}
              <a
                href="/register"
                className="underline underline-offset-4"
              >
                Register
              </a>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
