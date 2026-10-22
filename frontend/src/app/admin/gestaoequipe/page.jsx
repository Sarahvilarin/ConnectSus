"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  AlertTriangle,
  Baby,
  Bone,
  Brain,
  CalendarDays,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Eye,
  HeartPulse,
  Hospital,
  Info,
  Mail,
  Pencil,
  Phone,
  Plane,
  Search,
  ShieldCheck,
  Stethoscope,
  Trash2,
  UserCheck,
  UserPlus,
  Users,
  X,
} from "lucide-react";

/*
  PALETA
  Texto:            #0B1756
  Botões:           #023E8A  (hover: #3563A7)
  Destaques/apoio:  #3563A7
*/

const especialidades = [
  { nome: "Clínica geral", Icone: Stethoscope },
  { nome: "Cardiologia", Icone: HeartPulse },
  { nome: "Neurologia", Icone: Brain },
  { nome: "Oftalmologia", Icone: Eye },
  { nome: "Pediatria", Icone: Baby },
  { nome: "Ortopedia", Icone: Bone },
];

const UNIDADES = [
  {
    id: 1,
    nome: "Hospital Municipal de Emergências Albert Sabin",
    especialidades: ["Clínica geral", "Cardiologia", "Neurologia", "Pediatria", "Ortopedia"],
  },
  {
    id: 2,
    nome: "Hospital Municipal Maria Braido",
    especialidades: ["Clínica geral", "Oftalmologia", "Pediatria", "Ortopedia"],
  },
  {
    id: 3,
    nome: "Atende Fácil Saúde Pedro Kassab",
    especialidades: ["Clínica geral", "Cardiologia", "Neurologia", "Oftalmologia"],
  },
];

const diasSemana = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
const statusLista = ["Ativo", "Em férias", "Afastado", "Inativo"];

const estiloStatus = {
  Ativo: { badge: "bg-emerald-100", ponto: "bg-emerald-600" },
  "Em férias": { badge: "bg-amber-100", ponto: "bg-amber-500" },
  Afastado: { badge: "bg-red-100", ponto: "bg-red-500" },
  Inativo: { badge: "bg-slate-200", ponto: "bg-slate-500" },
};

const equipeInicial = [
  {
    id: 1,
    nome: "Dra. Helena Duarte",
    especialidade: "Clínica geral",
    crm: "184520",
    unidadeId: 3,
    email: "helena.duarte@clinica.com",
    telefone: "(11) 98421-3370",
    dias: ["Seg", "Ter", "Qui"],
    status: "Ativo",
  },
  {
    id: 2,
    nome: "Dr. Rafael Nogueira",
    especialidade: "Cardiologia",
    crm: "152388",
    unidadeId: 1,
    email: "rafael.nogueira@clinica.com",
    telefone: "(11) 97733-1204",
    dias: ["Ter", "Qua", "Sex"],
    status: "Ativo",
  },
  {
    id: 3,
    nome: "Dra. Camila Barros",
    especialidade: "Neurologia",
    crm: "201477",
    unidadeId: 3,
    email: "camila.barros@clinica.com",
    telefone: "(11) 99120-4581",
    dias: ["Seg", "Qua"],
    status: "Em férias",
  },
  {
    id: 4,
    nome: "Dra. Júlia Andrade",
    especialidade: "Oftalmologia",
    crm: "173092",
    unidadeId: 2,
    email: "julia.andrade@clinica.com",
    telefone: "(11) 96655-8890",
    dias: ["Qui", "Sex", "Sáb"],
    status: "Ativo",
  },
  {
    id: 5,
    nome: "Dr. André Castro",
    especialidade: "Pediatria",
    crm: "165840",
    unidadeId: 1,
    email: "andre.castro@clinica.com",
    telefone: "(11) 95512-7743",
    dias: ["Seg", "Ter", "Qua", "Qui"],
    status: "Afastado",
  },
  {
    id: 6,
    nome: "Dr. Gustavo Ribeiro",
    especialidade: "Ortopedia",
    crm: "139216",
    unidadeId: 1,
    email: "gustavo.ribeiro@clinica.com",
    telefone: "(11) 98877-2109",
    dias: ["Ter", "Sex"],
    status: "Ativo",
  },
  {
    id: 7,
    nome: "Dra. Letícia Moura",
    especialidade: "Pediatria",
    crm: "190335",
    unidadeId: 2,
    email: "leticia.moura@clinica.com",
    telefone: "(11) 94408-6652",
    dias: ["Seg", "Qua", "Sex"],
    status: "Ativo",
  },
  {
    id: 8,
    nome: "Dr. Paulo Viana",
    especialidade: "Oftalmologia",
    crm: "128764",
    unidadeId: 3,
    email: "paulo.viana@clinica.com",
    telefone: "(11) 93321-9087",
    dias: ["Ter", "Qui"],
    status: "Inativo",
  },
];

