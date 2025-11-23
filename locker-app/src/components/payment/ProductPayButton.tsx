"use client";

import { useState } from "react";

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
    <button
      className="flex-1 bg-primary text-white py-4 px-6 rounded-full font-semibold hover:bg-gray-800 transition"
      onClick={handlePay}
      disabled={loading}
    >
      {loading ? "Processando..." : "Pagar Agora"}
    </button>
  );
}
