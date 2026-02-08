export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white px-6 py-4 sticky bottom-0">
      <div className="flex items-center justify-between text-sm text-slate-500">
        <p>&copy; {new Date().getFullYear()} AI Requirement. All rights reserved.</p>
        <p>v1.0.0</p>
      </div>
    </footer>
  )
}
