"use client";

import { useEffect, useMemo, useState } from "react";
import { api } from "../../../lib/api";
import {
  Activity,
  AlertTriangle,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Download,
  MapPin,
  RefreshCw,
  Search,
  Stethoscope,
  UserRound,
} from "lucide-react";

const ITENS_POR_PAGINA = 8;

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
  const dataSolicitacao = item.data_solicitacao || null;
  const dataReferencia = dataAgendada || dataSolicitacao;
  const data = dataReferencia ? String(dataReferencia).slice(0, 10) : "";
  const horario =
    dataAgendada && String(dataAgendada).length >= 16
      ? String(dataAgendada).slice(11, 16)
      : "";

  const endereco = [
    item.rua,
    item.numero,
    item.complemento,
    item.bairro,
  ]
    .filter(Boolean)
    .join(", ");

  const statusApi = String(item.status || "solicitado").toLowerCase();

  return {
    id: item.id,
    pacienteId: item.paciente_id,
    paciente: item.paciente || item.nome_completo || "Paciente não identificado",
    telefone: item.telefone || "",
    enfermeiroId: item.enfermeiro_id || null,
    enfermeiro: item.enfermeiro || "Não atribuído",
    motivo: item.motivo || "Motivo não informado",
    rua: item.rua || "",
    numero: item.numero || "",
    bairro: item.bairro || "",
    cep: item.cep || "",
    complemento: item.complemento || "",
    endereco: endereco || "Endereço não informado",
    unidadeId: item.unidade_id || null,
    unidade: item.unidade || "",
    dataSolicitacao,
    dataAgendada,
    dataConclusao: item.data_conclusao || null,
    data,
    horario,
    observacoes: item.observacoes || "",
    statusApi,
    status: STATUS[statusApi] || statusApi,
    raw: item,
  };
}

function dataAtualISO() {
  const agora = new Date();
  return `${agora.getFullYear()}-${String(agora.getMonth() + 1).padStart(
    2,
    "0"
  )}-${String(agora.getDate()).padStart(2, "0")}`;
}

function formatarData(data) {
  if (!data) return "Não agendada";
  const valor = String(data).slice(0, 10);
  const [ano, mes, dia] = valor.split("-");
  return ano && mes && dia ? `${dia}/${mes}/${ano}` : "Não agendada";
}

function formatarDataHora(data) {
  if (!data) return "Não definida";
  const valor = String(data).replace("T", " ");
  const [dia] = valor.split(" ");
  const hora = valor.slice(11, 16);
  return `${formatarData(dia)}${hora ? ` às ${hora}` : ""}`;
}

