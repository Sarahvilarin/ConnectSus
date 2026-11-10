"use client";
 
import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  CalendarDays,
  CalendarOff,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock,
  FileText,
  Hospital,
  Lock,
  Phone,
  Play,
  Search,
  UserX,
  X,
} from "lucide-react";
 
/*
  PORTAL DO MÉDICO – Minhas consultas
 
  PADRÃO VISUAL (igual ao das páginas administrativas)
  Fonte: font-sans
  Títulos principais: 36–42px bold | Títulos de seção/card: 24px bold
  Títulos menores: 18–20px bold    | Nomes e destaques: 16px semibold
  Descrições: 14–16px regular      | Tabelas: 14px
  Labels: 12px semibold            | Auxiliares: 12px
 
  Cores: #3563A7 azul principal | #023E8A azul escuro | #0B1756 azul-marinho
         #EAF3F7 fundo suave    | #FFFFFF cards       | #EEF5F9 fundo geral
 
  PRONTUÁRIO
  Cada consulta possui um prontuário (campo `prontuario`), acessado pela aba
  "Prontuário" dentro da consulta. Ele só pode ser editado enquanto a consulta
  está "Em atendimento". Ao concluir, o prontuário é fechado (somente leitura)
  e registra data/hora e o médico responsável.
 
  Em produção, MEDICO, as consultas e os prontuários vêm do login e da API.
  O prontuário é dado sensível de saúde (LGPD): exigir autenticação, controle
  de acesso por perfil e log de acessos/alterações no back-end.
*/
 
/* =========================
   DADOS DEMONSTRATIVOS
========================= */
 
const MEDICO = {
  id: 1,
  nome: "Dra. Helena Duarte",
  especialidade: "Clínica geral",
  unidadeId: 3,
  dias: ["Seg", "Ter", "Qui"],
};
 
const UNIDADES = [
  { id: 1, nome: "Hospital Municipal de Emergências Albert Sabin" },
  { id: 2, nome: "Hospital Municipal Maria Braido" },
  { id: 3, nome: "Atende Fácil Saúde Pedro Kassab" },
];
 
const statusLista = ["Agendada", "Em atendimento", "Concluída", "Faltou", "Cancelada"];
 
const opcoesRetorno = ["Sem retorno", "15 dias", "30 dias", "60 dias", "90 dias", "6 meses"];
 
/* Datas relativas a hoje, para a demonstração ficar sempre atual */
function somarDias(iso, n) {
  const d = new Date(`${iso}T12:00:00`);
  d.setDate(d.getDate() + n);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate()
  ).padStart(2, "0")}`;
}
 
function dataAtualISO() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate()
  ).padStart(2, "0")}`;
}
 
/* Modelo de prontuário em branco (a queixa principal já vem do motivo agendado) */
function prontuarioVazio(motivo = "") {
  return {
    queixa: motivo,
    historia: "",
    alergias: "",
    medicamentos: "",
    vitais: { pa: "", fc: "", temp: "", spo2: "", peso: "", altura: "" },
    exameFisico: "",
    hipotese: "",
    cid: "",
    conduta: "",
    exames: "",
    retorno: "Sem retorno",
    registradoEm: null,
    registradoPor: null,
  };
}
 
/* Prontuários de exemplo para consultas já concluídas */
const PRONTUARIOS_DEMO = {
  "Patrícia Gomes": {
    historia: "Paciente hipertensa em uso regular da medicação, sem queixas novas.",
    alergias: "Nenhuma conhecida",
    medicamentos: "Losartana 50 mg, 1x ao dia",
    vitais: { pa: "128/82", fc: "74", temp: "36,5", spo2: "98", peso: "68", altura: "165" },
    exameFisico: "Bom estado geral. Ausculta cardíaca e pulmonar sem alterações.",
    hipotese: "Hipertensão arterial sistêmica controlada",
    cid: "I10",
    conduta: "Manter medicação. Reforçar dieta com baixo teor de sódio e atividade física.",
    exames: "",
    retorno: "90 dias",
  },
  "Fernanda Rocha": {
    historia: "Cefaleia frequente há cerca de 1 mês, piora ao fim do dia, sem sinais de alarme.",
    alergias: "Dipirona",
    medicamentos: "Nenhum",
    vitais: { pa: "118/76", fc: "80", temp: "36,6", spo2: "99", peso: "61", altura: "162" },
    exameFisico: "Exame neurológico sem alterações. Sem rigidez de nuca.",
    hipotese: "Cefaleia tensional",
    cid: "G44.2",
    conduta: "Orientações de higiene do sono e hidratação. Analgésico se necessário.",
    exames: "Hemograma completo, glicemia de jejum, TSH",
    retorno: "30 dias",
  },
  "Mariana Costa": {
    historia: "Retorno para avaliação de exames laboratoriais solicitados anteriormente.",
    alergias: "Nenhuma conhecida",
    medicamentos: "Vitamina D 2.000 UI, 1x ao dia",
    vitais: { pa: "122/78", fc: "70", temp: "36,4", spo2: "98", peso: "72", altura: "160" },
    exameFisico: "Sem alterações relevantes.",
    hipotese: "Exames dentro da normalidade",
    cid: "Z00.0",
    conduta: "Manter hábitos saudáveis e acompanhamento anual.",
    exames: "",
    retorno: "6 meses",
  },
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
    /* Atendimento antigo de uma paciente que volta hoje (aparece em "Atendimentos anteriores") */
    [-30, "08:00", "Mariana Costa", 52, "(11) 97733-1204", "Avaliação inicial e coleta de exames", "Primeira consulta", "Concluída", "Solicitados exames laboratoriais."],
    /* Atendimento antigo de um paciente em atendimento hoje */
    [-45, "09:00", "João Pedro Alves", 68, "(11) 94408-6652", "Acompanhamento de diabetes", "Retorno", "Concluída", "Glicemia acima da meta. Ajuste de dieta."],
  ];
 
  return base.map(([dia, horario, paciente, idade, telefone, motivo, tipo, status, notas], i) => {
    const prontuario = prontuarioVazio(motivo);
    const demo = PRONTUARIOS_DEMO[paciente];
 
    if (status === "Concluída") {
      Object.assign(prontuario, demo || {}, {
        historia: demo?.historia || "Atendimento realizado conforme motivo da consulta.",
        conduta: demo?.conduta || notas,
        hipotese: demo?.hipotese || "Conforme avaliação clínica",
        registradoEm: `${somarDias(hoje, dia).split("-").reverse().join("/")} ${horario}`,
        registradoPor: MEDICO.nome,
      });
    }
 
    return {
      id: i + 1,
      paciente,
      idade,
      telefone,
      motivo,
      tipo,
      unidadeId: MEDICO.unidadeId,
      data: somarDias(hoje, dia),
      horario,
      status,
      notas,
      prontuario,
      historico: ["Consulta agendada", ...(status !== "Agendada" ? [status] : [])],
    };
  });
}
 
