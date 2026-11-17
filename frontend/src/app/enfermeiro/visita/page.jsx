"use client";

import { useEffect, useState } from "react";
import { CalendarClock, ShieldCheck } from "lucide-react";

/* =========================
   DADOS DEMONSTRATIVOS
   (trocar por chamadas à API quando o back estiver pronto)
========================= */

const HOJE = "2026-10-27";

// Mesma largura e padding da página de admin. Se o seu header usar outras classes, copie-as para cá.
const CONTAINER = "mx-auto w-full max-w-[1600px] px-6 2xl:px-10";

const ENFERMEIRO = { nome: "Juliana Ribeiro", cargo: "Enfermeira", regiao: "Cerâmica" };

const visitasIniciais = [
  {
    id: 2, paciente: "Roberto Lima", idade: 64, bairro: "Cerâmica", endereco: "Av. Goiás, 850",
    telefone: "(11) 98888-1122", tipo: "Curativo", motivo: "Avaliação de ferida no pé esquerdo",
    data: "2026-10-27", horario: "10:30", prioridade: "Média", status: "Agendada", posAlta: false,
    familiar: "", registro: null, historico: ["Visita agendada"],
  },
  {
    id: 8, paciente: "Cláudia Ramos", idade: 73, bairro: "Cerâmica", endereco: "Rua Santa Rita, 212",
    telefone: "(11) 97777-4545", tipo: "Avaliação clínica", motivo: "Acompanhamento pós-alta de cirurgia de quadril",
    data: "2026-10-27", horario: "14:00", prioridade: "Alta", status: "Agendada", posAlta: true,
    familiar: "Marcos Ramos (filho)", registro: null, historico: ["Alta hospitalar registrada", "Visita agendada"],
  },
  {
    id: 9, paciente: "Ione Alves", idade: 81, bairro: "Olímpico", endereco: "Rua Bahia, 530",
    telefone: "(11) 96666-2020", tipo: "Curativo", motivo: "Troca de curativo de úlcera por pressão",
    data: "2026-10-29", horario: "09:00", prioridade: "Alta", status: "Agendada", posAlta: false,
    familiar: "Tereza Alves (filha)", registro: null, historico: ["Visita agendada"],
  },
  {
    id: 10, paciente: "Antônio Barros", idade: 69, bairro: "Barcelona", endereco: "Rua Espanha, 88",
    telefone: "(11) 95555-3131", tipo: "Avaliação clínica", motivo: "Acompanhamento pós-alta de pneumonia",
    data: "2026-10-30", horario: "11:00", prioridade: "Média", status: "Agendada", posAlta: true,
    familiar: "", registro: null, historico: ["Alta hospitalar registrada", "Visita agendada"],
  },
  {
    id: 6, paciente: "Paulo Santos", idade: 56, bairro: "Barcelona", endereco: "Rua Espanha, 410",
    telefone: "(11) 94444-9900", tipo: "Curativo", motivo: "Retorno após curativo",
    data: "2026-10-26", horario: "11:00", prioridade: "Média", status: "Concluída", posAlta: false,
    familiar: "",
    registro: {
      pa: "130/85", fc: "78", temp: "36.5", spo2: "97", glicemia: "", estado: "Bom",
      obsAvaliacao: "Paciente colaborativo, sem queixas.",
      procs: ["Curativo"], curativoLocal: "Perna direita", curativoAspecto: "Limpo, em cicatrização",
      sinais: [], alerta: false, conduta: "", orientacao: "Manter o curativo seco e retornar em 7 dias.",
      familiarPresente: "", retorno: "2026-11-02",
    },
    historico: ["Visita agendada", "Atendimento iniciado", "Atendimento concluído"],
  },
];

const PROCEDIMENTOS = [
  "Curativo", "Aferição de sinais vitais", "Administração de medicação",
  "Troca de sonda ou dispositivo", "Coleta de material", "Apenas avaliação",
];
const SINAIS = [
  "Febre", "Sinais de infecção na ferida", "Dor intensa", "Falta de ar",
  "Pressão arterial alterada", "Sangramento", "Não adesão ao tratamento",
];
const SEM_SINAIS = "Nenhum sinal de complicação";
const ESTADOS = ["Bom", "Regular", "Debilitado", "Grave"];
const ASPECTOS = ["Limpo, em cicatrização", "Com secreção", "Com sinais de infecção", "Necrose presente"];
const CONDUTAS = [
  "Encaminhar para avaliação médica",
  "Antecipar visita de retorno",
  "Orientado e mantido em acompanhamento",
];

