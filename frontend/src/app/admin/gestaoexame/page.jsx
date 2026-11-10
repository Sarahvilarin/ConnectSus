"use client";

import { useMemo, useState } from "react";
import {
  AlertCircle,
  ArrowRight,
  Building2,
  CalendarDays,
  CalendarClock,
  Check,
  CheckCircle2,
  ChevronDown,
  ClipboardList,
  Clock3,
  Edit3,
  FileText,
  Filter,
  FlaskConical,
  Info,
  ListChecks,
  MapPin,
  Plus,
  Search,
  ShieldCheck,
  Stethoscope,
  Trash2,
  UserRound,
  X,
} from "lucide-react";

const PACIENTES = [
  { id: 1, nome: "Mariana Silva Costa", cpf: "123.456.789-00", idade: 28, telefone: "(11) 98765-4321" },
  { id: 2, nome: "João Pedro Alves", cpf: "987.654.321-00", idade: 44, telefone: "(11) 97654-3210" },
  { id: 3, nome: "Carlos Eduardo Lima", cpf: "111.222.333-44", idade: 61, telefone: "(11) 96543-2109" },
  { id: 4, nome: "Ana Beatriz Martins", cpf: "222.333.444-55", idade: 35, telefone: "(11) 95432-1098" },
];

const EXAMES = [
  { id: 1, nome: "Hemograma completo", categoria: "Laboratorial", preparo: "Não exige preparo específico, salvo orientação profissional." },
  { id: 2, nome: "Glicemia em jejum", categoria: "Laboratorial", preparo: "Pode exigir jejum. Siga a orientação da equipe de saúde." },
  { id: 3, nome: "Urina tipo I", categoria: "Laboratorial", preparo: "Realize a coleta conforme as instruções da unidade." },
  { id: 4, nome: "Raio-X", categoria: "Imagem", preparo: "Retire objetos metálicos da região examinada, quando solicitado." },
  { id: 5, nome: "Ultrassom abdominal", categoria: "Imagem", preparo: "O preparo varia conforme o tipo de ultrassom. Confirme com a unidade." },
  { id: 6, nome: "Eletrocardiograma", categoria: "Cardiologia", preparo: "Use roupas confortáveis e informe medicamentos em uso." },
  { id: 7, nome: "Ecocardiograma", categoria: "Cardiologia", preparo: "Geralmente não exige preparo específico. Confirme na unidade." },
];

const UNIDADES = [
  { id: 1, nome: "Hospital Municipal de Emergências Albert Sabin", bairro: "Santa Paula", endereco: "São Caetano do Sul - SP", exames: [1, 2, 3, 4, 6, 7] },
  { id: 2, nome: "Hospital Municipal Maria Braido", bairro: "Santa Paula", endereco: "São Caetano do Sul - SP", exames: [1, 2, 4, 5, 6, 7] },
  { id: 3, nome: "Atende Fácil Saúde Pedro Kassab", bairro: "Centro", endereco: "São Caetano do Sul - SP", exames: [1, 2, 3, 5, 7] },
];

const HORARIOS = ["07:00", "07:30", "08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00"];

function dataLocalISO() {
  const hoje = new Date();
  const ano = hoje.getFullYear();
  const mes = String(hoje.getMonth() + 1).padStart(2, "0");
  const dia = String(hoje.getDate()).padStart(2, "0");
  return `${ano}-${mes}-${dia}`;
}

function adicionarDiasISO(dias) {
  const data = new Date();
  data.setDate(data.getDate() + dias);
  const ano = data.getFullYear();
  const mes = String(data.getMonth() + 1).padStart(2, "0");
  const dia = String(data.getDate()).padStart(2, "0");
  return `${ano}-${mes}-${dia}`;
}

function formatarData(valor) {
  if (!valor) return "Não definida";
  const [ano, mes, dia] = valor.split("-");
  return `${dia}/${mes}/${ano}`;
}

function iniciais(nome = "") {
  return nome.split(" ").filter(Boolean).slice(0, 2).map((parte) => parte[0]).join("").toUpperCase();
}

const AGENDAMENTOS_INICIAIS = [
  {
    id: 1001,
    paciente: PACIENTES[0],
    exame: EXAMES[0],
    unidade: UNIDADES[1],
    data: adicionarDiasISO(2),
    horario: "08:30",
    status: "Confirmado",
    observacoes: "Comparecer com documento com foto e pedido médico.",
  },
  {
    id: 1002,
    paciente: PACIENTES[1],
    exame: EXAMES[4],
    unidade: UNIDADES[2],
    data: adicionarDiasISO(2),
    horario: "10:00",
    status: "Aguardando confirmação",
    observacoes: "Orientar paciente sobre o preparo antes do exame.",
  },
  {
    id: 1003,
    paciente: PACIENTES[2],
    exame: EXAMES[5],
    unidade: UNIDADES[0],
    data: adicionarDiasISO(3),
    horario: "14:00",
    status: "Confirmado",
    observacoes: "",
  },
  {
    id: 1004,
    paciente: PACIENTES[3],
    exame: EXAMES[1],
    unidade: UNIDADES[2],
    data: adicionarDiasISO(-1),
    horario: "07:30",
    status: "Realizado",
    observacoes: "",
  },
];

