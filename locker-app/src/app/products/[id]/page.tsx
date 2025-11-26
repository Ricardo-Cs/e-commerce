import { StaticImport } from "next/dist/shared/lib/get-img-props";
import { Key } from "react";
import { Breadcrumbs } from "../../../components/layout/breadCumbs";
import ProductGallery from "../../../components/layout/productGallery";

import { ProductActionsClient } from "./ProductActionsClient";

interface CategoryData {
  id: number;
  name: string;
  parent: { id: number; name: string } | null;
  children: { id: number; name: string }[];
}

interface ProductCategoryEntry {
  product_id: number;
  category_id: number;
  category: CategoryData;
}

interface ProductResponse {
  id: number;
  name: string;
  description: string;
  price: string;
  stock: number;
  createdAt: string;
  updatedAt: string;
  images: Array<{ id: Key | null | undefined; url: string | StaticImport }>;
  categories: ProductCategoryEntry[];
}

interface PageProps {
  params: Promise<{ id: string }>;
}

interface Crumb {
  label: string;
  href?: string;
}

// --- FUNÇÕES UTILITÁRIAS ---
function getBreadcrumbItems(productCategories: ProductCategoryEntry[], productName: string): Crumb[] {
  const leafEntry = productCategories.find((entry) => entry.category.parent !== null);
  const categoryToUse = leafEntry || productCategories[0];

  if (!categoryToUse) {
    return [{ label: "Home", href: "/" }, { label: productName }];
  }

  const crumbs: Crumb[] = [];

  if (categoryToUse.category.parent) {
    const parent = categoryToUse.category.parent;
    crumbs.push({
      label: parent.name,
      href: `/products?category=${parent.id}`,
    });
  }

  crumbs.push({
    label: categoryToUse.category.name,
    href: `/products?category=${categoryToUse.category.id}`,
  });

  return [{ label: "Home", href: "/" }, ...crumbs, { label: productName }];
}

const formatCurrency = (value: string | number) => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(Number(value));
};

export default async function ProductPage({ params }: PageProps) {
  const { id } = await params;

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/${id}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    return <div className="container mx-auto p-10">Produto não encontrado.</div>;
  }

  const product: ProductResponse = await res.json();
  const breadcrumbItems = getBreadcrumbItems(product.categories || [], product.name);

  return (
    <div className="bg-[#FAFAFA] min-h-screen font-sans text-[#0D0D0D]">
      <div className="container mx-auto">
        <Breadcrumbs items={breadcrumbItems} />
      </div>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 pb-16 md:pb-24">
        <div className="flex flex-col lg:flex-row gap-12">
          <ProductGallery images={product.images} productName={product.name} />

          <div className="lg:w-2/5 flex flex-col sticky top-24 h-fit">
            <div className="border-b border-gray-200 pb-6 mb-6">
              <h1 className="text-3xl md:text-4xl font-serif font-bold text-primary mb-2">{product.name}</h1>
              <p className="text-sm text-gray-500 mb-4">Ref: PRD-{product.id.toString().padStart(4, "0")}</p>

              <div className="flex items-center justify-between">
                <p className="text-2xl font-semibold text-primary">{formatCurrency(product.price)}</p>

                <div className="flex items-center text-accent text-sm">
                  <span>★★★★★</span>
                  <span className="ml-2 text-gray-500 underline cursor-pointer">(12 Avaliações)</span>
                </div>
              </div>

              <p className="mt-2 text-xs text-gray-500">
                Em até 10x de {formatCurrency(Number(product.price) / 10)} sem juros
              </p>
            </div>

            <p className="text-gray-600 mb-8 leading-relaxed">{product.description}</p>

            <ProductActionsClient product={product} />

            <div className="border-t border-gray-200">
              <div className="border-b border-gray-200 py-4">
                <details className="group">
                  <summary className="flex justify-between items-center font-medium cursor-pointer list-none text-gray-900 transition">
                    Detalhes e Composição
                    <span className="transition group-open:rotate-180">
                      <svg
                        fill="none"
                        height="24"
                        shapeRendering="geometricPrecision"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.5"
                        viewBox="0 0 24 24"
                        width="24"
                      >
                        <path d="M6 9l6 6 6-6"></path>
                      </svg>
                    </span>
                  </summary>
                  <div className="text-gray-600 mt-3 text-sm leading-relaxed">
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Estoque disponível: {product.stock}</li>
                      <li>Atualizado em: {new Date(product.updatedAt).toLocaleDateString()}</li>
                    </ul>
                  </div>
                </details>
              </div>

              <div className="border-b border-gray-200 py-4">
                <details className="group">
                  <summary className="flex justify-between items-center font-medium cursor-pointer list-none text-gray-900 transition">
                    Envio e Devoluções
                    <span className="transition group-open:rotate-180">
                      <svg
                        fill="none"
                        height="24"
                        shapeRendering="geometricPrecision"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.5"
                        viewBox="0 0 24 24"
                        width="24"
                      >
                        <path d="M6 9l6 6 6-6"></path>
                      </svg>
                    </span>
                  </summary>
                  <div className="text-gray-600 mt-3 text-sm leading-relaxed">
                    <p className="mb-2">
                      <strong>Retirada Exclusiva em Boutique:</strong> Para garantir a integridade da peça, este item
                      está disponível apenas para retirada em nossa loja física.
                    </p>
                    <p className="mb-2">
                      Você receberá uma notificação assim que seu pedido estiver pronto para ser recolhido.
                    </p>
                    <p>Trocas e devoluções podem ser realizadas presencialmente em até 30 dias.</p>
                  </div>
                </details>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
