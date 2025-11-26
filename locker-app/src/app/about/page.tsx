import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Target, Eye, Gem, Leaf, ShieldCheck, Users } from "lucide-react";

export const metadata: Metadata = {
  title: "Locker | Sobre Nós",
  description: "Conheça a história, missão e valores da Locker.",
};

export default function AboutPage() {
  return (
    <div className="bg-[#FAFAFA] text-[#0D0D0D] font-sans min-h-screen flex flex-col">
      <section className="relative py-24 md:py-32 bg-[#0D0D0D] text-white overflow-hidden">
        <div className="absolute inset-0 opacity-40 bg-[url('https://placehold.co/1920x600/1a1a1a/FFFFFF?text=Texture')] bg-cover bg-center" />
        <div className="container mx-auto px-4 relative z-10 text-center">
          <span className="text-primary text-xs md:text-sm font-bold tracking-[0.3em] uppercase mb-4 block animate-in fade-in slide-in-from-bottom-4 duration-700">
            Nossa Essência
          </span>
          <h1 className="text-4xl md:text-6xl font-serif font-light mb-6 animate-in fade-in slide-in-from-bottom-6 duration-1000">
            Mais que moda, <br />
            <span className="italic font-serif">um legado.</span>
          </h1>
          <p className="max-w-2xl mx-auto text-gray-400 text-lg font-light leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-1000">
            A Locker não é apenas sobre o que você veste, mas sobre como você se sente ao vestir. Redefinindo o luxo
            através da simplicidade e da perfeição nos detalhes.
          </p>
        </div>
      </section>

      <section className="container mx-auto px-4 py-20 md:py-32">
        <div className="flex flex-col md:flex-row items-center gap-12 lg:gap-24">
          <div className="w-full md:w-1/2 relative aspect-4/5">
            <Image
              src="/sobre-nos.jpg"
              alt="Nosso Atelier"
              fill
              className="object-cover rounded-sm shadow-xl"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>

          <div className="w-full md:w-1/2 space-y-6">
            <h2 className="text-3xl md:text-4xl font-serif mb-4 text-[#0D0D0D]">Nossa História</h2>
            <div className="w-20 h-1 bg-primary mb-6"></div>
            <p className="text-gray-600 leading-relaxed text-lg">
              Fundada em 2024, a Locker nasceu de um desejo simples: criar um guarda-roupa que transcendesse as
              estações. Cansados da descartabilidade da moda rápida, buscamos resgatar a arte da alfaiataria e a
              durabilidade dos materiais nobres.
            </p>
            <p className="text-gray-600 leading-relaxed text-lg">
              Começamos em um pequeno estúdio, desenhando peças para amigos e familiares que buscavam elegância sem
              esforço. Hoje, mantemos esse mesmo espírito intimista, garantindo que cada peça que leva nossa etiqueta
              seja sinônimo de qualidade intransigente.
            </p>
            <div className="pt-4">
              <p className="font-serif italic text-xl text-gray-800">
                "A elegância é a única beleza que nunca desaparece."
              </p>
              <p className="text-sm text-gray-500 mt-2 uppercase tracking-wider">— Audrey Hepburn</p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-20 border-t border-gray-100">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="group p-8 border border-gray-100 hover:border-primary/30 hover:shadow-lg transition duration-500 rounded-lg bg-[#FAFAFA]">
              <div className="mb-6 inline-flex p-3 bg-primary/10 text-primary rounded-full group-hover:bg-primary group-hover:text-white transition duration-500">
                <Target className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-serif font-bold mb-3">Nossa Missão</h3>
              <p className="text-gray-600 leading-relaxed">
                Proporcionar confiança e autoexpressão através de peças atemporais, unindo design sofisticado com
                conforto absoluto para o dia a dia.
              </p>
            </div>

            <div className="group p-8 border border-gray-100 hover:border-primary/30 hover:shadow-lg transition duration-500 rounded-lg bg-[#FAFAFA]">
              <div className="mb-6 inline-flex p-3 bg-primary/10 text-primary rounded-full group-hover:bg-primary group-hover:text-white transition duration-500">
                <Eye className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-serif font-bold mb-3">Nossa Visão</h3>
              <p className="text-gray-600 leading-relaxed">
                Ser a referência global em moda minimalista de luxo acessível, reconhecida pela integridade de nossos
                processos e pela lealdade de nossos clientes.
              </p>
            </div>

            <div className="group p-8 border border-gray-100 hover:border-primary/30 hover:shadow-lg transition duration-500 rounded-lg bg-[#FAFAFA]">
              <div className="mb-6 inline-flex p-3 bg-primary/10 text-primary rounded-full group-hover:bg-primary group-hover:text-white transition duration-500">
                <Gem className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-serif font-bold mb-3">Nossos Valores</h3>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-primary" /> Qualidade Inegociável
                </li>
                <li className="flex items-center gap-2">
                  <Leaf className="w-4 h-4 text-primary" /> Sustentabilidade Consciente
                </li>
                <li className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-primary" /> Foco no Cliente
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-24 text-center">
        <div className="max-w-3xl mx-auto space-y-8">
          <h2 className="text-3xl md:text-5xl font-serif mb-6">Feito para Durar</h2>
          <p className="text-gray-600 text-lg font-light leading-relaxed">
            Em um mundo de tendências passageiras, escolhemos a permanência. Cada costura, cada tecido e cada botão é
            escolhido meticulosamente para garantir que sua peça Locker o acompanhe por anos, criando memórias junto com
            você.
          </p>

          <div className="pt-8">
            <Button
              asChild
              className="bg-[#0D0D0D] hover:bg-gray-800 text-white py-6 px-10 text-lg rounded-full shadow-xl hover:shadow-2xl transition-all duration-300"
            >
              <Link href="/products">Explorar a Coleção</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
