import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { CategorySectionCard } from "../components/sections/CaterogySectionCard";

export const metadata: Metadata = {
  title: "Locker | Home",
};

export default function HomePage() {
  return (
    <div className="flex flex-col w-full">
      {/* --- HERO SECTION --- */}
      <section
        id="home"
        className="relative min-h-[85vh] flex items-center justify-center bg-gray-900 overflow-hidden w-full"
      >
        {/* Imagem de Fundo (Overlay) */}
        <div className="absolute inset-0 opacity-60 bg-[url('https://placehold.co/1920x1080/202020/FFFFFF?text=Background')] bg-cover bg-center" />

        {/* Overlay Gradiente para leitura */}
        <div className="absolute inset-0 bg-black/40" />

        <div className="relative z-10 container mx-auto px-4 flex justify-center">
          <div className="max-w-2xl w-full bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-2xl text-center p-8 md:p-12 animate-in fade-in zoom-in duration-700">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif text-white mb-6 drop-shadow-lg">
              A Nova Essência
            </h1>
            <p className="text-base md:text-lg text-gray-200 mb-8 font-light tracking-wide">
              Descubra a coleção que redefine o luxo discreto e a alfaiataria impecável. Feito para quem veste sua
              melhor versão.
            </p>
            <Link
              href="/products"
              className="inline-block px-8 py-4 bg-white text-[#0D0D0D] font-bold uppercase tracking-widest text-xs md:text-sm hover:bg-[#0D0D0D] hover:text-white transition-all duration-300 shadow-lg rounded-sm"
            >
              Comprar Agora
            </Link>
          </div>
        </div>
      </section>

      {/* --- CATEGORIAS SECTION --- */}
      <section id="categorias" className="container mx-auto px-4 py-20 md:py-32">
        <div className="text-center mb-16">
          <span className="text-xs font-bold tracking-[0.2em] text-gray-400 uppercase block mb-2">Coleções</span>
          <h2 className="text-3xl md:text-5xl font-serif text-[#0D0D0D]">Nossas Linhas</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          <CategorySectionCard
            title="Masculina"
            description="Alfaiataria e cortes precisos."
            image="https://placehold.co/600x800/2a2a2a/FFFFFF?text=Masculino"
          />
          <CategorySectionCard
            title="Feminina"
            description="Elegância casual para o dia a dia."
            image="https://placehold.co/600x800/3a3a3a/FFFFFF?text=Feminino"
          />
          <CategorySectionCard
            title="Acessórios"
            description="Detalhes que fazem a diferença."
            image="https://placehold.co/600x800/4a4a4a/FFFFFF?text=Acess%C3%B3rios"
          />
        </div>
      </section>

      <section id="about" className="bg-[#0D0D0D] text-white w-full py-20 md:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center gap-12 lg:gap-20">
            {/* Imagem */}
            <div className="w-full md:w-1/2 relative aspect-4/3 md:aspect-square lg:aspect-4/3">
              <Image
                src="/sobre-nos-home.jpg"
                alt="Visão conceitual da marca Éclat"
                fill
                className="rounded-lg shadow-2xl object-cover grayscale hover:grayscale-0 transition duration-700"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>

            {/* Texto */}
            <div className="w-full md:w-1/2 text-center md:text-left">
              <span className="text-primary text-sm font-bold tracking-widest uppercase mb-4 block">Sobre a Marca</span>
              <h2 className="text-3xl md:text-5xl font-serif mb-6 leading-tight">A Filosofia Locker</h2>

              <div className="space-y-6 text-gray-400 font-light text-base md:text-lg leading-relaxed">
                <p>
                  A Locker nasceu da convicção de que a verdadeira elegância reside na simplicidade e na qualidade. Cada
                  peça é desenhada para transcender as tendências passageiras, oferecendo um guarda-roupa atemporal.
                </p>
                <p>
                  Utilizamos apenas materiais sustentáveis e de alta performance, garantindo não apenas beleza, mas
                  também durabilidade e responsabilidade.
                </p>
              </div>

              <Link
                href="/about"
                className="mt-10 inline-flex items-center text-white border-b border-white pb-1 hover:text-gray-300 hover:border-gray-300 transition duration-300 uppercase text-xs tracking-widest font-semibold"
              >
                Saiba Mais Sobre Nós
                <span className="ml-2">→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
