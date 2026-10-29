"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  AlertTriangle,
  Baby,
  Bone,
  Brain,
  CalendarCheck,
  CalendarDays,
  CalendarPlus,
  CalendarX,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock,
  Eye,
  HeartPulse,
  Hospital,
  Info,
  Pencil,
  Search,
  ShieldCheck,
  Stethoscope,
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

const horarios = ["08:00", "09:00", "10:30", "14:00", "15:30", "17:00"];
const statusLista = ["Agendada", "Concluída", "Cancelada", "Faltou"];

const estiloStatus = {
  Agendada: { badge: "bg-[#3563A7]/15", ponto: "bg-[#023E8A]" },
  Concluída: { badge: "bg-emerald-100", ponto: "bg-emerald-600" },
  Cancelada: { badge: "bg-red-100", ponto: "bg-red-500" },
  Faltou: { badge: "bg-amber-100", ponto: "bg-amber-500" },
};

const consultasIniciais = [
  { id: 1, paciente: "Mariana Costa", especialidade: "Cardiologia", unidadeId: 1, data: "2026-10-22", horario: "09:00", status: "Agendada" },
  { id: 2, paciente: "João Pedro Alves", especialidade: "Clínica geral", unidadeId: 3, data: "2026-10-22", horario: "14:00", status: "Agendada" },
  { id: 3, paciente: "Ana Beatriz Lima", especialidade: "Pediatria", unidadeId: 2, data: "2026-10-23", horario: "10:30", status: "Agendada" },
  { id: 4, paciente: "Carlos Eduardo Sá", especialidade: "Ortopedia", unidadeId: 1, data: "2026-10-26", horario: "15:30", status: "Agendada" },
  { id: 5, paciente: "Fernanda Rocha", especialidade: "Oftalmologia", unidadeId: 2, data: "2026-10-20", horario: "08:00", status: "Concluída" },
  { id: 6, paciente: "Lucas Martins", especialidade: "Neurologia", unidadeId: 3, data: "2026-10-19", horario: "17:00", status: "Faltou" },
  { id: 7, paciente: "Patrícia Gomes", especialidade: "Clínica geral", unidadeId: 1, data: "2026-10-18", horario: "09:00", status: "Concluída" },
  { id: 8, paciente: "Roberto Nunes", especialidade: "Cardiologia", unidadeId: 3, data: "2026-10-27", horario: "10:30", status: "Cancelada" },
];

const formVazio = {
  paciente: "",
  especialidade: "",
  unidadeId: "",
  data: "",
  horario: "",
  status: "Agendada",
};

function iniciais(nome) {
  const partes = nome.trim().split(/\s+/);
  const primeira = partes[0]?.[0] || "";
  const ultima = partes.length > 1 ? partes[partes.length - 1][0] : "";
  return (primeira + ultima).toUpperCase();
}

