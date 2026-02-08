"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { authService } from "@/client/services/auth-service"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default function RegisterPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]> | null>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError("")
    setFieldErrors(null)

    const formData = new FormData(e.currentTarget)
    
    // Manual cast or construction to match RegisterDtoType 
    // Ideally we would use a form library like react-hook-form to manage this better
    const payload = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      password: formData.get("password") as string,
    }

    try {
      const data = await authService.register(payload)

      if (data.success) {
        router.push("/login")
      } else {
         // This block might not be reached if fetcher throws on success: false
         // But depending on API logic, sometimes 200 OK has success: false (though rare in our design)
        setError(data.message || "Gagal melakukan registrasi")
        if (data.error) {
          setFieldErrors(data.error)
        }
      }
    } catch (err: any) {
      // The fetcher throws the error response object if it's available
      if (err.message) {
        setError(err.message)
      } else {
        setError("Terjadi kesalahan. Silakan coba lagi.")
      }

      if (err.error) {
        setFieldErrors(err.error)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Register</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="rounded-md bg-red-50 p-3 text-sm text-red-800">
                {error}
              </div>
            )}
            
            <div>
              <Label>Nama</Label>
              <Input name="name" required />
              {fieldErrors?.name && (
                <p className="text-xs text-red-500 mt-1">{fieldErrors.name[0]}</p>
              )}
            </div>

            <div>
              <Label>Email</Label>
              <Input name="email" type="email" required />
              {fieldErrors?.email && (
                <p className="text-xs text-red-500 mt-1">{fieldErrors.email[0]}</p>
              )}
            </div>

            <div>
              <Label>Password</Label>
              <Input name="password" type="password" required />
              {fieldErrors?.password && (
                <p className="text-xs text-red-500 mt-1">{fieldErrors.password[0]}</p>
              )}
            </div>

            <Button className="w-full" disabled={loading}>
              {loading ? "Loading..." : "Register"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