const inputCls =
  "w-full rounded-2xl border border-[#C8D8EC] bg-white px-4 py-3 text-sm text-[#0B1756] outline-none transition placeholder:text-slate-400 hover:border-[#3563A7]/70 focus:border-[#023E8A] focus:ring-4 focus:ring-[#3563A7]/15";

/* =========================
   AUXILIARES E VALIDAÇÃO
========================= */

function formatarData(data) {
  if (!data) return "Data não definida";
  const [a, m, d] = data.split("-");
  return `${d}/${m}/${a}`;
}

function dataExtensa(data) {
  const t = new Date(`${data}T12:00:00`)
    .toLocaleDateString("pt-BR", { weekday: "short", day: "numeric", month: "long" })
    .replace(".", "");
  return t.charAt(0).toUpperCase() + t.slice(1);
}

const num = (v) => Number(String(v).replace(",", "."));

function alertasVitais(f) {
  const a = [];
  if (num(f.temp) >= 37.8) a.push("Temperatura elevada");
  if (f.spo2 !== "" && num(f.spo2) < 92) a.push("Saturação baixa");
  const m = /^(\d{2,3})\/(\d{2,3})$/.exec(f.pa.trim());
  if (m && (Number(m[1]) >= 180 || Number(m[2]) >= 110)) a.push("Pressão muito alta");
  if (f.glicemia !== "" && (num(f.glicemia) < 70 || num(f.glicemia) > 300)) a.push("Glicemia fora do esperado");
  return a;
}

const temComplicacao = (f) => f.sinais.length > 0 && !f.sinais.includes(SEM_SINAIS);

function validar(f) {
  const e = {};
  const m = /^(\d{2,3})\/(\d{2,3})$/.exec(f.pa.trim());
  if (!m || Number(m[1]) < 60 || Number(m[1]) > 260 || Number(m[2]) < 30 || Number(m[2]) > 160 || Number(m[1]) <= Number(m[2]))
    e.pa = "Informe a pressão no formato 120/80.";
  if (!(Number.isInteger(num(f.fc)) && num(f.fc) >= 30 && num(f.fc) <= 220)) e.fc = "Informe uma frequência entre 30 e 220 bpm.";
  if (!(num(f.temp) >= 34 && num(f.temp) <= 42)) e.temp = "Informe uma temperatura entre 34 e 42 °C.";
  if (!(num(f.spo2) >= 70 && num(f.spo2) <= 100)) e.spo2 = "Informe a saturação entre 70 e 100%.";
  if (f.glicemia !== "" && !(num(f.glicemia) >= 20 && num(f.glicemia) <= 600)) e.glicemia = "Informe um valor entre 20 e 600 mg/dL.";
  if (!f.estado) e.estado = "Selecione o estado geral.";
  if (!f.procs.length) e.procs = "Marque ao menos um procedimento (ou “Apenas avaliação”).";
  if (f.procs.includes("Curativo")) {
    if (f.curativoLocal.trim().length < 3) e.curativoLocal = "Informe o local do curativo.";
    if (!f.curativoAspecto) e.curativoAspecto = "Selecione o aspecto da lesão.";
  }
  if (!f.sinais.length) e.sinais = "Marque os sinais observados ou “Nenhum sinal de complicação”.";
  if (temComplicacao(f) && !f.conduta) e.conduta = "Informe a conduta adotada diante da complicação.";
  if (f.orientacao.trim().length < 10) e.orientacao = "Registre as orientações dadas (mínimo 10 letras).";
  if (f.retorno && (f.retorno <= HOJE || [0, 6].includes(new Date(`${f.retorno}T12:00:00`).getDay())))
    e.retorno = "Escolha um dia útil a partir de amanhã.";
  return e;
}

const formVazio = {
  pa: "", fc: "", temp: "", spo2: "", glicemia: "", estado: "", obsAvaliacao: "",
  procs: [], curativoLocal: "", curativoAspecto: "", sinais: [], conduta: "",
  orientacao: "", familiarPresente: "", retorno: "",
};

/* =========================
   COMPONENTES VISUAIS
========================= */

