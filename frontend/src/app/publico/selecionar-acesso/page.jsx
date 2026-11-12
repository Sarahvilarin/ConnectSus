
"use client";

import Link from "next/link";
import {
  ArrowUpRight,
  UserRound,
  ShieldCheck,
  Stethoscope,
  HeartPulse,
} from "lucide-react";

const perfis = [
  {
    titulo: "Paciente",
    descricao: "Acesse seus serviços e acompanhe seus atendimentos.",
    identificacao: "ÁREA DO USUÁRIO",
    href: "/publico/login",
  },
  {
    titulo: "Administrador",
    descricao: "Gerencie a plataforma e as unidades de saúde.",
    identificacao: "GESTÃO",
    href: "/publico/login",
  },
  {
    titulo: "Médico",
    descricao: "Consulte sua agenda e gerencie os atendimentos.",
    identificacao: "PROFISSIONAL DE SAÚDE",
    href: "/publico/login-profissional",
  },
  {
    titulo: "Enfermeiro",
    descricao: "Realize triagens e acompanhe os pacientes.",
    identificacao: "PROFISSIONAL DE SAÚDE",
    href: "/publico/login-profissional",
  },
];

export default function SelecionarAcesso() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#EAF3F7] px-5 py-8 text-[#0B1756]">

      {/* FUNDO DECORATIVO */}
      <div className="pointer-events-none absolute -right-28 -top-36 h-[430px] w-[430px] rounded-full bg-[#3563A7]/15" />
      <div className="pointer-events-none absolute -left-40 top-10 h-[330px] w-[330px] rounded-full border-2 border-[#3563A7]/20" />
      <div className="pointer-events-none absolute -bottom-36 -left-24 h-[350px] w-[350px] rounded-full bg-white/50" />
      <div className="pointer-events-none absolute -bottom-40 -right-24 h-[430px] w-[430px] rounded-full border-[70px] border-[#3563A7]/15" />

      <section className="relative z-10 mx-auto w-full max-w-[960px]">

        {/* CABEÇALHO */}
        <div className="mb-10 text-center">
          <div className="mb-4 flex items-center justify-center gap-2">
            <span className="h-[2px] w-8 rounded-full bg-[#3563A7]/50" />
            <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#3563A7]">
              Acesso à plataforma
            </span>
            <span className="h-[2px] w-8 rounded-full bg-[#3563A7]/50" />
          </div>

          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
            Bem-vindo ao
            <span className="mt-1 block text-[#023E8A]">
              ConectaSUS
            </span>
          </h1>

          <p className="mx-auto mt-4 max-w-md text-[15px] leading-relaxed text-[#0B1756]/60">
            Um espaço integrado para conectar pacientes e profissionais
            a uma saúde mais acessível.
          </p>
        </div>

        
{/* CARDS */}
<div className="grid gap-4 sm:grid-cols-2">

  {perfis.map((perfil) => (
    <Link
      key={perfil.titulo}
      href={perfil.href}
      className="group relative flex min-h-[158px] items-center overflow-hidden rounded-[20px] border border-[#3563A7]/15 bg-white/95 p-7 shadow-[0_5px_20px_rgba(11,23,86,0.045)] transition-all duration-300 hover:-translate-y-1 hover:border-[#3563A7]/40 hover:shadow-[0_12px_30px_rgba(11,23,86,0.10)]"
    >
      {/* DETALHE LATERAL */}
      <div className="absolute left-0 top-0 h-full w-[4px] bg-[#3563A7]/25 transition-colors duration-300 group-hover:bg-[#023E8A]" />

      {/* DETALHE DECORATIVO */}
      <div className="absolute -right-12 -top-14 h-36 w-36 rounded-full bg-[#EAF3F7]/80 transition-transform duration-500 group-hover:scale-125" />

      {/* INFORMAÇÕES */}
      <div className="relative z-10">
        <span className="mb-2 block text-[10px] font-bold tracking-[0.16em] text-[#023E8A]">
  {perfil.identificacao}
</span>

        <h2 className="text-xl font-bold tracking-tight text-[#0B1756] transition-colors duration-300 group-hover:text-[#023E8A]">
          {perfil.titulo}
        </h2>

        <p className="mt-1.5 max-w-[270px] text-sm leading-relaxed text-[#0B1756]/55">
          {perfil.descricao}
        </p>
      </div>
    </Link>
  ))}

</div>

      </section>
    </main>
  );
}
