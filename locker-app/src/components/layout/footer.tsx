import Link from "next/link"

export function Footer() {
  return (
    <footer className="border-t bg-background mt-10">
      <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
        {/* Logo / Nome */}
        <Link href="/" className="text-base font-semibold text-foreground font-logo">
          Locker
        </Link>

        {/* Links */}
        <div className="flex flex-wrap justify-center gap-6">
          <Link href="/about" className="hover:text-primary transition-colors">
            Sobre
          </Link>
          <Link href="/contact" className="hover:text-primary transition-colors">
            Contato
          </Link>
          <Link href="/privacy" className="hover:text-primary transition-colors">
            Privacidade
          </Link>
          <Link href="/terms" className="hover:text-primary transition-colors">
            Termos
          </Link>
        </div>

        <p className="text-xs text-center sm:text-right">
          © {new Date().getFullYear()} 
          <span className="font-logo"> Locker.</span> Todos os direitos reservados.
        </p>
      </div>
    </footer>
  )
}
