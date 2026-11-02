"use client";

import { useEffect, useMemo, useState } from "react";

/* Dados demonstrativos */
const HOJE = "2026-10-27";
const ITENS_POR_PAGINA = 6;

const visitasIniciais = [
  {
    id: 1,
    paciente: "Maria Silva",
    idade: 78,
    bairro: "Centro",
    endereco: "Rua das Flores, 120",
    telefone: "(11) 91234-5678",
    motivo: "Dificuldade de locomoção",
    tipo: "Acompanhamento domiciliar",
    profissional: "Carla Souza",
    data: "2026-10-27",
    horario: "09:00",
    prioridade: "Alta",
    status: "Com inconsistência",
    inconsistencias: [
      "Não foi informado um contato alternativo para o paciente.",
    ],
    mensagemCorrecao: "",
    observacao: "",
    historico: [
      "Solicitação recebida",
      "Sistema identificou ausência de contato alternativo",
    ],
  },
  {
    id: 2,
    paciente: "Roberto Lima",
    idade: 64,
    bairro: "Cerâmica",
    endereco: "Av. Goiás, 850",
    telefone: "(11) 98888-1122",
    motivo: "Avaliação de ferida",
    tipo: "Curativo",
    profissional: "Juliana Ribeiro",
    data: "2026-10-27",
    horario: "10:30",
    prioridade: "Média",
    status: "Agendada",
    inconsistencias: [],
    mensagemCorrecao: "",
    observacao: "",
    historico: ["Solicitação criada", "Agendada"],
  },
  {
    id: 3,
    paciente: "Ana Pereira",
    idade: 32,
    bairro: "Nova Gerty",
    endereco: "Rua Itapura, 45",
    telefone: "(11) 97777-3344",
    motivo: "Acompanhamento de saúde",
    tipo: "Visita preventiva",
    profissional: "Fernanda Alves",
    data: "2026-10-27",
    horario: "14:00",
    prioridade: "Baixa",
    status: "Agendada",
    inconsistencias: [],
    mensagemCorrecao: "",
    observacao: "",
    historico: ["Solicitação criada", "Agendada"],
  },
  {
    id: 4,
    paciente: "João Oliveira",
    idade: 71,
    bairro: "Cerâmica",
    endereco: "Rua Paraná, 300",
    telefone: "(11) 96666-5566",
    motivo: "Acompanhamento pós-alta",
    tipo: "Avaliação clínica",
    profissional: "Carlos Mendes",
    data: "2026-10-27",
    horario: "15:00",
    prioridade: "Alta",
    status: "Em atendimento",
    inconsistencias: [],
    mensagemCorrecao: "",
    observacao: "Paciente com alta recente de internação.",
    historico: ["Solicitação criada", "Agendada", "Em atendimento"],
  },
  {
    id: 5,
    paciente: "Sueli Martins",
    idade: 82,
    bairro: "Olímpico",
    endereco: "Rua Bahia, 77",
    telefone: "(11) 95555-7788",
    motivo: "Acompanhamento de rotina",
    tipo: "Visita preventiva",
    profissional: "Carla Souza",
    data: "2026-10-28",
    horario: "08:00",
    prioridade: "Média",
    status: "Agendada",
    inconsistencias: [],
    mensagemCorrecao: "",
    observacao: "",
    historico: ["Solicitação criada", "Agendada"],
  },
  {
    id: 6,
    paciente: "Paulo Santos",
    idade: 56,
    bairro: "Barcelona",
    endereco: "Rua Espanha, 410",
    telefone: "(11) 94444-9900",
    motivo: "Retorno após curativo",
    tipo: "Curativo",
    profissional: "Juliana Ribeiro",
    data: "2026-10-28",
    horario: "11:00",
    prioridade: "Média",
    status: "Concluída",
    inconsistencias: [],
    mensagemCorrecao: "",
    observacao: "",
    historico: ["Solicitação criada", "Agendada", "Concluída"],
  },
  {
    id: 7,
    paciente: "João Pedro Santos",
    idade: 68,
    bairro: "Riacho Grande",
    endereco: "Rua das Palmeiras",
    telefone: "(11) 98888-7777",
    motivo: "Acompanhamento de saúde",
    tipo: "Avaliação clínica",
    profissional: "Não definido",
    data: "2026-11-05",
    horario: "09:00",
    prioridade: "Média",
    status: "Com inconsistência",
    inconsistencias: [
      "O endereço informado está incompleto. É necessário confirmar o número da residência.",
    ],
    mensagemCorrecao: "",
    observacao: "",
    historico: [
      "Solicitação recebida",
      "Sistema identificou divergência nos dados do endereço",
    ],
  },
];

const equipeInicial = [
  {
    id: 1,
    nome: "Carla Souza",
    cargo: "Agente Comunitária de Saúde",
    regiao: "Centro",
    status: "Em atendimento",
  },
  {
    id: 2,
    nome: "Juliana Ribeiro",
    cargo: "Enfermeira",
    regiao: "Cerâmica",
    status: "Em atendimento",
  },
  {
    id: 3,
    nome: "Rafael Martins",
    cargo: "Enfermeiro",
    regiao: "Barcelona",
    status: "Disponível",
  },
  {
    id: 4,
    nome: "Carlos Mendes",
    cargo: "Médico",
    regiao: "Centro",
    status: "Em atendimento",
  },
  {
    id: 5,
    nome: "Marcos Lima",
    cargo: "Médico",
    regiao: "Fundação",
    status: "Disponível",
  },
  {
    id: 6,
    nome: "Fernanda Alves",
    cargo: "Agente Comunitária de Saúde",
    regiao: "Nova Gerty",
    status: "Disponível",
  },
];

const STATUS_VISITA = [
  "Recebida",
  "Com inconsistência",
  "Aguardando correção",
  "Em análise",
  "Agendada",
  "Em atendimento",
  "Concluída",
  "Cancelada",
];

const STATUS_PROF = ["Disponível", "Em atendimento", "Afastado"];

const TIPOS = [
  "Visita preventiva",
  "Acompanhamento domiciliar",
  "Curativo",
  "Avaliação clínica",
];

const PRIORIDADES = ["Alta", "Média", "Baixa"];
const ATIVAS = ["Agendada", "Em atendimento"];

function formatarData(data) {
  if (!data) return "Data não definida";

  const [ano, mes, dia] = data.split("-");
  return `${dia}/${mes}/${ano}`;
}

function contar(lista, campo) {
  const mapa = {};

  lista.forEach((v) => {
    const chave = v[campo] || "Não informado";
    mapa[chave] = (mapa[chave] || 0) + 1;
  });

  return Object.entries(mapa).sort((a, b) => b[1] - a[1]);
}

/* BADGES COM FUNDOS SUAVES E TEXTO PRETO */
function Badge({ children, tipo = "neutro" }) {
  const estilos = {
    neutro: {
      fundo: "#EAF3F7",
      texto: "#000000",
    },
    azul: {
      fundo: "#3563A7",
      texto: "#FFFFFF",
    },
    azulClaro: {
      fundo: "#EAF3F7",
      texto: "#000000",
    },
    verde: {
      fundo: "#023E8A",
      texto: "#FFFFFF",
    },
    amarelo: {
      fundo: "#3563A7",
      texto: "#FFFFFF",
    },
    vermelho: {
      fundo: "#0B1756",
      texto: "#FFFFFF",
    },
    roxo: {
      fundo: "#023E8A",
      texto: "#FFFFFF",
    },
  };

  const estilo = estilos[tipo] || estilos.neutro;

  return (
    <span
      className="inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold"
      style={{
        backgroundColor: estilo.fundo,
        borderColor: estilo.fundo,
        color: estilo.texto,
      }}
    >
      {children}
    </span>
  );
}

