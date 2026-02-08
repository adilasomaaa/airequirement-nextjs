"use client"

import { useSession } from "next-auth/react"
import LogoutButton from "@/components/LogoutButton"

export default function Navbar() {
  const { data: session } = useSession()

  return (
    <header className="fixed left-64 right-0 top-0 z-30 h-16 border-b border-slate-200 bg-white">
      <div className="flex h-full items-center justify-between px-6">
        <h2 className="text-lg font-semibold text-slate-800">Dashboard</h2>

        <div className="flex items-center gap-4">
          {session?.user && (
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-slate-200 flex items-center justify-center text-sm font-medium text-slate-600">
                {session.user.name?.charAt(0) || session.user.email?.charAt(0) || "U"}
              </div>
              <span className="text-sm text-slate-600">{session.user.email}</span>
            </div>
          )}
          <LogoutButton />
        </div>
      </div>
    </header>
  )
}