function formatarData(iso) {
  if (!iso) return "";
  const [a, m, d] = iso.split("-");
  return `${d}/${m}/${a}`;
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

/* Renderiza o conteúdo direto no <body>, acima do menu superior do site
   e acima dos modais (usado também pelos menus e pelo calendário). */
function Portal({ children }) {
  return createPortal(children, document.body);
}

/* Menu suspenso personalizado.
   `opcoes` aceita textos simples ou objetos { valor, texto }.
   A lista é renderizada no <body> com z-index acima dos modais, então nunca
   fica escondida atrás deles nem é cortada por janelas com rolagem. */
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
  const [pos, setPos] = useState({ top: 0, left: 0, width: 0 });
  const ref = useRef(null);

  const lista = opcoes.map((o) =>
    typeof o === "string" ? { valor: o, texto: o } : o
  );
  const atual = lista.find((o) => o.valor === valor);
  const minLista = Number(larguraLista.match(/\[(\d+)px\]/)?.[1] || 170);

  // Fecha ao rolar a página ou redimensionar a janela
  useEffect(() => {
    if (!aberto) return;
    const fechar = (e) => {
      if (e.target?.closest?.("[data-popup]")) return;
      setAberto(false);
    };
    window.addEventListener("scroll", fechar, true);
    window.addEventListener("resize", fechar);
    return () => {
      window.removeEventListener("scroll", fechar, true);
      window.removeEventListener("resize", fechar);
    };
  }, [aberto]);

  function alternar() {
    if (!aberto && ref.current) {
      const r = ref.current.getBoundingClientRect();
      const altLista = Math.min(240, lista.length * 48 + 12);
      const larg = Math.min(
        Math.max(r.width, minLista),
        window.innerWidth - 24
      );
      const cabeEmbaixo = window.innerHeight - r.bottom - 12 >= altLista;

      setPos({
        top: cabeEmbaixo ? r.bottom + 8 : Math.max(12, r.top - altLista - 8),
        left: Math.max(12, Math.min(r.left, window.innerWidth - larg - 12)),
        width: larg,
      });
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
        <Portal>
          <button
            type="button"
            aria-label="Fechar menu"
            onClick={() => setAberto(false)}
            className="fixed inset-0 z-[1100] cursor-default"
          />

          <div
            data-popup
            role="listbox"
            aria-label={rotulo}
            style={{ top: pos.top, left: pos.left, width: pos.width }}
            className="fixed z-[1110] max-h-60 overflow-y-auto rounded-xl border border-blue-100 bg-white p-1.5 text-[#0B1756] shadow-xl"
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
        </Portal>
      )}
    </div>
  );
}

const nomesMeses = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
];
const nomesSemana = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

function paraIso(ano, mes, dia) {
  return `${ano}-${String(mes + 1).padStart(2, "0")}-${String(dia).padStart(2, "0")}`;
}

/* Calendário personalizado.
   `valor` e `onChange` usam o formato AAAA-MM-DD.
   O card é renderizado no <body>, acima de qualquer modal, e a posição é
   calculada para ficar sempre inteiro dentro da tela. */
