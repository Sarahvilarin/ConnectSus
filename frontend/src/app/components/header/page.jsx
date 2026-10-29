"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Bell,
  CheckCircle2,
  ChevronRight,
  Menu,
  UserRound,
  X,
} from "lucide-react";

// Mantém os mesmos nomes e destinos de navegação do projeto.
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
    { nome: "Fila Online", href: "/cliente/fila" },
    { nome: "Visita Domiciliar", href: "/cliente/visita" },
    { nome: "Exames", href: "/cliente/exames" },
    { nome: "Consultas", href: "/cliente/consultas" },
  ],
  medico: [
    { nome: "Dashboard", href: "/medico/dashboard" },
    { nome: "Pacientes", href: "/medico/pacientes" },
    { nome: "Exames", href: "/medico/gestaoexame" },
    { nome: "Consultas", href: "/medico/consultas" },
  ],
  enfermeiro: [
    { nome: "Visita domiciliar", href: "/enfermeiro/visita" },
    { nome: "Triagem", href: "/enfermeiro/triagem" },
  ],
  admin: [
    { nome: "Dashboard", href: "/admin/dashboard" },
    { nome: "Filas", href: "/admin/filas" },
    { nome: "Epidemiologia", href: "/admin/epidemiologico" },
    { nome: "Exames", href: "/admin/gestaoexame" },
    { nome: "Visitas", href: "/admin/gestaovisitas" },
    { nome: "Relatórios", href: "/admin/relatorios" },
    { nome: "Equipe", href: "/admin/equipe" },
    { nome: "Consultas", href: "/admin/consultas" },
  ],
};

