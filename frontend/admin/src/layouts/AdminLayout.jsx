import { Link, Outlet } from 'react-router-dom'
import { Button } from "@/components/ui/button"

export default function AdminLayout() {
  return (
    <div className="min-h-screen bg-background">
      <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r bg-card">
        <div className="flex h-16 items-center border-b px-6">
          <h1 className="text-lg font-semibold">Supershop Admin</h1>
        </div>
        <nav className="space-y-1 p-4">
          <Link to="/">
            <Button variant="ghost" className="w-full justify-start">
              Dashboard
            </Button>
          </Link>
          <Link to="/products">
            <Button variant="ghost" className="w-full justify-start">
              Products
            </Button>
          </Link>
          <Link to="/orders">
            <Button variant="ghost" className="w-full justify-start">
              Orders
            </Button>
          </Link>
        </nav>
      </aside>
      <main className="ml-64 p-6">
        <Outlet />
      </main>
    </div>
  )
} 