"use client";

import { useEffect, useMemo, useState } from "react";
import {
  CalendarClock, CalendarDays, CheckCircle2, Clock3, FileCheck2,
  FileText, FlaskConical, Info, MapPin, Search, ShieldCheck, X,
  ClipboardList, Building2, CircleHelp, Stethoscope, HeartPulse,
} from "lucide-react";
import { api } from "@/lib/api";

const STATUS_MAP = {
  solicitado: "Solicitado",
  agendado: "Agendado",
  em_andamento: "Em andamento",
  concluido: "Concluído",
  cancelado: "Cancelado",
};
const STATUS_PROXIMOS = ["Solicitado", "Agendado", "Em andamento"];

function formatarData(data) {
  if (!data) return "Não agendado";
  const parte = String(data).slice(0, 10);
  const [ano, mes, dia] = parte.split("-");
  return ano && mes && dia ? `${dia}/${mes}/${ano}` : "Não agendado";
}

function formatarDiaSemana(data) {
  if (!data) return "Data não definida";
  const [ano, mes, dia] = String(data).slice(0, 10).split("-").map(Number);
  if (!ano || !mes || !dia) return "Data não definida";
  return new Date(Date.UTC(ano, mes - 1, dia)).toLocaleDateString("pt-BR", {
    weekday: "long", timeZone: "UTC",
  });
}

function formatarHorario(data) {
  if (!data) return "A definir";
  const texto = String(data);
  const horario = texto.includes("T") ? texto.split("T")[1] : texto.split(" ")[1];
  return horario ? horario.slice(0, 5) : "A definir";
}

function adaptarExame(exame) {
  const data = exame.data_agendada || null;
  return {
    id: exame.id,
    protocolo: `EXM-${String(exame.id).padStart(6, "0")}`,
    nome: exame.tipo_exame || "Exame",
    categoria: "Exame",
    descricao: exame.observacoes || "Nenhuma descrição adicional informada.",
    data: formatarData(data),
    diaSemana: formatarDiaSemana(data),
    horario: formatarHorario(data),
    unidade: exame.unidade || "Unidade não informada",
    status: STATUS_MAP[exame.status] || exame.status || "Indefinido",
    preparo: "Consulte as orientações fornecidas pelo profissional responsável ou pela unidade de saúde.",
    solicitante: exame.medico || "Não informado",
    solicitadoEm: formatarData(exame.criado_em),
    resultado: exame.resultado || null,
    observacao: exame.observacoes || null,
  };
}