function DatePicker({
  rotulo,
  valor,
  onChange,
  placeholder = "Selecione a data",
  limpavel = false,
  altura = "min-h-[46px]",
}) {
  const [aberto, setAberto] = useState(false);
  const [visao, setVisao] = useState({ ano: 2026, mes: 0 });
  const [pos, setPos] = useState({ top: 0, left: 0 });
  const ref = useRef(null);

  const hoje = new Date();
  const hojeIso = paraIso(hoje.getFullYear(), hoje.getMonth(), hoje.getDate());

  // Fecha ao rolar a página ou redimensionar a janela
  useEffect(() => {
    if (!aberto) return;
    const fechar = (e) => {
      if (e.target?.closest?.("[data-popup]")) return;
      setAberto(false);
    };
    window.addEventListener("scroll", fechar, true);
    window.addEventListener("resize", fechar);
    return () => {
      window.removeEventListener("scroll", fechar, true);
      window.removeEventListener("resize", fechar);
    };
  }, [aberto]);

  function alternar() {
    if (!aberto) {
      const base = valor ? new Date(`${valor}T00:00:00`) : new Date();
      setVisao({ ano: base.getFullYear(), mes: base.getMonth() });

      if (ref.current) {
        const r = ref.current.getBoundingClientRect();
        const ALT = 430; // altura máxima do card (mês com 6 semanas)
        const LARG = 300;

        // Tenta abrir embaixo; se não couber, abre em cima; se também não
        // couber, encosta na parte de baixo da tela.
        let top = r.bottom + 8;
        if (top + ALT > window.innerHeight - 12) {
          const acima = r.top - ALT - 8;
          top = acima >= 12 ? acima : Math.max(12, window.innerHeight - ALT - 12);
        }

        setPos({
          top,
          left: Math.max(12, Math.min(r.left, window.innerWidth - LARG - 12)),
        });
      }
    }
    setAberto((a) => !a);
  }

  function mudarMes(delta) {
    setVisao(({ ano, mes }) => {
      const d = new Date(ano, mes + delta, 1);
      return { ano: d.getFullYear(), mes: d.getMonth() };
    });
  }

  function escolher(iso) {
    onChange(iso);
    setAberto(false);
  }

  const primeiroDia = new Date(visao.ano, visao.mes, 1).getDay();
  const totalDias = new Date(visao.ano, visao.mes + 1, 0).getDate();
  const celulas = [
    ...Array(primeiroDia).fill(null),
    ...Array.from({ length: totalDias }, (_, i) => i + 1),
  ];

  return (
    <div
      ref={ref}
      className="relative w-full"
      onKeyDown={(e) => e.key === "Escape" && setAberto(false)}
    >
      <button
        type="button"
        aria-label={rotulo}
        aria-haspopup="dialog"
        aria-expanded={aberto}
        onClick={alternar}
        className={`flex ${altura} w-full items-center justify-between gap-3 rounded-lg border bg-white px-4 py-2 text-left text-sm text-[#0B1756] transition focus:outline-none focus:ring-2 focus:ring-[#3563A7]/30 ${
          aberto
            ? "border-[#023E8A] ring-2 ring-[#3563A7]/30"
            : "border-[#3563A7]/40 hover:border-[#3563A7]"
        }`}
      >
        <span className={`min-w-0 truncate ${valor ? "" : "opacity-60"}`}>
          {valor ? formatarData(valor) : placeholder}
        </span>

        <CalendarDays size={18} className="shrink-0 text-[#3563A7]" />
      </button>

      {aberto && (
        <Portal>
          <button
            type="button"
            aria-label="Fechar calendário"
            onClick={() => setAberto(false)}
            className="fixed inset-0 z-[1100] cursor-default"
          />

          <div
            data-popup
            role="dialog"
            aria-label={rotulo}
            style={{ top: pos.top, left: pos.left }}
            className="fixed z-[1110] w-[300px] max-w-[calc(100vw-1.5rem)] rounded-xl border border-blue-100 bg-white p-3 text-[#0B1756] shadow-xl"
          >
            <div className="mb-3 flex items-center justify-between">
              <button
                type="button"
                aria-label="Mês anterior"
                onClick={() => mudarMes(-1)}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-[#0B1756] transition hover:bg-[#3563A7]/10"
              >
                <ChevronLeft size={19} />
              </button>

              <p className="text-sm font-bold">
                {nomesMeses[visao.mes]} {visao.ano}
              </p>

              <button
                type="button"
                aria-label="Próximo mês"
                onClick={() => mudarMes(1)}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-[#0B1756] transition hover:bg-[#3563A7]/10"
              >
                <ChevronRight size={19} />
              </button>
            </div>

            <div className="mb-1 grid grid-cols-7 text-center">
              {nomesSemana.map((d) => (
                <span key={d} className="py-1 text-xs font-semibold opacity-60">
                  {d}
                </span>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-y-1">
              {celulas.map((dia, i) => {
                if (!dia) return <span key={`vazio-${i}`} />;

                const iso = paraIso(visao.ano, visao.mes, dia);
                const selecionado = iso === valor;
                const ehHoje = iso === hojeIso;

                return (
                  <button
                    key={iso}
                    type="button"
                    aria-pressed={selecionado}
                    onClick={() => escolher(iso)}
                    className={`mx-auto flex h-9 w-9 items-center justify-center rounded-full text-sm transition ${
                      selecionado
                        ? "bg-[#023E8A] font-bold text-white"
                        : ehHoje
                        ? "border border-[#023E8A] font-bold hover:bg-[#3563A7]/10"
                        : "hover:bg-[#3563A7]/10"
                    }`}
                  >
                    {dia}
                  </button>
                );
              })}
            </div>

            <div className="mt-3 flex items-center justify-between border-t border-blue-100 pt-3">
              <button
                type="button"
                onClick={() => escolher(hojeIso)}
                className="rounded-lg px-3 py-2 text-sm font-bold text-[#023E8A] transition hover:bg-[#3563A7]/10"
              >
                Hoje
              </button>

              {limpavel && valor && (
                <button
                  type="button"
                  onClick={() => escolher("")}
                  className="rounded-lg px-3 py-2 text-sm font-bold transition hover:bg-[#3563A7]/10"
                >
                  Limpar
                </button>
              )}
            </div>
          </div>
        </Portal>
      )}
    </div>
  );
}

const POR_PAGINA = 10;

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

export default function GestaoConsultas() {
  const [consultas, setConsultas] = useState(consultasIniciais);
  const [busca, setBusca] = useState("");
  const [filtroEsp, setFiltroEsp] = useState("Todas");
  const [filtroUnidade, setFiltroUnidade] = useState("Todas");
  const [filtroData, setFiltroData] = useState("");
  const [filtroStatus, setFiltroStatus] = useState("Todas");
  const [modalAberto, setModalAberto] = useState(false);
  const [editandoId, setEditandoId] = useState(null);
  const [form, setForm] = useState(formVazio);
  const [erro, setErro] = useState("");
  const [pagina, setPagina] = useState(1);
  const listaRef = useRef(null);
  const [cancelar, setCancelar] = useState(null);

  const contar = (s) => consultas.filter((c) => c.status === s).length;

  const lista = consultas
    .filter((c) => {
      const termo = busca.trim().toLowerCase();
      return (
        (!termo || c.paciente.toLowerCase().includes(termo)) &&
        (filtroEsp === "Todas" || c.especialidade === filtroEsp) &&
        (filtroUnidade === "Todas" || c.unidadeId === Number(filtroUnidade)) &&
        (!filtroData || c.data === filtroData) &&
        (filtroStatus === "Todas" || c.status === filtroStatus)
      );
    })
    .sort((a, b) => (a.data + a.horario).localeCompare(b.data + b.horario));

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
  }, [busca, filtroEsp, filtroUnidade, filtroData, filtroStatus]);

  // Trava a rolagem da página enquanto um diálogo estiver aberto
  useEffect(() => {
    document.body.style.overflow = modalAberto || cancelar ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [modalAberto, cancelar]);

  // Fecha os diálogos com Esc
  useEffect(() => {
    function aoTeclar(e) {
      if (e.key === "Escape") {
        setModalAberto(false);
        setCancelar(null);
      }
    }
    window.addEventListener("keydown", aoTeclar);
    return () => window.removeEventListener("keydown", aoTeclar);
  }, []);

  function mudarPagina(n) {
    setPagina(n);
    listaRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function abrirNova() {
    setEditandoId(null);
    setForm(formVazio);
    setErro("");
    setModalAberto(true);
  }

  function abrirEdicao(c) {
    setEditandoId(c.id);
    setForm({ ...c, unidadeId: String(c.unidadeId) });
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

  function salvar(event) {
    event.preventDefault();
    setErro("");

    if (form.paciente.trim().length < 3) {
      setErro("Informe o nome completo do paciente.");
      return;
    }
    if (!form.especialidade || !form.unidadeId) {
      setErro("Selecione a especialidade e a unidade.");
      return;
    }
    if (!form.data || !form.horario) {
      setErro("Informe a data e o horário da consulta.");
      return;
    }

    const dados = {
      ...form,
      paciente: form.paciente.trim(),
      unidadeId: Number(form.unidadeId),
    };

    setConsultas((atuais) =>
      editandoId
        ? atuais.map((c) => (c.id === editandoId ? { ...dados, id: editandoId } : c))
        : [{ ...dados, id: Date.now() }, ...atuais]
    );
    setModalAberto(false);
  }

  function alterarStatus(id, status) {
    setConsultas((atuais) => atuais.map((c) => (c.id === id ? { ...c, status } : c)));
  }

  function confirmarCancelamento() {
    alterarStatus(cancelar.id, "Cancelada");
    setCancelar(null);
  }

  const cardBase = "rounded-xl border border-blue-100 bg-white shadow-sm";
  const campo =
    "w-full rounded-lg border border-[#3563A7]/40 bg-white px-4 py-3 text-sm text-[#0B1756] outline-none transition placeholder:text-[#0B1756]/50 focus:border-[#023E8A] focus:ring-2 focus:ring-[#3563A7]/30 disabled:cursor-not-allowed disabled:opacity-60";
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
              Gestão de consultas
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-7 sm:text-base">
              Acompanhe todos os agendamentos, registre atendimentos, ausências e
              remarque ou cancele consultas quando necessário.
            </p>
          </div>

          <div className="flex max-w-md items-start gap-3 rounded-xl border border-[#3563A7]/40 bg-[#3563A7]/10 p-4">
            <Info className="mt-0.5 shrink-0 text-[#023E8A]" size={23} />
            <p className="text-sm leading-6">
              Consultas canceladas liberam o horário para novos agendamentos na
              unidade.
            </p>
          </div>
        </section>

        {/* INDICADORES */}
        <section className="mb-7 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {[
            { rotulo: "Agendadas", valor: contar("Agendada"), Icone: CalendarCheck },
            { rotulo: "Concluídas", valor: contar("Concluída"), Icone: CheckCircle2 },
            { rotulo: "Canceladas", valor: contar("Cancelada"), Icone: CalendarX },
            { rotulo: "Faltas", valor: contar("Faltou"), Icone: AlertTriangle },
          ].map(({ rotulo, valor, Icone }) => (
            <div key={rotulo} className={`${cardBase} flex items-center gap-4 p-4 sm:p-5`}>
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#3563A7]/10 text-[#023E8A]">
                <Icone size={25} />
              </div>
              <div>
                <p className="text-2xl font-extrabold leading-none sm:text-3xl">{valor}</p>
                <p className="mt-1 text-xs font-semibold sm:text-sm">{rotulo}</p>
              </div>
            </div>
          ))}
        </section>

        {/* FILTROS */}
        <section className={`${cardBase} mb-7 p-4 sm:p-5`}>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-[1fr_200px_260px_170px_auto]">
            <div className="relative">
              <Search
                size={18}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#3563A7]"
              />
              <input
                type="search"
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                placeholder="Buscar paciente..."
                aria-label="Buscar paciente"
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

            <DatePicker
              rotulo="Filtrar por data"
              valor={filtroData}
              onChange={setFiltroData}
              placeholder="Filtrar por data"
              limpavel
            />

            <button type="button" onClick={abrirNova} className={`${botaoPrimario} md:col-span-2 xl:col-span-1`}>
              <CalendarPlus size={19} />
              Nova consulta
            </button>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            {["Todas", ...statusLista].map((s) => (
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

            {(busca || filtroEsp !== "Todas" || filtroUnidade !== "Todas" || filtroData) && (
              <button
                type="button"
                onClick={() => {
                  setBusca("");
                  setFiltroEsp("Todas");
                  setFiltroUnidade("Todas");
                  setFiltroData("");
                }}
                className="ml-auto text-sm font-bold text-[#023E8A] underline-offset-2 hover:underline"
              >
                Limpar filtros
              </button>
            )}
          </div>
        </section>

        {/* LISTA DE CONSULTAS */}
        {lista.length === 0 ? (
          <section className={`${cardBase} p-10 text-center`}>
            <p className="font-semibold">Nenhuma consulta encontrada.</p>
            <p className="mt-1 text-sm">
              Ajuste os filtros ou cadastre uma nova consulta.
            </p>
          </section>
        ) : (
          <section ref={listaRef} className="grid scroll-mt-36 gap-4">
            <p className="text-sm font-semibold">
              {lista.length} consulta{lista.length === 1 ? "" : "s"} encontrada
              {lista.length === 1 ? "" : "s"}
            </p>

            {visiveis.map((c) => {
              const estilo = estiloStatus[c.status];
              const Icone =
                especialidades.find((e) => e.nome === c.especialidade)?.Icone || Stethoscope;
              const encerrada = c.status === "Cancelada";

              return (
                <article
                  key={c.id}
                  className={`${cardBase} flex flex-col justify-between gap-5 p-5 lg:flex-row lg:items-center`}
                >
                  <div className="flex min-w-0 items-start gap-4">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#023E8A] text-lg font-bold text-white">
                      {iniciais(c.paciente)}
                    </div>

                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-lg font-bold">{c.paciente}</h3>
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${estilo.badge}`}
                        >
                          <span className={`h-2 w-2 rounded-full ${estilo.ponto}`} />
                          {c.status}
                        </span>
                      </div>

                      <p className="mt-1 flex items-center gap-1.5 text-sm font-medium">
                        <Icone size={16} className="shrink-0 text-[#023E8A]" />
                        {c.especialidade}
                      </p>

                      <p className="mt-2 flex items-start gap-1.5 text-sm">
                        <Hospital size={16} className="mt-0.5 shrink-0 text-[#3563A7]" />
                        {nomeUnidade(c.unidadeId)}
                      </p>

                      <p className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
                        <span className="inline-flex items-center gap-1.5">
                          <CalendarDays size={15} className="text-[#3563A7]" />
                          {formatarData(c.data)}
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                          <Clock size={15} className="text-[#3563A7]" />
                          {c.horario}
                        </span>
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row sm:items-end lg:shrink-0">
                    <div className="flex items-center gap-3 text-sm font-semibold sm:flex-col sm:items-start sm:gap-1">
                      <span>Situação</span>

                      <Dropdown
                        rotulo={`Situação de ${c.paciente}`}
                        valor={c.status}
                        opcoes={statusLista}
                        onChange={(novo) => alterarStatus(c.id, novo)}
                        largura="w-40"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2 sm:flex">
                      <button
                        type="button"
                        onClick={() => abrirEdicao(c)}
                        className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl bg-[#023E8A] px-4 py-2 text-sm font-bold text-white transition hover:bg-[#3563A7] focus:outline-none focus:ring-4 focus:ring-[#3563A7]/40"
                      >
                        <Pencil size={17} />
                        Editar
                      </button>

                      <button
                        type="button"
                        disabled={encerrada}
                        onClick={() => setCancelar(c)}
                        className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl border border-red-200 bg-white px-4 py-2 text-sm font-bold text-red-700 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-white"
                      >
                        <X size={17} />
                        Cancelar
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}

            <Paginacao
              pagina={paginaAtual}
              totalPaginas={totalPaginas}
              totalItens={lista.length}
              onChange={mudarPagina}
            />
          </section>
        )}
      </div>

      {/* MODAL: NOVA / EDITAR CONSULTA */}
      {modalAberto && (
        <Portal>
          <div className="fixed inset-0 z-[1000] flex items-end justify-center bg-[#0B1756]/50 p-0 sm:items-center sm:p-6">
            <form
              onSubmit={salvar}
              role="dialog"
              aria-modal="true"
              aria-labelledby="titulo-modal"
              className="max-h-[90dvh] w-full max-w-2xl overflow-y-auto rounded-t-2xl bg-white p-5 text-[#0B1756] shadow-2xl sm:rounded-2xl sm:p-8"
            >
              <div className="mb-6 flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#3563A7]/10 text-[#023E8A]">
                    <CalendarPlus size={26} />
                  </div>
                  <div>
                    <h2 id="titulo-modal" className="text-xl font-bold sm:text-2xl">
                      {editandoId ? "Editar consulta" : "Nova consulta"}
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
                  <label htmlFor="paciente" className="mb-2 block text-sm font-bold">
                    Paciente<span className="ml-1 text-red-500">*</span>
                  </label>
                  <input
                    id="paciente"
                    value={form.paciente}
                    onChange={(e) => atualizar("paciente", e.target.value)}
                    maxLength={80}
                    placeholder="Nome completo do paciente"
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
                    Unidade<span className="ml-1 text-red-500">*</span>
                  </p>
                  <Dropdown
                    rotulo="Unidade"
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
                  <p className="mb-2 text-sm font-bold">
                    Data<span className="ml-1 text-red-500">*</span>
                  </p>
                  <DatePicker
                    rotulo="Data da consulta"
                    valor={form.data}
                    onChange={(novo) => atualizar("data", novo)}
                  />
                </div>

                <div>
                  <p className="mb-2 text-sm font-bold">Situação</p>
                  <Dropdown
                    rotulo="Situação"
                    valor={form.status}
                    opcoes={statusLista}
                    onChange={(novo) => atualizar("status", novo)}
                    altura="min-h-[46px]"
                  />
                </div>

                <fieldset className="sm:col-span-2">
                  <legend className="mb-2 text-sm font-bold">
                    Horário<span className="ml-1 text-red-500">*</span>
                  </legend>

                  <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
                    {horarios.map((h) => {
                      const sel = form.horario === h;

                      return (
                        <button
                          key={h}
                          type="button"
                          aria-pressed={sel}
                          onClick={() => atualizar("horario", h)}
                          className={`flex min-h-[44px] items-center justify-center gap-1.5 rounded-lg border px-2 py-2 text-sm font-semibold transition ${
                            sel
                              ? "border-[#023E8A] bg-[#023E8A] text-white"
                              : "border-blue-100 bg-white hover:border-[#3563A7] hover:bg-[#3563A7]/10"
                          }`}
                        >
                          {sel ? <Check size={15} /> : <Clock size={15} />}
                          {h}
                        </button>
                      );
                    })}
                  </div>
                </fieldset>
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
                <button type="button" onClick={() => setModalAberto(false)} className={botaoSecundario}>
                  Cancelar
                </button>

                <button type="submit" className={botaoPrimario}>
                  <Check size={20} />
                  {editandoId ? "Salvar alterações" : "Cadastrar consulta"}
                </button>
              </div>
            </form>
          </div>
        </Portal>
      )}

      {/* MODAL: CONFIRMAR CANCELAMENTO */}
      {cancelar && (
        <Portal>
          <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-[#0B1756]/50 p-4">
            <div
              role="alertdialog"
              aria-modal="true"
              aria-labelledby="titulo-cancelamento"
              className="w-full max-w-md rounded-2xl bg-white p-6 text-center text-[#0B1756] shadow-2xl sm:p-8"
            >
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-50 text-red-600">
                <AlertTriangle size={34} />
              </div>

              <h2 id="titulo-cancelamento" className="text-xl font-bold">
                Cancelar consulta?
              </h2>

              <p className="mt-3 text-sm leading-6">
                A consulta de {cancelar.paciente} ({cancelar.especialidade}) em{" "}
                {formatarData(cancelar.data)} às {cancelar.horario} será marcada
                como cancelada e o horário ficará livre.
              </p>

              <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-center">
                <button type="button" onClick={() => setCancelar(null)} className={botaoSecundario}>
                  Voltar
                </button>

                <button
                  type="button"
                  onClick={confirmarCancelamento}
                  className="inline-flex min-h-[50px] items-center justify-center gap-2 rounded-xl bg-red-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-red-700 focus:outline-none focus:ring-4 focus:ring-red-200"
                >
                  <CalendarX size={18} />
                  Sim, cancelar
                </button>
              </div>
            </div>
          </div>
        </Portal>
      )}
    </main>
  );
}