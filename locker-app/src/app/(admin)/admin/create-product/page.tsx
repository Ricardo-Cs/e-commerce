"use client";

import { useState } from "react";
import { api } from "@/lib/api/client";

export default function CreateProductPage() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    if (images.length === 0) {
      setMessage("Selecione ao menos uma imagem.");
      setLoading(false);
      return;
    }

    try {
      const productData = {
        name,
        description,
        price: parseFloat(price),
        stock: parseInt(stock, 10),
      };

      const product = await api.post("/products/", productData);

      if (!product || !product.id) {
        throw new Error("Produto criado, mas ID não foi retornado.");
      }

      const imageFormData = new FormData();
      images.forEach((file) => imageFormData.append("images", file));

      await api.put(`/products/${product.id}/upload`, imageFormData);

      setMessage("✅ Produto e imagens criados com sucesso!");

      // Limpar formulário
      setName("");
      setDescription("");
      setPrice("");
      setStock("");
      setImages([]);
    } catch (error) {
      // O cliente API já exibe o toast de erro
      setMessage("❌ Erro ao criar produto. Verifique o console.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-xl font-bold mb-4">Criar Produto</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <input placeholder="Nome" value={name} onChange={(e) => setName(e.target.value)} required disabled={loading} />
        <input
          placeholder="Descrição"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          disabled={loading}
        />
        <input
          placeholder="Preço"
          type="number"
          step="0.01"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
          disabled={loading}
        />
        <input
          placeholder="Estoque"
          type="number"
          value={stock}
          onChange={(e) => setStock(e.target.value)}
          required
          disabled={loading}
        />
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => setImages(Array.from(e.target.files ?? []))}
          required
          disabled={loading}
        />
        <button type="submit" className="bg-blue-500 text-white p-2 mt-2" disabled={loading}>
          {loading ? "Carregando..." : "Criar"}
        </button>
      </form>
      {message && <p className={`mt-2 ${message.startsWith("✅") ? "text-green-600" : "text-red-500"}`}>{message}</p>}
    </div>
  );
}
