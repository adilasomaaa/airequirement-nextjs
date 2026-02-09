import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import Sidebar from "@/components/dashboard/Sidebar"
import Navbar from "@/components/dashboard/Navbar"
import Footer from "@/components/dashboard/Footer"
import { DashboardProvider } from "@/components/dashboard/DashboardContext"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession()

  if (!session) {
    redirect("/login?error=unauthorized")
  }

  return (
    <DashboardProvider>
      <div className="min-h-screen bg-slate-50">
        <Sidebar />
        <Navbar />

        <main className="flex min-h-screen flex-col pt-16 transition-all duration-300 md:ml-64">
          <div className="flex-1 p-4 md:p-6">
            {children}
          </div>
          <Footer />
        </main>
      </div>
    </DashboardProvider>
  )
}
