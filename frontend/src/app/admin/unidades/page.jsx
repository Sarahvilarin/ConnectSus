"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Activity,
  Building2,
  Check,
  CheckCircle2,
  ChevronDown,
  Clock3,
  Hospital,
  MapPin,
  MapPinned,
  Pencil,
  Plus,
  RefreshCw,
  Search,
  SlidersHorizontal,
  Stethoscope,
  Trash2,
  X,
  Phone,
  Hash,
  Layers3,
  Map as MapIcon,
  AlertCircle,
} from "lucide-react";

const API_URL = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080").replace(/\/$/, "");

const TIPOS_UNIDADE = [
  { id: 1, nome: "UBS" },
  { id: 2, nome: "UPA 24h" },
  { id: 3, nome: "CAPS" },
  { id: 4, nome: "Hospital Municipal" },
  { id: 5, nome: "Pronto-Socorro" },
  { id: 6, nome: "Policlínica" },
];

const FORM_INICIAL = {
  nome: "",
  cnes: "",
  tipo_unidade_id: "",
  rua: "",
  bairro: "",
  cep: "",
  telefone: "",
  horario_funcionamento: "",
  servicos_disponiveis: "",
};

const inputClass =
  "w-full rounded-xl border border-[#D8E4F1] bg-white px-4 py-3 text-sm text-[#14245B] outline-none transition placeholder:text-slate-400 focus:border-[#3974B9] focus:ring-4 focus:ring-[#023E8A]/10";

function obterToken() {
  if (typeof window === "undefined") return null;
  return (
    localStorage.getItem("token") ||
    localStorage.getItem("accessToken") ||
    localStorage.getItem("authToken") ||
    localStorage.getItem("jwt")
  );
}

async function requisicaoApi(caminho, opcoes = {}) {
  const token = obterToken();
  const headers = { ...(opcoes.headers || {}) };
  if (opcoes.body && !headers["Content-Type"]) headers["Content-Type"] = "application/json";
  if (token) headers.Authorization = `Bearer ${token}`;

  const resposta = await fetch(`${API_URL}${caminho}`, {
    ...opcoes,
    headers,
    cache: "no-store",
  });

  const texto = await resposta.text();
  let dados = {};
  try {
    dados = texto ? JSON.parse(texto) : {};
  } catch {
    dados = { mensagem: texto };
  }

  if (!resposta.ok) {
    throw new Error(
      dados?.mensagem ||
        dados?.message ||
        (resposta.status === 401 || resposta.status === 403
          ? "Acesso não autorizado. Entre novamente com uma conta administradora."
          : `Não foi possível concluir a operação (erro ${resposta.status}).`),
    );
  }
  return dados;
}

function normalizarUnidades(resposta) {
  if (Array.isArray(resposta)) return resposta;
  if (Array.isArray(resposta?.unidades)) return resposta.unidades;
  if (Array.isArray(resposta?.data)) return resposta.data;
  if (Array.isArray(resposta?.resultados)) return resposta.resultados;
  return [];
}

function nomeTipo(unidade) {
  if (unidade?.tipo) return unidade.tipo;
  const tipo = TIPOS_UNIDADE.find(
    (item) => Number(item.id) === Number(unidade?.tipo_unidade_id),
  );
  return tipo?.nome || "Tipo não informado";
}

function unidadeAtiva(unidade) {
  return ![false, 0, "0", "false"].includes(unidade?.ativo);
}

function formatarCep(valor = "") {
  const numeros = String(valor).replace(/\D/g, "").slice(0, 8);
  return numeros.length > 5
    ? `${numeros.slice(0, 5)}-${numeros.slice(5)}`
    : numeros;
}

function formatarTelefone(valor = "") {
  const numeros = String(valor).replace(/\D/g, "").slice(0, 11);
  if (numeros.length <= 2) return numeros;
  if (numeros.length <= 6) return `(${numeros.slice(0, 2)}) ${numeros.slice(2)}`;
  if (numeros.length <= 10) {
    return `(${numeros.slice(0, 2)}) ${numeros.slice(2, 6)}-${numeros.slice(6)}`;
  }
  return `(${numeros.slice(0, 2)}) ${numeros.slice(2, 7)}-${numeros.slice(7)}`;
}

function IconeTipo({ tipo, size = 20 }) {
  const nome = String(tipo || "").toLowerCase();
  const Icone =
    nome.includes("upa") || nome.includes("pronto")
      ? Activity
      : nome.includes("hospital")
        ? Hospital
        : nome.includes("poli") || nome.includes("caps")
          ? Stethoscope
          : Building2;
  return <Icone size={size} strokeWidth={1.8} />;
}

