"use client";

import { useEffect, useState, useMemo } from "react";
import { useParams } from "next/navigation";
import { categoriesApi, productsApi } from "@/lib/api/endpoints";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Check, Plus } from "lucide-react";
import { toast } from "sonner";
import { CategoryModal } from "../../../../../components/admin/categoryModal";

interface Category {
  id: number;
  name: string;
}

interface ProductData {
  id: number;
  name: string;
  description: string;
  price: string | number;
  stock: string | number;
  categories: Category[];
}

export default function UpdateProductPage() {
  const params = useParams();
  const productId = params.id as string;

  const [product, setProduct] = useState<ProductData | null>(null);
  const [allCategories, setAllCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: 0,
    stock: 0,
    selectedCategoryIds: new Set<number>(),
  });

  const fetchInitialData = async () => {
    try {
      setLoading(true);

      const [productData, categoriesData] = await Promise.all([productsApi.get(productId), categoriesApi.list()]);

      setProduct(productData);
      setAllCategories(categoriesData);

      setFormData({
        name: productData.name,
        description: productData.description,
        price: parseFloat(String(productData.price)),
        stock: parseInt(String(productData.stock), 10),
        selectedCategoryIds: new Set(productData.categories?.map((c: Category) => c.id) || []),
      });
    } catch (error) {
      toast.error("Erro ao carregar dados do produto/categorias.");
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (productId) {
      fetchInitialData();
    }
  }, [productId]);

  const handleCategoryToggle = (categoryId: number) => {
    setFormData((prev) => {
      const newSet = new Set(prev.selectedCategoryIds);
      if (newSet.has(categoryId)) {
        newSet.delete(categoryId);
      } else {
        newSet.add(categoryId);
      }
      return { ...prev, selectedCategoryIds: newSet };
    });
  };

  const handleCategoryCreated = (newCategory: Category) => {
    setAllCategories((prev) => [...prev, newCategory]);
    // Seleciona a categoria recém-criada automaticamente
    setFormData((prev) => ({
      ...prev,
      selectedCategoryIds: new Set(prev.selectedCategoryIds).add(newCategory.id),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const productUpdatePayload = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(String(formData.price)),
        stock: parseInt(String(formData.stock), 10),
      };

      await productsApi.update(productId, productUpdatePayload);

      const categoryIdsArray = Array.from(formData.selectedCategoryIds);
      await productsApi.updateCategories(productId, categoryIdsArray);

      toast.success("✅ Produto e categorias atualizados com sucesso!");
    } catch (error) {
      toast.error("❌ Falha ao salvar produto.");
    } finally {
      setIsSaving(false);
    }
  };

  if (loading || !product) {
    return <div className="container py-12">Carregando dados do produto...</div>;
  }

  return (
    <div className="container py-12 max-w-4xl mx-auto">
      <h1 className="text-3xl font-serif font-light mb-6">Editar Produto: {product.name}</h1>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Coluna Principal: Formulário */}
        <Card className="md:col-span-2 p-6">
          <CardHeader>
            <CardTitle>Detalhes do Produto</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <label className="flex flex-col gap-1.5">
              Nome:
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </label>
            <label className="flex flex-col gap-1.5">
              Descrição:
              <Input
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </label>
            <div className="grid grid-cols-2 gap-4">
              <label className="flex flex-col gap-1.5">
                Preço (R$):
                <Input
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                  required
                />
              </label>
              <label className="flex flex-col gap-1.5">
                Estoque:
                <Input
                  type="number"
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value, 10) })}
                  required
                />
              </label>
            </div>
            <Button type="submit" disabled={isSaving} className="mt-4 w-full">
              {isSaving ? "Salvando..." : "Salvar Alterações"}
            </Button>
          </CardContent>
        </Card>

        <Card className="p-6">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Categorias
              <Button type="button" variant="ghost" size="icon-sm" onClick={() => setIsModalOpen(true)}>
                <Plus className="w-4 h-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-2 max-h-96 overflow-y-auto">
            {allCategories.length === 0 ? (
              <p className="text-sm text-muted-foreground">Nenhuma categoria encontrada. Crie uma.</p>
            ) : (
              allCategories.map((category) => (
                <div
                  key={category.id}
                  className="flex items-center justify-between p-2 border rounded-md cursor-pointer hover:bg-accent transition"
                  onClick={() => handleCategoryToggle(category.id)}
                >
                  <span className="text-sm">{category.name}</span>
                  {formData.selectedCategoryIds.has(category.id) && <Check className="w-4 h-4 text-primary" />}
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </form>

      <CategoryModal open={isModalOpen} onOpenChange={setIsModalOpen} onCategoryCreated={handleCategoryCreated} />
    </div>
  );
}
