import Link from "next/link";

export default function Header() {
  return (
    <header className="w-full bg-white border-b border-gray-100">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <div className="relative h-10 w-10">
            <div className="absolute left-1/2 top-0 h-7 w-3 -translate-x-1/2 rounded-full bg-[#3563A7]" />
            <div className="absolute left-1/2 bottom-0 h-7 w-3 -translate-x-1/2 rounded-full bg-[#023E8A]" />
            <div className="absolute left-0 top-1/2 h-3 w-7 -translate-y-1/2 rounded-full bg-[#3563A7]" />
            <div className="absolute right-0 top-1/2 h-3 w-7 -translate-y-1/2 rounded-full bg-[#0B1756]" />
          </div>

          <span className="text-2xl font-bold text-[#0B1756]">
            Conecta<span className="text-[#3563A7]">SUS</span>
          </span>
        </Link>

        {/* Navegação */}
        <nav className="hidden items-center gap-10 md:flex">
          <Link
            href="/"
            className="relative font-medium text-[#023E8A]
            after:absolute after:-bottom-3 after:left-0
            after:h-[2px] after:w-full after:bg-[#023E8A]"
          >
            Home
          </Link>

          <Link
            href="#como-funciona"
            className="font-medium text-[#0B1756] transition hover:text-[#023E8A]"
          >
            Como funciona
          </Link>

          <Link
            href="#unidades"
            className="font-medium text-[#0B1756] transition hover:text-[#023E8A]"
          >
            Unidades
          </Link>
        </nav>

        {/* Botões */}
        <div className="flex items-center gap-4">
          <Link
            href="/login"
            className="
              rounded-lg
              border border-[#023E8A]
              px-8 py-3
              font-semibold
              text-[#023E8A]
              transition
              hover:bg-[#EAF3F7]
            "
          >
            Entrar
          </Link>

          <Link
            href="/cadastro"
            className="
              rounded-lg
              bg-[#023E8A]
              px-8 py-3
              font-semibold
              text-white
              transition
              hover:bg-[#0B1756]
            "
          >
            Cadastrar
          </Link>
        </div>

      </div>
    </header>
  );
}