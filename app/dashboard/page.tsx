import { getServerSession } from "next-auth"

export default async function DashboardPage() {
  const session = await getServerSession()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">
          Selamat Datang, {session?.user?.name || session?.user?.email}!
        </h1>
        <p className="text-slate-500">Ini adalah halaman dashboard Anda.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <h3 className="text-sm font-medium text-slate-500">Total Pengguna</h3>
          <p className="mt-2 text-3xl font-bold text-slate-900">128</p>
        </div>

        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <h3 className="text-sm font-medium text-slate-500">Requirement Aktif</h3>
          <p className="mt-2 text-3xl font-bold text-slate-900">45</p>
        </div>

        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <h3 className="text-sm font-medium text-slate-500">Proyek</h3>
          <p className="mt-2 text-3xl font-bold text-slate-900">12</p>
        </div>

        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <h3 className="text-sm font-medium text-slate-500">Selesai</h3>
          <p className="mt-2 text-3xl font-bold text-slate-900">89%</p>
        </div>
      </div>

      <div className="rounded-lg border bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-800 mb-4">Aktivitas Terbaru</h2>
        <div className="space-y-4">
          <div className="flex items-center gap-4 text-sm">
            <span className="text-slate-400">10:30</span>
            <span className="text-slate-600">Requirement baru ditambahkan: "User Authentication"</span>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <span className="text-slate-400">09:15</span>
            <span className="text-slate-600">Proyek "E-Commerce" diupdate</span>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <span className="text-slate-400">Kemarin</span>
            <span className="text-slate-600">3 requirement diselesaikan</span>
          </div>
        </div>
      </div>
    </div>
  )
}

