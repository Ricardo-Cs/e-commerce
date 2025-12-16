"use client";

import { useEffect, useState, useMemo } from "react";
import { productsApi, api } from "@/lib/api/endpoints";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Edit, Trash2, Plus, Loader2, Package, Filter, AlertCircle } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { toast } from "sonner";
import { AdminProductForm } from "./AdminProductForm";
import { Badge } from "@/components/ui/badge";

export function AdminProductsTab() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<"ALL" | "LOW_STOCK" | "OUT_OF_STOCK">("ALL");

  // Controle do Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any | null>(null);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const data = await productsApi.list({ limit: 100 });
      setProducts(data.products || []);
    } catch (error) {
      toast.error("Erro ao carregar produtos.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Filtragem local
  const filteredProducts = useMemo(() => {
    if (filterStatus === "ALL") return products;
    if (filterStatus === "OUT_OF_STOCK") return products.filter((p) => p.stock === 0);
    if (filterStatus === "LOW_STOCK") return products.filter((p) => p.stock > 0 && p.stock < 5);
    return products;
  }, [products, filterStatus]);

  const handleCreate = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const handleEdit = (product: any) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Tem certeza que deseja excluir este produto?")) return;
    try {
      await api.del(`/products/${id}`);
      toast.success("Produto excluído.");
      fetchProducts();
    } catch (error) {
      toast.error("Erro ao excluir.");
    }
  };

  const handleFormSuccess = () => {
    setIsModalOpen(false);
    fetchProducts();
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header e Ações */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div className="flex items-center gap-2 bg-white p-1 rounded-md border border-gray-200">
          <Button
            variant={filterStatus === "ALL" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setFilterStatus("ALL")}
            className="text-xs"
          >
            Todos ({products.length})
          </Button>
          <Button
            variant={filterStatus === "LOW_STOCK" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setFilterStatus("LOW_STOCK")}
            className="text-xs text-orange-600 hover:text-orange-700"
          >
            Baixo Estoque
          </Button>
          <Button
            variant={filterStatus === "OUT_OF_STOCK" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setFilterStatus("OUT_OF_STOCK")}
            className="text-xs text-red-600 hover:text-red-700"
          >
            Esgotados
          </Button>
        </div>

        <Button onClick={handleCreate} className="bg-[#0D0D0D] text-white hover:bg-gray-800 shadow-md">
          <Plus className="w-4 h-4 mr-2" /> Novo Produto
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Produto
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Preço
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status Estoque
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                      <div className="flex flex-col items-center gap-2">
                        <Package className="w-8 h-8 text-gray-300" />
                        <p>Nenhum produto encontrado neste filtro.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-50 group transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-4">
                          <div className="h-12 w-12 bg-gray-100 rounded-md overflow-hidden flex-shrink-0 border border-gray-200">
                            {product.images && product.images[0] ? (
                              <img src={product.images[0].url} alt="" className="h-full w-full object-cover" />
                            ) : (
                              <div className="h-full w-full flex items-center justify-center text-gray-300">
                                <Package className="w-5 h-5" />
                              </div>
                            )}
                          </div>
                          <div>
                            <div className="text-sm font-semibold text-gray-900">{product.name}</div>
                            <div className="text-xs text-gray-500 truncate max-w-[200px]">{product.description}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {formatCurrency(product.price)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {product.stock === 0 ? (
                          <Badge variant="destructive" className="bg-red-100 text-red-700 hover:bg-red-200 border-0">
                            Esgotado
                          </Badge>
                        ) : product.stock < 5 ? (
                          <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200 gap-1">
                            <AlertCircle className="w-3 h-3" />
                            Baixo: {product.stock} un
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                            {product.stock} un
                          </Badge>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                          <Button variant="ghost" size="icon" onClick={() => handleEdit(product)} title="Editar">
                            <Edit className="w-4 h-4 text-gray-600" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDelete(product.id)} title="Excluir">
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Modal de Criar/Editar */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingProduct ? "Editar Produto" : "Novo Produto"}</DialogTitle>
          </DialogHeader>
          <AdminProductForm
            productToEdit={editingProduct}
            onSuccess={handleFormSuccess}
            onCancel={() => setIsModalOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
