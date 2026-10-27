"use client";

import { useMemo, useState } from "react";

/* ------------------------------------------------------------------ */
/* DADOS INICIAIS (trocar por chamada à API quando o backend existir)  */
/* ------------------------------------------------------------------ */

const HOJE = "2026-10-27";

const visitasIniciais = [
  { id: 1, paciente: "Maria Silva", idade: 78, bairro: "Centro", endereco: "Rua das Flores, 120", telefone: "(11) 91234-5678", motivo: "Dificuldade de locomoção", tipo: "Acompanhamento domiciliar", profissional: "Carla Souza", data: "2026-10-27", horario: "09:00", prioridade: "Alta", status: "Aguardando avaliação", observacao: "", historico: ["Solicitação criada"] },
  { id: 2, paciente: "Roberto Lima", idade: 64, bairro: "Cerâmica", endereco: "Av. Goiás, 850", telefone: "(11) 98888-1122", motivo: "Avaliação de ferida", tipo: "Curativo", profissional: "Juliana Ribeiro", data: "2026-10-27", horario: "10:30", prioridade: "Média", status: "Agendada", observacao: "", historico: ["Solicitação criada", "Agendada"] },
  { id: 3, paciente: "Ana Pereira", idade: 32, bairro: "Nova Gerty", endereco: "Rua Itapura, 45", telefone: "(11) 97777-3344", motivo: "Acompanhamento de saúde", tipo: "Visita preventiva", profissional: "Fernanda Alves", data: "2026-10-27", horario: "14:00", prioridade: "Baixa", status: "Agendada", observacao: "", historico: ["Solicitação criada", "Agendada"] },
  { id: 4, paciente: "João Oliveira", idade: 71, bairro: "Cerâmica", endereco: "Rua Paraná, 300", telefone: "(11) 96666-5566", motivo: "Acompanhamento pós-alta", tipo: "Avaliação clínica", profissional: "Carlos Mendes", data: "2026-10-27", horario: "15:00", prioridade: "Alta", status: "Em atendimento", observacao: "Paciente com alta recente de internação.", historico: ["Solicitação criada", "Agendada", "Em atendimento"] },
  { id: 5, paciente: "Sueli Martins", idade: 82, bairro: "Olímpico", endereco: "Rua Bahia, 77", telefone: "(11) 95555-7788", motivo: "Acompanhamento de rotina", tipo: "Visita preventiva", profissional: "Carla Souza", data: "2026-10-28", horario: "08:00", prioridade: "Média", status: "Agendada", observacao: "", historico: ["Solicitação criada", "Agendada"] },
  { id: 6, paciente: "Paulo Santos", idade: 56, bairro: "Barcelona", endereco: "Rua Espanha, 410", telefone: "(11) 94444-9900", motivo: "Retorno após curativo", tipo: "Curativo", profissional: "Juliana Ribeiro", data: "2026-10-28", horario: "11:00", prioridade: "Média", status: "Concluída", observacao: "", historico: ["Solicitação criada", "Agendada", "Concluída"] },
];

const equipeInicial = [
  { id: 1, nome: "Carla Souza", cargo: "Agente Comunitária de Saúde", regiao: "Centro", status: "Em atendimento", limite: 5 },
  { id: 2, nome: "Juliana Ribeiro", cargo: "Enfermeira", regiao: "Cerâmica", status: "Em atendimento", limite: 4 },
  { id: 3, nome: "Rafael Martins", cargo: "Enfermeiro", regiao: "Barcelona", status: "Disponível", limite: 4 },
  { id: 4, nome: "Carlos Mendes", cargo: "Médico", regiao: "Centro", status: "Em atendimento", limite: 5 },
  { id: 5, nome: "Marcos Lima", cargo: "Médico", regiao: "Fundação", status: "Disponível", limite: 3 },
  { id: 6, nome: "Fernanda Alves", cargo: "Agente Comunitária de Saúde", regiao: "Nova Gerty", status: "Disponível", limite: 5 },
];

const STATUS_VISITA = ["Aguardando avaliação", "Agendada", "Em atendimento", "Concluída", "Cancelada"];
const STATUS_PROF = ["Disponível", "Em atendimento", "Afastado"];
const TIPOS = ["Visita preventiva", "Acompanhamento domiciliar", "Curativo", "Avaliação clínica"];
const PRIORIDADES = ["Alta", "Média", "Baixa"];
const ATIVAS = ["Agendada", "Em atendimento"];

/* ------------------------------------------------------------------ */
/* UTILITÁRIOS                                                         */
/* ------------------------------------------------------------------ */

function formatarData(data) {
  if (!data) return "Data não definida";
  const [ano, mes, dia] = data.split("-");
  return `${dia}/${mes}/${ano}`;
}

function rotuloDia(data) {
  if (data === HOJE) return "Hoje";
  const d = new Date(`${data}T12:00:00`);
  const hoje = new Date(`${HOJE}T12:00:00`);
  const diff = Math.round((d - hoje) / 86400000);
  if (diff === 1) return "Amanhã";
  return formatarData(data).slice(0, 5);
}

const iconPaths = {
  users: "M17 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2 M10 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z M21 21v-2a4 4 0 0 0-3-3.87 M16 3.13a4 4 0 0 1 0 7.75",
  clock: "M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z M12 6v6l4 2",
  pulse: "M22 12h-4l-3 9L9 3l-3 9H2",
  check: "M20 6 9 17l-5-5",
  calendar: "M8 2v4 M16 2v4 M3 10h18 M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z",
  plus: "M12 5v14 M5 12h14",
  download: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4 M7 10l5 5 5-5 M12 15V3",
  alert: "M12 9v4 M12 17h.01 M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z",
  home: "M3 10.5 12 3l9 7.5V21H3z M9 21v-7h6v7",
  list: "M8 6h13 M8 12h13 M8 18h13 M3 6h.01 M3 12h.01 M3 18h.01",
  x: "M18 6 6 18 M6 6l12 12",
  shield: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
  map: "M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z M12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6z",
};

