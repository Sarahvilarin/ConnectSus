"use client";
 
import { useEffect, useMemo, useRef, useState } from "react";
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
  Mail,
  Pencil,
  Phone,
  Plane,
  Search,
  Stethoscope,
  Trash2,
  UserPlus,
  X,
} from "lucide-react";
 
/*
  PADRÃO VISUAL (igual ao da página de visitas)
  Fonte: font-sans
  Títulos principais: 36–42px bold | Títulos de seção/card: 24px bold
  Títulos menores: 18–20px bold    | Nomes e destaques: 16px semibold
  Descrições: 14–16px regular      | Tabelas: 14px
  Labels: 12px semibold            | Auxiliares: 12px
 
  Cores: #3563A7 azul principal | #023E8A azul escuro | #0B1756 azul-marinho
         #EAF3F7 fundo suave    | #FFFFFF cards       | #EEF5F9 fundo geral
*/
 
/* =========================
   DADOS DEMONSTRATIVOS
========================= */
 
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
const MOTIVOS_AFASTAMENTO = [
  "Férias",
  "Licença médica",
  "Licença pessoal",
  "Capacitação profissional",
  "Outro",
];
 
const equipeInicial = [
  { id: 1, nome: "Dra. Helena Duarte", especialidade: "Clínica geral", crm: "184520", unidadeId: 3, email: "helena.duarte@clinica.com", telefone: "(11) 98421-3370", dias: ["Seg", "Ter", "Qui"], status: "Ativo" },
  { id: 2, nome: "Dr. Rafael Nogueira", especialidade: "Cardiologia", crm: "152388", unidadeId: 1, email: "rafael.nogueira@clinica.com", telefone: "(11) 97733-1204", dias: ["Ter", "Qua", "Sex"], status: "Ativo" },
  { id: 3, nome: "Dra. Camila Barros", especialidade: "Neurologia", crm: "201477", unidadeId: 3, email: "camila.barros@clinica.com", telefone: "(11) 99120-4581", dias: ["Seg", "Qua"], status: "Ativo" },
  { id: 4, nome: "Dra. Júlia Andrade", especialidade: "Oftalmologia", crm: "173092", unidadeId: 2, email: "julia.andrade@clinica.com", telefone: "(11) 96655-8890", dias: ["Qui", "Sex", "Sáb"], status: "Ativo" },
  { id: 5, nome: "Dr. André Castro", especialidade: "Pediatria", crm: "165840", unidadeId: 1, email: "andre.castro@clinica.com", telefone: "(11) 95512-7743", dias: ["Seg", "Ter", "Qua", "Qui"], status: "Ativo" },
  { id: 6, nome: "Dr. Gustavo Ribeiro", especialidade: "Ortopedia", crm: "139216", unidadeId: 1, email: "gustavo.ribeiro@clinica.com", telefone: "(11) 98877-2109", dias: ["Ter", "Sex"], status: "Ativo" },
  { id: 7, nome: "Dra. Letícia Moura", especialidade: "Pediatria", crm: "190335", unidadeId: 2, email: "leticia.moura@clinica.com", telefone: "(11) 94408-6652", dias: ["Seg", "Qua", "Sex"], status: "Ativo" },
  { id: 8, nome: "Dr. Paulo Viana", especialidade: "Oftalmologia", crm: "128764", unidadeId: 3, email: "paulo.viana@clinica.com", telefone: "(11) 93321-9087", dias: ["Ter", "Qui"], status: "Inativo" },
];
 
