"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, ShoppingCart, User } from "lucide-react";
import { useState } from "react";
import { useSession } from "next-auth/react";
import AuthModal from "../auth/AuthModal";
import { useCart } from "../../context/CartContext";

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
  const { status } = useSession();
  const isAuthenticated = status === "authenticated";
  const { itemCount } = useCart();

  return (
    <>
      <header className="container flex items-center mx-auto justify-between py-4 bg-white">
        <Link href="/" className="text-4xl font-bold font-logo">
          Locker
        </Link>

        {showSearch && (
          <div className="flex flex-1 justify-center mx-8">
            <div className="flex w-full max-w-lg">
              <Input
                type="search"
                placeholder="Buscar produtos..."
                className="rounded-r-none bg-white border-gray-400"
              />
              <Button className="rounded-l-none bg-primary" size="icon">
                <Search className="w-4 h-4 text-white" />
              </Button>
            </div>
          </div>
        )}

        <div className="flex items-center gap-3">
          {showCart && (
            <div className="relative">
              <Button asChild className="p-0">
                <Link href="/cart" aria-label={`Carrinho (${itemCount} itens)`}>
                  <ShoppingCart className="w-5 h-5" />
                </Link>
              </Button>
              {itemCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 size-4 flex items-center justify-center rounded-full bg-red-600 text-[10px] text-white font-bold pointer-events-none">
                  {itemCount}
                </span>
              )}
            </div>
          )}
          {showLogin &&
            (isAuthenticated ? (
              <Button asChild variant="outline" className="border-gray-400 bg-white">
                <Link href="/" aria-label="Acessar Perfil">
                  <User className="w-5 h-5" />
                </Link>
              </Button>
            ) : (
              <Button variant="outline" className="border-gray-400 bg-white" onClick={() => setOpenLogin(true)}>
                Login
              </Button>
            ))}
        </div>
      </header>

      <AuthModal open={openLogin} onOpenChange={setOpenLogin} />
    </>
  );
}