const formVazio = {
  nome: "",
  especialidade: "",
  unidadeId: "",
  crm: "",
  email: "",
  telefone: "",
  dias: [],
  status: "Ativo",
};

function iniciais(nome) {
  const partes = nome.replace(/^(Dr\.|Dra\.)\s*/i, "").trim().split(/\s+/);
  const primeira = partes[0]?.[0] || "";
  const ultima = partes.length > 1 ? partes[partes.length - 1][0] : "";
  return (primeira + ultima).toUpperCase();
}

function formatarTelefone(valor) {
  const n = valor.replace(/\D/g, "").slice(0, 11);
  if (n.length <= 2) return n;
  if (n.length <= 7) return `(${n.slice(0, 2)}) ${n.slice(2)}`;
  return `(${n.slice(0, 2)}) ${n.slice(2, 7)}-${n.slice(7)}`;
}

const nomeUnidade = (id) => UNIDADES.find((u) => u.id === Number(id))?.nome || "";

const opcoesEspecialidade = [
  { valor: "Todas", texto: "Todas as especialidades" },
  ...especialidades.map((e) => ({ valor: e.nome, texto: e.nome })),
];

const opcoesUnidade = [
  { valor: "Todas", texto: "Todas as unidades" },
  ...UNIDADES.map((u) => ({ valor: String(u.id), texto: u.nome })),
];

/* Menu suspenso personalizado (mesmo visual da triagem).
   `opcoes` aceita textos simples ou objetos { valor, texto }.
   Abre para cima automaticamente quando falta espaço embaixo. */
