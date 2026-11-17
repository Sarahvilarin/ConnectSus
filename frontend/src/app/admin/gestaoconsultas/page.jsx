
"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  AlertTriangle, Baby, Bone, Brain, CalendarDays, CalendarPlus, CalendarX,
  Check, ChevronDown, ChevronLeft, ChevronRight, Clock, Eye, HeartPulse,
  Hospital, Pencil, Search, Stethoscope, X,
} from "lucide-react";

const especialidades = [
  { nome: "Clínica geral", Icone: Stethoscope },
  { nome: "Cardiologia", Icone: HeartPulse },
  { nome: "Neurologia", Icone: Brain },
  { nome: "Oftalmologia", Icone: Eye },
  { nome: "Pediatria", Icone: Baby },
  { nome: "Ortopedia", Icone: Bone },
];

const UNIDADES = [
  { id: 1, nome: "Hospital Municipal de Emergências Albert Sabin", especialidades: ["Clínica geral", "Cardiologia", "Neurologia", "Pediatria", "Ortopedia"] },
  { id: 2, nome: "Hospital Municipal Maria Braido", especialidades: ["Clínica geral", "Oftalmologia", "Pediatria", "Ortopedia"] },
  { id: 3, nome: "Atende Fácil Saúde Pedro Kassab", especialidades: ["Clínica geral", "Cardiologia", "Neurologia", "Oftalmologia"] },
];

const horarios = ["08:00", "09:00", "10:30", "14:00", "15:30", "17:00"];
const statusLista = ["Agendada", "Concluída", "Cancelada", "Faltou"];
const corStatus = { Agendada: "azul", Concluída: "azul", Cancelada: "azul", Faltou: "azul" };
const POR_PAGINA = 10;

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

const formVazio = { paciente: "", especialidade: "", unidadeId: "", data: "", horario: "", status: "Agendada" };
const nomesMeses = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
const nomesSemana = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

const inputCls = "w-full rounded-2xl border border-[#023E8A]/40 bg-white px-4 py-3 text-sm text-[#0B1756] outline-none transition placeholder:text-slate-400 hover:border-[#023E8A] focus:border-[#023E8A] focus:ring-4 focus:ring-[#023E8A]/15";
const botaoPrimario = "inline-flex items-center justify-center gap-2 rounded-xl bg-[#023E8A] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#0B1756] focus:outline-none focus:ring-4 focus:ring-[#023E8A]/30";
const botaoSecundario = "inline-flex items-center justify-center gap-2 rounded-xl border border-[#023E8A]/30 bg-white px-5 py-3 text-sm font-semibold text-[#023E8A] transition hover:bg-[#EAF3F7] focus:outline-none focus:ring-4 focus:ring-[#023E8A]/15";

const chipSel = (sel) => sel
  ? "border-[#023E8A] bg-[#023E8A] text-white shadow-sm"
  : "border-[#023E8A]/30 bg-white text-[#023E8A] hover:border-[#023E8A] hover:bg-[#EAF3F7]";

const paraIso = (ano, mes, dia) => `${ano}-${String(mes + 1).padStart(2, "0")}-${String(dia).padStart(2, "0")}`;
const formatarData = (iso) => iso ? iso.split("-").reverse().join("/") : "";
const nomeUnidade = (id) => UNIDADES.find((u) => u.id === Number(id))?.nome || "";

function iniciais(nome) {
  const partes = nome.trim().split(/\s+/);
  return ((partes[0]?.[0] || "") + (partes.length > 1 ? partes[partes.length - 1][0] : "")).toUpperCase();
}

function paginasVisiveis(atual, total) {
  const nums = [...new Set([1, total, atual - 1, atual, atual + 1])].filter((n) => n >= 1 && n <= total).sort((a, b) => a - b);
  return nums.flatMap((n, i) => i > 0 && n - nums[i - 1] > 1 ? [`...${n}`, n] : [n]);
}

