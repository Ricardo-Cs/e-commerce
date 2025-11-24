"use client";

import { useState } from "react";
import { Button } from "../ui/button";
import { DollarSign } from "lucide-react";

export default function ProductPayButton({ product }: { product: any }) {
  const [loading, setLoading] = useState(false);

  async function handlePay() {
    setLoading(true);

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/checkout`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        productId: product.id,
        name: product.name,
        price: Number(product.price),
      }),
    });

    const data = await res.json();
    setLoading(false);

    if (data.url) window.location.href = data.url;
    if (data.qrCode) window.location.href = data.qrCode;
  }

  return (
    <Button
      variant="default"
      size="default"
      className="flex-1 py-4 px-6 rounded-full font-semibold tracking-wide shadow-lg flex items-center justify-center gap-2 group"
      onClick={handlePay}
      disabled={loading}
    >
      {loading ? (
        "Processando..."
      ) : (
        <>
          <span>Pagar Agora</span>
          <DollarSign className="w-5 h-5" />
        </>
      )}
    </Button>
  );
}
