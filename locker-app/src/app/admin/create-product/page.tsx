"use client";

import { useState } from "react";

export default function CreateProductPage() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (images.length === 0) {
      setMessage("Selecione ao menos uma imagem");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("stock", stock);

    images.forEach((file) => formData.append("images", file));

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/`, {
      method: "POST",
      body: formData,
    });

    if (res.ok) {
      setMessage("Produto criado com sucesso!");
      setName("");
      setDescription("");
      setPrice("");
      setStock("");
      setImages([]);
    } else {
      setMessage("Erro ao criar produto.");
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-xl font-bold mb-4">Criar Produto</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <input placeholder="Nome" value={name} onChange={(e) => setName(e.target.value)} required />
        <input placeholder="Descrição" value={description} onChange={(e) => setDescription(e.target.value)} />
        <input
          placeholder="Preço"
          type="number"
          step="0.01"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
        />
        <input placeholder="Estoque" type="number" value={stock} onChange={(e) => setStock(e.target.value)} required />
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => setImages(Array.from(e.target.files ?? []))}
          required
        />
        <button type="submit" className="bg-blue-500 text-white p-2 mt-2">
          Criar
        </button>
      </form>
      {message && <p className="mt-2">{message}</p>}
    </div>
  );
}
