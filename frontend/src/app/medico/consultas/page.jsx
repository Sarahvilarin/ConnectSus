"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { api } from "@/lib/api";
import {
  CalendarDays, CalendarOff, Check, ChevronDown, ChevronLeft, ChevronRight, ClipboardList,
  Clock, FileText, Hospital, Lock, Phone, Play, RotateCcw, Search, UserX, X,
} from "lucide-react";

/*
  PORTAL DO MÉDICO – Minhas consultas

  - Cada consulta pode ter uma `triagem` (feita pelo enfermeiro). O prontuário já nasce
    preenchido com ela e o médico pode editar tudo; o resumo original fica visível no topo.
  - Ao concluir, se houver retorno escolhido, a consulta é agendada automaticamente no
    primeiro dia em que o médico atende, não está afastado e tem horário livre.
  - Em produção: dados vêm da API. Prontuário é dado sensível (LGPD): exigir autenticação,
    controle de acesso por perfil e log de acessos/alterações no back-end.
*/

/* =========================
   CONSTANTES E ADAPTADORES DA API
========================= */
const MEDICO = { nome: "Profissional autenticado", especialidade: "", unidade: "Unidade da consulta", unidadeId: null, dias: [] };
const statusLista = ["Solicitada", "Agendada", "Em atendimento", "Concluída", "Faltou", "Cancelada"];
const opcoesRetorno = ["Sem retorno", "15 dias", "30 dias", "60 dias", "90 dias", "6 meses"];
const POR_PAGINA = 8;
const nomesMeses = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
const nomesSemana = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
const diasSemana = nomesSemana.slice(1);
const pad = (n) => String(n).padStart(2, "0");
const paraIso = (ano, mes, dia) => `${ano}-${pad(mes + 1)}-${pad(dia)}`;
const dataIso = (d) => paraIso(d.getFullYear(), d.getMonth(), d.getDate());
const dataAtualISO = () => dataIso(new Date());
const formatarData = (iso) => (iso ? String(iso).slice(0, 10).split("-").reverse().join("/") : "");
const meioDia = (iso) => new Date(`${iso}T12:00:00`);
const somarDias = (iso, n) => { const d = meioDia(iso); d.setDate(d.getDate() + n); return dataIso(d); };
const minutos = (h) => { const [hh, mm] = h.split(":").map(Number); return hh * 60 + mm; };
function paginasVisiveis(atual, total) { const nums = [...new Set([1, total, atual - 1, atual, atual + 1])].filter((n) => n >= 1 && n <= total).sort((a,b)=>a-b); return nums.flatMap((n,i)=>(i>0 && n-nums[i-1]>1?[`...${n}`,n]:[n])); }
function calcularImc(peso, altura) { const p=parseFloat(String(peso).replace(",",".")); const a=parseFloat(String(altura).replace(",","."))/100; return !p||!a||a<0.5||a>2.5?null:(p/(a*a)).toFixed(1).replace(".",","); }
function prontuarioVazio(motivo="", triagem=null) { const t=triagem||{}; return { queixa:t.queixa||motivo, historia:[t.sintomas,t.inicio_sintomas&&`Início: ${t.inicio_sintomas}`,t.observacoes].filter(Boolean).join("\n"), alergias:"", medicamentos:"", vitais:{pa:t.pressao_arterial||"",fc:t.frequencia_cardiaca||"",temp:t.temperatura??"",spo2:t.saturacao_oxigenio||"",fr:t.frequencia_respiratoria||"",glicemia:t.glicemia||"",peso:t.peso||"",altura:t.altura||""}, exameFisico:"", hipotese:"", cid:"", conduta:"", exames:"", retorno:"Sem retorno", registradoEm:null, registradoPor:null }; }
function mapearStatus(status) { return ({pendente:"Solicitada",confirmada:"Agendada",em_atendimento:"Em atendimento",concluida:"Concluída",falta:"Faltou",cancelada:"Cancelada"})[status]||status; }
function mapearTriagem(t) { if(!t) return null; const risco=({azul:"Não urgente",verde:"Pouco urgente",amarelo:"Urgente",laranja:"Muito urgente",vermelho:"Emergência"})[String(t.classificacao_risco||"").toLowerCase()]||t.classificacao_risco; return {id:t.id,data:t.criado_em?String(t.criado_em).slice(0,10):"",horario:t.criado_em?new Date(t.criado_em).toLocaleTimeString("pt-BR",{hour:"2-digit",minute:"2-digit"}):"",registradoPor:t.enfermeiro||"Equipe de enfermagem",pressao:t.pressao_arterial,frequencia:t.frequencia_cardiaca,temperatura:t.temperatura,saturacao:t.saturacao_oxigenio,respiracao:t.frequencia_respiratoria,glicemia:t.glicemia,queixa:t.queixa_principal,sintomas:t.sintomas,inicio:t.inicio_sintomas,dor:t.intensidade_dor===null?"Não informada":`${t.intensidade_dor}/10`,historico:"",alergias:"",medicamentos:"",classificacao:risco,observacoes:t.observacoes}; }
function mapearProntuario(p, motivo, triagem) { if(!p) return prontuarioVazio(motivo,triagem); return { ...prontuarioVazio(motivo,triagem), queixa:p.queixa||motivo, historia:p.historia||"", alergias:p.alergias||"", medicamentos:p.medicamentos||"", vitais:{pa:p.pressao_arterial||"",fc:p.frequencia_cardiaca||"",temp:p.temperatura??"",spo2:p.saturacao_oxigenio||"",fr:p.frequencia_respiratoria||"",glicemia:p.glicemia||"",peso:p.peso||"",altura:p.altura||""}, exameFisico:p.exame_fisico||"", hipotese:p.hipotese_diagnostica||"", cid:p.cid||"", conduta:p.conduta||"", exames:p.exames_solicitados||"", retorno:p.retorno_prazo||"Sem retorno", registradoEm:p.atualizado_em||null, registradoPor:p.registrado_por||null }; }
function mapearConsulta(c) { const dt=new Date(c.data_hora); const nasc=c.paciente_data_nascimento?new Date(c.paciente_data_nascimento):null; let idade=""; if(nasc&&!Number.isNaN(nasc.getTime())) { const hoje=new Date(); idade=hoje.getFullYear()-nasc.getFullYear()-((hoje.getMonth()<nasc.getMonth()||(hoje.getMonth()===nasc.getMonth()&&hoje.getDate()<nasc.getDate()))?1:0); } return {id:Number(c.id),paciente_id:c.paciente_id,paciente:c.paciente,cpf:c.paciente_cpf,idade,telefone:c.paciente_telefone||"",motivo:c.observacoes||c.especialidade||"Consulta",tipo:c.especialidade||"Consulta",unidade:c.unidade,unidadeId:c.unidade_id,setor:c.setor,data:dataIso(dt),horario:dt.toLocaleTimeString("pt-BR",{hour:"2-digit",minute:"2-digit"}),status:mapearStatus(c.status),statusApi:c.status,notas:"",triagem:null,prontuario:prontuarioVazio(c.observacoes||""),historico:[`Consulta ${mapearStatus(c.status).toLowerCase()}`]}; }

/* =========================
   ESTILOS REUTILIZÁVEIS
========================= */

const inputCls =
  "w-full rounded-2xl border border-[#C8D8EC] bg-white px-4 py-3 text-sm text-[#0B1756] outline-none transition placeholder:text-slate-400 hover:border-[#3563A7]/70 focus:border-[#023E8A] focus:ring-4 focus:ring-[#3563A7]/15 disabled:cursor-not-allowed disabled:border-slate-200 disabled:bg-slate-50 disabled:text-slate-600 disabled:hover:border-slate-200";
const botaoPrimario =
  "inline-flex items-center justify-center gap-2 rounded-xl bg-[#023E8A] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#0B1756] focus:outline-none focus:ring-4 focus:ring-[#3563A7]/30 disabled:cursor-not-allowed disabled:opacity-40";
const botaoSecundario =
  "inline-flex items-center justify-center gap-2 rounded-xl border border-[#0B1756]/30 bg-white px-5 py-3 text-sm font-semibold text-[#0B1756] transition hover:bg-[#EAF3F7] focus:outline-none focus:ring-4 focus:ring-[#3563A7]/15 disabled:cursor-not-allowed disabled:opacity-40";