const ESTILO = {
  Agendada: ["#3563A7", "#FFFFFF"],
  "Em atendimento": ["#023E8A", "#FFFFFF"],
  Concluída: ["#023E8A", "#FFFFFF"],
  Alta: ["#0B1756", "#FFFFFF"],
  Média: ["#3563A7", "#FFFFFF"],
  Baixa: ["#EAF3F7", "#000000"],
  Alerta: ["#E11D48", "#FFFFFF"],
};

function Badge({ children, tipo }) {
  const [fundo, texto] = ESTILO[tipo || children] || ["#EAF3F7", "#000000"];
  return (
    <span className="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold" style={{ backgroundColor: fundo, color: texto }}>
      {children}
    </span>
  );
}

function Chip({ children }) {
  return <span className="inline-flex items-center rounded-full bg-[#EAF3F7] px-3 py-1 text-xs font-medium text-[#0B1756]">{children}</span>;
}

function HeroInfo({ icon, title, text }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-white/15 bg-white/10 p-3">
      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">{icon}</span>
      <span>
        <span className="block text-xs font-semibold">{title}</span>
        <span className="mt-0.5 block text-xs font-normal text-blue-100">{text}</span>
      </span>
    </div>
  );
}

function Campo({ label, erro, children, className = "" }) {
  return (
    <div className={className}>
      <label className="mb-1.5 block text-xs font-semibold text-slate-600">{label}</label>
      {children}
      {erro && <p role="alert" className="mt-1.5 text-xs font-medium text-rose-600">{erro}</p>}
    </div>
  );
}

function Modal({ children, onClose }) {
  useEffect(() => {
    const fechar = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", fechar);
    return () => window.removeEventListener("keydown", fechar);
  }, [onClose]);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0B1756]/40 p-4 backdrop-blur-sm" onClick={onClose}>
      <div role="dialog" aria-modal="true" className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
}

function Opcoes({ opcoes, valor, onChange, erro }) {
  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {opcoes.map((o) => {
          const ativo = valor.includes(o);
          return (
            <label key={o} className={`cursor-pointer rounded-full border px-4 py-2 text-xs font-semibold transition ${ativo ? "border-[#023E8A] bg-[#023E8A] text-white" : "border-[#C8D8EC] text-[#0B1756] hover:border-[#3563A7]"}`}>
              <input type="checkbox" className="sr-only" checked={ativo} onChange={() => onChange(o)} />
              {o}
            </label>
          );
        })}
      </div>
      {erro && <p role="alert" className="mt-1.5 text-xs font-medium text-rose-600">{erro}</p>}
    </div>
  );
}

function InfoPaciente({ v }) {
  const mapa = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${v.endereco}, ${v.bairro}`)}`;
  return (
    <div className="space-y-2 rounded-xl bg-slate-50 p-4 text-sm text-slate-600">
      <p><strong>Motivo:</strong> {v.motivo}</p>
      <p><strong>Endereço:</strong> {v.endereco} · {v.bairro}{" "}
        <a href={mapa} target="_blank" rel="noreferrer" className="font-semibold text-[#17418E] hover:underline">Abrir no mapa</a>
      </p>
      <p><strong>Telefone:</strong> <a href={`tel:${v.telefone.replace(/\D/g, "")}`} className="font-semibold text-[#17418E] hover:underline">{v.telefone}</a></p>
      {v.familiar && <p><strong>Familiar de contato:</strong> {v.familiar}</p>}
      {v.posAlta && <p className="font-semibold text-[#023E8A]">Paciente em acompanhamento pós-alta hospitalar.</p>}
    </div>
  );
}

/* =========================
   FORMULÁRIO DE ATENDIMENTO
========================= */

