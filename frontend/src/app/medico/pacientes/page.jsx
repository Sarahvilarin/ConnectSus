"use client";

import { useMemo, useState } from "react";
import {
  Activity,
  AlertCircle,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Clock3,
  ClipboardList,
  FileCheck2,
  FileText,
  Filter,
  HeartPulse,
  Hospital,
  MapPin,
  Search,
  ShieldCheck,
  Stethoscope,
  UserRound,
  Users,
  X,
} from "lucide-react";

const PACIENTES_INICIAIS = [
  {
    id: "EX-2026-0418",
    nome: "Mariana Silva Costa",
    cpf: "***.456.***-00",
    idade: 28,
    nascimento: "18/04/1998",
    sexo: "Feminino",
    telefone: "(11) 9****-2184",
    exame: "Hemograma completo",
    categoria: "Laboratorial",
    prioridade: "Urgente",
    status: "Aguardando",
    chegada: "13:08",
    espera: 42,
    unidade: "Hospital Municipal de Emergências Albert Sabin",
    solicitante: "Dra. Camila Ferreira",
    motivo: "Investigação de alteração clínica com necessidade de avaliação rápida.",
    observacoes: "Paciente orientada pela equipe de triagem. Conferir a solicitação médica antes da coleta.",
    protocolo: "TRI-0841",
    atendimento: null,
    resultado: "Aguardando coleta",
    alergias: "Não informado",
    comorbidades: "Não informado",
  },
  {
    id: "EX-2026-0417",
    nome: "João Pedro Alves",
    cpf: "***.654.***-21",
    idade: 44,
    nascimento: "10/08/1982",
    sexo: "Masculino",
    telefone: "(11) 9****-7301",
    exame: "Eletrocardiograma",
    categoria: "Cardiologia",
    prioridade: "Emergência",
    status: "Em atendimento",
    chegada: "13:19",
    espera: 31,
    unidade: "Hospital Municipal de Emergências Albert Sabin",
    solicitante: "Dr. Rafael Mendes",
    motivo: "Avaliação cardíaca solicitada pela equipe médica.",
    observacoes: "Seguir o protocolo assistencial da unidade e registrar o procedimento realizado.",
    protocolo: "TRI-0839",
    atendimento: "13:36",
    resultado: "Em processamento",
    alergias: "Não informado",
    comorbidades: "Não informado",
  },
  {
    id: "EX-2026-0415",
    nome: "Carlos Eduardo Lima",
    cpf: "***.222.***-44",
    idade: 61,
    nascimento: "02/02/1965",
    sexo: "Masculino",
    telefone: "(11) 9****-4602",
    exame: "Raio-X de tórax",
    categoria: "Imagem",
    prioridade: "Urgente",
    status: "Aguardando",
    chegada: "12:52",
    espera: 58,
    unidade: "Hospital Municipal Maria Braido",
    solicitante: "Dra. Beatriz Rocha",
    motivo: "Exame de imagem solicitado para investigação clínica.",
    observacoes: "Validar região e incidências conforme pedido médico.",
    protocolo: "TRI-0835",
    atendimento: null,
    resultado: "Aguardando exame",
    alergias: "Não informado",
    comorbidades: "Não informado",
  },
  {
    id: "EX-2026-0412",
    nome: "Ana Clara Oliveira",
    cpf: "***.913.***-08",
    idade: 35,
    nascimento: "21/11/1990",
    sexo: "Feminino",
    telefone: "(11) 9****-6129",
    exame: "Glicemia",
    categoria: "Laboratorial",
    prioridade: "Prioritário",
    status: "Aguardando",
    chegada: "12:34",
    espera: 76,
    unidade: "Hospital Municipal Maria Braido",
    solicitante: "Dr. Rafael Mendes",
    motivo: "Dosagem de glicose solicitada durante avaliação clínica.",
    observacoes: "Confirmar preparo e identificação antes da coleta, conforme protocolo local.",
    protocolo: "TRI-0828",
    atendimento: null,
    resultado: "Aguardando coleta",
    alergias: "Não informado",
    comorbidades: "Não informado",
  },
  {
    id: "EX-2026-0409",
    nome: "Lucas Henrique Santos",
    cpf: "***.731.***-19",
    idade: 19,
    nascimento: "07/06/2007",
    sexo: "Masculino",
    telefone: "(11) 9****-4058",
    exame: "Ultrassom abdominal",
    categoria: "Imagem",
    prioridade: "Prioritário",
    status: "Atendido",
    chegada: "10:14",
    espera: 18,
    unidade: "Hospital Municipal de Emergências Albert Sabin",
    solicitante: "Dra. Camila Ferreira",
    motivo: "Exame de imagem solicitado para investigação de sintomas abdominais.",
    observacoes: "Procedimento registrado pela equipe. Resultado deve ser consultado no sistema de exames.",
    protocolo: "TRI-0806",
    atendimento: "10:32",
    resultado: "Laudo em elaboração",
    alergias: "Não informado",
    comorbidades: "Não informado",
  },
  {
    id: "EX-2026-0407",
    nome: "Fernanda Martins Souza",
    cpf: "***.285.***-67",
    idade: 52,
    nascimento: "14/09/1974",
    sexo: "Feminino",
    telefone: "(11) 9****-9913",
    exame: "Hemograma completo",
    categoria: "Laboratorial",
    prioridade: "Urgente",
    status: "Atendido",
    chegada: "09:48",
    espera: 12,
    unidade: "Hospital Municipal Maria Braido",
    solicitante: "Dr. Paulo Nogueira",
    motivo: "Exame laboratorial solicitado para apoiar a avaliação clínica.",
    observacoes: "Coleta registrada. Conferir o andamento do resultado no módulo de exames.",
    protocolo: "TRI-0798",
    atendimento: "10:00",
    resultado: "Em processamento",
    alergias: "Não informado",
    comorbidades: "Não informado",
  },
  {
    id: "EX-2026-0403",
    nome: "Roberto Almeida Santos",
    cpf: "***.104.***-55",
    idade: 67,
    nascimento: "25/01/1959",
    sexo: "Masculino",
    telefone: "(11) 9****-1504",
    exame: "Eletrocardiograma",
    categoria: "Cardiologia",
    prioridade: "Emergência",
    status: "Atendido",
    chegada: "08:26",
    espera: 7,
    unidade: "Hospital Municipal de Emergências Albert Sabin",
    solicitante: "Dra. Beatriz Rocha",
    motivo: "Avaliação cardíaca registrada na solicitação clínica.",
    observacoes: "Procedimento concluído. Verificar laudo e encaminhamentos com a equipe responsável.",
    protocolo: "TRI-0782",
    atendimento: "08:33",
    resultado: "Resultado disponível",
    alergias: "Não informado",
    comorbidades: "Não informado",
  },
  {
    id: "EX-2026-0399",
    nome: "Beatriz Nascimento Lima",
    cpf: "***.908.***-12",
    idade: 23,
    nascimento: "03/03/2003",
    sexo: "Feminino",
    telefone: "(11) 9****-7730",
    exame: "Urina tipo I",
    categoria: "Laboratorial",
    prioridade: "Prioritário",
    status: "Atendido",
    chegada: "08:02",
    espera: 24,
    unidade: "Hospital Municipal Maria Braido",
    solicitante: "Dr. Paulo Nogueira",
    motivo: "Análise laboratorial solicitada durante atendimento médico.",
    observacoes: "Coleta finalizada. Consultar o sistema laboratorial para acessar o resultado.",
    protocolo: "TRI-0775",
    atendimento: "08:26",
    resultado: "Resultado disponível",
    alergias: "Não informado",
    comorbidades: "Não informado",
  },
];

