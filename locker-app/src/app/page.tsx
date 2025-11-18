import { Metadata } from "next";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { CategorySectionCard } from "../components/sections/CaterogySectionCard";

export const metadata: Metadata = {
  title: "Locker | Home",
};

export default function HomePage() {
  return (
    <div className="flex flex-col items-center">
      {/* Componente client */}
      {/* <TestButton /> */}
      <section
        id="home"
        className="relative h-[80vh] md:h-[90vh] flex items-center justify-center bg-secondary overflow-hidden w-full"
      >
        {/* Overlay full width */}
        <div className="absolute inset-0 bg-cover bg-center opacity-70 bg-card" />

        {/* Conteúdo limitado ao container */}
        <div className="relative z-10 container mx-auto max-w-7xl p-8 flex justify-center">
          <div className="max-w-lg bg-white/70 backdrop-blur-sm rounded-lg shadow-xl text-center p-6">
            <h1 className="text-5xl md:text-7xl font-serif font-light text-primary mb-4">A Nova Essência</h1>
            <p className="text-lg md:text-xl text-gray-700 mb-8">
              Descubra a coleção que redefine o luxo discreto e a alfaiataria impecável.
            </p>
            <a
              href="#categorias"
              className="inline-block px-10 py-3 text-white bg-primary border-2 border-primary hover:bg-transparent hover:text-primary transition duration-500 font-semibold tracking-wider rounded-full shadow-lg"
            >
              Comprar Agora
            </a>
          </div>
        </div>
      </section>

      <section id="categorias" className="container h-[80vh] md:h-[90vh] py-16 md:py-18 mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-serif font-light text-center mb-12 uppercase">Nossas Linhas</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <CategorySectionCard
            title="Masculina"
            description="Masculina pae."
            image="https://placehold.co/600x800/A0A0A0/202020?text=Alfaiataria+Impecavel"
          />
          <CategorySectionCard
            title="Feminina"
            description="Tá ligado né."
            image="https://placehold.co/600x800/B0B0B0/202020?text=Linha+Casual"
          />
          <CategorySectionCard
            title="Mista"
            description="Presunto e Queijo."
            image="https://placehold.co/600x800/C0C0C0/202020?text=Linha+Esportiva"
          />
        </div>
      </section>
    </div>
  );
}
