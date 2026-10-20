"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import {
  Menu,
  X,
  UserRound,
} from "lucide-react";

export default function Header() {
  const pathname = usePathname();

  const [menuAberto, setMenuAberto] = useState(false);

  // =========================================================
  // DESCOBRE AUTOMATICAMENTE A ÁREA
  // =========================================================

  const tipo = pathname.startsWith("/cliente")
    ? "paciente"
    : pathname.startsWith("/admin")
      ? "gestao"
      : "publico";

  // =========================================================
  // MENUS
  // =========================================================

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
      {
        nome: "Contato",
        href: "/publico/contato",
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
  // PÁGINA ATUAL
  // =========================================================

  function estaAtivo(href) {
    if (href === "/") {
      return pathname === "/";
    }

    return (
      pathname === href ||
      pathname.startsWith(`${href}/`)
    );
  }

  // =========================================================
  // LINK INICIAL DA LOGO
  // =========================================================

  const inicio =
    tipo === "paciente"
      ? "/cliente/dashboard"
      : tipo === "gestao"
        ? "/admin/dashboard"
        : "/";

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
      {/* =====================================================
          HEADER DESKTOP
      ====================================================== */}

      <div
        className="
          mx-auto
          flex
          h-24
          max-w-[1400px]
          items-center
          justify-between
          px-4
          sm:px-6
          lg:px-8
        "
      >
        {/* =================================================
            LOGO
        ================================================== */}

        <Link
          href={inicio}
          className="
            shrink-0
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
            className="
              h-auto
              w-[175px]
              sm:w-[190px]
              xl:w-[210px]
            "
          />
        </Link>

        {/* =================================================
            MENU DESKTOP
        ================================================== */}

        <nav
          className="
            hidden
            items-center
            justify-center
            gap-1
            lg:flex
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
                        after:-bottom-[18px]
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

        {/* =================================================
            AÇÕES DESKTOP
        ================================================== */}

        <div
          className="
            hidden
            shrink-0
            items-center
            justify-end
            gap-3
            lg:flex
          "
        >
          {/* PÚBLICO */}

          {tipo === "publico" && (
            <>
              <Link
                href="/publico/login"
                className={`
                  rounded-lg
                  border
                  px-5
                  py-2.5
                  text-sm
                  font-semibold
                  transition-all
                  duration-200

                  ${
                    estaAtivo("/publico/login")
                      ? `
                        border-[#023E8A]
                        bg-[#EAF3F7]
                        text-[#023E8A]
                      `
                      : `
                        border-[#023E8A]
                        text-[#023E8A]
                        hover:-translate-y-0.5
                        hover:bg-[#EAF3F7]
                      `
                  }
                `}
              >
                Entrar
              </Link>

              <Link
                href="/publico/cadastro"
                className="
                  rounded-lg
                  bg-[#023E8A]
                  px-5
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
              className={`
                flex
                items-center
                gap-2
                rounded-lg
                px-5
                py-2.5
                text-sm
                font-semibold
                text-white
                transition-all

                ${
                  estaAtivo("/cliente/perfil")
                    ? "bg-[#0B1756]"
                    : "bg-[#023E8A] hover:bg-[#0B1756]"
                }
              `}
            >
              <UserRound size={17} />

              Perfil
            </Link>
          )}

          {/* GESTÃO */}

          {tipo === "gestao" && (
            <Link
              href="/admin/perfil"
              className={`
                flex
                items-center
                gap-2
                rounded-lg
                px-5
                py-2.5
                text-sm
                font-semibold
                text-white
                transition-all

                ${
                  estaAtivo("/admin/perfil")
                    ? "bg-[#0B1756]"
                    : "bg-[#023E8A] hover:bg-[#0B1756]"
                }
              `}
            >
              <UserRound size={17} />

              Perfil
            </Link>
          )}
        </div>

        {/* =================================================
            BOTÃO MOBILE
        ================================================== */}

        <button
          type="button"
          onClick={() =>
            setMenuAberto(!menuAberto)
          }
          aria-label={
            menuAberto
              ? "Fechar menu"
              : "Abrir menu"
          }
          className="
            flex
            h-11
            w-11
            items-center
            justify-center
            rounded-xl
            border
            border-slate-200
            text-[#0B1756]
            transition
            hover:bg-[#EAF3F7]
            lg:hidden
          "
        >
          {menuAberto ? (
            <X size={22} />
          ) : (
            <Menu size={22} />
          )}
        </button>
      </div>

      {/* =====================================================
          MENU MOBILE
      ====================================================== */}

      {menuAberto && (
        <div
          className="
            border-t
            border-slate-100
            bg-white
            px-4
            pb-5
            pt-3
            shadow-lg
            lg:hidden
          "
        >
          <nav className="grid gap-1">

            {menus[tipo].map((item) => {
              const ativo = estaAtivo(item.href);

              return (
                <Link
                  key={item.nome}
                  href={item.href}
                  onClick={() =>
                    setMenuAberto(false)
                  }
                  className={`
                    rounded-xl
                    px-4
                    py-3
                    text-sm
                    font-medium
                    transition

                    ${
                      ativo
                        ? `
                          bg-[#EAF3F7]
                          font-semibold
                          text-[#023E8A]
                        `
                        : `
                          text-[#0B1756]
                          hover:bg-[#F3F7FC]
                        `
                    }
                  `}
                >
                  {item.nome}
                </Link>
              );
            })}

          </nav>

          {/* AÇÕES MOBILE */}

          <div
            className="
              mt-3
              border-t
              border-slate-100
              pt-4
            "
          >
            {tipo === "publico" && (
              <div className="grid grid-cols-2 gap-2">

                <Link
                  href="/publico/login"
                  onClick={() =>
                    setMenuAberto(false)
                  }
                  className="
                    flex
                    h-11
                    items-center
                    justify-center
                    rounded-xl
                    border
                    border-[#023E8A]
                    text-sm
                    font-semibold
                    text-[#023E8A]
                  "
                >
                  Entrar
                </Link>

                <Link
                  href="/publico/cadastro"
                  onClick={() =>
                    setMenuAberto(false)
                  }
                  className="
                    flex
                    h-11
                    items-center
                    justify-center
                    rounded-xl
                    bg-[#023E8A]
                    text-sm
                    font-semibold
                    text-white
                  "
                >
                  Cadastrar
                </Link>

              </div>
            )}

            {tipo === "paciente" && (
              <Link
                href="/cliente/perfil"
                onClick={() =>
                  setMenuAberto(false)
                }
                className="
                  flex
                  h-11
                  w-full
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                  bg-[#023E8A]
                  text-sm
                  font-semibold
                  text-white
                "
              >
                <UserRound size={17} />

                Perfil
              </Link>
            )}

            {tipo === "gestao" && (
              <Link
                href="/admin/perfil"
                onClick={() =>
                  setMenuAberto(false)
                }
                className="
                  flex
                  h-11
                  w-full
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                  bg-[#023E8A]
                  text-sm
                  font-semibold
                  text-white
                "
              >
                <UserRound size={17} />

                Perfil
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}