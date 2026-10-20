"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header({ tipo = "publico" }) {
  const pathname = usePathname();

  const menus = {
    publico: [
      {
        nome: "Home",
        href: "/",
      },
      {
        nome: "Unidades",
        href: "/publico/unidades",
      },
      {
        nome: "Acessibilidade e Ajuda",
        href: "/publico/acessibilidade",
      },
    ],

    paciente: [
      {
        nome: "Dashboard",
        href: "/cliente/dashboard",
      },
      {
        nome: "Triagem",
        href: "/cliente/triagem",
      },
      {
        nome: "Fila Online",
        href: "/cliente/fila",
      },
      {
        nome: "Visita Domiciliar",
        href: "/cliente/visita",
      },
      {
        nome: "Exames",
        href: "/cliente/exames",
      },
      {
        nome: "Consultas",
        href: "/cliente/consultas",
      },
    ],

    gestao: [
      {
        nome: "Dashboard",
        href: "/admin/dashboard",
      },
      {
        nome: "Filas",
        href: "/admin/filas",
      },
      {
        nome: "Epidemiologia",
        href: "/admin/epidemiologico",
      },
      {
        nome: "Exames",
        href: "/admin/gestaoexame",
      },
      {
        nome: "Visitas",
        href: "/admin/visitas",
      },
      {
        nome: "Relatórios",
        href: "/admin/relatorios",
      },
      {
        nome: "Equipe",
        href: "/admin/equipe",
      },
      {
        nome: "Consultas",
        href: "/admin/consultas",
      },
    ],
  };

  // =========================================================
  // DESCOBRE SE O ITEM É A PÁGINA ATUAL
  // =========================================================

  function estaAtivo(href) {
    if (href === "/") {
      return pathname === "/";
    }

    return pathname.startsWith(href);
  }

  return (
    <header
      className="
        sticky
        top-0
        z-50
        w-full
        border-b
        border-slate-100
        bg-white/95
        backdrop-blur-md
      "
    >
      <div
        className="
          mx-auto
          grid
          h-24
          max-w-7xl
          grid-cols-3
          items-center
          px-6
        "
      >

        {/* ===================================================
            LOGO
        ==================================================== */}

        <div className="flex justify-start">
          <Link
            href="/"
            className="
              transition
              duration-200
              hover:scale-[1.02]
            "
          >
            <Image
              src="/logo.svg"
              alt="UneSUS"
              width={220}
              height={80}
              priority
              className="h-auto w-[210px]"
            />
          </Link>
        </div>


        {/* ===================================================
            MENU
        ==================================================== */}

        <nav
          className="
            flex
            items-center
            justify-center
            gap-3
          "
        >
          {menus[tipo].map((item) => {
            const ativo = estaAtivo(item.href);

            return (
              <Link
                key={item.nome}
                href={item.href}
                className={`
                  relative
                  whitespace-nowrap
                  rounded-lg
                  px-3
                  py-2.5
                  text-sm
                  font-medium
                  transition-all
                  duration-200

                  ${
                    ativo
                      ? `
                        bg-[#EAF3F7]
                        font-semibold
                        text-[#023E8A]

                        after:absolute
                        after:-bottom-[17px]
                        after:left-1/2
                        after:h-[3px]
                        after:w-8
                        after:-translate-x-1/2
                        after:rounded-full
                        after:bg-[#023E8A]
                      `
                      : `
                        text-[#0B1756]
                        hover:bg-[#F3F7FC]
                        hover:text-[#023E8A]
                      `
                  }
                `}
              >
                {item.nome}
              </Link>
            );
          })}
        </nav>


        {/* ===================================================
            BOTÕES / PERFIL
        ==================================================== */}

        <div
          className="
            flex
            items-center
            justify-end
            gap-4
          "
        >

          {/* PÚBLICO */}

          {tipo === "publico" && (
            <>
              <Link
                href="/publico/login"
                className="
                  rounded-lg
                  border
                  border-[#023E8A]
                  px-6
                  py-2.5
                  text-sm
                  font-semibold
                  text-[#023E8A]
                  transition-all
                  duration-200

                  hover:-translate-y-0.5
                  hover:bg-[#EAF3F7]
                "
              >
                Entrar
              </Link>

              <Link
                href="/publico/cadastro"
                className="
                  rounded-lg
                  bg-[#023E8A]
                  px-6
                  py-2.5
                  text-sm
                  font-semibold
                  text-white
                  shadow-sm
                  transition-all
                  duration-200

                  hover:-translate-y-0.5
                  hover:bg-[#0B1756]
                  hover:shadow-md
                "
              >
                Cadastrar
              </Link>
            </>
          )}


          {/* PACIENTE */}

          {tipo === "paciente" && (
            <Link
              href="/cliente/perfil"
              className="
                rounded-lg
                bg-[#023E8A]
                px-6
                py-2.5
                text-sm
                font-semibold
                text-white
                transition-all
                duration-200

                hover:-translate-y-0.5
                hover:bg-[#0B1756]
              "
            >
              Perfil
            </Link>
          )}


          {/* GESTÃO */}

          {tipo === "gestao" && (
            <Link
              href="/admin/perfil"
              className="
                rounded-lg
                bg-[#023E8A]
                px-6
                py-2.5
                text-sm
                font-semibold
                text-white
                transition-all
                duration-200

                hover:-translate-y-0.5
                hover:bg-[#0B1756]
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