const botaoMes = "rounded-xl border border-[#0B1756]/25 p-2 text-[#0B1756] transition hover:bg-[#0B1756]/10";
const corStatus = { Agendada: "azul", "Em atendimento": "amarelo", Concluída: "verde", Faltou: "vermelho" };

/* =========================
   COMPONENTES VISUAIS
========================= */

const BADGES = {
  neutro: ["#EAF3F7", "#000000"], azul: ["#3563A7", "#FFFFFF"], amarelo: ["#3563A7", "#FFFFFF"],
  verde: ["#023E8A", "#FFFFFF"], vermelho: ["#0B1756", "#FFFFFF"],
};

function Badge({ children, tipo = "neutro" }) {
  const [fundo, texto] = BADGES[tipo] || BADGES.neutro;
  return (
    <span
      className="inline-flex items-center whitespace-nowrap rounded-full border px-3 py-1 text-xs font-semibold"
      style={{ backgroundColor: fundo, borderColor: fundo, color: texto }}
    >
      {children}
    </span>
  );
}

const RISCOS = {
  "Não urgente": "border-blue-100 bg-blue-50 text-blue-700",
  "Pouco urgente": "border-emerald-100 bg-emerald-50 text-emerald-700",
  Urgente: "border-amber-200 bg-amber-50 text-amber-700",
  "Muito urgente": "border-red-200 bg-red-50 text-red-700",
};

function RiskBadge({ classificacao }) {
  return (
    <span className={`inline-flex items-center whitespace-nowrap rounded-full border px-2.5 py-1 text-[11px] font-bold ${RISCOS[classificacao] || "border-slate-200 bg-slate-50 text-slate-600"}`}>
      {classificacao}
    </span>
  );
}

function Campo({ label, children, className = "" }) {
  return (
    <div className={className}>
      <label className="mb-1.5 block text-xs font-semibold text-slate-600">{label}</label>
      {children}
    </div>
  );
}

/* Caixa de aviso (variante "pontilhada" para estados neutros) */
function Info({ icone: Icone, tipo = "azul", children }) {
  const cls = {
    fechado: "border-[#023E8A]/20 bg-[#EAF3F7]",
    azul: "border-[#3563A7]/30 bg-[#EAF3F7]",
    neutro: "border-dashed border-slate-300 bg-slate-50 text-slate-600",
  }[tipo];
  return (
    <div className={`flex items-start gap-3 rounded-xl border p-4 text-sm ${tipo === "neutro" ? "" : "text-[#0B1756]"} ${cls}`}>
      {Icone && <Icone size={18} className={`mt-0.5 shrink-0 ${tipo === "fechado" ? "text-[#023E8A]" : "text-[#3563A7]"}`} />}
      <div>{children}</div>
    </div>
  );
}

function Vazio({ titulo, sub }) {
  return (
    <div className="rounded-xl border border-dashed border-slate-200 px-4 py-10 text-center">
      <p className="text-sm font-medium text-slate-600">{titulo}</p>
      {sub && <p className="mt-1 text-xs text-slate-400">{sub}</p>}
    </div>
  );
}

/* Controle comum de menus flutuantes: posição fixa, fecha ao rolar/redimensionar e
   abre para cima quando falta espaço embaixo. */
