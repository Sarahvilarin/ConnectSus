"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
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
   DADOS E CONSTANTES
========================= */

const MEDICO = {
  nome: "Dra. Helena Duarte",
  especialidade: "Clínica geral",
  unidade: "Atende Fácil Saúde Pedro Kassab",
  unidadeId: 3,
  dias: ["Seg", "Ter", "Qui"],
};

const statusLista = ["Agendada", "Em atendimento", "Concluída", "Faltou", "Cancelada"];
const opcoesRetorno = ["Sem retorno", "15 dias", "30 dias", "60 dias", "90 dias", "6 meses"];
const DIAS_RETORNO = { "15 dias": 15, "30 dias": 30, "60 dias": 60, "90 dias": 90, "6 meses": 180 };
const POR_PAGINA = 8;

const nomesMeses = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
const nomesSemana = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
const diasSemana = nomesSemana.slice(1);

/* Horários de atendimento (manhã e tarde, de 30 em 30 min) */
const HORARIOS = [[480, 720], [840, 1080]].flatMap(([ini, fim]) =>
  Array.from({ length: (fim - ini) / 30 }, (_, i) => {
    const m = ini + i * 30;
    return `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
  })
);

const pad = (n) => String(n).padStart(2, "0");
const paraIso = (ano, mes, dia) => `${ano}-${pad(mes + 1)}-${pad(dia)}`;
const dataIso = (d) => paraIso(d.getFullYear(), d.getMonth(), d.getDate());
const dataAtualISO = () => dataIso(new Date());
const formatarData = (iso) => (iso ? iso.split("-").reverse().join("/") : "");
const minutos = (h) => { const [hh, mm] = h.split(":").map(Number); return hh * 60 + mm; };
const meioDia = (iso) => new Date(`${iso}T12:00:00`);

function somarDias(iso, n) {
  const d = meioDia(iso);
  d.setDate(d.getDate() + n);
  return dataIso(d);
}

function paginasVisiveis(atual, total) {
  const nums = [...new Set([1, total, atual - 1, atual, atual + 1])].filter((n) => n >= 1 && n <= total).sort((a, b) => a - b);
  return nums.flatMap((n, i) => (i > 0 && n - nums[i - 1] > 1 ? [`...${n}`, n] : [n]));
}

function calcularImc(peso, altura) {
  const p = parseFloat(String(peso).replace(",", "."));
  const a = parseFloat(String(altura).replace(",", ".")) / 100;
  return !p || !a || a < 0.5 || a > 2.5 ? null : (p / (a * a)).toFixed(1).replace(".", ",");
}

/* Triagens de exemplo (no sistema real vêm da tela do enfermeiro) */
const tri = (horario, pressao, frequencia, temperatura, saturacao, respiracao, glicemia, queixa, sintomas, inicio, dor, historico, alergias, medicamentos, classificacao, observacoes) => ({
  horario, registradoPor: "Enf. Camila Reis", pressao, frequencia, temperatura, saturacao, respiracao, glicemia,
  queixa, sintomas, inicio, dor, historico, alergias, medicamentos, classificacao, observacoes,
});

const TRIAGENS_DEMO = {
  "João Pedro Alves": tri("08:40", "150/95", "88", "36.8", "97", "18", "212", "Acompanhamento de diabetes", "Sede excessiva e cansaço nos últimos dias.", "Há uma semana", "Sem dor", "Diabetes tipo 2 e hipertensão.", "Dipirona", "Metformina 850 mg, Losartana 50 mg", "Urgente", "Glicemia elevada na aferição. Paciente consciente e orientado."),
  "Ana Beatriz Lima": tri("09:20", "118/76", "82", "37.4", "98", "18", "", "Tosse persistente há 2 semanas", "Tosse seca, pior à noite, sem falta de ar.", "Há duas semanas", "Leve", "Rinite alérgica.", "Poeira", "Nenhum", "Pouco urgente", "Sem febre no momento."),
  "Carlos Eduardo Sá": tri("13:40", "130/85", "76", "36.5", "99", "16", "", "Dor lombar", "Dor na região lombar ao se abaixar, sem irradiação.", "Há cinco dias", "Moderada", "Nega doenças crônicas.", "Não relatadas", "Nenhum", "Pouco urgente", "Deambula sem dificuldade."),
  "Beatriz Nogueira": tri("15:10", "110/70", "72", "36.4", "99", "15", "", "Atestado e avaliação geral", "Sem sintomas relatados.", "Não se aplica", "Sem dor", "Nega doenças crônicas.", "Não relatadas", "Anticoncepcional oral", "Não urgente", "Paciente estável."),
};

/* "História da doença atual" montada a partir da triagem */
const historiaDaTriagem = (t) =>
  [
    t.sintomas?.trim(),
    t.inicio?.trim() && t.inicio !== "Não se aplica" && `Início: ${t.inicio}.`,
    t.dor?.trim() && `Intensidade da dor: ${t.dor}.`,
    t.historico?.trim() && `Antecedentes: ${t.historico.trim()}`,
  ].filter(Boolean).join("\n");

/* Prontuário em branco; se houver triagem, já vem preenchido com ela */
function prontuarioVazio(motivo = "", triagem = null) {
  const base = {
    queixa: motivo, historia: "", alergias: "", medicamentos: "",
    vitais: { pa: "", fc: "", temp: "", spo2: "", fr: "", glicemia: "", peso: "", altura: "" },
    exameFisico: "", hipotese: "", cid: "", conduta: "", exames: "", retorno: "Sem retorno",
    registradoEm: null, registradoPor: null,
  };
  if (!triagem) return base;
  const t = triagem;
  return {
    ...base,
    queixa: t.queixa || motivo,
    historia: historiaDaTriagem(t),
    alergias: t.alergias || "",
    medicamentos: t.medicamentos || "",
    vitais: {
      ...base.vitais,
      pa: t.pressao || "", fc: t.frequencia || "", temp: String(t.temperatura || "").replace(".", ","),
      spo2: t.saturacao || "", fr: t.respiracao || "", glicemia: t.glicemia || "",
    },
  };
}

/* Prontuários de exemplo: [historia, alergias, medicamentos, pa, fc, temp, spo2, peso, altura, exameFisico, hipotese, cid, conduta, exames, retorno] */
const pr = (historia, alergias, medicamentos, pa, fc, temp, spo2, peso, altura, exameFisico, hipotese, cid, conduta, exames, retorno) => ({
  historia, alergias, medicamentos, vitais: { pa, fc, temp, spo2, fr: "", glicemia: "", peso, altura },
  exameFisico, hipotese, cid, conduta, exames, retorno,
});

const PRONTUARIOS_DEMO = {
  "Patrícia Gomes": pr("Paciente hipertensa em uso regular da medicação, sem queixas novas.", "Nenhuma conhecida", "Losartana 50 mg, 1x ao dia", "128/82", "74", "36,5", "98", "68", "165", "Bom estado geral. Ausculta cardíaca e pulmonar sem alterações.", "Hipertensão arterial sistêmica controlada", "I10", "Manter medicação. Reforçar dieta com baixo teor de sódio e atividade física.", "", "90 dias"),
  "Fernanda Rocha": pr("Cefaleia frequente há cerca de 1 mês, piora ao fim do dia, sem sinais de alarme.", "Dipirona", "Nenhum", "118/76", "80", "36,6", "99", "61", "162", "Exame neurológico sem alterações. Sem rigidez de nuca.", "Cefaleia tensional", "G44.2", "Orientações de higiene do sono e hidratação. Analgésico se necessário.", "Hemograma completo, glicemia de jejum, TSH", "30 dias"),
  "Mariana Costa": pr("Retorno para avaliação de exames laboratoriais solicitados anteriormente.", "Nenhuma conhecida", "Vitamina D 2.000 UI, 1x ao dia", "122/78", "70", "36,4", "98", "72", "160", "Sem alterações relevantes.", "Exames dentro da normalidade", "Z00.0", "Manter hábitos saudáveis e acompanhamento anual.", "", "6 meses"),
};

function gerarConsultas(hoje) {
  const base = [
    [-2, "09:00", "Patrícia Gomes", 41, "(11) 95512-7743", "Controle de pressão arterial", "Retorno", "Concluída", "Pressão estável. Manter medicação e retorno em 3 meses."],
    [-1, "10:30", "Fernanda Rocha", 36, "(11) 96655-8890", "Dor de cabeça frequente", "Primeira consulta", "Concluída", "Solicitados exames de rotina."],
    [-1, "14:00", "Lucas Martins", 29, "(11) 98877-2109", "Avaliação de rotina", "Primeira consulta", "Faltou", ""],
    [0, "08:00", "Mariana Costa", 52, "(11) 97733-1204", "Resultado de exames", "Retorno", "Concluída", "Exames dentro do esperado."],
    [0, "09:00", "João Pedro Alves", 68, "(11) 94408-6652", "Acompanhamento de diabetes", "Retorno", "Em atendimento", ""],
    [0, "10:30", "Ana Beatriz Lima", 34, "(11) 93321-9087", "Tosse persistente há 2 semanas", "Primeira consulta", "Agendada", ""],
    [0, "14:00", "Carlos Eduardo Sá", 47, "(11) 99120-4581", "Dor lombar", "Primeira consulta", "Agendada", ""],
    [0, "15:30", "Beatriz Nogueira", 25, "(11) 98421-3370", "Atestado e avaliação geral", "Primeira consulta", "Agendada", ""],
    [1, "09:00", "Roberto Nunes", 59, "(11) 91234-5678", "Controle de colesterol", "Retorno", "Agendada", ""],
    [1, "10:30", "Sueli Martins", 82, "(11) 95555-7788", "Acompanhamento de rotina", "Retorno", "Agendada", ""],
    [3, "08:00", "Paulo Santos", 56, "(11) 94444-9900", "Avaliação pós-curativo", "Retorno", "Agendada", ""],
    [3, "14:00", "Marta Lima", 44, "(11) 96666-5566", "Check-up anual", "Primeira consulta", "Agendada", ""],
    [7, "09:00", "Rafael Torres", 38, "(11) 97777-3344", "Febre e mal-estar", "Primeira consulta", "Agendada", ""],
    [8, "10:30", "Cláudia Ribeiro", 63, "(11) 98888-1122", "Renovação de receita", "Retorno", "Cancelada", ""],
    [-30, "08:00", "Mariana Costa", 52, "(11) 97733-1204", "Avaliação inicial e coleta de exames", "Primeira consulta", "Concluída", "Solicitados exames laboratoriais."],
    [-45, "09:00", "João Pedro Alves", 68, "(11) 94408-6652", "Acompanhamento de diabetes", "Retorno", "Concluída", "Glicemia acima da meta. Ajuste de dieta."],
  ];

  return base.map(([dia, horario, paciente, idade, telefone, motivo, tipo, status, notas], i) => {
    const demoTri = TRIAGENS_DEMO[paciente];
    const triagem = dia === 0 && demoTri && ["Agendada", "Em atendimento"].includes(status) ? { ...demoTri, data: hoje } : null;
    const prontuario = prontuarioVazio(motivo, triagem);
    const demo = PRONTUARIOS_DEMO[paciente];

    if (status === "Concluída") {
      Object.assign(prontuario, demo || {}, {
        historia: demo?.historia || "Atendimento realizado conforme motivo da consulta.",
        conduta: demo?.conduta || notas,
        hipotese: demo?.hipotese || "Conforme avaliação clínica",
        registradoEm: `${formatarData(somarDias(hoje, dia))} ${horario}`,
        registradoPor: MEDICO.nome,
      });
    }

    return {
      id: i + 1, paciente, idade, telefone, motivo, tipo, unidadeId: MEDICO.unidadeId,
      data: somarDias(hoje, dia), horario, status, notas, triagem,
      origemId: null, retornoId: null, prontuario,
      historico: ["Consulta agendada", ...(status !== "Agendada" ? [status] : [])],
    };
  });
}

/* Afastamentos do médico (definidos pela administração) */
const gerarAfastamentos = (hoje) => [
  { id: 1, motivo: "Férias", dataInicio: somarDias(hoje, 20), previsaoRetorno: somarDias(hoje, 34) },
];

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
              Ao concluir o atendimento, o retorno será agendado automaticamente para{" "}
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
  const [consultas, setConsultas] = useState(() => gerarConsultas(dataAtualISO()));
  const afastamentos = useMemo(() => gerarAfastamentos(HOJE), [HOJE]);
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
  const anteriores = useMemo(() => {
    if (!detalhe) return [];
    return ordenadas
      .filter((c) =>
        c.id !== detalhe.id && c.paciente === detalhe.paciente && c.status === "Concluída" &&
        c.prontuario.registradoEm && (c.data + c.horario).localeCompare(detalhe.data + detalhe.horario) < 0
      )
      .reverse();
  }, [ordenadas, detalhe]);

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

  const previsaoRetorno =
    detalhe && !detalhe.prontuario.registradoEm ? buscarVagaRetorno(detalhe.prontuario.retorno, detalhe.horario, consultas) : null;
  const retornoAgendado = detalhe?.retornoId ? consultas.find((c) => c.id === detalhe.retornoId && c.status !== "Cancelada") || null : null;

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

  /* ---------- Ações do médico ---------- */

  const atualizar = (id, fn) => setConsultas((atuais) => atuais.map((c) => (c.id === id ? fn(c) : c)));

  function mudarStatus(id, status, mensagem) {
    atualizar(id, (c) => ({ ...c, status, historico: [...c.historico, status] }));
    mostrarAviso(mensagem);
  }

  const atualizarProntuario = (id, campo, valor) =>
    atualizar(id, (c) => ({ ...c, prontuario: { ...c.prontuario, [campo]: valor } }));

  const atualizarVital = (id, campo, valor) =>
    atualizar(id, (c) => ({ ...c, prontuario: { ...c.prontuario, vitais: { ...c.prontuario.vitais, [campo]: valor } } }));

  /* Volta anamnese e sinais vitais ao que o enfermeiro registrou
     (não mexe em exame físico, diagnóstico, conduta, peso e altura) */
  function restaurarDaTriagem(id) {
    atualizar(id, (c) => {
      if (!c.triagem) return c;
      const { queixa, historia, alergias, medicamentos, vitais: v } = prontuarioVazio(c.motivo, c.triagem);
      const { pa, fc, temp, spo2, fr, glicemia } = v;
      return {
        ...c,
        prontuario: {
          ...c.prontuario, queixa, historia, alergias, medicamentos,
          vitais: { ...c.prontuario.vitais, pa, fc, temp, spo2, fr, glicemia },
        },
      };
    });
    mostrarAviso("Dados da triagem restaurados no prontuário.");
  }

  /* Só conclui com os campos obrigatórios; depois, fecha o prontuário */
  function concluirAtendimento(c) {
    const p = c.prontuario;
    const faltando = [
      !p.queixa.trim() && "queixa principal",
      !p.hipotese.trim() && "hipótese diagnóstica",
      !p.conduta.trim() && "conduta",
    ].filter(Boolean);

    if (faltando.length) {
      setAbaModal("prontuario");
      mostrarAviso(`Preencha no prontuário: ${faltando.join(", ")}.`);
      return;
    }

    const carimbo = new Date().toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" });
    const vaga = buscarVagaRetorno(p.retorno, c.horario, consultas);
    const novoId = Math.max(0, ...consultas.map((x) => x.id)) + 1;
    const motivoRetorno = p.exames.trim() ? "Retorno com resultado de exames" : "Retorno";

    setConsultas((atuais) => {
      const atualizadas = atuais.map((x) =>
        x.id !== c.id ? x : {
          ...x,
          status: "Concluída",
          retornoId: vaga ? novoId : null,
          historico: [
            ...x.historico, "Concluída",
            ...(vaga ? [`Retorno agendado para ${formatarData(vaga.data)} às ${vaga.horario}`] : []),
          ],
          prontuario: { ...x.prontuario, registradoEm: carimbo, registradoPor: MEDICO.nome },
        }
      );

      return !vaga ? atualizadas : [
        ...atualizadas,
        {
          id: novoId, paciente: c.paciente, idade: c.idade, telefone: c.telefone,
          motivo: motivoRetorno, tipo: "Retorno", unidadeId: c.unidadeId,
          data: vaga.data, horario: vaga.horario, status: "Agendada", notas: "",
          triagem: null, origemId: c.id, retornoId: null,
          prontuario: prontuarioVazio(motivoRetorno),
          historico: ["Consulta agendada automaticamente pelo retorno do prontuário"],
        },
      ];
    });

    mostrarAviso(
      vaga
        ? `Atendimento concluído. Retorno agendado para ${formatarData(vaga.data)} às ${vaga.horario}.`
        : p.retorno !== "Sem retorno"
          ? "Atendimento concluído, mas não há vaga para o retorno. Marque manualmente."
          : "Atendimento concluído e prontuário registrado."
    );
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
                  {MEDICO.nome} · {MEDICO.especialidade} · {MEDICO.unidade}
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
                    {diasSemana.map((d) => (
                      <span key={d} className={`rounded-full px-3 py-1 text-xs font-semibold ${MEDICO.dias.includes(d) ? "bg-[#023E8A] text-white" : "bg-[#EAF3F7] text-slate-400"}`}>
                        {d}
                      </span>
                    ))}
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
                  <p className="flex items-start gap-2"><Hospital size={16} className="mt-0.5 shrink-0 text-[#3563A7]" />{MEDICO.unidade}</p>
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
              <div className="border-t border-slate-100 pt-4">
                <button type="button" onClick={() => concluirAtendimento(detalhe)} className={`${botaoPrimario} w-full`}>
                  <Check size={16} />Concluir atendimento e fechar prontuário
                </button>
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