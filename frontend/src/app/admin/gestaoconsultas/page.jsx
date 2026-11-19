"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  Baby, Bone, Brain, CalendarDays, Check, ChevronDown, ChevronLeft,
  ChevronRight, Clock, Eye, HeartPulse, Hospital, Search, Stethoscope,
} from "lucide-react";
import { api } from "@/lib/api";

const especialidades = [
  { nome: "Clínica geral", Icone: Stethoscope },
  { nome: "Cardiologia", Icone: HeartPulse },
  { nome: "Neurologia", Icone: Brain },
  { nome: "Oftalmologia", Icone: Eye },
  { nome: "Pediatria", Icone: Baby },
  { nome: "Ortopedia", Icone: Bone },
];

const statusMap = {
  pendente: "Agendada",
  confirmada: "Agendada",
  em_atendimento: "Em atendimento",
  concluida: "Concluída",
  cancelada: "Cancelada",
  falta: "Faltou",
};

const statusLista = ["Agendada", "Em atendimento", "Concluída", "Cancelada", "Faltou"];
const POR_PAGINA = 10;

const inputCls =
  "w-full rounded-2xl border border-[#023E8A]/40 bg-white px-4 py-3 text-sm text-[#0B1756] outline-none transition placeholder:text-slate-400 hover:border-[#023E8A] focus:border-[#023E8A] focus:ring-4 focus:ring-[#023E8A]/15";

const chipSel = (sel) =>
  sel
    ? "border-[#023E8A] bg-[#023E8A] text-white shadow-sm"
    : "border-[#023E8A]/30 bg-white text-[#023E8A] hover:border-[#023E8A] hover:bg-[#EAF3F7]";

function formatarData(iso) {
  if (!iso) return "";
  const [ano, mes, dia] = String(iso).slice(0, 10).split("-");
  return `${dia}/${mes}/${ano}`;
}

function formatarDataHora(valor) {
  if (!valor) return { data: "", horario: "" };
  const texto = String(valor).replace("T", " ");
  return { data: texto.slice(0, 10), horario: texto.slice(11, 16) };
}

function normalizarConsulta(c) {
  const { data, horario } = formatarDataHora(c.data_hora);
  return {
    id: c.id,
    paciente: c.paciente || "Paciente não informado",
    especialidade: c.especialidade || "Especialidade não informada",
    unidadeId: Number(c.unidade_id),
    unidade: c.unidade || "Unidade não informada",
    medico: c.medico || "",
    data,
    horario,
    status: statusMap[c.status] || c.status,
    statusOriginal: c.status,
  };
}

function iniciais(nome = "") {
  const partes = nome.trim().split(/\s+/);
  return (
    (partes[0]?.[0] || "") +
    (partes.length > 1 ? partes[partes.length - 1][0] : "")
  ).toUpperCase();
}

function Dropdown({ rotulo, valor, opcoes, onChange, placeholder = "Selecione" }) {
  return (
    <div className="relative w-full">
      <select
        aria-label={rotulo}
        value={valor}
        onChange={(e) => onChange(e.target.value)}
        className={`${inputCls} appearance-none pr-10`}
      >
        <option value="">{placeholder}</option>
        {opcoes.map((opcao) => {
          const item =
            typeof opcao === "string"
              ? { valor: opcao, texto: opcao }
              : opcao;
          return (
            <option key={item.valor} value={item.valor}>
              {item.texto}
            </option>
          );
        })}
      </select>
      <ChevronDown
        size={16}
        className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#023E8A]"
      />
    </div>
  );
}

