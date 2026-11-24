"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { api } from "../../../lib/api";
import {
  Activity,
  AlertTriangle,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock3,
  MapPin,
  Phone,
  RefreshCw,
  Search,
  UserRound,
  X,
} from "lucide-react";

const STATUS = {
  solicitado: "Solicitada",
  agendado: "Agendada",
  em_andamento: "Em atendimento",
  concluido: "Concluída",
  cancelado: "Cancelada",
};

const inputCls =
  "h-11 w-full rounded-xl border border-[#3563A7]/15 bg-white px-4 text-sm text-[#0B1756] outline-none transition placeholder:text-slate-400 hover:border-[#3563A7]/50 focus:border-[#3563A7] focus:ring-4 focus:ring-[#3563A7]/15";

function obterTipoDoToken(token) {
  try {
    const parte = token?.split(".")[1];
    if (!parte) return null;
    const base64 = parte.replace(/-/g, "+").replace(/_/g, "/");
    const preenchido = base64.padEnd(Math.ceil(base64.length / 4) * 4, "=");
    return JSON.parse(window.atob(preenchido)).tipo || null;
  } catch {
    return null;
  }
}

function extrairLista(resposta) {
  if (Array.isArray(resposta)) return resposta;
  if (Array.isArray(resposta?.atendimentos)) return resposta.atendimentos;
  if (Array.isArray(resposta?.dados)) return resposta.dados;
  if (Array.isArray(resposta?.data)) return resposta.data;
  if (Array.isArray(resposta?.results)) return resposta.results;
  return [];
}

function normalizarAtendimento(item = {}) {
  const dataAgendada = item.data_agendada || null;
  const dataBase = dataAgendada || item.data_solicitacao || null;
  const data = dataBase ? String(dataBase).slice(0, 10) : "";
  const horario =
    dataAgendada && String(dataAgendada).length >= 16
      ? String(dataAgendada).slice(11, 16)
      : "";

  return {
    id: item.id,
    paciente: item.paciente || item.nome_completo || "Paciente não identificado",
    telefone: item.telefone || "",
    unidade: item.unidade || "Unidade não identificada",
    motivo: item.motivo || "Motivo não informado",
    rua: item.rua || "",
    numero: item.numero || "",
    bairro: item.bairro || "",
    cep: item.cep || "",
    complemento: item.complemento || "",
    endereco: [item.rua, item.numero, item.complemento, item.bairro]
      .filter(Boolean)
      .join(", ") || "Endereço não informado",
    dataAgendada,
    data,
    horario,
    dataSolicitacao: item.data_solicitacao || null,
    dataConclusao: item.data_conclusao || null,
    observacoes: item.observacoes || "",
    statusApi: String(item.status || "agendado").toLowerCase(),
    status: STATUS[String(item.status || "agendado").toLowerCase()] || item.status,
  };
}

function dataHojeISO() {
  const hoje = new Date();
  return `${hoje.getFullYear()}-${String(hoje.getMonth() + 1).padStart(2, "0")}-${String(hoje.getDate()).padStart(2, "0")}`;
}

function formatarData(valor) {
  if (!valor) return "Não definida";
  const [ano, mes, dia] = String(valor).slice(0, 10).split("-");
  return ano && mes && dia ? `${dia}/${mes}/${ano}` : "Não definida";
}

function formatarDataHora(valor) {
  if (!valor) return "Não agendada";
  const texto = String(valor).replace("T", " ");
  const hora = texto.slice(11, 16);
  return `${formatarData(texto)}${hora ? ` às ${hora}` : ""}`;
}

function Badge({ status, children }) {
  const estilos = {
    solicitado: "border-[#3563A7]/25 bg-[#EAF3F7] text-[#023E8A]",
    agendado: "border-[#3563A7]/25 bg-[#3563A7]/15 text-[#023E8A]",
    em_andamento: "border-[#023E8A]/20 bg-[#023E8A] text-white",
    concluido: "border-[#0B1756]/15 bg-white text-[#0B1756]",
    cancelado: "border-slate-200 bg-slate-50 text-slate-500",
  };
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold ${estilos[status] || estilos.agendado}`}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {children}
    </span>
  );
}

function Card({ children, className = "" }) {
  return (
    <section className={`rounded-[24px] border border-[#DFEAF5] bg-white p-5 shadow-[0_5px_18px_rgba(20,55,100,0.04)] sm:p-6 ${className}`}>
      {children}
    </section>
  );
}

