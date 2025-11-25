"use client";

import { useState } from "react";
import Image from "next/image";
import { StaticImport } from "next/dist/shared/lib/get-img-props";
import { Key } from "react";
import { cn } from "@/lib/utils";

interface ProductImage {
  id: Key | null | undefined;
  url: string | StaticImport;
}

interface ProductGalleryProps {
  images: ProductImage[];
  productName: string;
}

export default function ProductGallery({ images, productName }: ProductGalleryProps) {
  const safeImages =
    images && images.length > 0 ? images : [{ id: "default", url: "https://placehold.co/800x1000?text=Sem+Imagem" }];

  const [activeImage, setActiveImage] = useState(safeImages[0]);

  return (
    <div className="lg:w-3/5 space-y-4">
      <div className="relative h-[60vh] lg:h-[75vh] w-full overflow-hidden rounded-lg bg-gray-50 shadow-sm flex items-center justify-center">
        <Image
          src={activeImage.url}
          alt={`${productName} - Principal`}
          fill
          className="object-contain p-2 transition duration-700"
          priority
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />

        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 text-xs font-bold uppercase tracking-widest text-primary shadow-sm z-10">
          Novo
        </div>
      </div>

      {/* Thumbnails */}
      <div className="grid grid-cols-4 gap-4">
        {safeImages.map((img, index) => (
          <button
            key={img.id || index}
            onClick={() => setActiveImage(img)}
            className={cn(
              "relative aspect-3/4 rounded-md overflow-hidden border transition cursor-pointer bg-gray-100",
              activeImage.url === img.url
                ? "border-2 border-primary opacity-100 ring-1 ring-primary/20"
                : "border-transparent hover:border-gray-300 opacity-70 hover:opacity-100"
            )}
          >
            <Image
              src={img.url}
              alt={`Thumbnail ${index + 1}`}
              fill
              className="object-cover object-top"
              sizes="20vw"
              unoptimized
            />
          </button>
        ))}
      </div>
    </div>
  );
}