function FormAtendimento({ onConcluir, onCancelar }) {
  const [f, setF] = useState(formVazio);
  const [tocados, setTocados] = useState({});
  const [tentou, setTentou] = useState(false);

  const erros = validar(f);
  const erro = (c) => (tentou || tocados[c] ? erros[c] : undefined);
  const set = (c, v) => setF((a) => ({ ...a, [c]: v }));
  const p = (c) => ({
    value: f[c],
    onChange: (e) => set(c, e.target.value),
    onBlur: () => setTocados((t) => ({ ...t, [c]: true })),
    className: `${inputCls} ${erro(c) ? "!border-rose-400" : ""}`,
    "data-campo": c,
  });

  const alertas = alertasVitais(f);
  const complicacao = temComplicacao(f);

  function alternarProc(o) {
    setF((a) => {
      let procs = a.procs.includes(o) ? a.procs.filter((x) => x !== o) : [...a.procs, o];
      if (o === "Apenas avaliação" && procs.includes(o)) procs = [o];
      else procs = procs.filter((x) => !(x === "Apenas avaliação" && o !== x));
      return { ...a, procs };
    });
  }

  function alternarSinal(o) {
    setF((a) => {
      if (o === SEM_SINAIS) return { ...a, sinais: a.sinais.includes(o) ? [] : [o], conduta: "" };
      const base = a.sinais.filter((x) => x !== SEM_SINAIS);
      return { ...a, sinais: base.includes(o) ? base.filter((x) => x !== o) : [...base, o] };
    });
  }

  function enviar(e) {
    e.preventDefault();
    setTentou(true);
    const chaves = Object.keys(erros);
    if (chaves.length) {
      document.querySelector(`[data-campo="${chaves[0]}"]`)?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    onConcluir({ ...f, temp: String(f.temp).replace(",", "."), alerta: complicacao, conduta: complicacao ? f.conduta : "" });
  }

  const Secao = ({ titulo, desc, children }) => (
    <fieldset className="rounded-2xl border border-[#E1EAF4] p-4 sm:p-5">
      <legend className="px-2 text-sm font-bold text-[#0B1756]">{titulo}</legend>
      {desc && <p className="-mt-1 mb-3 text-xs text-slate-500">{desc}</p>}
      {children}
    </fieldset>
  );

  return (
    <form onSubmit={enviar} noValidate className="space-y-5">
      <Secao titulo="1. Avaliação das condições de saúde" desc="Registre os sinais vitais aferidos na visita.">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
          <Campo label="PA (mmHg)" erro={erro("pa")}><input placeholder="120/80" inputMode="numeric" {...p("pa")} /></Campo>
          <Campo label="FC (bpm)" erro={erro("fc")}><input placeholder="78" inputMode="numeric" {...p("fc")} /></Campo>
          <Campo label="Temp. (°C)" erro={erro("temp")}><input placeholder="36,5" inputMode="decimal" {...p("temp")} /></Campo>
          <Campo label="SpO₂ (%)" erro={erro("spo2")}><input placeholder="97" inputMode="numeric" {...p("spo2")} /></Campo>
          <Campo label="Glicemia (opcional)" erro={erro("glicemia")}><input placeholder="mg/dL" inputMode="numeric" {...p("glicemia")} /></Campo>
        </div>
        {alertas.length > 0 && (
          <p className="mt-3 rounded-xl bg-rose-50 px-4 py-2.5 text-xs font-medium text-rose-700">
            Atenção: {alertas.join(", ").toLowerCase()}. Considere marcar o sinal de complicação correspondente.
          </p>
        )}
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Campo label="Estado geral" erro={erro("estado")}>
            <select {...p("estado")}>
              <option value="">Selecione</option>
              {ESTADOS.map((s) => <option key={s}>{s}</option>)}
            </select>
          </Campo>
          <Campo label="Observações (opcional)">
            <input placeholder="Queixas, humor, mobilidade..." {...p("obsAvaliacao")} />
          </Campo>
        </div>
      </Secao>

      <Secao titulo="2. Procedimentos realizados">
        <div data-campo="procs"><Opcoes opcoes={PROCEDIMENTOS} valor={f.procs} onChange={alternarProc} erro={erro("procs")} /></div>
        {f.procs.includes("Curativo") && (
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Campo label="Local do curativo" erro={erro("curativoLocal")}><input placeholder="Ex.: tornozelo esquerdo" {...p("curativoLocal")} /></Campo>
            <Campo label="Aspecto da lesão" erro={erro("curativoAspecto")}>
              <select {...p("curativoAspecto")}>
                <option value="">Selecione</option>
                {ASPECTOS.map((s) => <option key={s}>{s}</option>)}
              </select>
            </Campo>
          </div>
        )}
      </Secao>

      <Secao titulo="3. Acompanhamento do tratamento" desc="Há sinais de possíveis complicações?">
        <div data-campo="sinais"><Opcoes opcoes={[...SINAIS, SEM_SINAIS]} valor={f.sinais} onChange={alternarSinal} erro={erro("sinais")} /></div>
        {complicacao && (
          <Campo label="Conduta adotada" erro={erro("conduta")} className="mt-4">
            <select {...p("conduta")}>
              <option value="">Selecione</option>
              {CONDUTAS.map((s) => <option key={s}>{s}</option>)}
            </select>
          </Campo>
        )}
      </Secao>

      <Secao titulo="4. Orientações aos familiares">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Campo label="Familiar ou cuidador presente (opcional)"><input placeholder="Nome e relação" {...p("familiarPresente")} /></Campo>
          <Campo label="Próximo retorno (opcional)" erro={erro("retorno")}><input type="date" min="2026-10-28" {...p("retorno")} /></Campo>
          <Campo label="Orientações dadas" erro={erro("orientacao")} className="sm:col-span-2">
            <textarea rows={3} placeholder="Cuidados específicos explicados ao paciente e à família" {...p("orientacao")} />
          </Campo>
        </div>
      </Secao>

      <div className="flex flex-col-reverse gap-2 border-t border-slate-100 pt-4 sm:flex-row sm:justify-end">
        <button type="button" onClick={onCancelar} className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50">Fechar sem concluir</button>
        <button type="submit" className="rounded-xl bg-[#023E8A] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#0B1756]">Concluir atendimento</button>
      </div>
    </form>
  );
}

function RegistroLeitura({ r }) {
  const linhas = [
    ["Sinais vitais", `PA ${r.pa} · FC ${r.fc} bpm · Temp ${r.temp} °C · SpO₂ ${r.spo2}%${r.glicemia ? ` · Glicemia ${r.glicemia}` : ""}`],
    ["Estado geral", r.estado + (r.obsAvaliacao ? ` — ${r.obsAvaliacao}` : "")],
    ["Procedimentos", r.procs.join(", ")],
    ...(r.procs.includes("Curativo") ? [["Curativo", `${r.curativoLocal} · ${r.curativoAspecto}`]] : []),
    ["Complicações", r.sinais.join(", ")],
    ...(r.alerta ? [["Conduta", r.conduta]] : []),
    ["Orientações", r.orientacao],
    ...(r.familiarPresente ? [["Familiar presente", r.familiarPresente]] : []),
    ...(r.retorno ? [["Próximo retorno", formatarData(r.retorno)]] : []),
  ];
  return (
    <dl className="space-y-3 text-sm">
      {linhas.map(([k, v]) => (
        <div key={k} className="rounded-xl bg-[#F4F8FC] px-4 py-3">
          <dt className="text-xs font-semibold text-slate-500">{k}</dt>
          <dd className="mt-0.5 text-[#0B1756]">{v}</dd>
        </div>
      ))}
    </dl>
  );
}

/* =========================
   PÁGINA PRINCIPAL
========================= */

export default function EnfermeiroVisitasPage() {
  const [visitas, setVisitas] = useState(visitasIniciais);
  const [aba, setAba] = useState("hoje");
  const [foco, setFoco] = useState("todas");
  const [modalId, setModalId] = useState(null);
  const [aviso, setAviso] = useState(null);

  const visitaModal = visitas.find((v) => v.id === modalId) || null;
  const abertas = visitas.filter((v) => v.status !== "Concluída");

  const resumo = [
    ["Visitas hoje", visitas.filter((v) => v.data === HOJE && v.status !== "Concluída").length],
    ["Pós-alta", abertas.filter((v) => v.posAlta).length],
    ["Curativos", abertas.filter((v) => v.tipo === "Curativo").length],
    ["Com alerta", visitas.filter((v) => v.registro?.alerta).length],
  ];

  const lista = visitas
    .filter((v) =>
      aba === "hoje" ? v.data === HOJE && v.status !== "Concluída"
      : aba === "proximas" ? v.data > HOJE && v.status !== "Concluída"
      : v.status === "Concluída"
    )
    .filter((v) =>
      foco === "todas" ? true
      : foco === "posalta" ? v.posAlta
      : foco === "curativo" ? v.tipo === "Curativo"
      : v.registro?.alerta
    )
    .sort((a, b) => `${a.data} ${a.horario}`.localeCompare(`${b.data} ${b.horario}`));

  function mostrarAviso(t) {
    setAviso(t);
    setTimeout(() => setAviso(null), 3500);
  }

  function iniciar(v) {
    if (v.status === "Agendada") {
      setVisitas((a) => a.map((x) => (x.id === v.id ? { ...x, status: "Em atendimento", historico: [...x.historico, "Atendimento iniciado"] } : x)));
    }
    setModalId(v.id);
  }

  function concluir(registro) {
    setVisitas((a) =>
      a.map((x) =>
        x.id === modalId
          ? { ...x, status: "Concluída", registro, historico: [...x.historico, registro.alerta ? "Atendimento concluído com alerta de complicação" : "Atendimento concluído"] }
          : x
      )
    );
    setModalId(null);
    setAba("concluidas");
    mostrarAviso(registro.alerta ? "Atendimento concluído. Alerta de complicação registrado." : "Atendimento concluído.");
  }

  const rotuloBotao = (v) =>
    v.status === "Concluída" ? "Ver registro"
    : v.status === "Em atendimento" ? "Continuar registro"
    : v.data === HOJE ? "Iniciar atendimento" : "Ver detalhes";

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#EEF5F9] font-sans text-[#0B1756]">
      {/* Fundo com ilustrações de círculos */}
      <div className="pointer-events-none absolute -right-28 -top-36 h-[430px] w-[430px] rounded-full bg-[#B8D6FC]/50" />
      <div className="pointer-events-none absolute -left-40 top-10 h-[330px] w-[330px] rounded-full border-2 border-[#C8DEFF]/60" />
      <div className="pointer-events-none absolute -bottom-36 -left-24 h-[350px] w-[350px] rounded-full bg-white/50" />
      <div className="pointer-events-none absolute -bottom-40 -right-24 h-[430px] w-[430px] rounded-full border-[70px] border-[#C5DFFF]/50" />

      <main className={`relative z-10 py-8 ${CONTAINER}`}>
        {/* TOPO (header padrão, igual às outras páginas) */}
        <header className="relative mb-6 overflow-hidden rounded-[30px] bg-gradient-to-br from-[#3563A7] via-[#023E8A] to-[#0B1756] px-6 py-8 text-white shadow-[0_20px_55px_rgba(2,62,138,0.16)] sm:px-9 lg:px-10">
          <div className="pointer-events-none absolute -right-16 -top-32 h-80 w-80 rounded-full bg-white/10" />
          <div className="pointer-events-none absolute left-[42%] top-10 h-56 w-56 rounded-full border-[36px] border-white/[0.05]" />
          <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <h1 className="text-4xl font-bold leading-tight lg:text-[42px]">Minhas visitas</h1>
              <p className="mt-3 max-w-2xl text-base font-normal leading-6 text-blue-100">
                {ENFERMEIRO.cargo} {ENFERMEIRO.nome} · Região {ENFERMEIRO.regiao}. Avalie, registre e acompanhe seus pacientes em casa.
              </p>
            </div>
            <div className="grid w-full max-w-[420px] grid-cols-2 gap-3">
              <HeroInfo icon={<ShieldCheck size={18} />} title="Área profissional" text="Visitas e atendimentos" />
              <HeroInfo icon={<CalendarClock size={18} />} title="Agenda da região" text={`Região ${ENFERMEIRO.regiao}`} />
            </div>
          </div>
        </header>

        {/* RESUMO */}
        <section className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {resumo.map(([t, n]) => (
            <div key={t} className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
              <p className="text-3xl font-extrabold text-[#0B1756]">{n}</p>
              <p className="mt-1 text-sm font-medium text-slate-500">{t}</p>
            </div>
          ))}
        </section>

        {/* LISTA */}
        <section className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm sm:p-6">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-2xl font-bold text-[#0B1756]">Atendimentos</h2>
            <div className="flex rounded-xl bg-slate-100 p-1">
              {[["hoje", "Hoje"], ["proximas", "Próximas"], ["concluidas", "Concluídas"]].map(([v, r]) => (
                <button key={v} type="button" onClick={() => setAba(v)} className={`rounded-lg px-4 py-2 text-xs font-semibold transition ${aba === v ? "bg-white text-[#17418E] shadow-sm" : "text-slate-500 hover:text-[#17418E]"}`}>{r}</button>
              ))}
            </div>
          </div>

          <div className="mb-5 flex flex-wrap gap-2">
            {[["todas", "Todos"], ["posalta", "Pós-alta"], ["curativo", "Curativos"], ["alerta", "Com alerta"]].map(([v, r]) => (
              <button key={v} type="button" onClick={() => setFoco(v)} className={`rounded-full border px-4 py-1.5 text-xs font-semibold transition ${foco === v ? "border-[#023E8A] bg-[#023E8A] text-white" : "border-[#C8D8EC] text-[#0B1756] hover:border-[#3563A7]"}`}>{r}</button>
            ))}
          </div>

          {lista.length ? (
            <ul className="space-y-3">
              {lista.map((v) => (
                <li key={v.id} className="group flex flex-col gap-4 rounded-2xl border border-[#E1EAF4] bg-[#FAFCFE] p-4 transition hover:border-[#3563A7]/50 hover:bg-white hover:shadow-md sm:flex-row sm:items-center">
                  <div className="min-w-0 flex-1">
                    <p className="flex items-center gap-2 text-sm font-semibold text-[#3563A7]">
                      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M16 3v4M8 3v4M3 10h18" /></svg>
                      {dataExtensa(v.data)}<span className="text-slate-300">•</span>{v.horario}
                    </p>
                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      <p className="text-lg font-bold text-[#0B1756]">{v.paciente}<span className="font-normal text-slate-500"> · {v.idade} anos</span></p>
                      <Badge>{v.status}</Badge>
                      <Badge tipo={v.prioridade}>{`Prioridade ${v.prioridade.toLowerCase()}`}</Badge>
                      {v.registro?.alerta && <Badge tipo="Alerta">Alerta de complicação</Badge>}
                    </div>
                    <p className="mt-1 text-sm text-slate-600">{v.motivo}</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <Chip>{v.tipo}</Chip>
                      {v.posAlta && <Chip>Pós-alta</Chip>}
                      <Chip>{v.endereco} · {v.bairro}</Chip>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => (v.status !== "Concluída" && v.data === HOJE ? iniciar(v) : setModalId(v.id))}
                    className={`shrink-0 rounded-xl px-5 py-2.5 text-sm font-semibold transition ${v.status !== "Concluída" && v.data === HOJE ? "bg-[#023E8A] text-white hover:bg-[#0B1756]" : "border border-[#C8D8EC] bg-white text-[#17418E] hover:bg-[#EAF3F7]"}`}
                  >
                    {rotuloBotao(v)}
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <div className="rounded-xl border border-dashed border-slate-200 px-4 py-10 text-center text-sm font-medium text-slate-600">
              Nenhum atendimento encontrado nesta visualização.
            </div>
          )}
        </section>
      </main>

      {/* MODAL */}
      {visitaModal && (
        <Modal onClose={() => setModalId(null)}>
          <div className="mb-5 flex items-start justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-lg font-bold text-[#0B1756]">{visitaModal.paciente} · {visitaModal.idade} anos</h3>
              <p className="mt-1 text-sm text-slate-500">{visitaModal.tipo} · {formatarData(visitaModal.data)} às {visitaModal.horario}</p>
            </div>
            <button type="button" onClick={() => setModalId(null)} aria-label="Fechar" className="rounded-lg p-2 text-xl font-semibold text-slate-500 hover:bg-[#EAF3F7]">×</button>
          </div>

          <div className="space-y-5">
            <InfoPaciente v={visitaModal} />

            {visitaModal.status === "Em atendimento" && (
              <FormAtendimento onConcluir={concluir} onCancelar={() => setModalId(null)} />
            )}

            {visitaModal.status === "Concluída" && visitaModal.registro && (
              <>
                {visitaModal.registro.alerta && <Badge tipo="Alerta">Alerta de complicação</Badge>}
                <RegistroLeitura r={visitaModal.registro} />
              </>
            )}

            {visitaModal.status === "Agendada" && (
              <p className="rounded-xl bg-[#EAF3F7] px-4 py-3 text-sm text-[#0B1756]">
                O atendimento só pode ser iniciado no dia da visita ({formatarData(visitaModal.data)}).
              </p>
            )}

            <div>
              <p className="mb-3 text-xs font-semibold text-slate-500">Histórico</p>
              <ol className="space-y-2 border-l-2 border-[#DCE8F8] pl-4 text-sm text-slate-600">
                {visitaModal.historico.map((h, i) => <li key={i}>{h}</li>)}
              </ol>
            </div>
          </div>
        </Modal>
      )}

      {aviso && (
        <div role="status" className="fixed bottom-5 left-1/2 z-[60] -translate-x-1/2 rounded-xl bg-[#17418E] px-5 py-3 text-sm font-semibold text-white shadow-lg">{aviso}</div>
      )}
    </div>
  );
}