const afastamentosIniciais = [
  { id: 1, profissionalId: 3, motivo: "Férias", dataInicio: "2026-11-03", previsaoRetorno: "2026-11-24", observacoes: "Férias programadas.", dataEncerramento: null },
  { id: 2, profissionalId: 5, motivo: "Licença médica", dataInicio: "2026-10-20", previsaoRetorno: "2026-11-30", observacoes: "", dataEncerramento: null },
  { id: 3, profissionalId: 6, motivo: "Capacitação profissional", dataInicio: "2026-12-07", previsaoRetorno: "2026-12-11", observacoes: "Congresso de ortopedia.", dataEncerramento: null },
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
 
const formAfastamentoVazio = (hoje) => ({
  profissionalId: "",
  motivo: "",
  dataInicio: hoje,
  previsaoRetorno: "",
  observacoes: "",
});
 
const POR_PAGINA = 9;
 
const inputCls =
  "w-full rounded-2xl border border-[#C8D8EC] bg-white px-4 py-3 text-sm text-[#0B1756] outline-none transition placeholder:text-slate-400 hover:border-[#3563A7]/70 focus:border-[#023E8A] focus:ring-4 focus:ring-[#3563A7]/15";
 
/* =========================
   FUNÇÕES AUXILIARES
========================= */
 
function dataAtualISO() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate()
  ).padStart(2, "0")}`;
}
 
function formatarData(data) {
  if (!data) return "Data não definida";
  const [ano, mes, dia] = data.split("-");
  return `${dia}/${mes}/${ano}`;
}
 
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
 
function contar(lista, campo) {
  const mapa = {};
  lista.forEach((item) => {
    const chave = item[campo] || "Não informado";
    mapa[chave] = (mapa[chave] || 0) + 1;
  });
  return Object.entries(mapa).sort((a, b) => b[1] - a[1]);
}
 
const nomeUnidade = (id) => UNIDADES.find((u) => u.id === Number(id))?.nome || "";
 
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
 
/* =========================
   COMPONENTES VISUAIS
========================= */
 
function Badge({ children, tipo = "neutro" }) {
  const estilos = {
    neutro: { fundo: "#EAF3F7", texto: "#000000" },
    azul: { fundo: "#3563A7", texto: "#FFFFFF" },
    azulClaro: { fundo: "#EAF3F7", texto: "#000000" },
    verde: { fundo: "#023E8A", texto: "#FFFFFF" },
    amarelo: { fundo: "#3563A7", texto: "#FFFFFF" },
    vermelho: { fundo: "#0B1756", texto: "#FFFFFF" },
  };
  const estilo = estilos[tipo] || estilos.neutro;
 
  return (
    <span
      className="inline-flex items-center whitespace-nowrap rounded-full border px-3 py-1 text-xs font-semibold"
      style={{ backgroundColor: estilo.fundo, borderColor: estilo.fundo, color: estilo.texto }}
    >
      {children}
    </span>
  );
}
 
const corStatusProf = (s) =>
  s === "Ativo" ? "verde" : s === "Em férias" ? "amarelo" : s === "Afastado" ? "vermelho" : "neutro";
 
const corStatusAfast = (s) =>
  s === "Em andamento" ? "vermelho" : s === "Agendado" ? "azul" : s === "Concluído" ? "verde" : "neutro";
 
function Campo({ label, children, className = "" }) {
  return (
    <div className={className}>
      <label className="mb-1.5 block text-xs font-semibold text-slate-600">{label}</label>
      {children}
    </div>
  );
}
 
function CardSecao({ titulo, subtitulo, acao, children, className = "" }) {
  return (
    <section className={`rounded-2xl border border-slate-100 bg-white p-5 shadow-sm ${className}`}>
      <div className="mb-5 flex items-start justify-between gap-3">
        <div>
          <h3 className="text-2xl font-bold text-[#0B1756]">{titulo}</h3>
          {subtitulo && <p className="mt-1 text-base text-slate-400">{subtitulo}</p>}
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
    return <p className="text-sm text-slate-400">Ainda não há dados para exibir.</p>;
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
 
/* Menu suspenso: aceita textos simples ou { valor, texto }. Abre para cima se faltar espaço. */
function Dropdown({
  rotulo,
  valor,
  opcoes,
  onChange,
  placeholder = "Selecione",
  desabilitado = false,
  largura = "w-full",
  larguraLista = "min-w-[170px]",
}) {
  const [aberto, setAberto] = useState(false);
  const [paraCima, setParaCima] = useState(false);
  const ref = useRef(null);
 
  const lista = opcoes.map((o) => (typeof o === "string" ? { valor: o, texto: o } : o));
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
        className={`flex w-full items-center justify-between gap-3 rounded-2xl border bg-white px-4 py-3 text-left text-sm text-[#0B1756] outline-none transition focus:border-[#023E8A] focus:ring-4 focus:ring-[#3563A7]/15 ${
          desabilitado
            ? "cursor-not-allowed border-[#C8D8EC] opacity-60"
            : aberto
              ? "border-[#0B1756] ring-4 ring-[#0B1756]/15"
              : "border-[#C8D8EC] hover:border-[#3563A7]"
        }`}
      >
        <span className={`min-w-0 truncate ${atual ? "" : "text-slate-400"}`}>
          {atual ? atual.texto : placeholder}
        </span>
        <ChevronDown
          size={16}
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
            className={`absolute left-0 z-20 max-h-60 w-full ${larguraLista} overflow-y-auto rounded-2xl border border-[#D5E2F1] bg-white p-1.5 shadow-[0_12px_30px_rgba(11,23,86,0.16)] ${
              paraCima ? "bottom-full mb-2" : "top-full mt-2"
            }`}
          >
            {lista.map((opcao) => {
              const ativo = opcao.valor === valor;
              return (
                <button
                  key={opcao.valor}
                  type="button"
                  role="option"
                  aria-selected={ativo}
                  onClick={() => {
                    onChange(opcao.valor);
                    setAberto(false);
                  }}
                  className={`flex w-full items-center justify-between gap-3 rounded-xl px-3.5 py-2.5 text-left text-sm transition ${
                    ativo
                      ? "bg-[#0B1756] font-semibold text-white"
                      : "text-[#0B1756] hover:bg-[#EAF3F7]"
                  }`}
                >
                  <span>{opcao.texto}</span>
                  {ativo && <Check size={16} className="shrink-0" />}
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
 
function Paginacao({ pagina, totalPaginas, totalItens, onChange }) {
  if (totalPaginas <= 1) return null;
 
  const inicio = (pagina - 1) * POR_PAGINA + 1;
  const fim = Math.min(pagina * POR_PAGINA, totalItens);
  const botao =
    "flex h-10 min-w-[40px] items-center justify-center rounded-lg border px-3 text-sm font-semibold transition focus:outline-none focus:ring-4 focus:ring-[#3563A7]/20";
  const base = "border-[#D5E0ED] bg-white text-[#3563A7] hover:bg-[#EAF3F7] disabled:cursor-not-allowed disabled:opacity-40";
 
  return (
    <nav
      aria-label="Paginação"
      className="mt-6 flex flex-col items-center justify-between gap-3 sm:flex-row"
    >
      <p className="text-sm text-slate-600">
        Mostrando <strong className="font-semibold text-[#0B1756]">{inicio}</strong> a{" "}
        <strong className="font-semibold text-[#0B1756]">{fim}</strong> de{" "}
        <strong className="font-semibold text-[#0B1756]">{totalItens}</strong> profissionais
      </p>
 
      <div className="flex items-center gap-2">
        <button
          type="button"
          aria-label="Página anterior"
          disabled={pagina === 1}
          onClick={() => onChange(pagina - 1)}
          className={`${botao} ${base}`}
        >
          <ChevronLeft size={18} />
        </button>
 
        {paginasVisiveis(pagina, totalPaginas).map((n) =>
          typeof n === "string" ? (
            <span key={n} className="px-1 text-sm font-semibold text-slate-400">
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
                  ? "border-[#0B1756] bg-[#0B1756] text-white"
                  : "border-[#D5E0ED] bg-white text-[#0B1756] hover:bg-[#EAF3F7]"
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
          className={`${botao} ${base}`}
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </nav>
  );
}
 
function Portal({ children }) {
  return createPortal(children, document.body);
}
 
/* =========================
   PÁGINA PRINCIPAL
========================= */
 
export default function GestaoEquipe() {
  const [HOJE] = useState(dataAtualISO);
 
  const [aba, setAba] = useState("geral");
  const [equipe, setEquipe] = useState(equipeInicial);
  const [afastamentos, setAfastamentos] = useState(afastamentosIniciais);
 
  const [busca, setBusca] = useState("");
  const [filtroEsp, setFiltroEsp] = useState("Todas");
  const [filtroUnidade, setFiltroUnidade] = useState("Todas");
  const [filtroStatus, setFiltroStatus] = useState("Todos");
  const [pagina, setPagina] = useState(1);
  const listaRef = useRef(null);
 
  const [filtroAfast, setFiltroAfast] = useState("Todos");
 
  const [modalAberto, setModalAberto] = useState(false);
  const [editandoId, setEditandoId] = useState(null);
  const [form, setForm] = useState(formVazio);
  const [erro, setErro] = useState("");
  const [remover, setRemover] = useState(null);
 
  const [modalAfast, setModalAfast] = useState(false);
  const [formAfast, setFormAfast] = useState(formAfastamentoVazio(HOJE));
  const [erroAfast, setErroAfast] = useState("");
 
  const [aviso, setAviso] = useState(null);
 
  function mostrarAviso(texto, tipo = "ok") {
    setAviso({ texto, tipo });
    setTimeout(() => setAviso(null), 3500);
  }
 
  /* ---------- Afastamentos ---------- */
 
  function afastamentoVigente(profissionalId, data) {
    return afastamentos.find(
      (a) =>
        a.profissionalId === profissionalId &&
        a.dataInicio <= data &&
        a.previsaoRetorno >= data &&
        (!a.dataEncerramento || data < a.dataEncerramento)
    );
  }
 
  function situacaoAfastamento(a) {
    if (a.dataEncerramento) return "Encerrado";
    if (HOJE < a.dataInicio) return "Agendado";
    if (HOJE > a.previsaoRetorno) return "Concluído";
    return "Em andamento";
  }
 
  /* Situação exibida: afastamento em andamento sobrepõe o status manual (exceto Inativo) */
  function statusEfetivo(p) {
    if (p.status === "Inativo") return "Inativo";
    const a = afastamentoVigente(p.id, HOJE);
    if (!a) return p.status;
    return a.motivo === "Férias" ? "Em férias" : "Afastado";
  }
 
  const nomeProf = (id) => equipe.find((p) => p.id === id)?.nome || "Profissional removido";
 
  /* ---------- Indicadores ---------- */
 
  const total = equipe.length;
  const ativos = equipe.filter((p) => statusEfetivo(p) === "Ativo").length;
  const ausentes = equipe.filter((p) => ["Em férias", "Afastado"].includes(statusEfetivo(p))).length;
  const qtdEspecialidades = new Set(equipe.map((p) => p.especialidade)).size;
 
  const porEspecialidade = useMemo(() => contar(equipe, "especialidade"), [equipe]);
  const porUnidade = useMemo(
    () =>
      contar(
        equipe.map((p) => ({ ...p, unidade: nomeUnidade(p.unidadeId) })),
        "unidade"
      ),
    [equipe]
  );
 
  const afastamentosEmAndamento = afastamentos.filter(
    (a) => situacaoAfastamento(a) === "Em andamento"
  );
 
  /* ---------- Lista de profissionais ---------- */
 
  const lista = equipe.filter((p) => {
    const termo = busca.trim().toLowerCase();
    return (
      (!termo || p.nome.toLowerCase().includes(termo) || `crm-sp ${p.crm}`.includes(termo)) &&
      (filtroEsp === "Todas" || p.especialidade === filtroEsp) &&
      (filtroUnidade === "Todas" || p.unidadeId === Number(filtroUnidade)) &&
      (filtroStatus === "Todos" || statusEfetivo(p) === filtroStatus)
    );
  });
 
  const totalPaginas = Math.max(1, Math.ceil(lista.length / POR_PAGINA));
  const paginaAtual = Math.min(pagina, totalPaginas);
  const visiveis = lista.slice((paginaAtual - 1) * POR_PAGINA, paginaAtual * POR_PAGINA);
 
  const unidadesDoForm = form.especialidade
    ? UNIDADES.filter((u) => u.especialidades.includes(form.especialidade))
    : [];
 
  const listaAfast = afastamentos
    .filter((a) => filtroAfast === "Todos" || situacaoAfastamento(a) === filtroAfast)
    .sort((a, b) => b.dataInicio.localeCompare(a.dataInicio));
 
  useEffect(() => {
    setPagina(1);
  }, [busca, filtroEsp, filtroUnidade, filtroStatus]);
 
  useEffect(() => {
    document.body.style.overflow = modalAberto || modalAfast || remover ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [modalAberto, modalAfast, remover]);
 
  useEffect(() => {
    function aoTeclar(e) {
      if (e.key === "Escape") {
        setModalAberto(false);
        setModalAfast(false);
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
 
  /* ---------- Cadastro / edição ---------- */
 
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
 
  const atualizar = (campo, valor) => setForm((atual) => ({ ...atual, [campo]: valor }));
 
  function escolherEspecialidade(nome) {
    setForm((atual) => {
      const unidadeValida = UNIDADES.some(
        (u) => u.id === Number(atual.unidadeId) && u.especialidades.includes(nome)
      );
      return { ...atual, especialidade: nome, unidadeId: unidadeValida ? atual.unidadeId : "" };
    });
  }
 
  function alternarDia(dia) {
    setForm((atual) => ({
      ...atual,
      dias: atual.dias.includes(dia) ? atual.dias.filter((d) => d !== dia) : [...atual.dias, dia],
    }));
  }
 
  function salvar(event) {
    event.preventDefault();
    setErro("");
 
    if (form.nome.trim().length < 3) return setErro("Informe o nome completo do profissional.");
    if (!form.especialidade) return setErro("Selecione a especialidade.");
    if (!form.unidadeId) return setErro("Selecione a unidade de atendimento.");
    if (!/^\d{6}$/.test(form.crm)) return setErro("O CRM deve ter exatamente 6 dígitos.");
    if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) return setErro("Informe um e-mail válido.");
    if (form.dias.length === 0) return setErro("Selecione ao menos um dia de atendimento.");
 
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
    mostrarAviso(editandoId ? "Dados atualizados com sucesso." : "Profissional cadastrado com sucesso.");
  }
 
  function alterarStatus(id, status) {
    setEquipe((atuais) => atuais.map((p) => (p.id === id ? { ...p, status } : p)));
  }
 
  function confirmarRemocao() {
    setEquipe((atuais) => atuais.filter((p) => p.id !== remover.id));
    setAfastamentos((atuais) => atuais.filter((a) => a.profissionalId !== remover.id));
    setRemover(null);
    mostrarAviso("Profissional removido da equipe.");
  }
 
  /* ---------- Afastamentos: registrar / encerrar / excluir ---------- */
 
  function abrirAfastamento(profissionalId = "") {
    setFormAfast({ ...formAfastamentoVazio(HOJE), profissionalId: String(profissionalId) });
    setErroAfast("");
    setModalAfast(true);
  }
 
  function registrarAfastamento(e) {
    e.preventDefault();
    setErroAfast("");
 
    const id = Number(formAfast.profissionalId);
 
    if (!id) return setErroAfast("Selecione o médico.");
    if (!formAfast.motivo) return setErroAfast("Informe o motivo do afastamento.");
    if (!formAfast.dataInicio) return setErroAfast("Informe a data de início.");
    if (!formAfast.previsaoRetorno) return setErroAfast("Informe a previsão de retorno.");
    if (formAfast.previsaoRetorno < formAfast.dataInicio)
      return setErroAfast("A previsão de retorno não pode ser anterior à data de início.");
 
    const jaExiste = afastamentos.some(
      (a) =>
        a.profissionalId === id &&
        !a.dataEncerramento &&
        a.dataInicio <= formAfast.previsaoRetorno &&
        a.previsaoRetorno >= formAfast.dataInicio
    );
    if (jaExiste) return setErroAfast("Já existe um afastamento registrado nesse período.");
 
    setAfastamentos((atuais) => [
      ...atuais,
      {
        id: Date.now(),
        profissionalId: id,
        motivo: formAfast.motivo,
        dataInicio: formAfast.dataInicio,
        previsaoRetorno: formAfast.previsaoRetorno,
        observacoes: formAfast.observacoes.trim(),
        dataEncerramento: null,
      },
    ]);
 
    setModalAfast(false);
    setAba("afastamentos");
    mostrarAviso("Afastamento registrado com sucesso.");
  }
 
  function encerrarAfastamento(id) {
    setAfastamentos((atuais) =>
      atuais.map((a) => (a.id === id ? { ...a, dataEncerramento: HOJE } : a))
    );
    mostrarAviso("Afastamento encerrado com sucesso.");
  }
 
  function excluirAfastamento(id) {
    setAfastamentos((atuais) => atuais.filter((a) => a.id !== id));
    mostrarAviso("Registro de afastamento excluído.");
  }
 
  /* ---------- Navegação ---------- */
 
  const abas = [
    { id: "geral", titulo: "Visão geral", sub: "Indicadores e panorama" },
    { id: "profissionais", titulo: "Profissionais", sub: "Cadastro e situação" },
    { id: "afastamentos", titulo: "Afastamentos", sub: "Férias e licenças dos médicos" },
  ];
 
  const botaoPrimario =
    "inline-flex items-center justify-center gap-2 rounded-xl bg-[#023E8A] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#0B1756] focus:outline-none focus:ring-4 focus:ring-[#3563A7]/30";
  const botaoSecundario =
    "inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-[#3563A7]/15";
 
  return (
    <div className="min-h-screen bg-[#EEF5F9] font-sans text-[#0B1756]">
      <div className="pointer-events-none fixed -right-36 -top-36 h-96 w-96 rounded-full border-[64px] border-[#D9E8FA]/60" />
      <div className="pointer-events-none fixed -bottom-40 -left-32 h-96 w-96 rounded-full bg-white/70" />
 
      <main className="relative z-10 mx-auto max-w-[1400px] space-y-7 px-4 py-7 sm:px-6 lg:px-8">
        {/* CABEÇALHO E NAVEGAÇÃO */}
 
        <section className="relative pb-0">
          <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-[#023E8A] via-[#3563A7] to-[#0B1756] px-7 pb-20 pt-7 shadow-sm sm:px-10 sm:pt-9 sm:pb-22">
            <div className="pointer-events-none absolute -right-16 -top-24 h-80 w-80 rounded-full border-[48px] border-white/[0.06]" />
            <div className="pointer-events-none absolute right-[25%] top-20 h-72 w-72 rounded-full border-[45px] border-white/[0.05]" />
 
            <div className="relative z-10 flex flex-col justify-between gap-7 lg:flex-row lg:items-center">
              <div className="max-w-3xl">
                <h1 className="mt-5 text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl lg:text-[42px]">
                  Gestão de equipe
                </h1>
                <p className="mt-3 max-w-3xl text-sm leading-7 text-white/85 sm:text-base lg:text-lg">
                  Cadastre os profissionais de saúde, defina os dias de atendimento e
                  acompanhe férias e afastamentos dos médicos.
                </p>
              </div>
 
              <div className="flex shrink-0 flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={abrirNovo}
                  className="rounded-2xl bg-white px-5 py-3.5 text-sm font-semibold text-[#0B1756] shadow-sm transition hover:bg-[#EAF3F7]"
                >
                  + Novo profissional
                </button>
              </div>
            </div>
          </div>
 
          <nav
            className="relative z-20 -mt-[72px] grid grid-cols-1 gap-3 px-4 sm:grid-cols-3 sm:px-6"
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
                <span className="text-base font-bold text-[#0B1756]">{a.titulo}</span>
                <span className="mt-1 text-sm text-[#3563A7]">{a.sub}</span>
              </button>
            ))}
          </nav>
        </section>
 
        {/* VISÃO GERAL */}
 
        {aba === "geral" && (
          <div className="space-y-6">
            <div>
              <h2 className="text-4xl font-bold tracking-tight text-[#0B1756]">Panorama da equipe</h2>
              <p className="mt-1 text-base text-slate-500">
                Indicadores para acompanhar a disponibilidade dos profissionais.
              </p>
            </div>
 
            <section className="overflow-hidden rounded-2xl border border-[#1D4C91] bg-gradient-to-r from-[#023E8A] via-[#3563A7] to-[#0B1756] p-5 text-white shadow-lg sm:p-6">
              <div className="grid grid-cols-2 gap-y-5 lg:grid-cols-4 lg:gap-y-0">
                {[
                  { titulo: "Profissionais", valor: total },
                  { titulo: "Ativos", valor: ativos },
                  { titulo: "Férias ou afastados", valor: ausentes },
                  { titulo: "Especialidades", valor: qtdEspecialidades },
                ].map((k, i) => (
                  <div
                    key={k.titulo}
                    className={`px-3 sm:px-5 ${i % 2 === 1 ? "border-l border-white/20" : ""} ${
                      i >= 2 ? "border-t border-white/20 pt-5 lg:border-t-0 lg:pt-0" : ""
                    } ${i === 2 ? "lg:border-l" : ""}`}
                  >
                    <p className="text-4xl font-bold tracking-tight text-white sm:text-5xl">{k.valor}</p>
                    <p className="mt-2 text-base font-semibold leading-5 text-white sm:text-lg">{k.titulo}</p>
                  </div>
                ))}
              </div>
            </section>
 
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
              <CardSecao titulo="Profissionais por especialidade" subtitulo="Distribuição da equipe">
                <Barras dados={porEspecialidade} />
              </CardSecao>
              <CardSecao titulo="Profissionais por unidade" subtitulo="Onde a equipe atende">
                <Barras dados={porUnidade} />
              </CardSecao>
            </div>
 
            <CardSecao
              titulo="Afastamentos em andamento"
              subtitulo="Médicos que não estão disponíveis para novos agendamentos."
              acao={
                <Badge tipo={afastamentosEmAndamento.length ? "vermelho" : "verde"}>
                  {afastamentosEmAndamento.length} em andamento
                </Badge>
              }
            >
              {afastamentosEmAndamento.length ? (
                <div className="divide-y divide-slate-100">
                  {afastamentosEmAndamento.map((a) => (
                    <div
                      key={a.id}
                      className="flex flex-col gap-2 py-4 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div>
                        <p className="text-base font-semibold text-[#0B1756]">{nomeProf(a.profissionalId)}</p>
                        <p className="mt-1 text-sm text-slate-500">
                          {a.motivo} · {formatarData(a.dataInicio)} a {formatarData(a.previsaoRetorno)}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setAba("afastamentos")}
                        className="rounded-lg border border-[#3563A7] px-5 py-2.5 text-sm font-semibold text-[#3563A7] transition hover:bg-[#EAF3F7]"
                      >
                        Ver afastamentos
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="py-3 text-sm text-slate-400">Nenhum afastamento em andamento no momento.</p>
              )}
            </CardSecao>
          </div>
        )}
 
        {/* PROFISSIONAIS */}
 
        {aba === "profissionais" && (
          <section className="space-y-5">
            <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm sm:p-5">
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-[1fr_230px_300px]">
                <div className="relative">
                  <Search
                    size={18}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#0B1756]"
                  />
                  <input
                    type="search"
                    value={busca}
                    onChange={(e) => setBusca(e.target.value)}
                    placeholder="Buscar por nome ou CRM..."
                    aria-label="Buscar profissional"
                    className={`${inputCls} pl-11`}
                  />
                </div>
 
                <Dropdown
                  rotulo="Filtrar por especialidade"
                  valor={filtroEsp}
                  opcoes={[
                    { valor: "Todas", texto: "Todas as especialidades" },
                    ...especialidades.map((e) => ({ valor: e.nome, texto: e.nome })),
                  ]}
                  onChange={setFiltroEsp}
                />
 
                <Dropdown
                  rotulo="Filtrar por unidade"
                  valor={filtroUnidade}
                  opcoes={[
                    { valor: "Todas", texto: "Todas as unidades" },
                    ...UNIDADES.map((u) => ({ valor: String(u.id), texto: u.nome })),
                  ]}
                  onChange={setFiltroUnidade}
                  larguraLista="min-w-[300px]"
                />
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
                        ? "border-[#0B1756] bg-[#0B1756] text-white"
                        : "border-[#C8D8EC] bg-white text-[#0B1756] hover:border-[#3563A7] hover:bg-[#EAF3F7]"
                    }`}
                  >
                    {s}
                  </button>
                ))}
 
                {(busca || filtroEsp !== "Todas" || filtroUnidade !== "Todas" || filtroStatus !== "Todos") && (
                  <button
                    type="button"
                    onClick={() => {
                      setBusca("");
                      setFiltroEsp("Todas");
                      setFiltroUnidade("Todas");
                      setFiltroStatus("Todos");
                    }}
                    className="ml-auto text-sm font-semibold text-[#023E8A] hover:underline"
                  >
                    Limpar filtros
                  </button>
                )}
              </div>
            </div>
 
            {lista.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-200 bg-white px-4 py-10 text-center">
                <p className="text-base font-semibold text-slate-600">Nenhum profissional encontrado.</p>
                <p className="mt-1 text-sm text-slate-400">
                  Ajuste a busca ou os filtros, ou cadastre um novo profissional.
                </p>
              </div>
            ) : (
              <>
                <div
                  ref={listaRef}
                  className="grid scroll-mt-6 grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3"
                >
                  {visiveis.map((p) => {
                    const efetivo = statusEfetivo(p);
                    const vigente = afastamentoVigente(p.id, HOJE);
                    const Icone =
                      especialidades.find((e) => e.nome === p.especialidade)?.Icone || Stethoscope;
 
                    return (
                      <article
                        key={p.id}
                        className="flex flex-col rounded-2xl border border-slate-100 bg-white p-5 shadow-sm"
                      >
                        <div className="flex items-start gap-4">
                          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#023E8A] text-lg font-bold text-white">
                            {iniciais(p.nome)}
                          </div>
 
                          <div className="min-w-0 flex-1">
                            <h3 className="truncate text-lg font-bold text-[#0B1756]">{p.nome}</h3>
                            <p className="mt-1 flex items-center gap-1.5 text-base font-semibold text-[#0B1756]">
                              <Icone size={16} className="shrink-0 text-[#3563A7]" />
                              {p.especialidade}
                            </p>
                            <p className="mt-0.5 text-xs text-slate-500">CRM-SP {p.crm}</p>
                          </div>
 
                          <Badge tipo={corStatusProf(efetivo)}>{efetivo}</Badge>
                        </div>
 
                        <div className="mt-5 space-y-2 text-sm text-slate-600">
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
                                className="rounded-full bg-[#EAF3F7] px-2.5 py-0.5 text-xs font-semibold text-[#0B1756]"
                              >
                                {d}
                              </span>
                            ))}
                          </p>
                          {vigente && (
                            <p className="flex items-center gap-2 text-xs font-semibold text-[#023E8A]">
                              <Plane size={14} className="shrink-0" />
                              {vigente.motivo} até {formatarData(vigente.previsaoRetorno)}
                            </p>
                          )}
                        </div>
 
                        <div className="mt-6 flex flex-1 flex-col justify-end gap-3 border-t border-slate-100 pt-5">
                          <div className="flex items-center justify-between gap-3">
                            <span className="text-xs font-semibold text-slate-600">Situação</span>
                            {vigente ? (
                              <span className="text-xs text-slate-500">Definida pelo afastamento</span>
                            ) : (
                              <Dropdown
                                rotulo={`Situação de ${p.nome}`}
                                valor={p.status}
                                opcoes={statusLista.filter((s) => s === "Ativo" || s === "Inativo")}
                                onChange={(novo) => alterarStatus(p.id, novo)}
                                largura="w-44"
                              />
                            )}
                          </div>
 
                          <div className="grid grid-cols-2 gap-2">
                            <button
                              type="button"
                              onClick={() => abrirEdicao(p)}
                              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#023E8A] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0B1756]"
                            >
                              <Pencil size={16} />
                              Editar
                            </button>
                            <button
                              type="button"
                              onClick={() => setRemover(p)}
                              className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#0B1756]/30 bg-white px-4 py-2.5 text-sm font-semibold text-[#0B1756] transition hover:bg-[#EAF3F7]"
                            >
                              <Trash2 size={16} />
                              Remover
                            </button>
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
 
                <Paginacao
                  pagina={paginaAtual}
                  totalPaginas={totalPaginas}
                  totalItens={lista.length}
                  onChange={mudarPagina}
                />
              </>
            )}
          </section>
        )}
 
        {/* AFASTAMENTOS */}
 
        {aba === "afastamentos" && (
          <section className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
            <div className="flex flex-col gap-4 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#EAF3F7] text-[#0B1756]">
                  <Plane size={21} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-[#0B1756]">Afastamentos dos médicos</h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Médicos afastados não recebem novos agendamentos durante o período.
                  </p>
                </div>
              </div>
 
              <button type="button" onClick={() => abrirAfastamento()} className={botaoPrimario}>
                + Novo afastamento
              </button>
            </div>
 
            <div className="flex flex-wrap items-center gap-2 border-b border-slate-100 p-4">
              {["Todos", "Em andamento", "Agendado", "Concluído", "Encerrado"].map((s) => (
                <button
                  key={s}
                  type="button"
                  aria-pressed={filtroAfast === s}
                  onClick={() => setFiltroAfast(s)}
                  className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
                    filtroAfast === s
                      ? "border-[#0B1756] bg-[#0B1756] text-white"
                      : "border-[#C8D8EC] bg-white text-[#0B1756] hover:border-[#3563A7] hover:bg-[#EAF3F7]"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
 
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-sm">
                <thead className="border-y border-slate-100 bg-slate-50 text-xs uppercase text-slate-600">
                  <tr>
                    {["Médico", "Motivo", "Período", "Situação", "Observações", "Ação"].map((t) => (
                      <th key={t} className="whitespace-nowrap px-4 py-4 font-bold">
                        {t}
                      </th>
                    ))}
                  </tr>
                </thead>
 
                <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                  {listaAfast.map((a) => {
                    const prof = equipe.find((p) => p.id === a.profissionalId);
                    const sit = situacaoAfastamento(a);
 
                    return (
                      <tr key={a.id} className="transition hover:bg-slate-50/70">
                        <td className="whitespace-nowrap px-4 py-4">
                          <p className="text-base font-semibold text-[#0B1756]">{nomeProf(a.profissionalId)}</p>
                          <span className="mt-1 block text-xs text-slate-500">{prof?.especialidade}</span>
                        </td>
                        <td className="whitespace-nowrap px-4 py-4">{a.motivo}</td>
                        <td className="whitespace-nowrap px-4 py-4">
                          <p>{formatarData(a.dataInicio)}</p>
                          <span className="mt-1 block text-xs text-slate-500">
                            até {formatarData(a.dataEncerramento || a.previsaoRetorno)}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <Badge tipo={corStatusAfast(sit)}>{sit}</Badge>
                        </td>
                        <td className="min-w-48 px-4 py-4 text-slate-500">{a.observacoes || "—"}</td>
                        <td className="px-4 py-4">
                          <div className="flex gap-2">
                            {(sit === "Em andamento" || sit === "Agendado") && (
                              <button
                                type="button"
                                onClick={() => encerrarAfastamento(a.id)}
                                className="whitespace-nowrap rounded-lg border border-[#3563A7] px-3 py-2 text-xs font-semibold text-[#3563A7] transition hover:bg-[#EAF3F7]"
                              >
                                Encerrar
                              </button>
                            )}
                            <button
                              type="button"
                              aria-label="Excluir registro"
                              onClick={() => excluirAfastamento(a.id)}
                              className="rounded-lg border border-[#D5E0ED] p-2 text-[#0B1756] transition hover:bg-[#EAF3F7]"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
 
                  {listaAfast.length === 0 && (
                    <tr>
                      <td colSpan={6} className="py-10 text-center text-base text-slate-500">
                        Nenhum afastamento encontrado com esse filtro.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </main>
 
      {/* MODAL: AFASTAMENTO */}
 
      {modalAfast && (
        <Portal>
          <div
            className="fixed inset-0 z-[1000] flex items-end justify-center bg-[#0B1756]/40 p-0 backdrop-blur-sm sm:items-center sm:p-6"
            onClick={() => setModalAfast(false)}
          >
            <form
              onSubmit={registrarAfastamento}
              role="dialog"
              aria-modal="true"
              aria-labelledby="titulo-afastamento"
              onClick={(e) => e.stopPropagation()}
              className="max-h-[90dvh] w-full max-w-lg space-y-5 overflow-y-auto rounded-t-2xl bg-white p-6 shadow-xl sm:rounded-2xl"
            >
              <div className="flex items-start justify-between border-b border-slate-100 pb-4">
                <div>
                  <h3 id="titulo-afastamento" className="text-2xl font-bold text-[#0B1756]">
                    Registrar afastamento
                  </h3>
                  <p className="mt-1 text-sm text-slate-500">Informe o médico e o período.</p>
                </div>
                <button
                  type="button"
                  aria-label="Fechar"
                  onClick={() => setModalAfast(false)}
                  className="rounded-lg p-2 text-slate-500 transition hover:bg-[#EAF3F7] hover:text-[#0B1756]"
                >
                  <X size={20} />
                </button>
              </div>
 
              <Campo label="Médico">
                <Dropdown
                  rotulo="Médico"
                  valor={formAfast.profissionalId}
                  opcoes={equipe
                    .filter((p) => p.status !== "Inativo")
                    .map((p) => ({ valor: String(p.id), texto: `${p.nome} — ${p.especialidade}` }))}
                  onChange={(v) => setFormAfast({ ...formAfast, profissionalId: v })}
                  placeholder="Selecione o médico"
                />
              </Campo>
 
              <Campo label="Motivo do afastamento">
                <Dropdown
                  rotulo="Motivo do afastamento"
                  valor={formAfast.motivo}
                  opcoes={MOTIVOS_AFASTAMENTO}
                  onChange={(v) => setFormAfast({ ...formAfast, motivo: v })}
                  placeholder="Selecione o motivo"
                />
              </Campo>
 
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Campo label="Data de início">
                  <input
                    type="date"
                    value={formAfast.dataInicio}
                    min={HOJE}
                    onChange={(e) =>
                      setFormAfast({
                        ...formAfast,
                        dataInicio: e.target.value,
                        previsaoRetorno:
                          formAfast.previsaoRetorno < e.target.value ? "" : formAfast.previsaoRetorno,
                      })
                    }
                    className={inputCls}
                  />
                </Campo>
 
                <Campo label="Previsão de retorno">
                  <input
                    type="date"
                    value={formAfast.previsaoRetorno}
                    min={formAfast.dataInicio || HOJE}
                    onChange={(e) => setFormAfast({ ...formAfast, previsaoRetorno: e.target.value })}
                    className={inputCls}
                  />
                </Campo>
              </div>
 
              <Campo label="Observações (opcional)">
                <textarea
                  rows={3}
                  value={formAfast.observacoes}
                  onChange={(e) => setFormAfast({ ...formAfast, observacoes: e.target.value })}
                  placeholder="Informações adicionais sobre o afastamento..."
                  className={inputCls}
                />
              </Campo>
 
              {erroAfast && (
                <div
                  role="alert"
                  className="rounded-xl border border-[#0B1756]/20 bg-[#EAF3F7] p-4 text-sm font-semibold text-[#0B1756]"
                >
                  {erroAfast}
                </div>
              )}
 
              <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                <button type="button" onClick={() => setModalAfast(false)} className={botaoSecundario}>
                  Cancelar
                </button>
                <button type="submit" className={botaoPrimario}>
                  Confirmar afastamento
                </button>
              </div>
            </form>
          </div>
        </Portal>
      )}
 
      {/* MODAL: CADASTRO / EDIÇÃO */}
 
      {modalAberto && (
        <Portal>
          <div
            className="fixed inset-0 z-[1000] flex items-end justify-center bg-[#0B1756]/40 p-0 backdrop-blur-sm sm:items-center sm:p-6"
            onClick={() => setModalAberto(false)}
          >
            <form
              onSubmit={salvar}
              role="dialog"
              aria-modal="true"
              aria-labelledby="titulo-modal"
              onClick={(e) => e.stopPropagation()}
              className="max-h-[90dvh] w-full max-w-2xl overflow-y-auto rounded-t-2xl bg-white p-6 shadow-xl sm:rounded-2xl"
            >
              <div className="mb-6 flex items-start justify-between gap-4 border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#EAF3F7] text-[#0B1756]">
                    <UserPlus size={22} />
                  </div>
                  <div>
                    <h2 id="titulo-modal" className="text-2xl font-bold text-[#0B1756]">
                      {editandoId ? "Editar profissional" : "Novo profissional"}
                    </h2>
                    <p className="mt-1 text-sm text-slate-500">Preencha os dados abaixo.</p>
                  </div>
                </div>
 
                <button
                  type="button"
                  aria-label="Fechar"
                  onClick={() => setModalAberto(false)}
                  className="rounded-lg p-2 text-slate-500 transition hover:bg-[#EAF3F7] hover:text-[#0B1756]"
                >
                  <X size={20} />
                </button>
              </div>
 
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <Campo label="Nome completo *" className="sm:col-span-2">
                  <input
                    value={form.nome}
                    onChange={(e) => atualizar("nome", e.target.value)}
                    maxLength={80}
                    placeholder="Ex.: Dra. Maria Souza"
                    className={inputCls}
                  />
                </Campo>
 
                <fieldset className="sm:col-span-2">
                  <legend className="mb-1.5 text-xs font-semibold text-slate-600">Especialidade *</legend>
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {especialidades.map(({ nome, Icone }) => {
                      const sel = form.especialidade === nome;
                      return (
                        <button
                          key={nome}
                          type="button"
                          aria-pressed={sel}
                          onClick={() => escolherEspecialidade(nome)}
                          className={`flex min-h-[46px] items-center justify-center gap-2 rounded-2xl border px-3 py-2 text-sm font-semibold transition ${
                            sel
                              ? "border-[#0B1756] bg-[#0B1756] text-white"
                              : "border-[#C8D8EC] bg-white text-[#0B1756] hover:border-[#3563A7] hover:bg-[#EAF3F7]"
                          }`}
                        >
                          <Icone size={16} />
                          {nome}
                        </button>
                      );
                    })}
                  </div>
                </fieldset>
 
                <Campo label="Unidade de atendimento *" className="sm:col-span-2">
                  <Dropdown
                    rotulo="Unidade de atendimento"
                    valor={form.unidadeId}
                    opcoes={unidadesDoForm.map((u) => ({ valor: String(u.id), texto: u.nome }))}
                    onChange={(novo) => atualizar("unidadeId", novo)}
                    placeholder={form.especialidade ? "Selecione a unidade" : "Escolha a especialidade primeiro"}
                    desabilitado={!form.especialidade}
                  />
                </Campo>
 
                <Campo label="Registro (CRM) *">
                  <div className="relative">
                    <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-slate-500">
                      CRM-SP
                    </span>
                    <input
                      inputMode="numeric"
                      value={form.crm}
                      onChange={(e) => atualizar("crm", e.target.value.replace(/\D/g, "").slice(0, 6))}
                      maxLength={6}
                      placeholder="000000"
                      className={`${inputCls} pl-[84px]`}
                    />
                  </div>
                </Campo>
 
                <Campo label="Telefone">
                  <input
                    inputMode="tel"
                    value={form.telefone}
                    onChange={(e) => atualizar("telefone", formatarTelefone(e.target.value))}
                    placeholder="(11) 90000-0000"
                    className={inputCls}
                  />
                </Campo>
 
                <Campo label="E-mail *" className="sm:col-span-2">
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => atualizar("email", e.target.value)}
                    maxLength={100}
                    placeholder="nome@clinica.com"
                    className={inputCls}
                  />
                </Campo>
 
                <fieldset className="sm:col-span-2">
                  <legend className="mb-1.5 text-xs font-semibold text-slate-600">Dias de atendimento *</legend>
                  <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
                    {diasSemana.map((d) => {
                      const sel = form.dias.includes(d);
                      return (
                        <button
                          key={d}
                          type="button"
                          aria-pressed={sel}
                          onClick={() => alternarDia(d)}
                          className={`flex min-h-[44px] items-center justify-center gap-1 rounded-2xl border px-2 py-2 text-sm font-semibold transition ${
                            sel
                              ? "border-[#0B1756] bg-[#0B1756] text-white"
                              : "border-[#C8D8EC] bg-white text-[#0B1756] hover:border-[#3563A7] hover:bg-[#EAF3F7]"
                          }`}
                        >
                          {sel && <Check size={14} />}
                          {d}
                        </button>
                      );
                    })}
                  </div>
                </fieldset>
 
                <Campo label="Situação" className="sm:col-span-2">
                  <Dropdown
                    rotulo="Situação"
                    valor={form.status === "Ativo" || form.status === "Inativo" ? form.status : "Ativo"}
                    opcoes={["Ativo", "Inativo"]}
                    onChange={(novo) => atualizar("status", novo)}
                  />
                  <p className="mt-1.5 text-xs text-slate-500">
                    Férias e afastamentos são definidos na seção Afastamentos.
                  </p>
                </Campo>
              </div>
 
              {erro && (
                <div
                  role="alert"
                  className="mt-5 rounded-xl border border-[#0B1756]/20 bg-[#EAF3F7] p-4 text-sm font-semibold text-[#0B1756]"
                >
                  {erro}
                </div>
              )}
 
              <div className="mt-7 flex flex-col-reverse justify-between gap-3 sm:flex-row">
                <button type="button" onClick={() => setModalAberto(false)} className={botaoSecundario}>
                  Cancelar
                </button>
                <button type="submit" className={botaoPrimario}>
                  <Check size={18} />
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
          <div
            className="fixed inset-0 z-[1000] flex items-center justify-center bg-[#0B1756]/40 p-4 backdrop-blur-sm"
            onClick={() => setRemover(null)}
          >
            <div
              role="alertdialog"
              aria-modal="true"
              aria-labelledby="titulo-remocao"
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md rounded-2xl bg-white p-6 text-center shadow-xl"
            >
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#EAF3F7] text-[#0B1756]">
                <AlertTriangle size={32} />
              </div>
 
              <h2 id="titulo-remocao" className="text-2xl font-bold text-[#0B1756]">
                Remover profissional?
              </h2>
 
              <p className="mt-3 text-sm leading-6 text-slate-600">
                {remover.nome} será removido(a) da equipe, junto com os afastamentos registrados. Para
                apenas suspender o atendimento, altere a situação para "Inativo".
              </p>
 
              <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-center">
                <button type="button" onClick={() => setRemover(null)} className={botaoSecundario}>
                  Cancelar
                </button>
                <button type="button" onClick={confirmarRemocao} className={botaoPrimario}>
                  <Trash2 size={16} />
                  Sim, remover
                </button>
              </div>
            </div>
          </div>
        </Portal>
      )}
 
      {/* AVISOS */}
 
      {aviso && (
        <div
          role="status"
          className={`fixed bottom-5 left-1/2 z-[1100] -translate-x-1/2 rounded-xl px-5 py-3 text-sm font-semibold text-white shadow-lg ${
            aviso.tipo === "erro" ? "bg-rose-600" : "bg-[#17418E]"
          }`}
        >
          {aviso.texto}
        </div>
      )}
    </div>
  );
}