import { Metadata } from "next"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "../components/ui/carousel"
import { Card, CardContent } from "../components/ui/card"
import TestButton from "../components/TestButton"

export const metadata: Metadata = {
  title: "Locker | Home",
}

export default function HomePage() {
  return (
    <div className="container flex flex-col items-center">
      <Carousel className="w-full">
        <CarouselContent>
          {[
            "https://themes.kabum.com.br/conteudo/layout/7209/1762173513.jpg",
            "https://themes.kabum.com.br/conteudo/layout/7209/1762173513.jpg",
            "https://themes.kabum.com.br/conteudo/layout/7209/1762173513.jpg",
            "https://themes.kabum.com.br/conteudo/layout/7209/1762173513.jpg",
          ].map((src, index) => (
            <CarouselItem key={index} className="w-full">
              <Card className="border-0 p-0 shadow-none">
                <CardContent className="p-0">
                  <img
                    src={src}
                    alt={`Banner ${index + 1}`}
                    className="w-full h-[250px] object-cover rounded-lg"
                  />
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="cursor-pointer left-2" />
        <CarouselNext className="cursor-pointer right-2" />
      </Carousel>

      {/* Componente client */}
      <TestButton />
    </div>
  )
}
