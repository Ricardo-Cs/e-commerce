import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowRightToLine, ShoppingCart } from "lucide-react"

export function Header() {
  return (
    <header className="flex items-center justify-between w-full px-6 py-4 border-b bg-background">
        <div>
            <Link href="/" className="text-4xl font-bold font-logo">
                Locker
            </Link>
        </div>

        <div className="flex justify-center flex-1 mx-8">
        <div className="flex w-full max-w-lg">
            <Input
            type="search"
            placeholder="Buscar produtos..."
            className="rounded-r-none bg-white"
            />
            <Button className="rounded-l-none bg-primary hover:bg-black/80" size="icon">
            <ArrowRightToLine className="w-4 h-4 text-white" />
            </Button>
        </div>
        </div>

      <div className="flex items-center gap-3">
        <Button variant="outline" asChild>
          <Link href="/login" className="bg-white">Login</Link>
        </Button>
        <Button asChild className="p-0">
        <Link
            href="/cart"
            className="flex items-center justify-center"
            aria-label="Carrinho">
            <ShoppingCart className="w-5 h-5" />
        </Link>
        </Button>
      </div>
    </header>
  )
}
