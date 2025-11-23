// src/app/products/[id]/page.tsx
import { StaticImport } from "next/dist/shared/lib/get-img-props";
import { Key } from "react";
import { Breadcrumbs } from "../../../components/layout/breadCumbs";
import Image from "next/image";
import ProductGallery from "../../../components/layout/productGallery";
import { ShoppingCart } from "lucide-react";

// --- INTERFACES ---
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

// Formatação de moeda
const formatCurrency = (value: string | number) => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(Number(value));
};

// --- COMPONENTE DA PÁGINA ---
export default async function ProductPage({ params }: PageProps) {
  const { id } = await params;

  // Fetch de dados
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
      {/* Breadcrumbs Container */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Breadcrumbs items={breadcrumbItems} />
      </div>

      {/* Seção Principal do Produto */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 pb-16 md:pb-24">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Galeria de Imagens (Client Component) */}
          <ProductGallery images={product.images} productName={product.name} />

          {/* Detalhes do Produto (Direita) */}
          <div className="lg:w-2/5 flex flex-col sticky top-24 h-fit">
            {/* Título e Preço */}
            <div className="border-b border-gray-200 pb-6 mb-6">
              <h1 className="text-3xl md:text-4xl font-serif font-bold text-primary mb-2">{product.name}</h1>
              <p className="text-sm text-gray-500 mb-4">Ref: PRD-{product.id.toString().padStart(4, "0")}</p>

              <div className="flex items-center justify-between">
                <p className="text-2xl font-semibold text-primary">{formatCurrency(product.price)}</p>

                {/* Mock de Avaliação (Dados não presentes na API) */}
                <div className="flex items-center text-accent text-sm">
                  <span>★★★★★</span>
                  <span className="ml-2 text-gray-500 underline cursor-pointer">(12 Avaliações)</span>
                </div>
              </div>

              <p className="mt-2 text-xs text-gray-500">
                Em até 10x de {formatCurrency(Number(product.price) / 10)} sem juros
              </p>
            </div>

            {/* Descrição */}
            <p className="text-gray-600 mb-8 leading-relaxed">{product.description}</p>

            {/* Botões de Ação */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <button className="flex-1 bg-primary text-white py-4 px-6 rounded-full font-semibold tracking-wide hover:bg-gray-800 transition shadow-lg flex items-center justify-center gap-2 group">
                <span>Adicionar ao Carrinho</span>
                <ShoppingCart className="w-5 h-5" />
              </button>
            </div>

            {/* Acordeões de Informações Extras (HTML nativo <details>) */}
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

      {/* Seção: Complete o Look (Placeholder - Dados Estáticos) */}
      <section className="bg-white py-16 border-t border-gray-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-serif font-medium text-primary mb-8 uppercase tracking-wider">
            Você também pode gostar
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((item) => (
              <a href="#" key={item} className="group block">
                <div className="aspect-3/4 bg-secondary rounded-lg overflow-hidden mb-3 relative">
                  <Image
                    src={`https://placehold.co/400x550/E0E0E0/202020?text=Produto+${item}`}
                    alt="Produto Relacionado"
                    width={400}
                    height={550}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    unoptimized
                  />
                </div>
                <h3 className="text-sm font-medium text-gray-900 group-hover:text-accent transition">
                  Produto Relacionado {item}
                </h3>
                <p className="text-sm text-gray-500">R$ 299,00</p>
              </a>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