function Paginacao({ pagina, totalPaginas, totalItens, onChange }) {
  if (totalPaginas <= 1) return null;

  return (
    <nav
      aria-label="Paginação"
      className="mt-2 flex flex-col items-center justify-between gap-3 sm:flex-row"
    >
      <p className="text-sm text-slate-600">
        Mostrando{" "}
        <strong className="text-[#023E8A]">
          {(pagina - 1) * POR_PAGINA + 1}
        </strong>{" "}
        a{" "}
        <strong className="text-[#023E8A]">
          {Math.min(pagina * POR_PAGINA, totalItens)}
        </strong>{" "}
        de <strong className="text-[#023E8A]">{totalItens}</strong> consultas
      </p>
      <div className="flex items-center gap-2">
        <button
          type="button"
          aria-label="Página anterior"
          disabled={pagina === 1}
          onClick={() => onChange(pagina - 1)}
          className="flex h-10 min-w-10 items-center justify-center rounded-lg border border-[#023E8A]/30 bg-white px-3 text-[#023E8A] disabled:opacity-40"
        >
          <ChevronLeft size={18} />
        </button>
        <span className="px-2 text-sm font-semibold text-[#023E8A]">
          {pagina} / {totalPaginas}
        </span>
        <button
          type="button"
          aria-label="Próxima página"
          disabled={pagina === totalPaginas}
          onClick={() => onChange(pagina + 1)}
          className="flex h-10 min-w-10 items-center justify-center rounded-lg border border-[#023E8A]/30 bg-white px-3 text-[#023E8A] disabled:opacity-40"
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </nav>
  );
}