const areas = {
  publico: {
    nome: "Área pública",
    perfil: null,
    icone: UserRound,
    descricao: "Acesso ao sistema",
    estiloIcone: "bg-[#EAF3F7] text-[#023E8A]",
  },
  cliente: {
    nome: "Área do paciente",
    perfil: "/cliente/perfil",
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

export default function Header() {
  const pathname = usePathname() || "/";
  const [menuAberto, setMenuAberto] = useState(false);
  const [notificacoesAbertas, setNotificacoesAbertas] = useState(false);

  const tipo = pathname.startsWith("/cliente")
    ? "cliente"
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

  useEffect(() => {
    setMenuAberto(false);
    setNotificacoesAbertas(false);
  }, [pathname]);

  useEffect(() => {
    function fecharComEscape(event) {
      if (event.key === "Escape") setNotificacoesAbertas(false);
    }
    window.addEventListener("keydown", fecharComEscape);
    return () => window.removeEventListener("keydown", fecharComEscape);
  }, []);

  function estaAtivo(href) {
    if (!href) return false;
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  const inicio =
    tipo === "cliente"
      ? "/cliente/dashboard"
      : tipo === "medico"
        ? "/medico/dashboard"
        : tipo === "enfermeiro"
          ? "/enfermeiro/visita"
          : tipo === "admin"
          ? "/admin/dashboard"
          : "/";

  function alternarNotificacoes() {
    setNotificacoesAbertas((aberto) => !aberto);
  }

  function renderBotaoNotificacoes(id) {
    return (
      <div className="relative">
        <button
          type="button"
          onClick={alternarNotificacoes}
          aria-label="Abrir notificações"
          aria-expanded={notificacoesAbertas}
          aria-controls={id}
          className={`relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#023E8A] focus-visible:ring-offset-2 ${
            notificacoesAbertas
              ? "border-[#BBD5EA] bg-[#EAF3F7] text-[#023E8A]"
              : "border-slate-200 bg-white text-[#023E8A] hover:border-[#BBD5EA] hover:bg-[#F4F9FD] hover:text-[#023E8A]"
          }`}
        >
          <Bell size={19} strokeWidth={1.9} aria-hidden="true" />
        </button>
        {notificacoesAbertas && (
          <div
            id={id}
            role="dialog"
            aria-label="Notificações"
            className="absolute right-0 top-full z-[60] mt-3 w-[min(340px,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_18px_55px_rgba(15,23,42,0.16)]"
          >
            <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3.5">
              <div>
                <h2 className="text-sm font-bold text-[#0B1756]">Notificações</h2>
                <p className="mt-0.5 text-xs text-slate-500">Avisos e atualizações do UneSUS</p>
              </div>
              <button
                type="button"
                onClick={() => setNotificacoesAbertas(false)}
                aria-label="Fechar notificações"
                className="flex h-8 w-8 items-center justify-center rounded-lg text-[#023E8A] transition hover:bg-slate-100 hover:text-[#0B1756] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#023E8A]"
              >
                <X size={17} />
              </button>
            </div>
            <div className="px-5 py-7 text-center">
              <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#EAF3F7] text-[#023E8A]">
                <CheckCircle2 size={23} strokeWidth={1.8} />
              </span>
              <p className="mt-3 text-sm font-semibold text-slate-800">Nenhuma notificação por enquanto</p>
              <p className="mx-auto mt-1.5 max-w-[250px] text-xs leading-5 text-slate-500">
                Quando houver novos avisos ou atualizações, eles aparecerão aqui.
              </p>
            </div>
            <div className="border-t border-slate-100 bg-slate-50/80 px-4 py-2.5">
              <p className="text-center text-[11px] text-slate-400">
                Notificações reais dependem da integração com o sistema.
              </p>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/80 bg-white/95 backdrop-blur-md">
      {/* Desktop: todos os elementos ficam centralizados no mesmo eixo vertical. */}
      <div className="mx-auto hidden h-[80px] -translate-y-3.5 max-w-[1480px] grid-cols-[220px_minmax(0,1fr)_220px] items-center gap-4 px-6 lg:grid xl:px-8">
        <div className="flex h-full items-center justify-start">
          <Link
            href={inicio}
            aria-label="Ir para a página inicial do UneSUS"
            className="inline-flex items-center rounded-xl transition-transform duration-200 hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#023E8A] focus-visible:ring-offset-2"
          >
            <Image
              src="/logo.svg"
              alt="UneSUS — São Caetano do Sul"
              width={205}
              height={70}
              priority
              className="block h-auto w-[185px] xl:w-[200px]"
            />
          </Link>
        </div>

        <div className="flex h-full min-w-0 items-center justify-center">
          <nav aria-label="Navegação principal" className="flex min-w-0 items-center justify-center">
            <div className="flex min-w-0 items-center justify-center gap-1">
              {menus[tipo].map((item) => {
                const ativo = estaAtivo(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    aria-current={ativo ? "page" : undefined}
                    className={`relative inline-flex min-h-11 items-center justify-center whitespace-nowrap rounded-xl px-2.5 py-2.5 text-[13px] font-medium transition-colors duration-200 xl:px-3 xl:text-sm ${
                      ativo
                        ? "bg-[#EAF3F7] font-semibold text-[#023E8A] after:absolute after:-bottom-[7px] after:left-1/2 after:h-[3px] after:w-7 after:-translate-x-1/2 after:rounded-full after:bg-[#023E8A]"
                        : "text-[#0B1756] hover:bg-[#F3F7FC] hover:text-[#023E8A]"
                    }`}
                  >
                    {item.nome}
                  </Link>
                );
              })}
            </div>
          </nav>
        </div>

        <div className="flex h-full items-center justify-end gap-2">
          {renderBotaoNotificacoes("painel-notificacoes-desktop")}
          {tipo === "publico" ? (
            <Link
              href="/publico/login"
              className="inline-flex h-11 items-center justify-center rounded-xl bg-[#023E8A] px-5 text-sm font-semibold text-white transition-colors hover:bg-[#0B1756] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#023E8A] focus-visible:ring-offset-2"
            >
              Entrar
            </Link>
          ) : (
            <Link
              href={areaAtual.perfil}
              aria-label={`Abrir ${areaAtual.descricao.toLowerCase()}`}
              aria-current={estaAtivo(areaAtual.perfil) ? "page" : undefined}
              className={`group flex h-[52px] items-center gap-2.5 rounded-2xl border py-1.5 pl-1.5 pr-3 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#023E8A] focus-visible:ring-offset-2 ${
                estaAtivo(areaAtual.perfil)
                  ? "border-[#BBD5EA] bg-[#F4F9FD]"
                  : "border-slate-200/80 bg-white hover:border-[#BBD5EA] hover:bg-[#F8FBFE]"
              }`}
            >
              <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${areaAtual.estiloIcone}`}>
                <IconePerfil size={20} strokeWidth={2} aria-hidden="true" />
              </span>
              <span className="flex min-w-0 flex-col items-start leading-tight">
                <span className="text-[12px] font-bold text-slate-800">Meu perfil</span>
                <span className="mt-1 max-w-[112px] truncate text-[10px] font-medium text-slate-500">
                  {areaAtual.nome}
                </span>
              </span>
              <ChevronRight
                size={16}
                className="ml-0.5 shrink-0 text-[#023E8A] transition-transform group-hover:translate-x-0.5 group-hover:text-[#0B1756]"
                aria-hidden="true"
              />
            </Link>
          )}
        </div>
      </div>

      {/* Mobile/tablet: logo, sino e menu também ficam centralizados verticalmente. */}
      <div className="mx-auto flex h-[80px] -translate-y-3.5 max-w-[1480px] items-center justify-between px-4 sm:px-6 lg:hidden">
        <Link
          href={inicio}
          aria-label="Ir para a página inicial do UneSUS"
          className="inline-flex items-center rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#023E8A] focus-visible:ring-offset-2"
        >
          <Image
            src="/logo.svg"
            alt="UneSUS — São Caetano do Sul"
            width={190}
            height={65}
            priority
            className="block h-auto w-[158px] sm:w-[175px]"
          />
        </Link>

        <div className="flex items-center gap-2">
          {renderBotaoNotificacoes("painel-notificacoes-mobile")}
          {tipo === "publico" ? (
            <Link
              href="/publico/login"
              className="inline-flex h-11 items-center justify-center rounded-xl bg-[#023E8A] px-4 text-sm font-semibold text-white transition-colors hover:bg-[#0B1756]"
            >
              Entrar
            </Link>
          ) : null}
          <button
            type="button"
            onClick={() => setMenuAberto((aberto) => !aberto)}
            aria-label={menuAberto ? "Fechar menu" : "Abrir menu"}
            aria-expanded={menuAberto}
            aria-controls="menu-mobile-unesus"
            className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-[#023E8A] transition hover:bg-[#EAF3F7] hover:text-[#023E8A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#023E8A] focus-visible:ring-offset-2"
          >
            {menuAberto ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Menu mobile completo; sem ícones nos links de páginas. */}
      {menuAberto && (
        <div
          id="menu-mobile-unesus"
          className="border-t border-slate-100 bg-white px-4 pb-5 pt-3 shadow-[0_16px_35px_rgba(2,62,138,0.10)] sm:px-6 lg:hidden"
        >
          {usuarioLogado && (
            <Link
              href={areaAtual.perfil}
              onClick={() => setMenuAberto(false)}
              className="mb-3 flex items-center gap-3 rounded-2xl bg-[#F4F8FC] p-3 transition hover:bg-[#EAF3F7]"
            >
              <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${areaAtual.estiloIcone}`}>
                <IconePerfil size={21} strokeWidth={2} aria-hidden="true" />
              </span>
              <span className="flex min-w-0 flex-1 flex-col">
                <span className="text-sm font-bold text-[#0B1756]">Meu perfil</span>
                <span className="mt-0.5 text-xs text-slate-500">{areaAtual.nome}</span>
              </span>
              <ChevronRight size={17} className="text-[#023E8A]" aria-hidden="true" />
            </Link>
          )}

          <nav aria-label="Navegação móvel" className="grid gap-1">
            {menus[tipo].map((item) => {
              const ativo = estaAtivo(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMenuAberto(false)}
                  aria-current={ativo ? "page" : undefined}
                  className={`flex min-h-11 items-center rounded-xl px-4 text-sm font-medium transition ${
                    ativo
                      ? "bg-[#EAF3F7] font-semibold text-[#023E8A]"
                      : "text-[#0B1756] hover:bg-[#F3F7FC]"
                  }`}
                >
                  {item.nome}
                </Link>
              );
            })}
          </nav>

          {tipo === "publico" && (
            <div className="mt-4 border-t border-slate-100 pt-4">
              <Link
                href="/publico/login"
                onClick={() => setMenuAberto(false)}
                className="flex h-11 w-full items-center justify-center rounded-xl bg-[#023E8A] text-sm font-semibold text-white transition hover:bg-[#0B1756]"
              >
                Entrar no sistema
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