/* Afastamentos do médico (definidos pela administração) */
function gerarAfastamentos(hoje) {
  return [
    {
      id: 1,
      motivo: "Férias",
      dataInicio: somarDias(hoje, 20),
      previsaoRetorno: somarDias(hoje, 34),
    },
  ];
}
 
const POR_PAGINA = 8;
 
const inputCls =
  "w-full rounded-2xl border border-[#C8D8EC] bg-white px-4 py-3 text-sm text-[#0B1756] outline-none transition placeholder:text-slate-400 hover:border-[#3563A7]/70 focus:border-[#023E8A] focus:ring-4 focus:ring-[#3563A7]/15 disabled:cursor-not-allowed disabled:border-slate-200 disabled:bg-slate-50 disabled:text-slate-600 disabled:hover:border-slate-200";
 
/* =========================
   FUNÇÕES AUXILIARES
========================= */
 
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
 
function paraIso(ano, mes, dia) {
  return `${ano}-${String(mes + 1).padStart(2, "0")}-${String(dia).padStart(2, "0")}`;
}
 
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
 
/* IMC calculado a partir de peso (kg) e altura (cm) */
function calcularImc(peso, altura) {
  const p = parseFloat(String(peso).replace(",", "."));
  const a = parseFloat(String(altura).replace(",", ".")) / 100;
  if (!p || !a || a < 0.5 || a > 2.5) return null;
  return (p / (a * a)).toFixed(1).replace(".", ",");
}
 
const nomesMeses = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
];
const nomesSemana = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
 
/* =========================
   COMPONENTES VISUAIS
========================= */
 