const corPrioridade = (prioridade) => {
  return prioridade === "Alta"
    ? "vermelho"
    : prioridade === "Média"
    ? "amarelo"
    : "verde";
};

const corStatus = (status) => {
  return status === "Concluída"
    ? "verde"
    : status === "Agendada"
    ? "azul"
    : status === "Em atendimento"
    ? "roxo"
    : status === "Em análise"
    ? "azulClaro"
    : status === "Cancelada"
    ? "neutro"
    : status === "Com inconsistência"
    ? "vermelho"
    : status === "Aguardando correção"
    ? "amarelo"
    : "neutro";
};

const inputCls =
  "w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-700 outline-none transition focus:border-[#3563A7] focus:ring-2 focus:ring-[#3563A7]/15";

function Campo({ label, children, className = "" }) {
  return (
    <div className={className}>
      <label className="mb-1.5 block text-xs font-semibold text-slate-600">
        {label}
      </label>
      {children}
    </div>
  );
}

function CardSecao({
  titulo,
  subtitulo,
  acao,
  children,
  className = "",
}) {
  return (
    <section
      className={`rounded-2xl border border-slate-100 bg-white p-5 shadow-sm ${className}`}
    >
      <div className="mb-5 flex items-start justify-between gap-3">
        <div>
          <h3 className="text-2xl font-bold text-[#0B1756]">{titulo}</h3>

          {subtitulo && (
            <p className="mt-1 text-base text-slate-400">{subtitulo}</p>
          )}
        </div>

        {acao}
      </div>

      {children}
    </section>
  );
}

