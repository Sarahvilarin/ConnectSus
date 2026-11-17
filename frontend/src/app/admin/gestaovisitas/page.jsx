"use client";

import { useEffect, useMemo, useState } from "react";
import { api } from "../../../lib/api";

const ITENS_POR_PAGINA = 8;

const STATUS = {
  solicitado: "Solicitada",
  agendado: "Agendada",
  em_andamento: "Em atendimento",
  concluido: "Concluída",
  cancelado: "Cancelada",
};

const inputCls =
  "w-full rounded-2xl border border-[#C8D8EC] bg-white px-4 py-3 text-sm text-[#0B1756] outline-none transition placeholder:text-slate-400 hover:border-[#3563A7]/70 focus:border-[#023E8A] focus:ring-4 focus:ring-[#3563A7]/15";

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
    medicoId: item.medico_id || null,
    medico: item.medico || "Profissional não definido",
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

function normalizarPerfil(resposta) {
  const medico = resposta?.medico || resposta?.data?.medico || null;
  const vinculos = Array.isArray(resposta?.vinculos)
    ? resposta.vinculos
    : Array.isArray(resposta?.data?.vinculos)
      ? resposta.data.vinculos
      : [];

  return { medico, vinculos };
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
    solicitado: "border-amber-200 bg-amber-50 text-amber-700",
    agendado: "border-blue-200 bg-blue-50 text-blue-700",
    em_andamento: "border-violet-200 bg-violet-50 text-violet-700",
    concluido: "border-emerald-200 bg-emerald-50 text-emerald-700",
    cancelado: "border-slate-200 bg-slate-100 text-slate-600",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${
        estilos[status] || "border-slate-200 bg-slate-100 text-slate-600"
      }`}
    >
      {children}
    </span>
  );
}

function Card({ children, className = "" }) {
  return (
    <section
      className={`rounded-[24px] border border-[#E1EAF4] bg-white p-5 shadow-[0_8px_24px_rgba(20,55,100,0.05)] sm:p-6 ${className}`}
    >
      {children}
    </section>
  );
}

function Icone({ tipo, className = "h-5 w-5" }) {
  const comuns = {
    calendar: (
      <>
        <rect x="3" y="5" width="18" height="16" rx="2" />
        <path d="M16 3v4M8 3v4M3 10h18" />
      </>
    ),
    search: (
      <>
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-4-4" />
      </>
    ),
    pin: (
      <>
        <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
        <circle cx="12" cy="10" r="2.5" />
      </>
    ),
    clock: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
      </>
    ),
    refresh: (
      <>
        <path d="M20 7v5h-5M4 17v-5h5" />
        <path d="M5.5 9A7 7 0 0 1 18 6l2 6M4 12l2 6a7 7 0 0 0 12.5-3" />
      </>
    ),
    user: (
      <>
        <circle cx="12" cy="8" r="4" />
        <path d="M4 21a8 8 0 0 1 16 0" />
      </>
    ),
    check: <path d="m5 12 4 4L19 6" />,
    alert: (
      <>
        <path d="M12 3 2.8 19h18.4L12 3Z" />
        <path d="M12 9v4m0 3h.01" />
      </>
    ),
  };

  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {comuns[tipo]}
    </svg>
  );
}

