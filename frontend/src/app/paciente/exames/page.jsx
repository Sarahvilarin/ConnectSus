"use client";

import { useMemo, useState } from "react";
import {
  AlertCircle,
  ArrowLeftRight,
  CalendarClock,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronRight,
  Clock3,
  FileCheck2,
  FileText,
  FlaskConical,
  HeartPulse,
  Info,
  MapPin,
  Search,
  ShieldCheck,
  Stethoscope,
  X,
  ClipboardList,
  CircleHelp,
  Building2,
  BellRing,
} from "lucide-react";

const EXAMES_INICIAIS = [
  {
    id: "EXM-2026-0148",
    nome: "Hemograma completo",
    categoria: "Laboratorial",
    descricao: "Avaliação geral das células sanguíneas.",
    data: "03/11/2026",
    diaSemana: "Terça-feira",
    horario: "08:30",
    unidade: "UBS Amélia Richard Locatelli",
    endereco: "Rua Cavalheiro Ernesto Giuliano, São Caetano do Sul - SP",
    status: "Aguardando confirmação",
    preparo: "Confira o pedido médico para saber se há necessidade de jejum. Leve documento oficial com foto e o pedido do exame.",
    solicitante: "Dra. Camila Ferreira",
    solicitadoEm: "21/10/2026",
    podeReagendar: true,
    resultado: null,
    observacao: "Chegue com 15 minutos de antecedência.",
  },
  {
    id: "EXM-2026-0152",
    nome: "Glicemia em jejum",
    categoria: "Laboratorial",
    descricao: "Medição dos níveis de glicose no sangue.",
    data: "05/11/2026",
    diaSemana: "Quinta-feira",
    horario: "09:15",
    unidade: "Hospital Municipal Maria Braido",
    endereco: "Rua Luís Louzã, São Caetano do Sul - SP",
    status: "Confirmado",
    preparo: "Siga o tempo de jejum indicado no pedido médico ou pela unidade. Não altere medicamentos sem orientação profissional.",
    solicitante: "Dr. Rafael Mendes",
    solicitadoEm: "22/10/2026",
    podeReagendar: true,
    resultado: null,
    observacao: "Confirme as orientações de jejum com a unidade se tiver dúvidas.",
  },
  {
    id: "EXM-2026-0160",
    nome: "Ultrassom abdominal",
    categoria: "Imagem",
    descricao: "Avaliação por imagem dos órgãos abdominais.",
    data: "09/11/2026",
    diaSemana: "Segunda-feira",
    horario: "10:40",
    unidade: "Centro de Especialidades Médicas",
    endereco: "Avenida Vital Brasil Filho, São Caetano do Sul - SP",
    status: "Confirmado",
    preparo: "O preparo varia conforme o exame. Siga exatamente as orientações fornecidas pela unidade e consulte-a em caso de dúvida.",
    solicitante: "Dr. Rafael Mendes",
    solicitadoEm: "23/10/2026",
    podeReagendar: true,
    resultado: null,
    observacao: "Leve exames de imagem anteriores, caso tenha.",
  },
  {
    id: "EXM-2026-0171",
    nome: "Raio-X de tórax",
    categoria: "Imagem",
    descricao: "Exame de imagem para avaliação da região torácica.",
    data: "12/11/2026",
    diaSemana: "Quinta-feira",
    horario: "11:20",
    unidade: "Hospital Municipal Maria Braido",
    endereco: "Rua Luís Louzã, São Caetano do Sul - SP",
    status: "Aguardando confirmação",
    preparo: "Siga as orientações que constam no pedido. Informe à equipe se houver possibilidade de gravidez.",
    solicitante: "Dra. Camila Ferreira",
    solicitadoEm: "24/10/2026",
    podeReagendar: true,
    resultado: null,
    observacao: "Use roupas confortáveis e evite acessórios metálicos na região do tórax.",
  },
  {
    id: "EXM-2026-0103",
    nome: "Eletrocardiograma (ECG)",
    categoria: "Cardiologia",
    descricao: "Registro da atividade elétrica do coração.",
    data: "22/10/2026",
    diaSemana: "Quinta-feira",
    horario: "14:00",
    unidade: "Hospital Municipal de Emergências Albert Sabin",
    endereco: "Rua Aurélia, São Caetano do Sul - SP",
    status: "Realizado",
    preparo: "Use roupas confortáveis e leve exames anteriores, caso tenha.",
    solicitante: "Dra. Camila Ferreira",
    solicitadoEm: "14/10/2026",
    podeReagendar: false,
    resultado: "Consulte a área de resultados ou entre em contato com a unidade para verificar a disponibilidade do laudo.",
    observacao: "Exame registrado como realizado.",
  },
  {
    id: "EXM-2026-0091",
    nome: "Raio-X de tórax",
    categoria: "Imagem",
    descricao: "Exame de imagem para avaliação da região torácica.",
    data: "19/10/2026",
    diaSemana: "Segunda-feira",
    horario: "11:20",
    unidade: "Hospital Municipal Maria Braido",
    endereco: "Rua Luís Louzã, São Caetano do Sul - SP",
    status: "Cancelado",
    preparo: "Este agendamento foi cancelado. Entre em contato com a unidade para verificar como solicitar uma nova data.",
    solicitante: "Dra. Camila Ferreira",
    solicitadoEm: "09/10/2026",
    podeReagendar: false,
    resultado: null,
    observacao: "Agendamento cancelado.",
  },
];

