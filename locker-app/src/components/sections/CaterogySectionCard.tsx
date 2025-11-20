import { Card, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface CategorySectionCardProps {
  title: string;
  description: string;
  image: string;
}

export function CategorySectionCard({ title, description, image }: CategorySectionCardProps) {
  return (
    <Card className="relative group overflow-hidden w-full rounded-xl shadow-lg hover:shadow-2xl transition duration-500 p-0 border-none">
      {/* Container da Imagem */}
      <div
        className="relative h-96 w-full bg-secondary flex items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: `url('${image}')` }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-primary bg-opacity-30 group-hover:bg-opacity-50 transition duration-500 flex items-end justify-center">
          <CardContent className="p-6 text-center w-full">
            <CardTitle className="text-2xl font-serif text-white mb-2 transform translate-y-full group-hover:translate-y-0 transition duration-500 delay-100">
              {title}
            </CardTitle>
            <CardDescription className="text-sm text-white/80 opacity-0 group-hover:opacity-100 transition duration-500 delay-200">
              {description}
            </CardDescription>
            <Button
              variant="outline"
              className="mt-4 text-sm text-white border-white bg-transparent hover:bg-white/20 px-4 py-1 rounded-full opacity-0 group-hover:opacity-100 transition duration-500 delay-300"
            >
              Ver Coleção
            </Button>
          </CardContent>
        </div>
      </div>
    </Card>
  );
}