function usePopup() {
  const [aberto, setAberto] = useState(false);
  const [pos, setPos] = useState({ top: 0, left: 0, width: 0 });
  const ref = useRef(null);

  useEffect(() => {
    if (!aberto) return;
    const fechar = (e) => !e.target?.closest?.("[data-popup]") && setAberto(false);
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
      <div data-popup role={role} aria-label={rotulo} style={style} className={`fixed z-20 ${className}`}>
        {children}
      </div>
    </>
  );
}

function Dropdown({ rotulo, valor, opcoes, onChange, placeholder = "Selecione", desabilitado = false }) {
  const { aberto, setAberto, pos, ref, alternar } = usePopup();
  const lista = opcoes.map((o) => (typeof o === "string" ? { valor: o, texto: o } : o));
  const atual = lista.find((o) => o.valor === valor);

  return (
    <div ref={ref} className="relative w-full" onKeyDown={(e) => e.key === "Escape" && setAberto(false)}>
      <button
        type="button"
        aria-label={rotulo}
        aria-haspopup="listbox"
        aria-expanded={aberto}
        disabled={desabilitado}
        onClick={() => alternar(Math.min(240, lista.length * 44 + 12), 170)}
        className={`flex w-full items-center justify-between gap-3 rounded-2xl border bg-white px-4 py-3 text-left text-sm text-[#0B1756] outline-none transition focus:border-[#023E8A] focus:ring-4 focus:ring-[#3563A7]/15 ${
          desabilitado
            ? "cursor-not-allowed border-slate-200 bg-slate-50 text-slate-600"
            : aberto
              ? "border-[#0B1756] ring-4 ring-[#0B1756]/15"
              : "border-[#C8D8EC] hover:border-[#3563A7]"
        }`}
      >
        <span className={`min-w-0 truncate ${atual ? "" : "text-slate-400"}`}>{atual ? atual.texto : placeholder}</span>
        <ChevronDown size={16} className={`shrink-0 transition-transform ${aberto ? "rotate-180" : ""}`} />
      </button>

      {aberto && !desabilitado && (
        <Popup
          onClose={() => setAberto(false)}
          role="listbox"
          rotulo={rotulo}
          style={{ top: pos.top, left: pos.left, width: pos.width }}
          className="max-h-60 overflow-y-auto rounded-2xl border border-[#D5E2F1] bg-white p-1.5 shadow-[0_12px_30px_rgba(11,23,86,0.16)]"
        >
          {lista.map((o) => (
            <button
              key={o.valor}
              type="button"
              role="option"
              aria-selected={o.valor === valor}
              onClick={() => { onChange(o.valor); setAberto(false); }}
              className={`flex w-full items-center justify-between gap-3 rounded-xl px-3.5 py-2.5 text-left text-sm transition ${
                o.valor === valor ? "bg-[#0B1756] font-semibold text-white" : "text-[#0B1756] hover:bg-[#EAF3F7]"
              }`}
            >
              <span>{o.texto}</span>
              {o.valor === valor && <Check size={16} className="shrink-0" />}
            </button>
          ))}
        </Popup>
      )}
    </div>
  );
}

/* Calendário personalizado. `valor` e `onChange` usam AAAA-MM-DD. */
function DatePicker({ rotulo, valor, onChange, placeholder = "Selecione a data", limpavel = false }) {
  const { aberto, setAberto, pos, ref, alternar } = usePopup();
  const [visao, setVisao] = useState({ ano: 2026, mes: 0 });
  const hojeIso = dataAtualISO();

  function abrir() {
    alternar(380, 300, () => {
      const base = valor ? new Date(`${valor}T00:00:00`) : new Date();
      setVisao({ ano: base.getFullYear(), mes: base.getMonth() });
    });
  }

  const mudarMes = (delta) =>
    setVisao(({ ano, mes }) => {
      const d = new Date(ano, mes + delta, 1);
      return { ano: d.getFullYear(), mes: d.getMonth() };
    });

  const escolher = (iso) => { onChange(iso); setAberto(false); };

  const primeiroDia = new Date(visao.ano, visao.mes, 1).getDay();
  const totalDias = new Date(visao.ano, visao.mes + 1, 0).getDate();
  const celulas = [...Array(primeiroDia).fill(null), ...Array.from({ length: totalDias }, (_, i) => i + 1)];
  const setaCls = "flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20";

  return (
    <div ref={ref} className="relative w-full" onKeyDown={(e) => e.key === "Escape" && setAberto(false)}>
      <button
        type="button"
        aria-label={rotulo}
        aria-haspopup="dialog"
        aria-expanded={aberto}
        onClick={abrir}
        className={`flex w-full items-center justify-between gap-3 rounded-2xl border bg-white px-4 py-3 text-left text-sm text-[#0B1756] transition focus:outline-none focus:ring-4 focus:ring-[#3563A7]/15 ${
          aberto ? "border-[#0B1756] ring-4 ring-[#3563A7]/15" : "border-[#C8D8EC] hover:border-[#3563A7]"
        }`}
      >
        <span className={`min-w-0 truncate ${valor ? "" : "text-slate-400"}`}>{valor ? formatarData(valor) : placeholder}</span>
        <CalendarDays size={16} className="shrink-0" />
      </button>

      {aberto && (
        <Popup
          onClose={() => setAberto(false)}
          role="dialog"
          rotulo={rotulo}
          style={{ top: pos.top, left: pos.left }}
          className="w-[300px] max-w-[calc(100vw-1.5rem)] rounded-2xl border border-[#0B1756]/20 bg-white p-4 shadow-[0_16px_40px_rgba(11,23,86,0.28)]"
        >
          <div className="mb-3 flex items-center justify-between gap-2 rounded-xl bg-[#0B1756] px-3 py-2.5">
            <p className="text-sm font-bold text-white">{nomesMeses[visao.mes]} {visao.ano}</p>
            <div className="flex gap-1">
              <button type="button" aria-label="Mês anterior" onClick={() => mudarMes(-1)} className={setaCls}><ChevronLeft size={16} /></button>
              <button type="button" aria-label="Próximo mês" onClick={() => mudarMes(1)} className={setaCls}><ChevronRight size={16} /></button>
            </div>
          </div>

          <div className="mb-1 grid grid-cols-7 text-center">
            {nomesSemana.map((d) => (
              <span key={d} className="py-1 text-xs font-semibold text-[#0B1756]">{d}</span>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {celulas.map((dia, i) => {
              if (!dia) return <span key={`vazio-${i}`} className="h-8" />;
              const iso = paraIso(visao.ano, visao.mes, dia);
              return (
                <button
                  key={iso}
                  type="button"
                  aria-pressed={iso === valor}
                  onClick={() => escolher(iso)}
                  className={`h-8 rounded-lg text-xs font-medium transition ${
                    iso === valor
                      ? "bg-[#0B1756] text-white shadow-md ring-2 ring-[#0B1756]/20"
                      : iso === hojeIso
                        ? "border-2 border-[#0B1756] bg-[#EAF3F7] font-extrabold text-[#0B1756]"
                        : "text-[#0B1756] hover:bg-[#0B1756] hover:text-white"
                  }`}
                >
                  {dia}
                </button>
              );
            })}
          </div>

          <div className="mt-3 flex items-center justify-between border-t border-[#0B1756]/15 pt-3 text-xs font-semibold">
            {limpavel && valor ? (
              <button type="button" onClick={() => escolher("")} className="rounded-lg px-2 py-1 text-[#0B1756] hover:bg-[#EAF3F7]">Limpar</button>
            ) : <span />}
            <button type="button" onClick={() => escolher(hojeIso)} className="rounded-lg bg-[#0B1756] px-3 py-2 text-white hover:bg-[#023E8A]">Hoje</button>
          </div>
        </Popup>
      )}
    </div>
  );
}

function Paginacao({ pagina, totalPaginas, totalItens, onChange }) {
  if (totalPaginas <= 1) return null;
  const forte = (t) => <strong className="font-semibold text-[#0B1756]">{t}</strong>;
  const botao = "flex h-10 min-w-[40px] items-center justify-center rounded-lg border px-3 text-sm font-semibold transition focus:outline-none focus:ring-4 focus:ring-[#3563A7]/20";
  const normal = "border-[#D5E0ED] bg-white text-[#3563A7] hover:bg-[#EAF3F7] disabled:cursor-not-allowed disabled:opacity-40";

  return (
    <nav aria-label="Paginação" className="mt-2 flex flex-col items-center justify-between gap-3 sm:flex-row">
      <p className="text-sm text-slate-600">
        Mostrando {forte((pagina - 1) * POR_PAGINA + 1)} a {forte(Math.min(pagina * POR_PAGINA, totalItens))} de {forte(totalItens)} consultas
      </p>
      <div className="flex items-center gap-2">
        <button type="button" aria-label="Página anterior" disabled={pagina === 1} onClick={() => onChange(pagina - 1)} className={`${botao} ${normal}`}>
          <ChevronLeft size={18} />
        </button>
        {paginasVisiveis(pagina, totalPaginas).map((n) =>
          typeof n === "string" ? (
            <span key={n} className="px-1 text-sm font-semibold text-slate-400">…</span>
          ) : (
            <button
              key={n}
              type="button"
              aria-label={`Página ${n}`}
              aria-current={n === pagina ? "page" : undefined}
              onClick={() => onChange(n)}
              className={`${botao} ${n === pagina ? "border-[#0B1756] bg-[#0B1756] text-white" : "border-[#D5E0ED] bg-white text-[#0B1756] hover:bg-[#EAF3F7]"}`}
            >
              {n}
            </button>
          )
        )}
        <button type="button" aria-label="Próxima página" disabled={pagina === totalPaginas} onClick={() => onChange(pagina + 1)} className={`${botao} ${normal}`}>
          <ChevronRight size={18} />
        </button>
      </div>
    </nav>
  );
}

/* =========================
   COMPONENTES DA PÁGINA
========================= */

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

function LinhaConsulta({ c, mostrarData = false, compacto = false, onAbrir }) {
  const badge = <Badge tipo={corStatus[c.status]}>{c.status}</Badge>;
  const risco = c.triagem && ["Urgente", "Muito urgente"].includes(c.triagem.classificacao);

  return (
    <div className="flex items-center gap-3 py-3">
      <span className="min-w-[56px] shrink-0 rounded-lg bg-[#EAF3F7] px-2 py-1.5 text-center text-xs font-bold leading-tight text-[#0B1756]">
        {mostrarData && <span className="block font-semibold text-[#3563A7]">{formatarData(c.data).slice(0, 5)}</span>}
        {c.horario}
      </span>

      <span className="min-w-0 flex-1">
        <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <span className="truncate text-base font-semibold text-[#0B1756]">{c.paciente}</span>
          <span className="text-xs text-slate-400">{c.idade} anos</span>
          {compacto && badge}
          {risco && <RiskBadge classificacao={c.triagem.classificacao} />}
          {c.prontuario?.registradoEm && (
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#3563A7]"><FileText size={13} />Prontuário</span>
          )}
        </span>
        <span className="mt-0.5 block truncate text-sm text-slate-500">{c.motivo} · {c.tipo}</span>
      </span>

      {!compacto && <span className="hidden shrink-0 sm:block">{badge}</span>}

      <button
        type="button"
        onClick={() => onAbrir(c.id)}
        className="shrink-0 whitespace-nowrap rounded-xl border border-[#0B1756]/40 bg-white px-3.5 py-1.5 text-xs font-bold text-[#0B1756] transition hover:bg-[#EAF3F7] focus:outline-none focus:ring-4 focus:ring-[#3563A7]/15"
      >
        Abrir consulta
      </button>
    </div>
  );
}

/* ---------- Triagem (somente leitura) ---------- */

function ResumoTriagem({ triagem: t, editavel, onRestaurar }) {
  const [aberto, setAberto] = useState(true);

  if (!t) return <Info tipo="neutro">Nenhuma triagem de enfermagem registrada para esta consulta.</Info>;

  const vitais = [
    ["Pressão arterial", `${t.pressao} mmHg`],
    ["Freq. cardíaca", `${t.frequencia} bpm`],
    ["Temperatura", `${String(t.temperatura).replace(".", ",")} °C`],
    ["Saturação", `${t.saturacao}%`],
    ["Freq. respiratória", `${t.respiracao} irpm`],
    ["Glicemia", t.glicemia ? `${t.glicemia} mg/dL` : "Não informada"],
  ];
  const detalhes = [
    ["Queixa principal", t.queixa], ["Sintomas", t.sintomas], ["Início", t.inicio],
    ["Intensidade da dor", t.dor], ["Histórico de saúde", t.historico], ["Alergias", t.alergias],
    ["Medicamentos em uso", t.medicamentos], ["Observações da enfermagem", t.observacoes],
  ].filter(([, v]) => v && String(v).trim());

  return (
    <div className="overflow-hidden rounded-xl border border-[#3563A7]/30 bg-[#F4F8FC]">
      <button type="button" onClick={() => setAberto((a) => !a)} aria-expanded={aberto} className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left">
        <span className="flex min-w-0 items-center gap-3">
          <ClipboardList size={18} className="shrink-0 text-[#3563A7]" />
          <span className="min-w-0">
            <span className="block text-sm font-bold text-[#0B1756]">Triagem de enfermagem</span>
            <span className="block truncate text-xs text-slate-500">
              {formatarData(t.data)} às {t.horario}{t.registradoPor ? ` · ${t.registradoPor}` : ""}
            </span>
          </span>
        </span>
        <span className="flex shrink-0 items-center gap-3">
          <RiskBadge classificacao={t.classificacao} />
          <ChevronDown size={16} className={`text-slate-500 transition-transform ${aberto ? "rotate-180" : ""}`} />
        </span>
      </button>

      {aberto && (
        <div className="space-y-4 border-t border-[#3563A7]/20 px-4 py-4">
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {vitais.map(([rotulo, valor]) => (
              <div key={rotulo} className="rounded-lg bg-white px-3 py-2">
                <p className="text-[11px] font-semibold text-slate-500">{rotulo}</p>
                <p className="mt-0.5 text-sm font-bold text-[#0B1756]">{valor}</p>
              </div>
            ))}
          </div>

          <div className="space-y-2 text-sm">
            {detalhes.map(([rotulo, valor]) => (
              <p key={rotulo} className="text-slate-600"><span className="font-semibold text-[#0B1756]">{rotulo}:</span> {valor}</p>
            ))}
          </div>

          {editavel && (
            <button
              type="button"
              onClick={onRestaurar}
              className="inline-flex items-center gap-2 rounded-lg border border-[#0B1756]/30 bg-white px-3 py-2 text-xs font-bold text-[#0B1756] transition hover:bg-[#EAF3F7]"
            >
              <RotateCcw size={14} />
              Restaurar anamnese e sinais vitais da triagem
            </button>
          )}
        </div>
      )}
    </div>
  );
}

/* ---------- Prontuário ---------- */

const VITAIS = [
  ["pa", "Pressão arterial", "mmHg", "120/80"], ["fc", "Freq. cardíaca", "bpm", "72"],
  ["temp", "Temperatura", "°C", "36,5"], ["spo2", "Saturação", "%", "98"],
  ["fr", "Freq. respiratória", "irpm", "16"], ["glicemia", "Glicemia", "mg/dL", "95"],
  ["peso", "Peso", "kg", "70"], ["altura", "Altura", "cm", "170"],
];

const Titulo = ({ children }) => <p className="mb-3 text-xs font-bold uppercase tracking-wide text-[#3563A7]">{children}</p>;

function Prontuario({ consulta, editavel, onCampo, onVital, onRestaurar, anteriores, previsaoRetorno, retornoAgendado }) {
  const p = consulta.prontuario;
  const imc = calcularImc(p.vitais.peso, p.vitais.altura);
  const fechado = Boolean(p.registradoEm);

  const area = (campo, label, placeholder, linhas = 3) => (
    <Campo label={label}>
      <textarea
        rows={linhas}
        disabled={!editavel}
        value={p[campo]}
        onChange={(e) => onCampo(campo, e.target.value)}
        placeholder={editavel ? placeholder : "Não informado"}
        className={inputCls}
      />
    </Campo>
  );

  const texto = (campo, label, placeholder, extra = {}) => (
    <Campo label={label}>
      <input
        type="text"
        disabled={!editavel}
        value={p[campo]}
        onChange={(e) => onCampo(campo, extra.maiuscula ? e.target.value.toUpperCase() : e.target.value)}
        placeholder={editavel ? placeholder : extra.vazio}
        maxLength={extra.maxLength}
        className={inputCls}
      />
    </Campo>
  );

  return (
    <div className="space-y-6">
      {fechado ? (
        <Info tipo="fechado" icone={Lock}>
          <strong>Prontuário fechado.</strong> Registrado por {p.registradoPor} em {p.registradoEm}. Não é possível editar após a conclusão do atendimento.
        </Info>
      ) : consulta.status === "Em atendimento" ? (
        <Info>
          {consulta.triagem
            ? "Os campos já foram preenchidos com os dados da triagem. Revise, complemente ou corrija o que for necessário. "
            : "Preencha o prontuário durante o atendimento. "}
          Queixa principal, hipótese diagnóstica e conduta são obrigatórias para concluir.
        </Info>
      ) : (
        <Info tipo="neutro">
          {consulta.status === "Agendada"
            ? "Revise a triagem abaixo. A edição do prontuário é liberada quando o atendimento for iniciado."
            : "Esta consulta não possui prontuário preenchido."}
        </Info>
      )}

      {!fechado && <ResumoTriagem triagem={consulta.triagem} editavel={editavel} onRestaurar={onRestaurar} />}

      {anteriores.length > 0 && (
        <div>
          <Titulo>Atendimentos anteriores deste paciente</Titulo>
          <div className="divide-y divide-slate-100 rounded-xl border border-slate-100">
            {anteriores.map((a) => (
              <div key={a.id} className="space-y-1 px-4 py-3 text-sm">
                <p className="font-semibold text-[#0B1756]">{formatarData(a.data)} · {a.tipo}</p>
                <p className="text-slate-600">
                  <span className="font-semibold">Diagnóstico:</span> {a.prontuario.hipotese || "Não informado"}
                  {a.prontuario.cid ? ` (${a.prontuario.cid})` : ""}
                </p>
                {a.prontuario.conduta && (
                  <p className="text-slate-600"><span className="font-semibold">Conduta:</span> {a.prontuario.conduta}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-4">
        <Titulo>Anamnese</Titulo>
        {area("queixa", "Queixa principal *", "Motivo que levou o paciente à consulta...", 2)}
        {area("historia", "História da doença atual", "Início, duração, evolução, fatores de piora e melhora...", 4)}
        <div className="grid gap-4 sm:grid-cols-2">
          {area("alergias", "Alergias", "Ex.: dipirona, penicilina ou nenhuma conhecida", 2)}
          {area("medicamentos", "Medicamentos em uso", "Nome, dose e frequência...", 2)}
        </div>
      </div>

      <div>
        <Titulo>Sinais vitais</Titulo>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {VITAIS.map(([campo, label, unidade, placeholder]) => (
            <Campo key={campo} label={label}>
              <div className="relative">
                <input
                  type="text"
                  inputMode="decimal"
                  disabled={!editavel}
                  value={p.vitais[campo] || ""}
                  onChange={(e) => onVital(campo, e.target.value)}
                  placeholder={editavel ? placeholder : "—"}
                  className={`${inputCls} pr-14`}
                />
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">{unidade}</span>
              </div>
            </Campo>
          ))}
        </div>
        {imc && <p className="mt-3 text-sm text-slate-600"><span className="font-semibold text-[#0B1756]">IMC:</span> {imc} kg/m²</p>}
      </div>

      <div className="space-y-4">
        <Titulo>Exame físico e diagnóstico</Titulo>
        {area("exameFisico", "Exame físico", "Achados do exame físico...", 3)}
        <div className="grid gap-4 sm:grid-cols-[1fr_140px]">
          {texto("hipotese", "Hipótese diagnóstica *", "Diagnóstico ou suspeita clínica", { vazio: "Não informado" })}
          {texto("cid", "CID-10", "Ex.: J06.9", { vazio: "—", maxLength: 8, maiuscula: true })}
        </div>
      </div>

      <div className="space-y-4">
        <Titulo>Conduta</Titulo>
        {area("conduta", "Conduta, prescrição e orientações *", "Tratamento, medicações prescritas e orientações ao paciente...", 4)}
        {area("exames", "Exames solicitados", "Ex.: hemograma, raio-X de tórax...", 2)}
        <Campo label="Retorno">
          <Dropdown rotulo="Retorno" valor={p.retorno} opcoes={opcoesRetorno} onChange={(v) => onCampo("retorno", v)} desabilitado={!editavel} />
        </Campo>

        {retornoAgendado ? (
          <Info tipo="fechado" icone={CalendarDays}>
            <strong>Retorno agendado:</strong> {formatarData(retornoAgendado.data)} às {retornoAgendado.horario} · {retornoAgendado.motivo}
          </Info>
        ) : editavel && p.retorno !== "Sem retorno" ? (
          previsaoRetorno ? (
            <Info icone={CalendarDays}>
              O prazo de retorno será registrado no prontuário. O agendamento deverá ser realizado pela agenda de consultas. Prazo selecionado:{" "}
              <strong>
                {formatarData(previsaoRetorno.data)} ({meioDia(previsaoRetorno.data).toLocaleDateString("pt-BR", { weekday: "long" })}) às {previsaoRetorno.horario}
              </strong>.
            </Info>
          ) : (
            <Info tipo="neutro">
              Não encontramos vaga para este retorno. O atendimento poderá ser concluído, mas o retorno precisará ser marcado manualmente.
            </Info>
          )
        ) : null}
      </div>
    </div>
  );
}

/* =========================
   PÁGINA PRINCIPAL
========================= */

export default function MinhasConsultas() {
  const [HOJE] = useState(dataAtualISO);
  const [aba, setAba] = useState("hoje");
  const [consultas, setConsultas] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erroApi, setErroApi] = useState("");
  const [salvando, setSalvando] = useState(false);
  const [profissional, setProfissional] = useState(null);
  const [historicoPaciente, setHistoricoPaciente] = useState([]);
  const afastamentos = [];
  const [agora] = useState(() => { const d = new Date(); return d.getHours() * 60 + d.getMinutes(); });

  const [mesCal, setMesCal] = useState(() => meioDia(dataAtualISO()));
  const [diaSel, setDiaSel] = useState(HOJE);

  const [busca, setBusca] = useState("");
  const [filtroStatus, setFiltroStatus] = useState("Todas");
  const [filtroData, setFiltroData] = useState("");
  const [pagina, setPagina] = useState(1);
  const listaRef = useRef(null);

  const [consultaId, setConsultaId] = useState(null);
  const [abaModal, setAbaModal] = useState("consulta");
  const [aviso, setAviso] = useState(null);

  function mostrarAviso(texto) {
    setAviso(texto);
    setTimeout(() => setAviso(null), 3500);
  }
  useEffect(() => {
    let ativo = true;
    async function carregar() {
      setCarregando(true); setErroApi("");
      try {
        const [resposta, perfil] = await Promise.all([api("/api/consultas/medico/me"), api("/medicos/me").catch(() => null)]);
        const base = Array.isArray(resposta) ? resposta : (resposta.consultas || []);
        const lista = await Promise.all(base.map(async (item) => {
          const c = mapearConsulta(item);
          const [tri, pront] = await Promise.all([
            api(`/api/consultas/${c.id}/triagem`).catch(() => null),
            api(`/api/consultas/${c.id}/prontuario`).catch(() => null),
          ]);
          c.triagem = mapearTriagem(tri);
          c.prontuario = mapearProntuario(pront?.prontuario, c.motivo, c.triagem);
          if (c.status === "Concluída" && pront?.prontuario?.atualizado_em) { c.prontuario.registradoEm = new Date(pront.prontuario.atualizado_em).toLocaleString("pt-BR"); c.prontuario.registradoPor = pront.prontuario.registrado_por || "Médico responsável"; }
          return c;
        }));
        if (!ativo) return;
        setConsultas(lista);
        const prof = perfil?.medico || perfil?.profissional || perfil;
        const salvo = typeof window !== "undefined" ? JSON.parse(localStorage.getItem("unesus_profissional") || "null") : null;
        setProfissional(prof || salvo);
      } catch (e) { if (ativo) setErroApi(e.message || "Não foi possível carregar as consultas."); }
      finally { if (ativo) setCarregando(false); }
    }
    carregar(); return () => { ativo = false; };
  }, []);

  /* ---------- Dados derivados ---------- */

  const ordenadas = useMemo(
    () => [...consultas].sort((a, b) => (a.data + a.horario).localeCompare(b.data + b.horario)),
    [consultas]
  );

  const hoje = ordenadas.filter((c) => c.data === HOJE && c.status !== "Cancelada");
  const restantes = hoje.filter((c) => ["Agendada", "Em atendimento"].includes(c.status));
  const limite7 = somarDias(HOJE, 7);
  const proximos7 = ordenadas.filter((c) => c.data > HOJE && c.data <= limite7 && c.status === "Agendada");
  const proxima =
    hoje.find((c) => c.status === "Em atendimento") ||
    restantes.find((c) => minutos(c.horario) >= agora) ||
    restantes[0] ||
    null;

  const detalhe = consultas.find((c) => c.id === consultaId) || null;

  /* Prontuários fechados de consultas anteriores do mesmo paciente (mais recentes primeiro) */
  const anteriores = historicoPaciente.map((h) => ({
    id: h.consulta_id,
    data: String(h.data_hora).slice(0, 10),
    tipo: "Consulta anterior",
    prontuario: { hipotese: h.hipotese_diagnostica, cid: h.cid, conduta: h.conduta },
  }));

  useEffect(() => {
    let ativo = true;
    if (!detalhe?.paciente_id) { setHistoricoPaciente([]); return; }
    api(`/api/consultas/medico/paciente/${detalhe.paciente_id}/historico`)
      .then((r) => { if (ativo) setHistoricoPaciente(r.historico || []); })
      .catch(() => { if (ativo) setHistoricoPaciente([]); });
    return () => { ativo = false; };
  }, [detalhe?.paciente_id]);

  const estaAfastado = (iso) => afastamentos.some((a) => a.dataInicio <= iso && a.previsaoRetorno >= iso);
  const situacaoAfast = (a) => (HOJE < a.dataInicio ? "Agendado" : HOJE > a.previsaoRetorno ? "Concluído" : "Em andamento");

  /* ---------- Retorno automático ---------- */

  /* A partir do prazo escolhido, acha o primeiro dia em que o médico atende, não está
     afastado e tem horário livre. Prefere o mesmo horário da consulta de origem. */
  function buscarVagaRetorno(retorno, horarioPreferido, lista) {
    const dias = DIAS_RETORNO[retorno];
    if (!dias) return null;

    let d = somarDias(HOJE, dias);
    for (let i = 0; i < 365; i++, d = somarDias(d, 1)) {
      if (!MEDICO.dias.includes(nomesSemana[meioDia(d).getDay()]) || estaAfastado(d)) continue;
      const ocupados = lista.filter((c) => c.data === d && c.status !== "Cancelada").map((c) => c.horario);
      const livres = HORARIOS.filter((h) => !ocupados.includes(h));
      if (livres.length) return { data: d, horario: livres.includes(horarioPreferido) ? horarioPreferido : livres[0] };
    }
    return null;
  }

  const previsaoRetorno = null;
  const retornoAgendado = null;

  /* ---------- Agenda ---------- */

  const diasCalendario = useMemo(() => {
    const ano = mesCal.getFullYear();
    const mes = mesCal.getMonth();
    const vazios = (new Date(ano, mes, 1).getDay() + 6) % 7;
    const qtdDias = new Date(ano, mes + 1, 0).getDate();

    return [
      ...Array.from({ length: vazios }, (_, i) => ({ chave: `vazio-${i}`, vazio: true })),
      ...Array.from({ length: qtdDias }, (_, i) => {
        const data = paraIso(ano, mes, i + 1);
        return {
          chave: data, data, dia: i + 1,
          qtd: consultas.filter((c) => c.data === data && c.status !== "Cancelada").length,
          afastado: afastamentos.some((a) => a.dataInicio <= data && a.previsaoRetorno >= data),
        };
      }),
    ];
  }, [mesCal, consultas, afastamentos]);

  const consultasDoDia = ordenadas.filter((c) => c.data === diaSel && c.status !== "Cancelada");

  /* ---------- Todas as consultas ---------- */

  const lista = useMemo(() => {
    const termo = busca.trim().toLowerCase();
    const filtradas = ordenadas.filter(
      (c) =>
        (!termo || c.paciente.toLowerCase().includes(termo) || c.motivo.toLowerCase().includes(termo)) &&
        (filtroStatus === "Todas" || c.status === filtroStatus) &&
        (!filtroData || c.data === filtroData)
    );
    return [...filtradas.filter((c) => c.data >= HOJE), ...filtradas.filter((c) => c.data < HOJE).reverse()];
  }, [ordenadas, busca, filtroStatus, filtroData, HOJE]);

  const totalPaginas = Math.max(1, Math.ceil(lista.length / POR_PAGINA));
  const paginaAtual = Math.min(pagina, totalPaginas);
  const visiveis = lista.slice((paginaAtual - 1) * POR_PAGINA, paginaAtual * POR_PAGINA);

  useEffect(() => setPagina(1), [busca, filtroStatus, filtroData]);

  useEffect(() => {
    document.body.style.overflow = detalhe ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [detalhe]);

  useEffect(() => {
    const aoTeclar = (e) => e.key === "Escape" && setConsultaId(null);
    window.addEventListener("keydown", aoTeclar);
    return () => window.removeEventListener("keydown", aoTeclar);
  }, []);

  function mudarPagina(n) {
    setPagina(n);
    listaRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  /* ---------- Ações persistidas no backend ---------- */
  const atualizar = (id, fn) => setConsultas((atuais) => atuais.map((c) => (c.id === id ? fn(c) : c)));
  async function mudarStatus(id, status, mensagem) {
    const endpoint = status === "Em atendimento" ? "iniciar" : status === "Faltou" ? "falta" : null;
    if (!endpoint) return;
    try { await api(`/api/consultas/${id}/${endpoint}`, { method: "PATCH" });
      const statusApi = status === "Em atendimento" ? "em_atendimento" : "falta";
      atualizar(id, (c) => ({ ...c, status, statusApi, historico: [...c.historico, status] }));
      mostrarAviso(mensagem);
    } catch (e) { mostrarAviso(e.message); }
  }
  const atualizarProntuario = (id, campo, valor) => atualizar(id, (c) => ({ ...c, prontuario: { ...c.prontuario, [campo]: valor } }));
  const atualizarVital = (id, campo, valor) => atualizar(id, (c) => ({ ...c, prontuario: { ...c.prontuario, vitais: { ...c.prontuario.vitais, [campo]: valor } } }));
  function restaurarDaTriagem(id) { atualizar(id, (c) => ({ ...c, prontuario: { ...prontuarioVazio(c.motivo,c.triagem), exameFisico:c.prontuario.exameFisico, hipotese:c.prontuario.hipotese, cid:c.prontuario.cid, conduta:c.prontuario.conduta, exames:c.prontuario.exames, retorno:c.prontuario.retorno } })); mostrarAviso("Dados originais da triagem reaplicados. Salve o prontuário para persistir as alterações."); }
  async function salvarProntuario(c) {
    const p=c.prontuario; setSalvando(true);
    const body={queixa:p.queixa,historia:p.historia,alergias:p.alergias,medicamentos:p.medicamentos,pressao_arterial:p.vitais.pa,frequencia_cardiaca:p.vitais.fc,temperatura:p.vitais.temp,saturacao_oxigenio:p.vitais.spo2,frequencia_respiratoria:p.vitais.fr,glicemia:p.vitais.glicemia,peso:p.vitais.peso,altura:p.vitais.altura,exame_fisico:p.exameFisico,hipotese_diagnostica:p.hipotese,cid:p.cid,conduta:p.conduta,exames_solicitados:p.exames,retorno_prazo:p.retorno};
    try { await api(`/api/consultas/${c.id}/prontuario`,{method:"PUT",body:JSON.stringify(body)}); mostrarAviso("Prontuário salvo com sucesso."); } catch(e) { mostrarAviso(e.message); } finally { setSalvando(false); }
  }
  async function concluirAtendimento(c) {
    const p=c.prontuario; const faltando=[!p.queixa.trim()&&"queixa principal",!p.hipotese.trim()&&"hipótese diagnóstica",!p.conduta.trim()&&"conduta"].filter(Boolean);
    if(faltando.length){setAbaModal("prontuario");mostrarAviso(`Preencha no prontuário: ${faltando.join(", ")}.`);return;}
    setSalvando(true);
    try {
      await api(`/api/consultas/${c.id}/prontuario`,{method:"PUT",body:JSON.stringify({queixa:p.queixa,historia:p.historia,alergias:p.alergias,medicamentos:p.medicamentos,pressao_arterial:p.vitais.pa,frequencia_cardiaca:p.vitais.fc,temperatura:p.vitais.temp,saturacao_oxigenio:p.vitais.spo2,frequencia_respiratoria:p.vitais.fr,glicemia:p.vitais.glicemia,peso:p.vitais.peso,altura:p.vitais.altura,exame_fisico:p.exameFisico,hipotese_diagnostica:p.hipotese,cid:p.cid,conduta:p.conduta,exames_solicitados:p.exames,retorno_prazo:p.retorno})});
      await api(`/api/consultas/${c.id}/concluir`,{method:"PATCH"});
      atualizar(c.id,(x)=>({...x,status:"Concluída",statusApi:"concluida",prontuario:{...x.prontuario,registradoEm:new Date().toLocaleString("pt-BR"),registradoPor:profissional?.nome_completo||"Médico responsável"}}));
      mostrarAviso("Atendimento concluído e prontuário registrado."); setConsultaId(null);
    } catch(e){mostrarAviso(e.message);} finally{setSalvando(false);}
  }

  const abrir = (id, abaInicial = "consulta") => { setAbaModal(abaInicial); setConsultaId(id); };

  const abas = [
    { id: "hoje", titulo: "Hoje", sub: "Atendimentos do dia" },
    { id: "agenda", titulo: "Agenda", sub: "Calendário de consultas" },
    { id: "consultas", titulo: "Todas as consultas", sub: "Busca e histórico" },
  ];

  const dataExtenso = meioDia(HOJE).toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long" });

  const kpis = [
    ["Consultas hoje", hoje.length],
    ["Ainda por atender", restantes.length],
    ["Concluídas hoje", hoje.filter((c) => c.status === "Concluída").length],
    ["Próximos 7 dias", proximos7.length],
  ];

  const temFiltro = busca || filtroStatus !== "Todas" || filtroData;

  return (
    <div className="min-h-screen bg-[#EEF5F9] font-sans text-[#0B1756]">
      <div className="pointer-events-none fixed -right-36 -top-36 h-96 w-96 rounded-full border-[64px] border-[#D9E8FA]/60" />
      <div className="pointer-events-none fixed -bottom-40 -left-32 h-96 w-96 rounded-full bg-white/70" />

      <main className="relative z-10 mx-auto max-w-[1400px] space-y-7 px-4 py-7 sm:px-6 lg:px-8">
        {carregando && <Info tipo="azul">Carregando consultas do servidor...</Info>}
        {erroApi && <Info tipo="neutro">{erroApi} <button type="button" className="ml-2 font-bold underline" onClick={() => window.location.reload()}>Tentar novamente</button></Info>}
        {/* CABEÇALHO E NAVEGAÇÃO */}
        <section className="relative pb-0">
          <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-[#023E8A] via-[#3563A7] to-[#0B1756] px-7 pb-20 pt-7 shadow-sm sm:px-10 sm:pt-9 sm:pb-22">
            <div className="pointer-events-none absolute -right-16 -top-24 h-80 w-80 rounded-full border-[48px] border-white/[0.06]" />
            <div className="pointer-events-none absolute right-[25%] top-20 h-72 w-72 rounded-full border-[45px] border-white/[0.05]" />

            <div className="relative z-10 flex flex-col justify-between gap-7 lg:flex-row lg:items-center">
              <div className="max-w-3xl">
                <h1 className="mt-5 text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl lg:text-[42px]">Minhas consultas</h1>
                <p className="mt-3 max-w-3xl text-sm leading-7 text-white/85 sm:text-base lg:text-lg">
                  Acompanhe seus atendimentos, registre o prontuário de cada consulta e consulte sua agenda.
                </p>
                <p className="mt-3 flex flex-wrap items-center gap-2 text-sm text-white/80">
                  <Hospital size={16} className="shrink-0" />
                  {profissional?.nome_completo || "Médico"} · {detalhe?.unidade || "Consultas da sua agenda"}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setAba("agenda")}
                className="shrink-0 rounded-2xl bg-white px-5 py-3.5 text-sm font-semibold text-[#0B1756] shadow-sm transition hover:bg-[#EAF3F7]"
              >
                Ver agenda do mês
              </button>
            </div>
          </div>

          <nav className="relative z-20 -mt-[72px] grid grid-cols-1 gap-3 px-4 sm:grid-cols-3 sm:px-6" aria-label="Seções das consultas">
            {abas.map((a) => (
              <button
                key={a.id}
                type="button"
                onClick={() => setAba(a.id)}
                className={`flex min-h-[90px] flex-col justify-center rounded-[24px] border bg-white px-5 py-3 text-left shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-md ${
                  aba === a.id ? "border-[#3563A7] ring-1 ring-[#3563A7]/20" : "border-[#EAF3F7] hover:border-[#3563A7]/40"
                }`}
              >
                <span className="text-base font-bold text-[#0B1756]">{a.titulo}</span>
                <span className="mt-1 text-sm text-[#3563A7]">{a.sub}</span>
              </button>
            ))}
          </nav>
        </section>

        {/* HOJE */}
        {aba === "hoje" && (
          <div className="space-y-6">
            <div>
              <h2 className="text-4xl font-bold tracking-tight text-[#0B1756]">Consultas de hoje</h2>
              <p className="mt-1 text-base capitalize text-slate-500">{dataExtenso}</p>
            </div>

            <section className="overflow-hidden rounded-2xl border border-[#1D4C91] bg-gradient-to-r from-[#023E8A] via-[#3563A7] to-[#0B1756] p-5 text-white shadow-lg sm:p-6">
              <div className="grid grid-cols-2 gap-y-5 lg:grid-cols-4 lg:gap-y-0">
                {kpis.map(([titulo, valor], i) => (
                  <div
                    key={titulo}
                    className={`px-3 sm:px-5 ${i % 2 === 1 ? "border-l border-white/20" : ""} ${i >= 2 ? "border-t border-white/20 pt-5 lg:border-t-0 lg:pt-0" : ""} ${i === 2 ? "lg:border-l" : ""}`}
                  >
                    <p className="text-4xl font-bold tracking-tight text-white sm:text-5xl">{valor}</p>
                    <p className="mt-2 text-base font-semibold leading-5 text-white sm:text-lg">{titulo}</p>
                  </div>
                ))}
              </div>
            </section>

            <div className="grid gap-5 xl:grid-cols-[1.25fr_0.75fr]">
              <div className="xl:relative">
                <CardSecao
                  className="xl:absolute xl:inset-0 xl:flex xl:flex-col"
                  titulo="Agenda do dia"
                  subtitulo="Toque em uma consulta para ver os detalhes e registrar o prontuário."
                  acao={<Badge tipo="azul">{hoje.length} consulta(s)</Badge>}
                >
                  {hoje.length ? (
                    <div className="divide-y divide-slate-100 xl:min-h-0 xl:flex-1 xl:overflow-y-auto">
                      {hoje.map((c) => <LinhaConsulta key={c.id} c={c} onAbrir={abrir} />)}
                    </div>
                  ) : (
                    <Vazio titulo="Nenhuma consulta para hoje" sub="Confira os próximos dias na agenda." />
                  )}
                </CardSecao>
              </div>

              <div className="space-y-5">
                <CardSecao titulo="Próxima consulta">
                  {proxima ? (
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <span className="rounded-lg bg-[#EAF3F7] px-3 py-2 text-sm font-bold text-[#0B1756]">{proxima.horario}</span>
                        <div className="min-w-0">
                          <p className="text-lg font-bold text-[#0B1756]">{proxima.paciente}</p>
                          <p className="mt-1 text-sm text-slate-500">{proxima.motivo}</p>
                          <div className="mt-2 flex flex-wrap items-center gap-2">
                            <Badge tipo={corStatus[proxima.status]}>{proxima.status}</Badge>
                            <Badge>{proxima.tipo}</Badge>
                            {proxima.triagem && <RiskBadge classificacao={proxima.triagem.classificacao} />}
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col gap-2 sm:flex-row">
                        {proxima.status === "Agendada" && (
                          <button type="button" onClick={() => mudarStatus(proxima.id, "Em atendimento", "Atendimento iniciado.")} className={botaoPrimario}>
                            <Play size={16} />Iniciar atendimento
                          </button>
                        )}
                        <button type="button" onClick={() => abrir(proxima.id, "prontuario")} className={botaoSecundario}>
                          <FileText size={16} />Abrir prontuário
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-slate-400">Nenhuma consulta pendente para hoje.</p>
                  )}
                </CardSecao>

                <CardSecao titulo="Seus dias de atendimento">
                  <div className="flex flex-wrap gap-2">
                    <span className="text-sm text-slate-500">A agenda exibirá os dias conforme as consultas cadastradas.</span>
                  </div>
                </CardSecao>

                <CardSecao titulo="Afastamentos" subtitulo="Registrados pela administração.">
                  {afastamentos.length ? (
                    <div className="divide-y divide-slate-100">
                      {afastamentos.map((a) => (
                        <div key={a.id} className="flex items-start gap-3 py-3 first:pt-0 last:pb-0">
                          <CalendarOff size={18} className="mt-0.5 shrink-0 text-[#3563A7]" />
                          <div className="min-w-0 flex-1">
                            <p className="text-base font-semibold text-[#0B1756]">{a.motivo}</p>
                            <p className="mt-1 text-sm text-slate-500">{formatarData(a.dataInicio)} a {formatarData(a.previsaoRetorno)}</p>
                          </div>
                          <Badge tipo={situacaoAfast(a) === "Em andamento" ? "vermelho" : "azul"}>{situacaoAfast(a)}</Badge>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-slate-400">Nenhum afastamento registrado.</p>
                  )}
                </CardSecao>
              </div>
            </div>
          </div>
        )}

        {/* AGENDA */}
        {aba === "agenda" && (
          <div className="grid gap-5 xl:grid-cols-[1.25fr_0.75fr]">
            <CardSecao titulo="Calendário de consultas" subtitulo="Selecione um dia para ver as consultas programadas.">
              <div className="mb-5 flex items-center justify-between gap-3">
                <button type="button" aria-label="Mês anterior" onClick={() => setMesCal((d) => new Date(d.getFullYear(), d.getMonth() - 1, 1))} className={botaoMes}>
                  <ChevronLeft size={18} />
                </button>
                <h3 className="text-base font-bold capitalize text-[#0B1756]">
                  {mesCal.toLocaleDateString("pt-BR", { month: "long", year: "numeric" })}
                </h3>
                <button type="button" aria-label="Próximo mês" onClick={() => setMesCal((d) => new Date(d.getFullYear(), d.getMonth() + 1, 1))} className={botaoMes}>
                  <ChevronRight size={18} />
                </button>
              </div>

              <div className="grid grid-cols-7 gap-1.5">
                {[...diasSemana, "Dom"].map((d) => (
                  <div key={d} className="py-2 text-center text-xs font-semibold text-[#0B1756]">{d}</div>
                ))}

                {diasCalendario.map((d) => {
                  if (d.vazio) return <div key={d.chave} />;
                  const sel = diaSel === d.data;
                  return (
                    <button
                      key={d.chave}
                      type="button"
                      onClick={() => setDiaSel(d.data)}
                      className={`flex min-h-[66px] flex-col items-center rounded-xl border p-2 transition sm:min-h-[78px] ${
                        sel
                          ? "border-[#0B1756] bg-[#0B1756] text-white shadow-sm ring-1 ring-[#0B1756]/20"
                          : d.data === HOJE
                            ? "border-2 border-[#0B1756] bg-[#EAF3F7] hover:bg-[#0B1756]/5"
                            : d.afastado
                              ? "border-slate-200 bg-slate-50 hover:border-[#0B1756]"
                              : "border-slate-200 bg-white hover:border-[#0B1756] hover:bg-[#0B1756]/5"
                      }`}
                    >
                      <span className={`text-sm ${sel ? "font-bold text-white" : "text-slate-700"}`}>{d.dia}</span>
                      {d.qtd > 0 && (
                        <span className={`mt-1 rounded-full px-2 py-0.5 text-[10px] font-semibold ${sel ? "bg-white text-[#0B1756]" : "bg-[#0B1756] text-white"}`}>{d.qtd}</span>
                      )}
                      {d.afastado && <span className={`mt-1 hidden text-[9px] sm:block ${sel ? "text-white/80" : "text-slate-400"}`}>afastado</span>}
                    </button>
                  );
                })}
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-slate-500">
                <span className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-[#0B1756]" />Quantidade de consultas no dia</span>
                <span>Dias de afastamento aparecem em cinza.</span>
              </div>
            </CardSecao>

            <CardSecao titulo="Consultas do dia" subtitulo={formatarData(diaSel)} acao={<Badge tipo="azul">{consultasDoDia.length} consulta(s)</Badge>}>
              {consultasDoDia.length ? (
                <div className="divide-y divide-slate-100">
                  {consultasDoDia.map((c) => <LinhaConsulta key={c.id} c={c} compacto onAbrir={abrir} />)}
                </div>
              ) : (
                <Vazio titulo="Nenhuma consulta nesta data" sub="Selecione outro dia no calendário." />
              )}
            </CardSecao>
          </div>
        )}

        {/* TODAS AS CONSULTAS */}
        {aba === "consultas" && (
          <section className="space-y-5">
            <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm sm:p-5">
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-[1fr_240px_200px]">
                <div className="relative">
                  <Search size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#0B1756]" />
                  <input
                    type="search"
                    value={busca}
                    onChange={(e) => setBusca(e.target.value)}
                    placeholder="Buscar paciente ou motivo..."
                    aria-label="Buscar consulta"
                    className={`${inputCls} pl-11`}
                  />
                </div>

                <Dropdown
                  rotulo="Filtrar por situação"
                  valor={filtroStatus}
                  opcoes={[{ valor: "Todas", texto: "Todas as situações" }, ...statusLista]}
                  onChange={setFiltroStatus}
                />

                <DatePicker rotulo="Filtrar por data" valor={filtroData} onChange={setFiltroData} placeholder="Filtrar por data" limpavel />
              </div>

              {temFiltro && (
                <button
                  type="button"
                  onClick={() => { setBusca(""); setFiltroStatus("Todas"); setFiltroData(""); }}
                  className="mt-4 text-sm font-semibold text-[#023E8A] hover:underline"
                >
                  Limpar filtros
                </button>
              )}
            </div>

            {lista.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-200 bg-white px-4 py-10 text-center">
                <p className="text-base font-semibold text-slate-600">Nenhuma consulta encontrada.</p>
                <p className="mt-1 text-sm text-slate-400">Ajuste a busca ou os filtros.</p>
              </div>
            ) : (
              <div ref={listaRef} className="scroll-mt-6 space-y-4">
                <div className="divide-y divide-slate-100 rounded-2xl border border-slate-100 bg-white px-5 shadow-sm">
                  {visiveis.map((c) => <LinhaConsulta key={c.id} c={c} mostrarData onAbrir={abrir} />)}
                </div>
                <Paginacao pagina={paginaAtual} totalPaginas={totalPaginas} totalItens={lista.length} onChange={mudarPagina} />
              </div>
            )}
          </section>
        )}
      </main>

      {/* MODAL: DETALHES DA CONSULTA + PRONTUÁRIO */}
      {detalhe && createPortal(
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-[#0B1756]/40 p-4 backdrop-blur-sm" onClick={() => setConsultaId(null)}>
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="titulo-consulta"
            onClick={(e) => e.stopPropagation()}
            className="max-h-[90vh] w-full max-w-3xl space-y-5 overflow-y-auto rounded-2xl bg-white p-6 shadow-xl"
          >
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 id="titulo-consulta" className="text-2xl font-bold text-[#0B1756]">{detalhe.paciente}</h3>
                <p className="mt-1 text-sm text-slate-500">
                  {detalhe.idade} anos · {detalhe.tipo} · {formatarData(detalhe.data)} às {detalhe.horario}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Badge tipo={corStatus[detalhe.status]}>{detalhe.status}</Badge>
                <button type="button" aria-label="Fechar" onClick={() => setConsultaId(null)} className="rounded-lg p-2 text-slate-500 transition hover:bg-[#EAF3F7] hover:text-[#0B1756]">
                  <X size={20} />
                </button>
              </div>
            </div>

            <div role="tablist" aria-label="Seções da consulta" className="flex gap-2">
              {[["consulta", "Consulta"], ["prontuario", "Prontuário"]].map(([id, titulo]) => (
                <button
                  key={id}
                  type="button"
                  role="tab"
                  aria-selected={abaModal === id}
                  onClick={() => setAbaModal(id)}
                  className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
                    abaModal === id ? "bg-[#0B1756] text-white" : "bg-[#EAF3F7] text-[#0B1756] hover:bg-[#DCE8F8]"
                  }`}
                >
                  {id === "prontuario" && <FileText size={16} />}
                  {titulo}
                </button>
              ))}
            </div>

            {abaModal === "consulta" ? (
              <>
                <div className="space-y-2 rounded-xl bg-slate-50 p-4 text-sm text-slate-600">
                  <p className="flex items-center gap-2">
                    <CalendarDays size={16} className="shrink-0 text-[#3563A7]" />
                    {formatarData(detalhe.data)}
                    <Clock size={16} className="ml-2 shrink-0 text-[#3563A7]" />
                    {detalhe.horario}
                  </p>
                  <p className="flex items-start gap-2"><Hospital size={16} className="mt-0.5 shrink-0 text-[#3563A7]" />{detalhe.unidade || "Unidade informada na consulta"}</p>
                  <p className="flex items-center gap-2"><Phone size={16} className="shrink-0 text-[#3563A7]" />{detalhe.telefone || "Não informado"}</p>
                  <p><strong>Motivo:</strong> {detalhe.motivo}</p>
                </div>

                <Campo label="Anotações rápidas">
                  <textarea
                    rows={3}
                    value={detalhe.notas}
                    onChange={(e) => atualizar(detalhe.id, (c) => ({ ...c, notas: e.target.value }))}
                    placeholder="Lembretes e observações (o registro clínico oficial fica no prontuário)..."
                    className={inputCls}
                  />
                </Campo>

                <div className="border-t border-slate-100 pt-4">
                  <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500">Histórico</p>
                  <ol className="space-y-2 border-l-2 border-[#DCE8F8] pl-4 text-xs text-slate-500">
                    {detalhe.historico.map((h, i) => <li key={i}>{h}</li>)}
                  </ol>
                </div>
              </>
            ) : (
              <Prontuario
                consulta={detalhe}
                editavel={detalhe.status === "Em atendimento"}
                onCampo={(campo, valor) => atualizarProntuario(detalhe.id, campo, valor)}
                onVital={(campo, valor) => atualizarVital(detalhe.id, campo, valor)}
                onRestaurar={() => restaurarDaTriagem(detalhe.id)}
                anteriores={anteriores}
                previsaoRetorno={previsaoRetorno}
                retornoAgendado={retornoAgendado}
              />
            )}

            {/* Ações (sempre visíveis, em qualquer aba) */}
            {detalhe.status === "Solicitada" && (
              <div className="border-t border-slate-100 pt-4">
                <button type="button" disabled={salvando} onClick={async()=>{setSalvando(true);try{await api(`/api/consultas/${detalhe.id}/confirmar`,{method:"PATCH"});atualizar(detalhe.id,c=>({...c,status:"Agendada",statusApi:"confirmada"}));mostrarAviso("Consulta confirmada.");}catch(e){mostrarAviso(e.message);}finally{setSalvando(false);}}} className={`${botaoPrimario} w-full`}>Confirmar consulta</button>
              </div>
            )}

            {detalhe.status === "Agendada" && (
              <div className="space-y-2 border-t border-slate-100 pt-4">
                <div className="flex flex-col gap-2 sm:flex-row">
                  <button
                    type="button"
                    disabled={detalhe.data > HOJE}
                    onClick={() => { mudarStatus(detalhe.id, "Em atendimento", "Atendimento iniciado."); setAbaModal("prontuario"); }}
                    className={`${botaoPrimario} flex-1`}
                  >
                    <Play size={16} />Iniciar atendimento
                  </button>
                  <button
                    type="button"
                    disabled={detalhe.data > HOJE}
                    onClick={() => mudarStatus(detalhe.id, "Faltou", "Falta registrada.")}
                    className={`${botaoSecundario} flex-1`}
                  >
                    <UserX size={16} />Registrar falta
                  </button>
                </div>
                {detalhe.data > HOJE && <p className="text-xs text-slate-500">As ações ficam disponíveis a partir do dia da consulta.</p>}
              </div>
            )}

            {detalhe.status === "Em atendimento" && (
              <div className="flex flex-col gap-2 border-t border-slate-100 pt-4 sm:flex-row">
                <button type="button" disabled={salvando} onClick={() => salvarProntuario(detalhe)} className={`${botaoSecundario} flex-1`}>{salvando ? "Salvando..." : "Salvar prontuário"}</button>
                <button type="button" disabled={salvando} onClick={() => concluirAtendimento(detalhe)} className={`${botaoPrimario} flex-1`}><Check size={16} />Concluir atendimento</button>
              </div>
            )}
          </div>
        </div>,
        document.body
      )}

      {aviso && (
        <div role="status" className="fixed bottom-5 left-1/2 z-[1100] -translate-x-1/2 rounded-xl bg-[#17418E] px-5 py-3 text-sm font-semibold text-white shadow-lg">
          {aviso}
        </div>
      )}
    </div>
  );
}