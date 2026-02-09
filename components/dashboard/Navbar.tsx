"use client"

import { useSession } from "next-auth/react"
import LogoutButton from "@/components/LogoutButton"
import { Menu } from "lucide-react"
import { useDashboard } from "@/components/dashboard/DashboardContext"

export default function Navbar() {
  const { data: session } = useSession()
  const { toggleSidebar } = useDashboard()

  return (
    <header className="fixed left-0 right-0 top-0 z-30 h-16 border-b border-slate-200 bg-white transition-all duration-300 md:left-64">
      <div className="flex h-full items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-4">
          <button
            onClick={toggleSidebar}
            className="text-slate-500 hover:text-slate-700 md:hidden"
          >
            <Menu className="h-6 w-6" />
          </button>
          <h2 className="text-lg font-semibold text-slate-800">Dashboard</h2>
        </div>

        <div className="flex items-center gap-4">
          {session?.user && (
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-200 text-sm font-medium text-slate-600">
                {session.user.name?.charAt(0) || session.user.email?.charAt(0) || "U"}
              </div>
              <span className="hidden text-sm text-slate-600 md:inline">{session.user.email}</span>
            </div>
          )}
          <LogoutButton />
        </div>
      </div>
    </header>
  )
}
