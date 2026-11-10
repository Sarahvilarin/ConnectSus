"use client";

import Image from "next/image";

import Link from "next/link";

import { usePathname } from "next/navigation";

import { useEffect, useRef, useState } from "react";

import {

  Bell,

  CheckCircle2,

  ChevronRight,

  Menu,

  UserRound,

  X,

} from "lucide-react";
// ======================================================
// MENUS
// ======================================================
const menus = {

  publico: [

    { nome: "Home", href: "/publico/dashboard" },

    { nome: "Unidades", href: "/publico/unidades" },

    { nome: "Acessibilidade e Ajuda", href: "/publico/acessibilidade" },

    { nome: "Contato", href: "/publico/contato" },

  ],

  cliente: [
    { nome: "Dashboard", href: "/cliente/dashboard" },
    { nome: "Triagem", href: "/cliente/triagem" },
    { nome: "Fila Online", href: "/cliente/filaOnline" },
    { nome: "Visita Domiciliar", href: "/cliente/visitadomiciliar" },
    { nome: "Exames", href: "/cliente/exames" },
    { nome: "Consultas", href: "/cliente/consultas" },
  ],

  medico: [

    { nome: "Home", href: "/medico/dashboard" },

    { nome: "Pacientes", href: "/medico/pacientes" },

    { nome: "Exames", href: "/medico/gestaoexame" },

    { nome: "Consultas", href: "/medico/consultas" },

  ],

  enfermeiro: [

    { nome: "Home", href: "/enfermeiro/dashboard" },

    { nome: "Visita domiciliar", href: "/enfermeiro/visita" },

    { nome: "Triagem", href: "/enfermeiro/triagem" },

  ],

  admin: [

    { nome: "Home", href: "/admin/dashboard" },

    { nome: "Filas", href: "/admin/filas" },

    { nome: "Epidemiologia", href: "/admin/epidemiologico" },

    { nome: "Exames", href: "/admin/gestaoexame" },

    { nome: "Visitas", href: "/admin/gestaovisitas" },

    { nome: "Relatórios", href: "/admin/relatorios" },

    { nome: "Equipe", href: "/admin/gestaoequipe" },

    { nome: "Consultas", href: "/admin/consultas" },

  ],

};
// ======================================================
// ÁREAS
// ======================================================
const areas = {

  publico: {

    nome: "Área pública",

    perfil: null,

    icone: UserRound,

    descricao: "Acesso ao sistema",

    estiloIcone: "bg-[#EAF3F7] text-[#023E8A]",

  },

  paciente: {

    nome: "Área do paciente",

    perfil: "/paciente/perfil",

    icone: UserRound,

    descricao: "Perfil do paciente",

    estiloIcone: "bg-[#EAF3F7] text-[#023E8A]",

  },

  medico: {

    nome: "Área médica",

    perfil: "/medico/perfil",

    icone: UserRound,

    descricao: "Perfil profissional",

    estiloIcone: "bg-[#EAF3F7] text-[#023E8A]",

  },

  enfermeiro: {

    nome: "Área da enfermagem",

    perfil: "/enfermeiro/perfil",

    icone: UserRound,

    descricao: "Perfil do enfermeiro",

    estiloIcone: "bg-[#EAF3F7] text-[#023E8A]",

  },

  admin: {

    nome: "Área da gestão",

    perfil: "/admin/perfil",

    icone: UserRound,

    descricao: "Perfil administrativo",

    estiloIcone: "bg-[#EAF3F7] text-[#023E8A]",

  },

};
// ======================================================
// HEADER
// ======================================================
export default function Header() {

  const pathname = usePathname() || "/";

  const [menuAberto, setMenuAberto] = useState(false);

  const [notificacoesAbertas, setNotificacoesAbertas] = useState(false);

  const headerRef = useRef(null);
// Identificação da área atual.
  const tipo = pathname.startsWith("/paciente")

    ? "paciente"

    : pathname.startsWith("/medico")

      ? "medico"

      : pathname.startsWith("/enfermeiro")

        ? "enfermeiro"

        : pathname.startsWith("/admin")

          ? "admin"

          : "publico";

  const areaAtual = areas[tipo];

  const IconePerfil = areaAtual.icone;

  const usuarioLogado = tipo !== "publico";
// Página inicial de cada área.
  const inicio =

    tipo === "paciente"

      ? "/paciente/dashboard"

      : tipo === "medico"

        ? "/medico/dashboard"

        : tipo === "enfermeiro"

          ? "/enfermeiro/visita"

          : tipo === "admin"

            ? "/admin/dashboard"

            : "/";
// ======================================================
// NAVEGAÇÃO
// ======================================================
  function estaAtivo(href) {

    if (!href) return false;

    return pathname === href || pathname.startsWith(`${href}/`);

  }

  function fecharMenus() {

    setMenuAberto(false);

    setNotificacoesAbertas(false);

  }

  useEffect(() => {

    fecharMenus();

  }, [pathname]);
// Fecha os menus com ESC ou ao clicar fora.
  useEffect(() => {

    function fecharComEscape(event) {

      if (event.key === "Escape") {

        fecharMenus();

      }

    }

    function fecharAoClicarFora(event) {

      if (

        headerRef.current &&

        !headerRef.current.contains(event.target)

      ) {

        fecharMenus();

      }

    }

    document.addEventListener("keydown", fecharComEscape);

    document.addEventListener("pointerdown", fecharAoClicarFora);

    return () => {

      document.removeEventListener("keydown", fecharComEscape);

      document.removeEventListener("pointerdown", fecharAoClicarFora);

    };

  }, []);

  function alternarMenu() {

    setMenuAberto((aberto) => !aberto);

    setNotificacoesAbertas(false);

  }

  function alternarNotificacoes() {

    setNotificacoesAbertas((aberto) => !aberto);

    setMenuAberto(false);

  }
// ======================================================
// NOTIFICAÇÕES
// ======================================================
  function renderNotificacoes() {

    if (!usuarioLogado) return null;

    return (

      <div className="relative">

        <button

          type="button"

          onClick={alternarNotificacoes}

          aria-label="Abrir notificações"

          aria-expanded={notificacoesAbertas}

          aria-controls="painel-notificacoes"

          className={`

            flex h-11 w-11 shrink-0 items-center justify-center

            rounded-xl border transition-all duration-200

            focus-visible:outline-none focus-visible:ring-2

            focus-visible:ring-[#023E8A] focus-visible:ring-offset-2

            ${

              notificacoesAbertas

                ? "border-[#BBD5EA] bg-[#EAF3F7] text-[#023E8A]"

                : "border-slate-200 bg-white text-[#023E8A] hover:border-[#BBD5EA] hover:bg-[#EAF3F7]"

            }

          `}

        >

          <Bell size={20} strokeWidth={1.9} />

        </button>

        {notificacoesAbertas && (

          <div

            id="painel-notificacoes"

            role="dialog"

            aria-label="Notificações"

            className="

              absolute right-0 top-full z-[70] mt-3

              w-[min(350px,calc(100vw-2rem))]

              overflow-hidden rounded-2xl border border-slate-200

              bg-white shadow-[0_18px_55px_rgba(15,23,42,0.16)]

            "

          >

            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">

              <div>

                <h2 className="text-lg font-bold text-[#0B1756]">

                  Notificações

                </h2>

                <p className="mt-0.5 text-xs text-slate-500">

                  Avisos e atualizações do UneSUS

                </p>

              </div>

              <button

                type="button"

                onClick={() => setNotificacoesAbertas(false)}

                aria-label="Fechar notificações"

                className="

                  flex h-9 w-9 items-center justify-center

                  rounded-lg text-slate-500 transition

                  hover:bg-slate-100 hover:text-[#023E8A]

                  focus-visible:outline-none focus-visible:ring-2

                  focus-visible:ring-[#023E8A]

                "

              >

                <X size={18} />

              </button>

            </div>

            <div className="px-5 py-8 text-center">

              <span className="

                mx-auto flex h-14 w-14 items-center justify-center

                rounded-2xl bg-[#EAF3F7] text-[#023E8A]

              ">

                <CheckCircle2 size={25} strokeWidth={1.8} />

              </span>

              <p className="mt-4 text-sm font-semibold text-slate-800">

                Nenhuma notificação por enquanto

              </p>

              <p className="mx-auto mt-2 max-w-[250px] text-xs leading-5 text-slate-500">

                Quando houver novos avisos ou atualizações, eles aparecerão aqui.

              </p>

            </div>

            <div className="border-t border-slate-100 bg-slate-50 px-4 py-3">

              <p className="text-center text-xs text-slate-400">

                Notificações reais dependem da integração com o sistema.

              </p>

            </div>

          </div>

        )}

      </div>

    );

  }
// ======================================================
// PERFIL
// ======================================================
  function renderPerfil() {

    if (!usuarioLogado) return null;

    return (

      <Link

        href={areaAtual.perfil}

        aria-label={`Abrir ${areaAtual.descricao}`}

        aria-current={estaAtivo(areaAtual.perfil) ? "page" : undefined}

        className={`

          group flex h-[52px] shrink-0 items-center gap-2.5

          rounded-xl border px-2.5 transition-all duration-200

          focus-visible:outline-none focus-visible:ring-2

          focus-visible:ring-[#023E8A] focus-visible:ring-offset-2

          ${

            estaAtivo(areaAtual.perfil)

              ? "border-[#BBD5EA] bg-[#EAF3F7]"

              : "border-slate-200 bg-white hover:border-[#BBD5EA] hover:bg-[#F4F9FD]"

          }

        `}

      >

        <span className={`

          flex h-10 w-10 shrink-0 items-center justify-center

          rounded-xl ${areaAtual.estiloIcone}

        `}>

          <IconePerfil size={20} strokeWidth={2} />

        </span>

        <span className="flex min-w-0 flex-col items-start leading-tight">

          <span className="text-sm font-semibold text-[#0B1756]">

            Meu perfil

          </span>

          <span className="mt-1 max-w-[105px] truncate text-xs text-slate-500">

            {areaAtual.nome}

          </span>

        </span>

        <ChevronRight

          size={16}

          className="shrink-0 text-[#023E8A] transition-transform group-hover:translate-x-0.5"

        />

      </Link>

    );

  }
// ======================================================
// LOGO
// ======================================================
  function renderLogo() {

    return (

      <Link

        href={inicio}

        aria-label="Ir para a página inicial do UneSUS"

        className="

          flex shrink-0 items-center rounded-lg

          focus-visible:outline-none focus-visible:ring-2

          focus-visible:ring-[#023E8A] focus-visible:ring-offset-2

        "

      >

        <Image

          src="/logo.svg"

          alt="UneSUS — São Caetano do Sul"

          width={205}

          height={70}

          priority

          className="h-auto w-[155px] sm:w-[175px] xl:w-[190px]"

        />

      </Link>

    );

  }
// ======================================================
// LINKS DESKTOP
// ======================================================
  function renderNavegacaoDesktop() {

    return (

      <nav

        aria-label="Navegação principal"

        className="flex min-w-0 flex-1 items-center justify-center"

      >

        <div className="flex min-w-0 items-center justify-center gap-1 xl:gap-1.5">

          {menus[tipo].map((item) => {

            const ativo = estaAtivo(item.href);

            return (

              <Link

                key={item.href}

                href={item.href}

                aria-current={ativo ? "page" : undefined}

                className={`

                  relative flex min-h-11 shrink-0 items-center

                  justify-center whitespace-nowrap rounded-xl

                  px-2.5 py-2.5 text-sm font-medium

                  transition-all duration-200

                  xl:px-3

                  ${

                    ativo

                      ? "bg-[#EAF3F7] font-semibold text-[#023E8A] after:absolute after:-bottom-[3px] after:left-1/2 after:h-[3px] after:w-7 after:-translate-x-1/2 after:rounded-full after:bg-[#023E8A]"

                      : "text-[#0B1756] hover:bg-[#F3F7FC] hover:text-[#023E8A]"

                  }

                `}

              >

                {item.nome}

              </Link>

            );

          })}

        </div>

      </nav>

    );

  }
// ======================================================
// LINKS MOBILE / TABLET
// ======================================================
  function renderMenuResponsivo() {

    return (

      <div

        id="menu-responsivo-unesus"

        className="

          absolute left-0 right-0 top-full z-[60]

          max-h-[calc(100dvh-80px)] overflow-y-auto

          border-t border-slate-100 bg-white

          shadow-[0_16px_35px_rgba(2,62,138,0.12)]

          xl:hidden

        "

      >

        <div className="mx-auto w-full max-w-[1480px] px-4 py-4 sm:px-6 lg:px-8">

          {/* PERFIL */}

          {usuarioLogado && (

            <Link

              href={areaAtual.perfil}

              onClick={fecharMenus}

              className="

                mb-4 flex items-center gap-3 rounded-2xl

                border border-[#EAF3F7] bg-[#F4F9FD] p-3

                transition hover:bg-[#EAF3F7]

              "

            >

              <span className={`

                flex h-12 w-12 shrink-0 items-center justify-center

                rounded-xl ${areaAtual.estiloIcone}

              `}>

                <IconePerfil size={22} strokeWidth={2} />

              </span>

              <span className="flex min-w-0 flex-1 flex-col">

                <span className="text-sm font-bold text-[#0B1756]">

                  Meu perfil

                </span>

                <span className="mt-1 text-xs text-slate-500">

                  {areaAtual.nome}

                </span>

              </span>

              <ChevronRight size={19} className="text-[#023E8A]" />

            </Link>

          )}

          {/* NAVEGAÇÃO */}

          <nav

            aria-label="Navegação do menu"

            className="grid grid-cols-1 gap-1 sm:grid-cols-2"

          >

            {menus[tipo].map((item) => {

              const ativo = estaAtivo(item.href);

              return (

                <Link

                  key={item.href}

                  href={item.href}

                  onClick={fecharMenus}

                  aria-current={ativo ? "page" : undefined}

                  className={`

                    flex min-h-12 items-center justify-between

                    rounded-xl px-4 text-sm font-medium

                    transition-colors

                    ${

                      ativo

                        ? "bg-[#EAF3F7] font-semibold text-[#023E8A]"

                        : "text-[#0B1756] hover:bg-[#F3F7FC]"

                    }

                  `}

                >

                  {item.nome}

                  {ativo && (

                    <span className="h-2 w-2 rounded-full bg-[#3563A7]" />

                  )}

                </Link>

              );

            })}

          </nav>

          {/* ENTRAR */}

          {tipo === "publico" && (

            <div className="mt-4 border-t border-slate-100 pt-4">

              <Link

                href="/publico/login"

                onClick={fecharMenus}

                className="

                  flex h-12 w-full items-center justify-center

                  rounded-xl bg-[#023E8A] px-5

                  text-sm font-semibold text-white

                  transition-colors hover:bg-[#0B1756]

                  focus-visible:outline-none focus-visible:ring-2

                  focus-visible:ring-[#023E8A] focus-visible:ring-offset-2

                "

              >

                Entrar no sistema

              </Link>

            </div>

          )}

        </div>

      </div>

    );

  }
// ======================================================
// RENDERIZAÇÃO
// ======================================================
  return (

    <header

      ref={headerRef}

      className="

        sticky top-0 z-50 w-full

        border-b border-slate-200

        bg-white

      "

    >

      {/* DESKTOP: A PARTIR DE 1280PX */}

      <div

        className="

          mx-auto hidden h-20 w-full max-w-[1600px]

          items-center gap-4 px-6

          xl:flex 2xl:px-10

        "

      >

        {/* LOGO */}

        {renderLogo()}

        {/* NAVEGAÇÃO */}

        {renderNavegacaoDesktop()}

        {/* AÇÕES */}

        <div className="flex w-[205px] shrink-0 items-center justify-end gap-2">

          {usuarioLogado && renderNotificacoes()}

          {tipo === "publico" ? (

            <Link

              href="/publico/login"

              className="

                flex h-11 min-w-[82px] items-center justify-center

                rounded-xl bg-[#023E8A] px-5

                text-sm font-semibold text-white

                transition-colors hover:bg-[#0B1756]

                focus-visible:outline-none focus-visible:ring-2

                focus-visible:ring-[#023E8A] focus-visible:ring-offset-2

              "

            >

              Entrar

            </Link>

          ) : (

            renderPerfil()

          )}

        </div>

      </div>

      {/* TABLET E CELULAR: ABAIXO DE 1280PX */}

      <div

        className="

          relative mx-auto flex h-20 w-full max-w-[1600px]

          items-center justify-between gap-3 px-4

          sm:px-6 xl:hidden

        "

      >

        {/* LOGO */}

        {renderLogo()}

        {/* AÇÕES */}

        <div className="flex shrink-0 items-center gap-2">

          {usuarioLogado && renderNotificacoes()}

          <button

            type="button"

            onClick={alternarMenu}

            aria-label={menuAberto ? "Fechar menu" : "Abrir menu"}

            aria-expanded={menuAberto}

            aria-controls="menu-responsivo-unesus"

            className="

              flex h-11 w-11 items-center justify-center

              rounded-xl border border-slate-200

              bg-white text-[#023E8A]

              transition-colors hover:bg-[#EAF3F7]

              focus-visible:outline-none focus-visible:ring-2

              focus-visible:ring-[#023E8A] focus-visible:ring-offset-2

            "

          >

            {menuAberto ? (

              <X size={22} strokeWidth={2} />

            ) : (

              <Menu size={22} strokeWidth={2} />

            )}

          </button>

        </div>

        {/* MENU EXPANSÍVEL */}

        {menuAberto && renderMenuResponsivo()}

      </div>

    </header>

  );

}
