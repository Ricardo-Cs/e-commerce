"use client";
import Link from "next/link";
import { useState, useEffect } from "react";

export function Footer() {
  const [year, setYear] = useState<number | null>(null);

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  return (
    <footer className="border-t bg-background">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
        <Link href="/" className="text-xl font-semibold font-logo">
          Locker
        </Link>

        <div className="flex flex-wrap justify-center gap-6 ml-4">
          <Link href="/about">Sobre</Link>
          <Link href="/contact">Contato</Link>
          <Link href="/privacy">Privacidade</Link>
          <Link href="/terms">Termos</Link>
        </div>

        <p className="text-xs text-center sm:text-right">
          © {year ?? ""}
          <span className="font-logo"> Locker.</span> Todos os direitos reservados.
        </p>
      </div>
    </footer>
  );
}