const DATAS_DISPONIVEIS = [
  { data: "04/11/2026", dia: "Qua", numero: "04", mes: "Nov" },
  { data: "06/11/2026", dia: "Sex", numero: "06", mes: "Nov" },
  { data: "09/11/2026", dia: "Seg", numero: "09", mes: "Nov" },
  { data: "10/11/2026", dia: "Ter", numero: "10", mes: "Nov" },
];
const HORARIOS_DISPONIVEIS = ["08:00", "08:45", "09:30", "10:15", "13:30", "14:15", "15:00"];
const STATUS_PROXIMOS = ["Aguardando confirmação", "Confirmado", "Reagendamento solicitado"];

function BadgeStatus({ status }) {
  const estilos = {
    "Aguardando confirmação": "border-amber-200 bg-amber-50 text-amber-800",
    Confirmado: "border-emerald-200 bg-emerald-50 text-emerald-700",
    Realizado: "border-blue-200 bg-blue-50 text-[#023E8A]",
    Cancelado: "border-slate-200 bg-slate-100 text-slate-600",
    "Reagendamento solicitado": "border-violet-200 bg-violet-50 text-violet-700",
  };
  const Icone = status === "Confirmado" || status === "Realizado" ? CheckCircle2 : status === "Cancelado" ? X : Clock3;
  return <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold ${estilos[status] || estilos["Aguardando confirmação"]}`}><Icone size={14} />{status}</span>;
}

function Modal({ titulo, descricao, children, onClose, largura = "max-w-xl" }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-[2px]" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <section className={`max-h-[90vh] w-full ${largura} overflow-y-auto rounded-2xl border border-slate-100 bg-white shadow-2xl`} role="dialog" aria-modal="true" aria-label={titulo}>
        <div className="flex items-start justify-between gap-4 border-b border-slate-100 px-6 py-5 sm:px-7">
          <div><h2 className="text-xl font-bold text-[#0B1756]">{titulo}</h2>{descricao && <p className="mt-1.5 text-sm leading-6 text-slate-500">{descricao}</p>}</div>
          <button type="button" onClick={onClose} aria-label="Fechar" className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-[#023E8A]"><X size={20} /></button>
        </div>
        <div className="px-6 py-5 sm:px-7">{children}</div>
      </section>
    </div>
  );
}

function StatCard({ icon: Icone, label, valor, descricao, tone = "blue" }) {
  const tones = {
    blue: "border-blue-100 bg-blue-50/70 text-[#023E8A]",
    amber: "border-amber-100 bg-amber-50/70 text-amber-700",
    green: "border-emerald-100 bg-emerald-50/70 text-emerald-700",
    slate: "border-slate-200 bg-slate-50 text-slate-600",
  };
  return <div className="rounded-2xl border border-[#DCE8F5] bg-white p-4 shadow-sm sm:p-5"><div className="flex items-start justify-between gap-3"><div><p className="text-sm font-medium text-slate-500">{label}</p><p className="mt-2 text-3xl font-extrabold tracking-tight text-[#0B1756]">{valor}</p></div><span className={`flex h-11 w-11 items-center justify-center rounded-xl border ${tones[tone]}`}><Icone size={22} /></span></div><p className="mt-2 text-xs leading-5 text-slate-500">{descricao}</p></div>;
}

export default function MeusExamesPage() {
  const [exames, setExames] = useState(EXAMES_INICIAIS);
  const [secao, setSecao] = useState("proximos");
  const [filtroStatus, setFiltroStatus] = useState("Todos");
  const [filtroCategoria, setFiltroCategoria] = useState("Todas as categorias");
  const [busca, setBusca] = useState("");
  const [detalhe, setDetalhe] = useState(null);
  const [exameParaReagendar, setExameParaReagendar] = useState(null);
  const [dataEscolhida, setDataEscolhida] = useState(DATAS_DISPONIVEIS[0].data);
  const [horarioEscolhido, setHorarioEscolhido] = useState("09:30");
  const [exameParaCancelar, setExameParaCancelar] = useState(null);
  const [aviso, setAviso] = useState("");

  const contagens = useMemo(() => ({
    proximos: exames.filter((e) => STATUS_PROXIMOS.includes(e.status)).length,
    aguardando: exames.filter((e) => e.status === "Aguardando confirmação").length,
    confirmados: exames.filter((e) => e.status === "Confirmado").length,
    realizados: exames.filter((e) => e.status === "Realizado").length,
    cancelados: exames.filter((e) => e.status === "Cancelado").length,
    reagendamento: exames.filter((e) => e.status === "Reagendamento solicitado").length,
  }), [exames]);

  const proximoExame = useMemo(() => exames
    .filter((exame) => STATUS_PROXIMOS.includes(exame.status))
    .sort((a, b) => {
      const da = a.data.split("/").reverse().join("");
      const db = b.data.split("/").reverse().join("");
      return da.localeCompare(db) || a.horario.localeCompare(b.horario);
    })[0] || null, [exames]);

  const examesFiltrados = useMemo(() => exames.filter((exame) => {
    const termo = busca.trim().toLocaleLowerCase("pt-BR");
    const correspondeBusca = !termo || [exame.nome, exame.id, exame.unidade, exame.categoria].some((v) => v.toLocaleLowerCase("pt-BR").includes(termo));
    const correspondeSecao = secao === "proximos" ? STATUS_PROXIMOS.includes(exame.status) : ["Realizado", "Cancelado"].includes(exame.status);
    const correspondeStatus = filtroStatus === "Todos" || exame.status === filtroStatus;
    const correspondeCategoria = filtroCategoria === "Todas as categorias" || exame.categoria === filtroCategoria;
    return correspondeBusca && correspondeSecao && correspondeStatus && correspondeCategoria;
  }), [exames, busca, secao, filtroStatus, filtroCategoria]);

  function mostrarAviso(mensagem) {
    setAviso(mensagem);
    window.setTimeout(() => setAviso(""), 3600);
  }

  function mudarSecao(novaSecao) {
    setSecao(novaSecao);
    setFiltroStatus("Todos");
    setFiltroCategoria("Todas as categorias");
    setBusca("");
  }

  function confirmarExame(id) {
    setExames((atuais) => atuais.map((exame) => exame.id === id ? { ...exame, status: "Confirmado" } : exame));
    mostrarAviso("Agendamento confirmado. A data e o horário foram mantidos.");
  }

  function enviarReagendamento() {
    if (!exameParaReagendar) return;
    setExames((atuais) => atuais.map((exame) => exame.id === exameParaReagendar.id ? {
      ...exame,
      status: "Reagendamento solicitado",
      solicitacaoReagendamento: { data: dataEscolhida, horario: horarioEscolhido },
    } : exame));
    setExameParaReagendar(null);
    mostrarAviso("Pedido de alteração registrado nesta demonstração. A data atual continua válida até a unidade responder.");
  }

  function cancelarExame() {
    if (!exameParaCancelar) return;
    setExames((atuais) => atuais.map((exame) => exame.id === exameParaCancelar.id ? { ...exame, status: "Cancelado", solicitacaoReagendamento: null } : exame));
    setExameParaCancelar(null);
    mostrarAviso("Agendamento marcado como cancelado nesta demonstração.");
  }

  function abrirReagendamento(exame) {
    setExameParaReagendar(exame);
    setDataEscolhida(DATAS_DISPONIVEIS[0].data);
    setHorarioEscolhido("09:30");
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#F4F9FE] pb-14 text-[#0B1756]">
      <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-[#DCEBFA]/80" />
      <div className="pointer-events-none absolute -left-28 top-[510px] h-56 w-56 rounded-full border border-[#DCEBFA]" />

      <div className="relative mx-auto max-w-[1320px] px-4 pt-7 sm:px-6 lg:px-8 lg:pt-9">
        <div className="mb-7 flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
          <div className="max-w-3xl">
            <span className="mb-3 inline-flex items-center gap-2 rounded-full bg-[#DCE8F5] px-3.5 py-1.5 text-xs font-bold uppercase tracking-[0.12em] text-[#023E8A]"><FlaskConical size={14} /> Área do paciente · Exames</span>
            <h1 className="text-3xl font-extrabold tracking-tight text-[#0B1756] sm:text-4xl lg:text-[42px]">Meus exames</h1>
            <p className="mt-2 max-w-2xl text-base leading-7 text-[#344968] sm:text-lg">Veja seus agendamentos, confira as orientações de preparo e gerencie seus horários em um só lugar.</p>
          </div>
          <div className="flex max-w-[440px] items-start gap-3 rounded-xl border border-[#B8CDEB] bg-[#EAF2FC] px-4 py-4 text-sm leading-6 text-[#17366F] shadow-sm">
            <Info size={21} className="mt-0.5 shrink-0 text-[#023E8A]" />
            <div><p className="font-bold">Antes de ir à unidade</p><p className="mt-1">Confira o preparo específico do seu exame. Se não puder comparecer, solicite uma alteração com antecedência.</p></div>
          </div>
        </div>

        <div className="mb-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard icon={CalendarClock} label="Próximos exames" valor={contagens.proximos} descricao="Agendamentos ativos" tone="blue" />
          <StatCard icon={Clock3} label="Aguardando confirmação" valor={contagens.aguardando} descricao="Precisam da sua confirmação" tone="amber" />
          <StatCard icon={CheckCircle2} label="Horários confirmados" valor={contagens.confirmados} descricao="Data e horário confirmados" tone="green" />
          <StatCard icon={FileCheck2} label="Exames realizados" valor={contagens.realizados} descricao="Consulte o histórico do atendimento" tone="slate" />
        </div>

        <div className="mb-6 grid grid-cols-2 gap-2 rounded-2xl border border-[#D5E4F7] bg-white p-2 shadow-sm">
          <button type="button" onClick={() => mudarSecao("proximos")} className={`flex min-h-12 items-center justify-center gap-2 rounded-xl px-3 py-3 text-sm font-bold transition sm:text-base ${secao === "proximos" ? "bg-[#1D438D] text-white shadow-sm" : "text-[#0B1756] hover:bg-[#F0F6FC]"}`}><CalendarDays size={18} /> Próximos exames <span className={`rounded-full px-2 py-0.5 text-xs ${secao === "proximos" ? "bg-white/20 text-white" : "bg-[#EAF3F7] text-[#023E8A]"}`}>{contagens.proximos}</span></button>
          <button type="button" onClick={() => mudarSecao("historico")} className={`flex min-h-12 items-center justify-center gap-2 rounded-xl px-3 py-3 text-sm font-bold transition sm:text-base ${secao === "historico" ? "bg-[#1D438D] text-white shadow-sm" : "text-[#0B1756] hover:bg-[#F0F6FC]"}`}><FileText size={18} /> Histórico <span className={`rounded-full px-2 py-0.5 text-xs ${secao === "historico" ? "bg-white/20 text-white" : "bg-[#EAF3F7] text-[#023E8A]"}`}>{contagens.realizados + contagens.cancelados}</span></button>
        </div>

        {secao === "proximos" && proximoExame && (
          <div className="mb-7 grid items-start gap-5 xl:grid-cols-[1.65fr_0.85fr]">
            <section className="overflow-hidden rounded-2xl border border-[#CFE0F5] bg-white shadow-sm">
              <div className="flex flex-col justify-between gap-4 border-b border-[#E5EDF7] bg-gradient-to-r from-white to-[#F4F9FF] px-5 py-5 sm:flex-row sm:items-center sm:px-7">
                <div><p className="text-xs font-bold uppercase tracking-[0.13em] text-[#47709F]">Seu próximo agendamento</p><h2 className="mt-1.5 text-2xl font-extrabold text-[#0B1756] sm:text-[28px]">{proximoExame.nome}</h2><p className="mt-1 text-sm text-slate-500">Protocolo {proximoExame.id} <span className="mx-1.5">·</span> {proximoExame.categoria}</p></div>
                <BadgeStatus status={proximoExame.status} />
              </div>
              <div className="grid gap-4 p-5 sm:grid-cols-[1fr_1fr] sm:p-7">
                <div className="flex gap-4 rounded-xl border border-[#DCE8F5] bg-[#F9FCFF] p-4 sm:p-5"><div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#E3EDF9] text-[#023E8A]"><CalendarDays size={23} /></div><div><p className="text-xs font-bold uppercase tracking-wide text-[#47709F]">Data e horário</p><p className="mt-1.5 text-lg font-extrabold text-[#0B1756]">{proximoExame.diaSemana}, {proximoExame.data}</p><p className="mt-1 flex items-center gap-1.5 text-sm font-semibold text-slate-600"><Clock3 size={15} /> {proximoExame.horario}</p></div></div>
                <div className="flex gap-4 rounded-xl border border-[#DCE8F5] bg-[#F9FCFF] p-4 sm:p-5"><div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#E3EDF9] text-[#023E8A]"><Building2 size={23} /></div><div className="min-w-0"><p className="text-xs font-bold uppercase tracking-wide text-[#47709F]">Local do exame</p><p className="mt-1.5 text-base font-extrabold leading-6 text-[#0B1756]">{proximoExame.unidade}</p><p className="mt-1 text-sm leading-5 text-slate-600">{proximoExame.endereco}</p></div></div>
              </div>
              <div className="mx-5 mb-5 rounded-xl border border-amber-200 bg-amber-50/80 p-4 sm:mx-7 sm:mb-6"><div className="flex items-start gap-3"><span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-amber-700"><Info size={19} /></span><div><p className="font-bold text-amber-950">Orientação para este exame</p><p className="mt-1 text-sm leading-6 text-amber-900">{proximoExame.preparo}</p></div></div></div>
              {proximoExame.solicitacaoReagendamento && <div className="mx-5 mb-5 rounded-xl border border-violet-200 bg-violet-50 p-4 text-sm leading-6 text-violet-800 sm:mx-7"><strong>Pedido de alteração em análise:</strong> você solicitou {proximoExame.solicitacaoReagendamento.data} às {proximoExame.solicitacaoReagendamento.horario}. O agendamento atual continua válido até a unidade confirmar a mudança.</div>}
              <div className="flex flex-col gap-2 border-t border-[#E5EDF7] bg-[#FBFDFF] p-5 sm:flex-row sm:flex-wrap sm:px-7">
                {proximoExame.status === "Aguardando confirmação" && <button type="button" onClick={() => confirmarExame(proximoExame.id)} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#023E8A] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#0B1756]"><Check size={17} /> Confirmar agendamento</button>}
                {proximoExame.podeReagendar && <button type="button" onClick={() => abrirReagendamento(proximoExame)} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-[#C5D9F1] bg-white px-5 py-3 text-sm font-bold text-[#023E8A] transition hover:bg-[#EFF6FD]"><ArrowLeftRight size={17} /> Solicitar outro horário</button>}
                <button type="button" onClick={() => setDetalhe(proximoExame)} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-bold text-[#023E8A] transition hover:bg-[#EFF6FD]"><FileText size={17} /> Ver detalhes completos</button>
              </div>
            </section>

            <aside className="space-y-5">
              <section className="rounded-2xl border border-[#D5E4F7] bg-white p-5 shadow-sm sm:p-6"><div className="flex items-center gap-3"><span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#EAF1FA] text-[#023E8A]"><ClipboardList size={22} /></span><div><h3 className="text-lg font-bold text-[#0B1756]">Checklist para o dia</h3><p className="text-sm text-slate-500">Prepare-se com antecedência</p></div></div><div className="mt-5 space-y-4">{[[FileCheck2,"Documento com foto","Leve RG ou outro documento oficial."],[Stethoscope,"Pedido médico","Tenha o pedido do exame disponível."],[Clock3,"Chegue antes","Planeje chegar cerca de 15 minutos antes, salvo orientação diferente da unidade."]].map(([Icone,titulo,descricao]) => <div key={titulo} className="flex gap-3"><span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#F0F6FC] text-[#023E8A]"><Icone size={18} /></span><div><p className="text-sm font-bold text-[#0B1756]">{titulo}</p><p className="mt-0.5 text-sm leading-5 text-slate-500">{descricao}</p></div></div>)}</div><button type="button" onClick={() => setDetalhe({ tipo: "orientacoes" })} className="mt-5 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-[#C9DDF2] px-4 py-3 text-sm font-bold text-[#023E8A] transition hover:bg-[#F2F7FD]"><CircleHelp size={17} /> Ver todas as orientações</button></section>
              <section className="rounded-2xl border border-[#D5E4F7] bg-white p-5 shadow-sm sm:p-6"><div className="flex items-center gap-3"><span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#EAF1FA] text-[#023E8A]"><BellRing size={21} /></span><div><h3 className="text-lg font-bold text-[#0B1756]">Acompanhe seus agendamentos</h3><p className="text-sm text-slate-500">Situação atual</p></div></div><div className="mt-4 space-y-3">{[["Aguardando sua confirmação",contagens.aguardando,"bg-amber-50 text-amber-800"],["Confirmados",contagens.confirmados,"bg-emerald-50 text-emerald-700"],["Pedidos de alteração",contagens.reagendamento,"bg-violet-50 text-violet-700"]].map(([label,valor,classe]) => <div key={label} className="flex items-center justify-between gap-3 border-b border-slate-100 pb-3 last:border-0 last:pb-0"><span className="text-sm text-slate-600">{label}</span><span className={`min-w-8 rounded-full px-2.5 py-1 text-center text-sm font-bold ${classe}`}>{valor}</span></div>)}</div></section>
            </aside>
          </div>
        )}

        {secao === "proximos" && !proximoExame && <section className="mb-7 rounded-2xl border border-[#D5E4F7] bg-white px-6 py-10 text-center shadow-sm"><span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#EAF1FA] text-[#023E8A]"><CalendarDays size={26} /></span><h2 className="mt-4 text-xl font-bold text-[#0B1756]">Você não tem exames agendados</h2><p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-slate-500">Quando um profissional solicitar e a unidade agendar um exame, as informações aparecerão aqui.</p></section>}

        <section className="overflow-hidden rounded-2xl border border-[#D5E4F7] bg-white shadow-sm">
          <div className="border-b border-[#E5EDF7] px-5 py-5 sm:px-7"><div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-end"><div><h2 className="text-xl font-bold text-[#0B1756]">{secao === "proximos" ? "Todos os próximos exames" : "Histórico de exames"}</h2><p className="mt-1.5 text-sm leading-6 text-slate-500">{secao === "proximos" ? "Acompanhe o status de cada agendamento e escolha a ação necessária." : "Veja os exames concluídos e os agendamentos cancelados."}</p></div><span className="text-sm text-slate-500">{examesFiltrados.length} {examesFiltrados.length === 1 ? "registro" : "registros"}</span></div>
            <div className="mt-5 flex flex-col gap-3 lg:flex-row"><label className="relative block min-w-0 flex-1"><Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" /><input value={busca} onChange={(e) => setBusca(e.target.value)} placeholder="Buscar por exame, protocolo ou unidade..." className="h-12 w-full rounded-xl border border-[#D6E2F2] bg-white pl-11 pr-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-[#8EAFDF] focus:ring-2 focus:ring-[#023E8A]/10" /></label><select aria-label="Filtrar por situação" value={filtroStatus} onChange={(e) => setFiltroStatus(e.target.value)} className="h-12 rounded-xl border border-[#D6E2F2] bg-white px-3.5 text-sm text-slate-700 outline-none focus:border-[#8EAFDF]">{(secao === "proximos" ? ["Todos", "Aguardando confirmação", "Confirmado", "Reagendamento solicitado"] : ["Todos", "Realizado", "Cancelado"]).map((s) => <option key={s} value={s}>{s === "Todos" ? "Todas as situações" : s}</option>)}</select><select aria-label="Filtrar por categoria" value={filtroCategoria} onChange={(e) => setFiltroCategoria(e.target.value)} className="h-12 rounded-xl border border-[#D6E2F2] bg-white px-3.5 text-sm text-slate-700 outline-none focus:border-[#8EAFDF]"><option>Todas as categorias</option><option>Laboratorial</option><option>Imagem</option><option>Cardiologia</option></select><button type="button" onClick={() => { setBusca(""); setFiltroStatus("Todos"); setFiltroCategoria("Todas as categorias"); }} className="h-12 rounded-xl border border-[#D6E2F2] bg-white px-4 text-sm font-bold text-[#023E8A] transition hover:bg-[#F2F7FD]">Limpar filtros</button></div>
          </div>

          <div className="divide-y divide-[#EAF0F8]">
            {examesFiltrados.map((exame) => (
              <article key={exame.id} className="p-5 transition hover:bg-[#FBFDFF] sm:px-7 sm:py-6"><div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between"><div className="flex min-w-0 gap-4"><div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#EAF1FA] text-[#023E8A]"><FlaskConical size={23} /></div><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2.5"><h3 className="text-lg font-bold text-[#0B1756]">{exame.nome}</h3><BadgeStatus status={exame.status} /></div><p className="mt-1 text-sm text-slate-500">Protocolo {exame.id} <span className="mx-1.5">·</span> {exame.categoria}</p><div className="mt-3 grid gap-2 text-sm text-slate-600 md:grid-cols-2"><p className="flex items-center gap-2"><CalendarDays size={16} className="shrink-0 text-[#4779B9]" /> {exame.diaSemana}, {exame.data} às {exame.horario}</p><p className="flex items-center gap-2"><MapPin size={16} className="shrink-0 text-[#4779B9]" /> <span>{exame.unidade}</span></p></div>{exame.solicitacaoReagendamento && <div className="mt-3 rounded-lg border border-violet-100 bg-violet-50 px-3.5 py-3 text-sm leading-5 text-violet-800"><strong>Pedido de alteração:</strong> {exame.solicitacaoReagendamento.data}, às {exame.solicitacaoReagendamento.horario}. O horário atual continua válido até a confirmação da unidade.</div>}</div></div>
                <div className="flex shrink-0 flex-wrap gap-2 xl:max-w-[300px] xl:justify-end">{exame.status === "Aguardando confirmação" && <button type="button" onClick={() => confirmarExame(exame.id)} className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl bg-[#023E8A] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#0B1756]"><Check size={16} /> Confirmar</button>}{exame.podeReagendar && ["Aguardando confirmação", "Confirmado"].includes(exame.status) && <button type="button" onClick={() => abrirReagendamento(exame)} className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-[#C9DDF2] bg-white px-4 py-2.5 text-sm font-bold text-[#023E8A] transition hover:bg-[#F2F7FD]"><ArrowLeftRight size={16} /> Reagendar</button>}<button type="button" onClick={() => setDetalhe(exame)} className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-[#D6E2F2] bg-white px-4 py-2.5 text-sm font-bold text-[#023E8A] transition hover:bg-[#F2F7FD]"><FileText size={16} /> Detalhes</button>{exame.podeReagendar && ["Aguardando confirmação", "Confirmado"].includes(exame.status) && <button type="button" onClick={() => setExameParaCancelar(exame)} className="inline-flex min-h-10 items-center justify-center rounded-xl px-3 py-2 text-sm font-semibold text-slate-500 transition hover:bg-red-50 hover:text-red-700">Cancelar</button>}</div>
              </div></article>
            ))}
            {examesFiltrados.length === 0 && <div className="px-5 py-14 text-center"><span className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-[#EAF1FA] text-[#4779B9]"><Search size={22} /></span><h3 className="mt-4 text-lg font-bold text-[#0B1756]">Nenhum exame encontrado</h3><p className="mx-auto mt-1 max-w-md text-sm leading-6 text-slate-500">Tente outro termo de busca ou altere os filtros para encontrar seus agendamentos.</p><button type="button" onClick={() => { setBusca(""); setFiltroStatus("Todos"); setFiltroCategoria("Todas as categorias"); }} className="mt-4 rounded-xl bg-[#023E8A] px-4 py-2.5 text-sm font-bold text-white hover:bg-[#0B1756]">Limpar filtros</button></div>}
          </div>
          <div className="flex flex-col justify-between gap-2 border-t border-[#E5EDF7] bg-[#FBFDFF] px-5 py-4 text-xs leading-5 text-slate-500 sm:flex-row sm:items-center sm:px-7"><span>Esta tela usa dados demonstrativos para apresentação da interface.</span><span className="inline-flex items-center gap-1.5"><ShieldCheck size={15} className="text-[#4779B9]" /> Informações de saúde devem ser acessadas com autenticação.</span></div>
        </section>
      </div>

      {aviso && <div role="status" className="fixed bottom-5 right-5 z-[120] flex max-w-[min(92vw,480px)] items-start gap-3 rounded-xl border border-emerald-200 bg-white p-4 shadow-xl"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700"><CheckCircle2 size={20} /></span><p className="pt-1 text-sm font-medium leading-6 text-slate-700">{aviso}</p><button type="button" onClick={() => setAviso("")} className="ml-1 rounded-lg p-1 text-slate-400 hover:bg-slate-100" aria-label="Fechar aviso"><X size={17} /></button></div>}

      {exameParaReagendar && <Modal titulo="Solicitar alteração de horário" descricao={`Escolha uma nova data e um horário para ${exameParaReagendar.nome}. O agendamento atual continua válido até a unidade confirmar a alteração.`} onClose={() => setExameParaReagendar(null)}>
        <div className="mb-5 rounded-xl border border-[#D8E6F6] bg-[#F6FAFE] p-4"><p className="text-xs font-bold uppercase tracking-wide text-slate-400">Agendamento atual</p><p className="mt-1.5 text-lg font-bold text-[#0B1756]">{exameParaReagendar.data} às {exameParaReagendar.horario}</p><p className="mt-1 text-sm text-slate-600">{exameParaReagendar.unidade}</p></div>
        <h3 className="text-base font-bold text-slate-800">Escolha uma nova data</h3><div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">{DATAS_DISPONIVEIS.map((item) => <button key={item.data} type="button" onClick={() => setDataEscolhida(item.data)} className={`rounded-xl border p-3.5 text-center transition ${dataEscolhida === item.data ? "border-[#023E8A] bg-[#EAF3F7] text-[#023E8A] ring-2 ring-[#023E8A]/10" : "border-slate-200 bg-white text-slate-600 hover:border-[#9AB8DE]"}`}><span className="block text-xs font-semibold">{item.dia}</span><span className="mt-1 block text-2xl font-extrabold">{item.numero}</span><span className="block text-xs">{item.mes} 2026</span></button>)}</div>
        <h3 className="mt-5 text-base font-bold text-slate-800">Horários disponíveis</h3><div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-4">{HORARIOS_DISPONIVEIS.map((horario) => <button key={horario} type="button" onClick={() => setHorarioEscolhido(horario)} className={`rounded-xl border px-2 py-3 text-sm font-semibold transition ${horarioEscolhido === horario ? "border-[#023E8A] bg-[#023E8A] text-white" : "border-slate-200 bg-white text-slate-600 hover:border-[#9AB8DE] hover:text-[#023E8A]"}`}>{horario}</button>)}</div>
        <div className="mt-5 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-900"><Info size={18} className="mt-0.5 shrink-0" /><p>Este pedido é demonstrativo. A nova data só deve ser considerada confirmada depois da resposta da unidade de saúde.</p></div>
        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end"><button type="button" onClick={() => setExameParaReagendar(null)} className="min-h-11 rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50">Voltar</button><button type="button" onClick={enviarReagendamento} className="min-h-11 rounded-xl bg-[#023E8A] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#0B1756]">Solicitar novo horário</button></div>
      </Modal>}

      {exameParaCancelar && <Modal titulo="Cancelar agendamento?" descricao="Confira os dados antes de continuar." onClose={() => setExameParaCancelar(null)} largura="max-w-md"><div className="rounded-xl border border-red-100 bg-red-50 p-4"><div className="flex items-start gap-3"><AlertCircle size={22} className="mt-0.5 shrink-0 text-red-600" /><div><p className="font-bold text-red-900">{exameParaCancelar.nome}</p><p className="mt-1 text-sm text-red-800">{exameParaCancelar.data} às {exameParaCancelar.horario}</p><p className="mt-2 text-sm leading-6 text-red-800">Ao cancelar, este horário será marcado como cancelado nesta demonstração. Para fazer o exame em outra data, será necessário verificar um novo agendamento com a unidade.</p></div></div></div><div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end"><button type="button" onClick={() => setExameParaCancelar(null)} className="min-h-11 rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50">Manter agendamento</button><button type="button" onClick={cancelarExame} className="min-h-11 rounded-xl bg-red-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-red-700">Confirmar cancelamento</button></div></Modal>}

      {detalhe && <Modal titulo={detalhe.tipo === "orientacoes" ? "Orientações para seus exames" : detalhe.nome} descricao={detalhe.tipo === "orientacoes" ? "Recomendações gerais para se preparar para o atendimento." : `Protocolo ${detalhe.id} · ${detalhe.categoria}`} onClose={() => setDetalhe(null)}>
        {detalhe.tipo === "orientacoes" ? <div className="space-y-3">{[[FileCheck2,"Documentos necessários","Leve documento oficial com foto, cartão SUS se tiver e pedido médico."],[Clock3,"Horário de chegada","Planeje chegar cerca de 15 minutos antes, salvo se a unidade orientar de outra forma."],[HeartPulse,"Preparo do exame","Jejum, hidratação e outras orientações variam conforme o exame. Confira as instruções específicas."],[Stethoscope,"Medicamentos e dúvidas","Não altere medicamentos por conta própria. Em caso de dúvida, fale com a unidade ou o profissional responsável."]].map(([Icone,titulo,texto]) => <div key={titulo} className="flex gap-3 rounded-xl border border-slate-100 p-4"><span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#EAF3F7] text-[#023E8A]"><Icone size={20} /></span><div><h3 className="font-bold text-[#0B1756]">{titulo}</h3><p className="mt-1 text-sm leading-6 text-slate-600">{texto}</p></div></div>)}</div> : <div className="space-y-5"><div className="flex flex-wrap items-center gap-2"><BadgeStatus status={detalhe.status} /><span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600">{detalhe.categoria}</span></div><p className="text-sm leading-6 text-slate-600">{detalhe.descricao}</p><div className="grid gap-3 sm:grid-cols-2"><div className="rounded-xl bg-[#F6FAFE] p-4"><p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Data e horário</p><p className="mt-1.5 font-bold text-[#0B1756]">{detalhe.diaSemana}, {detalhe.data}</p><p className="mt-1 text-sm text-slate-600">Às {detalhe.horario}</p></div><div className="rounded-xl bg-[#F6FAFE] p-4"><p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Solicitado em</p><p className="mt-1.5 font-bold text-[#0B1756]">{detalhe.solicitadoEm}</p><p className="mt-1 text-sm text-slate-600">Por {detalhe.solicitante}</p></div><div className="rounded-xl bg-[#F6FAFE] p-4 sm:col-span-2"><p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Unidade de atendimento</p><p className="mt-1.5 font-bold text-[#0B1756]">{detalhe.unidade}</p><p className="mt-1 text-sm leading-6 text-slate-600">{detalhe.endereco}</p></div></div><div className="rounded-xl border border-amber-200 bg-amber-50 p-4"><h3 className="flex items-center gap-2 font-bold text-amber-950"><Info size={18} /> Orientações de preparo</h3><p className="mt-2 text-sm leading-6 text-amber-900">{detalhe.preparo}</p></div>{detalhe.resultado && <div className="rounded-xl border border-blue-100 bg-blue-50 p-4"><h3 className="flex items-center gap-2 font-bold text-[#023E8A]"><FileCheck2 size={18} /> Resultado</h3><p className="mt-2 text-sm leading-6 text-slate-700">{detalhe.resultado}</p></div>}{detalhe.observacao && <div className="rounded-xl border border-slate-200 p-4"><h3 className="font-bold text-[#0B1756]">Observação</h3><p className="mt-1 text-sm leading-6 text-slate-600">{detalhe.observacao}</p></div>}{detalhe.status === "Aguardando confirmação" && <button type="button" onClick={() => { confirmarExame(detalhe.id); setDetalhe(null); }} className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#023E8A] px-4 py-3 text-sm font-bold text-white hover:bg-[#0B1756]"><Check size={17} /> Confirmar agendamento</button>}</div>}
      </Modal>}
    </main>
  );
}
