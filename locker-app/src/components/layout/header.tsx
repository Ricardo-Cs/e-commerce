"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, ShoppingCart } from "lucide-react";
import { useState } from "react";

export function Header({
  showSearch = true,
  showLogin = true,
  showCart = true,
}: {
  showSearch?: boolean;
  showLogin?: boolean;
  showCart?: boolean;
}) {
  const [openLogin, setOpenLogin] = useState(false);

  return (
    <header className="container flex items-center mx-auto justify-between py-4 bg-white">
      <Link href="/" className="text-4xl font-bold font-logo">
        Locker
      </Link>

      {showSearch && (
        <div className="flex flex-1 justify-center mx-8">
          <div className="flex w-full max-w-lg">
            <Input type="search" placeholder="Buscar produtos..." className="rounded-r-none bg-white border-gray-400" />
            <Button className="rounded-l-none bg-primary" size="icon">
              <Search className="w-4 h-4 text-white" />
            </Button>
          </div>
        </div>
      )}

      <div className="flex items-center gap-3">
        {showLogin && (
          <Button variant="outline" className="border-gray-400 bg-white" onClick={() => setOpenLogin(true)}>
            Login
          </Button>
        )}

        {showCart && (
          <Button asChild className="p-0">
            <Link href="/cart" aria-label="Carrinho">
              <ShoppingCart className="w-5 h-5" />
            </Link>
          </Button>
        )}
      </div>
    </header>
  );
}