function Dropdown({
  rotulo,
  valor,
  opcoes,
  onChange,
  placeholder = "Selecione",
  desabilitado = false,
  largura = "w-full",
  altura = "min-h-[44px]",
  larguraLista = "min-w-[170px]",
}) {
  const [aberto, setAberto] = useState(false);
  const [paraCima, setParaCima] = useState(false);
  const ref = useRef(null);

  const lista = opcoes.map((o) =>
    typeof o === "string" ? { valor: o, texto: o } : o
  );
  const atual = lista.find((o) => o.valor === valor);

  function alternar() {
    if (!aberto && ref.current) {
      const r = ref.current.getBoundingClientRect();
      const abaixo = window.innerHeight - r.bottom;
      setParaCima(abaixo < 280 && r.top > abaixo);
    }
    setAberto((a) => !a);
  }

  return (
    <div
      ref={ref}
      className={`relative ${largura}`}
      onKeyDown={(e) => e.key === "Escape" && setAberto(false)}
    >
      <button
        type="button"
        aria-label={rotulo}
        aria-haspopup="listbox"
        aria-expanded={aberto}
        disabled={desabilitado}
        onClick={alternar}
        className={`flex ${altura} w-full items-center justify-between gap-3 rounded-lg border bg-white px-4 py-2 text-left text-sm text-[#0B1756] transition focus:outline-none focus:ring-2 focus:ring-[#3563A7]/30 ${
          desabilitado
            ? "cursor-not-allowed border-[#3563A7]/40 opacity-60"
            : aberto
            ? "border-[#023E8A] ring-2 ring-[#3563A7]/30"
            : "border-[#3563A7]/40 hover:border-[#3563A7]"
        }`}
      >
        <span className={`min-w-0 truncate ${atual ? "" : "opacity-60"}`}>
          {atual ? atual.texto : placeholder}
        </span>

        <ChevronDown
          size={18}
          className={`shrink-0 transition-transform ${aberto ? "rotate-180" : ""}`}
        />
      </button>

      {aberto && !desabilitado && (
        <>
          <button
            type="button"
            aria-label="Fechar menu"
            onClick={() => setAberto(false)}
            className="fixed inset-0 z-10 cursor-default"
          />

          <div
            role="listbox"
            aria-label={rotulo}
            className={`absolute left-0 z-20 max-h-60 w-full ${larguraLista} overflow-y-auto rounded-xl border border-blue-100 bg-white p-1.5 shadow-xl ${
              paraCima ? "bottom-full mb-2" : "top-full mt-2"
            }`}
          >
            {lista.map((opcao) => {
              const selecionada = opcao.valor === valor;

              return (
                <button
                  key={opcao.valor}
                  type="button"
                  role="option"
                  aria-selected={selecionada}
                  onClick={() => {
                    onChange(opcao.valor);
                    setAberto(false);
                  }}
                  className={`flex w-full items-center justify-between gap-3 rounded-lg px-3 py-3 text-left text-sm text-[#0B1756] transition ${
                    selecionada
                      ? "bg-[#3563A7]/15 font-semibold"
                      : "hover:bg-[#3563A7]/10"
                  }`}
                >
                  <span>{opcao.texto}</span>

                  {selecionada && (
                    <Check size={17} className="shrink-0 text-[#023E8A]" />
                  )}
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

const POR_PAGINA = 9;

function paginasVisiveis(atual, total) {
  const nums = [...new Set([1, total, atual - 1, atual, atual + 1])]
    .filter((n) => n >= 1 && n <= total)
    .sort((a, b) => a - b);

  const saida = [];
  nums.forEach((n, i) => {
    if (i > 0 && n - nums[i - 1] > 1) saida.push(`...${n}`);
    saida.push(n);
  });
  return saida;
}

/* Paginação com setas (mesmo estilo dos botões da página) */
function Paginacao({ pagina, totalPaginas, totalItens, onChange }) {
  if (totalPaginas <= 1) return null;

  const inicio = (pagina - 1) * POR_PAGINA + 1;
  const fim = Math.min(pagina * POR_PAGINA, totalItens);

  const botao =
    "flex h-11 min-w-[44px] items-center justify-center rounded-xl border px-3 text-sm font-bold transition focus:outline-none focus:ring-4 focus:ring-[#3563A7]/30";

  return (
    <nav
      aria-label="Paginação"
      className="mt-7 flex flex-col items-center justify-between gap-4 sm:flex-row"
    >
      <p className="text-sm font-semibold">
        Mostrando {inicio}–{fim} de {totalItens}
      </p>

      <div className="flex items-center gap-2">
        <button
          type="button"
          aria-label="Página anterior"
          disabled={pagina === 1}
          onClick={() => onChange(pagina - 1)}
          className={`${botao} border-[#3563A7]/40 bg-white text-[#0B1756] hover:bg-[#3563A7]/10 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-white`}
        >
          <ChevronLeft size={20} />
        </button>

        {paginasVisiveis(pagina, totalPaginas).map((n) =>
          typeof n === "string" ? (
            <span key={n} className="px-1 text-sm font-bold">
              …
            </span>
          ) : (
            <button
              key={n}
              type="button"
              aria-label={`Página ${n}`}
              aria-current={n === pagina ? "page" : undefined}
              onClick={() => onChange(n)}
              className={`${botao} ${
                n === pagina
                  ? "border-[#023E8A] bg-[#023E8A] text-white"
                  : "border-[#3563A7]/40 bg-white text-[#0B1756] hover:bg-[#3563A7]/10"
              }`}
            >
              {n}
            </button>
          )
        )}

        <button
          type="button"
          aria-label="Próxima página"
          disabled={pagina === totalPaginas}
          onClick={() => onChange(pagina + 1)}
          className={`${botao} border-[#3563A7]/40 bg-white text-[#0B1756] hover:bg-[#3563A7]/10 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-white`}
        >
          <ChevronRight size={20} />
        </button>
      </div>
    </nav>
  );
}

/* Renderiza o conteúdo direto no <body>, acima do menu superior do site */
function Portal({ children }) {
  return createPortal(children, document.body);
}

export default function GestaoEquipe() {
  const [equipe, setEquipe] = useState(equipeInicial);
  const [busca, setBusca] = useState("");
  const [filtroEsp, setFiltroEsp] = useState("Todas");
  const [filtroUnidade, setFiltroUnidade] = useState("Todas");
  const [filtroStatus, setFiltroStatus] = useState("Todos");
  const [modalAberto, setModalAberto] = useState(false);
  const [editandoId, setEditandoId] = useState(null);
  const [form, setForm] = useState(formVazio);
  const [erro, setErro] = useState("");
  const [pagina, setPagina] = useState(1);
  const listaRef = useRef(null);
  const [remover, setRemover] = useState(null);

  const total = equipe.length;
  const ativos = equipe.filter((p) => p.status === "Ativo").length;
  const ausentes = equipe.filter(
    (p) => p.status === "Em férias" || p.status === "Afastado"
  ).length;
  const qtdEspecialidades = new Set(equipe.map((p) => p.especialidade)).size;

  const lista = equipe.filter((p) => {
    const termo = busca.trim().toLowerCase();
    const bateBusca =
      !termo ||
      p.nome.toLowerCase().includes(termo) ||
      `crm-sp ${p.crm}`.includes(termo);
    const bateEsp = filtroEsp === "Todas" || p.especialidade === filtroEsp;
    const bateStatus = filtroStatus === "Todos" || p.status === filtroStatus;
    const bateUnidade =
      filtroUnidade === "Todas" || p.unidadeId === Number(filtroUnidade);
    return bateBusca && bateEsp && bateUnidade && bateStatus;
  });

  const unidadesDoForm = form.especialidade
    ? UNIDADES.filter((u) => u.especialidades.includes(form.especialidade))
    : [];

  const totalPaginas = Math.max(1, Math.ceil(lista.length / POR_PAGINA));
  const paginaAtual = Math.min(pagina, totalPaginas);
  const visiveis = lista.slice(
    (paginaAtual - 1) * POR_PAGINA,
    paginaAtual * POR_PAGINA
  );

  // Volta para a primeira página quando os filtros mudam
  useEffect(() => {
    setPagina(1);
  }, [busca, filtroEsp, filtroUnidade, filtroStatus]);

  // Trava a rolagem da página enquanto um diálogo estiver aberto
  useEffect(() => {
    document.body.style.overflow = modalAberto || remover ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [modalAberto, remover]);

  // Fecha os diálogos com Esc
  useEffect(() => {
    function aoTeclar(e) {
      if (e.key === "Escape") {
        setModalAberto(false);
        setRemover(null);
      }
    }
    window.addEventListener("keydown", aoTeclar);
    return () => window.removeEventListener("keydown", aoTeclar);
  }, []);

  function mudarPagina(n) {
    setPagina(n);
    listaRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function abrirNovo() {
    setEditandoId(null);
    setForm(formVazio);
    setErro("");
    setModalAberto(true);
  }

  function abrirEdicao(p) {
    setEditandoId(p.id);
    setForm({ ...p, unidadeId: String(p.unidadeId) });
    setErro("");
    setModalAberto(true);
  }

  function atualizar(campo, valor) {
    setForm((atual) => ({ ...atual, [campo]: valor }));
  }

  function escolherEspecialidade(nome) {
    setForm((atual) => {
      const unidadeValida = UNIDADES.some(
        (u) => u.id === Number(atual.unidadeId) && u.especialidades.includes(nome)
      );
      return {
        ...atual,
        especialidade: nome,
        unidadeId: unidadeValida ? atual.unidadeId : "",
      };
    });
  }

  function alternarDia(dia) {
    setForm((atual) => ({
      ...atual,
      dias: atual.dias.includes(dia)
        ? atual.dias.filter((d) => d !== dia)
        : [...atual.dias, dia],
    }));
  }

  function salvar(event) {
    event.preventDefault();
    setErro("");

    if (form.nome.trim().length < 3) {
      setErro("Informe o nome completo do profissional.");
      return;
    }
    if (!form.especialidade) {
      setErro("Selecione a especialidade.");
      return;
    }
    if (!form.unidadeId) {
      setErro("Selecione a unidade de atendimento.");
      return;
    }
    if (!/^\d{6}$/.test(form.crm)) {
      setErro("O CRM deve ter exatamente 6 dígitos.");
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) {
      setErro("Informe um e-mail válido.");
      return;
    }
    if (form.dias.length === 0) {
      setErro("Selecione ao menos um dia de atendimento.");
      return;
    }

    const dados = {
      ...form,
      unidadeId: Number(form.unidadeId),
      nome: form.nome.trim(),
      crm: form.crm.trim(),
      email: form.email.trim(),
      dias: diasSemana.filter((d) => form.dias.includes(d)),
    };

    setEquipe((atuais) =>
      editandoId
        ? atuais.map((p) => (p.id === editandoId ? { ...dados, id: editandoId } : p))
        : [{ ...dados, id: Date.now() }, ...atuais]
    );
    setModalAberto(false);
  }

  function alterarStatus(id, status) {
    setEquipe((atuais) => atuais.map((p) => (p.id === id ? { ...p, status } : p)));
  }

  function confirmarRemocao() {
    setEquipe((atuais) => atuais.filter((p) => p.id !== remover.id));
    setRemover(null);
  }

  const cardBase = "rounded-xl border border-blue-100 bg-white shadow-sm";
  const campo =
    "w-full rounded-lg border border-[#3563A7]/40 bg-white px-4 py-3 text-sm text-[#0B1756] outline-none transition placeholder:text-[#0B1756]/50 focus:border-[#023E8A] focus:ring-2 focus:ring-[#3563A7]/30";
  const botaoPrimario =
    "inline-flex min-h-[50px] items-center justify-center gap-2 rounded-xl bg-[#023E8A] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#3563A7] focus:outline-none focus:ring-4 focus:ring-[#3563A7]/40";
  const botaoSecundario =
    "inline-flex min-h-[50px] items-center justify-center gap-2 rounded-xl border border-[#023E8A] bg-white px-6 py-3 text-sm font-bold text-[#023E8A] transition hover:bg-[#3563A7]/10 focus:outline-none focus:ring-4 focus:ring-[#3563A7]/30";

  return (
    <main className="relative isolate min-h-screen overflow-hidden bg-[#f5faff] text-[#0B1756]">
      {/* Fundo com ilustrações de círculos */}
      <div className="pointer-events-none absolute -right-28 -top-36 z-0 h-[430px] w-[430px] rounded-full bg-[#B8D6FC]/50" />
      <div className="pointer-events-none absolute -left-40 top-10 z-0 h-[330px] w-[330px] rounded-full border-2 border-[#C8DEFF]/60" />
      <div className="pointer-events-none absolute -bottom-36 -left-24 z-0 h-[350px] w-[350px] rounded-full bg-white/50" />
      <div className="pointer-events-none absolute -bottom-40 -right-24 z-0 h-[430px] w-[430px] rounded-full border-[70px] border-[#C5DFFF]/50" />

      <div className="relative z-10 mx-auto max-w-[1440px] px-4 py-7 sm:px-6 sm:py-9 lg:px-10 lg:py-10">
        {/* TÍTULO DA PÁGINA */}
        <section className="mb-8 flex flex-col justify-between gap-5 lg:flex-row lg:items-center">
          <div>
            <span className="mb-3 inline-flex items-center gap-2 rounded-full bg-[#3563A7]/15 px-4 py-1.5 text-xs font-bold uppercase tracking-wide text-[#0B1756]">
              <ShieldCheck size={15} />
              Administração
            </span>

            <h1 className="text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl lg:text-[42px]">
              Gestão de equipe
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-7 sm:text-base">
              Controle os profissionais de saúde: cadastre, edite dados, defina
              dias de atendimento e acompanhe a situação de cada um.
            </p>
          </div>

          <div className="flex max-w-md items-start gap-3 rounded-xl border border-[#3563A7]/40 bg-[#3563A7]/10 p-4">
            <Info className="mt-0.5 shrink-0 text-[#023E8A]" size={23} />
            <p className="text-sm leading-6">
              Alterações de status refletem na disponibilidade para novos
              agendamentos de consulta.
            </p>
          </div>
        </section>

        {/* INDICADORES */}
        <section className="mb-7 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {[
            { rotulo: "Profissionais", valor: total, Icone: Users },
            { rotulo: "Ativos", valor: ativos, Icone: UserCheck },
            { rotulo: "Férias ou afastados", valor: ausentes, Icone: Plane },
            { rotulo: "Especialidades", valor: qtdEspecialidades, Icone: Stethoscope },
          ].map(({ rotulo, valor, Icone }) => (
            <div key={rotulo} className={`${cardBase} flex items-center gap-4 p-4 sm:p-5`}>
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#3563A7]/10 text-[#023E8A]">
                <Icone size={25} />
              </div>
              <div>
                <p className="text-2xl font-extrabold leading-none sm:text-3xl">
                  {valor}
                </p>
                <p className="mt-1 text-xs font-semibold sm:text-sm">{rotulo}</p>
              </div>
            </div>
          ))}
        </section>

        {/* FILTROS */}
        <section className={`${cardBase} mb-7 p-4 sm:p-5`}>
          <div className="grid grid-cols-1 items-center gap-4 md:grid-cols-2 xl:grid-cols-[1fr_230px_300px_auto]">
            <div className="relative">
              <Search
                size={18}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#3563A7]"
              />
              <input
                type="search"
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                placeholder="Buscar por nome ou CRM..."
                aria-label="Buscar profissional"
                className={`${campo} pl-11`}
              />
            </div>

            <Dropdown
              rotulo="Filtrar por especialidade"
              valor={filtroEsp}
              opcoes={opcoesEspecialidade}
              onChange={setFiltroEsp}
              altura="min-h-[46px]"
            />

            <Dropdown
              rotulo="Filtrar por unidade"
              valor={filtroUnidade}
              opcoes={opcoesUnidade}
              onChange={setFiltroUnidade}
              altura="min-h-[46px]"
              larguraLista="min-w-[300px]"
            />

            <button
              type="button"
              onClick={abrirNovo}
              className={`${botaoPrimario} md:col-span-2 xl:col-span-1`}
            >
              <UserPlus size={19} />
              Novo profissional
            </button>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            {["Todos", ...statusLista].map((s) => (
              <button
                key={s}
                type="button"
                aria-pressed={filtroStatus === s}
                onClick={() => setFiltroStatus(s)}
                className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
                  filtroStatus === s
                    ? "border-[#023E8A] bg-[#023E8A] text-white"
                    : "border-blue-100 bg-white hover:border-[#3563A7] hover:bg-[#3563A7]/10"
                }`}
              >
                {s}
              </button>
            ))}

            {(busca || filtroEsp !== "Todas" || filtroUnidade !== "Todas") && (
              <button
                type="button"
                onClick={() => {
                  setBusca("");
                  setFiltroEsp("Todas");
                  setFiltroUnidade("Todas");
                }}
                className="ml-auto text-sm font-bold text-[#023E8A] underline-offset-2 hover:underline"
              >
                Limpar filtros
              </button>
            )}
          </div>
        </section>

        {/* LISTA DE PROFISSIONAIS */}
        {lista.length === 0 ? (
          <section className={`${cardBase} p-10 text-center`}>
            <p className="font-semibold">Nenhum profissional encontrado.</p>
            <p className="mt-1 text-sm">
              Ajuste a busca ou os filtros, ou cadastre um novo profissional.
            </p>
          </section>
        ) : (
          <>
          <section
            ref={listaRef}
            className="grid scroll-mt-36 grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3"
          >
            {visiveis.map((p) => {
              const estilo = estiloStatus[p.status];
              const Icone =
                especialidades.find((e) => e.nome === p.especialidade)?.Icone ||
                Stethoscope;

              return (
                <article key={p.id} className={`${cardBase} flex flex-col p-5 sm:p-6`}>
                  <div className="flex items-start gap-4">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#023E8A] text-lg font-bold text-white">
                      {iniciais(p.nome)}
                    </div>

                    <div className="min-w-0 flex-1">
                      <h3 className="truncate text-lg font-bold">{p.nome}</h3>
                      <p className="mt-1 flex items-center gap-1.5 text-sm font-medium">
                        <Icone size={16} className="shrink-0 text-[#023E8A]" />
                        {p.especialidade}
                      </p>
                      <p className="mt-0.5 text-xs">CRM-SP {p.crm}</p>
                    </div>

                    <span
                      className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${estilo.badge}`}
                    >
                      <span className={`h-2 w-2 rounded-full ${estilo.ponto}`} />
                      {p.status}
                    </span>
                  </div>

                  <div className="mt-5 space-y-2 text-sm">
                    <p className="flex items-start gap-2">
                      <Hospital size={16} className="mt-0.5 shrink-0 text-[#3563A7]" />
                      {nomeUnidade(p.unidadeId)}
                    </p>
                    <p className="flex items-center gap-2 break-all">
                      <Mail size={16} className="shrink-0 text-[#3563A7]" />
                      {p.email}
                    </p>
                    <p className="flex items-center gap-2">
                      <Phone size={16} className="shrink-0 text-[#3563A7]" />
                      {p.telefone || "Não informado"}
                    </p>
                    <p className="flex flex-wrap items-center gap-2">
                      <CalendarDays size={16} className="shrink-0 text-[#3563A7]" />
                      {p.dias.map((d) => (
                        <span
                          key={d}
                          className="rounded-full bg-[#3563A7]/15 px-2.5 py-0.5 text-xs font-semibold"
                        >
                          {d}
                        </span>
                      ))}
                    </p>
                  </div>

                  <div className="mt-6 flex flex-1 flex-col justify-end gap-3 border-t border-blue-100 pt-5">
                    <div className="flex items-center justify-between gap-3 text-sm font-semibold">
                      <span>Situação</span>

                      <Dropdown
                        rotulo={`Situação de ${p.nome}`}
                        valor={p.status}
                        opcoes={statusLista}
                        onChange={(novo) => alterarStatus(p.id, novo)}
                        largura="w-44"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => abrirEdicao(p)}
                        className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl bg-[#023E8A] px-4 py-2 text-sm font-bold text-white transition hover:bg-[#3563A7] focus:outline-none focus:ring-4 focus:ring-[#3563A7]/40"
                      >
                        <Pencil size={17} />
                        Editar
                      </button>

                      <button
                        type="button"
                        onClick={() => setRemover(p)}
                        className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl border border-red-200 bg-white px-4 py-2 text-sm font-bold text-red-700 transition hover:bg-red-50"
                      >
                        <Trash2 size={17} />
                        Remover
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </section>

          <Paginacao
            pagina={paginaAtual}
            totalPaginas={totalPaginas}
            totalItens={lista.length}
            onChange={mudarPagina}
          />
          </>
        )}
      </div>

      {/* MODAL: CADASTRO / EDIÇÃO */}
      {modalAberto && (
        <Portal>
        <div className="fixed inset-0 z-[1000] flex items-end justify-center bg-[#0B1756]/50 p-0 sm:items-center sm:p-6">
          <form
            onSubmit={salvar}
            role="dialog"
            aria-modal="true"
            aria-labelledby="titulo-modal"
            className="max-h-[90dvh] w-full max-w-2xl overflow-y-auto rounded-t-2xl bg-white p-5 shadow-2xl sm:rounded-2xl sm:p-8"
          >
            <div className="mb-6 flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#3563A7]/10 text-[#023E8A]">
                  <UserPlus size={26} />
                </div>
                <div>
                  <h2 id="titulo-modal" className="text-xl font-bold sm:text-2xl">
                    {editandoId ? "Editar profissional" : "Novo profissional"}
                  </h2>
                  <p className="mt-1 text-sm">Preencha os dados abaixo.</p>
                </div>
              </div>

              <button
                type="button"
                aria-label="Fechar"
                onClick={() => setModalAberto(false)}
                className="rounded-lg p-2 transition hover:bg-[#3563A7]/10"
              >
                <X size={22} />
              </button>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label htmlFor="nome" className="mb-2 block text-sm font-bold">
                  Nome completo<span className="ml-1 text-red-500">*</span>
                </label>
                <input
                  id="nome"
                  value={form.nome}
                  onChange={(e) => atualizar("nome", e.target.value)}
                  maxLength={80}
                  placeholder="Ex.: Dra. Maria Souza"
                  className={campo}
                />
              </div>

              <fieldset className="sm:col-span-2">
                <legend className="mb-2 text-sm font-bold">
                  Especialidade<span className="ml-1 text-red-500">*</span>
                </legend>

                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {especialidades.map(({ nome, Icone }) => {
                    const sel = form.especialidade === nome;

                    return (
                      <button
                        key={nome}
                        type="button"
                        aria-pressed={sel}
                        onClick={() => escolherEspecialidade(nome)}
                        className={`flex min-h-[48px] items-center justify-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition ${
                          sel
                            ? "border-[#023E8A] bg-[#3563A7]/15 ring-1 ring-[#023E8A]"
                            : "border-blue-100 bg-white hover:border-[#3563A7] hover:bg-[#3563A7]/10"
                        }`}
                      >
                        <Icone size={17} />
                        {nome}
                      </button>
                    );
                  })}
                </div>
              </fieldset>

              <div className="sm:col-span-2">
                <p className="mb-2 text-sm font-bold">
                  Unidade de atendimento<span className="ml-1 text-red-500">*</span>
                </p>
                <Dropdown
                  rotulo="Unidade de atendimento"
                  valor={form.unidadeId}
                  opcoes={unidadesDoForm.map((u) => ({
                    valor: String(u.id),
                    texto: u.nome,
                  }))}
                  onChange={(novo) => atualizar("unidadeId", novo)}
                  placeholder={
                    form.especialidade
                      ? "Selecione a unidade"
                      : "Escolha a especialidade primeiro"
                  }
                  desabilitado={!form.especialidade}
                  altura="min-h-[46px]"
                />
              </div>

              <div>
                <label htmlFor="crm" className="mb-2 block text-sm font-bold">
                  Registro (CRM)<span className="ml-1 text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm font-semibold">
                    CRM-SP
                  </span>

                  <input
                    id="crm"
                    inputMode="numeric"
                    value={form.crm}
                    onChange={(e) =>
                      atualizar("crm", e.target.value.replace(/\D/g, "").slice(0, 6))
                    }
                    maxLength={6}
                    placeholder="000000"
                    className={`${campo} pl-[84px]`}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="telefone" className="mb-2 block text-sm font-bold">
                  Telefone
                </label>
                <input
                  id="telefone"
                  inputMode="tel"
                  value={form.telefone}
                  onChange={(e) =>
                    atualizar("telefone", formatarTelefone(e.target.value))
                  }
                  placeholder="(11) 90000-0000"
                  className={campo}
                />
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="email" className="mb-2 block text-sm font-bold">
                  E-mail<span className="ml-1 text-red-500">*</span>
                </label>
                <input
                  id="email"
                  type="email"
                  value={form.email}
                  onChange={(e) => atualizar("email", e.target.value)}
                  maxLength={100}
                  placeholder="nome@clinica.com"
                  className={campo}
                />
              </div>

              <fieldset className="sm:col-span-2">
                <legend className="mb-2 text-sm font-bold">
                  Dias de atendimento<span className="ml-1 text-red-500">*</span>
                </legend>

                <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
                  {diasSemana.map((d) => {
                    const sel = form.dias.includes(d);

                    return (
                      <button
                        key={d}
                        type="button"
                        aria-pressed={sel}
                        onClick={() => alternarDia(d)}
                        className={`flex min-h-[44px] items-center justify-center gap-1 rounded-lg border px-2 py-2 text-sm font-semibold transition ${
                          sel
                            ? "border-[#023E8A] bg-[#023E8A] text-white"
                            : "border-blue-100 bg-white hover:border-[#3563A7] hover:bg-[#3563A7]/10"
                        }`}
                      >
                        {sel && <Check size={15} />}
                        {d}
                      </button>
                    );
                  })}
                </div>
              </fieldset>

              <div className="sm:col-span-2">
                <p className="mb-2 text-sm font-bold">Situação</p>
                <Dropdown
                  rotulo="Situação"
                  valor={form.status}
                  opcoes={statusLista}
                  onChange={(novo) => atualizar("status", novo)}
                  altura="min-h-[46px]"
                />
              </div>
            </div>

            {erro && (
              <div
                role="alert"
                className="mt-5 flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700"
              >
                <Info size={19} className="mt-0.5 shrink-0" />
                <p>{erro}</p>
              </div>
            )}

            <div className="mt-7 flex flex-col-reverse justify-between gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => setModalAberto(false)}
                className={botaoSecundario}
              >
                Cancelar
              </button>

              <button type="submit" className={botaoPrimario}>
                <Check size={20} />
                {editandoId ? "Salvar alterações" : "Cadastrar profissional"}
              </button>
            </div>
          </form>
        </div>
        </Portal>
      )}

      {/* MODAL: CONFIRMAR REMOÇÃO */}
      {remover && (
        <Portal>
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-[#0B1756]/50 p-4">
          <div
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="titulo-remocao"
            className="w-full max-w-md rounded-2xl bg-white p-6 text-center shadow-2xl sm:p-8"
          >
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-50 text-red-600">
              <AlertTriangle size={34} />
            </div>

            <h2 id="titulo-remocao" className="text-xl font-bold">
              Remover profissional?
            </h2>

            <p className="mt-3 text-sm leading-6">
              {remover.nome} será removido(a) da equipe. Para apenas suspender o
              atendimento, prefira alterar a situação para "Inativo".
            </p>

            <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-center">
              <button
                type="button"
                onClick={() => setRemover(null)}
                className={botaoSecundario}
              >
                Cancelar
              </button>

              <button
                type="button"
                onClick={confirmarRemocao}
                className="inline-flex min-h-[50px] items-center justify-center gap-2 rounded-xl bg-red-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-red-700 focus:outline-none focus:ring-4 focus:ring-red-200"
              >
                <Trash2 size={18} />
                Sim, remover
              </button>
            </div>
          </div>
        </div>
        </Portal>
      )}
    </main>
  );
}