function Icon({ name, className = "h-4 w-4" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      {iconPaths[name].split(" M").map((d, i) => (
        <path key={i} d={i === 0 ? d : `M${d}`} />
      ))}
    </svg>
  );
}

function Badge({ children, tipo = "neutro" }) {
  const estilos = {
    neutro: "bg-slate-100 text-slate-600",
    azul: "bg-[#EAF3F7] text-[#023E8A]",
    verde: "bg-emerald-50 text-emerald-700",
    amarelo: "bg-amber-50 text-amber-700",
    vermelho: "bg-rose-50 text-rose-700",
  };
  return (
    <span className={`inline-flex items-center whitespace-nowrap rounded-full px-2.5 py-0.5 text-[11px] font-medium ${estilos[tipo] || estilos.neutro}`}>
      {children}
    </span>
  );
}

const corPrioridade = (p) => (p === "Alta" ? "vermelho" : p === "Média" ? "amarelo" : "verde");
const corStatus = (s) =>
  s === "Concluída" ? "verde" : s === "Em atendimento" ? "azul" : s === "Cancelada" ? "neutro" : s === "Aguardando avaliação" ? "vermelho" : "amarelo";

const inputCls =
  "w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-sm outline-none transition focus:border-[#3563A7] focus:bg-white focus:ring-2 focus:ring-[#3563A7]/15";

function Campo({ label, children, className = "" }) {
  return (
    <div className={className}>
      <label className="mb-1 block text-xs font-medium text-slate-600">{label}</label>
      {children}
    </div>
  );
}