function FilterSelect({ value, onChange, options }) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  const selected = options.find(
    (option) => option.value === value
  );

  useEffect(() => {
    function fecharFora(event) {
      if (!containerRef.current?.contains(event.target)) {
        setOpen(false);
      }
    }

    function fecharEscape(event) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("pointerdown", fecharFora);
    document.addEventListener("keydown", fecharEscape);

    return () => {
      document.removeEventListener("pointerdown", fecharFora);
      document.removeEventListener("keydown", fecharEscape);
    };
  }, []);

  return (
    <div ref={containerRef} className="relative w-full">
      <button
        type="button"
        aria-label="Filtrar por status"
        aria-expanded={open}
        onClick={() => setOpen((atual) => !atual)}
        className={`flex h-12 w-full items-center justify-between gap-3
          rounded-2xl border bg-white px-4 text-left text-sm
          font-normal text-[#0B1756] outline-none transition-all
          focus-visible:ring-4 focus-visible:ring-[#023E8A]/10 ${
            open
              ? "border-[#CBD6E8] ring-4 ring-[#023E8A]/5"
              : "border-[#DCE3ED] hover:border-[#023E8A]/30"
          }`}
      >
        <span className="min-w-0 flex-1 truncate">
          {selected?.label || "Todos os status"}
        </span>

        <ChevronDown
          size={15}
          className={`shrink-0 text-[#023E8A] transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && (
        <div className="absolute left-0 right-0 top-full z-50 mt-2
          space-y-1 rounded-[18px] border border-[#DCE3ED]
          bg-white p-1.5
          shadow-[0_12px_28px_rgba(11,23,86,0.14)]"
        >
          {options.map((option) => {
            const active = option.value === value;

            return (
              <button
                key={option.value}
                type="button"
                aria-pressed={active}
                onClick={() => {
                  onChange(option.value);
                  setOpen(false);
                }}
                className={`flex min-h-10 w-full items-center
                  justify-between gap-3 rounded-xl px-3.5
                  py-2.5 text-left text-sm transition-colors ${
                    active
                      ? "bg-[#023E8A] font-semibold text-white"
                      : "text-[#0B1756] hover:bg-[#F1F6FB]"
                  }`}
              >
                <span className="min-w-0 flex-1">
                  {option.label}
                </span>

                {active && (
                  <Check size={16} className="shrink-0" />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

function DateFilter({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  const [mes, setMes] = useState(() => {
    const hoje = new Date();
    return new Date(hoje.getFullYear(), hoje.getMonth(), 1);
  });

  useEffect(() => {
    function fecharFora(event) {
      if (!containerRef.current?.contains(event.target)) {
        setOpen(false);
      }
    }

    function fecharEscape(event) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("pointerdown", fecharFora);
    document.addEventListener("keydown", fecharEscape);

    return () => {
      document.removeEventListener("pointerdown", fecharFora);
      document.removeEventListener("keydown", fecharEscape);
    };
  }, []);

  const meses = [
    "Janeiro", "Fevereiro", "Março", "Abril",
    "Maio", "Junho", "Julho", "Agosto",
    "Setembro", "Outubro", "Novembro", "Dezembro",
  ];

  const diasSemana = [
    "Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb",
  ];

  const ano = mes.getFullYear();
  const mesAtual = mes.getMonth();

  const primeiroDia = new Date(ano, mesAtual, 1).getDay();
  const quantidadeDias = new Date(ano, mesAtual + 1, 0).getDate();

  const hojeISO = dataHojeISO();

  const dias = [
    ...Array(primeiroDia).fill(null),
    ...Array.from(
      { length: quantidadeDias },
      (_, index) => index + 1
    ),
  ];

  function mudarMes(direcao) {
    setMes((atual) =>
      new Date(
        atual.getFullYear(),
        atual.getMonth() + direcao,
        1
      )
    );
  }

  function selecionarData(data) {
    onChange(data);
    setOpen(false);
  }

  function abrirCalendario() {
    if (!open) {
      const referencia = value
        ? new Date(`${value}T00:00:00`)
        : new Date();

      setMes(
        new Date(
          referencia.getFullYear(),
          referencia.getMonth(),
          1
        )
      );
    }

    setOpen((atual) => !atual);
  }

  return (
    <div ref={containerRef} className="relative w-full">
      <button
        type="button"
        aria-label="Filtrar por data"
        aria-expanded={open}
        onClick={abrirCalendario}
        className={`flex h-12 w-full items-center
          justify-between gap-3 rounded-2xl border
          bg-white px-4 text-left text-sm text-[#0B1756]
          outline-none transition-all
          focus-visible:ring-4 focus-visible:ring-[#023E8A]/10 ${
            open
              ? "border-[#CBD6E8] ring-4 ring-[#023E8A]/5"
              : "border-[#DCE3ED] hover:border-[#023E8A]/30"
          }`}
      >
        <span>
          {value ? formatarData(value) : "Filtrar por data"}
        </span>

        <CalendarDays
          size={16}
          className="shrink-0 text-[#023E8A]"
        />
      </button>

      {open && (
        <div className="absolute left-0 top-full z-50 mt-2
          w-[300px] max-w-[calc(100vw-80px)] sm:left-auto sm:right-0
          rounded-[20px] border border-[#DCE3ED]
          bg-white p-4
          shadow-[0_16px_35px_rgba(11,23,86,0.16)]"
        >
          {/* Cabeçalho do calendário */}
          <div className="flex items-center justify-between
            gap-2 rounded-xl bg-[#023E8A]
            px-3 py-2.5 text-white"
          >
            <span className="text-sm font-bold">
              {meses[mesAtual]} {ano}
            </span>

            <div className="flex items-center gap-1">
              <button
                type="button"
                aria-label="Mês anterior"
                onClick={() => mudarMes(-1)}
                className="flex h-8 w-8 items-center
                  justify-center rounded-full bg-white/10
                  transition hover:bg-white/20"
              >
                <ChevronLeft size={16} />
              </button>

              <button
                type="button"
                aria-label="Próximo mês"
                onClick={() => mudarMes(1)}
                className="flex h-8 w-8 items-center
                  justify-center rounded-full bg-white/10
                  transition hover:bg-white/20"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>

          {/* Dias da semana */}
          <div className="mt-3 grid grid-cols-7 gap-1">
            {diasSemana.map((dia) => (
              <span
                key={dia}
                className="py-2 text-center text-xs
                  font-semibold text-[#023E8A]"
              >
                {dia}
              </span>
            ))}
          </div>

          {/* Dias do mês */}
          <div className="mt-1 grid grid-cols-7 gap-1">
            {dias.map((dia, index) => {
              if (!dia) {
                return <div key={`vazio-${index}`} />;
              }

              const data = `${ano}-${String(
                mesAtual + 1
              ).padStart(2, "0")}-${String(dia).padStart(
                2,
                "0"
              )}`;

              const selecionado = value === data;
              const ehHoje = hojeISO === data;

              return (
                <button
                  key={data}
                  type="button"
                  aria-label={formatarData(data)}
                  aria-pressed={selecionado}
                  onClick={() => selecionarData(data)}
                  className={`flex h-8 w-full items-center
                    justify-center rounded-lg border
                    text-xs font-medium transition-all ${
                      selecionado
                        ? "border-[#023E8A] bg-[#023E8A] text-white"
                        : ehHoje
                          ? "border-2 border-[#023E8A] bg-[#EAF3F7] text-[#023E8A]"
                          : "border-transparent text-[#0B1756] hover:bg-[#EAF3F7]"
                    }`}
                >
                  {dia}
                </button>
              );
            })}
          </div>

          {/* Rodapé do calendário */}
          <div className="mt-4 flex items-center
            justify-between border-t border-slate-200 pt-3"
          >
            <button
              type="button"
              onClick={() => selecionarData("")}
              className="text-xs font-semibold text-slate-500
                transition hover:text-[#023E8A]"
            >
              Limpar data
            </button>

            <button
              type="button"
              onClick={() => selecionarData(hojeISO)}
              className="rounded-lg border border-[#023E8A]
                px-3 py-2 text-xs font-semibold text-[#023E8A]
                transition hover:bg-[#EAF3F7]"
            >
              Hoje
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function MinhasVisitasPage() {
  const [visitas, setVisitas] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [atualizando, setAtualizando] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState("");
  const [acessoNegado, setAcessoNegado] = useState(false);
  const [aviso, setAviso] = useState(null);
  const [busca, setBusca] = useState("");
  const [filtroStatus, setFiltroStatus] = useState("todos");
  const [filtroData, setFiltroData] = useState("");
  const [visitaSelecionada, setVisitaSelecionada] = useState(null);
  const [observacoes, setObservacoes] = useState("");

  function mostrarAviso(texto, tipo = "sucesso") {
    setAviso({ texto, tipo });
    window.setTimeout(() => setAviso(null), 4000);
  }

  async function carregarVisitas(silencioso = false) {
    if (silencioso) setAtualizando(true);
    else setCarregando(true);
    setErro("");

    try {
      const resposta = await api("/api/atendimentos-domiciliares/enfermeiro/me");
      setVisitas(extrairLista(resposta).map(normalizarAtendimento));
    } catch (error) {
      setErro(error?.message || "Não foi possível carregar suas visitas.");
    } finally {
      setCarregando(false);
      setAtualizando(false);
    }
  }

  useEffect(() => {
    const token = window.localStorage.getItem("unesus_token");
    if (obterTipoDoToken(token) !== "enfermeiro") {
      setAcessoNegado(true);
      setCarregando(false);
      return;
    }
    carregarVisitas();
  }, []);

  const visitasAtivas = useMemo(
    () => visitas.filter((v) => ["agendado", "em_andamento"].includes(v.statusApi)),
    [visitas]
  );
  const visitasHoje = useMemo(
    () => visitasAtivas.filter((v) => v.data === dataHojeISO()),
    [visitasAtivas]
  );
  const visitasConcluidas = useMemo(
    () => visitas.filter((v) => v.statusApi === "concluido"),
    [visitas]
  );

  const visitasFiltradas = useMemo(() => {
    const termo = busca.trim().toLocaleLowerCase("pt-BR");
    return visitas.filter((visita) => {
      const correspondeBusca = [
        visita.paciente,
        visita.motivo,
        visita.bairro,
        visita.endereco,
        visita.unidade,
      ].some((valor) => String(valor || "").toLocaleLowerCase("pt-BR").includes(termo));
      const correspondeStatus = filtroStatus === "todos" || visita.statusApi === filtroStatus;
      const correspondeData = !filtroData || visita.data === filtroData;
      return correspondeBusca && correspondeStatus && correspondeData;
    }).sort((a, b) => {
      const ordem = { agendado: 0, em_andamento: 1, concluido: 2, cancelado: 3, solicitado: 4 };
      return (ordem[a.statusApi] ?? 9) - (ordem[b.statusApi] ?? 9) ||
        String(a.dataAgendada || "").localeCompare(String(b.dataAgendada || ""));
    });
  }, [visitas, busca, filtroStatus, filtroData]);

  function abrirDetalhes(visita) {
    setVisitaSelecionada(visita);
    setObservacoes(visita.observacoes || "");
  }

  async function atualizarStatus(novoStatus) {
    if (!visitaSelecionada) return;
    setSalvando(true);
    try {
      await api(`/api/atendimentos-domiciliares/enfermeiro/${visitaSelecionada.id}/status`, {
        method: "PATCH",
        body: JSON.stringify({
          status: novoStatus,
          observacoes: observacoes.trim() || null,
        }),
      });
      mostrarAviso(novoStatus === "concluido" ? "Visita concluída com sucesso." : "Visita iniciada.");
      setVisitaSelecionada(null);
      await carregarVisitas(true);
    } catch (error) {
      mostrarAviso(error?.message || "Não foi possível atualizar a visita.", "erro");
    } finally {
      setSalvando(false);
    }
  }

  if (acessoNegado) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F1F6FB] px-4 py-10 text-[#0B1756]">
        <section className="w-full max-w-lg rounded-3xl border border-[#DFEAF5] bg-white p-8 text-center shadow-sm">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-50 text-rose-600"><AlertTriangle size={26} /></span>
          <h1 className="mt-5 text-xl font-bold">Acesso restrito</h1>
          <p className="mt-2 text-sm leading-6 text-slate-500">Minhas Visitas está disponível somente para enfermeiros autenticados.</p>
        </section>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#F1F6FB] px-4 py-6 text-[#0B1756] sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute -left-40 top-64 h-96 w-96 rounded-full bg-[#D9EAF8]/70" />
      <div className="pointer-events-none absolute -right-48 top-24 h-[34rem] w-[34rem] rounded-full bg-[#D3E5F7]/70" />

      <div className="relative z-10 mx-auto max-w-[1480px] space-y-6">
        <section className="relative isolate overflow-hidden rounded-[30px] bg-gradient-to-br from-[#174693] via-[#234E96] to-[#151A67] px-6 py-8 text-white shadow-[0_20px_55px_rgba(2,62,138,0.16)] sm:px-9 lg:px-10">
          <div className="pointer-events-none absolute -right-16 -top-36 h-96 w-96 rounded-full border-[48px] border-white/[0.07]" />
          <div className="relative z-10 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-[760px]">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-semibold">
                <Activity size={15} /> Área da enfermagem · Minhas visitas
              </span>
              <h1 className="mt-4 text-3xl font-bold leading-tight tracking-tight sm:text-4xl">Minhas visitas domiciliares</h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-white/90 sm:text-base">
                Consulte os atendimentos atribuídos a você, acesse as informações do paciente e registre o andamento de cada visita.
              </p>
            </div>
          </div>
        </section>

        <section className="grid gap-3 sm:grid-cols-3">
          {[
            { titulo: "Visitas ativas", valor: visitasAtivas.length, legenda: "Agendadas ou em atendimento", Icone: CalendarDays },
            { titulo: "Visitas de hoje", valor: visitasHoje.length, legenda: "Atendimentos previstos para hoje", Icone: Clock3 },
            { titulo: "Concluídas", valor: visitasConcluidas.length, legenda: "Registros finalizados", Icone: CheckCircle2 },
          ].map(({ titulo, valor, legenda, Icone }) => (
            <Card key={titulo} className="flex items-center gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-[#023E8A]/20 bg-[#023E8A]/[0.08] text-[#023E8A] shadow-[inset_0_1px_0_rgba(255,255,255,0.6)] backdrop-blur-sm">
                <Icone size={26} strokeWidth={2} />
              </div>
              <div>
                <p className="text-xs font-semibold text-[#0B1756]">{titulo}</p>
                <p className="text-2xl font-extrabold leading-tight text-[#0B1756]">{String(valor).padStart(2, "0")}</p>
                <p className="text-[11px] text-slate-500">{legenda}</p>
              </div>
            </Card>
          ))}
        </section>

        <Card>
          <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h2 className="text-lg font-bold text-[#0B1756]">Atendimentos atribuídos a você</h2>
              <p className="mt-1 text-sm text-slate-500">A lista é carregada a partir do seu usuário autenticado.</p>
            </div>
            
            <div className="grid gap-3 sm:grid-cols-3 lg:min-w-[650px]">
              <div className="relative sm:col-span-1">
                <Search size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input value={busca} onChange={(e) => setBusca(e.target.value)} placeholder="Buscar paciente ou bairro..." className={`${inputCls} pl-10`} />
              </div>
              <select value={filtroStatus} onChange={(e) => setFiltroStatus(e.target.value)} className={inputCls}>
                <option value="todos">Todos os status</option>
                <option value="agendado">Agendadas</option>
                <option value="em_andamento">Em atendimento</option>
                <option value="concluido">Concluídas</option>
                <option value="cancelado">Canceladas</option>
              </select>
              <input type="date" value={filtroData} onChange={(e) => setFiltroData(e.target.value)} className={inputCls} aria-label="Filtrar por data" />
            </div>
          </div>

          {erro && (
            <div className="mb-4 flex items-start gap-3 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
              <AlertTriangle size={18} className="mt-0.5 shrink-0" />
              <div className="min-w-0 flex-1"><p className="font-semibold">Não foi possível carregar suas visitas</p><p className="mt-1">{erro}</p></div>
              <button type="button" onClick={() => carregarVisitas()} className="text-xs font-bold underline">Tentar novamente</button>
            </div>
          )}

          {carregando ? (
            <div className="py-16 text-center text-sm text-slate-500">Carregando suas visitas...</div>
          ) : visitasFiltradas.length ? (
            <div className="grid gap-3 lg:grid-cols-2">
              {visitasFiltradas.map((visita) => (
                <button key={visita.id} type="button" onClick={() => abrirDetalhes(visita)} className="rounded-2xl border border-[#DFEAF5] bg-[#FBFDFF] p-4 text-left transition hover:-translate-y-0.5 hover:border-[#9CB9DA] hover:shadow-md sm:p-5">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0"><p className="text-xs font-semibold text-slate-400">Atendimento #{visita.id}</p><h3 className="mt-1 truncate text-base font-bold text-[#0B1756]">{visita.paciente}</h3></div>
                    <Badge status={visita.statusApi}>{visita.status}</Badge>
                  </div>
                  <p className="mt-3 line-clamp-2 text-sm leading-5 text-slate-600">{visita.motivo}</p>
                  <div className="mt-4 grid gap-2 text-xs text-slate-500 sm:grid-cols-2">
                    <span className="inline-flex items-center gap-2"><CalendarDays size={14} className="text-[#3563A7]" />{formatarDataHora(visita.dataAgendada)}</span>
                    <span className="inline-flex items-center gap-2"><MapPin size={14} className="text-[#3563A7]" />{visita.bairro || "Bairro não informado"}</span>
                  </div>
                  <p className="mt-3 border-t border-[#EAF0F7] pt-3 text-xs font-semibold text-[#023E8A]">Ver informações da visita</p>
                </button>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-200 px-4 py-14 text-center">
              <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#EAF3F7] text-[#023E8A]"><CalendarDays size={22} /></span>
              <p className="mt-4 font-semibold text-slate-600">Nenhuma visita encontrada</p>
              <p className="mt-1 text-xs text-slate-400">As visitas aparecerão aqui quando o administrador atribuí-las ao seu cadastro.</p>
            </div>
          )}
        </Card>
      </div>

      {visitaSelecionada && (
        <div className="fixed inset-0 z-[80] flex items-end justify-center bg-[#081735]/55 p-0 backdrop-blur-sm sm:items-center sm:p-5" onMouseDown={(e) => e.target === e.currentTarget && !salvando && setVisitaSelecionada(null)}>
          <section className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-t-[28px] bg-white shadow-2xl sm:rounded-[28px]">
            <div className="sticky top-0 z-10 flex items-start justify-between gap-4 bg-gradient-to-r from-[#174693] to-[#151A67] px-5 py-5 text-white sm:px-7">
              <div><p className="text-xs font-semibold text-white/70">Atendimento domiciliar #{visitaSelecionada.id}</p><h2 className="mt-1 text-xl font-bold">{visitaSelecionada.paciente}</h2><p className="mt-1 text-sm text-white/75">{visitaSelecionada.telefone || "Telefone não informado"}</p></div>
              <button type="button" onClick={() => setVisitaSelecionada(null)} disabled={salvando} aria-label="Fechar detalhes" className="rounded-xl bg-white/10 p-2 text-white transition hover:bg-white/20 disabled:opacity-50"><X size={19} /></button>
            </div>
            <div className="space-y-5 p-5 sm:p-7">
              <div className="flex flex-wrap items-center justify-between gap-3"><Badge status={visitaSelecionada.statusApi}>{visitaSelecionada.status}</Badge><span className="text-xs text-slate-500">Solicitada em {formatarData(visitaSelecionada.dataSolicitacao)}</span></div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl bg-[#EAF3F7]/55 p-4"><p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Motivo da visita</p><p className="mt-2 text-sm leading-6 text-[#0B1756]">{visitaSelecionada.motivo}</p></div>
                <div className="rounded-2xl bg-[#EAF3F7]/55 p-4"><p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Endereço</p><p className="mt-2 text-sm leading-6 text-[#0B1756]">{visitaSelecionada.endereco}</p><p className="mt-1 text-xs text-slate-500">{visitaSelecionada.cep ? `CEP: ${visitaSelecionada.cep}` : "CEP não informado"}</p></div>
                <div className="rounded-2xl bg-[#EAF3F7]/55 p-4"><p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Unidade responsável</p><p className="mt-2 text-sm font-semibold text-[#0B1756]">{visitaSelecionada.unidade}</p></div>
                <div className="rounded-2xl bg-[#EAF3F7]/55 p-4"><p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Agendamento</p><p className="mt-2 text-sm font-semibold text-[#0B1756]">{formatarDataHora(visitaSelecionada.dataAgendada)}</p></div>
              </div>
              {visitaSelecionada.telefone && <a href={`tel:${visitaSelecionada.telefone}`} className="inline-flex items-center gap-2 rounded-xl border border-[#D8E5F2] px-4 py-2.5 text-sm font-semibold text-[#023E8A] hover:bg-[#EAF3F7]"><Phone size={16} /> Ligar para o paciente</a>}
              <div className="space-y-2"><label htmlFor="observacoes-visita-enfermeiro" className="block text-xs font-semibold text-slate-600">Observações do atendimento</label><textarea id="observacoes-visita-enfermeiro" rows={4} value={observacoes} onChange={(e) => setObservacoes(e.target.value)} disabled={["concluido", "cancelado"].includes(visitaSelecionada.statusApi)} placeholder="Registre informações relevantes da visita..." className={`${inputCls} h-auto min-h-28 py-3`} /><p className="text-xs text-slate-400">As observações serão salvas ao iniciar ou concluir a visita.</p></div>
              <div className="flex flex-col-reverse gap-2 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
                {visitaSelecionada.statusApi === "agendado" && <button type="button" onClick={() => atualizarStatus("em_andamento")} disabled={salvando} className="rounded-xl bg-[#023E8A] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#0B1756] disabled:opacity-50">{salvando ? "Salvando..." : "Iniciar visita"}</button>}
                {visitaSelecionada.statusApi === "em_andamento" && <button type="button" onClick={() => atualizarStatus("concluido")} disabled={salvando} className="rounded-xl bg-[#023E8A] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#0B1756] disabled:opacity-50">{salvando ? "Salvando..." : "Concluir visita"}</button>}
                {!["agendado", "em_andamento"].includes(visitaSelecionada.statusApi) && <p className="self-center text-xs text-slate-500">Esta visita não possui ações pendentes para o seu perfil.</p>}
              </div>
            </div>
          </section>
        </div>
      )}

      {aviso && <div role="status" className={`fixed bottom-5 left-1/2 z-[100] max-w-[calc(100vw-2rem)] -translate-x-1/2 rounded-xl px-5 py-3 text-sm font-semibold text-white shadow-xl ${aviso.tipo === "erro" ? "bg-rose-600" : "bg-[#17418E]"}`}>{aviso.texto}</div>}
    </main>
  );
}
