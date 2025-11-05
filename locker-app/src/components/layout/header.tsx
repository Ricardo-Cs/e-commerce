// components/Header.tsx
"use client"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, ShoppingCart } from "lucide-react"

export function Header({ showSearch = true, showLogin = true, showCart = true }: { showSearch?: boolean, showLogin?: boolean, showCart?: boolean }) {
  return (
    <header className="flex items-center justify-between w-full px-6 py-4 border-b bg-background">
      <Link href="/" className="text-4xl font-bold font-logo">Locker</Link>

      {showSearch && (
        <div className="flex justify-center flex-1 mx-8">
          <div className="flex w-full max-w-lg">
            <Input type="search" placeholder="Buscar produtos..." className="rounded-r-none bg-white border-gray-400" />
            <Button className="rounded-l-none bg-primary cursor-pointer" size="icon">
              <Search className="w-4 h-4 text-white" />
            </Button>
          </div>
        </div>
      )}

      <div className="flex items-center gap-3">
        {showLogin && <Button variant="outline" asChild className="border-gray-400"><Link href="/login">Login</Link></Button>}
        {showCart && (
          <Button asChild className="p-0">
            <Link href="/cart" className="flex items-center justify-center" aria-label="Carrinho">
              <ShoppingCart className="w-5 h-5" />
            </Link>
          </Button>
        )}
      </div>
    </header>
  )
}
