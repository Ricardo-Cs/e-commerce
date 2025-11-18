import Link from "next/link"

export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
        
        <Link href="/" className="text-xl font-semibold text-foreground font-logo">
          Locker
        </Link>

        <div className="flex flex-wrap justify-center gap-6 ml-4">
          <Link href="/about" className="hover:text-primary transition-colors">Sobre</Link>
          <Link href="/contact" className="hover:text-primary transition-colors">Contato</Link>
          <Link href="/privacy" className="hover:text-primary transition-colors">Privacidade</Link>
          <Link href="/terms" className="hover:text-primary transition-colors">Termos</Link>
        </div>

        <p className="text-xs text-center sm:text-right">
          © {new Date().getFullYear()}
          <span className="font-logo"> Locker.</span> Todos os direitos reservados.
        </p>

      </div>
    </footer>
  )
}