const BADGES = { neutro: ["#EAF3F7", "#023E8A"], azul: ["#023E8A", "#FFFFFF"] };

function Badge({ children, tipo = "neutro" }) {
  const [fundo, texto] = BADGES[tipo] || BADGES.neutro;
  return <span className="inline-flex items-center whitespace-nowrap rounded-full border px-3 py-1 text-xs font-semibold" style={{ backgroundColor: fundo, borderColor: fundo, color: texto }}>{children}</span>;
}

function Campo({ label, children, className = "" }) {
  return <div className={className}><label className="mb-1.5 block text-xs font-semibold text-[#023E8A]">{label}</label>{children}</div>;
}

function usePopup() {
  const [aberto, setAberto] = useState(false);
  const [pos, setPos] = useState({ top: 0, left: 0, width: 0 });
  const ref = useRef(null);

  useEffect(() => {
    if (!aberto) return;
    const fechar = (e) => { if (!e.target?.closest?.("[data-popup]")) setAberto(false); };
    window.addEventListener("scroll", fechar, true);
    window.addEventListener("resize", fechar);
    return () => {
      window.removeEventListener("scroll", fechar, true);
      window.removeEventListener("resize", fechar);
    };
  }, [aberto]);

  function alternar(altura, minLargura, aoAbrir) {
    if (!aberto && ref.current) {
      const r = ref.current.getBoundingClientRect();
      const largura = Math.max(r.width, minLargura);
      let top = r.bottom + 8;
      if (top + altura > window.innerHeight - 12) {
        const acima = r.top - altura - 8;
        top = acima >= 12 ? acima : Math.max(12, window.innerHeight - altura - 12);
      }
      setPos({ top, left: Math.max(12, Math.min(r.left, window.innerWidth - largura - 12)), width: largura });
      aoAbrir?.();
    }
    setAberto((a) => !a);
  }

  return { aberto, setAberto, pos, ref, alternar };
}

function Popup({ onClose, role, rotulo, style, className, children }) {
  return (
    <>
      <button type="button" aria-label={`Fechar ${rotulo}`} onClick={onClose} className="fixed inset-0 z-10 cursor-default" />
      <div data-popup role={role} aria-label={rotulo} style={style} className={`fixed z-20 ${className}`}>{children}</div>
    </>
  );
}

function Dropdown({ rotulo, valor, opcoes, onChange, placeholder = "Selecione", desabilitado = false, largura = "w-full", larguraLista = "min-w-[170px]" }) {
  const { aberto, setAberto, pos, ref, alternar } = usePopup();
  const lista = opcoes.map((o) => typeof o === "string" ? { valor: o, texto: o } : o);
  const atual = lista.find((o) => o.valor === valor);
  const minLista = Number(larguraLista.match(/\[(\d+)px\]/)?.[1] || 170);

  return (
    <div ref={ref} className={`relative ${largura}`} onKeyDown={(e) => e.key === "Escape" && setAberto(false)}>
      <button type="button" aria-label={rotulo} aria-haspopup="listbox" aria-expanded={aberto} disabled={desabilitado} onClick={() => alternar(Math.min(240, lista.length * 44 + 12), minLista)} className={`flex w-full items-center justify-between gap-3 rounded-2xl border bg-white px-4 py-3 text-left text-sm text-[#0B1756] outline-none transition focus:border-[#023E8A] focus:ring-4 focus:ring-[#023E8A]/15 ${desabilitado ? "cursor-not-allowed border-[#023E8A]/30 opacity-60" : aberto ? "border-[#023E8A] shadow-[0_0_0_4px_rgba(2,62,138,0.12)]" : "border-[#023E8A]/40 hover:border-[#023E8A]"}`}>
        <span className={`min-w-0 truncate ${atual ? "" : "text-slate-400"}`}>{atual ? atual.texto : placeholder}</span>
        <ChevronDown size={16} className={`shrink-0 text-[#023E8A] transition-transform ${aberto ? "rotate-180" : ""}`} />
      </button>

      {aberto && !desabilitado && (
        <Popup onClose={() => setAberto(false)} role="listbox" rotulo={rotulo} style={{ top: pos.top, left: pos.left, width: pos.width }} className="max-h-60 overflow-y-auto rounded-2xl border border-[#023E8A]/30 bg-white p-1.5 shadow-[0_18px_42px_rgba(15,38,80,0.17)]">
          {lista.map((o) => (
            <button key={o.valor} type="button" role="option" aria-selected={o.valor === valor} onClick={() => { onChange(o.valor); setAberto(false); }} className={`flex w-full items-center justify-between gap-3 rounded-xl px-3.5 py-2.5 text-left text-sm transition ${o.valor === valor ? "bg-[#023E8A] font-semibold text-white shadow-sm" : "text-[#0B1756] hover:bg-[#EAF3F7]"}`}>
              <span>{o.texto}</span>
              {o.valor === valor && <Check size={16} className="shrink-0" />}
            </button>
          ))}
        </Popup>
      )}
    </div>
  );
}

