"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { categoriesApi } from "@/lib/api/endpoints";
import { toast } from "sonner";

interface CategoryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCategoryCreated: (category: { id: number; name: string }) => void;
}

export function CategoryModal({ open, onOpenChange, onCategoryCreated }: CategoryModalProps) {
  const [categoryName, setCategoryName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Chama a API para criar a categoria (usando a rota POST de admin)
      const newCategory = await categoriesApi.create({ name: categoryName });

      toast.success(`Categoria '${newCategory.name}' criada!`);
      onCategoryCreated(newCategory);
      setCategoryName("");
      onOpenChange(false);
    } catch (error) {
      // Erro já é tratado no client.ts (toast), apenas logamos para debug
      console.error("Failed to create category:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Criar Nova Categoria</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            placeholder="Nome da Categoria (ex: Blazers, Inverno)"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            required
            disabled={loading}
          />
          <Button type="submit" disabled={loading || categoryName.trim() === ""}>
            {loading ? "Criando..." : "Salvar Categoria"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
