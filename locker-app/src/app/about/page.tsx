import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Target, Eye, Gem, Leaf, ShieldCheck, Users } from "lucide-react";

export const metadata: Metadata = {
  title: "Locker | Sobre Nós",
  description: "Locker: Onde a elegância encontra o preço justo.",
};

export default function AboutPage() {
  return (
    <div className="bg-[#FAFAFA] text-[#0D0D0D] font-sans min-h-screen flex flex-col">
      {/* --- HERO SECTION --- */}
      <section className="relative py-24 md:py-32 bg-[#0D0D0D] text-white overflow-hidden">
        <div className="absolute inset-0 opacity-40 bg-[url('https://placehold.co/1920x600/1a1a1a/FFFFFF?text=Texture')] bg-cover bg-center" />
        <div className="container mx-auto px-4 relative z-10 text-center">
          <span className="text-primary text-xs md:text-sm font-bold tracking-[0.3em] uppercase mb-4 block animate-in fade-in slide-in-from-bottom-4 duration-700">
            Elegância Inteligente
          </span>
          <h1 className="text-4xl md:text-6xl font-serif font-light mb-6 animate-in fade-in slide-in-from-bottom-6 duration-1000">
            O design que você admira, <br />
            <span className="italic font-serif">pelo valor que faz sentido.</span>
          </h1>
          <p className="max-w-2xl mx-auto text-gray-400 text-lg font-light leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-1000">
            Acreditamos que o bom gosto não precisa custar uma fortuna. Na Locker, democratizamos o acesso à alfaiataria
            e ao design minimalista, unindo qualidade premium e preços justos.
          </p>
        </div>
      </section>

      {/* --- NOSSA HISTÓRIA --- */}
      <section className="container mx-auto px-4 py-20 md:py-32">
        <div className="flex flex-col md:flex-row items-center gap-12 lg:gap-24">
          <div className="w-full md:w-1/2 relative aspect-4/5">
            <Image
              src="/sobre-nos.jpg"
              alt="Nosso Atelier e Processo Criativo"
              fill
              className="object-cover rounded-sm shadow-xl"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>

          <div className="w-full md:w-1/2 space-y-6">
            <h2 className="text-3xl md:text-4xl font-serif mb-4 text-[#0D0D0D]">Por que nascemos?</h2>
            <div className="w-20 h-1 bg-primary mb-6"></div>
            <p className="text-gray-600 leading-relaxed text-lg">
              A Locker foi fundada em 2024 a partir de um questionamento simples: por que é tão difícil encontrar roupas
              elegantes e bem feitas sem pagar preços exorbitantes?
            </p>
            <p className="text-gray-600 leading-relaxed text-lg">
              Notamos que o mercado oferecia apenas dois extremos: peças descartáveis de baixa qualidade ou marcas de
              luxo inacessíveis. Decidimos criar o <strong>caminho do meio</strong>. Eliminamos intermediários e custos
              desnecessários para investir no que realmente importa: tecido, corte e acabamento. O resultado é uma moda
              que transmite autoridade e estilo, respeitando o seu orçamento.
            </p>
            <div className="pt-4">
              <p className="font-serif italic text-xl text-gray-800">
                "Sofisticação é saber fazer a escolha certa, não a mais cara."
              </p>
              {/* <p className="text-sm text-gray-500 mt-2 uppercase tracking-wider">— Manifesto Locker</p> */}
            </div>
          </div>
        </div>
      </section>

      {/* --- MISSÃO, VISÃO E VALORES --- */}
      <section className="bg-white py-20 border-t border-gray-100">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* Missão */}
            <div className="group p-8 border border-gray-100 hover:border-primary/30 hover:shadow-lg transition duration-500 rounded-lg bg-[#FAFAFA]">
              <div className="mb-6 inline-flex p-3 bg-primary/10 text-primary rounded-full group-hover:bg-primary group-hover:text-white transition duration-500">
                <Target className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-serif font-bold mb-3">Nossa Missão</h3>
              <p className="text-gray-600 leading-relaxed">
                Provar que é possível vestir-se com distinção todos os dias. Nossa missão é entregar peças versáteis e
                duráveis, garantindo que cada compra seja um investimento na sua imagem pessoal.
              </p>
            </div>

            {/* Visão */}
            <div className="group p-8 border border-gray-100 hover:border-primary/30 hover:shadow-lg transition duration-500 rounded-lg bg-[#FAFAFA]">
              <div className="mb-6 inline-flex p-3 bg-primary/10 text-primary rounded-full group-hover:bg-primary group-hover:text-white transition duration-500">
                <Eye className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-serif font-bold mb-3">Nossa Visão</h3>
              <p className="text-gray-600 leading-relaxed">
                Ser a referência nacional em <strong>moda inteligente</strong>: a primeira escolha para quem busca o
                equilíbrio perfeito entre estética refinada, qualidade de materiais e preço justo.
              </p>
            </div>

            {/* Valores */}
            <div className="group p-8 border border-gray-100 hover:border-primary/30 hover:shadow-lg transition duration-500 rounded-lg bg-[#FAFAFA]">
              <div className="mb-6 inline-flex p-3 bg-primary/10 text-primary rounded-full group-hover:bg-primary group-hover:text-white transition duration-500">
                <Gem className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-serif font-bold mb-3">Nossos Pilares</h3>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-center gap-3">
                  <ShieldCheck className="w-5 h-5 text-primary" />
                  <span>
                    <strong>Qualidade Real:</strong> Acabamento que dura.
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <Leaf className="w-5 h-5 text-primary" />
                  <span>
                    <strong>Consumo Consciente:</strong> Compre menos, compre melhor.
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-primary" />
                  <span>
                    <strong>Transparência:</strong> Preço justo, sem surpresas.
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* --- FEITO PARA DURAR (ECONOMIA) --- */}
      <section className="container mx-auto px-4 py-24 text-center">
        <div className="max-w-3xl mx-auto space-y-8">
          <h2 className="text-3xl md:text-5xl font-serif mb-6">Qualidade é Economia</h2>
          <p className="text-gray-600 text-lg font-light leading-relaxed">
            Em um mundo de tendências passageiras, escolhemos a permanência. Nossas roupas são feitas para resistir a
            estações e lavagens. Ao escolher a Locker, você não está apenas comprando uma roupa, está construindo um
            guarda-roupa funcional que valoriza o seu dinheiro a longo prazo.
          </p>

          <div className="pt-8">
            <Button
              asChild
              className="bg-[#0D0D0D] hover:bg-gray-800 text-white py-6 px-10 text-lg rounded-full shadow-xl hover:shadow-2xl transition-all duration-300"
            >
              <Link href="/products">Ver Coleção Completa</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
