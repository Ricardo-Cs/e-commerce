import { Breadcrumbs } from "../../../components/layout/breadCumbs";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductPage({ params }: PageProps) {
  const { id } = await params;

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/${id}`, {
    cache: "no-store",
  });
  const product = await res.json();

  return (
    <div>
      <Breadcrumbs
        items={[{ label: "Home", href: "/" }, { label: "Masculino", href: "/" }, { label: "Blazer de Lã Italiano" }]}
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pb-16 md:pb-24">
        <h1>{product.name}</h1>
        <p>{product.description}</p>
        <strong>R$ {product.price}</strong>
      </div>
    </div>
  );
}