export default function GestaoExamesPage() {
  const [aba, setAba] = useState("novo");
  const [agendamentos, setAgendamentos] = useState(AGENDAMENTOS_INICIAIS);

  const [buscaPaciente, setBuscaPaciente] = useState("");
  const [paciente, setPaciente] = useState(null);
  const [exameId, setExameId] = useState("");
  const [unidadeId, setUnidadeId] = useState("");
  const [data, setData] = useState(adicionarDiasISO(1));
  const [horario, setHorario] = useState("");
  const [observacoes, setObservacoes] = useState("");
  const [erro, setErro] = useState("");
  const [editandoId, setEditandoId] = useState(null);
  const [buscaLista, setBuscaLista] = useState("");
  const [filtroStatus, setFiltroStatus] = useState("Todos");
  const [agendamentoExcluir, setAgendamentoExcluir] = useState(null);
  const [detalhe, setDetalhe] = useState(null);
  const [aviso, setAviso] = useState("");

  const exameSelecionado = EXAMES.find((item) => item.id === Number(exameId));
  const unidadeSelecionada = UNIDADES.find((item) => item.id === Number(unidadeId));

  const pacientesEncontrados = useMemo(() => {
    const termo = buscaPaciente.trim().toLowerCase();
    if (!termo || paciente) return [];
    return PACIENTES.filter((item) =>
      item.nome.toLowerCase().includes(termo) || item.cpf.includes(termo)
    );
  }, [buscaPaciente, paciente]);

  const unidadesDisponiveis = useMemo(() => {
    if (!exameSelecionado) return [];
    return UNIDADES.filter((unidade) => unidade.exames.includes(exameSelecionado.id));
  }, [exameSelecionado]);

  const agendamentosFiltrados = useMemo(() => {
    const termo = buscaLista.trim().toLowerCase();
    return agendamentos
      .filter((item) => filtroStatus === "Todos" || item.status === filtroStatus)
      .filter((item) => {
        if (!termo) return true;
        return (
          item.paciente.nome.toLowerCase().includes(termo) ||
          item.paciente.cpf.includes(termo) ||
          item.exame.nome.toLowerCase().includes(termo) ||
          item.unidade.nome.toLowerCase().includes(termo) ||
          String(item.id).includes(termo)
        );
      })
      .sort((a, b) => `${a.data} ${a.horario}`.localeCompare(`${b.data} ${b.horario}`));
  }, [agendamentos, buscaLista, filtroStatus]);

  const indicadores = useMemo(() => ({
    total: agendamentos.length,
    confirmados: agendamentos.filter((item) => item.status === "Confirmado").length,
    aguardando: agendamentos.filter((item) => item.status === "Aguardando confirmação").length,
    realizados: agendamentos.filter((item) => item.status === "Realizado").length,
  }), [agendamentos]);

  const horariosOcupados = agendamentos
    .filter((item) => item.unidade.id === Number(unidadeId) && item.data === data && item.id !== editandoId && !["Cancelado", "Realizado"].includes(item.status))
    .map((item) => item.horario);

  function limparFormulario() {
    setBuscaPaciente("");
    setPaciente(null);
    setExameId("");
    setUnidadeId("");
    setData(adicionarDiasISO(1));
    setHorario("");
    setObservacoes("");
    setErro("");
    setEditandoId(null);
  }

  function selecionarPaciente(item) {
    setPaciente(item);
    setBuscaPaciente(item.nome);
    setErro("");
  }

  function salvarAgendamento(event) {
    event.preventDefault();
    if (!paciente || !exameSelecionado || !unidadeSelecionada || !data || !horario) {
      setErro("Preencha paciente, exame, unidade, data e horário para continuar.");
      return;
    }
    if (data < dataLocalISO()) {
      setErro("Selecione uma data igual ou posterior a hoje.");
      return;
    }
    if (horariosOcupados.includes(horario)) {
      setErro("Este horário já está ocupado nesta unidade. Escolha outro horário.");
      return;
    }

    const registro = {
      id: editandoId || Date.now(),
      paciente,
      exame: exameSelecionado,
      unidade: unidadeSelecionada,
      data,
      horario,
      status: editandoId ? "Aguardando confirmação" : "Aguardando confirmação",
      observacoes: observacoes.trim(),
    };

    if (editandoId) {
      setAgendamentos((atuais) => atuais.map((item) => item.id === editandoId ? registro : item));
      setAviso("Agendamento atualizado. A confirmação do horário deve ser comunicada ao paciente.");
    } else {
      setAgendamentos((atuais) => [registro, ...atuais]);
      setAviso("Agendamento cadastrado. O paciente está aguardando confirmação.");
    }
    limparFormulario();
    setAba("lista");
    setBuscaLista("");
    setFiltroStatus("Todos");
  }

  function editarAgendamento(item) {
    setEditandoId(item.id);
    setPaciente(item.paciente);
    setBuscaPaciente(item.paciente.nome);
    setExameId(String(item.exame.id));
    setUnidadeId(String(item.unidade.id));
    setData(item.data);
    setHorario(item.horario);
    setObservacoes(item.observacoes || "");
    setErro("");
    setAba("novo");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function excluirAgendamento() {
    if (!agendamentoExcluir) return;
    setAgendamentos((atuais) => atuais.filter((item) => item.id !== agendamentoExcluir.id));
    setAgendamentoExcluir(null);
    setAviso("Agendamento excluído da lista demonstrativa.");
  }

  function alterarStatus(item, status) {
    setAgendamentos((atuais) => atuais.map((registro) =>
      registro.id === item.id ? { ...registro, status } : registro
    ));
    setDetalhe(null);
    setAviso(`Status atualizado para "${status}".`);
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#F1F6FB] text-[#0B1756]">
      <div className="pointer-events-none absolute -left-40 top-72 h-96 w-96 rounded-full bg-[#D9EAF8]/70" />
      <div className="pointer-events-none absolute -right-48 top-24 h-[34rem] w-[34rem] rounded-full bg-[#D3E5F7]/70" />
      <div className="pointer-events-none absolute right-[12%] top-[950px] h-56 w-56 rounded-full border-[42px] border-white/80" />

      <div className="relative z-10 mx-auto max-w-[1480px] px-4 pb-14 pt-7 sm:px-6 lg:px-8">
        <section className="relative overflow-hidden rounded-[30px] bg-gradient-to-br from-[#174693] via-[#234E96] to-[#151A67] px-6 py-8 text-white shadow-[0_20px_55px_rgba(2,62,138,0.16)] sm:px-9 lg:px-10">
          <div className="pointer-events-none absolute -right-16 -top-32 h-80 w-80 rounded-full bg-white/10" />
          <div className="pointer-events-none absolute left-[42%] top-10 h-56 w-56 rounded-full border-[36px] border-white/[0.05]" />
          <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-semibold">
                <Stethoscope size={14} /> Gestão clínica · Rede UneSUS
              </span>
              <h1 className="mt-4 text-3xl font-bold leading-tight sm:text-4xl">Gestão de Agendamentos de Exames</h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-blue-100 sm:text-base">
                Cadastre, organize e acompanhe os exames dos pacientes da rede. Defina o procedimento, a unidade, a data e o horário do atendimento.
              </p>
            </div>
            <div className="grid w-full max-w-[410px] grid-cols-2 gap-3">
              <HeroInfo icon={<ShieldCheck size={18} />} titulo="Gestão segura" texto="Área administrativa" />
              <HeroInfo icon={<CalendarClock size={18} />} titulo="Agenda da rede" texto="Controle de horários" />
            </div>
          </div>
        </section>

        <section className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard icon={<ClipboardList size={20} />} label="Agendamentos cadastrados" value={indicadores.total} tone="blue" />
          <MetricCard icon={<CheckCircle2 size={20} />} label="Confirmados" value={indicadores.confirmados} tone="green" />
          <MetricCard icon={<Clock3 size={20} />} label="Aguardando confirmação" value={indicadores.aguardando} tone="amber" />
          <MetricCard icon={<FileText size={20} />} label="Exames realizados" value={indicadores.realizados} tone="slate" />
        </section>

        <section className="mt-6 overflow-hidden rounded-[24px] border border-[#DCE8F3] bg-white shadow-[0_12px_36px_rgba(2,62,138,0.07)]">
          <div className="grid grid-cols-2 gap-2 p-2 sm:p-3">
            <button
              type="button"
              onClick={() => { setAba("novo"); setAviso(""); }}
              className={`flex min-h-12 items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-bold transition ${aba === "novo" ? "bg-[#194391] text-white shadow-sm" : "text-[#174693] hover:bg-[#F0F5FA]"}`}
            >
              <Plus size={17} /> {editandoId ? "Editar agendamento" : "Novo agendamento"}
            </button>
            <button
              type="button"
              onClick={() => { setAba("lista"); setAviso(""); }}
              className={`flex min-h-12 items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-bold transition ${aba === "lista" ? "bg-[#194391] text-white shadow-sm" : "text-[#174693] hover:bg-[#F0F5FA]"}`}
            >
              <ListChecks size={17} /> Agendamentos cadastrados ({agendamentos.length})
            </button>
          </div>
        </section>

        {aviso && (
          <div className="mt-4 flex items-start gap-3 rounded-2xl border border-[#C9DDF0] bg-[#EAF3FA] px-4 py-3 text-sm text-[#174693]">
            <Info size={18} className="mt-0.5 shrink-0" />
            <p className="flex-1">{aviso}</p>
            <button type="button" onClick={() => setAviso("")} aria-label="Fechar aviso"><X size={17} /></button>
          </div>
        )}

        {aba === "novo" ? (
          <form onSubmit={salvarAgendamento} className="mt-5">
            <div className="mb-5 rounded-[22px] border border-[#DCE8F3] bg-white p-4 shadow-sm sm:p-5">
              <div className="grid gap-3 md:grid-cols-4">
                <Step number="1" title="Paciente" description={paciente ? paciente.nome : "Localizar cadastro"} active={!paciente} done={!!paciente} />
                <Step number="2" title="Exame e unidade" description={exameSelecionado ? exameSelecionado.nome : "Definir procedimento"} active={!!paciente && !exameSelecionado} done={!!exameSelecionado && !!unidadeSelecionada} />
                <Step number="3" title="Data e horário" description={data && horario ? `${formatarData(data)} · ${horario}` : "Escolher disponibilidade"} active={!!unidadeSelecionada && !horario} done={!!horario} />
                <Step number="4" title="Finalização" description="Salvar agendamento" active={!!paciente && !!exameSelecionado && !!unidadeSelecionada && !!horario} done={false} />
              </div>
            </div>

            <div className="grid items-start gap-5 xl:grid-cols-[minmax(0,1.65fr)_minmax(320px,0.85fr)]">
              <div className="space-y-5">
                <section className="rounded-[24px] border border-[#DCE8F3] bg-white p-5 shadow-[0_10px_30px_rgba(2,62,138,0.05)] sm:p-7">
                  <SectionHeading number="01" icon={<UserRound size={20} />} title="Identificação do paciente" description="Localize a pessoa que receberá o agendamento." />
                  <div className="relative mt-5">
                    <label className="mb-2 block text-sm font-semibold text-[#0B1756]">Buscar por nome ou CPF <span className="text-red-500">*</span></label>
                    <div className="relative">
                      <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        value={buscaPaciente}
                        onChange={(event) => { setBuscaPaciente(event.target.value); setPaciente(null); setErro(""); }}
                        placeholder="Digite o nome ou CPF do paciente"
                        className="h-13 w-full rounded-xl border border-slate-200 bg-[#F8FAFD] py-3 pl-11 pr-4 text-sm outline-none transition focus:border-[#3563A7] focus:bg-white focus:ring-4 focus:ring-[#3563A7]/10"
                      />
                      {pacientesEncontrados.length > 0 && (
                        <div className="absolute left-0 right-0 top-full z-30 mt-2 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl">
                          {pacientesEncontrados.map((item) => (
                            <button key={item.id} type="button" onClick={() => selecionarPaciente(item)} className="flex w-full items-center gap-3 border-b border-slate-100 px-4 py-3 text-left last:border-0 hover:bg-[#F3F7FC]">
                              <Avatar nome={item.nome} />
                              <span className="min-w-0 flex-1">
                                <span className="block text-sm font-semibold text-[#0B1756]">{item.nome}</span>
                                <span className="mt-0.5 block text-xs text-slate-500">CPF: {item.cpf} · {item.idade} anos</span>
                              </span>
                              <ChevronDown size={16} className="text-slate-400" />
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                    {paciente && (
                      <div className="mt-4 flex flex-col gap-3 rounded-2xl border border-emerald-200 bg-emerald-50/70 p-4 sm:flex-row sm:items-center">
                        <Avatar nome={paciente.nome} />
                        <div className="min-w-0 flex-1">
                          <p className="font-bold text-[#0B1756]">{paciente.nome}</p>
                          <p className="mt-1 text-xs text-slate-600">CPF: {paciente.cpf} · {paciente.idade} anos · {paciente.telefone}</p>
                        </div>
                        <button type="button" onClick={() => { setPaciente(null); setBuscaPaciente(""); }} className="rounded-lg border border-emerald-200 bg-white px-3 py-2 text-xs font-semibold text-emerald-800 hover:bg-emerald-100">Trocar paciente</button>
                      </div>
                    )}
                    {erro && <p className="mt-3 flex items-center gap-2 text-sm text-red-600"><AlertCircle size={16} /> {erro}</p>}
                    <p className="mt-3 flex items-center gap-2 text-xs text-slate-500"><Info size={14} /> Selecione um cadastro existente para vincular o exame ao paciente correto.</p>
                  </div>
                </section>

                <section className="rounded-[24px] border border-[#DCE8F3] bg-white p-5 shadow-[0_10px_30px_rgba(2,62,138,0.05)] sm:p-7">
                  <SectionHeading number="02" icon={<FlaskConical size={20} />} title="Procedimento e unidade" description="Escolha o exame e o local onde será realizado." />
                  <div className="mt-5">
                    <label className="mb-2 block text-sm font-semibold text-[#0B1756]">Tipo de exame <span className="text-red-500">*</span></label>
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                      {EXAMES.map((item) => {
                        const ativo = exameId === String(item.id);
                        return (
                          <button key={item.id} type="button" onClick={() => { setExameId(String(item.id)); setUnidadeId(""); setHorario(""); }} className={`rounded-2xl border p-4 text-left transition ${ativo ? "border-[#174693] bg-[#EFF5FC] ring-2 ring-[#174693]/10" : "border-slate-200 bg-[#FBFCFE] hover:border-[#B8CEE4] hover:bg-[#F7FAFD]"}`}>
                            <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${ativo ? "bg-[#174693] text-white" : "bg-[#EAF1F8] text-[#174693]"}`}><FileText size={19} /></span>
                            <span className="mt-3 block text-sm font-bold text-[#0B1756]">{item.nome}</span>
                            <span className="mt-1 inline-flex rounded-full bg-[#EAF1F8] px-2 py-1 text-[10px] font-semibold text-[#3563A7]">{item.categoria}</span>
                            {ativo && <span className="mt-3 flex items-center gap-1 text-xs font-semibold text-[#174693]"><Check size={14} /> Selecionado</span>}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="mt-6">
                    <label className="mb-2 block text-sm font-semibold text-[#0B1756]">Unidade de atendimento <span className="text-red-500">*</span></label>
                    {!exameSelecionado ? (
                      <EmptyState icon={<Building2 size={22} />} title="Selecione um exame primeiro" description="As unidades que realizam o procedimento aparecerão aqui." />
                    ) : (
                      <div className="grid gap-3 lg:grid-cols-2">
                        {unidadesDisponiveis.map((item) => {
                          const ativo = unidadeId === String(item.id);
                          return (
                            <button key={item.id} type="button" onClick={() => { setUnidadeId(String(item.id)); setHorario(""); }} className={`flex gap-3 rounded-2xl border p-4 text-left transition ${ativo ? "border-[#174693] bg-[#EFF5FC] ring-2 ring-[#174693]/10" : "border-slate-200 bg-white hover:border-[#B8CEE4]"}`}>
                              <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${ativo ? "bg-[#174693] text-white" : "bg-[#EAF1F8] text-[#174693]"}`}><Building2 size={20} /></span>
                              <span className="min-w-0 flex-1">
                                <span className="block text-sm font-bold text-[#0B1756]">{item.nome}</span>
                                <span className="mt-1 flex items-center gap-1 text-xs text-slate-500"><MapPin size={13} /> {item.bairro} · {item.endereco}</span>
                                {ativo && <span className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-[#174693]"><Check size={13} /> Unidade selecionada</span>}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </section>

                <section className="rounded-[24px] border border-[#DCE8F3] bg-white p-5 shadow-[0_10px_30px_rgba(2,62,138,0.05)] sm:p-7">
                  <SectionHeading number="03" icon={<CalendarClock size={20} />} title="Data e horário do exame" description="Defina quando o paciente deverá comparecer à unidade." />
                  {!unidadeSelecionada ? (
                    <div className="mt-5"><EmptyState icon={<CalendarDays size={22} />} title="Escolha a unidade de atendimento" description="Depois de selecionar o local, você poderá definir a data e o horário." /></div>
                  ) : (
                    <div className="mt-5 grid gap-5 md:grid-cols-[minmax(220px,0.8fr)_minmax(0,1.2fr)]">
                      <div>
                        <label className="mb-2 block text-sm font-semibold text-[#0B1756]">Data <span className="text-red-500">*</span></label>
                        <div className="relative">
                          <CalendarDays size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#3563A7]" />
                          <input type="date" min={dataLocalISO()} value={data} onChange={(event) => { setData(event.target.value); setHorario(""); }} className="h-12 w-full rounded-xl border border-slate-200 bg-[#F8FAFD] pl-11 pr-3 text-sm text-[#0B1756] outline-none focus:border-[#3563A7] focus:ring-4 focus:ring-[#3563A7]/10" />
                        </div>
                        <p className="mt-2 text-xs text-slate-500">Data selecionada: <strong className="text-[#174693]">{formatarData(data)}</strong></p>
                      </div>
                      <div>
                        <div className="mb-2 flex items-center justify-between gap-2">
                          <label className="block text-sm font-semibold text-[#0B1756]">Horários disponíveis <span className="text-red-500">*</span></label>
                          <span className="text-xs text-slate-500">{HORARIOS.length - horariosOcupados.length} opções</span>
                        </div>
                        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                          {HORARIOS.map((hora) => {
                            const ocupado = horariosOcupados.includes(hora);
                            const ativo = horario === hora;
                            return (
                              <button key={hora} type="button" disabled={ocupado} onClick={() => setHorario(hora)} className={`rounded-xl border px-2 py-3 text-sm font-semibold transition ${ocupado ? "cursor-not-allowed border-slate-100 bg-slate-100 text-slate-300 line-through" : ativo ? "border-[#174693] bg-[#174693] text-white shadow-sm" : "border-slate-200 bg-white text-[#174693] hover:border-[#174693] hover:bg-[#EFF5FC]"}`}>{hora}</button>
                            );
                          })}
                        </div>
                        <p className="mt-2 text-xs text-slate-500">Horários ocupados nesta unidade e data ficam indisponíveis.</p>
                      </div>
                    </div>
                  )}
                </section>

                <section className="rounded-[24px] border border-[#DCE8F3] bg-white p-5 shadow-[0_10px_30px_rgba(2,62,138,0.05)] sm:p-7">
                  <SectionHeading number="04" icon={<FileText size={20} />} title="Orientações e observações" description="Inclua informações que devem ser repassadas ao paciente." />
                  {exameSelecionado && (
                    <div className="mt-5 flex gap-3 rounded-xl border border-blue-100 bg-blue-50/70 p-4">
                      <Info size={18} className="mt-0.5 shrink-0 text-[#174693]" />
                      <div>
                        <p className="text-sm font-semibold text-[#174693]">Orientação de preparo</p>
                        <p className="mt-1 text-sm leading-5 text-slate-600">{exameSelecionado.preparo}</p>
                      </div>
                    </div>
                  )}
                  <label className="mb-2 mt-5 block text-sm font-semibold text-[#0B1756]">Observações para o paciente (opcional)</label>
                  <textarea value={observacoes} onChange={(event) => setObservacoes(event.target.value)} rows={3} maxLength={500} placeholder="Ex.: chegar com 15 minutos de antecedência, levar pedido médico e documento com foto..." className="w-full resize-y rounded-xl border border-slate-200 bg-[#F8FAFD] px-4 py-3 text-sm outline-none focus:border-[#3563A7] focus:bg-white focus:ring-4 focus:ring-[#3563A7]/10" />
                  <p className="mt-1 text-right text-xs text-slate-400">{observacoes.length}/500</p>
                </section>
              </div>

              <aside className="space-y-5 xl:sticky xl:top-5">
                <section className="rounded-[24px] border border-[#DCE8F3] bg-white p-5 shadow-[0_10px_30px_rgba(2,62,138,0.06)] sm:p-6">
                  <div className="flex items-center gap-3">
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#EAF1F8] text-[#174693]"><ClipboardList size={20} /></span>
                    <div>
                      <h2 className="font-bold text-[#0B1756]">Resumo do agendamento</h2>
                      <p className="text-xs text-slate-500">Confira antes de salvar.</p>
                    </div>
                  </div>
                  <div className="mt-5 space-y-4">
                    <SummaryLine label="Paciente" value={paciente?.nome || "Não selecionado"} />
                    <SummaryLine label="Exame" value={exameSelecionado?.nome || "Não selecionado"} />
                    <SummaryLine label="Unidade" value={unidadeSelecionada?.nome || "Não selecionada"} />
                    <SummaryLine label="Data" value={formatarData(data)} />
                    <SummaryLine label="Horário" value={horario || "Não selecionado"} />
                  </div>
                  <div className="mt-5 rounded-xl bg-[#F1F6FB] p-4">
                    <p className="flex items-center gap-2 text-xs font-bold text-[#174693]"><ShieldCheck size={15} /> Controle administrativo</p>
                    <p className="mt-1 text-xs leading-5 text-slate-500">Ao salvar, o agendamento entra na lista com status “Aguardando confirmação”.</p>
                  </div>
                  <button type="submit" className="mt-5 flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#194391] px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-[#0B1756]">
                    <CheckCircle2 size={18} /> {editandoId ? "Salvar alterações" : "Cadastrar agendamento"}
                  </button>
                  {editandoId && <button type="button" onClick={() => { limparFormulario(); setAba("lista"); }} className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50">Cancelar edição</button>}
                </section>

                <section className="rounded-[24px] border border-[#DCE8F3] bg-white p-5 shadow-sm">
                  <h3 className="font-bold text-[#0B1756]">Etapas do cadastro</h3>
                  <div className="mt-4 space-y-4">
                    <ChecklistItem done={!!paciente} title="Paciente identificado" description="Cadastro localizado na rede." />
                    <ChecklistItem done={!!exameSelecionado && !!unidadeSelecionada} title="Exame e unidade definidos" description="Procedimento disponível no local." />
                    <ChecklistItem done={!!data && !!horario && !!unidadeSelecionada} title="Data e horário escolhidos" description="Horário livre na agenda demonstrativa." />
                  </div>
                </section>
              </aside>
            </div>
          </form>
        ) : (
          <section className="mt-5 overflow-hidden rounded-[24px] border border-[#DCE8F3] bg-white shadow-[0_12px_36px_rgba(2,62,138,0.07)]">
            <div className="flex flex-col gap-4 border-b border-slate-100 p-5 sm:p-7 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 className="text-xl font-bold text-[#0B1756]">Exames agendados na rede</h2>
                <p className="mt-1 text-sm text-slate-500">Consulte os agendamentos e gerencie alterações de data, horário e unidade.</p>
              </div>
              <button type="button" onClick={() => { limparFormulario(); setAba("novo"); }} className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#194391] px-4 py-3 text-sm font-bold text-white hover:bg-[#0B1756]"><Plus size={17} /> Novo agendamento</button>
            </div>

            <div className="grid gap-3 p-5 sm:grid-cols-[minmax(0,1fr)_220px] sm:p-6">
              <div className="relative">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input value={buscaLista} onChange={(event) => setBuscaLista(event.target.value)} placeholder="Buscar paciente, CPF, exame, unidade ou protocolo..." className="h-12 w-full rounded-xl border border-slate-200 bg-[#F8FAFD] pl-11 pr-4 text-sm outline-none focus:border-[#3563A7] focus:bg-white focus:ring-4 focus:ring-[#3563A7]/10" />
              </div>
              <div className="relative">
                <Filter size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <select value={filtroStatus} onChange={(event) => setFiltroStatus(event.target.value)} className="h-12 w-full appearance-none rounded-xl border border-slate-200 bg-[#F8FAFD] pl-10 pr-9 text-sm text-[#0B1756] outline-none focus:border-[#3563A7]">
                  {["Todos", "Aguardando confirmação", "Confirmado", "Realizado", "Cancelado"].map((status) => <option key={status}>{status}</option>)}
                </select>
                <ChevronDown size={15} className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              </div>
            </div>

            <div className="flex flex-wrap gap-2 px-5 pb-5 sm:px-6">
              <StatusPill status="Todos" active={filtroStatus === "Todos"} onClick={() => setFiltroStatus("Todos")} />
              <StatusPill status="Aguardando confirmação" active={filtroStatus === "Aguardando confirmação"} onClick={() => setFiltroStatus("Aguardando confirmação")} />
              <StatusPill status="Confirmado" active={filtroStatus === "Confirmado"} onClick={() => setFiltroStatus("Confirmado")} />
              <StatusPill status="Realizado" active={filtroStatus === "Realizado"} onClick={() => setFiltroStatus("Realizado")} />
            </div>

            <div className="hidden overflow-x-auto border-t border-slate-100 md:block">
              <table className="w-full min-w-[980px] text-left">
                <thead className="bg-[#F7FAFD] text-[11px] uppercase tracking-wide text-slate-500">
                  <tr>
                    <th className="px-6 py-4 font-bold">Paciente</th>
                    <th className="px-4 py-4 font-bold">Exame</th>
                    <th className="px-4 py-4 font-bold">Unidade</th>
                    <th className="px-4 py-4 font-bold">Data e horário</th>
                    <th className="px-4 py-4 font-bold">Situação</th>
                    <th className="px-6 py-4 text-right font-bold">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {agendamentosFiltrados.map((item) => (
                    <tr key={item.id} className="transition hover:bg-[#FAFCFE]">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <Avatar nome={item.paciente.nome} />
                          <div>
                            <p className="text-sm font-bold text-[#0B1756]">{item.paciente.nome}</p>
                            <p className="mt-0.5 text-xs text-slate-500">{item.paciente.cpf}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4"><p className="text-sm font-semibold text-[#0B1756]">{item.exame.nome}</p><p className="mt-0.5 text-xs text-slate-500">{item.exame.categoria}</p></td>
                      <td className="max-w-[220px] px-4 py-4"><p className="text-sm text-slate-700">{item.unidade.nome}</p><p className="mt-0.5 text-xs text-slate-500">{item.unidade.bairro}</p></td>
                      <td className="px-4 py-4"><p className="text-sm font-semibold text-[#0B1756]">{formatarData(item.data)}</p><p className="mt-0.5 flex items-center gap-1 text-xs text-slate-500"><Clock3 size={12} /> {item.horario}</p></td>
                      <td className="px-4 py-4"><StatusBadge status={item.status} /></td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-1">
                          <button type="button" onClick={() => setDetalhe(item)} title="Ver detalhes" className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-[#174693]"><Info size={17} /></button>
                          <button type="button" onClick={() => editarAgendamento(item)} title="Editar agendamento" className="rounded-lg p-2 text-[#174693] hover:bg-[#EAF1F8]"><Edit3 size={17} /></button>
                          <button type="button" onClick={() => setAgendamentoExcluir(item)} title="Excluir agendamento" className="rounded-lg p-2 text-red-500 hover:bg-red-50"><Trash2 size={17} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {agendamentosFiltrados.length === 0 && <EmptyState icon={<Search size={22} />} title="Nenhum agendamento encontrado" description="Altere a busca ou o filtro para ver outros registros." />}
            </div>

            <div className="space-y-3 border-t border-slate-100 p-4 md:hidden">
              {agendamentosFiltrados.map((item) => (
                <article key={item.id} className="rounded-2xl border border-slate-200 p-4">
                  <div className="flex items-start gap-3">
                    <Avatar nome={item.paciente.nome} />
                    <div className="min-w-0 flex-1">
                      <p className="font-bold text-[#0B1756]">{item.paciente.nome}</p>
                      <p className="mt-1 text-xs text-slate-500">{item.paciente.cpf}</p>
                      <div className="mt-2"><StatusBadge status={item.status} /></div>
                    </div>
                  </div>
                  <div className="mt-4 space-y-2 border-t border-slate-100 pt-3 text-sm">
                    <p><span className="text-slate-500">Exame: </span><strong>{item.exame.nome}</strong></p>
                    <p><span className="text-slate-500">Unidade: </span>{item.unidade.nome}</p>
                    <p><span className="text-slate-500">Data: </span>{formatarData(item.data)} às {item.horario}</p>
                  </div>
                  <div className="mt-4 flex gap-2">
                    <button type="button" onClick={() => setDetalhe(item)} className="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600">Detalhes</button>
                    <button type="button" onClick={() => editarAgendamento(item)} className="flex-1 rounded-lg bg-[#EAF1F8] px-3 py-2 text-xs font-semibold text-[#174693]">Editar</button>
                    <button type="button" onClick={() => setAgendamentoExcluir(item)} aria-label="Excluir" className="rounded-lg bg-red-50 px-3 py-2 text-red-600"><Trash2 size={16} /></button>
                  </div>
                </article>
              ))}
              {agendamentosFiltrados.length === 0 && <EmptyState icon={<Search size={22} />} title="Nenhum agendamento encontrado" description="Altere a busca ou o filtro para ver outros registros." />}
            </div>
            <div className="flex items-center justify-between border-t border-slate-100 px-5 py-4 text-xs text-slate-500 sm:px-6">
              <span>Exibindo {agendamentosFiltrados.length} de {agendamentos.length} agendamentos</span>
              <span>Dados demonstrativos</span>
            </div>
          </section>
        )}
      </div>

      {agendamentoExcluir && (
        <Modal onClose={() => setAgendamentoExcluir(null)} title="Excluir agendamento">
          <div className="flex gap-3 rounded-xl border border-red-100 bg-red-50 p-4">
            <AlertCircle size={20} className="mt-0.5 shrink-0 text-red-600" />
            <p className="text-sm leading-6 text-red-800">Deseja realmente excluir o agendamento de <strong>{agendamentoExcluir.paciente.nome}</strong> para <strong>{agendamentoExcluir.exame.nome}</strong>? Esta ação remove o item da lista demonstrativa.</p>
          </div>
          <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <button type="button" onClick={() => setAgendamentoExcluir(null)} className="rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-600">Manter agendamento</button>
            <button type="button" onClick={excluirAgendamento} className="rounded-xl bg-red-600 px-4 py-3 text-sm font-bold text-white hover:bg-red-700">Excluir agendamento</button>
          </div>
        </Modal>
      )}

      {detalhe && (
        <Modal onClose={() => setDetalhe(null)} title="Detalhes do agendamento">
          <div className="flex items-center gap-3 rounded-xl bg-[#F1F6FB] p-4">
            <Avatar nome={detalhe.paciente.nome} />
            <div><p className="font-bold text-[#0B1756]">{detalhe.paciente.nome}</p><p className="text-xs text-slate-500">{detalhe.paciente.cpf} · {detalhe.paciente.idade} anos</p></div>
          </div>
          <div className="mt-4 space-y-3">
            <SummaryLine label="Exame" value={detalhe.exame.nome} />
            <SummaryLine label="Categoria" value={detalhe.exame.categoria} />
            <SummaryLine label="Unidade" value={detalhe.unidade.nome} />
            <SummaryLine label="Data" value={formatarData(detalhe.data)} />
            <SummaryLine label="Horário" value={detalhe.horario} />
            <SummaryLine label="Situação" value={detalhe.status} />
            <SummaryLine label="Orientações" value={detalhe.observacoes || detalhe.exame.preparo} />
          </div>
          <div className="mt-5 flex flex-wrap justify-end gap-2">
            {detalhe.status !== "Confirmado" && detalhe.status !== "Realizado" && (
              <button type="button" onClick={() => alterarStatus(detalhe, "Confirmado")} className="rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white">Marcar confirmado</button>
            )}
            {detalhe.status !== "Realizado" && detalhe.status !== "Cancelado" && (
              <button type="button" onClick={() => alterarStatus(detalhe, "Realizado")} className="rounded-xl bg-[#194391] px-4 py-2.5 text-sm font-semibold text-white">Marcar realizado</button>
            )}
            {detalhe.status !== "Realizado" && detalhe.status !== "Cancelado" && (
              <button type="button" onClick={() => alterarStatus(detalhe, "Cancelado")} className="rounded-xl border border-red-200 px-4 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50">Cancelar agendamento</button>
            )}
            <button type="button" onClick={() => { setDetalhe(null); editarAgendamento(detalhe); }} className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-[#174693]">Editar</button>
          </div>
        </Modal>
      )}
    </main>
  );
}

function HeroInfo({ icon, titulo, texto }) {
  return <div className="flex items-center gap-3 rounded-2xl border border-white/15 bg-white/10 p-3"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">{icon}</span><span><span className="block text-xs font-bold">{titulo}</span><span className="mt-0.5 block text-[11px] text-blue-100">{texto}</span></span></div>;
}

function MetricCard({ icon, label, value, tone }) {
  const styles = {
    blue: "bg-[#EAF1F8] text-[#174693]",
    green: "bg-emerald-50 text-emerald-700",
    amber: "bg-amber-50 text-amber-700",
    slate: "bg-slate-100 text-slate-600",
  };
  return <div className="flex items-center gap-4 rounded-2xl border border-[#DCE8F3] bg-white p-5 shadow-[0_8px_24px_rgba(2,62,138,0.04)]"><span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${styles[tone]}`}>{icon}</span><span><span className="block text-2xl font-bold leading-none text-[#0B1756]">{value}</span><span className="mt-2 block text-xs font-medium text-slate-500">{label}</span></span></div>;
}

function Step({ number, title, description, active, done }) {
  return <div className="flex min-w-0 items-center gap-3 rounded-xl bg-[#F8FAFD] px-3 py-3"><span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm font-bold ${done ? "bg-emerald-500 text-white" : active ? "bg-[#194391] text-white" : "bg-[#E7EFF7] text-[#174693]"}`}>{done ? <Check size={17} /> : number}</span><span className="min-w-0"><span className="block text-sm font-bold text-[#0B1756]">{title}</span><span className="block truncate text-xs text-slate-500">{description}</span></span></div>;
}

function SectionHeading({ number, icon, title, description }) {
  return <div className="flex items-center gap-3"><span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#EAF1F8] text-[#174693]">{icon}</span><span><span className="block text-[10px] font-bold uppercase tracking-[2px] text-[#3563A7]">Etapa {number}</span><span className="block text-lg font-bold text-[#0B1756]">{title}</span><span className="mt-0.5 block text-xs text-slate-500">{description}</span></span></div>;
}

function Avatar({ nome }) {
  return <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#E5EEF8] text-sm font-bold text-[#174693]">{iniciais(nome)}</span>;
}

function EmptyState({ icon, title, description }) {
  return <div className="flex min-h-36 flex-col items-center justify-center rounded-2xl border border-dashed border-[#D6E3F0] bg-[#F8FAFD] px-4 py-7 text-center"><span className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-[#9CB3CB] shadow-sm">{icon}</span><p className="mt-3 text-sm font-bold text-[#174693]">{title}</p><p className="mt-1 text-xs text-slate-500">{description}</p></div>;
}

function SummaryLine({ label, value }) {
  return <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-3 last:border-0 last:pb-0"><span className="shrink-0 text-xs text-slate-500">{label}</span><span className="max-w-[65%] text-right text-sm font-semibold text-[#0B1756]">{value}</span></div>;
}

function ChecklistItem({ done, title, description }) {
  return <div className="flex items-start gap-3"><span className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${done ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-400"}`}>{done ? <Check size={14} /> : <Clock3 size={13} />}</span><span><span className="block text-sm font-semibold text-[#0B1756]">{title}</span><span className="mt-0.5 block text-xs text-slate-500">{description}</span></span></div>;
}

function StatusBadge({ status }) {
  const style = status === "Confirmado"
    ? "bg-emerald-50 text-emerald-700 border-emerald-100"
    : status === "Realizado"
      ? "bg-blue-50 text-blue-700 border-blue-100"
      : status === "Cancelado"
        ? "bg-red-50 text-red-700 border-red-100"
        : "bg-amber-50 text-amber-700 border-amber-100";
  return <span className={`inline-flex whitespace-nowrap rounded-full border px-2.5 py-1 text-[11px] font-bold ${style}`}>{status}</span>;
}

function StatusPill({ status, active, onClick }) {
  return <button type="button" onClick={onClick} className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${active ? "border-[#174693] bg-[#174693] text-white" : "border-slate-200 bg-white text-slate-600 hover:border-[#B8CEE4]"}`}>{status}</button>;
}

function Modal({ title, onClose, children }) {
  return <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#06194E]/55 p-4 backdrop-blur-sm" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}><div className="w-full max-w-xl rounded-[24px] bg-white p-5 shadow-2xl sm:p-7"><div className="flex items-center justify-between gap-4"><h2 className="text-lg font-bold text-[#0B1756]">{title}</h2><button type="button" onClick={onClose} aria-label="Fechar" className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"><X size={19} /></button></div><div className="mt-5">{children}</div></div></div>;
}
