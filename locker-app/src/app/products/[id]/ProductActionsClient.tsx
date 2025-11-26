"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { AddToCartButton } from "../../../components/cart/AddToCartButton";
import ProductPayButton from "../../../components/payment/ProductPayButton";

interface ProductResponse {
  id: number;
  name: string;
  description: string;
  price: string;
  stock: number;
  createdAt: string;
  updatedAt: string;
  images: any[];
  categories: any[];
}

export function ProductActionsClient({ product }: { product: ProductResponse }) {
  const [selectedSize, setSelectedSize] = useState<string | null>(null);

  const isShoes = product.categories.some((c) => c.category_id === 3);

  const SIZES = isShoes ? ["37", "38", "39", "40", "41", "42", "43", "44"] : ["P", "M", "G", "GG"];

  return (
    <>
      <div className="mb-6">
        <h3 className="text-base font-semibold text-gray-900 mb-3">
          Selecione o Tamanho: <span className="font-normal text-gray-600">{selectedSize || "Nenhum"}</span>
        </h3>

        <div className="flex gap-3">
          {SIZES.map((size) => (
            <button
              key={size}
              onClick={() => setSelectedSize(size)}
              className={cn(
                "size-10 flex items-center justify-center rounded-full border-2 text-sm font-medium transition-colors",
                selectedSize === size
                  ? "bg-[#0D0D0D] text-white border-[#0D0D0D] shadow-md"
                  : "bg-white text-gray-600 border-gray-300 hover:border-[#0D0D0D]/50"
              )}
            >
              {size}
            </button>
          ))}
        </div>

        {!selectedSize && <p className="text-xs text-red-500 mt-2">Escolha um tamanho para prosseguir.</p>}
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <AddToCartButton product={product} disabled={!selectedSize} />
      </div>
    </>
  );
}