function DatePicker({ rotulo, valor, onChange, placeholder = "Selecione a data", limpavel = false }) {
  const { aberto, setAberto, pos, ref, alternar } = usePopup();
  const [visao, setVisao] = useState({ ano: 2026, mes: 0 });

  const hojeD = new Date();
  const hojeIso = paraIso(hojeD.getFullYear(), hojeD.getMonth(), hojeD.getDate());

  function abrir() {
    alternar(380, 300, () => {
      const base = valor ? new Date(`${valor}T00:00:00`) : new Date();
      setVisao({ ano: base.getFullYear(), mes: base.getMonth() });
    });
  }

  const mudarMes = (delta) => setVisao(({ ano, mes }) => {
    const d = new Date(ano, mes + delta, 1);
    return { ano: d.getFullYear(), mes: d.getMonth() };
  });

  const escolher = (iso) => { onChange(iso); setAberto(false); };
  const primeiroDia = new Date(visao.ano, visao.mes, 1).getDay();
  const totalDias = new Date(visao.ano, visao.mes + 1, 0).getDate();
  const celulas = [...Array(primeiroDia).fill(null), ...Array.from({ length: totalDias }, (_, i) => i + 1)];
  const setaCls = "flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition";

  return (
    <div ref={ref} className="relative w-full" onKeyDown={(e) => e.key === "Escape" && setAberto(false)}>
      <button type="button" aria-label={rotulo} aria-haspopup="dialog" aria-expanded={aberto} onClick={abrir} className={`flex w-full items-center justify-between gap-3 rounded-2xl border bg-white px-4 py-3 text-left text-sm text-[#0B1756] transition focus:outline-none focus:ring-4 focus:ring-[#023E8A]/15 ${aberto ? "border-[#023E8A] ring-4 ring-[#023E8A]/15" : "border-[#023E8A]/40 hover:border-[#023E8A]"}`}>
        <span className={`min-w-0 truncate ${valor ? "" : "text-slate-400"}`}>{valor ? formatarData(valor) : placeholder}</span>
        <CalendarDays size={16} className="shrink-0 text-[#023E8A]" />
      </button>

      {aberto && (
        <Popup onClose={() => setAberto(false)} role="dialog" rotulo={rotulo} style={{ top: pos.top, left: pos.left }} className="w-[300px] max-w-[calc(100vw-1.5rem)] rounded-2xl border border-[#023E8A]/30 bg-white p-4 shadow-[0_16px_40px_rgba(11,23,86,0.28)]">
          <div className="mb-3 flex items-center justify-between gap-2 rounded-xl bg-[#023E8A] px-3 py-2.5">
            <p className="text-sm font-bold text-white">{nomesMeses[visao.mes]} {visao.ano}</p>
            <div className="flex gap-1">
              <button type="button" aria-label="Mês anterior" onClick={() => mudarMes(-1)} className={setaCls}><ChevronLeft size={16} /></button>
              <button type="button" aria-label="Próximo mês" onClick={() => mudarMes(1)} className={setaCls}><ChevronRight size={16} /></button>
            </div>
          </div>

          <div className="mb-1 grid grid-cols-7 text-center">
            {nomesSemana.map((d) => <span key={d} className="py-1 text-xs font-semibold text-[#023E8A]">{d}</span>)}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {celulas.map((dia, i) => {
              if (!dia) return <span key={`vazio-${i}`} className="h-8" />;
              const iso = paraIso(visao.ano, visao.mes, dia);
              return (
                <button key={iso} type="button" aria-pressed={iso === valor} onClick={() => escolher(iso)} className={`h-8 rounded-lg text-xs font-medium transition ${iso === valor ? "bg-[#023E8A] text-white shadow-md ring-2 ring-[#023E8A]/20" : iso === hojeIso ? "border-2 border-[#023E8A] bg-[#EAF3F7] font-extrabold text-[#023E8A]" : "text-[#0B1756] hover:bg-[#023E8A] hover:text-white"}`}>
                  {dia}
                </button>
              );
            })}
          </div>

          <div className="mt-3 flex items-center justify-between border-t border-[#023E8A]/20 pt-3 text-xs font-semibold">
            {limpavel && valor ? <button type="button" onClick={() => escolher("")} className="rounded-lg px-2 py-1 text-[#023E8A] hover:bg-[#EAF3F7]">Limpar</button> : <span />}
            <button type="button" onClick={() => escolher(hojeIso)} className="rounded-lg bg-[#023E8A] px-3 py-2 text-white transition hover:bg-[#0B1756]">Hoje</button>
          </div>
        </Popup>
      )}
    </div>
  );
}