export default function GestaoConsultas() {
  const [consultas, setConsultas] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erroCarregamento, setErroCarregamento] = useState("");
  const [busca, setBusca] = useState("");
  const [filtroEsp, setFiltroEsp] = useState("Todas");
  const [filtroUnidade, setFiltroUnidade] = useState("Todas");
  const [filtroData, setFiltroData] = useState("");
  const [filtroStatus, setFiltroStatus] = useState("Todas");
  const [pagina, setPagina] = useState(1);
  const listaRef = useRef(null);

  async function carregarConsultas() {
    try {
      setCarregando(true);
      setErroCarregamento("");
      const resposta = await api("/api/consultas/admin");
      setConsultas((resposta.consultas || []).map(normalizarConsulta));
    } catch (error) {
      setErroCarregamento(
        error.message || "Não foi possível carregar as consultas."
      );
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregarConsultas();
  }, []);

  const especialidadesDisponiveis = useMemo(
    () => [...new Set(consultas.map((c) => c.especialidade).filter(Boolean))].sort(),
    [consultas]
  );

  const unidadesDisponiveis = useMemo(() => {
    const mapa = new Map();
    consultas.forEach((c) => mapa.set(String(c.unidadeId), c.unidade));
    return [...mapa.entries()].map(([valor, texto]) => ({ valor, texto }));
  }, [consultas]);

  const lista = useMemo(() => {
    const termo = busca.trim().toLowerCase();
    return consultas
      .filter((c) => {
        return (
          (!termo || c.paciente.toLowerCase().includes(termo)) &&
          (filtroEsp === "Todas" || c.especialidade === filtroEsp) &&
          (filtroUnidade === "Todas" ||
            c.unidadeId === Number(filtroUnidade)) &&
          (!filtroData || c.data === filtroData) &&
          (filtroStatus === "Todas" || c.status === filtroStatus)
        );
      })
      .sort((a, b) =>
        (a.data + a.horario).localeCompare(b.data + b.horario)
      );
  }, [consultas, busca, filtroEsp, filtroUnidade, filtroData, filtroStatus]);

  const totalPaginas = Math.max(1, Math.ceil(lista.length / POR_PAGINA));
  const paginaAtual = Math.min(pagina, totalPaginas);
  const visiveis = lista.slice(
    (paginaAtual - 1) * POR_PAGINA,
    paginaAtual * POR_PAGINA
  );
  const temFiltro =
    busca ||
    filtroEsp !== "Todas" ||
    filtroUnidade !== "Todas" ||
    filtroData ||
    filtroStatus !== "Todas";

  useEffect(() => {
    setPagina(1);
  }, [busca, filtroEsp, filtroUnidade, filtroData, filtroStatus]);

  function limparFiltros() {
    setBusca("");
    setFiltroEsp("Todas");
    setFiltroUnidade("Todas");
    setFiltroData("");
    setFiltroStatus("Todas");
  }

  function mudarPagina(n) {
    setPagina(n);
    listaRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  const statusVisiveis = ["Todas", ...statusLista];

  return (
    <div className="min-h-screen bg-[#F1F6FB] font-sans text-[#0B1756]">
      <div className="pointer-events-none fixed -right-36 -top-36 h-96 w-96 rounded-full border-[64px] border-[#D9E8FA]/60" />
      <div className="pointer-events-none fixed -bottom-40 -left-32 h-96 w-96 rounded-full bg-white/70" />
      <main className="relative z-10 mx-auto w-full max-w-[1500px] space-y-6 px-4 py-6 sm:px-6 lg:px-8">
        <section className="relative pb-0">
          <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-[#023E8A] via-[#3563A7] to-[#0B1756] px-7 py-7 shadow-sm sm:px-10 sm:py-9">
            <div className="pointer-events-none absolute -right-16 -top-24 h-80 w-80 rounded-full border-[48px] border-white/[0.06]" />
            <div className="pointer-events-none absolute right-[25%] top-20 h-72 w-72 rounded-full border-[45px] border-white/[0.05]" />
            <div className="relative z-10 flex flex-col justify-between gap-7 lg:flex-row lg:items-center">
              <div className="max-w-3xl">
                <h1 className="mt-5 text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl lg:text-[42px]">
                  Gestão de consultas
                </h1>
                <p className="mt-3 max-w-3xl text-sm leading-7 text-white/85 sm:text-base lg:text-lg">
                  Acompanhe os agendamentos, registre atendimentos e ausências
                  e remarque ou cancele consultas quando necessário.
                </p>
              </div>
              <button
                type="button"
                disabled
                title="Cadastro administrativo será conectado na próxima etapa"
                className="shrink-0 cursor-not-allowed rounded-2xl bg-white/80 px-5 py-3.5 text-sm font-semibold text-[#023E8A] opacity-70"
              >
                + Nova consulta
              </button>
            </div>
          </div>
        </section>

        <section className="space-y-5">
          <div className="rounded-2xl border border-[#023E8A]/20 bg-white p-4 shadow-sm sm:p-5">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-[1fr_210px_280px_180px]">
              <div className="relative">
                <Search
                  size={18}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#023E8A]"
                />
                <input
                  type="search"
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                  placeholder="Buscar paciente..."
                  aria-label="Buscar paciente"
                  className={`${inputCls} pl-11`}
                />
              </div>

              <Dropdown
                rotulo="Filtrar por especialidade"
                valor={filtroEsp}
                opcoes={[
                  { valor: "Todas", texto: "Todas as especialidades" },
                  ...especialidadesDisponiveis,
                ]}
                onChange={setFiltroEsp}
                placeholder="Todas as especialidades"
              />

              <Dropdown
                rotulo="Filtrar por unidade"
                valor={filtroUnidade}
                opcoes={[
                  { valor: "Todas", texto: "Todas as unidades" },
                  ...unidadesDisponiveis,
                ]}
                onChange={setFiltroUnidade}
                placeholder="Todas as unidades"
              />

              <div className="relative">
                <input
                  type="date"
                  value={filtroData}
                  onChange={(e) => setFiltroData(e.target.value)}
                  aria-label="Filtrar por data"
                  className={inputCls}
                />
              </div>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-2">
              {statusVisiveis.map((s) => (
                <button
                  key={s}
                  type="button"
                  aria-pressed={filtroStatus === s}
                  onClick={() => setFiltroStatus(s)}
                  className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${chipSel(
                    filtroStatus === s
                  )}`}
                >
                  {s}
                </button>
              ))}
              {temFiltro && (
                <button
                  type="button"
                  onClick={limparFiltros}
                  className="ml-auto text-sm font-semibold text-[#023E8A] hover:underline"
                >
                  Limpar filtros
                </button>
              )}
            </div>
          </div>

          {carregando ? (
            <div className="rounded-2xl border border-[#023E8A]/15 bg-white px-4 py-10 text-center text-[#023E8A]">
              Carregando consultas...
            </div>
          ) : erroCarregamento ? (
            <div className="rounded-2xl border border-red-200 bg-white px-4 py-10 text-center">
              <p className="font-semibold text-red-600">{erroCarregamento}</p>
              <button
                type="button"
                onClick={carregarConsultas}
                className="mt-4 rounded-xl bg-[#023E8A] px-4 py-2 text-sm font-semibold text-white"
              >
                Tentar novamente
              </button>
            </div>
          ) : lista.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-[#023E8A]/30 bg-white px-4 py-10 text-center">
              <p className="text-base font-semibold text-[#023E8A]">
                Nenhuma consulta encontrada.
              </p>
              <p className="mt-1 text-sm text-slate-400">
                Ajuste os filtros ou aguarde novos agendamentos.
              </p>
            </div>
          ) : (
            <div ref={listaRef} className="grid scroll-mt-6 gap-4">
              <p className="text-sm text-slate-500">
                {lista.length} consulta{lista.length === 1 ? "" : "s"}{" "}
                encontrada{lista.length === 1 ? "" : "s"}
              </p>

              {visiveis.map((c) => {
                const Icone =
                  especialidades.find((e) => e.nome === c.especialidade)
                    ?.Icone || Stethoscope;

                return (
                  <article
                    key={c.id}
                    className="flex flex-col justify-between gap-5 rounded-2xl border border-[#023E8A]/15 bg-white p-5 shadow-sm lg:flex-row lg:items-center"
                  >
                    <div className="flex min-w-0 items-start gap-4">
                      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#023E8A] text-lg font-bold text-white">
                        {iniciais(c.paciente)}
                      </div>
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-lg font-bold text-[#0B1756]">
                            {c.paciente}
                          </h3>
                          <span className="inline-flex items-center whitespace-nowrap rounded-full border border-[#023E8A] bg-[#023E8A] px-3 py-1 text-xs font-semibold text-white">
                            {c.status}
                          </span>
                        </div>
                        <p className="mt-1 flex items-center gap-1.5 text-base font-semibold text-[#0B1756]">
                          <Icone
                            size={16}
                            className="shrink-0 text-[#023E8A]"
                          />
                          {c.especialidade}
                        </p>
                        <p className="mt-2 flex items-start gap-1.5 text-sm text-slate-600">
                          <Hospital
                            size={16}
                            className="mt-0.5 shrink-0 text-[#023E8A]"
                          />
                          {c.unidade}
                        </p>
                        {c.medico && (
                          <p className="mt-1 text-sm text-slate-500">
                            Médico: {c.medico}
                          </p>
                        )}
                        <p className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-600">
                          <span className="inline-flex items-center gap-1.5">
                            <CalendarDays
                              size={15}
                              className="text-[#023E8A]"
                            />
                            {formatarData(c.data)}
                          </span>
                          <span className="inline-flex items-center gap-1.5">
                            <Clock size={15} className="text-[#023E8A]" />
                            {c.horario}
                          </span>
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 lg:shrink-0">
                      <span className="text-xs font-semibold text-[#023E8A]">
                        Situação
                      </span>
                      <span className="rounded-xl border border-[#023E8A]/25 bg-[#F8FBFF] px-4 py-3 text-sm font-semibold text-[#0B1756]">
                        {c.status}
                      </span>
                      <p className="text-xs text-slate-400">
                        Alterações administrativas serão habilitadas na
                        próxima etapa.
                      </p>
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
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
