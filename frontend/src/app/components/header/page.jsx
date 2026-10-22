"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import {
  Menu,
  X,
  UserRound,
  Stethoscope,
  ShieldCheck,
} from "lucide-react";

export default function Header() {
  const pathname = usePathname();

  const [menuAberto, setMenuAberto] = useState(false);

  /* ============================================================
     ÁREA ATUAL
  ============================================================ */

  const tipo = pathname.startsWith("/cliente")
    ? "cliente"
    : pathname.startsWith("/medico")
      ? "medico"
      : pathname.startsWith("/admin")
        ? "admin"
        : "publico";

  useEffect(() => {
    setMenuAberto(false);
  }, [pathname]);

  /* ============================================================
     MENUS
  ============================================================ */

  const menus = {
    publico: [
      {
        nome: "Home",
        href: "/publico/dashboard",
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

    cliente: [
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

    medico: [
      {
        nome: "Dashboard",
        href: "/medico/dashboard",
      },
      {
        nome: "Pacientes",
        href: "/medico/pacientes",
      },
      {
        nome: "Exames",
        href: "/medico/gestaoexame",
      },
      {
        nome: "Consultas",
        href: "/medico/consultas",
      },
    ],

    admin: [
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

  /* ============================================================
     LINK ATIVO
  ============================================================ */

  function estaAtivo(href) {
    if (href === "/") {
      return pathname === "/";
    }

    return (
      pathname === href ||
      pathname.startsWith(`${href}/`)
    );
  }

  /* ============================================================
     LINK DA LOGO
  ============================================================ */

  const inicio =
    tipo === "cliente"
      ? "/cliente/dashboard"
      : tipo === "medico"
        ? "/medico/dashboard"
        : tipo === "admin"
          ? "/admin/dashboard"
          : "/";

  /* ============================================================
     CONFIGURAÇÕES DA ÁREA
  ============================================================ */

  const area = {
    publico: {
      nome: "",
      perfil: "",
      icone: null,
    },

    cliente: {
      nome: "Área do Paciente",
      perfil: "/cliente/perfil",
      icone: <UserRound size={17} />,
    },

    medico: {
      nome: "Área Médica",
      perfil: "/medico/perfil",
      icone: <Stethoscope size={17} />,
    },

    admin: {
      nome: "Área da Gestão",
      perfil: "/admin/perfil",
      icone: <ShieldCheck size={17} />,
    },
  };

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
          DESKTOP
      ====================================================== */}

      <div
        className="
          mx-auto
          hidden
          h-24
          max-w-[1480px]
          grid-cols-[220px_1fr_220px]
          items-center
          px-6
          lg:grid
          xl:px-8
        "
      >
        {/* =================================================
            ESQUERDA
        ================================================== */}

        <div className="flex items-center justify-start">
          <Link
            href={inicio}
            className="
              inline-flex
              items-center
              transition
              duration-200
              hover:scale-[1.02]
            "
          >
            <Image
              src="/logo.svg"
              alt="UneSUS"
              width={205}
              height={70}
              priority
              className="
                h-auto
                w-[185px]
                xl:w-[200px]
              "
            />
          </Link>
        </div>

        {/* =================================================
            CENTRO
        ================================================== */}

        <div
          className="
            flex
            min-w-0
            items-center
            justify-center
          "
        >
          <nav
            className="
              flex
              items-center
              justify-center
              gap-1
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
                    rounded-xl
                    px-2.5
                    py-2.5
                    text-[13px]
                    font-medium
                    transition-all
                    duration-200

                    xl:px-3
                    xl:text-sm

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
                            after:w-7
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
        </div>

        {/* =================================================
            DIREITA
        ================================================== */}

        <div
          className="
            flex
            items-center
            justify-end
            gap-2
          "
        >
          {/* PÚBLICO */}

          {tipo === "publico" && (
            <>
              <Link
                href="/publico/login"
                className={`
                  rounded-xl
                  border
                  px-4
                  py-2.5
                  text-sm
                  font-semibold
                  transition-all

                  ${
                    estaAtivo("/publico/login")
                      ? `
                          border-[#023E8A]
                          bg-[#EAF3F7]
                          text-[#023E8A]
                        `
                      : `
                          border-[#023E8A]
                          bg-white
                          text-[#023E8A]
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
                  rounded-xl
                  bg-[#023E8A]
                  px-4
                  py-2.5
                  text-sm
                  font-semibold
                  text-white
                  shadow-sm
                  transition-all
                  hover:-translate-y-0.5
                  hover:bg-[#0B1756]
                "
              >
                Cadastrar
              </Link>
            </>
          )}

          {/* LOGADO */}

          {tipo !== "publico" && (
            <Link
              href={area[tipo].perfil}
              className={`
                flex
                items-center
                gap-2
                rounded-xl
                px-4
                py-2.5
                text-sm
                font-semibold
                text-white
                shadow-sm
                transition-all

                ${
                  estaAtivo(area[tipo].perfil)
                    ? "bg-[#0B1756]"
                    : "bg-[#023E8A] hover:-translate-y-0.5 hover:bg-[#0B1756]"
                }
              `}
            >
              {area[tipo].icone}

              Perfil
            </Link>
          )}
        </div>
      </div>

      {/* =====================================================
          MOBILE / TABLET
      ====================================================== */}

      <div
        className="
          mx-auto
          flex
          h-20
          max-w-[1480px]
          items-center
          justify-between
          px-4
          sm:px-6
          lg:hidden
        "
      >
        <Link
          href={inicio}
          className="
            inline-flex
            items-center
          "
        >
          <Image
            src="/logo.svg"
            alt="UneSUS"
            width={190}
            height={65}
            priority
            className="
              h-auto
              w-[165px]
              sm:w-[180px]
            "
          />
        </Link>

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
            bg-white
            text-[#0B1756]
            transition
            hover:bg-[#EAF3F7]
            hover:text-[#023E8A]
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
            shadow-[0_16px_35px_rgba(2,62,138,0.10)]
            sm:px-6
            lg:hidden
          "
        >
          {/* ÁREA */}

          {tipo !== "publico" && (
            <div
              className="
                mb-3
                flex
                items-center
                gap-3
                rounded-2xl
                bg-[#F4F8FC]
                p-3
              "
            >
              <div
                className="
                  flex
                  h-10
                  w-10
                  items-center
                  justify-center
                  rounded-xl
                  bg-[#EAF3F7]
                  text-[#023E8A]
                "
              >
                {area[tipo].icone}
              </div>

              <div>
                <p
                  className="
                    text-[10px]
                    font-semibold
                    uppercase
                    tracking-[1.5px]
                    text-slate-400
                  "
                >
                  UneSUS
                </p>

                <p
                  className="
                    text-sm
                    font-bold
                    text-[#0B1756]
                  "
                >
                  {area[tipo].nome}
                </p>
              </div>
            </div>
          )}

          {/* LINKS */}

          <nav className="grid gap-1">
            {menus[tipo].map((item) => {
              const ativo =
                estaAtivo(item.href);

              return (
                <Link
                  key={item.nome}
                  href={item.href}
                  onClick={() =>
                    setMenuAberto(false)
                  }
                  className={`
                    flex
                    h-11
                    items-center
                    rounded-xl
                    px-4
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

          {/* =================================================
              AÇÕES
          ================================================== */}

          <div
            className="
              mt-4
              border-t
              border-slate-100
              pt-4
            "
          >
            {tipo === "publico" ? (
              <div
                className="
                  grid
                  grid-cols-2
                  gap-2
                "
              >
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
            ) : (
              <Link
                href={area[tipo].perfil}
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
                  transition
                  hover:bg-[#0B1756]
                "
              >
                {area[tipo].icone}

                Perfil
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}