export default function GestaoVisitasPage() {
  const [aba, setAba] = useState("geral");
  const [visitas, setVisitas] = useState([]);
  const [perfilMedico, setPerfilMedico] = useState(null);
  const [vinculos, setVinculos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [atualizando, setAtualizando] = useState(false);
  const [erro, setErro] = useState("");
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
  const [observacoes, setObservacoes] = useState("");
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

    const [perfilResultado, visitasResultado] = await Promise.allSettled([
      api("/medicos/me"),
      api("/atendimentos-domiciliares/unidade"),
    ]);

    if (perfilResultado.status === "fulfilled") {
      const perfil = normalizarPerfil(perfilResultado.value);
      setPerfilMedico(perfil.medico);
      setVinculos(perfil.vinculos);
    }

    if (visitasResultado.status === "fulfilled") {
      const lista = extrairLista(visitasResultado.value).map(
        normalizarAtendimento
      );
      setVisitas(lista);
    } else {
      setErro(
        visitasResultado.reason?.message ||
          "Não foi possível carregar os atendimentos domiciliares."
      );
    }

    if (perfilResultado.status === "rejected") {
      mostrarAviso(
        perfilResultado.reason?.message ||
          "Não foi possível carregar o perfil profissional.",
        "erro"
      );
    }

    setCarregando(false);
    setAtualizando(false);
  }

  useEffect(() => {
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
          visita.medico,
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

  const profissionais = useMemo(() => {
    const mapa = new Map();

    visitas.forEach((visita) => {
      if (visita.medicoId) {
        mapa.set(String(visita.medicoId), {
          id: visita.medicoId,
          nome: visita.medico,
        });
      }
    });

    if (perfilMedico?.id) {
      mapa.set(String(perfilMedico.id), {
        id: perfilMedico.id,
        nome: perfilMedico.nome_completo || "Profissional autenticado",
      });
    }

    return Array.from(mapa.values()).sort((a, b) =>
      a.nome.localeCompare(b.nome, "pt-BR")
    );
  }, [visitas, perfilMedico]);

  const equipeResumo = useMemo(
    () =>
      profissionais.map((profissional) => ({
        ...profissional,
        total: visitas.filter(
          (v) =>
            String(v.medicoId) === String(profissional.id) &&
            ["agendado", "em_andamento"].includes(v.statusApi)
        ).length,
        emAndamento: visitas.filter(
          (v) =>
            String(v.medicoId) === String(profissional.id) &&
            v.statusApi === "em_andamento"
        ).length,
      })),
    [profissionais, visitas]
  );

  function abrirDetalhes(visita) {
    setVisitaSelecionada(visita);
    setObservacoes(visita.observacoes || "");
    setDataAgendamento(visita.dataAgendada?.slice(0, 10) || "");
    setHoraAgendamento(visita.horario || "09:00");
    setCarregandoDetalhe(true);

    api(`/atendimentos-domiciliares/${visita.id}`)
      .then((resposta) => {
        const registro = resposta?.atendimento || resposta?.dados || resposta;
        const detalhe = normalizarAtendimento(registro);
        setVisitaSelecionada(detalhe);
        setObservacoes(detalhe.observacoes || "");
        setDataAgendamento(detalhe.dataAgendada?.slice(0, 10) || "");
        setHoraAgendamento(detalhe.horario || "09:00");
        setVisitas((atuais) =>
          atuais.map((item) => (item.id === detalhe.id ? detalhe : item))
        );
      })
      .catch((error) => {
        mostrarAviso(
          error.message || "Não foi possível carregar os detalhes.",
          "erro"
        );
      })
      .finally(() => setCarregandoDetalhe(false));
  }

  function obterUnidadeId(visita) {
    if (visita?.unidadeId) return visita.unidadeId;

    const unidadeCorrespondente = vinculos.find(
      (v) => v.unidade === visita?.unidade
    );
    if (unidadeCorrespondente?.unidade_id) {
      return unidadeCorrespondente.unidade_id;
    }

    return vinculos.length === 1 ? vinculos[0].unidade_id : null;
  }

  async function agendarVisita(evento) {
    evento.preventDefault();

    if (!visitaSelecionada) return;

    const unidadeId = obterUnidadeId(visitaSelecionada);
    const medicoId = perfilMedico?.id;

    if (!unidadeId) {
      mostrarAviso(
        "Não foi possível identificar a unidade deste atendimento. Confira os vínculos do profissional.",
        "erro"
      );
      return;
    }

    if (!medicoId) {
      mostrarAviso(
        "Não foi possível identificar o profissional autenticado.",
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
      await api(`/atendimentos-domiciliares/${visitaSelecionada.id}/agendar`, {
        method: "PATCH",
        body: JSON.stringify({
          unidade_id: Number(unidadeId),
          medico_id: Number(medicoId),
          data_agendada: dataHora,
        }),
      });

      mostrarAviso("Visita agendada com sucesso.");
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

    const unidadeId = obterUnidadeId(visitaSelecionada);
    if (!unidadeId) {
      mostrarAviso(
        "Não foi possível identificar a unidade deste atendimento.",
        "erro"
      );
      return;
    }

    setSalvando(true);

    try {
      await api(
        `/atendimentos-domiciliares/${visitaSelecionada.id}/status`,
        {
          method: "PATCH",
          body: JSON.stringify({
            unidade_id: Number(unidadeId),
            status: novoStatus,
            observacoes: observacoes.trim() || null,
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
      "Motivo",
      "Bairro",
      "Endereço",
      "Profissional",
      "Data agendada",
      "Status",
      "Observações",
    ];

    const linhas = visitasFiltradas.map((v) =>
      [
        v.id,
        v.paciente,
        v.telefone,
        v.motivo,
        v.bairro,
        v.endereco,
        v.medico,
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

  const abas = [
    { id: "geral", titulo: "Visão geral", descricao: "Indicadores e pendências" },
    { id: "visitas", titulo: "Todas as visitas", descricao: "Consultar e atualizar" },
    { id: "agenda", titulo: "Agenda", descricao: "Calendário de atendimentos" },
    { id: "equipe", titulo: "Profissionais", descricao: "Distribuição dos atendimentos" },
  ];

  return (
    <div className="min-h-screen bg-[#F1F6FB] font-sans text-[#0B1756]">
      <div className="pointer-events-none fixed -right-36 -top-36 h-96 w-96 rounded-full border-[64px] border-[#D9E8FA]/60" />
      <div className="pointer-events-none fixed -bottom-40 -left-32 h-96 w-96 rounded-full bg-white/70" />

      <main className="relative z-10 mx-auto w-full max-w-[1500px] space-y-7 px-4 py-7 sm:px-6 xl:px-8">
        <section className="relative pb-0">
          <div className="relative overflow-hidden rounded-[30px] bg-gradient-to-br from-[#023E8A] via-[#084B9A] to-[#0B1756] px-6 py-8 shadow-[0_22px_60px_rgba(2,62,138,0.16)] sm:px-9 sm:py-9">
            <div className="pointer-events-none absolute -right-24 -top-32 h-80 w-80 rounded-full bg-white/10" />
            <div className="pointer-events-none absolute -bottom-28 right-[30%] h-64 w-64 rounded-full border-[45px] border-white/[0.04]" />

            <div className="relative z-10 flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
              <div className="max-w-3xl">
                <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-semibold text-white/90">
                  <Icone tipo="calendar" className="h-4 w-4" />
                  Gestão assistencial
                </div>
                <h1 className="text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl lg:text-[42px]">
                  Gestão de visitas domiciliares
                </h1>
                <p className="mt-3 max-w-3xl text-sm leading-7 text-white/85 sm:text-base">
                  Acompanhe solicitações, organize agendamentos e atualize o andamento dos atendimentos domiciliares da unidade.
                </p>
                <p className="mt-3 text-xs font-medium text-white/65">
                  Dados carregados da API do UneSUS
                </p>
              </div>

              <div className="flex shrink-0 flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => carregarDados(true)}
                  disabled={atualizando || carregando}
                  className="inline-flex items-center gap-2 rounded-2xl border border-white/25 bg-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <Icone tipo="refresh" className={`h-4 w-4 ${atualizando ? "animate-spin" : ""}`} />
                  Atualizar
                </button>
                <button
                  type="button"
                  onClick={exportarCSV}
                  disabled={!visitasFiltradas.length}
                  className="rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-[#0B1756] shadow-sm transition hover:bg-[#EAF3F7] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Exportar CSV
                </button>
              </div>
            </div>
          </div>

          <nav
            className="relative z-20 -mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4"
            aria-label="Seções de visitas domiciliares"
          >
            {abas.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setAba(item.id)}
                className={`flex min-h-[82px] flex-col justify-center rounded-[22px] border bg-white px-5 py-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${
                  aba === item.id
                    ? "border-[#3563A7] ring-2 ring-[#3563A7]/15"
                    : "border-[#E1EAF4] hover:border-[#3563A7]/40"
                }`}
              >
                <span className="text-sm font-bold text-[#0B1756]">
                  {item.titulo}
                </span>
                <span className="mt-1 text-xs text-slate-500">
                  {item.descricao}
                </span>
              </button>
            ))}
          </nav>
        </section>

        {erro && (
          <div className="flex items-start gap-3 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-4 text-sm text-rose-700">
            <Icone tipo="alert" className="mt-0.5 h-5 w-5 shrink-0" />
            <div>
              <p className="font-semibold">Não foi possível carregar os atendimentos</p>
              <p className="mt-1">{erro}</p>
              <p className="mt-2 text-xs">
                Confira se a API está ativa e se a sessão atual pertence a um profissional com acesso às visitas da unidade.
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
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                  {[
                    {
                      titulo: "Solicitações pendentes",
                      valor: visitasSolicitadas.length,
                      detalhe: "Aguardando agendamento",
                      fundo: "bg-amber-50",
                      cor: "text-amber-700",
                    },
                    {
                      titulo: "Agendadas",
                      valor: visitasAgendadas.length,
                      detalhe: "Visitas programadas",
                      fundo: "bg-blue-50",
                      cor: "text-blue-700",
                    },
                    {
                      titulo: "Em atendimento",
                      valor: visitasEmAndamento.length,
                      detalhe: "Atendimentos iniciados",
                      fundo: "bg-violet-50",
                      cor: "text-violet-700",
                    },
                    {
                      titulo: "Concluídas",
                      valor: visitasConcluidas.length,
                      detalhe: "Atendimentos finalizados",
                      fundo: "bg-emerald-50",
                      cor: "text-emerald-700",
                    },
                  ].map((item) => (
                    <Card key={item.titulo} className="flex items-center gap-4">
                      <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${item.fundo} ${item.cor}`}>
                        <span className="text-xl font-bold">{item.valor}</span>
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-[#0B1756]">{item.titulo}</p>
                        <p className="mt-1 text-xs text-slate-500">{item.detalhe}</p>
                      </div>
                    </Card>
                  ))}
                </div>

                <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
                  <Card>
                    <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <h2 className="text-lg font-bold text-[#0B1756]">
                          Solicitações que aguardam agendamento
                        </h2>
                        <p className="mt-1 text-sm text-slate-500">
                          Solicitações recebidas pela unidade.
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
                        ["Solicitadas", visitasSolicitadas.length, "bg-amber-500"],
                        ["Agendadas", visitasAgendadas.length, "bg-blue-600"],
                        ["Em atendimento", visitasEmAndamento.length, "bg-violet-600"],
                        ["Concluídas", visitasConcluidas.length, "bg-emerald-600"],
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
                      className="mt-6 w-full rounded-xl border border-[#C8D8EC] px-4 py-3 text-sm font-semibold text-[#023E8A] transition hover:bg-[#F1F6FB]"
                    >
                      Ver todos os atendimentos
                    </button>
                  </Card>
                </div>
              </div>
            )}

            {aba === "visitas" && (
              <Card className="overflow-hidden p-0">
                <div className="border-b border-[#E8EEF6] px-5 py-5 sm:px-6">
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

                <div className="grid grid-cols-1 gap-3 border-b border-[#E8EEF6] bg-[#FAFCFE] p-4 sm:grid-cols-2 lg:grid-cols-[1fr_230px_220px]">
                  <div className="relative">
                    <Icone tipo="search" className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      value={busca}
                      onChange={(e) => setBusca(e.target.value)}
                      placeholder="Buscar paciente, motivo ou bairro..."
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
                    <thead className="bg-[#F3F7FC] text-[11px] uppercase tracking-wide text-slate-500">
                      <tr>
                        {["Paciente", "Motivo", "Bairro", "Profissional", "Agendamento", "Situação", "Ação"].map((titulo) => (
                          <th key={titulo} className="whitespace-nowrap px-5 py-4 font-bold">{titulo}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {visitasPaginadas.map((visita) => (
                        <tr key={visita.id} className="transition hover:bg-[#F8FBFE]">
                          <td className="px-5 py-4">
                            <p className="font-semibold text-[#0B1756]">{visita.paciente}</p>
                            <p className="mt-1 text-xs text-slate-400">{visita.telefone || "Telefone não informado"}</p>
                          </td>
                          <td className="max-w-[250px] px-5 py-4">
                            <p className="font-medium text-slate-700">{visita.motivo}</p>
                          </td>
                          <td className="px-5 py-4 text-slate-600">{visita.bairro || "—"}</td>
                          <td className="px-5 py-4 text-slate-600">{visita.medico}</td>
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
                              className="whitespace-nowrap rounded-xl border border-[#C8D8EC] px-4 py-2.5 text-xs font-semibold text-[#023E8A] transition hover:bg-[#F1F6FB]"
                            >
                              Ver detalhes
                            </button>
                          </td>
                        </tr>
                      ))}
                      {!visitasFiltradas.length && (
                        <tr>
                          <td colSpan={7} className="px-5 py-14 text-center">
                            <p className="font-semibold text-slate-600">Nenhum atendimento encontrado</p>
                            <p className="mt-1 text-xs text-slate-400">Tente alterar os filtros ou atualize a lista.</p>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {visitasFiltradas.length > 0 && (
                  <div className="flex flex-col gap-3 border-t border-[#E8EEF6] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-xs text-slate-500">
                      Mostrando {(pagina - 1) * ITENS_POR_PAGINA + 1} a{" "}
                      {Math.min(pagina * ITENS_POR_PAGINA, visitasFiltradas.length)} de {visitasFiltradas.length}
                    </p>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        disabled={pagina === 1}
                        onClick={() => setPagina((atual) => Math.max(1, atual - 1))}
                        className="rounded-xl border border-[#C8D8EC] px-4 py-2 text-xs font-semibold text-[#023E8A] disabled:opacity-40"
                      >
                        Anterior
                      </button>
                      <span className="min-w-[60px] text-center text-xs font-semibold text-[#0B1756]">{pagina} / {totalPaginas}</span>
                      <button
                        type="button"
                        disabled={pagina === totalPaginas}
                        onClick={() => setPagina((atual) => Math.min(totalPaginas, atual + 1))}
                        className="rounded-xl border border-[#C8D8EC] px-4 py-2 text-xs font-semibold text-[#023E8A] disabled:opacity-40"
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
                      className="rounded-xl border border-[#C8D8EC] px-3 py-2 text-sm font-semibold text-[#023E8A] hover:bg-[#F1F6FB]"
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
                      className="rounded-xl border border-[#C8D8EC] px-3 py-2 text-sm font-semibold text-[#023E8A] hover:bg-[#F1F6FB]"
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
                              : "border-[#E1EAF4] bg-white text-slate-700 hover:border-[#3563A7] hover:bg-[#F5F9FD]"
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
                          className="flex w-full gap-3 py-4 text-left transition hover:bg-[#F8FBFE]"
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
                <div className="border-b border-[#E8EEF6] px-5 py-5 sm:px-6">
                  <h2 className="text-lg font-bold text-[#0B1756]">Profissionais vinculados aos atendimentos</h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Relação baseada nos profissionais que aparecem nos registros retornados pela API.
                  </p>
                </div>
                {equipeResumo.length ? (
                  <div className="grid gap-4 p-5 sm:grid-cols-2 xl:grid-cols-3">
                    {equipeResumo.map((profissional) => (
                      <div key={profissional.id} className="rounded-2xl border border-[#E1EAF4] bg-[#FBFDFF] p-5">
                        <div className="flex items-center gap-3">
                          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#EAF3F7] text-[#023E8A]">
                            <Icone tipo="user" />
                          </div>
                          <div className="min-w-0">
                            <p className="truncate font-semibold text-[#0B1756]">{profissional.nome}</p>
                            <p className="mt-0.5 text-xs text-slate-500">
                              {String(profissional.id) === String(perfilMedico?.id) ? "Profissional autenticado" : `ID ${profissional.id}`}
                            </p>
                          </div>
                        </div>
                        <div className="mt-5 grid grid-cols-2 gap-3">
                          <div className="rounded-xl bg-white p-3">
                            <p className="text-2xl font-bold text-[#023E8A]">{profissional.total}</p>
                            <p className="mt-1 text-xs text-slate-500">Visitas ativas</p>
                          </div>
                          <div className="rounded-xl bg-white p-3">
                            <p className="text-2xl font-bold text-violet-700">{profissional.emAndamento}</p>
                            <p className="mt-1 text-xs text-slate-500">Em atendimento</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="px-5 py-14 text-center">
                    <p className="font-semibold text-slate-600">Nenhum profissional identificado nos registros</p>
                    <p className="mt-1 text-xs text-slate-400">Os profissionais serão exibidos quando estiverem vinculados a atendimentos retornados pela API.</p>
                  </div>
                )}
              </Card>
            )}
          </>
        )}
      </main>

      {visitaSelecionada && (
        <div
          className="fixed inset-0 z-[80] flex items-center justify-center bg-[#0B1756]/45 p-4 backdrop-blur-sm"
          onClick={() => !salvando && setVisitaSelecionada(null)}
        >
          <div
            className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-[26px] border border-white/60 bg-white shadow-2xl"
            onClick={(evento) => evento.stopPropagation()}
          >
            <div className="sticky top-0 z-10 flex items-start justify-between gap-4 rounded-t-[26px] bg-gradient-to-r from-[#023E8A] to-[#0B1756] px-5 py-5 text-white sm:px-7">
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
                <div className="rounded-2xl bg-[#F5F8FC] p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Motivo da solicitação</p>
                  <p className="mt-2 text-sm leading-6 text-[#0B1756]">{visitaSelecionada.motivo}</p>
                </div>
                <div className="rounded-2xl bg-[#F5F8FC] p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Endereço da visita</p>
                  <p className="mt-2 text-sm leading-6 text-[#0B1756]">{visitaSelecionada.endereco}</p>
                  <p className="mt-1 text-xs text-slate-500">
                    {visitaSelecionada.cep ? `CEP: ${visitaSelecionada.cep}` : "CEP não informado"}
                  </p>
                </div>
                <div className="rounded-2xl bg-[#F5F8FC] p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Profissional responsável</p>
                  <p className="mt-2 text-sm font-semibold text-[#0B1756]">{visitaSelecionada.medico}</p>
                </div>
                <div className="rounded-2xl bg-[#F5F8FC] p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Agendamento</p>
                  <p className="mt-2 text-sm font-semibold text-[#0B1756]">{formatarDataHora(visitaSelecionada.dataAgendada)}</p>
                </div>
              </div>

              {visitaSelecionada.statusApi === "solicitado" && (
                <form onSubmit={agendarVisita} className="space-y-4 rounded-2xl border border-[#C8D8EC] bg-[#F8FBFE] p-4 sm:p-5">
                  <div>
                    <h3 className="font-bold text-[#0B1756]">Agendar visita</h3>
                    <p className="mt-1 text-xs text-slate-500">
                      O atendimento será atribuído ao profissional autenticado.
                    </p>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
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
                    disabled={salvando || !perfilMedico?.id}
                    className="w-full rounded-xl bg-[#023E8A] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#0B1756] disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
                  >
                    {salvando ? "Agendando..." : "Confirmar agendamento"}
                  </button>
                  {!perfilMedico?.id && (
                    <p className="text-xs text-rose-600">O perfil profissional não foi carregado; não é possível identificar quem será responsável pelo atendimento.</p>
                  )}
                </form>
              )}

              <div className="space-y-2">
                <label className="block text-xs font-semibold text-slate-600" htmlFor="observacoes-visita">
                  Observações do atendimento
                </label>
                <textarea
                  id="observacoes-visita"
                  rows={4}
                  value={observacoes}
                  onChange={(e) => setObservacoes(e.target.value)}
                  placeholder="Registre informações relevantes para salvar junto à próxima atualização de status."
                  className={inputCls}
                  disabled={["concluido", "cancelado"].includes(visitaSelecionada.statusApi)}
                />
                <p className="text-xs text-slate-400">
                  O backend atual salva observações junto com a mudança de status.
                </p>
              </div>

              <div className="flex flex-col-reverse gap-2 border-t border-slate-100 pt-5 sm:flex-row sm:flex-wrap sm:justify-end">
                {visitaSelecionada.statusApi === "solicitado" && (
                  <button
                    type="button"
                    onClick={() => atualizarStatus("cancelado")}
                    disabled={salvando}
                    className="rounded-xl border border-rose-200 px-4 py-3 text-sm font-semibold text-rose-700 hover:bg-rose-50 disabled:opacity-50"
                  >
                    Cancelar solicitação
                  </button>
                )}
                {visitaSelecionada.statusApi === "agendado" && (
                  <>
                    <button
                      type="button"
                      onClick={() => atualizarStatus("cancelado")}
                      disabled={salvando}
                      className="rounded-xl border border-rose-200 px-4 py-3 text-sm font-semibold text-rose-700 hover:bg-rose-50 disabled:opacity-50"
                    >
                      Cancelar visita
                    </button>
                    <button
                      type="button"
                      onClick={() => atualizarStatus("em_andamento")}
                      disabled={salvando}
                      className="rounded-xl bg-[#023E8A] px-5 py-3 text-sm font-semibold text-white hover:bg-[#0B1756] disabled:opacity-50"
                    >
                      Iniciar atendimento
                    </button>
                  </>
                )}
                {visitaSelecionada.statusApi === "em_andamento" && (
                  <>
                    <button
                      type="button"
                      onClick={() => atualizarStatus("cancelado")}
                      disabled={salvando}
                      className="rounded-xl border border-rose-200 px-4 py-3 text-sm font-semibold text-rose-700 hover:bg-rose-50 disabled:opacity-50"
                    >
                      Cancelar atendimento
                    </button>
                    <button
                      type="button"
                      onClick={() => atualizarStatus("concluido")}
                      disabled={salvando}
                      className="rounded-xl bg-emerald-700 px-5 py-3 text-sm font-semibold text-white hover:bg-emerald-800 disabled:opacity-50"
                    >
                      Finalizar atendimento
                    </button>
                  </>
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
    </div>
  );
}