function BadgeStatus({ status }) {
  const estilos = {
    Solicitado: "border-amber-200 bg-amber-50 text-amber-800",
    Agendado: "border-emerald-200 bg-emerald-50 text-emerald-700",
    "Em andamento": "border-blue-200 bg-blue-50 text-[#023E8A]",
    Concluído: "border-blue-200 bg-blue-50 text-[#023E8A]",
    Cancelado: "border-slate-200 bg-slate-100 text-slate-600",
  };
  const Icone = ["Agendado", "Concluído"].includes(status)
    ? CheckCircle2 : status === "Cancelado" ? X : Clock3;
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold ${estilos[status] || estilos.Solicitado}`}>
      <Icone size={14} />{status}
    </span>
  );
}

function Modal({ titulo, descricao, children, onClose }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-[2px]" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <section className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl border border-slate-100 bg-white shadow-2xl" role="dialog" aria-modal="true" aria-label={titulo}>
        <div className="flex items-start justify-between gap-4 border-b border-slate-100 px-6 py-5 sm:px-7">
          <div><h2 className="text-xl font-bold text-[#0B1756]">{titulo}</h2>{descricao && <p className="mt-1.5 text-sm leading-6 text-slate-500">{descricao}</p>}</div>
          <button type="button" onClick={onClose} aria-label="Fechar" className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100"><X size={20} /></button>
        </div>
        <div className="px-6 py-5 sm:px-7">{children}</div>
      </section>
    </div>
  );
}

function StatCard({ icon: Icone, label, valor, descricao, tone = "blue" }) {
  const tones = {
    blue: "border-blue-100 bg-blue-50/70 text-[#023E8A]",
    amber: "border-amber-100 bg-amber-50/70 text-amber-700",
    green: "border-emerald-100 bg-emerald-50/70 text-emerald-700",
    slate: "border-slate-200 bg-slate-50 text-slate-600",
  };
  return (
    <div className="rounded-2xl border border-[#DCE8F5] bg-white p-4 shadow-sm sm:p-5">
      <div className="flex items-start justify-between gap-3"><div><p className="text-sm font-medium text-slate-500">{label}</p><p className="mt-2 text-3xl font-extrabold tracking-tight text-[#0B1756]">{valor}</p></div><span className={`flex h-11 w-11 items-center justify-center rounded-xl border ${tones[tone]}`}><Icone size={22} /></span></div>
      <p className="mt-2 text-xs leading-5 text-slate-500">{descricao}</p>
    </div>
  );
}

export default function MeusExamesPage() {
  const [exames, setExames] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [secao, setSecao] = useState("proximos");
  const [filtroStatus, setFiltroStatus] = useState("Todos");
  const [filtroCategoria, setFiltroCategoria] = useState("Todas as categorias");
  const [busca, setBusca] = useState("");
  const [detalhe, setDetalhe] = useState(null);

  useEffect(() => {
    let ativo = true;
    async function carregarExames() {
      try {
        setCarregando(true);
        setErro("");
        const resposta = await api("/exames/me");
        const lista = Array.isArray(resposta) ? resposta : Array.isArray(resposta?.exames) ? resposta.exames : [];
        if (ativo) setExames(lista.map(adaptarExame));
      } catch (error) {
        if (ativo) setErro(error.message || "Não foi possível carregar seus exames.");
      } finally {
        if (ativo) setCarregando(false);
      }
    }
    carregarExames();
    return () => { ativo = false; };
  }, []);

  const contagens = useMemo(() => ({
    proximos: exames.filter((e) => STATUS_PROXIMOS.includes(e.status)).length,
    aguardando: exames.filter((e) => e.status === "Solicitado").length,
    confirmados: exames.filter((e) => e.status === "Agendado").length,
    realizados: exames.filter((e) => e.status === "Concluído").length,
    cancelados: exames.filter((e) => e.status === "Cancelado").length,
  }), [exames]);

  const proximoExame = useMemo(() => exames
    .filter((e) => ["Agendado", "Em andamento"].includes(e.status) && e.data !== "Não agendado")
    .sort((a, b) => a.data.split("/").reverse().join("").localeCompare(b.data.split("/").reverse().join("")) || a.horario.localeCompare(b.horario))[0] || null, [exames]);

  const examesFiltrados = useMemo(() => exames.filter((exame) => {
    const termo = busca.trim().toLocaleLowerCase("pt-BR");
    const correspondeBusca = !termo || [exame.nome, exame.protocolo, exame.unidade, exame.categoria]
      .some((v) => String(v || "").toLocaleLowerCase("pt-BR").includes(termo));
    const correspondeSecao = secao === "proximos"
      ? STATUS_PROXIMOS.includes(exame.status)
      : ["Concluído", "Cancelado"].includes(exame.status);
    const correspondeStatus = filtroStatus === "Todos" || exame.status === filtroStatus;
    const correspondeCategoria = filtroCategoria === "Todas as categorias" || exame.categoria === filtroCategoria;
    return correspondeBusca && correspondeSecao && correspondeStatus && correspondeCategoria;
  }), [exames, busca, secao, filtroStatus, filtroCategoria]);

  function mudarSecao(novaSecao) {
    setSecao(novaSecao); setFiltroStatus("Todos"); setFiltroCategoria("Todas as categorias"); setBusca("");
  }
  function limparFiltros() { setBusca(""); setFiltroStatus("Todos"); setFiltroCategoria("Todas as categorias"); }

  const opcoesStatus = secao === "proximos"
    ? ["Todos", "Solicitado", "Agendado", "Em andamento"]
    : ["Todos", "Concluído", "Cancelado"];

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#F4F9FE] pb-14 text-[#0B1756]">
      <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-[#DCEBFA]/80" />
      <div className="pointer-events-none absolute -left-28 top-[510px] h-56 w-56 rounded-full border border-[#DCEBFA]" />
      <div className="relative mx-auto max-w-[1320px] px-4 pt-7 sm:px-6 lg:px-8 lg:pt-9">
        <div className="mb-7 flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
          <div className="max-w-3xl">
            <span className="mb-3 inline-flex items-center gap-2 rounded-full bg-[#DCE8F5] px-3.5 py-1.5 text-xs font-bold uppercase tracking-[0.12em] text-[#023E8A]"><FlaskConical size={14} /> Área do paciente · Exames</span>
            <h1 className="text-3xl font-extrabold tracking-tight text-[#0B1756] sm:text-4xl lg:text-[42px]">Meus exames</h1>
            <p className="mt-2 max-w-2xl text-base leading-7 text-[#344968] sm:text-lg">Acompanhe seus exames, confira os agendamentos e consulte os resultados disponibilizados pela unidade.</p>
          </div>
          <div className="flex max-w-[440px] items-start gap-3 rounded-xl border border-[#B8CDEB] bg-[#EAF2FC] px-4 py-4 text-sm leading-6 text-[#17366F] shadow-sm"><Info size={21} className="mt-0.5 shrink-0 text-[#023E8A]" /><div><p className="font-bold">Informações sobre seus exames</p><p className="mt-1">Os agendamentos são realizados pela equipe responsável. Consulte as orientações diretamente com a unidade de saúde.</p></div></div>
        </div>

        <div className="mb-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard icon={CalendarClock} label="Próximos exames" valor={contagens.proximos} descricao="Exames solicitados ou em acompanhamento" tone="blue" />
          <StatCard icon={Clock3} label="Solicitados" valor={contagens.aguardando} descricao="Aguardando agendamento pela equipe" tone="amber" />
          <StatCard icon={CheckCircle2} label="Agendados" valor={contagens.confirmados} descricao="Data e horário definidos" tone="green" />
          <StatCard icon={FileCheck2} label="Exames concluídos" valor={contagens.realizados} descricao="Exames registrados como concluídos" tone="slate" />
        </div>

        <div className="mb-6 grid grid-cols-2 gap-2 rounded-2xl border border-[#D5E4F7] bg-white p-2 shadow-sm">
          <button type="button" onClick={() => mudarSecao("proximos")} className={`flex min-h-12 items-center justify-center gap-2 rounded-xl px-3 py-3 text-sm font-bold transition sm:text-base ${secao === "proximos" ? "bg-[#1D438D] text-white shadow-sm" : "text-[#0B1756] hover:bg-[#F0F6FC]"}`}><CalendarDays size={18} /> Próximos exames <span className={`rounded-full px-2 py-0.5 text-xs ${secao === "proximos" ? "bg-white/20 text-white" : "bg-[#EAF3F7] text-[#023E8A]"}`}>{contagens.proximos}</span></button>
          <button type="button" onClick={() => mudarSecao("historico")} className={`flex min-h-12 items-center justify-center gap-2 rounded-xl px-3 py-3 text-sm font-bold transition sm:text-base ${secao === "historico" ? "bg-[#1D438D] text-white shadow-sm" : "text-[#0B1756] hover:bg-[#F0F6FC]"}`}><FileText size={18} /> Histórico <span className={`rounded-full px-2 py-0.5 text-xs ${secao === "historico" ? "bg-white/20 text-white" : "bg-[#EAF3F7] text-[#023E8A]"}`}>{contagens.realizados + contagens.cancelados}</span></button>
        </div>

        {secao === "proximos" && proximoExame && (
          <div className="mb-7 grid items-start gap-5 xl:grid-cols-[1.65fr_0.85fr]">
            <section className="overflow-hidden rounded-2xl border border-[#CFE0F5] bg-white shadow-sm">
              <div className="flex flex-col justify-between gap-4 border-b border-[#E5EDF7] bg-gradient-to-r from-white to-[#F4F9FF] px-5 py-5 sm:flex-row sm:items-center sm:px-7"><div><p className="text-xs font-bold uppercase tracking-[0.13em] text-[#47709F]">Seu próximo agendamento</p><h2 className="mt-1.5 text-2xl font-extrabold text-[#0B1756] sm:text-[28px]">{proximoExame.nome}</h2><p className="mt-1 text-sm text-slate-500">Protocolo {proximoExame.protocolo} <span className="mx-1.5">·</span> {proximoExame.categoria}</p></div><BadgeStatus status={proximoExame.status} /></div>
              <div className="grid gap-4 p-5 sm:grid-cols-2 sm:p-7">
                <div className="flex gap-4 rounded-xl border border-[#DCE8F5] bg-[#F9FCFF] p-4 sm:p-5"><div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#E3EDF9] text-[#023E8A]"><CalendarDays size={23} /></div><div><p className="text-xs font-bold uppercase tracking-wide text-[#47709F]">Data e horário</p><p className="mt-1.5 text-lg font-extrabold text-[#0B1756]">{proximoExame.diaSemana}, {proximoExame.data}</p><p className="mt-1 flex items-center gap-1.5 text-sm font-semibold text-slate-600"><Clock3 size={15} /> {proximoExame.horario}</p></div></div>
                <div className="flex gap-4 rounded-xl border border-[#DCE8F5] bg-[#F9FCFF] p-4 sm:p-5"><div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#E3EDF9] text-[#023E8A]"><Building2 size={23} /></div><div className="min-w-0"><p className="text-xs font-bold uppercase tracking-wide text-[#47709F]">Local do exame</p><p className="mt-1.5 text-base font-extrabold leading-6 text-[#0B1756]">{proximoExame.unidade}</p></div></div>
              </div>
              <div className="mx-5 mb-5 rounded-xl border border-amber-200 bg-amber-50/80 p-4 sm:mx-7 sm:mb-6"><div className="flex items-start gap-3"><span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-amber-700"><Info size={19} /></span><div><p className="font-bold text-amber-950">Orientação para este exame</p><p className="mt-1 text-sm leading-6 text-amber-900">{proximoExame.preparo}</p></div></div></div>
              <div className="flex flex-col gap-2 border-t border-[#E5EDF7] bg-[#FBFDFF] p-5 sm:flex-row sm:px-7"><button type="button" onClick={() => setDetalhe(proximoExame)} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#023E8A] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#0B1756]"><FileText size={17} /> Ver detalhes completos</button></div>
            </section>
            <aside className="space-y-5">
              <section className="rounded-2xl border border-[#D5E4F7] bg-white p-5 shadow-sm sm:p-6"><div className="flex items-center gap-3"><span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#EAF1FA] text-[#023E8A]"><ClipboardList size={22} /></span><div><h3 className="text-lg font-bold text-[#0B1756]">Checklist para o dia</h3><p className="text-sm text-slate-500">Prepare-se com antecedência</p></div></div><div className="mt-5 space-y-4">{[[FileCheck2,"Documento com foto","Leve RG ou outro documento oficial."],[Stethoscope,"Pedido médico","Tenha o pedido do exame disponível."],[Clock3,"Chegue antes","Confira com a unidade o horário recomendado de chegada."]].map(([Icone,titulo,descricao]) => <div key={titulo} className="flex gap-3"><span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#F0F6FC] text-[#023E8A]"><Icone size={18} /></span><div><p className="text-sm font-bold text-[#0B1756]">{titulo}</p><p className="mt-0.5 text-sm leading-5 text-slate-500">{descricao}</p></div></div>)}</div><button type="button" onClick={() => setDetalhe({ tipo: "orientacoes" })} className="mt-5 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-[#C9DDF2] px-4 py-3 text-sm font-bold text-[#023E8A] transition hover:bg-[#F2F7FD]"><CircleHelp size={17} /> Ver orientações gerais</button></section>
              <section className="rounded-2xl border border-[#D5E4F7] bg-white p-5 shadow-sm sm:p-6"><div className="flex items-center gap-3"><span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#EAF1FA] text-[#023E8A]"><FileCheck2 size={21} /></span><div><h3 className="text-lg font-bold text-[#0B1756]">Situação dos exames</h3><p className="text-sm text-slate-500">Acompanhamento atual</p></div></div><div className="mt-4 space-y-3">{[["Solicitados",contagens.aguardando,"bg-amber-50 text-amber-800"],["Agendados",contagens.confirmados,"bg-emerald-50 text-emerald-700"],["Em andamento",exames.filter((e) => e.status === "Em andamento").length,"bg-blue-50 text-blue-700"]].map(([label,valor,classe]) => <div key={label} className="flex items-center justify-between gap-3 border-b border-slate-100 pb-3 last:border-0 last:pb-0"><span className="text-sm text-slate-600">{label}</span><span className={`min-w-8 rounded-full px-2.5 py-1 text-center text-sm font-bold ${classe}`}>{valor}</span></div>)}</div></section>
            </aside>
          </div>
        )}

        {secao === "proximos" && !proximoExame && !carregando && !erro && <section className="mb-7 rounded-2xl border border-[#D5E4F7] bg-white px-6 py-10 text-center shadow-sm"><span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#EAF1FA] text-[#023E8A]"><CalendarDays size={26} /></span><h2 className="mt-4 text-xl font-bold text-[#0B1756]">Você não tem exames agendados</h2><p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-slate-500">Quando um profissional solicitar ou agendar um exame, as informações aparecerão aqui.</p></section>}

        <section className="overflow-hidden rounded-2xl border border-[#D5E4F7] bg-white shadow-sm">
          <div className="border-b border-[#E5EDF7] px-5 py-5 sm:px-7"><div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-end"><div><h2 className="text-xl font-bold text-[#0B1756]">{secao === "proximos" ? "Todos os próximos exames" : "Histórico de exames"}</h2><p className="mt-1.5 text-sm leading-6 text-slate-500">{secao === "proximos" ? "Acompanhe o status dos exames solicitados e agendados." : "Veja os exames concluídos e os agendamentos cancelados."}</p></div><span className="text-sm text-slate-500">{examesFiltrados.length} {examesFiltrados.length === 1 ? "registro" : "registros"}</span></div>
            <div className="mt-5 flex flex-col gap-3 lg:flex-row"><label className="relative block min-w-0 flex-1"><Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" /><input value={busca} onChange={(e) => setBusca(e.target.value)} placeholder="Buscar por exame, protocolo ou unidade..." className="h-12 w-full rounded-xl border border-[#D6E2F2] bg-white pl-11 pr-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-[#8EAFDF] focus:ring-2 focus:ring-[#023E8A]/10" /></label>
              <select aria-label="Filtrar por situação" value={filtroStatus} onChange={(e) => setFiltroStatus(e.target.value)} className="h-12 rounded-xl border border-[#D6E2F2] bg-white px-3.5 text-sm text-slate-700 outline-none focus:border-[#8EAFDF]">{opcoesStatus.map((s) => <option key={s} value={s}>{s === "Todos" ? "Todas as situações" : s}</option>)}</select>
              <select aria-label="Filtrar por categoria" value={filtroCategoria} onChange={(e) => setFiltroCategoria(e.target.value)} className="h-12 rounded-xl border border-[#D6E2F2] bg-white px-3.5 text-sm text-slate-700 outline-none focus:border-[#8EAFDF]"><option>Todas as categorias</option><option>Exame</option></select>
              <button type="button" onClick={limparFiltros} className="h-12 rounded-xl border border-[#D6E2F2] bg-white px-4 text-sm font-bold text-[#023E8A] transition hover:bg-[#F2F7FD]">Limpar filtros</button>
            </div>
          </div>

          {carregando ? <div className="px-5 py-14 text-center text-sm font-medium text-slate-500">Carregando seus exames...</div> : erro ? <div className="m-5 rounded-xl border border-red-200 bg-red-50 p-5"><p className="font-semibold text-red-800">Não foi possível carregar seus exames</p><p className="mt-1 text-sm text-red-700">{erro}</p></div> : (
            <div className="divide-y divide-[#EAF0F8]">
              {examesFiltrados.map((exame) => <article key={exame.id} className="p-5 transition hover:bg-[#FBFDFF] sm:px-7 sm:py-6"><div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between"><div className="flex min-w-0 gap-4"><div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#EAF1FA] text-[#023E8A]"><FlaskConical size={23} /></div><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2.5"><h3 className="text-lg font-bold text-[#0B1756]">{exame.nome}</h3><BadgeStatus status={exame.status} /></div><p className="mt-1 text-sm text-slate-500">Protocolo {exame.protocolo} <span className="mx-1.5">·</span> {exame.categoria}</p><div className="mt-3 grid gap-2 text-sm text-slate-600 md:grid-cols-2"><p className="flex items-center gap-2"><CalendarDays size={16} className="shrink-0 text-[#4779B9]" /> {exame.data === "Não agendado" ? "Data a definir" : `${exame.diaSemana}, ${exame.data} às ${exame.horario}`}</p><p className="flex items-center gap-2"><MapPin size={16} className="shrink-0 text-[#4779B9]" /> <span>{exame.unidade}</span></p></div></div></div><div className="flex shrink-0 flex-wrap gap-2 xl:justify-end"><button type="button" onClick={() => setDetalhe(exame)} className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-[#D6E2F2] bg-white px-4 py-2.5 text-sm font-bold text-[#023E8A] transition hover:bg-[#F2F7FD]"><FileText size={16} /> Detalhes</button></div></div></article>)}
              {examesFiltrados.length === 0 && <div className="px-5 py-14 text-center"><span className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-[#EAF1FA] text-[#4779B9]"><Search size={22} /></span><h3 className="mt-4 text-lg font-bold text-[#0B1756]">Nenhum exame encontrado</h3><p className="mx-auto mt-1 max-w-md text-sm leading-6 text-slate-500">Não há exames correspondentes à seção ou aos filtros selecionados.</p><button type="button" onClick={limparFiltros} className="mt-4 rounded-xl bg-[#023E8A] px-4 py-2.5 text-sm font-bold text-white hover:bg-[#0B1756]">Limpar filtros</button></div>}
            </div>
          )}
          <div className="flex flex-col justify-between gap-2 border-t border-[#E5EDF7] bg-[#FBFDFF] px-5 py-4 text-xs leading-5 text-slate-500 sm:flex-row sm:items-center sm:px-7"><span>As informações são carregadas diretamente do sistema de saúde.</span><span className="inline-flex items-center gap-1.5"><ShieldCheck size={15} className="text-[#4779B9]" /> Informações de saúde protegidas por autenticação.</span></div>
        </section>
      </div>

      {detalhe && <Modal titulo={detalhe.tipo === "orientacoes" ? "Orientações para seus exames" : detalhe.nome} descricao={detalhe.tipo === "orientacoes" ? "Recomendações gerais para se preparar para o atendimento." : `Protocolo ${detalhe.protocolo} · ${detalhe.categoria}`} onClose={() => setDetalhe(null)}>
        {detalhe.tipo === "orientacoes" ? <div className="space-y-3">{[[FileCheck2,"Documentos necessários","Leve documento oficial com foto, cartão SUS se tiver e pedido médico."],[Clock3,"Horário de chegada","Confirme com a unidade o horário recomendado de chegada."],[HeartPulse,"Preparo do exame","O preparo varia conforme o exame. Confira as instruções específicas fornecidas pela unidade."],[Stethoscope,"Medicamentos e dúvidas","Não altere medicamentos por conta própria. Em caso de dúvida, fale com a unidade ou o profissional responsável."]].map(([Icone,titulo,texto]) => <div key={titulo} className="flex gap-3 rounded-xl border border-slate-100 p-4"><span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#EAF3F7] text-[#023E8A]"><Icone size={20} /></span><div><h3 className="font-bold text-[#0B1756]">{titulo}</h3><p className="mt-1 text-sm leading-6 text-slate-600">{texto}</p></div></div>)}</div> : <div className="space-y-5"><div className="flex flex-wrap items-center gap-2"><BadgeStatus status={detalhe.status} /><span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600">{detalhe.categoria}</span></div><p className="text-sm leading-6 text-slate-600">{detalhe.descricao}</p><div className="grid gap-3 sm:grid-cols-2"><div className="rounded-xl bg-[#F6FAFE] p-4"><p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Data e horário</p><p className="mt-1.5 font-bold text-[#0B1756]">{detalhe.data}</p><p className="mt-1 text-sm text-slate-600">Às {detalhe.horario}</p></div><div className="rounded-xl bg-[#F6FAFE] p-4"><p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Solicitado em</p><p className="mt-1.5 font-bold text-[#0B1756]">{detalhe.solicitadoEm}</p><p className="mt-1 text-sm text-slate-600">Por {detalhe.solicitante}</p></div><div className="rounded-xl bg-[#F6FAFE] p-4 sm:col-span-2"><p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Unidade de atendimento</p><p className="mt-1.5 font-bold text-[#0B1756]">{detalhe.unidade}</p></div></div><div className="rounded-xl border border-amber-200 bg-amber-50 p-4"><h3 className="flex items-center gap-2 font-bold text-amber-950"><Info size={18} /> Orientações de preparo</h3><p className="mt-2 text-sm leading-6 text-amber-900">{detalhe.preparo}</p></div>{detalhe.resultado && <div className="rounded-xl border border-blue-100 bg-blue-50 p-4"><h3 className="flex items-center gap-2 font-bold text-[#023E8A]"><FileCheck2 size={18} /> Resultado</h3><p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-700">{detalhe.resultado}</p></div>}{detalhe.observacao && <div className="rounded-xl border border-slate-200 p-4"><h3 className="font-bold text-[#0B1756]">Observação</h3><p className="mt-1 text-sm leading-6 text-slate-600">{detalhe.observacao}</p></div>}</div>}
      </Modal>}
    </main>
  );
}
