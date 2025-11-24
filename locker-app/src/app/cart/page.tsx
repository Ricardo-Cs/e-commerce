"use client";

import { useCart } from "@/context/CartContext";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Minus, Plus, Trash2, ShoppingCart, Loader2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { useState } from "react";
import AuthModal from "@/components/auth/AuthModal";

interface CartItem {
  id: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

function CartItemRow({ item }: { item: CartItem }) {
  const { updateQuantity, removeItem } = useCart();

  return (
    <div className="flex items-center py-4 border-b border-gray-200 last:border-b-0">
      {/* Imagem e Nome */}
      <Link href={`/products/${item.id}`} className="flex items-center gap-4 flex-1">
        <div className="relative w-20 h-20 shrink-0 bg-[#E5E5E5]">
          <Image src={item.image} alt={item.name} fill className="object-cover" sizes="80px" unoptimized />
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-medium text-[#0D0D0D] hover:text-[#B8860B] transition">{item.name}</span>
          <span className="text-xs text-gray-500">{formatCurrency(item.price)} cada</span>
        </div>
      </Link>

      {/* Controles de Quantidade */}
      <div className="flex items-center space-x-2 text-sm w-32 justify-center">
        <Button
          variant="outline"
          size="icon"
          className="h-7 w-7 border-gray-300"
          onClick={() => updateQuantity(item.id, item.quantity - 1)}
          disabled={item.quantity <= 1}
        >
          <Minus className="h-4 w-4" />
        </Button>
        <span className="w-8 text-center">{item.quantity}</span>
        <Button
          variant="outline"
          size="icon"
          className="h-7 w-7 border-gray-300"
          onClick={() => updateQuantity(item.id, item.quantity + 1)}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {/* Subtotal do Item */}
      <span className="font-semibold text-base w-24 text-right hidden sm:block">
        {formatCurrency(item.price * item.quantity)}
      </span>

      {/* Remover */}
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 text-gray-400 hover:text-red-500 ml-4"
        onClick={() => removeItem(item.id)}
        aria-label={`Remover ${item.name}`}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}

export default function CartPage() {
  const { items, totalPrice, clearCart, itemCount } = useCart();
  const { status } = useSession();
  const isAuthenticated = status === "authenticated";
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const handleCheckout = () => {
    if (!isAuthenticated) {
      setIsLoginModalOpen(true);
    } else {
      setIsCheckingOut(true);
      console.log("Iniciando processo de pagamento...");
      // Substitua este setTimeout pela chamada de API real e redirecionamento para /checkout
      setTimeout(() => {
        setIsCheckingOut(false);
        alert("Redirecionando para o pagamento! (Lógica a ser implementada)");
        // Exemplo: router.push('/checkout');
      }, 1000);
    }
  };

  const breadcrumbs = [
    { name: "Início", href: "/" },
    { name: "Carrinho", href: "/cart" },
  ];

  if (items.length === 0) {
    return (
      <div className="bg-[#FAFAFA] min-h-screen font-sans text-[#0D0D0D]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <ShoppingCart className="w-16 h-16 mx-auto mb-6 text-gray-400" />
          <h1 className="text-3xl font-serif font-bold mb-3">Seu carrinho está vazio</h1>
          <p className="text-gray-600 mb-8">Parece que você ainda não adicionou nada ao seu carrinho de compras.</p>
          <Button
            asChild
            className="bg-[#0D0D0D] hover:bg-gray-800 text-white py-3 px-8 text-base rounded-full transition"
          >
            <Link href="/products">Continuar Comprando</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#FAFAFA] min-h-screen font-sans text-[#0D0D0D]">
      {/* Breadcrumbs (Estrutura Simples) */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <ol className="flex items-center space-x-1 text-sm text-gray-500">
          {breadcrumbs.map((crumb, index) => (
            <li key={crumb.name} className="flex items-center">
              <Link href={crumb.href} className="hover:text-[#0D0D0D] transition">
                {crumb.name}
              </Link>
              {index < breadcrumbs.length - 1 && (
                <svg
                  className="w-4 h-4 mx-1"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              )}
            </li>
          ))}
        </ol>
      </div>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-serif font-bold mb-8">Seu Carrinho de Compras</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Coluna Principal do Carrinho (Itens) */}
          <div className="lg:col-span-2 bg-white p-6 shadow-sm border border-gray-200 rounded-lg">
            <div className="hidden sm:flex justify-between font-semibold text-sm text-gray-500 pb-3 border-b border-gray-200">
              <span className="flex-1">Produto</span>
              <span className="w-32 text-center">Qtd</span>
              <span className="w-24 text-right">Subtotal</span>
              <span className="w-8 ml-4"></span> {/* Para o botão remover */}
            </div>

            {items.map((item) => (
              <CartItemRow key={item.id} item={item} />
            ))}

            <div className="flex justify-between items-center pt-4">
              <Button variant="outline" className="text-gray-500 hover:text-red-500" onClick={clearCart}>
                Limpar Carrinho
              </Button>
              <span className="text-sm text-gray-600">Total de {itemCount} itens</span>
            </div>
          </div>

          {/* Coluna da Lateral (Resumo) */}
          <div className="lg:col-span-1 sticky top-32 h-fit bg-white p-6 shadow-lg border border-gray-200 rounded-lg">
            <h2 className="text-xl font-serif font-semibold mb-4 border-b pb-3">Resumo do Pedido</h2>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-gray-600 text-sm">
                <span>Subtotal dos Produtos</span>
                <span>{formatCurrency(totalPrice)}</span>
              </div>
              <div className="flex justify-between text-gray-600 text-sm">
                <span>Frete</span>
                <span className="font-semibold text-green-600">Grátis</span>
              </div>
              <div className="flex justify-between pt-3 border-t font-bold text-lg text-[#0D0D0D]">
                <span>Total (Impostos Inclusos)</span>
                <span>{formatCurrency(totalPrice)}</span>
              </div>
            </div>

            <Button
              onClick={handleCheckout}
              disabled={isCheckingOut || items.length === 0}
              className="w-full bg-[#0D0D0D] hover:bg-gray-800 text-white py-3 px-8 text-base rounded-full transition font-semibold"
            >
              {isCheckingOut ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processando...
                </>
              ) : isAuthenticated ? (
                "Continuar para o Pagamento"
              ) : (
                "Fazer Login para Pagar"
              )}
            </Button>

            {/* Informação sobre Checkout */}
            {!isAuthenticated && (
              <p className="text-center text-xs text-gray-500 mt-3">
                Você precisa fazer login para finalizar a compra.
              </p>
            )}
            {isAuthenticated && (
              <p className="text-center text-xs text-gray-500 mt-3">
                Você será redirecionado para a página de pagamento seguro.
              </p>
            )}

            <div className="mt-6 text-center">
              <Link href="/products" className="text-sm text-[#B8860B] hover:underline transition">
                ← Continuar Comprando
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Modal de Login */}
      <AuthModal open={isLoginModalOpen} onOpenChange={setIsLoginModalOpen} />
    </div>
  );
}
