"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Activity,
  AlertCircle,
  Building2,
  Check,
  CheckCircle2,
  ChevronDown,
  Clock3,
  Edit3,
  Filter,
  Hospital,
  MapPin,
  Plus,
  RefreshCw,
  Search,
  ShieldCheck,
  Stethoscope,
  Trash2,
  X,
} from "lucide-react";

const API_URL = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080").replace(/\/$/, "");

// IDs conforme os registros iniciais de tipos_unidade do banco UneSUS.
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

function obterToken() {
  if (typeof window === "undefined") return null;
  // Se o login do projeto usa outra chave, ajuste esta lista para a chave existente.
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

  if (opcoes.body && !headers["Content-Type"]) {
    headers["Content-Type"] = "application/json";
  }
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
    const mensagem =
      dados?.mensagem ||
      dados?.message ||
      (resposta.status === 401 || resposta.status === 403
        ? "Acesso não autorizado. Entre novamente com uma conta administradora."
        : `Não foi possível concluir a operação (erro ${resposta.status}).`);
    throw new Error(mensagem);
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

function formatarCep(valor = "") {
  const numeros = String(valor).replace(/\D/g, "").slice(0, 8);
  return numeros.length > 5 ? `${numeros.slice(0, 5)}-${numeros.slice(5)}` : numeros;
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

function nomeTipo(unidade) {
  if (unidade?.tipo) return unidade.tipo;
  const tipo = TIPOS_UNIDADE.find((item) => Number(item.id) === Number(unidade?.tipo_unidade_id));
  return tipo?.nome || "Tipo não informado";
}

function unidadeAtiva(unidade) {
  return ![false, 0, "0", "false"].includes(unidade?.ativo);
}

function IconeTipo({ tipo }) {
  const nome = String(tipo || "").toLowerCase();
  const Icone = nome.includes("upa") || nome.includes("pronto")
    ? Activity
    : nome.includes("hospital")
      ? Hospital
      : nome.includes("caps")
        ? ShieldCheck
        : nome.includes("poli")
          ? Stethoscope
          : Building2;
  return <Icone size={19} strokeWidth={1.8} />;
}

function Campo({ label, children, className = "" }) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-2 block text-sm font-semibold text-[#14245B]">{label}</span>
      {children}
    </label>
  );
}

const inputClass =
  "w-full rounded-xl border border-[#D7E4F2] bg-white px-4 py-3 text-sm text-[#14245B] outline-none transition placeholder:text-slate-400 focus:border-[#3974B9] focus:ring-4 focus:ring-[#023E8A]/10";

export default function GestaoUnidadesPage() {
  const [unidades, setUnidades] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [busca, setBusca] = useState("");
  const [filtroTipo, setFiltroTipo] = useState("todos");
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

  const unidadesFiltradas = useMemo(() => {
    const termo = busca.trim().toLocaleLowerCase("pt-BR");
    return unidades.filter((unidade) => {
      const texto = [
        unidade.nome,
        unidade.cnes,
        unidade.tipo,
        unidade.bairro,
        unidade.rua,
        unidade.telefone,
      ].filter(Boolean).join(" ").toLocaleLowerCase("pt-BR");

      const correspondeBusca = !termo || texto.includes(termo);
      const correspondeTipo = filtroTipo === "todos" || nomeTipo(unidade) === filtroTipo;
      const ativa = unidadeAtiva(unidade);
      const correspondeStatus =
        filtroStatus === "todas" ||
        (filtroStatus === "ativas" && ativa) ||
        (filtroStatus === "inativas" && !ativa);

      return correspondeBusca && correspondeTipo && correspondeStatus;
    });
  }, [unidades, busca, filtroTipo, filtroStatus]);

  const estatisticas = useMemo(() => {
    const ativas = unidades.filter(unidadeAtiva);
    return {
      total: unidades.length,
      ativas: ativas.length,
      inativas: unidades.length - ativas.length,
      urgencia: ativas.filter((item) => {
        const tipo = nomeTipo(item).toLowerCase();
        return tipo.includes("upa") || tipo.includes("pronto") || tipo.includes("hospital");
      }).length,
    };
  }, [unidades]);

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
      tipo_unidade_id: String(unidade.tipo_unidade_id || TIPOS_UNIDADE.find((tipo) => tipo.nome === unidade.tipo)?.id || ""),
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

    if (!form.nome.trim() || !form.tipo_unidade_id || !form.rua.trim() || !form.bairro.trim()) {
      setErro("Preencha o nome, o tipo de unidade, o endereço e o bairro.");
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
    setErro("");
    try {
      await requisicaoApi(`/api/unidades/${unidadeParaDesativar.id}`, { method: "DELETE" });
      setToast("Unidade desativada. O registro foi preservado.");
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
    <main className="min-h-screen bg-[#F2F7FC] px-4 pb-12 pt-7 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1440px]">
        {/* Cabeçalho principal */}
        <section className="relative isolate overflow-hidden rounded-[28px] bg-gradient-to-r from-[#12377F] via-[#1D4B99] to-[#244F9B] px-6 py-8 text-white shadow-[0_18px_45px_rgba(19,55,127,0.18)] sm:px-9 sm:py-9">
          <div className="pointer-events-none absolute -right-10 -top-32 h-80 w-80 rounded-full border-[42px] border-white/[0.07]" />
          <div className="pointer-events-none absolute right-[23%] top-12 h-52 w-52 rounded-full border-[30px] border-white/[0.045]" />
          <div className="pointer-events-none absolute -bottom-32 left-[42%] h-64 w-64 rounded-full bg-[#5E8BCB]/10 blur-2xl" />

          <div className="relative flex flex-col justify-between gap-7 lg:flex-row lg:items-end">
            <div className="max-w-3xl">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-semibold tracking-wide text-blue-50">
                <Building2 size={14} /> GESTÃO DA REDE MUNICIPAL
              </div>
              <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-[42px]">
                Gestão de Unidades
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-blue-100 sm:text-base">
                Cadastre, consulte e mantenha atualizadas as unidades de saúde da rede pública de São Caetano do Sul.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <div className="flex min-w-[150px] items-center gap-3 rounded-2xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur-sm">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15"><ShieldCheck size={20} /></span>
                <span><strong className="block text-sm">Acesso administrativo</strong><small className="text-xs text-blue-100">Cadastro e manutenção</small></span>
              </div>
              <div className="flex min-w-[150px] items-center gap-3 rounded-2xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur-sm">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15"><Activity size={20} /></span>
                <span><strong className="block text-sm">Rede integrada</strong><small className="text-xs text-blue-100">UneSUS</small></span>
              </div>
            </div>
          </div>
        </section>

        {/* Indicadores */}
        <section className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-2xl border border-[#DFEAF5] bg-white p-5 shadow-[0_5px_18px_rgba(20,55,100,0.04)]">
            <div className="flex items-center justify-between"><span className="text-sm font-medium text-slate-500">Unidades cadastradas</span><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EAF2FB] text-[#023E8A]"><Building2 size={20} /></span></div>
            <p className="mt-3 text-3xl font-extrabold tracking-tight text-[#10245C]">{carregando ? "—" : estatisticas.total}</p>
            <p className="mt-1 text-xs text-slate-400">Registros encontrados na rede</p>
          </div>
          <div className="rounded-2xl border border-[#DFEAF5] bg-white p-5 shadow-[0_5px_18px_rgba(20,55,100,0.04)]">
            <div className="flex items-center justify-between"><span className="text-sm font-medium text-slate-500">Unidades ativas</span><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700"><CheckCircle2 size={20} /></span></div>
            <p className="mt-3 text-3xl font-extrabold tracking-tight text-[#10245C]">{carregando ? "—" : estatisticas.ativas}</p>
            <p className="mt-1 text-xs text-slate-400">Disponíveis na rede pública</p>
          </div>
          <div className="rounded-2xl border border-[#DFEAF5] bg-white p-5 shadow-[0_5px_18px_rgba(20,55,100,0.04)]">
            <div className="flex items-center justify-between"><span className="text-sm font-medium text-slate-500">Urgência e emergência</span><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-700"><Activity size={20} /></span></div>
            <p className="mt-3 text-3xl font-extrabold tracking-tight text-[#10245C]">{carregando ? "—" : estatisticas.urgencia}</p>
            <p className="mt-1 text-xs text-slate-400">UPAs, pronto-socorros e hospitais</p>
          </div>
          <div className="rounded-2xl border border-[#DFEAF5] bg-white p-5 shadow-[0_5px_18px_rgba(20,55,100,0.04)]">
            <div className="flex items-center justify-between"><span className="text-sm font-medium text-slate-500">Unidades inativas</span><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-600"><Clock3 size={20} /></span></div>
            <p className="mt-3 text-3xl font-extrabold tracking-tight text-[#10245C]">{carregando ? "—" : estatisticas.inativas}</p>
            <p className="mt-1 text-xs text-slate-400">Registros não ativos</p>
          </div>
        </section>

        {/* Listagem */}
        <section className="mt-6 overflow-hidden rounded-[24px] border border-[#DDE8F4] bg-white shadow-[0_8px_28px_rgba(20,55,100,0.055)]">
          <div className="flex flex-col gap-4 border-b border-slate-100 px-5 py-5 sm:px-7 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="flex items-center gap-2"><h2 className="text-xl font-bold text-[#10245C] sm:text-2xl">Unidades da rede</h2><span className="rounded-full bg-[#EAF2FB] px-2.5 py-1 text-xs font-bold text-[#023E8A]">{unidadesFiltradas.length}</span></div>
              <p className="mt-1 text-sm text-slate-500">Consulte os cadastros e gerencie as informações de cada unidade.</p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button type="button" onClick={carregarUnidades} disabled={carregando} className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-[#D7E4F2] bg-white px-4 text-sm font-semibold text-[#244477] transition hover:bg-[#F4F8FC] disabled:opacity-60">
                <RefreshCw size={16} className={carregando ? "animate-spin" : ""} /> Atualizar
              </button>
              <button type="button" onClick={abrirNovaUnidade} className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#023E8A] px-5 text-sm font-bold text-white shadow-sm transition hover:bg-[#063575] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#023E8A]/20">
                <Plus size={18} /> Nova unidade
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 px-5 py-5 sm:grid-cols-2 sm:px-7 xl:grid-cols-[minmax(260px,1fr)_220px_190px]">
            <div className="relative">
              <Search size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input value={busca} onChange={(event) => setBusca(event.target.value)} placeholder="Buscar por nome, CNES, bairro ou telefone..." className={`${inputClass} h-12 pl-11`} />
            </div>
            <div className="relative">
              <Filter size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <select value={filtroTipo} onChange={(event) => setFiltroTipo(event.target.value)} className={`${inputClass} h-12 appearance-none pl-10 pr-10`}>
                <option value="todos">Todos os tipos</option>
                {TIPOS_UNIDADE.map((tipo) => <option key={tipo.id} value={tipo.nome}>{tipo.nome}</option>)}
              </select>
              <ChevronDown size={16} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" />
            </div>
            <div className="relative">
              <select value={filtroStatus} onChange={(event) => setFiltroStatus(event.target.value)} className={`${inputClass} h-12 appearance-none pr-10`}>
                <option value="todas">Todos os status</option>
                <option value="ativas">Somente ativas</option>
                <option value="inativas">Somente inativas</option>
              </select>
              <ChevronDown size={16} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" />
            </div>
          </div>

          {erro && !modalAberto && (
            <div className="mx-5 mb-5 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 sm:mx-7">
              <AlertCircle size={18} className="mt-0.5 shrink-0" /><div className="min-w-0 flex-1"><p className="font-semibold">Não foi possível concluir</p><p className="mt-0.5">{erro}</p></div>
              <button type="button" onClick={() => setErro("")} aria-label="Fechar aviso"><X size={17} /></button>
            </div>
          )}

          {carregando ? (
            <div className="flex flex-col items-center justify-center px-6 py-20 text-center">
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#EAF2FB] text-[#023E8A]"><RefreshCw size={25} className="animate-spin" /></span>
              <p className="mt-4 font-semibold text-[#14245B]">Carregando unidades...</p>
              <p className="mt-1 text-sm text-slate-500">Buscando os dados da rede municipal.</p>
            </div>
          ) : erro && unidades.length === 0 ? (
            <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-600"><AlertCircle size={25} /></span>
              <p className="mt-4 font-bold text-[#14245B]">Não foi possível carregar a listagem</p>
              <p className="mt-2 max-w-lg text-sm leading-6 text-slate-500">{erro}</p>
              <button type="button" onClick={carregarUnidades} className="mt-5 rounded-xl bg-[#023E8A] px-5 py-3 text-sm font-bold text-white hover:bg-[#063575]">Tentar novamente</button>
            </div>
          ) : unidadesFiltradas.length === 0 ? (
            <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#EAF2FB] text-[#023E8A]"><Building2 size={26} /></span>
              <p className="mt-4 font-bold text-[#14245B]">Nenhuma unidade encontrada</p>
              <p className="mt-1 max-w-md text-sm text-slate-500">Altere os filtros ou cadastre uma nova unidade para começar.</p>
              <button type="button" onClick={abrirNovaUnidade} className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#023E8A] px-5 py-3 text-sm font-bold text-white hover:bg-[#063575]"><Plus size={17} /> Cadastrar unidade</button>
            </div>
          ) : (
            <>
              {/* Tabela desktop */}
              <div className="hidden overflow-x-auto lg:block">
                <table className="w-full min-w-[950px] border-collapse text-left">
                  <thead className="bg-[#F6F9FD] text-xs uppercase tracking-wide text-slate-500">
                    <tr>
                      <th className="px-7 py-4 font-bold">Unidade de saúde</th>
                      <th className="px-5 py-4 font-bold">Tipo</th>
                      <th className="px-5 py-4 font-bold">Localização</th>
                      <th className="px-5 py-4 font-bold">Contato</th>
                      <th className="px-5 py-4 font-bold">Status</th>
                      <th className="px-7 py-4 text-right font-bold">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {unidadesFiltradas.map((unidade) => (
                      <tr key={unidade.id} className="transition hover:bg-[#F9FBFE]">
                        <td className="px-7 py-5">
                          <div className="flex items-center gap-3">
                            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#EAF2FB] text-[#023E8A]"><IconeTipo tipo={nomeTipo(unidade)} /></span>
                            <div className="min-w-0"><p className="max-w-[260px] truncate text-sm font-bold text-[#14245B]">{unidade.nome}</p><p className="mt-1 text-xs text-slate-400">{unidade.cnes ? `CNES ${unidade.cnes}` : "CNES não informado"}</p></div>
                          </div>
                        </td>
                        <td className="px-5 py-5"><span className="inline-flex rounded-lg bg-[#F0F5FB] px-2.5 py-1.5 text-xs font-semibold text-[#31527D]">{nomeTipo(unidade)}</span></td>
                        <td className="px-5 py-5"><div className="flex max-w-[210px] items-start gap-2 text-sm text-slate-600"><MapPin size={15} className="mt-0.5 shrink-0 text-[#5C7FA8]" /><span className="line-clamp-2">{[unidade.rua, unidade.bairro].filter(Boolean).join(" · ") || "Endereço não informado"}</span></div></td>
                        <td className="px-5 py-5"><p className="text-sm text-slate-600">{unidade.telefone || "Não informado"}</p><p className="mt-1 max-w-[170px] truncate text-xs text-slate-400">{unidade.horario_funcionamento || "Horário não informado"}</p></td>
                        <td className="px-5 py-5"><span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold ${unidadeAtiva(unidade) ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500"}`}><span className={`h-1.5 w-1.5 rounded-full ${unidadeAtiva(unidade) ? "bg-emerald-500" : "bg-slate-400"}`} />{unidadeAtiva(unidade) ? "Ativa" : "Inativa"}</span></td>
                        <td className="px-7 py-5"><div className="flex items-center justify-end gap-2"><button type="button" onClick={() => abrirEdicao(unidade)} title="Editar unidade" className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#DCE7F2] text-[#31527D] transition hover:border-[#9DB9D8] hover:bg-[#EAF2FB] hover:text-[#023E8A]"><Edit3 size={16} /></button>{unidadeAtiva(unidade) && <button type="button" onClick={() => setUnidadeParaDesativar(unidade)} title="Desativar unidade" className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#F0DADA] text-[#B64C4C] transition hover:bg-red-50"><Trash2 size={16} /></button>}</div></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Cartões para telas menores */}
              <div className="grid grid-cols-1 gap-3 px-4 pb-5 sm:px-6 lg:hidden">
                {unidadesFiltradas.map((unidade) => (
                  <article key={unidade.id} className="rounded-2xl border border-[#E0EAF4] bg-white p-4 shadow-sm">
                    <div className="flex items-start gap-3">
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#EAF2FB] text-[#023E8A]"><IconeTipo tipo={nomeTipo(unidade)} /></span>
                      <div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><h3 className="text-sm font-bold text-[#14245B]">{unidade.nome}</h3><span className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${unidadeAtiva(unidade) ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>{unidadeAtiva(unidade) ? "Ativa" : "Inativa"}</span></div><p className="mt-1 text-xs text-slate-500">{nomeTipo(unidade)}{unidade.cnes ? ` · CNES ${unidade.cnes}` : ""}</p></div>
                    </div>
                    <div className="mt-4 grid grid-cols-1 gap-2 text-xs text-slate-600 sm:grid-cols-2"><p className="flex items-start gap-2"><MapPin size={14} className="mt-0.5 shrink-0 text-[#5C7FA8]" />{[unidade.rua, unidade.bairro].filter(Boolean).join(" · ") || "Endereço não informado"}</p><p className="flex items-start gap-2"><Clock3 size={14} className="mt-0.5 shrink-0 text-[#5C7FA8]" />{unidade.horario_funcionamento || "Horário não informado"}</p></div>
                    <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3"><span className="text-xs text-slate-500">{unidade.telefone || "Telefone não informado"}</span><div className="flex gap-2"><button type="button" onClick={() => abrirEdicao(unidade)} className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-[#DCE7F2] px-3 text-xs font-bold text-[#31527D] hover:bg-[#EAF2FB]"><Edit3 size={14} /> Editar</button>{unidadeAtiva(unidade) && <button type="button" onClick={() => setUnidadeParaDesativar(unidade)} aria-label="Desativar unidade" className="flex h-9 w-9 items-center justify-center rounded-lg border border-red-100 text-red-600 hover:bg-red-50"><Trash2 size={15} /></button>}</div></div>
                  </article>
                ))}
              </div>
            </>
          )}

          {!carregando && unidadesFiltradas.length > 0 && (
            <div className="flex flex-col gap-2 border-t border-slate-100 bg-[#FBFCFE] px-5 py-4 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:px-7">
              <span>Exibindo <strong className="text-[#14245B]">{unidadesFiltradas.length}</strong> de <strong className="text-[#14245B]">{unidades.length}</strong> unidades</span>
              <span>Os dados são carregados diretamente da API do UneSUS.</span>
            </div>
          )}
        </section>

        {/* Orientação administrativa */}
        <div className="mt-5 flex items-start gap-3 rounded-2xl border border-[#D8E6F4] bg-[#EAF2FB]/70 px-5 py-4 text-sm text-[#31527D]">
          <ShieldCheck size={19} className="mt-0.5 shrink-0 text-[#023E8A]" />
          <p className="leading-6"><strong className="text-[#173A70]">Gestão segura:</strong> ao desativar uma unidade, o sistema utiliza a exclusão lógica prevista na API. O cadastro é preservado no banco de dados e deixa de ser tratado como ativo.</p>
        </div>
      </div>

      {/* Modal de cadastro e edição */}
      {modalAberto && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#071735]/55 p-3 backdrop-blur-[3px] sm:p-6" onMouseDown={(event) => { if (event.target === event.currentTarget && !salvando) setModalAberto(false); }}>
          <section role="dialog" aria-modal="true" aria-labelledby="titulo-modal-unidade" className="flex max-h-[94vh] w-full max-w-3xl flex-col overflow-hidden rounded-[24px] bg-white shadow-2xl">
            <div className="flex items-start justify-between border-b border-slate-100 bg-[#FBFDFF] px-5 py-5 sm:px-7">
              <div className="flex items-start gap-3"><span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#EAF2FB] text-[#023E8A]"><Building2 size={21} /></span><div><h2 id="titulo-modal-unidade" className="text-xl font-extrabold text-[#10245C]">{unidadeEditando ? "Editar unidade" : "Cadastrar nova unidade"}</h2><p className="mt-1 text-sm text-slate-500">{unidadeEditando ? "Atualize as informações do estabelecimento." : "Informe os dados para incluir a unidade na rede municipal."}</p></div></div>
              <button type="button" onClick={() => !salvando && setModalAberto(false)} aria-label="Fechar" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-[#023E8A]"><X size={20} /></button>
            </div>

            <form id="form-unidade" onSubmit={salvarUnidade} className="min-h-0 flex-1 overflow-y-auto px-5 py-6 sm:px-7">
              {erro && <div className="mb-5 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"><AlertCircle size={17} className="mt-0.5 shrink-0" /><span>{erro}</span></div>}

              <div className="mb-6"><div className="mb-4 flex items-center gap-2"><span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#EAF2FB] text-xs font-extrabold text-[#023E8A]">01</span><div><h3 className="text-sm font-bold text-[#14245B]">Identificação da unidade</h3><p className="text-xs text-slate-400">Dados principais do estabelecimento.</p></div></div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Campo label="Nome da unidade *" className="sm:col-span-2"><input value={form.nome} onChange={(event) => atualizarCampo("nome", event.target.value)} placeholder="Ex.: UBS Santo Antônio" className={inputClass} maxLength={160} required /></Campo>
                  <Campo label="Tipo de unidade *"><select value={form.tipo_unidade_id} onChange={(event) => atualizarCampo("tipo_unidade_id", event.target.value)} className={inputClass} required><option value="">Selecione o tipo</option>{TIPOS_UNIDADE.map((tipo) => <option key={tipo.id} value={tipo.id}>{tipo.nome}</option>)}</select></Campo>
                  <Campo label="Código CNES"><input value={form.cnes} onChange={(event) => atualizarCampo("cnes", event.target.value.replace(/\D/g, "").slice(0, 7))} placeholder="Ex.: 1234567" className={inputClass} inputMode="numeric" maxLength={7} /></Campo>
                </div>
              </div>

              <div className="mb-6 border-t border-slate-100 pt-6"><div className="mb-4 flex items-center gap-2"><span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#EAF2FB] text-xs font-extrabold text-[#023E8A]">02</span><div><h3 className="text-sm font-bold text-[#14245B]">Endereço e localização</h3><p className="text-xs text-slate-400">Onde a população encontra a unidade.</p></div></div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Campo label="Rua e número *" className="sm:col-span-2"><input value={form.rua} onChange={(event) => atualizarCampo("rua", event.target.value)} placeholder="Rua, avenida e número" className={inputClass} maxLength={180} required /></Campo>
                  <Campo label="Bairro *"><input value={form.bairro} onChange={(event) => atualizarCampo("bairro", event.target.value)} placeholder="Nome do bairro" className={inputClass} maxLength={100} required /></Campo>
                  <Campo label="CEP"><input value={form.cep} onChange={(event) => atualizarCampo("cep", formatarCep(event.target.value))} placeholder="00000-000" className={inputClass} inputMode="numeric" maxLength={9} /></Campo>
                </div>
              </div>

              <div className="mb-6 border-t border-slate-100 pt-6"><div className="mb-4 flex items-center gap-2"><span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#EAF2FB] text-xs font-extrabold text-[#023E8A]">03</span><div><h3 className="text-sm font-bold text-[#14245B]">Contato e funcionamento</h3><p className="text-xs text-slate-400">Informações para orientar os pacientes.</p></div></div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Campo label="Telefone"><input value={form.telefone} onChange={(event) => atualizarCampo("telefone", formatarTelefone(event.target.value))} placeholder="(11) 0000-0000" className={inputClass} inputMode="tel" maxLength={15} /></Campo>
                  <Campo label="Horário de funcionamento"><input value={form.horario_funcionamento} onChange={(event) => atualizarCampo("horario_funcionamento", event.target.value)} placeholder="Ex.: Segunda a sexta, 7h às 17h" className={inputClass} maxLength={120} /></Campo>
                </div>
              </div>

              <div className="border-t border-slate-100 pt-6"><div className="mb-4 flex items-center gap-2"><span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#EAF2FB] text-xs font-extrabold text-[#023E8A]">04</span><div><h3 className="text-sm font-bold text-[#14245B]">Serviços disponíveis</h3><p className="text-xs text-slate-400">Descreva os atendimentos oferecidos pela unidade.</p></div></div>
                <Campo label="Serviços e especialidades"><textarea value={form.servicos_disponiveis} onChange={(event) => atualizarCampo("servicos_disponiveis", event.target.value)} placeholder="Ex.: Clínica geral, vacinação, pediatria, curativos..." rows={4} className={`${inputClass} resize-y`} maxLength={2000} /></Campo>
                <p className="mt-2 text-xs text-slate-400">Separe os serviços por vírgula para facilitar a leitura no cadastro.</p>
              </div>

              <div className="mt-6 rounded-xl border border-[#D8E6F4] bg-[#F3F8FD] px-4 py-3 text-xs leading-5 text-[#456184]"><span className="font-bold text-[#173A70]">Atenção:</span> os campos marcados com * são obrigatórios. Confira os dados antes de salvar.</div>
            </form>

            <div className="flex flex-col-reverse gap-2 border-t border-slate-100 bg-white px-5 py-4 sm:flex-row sm:justify-end sm:px-7">
              <button type="button" onClick={() => setModalAberto(false)} disabled={salvando} className="h-11 rounded-xl border border-slate-200 px-5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50">Cancelar</button>
              <button type="submit" form="form-unidade" disabled={salvando} className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#023E8A] px-6 text-sm font-bold text-white shadow-sm transition hover:bg-[#063575] disabled:cursor-not-allowed disabled:opacity-60">{salvando ? <><RefreshCw size={16} className="animate-spin" /> Salvando...</> : <><Check size={17} /> {unidadeEditando ? "Salvar alterações" : "Cadastrar unidade"}</>}</button>
            </div>
          </section>
        </div>
      )}

      {/* Confirmação de desativação */}
      {unidadeParaDesativar && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-[#071735]/55 p-4 backdrop-blur-[3px]" onMouseDown={(event) => { if (event.target === event.currentTarget && !desativando) setUnidadeParaDesativar(null); }}>
          <section role="alertdialog" aria-modal="true" aria-labelledby="titulo-desativar" className="w-full max-w-md rounded-[24px] bg-white p-6 shadow-2xl sm:p-7">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-red-600"><Trash2 size={22} /></span>
            <h2 id="titulo-desativar" className="mt-4 text-xl font-extrabold text-[#14245B]">Desativar unidade?</h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">A unidade <strong className="text-[#14245B]">{unidadeParaDesativar.nome}</strong> deixará de aparecer como ativa na rede. O cadastro será preservado no banco de dados.</p>
            <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end"><button type="button" onClick={() => setUnidadeParaDesativar(null)} disabled={desativando} className="h-11 rounded-xl border border-slate-200 px-5 text-sm font-semibold text-slate-600 hover:bg-slate-50">Manter unidade</button><button type="button" onClick={confirmarDesativacao} disabled={desativando} className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-red-600 px-5 text-sm font-bold text-white hover:bg-red-700 disabled:opacity-60">{desativando ? <RefreshCw size={16} className="animate-spin" /> : <Trash2 size={16} />}{desativando ? "Desativando..." : "Confirmar desativação"}</button></div>
          </section>
        </div>
      )}

      {toast && <div role="status" className="fixed bottom-5 right-5 z-[130] flex max-w-[calc(100vw-2.5rem)] items-center gap-3 rounded-xl border border-emerald-200 bg-white px-4 py-3 text-sm font-semibold text-emerald-800 shadow-[0_12px_35px_rgba(15,23,42,0.16)]"><CheckCircle2 size={19} className="shrink-0 text-emerald-600" />{toast}<button type="button" onClick={() => setToast("")} aria-label="Fechar aviso" className="ml-1 text-slate-400 hover:text-slate-700"><X size={16} /></button></div>}
    </main>
  );
}
