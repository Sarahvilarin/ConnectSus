import Image from "next/image";
import Link from "next/link";

export default function Header({ tipo = "publico" }) {
  const menus = {
    publico: [
      { nome: "Home", href: "/" },
      { nome: "Unidades", href: "/publico/unidades" },
      { nome: "Acessibilidade e Ajuda", href: "/publico/acessibilidade" },
    ],

    paciente: [
      { nome: "Dashboard", href: "/cliente/dashboard" },
      { nome: "Triagem", href: "/cliente/triagem" },
      { nome: "Fila Online", href: "/cliente/fila" },
      { nome: "Visita Domiciliar", href: "/cliente/visita" },
      { nome: "Exames", href: "/cliente/exames" },
      { nome: "Consultas", href: "/cliente/consultas" },
    ],

    gestao: [
      { nome: "Dashboard", href: "/admin/dashboard" },
      { nome: "Filas", href: "/admin/filas" },
      { nome: "Epidemiologia", href: "/admin/epidemiologico" },
      { nome: "Exames", href: "/admin/gestaoexame" },
      { nome: "Visitas", href: "/admin/visitas" },
      { nome: "Relatórios", href: "/admin/relatorios" },
      { nome: "Equipe", href: "/admin/equipe" },
      { nome: "Consultas", href: "/admin/consultas" },
    ],
  };

  return (
    <header className="w-full border-b border-gray-100 bg-white">
      <div className="mx-auto grid h-24 max-w-7xl grid-cols-3 items-center px-6">

        {/* LOGO */}
        <div className="flex justify-start">
          <Link href="/">
            <Image
              src="/logo.png"
              alt="ConectaSUS"
              width={220}
              height={80}
              className="h-auto w-[220px]"
              priority
            />
          </Link>
        </div>

        {/* MENU */}
        <nav className="flex items-center justify-center gap-6">
          {menus[tipo].map((item) => (
            <Link
              key={item.nome}
              href={item.href}
              className="
                whitespace-nowrap
                font-medium
                text-[#0B1756]
                transition
                hover:text-[#023E8A]
              "
            >
              {item.nome}
            </Link>
          ))}
        </nav>

        {/* BOTÕES / PERFIL */}
        <div className="flex items-center justify-end gap-4">

          {tipo === "publico" && (
            <>
              <Link
                href="/login"
                className="
                  rounded-lg
                  border border-[#023E8A]
                  px-6 py-2.5
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
                  px-6 py-2.5
                  font-semibold
                  text-white
                  transition
                  hover:bg-[#0B1756]
                "
              >
                Cadastrar
              </Link>
            </>
          )}

          {tipo === "paciente" && (
            <Link
              href="/cliente/perfil"
              className="
                rounded-lg
                bg-[#023E8A]
                px-6 py-2.5
                font-semibold
                text-white
              "
            >
              Perfil
            </Link>
          )}

          {tipo === "gestao" && (
            <Link
              href="/admin/perfil"
              className="
                rounded-lg
                bg-[#023E8A]
                px-6 py-2.5
                font-semibold
                text-white
              "
            >
              Perfil
            </Link>
          )}

        </div>
      </div>
    </header>
  );
}