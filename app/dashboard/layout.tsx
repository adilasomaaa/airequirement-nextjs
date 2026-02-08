import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import Sidebar from "@/components/dashboard/Sidebar"
import Navbar from "@/components/dashboard/Navbar"
import Footer from "@/components/dashboard/Footer"

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
    <div className="min-h-screen bg-slate-50">
      <Sidebar />
      <Navbar />

      <main className="ml-64 min-h-screen pt-16">
        <div className="p-6">
          {children}
        </div>
        <Footer />
      </main>
    </div>
  )
}
