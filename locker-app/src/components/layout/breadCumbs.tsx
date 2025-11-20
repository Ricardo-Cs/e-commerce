import { ArrowRight, ChevronRight } from "lucide-react";
import Link from "next/link";

interface Crumb {
  label: string;
  href?: string;
}

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 text-sm text-gray-500">
      <ol className="list-none p-0 inline-flex">
        {items.map((item, i) => (
          <li key={i} className="flex items-center">
            {item.href ? (
              <Link href={item.href} className="hover:text-primary transition">
                {item.label}
              </Link>
            ) : (
              <span className="text-primary font-semibold">{item.label}</span>
            )}

            {i < items.length - 1 && <ChevronRight className="w-5 h-5" />}
          </li>
        ))}
      </ol>
    </nav>
  );
}
