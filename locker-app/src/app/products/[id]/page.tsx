import { StaticImport } from "next/dist/shared/lib/get-img-props";
import { Key } from "react";
import { Breadcrumbs } from "../../../components/layout/breadCumbs";
import Image from "next/image";

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

        {product.images?.map((img: { id: Key | null | undefined; url: string | StaticImport }) => (
          <Image key={img.id} src={img.url} alt={product.name} width={500} height={500} className="object-cover" />
        ))}
      </div>
    </div>
  );
}