function Paginacao({ pagina, totalPaginas, totalItens, onChange }) {
  if (totalPaginas <= 1) return null;
  const forte = (t) => <strong className="font-semibold text-[#023E8A]">{t}</strong>;
  const botao = "flex h-10 min-w-[40px] items-center justify-center rounded-lg border px-3 text-sm font-semibold transition focus:outline-none focus:ring-4 focus:ring-[#023E8A]/20";
  const normal = "border-[#023E8A]/30 bg-white text-[#023E8A] hover:bg-[#EAF3F7] disabled:cursor-not-allowed disabled:opacity-40";

  return (
    <nav aria-label="Paginação" className="mt-2 flex flex-col items-center justify-between gap-3 sm:flex-row">
      <p className="text-sm text-slate-600">Mostrando {forte((pagina - 1) * POR_PAGINA + 1)} a {forte(Math.min(pagina * POR_PAGINA, totalItens))} de {forte(totalItens)} consultas</p>
      <div className="flex items-center gap-2">
        <button type="button" aria-label="Página anterior" disabled={pagina === 1} onClick={() => onChange(pagina - 1)} className={`${botao} ${normal}`}><ChevronLeft size={18} /></button>
        {paginasVisiveis(pagina, totalPaginas).map((n) => typeof n === "string"
          ? <span key={n} className="px-1 text-sm font-semibold text-[#023E8A]">…</span>
          : <button key={n} type="button" aria-label={`Página ${n}`} aria-current={n === pagina ? "page" : undefined} onClick={() => onChange(n)} className={`${botao} ${n === pagina ? "border-[#023E8A] bg-[#023E8A] text-white" : "border-[#023E8A]/30 bg-white text-[#023E8A] hover:bg-[#EAF3F7]"}`}>{n}</button>
        )}
        <button type="button" aria-label="Próxima página" disabled={pagina === totalPaginas} onClick={() => onChange(pagina + 1)} className={`${botao} ${normal}`}><ChevronRight size={18} /></button>
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
  const [pagina, setPagina] = useState(1);
  const listaRef = useRef(null);

  const [modalAberto, setModalAberto] = useState(false);
  const [editandoId, setEditandoId] = useState(null);
  const [form, setForm] = useState(formVazio);
  const [erro, setErro] = useState("");
  const [cancelar, setCancelar] = useState(null);
  const [aviso, setAviso] = useState(null);

  function mostrarAviso(texto) {
    setAviso(texto);
    setTimeout(() => setAviso(null), 3500);
  }

  const lista = consultas.filter((c) => {
    const termo = busca.trim().toLowerCase();
    return (!termo || c.paciente.toLowerCase().includes(termo)) &&
      (filtroEsp === "Todas" || c.especialidade === filtroEsp) &&
      (filtroUnidade === "Todas" || c.unidadeId === Number(filtroUnidade)) &&
      (!filtroData || c.data === filtroData) &&
      (filtroStatus === "Todas" || c.status === filtroStatus);
  }).sort((a, b) => (a.data + a.horario).localeCompare(b.data + b.horario));

  const unidadesDoForm = form.especialidade
    ? UNIDADES.filter((u) => u.especialidades.includes(form.especialidade))
    : [];

  const temFiltro = busca || filtroEsp !== "Todas" || filtroUnidade !== "Todas" || filtroData || filtroStatus !== "Todas";
  const totalPaginas = Math.max(1, Math.ceil(lista.length / POR_PAGINA));
  const paginaAtual = Math.min(pagina, totalPaginas);
  const visiveis = lista.slice((paginaAtual - 1) * POR_PAGINA, paginaAtual * POR_PAGINA);

  useEffect(() => { setPagina(1); }, [busca, filtroEsp, filtroUnidade, filtroData, filtroStatus]);

  useEffect(() => {
    document.body.style.overflow = modalAberto || cancelar ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [modalAberto, cancelar]);

  useEffect(() => {
    const aoTeclar = (e) => {
      if (e.key === "Escape") {
        setModalAberto(false);
        setCancelar(null);
      }
    };
    window.addEventListener("keydown", aoTeclar);
    return () => window.removeEventListener("keydown", aoTeclar);
  }, []);

  function mudarPagina(n) {
    setPagina(n);
    listaRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function limparFiltros() {
    setBusca("");
    setFiltroEsp("Todas");
    setFiltroUnidade("Todas");
    setFiltroData("");
    setFiltroStatus("Todas");
  }

  function abrirModal(id, dados) {
    setEditandoId(id);
    setForm(dados);
    setErro("");
    setModalAberto(true);
  }

  const abrirNova = () => abrirModal(null, formVazio);
  const abrirEdicao = (c) => abrirModal(c.id, { ...c, unidadeId: String(c.unidadeId) });
  const atualizar = (campo, valor) => setForm((atual) => ({ ...atual, [campo]: valor }));

  function escolherEspecialidade(nome) {
    setForm((atual) => {
      const unidadeValida = UNIDADES.some((u) => u.id === Number(atual.unidadeId) && u.especialidades.includes(nome));
      return { ...atual, especialidade: nome, unidadeId: unidadeValida ? atual.unidadeId : "" };
    });
  }

  function salvar(event) {
    event.preventDefault();
    setErro();

    if (form.paciente.trim().length < 3) return setErro("Informe o nome completo do paciente.");
    if (!form.especialidade || !form.unidadeId) return setErro("Selecione a especialidade e a unidade.");
    if (!form.data || !form.horario) return setErro("Informe a data e o horário da consulta.");

    const dados = { ...form, paciente: form.paciente.trim(), unidadeId: Number(form.unidadeId) };

    setConsultas((atuais) => editandoId
      ? atuais.map((c) => c.id === editandoId ? { ...dados, id: editandoId } : c)
      : [{ ...dados, id: Date.now() }, ...atuais]
    );

    setModalAberto(false);
    mostrarAviso(editandoId ? "Consulta atualizada com sucesso." : "Consulta cadastrada com sucesso.");
  }

  const alterarStatus = (id, status) => setConsultas((atuais) => atuais.map((c) => c.id === id ? { ...c, status } : c));

  function confirmarCancelamento() {
    alterarStatus(cancelar.id, "Cancelada");
    setCancelar(null);
    mostrarAviso("Consulta cancelada. O horário foi liberado.");
  }

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
                <h1 className="mt-5 text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl lg:text-[42px]">Gestão de consultas</h1>
                <p className="mt-3 max-w-3xl text-sm leading-7 text-white/85 sm:text-base lg:text-lg">Acompanhe os agendamentos, registre atendimentos e ausências e remarque ou cancele consultas quando necessário.</p>
              </div>
              <button type="button" onClick={abrirNova} className="shrink-0 rounded-2xl bg-white px-5 py-3.5 text-sm font-semibold text-[#023E8A] shadow-sm transition hover:bg-[#EAF3F7]">+ Nova consulta</button>
            </div>
          </div>
        </section>

        <section className="space-y-5">
          <div className="rounded-2xl border border-[#023E8A]/20 bg-white p-4 shadow-sm sm:p-5">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-[1fr_210px_280px_180px]">
              <div className="relative">
                <Search size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#023E8A]" />
                <input type="search" value={busca} onChange={(e) => setBusca(e.target.value)} placeholder="Buscar paciente..." aria-label="Buscar paciente" className={`${inputCls} pl-11`} />
              </div>
              <Dropdown rotulo="Filtrar por especialidade" valor={filtroEsp} opcoes={[{ valor: "Todas", texto: "Todas as especialidades" }, ...especialidades.map((e) => e.nome)]} onChange={setFiltroEsp} />
              <Dropdown rotulo="Filtrar por unidade" valor={filtroUnidade} opcoes={[{ valor: "Todas", texto: "Todas as unidades" }, ...UNIDADES.map((u) => ({ valor: String(u.id), texto: u.nome }))]} onChange={setFiltroUnidade} larguraLista="min-w-[300px]" />
              <DatePicker rotulo="Filtrar por data" valor={filtroData} onChange={setFiltroData} placeholder="Filtrar por data" limpavel />
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-2">
              {["Todas", ...statusLista].map((s) => (
                <button key={s} type="button" aria-pressed={filtroStatus === s} onClick={() => setFiltroStatus(s)} className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${chipSel(filtroStatus === s)}`}>{s}</button>
              ))}
              {temFiltro && <button type="button" onClick={limparFiltros} className="ml-auto text-sm font-semibold text-[#023E8A] hover:underline">Limpar filtros</button>}
            </div>
          </div>

          {lista.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-[#023E8A]/30 bg-white px-4 py-10 text-center">
              <p className="text-base font-semibold text-[#023E8A]">Nenhuma consulta encontrada.</p>
              <p className="mt-1 text-sm text-slate-400">Ajuste os filtros ou cadastre uma nova consulta.</p>
            </div>
          ) : (
            <div ref={listaRef} className="grid scroll-mt-6 gap-4">
              <p className="text-sm text-slate-500">{lista.length} consulta{lista.length === 1 ? "" : "s"} encontrada{lista.length === 1 ? "" : "s"}</p>

              {visiveis.map((c) => {
                const Icone = especialidades.find((e) => e.nome === c.especialidade)?.Icone || Stethoscope;

                return (
                  <article key={c.id} className="flex flex-col justify-between gap-5 rounded-2xl border border-[#023E8A]/15 bg-white p-5 shadow-sm lg:flex-row lg:items-center">
                    <div className="flex min-w-0 items-start gap-4">
                      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#023E8A] text-lg font-bold text-white">{iniciais(c.paciente)}</div>
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-lg font-bold text-[#0B1756]">{c.paciente}</h3>
                          <Badge tipo={corStatus[c.status]}>{c.status}</Badge>
                        </div>
                        <p className="mt-1 flex items-center gap-1.5 text-base font-semibold text-[#0B1756]"><Icone size={16} className="shrink-0 text-[#023E8A]" />{c.especialidade}</p>
                        <p className="mt-2 flex items-start gap-1.5 text-sm text-slate-600"><Hospital size={16} className="mt-0.5 shrink-0 text-[#023E8A]" />{nomeUnidade(c.unidadeId)}</p>
                        <p className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-600">
                          <span className="inline-flex items-center gap-1.5"><CalendarDays size={15} className="text-[#023E8A]" />{formatarData(c.data)}</span>
                          <span className="inline-flex items-center gap-1.5"><Clock size={15} className="text-[#023E8A]" />{c.horario}</span>
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col gap-3 sm:flex-row sm:items-end lg:shrink-0">
                      <div className="flex items-center gap-3 sm:flex-col sm:items-start sm:gap-1">
                        <span className="text-xs font-semibold text-[#023E8A]">Situação</span>
                        <Dropdown rotulo={`Situação de ${c.paciente}`} valor={c.status} opcoes={statusLista} onChange={(novo) => alterarStatus(c.id, novo)} largura="w-44" />
                      </div>
                      <div className="grid grid-cols-2 gap-2 sm:flex">
                        <button type="button" onClick={() => abrirEdicao(c)} className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#023E8A] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#0B1756]"><Pencil size={16} />Editar</button>
                        <button type="button" disabled={c.status === "Cancelada"} onClick={() => setCancelar(c)} className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#023E8A]/40 bg-white px-4 py-3 text-sm font-semibold text-[#023E8A] transition hover:bg-[#EAF3F7] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-white"><X size={16} />Cancelar</button>
                      </div>
                    </div>
                  </article>
                );
              })}

              <Paginacao pagina={paginaAtual} totalPaginas={totalPaginas} totalItens={lista.length} onChange={mudarPagina} />
            </div>
          )}
        </section>
      </main>

      {modalAberto && createPortal(
        <div className="fixed inset-0 z-[1000] flex items-end justify-center bg-[#0B1756]/40 p-0 backdrop-blur-sm sm:items-center sm:p-6" onClick={() => setModalAberto(false)}>
          <form onSubmit={salvar} role="dialog" aria-modal="true" aria-labelledby="titulo-modal" onClick={(e) => e.stopPropagation()} className="max-h-[90dvh] w-full max-w-2xl overflow-y-auto rounded-t-2xl border-t-4 border-[#023E8A] bg-white p-6 shadow-xl sm:rounded-2xl sm:border-t-0 sm:border-l-4">
            <div className="mb-6 flex items-start justify-between gap-4 border-b border-[#023E8A]/20 pb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#023E8A] text-white"><CalendarPlus size={22} /></div>
                <div>
                  <h2 id="titulo-modal" className="text-2xl font-bold text-[#023E8A]">{editandoId ? "Editar consulta" : "Nova consulta"}</h2>
                  <p className="mt-1 text-sm text-slate-500">Preencha os dados abaixo.</p>
                </div>
              </div>
              <button type="button" aria-label="Fechar" onClick={() => setModalAberto(false)} className="rounded-lg p-2 text-[#023E8A] transition hover:bg-[#EAF3F7]"><X size={20} /></button>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <Campo label="Paciente *" className="sm:col-span-2">
                <input value={form.paciente} onChange={(e) => atualizar("paciente", e.target.value)} maxLength={80} placeholder="Nome completo do paciente" className={inputCls} />
              </Campo>

              <fieldset className="sm:col-span-2">
                <legend className="mb-1.5 text-xs font-semibold text-[#023E8A]">Especialidade *</legend>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {especialidades.map(({ nome, Icone }) => (
                    <button key={nome} type="button" aria-pressed={form.especialidade === nome} onClick={() => escolherEspecialidade(nome)} className={`flex min-h-[46px] items-center justify-center gap-2 rounded-2xl border px-3 py-2 text-sm font-semibold transition ${chipSel(form.especialidade === nome)}`}><Icone size={16} />{nome}</button>
                  ))}
                </div>
              </fieldset>

              <Campo label="Unidade *" className="sm:col-span-2">
                <Dropdown rotulo="Unidade" valor={form.unidadeId} opcoes={unidadesDoForm.map((u) => ({ valor: String(u.id), texto: u.nome }))} onChange={(novo) => atualizar("unidadeId", novo)} placeholder={form.especialidade ? "Selecione a unidade" : "Escolha a especialidade primeiro"} desabilitado={!form.especialidade} larguraLista="min-w-[300px]" />
              </Campo>

              <Campo label="Data *">
                <DatePicker rotulo="Data da consulta" valor={form.data} onChange={(novo) => atualizar("data", novo)} />
              </Campo>

              <Campo label="Situação">
                <Dropdown rotulo="Situação" valor={form.status} opcoes={statusLista} onChange={(novo) => atualizar("status", novo)} />
              </Campo>

              <fieldset className="sm:col-span-2">
                <legend className="mb-1.5 text-xs font-semibold text-[#023E8A]">Horário *</legend>
                <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
                  {horarios.map((h) => (
                    <button key={h} type="button" aria-pressed={form.horario === h} onClick={() => atualizar("horario", h)} className={`flex min-h-[44px] items-center justify-center gap-1.5 rounded-2xl border px-2 py-2 text-sm font-semibold transition ${chipSel(form.horario === h)}`}>
                      {form.horario === h ? <Check size={14} /> : <Clock size={14} />}{h}
                    </button>
                  ))}
                </div>
              </fieldset>
            </div>

            {erro && <div role="alert" className="mt-5 rounded-xl border border-[#023E8A]/30 bg-[#EAF3F7] p-4 text-sm font-semibold text-[#023E8A]">{erro}</div>}

            <div className="mt-7 flex flex-col-reverse justify-between gap-3 sm:flex-row">
              <button type="button" onClick={() => setModalAberto(false)} className={botaoSecundario}>Cancelar</button>
              <button type="submit" className={botaoPrimario}><Check size={18} />{editandoId ? "Salvar alterações" : "Cadastrar consulta"}</button>
            </div>
          </form>
        </div>,
        document.body
      )}

      {cancelar && createPortal(
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-[#0B1756]/40 p-4 backdrop-blur-sm" onClick={() => setCancelar(null)}>
          <div role="alertdialog" aria-modal="true" aria-labelledby="titulo-cancelamento" onClick={(e) => e.stopPropagation()} className="w-full max-w-md rounded-2xl border-t-4 border-[#023E8A] bg-white p-6 text-center shadow-xl">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#EAF3F7] text-[#023E8A]"><AlertTriangle size={32} /></div>
            <h2 id="titulo-cancelamento" className="text-2xl font-bold text-[#023E8A]">Cancelar consulta?</h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">A consulta de {cancelar.paciente} ({cancelar.especialidade}) em {formatarData(cancelar.data)} às {cancelar.horario} será marcada como cancelada e o horário ficará livre.</p>
            <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-center">
              <button type="button" onClick={() => setCancelar(null)} className={botaoSecundario}>Voltar</button>
              <button type="button" onClick={confirmarCancelamento} className={botaoPrimario}><CalendarX size={16} />Sim, cancelar</button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {aviso && <div role="status" className="fixed bottom-5 left-1/2 z-[1100] -translate-x-1/2 rounded-xl bg-[#023E8A] px-5 py-3 text-sm font-semibold text-white shadow-lg">{aviso}</div>}
    </div>
  );
}
