"use client";

import { useState, useEffect, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronDown, Filter, X, Check, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { productsApi } from "@/lib/api/endpoints";
import { useSearchParams } from "next/navigation";

interface Product {
  id: number;
  name: string;
  description: string;
  price: string | number;
  stock: number;
  createdAt: string;
  updatedAt: string;
  images?: Array<{ id?: any; url: string }>;
  categories?: Array<{ category: { name: string } }>;
}

interface ProductsListResponse {
  products: Product[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

type SortOrder = "newest" | "price-asc" | "price-desc";

const PRODUCTS_PER_PAGE = 9;

// 1. Renomeamos o componente principal para ProductsContent e removemos o 'export default'
function ProductsContent() {
  const [products, setProducts] = useState<Product[]>([]);
  const [displayedProducts, setDisplayedProducts] = useState<Product[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);

  const [maxPrice, setMaxPrice] = useState<number | undefined>(undefined);
  const [priceInput, setPriceInput] = useState<string>("");

  const [totalProducts, setTotalProducts] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [loading, setLoading] = useState(true);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [sortOrder, setSortOrder] = useState<SortOrder>("newest");

  const searchParams = useSearchParams();

  // --- Funções Utilitárias ---
  const toggleCategory = (id: number) => {
    setSelectedCategories((prev) => (prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]));
  };

  const formatCurrency = (value: string | number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(Number(value));
  };

  useEffect(() => {
    const cat = searchParams.get("category");
    if (!cat) return;

    const numeric = Number(cat);

    if (!isNaN(numeric)) {
      setSelectedCategories([numeric]);
      setCurrentPage(1);
    }
  }, [searchParams]); // Adicionado searchParams nas dependências

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (priceInput.trim() === "") {
        setMaxPrice(undefined);
        return;
      }

      const cleanValue = priceInput.replace(/\./g, "").replace(",", ".");
      const numericValue = parseFloat(cleanValue);

      if (!isNaN(numericValue)) {
        setMaxPrice(numericValue);
      }
    }, 800);

    return () => clearTimeout(timeoutId);
  }, [priceInput]);

  const handlePriceChange = (value: string) => {
    setPriceInput(value);
  };

  const handleBlur = () => {
    if (priceInput.trim() === "") return;

    const cleanValue = priceInput.replace(/\./g, "").replace(",", ".");
    const numericValue = parseFloat(cleanValue);

    if (!isNaN(numericValue)) {
      setPriceInput(formatCurrency(numericValue).replace("R$", "").trim());
    } else {
      setPriceInput("");
    }
  };

  const sortProducts = (list: Product[], order: SortOrder): Product[] => {
    const sortedList = [...list];

    sortedList.sort((a, b) => {
      if (order === "newest") {
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();
        return dateB - dateA;
      }

      const priceA = parseFloat(String(a.price));
      const priceB = parseFloat(String(b.price));

      if (order === "price-asc") {
        return priceA - priceB;
      }

      if (order === "price-desc") {
        return priceB - priceA;
      }

      return 0;
    });

    return sortedList;
  };

  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true);

        const data: ProductsListResponse = await productsApi.list({
          page: currentPage,
          limit: PRODUCTS_PER_PAGE,
          categories: selectedCategories,
          maxPrice: maxPrice,
        });

        const fetchedList = Array.isArray(data.products) ? data.products : [];

        setProducts(fetchedList);
        setTotalProducts(data.total || 0);
        setTotalPages(data.totalPages || 1);
        setDisplayedProducts(sortProducts(fetchedList, sortOrder));
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, [currentPage, selectedCategories, maxPrice]); // Removido sortOrder daqui para evitar loop duplo, já é tratado no próximo useEffect

  useEffect(() => {
    if (products.length > 0) {
      const sorted = sortProducts(products, sortOrder);
      setDisplayedProducts(sorted);
    }
  }, [sortOrder, products]);

  const getProductImage = (product: Product) => {
    if (product.images && product.images.length > 0) {
      return product.images[0].url;
    }
    return "https://placehold.co/400x550/E0E0E0/202020?text=Sem+Imagem";
  };

  const getCategoryName = (product: Product) => {
    if (product.categories && product.categories.length > 0) {
      return product.categories[0].category.name;
    }
    return "Geral";
  };

  const renderPaginationButtons = () => {
    const pages = [];
    const maxButtons = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxButtons / 2));
    let endPage = Math.min(totalPages, startPage + maxButtons - 1);

    if (endPage - startPage + 1 < maxButtons) {
      startPage = Math.max(1, endPage - maxButtons + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => setCurrentPage(i)}
          className={cn(
            "px-4 py-2 text-sm font-medium transition",
            i === currentPage ? "bg-[#0D0D0D] text-white" : "text-gray-600 hover:bg-gray-100"
          )}
        >
          {i}
        </button>
      );
    }

    if (endPage < totalPages) {
      pages.push(
        <span key="ellipsis-end" className="px-2 text-gray-400">
          ...
        </span>
      );
    }

    return pages;
  };

  return (
    <div className="bg-[#FAFAFA] min-h-screen font-sans text-[#0D0D0D]">
      <div className="bg-[#E5E5E5] py-12 md:py-16 text-center">
        <h1 className="text-4xl md:text-5xl font-serif text-[#0D0D0D] mb-2">Nossa Coleção de Roupas</h1>
        <p className="text-gray-600 text-sm uppercase tracking-widest">
          {loading
            ? "Carregando..."
            : `Mostrando ${(currentPage - 1) * PRODUCTS_PER_PAGE + 1}–${Math.min(
                currentPage * PRODUCTS_PER_PAGE,
                totalProducts
              )} de ${totalProducts} produtos`}
        </p>
      </div>

      {/* Barra Mobile (Filtro e Sort) */}
      <div className="md:hidden sticky top-[72px] z-30 bg-white border-b border-gray-200 px-4 py-3 flex justify-between items-center shadow-sm">
        <button
          onClick={() => setMobileFiltersOpen(true)}
          className="flex items-center space-x-2 text-sm font-medium uppercase tracking-wide text-[#0D0D0D]"
        >
          <Filter className="w-4 h-4" />
          <span>Filtrar</span>
        </button>
        <div className="relative inline-block text-left">
          <select
            className="block w-full pl-3 pr-8 py-1 text-sm border-none focus:ring-0 text-gray-700 bg-transparent outline-none"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as SortOrder)}
          >
            <option value="newest">Mais Recentes</option>
            <option value="price-asc">Preço: Menor &gt; Maior</option>
            <option value="price-desc">Preço: Maior &gt; Menor</option>
          </select>
        </div>
      </div>

      {/* Layout Principal */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 flex items-start gap-12">
        {/* Sidebar Desktop */}
        <aside className="hidden md:block w-1/4 sticky top-32">
          <div className="space-y-8 pr-4">
            {/* Filtro: Categorias */}
            <div className="border-b border-gray-200 pb-6">
              <h3 className="font-serif text-lg font-medium mb-4">Categorias</h3>
              <ul className="space-y-3 text-sm text-gray-600">
                {["Masculino", "Feminino", "Calçado"].map((cat, i) => (
                  <li key={i}>
                    <label className="flex items-center cursor-pointer group">
                      <div className="relative flex items-center">
                        <input
                          type="checkbox"
                          checked={selectedCategories.includes(i + 1)}
                          onChange={() => toggleCategory(i + 1)}
                          className="peer sr-only"
                        />
                        <div className="w-4 h-4 border border-gray-300 mr-3 flex items-center justify-center transition group-hover:border-[#0D0D0D] peer-checked:bg-[#0D0D0D] peer-checked:border-[#0D0D0D]">
                          <Check className="w-2.5 h-2.5 text-white opacity-0 peer-checked:opacity-100" />
                        </div>
                        <span className="group-hover:text-[#0D0D0D] transition">{cat}</span>
                      </div>
                    </label>
                  </li>
                ))}
              </ul>
            </div>

            {/* Filtro: Preço */}
            <div className="border-b border-gray-200 pb-6">
              <h3 className="font-serif text-lg font-medium mb-4">Preço Máximo</h3>

              <div className="relative flex items-center border border-gray-300 focus-within:border-[#0D0D0D] transition rounded-md shadow-sm bg-white">
                <span className="inline-flex items-center px-3 text-sm text-gray-500 font-medium">R$</span>

                <input
                  type="text"
                  value={priceInput}
                  onChange={(e) => handlePriceChange(e.target.value)}
                  onBlur={handleBlur}
                  placeholder="Sem limite"
                  className="block w-full border-none pr-3 py-2 text-sm text-[#0D0D0D] placeholder-gray-400 focus:ring-0 outline-none"
                />
              </div>

              <div className="mt-3 text-xs text-gray-500 text-right">
                Filtro ativo:{" "}
                <span className="font-semibold text-[#0D0D0D]">
                  {maxPrice ? formatCurrency(maxPrice) : "Sem limite"}
                </span>
              </div>
            </div>
          </div>
        </aside>

        {/* Conteúdo Principal */}
        <div className="w-full md:w-3/4">
          {/* Barra Topo Desktop */}
          <div className="hidden md:flex justify-between items-center mb-8">
            <span className="text-sm text-gray-500">
              {loading
                ? "Buscando produtos..."
                : `Exibindo ${(currentPage - 1) * PRODUCTS_PER_PAGE + 1}–${Math.min(
                    currentPage * PRODUCTS_PER_PAGE,
                    totalProducts
                  )} de ${totalProducts} resultados`}
            </span>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-700">Ordenar por:</span>
              <select
                className="border-none text-sm font-medium focus:ring-0 bg-transparent cursor-pointer hover:text-[#0D0D0D] transition outline-none"
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value as SortOrder)}
              >
                <option value="newest">Mais Recentes</option>
                <option value="price-asc">Preço: Menor para Maior</option>
                <option value="price-desc">Preço: Maior para Menor</option>
              </select>
            </div>
          </div>

          {/* Estado de Loading */}
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="w-10 h-10 animate-spin text-gray-400" />
            </div>
          ) : displayedProducts.length === 0 ? (
            <div className="text-center py-20 text-gray-500">Nenhum produto encontrado.</div>
          ) : (
            /* Grid de Produtos */
            <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-10">
              {displayedProducts.map((product) => (
                <Link key={product.id} href={`/products/${product.id}`} className="group cursor-pointer">
                  <div className="relative overflow-hidden mb-3 aspect-3/4 bg-[#E5E5E5]">
                    <Image
                      src={getProductImage(product)}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-105 transition duration-500"
                      sizes="(max-width: 768px) 50vw, 33vw"
                      unoptimized
                    />

                    <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition duration-300 flex justify-center">
                      <span className="bg-white text-[#0D0D0D] text-xs font-bold uppercase py-2 px-6 shadow-lg hover:bg-[#0D0D0D] hover:text-white transition w-full text-center">
                        Ver Detalhes
                      </span>
                    </div>
                  </div>
                  <div className="text-center md:text-left">
                    <h3 className="text-sm font-medium text-[#0D0D0D] mb-1 group-hover:text-[#B8860B] transition">
                      {product.name}
                    </h3>
                    <p className="text-xs text-gray-500 mb-2">{getCategoryName(product)}</p>
                    <p className="text-sm font-semibold text-[#0D0D0D]">{formatCurrency(product.price)}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* Paginação */}
          {totalPages > 1 && (
            <div className="mt-16 flex justify-center">
              <nav className="flex items-center space-x-2">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="p-2 text-gray-400 hover:text-[#0D0D0D] transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronDown className="w-5 h-5 rotate-90" />
                </button>

                {renderPaginationButtons()}

                <button
                  onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="p-2 text-gray-400 hover:text-[#0D0D0D] transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronDown className="w-5 h-5 -rotate-90" />
                </button>
              </nav>
            </div>
          )}
        </div>
      </main>

      {/* Modal de Filtros Mobile */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileFiltersOpen(false)}
          />
          <div className="relative w-full max-w-xs bg-white shadow-xl h-full flex flex-col animate-in slide-in-from-right duration-300">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-serif font-medium text-[#0D0D0D]">Filtrar & Ordenar</h2>
              <button onClick={() => setMobileFiltersOpen(false)} className="text-gray-400 hover:text-gray-500">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="flex-1 py-6 px-6 overflow-y-auto space-y-8">
              <div>
                <h3 className="font-medium text-gray-900 mb-3 uppercase text-xs tracking-wider">Categorias</h3>
                <div className="space-y-3">
                  {["Feminino", "Masculino", "Calçado"].map((cat) => (
                    <label key={cat} className="flex items-center">
                      <input type="checkbox" className="mr-3 h-4 w-4 accent-[#0D0D0D] border-gray-300 rounded" />
                      <span className="text-sm text-gray-600">{cat}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
            <div className="border-t border-gray-200 px-6 py-4">
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="w-full flex justify-center items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-[#0D0D0D] hover:bg-gray-800"
              >
                Ver Resultados
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center min-h-screen bg-[#FAFAFA]">
          <Loader2 className="w-10 h-10 animate-spin text-gray-400" />
        </div>
      }
    >
      <ProductsContent />
    </Suspense>
  );
}
