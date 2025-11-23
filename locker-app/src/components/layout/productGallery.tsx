"use client";

import { useState } from "react";
import Image from "next/image";
import { StaticImport } from "next/dist/shared/lib/get-img-props";
import { Key } from "react";

interface ProductImage {
  id: Key | null | undefined;
  url: string | StaticImport;
}

interface ProductGalleryProps {
  images: ProductImage[];
  productName: string;
}

export default function ProductGallery({ images, productName }: ProductGalleryProps) {
  // Se não houver imagens, usamos um placeholder
  const safeImages =
    images && images.length > 0 ? images : [{ id: "default", url: "https://placehold.co/800x1000?text=Sem+Imagem" }];

  const [activeImage, setActiveImage] = useState(safeImages[0]);

  return (
    <div className="lg:w-3/5 space-y-4">
      {/* Imagem Principal */}
      <div className="relative h-[50vh] lg:h-[75vh] w-full overflow-hidden rounded-lg bg-secondary shadow-md group">
        <Image
          src={activeImage.url}
          alt={`${productName} - Principal`}
          fill
          className="object-cover object-top hover:scale-105 transition duration-700 cursor-zoom-in"
          priority
        />
        <div className="absolute top-4 left-4 bg-white px-3 py-1 text-xs font-bold uppercase tracking-widest text-primary shadow-sm z-10">
          Novo
        </div>
      </div>

      {/* Thumbnails */}
      <div className="grid grid-cols-4 gap-4">
        {safeImages.map((img, index) => (
          <button
            key={img.id || index}
            onClick={() => setActiveImage(img)}
            className={`relative aspect-square rounded-md overflow-hidden border transition ${
              activeImage.url === img.url
                ? "border-2 border-primary opacity-100"
                : "border-transparent hover:border-gray-300 opacity-70 hover:opacity-100"
            }`}
          >
            <Image src={img.url} alt={`Thumbnail ${index + 1}`} fill className="object-cover" unoptimized />
          </button>
        ))}
      </div>
    </div>
  );
}