const FILTROS_EXAME = ["Todos os exames", "Laboratorial", "Imagem", "Cardiologia"];
const ABAS = [
  { id: "pendentes", label: "Aguardando atendimento" },
  { id: "atendidos", label: "Já atendidos" },
  { id: "todos", label: "Todos os pacientes" },
];

export default function PacientesMedicoPage() {
  const [pacientes, setPacientes] = useState(PACIENTES_INICIAIS);
  const [aba, setAba] = useState("pendentes");
  const [busca, setBusca] = useState("");
  const [filtroExame, setFiltroExame] = useState("Todos os exames");
  const [filtroPrioridade, setFiltroPrioridade] = useState("Todas as prioridades");
  const [pacienteSelecionado, setPacienteSelecionado] = useState(null);
  const [mostrarAviso, setMostrarAviso] = useState(false);

  const estatisticas = useMemo(() => {
    const pendentes = pacientes.filter((p) => p.status !== "Atendido");
    const aguardando = pacientes.filter((p) => p.status === "Aguardando");
    const emAtendimento = pacientes.filter((p) => p.status === "Em atendimento");
    const atendidos = pacientes.filter((p) => p.status === "Atendido");
    const urgentes = pendentes.filter((p) => p.prioridade === "Emergência" || p.prioridade === "Urgente");
    return { pendentes, aguardando, emAtendimento, atendidos, urgentes };
  }, [pacientes]);

  const pacientesFiltrados = useMemo(() => {
    const termo = busca.trim().toLocaleLowerCase("pt-BR");
    return pacientes.filter((p) => {
      const correspondeAba =
        aba === "todos" ||
        (aba === "pendentes" && p.status !== "Atendido") ||
        (aba === "atendidos" && p.status === "Atendido");
      const correspondeBusca =
        !termo ||
        p.nome.toLocaleLowerCase("pt-BR").includes(termo) ||
        p.id.toLocaleLowerCase("pt-BR").includes(termo) ||
        p.exame.toLocaleLowerCase("pt-BR").includes(termo) ||
        p.protocolo.toLocaleLowerCase("pt-BR").includes(termo);
      const correspondeExame = filtroExame === "Todos os exames" || p.categoria === filtroExame;
      const correspondePrioridade = filtroPrioridade === "Todas as prioridades" || p.prioridade === filtroPrioridade;
      return correspondeAba && correspondeBusca && correspondeExame && correspondePrioridade;
    });
  }, [pacientes, aba, busca, filtroExame, filtroPrioridade]);

  function marcarComoAtendido(id) {
    const agora = new Date();
    const horario = agora.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
    setPacientes((atuais) => atuais.map((p) => (p.id === id ? { ...p, status: "Atendido", atendimento: horario } : p)));
    setPacienteSelecionado((atual) => (atual?.id === id ? { ...atual, status: "Atendido", atendimento: horario } : atual));
    setMostrarAviso(true);
  }

  function limparFiltros() {
    setBusca("");
    setFiltroExame("Todos os exames");
    setFiltroPrioridade("Todas as prioridades");
  }

  return (
    <main className="min-h-screen bg-[#F4F7FB] px-4 py-5 text-slate-800 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1500px] space-y-6">
        <header className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-[#0B1756] via-[#123D86] to-[#087CA6] p-6 text-white shadow-[0_18px_45px_rgba(11,23,86,0.18)] sm:p-8">
          <div className="pointer-events-none absolute -right-10 -top-20 h-64 w-64 rounded-full border-[35px] border-white/5" />
          <div className="pointer-events-none absolute -bottom-28 right-48 h-60 w-60 rounded-full bg-cyan-300/10 blur-2xl" />
          <div className="relative flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <div className="max-w-3xl">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-semibold tracking-wide text-cyan-50">
                <Stethoscope size={14} /> ÁREA MÉDICA <span className="text-white/50">/</span> PAINEL ASSISTENCIAL
              </div>
              <h1 className="text-2xl font-bold tracking-tight sm:text-3xl lg:text-[36px]">Pacientes e solicitações de exames</h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-blue-100 sm:text-base">
                Consulte quem aguarda atendimento, confira o tipo de exame solicitado e acesse o histórico dos pacientes já atendidos.
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-3 rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-sm">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/15"><CalendarDays size={21} /></div>
              <div>
                <p className="text-xs text-blue-100">Visão do dia</p>
                <p className="mt-0.5 text-sm font-semibold">Fila de exames</p>
                <p className="mt-1 text-[11px] text-blue-100">Dados demonstrativos</p>
              </div>
            </div>
          </div>
        </header>

        <section className="flex flex-col gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 sm:flex-row sm:items-start sm:gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-800"><AlertCircle size={21} /></div>
          <div className="flex-1">
            <h2 className="text-sm font-bold text-amber-950">Priorize conforme a classificação clínica</h2>
            <p className="mt-1 text-sm leading-5 text-amber-900/90">A prioridade exibida deve seguir a triagem e a avaliação da equipe responsável. Esta tela organiza a fila e não substitui os protocolos assistenciais da unidade.</p>
          </div>
          <span className="inline-flex w-fit items-center rounded-full border border-amber-200 bg-white/70 px-3 py-1 text-[11px] font-semibold text-amber-900">Uso interno</span>
        </section>

        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard title="Aguardando" value={estatisticas.aguardando.length} subtitle="Na fila para atendimento" icon={<Clock3 size={20} />} tone="blue" onClick={() => setAba("pendentes")} />
          <StatCard title="Em atendimento" value={estatisticas.emAtendimento.length} subtitle="Atendimento iniciado" icon={<Activity size={20} />} tone="violet" onClick={() => setAba("pendentes")} />
          <StatCard title="Prioridade elevada" value={estatisticas.urgentes.length} subtitle="Urgência ou emergência" icon={<AlertCircle size={20} />} tone="amber" onClick={() => { setAba("pendentes"); setFiltroPrioridade("Todas as prioridades"); }} />
          <StatCard title="Já atendidos" value={estatisticas.atendidos.length} subtitle="Com atendimento registrado" icon={<CheckCircle2 size={20} />} tone="green" onClick={() => setAba("atendidos")} />
        </section>

        <section className="overflow-hidden rounded-[26px] border border-slate-200/80 bg-white shadow-[0_10px_35px_rgba(15,23,42,0.045)]">
          <div className="border-b border-slate-100 p-5 sm:p-6">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EAF3F7] text-[#174693]"><Users size={20} /></div>
                  <div>
                    <h2 className="text-lg font-bold text-[#0B1756]">Lista de pacientes</h2>
                    <p className="mt-0.5 text-xs text-slate-500">Abra a ficha para consultar os detalhes da solicitação.</p>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <label className="relative block min-w-0 sm:w-72">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={17} />
                  <input value={busca} onChange={(e) => setBusca(e.target.value)} placeholder="Buscar paciente, exame ou protocolo" className="h-11 w-full rounded-xl border border-slate-200 bg-[#FBFCFE] pl-10 pr-3 text-sm outline-none transition focus:border-[#3B82B8] focus:ring-4 focus:ring-blue-100" />
                </label>
                <label className="relative block sm:w-48">
                  <Filter className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <select value={filtroExame} onChange={(e) => setFiltroExame(e.target.value)} className="h-11 w-full appearance-none rounded-xl border border-slate-200 bg-[#FBFCFE] pl-10 pr-9 text-sm outline-none transition focus:border-[#3B82B8] focus:ring-4 focus:ring-blue-100">
                    {FILTROS_EXAME.map((item) => <option key={item}>{item}</option>)}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
                </label>
              </div>
            </div>

            <div className="mt-5 flex flex-col gap-3 border-b border-slate-100 sm:flex-row sm:items-end sm:justify-between">
              <div className="flex gap-1 overflow-x-auto">
                {ABAS.map((item) => {
                  const ativo = aba === item.id;
                  const quantidade = item.id === "pendentes" ? estatisticas.pendentes.length : item.id === "atendidos" ? estatisticas.atendidos.length : pacientes.length;
                  return (
                    <button key={item.id} onClick={() => setAba(item.id)} className={`relative -mb-px flex shrink-0 items-center gap-2 border-b-2 px-3 py-3 text-sm font-semibold transition sm:px-4 ${ativo ? "border-[#174693] text-[#174693]" : "border-transparent text-slate-500 hover:text-slate-800"}`}>
                      {item.label}<span className={`rounded-full px-2 py-0.5 text-[10px] ${ativo ? "bg-[#EAF3F7] text-[#174693]" : "bg-slate-100 text-slate-500"}`}>{quantidade}</span>
                    </button>
                  );
                })}
              </div>
              <label className="mb-3 flex items-center gap-2 text-xs text-slate-500 sm:mb-3">
                Prioridade
                <select value={filtroPrioridade} onChange={(e) => setFiltroPrioridade(e.target.value)} className="h-9 rounded-lg border border-slate-200 bg-white px-2.5 text-xs font-medium text-slate-700 outline-none focus:border-[#3B82B8]">
                  <option>Todas as prioridades</option><option>Emergência</option><option>Urgente</option><option>Prioritário</option>
                </select>
              </label>
            </div>
          </div>

          {mostrarAviso && (
            <div className="mx-5 mt-5 flex items-center justify-between gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900 sm:mx-6">
              <span className="flex items-center gap-2"><CheckCircle2 size={17} /> Status atualizado nesta demonstração. A alteração ainda não foi salva no backend.</span>
              <button onClick={() => setMostrarAviso(false)} aria-label="Fechar aviso" className="rounded-lg p-1 hover:bg-emerald-100"><X size={16} /></button>
            </div>
          )}

          <div className="hidden overflow-x-auto lg:block">
            <table className="w-full min-w-[1000px] border-collapse text-left">
              <thead>
                <tr className="bg-[#F8FAFD] text-[10px] uppercase tracking-[0.12em] text-slate-400">
                  <th className="px-6 py-4 font-semibold">Paciente</th>
                  <th className="px-5 py-4 font-semibold">Exame solicitado</th>
                  <th className="px-5 py-4 font-semibold">Prioridade</th>
                  <th className="px-5 py-4 font-semibold">Fila / horário</th>
                  <th className="px-5 py-4 font-semibold">Status</th>
                  <th className="px-6 py-4 text-right font-semibold">Ficha</th>
                </tr>
              </thead>
              <tbody>
                {pacientesFiltrados.map((p) => (
                  <tr key={p.id} className="border-t border-slate-100 transition hover:bg-[#FBFDFF]">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <Avatar nome={p.nome} />
                        <div className="min-w-0">
                          <p className="truncate text-sm font-bold text-[#0B1756]">{p.nome}</p>
                          <p className="mt-1 text-xs text-slate-500">{p.idade} anos <span className="mx-1 text-slate-300">•</span> CPF {p.cpf}</p>
                          <p className="mt-1 text-[10px] text-slate-400">Protocolo {p.protocolo}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-start gap-2.5">
                        <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#EAF3F7] text-[#174693]">{iconeCategoria(p.categoria)}</div>
                        <div>
                          <p className="text-sm font-semibold text-slate-800">{p.exame}</p>
                          <p className="mt-1 text-xs text-slate-500">{p.categoria}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4"><PrioridadeBadge prioridade={p.prioridade} /></td>
                    <td className="px-5 py-4">
                      <p className="text-sm font-semibold text-slate-700">{p.chegada}</p>
                      <p className={`mt-1 text-xs ${p.status !== "Atendido" && p.espera >= 40 ? "font-semibold text-amber-700" : "text-slate-500"}`}>{p.status === "Atendido" ? `Atendido às ${p.atendimento}` : `${p.espera} min na fila`}</p>
                    </td>
                    <td className="px-5 py-4"><StatusBadge status={p.status} /></td>
                    <td className="px-6 py-4 text-right"><button onClick={() => setPacienteSelecionado(p)} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-semibold text-[#174693] transition hover:border-blue-200 hover:bg-blue-50">Abrir ficha <ChevronRight size={14} /></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="space-y-3 p-4 lg:hidden">
            {pacientesFiltrados.map((p) => (
              <article key={p.id} className="rounded-2xl border border-slate-200 p-4">
                <div className="flex items-start gap-3">
                  <Avatar nome={p.nome} />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2"><h3 className="text-sm font-bold text-[#0B1756]">{p.nome}</h3><PrioridadeBadge prioridade={p.prioridade} /></div>
                    <p className="mt-1 text-xs text-slate-500">{p.idade} anos · CPF {p.cpf}</p>
                  </div>
                </div>
                <div className="mt-4 rounded-xl bg-[#F8FAFD] p-3">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Exame solicitado</p>
                  <div className="mt-2 flex items-center gap-2 text-sm font-semibold text-slate-800">{iconeCategoria(p.categoria)} {p.exame}</div>
                  <p className="mt-1 text-xs text-slate-500">{p.categoria}</p>
                </div>
                <div className="mt-3 flex flex-wrap items-center justify-between gap-2"><StatusBadge status={p.status} /><span className="text-xs text-slate-500">{p.status === "Atendido" ? `Atendido às ${p.atendimento}` : `${p.espera} min na fila`}</span></div>
                <button onClick={() => setPacienteSelecionado(p)} className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 py-2.5 text-xs font-semibold text-[#174693] hover:bg-blue-50">Abrir ficha do paciente <ChevronRight size={14} /></button>
              </article>
            ))}
          </div>

          {pacientesFiltrados.length === 0 && (
            <div className="px-6 py-16 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400"><Search size={22} /></div>
              <h3 className="mt-4 text-sm font-bold text-slate-700">Nenhum paciente encontrado</h3>
              <p className="mt-1 text-xs text-slate-500">Tente outro nome, protocolo ou filtro de exame.</p>
              <button onClick={limparFiltros} className="mt-4 rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-[#174693] hover:bg-blue-50">Limpar filtros</button>
            </div>
          )}

          <footer className="flex flex-col gap-2 border-t border-slate-100 bg-[#FBFCFE] px-5 py-4 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <span>Exibindo <strong className="text-slate-700">{pacientesFiltrados.length}</strong> de <strong className="text-slate-700">{pacientes.length}</strong> registros demonstrativos</span>
            <span className="flex items-center gap-1.5"><ShieldCheck size={14} className="text-emerald-600" /> Dados pessoais mascarados nesta demonstração</span>
          </footer>
        </section>

        <section className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-[24px] border border-slate-200/80 bg-white p-5 shadow-[0_10px_35px_rgba(15,23,42,0.035)] sm:p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EAF3F7] text-[#174693]"><ClipboardList size={20} /></div>
              <div><h2 className="text-base font-bold text-[#0B1756]">Informações disponíveis na ficha</h2><p className="mt-1 text-xs text-slate-500">Resumo dos dados relevantes para acompanhamento assistencial.</p></div>
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <InfoTile icon={<UserRound size={17} />} title="Identificação" text="Nome, idade, data de nascimento e CPF mascarado." />
              <InfoTile icon={<FileText size={17} />} title="Solicitação" text="Tipo e categoria do exame, protocolo e motivo informado." />
              <InfoTile icon={<Clock3 size={17} />} title="Atendimento" text="Status, horário de chegada, tempo de espera e registro do atendimento." />
              <InfoTile icon={<Hospital size={17} />} title="Unidade e equipe" text="Unidade de atendimento e profissional solicitante." />
              <InfoTile icon={<HeartPulse size={17} />} title="Informações clínicas" text="Observações da solicitação e campos clínicos registrados pela equipe." />
              <InfoTile icon={<FileCheck2 size={17} />} title="Situação do exame" text="Aguardando coleta, em processamento, laudo em elaboração ou resultado disponível." />
            </div>
          </div>
          <div className="rounded-[24px] border border-slate-200/80 bg-white p-5 shadow-[0_10px_35px_rgba(15,23,42,0.035)] sm:p-6">
            <div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-700"><Activity size={20} /></div><div><h2 className="text-base font-bold text-[#0B1756]">Acompanhamento da fila</h2><p className="mt-1 text-xs text-slate-500">Distribuição atual dos registros demonstrativos.</p></div></div>
            <div className="mt-5 space-y-4">
              <ProgressLine label="Aguardando" value={estatisticas.aguardando.length} total={pacientes.length} color="bg-blue-600" />
              <ProgressLine label="Em atendimento" value={estatisticas.emAtendimento.length} total={pacientes.length} color="bg-violet-500" />
              <ProgressLine label="Atendidos" value={estatisticas.atendidos.length} total={pacientes.length} color="bg-emerald-500" />
            </div>
            <div className="mt-5 rounded-xl border border-slate-100 bg-[#F8FAFD] p-3.5 text-xs leading-5 text-slate-600">Os tempos e estados são exemplos para demonstrar a interface. Na aplicação real, devem vir da API e ser atualizados conforme os eventos registrados pela unidade.</div>
          </div>
        </section>
      </div>

      {pacienteSelecionado && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-[#07112F]/55 p-0 backdrop-blur-[3px] sm:items-center sm:p-5" onMouseDown={(e) => { if (e.target === e.currentTarget) setPacienteSelecionado(null); }}>
          <section role="dialog" aria-modal="true" aria-labelledby="ficha-paciente-titulo" className="max-h-[94vh] w-full max-w-3xl overflow-y-auto rounded-t-[28px] bg-white shadow-2xl sm:rounded-[28px]">
            <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-slate-100 bg-white/95 p-5 backdrop-blur sm:p-6">
              <div className="flex min-w-0 items-center gap-3"><Avatar nome={pacienteSelecionado.nome} grande /><div className="min-w-0"><p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400">Ficha do paciente · {pacienteSelecionado.protocolo}</p><h2 id="ficha-paciente-titulo" className="mt-1 truncate text-lg font-bold text-[#0B1756] sm:text-xl">{pacienteSelecionado.nome}</h2><p className="mt-1 text-xs text-slate-500">{pacienteSelecionado.idade} anos · {pacienteSelecionado.sexo} · CPF {pacienteSelecionado.cpf}</p></div></div>
              <button onClick={() => setPacienteSelecionado(null)} aria-label="Fechar ficha" className="rounded-xl border border-slate-200 p-2 text-slate-500 transition hover:bg-slate-50"><X size={18} /></button>
            </div>
            <div className="space-y-5 p-5 sm:p-6">
              <div className="grid gap-3 sm:grid-cols-3">
                <DetailPill label="Status" value={pacienteSelecionado.status} icon={<Activity size={16} />} />
                <DetailPill label="Prioridade" value={pacienteSelecionado.prioridade} icon={<AlertCircle size={16} />} />
                <DetailPill label="Resultado" value={pacienteSelecionado.resultado} icon={<FileCheck2 size={16} />} />
              </div>

              <div className="rounded-2xl border border-blue-100 bg-gradient-to-r from-[#F3F8FC] to-white p-4 sm:p-5">
                <div className="flex items-start gap-3"><div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-[#174693] shadow-sm">{iconeCategoria(pacienteSelecionado.categoria)}</div><div className="min-w-0 flex-1"><p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400">Exame solicitado</p><h3 className="mt-1 text-base font-bold text-[#0B1756]">{pacienteSelecionado.exame}</h3><p className="mt-1 text-xs text-slate-500">Categoria: {pacienteSelecionado.categoria}</p><p className="mt-3 text-sm leading-6 text-slate-700">{pacienteSelecionado.motivo}</p></div></div>
              </div>

              <div>
                <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-[#0B1756]"><UserRound size={16} /> Dados do paciente</h3>
                <div className="grid gap-3 sm:grid-cols-2"><DetailField label="Data de nascimento" value={pacienteSelecionado.nascimento} /><DetailField label="Telefone cadastrado" value={pacienteSelecionado.telefone} /><DetailField label="Alergias registradas" value={pacienteSelecionado.alergias} /><DetailField label="Comorbidades registradas" value={pacienteSelecionado.comorbidades} /></div>
              </div>

              <div>
                <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-[#0B1756]"><Clock3 size={16} /> Linha do atendimento</h3>
                <div className="grid gap-3 sm:grid-cols-3"><DetailField label="Chegada registrada" value={pacienteSelecionado.chegada} /><DetailField label="Tempo de espera" value={pacienteSelecionado.status === "Atendido" ? `${pacienteSelecionado.espera} min` : `${pacienteSelecionado.espera} min (estimado)`} /><DetailField label="Horário do atendimento" value={pacienteSelecionado.atendimento || "Ainda não registrado"} /></div>
              </div>

              <div>
                <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-[#0B1756]"><Hospital size={16} /> Unidade e solicitação</h3>
                <div className="grid gap-3 sm:grid-cols-2"><DetailField label="Unidade" value={pacienteSelecionado.unidade} icon={<MapPin size={14} />} /><DetailField label="Profissional solicitante" value={pacienteSelecionado.solicitante} icon={<Stethoscope size={14} />} /><DetailField label="Protocolo" value={pacienteSelecionado.protocolo} icon={<FileText size={14} />} /><DetailField label="Situação do exame" value={pacienteSelecionado.resultado} icon={<FileCheck2 size={14} />} /></div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-[#FBFCFE] p-4"><p className="text-xs font-bold text-slate-700">Observações da solicitação</p><p className="mt-2 text-sm leading-6 text-slate-600">{pacienteSelecionado.observacoes}</p></div>

              <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-between">
                <button onClick={() => setPacienteSelecionado(null)} className="rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50">Fechar ficha</button>
                {pacienteSelecionado.status !== "Atendido" ? (
                  <button onClick={() => marcarComoAtendido(pacienteSelecionado.id)} className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#174693] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-900/10 transition hover:bg-[#0B1756]"><Check size={17} /> Registrar como atendido</button>
                ) : (
                  <span className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-50 px-5 py-3 text-sm font-semibold text-emerald-800"><CheckCircle2 size={17} /> Atendimento registrado nesta demonstração</span>
                )}
              </div>
              <p className="text-center text-[11px] leading-5 text-slate-400">Tela demonstrativa: informações fictícias e alterações temporárias no navegador. A ficha real deve respeitar permissões de acesso e auditoria.</p>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}

function StatCard({ title, value, subtitle, icon, tone, onClick }) {
  const tones = {
    blue: "bg-blue-50 text-blue-700 ring-blue-100",
    violet: "bg-violet-50 text-violet-700 ring-violet-100",
    amber: "bg-amber-50 text-amber-700 ring-amber-100",
    green: "bg-emerald-50 text-emerald-700 ring-emerald-100",
  };
  return (
    <button onClick={onClick} className="group rounded-[22px] border border-slate-200/80 bg-white p-5 text-left shadow-[0_8px_28px_rgba(15,23,42,0.035)] transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-[0_12px_32px_rgba(15,23,42,0.07)]">
      <div className="flex items-start justify-between gap-3"><div><p className="text-xs font-medium text-slate-500">{title}</p><p className="mt-2 text-3xl font-bold tracking-tight text-[#0B1756]">{value.toString().padStart(2, "0")}</p></div><div className={`flex h-11 w-11 items-center justify-center rounded-xl ring-1 ${tones[tone]}`}>{icon}</div></div>
      <div className="mt-4 flex items-center justify-between gap-2"><p className="text-xs text-slate-500">{subtitle}</p><ChevronRight size={15} className="text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-[#174693]" /></div>
    </button>
  );
}

function Avatar({ nome, grande = false }) {
  return <div className={`${grande ? "h-12 w-12 rounded-2xl text-sm" : "h-10 w-10 rounded-xl text-xs"} flex shrink-0 items-center justify-center bg-gradient-to-br from-[#DCECF6] to-[#C8DAF5] font-bold text-[#174693]`}>{nome.split(" ").slice(0, 2).map((p) => p[0]).join("")}</div>;
}

function PrioridadeBadge({ prioridade }) {
  const styles = {
    Emergência: "border-rose-200 bg-rose-50 text-rose-700",
    Urgente: "border-amber-200 bg-amber-50 text-amber-800",
    Prioritário: "border-blue-200 bg-blue-50 text-blue-700",
  };
  return <span className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 py-1 text-[10px] font-bold ${styles[prioridade] || "border-slate-200 bg-slate-50 text-slate-600"}`}><span className={`h-1.5 w-1.5 rounded-full ${prioridade === "Emergência" ? "bg-rose-500" : prioridade === "Urgente" ? "bg-amber-500" : "bg-blue-500"}`} />{prioridade}</span>;
}

function StatusBadge({ status }) {
  const styles = {
    Aguardando: "border-blue-200 bg-blue-50 text-blue-700",
    "Em atendimento": "border-violet-200 bg-violet-50 text-violet-700",
    Atendido: "border-emerald-200 bg-emerald-50 text-emerald-700",
  };
  const icon = status === "Atendido" ? <CheckCircle2 size={12} /> : status === "Em atendimento" ? <Activity size={12} /> : <Clock3 size={12} />;
  return <span className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 py-1.5 text-[10px] font-semibold ${styles[status]}`}>{icon}{status}</span>;
}

function iconeCategoria(categoria) {
  if (categoria === "Cardiologia") return <HeartPulse size={18} />;
  if (categoria === "Imagem") return <Activity size={18} />;
  return <FileText size={18} />;
}

function InfoTile({ icon, title, text }) {
  return <div className="flex gap-3 rounded-xl border border-slate-100 bg-[#FBFCFE] p-3.5"><div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-[#174693] shadow-sm">{icon}</div><div><p className="text-xs font-bold text-slate-700">{title}</p><p className="mt-1 text-xs leading-5 text-slate-500">{text}</p></div></div>;
}

function ProgressLine({ label, value, total, color }) {
  const percent = total > 0 ? Math.round((value / total) * 100) : 0;
  return <div><div className="mb-2 flex items-center justify-between gap-3 text-xs"><span className="font-medium text-slate-600">{label}</span><span className="font-bold text-slate-800">{value} <span className="font-normal text-slate-400">({percent}%)</span></span></div><div className="h-2 overflow-hidden rounded-full bg-slate-100"><div className={`h-full rounded-full transition-all ${color}`} style={{ width: `${percent}%` }} /></div></div>;
}

function DetailPill({ label, value, icon }) {
  return <div className="rounded-xl border border-slate-200 bg-white p-3"><div className="flex items-center gap-1.5 text-slate-400">{icon}<span className="text-[10px] font-semibold uppercase tracking-wider">{label}</span></div><p className="mt-2 text-sm font-bold text-[#0B1756]">{value}</p></div>;
}

function DetailField({ label, value, icon }) {
  return <div className="min-w-0 rounded-xl border border-slate-100 bg-[#FBFCFE] p-3.5"><p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">{label}</p><p className="mt-1.5 flex items-start gap-1.5 text-sm font-semibold leading-5 text-slate-700">{icon && <span className="mt-0.5 shrink-0 text-[#174693]">{icon}</span>}<span className="break-words">{value || "Não informado"}</span></p></div>;
}