function Barras({ dados }) {
  const max = Math.max(1, ...dados.map(([, qtd]) => qtd));

  if (!dados.length) {
    return (
      <p className="text-sm text-slate-400">
        Ainda não há dados para exibir.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {dados.map(([nome, qtd]) => (
        <div key={nome}>
          <div className="mb-1.5 flex justify-between gap-3 text-base">
            <span className="font-medium text-slate-600">{nome}</span>
            <strong className="text-[#0B1756]">{qtd}</strong>
          </div>

          <div className="h-2 overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-[#3563A7] transition-all"
              style={{ width: `${(qtd / max) * 100}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

function GraficoVisitas({ visitas }) {
  const [periodo, setPeriodo] = useState("30");
  const dias = periodo === "7" ? 7 : periodo === "30" ? 30 : 180;

  const pontos = useMemo(() => {
    const fim = new Date(`${HOJE}T12:00:00`);
    const buckets = [];

    if (dias === 180) {
      for (let i = 5; i >= 0; i--) {
        const d = new Date(fim.getFullYear(), fim.getMonth() - i, 1);

        buckets.push({
          chave: `${d.getFullYear()}-${String(
            d.getMonth() + 1
          ).padStart(2, "0")}`,
          label: d.toLocaleDateString("pt-BR", { month: "short" }),
          qtd: 0,
        });
      }

      visitas
        .filter((v) => v.status === "Concluída")
        .forEach((v) => {
          const b = buckets.find((x) => x.chave === v.data.slice(0, 7));
          if (b) b.qtd++;
        });
    } else {
      const total = dias === 7 ? 7 : 6;

      for (let i = total - 1; i >= 0; i--) {
        const d = new Date(fim);
        d.setDate(fim.getDate() - i);

        const chave = `${d.getFullYear()}-${String(
          d.getMonth() + 1
        ).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

        buckets.push({
          chave,
          label:
            dias === 7
              ? d.toLocaleDateString("pt-BR", { weekday: "short" })
              : d.toLocaleDateString("pt-BR", {
                  day: "2-digit",
                  month: "2-digit",
                }),
          qtd: 0,
        });
      }

      visitas
        .filter((v) => v.status === "Concluída")
        .forEach((v) => {
          const b = buckets.find((x) => x.chave === v.data);
          if (b) b.qtd++;
        });
    }

    return buckets;
  }, [visitas, dias]);

  const max = Math.max(1, ...pontos.map((p) => p.qtd));
  const width = 660;
  const height = 210;
  const padX = 30;
  const padY = 24;

  const coords = pontos.map((p, i) => ({
    ...p,
    x:
      padX +
      (pontos.length === 1
        ? 0
        : (i * (width - padX * 2)) / (pontos.length - 1)),
    y: height - padY - (p.qtd / max) * (height - padY * 2),
  }));

  const linha = coords.map((p) => `${p.x},${p.y}`).join(" ");
  const area = `${padX},${height - padY} ${linha} ${
    width - padX
  },${height - padY}`;

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div className="inline-flex items-center gap-3 rounded-2xl border border-[#D5E5F1] bg-[#DCE9FB] px-4 py-2">
          <p className="text-2xl font-bold tracking-tight text-[#0B1756]">
            {visitas.filter((v) => v.status === "Concluída").length}
          </p>
          <p className="whitespace-nowrap text-xs font-medium text-[#3563A7]">
            visitas concluídas nos registros atuais
          </p>
        </div>

        <div className="flex rounded-xl bg-slate-100 p-1">
          {[["7", "7 dias"], ["30", "30 dias"], ["180", "6 meses"]].map(
            ([val, label]) => (
              <button
                key={val}
                type="button"
                onClick={() => setPeriodo(val)}
                className={`rounded-lg px-3 py-2 text-xs font-semibold transition ${
                  periodo === val
                    ? "bg-white text-[#17418E] shadow-sm"
                    : "text-slate-500 hover:text-[#17418E]"
                }`}
              >
                {label}
              </button>
            )
          )}
        </div>
      </div>

      <div className="w-full overflow-hidden">
        <svg
          viewBox={`0 0 ${width} ${height + 32}`}
          className="h-auto w-full"
          role="img"
          aria-label="Gráfico de visitas concluídas ao longo do tempo"
        >
          {[0, 1, 2, 3].map((i) => {
            const y = padY + (i * (height - padY * 2)) / 3;

            return (
              <line
                key={i}
                x1={padX}
                x2={width - padX}
                y1={y}
                y2={y}
                stroke="#E8EEF6"
                strokeDasharray="4 5"
              />
            );
          })}

          <polygon points={area} fill="#DCE9FB" opacity="0.8" />

          <polyline
            points={linha}
            fill="none"
            stroke="#17418E"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {coords.map((p) => (
            <g key={p.chave}>
              <circle
                cx={p.x}
                cy={p.y}
                r="4.5"
                fill="#FFFFFF"
                stroke="#17418E"
                strokeWidth="2.5"
              />
              <text
                x={p.x}
                y={height + 12}
                fill="#718198"
                fontSize="8"
                textAnchor="middle"
              >
                {p.label}
              </text>
            </g>
          ))}
        </svg>
      </div>
    </div>
  );
}

export default function GestaoVisitasPage() {
  const [aba, setAba] = useState("geral");
  const [visitas, setVisitas] = useState(visitasIniciais);
  const [equipe, setEquipe] = useState(equipeInicial);

  const [buscaVisita, setBuscaVisita] = useState("");
  const [filtroStatus, setFiltroStatus] = useState("Todos");
  const [filtroPrioridade, setFiltroPrioridade] = useState("Todas");
  const [filtroData, setFiltroData] = useState("");

  const [paginaAtual, setPaginaAtual] = useState(1);

  const [buscaProfissional, setBuscaProfissional] = useState("");
  const [filtroCargo, setFiltroCargo] = useState("Todos");
  const [filtroAgendaProf, setFiltroAgendaProf] = useState("Todos");

  const [visitaId, setVisitaId] = useState(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [aviso, setAviso] = useState(null);
  const [mensagemCorrecao, setMensagemCorrecao] = useState("");

  const [mesCalendario, setMesCalendario] = useState(
    new Date(`${HOJE}T12:00:00`)
  );
  const [diaSelecionado, setDiaSelecionado] = useState(HOJE);

  const formVazio = {
    paciente: "",
    idade: "",
    bairro: "",
    endereco: "",
    telefone: "",
    motivo: "",
    tipo: "Visita preventiva",
    profissional: "",
    data: HOJE,
    horario: "09:00",
    prioridade: "Média",
  };

  const [novaVisita, setNovaVisita] = useState(formVazio);

  const visitaDetalhe = visitas.find((v) => v.id === visitaId) || null;

  const pendentes = visitas.filter(
    (v) => v.status === "Com inconsistência"
  );

  const agendadas = visitas.filter((v) => v.status === "Agendada");

  const emAndamento = visitas.filter(
    (v) => v.status === "Em atendimento"
  );

  const concluidas = visitas.filter(
    (v) => v.status === "Concluída"
  );

  const altaPrioridade = visitas.filter(
    (v) =>
      v.prioridade === "Alta" &&
      !["Concluída", "Cancelada"].includes(v.status)
  );

  const visitasHoje = visitas.filter(
    (v) => v.data === HOJE && v.status !== "Cancelada"
  );

  const cargaPorProf = useMemo(() => {
    const mapa = {};

    visitas.forEach((v) => {
      if (ATIVAS.includes(v.status)) {
        mapa[v.profissional] = (mapa[v.profissional] || 0) + 1;
      }
    });

    return mapa;
  }, [visitas]);

  const porBairro = useMemo(
    () =>
      contar(
        visitas.filter((v) => v.status !== "Cancelada"),
        "bairro"
      ),
    [visitas]
  );

  const porTipo = useMemo(
    () =>
      contar(
        visitas.filter((v) => v.status !== "Cancelada"),
        "tipo"
      ),
    [visitas]
  );

  const visitasFiltradas = useMemo(() => {
    const termo = buscaVisita.toLowerCase().trim();
    const ordem = { Alta: 0, Média: 1, Baixa: 2 };

    return visitas
      .filter(
        (v) =>
          [
            v.paciente,
            v.bairro,
            v.motivo,
            v.profissional,
            v.tipo,
            v.endereco,
          ].some((c) => (c || "").toLowerCase().includes(termo)) &&
          (filtroStatus === "Todos" || v.status === filtroStatus) &&
          (filtroPrioridade === "Todas" ||
            v.prioridade === filtroPrioridade) &&
          (!filtroData || v.data === filtroData)
      )
      .sort(
        (a, b) =>
          ordem[a.prioridade] - ordem[b.prioridade] ||
          `${a.data} ${a.horario}`.localeCompare(
            `${b.data} ${b.horario}`
          )
      );
  }, [
    visitas,
    buscaVisita,
    filtroStatus,
    filtroPrioridade,
    filtroData,
  ]);

  useEffect(() => {
    setPaginaAtual(1);
  }, [buscaVisita, filtroStatus, filtroPrioridade, filtroData]);

  const totalPaginas = Math.ceil(
    visitasFiltradas.length / ITENS_POR_PAGINA
  );

  const visitasPaginadas = visitasFiltradas.slice(
    (paginaAtual - 1) * ITENS_POR_PAGINA,
    paginaAtual * ITENS_POR_PAGINA
  );

  const equipeFiltrada = useMemo(() => {
    const termo = buscaProfissional.toLowerCase().trim();

    return equipe.filter(
      (p) =>
        [p.nome, p.cargo, p.regiao].some((c) =>
          c.toLowerCase().includes(termo)
        ) &&
        (filtroCargo === "Todos" || p.cargo === filtroCargo)
    );
  }, [equipe, buscaProfissional, filtroCargo]);

  const visitasDoDia = useMemo(
    () =>
      visitas
        .filter(
          (v) =>
            v.data === diaSelecionado &&
            v.status !== "Cancelada" &&
            (filtroAgendaProf === "Todos" ||
              v.profissional === filtroAgendaProf)
        )
        .sort((a, b) => a.horario.localeCompare(b.horario)),
    [visitas, diaSelecionado, filtroAgendaProf]
  );

  const diasCalendario = useMemo(() => {
    const ano = mesCalendario.getFullYear();
    const mes = mesCalendario.getMonth();
    const primeiro = new Date(ano, mes, 1);
    const deslocamento = (primeiro.getDay() + 6) % 7;
    const quantidade = new Date(ano, mes + 1, 0).getDate();
    const itens = [];

    for (let i = 0; i < deslocamento; i++) {
      itens.push({ chave: `vazio-${i}`, vazio: true });
    }

    for (let dia = 1; dia <= quantidade; dia++) {
      const data = `${ano}-${String(mes + 1).padStart(
        2,
        "0"
      )}-${String(dia).padStart(2, "0")}`;

      const qtd = visitas.filter(
        (v) =>
          v.data === data &&
          v.status !== "Cancelada" &&
          (filtroAgendaProf === "Todos" ||
            v.profissional === filtroAgendaProf)
      ).length;

      itens.push({ chave: data, data, dia, qtd });
    }

    return itens;
  }, [mesCalendario, visitas, filtroAgendaProf]);

  function mostrarAviso(texto, tipo = "ok") {
    setAviso({ texto, tipo });
    setTimeout(() => setAviso(null), 3500);
  }

  function conflito(id, profissional, data, horario) {
    return visitas.find(
      (v) =>
        v.id !== id &&
        v.profissional === profissional &&
        v.data === data &&
        v.horario === horario &&
        ATIVAS.includes(v.status)
    );
  }

  function atualizarVisita(id, patch, log) {
    const atual = visitas.find((v) => v.id === id);
    if (!atual) return false;

    const prof = patch.profissional ?? atual.profissional;
    const data = patch.data ?? atual.data;
    const horario = patch.horario ?? atual.horario;
    const statusFinal = patch.status ?? atual.status;

    if (
      ATIVAS.includes(statusFinal) &&
      conflito(id, prof, data, horario)
    ) {
      mostrarAviso(
        `${prof} já tem uma visita em ${formatarData(
          data
        )} às ${horario}.`,
        "erro"
      );
      return false;
    }

    setVisitas((atuais) =>
      atuais.map((v) =>
        v.id === id
          ? {
              ...v,
              ...patch,
              historico: log
                ? [...v.historico, log]
                : v.historico,
            }
          : v
      )
    );

    return true;
  }

  function solicitarCorrecao(v) {
    if (!mensagemCorrecao.trim()) {
      mostrarAviso(
        "Escreva o que o cliente precisa corrigir.",
        "erro"
      );
      return;
    }

    setVisitas((atuais) =>
      atuais.map((item) =>
        item.id === v.id
          ? {
              ...item,
              status: "Aguardando correção",
              mensagemCorrecao: mensagemCorrecao.trim(),
              historico: [
                ...item.historico,
                "Solicitação devolvida ao cliente: " +
                  mensagemCorrecao.trim(),
              ],
            }
          : item
      )
    );

    setMensagemCorrecao("");
    setVisitaId(null);
    mostrarAviso("Solicitação devolvida ao cliente para correção.");
  }

  function registrarRetornoCliente(id) {
    setVisitas((atuais) =>
      atuais.map((v) =>
        v.id === id
          ? {
              ...v,
              status: "Em análise",
              historico: [
                ...v.historico,
                "Cliente corrigiu as informações e reenviou a solicitação.",
              ],
            }
          : v
      )
    );

    mostrarAviso("Correção recebida. Solicitação voltou para análise.");
  }

  function cadastrarVisita(e) {
    e.preventDefault();

    if (
      conflito(
        null,
        novaVisita.profissional,
        novaVisita.data,
        novaVisita.horario
      )
    ) {
      mostrarAviso(
        `${novaVisita.profissional} já tem uma visita nesse horário.`,
        "erro"
      );
      return;
    }

    const registro = {
      ...novaVisita,
      id: Math.max(0, ...visitas.map((v) => v.id)) + 1,
      idade: Number(novaVisita.idade),
      status: "Recebida",
      inconsistencias: [],
      mensagemCorrecao: "",
      observacao: "",
      historico: [
        "Solicitação registrada pelo administrador",
        "Aguardando avaliação",
      ],
    };

    setVisitas((a) => [registro, ...a]);

    setNovaVisita({
      ...formVazio,
      profissional: "",
    });

    setMostrarFormulario(false);
    setAba("visitas");
    setPaginaAtual(1);
    mostrarAviso("Solicitação registrada com sucesso.");
  }

  function alterarStatusProf(id, status) {
    setEquipe((a) =>
      a.map((p) => (p.id === id ? { ...p, status } : p))
    );
  }

  function exportarCSV() {
    const cab = [
      "Paciente",
      "Idade",
      "Bairro",
      "Endereço",
      "Telefone",
      "Motivo",
      "Tipo",
      "Profissional",
      "Data",
      "Horário",
      "Prioridade",
      "Status",
    ];

    const linhas = visitasFiltradas.map((v) =>
      [
        v.paciente,
        v.idade,
        v.bairro,
        v.endereco,
        v.telefone,
        v.motivo,
        v.tipo,
        v.profissional,
        formatarData(v.data),
        v.horario,
        v.prioridade,
        v.status,
      ]
        .map((c) => `"${String(c ?? "").replace(/"/g, '""')}"`)
        .join(";")
    );

    const blob = new Blob(
      ["\uFEFF" + [cab.join(";"), ...linhas].join("\n")],
      { type: "text/csv;charset=utf-8;" }
    );

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "visitas-domiciliares.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  const abas = [
    { id: "geral", titulo: "Visão geral", sub: "Indicadores e panorama" },
    { id: "visitas", titulo: "Todas as visitas", sub: "Busca e gerenciamento" },
    { id: "agenda", titulo: "Agenda", sub: "Calendário de visitas" },
    { id: "equipe", titulo: "Equipe", sub: "Profissionais e disponibilidade" },
  ];

  return (
    <div className="min-h-screen bg-[#EEF5F9] font-sans text-[#0B1756]">
      <div className="pointer-events-none fixed -right-36 -top-36 h-96 w-96 rounded-full border-[64px] border-[#D9E8FA]/60" />
      <div className="pointer-events-none fixed -bottom-40 -left-32 h-96 w-96 rounded-full bg-white/70" />

      <main className="relative z-10 mx-auto max-w-[1400px] space-y-7 px-4 py-7 sm:px-6 lg:px-8">
        {/* Cabeçalho e navegação */}

        <section className="relative pb-0">
          <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-[#023E8A] via-[#3563A7] to-[#0B1756] px-7 pb-20 pt-7 shadow-sm sm:px-10 sm:pt-9 sm:pb-22">
            <div className="pointer-events-none absolute -right-16 -top-24 h-80 w-80 rounded-full border-[48px] border-white/[0.06]" />
            <div className="pointer-events-none absolute right-[25%] top-20 h-72 w-72 rounded-full border-[45px] border-white/[0.05]" />

            <div className="relative z-10 flex flex-col justify-between gap-7 lg:flex-row lg:items-center">
              <div className="max-w-3xl">
                <h1 className="mt-5 text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl lg:text-[42px]">
                  Gestão de visitas domiciliares
                </h1>

                <p className="mt-3 max-w-3xl text-sm leading-7 text-white/85 sm:text-base lg:text-lg">
                  Organize as solicitações, acompanhe os atendimentos e
                  distribua as visitas entre as equipes de saúde.
                </p>
              </div>

              <div className="flex shrink-0 flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setMostrarFormulario((v) => !v);

                    if (!mostrarFormulario) {
                      setTimeout(
                        () =>
                          document
                            .getElementById("form-visita")
                            ?.scrollIntoView({
                              behavior: "smooth",
                              block: "center",
                            }),
                        50
                      );
                    }
                  }}
                  className="rounded-2xl bg-white px-5 py-3.5 text-sm font-semibold text-[#0B1756] shadow-sm transition hover:bg-[#EAF3F7]"
                >
                  {mostrarFormulario
                    ? "Fechar formulário"
                    : "+ Nova solicitação"}
                </button>

                <button
                  type="button"
                  onClick={exportarCSV}
                  className="rounded-2xl border border-white/25 bg-white/10 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-white/20"
                >
                  Exportar CSV
                </button>
              </div>
            </div>
          </div>

          <nav
            className="relative z-20 -mt-[72px] grid grid-cols-1 gap-3 px-4 sm:grid-cols-2 lg:grid-cols-4 sm:px-6"
            aria-label="Seções de gestão"
          >
            {abas.map((a) => (
              <button
                key={a.id}
                type="button"
                onClick={() => setAba(a.id)}
                className={`flex min-h-[90px] flex-col justify-center rounded-[24px] border bg-white px-5 py-3 text-left shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-md ${
                  aba === a.id
                    ? "border-[#3563A7] ring-1 ring-[#3563A7]/20"
                    : "border-[#EAF3F7] hover:border-[#3563A7]/40"
                }`}
              >
                <span className="text-base font-bold text-[#0B1756]">
                  {a.titulo}
                </span>
                <span className="mt-1 text-sm text-[#3563A7]">{a.sub}</span>
              </button>
            ))}
          </nav>
        </section>

        {/* Formulário de nova solicitação */}

        {mostrarFormulario && (
          <CardSecao
            titulo="Nova solicitação de visita domiciliar"
            subtitulo="Registre a demanda para acompanhamento da equipe."
          >
            <form
              id="form-visita"
              onSubmit={cadastrarVisita}
              className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
            >
              <Campo label="Nome do paciente">
                <input
                  required
                  value={novaVisita.paciente}
                  onChange={(e) =>
                    setNovaVisita({ ...novaVisita, paciente: e.target.value })
                  }
                  placeholder="Nome completo"
                  className={inputCls}
                />
              </Campo>

              <Campo label="Idade">
                <input
                  required
                  type="number"
                  min="0"
                  value={novaVisita.idade}
                  onChange={(e) =>
                    setNovaVisita({ ...novaVisita, idade: e.target.value })
                  }
                  placeholder="Idade"
                  className={inputCls}
                />
              </Campo>

              <Campo label="Telefone">
                <input
                  value={novaVisita.telefone}
                  onChange={(e) =>
                    setNovaVisita({ ...novaVisita, telefone: e.target.value })
                  }
                  placeholder="(11) 90000-0000"
                  className={inputCls}
                />
              </Campo>

              <Campo label="Bairro">
                <input
                  required
                  value={novaVisita.bairro}
                  onChange={(e) =>
                    setNovaVisita({ ...novaVisita, bairro: e.target.value })
                  }
                  placeholder="Bairro do paciente"
                  className={inputCls}
                />
              </Campo>

              <Campo label="Endereço">
                <input
                  required
                  value={novaVisita.endereco}
                  onChange={(e) =>
                    setNovaVisita({ ...novaVisita, endereco: e.target.value })
                  }
                  placeholder="Rua, número e complemento"
                  className={inputCls}
                />
              </Campo>

              <Campo label="Motivo da visita">
                <input
                  required
                  value={novaVisita.motivo}
                  onChange={(e) =>
                    setNovaVisita({ ...novaVisita, motivo: e.target.value })
                  }
                  placeholder="Necessidade relatada"
                  className={inputCls}
                />
              </Campo>

              <Campo label="Tipo de atendimento">
                <select
                  value={novaVisita.tipo}
                  onChange={(e) =>
                    setNovaVisita({ ...novaVisita, tipo: e.target.value })
                  }
                  className={inputCls}
                >
                  {TIPOS.map((t) => (
                    <option key={t}>{t}</option>
                  ))}
                </select>
              </Campo>

              <Campo label="Prioridade sugerida">
                <select
                  value={novaVisita.prioridade}
                  onChange={(e) =>
                    setNovaVisita({
                      ...novaVisita,
                      prioridade: e.target.value,
                    })
                  }
                  className={inputCls}
                >
                  {PRIORIDADES.slice().reverse().map((p) => (
                    <option key={p}>{p}</option>
                  ))}
                </select>
              </Campo>

              <Campo label="Profissional sugerido">
                <select
                  value={novaVisita.profissional}
                  onChange={(e) =>
                    setNovaVisita({
                      ...novaVisita,
                      profissional: e.target.value,
                    })
                  }
                  className={inputCls}
                >
                  <option value="">Selecione um profissional</option>
                  {equipe
                    .filter((p) => p.status !== "Afastado")
                    .map((p) => (
                      <option key={p.id} value={p.nome}>
                        {p.nome} — {p.cargo}
                      </option>
                    ))}
                </select>
              </Campo>

              <Campo label="Data sugerida">
                <input
                  required
                  type="date"
                  min={HOJE}
                  value={novaVisita.data}
                  onChange={(e) =>
                    setNovaVisita({ ...novaVisita, data: e.target.value })
                  }
                  className={inputCls}
                />
              </Campo>

              <Campo label="Horário sugerido">
                <input
                  required
                  type="time"
                  value={novaVisita.horario}
                  onChange={(e) =>
                    setNovaVisita({ ...novaVisita, horario: e.target.value })
                  }
                  className={inputCls}
                />
              </Campo>

              <div className="flex items-end gap-2">
                <button
                  type="button"
                  onClick={() => setMostrarFormulario(false)}
                  className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  className="rounded-xl bg-[#17418E] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#0B1756]"
                >
                  Registrar solicitação
                </button>
              </div>
            </form>

            <p className="mt-4 text-xs leading-5 text-slate-400">
              O registro feito pelo administrador não substitui a avaliação
              da solicitação nem define prioridade clínica automaticamente.
            </p>
          </CardSecao>
        )}

        {/* VISÃO GERAL */}

        {aba === "geral" && (
          <div className="space-y-6">
            <div>
              <h1 className="text-4xl font-bold tracking-tight text-[#0B1756]">
                Panorama das visitas
              </h1>
              <p className="mt-1 text-base text-slate-500">
                Indicadores para entender a demanda e acompanhar o fluxo de
                atendimento.
              </p>
            </div>

            <section className="overflow-hidden rounded-2xl border border-[#1D4C91] bg-gradient-to-r from-[#023E8A] via-[#3563A7] to-[#0B1756] p-5 text-white shadow-lg sm:p-6">
              <div className="grid grid-cols-2 gap-y-5 lg:grid-cols-4 lg:gap-y-0">
                {[
                  { titulo: "Solicitações pendentes", valor: pendentes.length },
                  { titulo: "Visitas agendadas", valor: agendadas.length },
                  { titulo: "Em andamento", valor: emAndamento.length },
                  { titulo: "Concluídas", valor: concluidas.length },
                ].map((k, i) => (
                  <div
                    key={k.titulo}
                    className={`px-3 sm:px-5 ${
                      i % 2 === 1 ? "border-l border-white/20" : ""
                    } ${
                      i >= 2
                        ? "border-t border-white/20 pt-5 lg:border-t-0 lg:pt-0"
                        : ""
                    } ${i === 2 ? "lg:border-l" : ""}`}
                  >
                    <p className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
                      {k.valor}
                    </p>
                    <p className="mt-2 text-base font-semibold leading-5 text-white sm:text-lg">
                      {k.titulo}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            <CardSecao
              titulo="Evolução das visitas concluídas"
              subtitulo="Acompanhe o volume de atendimentos ao longo do tempo."
            >
              <GraficoVisitas visitas={visitas} />
            </CardSecao>

            <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
              <CardSecao
                titulo="Visitas por bairro"
                subtitulo="Regiões com maior demanda"
              >
                <Barras dados={porBairro} />
              </CardSecao>

              <CardSecao
                titulo="Visitas por tipo"
                subtitulo="Distribuição dos atendimentos"
              >
                <Barras dados={porTipo} />
              </CardSecao>
            </div>

            <CardSecao
              titulo="Solicitações com inconsistências"
              subtitulo="Solicitações que precisam de avaliação antes de continuar o atendimento."
              acao={
                <Badge tipo={pendentes.length ? "vermelho" : "verde"}>
                  {pendentes.length} pendente(s)
                </Badge>
              }
            >
              {pendentes.length ? (
                <div className="divide-y divide-slate-100">
                  {pendentes.map((v) => (
                    <div
                      key={v.id}
                      className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div>
                        <p className="text-lg font-semibold text-[#0B1756]">
                          {v.paciente}
                          <span className="font-normal text-slate-500">
                            {" "}· {v.idade} anos
                          </span>
                        </p>

                        <p className="mt-2 text-base text-slate-600">
                          {v.motivo} · {v.bairro}
                        </p>

                        <div className="mt-3 flex flex-wrap items-center gap-3">
                          <Badge tipo="vermelho">
                            <span className="text-sm">
                              Revisão necessária
                            </span>
                          </Badge>

                          <Badge>
                            <span className="text-sm">
                              {formatarData(v.data)}
                            </span>
                          </Badge>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          setMensagemCorrecao("");
                          setVisitaId(v.id);
                        }}
                        className="rounded-lg border border-[#3563A7] px-5 py-2.5 text-sm font-semibold text-[#3563A7] transition hover:bg-[#EAF3F7]"
                      >
                        Ver detalhes
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="py-3 text-sm text-slate-400">
                  Nenhuma solicitação com inconsistências no momento.
                </p>
              )}
            </CardSecao>
          </div>
        )}

        {/* TODAS AS VISITAS */}

        {aba === "visitas" && (
          <section className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
            <div className="border-b border-slate-100 bg-white p-4">
              <h2 className="text-lg font-bold text-[#0B1756]">
                Todas as visitas
              </h2>
              <p className="mt-1 text-sm text-slate-400">
                Pesquise e gerencie solicitações e atendimentos registrados.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3 border-y border-slate-100 bg-slate-50/60 p-4 sm:grid-cols-2 lg:grid-cols-5">
              <input
                value={buscaVisita}
                onChange={(e) => setBuscaVisita(e.target.value)}
                placeholder="Buscar paciente, bairro, profissional..."
                className={`${inputCls} lg:col-span-2`}
              />

              <select
                value={filtroStatus}
                onChange={(e) => setFiltroStatus(e.target.value)}
                className={inputCls}
              >
                <option value="Todos">Todos os status</option>
                {STATUS_VISITA.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>

              <select
                value={filtroPrioridade}
                onChange={(e) => setFiltroPrioridade(e.target.value)}
                className={inputCls}
              >
                <option value="Todas">Todas as prioridades</option>
                {PRIORIDADES.map((p) => (
                  <option key={p}>{p}</option>
                ))}
              </select>

              <input
                type="date"
                value={filtroData}
                onChange={(e) => setFiltroData(e.target.value)}
                className={inputCls}
              />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 px-5 py-3 text-sm text-slate-500">
              {(buscaVisita ||
                filtroStatus !== "Todos" ||
                filtroPrioridade !== "Todas" ||
                filtroData) && (
                <button
                  type="button"
                  onClick={() => {
                    setBuscaVisita("");
                    setFiltroStatus("Todos");
                    setFiltroPrioridade("Todas");
                    setFiltroData("");
                    setPaginaAtual(1);
                  }}
                  className="font-semibold text-[#17418E] hover:underline"
                >
                  Limpar filtros
                </button>
              )}
            </div>

            {/* TABELA */}
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-sm">
                <thead className="border-y border-slate-100 bg-slate-50 text-xs uppercase text-slate-600">
                  <tr>
                    {[
                      "Paciente",
                      "Motivo / atendimento",
                      "Bairro",
                      "Profissional",
                      "Data / horário",
                      "Prioridade",
                      "Status",
                      "Ação",
                    ].map((t) => (
                      <th
                        key={t}
                        className="whitespace-nowrap px-4 py-4 font-bold"
                      >
                        {t}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                  {visitasPaginadas.map((v) => (
                    <tr
                      key={v.id}
                      className="transition hover:bg-slate-50/70"
                    >
                      <td className="px-4 py-4">
                        <p className="text-base font-semibold text-[#0B1756]">
                          {v.paciente}
                        </p>
                        <span className="mt-1 block text-sm text-slate-500">
                          {v.idade} anos
                        </span>
                      </td>

                      <td className="min-w-48 px-4 py-4">
                        <p className="text-base font-semibold text-slate-700">
                          {v.motivo}
                        </p>
                        <span className="mt-1 block text-sm text-slate-500">
                          {v.tipo}
                        </span>
                      </td>

                      <td className="px-4 py-4 text-base font-medium text-slate-700">
                        {v.bairro}
                      </td>

                      <td className="whitespace-nowrap px-4 py-4 text-sm text-slate-700">
                        {v.profissional}
                      </td>

                      <td className="whitespace-nowrap px-4 py-4">
                        <p className="text-sm font-medium text-slate-700">
                          {formatarData(v.data)}
                        </p>
                        <span className="mt-1 block text-sm text-slate-500">
                          {v.horario}
                        </span>
                      </td>

                      <td className="px-4 py-4">
                        <Badge tipo={corPrioridade(v.prioridade)}>
                          {v.prioridade}
                        </Badge>
                      </td>

                      <td className="px-4 py-4">
                        <Badge tipo={corStatus(v.status)}>
                          {v.status}
                        </Badge>
                      </td>

                      <td className="px-4 py-4">
                        <button
                          type="button"
                          onClick={() => {
                            setMensagemCorrecao("");
                            setVisitaId(v.id);
                          }}
                          className="whitespace-nowrap rounded-lg border border-[#D5E0ED] px-4 py-2.5 text-sm font-semibold text-[#17418E] transition hover:bg-[#F2F6FB]"
                        >
                          Detalhes
                        </button>
                      </td>
                    </tr>
                  ))}

                  {visitasFiltradas.length === 0 && (
                    <tr>
                      <td
                        colSpan={8}
                        className="py-10 text-center text-base text-slate-500"
                      >
                        Nenhuma visita encontrada com esses filtros.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* PAGINAÇÃO */}
            {visitasFiltradas.length > 0 && (
              <div className="flex flex-col gap-3 border-t border-slate-100 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-slate-600">
                  Mostrando{" "}
                  <span className="font-semibold text-[#0B1756]">
                    {(paginaAtual - 1) * ITENS_POR_PAGINA + 1}
                  </span>
                  {" "}a{" "}
                  <span className="font-semibold text-[#0B1756]">
                    {Math.min(
                      paginaAtual * ITENS_POR_PAGINA,
                      visitasFiltradas.length
                    )}
                  </span>
                  {" "}de{" "}
                  <span className="font-semibold text-[#0B1756]">
                    {visitasFiltradas.length}
                  </span>
                  {" "}visitas
                </p>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={paginaAtual === 1}
                    onClick={() =>
                      setPaginaAtual((pagina) => Math.max(1, pagina - 1))
                    }
                    className="rounded-lg border border-[#D5E0ED] px-4 py-2 text-sm font-semibold text-[#3563A7] transition hover:bg-[#EAF3F7] disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Anterior
                  </button>

                  <span className="min-w-[55px] px-2 text-center text-sm font-semibold text-[#0B1756]">
                    {paginaAtual} / {totalPaginas}
                  </span>

                  <button
                    type="button"
                    disabled={paginaAtual === totalPaginas}
                    onClick={() =>
                      setPaginaAtual((pagina) =>
                        Math.min(totalPaginas, pagina + 1)
                      )
                    }
                    className="rounded-lg border border-[#D5E0ED] px-4 py-2 text-sm font-semibold text-[#3563A7] transition hover:bg-[#EAF3F7] disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Próxima
                  </button>
                </div>
              </div>
            )}
          </section>
        )}

        {/* AGENDA */}

        {aba === "agenda" && (
          <div className="grid gap-5 xl:grid-cols-[1.25fr_0.75fr]">
            <CardSecao
              titulo="Calendário de visitas"
              subtitulo="Selecione um dia para consultar os atendimentos programados."
              acao={
                <select
                  value={filtroAgendaProf}
                  onChange={(e) => setFiltroAgendaProf(e.target.value)}
                  className="max-w-44 rounded-lg border border-slate-200 bg-white px-2 py-2 text-xs text-slate-600"
                >
                  <option value="Todos">Todas as equipes</option>
                  {equipe.map((p) => (
                    <option key={p.id}>{p.nome}</option>
                  ))}
                </select>
              }
            >
              <div className="mb-5 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() =>
                    setMesCalendario(
                      (d) => new Date(d.getFullYear(), d.getMonth() - 1, 1)
                    )
                  }
                  className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-[#17418E] hover:bg-slate-50"
                  aria-label="Mês anterior"
                >
                  ←
                </button>

                <h3 className="text-base font-bold capitalize text-[#0B1756]">
                  {mesCalendario.toLocaleDateString("pt-BR", {
                    month: "long",
                    year: "numeric",
                  })}
                </h3>

                <button
                  type="button"
                  onClick={() =>
                    setMesCalendario(
                      (d) => new Date(d.getFullYear(), d.getMonth() + 1, 1)
                    )
                  }
                  className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-[#17418E] hover:bg-slate-50"
                  aria-label="Próximo mês"
                >
                  →
                </button>
              </div>

              <div className="grid grid-cols-7 gap-1.5">
                {["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"].map(
                  (d) => (
                    <div
                      key={d}
                      className="py-2 text-center text-xs font-semibold text-slate-400"
                    >
                      {d}
                    </div>
                  )
                )}

                {diasCalendario.map((d) =>
                  d.vazio ? (
                    <div key={d.chave} />
                  ) : (
                    <button
                      key={d.chave}
                      type="button"
                      onClick={() => setDiaSelecionado(d.data)}
                      className={`flex min-h-[66px] flex-col items-center rounded-xl border p-2 transition sm:min-h-[78px] ${
                        diaSelecionado === d.data
                          ? "border-[#17418E] bg-[#EAF1FC] ring-1 ring-[#17418E]/20"
                          : "border-slate-100 bg-white hover:border-[#B8CBE4]"
                      }`}
                    >
                      <span
                        className={`text-sm ${
                          diaSelecionado === d.data
                            ? "font-bold text-[#17418E]"
                            : "text-slate-700"
                        }`}
                      >
                        {d.dia}
                      </span>

                      {d.qtd > 0 && (
                        <>
                          <span className="mt-1 rounded-full bg-[#17418E] px-2 py-0.5 text-[10px] font-semibold text-white">
                            {d.qtd}
                          </span>
                          <span className="mt-1 hidden text-[9px] text-slate-400 sm:block">
                            {d.qtd === 1 ? "visita" : "visitas"}
                          </span>
                        </>
                      )}
                    </button>
                  )
                )}
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-slate-500">
                <span className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#17418E]" />
                  Quantidade de visitas no dia
                </span>
                <span>Selecione uma data para ver a lista ao lado.</span>
              </div>
            </CardSecao>

            <CardSecao
              titulo="Visitas do dia"
              subtitulo={formatarData(diaSelecionado)}
              acao={
                <Badge tipo="azul">
                  {visitasDoDia.length} visita(s)
                </Badge>
              }
            >
              {visitasDoDia.length ? (
                <div className="divide-y divide-slate-100">
                  {visitasDoDia.map((v) => (
                    <button
                      key={v.id}
                      type="button"
                      onClick={() => {
                        setMensagemCorrecao("");
                        setVisitaId(v.id);
                      }}
                      className="flex w-full gap-3 py-4 text-left hover:bg-slate-50/70"
                    >
                      <span className="min-w-[58px] rounded-lg bg-[#EAF1FC] px-2 py-2 text-center text-xs font-bold text-[#17418E]">
                        {v.horario}
                      </span>

                      <span className="min-w-0 flex-1">
                        <span className="block font-semibold text-[#0B1756]">
                          {v.paciente}
                        </span>
                        <span className="mt-1 block text-sm text-slate-500">
                          {v.tipo} · {v.bairro}
                        </span>
                        <span className="mt-1 block text-xs text-slate-400">
                          {v.profissional}
                        </span>
                        <span className="mt-2 inline-flex">
                          <Badge tipo={corStatus(v.status)}>
                            {v.status}
                          </Badge>
                        </span>
                      </span>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="rounded-xl border border-dashed border-slate-200 px-4 py-10 text-center">
                  <p className="text-sm font-medium text-slate-600">
                    Nenhuma visita nesta data
                  </p>
                  <p className="mt-1 text-xs text-slate-400">
                    Selecione outro dia ou altere o filtro de equipe.
                  </p>
                </div>
              )}
            </CardSecao>
          </div>
        )}

        {/* EQUIPE */}

        {aba === "equipe" && (
          <section className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
            <div className="border-b border-slate-100 p-5">
              <h2 className="text-lg font-bold text-[#0B1756]">
                Equipe de atendimento
              </h2>
              <p className="mt-1 text-sm text-slate-400">
                Consulte a região, a disponibilidade e as visitas atribuídas
                a cada profissional.
              </p>
            </div>

            <div className="grid gap-3 border-b border-slate-100 bg-slate-50/60 p-4 sm:grid-cols-[1fr_260px]">
              <input
                value={buscaProfissional}
                onChange={(e) => setBuscaProfissional(e.target.value)}
                placeholder="Buscar por nome, cargo ou região..."
                className={inputCls}
              />

              <select
                value={filtroCargo}
                onChange={(e) => setFiltroCargo(e.target.value)}
                className={inputCls}
              >
                <option value="Todos">Todos os cargos</option>
                {[...new Set(equipe.map((p) => p.cargo))].map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-xs">
                <thead className="border-b border-slate-100 bg-slate-50 text-[10px] uppercase text-slate-500">
                  <tr>
                    {[
                      "Profissional",
                      "Cargo",
                      "Região de atendimento",
                      "Disponibilidade",
                      "Visitas atribuídas",
                    ].map((t) => (
                      <th
                        key={t}
                        className="whitespace-nowrap px-5 py-3 font-bold"
                      >
                        {t}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {equipeFiltrada.map((p) => {
                    const carga = cargaPorProf[p.nome] || 0;
                    const maiorCarga = Math.max(
                      1,
                      ...Object.values(cargaPorProf),
                      1
                    );

                    return (
                      <tr key={p.id} className="hover:bg-slate-50/70">
                        <td className="whitespace-nowrap px-5 py-4 font-semibold text-[#0B1756]">
                          {p.nome}
                        </td>
                        <td className="min-w-52 px-4 py-4 text-slate-500">
                          {p.cargo}
                        </td>
                        <td className="px-4 py-4">{p.regiao}</td>
                        <td className="px-4 py-4">
                          <select
                            value={p.status}
                            onChange={(e) =>
                              alterarStatusProf(p.id, e.target.value)
                            }
                            className="rounded-lg border border-slate-200 bg-white px-2.5 py-2 text-xs text-slate-600 outline-none focus:border-[#3563A7]"
                            aria-label={`Disponibilidade de ${p.nome}`}
                          >
                            {STATUS_PROF.map((s) => (
                              <option key={s}>{s}</option>
                            ))}
                          </select>
                        </td>
                        <td className="min-w-48 px-4 py-4">
                          <span className="font-semibold text-[#0B1756]">
                            {carga}
                          </span>
                          <span className="ml-1 text-slate-400">
                            {carga === 1 ? "visita ativa" : "visitas ativas"}
                          </span>
                          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-100">
                            <div
                              className="h-full rounded-full bg-[#3563A7]"
                              style={{
                                width: `${Math.min(
                                  100,
                                  (carga / maiorCarga) * 100
                                )}%`,
                              }}
                            />
                          </div>
                        </td>
                      </tr>
                    );
                  })}

                  {!equipeFiltrada.length && (
                    <tr>
                      <td
                        colSpan={5}
                        className="py-10 text-center text-slate-400"
                      >
                        Nenhum profissional encontrado.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </main>

      {/* MODAL DE DETALHES DA VISITA */}

      {visitaDetalhe && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#0B1756]/40 p-4 backdrop-blur-sm"
          onClick={() => setVisitaId(null)}
        >
          <div
            className="max-h-[90vh] w-full max-w-xl space-y-5 overflow-y-auto rounded-2xl bg-white p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-lg font-bold text-[#0B1756]">
                  {visitaDetalhe.paciente}
                </h3>

                <p className="mt-1 text-sm text-slate-400">
                  {visitaDetalhe.idade} anos · {visitaDetalhe.bairro}
                </p>

                
              </div>

              <button
                type="button"
                onClick={() => setVisitaId(null)}
                className="rounded-lg p-2 text-xl font-semibold text-slate-500 transition hover:bg-[#EAF3F7] hover:text-[#0B1756]"
                aria-label="Fechar"
              >
                ×
              </button>
            </div>

            <div className="space-y-2 rounded-xl bg-slate-50 p-4 text-sm text-slate-600">
              <p>
                <strong>Motivo:</strong> {visitaDetalhe.motivo}
              </p>
              <p>
                <strong>Tipo:</strong> {visitaDetalhe.tipo}
              </p>
              <p>
                <strong>Endereço:</strong>{" "}
                {visitaDetalhe.endereco || "Não informado"}
              </p>
              <p>
                <strong>Telefone:</strong>{" "}
                {visitaDetalhe.telefone || "Não informado"}
              </p>
            </div>

            {/* TRATAMENTO DAS INCONSISTÊNCIAS */}

            {visitaDetalhe.inconsistencias?.length > 0 && (
              <div className="space-y-4 rounded-xl border border-[#D5E5F1] bg-[#EAF3F7]/50 p-4">
                <div>
                  <h4 className="font-bold text-[#0B1756]">
                    Inconsistências identificadas
                  </h4>

                  <ul className="mt-2 list-disc space-y-2 pl-5 text-sm leading-6 text-slate-600">
                    {visitaDetalhe.inconsistencias.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>

                {visitaDetalhe.status === "Com inconsistência" && (
                  <>
                    <div>
                      <label className="mb-1.5 block text-xs font-semibold text-slate-600">
                        Mensagem para o cliente
                      </label>

                      <textarea
                        rows={4}
                        value={mensagemCorrecao}
                        onChange={(e) =>
                          setMensagemCorrecao(e.target.value)
                        }
                        placeholder="Explique o que precisa ser corrigido para que a solicitação possa continuar..."
                        className={inputCls}
                      />
                    </div>

                    <button
                      type="button"
                      onClick={() => solicitarCorrecao(visitaDetalhe)}
                      className="w-full rounded-xl bg-[#3563A7] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#023E8A]"
                    >
                      Solicitar correção ao cliente
                    </button>
                  </>
                )}

                {visitaDetalhe.status === "Aguardando correção" && (
                  <div className="space-y-3 rounded-xl bg-white p-4">
                    <Badge tipo="amarelo">
                      Aguardando correção do cliente
                    </Badge>

                    <div>
                      <p className="text-xs font-semibold text-slate-500">
                        Mensagem enviada ao cliente
                      </p>
                      <p className="mt-1 text-sm leading-6 text-slate-600">
                        {visitaDetalhe.mensagemCorrecao}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        registrarRetornoCliente(visitaDetalhe.id)
                      }
                      className="w-full rounded-xl border border-[#3563A7] px-4 py-2.5 text-sm font-semibold text-[#3563A7] hover:bg-[#EAF3F7]"
                    >
                      Simular correção e reenvio do cliente
                    </button>
                  </div>
                )}

                {visitaDetalhe.status === "Em análise" && (
                  <div className="rounded-xl bg-white p-3">
                    <Badge tipo="azulClaro">Em análise</Badge>
                    <p className="mt-2 text-sm text-slate-600">
                      A correção foi recebida. A solicitação voltou para
                      avaliação.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* DEMAIS INFORMAÇÕES E GERENCIAMENTO */}

            <div className="grid gap-4 sm:grid-cols-2">
              <Campo label="Profissional responsável">
                <select
                  value={visitaDetalhe.profissional}
                  onChange={(e) =>
                    atualizarVisita(
                      visitaDetalhe.id,
                      { profissional: e.target.value },
                      `Profissional alterado para ${e.target.value}`
                    )
                  }
                  className={inputCls}
                >
                  <option value="Não definido">Não definido</option>
                  {equipe.map((p) => (
                    <option key={p.id} value={p.nome}>
                      {p.nome} — {p.cargo}
                      {p.status === "Afastado" ? " (afastado)" : ""}
                    </option>
                  ))}
                </select>
              </Campo>

              <Campo label="Prioridade">
                <select
                  value={visitaDetalhe.prioridade}
                  onChange={(e) =>
                    atualizarVisita(
                      visitaDetalhe.id,
                      { prioridade: e.target.value },
                      `Prioridade alterada para ${e.target.value}`
                    )
                  }
                  className={inputCls}
                >
                  {PRIORIDADES.map((p) => (
                    <option key={p}>{p}</option>
                  ))}
                </select>
              </Campo>

              <Campo label="Data">
                <input
                  type="date"
                  min={HOJE}
                  value={visitaDetalhe.data}
                  onChange={(e) =>
                    e.target.value &&
                    atualizarVisita(
                      visitaDetalhe.id,
                      { data: e.target.value },
                      `Data alterada para ${formatarData(e.target.value)}`
                    )
                  }
                  className={inputCls}
                />
              </Campo>

              <Campo label="Horário">
                <input
                  type="time"
                  value={visitaDetalhe.horario}
                  onChange={(e) =>
                    e.target.value &&
                    atualizarVisita(
                      visitaDetalhe.id,
                      { horario: e.target.value },
                      `Horário alterado para ${e.target.value}`
                    )
                  }
                  className={inputCls}
                />
              </Campo>

              <Campo
                label="Observações internas"
                className="sm:col-span-2"
              >
                <textarea
                  rows={3}
                  value={visitaDetalhe.observacao || ""}
                  onChange={(e) =>
                    setVisitas((a) =>
                      a.map((v) =>
                        v.id === visitaDetalhe.id
                          ? { ...v, observacao: e.target.value }
                          : v
                      )
                    )
                  }
                  placeholder="Anotações administrativas"
                  className={inputCls}
                />
              </Campo>
            </div>

            <div className="border-t border-slate-100 pt-4">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                Histórico
              </p>

              <ol className="space-y-2 border-l-2 border-[#DCE8F8] pl-4 text-xs text-slate-500">
                {visitaDetalhe.historico.map((h, i) => (
                  <li key={i}>{h}</li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      )}

      {/* AVISOS */}

      {aviso && (
        <div
          role="status"
          className={`fixed bottom-5 left-1/2 z-[60] -translate-x-1/2 rounded-xl px-5 py-3 text-sm font-semibold text-white shadow-lg ${
            aviso.tipo === "erro" ? "bg-rose-600" : "bg-[#17418E]"
          }`}
        >
          {aviso.texto}
        </div>
      )}
    </div>
  );
}