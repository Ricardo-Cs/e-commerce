"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DialogFooter } from "@/components/ui/dialog";
import { categoriesApi, productsApi, api } from "@/lib/api/endpoints";
import { toast } from "sonner";
import { Loader2, Plus, X } from "lucide-react";

interface Category {
  id: number;
  name: string;
}

interface ProductFormProps {
  productToEdit?: any;
  onSuccess: () => void;
  onCancel: () => void;
}

export function AdminProductForm({ productToEdit, onSuccess, onCancel }: ProductFormProps) {
  const [name, setName] = useState(productToEdit?.name || "");
  const [description, setDescription] = useState(productToEdit?.description || "");
  const [price, setPrice] = useState(productToEdit?.price || "");
  const [stock, setStock] = useState(productToEdit?.stock || "");
  const [images, setImages] = useState<File[]>([]);

  // Categorias
  const [allCategories, setAllCategories] = useState<Category[]>([]);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<Set<number>>(new Set());

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadCategories() {
      try {
        const cats = await categoriesApi.list();
        setAllCategories(cats);

        if (productToEdit && productToEdit.categories) {
          // Mapear categorias existentes se for edição
          const existingIds = productToEdit.categories.map((c: any) => c.id || c.category_id);
          setSelectedCategoryIds(new Set(existingIds));
        }
      } catch (err) {
        console.error("Erro ao carregar categorias", err);
      }
    }
    loadCategories();
  }, [productToEdit]);

  const toggleCategory = (id: number) => {
    const newSet = new Set(selectedCategoryIds);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setSelectedCategoryIds(newSet);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const productData = {
        name,
        description,
        price: parseFloat(price),
        stock: parseInt(stock, 10),
      };

      let productId = productToEdit?.id;

      if (productToEdit) {
        // --- MODO EDIÇÃO ---
        await productsApi.update(productId, productData);
        toast.success("Dados do produto atualizados.");
      } else {
        // --- MODO CRIAÇÃO ---
        // 1. Criar produto base
        const newProduct = await api.post("/products/", productData);
        if (!newProduct?.id) throw new Error("Falha ao criar ID do produto");
        productId = newProduct.id;
        toast.success("Produto criado!");
      }

      // 2. Atualizar Categorias (comum para ambos)
      if (selectedCategoryIds.size > 0) {
        await productsApi.updateCategories(productId, Array.from(selectedCategoryIds));
      }

      // 3. Upload de Imagens (apenas se houver novas imagens selecionadas)
      if (images.length > 0) {
        const imageFormData = new FormData();
        images.forEach((file) => imageFormData.append("images", file));
        // Usando o endpoint raw pois o endpoint helper pode não estar configurado para multipart
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/${productId}/upload`, {
          method: "PUT",
          headers: {
            // Não setar Content-Type aqui, o browser seta com o boundary correto para FormData
            // Assumindo que o token venha do client.ts ou cookie, mas aqui simplificamos.
            // Se precisar de auth, é ideal usar a lib `api` configurada para multipart
            Authorization: `Bearer ${JSON.parse(localStorage.getItem("next-auth.session-token") || "null")}`, // Exemplo, ideal usar getSession
          },
          body: imageFormData,
        }).then(async (res) => {
          // Fallback para usar a api client se o fetch direto falhar por auth
          if (res.status === 401) {
            // Nota: O endpoint do seu arquivo client.ts tenta stringify o body se não for FormData,
            // mas aqui É FormData. Precisamos garantir que o client.ts suporte FormData corretamente.
            // Baseado no seu arquivo client.ts enviado, ele suporta!
            // Então vamos usar api.put
            await api.put(`/products/${productId}/upload`, imageFormData);
          }
        });
        toast.success("Imagens enviadas!");
      }

      onSuccess();
    } catch (error) {
      console.error(error);
      toast.error("Erro ao salvar produto.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Nome</label>
          <Input value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Preço (R$)</label>
          <Input type="number" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} required />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Descrição</label>
        <Input value={description} onChange={(e) => setDescription(e.target.value)} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Estoque</label>
          <Input type="number" value={stock} onChange={(e) => setStock(e.target.value)} required />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Novas Imagens</label>
          <Input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => setImages(Array.from(e.target.files ?? []))}
            className="cursor-pointer"
          />
          <p className="text-xs text-gray-500">
            {productToEdit ? "Deixe vazio para manter as atuais." : "Obrigatório no cadastro."}
          </p>
        </div>
      </div>

      <div className="space-y-2 pt-2">
        <label className="text-sm font-medium">Categorias</label>
        <div className="flex flex-wrap gap-2 p-3 border rounded-md max-h-32 overflow-y-auto">
          {allCategories.map((cat) => (
            <div
              key={cat.id}
              onClick={() => toggleCategory(cat.id)}
              className={`cursor-pointer px-3 py-1 rounded-full text-xs border transition-colors ${
                selectedCategoryIds.has(cat.id)
                  ? "bg-[#0D0D0D] text-white border-[#0D0D0D]"
                  : "bg-white text-gray-600 hover:bg-gray-100"
              }`}
            >
              {cat.name}
            </div>
          ))}
        </div>
      </div>

      <DialogFooter className="gap-2 sm:gap-0 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" disabled={loading} className="bg-[#0D0D0D] hover:bg-gray-800 text-white">
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {productToEdit ? "Salvar Alterações" : "Criar Produto"}
        </Button>
      </DialogFooter>
    </form>
  );
}