function Badge({ children, tipo = "neutro" }) {
  const estilos = {
    neutro: { fundo: "#EAF3F7", texto: "#000000" },
    azul: { fundo: "#3563A7", texto: "#FFFFFF" },
    amarelo: { fundo: "#3563A7", texto: "#FFFFFF" },
    verde: { fundo: "#023E8A", texto: "#FFFFFF" },
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
 
const corStatus = (s) =>
  s === "Agendada" ? "azul" : s === "Em atendimento" ? "amarelo" : s === "Concluída" ? "verde" : s === "Faltou" ? "vermelho" : "neutro";
 
function Campo({ label, children, className = "" }) {
  return (
    <div className={className}>
      <label className="mb-1.5 block text-xs font-semibold text-slate-600">{label}</label>
      {children}
    </div>
  );
}
 
/* Menu suspenso com posição fixa: nunca é cortado por janelas com rolagem
   e abre para cima quando falta espaço embaixo. */
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
  const [pos, setPos] = useState({ top: 0, left: 0, width: 0 });
  const ref = useRef(null);
 
  const lista = opcoes.map((o) => (typeof o === "string" ? { valor: o, texto: o } : o));
  const atual = lista.find((o) => o.valor === valor);
  const minLista = Number(larguraLista.match(/\[(\d+)px\]/)?.[1] || 170);
 
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
      const altLista = Math.min(240, lista.length * 44 + 12);
      const larg = Math.max(r.width, minLista);
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
        className={`flex w-full items-center justify-between gap-3 rounded-2xl border bg-white px-4 py-3 text-left text-sm text-[#0B1756] outline-none transition focus:border-[#023E8A] focus:ring-4 focus:ring-[#3563A7]/15 ${
          desabilitado
            ? "cursor-not-allowed border-slate-200 bg-slate-50 text-slate-600"
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
            data-popup
            role="listbox"
            aria-label={rotulo}
            style={{ top: pos.top, left: pos.left, width: pos.width }}
            className="fixed z-20 max-h-60 overflow-y-auto rounded-2xl border border-[#D5E2F1] bg-white p-1.5 shadow-[0_12px_30px_rgba(11,23,86,0.16)]"
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
 
/* Calendário personalizado. `valor` e `onChange` usam AAAA-MM-DD. */
function DatePicker({ rotulo, valor, onChange, placeholder = "Selecione a data", limpavel = false }) {
  const [aberto, setAberto] = useState(false);
  const [visao, setVisao] = useState({ ano: 2026, mes: 0 });
  const [pos, setPos] = useState({ top: 0, left: 0 });
  const ref = useRef(null);
 
  const hoje = new Date();
  const hojeIso = paraIso(hoje.getFullYear(), hoje.getMonth(), hoje.getDate());
 
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
        const ALT = 380;
        const LARG = 300;
        let top = r.bottom + 8;
 
        if (top + ALT > window.innerHeight - 12) {
          const acima = r.top - ALT - 8;
          top = acima >= 12 ? acima : Math.max(12, window.innerHeight - ALT - 12);
        }
 
        setPos({ top, left: Math.max(12, Math.min(r.left, window.innerWidth - LARG - 12)) });
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
        className={`flex w-full items-center justify-between gap-3 rounded-2xl border bg-white px-4 py-3 text-left text-sm text-[#0B1756] transition focus:outline-none focus:ring-4 focus:ring-[#3563A7]/15 ${
          aberto
            ? "border-[#0B1756] ring-4 ring-[#3563A7]/15"
            : "border-[#C8D8EC] hover:border-[#3563A7]"
        }`}
      >
        <span className={`min-w-0 truncate ${valor ? "" : "text-slate-400"}`}>
          {valor ? formatarData(valor) : placeholder}
        </span>
        <CalendarDays size={16} className="shrink-0" />
      </button>
 
      {aberto && (
        <>
          <button
            type="button"
            aria-label="Fechar calendário"
            onClick={() => setAberto(false)}
            className="fixed inset-0 z-10 cursor-default"
          />
 
          <div
            data-popup
            role="dialog"
            aria-label={rotulo}
            style={{ top: pos.top, left: pos.left }}
            className="fixed z-20 w-[300px] max-w-[calc(100vw-1.5rem)] rounded-2xl border border-[#0B1756]/20 bg-white p-4 shadow-[0_16px_40px_rgba(11,23,86,0.28)]"
          >
            <div className="mb-3 flex items-center justify-between gap-2 rounded-xl bg-[#0B1756] px-3 py-2.5">
              <p className="text-sm font-bold text-white">
                {nomesMeses[visao.mes]} {visao.ano}
              </p>
              <div className="flex gap-1">
                <button
                  type="button"
                  aria-label="Mês anterior"
                  onClick={() => mudarMes(-1)}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  type="button"
                  aria-label="Próximo mês"
                  onClick={() => mudarMes(1)}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
 
            <div className="mb-1 grid grid-cols-7 text-center">
              {nomesSemana.map((d) => (
                <span key={d} className="py-1 text-xs font-semibold text-[#0B1756]">
                  {d}
                </span>
              ))}
            </div>
 
            <div className="grid grid-cols-7 gap-1">
              {celulas.map((dia, i) => {
                if (!dia) return <span key={`vazio-${i}`} className="h-8" />;
 
                const iso = paraIso(visao.ano, visao.mes, dia);
                const ativo = iso === valor;
                const ehHoje = iso === hojeIso;
 
                return (
                  <button
                    key={iso}
                    type="button"
                    aria-pressed={ativo}
                    onClick={() => escolher(iso)}
                    className={`h-8 rounded-lg text-xs font-medium transition ${
                      ativo
                        ? "bg-[#0B1756] text-white shadow-md ring-2 ring-[#0B1756]/20"
                        : ehHoje
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
                <button
                  type="button"
                  onClick={() => escolher("")}
                  className="rounded-lg px-2 py-1 text-[#0B1756] hover:bg-[#EAF3F7]"
                >
                  Limpar
                </button>
              ) : (
                <span />
              )}
              <button
                type="button"
                onClick={() => escolher(hojeIso)}
                className="rounded-lg bg-[#0B1756] px-3 py-2 text-white hover:bg-[#023E8A]"
              >
                Hoje
              </button>
            </div>
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
  const base =
    "border-[#D5E0ED] bg-white text-[#3563A7] hover:bg-[#EAF3F7] disabled:cursor-not-allowed disabled:opacity-40";
 
  return (
    <nav
      aria-label="Paginação"
      className="mt-2 flex flex-col items-center justify-between gap-3 sm:flex-row"
    >
      <p className="text-sm text-slate-600">
        Mostrando <strong className="font-semibold text-[#0B1756]">{inicio}</strong> a{" "}
        <strong className="font-semibold text-[#0B1756]">{fim}</strong> de{" "}
        <strong className="font-semibold text-[#0B1756]">{totalItens}</strong> consultas
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
  const badge = <Badge tipo={corStatus(c.status)}>{c.status}</Badge>;
  const temProntuario = Boolean(c.prontuario?.registradoEm);
 
  return (
    <div className="flex items-center gap-3 py-3">
      <span className="min-w-[56px] shrink-0 rounded-lg bg-[#EAF3F7] px-2 py-1.5 text-center text-xs font-bold leading-tight text-[#0B1756]">
        {mostrarData && (
          <span className="block font-semibold text-[#3563A7]">{formatarData(c.data).slice(0, 5)}</span>
        )}
        {c.horario}
      </span>
 
      <span className="min-w-0 flex-1">
        <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <span className="truncate text-base font-semibold text-[#0B1756]">{c.paciente}</span>
          <span className="text-xs text-slate-400">{c.idade} anos</span>
          {compacto && badge}
          {temProntuario && (
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#3563A7]">
              <FileText size={13} />
              Prontuário
            </span>
          )}
        </span>
        <span className="mt-0.5 block truncate text-sm text-slate-500">
          {c.motivo} · {c.tipo}
        </span>
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
 
/* ---------- Prontuário ---------- */
 
function TituloBloco({ children }) {
  return (
    <p className="mb-3 text-xs font-bold uppercase tracking-wide text-[#3563A7]">{children}</p>
  );
}
 
function Prontuario({ consulta, editavel, onCampo, onVital, anteriores }) {
  const p = consulta.prontuario;
  const imc = calcularImc(p.vitais.peso, p.vitais.altura);
  const fechado = Boolean(p.registradoEm);
 
  const areaTexto = (campo, label, placeholder, linhas = 3) => (
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
 
  const vital = (campo, label, unidade, placeholder) => (
    <Campo label={label}>
      <div className="relative">
        <input
          type="text"
          inputMode="decimal"
          disabled={!editavel}
          value={p.vitais[campo]}
          onChange={(e) => onVital(campo, e.target.value)}
          placeholder={editavel ? placeholder : "—"}
          className={`${inputCls} pr-12`}
        />
        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">
          {unidade}
        </span>
      </div>
    </Campo>
  );
 
  return (
    <div className="space-y-6">
      {/* Situação do prontuário */}
      {fechado ? (
        <div className="flex items-start gap-3 rounded-xl border border-[#023E8A]/20 bg-[#EAF3F7] p-4 text-sm text-[#0B1756]">
          <Lock size={18} className="mt-0.5 shrink-0 text-[#023E8A]" />
          <p>
            <strong>Prontuário fechado.</strong> Registrado por {p.registradoPor} em {p.registradoEm}.
            Não é possível editar após a conclusão do atendimento.
          </p>
        </div>
      ) : consulta.status === "Em atendimento" ? (
        <div className="rounded-xl border border-[#3563A7]/30 bg-[#EAF3F7] p-4 text-sm text-[#0B1756]">
          Preencha o prontuário durante o atendimento. Queixa principal, hipótese diagnóstica e
          conduta são obrigatórias para concluir.
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-600">
          {consulta.status === "Agendada"
            ? "O prontuário fica disponível para preenchimento quando o atendimento for iniciado."
            : "Esta consulta não possui prontuário preenchido."}
        </div>
      )}
 
      {/* Atendimentos anteriores do mesmo paciente */}
      {anteriores.length > 0 && (
        <div>
          <TituloBloco>Atendimentos anteriores deste paciente</TituloBloco>
          <div className="divide-y divide-slate-100 rounded-xl border border-slate-100">
            {anteriores.map((a) => (
              <div key={a.id} className="space-y-1 px-4 py-3 text-sm">
                <p className="font-semibold text-[#0B1756]">
                  {formatarData(a.data)} · {a.tipo}
                </p>
                <p className="text-slate-600">
                  <span className="font-semibold">Diagnóstico:</span>{" "}
                  {a.prontuario.hipotese || "Não informado"}
                  {a.prontuario.cid ? ` (${a.prontuario.cid})` : ""}
                </p>
                {a.prontuario.conduta && (
                  <p className="text-slate-600">
                    <span className="font-semibold">Conduta:</span> {a.prontuario.conduta}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
 
      {/* Anamnese */}
      <div className="space-y-4">
        <TituloBloco>Anamnese</TituloBloco>
        {areaTexto("queixa", "Queixa principal *", "Motivo que levou o paciente à consulta...", 2)}
        {areaTexto(
          "historia",
          "História da doença atual",
          "Início, duração, evolução, fatores de piora e melhora...",
          3
        )}
        <div className="grid gap-4 sm:grid-cols-2">
          {areaTexto("alergias", "Alergias", "Ex.: dipirona, penicilina ou nenhuma conhecida", 2)}
          {areaTexto(
            "medicamentos",
            "Medicamentos em uso",
            "Nome, dose e frequência...",
            2
          )}
        </div>
      </div>
 
      {/* Sinais vitais */}
      <div>
        <TituloBloco>Sinais vitais</TituloBloco>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {vital("pa", "Pressão arterial", "mmHg", "120/80")}
          {vital("fc", "Freq. cardíaca", "bpm", "72")}
          {vital("temp", "Temperatura", "°C", "36,5")}
          {vital("spo2", "Saturação", "%", "98")}
          {vital("peso", "Peso", "kg", "70")}
          {vital("altura", "Altura", "cm", "170")}
        </div>
        {imc && (
          <p className="mt-3 text-sm text-slate-600">
            <span className="font-semibold text-[#0B1756]">IMC:</span> {imc} kg/m²
          </p>
        )}
      </div>
 
      {/* Exame físico e diagnóstico */}
      <div className="space-y-4">
        <TituloBloco>Exame físico e diagnóstico</TituloBloco>
        {areaTexto("exameFisico", "Exame físico", "Achados do exame físico...", 3)}
        <div className="grid gap-4 sm:grid-cols-[1fr_140px]">
          <Campo label="Hipótese diagnóstica *">
            <input
              type="text"
              disabled={!editavel}
              value={p.hipotese}
              onChange={(e) => onCampo("hipotese", e.target.value)}
              placeholder={editavel ? "Diagnóstico ou suspeita clínica" : "Não informado"}
              className={inputCls}
            />
          </Campo>
          <Campo label="CID-10">
            <input
              type="text"
              disabled={!editavel}
              value={p.cid}
              onChange={(e) => onCampo("cid", e.target.value.toUpperCase())}
              placeholder={editavel ? "Ex.: J06.9" : "—"}
              maxLength={8}
              className={inputCls}
            />
          </Campo>
        </div>
      </div>
 
      {/* Conduta */}
      <div className="space-y-4">
        <TituloBloco>Conduta</TituloBloco>
        {areaTexto(
          "conduta",
          "Conduta, prescrição e orientações *",
          "Tratamento, medicações prescritas e orientações ao paciente...",
          4
        )}
        {areaTexto("exames", "Exames solicitados", "Ex.: hemograma, raio-X de tórax...", 2)}
        <Campo label="Retorno">
          <Dropdown
            rotulo="Retorno"
            valor={p.retorno}
            opcoes={opcoesRetorno}
            onChange={(v) => onCampo("retorno", v)}
            desabilitado={!editavel}
          />
        </Campo>
      </div>
    </div>
  );
}
 
const minutos = (h) => {
  const [hh, mm] = h.split(":").map(Number);
  return hh * 60 + mm;
};
 
const diasSemana = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
 
/* =========================
   PÁGINA PRINCIPAL
========================= */
 
export default function MinhasConsultas() {
  const [HOJE] = useState(dataAtualISO);
  const [aba, setAba] = useState("hoje");
  const [consultas, setConsultas] = useState(() => gerarConsultas(dataAtualISO()));
  const afastamentos = useMemo(() => gerarAfastamentos(HOJE), [HOJE]);
 
  const [agora] = useState(() => {
    const d = new Date();
    return d.getHours() * 60 + d.getMinutes();
  });
 
  const [mesCal, setMesCal] = useState(() => new Date(`${dataAtualISO()}T12:00:00`));
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
  const concluidasHoje = hoje.filter((c) => c.status === "Concluída");
  const limite7 = somarDias(HOJE, 7);
  const proximos7 = ordenadas.filter(
    (c) => c.data > HOJE && c.data <= limite7 && c.status === "Agendada"
  );
 
  const proxima =
    hoje.find((c) => c.status === "Em atendimento") ||
    restantes.find((c) => minutos(c.horario) >= agora) ||
    restantes[0] ||
    null;
 
  const detalhe = consultas.find((c) => c.id === consultaId) || null;
  const nomeUnidade = UNIDADES.find((u) => u.id === MEDICO.unidadeId)?.nome || "";
 
  /* Prontuários fechados de consultas anteriores do mesmo paciente (mais recentes primeiro) */
  const anteriores = useMemo(() => {
    if (!detalhe) return [];
    return ordenadas
      .filter(
        (c) =>
          c.id !== detalhe.id &&
          c.paciente === detalhe.paciente &&
          c.status === "Concluída" &&
          c.prontuario.registradoEm &&
          (c.data + c.horario).localeCompare(detalhe.data + detalhe.horario) < 0
      )
      .reverse();
  }, [ordenadas, detalhe]);
 
  const situacaoAfast = (a) =>
    HOJE < a.dataInicio ? "Agendado" : HOJE > a.previsaoRetorno ? "Concluído" : "Em andamento";
 
  /* ---------- Agenda ---------- */
 
  const diasCalendario = useMemo(() => {
    const ano = mesCal.getFullYear();
    const mes = mesCal.getMonth();
    const desloc = (new Date(ano, mes, 1).getDay() + 6) % 7;
    const qtdDias = new Date(ano, mes + 1, 0).getDate();
    const itens = [];
 
    for (let i = 0; i < desloc; i++) itens.push({ chave: `vazio-${i}`, vazio: true });
 
    for (let dia = 1; dia <= qtdDias; dia++) {
      const data = paraIso(ano, mes, dia);
      itens.push({
        chave: data,
        data,
        dia,
        qtd: consultas.filter((c) => c.data === data && c.status !== "Cancelada").length,
        afastado: afastamentos.some((a) => a.dataInicio <= data && a.previsaoRetorno >= data),
      });
    }
    return itens;
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
    // Hoje e próximas primeiro; histórico depois, da mais recente para a mais antiga
    const futuras = filtradas.filter((c) => c.data >= HOJE);
    const passadas = filtradas.filter((c) => c.data < HOJE).reverse();
    return [...futuras, ...passadas];
  }, [ordenadas, busca, filtroStatus, filtroData, HOJE]);
 
  const totalPaginas = Math.max(1, Math.ceil(lista.length / POR_PAGINA));
  const paginaAtual = Math.min(pagina, totalPaginas);
  const visiveis = lista.slice((paginaAtual - 1) * POR_PAGINA, paginaAtual * POR_PAGINA);
 
  useEffect(() => {
    setPagina(1);
  }, [busca, filtroStatus, filtroData]);
 
  useEffect(() => {
    document.body.style.overflow = detalhe ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
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
 
  function mudarStatus(id, status, mensagem) {
    setConsultas((atuais) =>
      atuais.map((c) =>
        c.id === id ? { ...c, status, historico: [...c.historico, status] } : c
      )
    );
    mostrarAviso(mensagem);
  }
 
  function atualizarNotas(id, notas) {
    setConsultas((atuais) => atuais.map((c) => (c.id === id ? { ...c, notas } : c)));
  }
 
  function atualizarProntuario(id, campo, valor) {
    setConsultas((atuais) =>
      atuais.map((c) =>
        c.id === id ? { ...c, prontuario: { ...c.prontuario, [campo]: valor } } : c
      )
    );
  }
 
  function atualizarVital(id, campo, valor) {
    setConsultas((atuais) =>
      atuais.map((c) =>
        c.id === id
          ? {
              ...c,
              prontuario: {
                ...c.prontuario,
                vitais: { ...c.prontuario.vitais, [campo]: valor },
              },
            }
          : c
      )
    );
  }
 
  /* Só conclui se o prontuário tiver os campos obrigatórios; depois, fecha o prontuário */
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
 
    const carimbo = new Date().toLocaleString("pt-BR", {
      dateStyle: "short",
      timeStyle: "short",
    });
 
    setConsultas((atuais) =>
      atuais.map((x) =>
        x.id === c.id
          ? {
              ...x,
              status: "Concluída",
              historico: [...x.historico, "Concluída"],
              prontuario: { ...x.prontuario, registradoEm: carimbo, registradoPor: MEDICO.nome },
            }
          : x
      )
    );
    mostrarAviso("Atendimento concluído e prontuário registrado.");
  }
 
  const abrir = (id) => {
    setAbaModal("consulta");
    setConsultaId(id);
  };
 
  const abas = [
    { id: "hoje", titulo: "Hoje", sub: "Atendimentos do dia" },
    { id: "agenda", titulo: "Agenda", sub: "Calendário de consultas" },
    { id: "consultas", titulo: "Todas as consultas", sub: "Busca e histórico" },
  ];
 
  const botaoPrimario =
    "inline-flex items-center justify-center gap-2 rounded-xl bg-[#023E8A] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#0B1756] focus:outline-none focus:ring-4 focus:ring-[#3563A7]/30 disabled:cursor-not-allowed disabled:opacity-40";
  const botaoSecundario =
    "inline-flex items-center justify-center gap-2 rounded-xl border border-[#0B1756]/30 bg-white px-5 py-3 text-sm font-semibold text-[#0B1756] transition hover:bg-[#EAF3F7] focus:outline-none focus:ring-4 focus:ring-[#3563A7]/15 disabled:cursor-not-allowed disabled:opacity-40";
 
  const dataExtenso = new Date(`${HOJE}T12:00:00`).toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
 
  const abasModal = [
    { id: "consulta", titulo: "Consulta" },
    { id: "prontuario", titulo: "Prontuário" },
  ];
 
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
                  Minhas consultas
                </h1>
                <p className="mt-3 max-w-3xl text-sm leading-7 text-white/85 sm:text-base lg:text-lg">
                  Acompanhe seus atendimentos, registre o prontuário de cada consulta e
                  consulte sua agenda.
                </p>
                <p className="mt-3 flex flex-wrap items-center gap-2 text-sm text-white/80">
                  <Hospital size={16} className="shrink-0" />
                  {MEDICO.nome} · {MEDICO.especialidade} · {nomeUnidade}
                </p>
              </div>
 
              <div className="flex shrink-0 flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => setAba("agenda")}
                  className="rounded-2xl bg-white px-5 py-3.5 text-sm font-semibold text-[#0B1756] shadow-sm transition hover:bg-[#EAF3F7]"
                >
                  Ver agenda do mês
                </button>
              </div>
            </div>
          </div>
 
          <nav
            className="relative z-20 -mt-[72px] grid grid-cols-1 gap-3 px-4 sm:grid-cols-3 sm:px-6"
            aria-label="Seções das consultas"
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
 
        {/* HOJE */}
 
        {aba === "hoje" && (
          <div className="space-y-6">
            <div>
              <h2 className="text-4xl font-bold tracking-tight text-[#0B1756]">Consultas de hoje</h2>
              <p className="mt-1 text-base capitalize text-slate-500">{dataExtenso}</p>
            </div>
 
            <section className="overflow-hidden rounded-2xl border border-[#1D4C91] bg-gradient-to-r from-[#023E8A] via-[#3563A7] to-[#0B1756] p-5 text-white shadow-lg sm:p-6">
              <div className="grid grid-cols-2 gap-y-5 lg:grid-cols-4 lg:gap-y-0">
                {[
                  { titulo: "Consultas hoje", valor: hoje.length },
                  { titulo: "Ainda por atender", valor: restantes.length },
                  { titulo: "Concluídas hoje", valor: concluidasHoje.length },
                  { titulo: "Próximos 7 dias", valor: proximos7.length },
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
                    {hoje.map((c) => (
                      <LinhaConsulta key={c.id} c={c} onAbrir={abrir} />
                    ))}
                  </div>
                ) : (
                  <div className="rounded-xl border border-dashed border-slate-200 px-4 py-10 text-center">
                    <p className="text-sm font-medium text-slate-600">Nenhuma consulta para hoje</p>
                    <p className="mt-1 text-xs text-slate-400">Confira os próximos dias na agenda.</p>
                  </div>
                )}
              </CardSecao>
              </div>
 
              <div className="space-y-5">
                <CardSecao titulo="Próxima consulta">
                  {proxima ? (
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <span className="rounded-lg bg-[#EAF3F7] px-3 py-2 text-sm font-bold text-[#0B1756]">
                          {proxima.horario}
                        </span>
                        <div className="min-w-0">
                          <p className="text-lg font-bold text-[#0B1756]">{proxima.paciente}</p>
                          <p className="mt-1 text-sm text-slate-500">{proxima.motivo}</p>
                          <div className="mt-2 flex flex-wrap gap-2">
                            <Badge tipo={corStatus(proxima.status)}>{proxima.status}</Badge>
                            <Badge>{proxima.tipo}</Badge>
                          </div>
                        </div>
                      </div>
 
                      <div className="flex flex-col gap-2 sm:flex-row">
                        {proxima.status === "Agendada" && (
                          <button
                            type="button"
                            onClick={() =>
                              mudarStatus(proxima.id, "Em atendimento", "Atendimento iniciado.")
                            }
                            className={botaoPrimario}
                          >
                            <Play size={16} />
                            Iniciar atendimento
                          </button>
                        )}
                        <button type="button" onClick={() => abrir(proxima.id)} className={botaoSecundario}>
                          {proxima.status === "Em atendimento" ? "Abrir prontuário" : "Abrir consulta"}
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
                      <span
                        key={d}
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          MEDICO.dias.includes(d)
                            ? "bg-[#023E8A] text-white"
                            : "bg-[#EAF3F7] text-slate-400"
                        }`}
                      >
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
                            <p className="mt-1 text-sm text-slate-500">
                              {formatarData(a.dataInicio)} a {formatarData(a.previsaoRetorno)}
                            </p>
                          </div>
                          <Badge tipo={situacaoAfast(a) === "Em andamento" ? "vermelho" : "azul"}>
                            {situacaoAfast(a)}
                          </Badge>
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
            <CardSecao
              titulo="Calendário de consultas"
              subtitulo="Selecione um dia para ver as consultas programadas."
            >
              <div className="mb-5 flex items-center justify-between gap-3">
                <button
                  type="button"
                  aria-label="Mês anterior"
                  onClick={() => setMesCal((d) => new Date(d.getFullYear(), d.getMonth() - 1, 1))}
                  className="rounded-xl border border-[#0B1756]/25 p-2 text-[#0B1756] transition hover:bg-[#0B1756]/10"
                >
                  <ChevronLeft size={18} />
                </button>
 
                <h3 className="text-base font-bold capitalize text-[#0B1756]">
                  {mesCal.toLocaleDateString("pt-BR", { month: "long", year: "numeric" })}
                </h3>
 
                <button
                  type="button"
                  aria-label="Próximo mês"
                  onClick={() => setMesCal((d) => new Date(d.getFullYear(), d.getMonth() + 1, 1))}
                  className="rounded-xl border border-[#0B1756]/25 p-2 text-[#0B1756] transition hover:bg-[#0B1756]/10"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
 
              <div className="grid grid-cols-7 gap-1.5">
                {["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"].map((d) => (
                  <div key={d} className="py-2 text-center text-xs font-semibold text-[#0B1756]">
                    {d}
                  </div>
                ))}
 
                {diasCalendario.map((d) =>
                  d.vazio ? (
                    <div key={d.chave} />
                  ) : (
                    <button
                      key={d.chave}
                      type="button"
                      onClick={() => setDiaSel(d.data)}
                      className={`flex min-h-[66px] flex-col items-center rounded-xl border p-2 transition sm:min-h-[78px] ${
                        diaSel === d.data
                          ? "border-[#0B1756] bg-[#0B1756] text-white shadow-sm ring-1 ring-[#0B1756]/20"
                          : d.data === HOJE
                            ? "border-2 border-[#0B1756] bg-[#EAF3F7] hover:bg-[#0B1756]/5"
                            : d.afastado
                              ? "border-slate-200 bg-slate-50 hover:border-[#0B1756]"
                              : "border-slate-200 bg-white hover:border-[#0B1756] hover:bg-[#0B1756]/5"
                      }`}
                    >
                      <span
                        className={`text-sm ${
                          diaSel === d.data ? "font-bold text-white" : "text-slate-700"
                        }`}
                      >
                        {d.dia}
                      </span>
 
                      {d.qtd > 0 && (
                        <span
                          className={`mt-1 rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                            diaSel === d.data ? "bg-white text-[#0B1756]" : "bg-[#0B1756] text-white"
                          }`}
                        >
                          {d.qtd}
                        </span>
                      )}
 
                      {d.afastado && (
                        <span
                          className={`mt-1 hidden text-[9px] sm:block ${
                            diaSel === d.data ? "text-white/80" : "text-slate-400"
                          }`}
                        >
                          afastado
                        </span>
                      )}
                    </button>
                  )
                )}
              </div>
 
              <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-slate-500">
                <span className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#0B1756]" />
                  Quantidade de consultas no dia
                </span>
                <span>Dias de afastamento aparecem em cinza.</span>
              </div>
            </CardSecao>
 
            <CardSecao
              titulo="Consultas do dia"
              subtitulo={formatarData(diaSel)}
              acao={<Badge tipo="azul">{consultasDoDia.length} consulta(s)</Badge>}
            >
              {consultasDoDia.length ? (
                <div className="divide-y divide-slate-100">
                  {consultasDoDia.map((c) => (
                    <LinhaConsulta key={c.id} c={c} compacto onAbrir={abrir} />
                  ))}
                </div>
              ) : (
                <div className="rounded-xl border border-dashed border-slate-200 px-4 py-10 text-center">
                  <p className="text-sm font-medium text-slate-600">Nenhuma consulta nesta data</p>
                  <p className="mt-1 text-xs text-slate-400">Selecione outro dia no calendário.</p>
                </div>
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
                  <Search
                    size={18}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#0B1756]"
                  />
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
                  opcoes={[
                    { valor: "Todas", texto: "Todas as situações" },
                    ...statusLista.map((s) => ({ valor: s, texto: s })),
                  ]}
                  onChange={setFiltroStatus}
                />
 
                <DatePicker
                  rotulo="Filtrar por data"
                  valor={filtroData}
                  onChange={setFiltroData}
                  placeholder="Filtrar por data"
                  limpavel
                />
              </div>
 
              {(busca || filtroStatus !== "Todas" || filtroData) && (
                <button
                  type="button"
                  onClick={() => {
                    setBusca("");
                    setFiltroStatus("Todas");
                    setFiltroData("");
                  }}
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
                <div className="rounded-2xl border border-slate-100 bg-white px-5 shadow-sm">
                  <div className="divide-y divide-slate-100">
                    {visiveis.map((c) => (
                      <LinhaConsulta key={c.id} c={c} mostrarData onAbrir={abrir} />
                    ))}
                  </div>
                </div>
 
                <Paginacao
                  pagina={paginaAtual}
                  totalPaginas={totalPaginas}
                  totalItens={lista.length}
                  onChange={mudarPagina}
                />
              </div>
            )}
          </section>
        )}
      </main>
 
      {/* MODAL: DETALHES DA CONSULTA + PRONTUÁRIO */}
 
      {detalhe && (
        <Portal>
          <div
            className="fixed inset-0 z-[1000] flex items-center justify-center bg-[#0B1756]/40 p-4 backdrop-blur-sm"
            onClick={() => setConsultaId(null)}
          >
            <div
              role="dialog"
              aria-modal="true"
              aria-labelledby="titulo-consulta"
              onClick={(e) => e.stopPropagation()}
              className="max-h-[90vh] w-full max-w-3xl space-y-5 overflow-y-auto rounded-2xl bg-white p-6 shadow-xl"
            >
              <div className="flex items-start justify-between border-b border-slate-100 pb-4">
                <div>
                  <h3 id="titulo-consulta" className="text-2xl font-bold text-[#0B1756]">
                    {detalhe.paciente}
                  </h3>
                  <p className="mt-1 text-sm text-slate-500">
                    {detalhe.idade} anos · {detalhe.tipo} · {formatarData(detalhe.data)} às{" "}
                    {detalhe.horario}
                  </p>
                </div>
 
                <div className="flex items-center gap-2">
                  <Badge tipo={corStatus(detalhe.status)}>{detalhe.status}</Badge>
                  <button
                    type="button"
                    aria-label="Fechar"
                    onClick={() => setConsultaId(null)}
                    className="rounded-lg p-2 text-slate-500 transition hover:bg-[#EAF3F7] hover:text-[#0B1756]"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>
 
              {/* Abas do modal */}
              <div role="tablist" aria-label="Seções da consulta" className="flex gap-2">
                {abasModal.map((a) => (
                  <button
                    key={a.id}
                    type="button"
                    role="tab"
                    aria-selected={abaModal === a.id}
                    onClick={() => setAbaModal(a.id)}
                    className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
                      abaModal === a.id
                        ? "bg-[#0B1756] text-white"
                        : "bg-[#EAF3F7] text-[#0B1756] hover:bg-[#DCE8F8]"
                    }`}
                  >
                    {a.id === "prontuario" && <FileText size={16} />}
                    {a.titulo}
                  </button>
                ))}
              </div>
 
              {abaModal === "consulta" && (
                <>
                  <div className="space-y-2 rounded-xl bg-slate-50 p-4 text-sm text-slate-600">
                    <p className="flex items-center gap-2">
                      <CalendarDays size={16} className="shrink-0 text-[#3563A7]" />
                      {formatarData(detalhe.data)}
                      <Clock size={16} className="ml-2 shrink-0 text-[#3563A7]" />
                      {detalhe.horario}
                    </p>
                    <p className="flex items-start gap-2">
                      <Hospital size={16} className="mt-0.5 shrink-0 text-[#3563A7]" />
                      {nomeUnidade}
                    </p>
                    <p className="flex items-center gap-2">
                      <Phone size={16} className="shrink-0 text-[#3563A7]" />
                      {detalhe.telefone || "Não informado"}
                    </p>
                    <p>
                      <strong>Motivo:</strong> {detalhe.motivo}
                    </p>
                  </div>
 
                  <Campo label="Anotações rápidas">
                    <textarea
                      rows={3}
                      value={detalhe.notas}
                      onChange={(e) => atualizarNotas(detalhe.id, e.target.value)}
                      placeholder="Lembretes e observações (o registro clínico oficial fica no prontuário)..."
                      className={inputCls}
                    />
                  </Campo>
 
                  <div className="border-t border-slate-100 pt-4">
                    <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Histórico
                    </p>
                    <ol className="space-y-2 border-l-2 border-[#DCE8F8] pl-4 text-xs text-slate-500">
                      {detalhe.historico.map((h, i) => (
                        <li key={i}>{h}</li>
                      ))}
                    </ol>
                  </div>
                </>
              )}
 
              {abaModal === "prontuario" && (
                <Prontuario
                  consulta={detalhe}
                  editavel={detalhe.status === "Em atendimento"}
                  onCampo={(campo, valor) => atualizarProntuario(detalhe.id, campo, valor)}
                  onVital={(campo, valor) => atualizarVital(detalhe.id, campo, valor)}
                  anteriores={anteriores}
                />
              )}
 
              {/* Ações (sempre visíveis, em qualquer aba) */}
 
              {detalhe.status === "Agendada" && (
                <div className="space-y-2 border-t border-slate-100 pt-4">
                  <div className="flex flex-col gap-2 sm:flex-row">
                    <button
                      type="button"
                      disabled={detalhe.data > HOJE}
                      onClick={() => {
                        mudarStatus(detalhe.id, "Em atendimento", "Atendimento iniciado.");
                        setAbaModal("prontuario");
                      }}
                      className={`${botaoPrimario} flex-1`}
                    >
                      <Play size={16} />
                      Iniciar atendimento
                    </button>
                    <button
                      type="button"
                      disabled={detalhe.data > HOJE}
                      onClick={() => mudarStatus(detalhe.id, "Faltou", "Falta registrada.")}
                      className={`${botaoSecundario} flex-1`}
                    >
                      <UserX size={16} />
                      Registrar falta
                    </button>
                  </div>
                  {detalhe.data > HOJE && (
                    <p className="text-xs text-slate-500">
                      As ações ficam disponíveis a partir do dia da consulta.
                    </p>
                  )}
                </div>
              )}
 
              {detalhe.status === "Em atendimento" && (
                <div className="border-t border-slate-100 pt-4">
                  <button
                    type="button"
                    onClick={() => concluirAtendimento(detalhe)}
                    className={`${botaoPrimario} w-full`}
                  >
                    <Check size={16} />
                    Concluir atendimento e fechar prontuário
                  </button>
                </div>
              )}
            </div>
          </div>
        </Portal>
      )}
 
      {/* AVISOS */}
 
      {aviso && (
        <div
          role="status"
          className="fixed bottom-5 left-1/2 z-[1100] -translate-x-1/2 rounded-xl bg-[#17418E] px-5 py-3 text-sm font-semibold text-white shadow-lg"
        >
          {aviso}
        </div>
      )}
    </div>
  );
}
 