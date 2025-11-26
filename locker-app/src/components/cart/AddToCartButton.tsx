"use client";

import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { toast } from "sonner";
import { StaticImport } from "next/dist/shared/lib/get-img-props";
import { Key } from "react";

interface ProductData {
  id: number;
  name: string;
  price: string;
  images: Array<{ id?: Key | null | undefined; url: string | StaticImport }>;
}

interface AddToCartButtonProps {
  product: ProductData;
  quantity?: number;
  disabled?: boolean;
}

export function AddToCartButton({ product, quantity = 1, disabled = false }: AddToCartButtonProps) {
  const { addItem } = useCart();

  const handleAddToCart = () => {
    const imageUrl =
      typeof product.images[0]?.url === "string"
        ? product.images[0].url
        : "https://placehold.co/100x100?text=Sem+Imagem";

    const itemToAdd = {
      id: product.id,
      name: product.name,
      price: Number(product.price),
      image: imageUrl,
      quantity: quantity,
    };

    addItem(itemToAdd);

    toast.success("Produto adicionado!", {
      description: `${product.name} foi adicionado ao seu carrinho.`,
      action: {
        label: "Ver Carrinho",
        onClick: () => (window.location.href = "/cart"),
      },
    });
  };

  return (
    <Button
      onClick={handleAddToCart}
      disabled={disabled}
      className="flex-1 py-4 px-6 rounded-full font-semibold tracking-wide shadow-lg flex items-center justify-center gap-2 group"
    >
      <span>Adicionar ao Carrinho</span>
      <ShoppingCart className="w-5 h-5" />
    </Button>
  );
}