function CardSecao({ titulo, subtitulo, icone, acao, children }) {
  return (
    <section className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          {icone && (
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EAF3F7] text-[#023E8A]">
              <Icon name={icone} className="h-5 w-5" />
            </span>
          )}
          <div>
            <h3 className="text-sm font-bold text-[#0B1756]">{titulo}</h3>
            {subtitulo && <p className="text-xs text-slate-400">{subtitulo}</p>}
          </div>
        </div>
        {acao}
      </div>
      {children}
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* PÁGINA                                                              */
/* ------------------------------------------------------------------ */

export default function GestaoVisitasPage() {
  const [aba, setAba] = useState("geral");
  const [visitas, setVisitas] = useState(visitasIniciais);
  const [equipe, setEquipe] = useState(equipeInicial);

  const [buscaVisita, setBuscaVisita] = useState("");
  const [filtroStatus, setFiltroStatus] = useState("Todos");
  const [filtroPrioridade, setFiltroPrioridade] = useState("Todas");
  const [filtroData, setFiltroData] = useState("");

  const [buscaProfissional, setBuscaProfissional] = useState("");
  const [filtroCargo, setFiltroCargo] = useState("Todos");
  const [filtroAgendaProf, setFiltroAgendaProf] = useState("Todos");

  const [visitaId, setVisitaId] = useState(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [aviso, setAviso] = useState(null);

  const formVazio = {
    paciente: "", idade: "", bairro: "", endereco: "", telefone: "", motivo: "",
    tipo: "Visita preventiva", profissional: "Carla Souza", data: HOJE, horario: "09:00", prioridade: "Média",
  };
  const [novaVisita, setNovaVisita] = useState(formVazio);

  const visitaDetalhe = visitas.find((v) => v.id === visitaId) || null;

  /* ---------- derivados ---------- */
  const pendentes = visitas.filter((v) => v.status === "Aguardando avaliação");
  const agendadas = visitas.filter((v) => v.status === "Agendada");
  const emAndamento = visitas.filter((v) => v.status === "Em atendimento");
  const concluidas = visitas.filter((v) => v.status === "Concluída");
  const canceladas = visitas.filter((v) => v.status === "Cancelada");
  const altaPrioridade = visitas.filter((v) => v.prioridade === "Alta" && !["Concluída", "Cancelada"].includes(v.status));

  const cargaPorProf = useMemo(() => {
    const mapa = {};
    visitas.forEach((v) => {
      if (ATIVAS.includes(v.status)) mapa[v.profissional] = (mapa[v.profissional] || 0) + 1;
    });
    return mapa;
  }, [visitas]);

  const porBairro = useMemo(() => contar(visitas, "bairro"), [visitas]);
  const porTipo = useMemo(() => contar(visitas, "tipo"), [visitas]);

  const visitasFiltradas = useMemo(() => {
    const termo = buscaVisita.toLowerCase().trim();
    const ordem = { Alta: 0, Média: 1, Baixa: 2 };
    return visitas
      .filter((v) => {
        const busca = [v.paciente, v.bairro, v.motivo, v.profissional, v.tipo].some((c) => c.toLowerCase().includes(termo));
        return (
          busca &&
          (filtroStatus === "Todos" || v.status === filtroStatus) &&
          (filtroPrioridade === "Todas" || v.prioridade === filtroPrioridade) &&
          (!filtroData || v.data === filtroData)
        );
      })
      .sort((a, b) => {
        if (ordem[a.prioridade] !== ordem[b.prioridade]) return ordem[a.prioridade] - ordem[b.prioridade];
        return `${a.data} ${a.horario}`.localeCompare(`${b.data} ${b.horario}`);
      });
  }, [visitas, buscaVisita, filtroStatus, filtroPrioridade, filtroData]);

  const equipeFiltrada = useMemo(() => {
    const termo = buscaProfissional.toLowerCase().trim();
    return equipe.filter(
      (p) =>
        [p.nome, p.cargo, p.regiao].some((c) => c.toLowerCase().includes(termo)) &&
        (filtroCargo === "Todos" || p.cargo === filtroCargo)
    );
  }, [equipe, buscaProfissional, filtroCargo]);

  const agenda = useMemo(() => {
    const grupos = {};
    visitas
      .filter((v) => !["Cancelada"].includes(v.status))
      .filter((v) => filtroAgendaProf === "Todos" || v.profissional === filtroAgendaProf)
      .forEach((v) => {
        (grupos[v.data] = grupos[v.data] || []).push(v);
      });
    return Object.keys(grupos)
      .sort()
      .map((data) => ({ data, itens: grupos[data].sort((a, b) => a.horario.localeCompare(b.horario)) }));
  }, [visitas, filtroAgendaProf]);

  /* ---------- ações ---------- */
  function mostrarAviso(texto, tipo = "ok") {
    setAviso({ texto, tipo });
    setTimeout(() => setAviso(null), 3500);
  }

  function conflito(id, profissional, data, horario) {
    return visitas.find(
      (v) => v.id !== id && v.profissional === profissional && v.data === data && v.horario === horario && ATIVAS.includes(v.status)
    );
  }

  function atualizarVisita(id, patch, log) {
    const atual = visitas.find((v) => v.id === id);
    if (!atual) return false;
    const prof = patch.profissional ?? atual.profissional;
    const data = patch.data ?? atual.data;
    const horario = patch.horario ?? atual.horario;
    const statusFinal = patch.status ?? atual.status;

    if (ATIVAS.includes(statusFinal) && conflito(id, prof, data, horario)) {
      mostrarAviso(`${prof} já tem uma visita em ${formatarData(data)} às ${horario}.`, "erro");
      return false;
    }
    setVisitas((atuais) =>
      atuais.map((v) =>
        v.id === id ? { ...v, ...patch, historico: log ? [...v.historico, log] : v.historico } : v
      )
    );
    return true;
  }

  function mudarStatus(id, status) {
    if (atualizarVisita(id, { status }, status)) mostrarAviso(`Status alterado para "${status}".`);
  }

  function aprovarVisita(v) {
    if (atualizarVisita(v.id, { status: "Agendada" }, "Solicitação aprovada e agendada")) {
      mostrarAviso(`Visita de ${v.paciente} agendada.`);
    }
  }

  function cadastrarVisita(e) {
    e.preventDefault();
    if (conflito(null, novaVisita.profissional, novaVisita.data, novaVisita.horario)) {
      mostrarAviso(`${novaVisita.profissional} já tem uma visita nesse horário.`, "erro");
      return;
    }
    const registro = {
      ...novaVisita,
      id: Math.max(0, ...visitas.map((v) => v.id)) + 1,
      idade: Number(novaVisita.idade),
      status: "Agendada",
      observacao: "",
      historico: ["Solicitação criada pelo administrador", "Agendada"],
    };
    setVisitas((a) => [registro, ...a]);
    setNovaVisita(formVazio);
    setMostrarFormulario(false);
    mostrarAviso("Visita agendada com sucesso.");
  }

  function alterarStatusProf(id, status) {
    setEquipe((a) => a.map((p) => (p.id === id ? { ...p, status } : p)));
  }

  function alterarLimite(id, delta) {
    setEquipe((a) => a.map((p) => (p.id === id ? { ...p, limite: Math.max(1, p.limite + delta) } : p)));
  }

  function exportarCSV() {
    const cab = ["Paciente", "Idade", "Bairro", "Endereço", "Telefone", "Motivo", "Tipo", "Profissional", "Data", "Horário", "Prioridade", "Status"];
    const linhas = visitasFiltradas.map((v) =>
      [v.paciente, v.idade, v.bairro, v.endereco, v.telefone, v.motivo, v.tipo, v.profissional, formatarData(v.data), v.horario, v.prioridade, v.status]
        .map((c) => `"${String(c ?? "").replace(/"/g, '""')}"`)
        .join(";")
    );
    const blob = new Blob(["\uFEFF" + [cab.join(";"), ...linhas].join("\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "visitas-domiciliares.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  /* ---------- KPIs ---------- */
  const kpis = [
    { titulo: "Aguardando avaliação", valor: pendentes.length, desc: "Pendentes de triagem", icone: "clock", tag: "Ação" },
    { titulo: "Visitas agendadas", valor: agendadas.length, desc: "Programadas no sistema", icone: "calendar", tag: "Agenda" },
    { titulo: "Em atendimento", valor: emAndamento.length, desc: "Equipes em campo agora", icone: "pulse", tag: "Hoje" },
    { titulo: "Concluídas", valor: concluidas.length, desc: "Finalizadas no período", icone: "check", tag: "Período" },
  ];

  const abas = [
    { id: "geral", titulo: "Visão geral", sub: "Triagem e indicadores", icone: "home", badge: pendentes.length },
    { id: "visitas", titulo: "Todas as visitas", sub: "Busca e gerenciamento", icone: "list" },
    { id: "agenda", titulo: "Agenda", sub: "Visitas por dia", icone: "calendar" },
    { id: "equipe", titulo: "Equipe", sub: "Carga e disponibilidade", icone: "users" },
  ];

  /* ================================================================ */
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#EAF3F7] font-sans text-[#0B1756]">
      <div className="pointer-events-none absolute -left-24 top-[520px] h-96 w-96 rounded-full bg-blue-100/40 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 top-[760px] h-96 w-96 rounded-full bg-blue-100/50 blur-3xl" />

      <main className="relative z-10 mx-auto max-w-[1120px] space-y-6 px-4 py-8">
        {/* ---------------------------- HERO ---------------------------- */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#023E8A] via-[#0B3A85] to-[#0B1756] px-6 pb-16 pt-8 text-white shadow-lg sm:px-10 sm:pt-10">
          <div className="pointer-events-none absolute -right-16 -top-20 h-72 w-72 rounded-full border-[28px] border-white/5" />
          <div className="pointer-events-none absolute -bottom-24 right-40 h-64 w-64 rounded-full bg-white/5" />
          <div className="pointer-events-none absolute left-1/3 top-0 h-full w-px bg-gradient-to-b from-transparent via-white/10 to-transparent" />

          <div className="relative flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-xl">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-[11px] font-semibold backdrop-blur">
                <Icon name="shield" className="h-3.5 w-3.5" /> Área administrativa
              </span>
              <h1 className="mt-4 text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
                Visitas domiciliares,<br />do pedido ao atendimento.
              </h1>
              <p className="mt-3 text-sm leading-relaxed text-blue-100 sm:text-base">
                Avalie solicitações, distribua as visitas entre as equipes e acompanhe cada atendimento em campo.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setMostrarFormulario(true);
                    setAba("geral");
                    setTimeout(() => document.getElementById("form-visita")?.scrollIntoView({ behavior: "smooth", block: "center" }), 50);
                  }}
                  className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-[#023E8A] shadow-sm transition hover:bg-[#EAF3F7]"
                >
                  <Icon name="plus" /> Nova solicitação
                </button>
                <button
                  type="button"
                  onClick={exportarCSV}
                  className="inline-flex items-center gap-2 rounded-xl border border-white/25 bg-white/10 px-5 py-2.5 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/20"
                >
                  <Icon name="download" /> Exportar CSV
                </button>
              </div>
            </div>

            {/* Destaques do dia dentro do hero */}
            <div className="grid grid-cols-2 gap-3 sm:w-[360px]">
              <div className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur">
                <p className="text-[11px] text-blue-100">Visitas hoje</p>
                <p className="mt-1 text-3xl font-bold">{visitas.filter((v) => v.data === HOJE && v.status !== "Cancelada").length}</p>
                <p className="text-[11px] text-blue-200">{formatarData(HOJE)}</p>
              </div>
              <div className={`rounded-2xl border p-4 backdrop-blur ${altaPrioridade.length ? "border-rose-300/40 bg-rose-400/15" : "border-white/15 bg-white/10"}`}>
                <p className="text-[11px] text-blue-100">Prioridade alta</p>
                <p className="mt-1 text-3xl font-bold">{altaPrioridade.length}</p>
                <p className="text-[11px] text-blue-200">em aberto</p>
              </div>
            </div>
          </div>
        </section>

        {/* ------------- ABAS COMO CARDS (sobrepõem o hero) ------------- */}
        <nav className="-mt-14 grid grid-cols-2 gap-3 px-3 sm:px-6 lg:grid-cols-4" aria-label="Seções">
          {abas.map((a) => {
            const ativa = aba === a.id;
            return (
              <button
                key={a.id}
                type="button"
                onClick={() => setAba(a.id)}
                className={`relative flex items-center gap-3 rounded-2xl border p-3.5 text-left shadow-md transition ${
                  ativa ? "border-[#023E8A] bg-white ring-2 ring-[#023E8A]/10" : "border-slate-100 bg-white hover:border-[#3563A7]/40"
                }`}
              >
                <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${ativa ? "bg-[#023E8A] text-white" : "bg-[#EAF3F7] text-[#023E8A]"}`}>
                  <Icon name={a.icone} />
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-sm font-bold text-[#0B1756]">{a.titulo}</span>
                  <span className="block truncate text-[11px] text-slate-400">{a.sub}</span>
                </span>
                {a.badge > 0 && (
                  <span className="absolute right-3 top-3 flex h-5 min-w-5 items-center justify-center rounded-full bg-rose-500 px-1.5 text-[10px] font-bold text-white">
                    {a.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* ----------------------- INDICADORES ----------------------- */}
        <div>
          <h2 className="text-xl font-bold tracking-tight text-[#0B1756]">Indicadores de visitas</h2>
          <p className="text-sm text-[#3563A7]">Os números essenciais para acompanhar as equipes em campo.</p>
        </div>

        <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {kpis.map((k) => (
            <div key={k.titulo} className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EAF3F7] text-[#023E8A]">
                  <Icon name={k.icone} className="h-5 w-5" />
                </span>
                <span className="rounded-full bg-[#EAF3F7] px-2 py-0.5 text-[10px] font-semibold text-[#3563A7]">{k.tag}</span>
              </div>
              <p className="mt-3 text-xs font-medium text-slate-500">{k.titulo}</p>
              <p className="mt-1 text-3xl font-bold tracking-tight text-[#0B1756]">{k.valor}</p>
              <p className="mt-1 text-[11px] text-slate-400">{k.desc}</p>
            </div>
          ))}
        </section>

        {/* --------------------- FORMULÁRIO NOVA --------------------- */}
        {mostrarFormulario && (
          <section id="form-visita" className="space-y-5 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EAF3F7] text-[#023E8A]">
                  <Icon name="plus" className="h-5 w-5" />
                </span>
                <div>
                  <h2 className="text-base font-bold text-[#0B1756]">Nova solicitação de visita</h2>
                  <p className="text-xs text-slate-400">Preencha os dados do paciente e escolha quem fará o atendimento.</p>
                </div>
              </div>
              <button type="button" onClick={() => setMostrarFormulario(false)} className="text-slate-400 hover:text-slate-600" aria-label="Fechar">
                <Icon name="x" />
              </button>
            </div>

            <form onSubmit={cadastrarVisita} className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <Campo label="Nome do paciente">
                <input required value={novaVisita.paciente} onChange={(e) => setNovaVisita({ ...novaVisita, paciente: e.target.value })} placeholder="Nome completo" className={inputCls} />
              </Campo>
              <Campo label="Idade">
                <input required type="number" min="0" value={novaVisita.idade} onChange={(e) => setNovaVisita({ ...novaVisita, idade: e.target.value })} placeholder="Ex: 65" className={inputCls} />
              </Campo>
              <Campo label="Telefone">
                <input value={novaVisita.telefone} onChange={(e) => setNovaVisita({ ...novaVisita, telefone: e.target.value })} placeholder="(11) 90000-0000" className={inputCls} />
              </Campo>
              <Campo label="Bairro">
                <input required value={novaVisita.bairro} onChange={(e) => setNovaVisita({ ...novaVisita, bairro: e.target.value })} placeholder="Bairro do paciente" className={inputCls} />
              </Campo>
              <Campo label="Endereço" className="sm:col-span-2">
                <input value={novaVisita.endereco} onChange={(e) => setNovaVisita({ ...novaVisita, endereco: e.target.value })} placeholder="Rua, número, complemento" className={inputCls} />
              </Campo>
              <Campo label="Motivo da visita" className="sm:col-span-3">
                <input required value={novaVisita.motivo} onChange={(e) => setNovaVisita({ ...novaVisita, motivo: e.target.value })} placeholder="Descreva a necessidade" className={inputCls} />
              </Campo>
              <Campo label="Tipo de atendimento">
                <select value={novaVisita.tipo} onChange={(e) => setNovaVisita({ ...novaVisita, tipo: e.target.value })} className={inputCls}>
                  {TIPOS.map((t) => <option key={t}>{t}</option>)}
                </select>
              </Campo>
              <Campo label="Prioridade">
                <select value={novaVisita.prioridade} onChange={(e) => setNovaVisita({ ...novaVisita, prioridade: e.target.value })} className={inputCls}>
                  {PRIORIDADES.slice().reverse().map((p) => <option key={p}>{p}</option>)}
                </select>
              </Campo>
              <Campo label="Profissional responsável">
                <select value={novaVisita.profissional} onChange={(e) => setNovaVisita({ ...novaVisita, profissional: e.target.value })} className={inputCls}>
                  {equipe.filter((p) => p.status !== "Afastado").map((p) => (
                    <option key={p.id} value={p.nome}>{p.nome} — {p.cargo}</option>
                  ))}
                </select>
              </Campo>
              <Campo label="Data">
                <input required type="date" value={novaVisita.data} onChange={(e) => setNovaVisita({ ...novaVisita, data: e.target.value })} className={inputCls} />
              </Campo>
              <Campo label="Horário">
                <input required type="time" value={novaVisita.horario} onChange={(e) => setNovaVisita({ ...novaVisita, horario: e.target.value })} className={inputCls} />
              </Campo>

              <div className="flex items-end justify-end gap-2 sm:col-span-1">
                <button type="button" onClick={() => setMostrarFormulario(false)} className="rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-50">
                  Cancelar
                </button>
                <button type="submit" className="rounded-xl bg-[#023E8A] px-5 py-2.5 text-xs font-semibold text-white hover:bg-[#0B1756]">
                  Confirmar e agendar
                </button>
              </div>
            </form>
          </section>
        )}

        {/* ======================= VISÃO GERAL ======================= */}
        {aba === "geral" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
              <div className="lg:col-span-3">
                <CardSecao
                  titulo="Aguardando avaliação"
                  subtitulo="Aprove, ajuste ou recuse as solicitações pendentes"
                  icone="clock"
                  acao={<Badge tipo={pendentes.length ? "vermelho" : "verde"}>{pendentes.length} pendente(s)</Badge>}
                >
                  <div className="divide-y divide-slate-100">
                    {pendentes.map((v) => (
                      <div key={v.id} className="flex flex-col gap-3 py-3 sm:flex-row sm:items-center sm:justify-between">
                        <div className="text-xs">
                          <p className="text-sm font-bold text-[#0B1756]">
                            {v.paciente} <span className="font-normal text-slate-400">• {v.idade} anos</span>
                          </p>
                          <p className="mt-0.5 text-slate-500">{v.motivo} — {v.bairro}</p>
                          <div className="mt-1.5 flex flex-wrap gap-1.5">
                            <Badge tipo={corPrioridade(v.prioridade)}>Prioridade {v.prioridade.toLowerCase()}</Badge>
                            <Badge tipo="azul">{v.profissional}</Badge>
                            <Badge>{formatarData(v.data)} às {v.horario}</Badge>
                          </div>
                        </div>
                        <div className="flex shrink-0 gap-2">
                          <button onClick={() => aprovarVisita(v)} className="rounded-lg bg-[#023E8A] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#0B1756]">Aprovar</button>
                          <button onClick={() => setVisitaId(v.id)} className="rounded-lg bg-[#EAF3F7] px-3 py-1.5 text-xs font-semibold text-[#023E8A] hover:bg-[#3563A7] hover:text-white">Ajustar</button>
                          <button onClick={() => mudarStatus(v.id, "Cancelada")} className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-500 hover:bg-slate-50">Recusar</button>
                        </div>
                      </div>
                    ))}
                    {pendentes.length === 0 && <p className="py-6 text-center text-xs text-slate-400">Nenhuma solicitação aguardando. Novos pedidos aparecem aqui.</p>}
                  </div>
                </CardSecao>
              </div>

              <div className="lg:col-span-2">
                <CardSecao titulo="Próximas visitas" subtitulo="Agendadas, em ordem de data" icone="calendar">
                  <div className="divide-y divide-slate-100">
                    {agendadas
                      .slice()
                      .sort((a, b) => `${a.data} ${a.horario}`.localeCompare(`${b.data} ${b.horario}`))
                      .slice(0, 4)
                      .map((v) => (
                        <button key={v.id} onClick={() => setVisitaId(v.id)} className="flex w-full items-center justify-between py-2.5 text-left text-xs hover:opacity-80">
                          <div>
                            <p className="font-bold text-[#0B1756]">{v.paciente}</p>
                            <p className="text-slate-500">{v.profissional} • {v.bairro}</p>
                          </div>
                          <span className="rounded-md bg-[#EAF3F7] px-2.5 py-1 text-center font-semibold text-[#023E8A]">
                            {rotuloDia(v.data)}<span className="block text-[10px] font-medium">{v.horario}</span>
                          </span>
                        </button>
                      ))}
                    {agendadas.length === 0 && <p className="py-6 text-center text-xs text-slate-400">Nenhuma visita agendada.</p>}
                  </div>
                </CardSecao>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <CardSecao titulo="Visitas por bairro" subtitulo="Onde há mais demanda" icone="map">
                <Barras dados={porBairro} />
              </CardSecao>
              <CardSecao titulo="Visitas por tipo" subtitulo="Distribuição dos atendimentos" icone="list">
                <Barras dados={porTipo} />
              </CardSecao>
              <CardSecao titulo="Situação geral" subtitulo="Todas as visitas registradas" icone="pulse">
                <div className="space-y-2 text-xs">
                  {[
                    ["Aguardando avaliação", pendentes.length, "vermelho"],
                    ["Agendadas", agendadas.length, "amarelo"],
                    ["Em atendimento", emAndamento.length, "azul"],
                    ["Concluídas", concluidas.length, "verde"],
                    ["Canceladas", canceladas.length, "neutro"],
                  ].map(([nome, qtd, cor]) => (
                    <div key={nome} className="flex items-center justify-between">
                      <Badge tipo={cor}>{nome}</Badge>
                      <span className="font-bold text-[#0B1756]">{qtd}</span>
                    </div>
                  ))}
                </div>
              </CardSecao>
            </div>
          </div>
        )}

        {/* ===================== TODAS AS VISITAS ===================== */}
        {aba === "visitas" && (
          <section className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
            <div className="grid grid-cols-1 gap-3 border-b border-slate-100 bg-slate-50/50 p-4 sm:grid-cols-5">
              <input value={buscaVisita} onChange={(e) => setBuscaVisita(e.target.value)} placeholder="Buscar paciente, bairro, profissional..." className="rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm outline-none focus:border-[#3563A7] sm:col-span-2" />
              <select value={filtroStatus} onChange={(e) => setFiltroStatus(e.target.value)} className="rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm outline-none focus:border-[#3563A7]">
                <option value="Todos">Todos os status</option>
                {STATUS_VISITA.map((s) => <option key={s}>{s}</option>)}
              </select>
              <select value={filtroPrioridade} onChange={(e) => setFiltroPrioridade(e.target.value)} className="rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm outline-none focus:border-[#3563A7]">
                <option value="Todas">Todas as prioridades</option>
                {PRIORIDADES.map((p) => <option key={p}>{p}</option>)}
              </select>
              <input type="date" value={filtroData} onChange={(e) => setFiltroData(e.target.value)} className="rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm outline-none focus:border-[#3563A7]" />
            </div>

            <div className="flex items-center justify-between px-5 py-3 text-xs text-slate-500">
              <span>{visitasFiltradas.length} visita(s) encontrada(s)</span>
              {(buscaVisita || filtroStatus !== "Todos" || filtroPrioridade !== "Todas" || filtroData) && (
                <button
                  onClick={() => { setBuscaVisita(""); setFiltroStatus("Todos"); setFiltroPrioridade("Todas"); setFiltroData(""); }}
                  className="font-semibold text-[#023E8A] hover:underline"
                >
                  Limpar filtros
                </button>
              )}
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-xs">
                <thead className="border-y border-slate-100 bg-slate-50/80 text-[10px] font-bold uppercase text-slate-500">
                  <tr>
                    <th className="px-5 py-3">Paciente</th>
                    <th className="px-4 py-3">Motivo / atendimento</th>
                    <th className="px-4 py-3">Bairro</th>
                    <th className="px-4 py-3">Profissional</th>
                    <th className="px-4 py-3">Data / horário</th>
                    <th className="px-4 py-3">Prioridade</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-5 py-3 text-right">Ação</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {visitasFiltradas.map((v) => (
                    <tr key={v.id} className="transition hover:bg-slate-50/60">
                      <td className="px-5 py-3.5 font-bold text-[#0B1756]">
                        {v.paciente}
                        <span className="block text-[11px] font-normal text-slate-400">{v.idade} anos</span>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="font-medium text-slate-800">{v.motivo}</span>
                        <span className="block text-[11px] text-slate-400">{v.tipo}</span>
                      </td>
                      <td className="px-4 py-3.5">{v.bairro}</td>
                      <td className="px-4 py-3.5 font-medium text-[#023E8A]">{v.profissional}</td>
                      <td className="whitespace-nowrap px-4 py-3.5 text-slate-500">{formatarData(v.data)} às {v.horario}</td>
                      <td className="px-4 py-3.5"><Badge tipo={corPrioridade(v.prioridade)}>{v.prioridade}</Badge></td>
                      <td className="px-4 py-3.5"><Badge tipo={corStatus(v.status)}>{v.status}</Badge></td>
                      <td className="px-5 py-3.5 text-right">
                        <button onClick={() => setVisitaId(v.id)} className="rounded-lg bg-[#EAF3F7] px-3 py-1.5 text-xs font-semibold text-[#023E8A] transition hover:bg-[#3563A7] hover:text-white">
                          Gerenciar
                        </button>
                      </td>
                    </tr>
                  ))}
                  {visitasFiltradas.length === 0 && (
                    <tr>
                      <td colSpan={8} className="py-10 text-center text-slate-400">Nenhuma visita com esses filtros. Ajuste a busca ou limpe os filtros.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* ========================== AGENDA ========================== */}
        {aba === "agenda" && (
          <div className="space-y-4">
            <div className="flex flex-col gap-3 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm font-semibold text-[#0B1756]">Agenda de visitas</p>
              <select value={filtroAgendaProf} onChange={(e) => setFiltroAgendaProf(e.target.value)} className="rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm outline-none focus:border-[#3563A7]">
                <option value="Todos">Todos os profissionais</option>
                {equipe.map((p) => <option key={p.id}>{p.nome}</option>)}
              </select>
            </div>

            {agenda.length === 0 && (
              <div className="rounded-2xl border border-dashed border-slate-200 bg-white/70 p-10 text-center text-sm text-slate-400">
                Nenhuma visita na agenda para este filtro.
              </div>
            )}

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {agenda.map((g) => (
                <CardSecao key={g.data} titulo={rotuloDia(g.data)} subtitulo={`${formatarData(g.data)} • ${g.itens.length} visita(s)`} icone="calendar">
                  <ol className="space-y-2">
                    {g.itens.map((v) => (
                      <li key={v.id}>
                        <button onClick={() => setVisitaId(v.id)} className="flex w-full items-center gap-3 rounded-xl border border-slate-100 p-2.5 text-left text-xs transition hover:border-[#3563A7]/40 hover:bg-slate-50">
                          <span className="w-12 shrink-0 rounded-lg bg-[#EAF3F7] py-1.5 text-center font-bold text-[#023E8A]">{v.horario}</span>
                          <span className="min-w-0 flex-1">
                            <span className="block truncate font-bold text-[#0B1756]">{v.paciente}</span>
                            <span className="block truncate text-slate-500">{v.profissional} • {v.bairro}</span>
                          </span>
                          <Badge tipo={corStatus(v.status)}>{v.status}</Badge>
                        </button>
                      </li>
                    ))}
                  </ol>
                </CardSecao>
              ))}
            </div>
          </div>
        )}

        {/* ========================== EQUIPE ========================== */}
        {aba === "equipe" && (
          <section className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
            <div className="flex flex-col justify-between gap-3 border-b border-slate-100 bg-slate-50/50 p-4 sm:flex-row sm:items-center">
              <input value={buscaProfissional} onChange={(e) => setBuscaProfissional(e.target.value)} placeholder="Filtrar por nome, cargo ou região..." className="rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm outline-none focus:border-[#3563A7] sm:w-80" />
              <select value={filtroCargo} onChange={(e) => setFiltroCargo(e.target.value)} className="rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm outline-none focus:border-[#3563A7]">
                <option value="Todos">Todos os cargos</option>
                {[...new Set(equipe.map((p) => p.cargo))].map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-xs">
                <thead className="border-b border-slate-100 bg-slate-50/80 text-[10px] font-bold uppercase text-slate-500">
                  <tr>
                    <th className="px-5 py-3">Profissional</th>
                    <th className="px-4 py-3">Cargo</th>
                    <th className="px-4 py-3">Região</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Carga atual</th>
                    <th className="px-5 py-3 text-right">Limite diário</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {equipeFiltrada.map((p) => {
                    const carga = cargaPorProf[p.nome] || 0;
                    const pct = Math.min(100, Math.round((carga / p.limite) * 100));
                    const cheio = carga >= p.limite;
                    return (
                      <tr key={p.id} className="transition hover:bg-slate-50/60">
                        <td className="px-5 py-3.5 font-bold text-[#0B1756]">{p.nome}</td>
                        <td className="px-4 py-3.5 text-slate-500">{p.cargo}</td>
                        <td className="px-4 py-3.5">{p.regiao}</td>
                        <td className="px-4 py-3.5">
                          <select
                            value={p.status}
                            onChange={(e) => alterarStatusProf(p.id, e.target.value)}
                            className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs outline-none focus:border-[#3563A7]"
                            aria-label={`Status de ${p.nome}`}
                          >
                            {STATUS_PROF.map((s) => <option key={s}>{s}</option>)}
                          </select>
                        </td>
                        <td className="min-w-[180px] px-4 py-3.5">
                          <div className="flex items-center justify-between text-[11px]">
                            <span className="font-medium text-[#0B1756]">{carga} de {p.limite} visitas</span>
                            {cheio && <Badge tipo="vermelho">Lotado</Badge>}
                          </div>
                          <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-slate-100">
                            <div className={`h-full rounded-full ${cheio ? "bg-rose-400" : "bg-[#3563A7]"}`} style={{ width: `${pct}%` }} />
                          </div>
                        </td>
                        <td className="px-5 py-3.5 text-right">
                          <div className="inline-flex items-center gap-2">
                            <button onClick={() => alterarLimite(p.id, -1)} className="h-6 w-6 rounded-md bg-[#EAF3F7] font-bold text-[#023E8A] hover:bg-[#3563A7] hover:text-white" aria-label="Diminuir limite">−</button>
                            <span className="w-4 text-center font-bold">{p.limite}</span>
                            <button onClick={() => alterarLimite(p.id, 1)} className="h-6 w-6 rounded-md bg-[#EAF3F7] font-bold text-[#023E8A] hover:bg-[#3563A7] hover:text-white" aria-label="Aumentar limite">+</button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                  {equipeFiltrada.length === 0 && (
                    <tr><td colSpan={6} className="py-10 text-center text-slate-400">Nenhum profissional encontrado.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </main>

      {/* ======================= MODAL DE GERENCIAMENTO ======================= */}
      {visitaDetalhe && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0B1756]/40 p-4 backdrop-blur-sm" onClick={() => setVisitaId(null)}>
          <div className="max-h-[90vh] w-full max-w-lg space-y-4 overflow-y-auto rounded-2xl bg-white p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-[#0B1756]">{visitaDetalhe.paciente}</h3>
                <p className="text-xs text-slate-400">{visitaDetalhe.idade} anos • {visitaDetalhe.bairro}</p>
                <div className="mt-2 flex gap-1.5">
                  <Badge tipo={corStatus(visitaDetalhe.status)}>{visitaDetalhe.status}</Badge>
                  <Badge tipo={corPrioridade(visitaDetalhe.prioridade)}>Prioridade {visitaDetalhe.prioridade.toLowerCase()}</Badge>
                </div>
              </div>
              <button onClick={() => setVisitaId(null)} className="text-slate-400 hover:text-slate-600" aria-label="Fechar"><Icon name="x" /></button>
            </div>

            <div className="space-y-1 rounded-xl bg-slate-50 p-3 text-xs text-slate-600">
              <p><strong>Motivo:</strong> {visitaDetalhe.motivo}</p>
              <p><strong>Tipo:</strong> {visitaDetalhe.tipo}</p>
              {visitaDetalhe.endereco && <p><strong>Endereço:</strong> {visitaDetalhe.endereco}</p>}
              {visitaDetalhe.telefone && <p><strong>Telefone:</strong> {visitaDetalhe.telefone}</p>}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Campo label="Profissional" className="col-span-2">
                <select
                  value={visitaDetalhe.profissional}
                  onChange={(e) => atualizarVisita(visitaDetalhe.id, { profissional: e.target.value }, `Profissional alterado para ${e.target.value}`)}
                  className={inputCls}
                >
                  {equipe.map((p) => (
                    <option key={p.id} value={p.nome}>{p.nome} — {p.cargo}{p.status === "Afastado" ? " (afastado)" : ""}</option>
                  ))}
                </select>
              </Campo>
              <Campo label="Data">
                <input type="date" value={visitaDetalhe.data} onChange={(e) => e.target.value && atualizarVisita(visitaDetalhe.id, { data: e.target.value }, `Reagendada para ${formatarData(e.target.value)}`)} className={inputCls} />
              </Campo>
              <Campo label="Horário">
                <input type="time" value={visitaDetalhe.horario} onChange={(e) => e.target.value && atualizarVisita(visitaDetalhe.id, { horario: e.target.value }, `Horário alterado para ${e.target.value}`)} className={inputCls} />
              </Campo>
              <Campo label="Prioridade" className="col-span-2">
                <select value={visitaDetalhe.prioridade} onChange={(e) => atualizarVisita(visitaDetalhe.id, { prioridade: e.target.value }, `Prioridade alterada para ${e.target.value}`)} className={inputCls}>
                  {PRIORIDADES.map((p) => <option key={p}>{p}</option>)}
                </select>
              </Campo>
              <Campo label="Observações internas" className="col-span-2">
                <textarea
                  rows={2}
                  value={visitaDetalhe.observacao}
                  onChange={(e) => setVisitas((a) => a.map((v) => (v.id === visitaDetalhe.id ? { ...v, observacao: e.target.value } : v)))}
                  placeholder="Anotações visíveis apenas para a administração"
                  className={inputCls}
                />
              </Campo>
            </div>

            <div className="space-y-2 border-t border-slate-100 pt-3">
              <p className="text-xs font-semibold text-slate-500">Alterar status</p>
              <div className="flex flex-wrap gap-2">
                {STATUS_VISITA.map((s) => (
                  <button
                    key={s}
                    onClick={() => mudarStatus(visitaDetalhe.id, s)}
                    disabled={visitaDetalhe.status === s}
                    className={`rounded-lg px-3 py-1.5 text-xs font-medium transition disabled:cursor-default ${
                      visitaDetalhe.status === s ? "bg-[#023E8A] text-white" : s === "Cancelada" ? "bg-rose-50 text-rose-700 hover:bg-rose-100" : "bg-[#EAF3F7] text-[#023E8A] hover:bg-blue-100"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div className="border-t border-slate-100 pt-3">
              <p className="mb-2 text-xs font-semibold text-slate-500">Histórico</p>
              <ol className="space-y-1.5 border-l-2 border-[#EAF3F7] pl-3 text-xs text-slate-500">
                {visitaDetalhe.historico.map((h, i) => (
                  <li key={i} className="relative before:absolute before:-left-[17px] before:top-1.5 before:h-2 before:w-2 before:rounded-full before:bg-[#3563A7]">
                    {h}
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      )}

      {/* ============================== AVISO ============================== */}
      {aviso && (
        <div
          role="status"
          className={`fixed bottom-6 left-1/2 z-[60] flex -translate-x-1/2 items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium text-white shadow-lg ${
            aviso.tipo === "erro" ? "bg-rose-600" : "bg-[#023E8A]"
          }`}
        >
          <Icon name={aviso.tipo === "erro" ? "alert" : "check"} />
          {aviso.texto}
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* COMPONENTES AUXILIARES                                              */
/* ------------------------------------------------------------------ */

function contar(lista, campo) {
  const mapa = {};
  lista.forEach((v) => {
    mapa[v[campo]] = (mapa[v[campo]] || 0) + 1;
  });
  return Object.entries(mapa).sort((a, b) => b[1] - a[1]);
}

function Barras({ dados }) {
  const max = Math.max(1, ...dados.map(([, q]) => q));
  return (
    <div className="space-y-3">
      {dados.map(([nome, qtd]) => (
        <div key={nome}>
          <div className="flex justify-between text-xs">
            <span className="text-slate-600">{nome}</span>
            <span className="font-bold text-[#0B1756]">{qtd}</span>
          </div>
          <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-slate-100">
            <div className="h-full rounded-full bg-[#3563A7]" style={{ width: `${(qtd / max) * 100}%` }} />
          </div>
        </div>
      ))}
    </div>
  );
}