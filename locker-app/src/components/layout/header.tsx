"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, ShoppingCart, User, LogOut, ChevronDown } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
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
  const [showUserMenu, setShowUserMenu] = useState(false);

  const { data: session, status } = useSession();
  const isAuthenticated = status === "authenticated";
  const { itemCount } = useCart();

  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      <header className="container flex items-center mx-auto justify-between py-4 bg-white relative z-50">
        <Link href="/" className="text-4xl font-bold font-logo">
          Locker
        </Link>

        {showSearch && (
          <div className="hidden md:flex flex-1 justify-center mx-8">
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
            (isAuthenticated && session?.user ? (
              <div className="relative" ref={menuRef}>
                <Button
                  variant="outline"
                  className={`border-gray-400 bg-white flex items-center gap-2 ${showUserMenu ? "bg-gray-100" : ""}`}
                  onClick={() => setShowUserMenu(!showUserMenu)}
                >
                  <User className="w-5 h-5" />
                  <ChevronDown className={`w-3 h-3 transition-transform ${showUserMenu ? "rotate-180" : ""}`} />
                </Button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200 origin-top-right">
                    <div className="px-4 py-3 border-b border-gray-100 bg-gray-50/50">
                      <p className="text-sm font-medium text-gray-900">Minha Conta</p>
                      <p className="text-xs text-gray-500 truncate" title={session.user.email || ""}>
                        {session.user.email}
                      </p>
                    </div>

                    <div className="p-1">
                      <Link
                        href="/profile"
                        className="flex w-full items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <User className="w-4 h-4 mr-2" />
                        Meu Perfil
                      </Link>

                      <button
                        onClick={() => signOut({ callbackUrl: "/" })}
                        className="flex w-full items-center px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors mt-1"
                      >
                        <LogOut className="w-4 h-4 mr-2" />
                        Sair da Conta
                      </button>
                    </div>
                  </div>
                )}
              </div>
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