function Badge({ children, status }) {
  const estilos = {
    solicitado: "border border-[#3563A7]/25 bg-[#EAF3F7] text-[#023E8A]",
    agendado: "border border-[#3563A7]/25 bg-[#3563A7]/15 text-[#023E8A]",
    em_andamento: "border border-[#023E8A]/20 bg-[#023E8A] text-white",
    concluido: "border border-[#0B1756]/15 bg-white text-[#0B1756]",
    cancelado: "border border-slate-200 bg-slate-50 text-slate-500",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-[11px] font-semibold ${
        estilos[status] || "border border-slate-200 bg-slate-50 text-slate-500"
      }`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {children}
    </span>
  );
}

function Card({ children, className = "" }) {
  return (
    <section
      className={`rounded-[24px] border border-[#DFEAF5] bg-white p-5 shadow-[0_5px_18px_rgba(20,55,100,0.04)] sm:p-6 ${className}`}
    >
      {children}
    </section>
  );
}

function Icone({ tipo, className = "h-5 w-5" }) {
  const componentes = {
    calendar: CalendarDays,
    search: Search,
    pin: MapPin,
    clock: Clock3,
    refresh: RefreshCw,
    user: UserRound,
    check: CheckCircle2,
    alert: AlertTriangle,
  };
  const Componente = componentes[tipo] || CalendarDays;
  return <Componente className={className} aria-hidden="true" strokeWidth={1.8} />;
}

function Metrica({ titulo, numero, legenda, Icone: IconeMetrica, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex min-h-[112px] items-center gap-4 rounded-[24px] border border-[#DFEAF5] bg-white p-5 text-left shadow-[0_5px_18px_rgba(20,55,100,0.04)] transition hover:-translate-y-0.5 hover:shadow-lg"
    >
      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#EAF3F7] text-[#0B1756]">
        <IconeMetrica size={22} strokeWidth={1.8} />
      </span>
      <span className="min-w-0">
        <span className="block text-[12px] font-semibold text-[#0B1756]">{titulo}</span>
        <span className="block text-2xl font-extrabold leading-tight text-[#0B1756]">{String(numero).padStart(2, "0")}</span>
        <span className="block text-[11px] text-slate-500">{legenda}</span>
      </span>
    </button>
  );
}

export default function GestaoVisitasPage() {
  const [aba, setAba] = useState("geral");
  const [visitas, setVisitas] = useState([]);
  const [enfermeirosDisponiveis, setEnfermeirosDisponiveis] = useState([]);
  const [enfermeiroSelecionado, setEnfermeiroSelecionado] = useState("");
  const [carregando, setCarregando] = useState(true);
  const [atualizando, setAtualizando] = useState(false);
  const [erro, setErro] = useState("");
  const [acessoNegado, setAcessoNegado] = useState(false);
  const [aviso, setAviso] = useState(null);

  const [busca, setBusca] = useState("");
  const [filtroStatus, setFiltroStatus] = useState("todos");
  const [filtroData, setFiltroData] = useState("");
  const [pagina, setPagina] = useState(1);

  const [mesCalendario, setMesCalendario] = useState(() => {
    const hoje = new Date();
    return new Date(hoje.getFullYear(), hoje.getMonth(), 1);
  });
  const [diaSelecionado, setDiaSelecionado] = useState(dataAtualISO());

  const [visitaSelecionada, setVisitaSelecionada] = useState(null);
  const [carregandoDetalhe, setCarregandoDetalhe] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [dataAgendamento, setDataAgendamento] = useState("");
  const [horaAgendamento, setHoraAgendamento] = useState("09:00");

  function mostrarAviso(texto, tipo = "sucesso") {
    setAviso({ texto, tipo });
    window.setTimeout(() => setAviso(null), 4000);
  }

  async function carregarDados(modoSilencioso = false) {
    if (modoSilencioso) setAtualizando(true);
    else setCarregando(true);

    setErro("");

    try {
      const resposta = await api("/api/atendimentos-domiciliares/admin");
      const lista = extrairLista(resposta).map(normalizarAtendimento);
      setVisitas(lista);
    } catch (error) {
      setErro(
        error?.message ||
          "Não foi possível carregar os atendimentos domiciliares."
      );
    }

    setCarregando(false);
    setAtualizando(false);
  }

  useEffect(() => {
    const token = window.localStorage.getItem("unesus_token");
    if (obterTipoDoToken(token) !== "admin") {
      setAcessoNegado(true);
      setCarregando(false);
      return;
    }
    carregarDados();
  }, []);

  const visitasSolicitadas = useMemo(
    () => visitas.filter((v) => v.statusApi === "solicitado"),
    [visitas]
  );
  const visitasAgendadas = useMemo(
    () => visitas.filter((v) => v.statusApi === "agendado"),
    [visitas]
  );
  const visitasEmAndamento = useMemo(
    () => visitas.filter((v) => v.statusApi === "em_andamento"),
    [visitas]
  );
  const visitasConcluidas = useMemo(
    () => visitas.filter((v) => v.statusApi === "concluido"),
    [visitas]
  );

  const visitasFiltradas = useMemo(() => {
    const termo = busca.trim().toLocaleLowerCase("pt-BR");

    return visitas
      .filter((visita) => {
        const correspondeBusca = [
          visita.paciente,
          visita.motivo,
          visita.bairro,
          visita.enfermeiro,
          visita.unidade,
          visita.endereco,
        ].some((valor) =>
          String(valor || "").toLocaleLowerCase("pt-BR").includes(termo)
        );

        const correspondeStatus =
          filtroStatus === "todos" || visita.statusApi === filtroStatus;
        const correspondeData = !filtroData || visita.data === filtroData;

        return correspondeBusca && correspondeStatus && correspondeData;
      })
      .sort((a, b) => {
        const ordem = {
          solicitado: 0,
          agendado: 1,
          em_andamento: 2,
          concluido: 3,
          cancelado: 4,
        };
        return (
          ordem[a.statusApi] - ordem[b.statusApi] ||
          String(a.dataAgendada || a.dataSolicitacao || "").localeCompare(
            String(b.dataAgendada || b.dataSolicitacao || "")
          )
        );
      });
  }, [visitas, busca, filtroStatus, filtroData]);

  useEffect(() => {
    setPagina(1);
  }, [busca, filtroStatus, filtroData]);

  const totalPaginas = Math.max(
    1,
    Math.ceil(visitasFiltradas.length / ITENS_POR_PAGINA)
  );
  const visitasPaginadas = visitasFiltradas.slice(
    (pagina - 1) * ITENS_POR_PAGINA,
    pagina * ITENS_POR_PAGINA
  );

  const visitasDoDia = useMemo(
    () =>
      visitas
        .filter(
          (v) =>
            v.data === diaSelecionado &&
            ["agendado", "em_andamento"].includes(v.statusApi)
        )
        .sort((a, b) => a.horario.localeCompare(b.horario)),
    [visitas, diaSelecionado]
  );

  const diasCalendario = useMemo(() => {
    const ano = mesCalendario.getFullYear();
    const mes = mesCalendario.getMonth();
    const deslocamento = (new Date(ano, mes, 1).getDay() + 6) % 7;
    const quantidadeDias = new Date(ano, mes + 1, 0).getDate();
    const itens = [];

    for (let i = 0; i < deslocamento; i += 1) {
      itens.push({ chave: `vazio-${i}`, vazio: true });
    }

    for (let dia = 1; dia <= quantidadeDias; dia += 1) {
      const data = `${ano}-${String(mes + 1).padStart(2, "0")}-${String(
        dia
      ).padStart(2, "0")}`;
      const quantidade = visitas.filter(
        (v) =>
          v.data === data &&
          ["agendado", "em_andamento"].includes(v.statusApi)
      ).length;
      itens.push({ chave: data, data, dia, quantidade });
    }

    return itens;
  }, [mesCalendario, visitas]);

  const enfermeiros = useMemo(() => {
    const mapa = new Map();

    visitas.forEach((visita) => {
      if (visita.enfermeiroId) {
        mapa.set(String(visita.enfermeiroId), {
          id: visita.enfermeiroId,
          nome: visita.enfermeiro,
        });
      }
    });

    return Array.from(mapa.values()).sort((a, b) =>
      a.nome.localeCompare(b.nome, "pt-BR")
    );
  }, [visitas]);

  const equipeResumo = useMemo(
    () =>
      enfermeiros.map((enfermeiro) => ({
        ...enfermeiro,
        total: visitas.filter(
          (v) =>
            String(v.enfermeiroId) === String(enfermeiro.id) &&
            ["agendado", "em_andamento"].includes(v.statusApi)
        ).length,
        emAndamento: visitas.filter(
          (v) =>
            String(v.enfermeiroId) === String(enfermeiro.id) &&
            v.statusApi === "em_andamento"
        ).length,
      })),
    [enfermeiros, visitas]
  );

  async function abrirDetalhes(visita) {
    setVisitaSelecionada(visita);
    setDataAgendamento(visita.dataAgendada?.slice(0, 10) || "");
    setHoraAgendamento(visita.horario || "09:00");
    setEnfermeiroSelecionado(visita.enfermeiroId ? String(visita.enfermeiroId) : "");
    setEnfermeirosDisponiveis([]);
    setCarregandoDetalhe(true);

    const [detalheResultado, enfermeirosResultado] = await Promise.allSettled([
      api(`/api/atendimentos-domiciliares/admin/${visita.id}`),
      api("/api/atendimentos-domiciliares/admin/enfermeiros"),
    ]);

    if (detalheResultado.status === "fulfilled") {
      const resposta = detalheResultado.value;
      const registro = resposta?.atendimento || resposta?.dados || resposta;
      const detalhe = normalizarAtendimento(registro);
      setVisitaSelecionada(detalhe);
      setDataAgendamento(detalhe.dataAgendada?.slice(0, 10) || "");
      setHoraAgendamento(detalhe.horario || "09:00");
      setEnfermeiroSelecionado(detalhe.enfermeiroId ? String(detalhe.enfermeiroId) : "");
      setVisitas((atuais) =>
        atuais.map((item) => (item.id === detalhe.id ? detalhe : item))
      );
    } else {
      mostrarAviso(
        detalheResultado.reason?.message || "Não foi possível carregar os detalhes.",
        "erro"
      );
    }

    if (enfermeirosResultado.status === "fulfilled") {
      const resposta = enfermeirosResultado.value;
      const lista = Array.isArray(resposta?.enfermeiros)
        ? resposta.enfermeiros
        : extrairLista(resposta);
      setEnfermeirosDisponiveis(lista);

      setEnfermeiroSelecionado((atual) => {
        if (atual && lista.some((enfermeiro) => String(enfermeiro.id) === String(atual))) {
          return atual;
        }
        return lista[0]?.id ? String(lista[0].id) : "";
      });
    } else {
      setEnfermeirosDisponiveis([]);
      mostrarAviso(
        enfermeirosResultado.reason?.message ||
          "Não foi possível consultar os enfermeiros cadastrados.",
        "erro"
      );
    }

    setCarregandoDetalhe(false);
  }

  async function agendarVisita(evento) {
    evento.preventDefault();

    if (!visitaSelecionada) return;

    if (!enfermeiroSelecionado) {
      mostrarAviso(
        "Selecione um enfermeiro ativo para agendar a visita.",
        "erro"
      );
      return;
    }

    if (!dataAgendamento || !horaAgendamento) {
      mostrarAviso("Informe a data e o horário da visita.", "erro");
      return;
    }

    const dataHora = `${dataAgendamento}T${horaAgendamento}:00`;
    if (new Date(dataHora).getTime() <= Date.now()) {
      mostrarAviso("A visita precisa ser agendada para uma data futura.", "erro");
      return;
    }

    setSalvando(true);

    try {
      await api(
        `/api/atendimentos-domiciliares/admin/${visitaSelecionada.id}/agendar`,
        {
          method: "PATCH",
          body: JSON.stringify({
            enfermeiro_id: Number(enfermeiroSelecionado),
            data_agendada: dataHora,
          }),
        }
      );

      mostrarAviso(visitaSelecionada.statusApi === "solicitado" ? "Visita agendada com sucesso." : "Agendamento atualizado com sucesso.");
      setVisitaSelecionada(null);
      await carregarDados(true);
    } catch (error) {
      mostrarAviso(error.message || "Não foi possível agendar a visita.", "erro");
    } finally {
      setSalvando(false);
    }
  }

  async function atualizarStatus(novoStatus) {
    if (!visitaSelecionada) return;

    setSalvando(true);

    try {
      await api(
        `/api/atendimentos-domiciliares/admin/${visitaSelecionada.id}/status`,
        {
          method: "PATCH",
          body: JSON.stringify({
            status: novoStatus,
          }),
        }
      );

      mostrarAviso("Status do atendimento atualizado.");
      setVisitaSelecionada(null);
      await carregarDados(true);
    } catch (error) {
      mostrarAviso(
        error.message || "Não foi possível atualizar o atendimento.",
        "erro"
      );
    } finally {
      setSalvando(false);
    }
  }

  function exportarCSV() {
    const cabecalho = [
      "ID",
      "Paciente",
      "Telefone",
      "Unidade",
      "Motivo",
      "Bairro",
      "Endereço",
      "Enfermeiro responsável",
      "Data agendada",
      "Status",
      "Observações",
    ];

    const linhas = visitasFiltradas.map((v) =>
      [
        v.id,
        v.paciente,
        v.telefone,
        v.unidade,
        v.motivo,
        v.bairro,
        v.endereco,
        v.enfermeiro,
        formatarDataHora(v.dataAgendada),
        v.status,
        v.observacoes,
      ]
        .map((valor) => `"${String(valor ?? "").replace(/"/g, '""')}"`)
        .join(";")
    );

    const arquivo = new Blob(
      ["\uFEFF" + [cabecalho.join(";"), ...linhas].join("\n")],
      { type: "text/csv;charset=utf-8;" }
    );
    const url = URL.createObjectURL(arquivo);
    const link = document.createElement("a");
    link.href = url;
    link.download = "atendimentos-domiciliares.csv";
    link.click();
    URL.revokeObjectURL(url);
  }

  if (acessoNegado) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F1F6FB] px-4 py-10 text-[#0B1756]">
        <section className="w-full max-w-lg rounded-3xl border border-[#DFEAF5] bg-white p-8 text-center shadow-sm">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-50 text-rose-600">
            <AlertTriangle size={26} />
          </span>
          <h1 className="mt-5 text-xl font-bold">Acesso restrito</h1>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            A Gestão de Visitas está disponível somente para administradores. Entre com uma conta administrativa para continuar.
          </p>
        </section>
      </main>
    );
  }

  const abas = [
    { id: "geral", titulo: "Visão geral" },
    { id: "visitas", titulo: "Todas as visitas" },
    { id: "agenda", titulo: "Agenda" },
    { id: "equipe", titulo: "Enfermeiros" },
  ];

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#F1F6FB] px-4 py-6 text-[#0B1756] sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute -left-40 top-64 h-96 w-96 rounded-full bg-[#D9EAF8]/70" />
      <div className="pointer-events-none absolute -right-48 top-24 h-[34rem] w-[34rem] rounded-full bg-[#D3E5F7]/70" />
      <div className="pointer-events-none absolute right-[12%] top-[1050px] h-56 w-56 rounded-full border-[42px] border-white/80" />

      <div className="relative z-10 mx-auto max-w-[1480px] space-y-6">
        <section className="relative isolate overflow-hidden rounded-[30px] bg-gradient-to-br from-[#174693] via-[#234E96] to-[#151A67] px-6 py-8 text-white shadow-[0_20px_55px_rgba(2,62,138,0.16)] sm:px-9 lg:px-10">
          <div className="pointer-events-none absolute -right-16 -top-36 h-96 w-96 rounded-full border-[48px] border-white/[0.07]" />
          <div className="pointer-events-none absolute right-[28%] top-10 h-52 w-52 rounded-full border-[30px] border-white/[0.05]" />
          <div className="pointer-events-none absolute -bottom-32 left-[38%] h-64 w-64 rounded-full bg-[#78A9E6]/10 blur-2xl" />

          <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-[730px]">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-semibold">
                <Stethoscope size={15} strokeWidth={1.8} /> Área administrativa · Gestão de visitas
              </span>
              <h1 className="mt-4 text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
                Gestão de visitas domiciliares
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-white/90 sm:text-base">
                Consulte solicitações de todas as unidades, organize os agendamentos e acompanhe o andamento dos atendimentos domiciliares.
              </p>
            </div>

            <div className="flex w-full shrink-0 flex-col gap-3 sm:flex-row lg:w-auto lg:flex-col xl:flex-row">
              <button
                type="button"
                onClick={() => carregarDados(true)}
                disabled={atualizando || carregando}
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <RefreshCw size={16} className={atualizando ? "animate-spin" : ""} />
                Atualizar dados
              </button>
              <button
                type="button"
                onClick={exportarCSV}
                disabled={!visitasFiltradas.length}
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-semibold text-[#0B1756] shadow-sm transition hover:bg-[#EAF3F7] disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Download size={16} />
                Exportar CSV
              </button>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <Metrica
            titulo="Aguardando agendamento"
            numero={visitasSolicitadas.length}
            legenda="Solicitações recebidas"
            Icone={Clock3}
            onClick={() => { setAba("visitas"); setFiltroStatus("solicitado"); }}
          />
          <Metrica
            titulo="Visitas agendadas"
            numero={visitasAgendadas.length}
            legenda="Atendimentos programados"
            Icone={CalendarDays}
            onClick={() => { setAba("visitas"); setFiltroStatus("agendado"); }}
          />
          <Metrica
            titulo="Em atendimento"
            numero={visitasEmAndamento.length}
            legenda="Visitas em andamento"
            Icone={Activity}
            onClick={() => { setAba("visitas"); setFiltroStatus("em_andamento"); }}
          />
          <Metrica
            titulo="Concluídas"
            numero={visitasConcluidas.length}
            legenda="Atendimentos finalizados"
            Icone={CheckCircle2}
            onClick={() => { setAba("visitas"); setFiltroStatus("concluido"); }}
          />
        </section>

        <nav
          aria-label="Seções de visitas domiciliares"
          className="flex gap-1 overflow-x-auto rounded-[24px] border border-[#DFEAF5] bg-white px-4 pt-2 shadow-[0_5px_18px_rgba(20,55,100,0.04)]"
        >
          {abas.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setAba(item.id)}
              aria-current={aba === item.id ? "page" : undefined}
              className={`-mb-px flex shrink-0 items-center border-b-[3px] px-3 pb-3 pt-2 text-xs font-bold transition sm:px-4 sm:text-sm ${
                aba === item.id
                  ? "border-[#0B1756] text-[#0B1756]"
                  : "border-transparent text-[#3563A7] hover:text-[#023E8A]"
              }`}
            >
              {item.titulo}
            </button>
          ))}
        </nav>

        {erro && (
          <div className="flex items-start gap-3 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-4 text-sm text-rose-700">
            <Icone tipo="alert" className="mt-0.5 h-5 w-5 shrink-0" />
            <div>
              <p className="font-semibold">Não foi possível carregar os atendimentos</p>
              <p className="mt-1">{erro}</p>
              <p className="mt-2 text-xs">
                Confira se a API está ativa e se você está conectado com uma conta de administrador.
              </p>
            </div>
          </div>
        )}

        {carregando ? (
          <Card className="py-16 text-center">
            <div className="mx-auto h-9 w-9 animate-spin rounded-full border-4 border-[#DCE8F8] border-t-[#023E8A]" />
            <p className="mt-4 text-sm font-semibold text-[#0B1756]">
              Carregando atendimentos domiciliares...
            </p>
          </Card>
        ) : (
          <>
            {aba === "geral" && (
              <div className="space-y-6">
                <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
                  <Card>
                    <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <h2 className="text-lg font-bold text-[#0B1756]">
                          Solicitações que aguardam agendamento
                        </h2>
                        <p className="mt-1 text-sm text-slate-500">
                          Solicitações recebidas em todas as unidades.
                        </p>
                      </div>
                      <Badge status="solicitado">{visitasSolicitadas.length} pendente(s)</Badge>
                    </div>

                    {visitasSolicitadas.length ? (
                      <div className="divide-y divide-slate-100">
                        {visitasSolicitadas.slice(0, 5).map((visita) => (
                          <div key={visita.id} className="flex flex-col justify-between gap-3 py-4 sm:flex-row sm:items-center">
                            <div className="min-w-0">
                              <p className="font-semibold text-[#0B1756]">{visita.paciente}</p>
                              <p className="mt-1 text-sm text-slate-600">{visita.motivo}</p>
                              <p className="mt-1 flex items-center gap-1 text-xs text-slate-400">
                                <Icone tipo="pin" className="h-3.5 w-3.5" />
                                {visita.bairro || "Bairro não informado"}
                              </p>
                            </div>
                            <button
                              type="button"
                              onClick={() => abrirDetalhes(visita)}
                              className="shrink-0 rounded-xl bg-[#023E8A] px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-[#0B1756]"
                            >
                              Analisar solicitação
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="rounded-2xl border border-dashed border-slate-200 px-4 py-10 text-center">
                        <p className="text-sm font-semibold text-slate-600">Nenhuma solicitação pendente</p>
                        <p className="mt-1 text-xs text-slate-400">As novas solicitações aparecerão aqui.</p>
                      </div>
                    )}
                  </Card>

                  <Card>
                    <div className="mb-5">
                      <h2 className="text-lg font-bold text-[#0B1756]">Resumo dos atendimentos</h2>
                      <p className="mt-1 text-sm text-slate-500">Distribuição por situação.</p>
                    </div>
                    <div className="space-y-4">
                      {[
                        ["Solicitadas", visitasSolicitadas.length, "bg-[#78A9E6]"],
                        ["Agendadas", visitasAgendadas.length, "bg-[#3563A7]"],
                        ["Em atendimento", visitasEmAndamento.length, "bg-[#023E8A]"],
                        ["Concluídas", visitasConcluidas.length, "bg-[#0B1756]"],
                      ].map(([nome, quantidade, cor]) => {
                        const total = Math.max(1, visitas.length);
                        return (
                          <div key={nome}>
                            <div className="mb-1.5 flex justify-between gap-3 text-sm">
                              <span className="font-medium text-slate-600">{nome}</span>
                              <strong className="text-[#0B1756]">{quantidade}</strong>
                            </div>
                            <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                              <div
                                className={`h-full rounded-full ${cor}`}
                                style={{ width: `${(quantidade / total) * 100}%` }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    <button
                      type="button"
                      onClick={() => setAba("visitas")}
                      className="mt-6 w-full rounded-xl border border-[#3563A7]/20 px-4 py-3 text-sm font-semibold text-[#023E8A] transition hover:bg-[#EAF3F7]"
                    >
                      Ver todos os atendimentos
                    </button>
                  </Card>
                </div>
              </div>
            )}

            {aba === "visitas" && (
              <Card className="overflow-hidden p-0">
                <div className="border-b border-[#EAF3F7] px-5 py-5 sm:px-6">
                  <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                    <div>
                      <h2 className="text-lg font-bold text-[#0B1756]">Todas as visitas domiciliares</h2>
                      <p className="mt-1 text-sm text-slate-500">
                        Consulte as solicitações e atualize o andamento dos atendimentos.
                      </p>
                    </div>
                    <Badge status="agendado">{visitas.length} registro(s)</Badge>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3 border-b border-[#EAF3F7] bg-[#EAF3F7]/30 p-4 sm:grid-cols-2 lg:grid-cols-[1fr_230px_220px]">
                  <div className="relative">
                    <Icone tipo="search" className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      value={busca}
                      onChange={(e) => setBusca(e.target.value)}
                      placeholder="Buscar paciente, unidade, motivo, enfermeiro ou bairro..."
                      className={`${inputCls} pl-11`}
                    />
                  </div>
                  <select
                    value={filtroStatus}
                    onChange={(e) => setFiltroStatus(e.target.value)}
                    className={inputCls}
                  >
                    <option value="todos">Todas as situações</option>
                    <option value="solicitado">Solicitadas</option>
                    <option value="agendado">Agendadas</option>
                    <option value="em_andamento">Em atendimento</option>
                    <option value="concluido">Concluídas</option>
                    <option value="cancelado">Canceladas</option>
                  </select>
                  <input
                    type="date"
                    value={filtroData}
                    onChange={(e) => setFiltroData(e.target.value)}
                    className={inputCls}
                    aria-label="Filtrar por data agendada"
                  />
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full min-w-[900px] border-collapse text-left text-sm">
                    <thead className="bg-[#EAF3F7] text-[11px] uppercase tracking-wide text-[#0B1756]">
                      <tr>
                        {["Paciente", "Unidade", "Motivo", "Bairro", "Enfermeiro responsável", "Agendamento", "Situação", "Ação"].map((titulo) => (
                          <th key={titulo} className="whitespace-nowrap px-5 py-4 font-bold">{titulo}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {visitasPaginadas.map((visita) => (
                        <tr key={visita.id} className="transition hover:bg-[#EAF3F7]/70">
                          <td className="px-5 py-4">
                            <p className="font-semibold text-[#0B1756]">{visita.paciente}</p>
                            <p className="mt-1 text-xs text-slate-400">{visita.telefone || "Telefone não informado"}</p>
                          </td>
                          <td className="px-5 py-4 text-slate-600">{visita.unidade || "—"}</td>
                          <td className="max-w-[250px] px-5 py-4">
                            <p className="font-medium text-slate-700">{visita.motivo}</p>
                          </td>
                          <td className="px-5 py-4 text-slate-600">{visita.bairro || "—"}</td>
                          <td className="px-5 py-4 text-slate-600">{visita.enfermeiro || "Não atribuído"}</td>
                          <td className="whitespace-nowrap px-5 py-4">
                            <p className="font-medium text-slate-700">{formatarData(visita.dataAgendada)}</p>
                            <p className="mt-1 text-xs text-slate-400">{visita.horario || "Horário pendente"}</p>
                          </td>
                          <td className="px-5 py-4">
                            <Badge status={visita.statusApi}>{visita.status}</Badge>
                          </td>
                          <td className="px-5 py-4">
                            <button
                              type="button"
                              onClick={() => abrirDetalhes(visita)}
                              className="whitespace-nowrap rounded-xl border border-[#3563A7]/20 px-4 py-2.5 text-xs font-semibold text-[#023E8A] transition hover:bg-[#EAF3F7]"
                            >
                              Ver detalhes
                            </button>
                          </td>
                        </tr>
                      ))}
                      {!visitasFiltradas.length && (
                        <tr>
                          <td colSpan={8} className="px-5 py-14 text-center">
                            <p className="font-semibold text-slate-600">Nenhum atendimento encontrado</p>
                            <p className="mt-1 text-xs text-slate-400">Tente alterar os filtros ou atualize a lista.</p>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {visitasFiltradas.length > 0 && (
                  <div className="flex flex-col gap-3 border-t border-[#EAF3F7] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-xs text-slate-500">
                      Mostrando {(pagina - 1) * ITENS_POR_PAGINA + 1} a{" "}
                      {Math.min(pagina * ITENS_POR_PAGINA, visitasFiltradas.length)} de {visitasFiltradas.length}
                    </p>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        disabled={pagina === 1}
                        onClick={() => setPagina((atual) => Math.max(1, atual - 1))}
                        className="rounded-xl border border-[#3563A7]/20 px-4 py-2 text-xs font-semibold text-[#023E8A] disabled:opacity-40"
                      >
                        Anterior
                      </button>
                      <span className="min-w-[60px] text-center text-xs font-semibold text-[#0B1756]">{pagina} / {totalPaginas}</span>
                      <button
                        type="button"
                        disabled={pagina === totalPaginas}
                        onClick={() => setPagina((atual) => Math.min(totalPaginas, atual + 1))}
                        className="rounded-xl border border-[#3563A7]/20 px-4 py-2 text-xs font-semibold text-[#023E8A] disabled:opacity-40"
                      >
                        Próxima
                      </button>
                    </div>
                  </div>
                )}
              </Card>
            )}

            {aba === "agenda" && (
              <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
                <Card>
                  <div className="mb-5 flex items-center justify-between gap-3">
                    <button
                      type="button"
                      onClick={() => setMesCalendario((data) => new Date(data.getFullYear(), data.getMonth() - 1, 1))}
                      className="rounded-xl border border-[#3563A7]/20 px-3 py-2 text-sm font-semibold text-[#023E8A] hover:bg-[#EAF3F7]"
                      aria-label="Mês anterior"
                    >
                      ←
                    </button>
                    <h2 className="text-base font-bold capitalize text-[#0B1756]">
                      {mesCalendario.toLocaleDateString("pt-BR", { month: "long", year: "numeric" })}
                    </h2>
                    <button
                      type="button"
                      onClick={() => setMesCalendario((data) => new Date(data.getFullYear(), data.getMonth() + 1, 1))}
                      className="rounded-xl border border-[#3563A7]/20 px-3 py-2 text-sm font-semibold text-[#023E8A] hover:bg-[#EAF3F7]"
                      aria-label="Próximo mês"
                    >
                      →
                    </button>
                  </div>

                  <div className="grid grid-cols-7 gap-1.5">
                    {["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"].map((dia) => (
                      <div key={dia} className="py-2 text-center text-xs font-semibold text-slate-500">{dia}</div>
                    ))}
                    {diasCalendario.map((dia) =>
                      dia.vazio ? (
                        <div key={dia.chave} />
                      ) : (
                        <button
                          key={dia.chave}
                          type="button"
                          onClick={() => setDiaSelecionado(dia.data)}
                          className={`flex min-h-[68px] flex-col items-center justify-center rounded-xl border p-2 transition sm:min-h-[78px] ${
                            diaSelecionado === dia.data
                              ? "border-[#023E8A] bg-[#023E8A] text-white shadow-sm"
                              : "border-[#DFEAF5] bg-white text-slate-700 hover:border-[#3563A7] hover:bg-[#F5F9FD]"
                          }`}
                        >
                          <span className="text-sm font-semibold">{dia.dia}</span>
                          {dia.quantidade > 0 && (
                            <span className={`mt-1 rounded-full px-2 py-0.5 text-[10px] font-bold ${diaSelecionado === dia.data ? "bg-white text-[#023E8A]" : "bg-[#EAF3F7] text-[#023E8A]"}`}>
                              {dia.quantidade}
                            </span>
                          )}
                        </button>
                      )
                    )}
                  </div>

                  <div className="mt-5 flex flex-wrap items-center gap-4 border-t border-slate-100 pt-4 text-xs text-slate-500">
                    <span className="flex items-center gap-2">
                      <span className="h-2.5 w-2.5 rounded-full bg-[#023E8A]" />
                      Atendimentos agendados
                    </span>
                    <span>Selecione um dia para consultar a programação.</span>
                  </div>
                </Card>

                <Card>
                  <div className="mb-4 flex items-center justify-between gap-3">
                    <div>
                      <h2 className="text-lg font-bold text-[#0B1756]">Visitas do dia</h2>
                      <p className="mt-1 text-sm text-slate-500">{formatarData(diaSelecionado)}</p>
                    </div>
                    <Badge status="agendado">{visitasDoDia.length} visita(s)</Badge>
                  </div>
                  {visitasDoDia.length ? (
                    <div className="divide-y divide-slate-100">
                      {visitasDoDia.map((visita) => (
                        <button
                          key={visita.id}
                          type="button"
                          onClick={() => abrirDetalhes(visita)}
                          className="flex w-full gap-3 py-4 text-left transition hover:bg-[#EAF3F7]/70"
                        >
                          <span className="flex h-11 min-w-[58px] items-center justify-center rounded-xl bg-[#EAF3F7] text-xs font-bold text-[#023E8A]">
                            {visita.horario || "--:--"}
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="block font-semibold text-[#0B1756]">{visita.paciente}</span>
                            <span className="mt-1 block text-sm text-slate-500">{visita.motivo}</span>
                            <span className="mt-1 block text-xs text-slate-400">{visita.bairro || "Bairro não informado"}</span>
                            <span className="mt-2 inline-flex"><Badge status={visita.statusApi}>{visita.status}</Badge></span>
                          </span>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="rounded-2xl border border-dashed border-slate-200 px-4 py-12 text-center">
                      <p className="text-sm font-semibold text-slate-600">Nenhuma visita agendada neste dia</p>
                      <p className="mt-1 text-xs text-slate-400">Escolha outra data no calendário.</p>
                    </div>
                  )}
                </Card>
              </div>
            )}

            {aba === "equipe" && (
              <Card className="overflow-hidden p-0">
                <div className="border-b border-[#EAF3F7] px-5 py-5 sm:px-6">
                  <h2 className="text-lg font-bold text-[#0B1756]">Enfermeiros vinculados aos atendimentos</h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Relação baseada nos enfermeiros que aparecem nos registros retornados pela API.
                  </p>
                </div>
                {equipeResumo.length ? (
                  <div className="grid gap-4 p-5 sm:grid-cols-2 xl:grid-cols-3">
                    {equipeResumo.map((enfermeiro) => (
                      <div key={enfermeiro.id} className="rounded-2xl border border-[#DFEAF5] bg-[#FBFDFF] p-5">
                        <div className="flex items-center gap-3">
                          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#EAF3F7] text-[#023E8A]">
                            <Icone tipo="user" />
                          </div>
                          <div className="min-w-0">
                            <p className="truncate font-semibold text-[#0B1756]">{enfermeiro.nome}</p>
                            <p className="mt-0.5 text-xs text-slate-500">
                              Enfermeiro responsável · ID {enfermeiro.id}
                            </p>
                          </div>
                        </div>
                        <div className="mt-5 grid grid-cols-2 gap-3">
                          <div className="rounded-xl bg-white p-3">
                            <p className="text-2xl font-bold text-[#023E8A]">{enfermeiro.total}</p>
                            <p className="mt-1 text-xs text-slate-500">Visitas ativas</p>
                          </div>
                          <div className="rounded-xl bg-white p-3">
                            <p className="text-2xl font-bold text-[#3563A7]">{enfermeiro.emAndamento}</p>
                            <p className="mt-1 text-xs text-slate-500">Em atendimento</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="px-5 py-14 text-center">
                    <p className="font-semibold text-slate-600">Nenhum enfermeiro atribuído aos atendimentos</p>
                    <p className="mt-1 text-xs text-slate-400">Os enfermeiros serão exibidos quando estiverem vinculados a atendimentos retornados pela API.</p>
                  </div>
                )}
              </Card>
            )}
          </>
        )}
      </div>

      {visitaSelecionada && (
        <div
          className="fixed inset-0 z-[80] flex items-center justify-center bg-[#0B1756]/45 p-4 backdrop-blur-sm"
          onClick={() => !salvando && setVisitaSelecionada(null)}
        >
          <div
            className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-[28px] border border-white/60 bg-white shadow-[0_22px_70px_rgba(2,62,138,0.16)]"
            onClick={(evento) => evento.stopPropagation()}
          >
            <div className="sticky top-0 z-10 flex items-start justify-between gap-4 rounded-t-[28px] bg-gradient-to-br from-[#174693] via-[#234E96] to-[#151A67] px-5 py-5 text-white sm:px-7">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-white/70">Atendimento domiciliar #{visitaSelecionada.id}</p>
                <h2 className="mt-1 text-xl font-bold">{visitaSelecionada.paciente}</h2>
                <p className="mt-1 text-sm text-white/75">{visitaSelecionada.telefone || "Telefone não informado"}</p>
              </div>
              <button
                type="button"
                onClick={() => setVisitaSelecionada(null)}
                disabled={salvando}
                className="rounded-xl bg-white/10 px-3 py-2 text-xl leading-none text-white transition hover:bg-white/20"
                aria-label="Fechar detalhes"
              >
                ×
              </button>
            </div>

            <div className="space-y-6 p-5 sm:p-7">
              {carregandoDetalhe && (
                <p className="text-xs font-medium text-[#3563A7]">Atualizando dados completos do atendimento...</p>
              )}

              <div className="flex flex-wrap items-center justify-between gap-3">
                <Badge status={visitaSelecionada.statusApi}>{visitaSelecionada.status}</Badge>
                <span className="text-xs text-slate-500">
                  Solicitação recebida em {formatarData(visitaSelecionada.dataSolicitacao)}
                </span>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl bg-[#EAF3F7]/45 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Motivo da solicitação</p>
                  <p className="mt-2 text-sm leading-6 text-[#0B1756]">{visitaSelecionada.motivo}</p>
                </div>
                <div className="rounded-2xl bg-[#EAF3F7]/45 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Endereço da visita</p>
                  <p className="mt-2 text-sm leading-6 text-[#0B1756]">{visitaSelecionada.endereco}</p>
                  <p className="mt-1 text-xs text-slate-500">
                    {visitaSelecionada.cep ? `CEP: ${visitaSelecionada.cep}` : "CEP não informado"}
                  </p>
                </div>
                <div className="rounded-2xl bg-[#EAF3F7]/45 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Enfermeiro responsável</p>
                  <p className="mt-2 text-sm font-semibold text-[#0B1756]">{visitaSelecionada.enfermeiro || "Não atribuído"}</p>
                  <p className="mt-2 text-xs text-slate-500">Unidade: {visitaSelecionada.unidade || "Não identificada"}</p>
                </div>
                <div className="rounded-2xl bg-[#EAF3F7]/45 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Agendamento</p>
                  <p className="mt-2 text-sm font-semibold text-[#0B1756]">{formatarDataHora(visitaSelecionada.dataAgendada)}</p>
                </div>
              </div>

              {["solicitado", "agendado"].includes(visitaSelecionada.statusApi) && (
                <form onSubmit={agendarVisita} className="space-y-4 rounded-2xl border border-[#3563A7]/20 bg-[#F8FBFE] p-4 sm:p-5">
                  <div>
                    <h3 className="font-bold text-[#0B1756]">
                      {visitaSelecionada.statusApi === "solicitado" ? "Agendar visita" : "Reagendar ou reatribuir visita"}
                    </h3>
                    <p className="mt-1 text-xs text-slate-500">
                      Selecione qualquer enfermeiro ativo cadastrado no UneSUS, independentemente da unidade de vínculo.
                    </p>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="block sm:col-span-2">
                      <span className="mb-1.5 block text-xs font-semibold text-slate-600">Enfermeiro responsável</span>
                      <select
                        required
                        value={enfermeiroSelecionado}
                        onChange={(e) => setEnfermeiroSelecionado(e.target.value)}
                        className={inputCls}
                        disabled={carregandoDetalhe || enfermeirosDisponiveis.length === 0}
                      >
                        <option value="">Selecione um enfermeiro</option>
                        {enfermeirosDisponiveis.map((enfermeiro) => (
                          <option key={enfermeiro.id} value={String(enfermeiro.id)}>
                            {enfermeiro.nome_completo} · COREN {enfermeiro.coren}/{enfermeiro.uf_coren}
                          </option>
                        ))}
                      </select>
                      {enfermeirosDisponiveis.length === 0 && !carregandoDetalhe && (
                        <span className="mt-1.5 block text-xs text-rose-600">
                          Nenhum enfermeiro ativo está cadastrado no sistema.
                        </span>
                      )}
                    </label>
                    <label className="block">
                      <span className="mb-1.5 block text-xs font-semibold text-slate-600">Data da visita</span>
                      <input
                        type="date"
                        required
                        min={dataAtualISO()}
                        value={dataAgendamento}
                        onChange={(e) => setDataAgendamento(e.target.value)}
                        className={inputCls}
                      />
                    </label>
                    <label className="block">
                      <span className="mb-1.5 block text-xs font-semibold text-slate-600">Horário</span>
                      <input
                        type="time"
                        required
                        value={horaAgendamento}
                        onChange={(e) => setHoraAgendamento(e.target.value)}
                        className={inputCls}
                      />
                    </label>
                  </div>
                  <button
                    type="submit"
                    disabled={salvando || !enfermeiroSelecionado || enfermeirosDisponiveis.length === 0}
                    className="w-full rounded-xl bg-[#023E8A] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#0B1756] disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
                  >
                    {salvando ? "Salvando..." : visitaSelecionada.statusApi === "solicitado" ? "Confirmar agendamento" : "Salvar alteração"}
                  </button>
                  {enfermeirosDisponiveis.length === 0 && !carregandoDetalhe && (
                    <p className="text-xs text-rose-600">Cadastre ou reative um enfermeiro para realizar o agendamento.</p>
                  )}
                </form>
              )}

              <div className="rounded-2xl border border-[#DFEAF5] bg-white p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Observações registradas pelo enfermeiro</p>
                <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-[#0B1756]">
                  {visitaSelecionada.observacoes || "Nenhuma observação registrada até o momento."}
                </p>
              </div>

              <div className="flex flex-col-reverse gap-2 border-t border-slate-100 pt-5 sm:flex-row sm:flex-wrap sm:justify-end">
                {["solicitado", "agendado", "em_andamento"].includes(visitaSelecionada.statusApi) && (
                  <button
                    type="button"
                    onClick={() => atualizarStatus("cancelado")}
                    disabled={salvando}
                    className="rounded-xl border border-rose-200 px-4 py-3 text-sm font-semibold text-rose-700 hover:bg-rose-50 disabled:opacity-50"
                  >
                    {visitaSelecionada.statusApi === "solicitado" ? "Cancelar solicitação" : "Cancelar visita"}
                  </button>
                )}
                {salvando && (
                  <span className="self-center text-xs font-medium text-slate-500">Salvando alterações...</span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {aviso && (
        <div
          role="status"
          className={`fixed bottom-5 left-1/2 z-[100] max-w-[calc(100vw-2rem)] -translate-x-1/2 rounded-xl px-5 py-3 text-sm font-semibold text-white shadow-xl ${
            aviso.tipo === "erro" ? "bg-rose-600" : "bg-[#17418E]"
          }`}
        >
          {aviso.texto}
        </div>
      )}
    </main>
  );
}