function ListaEscolha({
  value,
  onChange,
  options,
  placeholder = "Selecione uma opção",
  icon: IconePadrao = MapPin,
  ariaLabel = "Lista de opções",
  searchable = false,
}) {
  const [aberta, setAberta] = useState(false);
  const [termo, setTermo] = useState("");
  const raizRef = useRef(null);
  const selecionada = options.find(
    (opcao) => String(opcao.value) === String(value),
  );
  const filtradas = options.filter((opcao) =>
    opcao.label
      .toLocaleLowerCase("pt-BR")
      .includes(termo.trim().toLocaleLowerCase("pt-BR")),
  );

  useEffect(() => {
    if (!aberta) return undefined;

    function fecharFora(event) {
      if (raizRef.current && !raizRef.current.contains(event.target)) {
        setAberta(false);
        setTermo("");
      }
    }

    function fecharEscape(event) {
      if (event.key === "Escape") {
        setAberta(false);
        setTermo("");
      }
    }

    document.addEventListener("mousedown", fecharFora);
    document.addEventListener("touchstart", fecharFora);
    document.addEventListener("keydown", fecharEscape);
    return () => {
      document.removeEventListener("mousedown", fecharFora);
      document.removeEventListener("touchstart", fecharFora);
      document.removeEventListener("keydown", fecharEscape);
    };
  }, [aberta]);

  const IconeSelecionado = selecionada?.icone || IconePadrao;

  return (
    <div ref={raizRef} className="relative min-w-0">
      <button
        type="button"
        aria-label={ariaLabel}
        aria-haspopup="listbox"
        aria-expanded={aberta}
        onClick={() => setAberta((atual) => !atual)}
        className={`flex min-h-12 w-full items-center gap-3 rounded-xl border bg-white px-3 py-2 text-left shadow-[0_2px_5px_rgba(15,45,85,0.035)] outline-none transition hover:border-[#AFC5DF] hover:bg-[#FCFDFF] focus:border-[#3974B9] focus:ring-4 focus:ring-[#023E8A]/10 ${
          aberta
            ? "border-[#8EADD0] ring-4 ring-[#023E8A]/[0.08]"
            : "border-[#D8E4F1]"
        }`}
      >
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#EAF2F7] text-[#023E8A]">
          <IconeSelecionado size={17} strokeWidth={1.9} />
        </span>
        <span
          className={`min-w-0 flex-1 truncate text-sm ${
            selecionada
              ? "font-semibold text-[#14245B]"
              : "text-slate-400"
          }`}
        >
          {selecionada?.label || placeholder}
        </span>
        <ChevronDown
          size={17}
          className={`shrink-0 text-[#6B83A3] transition-transform duration-200 ${
            aberta ? "rotate-180" : ""
          }`}
        />
      </button>

      {aberta && (
        <div className="absolute left-0 top-full z-[90] mt-2 w-full min-w-[230px] overflow-hidden rounded-[20px] border border-[#E0EAF5] bg-white p-1.5 shadow-[0_20px_48px_rgba(16,45,88,0.18)]">
          {searchable && options.length > 6 && (
            <div className="sticky top-0 z-10 bg-white p-1 pb-2">
              <div className="relative">
                <Search
                  size={15}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  autoFocus
                  value={termo}
                  onChange={(event) => setTermo(event.target.value)}
                  onKeyDown={(event) => event.stopPropagation()}
                  placeholder="Buscar opção..."
                  className="h-10 w-full rounded-xl border border-[#E4ECF5] bg-[#F8FAFD] pl-9 pr-3 text-sm text-[#14245B] outline-none placeholder:text-slate-400 focus:border-[#AFC5DF]"
                />
              </div>
            </div>
          )}

          <div
            role="listbox"
            aria-label={ariaLabel}
            className="max-h-[270px] overflow-y-auto overscroll-contain pr-0.5 [scrollbar-color:#9CA3AF_transparent] [scrollbar-width:thin]"
          >
            {filtradas.length === 0 ? (
              <p className="px-3 py-5 text-center text-xs text-slate-400">
                Nenhuma opção encontrada.
              </p>
            ) : (
              filtradas.map((opcao) => {
                const ativa = String(opcao.value) === String(value);
                const IconeOpcao = opcao.icone || IconePadrao;
                return (
                  <button
                    key={String(opcao.value)}
                    type="button"
                    role="option"
                    aria-selected={ativa}
                    onClick={() => {
                      onChange(opcao.value);
                      setAberta(false);
                      setTermo("");
                    }}
                    className={`mb-1 flex min-h-12 w-full items-center gap-3 rounded-xl px-3 py-2 text-left transition last:mb-0 ${
                      ativa
                        ? "bg-[#1B438E] text-white shadow-sm"
                        : "text-[#14245B] hover:bg-[#F1F6FB]"
                    }`}
                  >
                    <span
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
                        ativa
                          ? "bg-white/15 text-white"
                          : "bg-[#EAF2F7] text-[#023E8A]"
                      }`}
                    >
                      <IconeOpcao size={17} strokeWidth={1.9} />
                    </span>
                    <span
                      className={`min-w-0 flex-1 truncate text-sm ${
                        ativa ? "font-bold" : "font-medium"
                      }`}
                    >
                      {opcao.label}
                    </span>
                    {ativa && <Check size={16} className="shrink-0 text-white" />}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function Campo({ label, children, className = "" }) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-2 block text-sm font-semibold text-[#14245B]">
        {label}
      </span>
      {children}
    </label>
  );
}

function Indicador({ titulo, valor, detalhe, icone: Icone, cor = "azul" }) {
  const cores = {
    azul: "bg-[#EAF2FB] text-[#023E8A]",
    verde: "bg-emerald-50 text-emerald-700",
    roxo: "bg-violet-50 text-violet-700",
    cinza: "bg-slate-100 text-slate-600",
  };

  return (
    <article className="rounded-2xl border border-[#DFEAF5] bg-white p-5 shadow-[0_5px_18px_rgba(20,55,100,0.04)] sm:p-6">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-medium text-slate-500">{titulo}</p>
          <p className="mt-3 text-3xl font-extrabold tracking-tight text-[#10245C]">
            {valor}
          </p>
          <p className="mt-2 text-xs text-slate-400">{detalhe}</p>
        </div>
        <span
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${cores[cor]}`}
        >
          <Icone size={21} />
        </span>
      </div>
    </article>
  );
}

export default function GestaoUnidadesPage() {
  const [unidades, setUnidades] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [busca, setBusca] = useState("");
  const [filtroTipo, setFiltroTipo] = useState("todos");
  const [filtroBairro, setFiltroBairro] = useState("todos");
  const [filtroStatus, setFiltroStatus] = useState("todas");
  const [modalAberto, setModalAberto] = useState(false);
  const [unidadeEditando, setUnidadeEditando] = useState(null);
  const [form, setForm] = useState(FORM_INICIAL);
  const [salvando, setSalvando] = useState(false);
  const [unidadeParaDesativar, setUnidadeParaDesativar] = useState(null);
  const [desativando, setDesativando] = useState(false);
  const [toast, setToast] = useState("");

  const carregarUnidades = useCallback(async () => {
    setCarregando(true);
    setErro("");
    try {
      const resposta = await requisicaoApi("/api/unidades", { method: "GET" });
      setUnidades(normalizarUnidades(resposta));
    } catch (error) {
      setErro(error.message || "Não foi possível carregar as unidades.");
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => {
    carregarUnidades();
  }, [carregarUnidades]);

  useEffect(() => {
    if (!toast) return undefined;
    const timeout = setTimeout(() => setToast(""), 3500);
    return () => clearTimeout(timeout);
  }, [toast]);

  useEffect(() => {
    function fecharComEscape(event) {
      if (event.key === "Escape") {
        setModalAberto(false);
        setUnidadeParaDesativar(null);
      }
    }
    window.addEventListener("keydown", fecharComEscape);
    return () => window.removeEventListener("keydown", fecharComEscape);
  }, []);

  const bairros = useMemo(
    () =>
      [...new Set(unidades.map((unidade) => String(unidade.bairro || "").trim()).filter(Boolean))]
        .sort((a, b) => a.localeCompare(b, "pt-BR")),
    [unidades],
  );

  const tiposContagem = useMemo(() => {
    const contagem = new Map();
    unidades.forEach((unidade) => {
      const tipo = nomeTipo(unidade);
      contagem.set(tipo, (contagem.get(tipo) || 0) + 1);
    });
    return [...contagem.entries()].sort((a, b) => b[1] - a[1]);
  }, [unidades]);

  const bairrosContagem = useMemo(() => {
    const contagem = new Map();
    unidades.forEach((unidade) => {
      const bairro = String(unidade.bairro || "").trim() || "Bairro não informado";
      contagem.set(bairro, (contagem.get(bairro) || 0) + 1);
    });
    return [...contagem.entries()].sort((a, b) => {
      if (a[0] === "Bairro não informado") return 1;
      if (b[0] === "Bairro não informado") return -1;
      return a[0].localeCompare(b[0], "pt-BR");
    });
  }, [unidades]);

  const estatisticas = useMemo(() => {
    const ativas = unidades.filter(unidadeAtiva).length;
    return {
      total: unidades.length,
      ativas,
      inativas: unidades.length - ativas,
      bairros: bairros.length,
      tipos: new Set(unidades.map(nomeTipo)).size,
    };
  }, [unidades, bairros]);

  const unidadesFiltradas = useMemo(() => {
    const termo = busca.trim().toLocaleLowerCase("pt-BR");
    return unidades.filter((unidade) => {
      const texto = [
        unidade.nome,
        unidade.cnes,
        nomeTipo(unidade),
        unidade.bairro,
        unidade.rua,
        unidade.telefone,
      ]
        .filter(Boolean)
        .join(" ")
        .toLocaleLowerCase("pt-BR");

      const correspondeBusca = !termo || texto.includes(termo);
      const correspondeTipo = filtroTipo === "todos" || nomeTipo(unidade) === filtroTipo;
      const correspondeBairro =
        filtroBairro === "todos" ||
        String(unidade.bairro || "").trim() === filtroBairro;
      const ativa = unidadeAtiva(unidade);
      const correspondeStatus =
        filtroStatus === "todas" ||
        (filtroStatus === "ativas" && ativa) ||
        (filtroStatus === "inativas" && !ativa);

      return (
        correspondeBusca &&
        correspondeTipo &&
        correspondeBairro &&
        correspondeStatus
      );
    });
  }, [unidades, busca, filtroTipo, filtroBairro, filtroStatus]);

  function abrirNovaUnidade() {
    setUnidadeEditando(null);
    setForm(FORM_INICIAL);
    setErro("");
    setModalAberto(true);
  }

  function abrirEdicao(unidade) {
    setUnidadeEditando(unidade);
    setForm({
      nome: unidade.nome || "",
      cnes: unidade.cnes || "",
      tipo_unidade_id: String(
        unidade.tipo_unidade_id ||
          TIPOS_UNIDADE.find((tipo) => tipo.nome === unidade.tipo)?.id ||
          "",
      ),
      rua: unidade.rua || "",
      bairro: unidade.bairro || "",
      cep: unidade.cep || "",
      telefone: unidade.telefone || "",
      horario_funcionamento: unidade.horario_funcionamento || "",
      servicos_disponiveis: Array.isArray(unidade.servicos_disponiveis)
        ? unidade.servicos_disponiveis.join(", ")
        : unidade.servicos_disponiveis || "",
    });
    setErro("");
    setModalAberto(true);
  }

  function atualizarCampo(campo, valor) {
    setForm((atual) => ({ ...atual, [campo]: valor }));
  }

  async function salvarUnidade(event) {
    event.preventDefault();
    setErro("");

    if (
      !form.nome.trim() ||
      !form.tipo_unidade_id ||
      !form.rua.trim() ||
      !form.bairro.trim()
    ) {
      setErro("Preencha o nome, o tipo de unidade, a rua e o bairro.");
      return;
    }

    const payload = {
      nome: form.nome.trim(),
      cnes: form.cnes.trim() || null,
      tipo_unidade_id: Number(form.tipo_unidade_id),
      rua: form.rua.trim(),
      bairro: form.bairro.trim(),
      cep: form.cep.replace(/\D/g, "") || null,
      telefone: form.telefone.trim() || null,
      horario_funcionamento: form.horario_funcionamento.trim() || null,
      servicos_disponiveis: form.servicos_disponiveis.trim(),
    };

    setSalvando(true);
    try {
      if (unidadeEditando) {
        await requisicaoApi(`/api/unidades/${unidadeEditando.id}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        });
        setToast("Unidade atualizada com sucesso.");
      } else {
        await requisicaoApi("/api/unidades", {
          method: "POST",
          body: JSON.stringify(payload),
        });
        setToast("Unidade cadastrada com sucesso.");
      }

      setModalAberto(false);
      setForm(FORM_INICIAL);
      setUnidadeEditando(null);
      await carregarUnidades();
    } catch (error) {
      setErro(error.message || "Não foi possível salvar a unidade.");
    } finally {
      setSalvando(false);
    }
  }

  async function confirmarDesativacao() {
    if (!unidadeParaDesativar) return;
    setDesativando(true);
    try {
      await requisicaoApi(`/api/unidades/${unidadeParaDesativar.id}`, {
        method: "DELETE",
      });
      setToast("Unidade desativada. O cadastro foi preservado.");
      setUnidadeParaDesativar(null);
      await carregarUnidades();
    } catch (error) {
      setErro(error.message || "Não foi possível desativar a unidade.");
      setUnidadeParaDesativar(null);
    } finally {
      setDesativando(false);
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#F1F6FB] px-4 py-6 text-[#0B1756] sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute -left-40 top-64 h-96 w-96 rounded-full bg-[#D9EAF8]/70" />
      <div className="pointer-events-none absolute -right-48 top-24 h-[34rem] w-[34rem] rounded-full bg-[#D3E5F7]/70" />
      <div className="pointer-events-none absolute right-[12%] top-[1050px] h-56 w-56 rounded-full border-[42px] border-white/80" />

      <div className="relative z-10 mx-auto max-w-[1500px] space-y-6">
        {/* Cabeçalho */}
        <section className="relative isolate overflow-hidden rounded-[30px] bg-gradient-to-br from-[#174693] via-[#234E96] to-[#151A67] px-6 py-8 text-white shadow-[0_20px_55px_rgba(2,62,138,0.16)] sm:px-9 lg:px-10">
          <div className="pointer-events-none absolute -right-16 -top-36 h-96 w-96 rounded-full border-[48px] border-white/[0.07]" />
          <div className="pointer-events-none absolute right-[28%] top-10 h-52 w-52 rounded-full border-[30px] border-white/[0.05]" />
          <div className="pointer-events-none absolute -bottom-32 left-[38%] h-64 w-64 rounded-full bg-[#78A9E6]/10 blur-2xl" />
          <div className="relative flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-semibold text-blue-50">
                <Building2 size={14} /> ADMINISTRAÇÃO · REDE MUNICIPAL
              </div>
              <h1 className="mt-4 text-3xl font-bold leading-tight sm:text-4xl">
                Unidades de saúde
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-blue-100 sm:text-base">
                Consulte quantas unidades fazem parte da rede, quais são os
                estabelecimentos cadastrados e em quais bairros estão localizados.
              </p>
            </div>
            <button
              type="button"
              onClick={abrirNovaUnidade}
              className="inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-xl bg-white px-5 text-sm font-extrabold text-[#123B80] shadow-lg transition hover:-translate-y-0.5 hover:bg-blue-50"
            >
              <Plus size={18} /> Nova unidade
            </button>
          </div>
        </section>

        {/* Indicadores: apenas dados das unidades */}
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <Indicador
            titulo="Total de unidades"
            valor={carregando ? "—" : estatisticas.total}
            detalhe="Estabelecimentos cadastrados"
            icone={Building2}
          />
          <Indicador
            titulo="Unidades ativas"
            valor={carregando ? "—" : estatisticas.ativas}
            detalhe="Disponíveis na rede"
            icone={CheckCircle2}
            cor="verde"
          />
          <Indicador
            titulo="Tipos de unidade"
            valor={carregando ? "—" : estatisticas.tipos}
            detalhe="Categorias presentes na rede"
            icone={Layers3}
            cor="roxo"
          />
          <Indicador
            titulo="Bairros atendidos"
            valor={carregando ? "—" : estatisticas.bairros}
            detalhe="Bairros com unidades cadastradas"
            icone={MapPinned}
            cor="cinza"
          />
        </section>

        {erro && !modalAberto && (
          <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-800">
            <AlertCircle size={18} className="mt-0.5 shrink-0" />
            <div className="min-w-0 flex-1">{erro}</div>
            <button
              type="button"
              onClick={() => setErro("")}
              aria-label="Fechar aviso"
              className="text-red-500 hover:text-red-700"
            >
              <X size={17} />
            </button>
          </div>
        )}

        {/* Tipos e bairros */}
        <section className="grid grid-cols-1 gap-5 xl:grid-cols-[0.9fr_1.1fr]">
          <article className="rounded-[24px] border border-[#DFEAF5] bg-white p-5 shadow-[0_5px_18px_rgba(20,55,100,0.04)] sm:p-6">
            <div className="mb-5 flex items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-extrabold text-[#14245B]">
                  Unidades por tipo
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Quantidade de cada categoria cadastrada.
                </p>
              </div>
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EAF2FB] text-[#023E8A]">
                <Layers3 size={19} />
              </span>
            </div>

            {carregando ? (
              <div className="space-y-3">
                {[1, 2, 3].map((item) => (
                  <div key={item} className="h-12 animate-pulse rounded-xl bg-slate-100" />
                ))}
              </div>
            ) : tiposContagem.length === 0 ? (
              <p className="rounded-xl bg-[#F7FAFD] px-4 py-6 text-center text-sm text-slate-500">
                Nenhuma unidade cadastrada ainda.
              </p>
            ) : (
              <div className="space-y-3">
                {tiposContagem.map(([tipo, quantidade]) => {
                  const proporcao = estatisticas.total
                    ? (quantidade / estatisticas.total) * 100
                    : 0;
                  return (
                    <button
                      type="button"
                      key={tipo}
                      onClick={() => {
                        setFiltroTipo(tipo);
                        setFiltroBairro("todos");
                        setFiltroStatus("todas");
                        document.getElementById("lista-unidades")?.scrollIntoView({
                          behavior: "smooth",
                          block: "start",
                        });
                      }}
                      className="group w-full rounded-xl border border-[#E8EFF7] p-3 text-left transition hover:border-[#B7CDE5] hover:bg-[#FAFCFF]"
                    >
                      <div className="flex items-center gap-3">
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#EAF2FB] text-[#023E8A]">
                          <IconeTipo tipo={tipo} size={19} />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block text-sm font-bold text-[#14245B]">
                            {tipo}
                          </span>
                          <span className="mt-1 block h-1.5 overflow-hidden rounded-full bg-slate-100">
                            <span
                              className="block h-full rounded-full bg-[#2C65A8]"
                              style={{ width: `${proporcao}%` }}
                            />
                          </span>
                        </span>
                        <span className="text-lg font-extrabold tabular-nums text-[#173D7E]">
                          {quantidade}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </article>

          <article className="rounded-[24px] border border-[#DFEAF5] bg-white p-5 shadow-[0_5px_18px_rgba(20,55,100,0.04)] sm:p-6">
            <div className="mb-5 flex items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-extrabold text-[#14245B]">
                  Localização por bairro
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Veja em quais regiões as unidades estão distribuídas.
                </p>
              </div>
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EAF2FB] text-[#023E8A]">
                <MapPinned size={19} />
              </span>
            </div>

            {carregando ? (
              <div className="space-y-3">
                {[1, 2, 3].map((item) => (
                  <div key={item} className="h-12 animate-pulse rounded-xl bg-slate-100" />
                ))}
              </div>
            ) : bairrosContagem.length === 0 ? (
              <p className="rounded-xl bg-[#F7FAFD] px-4 py-6 text-center text-sm text-slate-500">
                Os bairros aparecerão aqui quando houver unidades cadastradas.
              </p>
            ) : (
              <div className="grid max-h-[330px] grid-cols-1 gap-2 overflow-y-auto pr-1 sm:grid-cols-2">
                {bairrosContagem.map(([bairro, quantidade]) => (
                  <button
                    type="button"
                    key={bairro}
                    onClick={() => {
                      setFiltroBairro(bairro === "Bairro não informado" ? "todos" : bairro);
                      setFiltroTipo("todos");
                      setFiltroStatus("todas");
                      document.getElementById("lista-unidades")?.scrollIntoView({
                        behavior: "smooth",
                        block: "start",
                      });
                    }}
                    className="flex min-h-[58px] items-center gap-3 rounded-xl border border-[#E8EFF7] px-3 py-2 text-left transition hover:border-[#B7CDE5] hover:bg-[#FAFCFF]"
                  >
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#EAF2F7] text-[#023E8A]">
                      <MapPin size={17} />
                    </span>
                    <span className="min-w-0 flex-1 truncate text-sm font-semibold text-[#14245B]">
                      {bairro}
                    </span>
                    <span className="flex h-7 min-w-7 items-center justify-center rounded-lg bg-[#EDF3FA] px-2 text-xs font-extrabold text-[#17458F]">
                      {quantidade}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </article>
        </section>

        {/* Lista de unidades */}
        <section
          id="lista-unidades"
          className="scroll-mt-6 overflow-visible rounded-[24px] border border-[#DFEAF5] bg-white shadow-[0_8px_28px_rgba(20,55,100,0.05)]"
        >
          <div className="flex flex-col gap-4 border-b border-slate-100 px-5 py-5 sm:px-7 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-extrabold text-[#14245B]">
                  Todas as unidades
                </h2>
                <span className="rounded-full bg-[#EAF2FB] px-2.5 py-1 text-xs font-bold text-[#17458F]">
                  {unidadesFiltradas.length}
                </span>
              </div>
              <p className="mt-1 text-sm text-slate-500">
                Consulte nome, tipo e endereço de cada estabelecimento.
              </p>
            </div>
            <button
              type="button"
              onClick={carregarUnidades}
              disabled={carregando}
              className="inline-flex h-10 items-center justify-center gap-2 self-start rounded-xl border border-[#DCE7F2] px-4 text-sm font-semibold text-[#31527D] transition hover:bg-[#F4F8FC] disabled:opacity-50 lg:self-auto"
            >
              <RefreshCw size={15} className={carregando ? "animate-spin" : ""} />
              Atualizar lista
            </button>
          </div>

          <div className="grid grid-cols-1 gap-3 border-b border-slate-100 bg-[#FBFDFF] px-5 py-4 sm:grid-cols-2 sm:px-7 xl:grid-cols-[minmax(240px,1.6fr)_repeat(3,minmax(170px,1fr))]">
            <div className="relative">
              <Search
                size={17}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                value={busca}
                onChange={(event) => setBusca(event.target.value)}
                placeholder="Buscar unidade, CNES ou endereço..."
                className={`${inputClass} h-12 pl-11`}
              />
            </div>

            <ListaEscolha
              value={filtroTipo}
              onChange={setFiltroTipo}
              ariaLabel="Filtrar por tipo de unidade"
              icon={Layers3}
              options={[
                { value: "todos", label: "Todos os tipos", icone: Layers3 },
                ...tiposContagem.map(([tipo]) => ({
                  value: tipo,
                  label: tipo,
                  icone: Building2,
                })),
              ]}
            />

            <ListaEscolha
              value={filtroBairro}
              onChange={setFiltroBairro}
              ariaLabel="Filtrar por bairro"
              icon={MapPin}
              searchable
              options={[
                { value: "todos", label: "Todos os bairros", icone: MapPin },
                ...bairros.map((bairro) => ({
                  value: bairro,
                  label: bairro,
                  icone: MapPin,
                })),
              ]}
            />

            <ListaEscolha
              value={filtroStatus}
              onChange={setFiltroStatus}
              ariaLabel="Filtrar por situação"
              icon={CheckCircle2}
              options={[
                { value: "todas", label: "Todas as situações", icone: SlidersHorizontal },
                { value: "ativas", label: "Somente ativas", icone: CheckCircle2 },
                { value: "inativas", label: "Somente inativas", icone: AlertCircle },
              ]}
            />
          </div>

          {(filtroTipo !== "todos" || filtroBairro !== "todos" || filtroStatus !== "todas" || busca) && (
            <div className="flex flex-wrap items-center gap-2 px-5 pt-4 sm:px-7">
              <span className="text-xs font-semibold text-slate-500">Filtros:</span>
              {filtroTipo !== "todos" && (
                <button
                  type="button"
                  onClick={() => setFiltroTipo("todos")}
                  className="inline-flex items-center gap-1 rounded-full bg-[#EAF2FB] px-3 py-1.5 text-xs font-semibold text-[#17458F]"
                >
                  {filtroTipo} <X size={13} />
                </button>
              )}
              {filtroBairro !== "todos" && (
                <button
                  type="button"
                  onClick={() => setFiltroBairro("todos")}
                  className="inline-flex items-center gap-1 rounded-full bg-[#EAF2FB] px-3 py-1.5 text-xs font-semibold text-[#17458F]"
                >
                  {filtroBairro} <X size={13} />
                </button>
              )}
              {filtroStatus !== "todas" && (
                <button
                  type="button"
                  onClick={() => setFiltroStatus("todas")}
                  className="inline-flex items-center gap-1 rounded-full bg-[#EAF2FB] px-3 py-1.5 text-xs font-semibold text-[#17458F]"
                >
                  {filtroStatus === "ativas" ? "Ativas" : "Inativas"} <X size={13} />
                </button>
              )}
              {busca && (
                <button
                  type="button"
                  onClick={() => setBusca("")}
                  className="inline-flex items-center gap-1 rounded-full bg-[#EAF2FB] px-3 py-1.5 text-xs font-semibold text-[#17458F]"
                >
                  Busca: {busca} <X size={13} />
                </button>
              )}
              <button
                type="button"
                onClick={() => {
                  setFiltroTipo("todos");
                  setFiltroBairro("todos");
                  setFiltroStatus("todas");
                  setBusca("");
                }}
                className="ml-1 text-xs font-bold text-slate-500 underline underline-offset-2 hover:text-[#023E8A]"
              >
                Limpar filtros
              </button>
            </div>
          )}

          {carregando ? (
            <div className="grid grid-cols-1 gap-4 p-5 sm:grid-cols-2 xl:grid-cols-3 sm:p-7">
              {[1, 2, 3, 4, 5, 6].map((item) => (
                <div key={item} className="h-56 animate-pulse rounded-2xl bg-slate-100" />
              ))}
            </div>
          ) : unidadesFiltradas.length === 0 ? (
            <div className="px-5 py-16 text-center sm:px-7">
              <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#EAF2FB] text-[#023E8A]">
                <Building2 size={25} />
              </span>
              <h3 className="mt-4 text-lg font-extrabold text-[#14245B]">
                {unidades.length === 0
                  ? "Nenhuma unidade cadastrada"
                  : "Nenhuma unidade encontrada"}
              </h3>
              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                {unidades.length === 0
                  ? "Cadastre a primeira unidade para começar a organizar os estabelecimentos da rede municipal."
                  : "Tente mudar os filtros ou a busca para encontrar a unidade desejada."}
              </p>
              {unidades.length === 0 ? (
                <button
                  type="button"
                  onClick={abrirNovaUnidade}
                  className="mt-5 inline-flex h-11 items-center gap-2 rounded-xl bg-[#023E8A] px-5 text-sm font-bold text-white hover:bg-[#063575]"
                >
                  <Plus size={17} /> Cadastrar primeira unidade
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setFiltroTipo("todos");
                    setFiltroBairro("todos");
                    setFiltroStatus("todas");
                    setBusca("");
                  }}
                  className="mt-5 text-sm font-bold text-[#023E8A] underline underline-offset-4"
                >
                  Limpar filtros
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 p-5 sm:grid-cols-2 sm:p-7 xl:grid-cols-3">
              {unidadesFiltradas.map((unidade) => {
                const endereco = [unidade.rua, unidade.bairro, unidade.cep]
                  .filter(Boolean)
                  .join(", ");
                const enderecoMapa = [unidade.rua, unidade.bairro, "São Caetano do Sul", "SP"]
                  .filter(Boolean)
                  .join(", ");
                const linkMapa = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(enderecoMapa)}`;

                return (
                  <article
                    key={unidade.id}
                    className="flex min-w-0 flex-col rounded-2xl border border-[#E1EAF4] bg-white p-5 transition hover:-translate-y-0.5 hover:border-[#B9CDE3] hover:shadow-[0_12px_28px_rgba(20,55,100,0.08)]"
                  >
                    <div className="flex items-start gap-3">
                      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#EAF2FB] text-[#023E8A]">
                        <IconeTipo tipo={nomeTipo(unidade)} size={22} />
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="break-words text-base font-extrabold leading-snug text-[#14245B]">
                            {unidade.nome}
                          </h3>
                        </div>
                        <p className="mt-1 text-xs font-semibold text-[#55749A]">
                          {nomeTipo(unidade)}
                        </p>
                      </div>
                    </div>

                    <div className="mt-5 flex-1 space-y-3">
                      <div className="flex items-start gap-2.5 text-sm text-slate-600">
                        <MapPin size={16} className="mt-0.5 shrink-0 text-[#4774A5]" />
                        <span className="min-w-0 leading-5">
                          {endereco || "Endereço não informado"}
                        </span>
                      </div>
                      {unidade.cnes && (
                        <div className="flex items-center gap-2.5 text-xs text-slate-500">
                          <Hash size={15} className="shrink-0 text-[#7892B1]" />
                          CNES {unidade.cnes}
                        </div>
                      )}
                      {unidade.telefone && (
                        <div className="flex items-center gap-2.5 text-xs text-slate-500">
                          <Phone size={15} className="shrink-0 text-[#7892B1]" />
                          {unidade.telefone}
                        </div>
                      )}
                      {unidade.horario_funcionamento && (
                        <div className="flex items-center gap-2.5 text-xs text-slate-500">
                          <Clock3 size={15} className="shrink-0 text-[#7892B1]" />
                          {unidade.horario_funcionamento}
                        </div>
                      )}
                    </div>

                    <div className="mt-5 flex items-center justify-between gap-2 border-t border-slate-100 pt-4">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold ${
                          unidadeAtiva(unidade)
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${
                            unidadeAtiva(unidade) ? "bg-emerald-500" : "bg-slate-400"
                          }`}
                        />
                        {unidadeAtiva(unidade) ? "Ativa" : "Inativa"}
                      </span>
                      <a
                        href={linkMapa}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-[#17458F] hover:text-[#023E8A] hover:underline"
                      >
                        <MapIcon size={14} /> Ver no mapa
                      </a>
                    </div>

                    <div className="mt-3 flex gap-2">
                      <button
                        type="button"
                        onClick={() => abrirEdicao(unidade)}
                        className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-xl border border-[#DCE7F2] text-xs font-bold text-[#31527D] transition hover:bg-[#EAF2FB] hover:text-[#023E8A]"
                      >
                        <Pencil size={14} /> Editar dados
                      </button>
                      {unidadeAtiva(unidade) && (
                        <button
                          type="button"
                          onClick={() => setUnidadeParaDesativar(unidade)}
                          title="Desativar unidade"
                          aria-label={`Desativar ${unidade.nome}`}
                          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-red-100 text-red-600 transition hover:bg-red-50"
                        >
                          <Trash2 size={15} />
                        </button>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          )}

          <div className="border-t border-slate-100 bg-[#FAFCFF] px-5 py-3 text-xs text-slate-400 sm:px-7">
            As quantidades, os tipos e os bairros são calculados a partir dos registros retornados pela API de unidades.
          </div>
        </section>

        {/* Modal de cadastro e edição */}
        {modalAberto && (
          <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-[#071735]/55 p-3 backdrop-blur-[3px] sm:p-6"
            onMouseDown={(event) => {
              if (event.target === event.currentTarget && !salvando) setModalAberto(false);
            }}
          >
            <section
              role="dialog"
              aria-modal="true"
              aria-labelledby="titulo-modal-unidade"
              className="flex max-h-[94vh] w-full max-w-3xl flex-col overflow-hidden rounded-[24px] bg-white shadow-2xl"
            >
              <div className="flex items-start justify-between border-b border-slate-100 bg-[#FBFDFF] px-5 py-5 sm:px-7">
                <div className="flex items-start gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#EAF2FB] text-[#023E8A]">
                    <Building2 size={21} />
                  </span>
                  <div>
                    <h2
                      id="titulo-modal-unidade"
                      className="text-xl font-extrabold text-[#10245C]"
                    >
                      {unidadeEditando ? "Editar unidade" : "Cadastrar nova unidade"}
                    </h2>
                    <p className="mt-1 text-sm text-slate-500">
                      {unidadeEditando
                        ? "Atualize os dados e a localização do estabelecimento."
                        : "Adicione um novo estabelecimento à rede municipal."}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => !salvando && setModalAberto(false)}
                  aria-label="Fechar"
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-[#023E8A]"
                >
                  <X size={20} />
                </button>
              </div>

              <form
                id="form-unidade"
                onSubmit={salvarUnidade}
                className="min-h-0 flex-1 overflow-y-auto px-5 py-6 sm:px-7"
              >
                {erro && (
                  <div className="mb-5 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
                    <AlertCircle size={17} className="mt-0.5 shrink-0" />
                    <span>{erro}</span>
                  </div>
                )}

                <div className="mb-7">
                  <div className="mb-4 flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#EAF2FB] text-xs font-extrabold text-[#023E8A]">
                      01
                    </span>
                    <div>
                      <h3 className="text-sm font-bold text-[#14245B]">Identificação</h3>
                      <p className="text-xs text-slate-400">Nome, categoria e registro da unidade.</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <Campo label="Nome da unidade *" className="sm:col-span-2">
                      <input
                        value={form.nome}
                        onChange={(event) => atualizarCampo("nome", event.target.value)}
                        placeholder="Ex.: UBS Santo Antônio"
                        className={inputClass}
                        maxLength={160}
                        required
                      />
                    </Campo>
                    <Campo label="Tipo de unidade *">
                      <ListaEscolha
                        value={form.tipo_unidade_id}
                        onChange={(valor) => atualizarCampo("tipo_unidade_id", valor)}
                        placeholder="Selecione o tipo"
                        ariaLabel="Tipo de unidade"
                        icon={Building2}
                        options={TIPOS_UNIDADE.map((tipo) => ({
                          value: String(tipo.id),
                          label: tipo.nome,
                          icone: Building2,
                        }))}
                      />
                    </Campo>
                    <Campo label="Código CNES">
                      <input
                        value={form.cnes}
                        onChange={(event) =>
                          atualizarCampo("cnes", event.target.value.replace(/\D/g, "").slice(0, 7))
                        }
                        placeholder="Ex.: 1234567"
                        className={inputClass}
                        inputMode="numeric"
                        maxLength={7}
                      />
                    </Campo>
                  </div>
                </div>

                <div className="mb-7 border-t border-slate-100 pt-6">
                  <div className="mb-4 flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#EAF2FB] text-xs font-extrabold text-[#023E8A]">
                      02
                    </span>
                    <div>
                      <h3 className="text-sm font-bold text-[#14245B]">Localização</h3>
                      <p className="text-xs text-slate-400">Endereço para identificar onde fica a unidade.</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <Campo label="Rua e número *" className="sm:col-span-2">
                      <input
                        value={form.rua}
                        onChange={(event) => atualizarCampo("rua", event.target.value)}
                        placeholder="Rua, avenida e número"
                        className={inputClass}
                        maxLength={180}
                        required
                      />
                    </Campo>
                    <Campo label="Bairro *">
                      <input
                        value={form.bairro}
                        onChange={(event) => atualizarCampo("bairro", event.target.value)}
                        placeholder="Nome do bairro"
                        className={inputClass}
                        maxLength={100}
                        required
                      />
                    </Campo>
                    <Campo label="CEP">
                      <input
                        value={form.cep}
                        onChange={(event) => atualizarCampo("cep", formatarCep(event.target.value))}
                        placeholder="00000-000"
                        className={inputClass}
                        inputMode="numeric"
                        maxLength={9}
                      />
                    </Campo>
                  </div>
                </div>

                <div className="mb-7 border-t border-slate-100 pt-6">
                  <div className="mb-4 flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#EAF2FB] text-xs font-extrabold text-[#023E8A]">
                      03
                    </span>
                    <div>
                      <h3 className="text-sm font-bold text-[#14245B]">Contato e funcionamento</h3>
                      <p className="text-xs text-slate-400">Informações para orientar a população.</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <Campo label="Telefone">
                      <input
                        value={form.telefone}
                        onChange={(event) =>
                          atualizarCampo("telefone", formatarTelefone(event.target.value))
                        }
                        placeholder="(11) 0000-0000"
                        className={inputClass}
                        inputMode="tel"
                        maxLength={15}
                      />
                    </Campo>
                    <Campo label="Horário de funcionamento">
                      <input
                        value={form.horario_funcionamento}
                        onChange={(event) =>
                          atualizarCampo("horario_funcionamento", event.target.value)
                        }
                        placeholder="Ex.: Segunda a sexta, 7h às 17h"
                        className={inputClass}
                        maxLength={120}
                      />
                    </Campo>
                  </div>
                </div>

                <div className="border-t border-slate-100 pt-6">
                  <div className="mb-4 flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#EAF2FB] text-xs font-extrabold text-[#023E8A]">
                      04
                    </span>
                    <div>
                      <h3 className="text-sm font-bold text-[#14245B]">Serviços oferecidos</h3>
                      <p className="text-xs text-slate-400">Opcional: informe os principais serviços.</p>
                    </div>
                  </div>
                  <Campo label="Serviços e especialidades">
                    <textarea
                      value={form.servicos_disponiveis}
                      onChange={(event) =>
                        atualizarCampo("servicos_disponiveis", event.target.value)
                      }
                      placeholder="Ex.: Clínica geral, vacinação, pediatria, curativos..."
                      rows={4}
                      className={`${inputClass} resize-y`}
                      maxLength={2000}
                    />
                  </Campo>
                </div>

                <div className="mt-6 rounded-xl border border-[#D8E6F4] bg-[#F3F8FD] px-4 py-3 text-xs leading-5 text-[#456184]">
                  <strong className="text-[#173A70]">Campos obrigatórios:</strong> nome, tipo de unidade, rua e bairro.
                </div>
              </form>

              <div className="flex flex-col-reverse gap-2 border-t border-slate-100 bg-white px-5 py-4 sm:flex-row sm:justify-end sm:px-7">
                <button
                  type="button"
                  onClick={() => setModalAberto(false)}
                  disabled={salvando}
                  className="h-11 rounded-xl border border-slate-200 px-5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  form="form-unidade"
                  disabled={salvando}
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#023E8A] px-6 text-sm font-bold text-white shadow-sm transition hover:bg-[#063575] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {salvando ? (
                    <>
                      <RefreshCw size={16} className="animate-spin" /> Salvando...
                    </>
                  ) : (
                    <>
                      <Check size={17} /> {unidadeEditando ? "Salvar alterações" : "Cadastrar unidade"}
                    </>
                  )}
                </button>
              </div>
            </section>
          </div>
        )}

        {/* Confirmação de desativação */}
        {unidadeParaDesativar && (
          <div
            className="fixed inset-0 z-[110] flex items-center justify-center bg-[#071735]/55 p-4 backdrop-blur-[3px]"
            onMouseDown={(event) => {
              if (event.target === event.currentTarget && !desativando) {
                setUnidadeParaDesativar(null);
              }
            }}
          >
            <section
              role="alertdialog"
              aria-modal="true"
              aria-labelledby="titulo-desativar"
              className="w-full max-w-md rounded-[24px] bg-white p-6 shadow-2xl sm:p-7"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-red-600">
                <Trash2 size={22} />
              </span>
              <h2 id="titulo-desativar" className="mt-4 text-xl font-extrabold text-[#14245B]">
                Desativar unidade?
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                A unidade <strong className="text-[#14245B]">{unidadeParaDesativar.nome}</strong>{" "}
                deixará de aparecer como ativa na rede. O cadastro será preservado.
              </p>
              <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => setUnidadeParaDesativar(null)}
                  disabled={desativando}
                  className="h-11 rounded-xl border border-slate-200 px-5 text-sm font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Manter unidade
                </button>
                <button
                  type="button"
                  onClick={confirmarDesativacao}
                  disabled={desativando}
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-red-600 px-5 text-sm font-bold text-white hover:bg-red-700 disabled:opacity-60"
                >
                  {desativando ? (
                    <RefreshCw size={16} className="animate-spin" />
                  ) : (
                    <Trash2 size={16} />
                  )}
                  {desativando ? "Desativando..." : "Confirmar desativação"}
                </button>
              </div>
            </section>
          </div>
        )}

        {toast && (
          <div
            role="status"
            className="fixed bottom-5 right-5 z-[130] flex max-w-[calc(100vw-2.5rem)] items-center gap-3 rounded-xl border border-emerald-200 bg-white px-4 py-3 text-sm font-semibold text-emerald-800 shadow-[0_12px_35px_rgba(15,23,42,0.16)]"
          >
            <CheckCircle2 size={19} className="shrink-0 text-emerald-600" />
            {toast}
            <button
              type="button"
              onClick={() => setToast("")}
              aria-label="Fechar aviso"
              className="ml-1 text-slate-400 hover:text-slate-700"
            >
              <X size={16} />
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
