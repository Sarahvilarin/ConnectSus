"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { api } from "@/lib/api";
import { Building2, Check, ChevronDown } from "lucide-react";

const ITENS_POR_PAGINA = 6;

// ======================================================
// COMPONENTES AUXILIARES
// ======================================================

function Indicador({ titulo, valor, descricao, variacao }) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_5px_20px_rgba(31,65,119,0.04)]">
      <div>
        <p className="text-sm font-normal text-slate-600">{titulo}</p>

        <h3 className="mt-2 text-3xl font-bold tracking-tight text-[#0B1756]">
          {valor}
        </h3>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-1.5 text-xs">
        {variacao && (
          <span className="font-semibold text-[#168052]">{variacao}</span>
        )}

        <span className="text-sm text-slate-500">{descricao}</span>
      </div>
    </article>
  );
}

function StatusBadge({ status }) {
  const estilos = {
    Ativa: "bg-[#3563A7] text-white",
    Inativa: "border border-[#3563A7]/30 bg-[#EAF3F7] text-[#3563A7]",
    "Concluído": "bg-[#0B1756] text-white",
    Aguardando: "bg-[#023E8A] text-white",
    Cancelado: "bg-[#3563A7] text-white",
    Chamado: "bg-[#3563A7] text-white",
    "Em atendimento": "bg-[#168052] text-white",
    Desistente: "bg-slate-500 text-white",
  };

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1.5 text-xs font-semibold ${
        estilos[status] || "bg-[#EAF3F7] text-[#0B1756]"
      }`}
    >
      {status}
    </span>
  );
}

function SecaoTitulo({ titulo, descricao }) {
  return (
    <div className="mb-5">
      <h2 className="text-2xl font-bold text-[#0B1756]">{titulo}</h2>

      {descricao && (
        <p className="mt-1 text-base text-slate-400">{descricao}</p>
      )}
    </div>
  );
}

// ======================================================
// MODAL DE CADASTRO E EDIÇÃO
// ======================================================


function FiltroSelect({ value, onChange, placeholder, options }) {
  const [aberto, setAberto] = useState(false);
  const [pos, setPos] = useState({ top: 0, left: 0, width: 0 });
  const ref = useRef(null);

  const selecionado = options.find((option) => option.value === value);

  // fecha ao rolar a página ou redimensionar a janela
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
      const altura = Math.min(240, options.length * 44 + 12);
      const r = ref.current.getBoundingClientRect();
      const largura = Math.max(r.width, 170);
      let top = r.bottom + 8;

      // abre para cima se não couber embaixo
      if (top + altura > window.innerHeight - 12) {
        const acima = r.top - altura - 8;
        top = acima >= 12 ? acima : Math.max(12, window.innerHeight - altura - 12);
      }

      setPos({
        top,
        left: Math.max(12, Math.min(r.left, window.innerWidth - largura - 12)),
        width: largura,
      });
    }
    setAberto((atual) => !atual);
  }

  return (
    <div
      ref={ref}
      className="relative w-full"
      onKeyDown={(e) => e.key === "Escape" && setAberto(false)}
    >
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={aberto}
        onClick={alternar}
        className="flex w-full items-center justify-between gap-3 rounded-2xl border border-[#C9D7EB] bg-white px-4 py-3 text-left text-sm text-[#121554] outline-none transition hover:bg-[#EAF3F7] focus:ring-4 focus:ring-[#C9D7EB]/30"
      >
        <span
          className={`min-w-0 truncate ${
            selecionado ? "text-[#0B1756]" : "text-slate-400"
          }`}
        >
          {selecionado ? selecionado.label : placeholder}
        </span>

        <ChevronDown
          size={16}
          className={`shrink-0 text-[#023E8A] transition-transform ${
            aberto ? "rotate-180" : ""
          }`}
        />
      </button>

      {aberto && (
        <>
          <button
            type="button"
            aria-label="Fechar opções"
            onClick={() => setAberto(false)}
            className="fixed inset-0 z-10 cursor-default"
          />

          <div
            data-popup
            role="listbox"
            style={{ top: pos.top, left: pos.left, width: pos.width }}
            className="fixed z-20 max-h-60 overflow-y-auto rounded-2xl border border-[#D5E2F1] bg-white p-1.5 shadow-[0_12px_30px_rgba(11,23,86,0.16)]"
          >
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                role="option"
                aria-selected={option.value === value}
                onClick={() => {
                  onChange(option.value);
                  setAberto(false);
                }}
                className={`flex w-full items-center justify-between gap-3 rounded-xl px-3.5 py-2.5 text-left text-sm transition ${
                  option.value === value
                    ? "bg-[#023E8A] font-semibold text-white"
                    : "bg-white text-[#0B1756] hover:bg-[#EAF3F7]"
                }`}
              >
                <span>{option.label}</span>
                {option.value === value && (
                  <Check size={16} className="shrink-0 text-white" />
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}


function ModalCadastro({ tipo, item, onFechar, onSalvar, salvando }) {
  const ehUnidade = tipo === "unidade";
  const [form, setForm] = useState({
    nome: item?.nome || "",
    cnes: item?.cnes || "",
    tipo_unidade_id: item?.tipo_unidade_id || "",
    rua: item?.rua || "",
    bairro: item?.bairro || "",
    cep: item?.cep || "",
    telefone: item?.telefone || "",
    horario_funcionamento: item?.horario_funcionamento || "",
    servicos_disponiveis: item?.servicos_disponiveis || "",
  });

  function alterar(campo, valor) {
    setForm((atual) => ({ ...atual, [campo]: valor }));
  }

  function enviar(e) {
    e.preventDefault();
    if (!form.nome.trim()) return;
    onSalvar(ehUnidade ? {
      ...form,
      nome: form.nome.trim(),
      tipo_unidade_id: Number(form.tipo_unidade_id),
    } : { nome: form.nome.trim() });
  }

  const inputClass = "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-[#0B1756] outline-none transition placeholder:text-slate-400 focus:border-[#023E8A] focus:ring-4 focus:ring-[#3563A7]/10";
  const labelClass = "mb-2 block text-xs font-semibold text-[#0B1756]";

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center overflow-y-auto bg-[#071638]/55 p-4 backdrop-blur-sm" onClick={(e) => { if (e.target === e.currentTarget) onFechar(); }}>
      <form onSubmit={enviar} className="my-6 w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl">
        <div className="mb-5 flex items-start justify-between gap-3">
          <div>
            <span className="rounded-full bg-[#EAF3F7] px-3 py-1 text-xs font-semibold text-[#3563A7]">Gerenciamento</span>
            <h2 className="mt-3 text-xl font-bold text-[#0B1756]">{item ? "Editar" : "Cadastrar"} {ehUnidade ? "unidade" : "especialidade"}</h2>
            <p className="mt-1 text-sm text-slate-600">Preencha as informações abaixo.</p>
          </div>
          <button type="button" onClick={onFechar} className="rounded-lg px-3 py-2 text-sm font-semibold text-slate-500 transition hover:bg-[#EAF3F7]">Fechar</button>
        </div>

        {ehUnidade ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2"><label className={labelClass}>Nome da unidade</label><input required maxLength={150} value={form.nome} onChange={(e) => alterar("nome", e.target.value)} placeholder="Ex.: UBS Central" className={inputClass} /></div>
            <div><label className={labelClass}>CNES</label><input required value={form.cnes} onChange={(e) => alterar("cnes", e.target.value)} className={inputClass} /></div>
            <div><label className={labelClass}>Código do tipo de unidade</label><input required type="number" min="1" value={form.tipo_unidade_id} onChange={(e) => alterar("tipo_unidade_id", e.target.value)} placeholder="ID cadastrado no banco" className={inputClass} /></div>
            <div><label className={labelClass}>Rua e número</label><input required value={form.rua} onChange={(e) => alterar("rua", e.target.value)} className={inputClass} /></div>
            <div><label className={labelClass}>Bairro</label><input required value={form.bairro} onChange={(e) => alterar("bairro", e.target.value)} className={inputClass} /></div>
            <div><label className={labelClass}>CEP</label><input required value={form.cep} onChange={(e) => alterar("cep", e.target.value)} className={inputClass} /></div>
            <div><label className={labelClass}>Telefone</label><input value={form.telefone} onChange={(e) => alterar("telefone", e.target.value)} className={inputClass} /></div>
            <div><label className={labelClass}>Horário de funcionamento</label><input value={form.horario_funcionamento} onChange={(e) => alterar("horario_funcionamento", e.target.value)} className={inputClass} /></div>
            <div className="sm:col-span-2"><label className={labelClass}>Serviços disponíveis</label><textarea rows={3} value={form.servicos_disponiveis} onChange={(e) => alterar("servicos_disponiveis", e.target.value)} className={inputClass} /></div>
          </div>
        ) : (
          <div><label className={labelClass}>Nome da especialidade</label><input autoFocus required minLength={3} maxLength={100} value={form.nome} onChange={(e) => alterar("nome", e.target.value)} placeholder="Ex.: Cardiologia" className={inputClass} /></div>
        )}

        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row">
          <button type="button" onClick={onFechar} className="flex-1 rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-[#0B1756] transition hover:bg-[#EAF3F7]">Cancelar</button>
          <button type="submit" disabled={salvando} className="flex-1 rounded-xl bg-[#3563A7] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#023E8A] disabled:cursor-not-allowed disabled:opacity-60">{salvando ? "Salvando..." : "Salvar"}</button>
        </div>
      </form>
    </div>
  );
}

// ======================================================
// PÁGINA ADMINISTRATIVA
// ======================================================

export default function FilaOnlineAdminPage() {
  const [unidades, setUnidades] = useState([]);
  const [especialidades, setEspecialidades] = useState([]);
  const [historico, setHistorico] = useState([]);
  const [estimativas, setEstimativas] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [salvando, setSalvando] = useState(false);
  const [mensagem, setMensagem] = useState("");

  const [aba, setAba] = useState("visao-geral");
  const [buscaUnidade, setBuscaUnidade] = useState("");
  const [buscaEspecialidade, setBuscaEspecialidade] = useState("");
  const [filtroStatusUnidade, setFiltroStatusUnidade] = useState("Todos");
  const [filtroHistorico, setFiltroHistorico] = useState("Todos");
  const [paginaUnidades, setPaginaUnidades] = useState(1);
  const [modal, setModal] = useState(null);

  async function carregarDados() {
    setCarregando(true);
    setErro("");
    try {
      const [listaUnidades, listaEspecialidades, respostaFilas, listaEstimativas] = await Promise.all([
        api("/api/unidades"),
        api("/api/especialidades"),
        api("/api/filas/"),
        api("/api/unidades/estimativas-espera"),
      ]);
      const filas = Array.isArray(respostaFilas) ? respostaFilas : (respostaFilas?.filas || []);
      const estimativasArray = Array.isArray(listaEstimativas) ? listaEstimativas : [];
      const estimativasPorUnidade = new Map(estimativasArray.map((item) => [Number(item.unidade_id), Number(item.espera_minutos) || 0]));
      const filasAtivas = filas.filter((fila) => ["aguardando", "chamado", "em_atendimento"].includes(String(fila.status).toLowerCase()));
      setUnidades((Array.isArray(listaUnidades) ? listaUnidades : []).map((u) => ({
        ...u,
        endereco: [u.rua, u.bairro].filter(Boolean).join(" — "),
        pacientes: filasAtivas.filter((f) => Number(f.unidade_id) === Number(u.id) && String(f.status).toLowerCase() === "aguardando").length,
        espera: estimativasPorUnidade.get(Number(u.id)) ?? 0,
        status: "Ativa",
      })));
      setEspecialidades(Array.isArray(listaEspecialidades) ? listaEspecialidades : []);
      setEstimativas(estimativasArray);
      setHistorico(filas.map((f) => ({
        id: f.id,
        senha: `#${f.id}`,
        unidade: f.unidade || "—",
        especialidade: f.setor || "—",
        entradaOriginal: f.entrada_em,
        saidaOriginal: f.fim_atendimento_em,
        entrada: formatarDataHora(f.entrada_em),
        saida: formatarDataHora(f.fim_atendimento_em),
        status: traduzirStatus(f.status),
        statusOriginal: String(f.status || "").toLowerCase(),
      })));
    } catch (error) {
      setErro(error.message || "Não foi possível carregar os dados da fila online.");
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => { carregarDados(); }, []);

  function formatarDataHora(valor) {
    if (!valor) return "—";
    const data = new Date(valor);
    if (Number.isNaN(data.getTime())) return String(valor);
    return data.toLocaleString("pt-BR", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" });
  }

  function traduzirStatus(status) {
    const mapa = { aguardando: "Aguardando", chamado: "Chamado", em_atendimento: "Em atendimento", concluido: "Concluído", desistente: "Desistente", cancelado: "Cancelado" };
    return mapa[String(status || "").toLowerCase()] || status || "—";
  }

  const totalPacientes = historico.filter((registro) => registro.statusOriginal === "aguardando").length;
  const unidadesAtivas = unidades.length;
  const esperasValidas = unidades.map((u) => Number(u.espera)).filter((n) => Number.isFinite(n) && n > 0);
  const esperaMedia = esperasValidas.length ? Math.round(esperasValidas.reduce((a, b) => a + b, 0) / esperasValidas.length) : 0;
  const atendimentosHoje = historico.filter((r) => { const data = r.saidaOriginal ? new Date(r.saidaOriginal) : null; return r.statusOriginal === "concluido" && data && !Number.isNaN(data.getTime()) && data.toDateString() === new Date().toDateString(); }).length;
  const demandaSemanal = Array.from({ length: 7 }, (_, indice) => { const data = new Date(); data.setDate(data.getDate() - (6 - indice)); const chave = data.toLocaleDateString("pt-BR", { weekday: "short" }).replace(".", ""); const quantidade = historico.filter((r) => { const original = new Date(r.saidaOriginal || 0); return r.statusOriginal === "concluido" && original.toDateString() === data.toDateString(); }).length; return { dia: chave.slice(0, 3), quantidade }; });

  const historicoFiltrado = useMemo(() => historico.filter((registro) => filtroHistorico === "Todos" || registro.status === filtroHistorico), [historico, filtroHistorico]);
  const unidadesFiltradas = unidades.filter((unidade) => {
    const correspondeBusca = `${unidade.nome} ${unidade.endereco}`.toLowerCase().includes(buscaUnidade.toLowerCase());
    const correspondeStatus = filtroStatusUnidade === "Todos" || unidade.status === filtroStatusUnidade;
    return correspondeBusca && correspondeStatus;
  });
  const totalPaginas = Math.max(1, Math.ceil(unidadesFiltradas.length / ITENS_POR_PAGINA));
  const unidadesPaginadas = unidadesFiltradas.slice((paginaUnidades - 1) * ITENS_POR_PAGINA, paginaUnidades * ITENS_POR_PAGINA);
  const especialidadesFiltradas = especialidades.filter((item) => item.nome.toLowerCase().includes(buscaEspecialidade.toLowerCase()));

  async function salvarUnidade(dados) {
    setSalvando(true); setMensagem("");
    try {
      if (modal.item?.id) await api(`/api/unidades/${modal.item.id}`, { method: "PUT", body: JSON.stringify(dados) });
      else await api("/api/unidades", { method: "POST", body: JSON.stringify(dados) });
      setModal(null); setMensagem("Unidade salva com sucesso!"); await carregarDados(); setPaginaUnidades(1);
    } catch (error) { setErro(error.message || "Não foi possível salvar a unidade."); }
    finally { setSalvando(false); }
  }

  async function salvarEspecialidade(dados) {
    setSalvando(true); setMensagem("");
    try {
      if (modal.item?.id) await api(`/api/especialidades/${modal.item.id}`, { method: "PUT", body: JSON.stringify(dados) });
      else await api("/api/especialidades", { method: "POST", body: JSON.stringify(dados) });
      setModal(null); setMensagem("Especialidade salva com sucesso!"); await carregarDados();
    } catch (error) { setErro(error.message || "Não foi possível salvar a especialidade."); }
    finally { setSalvando(false); }
  }

  async function desativarUnidade(id) {
    if (!window.confirm("Deseja realmente desativar esta unidade?")) return;
    try { await api(`/api/unidades/${id}`, { method: "DELETE" }); setMensagem("Unidade desativada com sucesso!"); await carregarDados(); }
    catch (error) { setErro(error.message || "Não foi possível desativar a unidade."); }
  }

  // ======================================================
  // NAVEGAÇÃO
  // ======================================================

  const abas = [
    { id: "visao-geral", nome: "Visão geral" },
    { id: "historico", nome: "Histórico" },
    { id: "unidades", nome: "Unidades" },
    { id: "especialidades", nome: "Especialidades" },
  ];

  const descricoesAbas = {
    "visao-geral": "Indicadores e panorama",
    historico: "Acompanhamento dos registros",
    unidades: "Gerenciamento das unidades",
    especialidades: "Tipos de atendimento",
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#EEF5F9] font-sans text-[#0B1756]">
      {/* ELEMENTOS DECORATIVOS DE FUNDO */}

      <div className="pointer-events-none absolute -right-28 -top-36 h-[430px] w-[430px] rounded-full bg-[#B8D6FC]/40" />

      <div className="pointer-events-none absolute -left-40 top-10 h-[330px] w-[330px] rounded-full border-2 border-[#C8DEFF]/50" />

      <main className="relative z-10 mx-auto w-full max-w-[1600px] space-y-6 px-4 pb-12 pt-8 sm:px-6 2xl:px-10">
        {(erro || mensagem) && (
          <div className={`rounded-xl border px-4 py-3 text-sm ${erro ? "border-red-200 bg-red-50 text-red-700" : "border-emerald-200 bg-emerald-50 text-emerald-700"}`}>
            <div className="flex items-center justify-between gap-3"><span>{erro || mensagem}</span><button type="button" onClick={() => { setErro(""); setMensagem(""); }} className="font-semibold">Fechar</button></div>
          </div>
        )}
        {carregando && <div className="rounded-xl border border-slate-200 bg-white px-5 py-4 text-sm text-slate-600">Carregando dados da fila online...</div>}

        {/* ==================================================
            CABEÇALHO E NAVEGAÇÃO
        ================================================== */}

        <div className="relative mb-14">
          <div className="relative min-h-[230px] overflow-hidden rounded-[30px] bg-gradient-to-br from-[#174693] via-[#234E96] to-[#151A67] px-6 py-8 text-white shadow-[0_20px_55px_rgba(2,62,138,0.16)] sm:px-9 lg:px-10">

            <div className="pointer-events-none absolute -right-24 -top-32 h-80 w-80 rounded-full bg-white/10" />
            <div className="pointer-events-none absolute -bottom-28 right-[30%] h-64 w-64 rounded-full border-[45px] border-white/[0.04]" />

            <div className="relative z-10 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
  <div className="max-w-3xl">
    <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-semibold text-blue-50">
    <Building2 size={14} />
    ADMINISTRAÇÃO · FILA ONLINE
  </div>
    <h1 className="mt-4 text-3xl font-bold leading-tight sm:text-4xl">
      Fila Online
    </h1>

    <p className="mt-3 max-w-2xl text-sm leading-6 text-blue-100 sm:text-base">
      Acompanhe a demanda, os indicadores e o funcionamento das
      unidades de saúde.
    </p>
  </div>


</div>
          </div>

          {/* CARDS DE NAVEGAÇÃO */}

          <div className="absolute -bottom-8 left-5 right-5 z-20 grid grid-cols-2 gap-3 sm:left-6 sm:right-6 lg:grid-cols-4">
            {abas.map((item) => {
              const selecionada = aba === item.id;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setAba(item.id)}
                  className={`flex min-h-[90px] flex-col justify-center rounded-2xl border bg-white px-4 py-4 text-left shadow-md transition hover:-translate-y-1 hover:shadow-lg sm:px-5 ${
                    selecionada
                      ? "border-[#3563A7] ring-1 ring-[#3563A7]/20"
                      : "border-slate-200"
                  }`}
                >
                  <span className="text-base font-bold text-[#0B1756]">
                    {item.nome}
                  </span>

                  <span className="mt-2 text-sm font-normal text-[#3563A7]">
                    {descricoesAbas[item.id]}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ==================================================
            VISÃO GERAL
        ================================================== */}

        {aba === "visao-geral" && (
          <div className="space-y-6">

            {/* INDICADORES */}

            <section>
              <div className="mb-4">
                <h2 className="mt-15 text-4xl font-bold text-[#0B1756]">
                  Resumo geral
                </h2>

                <p className="mb-5 mt-1 text-base font-normal text-slate-600">
                  Indicadores gerais das filas de atendimento.
                </p>
              </div>

              <div className="grid grid-cols-2 overflow-hidden rounded-2xl border border-[#3563A7]/30 bg-gradient-to-r from-[#244D91] via-[#3563A7] to-[#0B1756] shadow-md lg:grid-cols-4">

                <div className="border-b border-r border-white/20 px-5 py-5 lg:border-b-0 lg:px-6">
                  <p className="text-base font-semibold text-white">
                    Pacientes aguardando
                  </p>

                  <p className="mt-1 text-4xl font-bold text-white">
                    {totalPacientes}
                  </p>

                  <p className="mt-1 text-sm text-white/75">
                    Nas unidades cadastradas
                  </p>
                </div>

                <div className="border-b border-white/20 px-5 py-5 lg:border-b-0 lg:border-r lg:px-6">
                  <p className="text-base font-semibold text-white">
                    Unidades ativas
                  </p>

                  <p className="mt-1 text-4xl font-bold text-white">
                    {unidadesAtivas}/{unidades.length}
                  </p>

                  <p className="mt-1 text-sm text-white/75">
                    Unidades em funcionamento
                  </p>
                </div>

                <div className="border-r border-white/20 px-5 py-5 lg:px-6">
                  <p className="text-base font-semibold text-white">
                    Espera média
                  </p>

                  <p className="mt-1 text-4xl font-bold text-white">
                    {esperaMedia} min
                  </p>

                  <p className="mt-1 text-sm text-white/75">
                    Estimativa geral das unidades
                  </p>
                </div>

                <div className="px-5 py-5 lg:px-6">
                  <p className="text-base font-semibold text-white">
                    Atendimentos hoje
                  </p>

                  <p className="mt-1 text-4xl font-bold text-white">
                    {atendimentosHoje}
                  </p>

                  <p className="mt-1 text-sm font-semibold text-white/90">
                    {" "}
                    <span className="font-normal text-white/75">
                      Total registrado no dia
                    </span>
                  </p>
                </div>

              </div>
            </section>

            {/* DEMANDA E ESPECIALIDADES */}

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.25fr_1fr]">

              {/* PACIENTES POR UNIDADE */}

              <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_5px_20px_rgba(31,65,119,0.04)] sm:p-6">
                <SecaoTitulo
                  titulo="Pacientes por unidade"
                  descricao="Quantidade de pessoas aguardando atendimento."
                />

                <div className="space-y-5">
                  {[...unidades]
                    .sort((a, b) => b.pacientes - a.pacientes)
                    .map((unidade) => {
                      const maior = Math.max(
                        ...unidades.map((item) => item.pacientes),
                        1
                      );

                      return (
                        <div key={unidade.id}>
                          <div className="mb-2 flex items-center justify-between gap-3">
                            <div className="min-w-0">
                              <p className="truncate text-base font-semibold text-[#0B1756]">
                                {unidade.nome}
                              </p>

                              <p className="mt-0.5 text-xs font-normal text-slate-500">
                                Espera estimada: {unidade.espera} minutos
                              </p>
                            </div>

                            <span className="shrink-0 text-sm font-semibold text-[#3563A7]">
                              {unidade.pacientes} pacientes
                            </span>
                          </div>

                          <div className="h-2.5 overflow-hidden rounded-full bg-[#EAF3F7]">
                            <div
                              className="h-full rounded-full bg-[#3563A7] transition-all"
                              style={{
                                width: `${(unidade.pacientes / maior) * 100}%`,
                              }}
                            />
                          </div>
                        </div>
                      );
                    })}
                </div>
              </section>

              {/* ATENDIMENTOS POR ESPECIALIDADE */}

              <section className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
                <SecaoTitulo
                  titulo="Especialidades cadastradas"
                  descricao="Especialidades disponíveis no sistema."
                />
                <div className="space-y-3">
                  {especialidades.slice(0, 6).map((item) => (
                    <div key={item.id} className="flex items-center gap-3 rounded-xl bg-[#EAF3F7] px-4 py-3">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-sm font-bold text-[#3563A7]">{item.nome.slice(0, 1).toUpperCase()}</span>
                      <span className="text-sm font-semibold text-[#0B1756]">{item.nome}</span>
                    </div>
                  ))}
                  {especialidades.length === 0 && <p className="text-sm text-slate-500">Nenhuma especialidade cadastrada.</p>}
                </div>
                <div className="mt-5 rounded-xl bg-[#EAF3F7] p-3.5">
                  <p className="text-xs font-normal text-slate-600">Total de especialidades cadastradas</p>
                  <p className="mt-1 text-2xl font-bold text-[#023E8A]">{especialidades.length}</p>
                </div>
              </section>
            </div>

            {/* GRÁFICO SEMANAL */}

            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_5px_20px_rgba(31,65,119,0.04)] sm:p-6">
              <SecaoTitulo
                titulo="Demanda semanal"
                descricao="Quantidade de atendimentos registrados ao longo da semana."
              />

              <div className="flex h-[220px] items-end justify-around gap-3 border-b border-slate-200 pb-2 sm:gap-6">
                {demandaSemanal.map((item) => {
                  const maior = Math.max(
                    ...demandaSemanal.map((dia) => dia.quantidade)
                  );

                  return (
                    <div
                      key={item.dia}
                      className="flex h-full flex-1 flex-col items-center justify-end gap-2"
                    >
                      <span className="text-xs font-semibold text-[#3563A7]">
                        {item.quantidade}
                      </span>

                      <div
                        className="w-full max-w-[54px] rounded-t-lg bg-[#3563A7] transition-all hover:bg-[#023E8A]"
                        style={{
                          height: `${(item.quantidade / maior) * 75}%`,
                          minHeight: "8px",
                        }}
                      />

                      <span className="text-xs font-normal text-slate-500">
                        {item.dia}
                      </span>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* UNIDADES COM MAIOR DEMANDA */}

            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_5px_20px_rgba(31,65,119,0.04)] sm:p-6">
              <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <SecaoTitulo
                  titulo="Unidades com maior demanda"
                  descricao="Unidades com maior número de pacientes aguardando."
                />

                <button
                  type="button"
                  onClick={() => {
                    setAba("unidades");
                    window.scrollTo({
                      top: 0,
                      behavior: "smooth",
                    });
                  }}
                  className="self-start text-sm font-semibold text-[#3563A7] transition hover:text-[#023E8A]"
                >
                  Ver todas as unidades →
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[600px] border-collapse text-left text-sm">
                  <thead className="bg-[#EAF3F7] text-xs uppercase text-slate-600">
                    <tr>
                      <th className="px-4 py-3 font-semibold">Unidade</th>
                      <th className="px-4 py-3 font-semibold">Pacientes</th>
                      <th className="px-4 py-3 font-semibold">Espera média</th>
                      <th className="px-4 py-3 font-semibold">Situação</th>
                    </tr>
                  </thead>

                  <tbody>
                    {[...unidades]
                      .sort((a, b) => b.pacientes - a.pacientes)
                      .slice(0, 4)
                      .map((unidade) => (
                        <tr
                          key={unidade.id}
                          className="border-b border-slate-100 last:border-0"
                        >
                          <td className="px-4 py-4">
                            <p className="text-base font-semibold text-[#0B1756]">
                              {unidade.nome}
                            </p>

                          </td>

                          <td className="px-4 py-4 text-base font-semibold text-[#3563A7]">
                            {unidade.pacientes}
                          </td>

                          <td className="px-4 py-4 text-base font-normal text-slate-600">
                            {unidade.espera} min
                          </td>

                          <td className="px-4 py-4">
                            <StatusBadge status={unidade.status} />
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        )}

        {/* ==================================================
            HISTÓRICO
        ================================================== */}

        {aba === "historico" && (
          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_5px_20px_rgba(31,65,119,0.04)]">

            <div className="border-b border-slate-100 px-5 py-5 sm:px-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <SecaoTitulo
                  titulo="Histórico das filas"
                  descricao="Acompanhe os registros de entrada e saída das filas."
                />

                <div className="w-full sm:w-64">
               <FiltroSelect
                value={filtroHistorico}
                onChange={setFiltroHistorico}
                placeholder="Todos os status"
                options={[
                  { value: "Todos", label: "Todos os status" },
                  { value: "Aguardando", label: "Aguardando" },
                  { value: "Em atendimento", label: "Em atendimento" },
                  { value: "Chamado", label: "Chamado" },
                  { value: "Concluído", label: "Concluído" },
                  { value: "Desistente", label: "Desistente" },
                  { value: "Cancelado", label: "Cancelado" },
                ]}
              />
              </div>

              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] border-collapse text-left text-sm">
                <thead className="bg-[#EAF3F7] text-xs uppercase text-slate-600">
                  <tr>
                    <th className="px-5 py-4 font-semibold">Senha</th>
                    <th className="px-5 py-4 font-semibold">Unidade</th>
                    <th className="px-5 py-4 font-semibold">Setor</th>
                    <th className="px-5 py-4 font-semibold">Entrada</th>
                    <th className="px-5 py-4 font-semibold">Saída</th>
                    <th className="px-5 py-4 font-semibold">Status</th>
                  </tr>
                </thead>

                <tbody>
                  {historicoFiltrado.map((registro) => (
                    <tr
                      key={registro.id}
                      className="border-b border-slate-100 last:border-0"
                    >
                      <td className="px-5 py-4">
                        <span className="rounded-lg bg-[#EAF3F7] px-3 py-1.5 text-sm font-semibold text-[#023E8A]">
                          {registro.senha}
                        </span>
                      </td>

                      <td className="px-5 py-4 text-base font-semibold text-[#0B1756]">
                        {registro.unidade}
                      </td>

                      <td className="px-5 py-4 text-base font-normal text-slate-600">
                        {registro.especialidade}
                      </td>

                      <td className="px-5 py-4 text-base font-normal text-slate-600">
                        {registro.entrada}
                      </td>

                      <td className="px-5 py-4 text-base font-normal text-slate-600">
                        {registro.saida}
                      </td>

                      <td className="px-5 py-4">
                        <StatusBadge status={registro.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {historicoFiltrado.length === 0 && (
                <div className="py-12 text-center">
                  <p className="text-sm font-semibold text-slate-600">
                    Nenhum registro encontrado.
                  </p>
                </div>
              )}
            </div>

            <div className="border-t border-slate-100 px-5 py-4">
              
            </div>
          </section>
        )}

        {/* ==================================================
            GERENCIAMENTO DE UNIDADES
        ================================================== */}

        {aba === "unidades" && (
          <section
            id="secao-unidades"
            className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_5px_20px_rgba(31,65,119,0.04)]"
          >
            {/* TÍTULO */}

            <div className="border-b border-slate-100 px-5 py-5 sm:px-6">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <SecaoTitulo
                  titulo="Unidades de saúde"
                  descricao="Cadastre, edite ou desative as unidades de saúde."
                />

                <button
                  type="button"
                  onClick={() => setModal({ tipo: "unidade", item: null })}
                  className="rounded-xl bg-[#3563A7] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#023E8A]"
                >
                  + Nova unidade
                </button>
              </div>
            </div>

            {/* BARRA DE PESQUISA E FILTROS */}

            <div className="grid grid-cols-1 gap-3 border-b border-slate-100 px-5 py-4 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr] sm:px-6">
              <input
                value={buscaUnidade}
                onChange={(e) => {
                  setBuscaUnidade(e.target.value);
                  setPaginaUnidades(1);
                }}
                placeholder="Buscar unidade ou endereço..."
                className="w-full rounded-xl border border-[#C8D9EB] bg-white px-4 py-3 text-sm text-[#0B1756] outline-none transition placeholder:text-slate-400 focus:border-[#3563A7] focus:ring-2 focus:ring-[#3563A7]/10"
              />

              <FiltroSelect
  value={filtroStatusUnidade}
  onChange={(valor) => {
    setFiltroStatusUnidade(valor);
    setPaginaUnidades(1);
  }}
  placeholder="Todos os status"
  options={[
    { value: "Todos", label: "Todos os status" },
    { value: "Ativa", label: "Ativas" },
    { value: "Inativa", label: "Inativas" },
  ]}
/>
            </div>

            {/* TABELA */}

            <div className="overflow-x-auto">
              <table className="w-full min-w-[850px] border-collapse text-left text-sm">
                <thead className="bg-[#EAF3F7] text-xs uppercase text-slate-600">
                  <tr>
                    <th className="px-5 py-4 font-semibold">Unidade</th>
                    <th className="px-5 py-4 font-semibold">Pacientes</th>
                    <th className="px-5 py-4 font-semibold">Espera média</th>
                    <th className="px-5 py-4 font-semibold">Status</th>
                    <th className="px-5 py-4 text-right font-semibold">
                      Ações
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {unidadesPaginadas.map((unidade) => (
                    <tr
                      key={unidade.id}
                      className="border-b border-slate-100 transition last:border-0 hover:bg-slate-50/70"
                    >
                      <td className="px-5 py-4">
                        <p className="text-base font-semibold text-[#0B1756]">
                          {unidade.nome}
                        </p>

                      </td>

                      <td className="px-5 py-4 text-base font-semibold text-[#3563A7]">
                        {unidade.pacientes}
                      </td>

                      <td className="px-5 py-4 text-base font-normal text-slate-600">
                        {unidade.espera} min
                      </td>

                      <td className="px-5 py-4">
                        <StatusBadge status={unidade.status} />
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              setModal({ tipo: "unidade", item: unidade })
                            }
                            className="rounded-lg border border-[#C8D9EB] px-4 py-2.5 text-sm font-semibold text-[#3563A7] transition hover:bg-[#EAF3F7]"
                          >
                            Editar
                          </button>

                          <button
                            type="button"
                            onClick={() => desativarUnidade(unidade.id)}
                            className="rounded-lg border border-[#C8D9EB] px-4 py-2.5 text-sm font-semibold text-[#3563A7] transition hover:bg-[#EAF3F7]"
                          >Desativar</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* NENHUM RESULTADO */}

              {unidadesFiltradas.length === 0 && (
                <div className="py-12 text-center">
                  <p className="text-sm font-semibold text-slate-600">
                    Nenhuma unidade encontrada.
                  </p>
                </div>
              )}
            </div>

            {/* PAGINAÇÃO */}

            <div className="flex flex-col gap-4 border-t border-slate-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-slate-500">
                Mostrando{" "}
                <span className="font-semibold text-[#0B1756]">
                  {unidadesFiltradas.length === 0
                    ? 0
                    : (paginaUnidades - 1) * ITENS_POR_PAGINA + 1}
                </span>{" "}
                a{" "}
                <span className="font-semibold text-[#0B1756]">
                  {Math.min(
                    paginaUnidades * ITENS_POR_PAGINA,
                    unidadesFiltradas.length
                  )}
                </span>{" "}
                de{" "}
                <span className="font-semibold text-[#0B1756]">
                  {unidadesFiltradas.length}
                </span>{" "}
                unidades
              </p>

              <div className="flex items-center justify-end gap-3">
                <button
                  type="button"
                  disabled={paginaUnidades === 1}
                  onClick={() =>
                    setPaginaUnidades((atual) => Math.max(1, atual - 1))
                  }
                  className="rounded-lg border border-[#C8D9EB] px-4 py-2.5 text-sm font-semibold text-[#3563A7] transition hover:bg-[#EAF3F7] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Anterior
                </button>

                <span className="text-sm font-semibold text-[#0B1756]">
                  {paginaUnidades} / {totalPaginas}
                </span>

                <button
                  type="button"
                  disabled={paginaUnidades >= totalPaginas}
                  onClick={() =>
                    setPaginaUnidades((atual) =>
                      Math.min(totalPaginas, atual + 1)
                    )
                  }
                  className="rounded-lg border border-[#C8D9EB] px-4 py-2.5 text-sm font-semibold text-[#3563A7] transition hover:bg-[#EAF3F7] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Próxima
                </button>
              </div>
            </div>
          </section>
        )}

        {/* ==================================================
            GERENCIAMENTO DE ESPECIALIDADES
        ================================================== */}

        {aba === "especialidades" && (
          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_5px_20px_rgba(31,65,119,0.04)]">

            <div className="border-b border-slate-100 px-5 py-5 sm:px-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <SecaoTitulo
                  titulo="Especialidades"
                  descricao="Gerencie os tipos de atendimento disponíveis nas unidades."
                />

                <button
                  type="button"
                  onClick={() =>
                    setModal({ tipo: "especialidade", item: null })
                  }
                  className="rounded-xl bg-[#3563A7] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#023E8A]"
                >
                  + Nova especialidade
                </button>
              </div>
            </div>

            {/* PESQUISA */}

            <div className="border-b border-slate-100 px-5 py-4 sm:px-6">
              <input
                value={buscaEspecialidade}
                onChange={(e) => setBuscaEspecialidade(e.target.value)}
                placeholder="Pesquisar especialidade..."
                className="w-full max-w-md rounded-xl border border-[#C8D9EB] bg-white px-4 py-3 text-sm font-normal text-[#0B1756] outline-none transition placeholder:text-slate-400 focus:border-[#3563A7] focus:ring-2 focus:ring-[#3563A7]/10"
              />
            </div>

            {/* TABELA */}

            <div className="overflow-x-auto">
              <table className="w-full min-w-[420px] border-collapse text-left text-sm">
                <thead className="bg-[#EAF3F7] text-xs uppercase text-slate-600">
                  <tr>
                    <th className="px-5 py-4 font-semibold">Especialidade</th>
                    <th className="px-5 py-4 text-right font-semibold">
                      Ações
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {especialidadesFiltradas.map((item) => (
                    <tr
                      key={item.id}
                      className="border-b border-slate-100 last:border-0"
                    >
                      <td className="px-5 py-4">
                        <span className="text-base font-semibold text-[#0B1756]">
                          {item.nome}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              setModal({
                                tipo: "especialidade",
                                item,
                              })
                            }
                            className="rounded-lg border border-[#C8D9EB] px-4 py-2.5 text-sm font-semibold text-[#3563A7] transition hover:bg-[#EAF3F7]"
                          >
                            Editar
                          </button>


                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {especialidadesFiltradas.length === 0 && (
                <div className="py-12 text-center">
                  <p className="text-sm font-semibold text-slate-600">
                    Nenhuma especialidade encontrada.
                  </p>
                </div>
              )}
            </div>
          </section>
        )}
      </main>

      {/* MODAL */}

      {modal && (
        <ModalCadastro
          tipo={modal.tipo}
          item={modal.item}
          onFechar={() => setModal(null)}
          onSalvar={modal.tipo === "unidade" ? salvarUnidade : salvarEspecialidade}
          salvando={salvando}
        />
      )}
    </div>
  );
}




