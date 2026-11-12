"use client";

import { useMemo, useState } from "react";
import {
  Activity,
  AlertCircle,
  CalendarDays,
  CalendarClock,
  Check,
  CheckCircle2,
  ChevronDown,
  ClipboardList,
  Clock3,
  FileHeart,
  FileText,
  Filter,
  FlaskConical,
  HeartPulse,
  Info,
  MapPin,
  Search,
  ShieldCheck,
  Stethoscope,
  UserRound,
  Users,
  X,
  Edit3,
  Trash2,
  Building2,
  ArrowRight,
} from "lucide-react";

const EXAMES = [
  { id: 1, nome: "Hemograma completo", categoria: "Laboratorial", preparo: "Siga as orientações da equipe responsável. O preparo pode variar conforme a solicitação." },
  { id: 2, nome: "Glicemia em jejum", categoria: "Laboratorial", preparo: "Confirme com a unidade se é necessário jejum e por quanto tempo." },
  { id: 3, nome: "Urina tipo I", categoria: "Laboratorial", preparo: "A unidade deve orientar a coleta e o recipiente adequado." },
  { id: 4, nome: "Raio-X de tórax", categoria: "Imagem", preparo: "Siga as instruções da unidade sobre vestuário e objetos metálicos." },
  { id: 5, nome: "Ultrassom abdominal", categoria: "Imagem", preparo: "O preparo varia conforme o protocolo do exame. Confirme as orientações com a unidade." },
  { id: 6, nome: "Eletrocardiograma", categoria: "Cardiologia", preparo: "Use roupas confortáveis e informe à equipe os medicamentos em uso." },
  { id: 7, nome: "Ecocardiograma", categoria: "Cardiologia", preparo: "Confirme com a unidade se há alguma orientação específica antes do exame." },
  { id: 8, nome: "Creatinina", categoria: "Laboratorial", preparo: "Siga a orientação do profissional solicitante e da unidade de coleta." },
];

const UNIDADES = [
  { id: 1, nome: "Hospital Municipal de Emergências Albert Sabin", bairro: "Santa Paula", endereco: "Rua Aurélia, São Caetano do Sul - SP", exames: [1, 2, 3, 4, 6, 7, 8] },
  { id: 2, nome: "Hospital Municipal Maria Braido", bairro: "Santa Paula", endereco: "São Caetano do Sul - SP", exames: [1, 2, 4, 5, 6, 7, 8] },
  { id: 3, nome: "Atende Fácil Saúde Pedro Kassab", bairro: "Centro", endereco: "São Caetano do Sul - SP", exames: [1, 2, 3, 5, 7, 8] },
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

// Dados fictícios para demonstrar a interface. Na integração, estes registros
// devem vir do prontuário e dos encaminhamentos armazenados no backend.
const PACIENTES_INICIAIS = [
  {
    id: 1,
    prontuario: "PR-2026-0142",
    nome: "Mariana Silva Costa",
    cpf: "***.456.***-00",
    idade: 28,
    nascimento: "18/04/1998",
    sexo: "Feminino",
    telefone: "(11) 9****-2184",
    status: "Aguardando análise",
    prioridade: "Prioritário",
    solicitante: "Dra. Camila Ferreira",
    dataEncaminhamento: "12/11/2026",
    queixa: "Dor abdominal recorrente há alguns dias.",
    diagnosticos: ["Dor abdominal a esclarecer"],
    sintomas: ["Dor na região abdominal", "Desconforto após alimentação", "Náusea ocasional"],
    medicamentos: ["Não informado no prontuário"],
    alergias: ["Não informado no prontuário"],
    antecedentes: ["Histórico clínico em revisão"],
    examesAnteriores: ["Sem exames anteriores vinculados a esta solicitação"],
    indicacao: "Encaminhamento médico registrado para avaliação por imagem da região abdominal.",
    exameSolicitadoId: 5,
    observacaoClinica: "Conferir o pedido original e validar o preparo diretamente com a unidade executante.",
  },
  {
    id: 2,
    prontuario: "PR-2026-0138",
    nome: "João Pedro Alves",
    cpf: "***.654.***-21",
    idade: 44,
    nascimento: "10/08/1982",
    sexo: "Masculino",
    telefone: "(11) 9****-7301",
    status: "Aguardando análise",
    prioridade: "Urgente",
    solicitante: "Dr. Rafael Mendes",
    dataEncaminhamento: "12/11/2026",
    queixa: "Relato de palpitações durante avaliação clínica.",
    diagnosticos: ["Palpitação em investigação"],
    sintomas: ["Palpitações relatadas", "Episódios de tontura"],
    medicamentos: ["Losartana — informação a confirmar"],
    alergias: ["Não informado no prontuário"],
    antecedentes: ["Antecedentes cardiovasculares a revisar"],
    examesAnteriores: ["Sem eletrocardiograma recente anexado"],
    indicacao: "Encaminhamento médico registrado para avaliação da atividade elétrica cardíaca.",
    exameSolicitadoId: 6,
    observacaoClinica: "A prioridade deve seguir a classificação registrada pelo profissional solicitante.",
  },
  {
    id: 3,
    prontuario: "PR-2026-0129",
    nome: "Carlos Eduardo Lima",
    cpf: "***.222.***-44",
    idade: 61,
    nascimento: "02/02/1965",
    sexo: "Masculino",
    telefone: "(11) 9****-4602",
    status: "Aguardando análise",
    prioridade: "Rotina",
    solicitante: "Dra. Beatriz Rocha",
    dataEncaminhamento: "11/11/2026",
    queixa: "Cansaço persistente relatado em consulta.",
    diagnosticos: ["Fadiga em investigação"],
    sintomas: ["Cansaço persistente", "Fraqueza relatada"],
    medicamentos: ["Não informado no prontuário"],
    alergias: ["Alergias não registradas"],
    antecedentes: ["Histórico de saúde a confirmar"],
    examesAnteriores: ["Hemograma anterior não localizado"],
    indicacao: "Encaminhamento médico registrado para avaliação laboratorial.",
    exameSolicitadoId: 1,
    observacaoClinica: "Verificar se há exames prévios disponíveis antes de concluir o agendamento.",
  },
  {
    id: 4,
    prontuario: "PR-2026-0117",
    nome: "Ana Beatriz Martins",
    cpf: "***.333.***-55",
    idade: 35,
    nascimento: "21/11/1990",
    sexo: "Feminino",
    telefone: "(11) 9****-6129",
    status: "Aguardando análise",
    prioridade: "Prioritário",
    solicitante: "Dr. Paulo Nogueira",
    dataEncaminhamento: "10/11/2026",
    queixa: "Desconforto urinário relatado durante atendimento.",
    diagnosticos: ["Sintomas urinários em investigação"],
    sintomas: ["Desconforto ao urinar", "Aumento da frequência urinária"],
    medicamentos: ["Não informado no prontuário"],
    alergias: ["Não informado no prontuário"],
    antecedentes: ["Sem antecedentes relevantes registrados"],
    examesAnteriores: ["Sem exame de urina recente anexado"],
    indicacao: "Encaminhamento médico registrado para análise laboratorial de urina.",
    exameSolicitadoId: 3,
    observacaoClinica: "Confirmar instruções de coleta com a unidade e repassar ao paciente.",
  },
];

export default function GestaoExamesPage() {
  const [pacientes, setPacientes] = useState(PACIENTES_INICIAIS);
  const [solicitacoes, setSolicitacoes] = useState([]);
  const [aba, setAba] = useState("prontuarios");
  const [busca, setBusca] = useState("");
  const [filtroPrioridade, setFiltroPrioridade] = useState("Todas");
  const [pacienteId, setPacienteId] = useState(PACIENTES_INICIAIS[0].id);
  const [exameId, setExameId] = useState(String(PACIENTES_INICIAIS[0].exameSolicitadoId));
  const [unidadeId, setUnidadeId] = useState("");
  const [data, setData] = useState(adicionarDiasISO(1));
  const [horario, setHorario] = useState("");
  const [prioridade, setPrioridade] = useState(PACIENTES_INICIAIS[0].prioridade);
  const [justificativa, setJustificativa] = useState(PACIENTES_INICIAIS[0].indicacao);
  const [orientacoes, setOrientacoes] = useState("");
  const [erro, setErro] = useState("");
  const [aviso, setAviso] = useState("");
  const [editandoId, setEditandoId] = useState(null);
  const [solicitacaoExcluir, setSolicitacaoExcluir] = useState(null);

  const pacienteSelecionado = pacientes.find((item) => item.id === pacienteId) || null;
  const exameSelecionado = EXAMES.find((item) => item.id === Number(exameId)) || null;
  const unidadeSelecionada = UNIDADES.find((item) => item.id === Number(unidadeId)) || null;

  const pacientesFiltrados = useMemo(() => {
    const termo = busca.trim().toLocaleLowerCase("pt-BR");
    return pacientes.filter((item) => {
      const correspondeBusca = !termo || [item.nome, item.cpf, item.prontuario, item.queixa]
        .some((valor) => String(valor || "").toLocaleLowerCase("pt-BR").includes(termo));
      const correspondePrioridade = filtroPrioridade === "Todas" || item.prioridade === filtroPrioridade;
      const correspondeAba = aba === "todosProntuarios" || item.status !== "Exame agendado";
      return correspondeBusca && correspondePrioridade && correspondeAba;
    });
  }, [pacientes, busca, filtroPrioridade, aba]);

  const solicitacoesFiltradas = useMemo(() => {
    const termo = busca.trim().toLocaleLowerCase("pt-BR");
    return solicitacoes.filter((item) => !termo || [item.paciente.nome, item.paciente.prontuario, item.exame.nome, item.unidade.nome, item.status]
      .some((valor) => String(valor || "").toLocaleLowerCase("pt-BR").includes(termo)));
  }, [solicitacoes, busca]);

  const indicadores = useMemo(() => ({
    pendentes: pacientes.filter((item) => item.status !== "Exame agendado").length,
    prioridade: pacientes.filter((item) => item.status !== "Exame agendado" && ["Urgente", "Prioritário"].includes(item.prioridade)).length,
    agendados: solicitacoes.length,
    confirmacao: solicitacoes.filter((item) => item.status === "Aguardando confirmação").length,
  }), [pacientes, solicitacoes]);

  const unidadesDisponiveis = useMemo(() => {
    if (!exameSelecionado) return [];
    return UNIDADES.filter((unidade) => unidade.exames.includes(exameSelecionado.id));
  }, [exameSelecionado]);

  const horariosOcupados = useMemo(() => solicitacoes
    .filter((item) => item.unidade.id === Number(unidadeId) && item.data === data && item.id !== editandoId && item.status !== "Cancelado")
    .map((item) => item.horario), [solicitacoes, unidadeId, data, editandoId]);

  function selecionarPaciente(item) {
    setPacienteId(item.id);
    setExameId(item.exameSolicitadoId ? String(item.exameSolicitadoId) : "");
    setUnidadeId("");
    setData(adicionarDiasISO(1));
    setHorario("");
    setPrioridade(item.prioridade || "Rotina");
    setJustificativa(item.indicacao || "");
    setOrientacoes("");
    setEditandoId(null);
    setErro("");
    setAviso("");
  }

  function salvarSolicitacao(event) {
    event.preventDefault();
    if (!pacienteSelecionado || !exameSelecionado || !unidadeSelecionada || !data || !horario || !justificativa.trim()) {
      setErro("Confira o prontuário e preencha exame, justificativa, unidade, data e horário.");
      return;
    }
    if (data < dataLocalISO()) {
      setErro("A data do exame não pode ser anterior a hoje.");
      return;
    }
    if (horariosOcupados.includes(horario)) {
      setErro("Este horário já está ocupado nesta unidade. Selecione outro horário.");
      return;
    }

    const registro = {
      id: editandoId || Date.now(),
      paciente: pacienteSelecionado,
      exame: exameSelecionado,
      unidade: unidadeSelecionada,
      data,
      horario,
      prioridade,
      justificativa: justificativa.trim(),
      orientacoes: orientacoes.trim(),
      status: "Aguardando confirmação",
      criadoEm: new Date().toLocaleDateString("pt-BR"),
    };

    if (editandoId) {
      setSolicitacoes((atuais) => atuais.map((item) => item.id === editandoId ? registro : item));
      setAviso("Solicitação atualizada. O paciente permanece aguardando confirmação do agendamento.");
    } else {
      setSolicitacoes((atuais) => [registro, ...atuais]);
      setPacientes((atuais) => atuais.map((item) => item.id === pacienteSelecionado.id ? { ...item, status: "Exame agendado" } : item));
      setAviso("Solicitação registrada na demonstração. Para persistir os dados, conecte esta ação à API de exames.");
    }

    setEditandoId(null);
    setPacienteId(null);
    setAba("solicitacoes");
    setBusca("");
    setErro("");
  }

  function editarSolicitacao(item) {
    const pacienteAtual = pacientes.find((registro) => registro.id === item.paciente.id) || item.paciente;
    setPacienteId(pacienteAtual.id);
    setExameId(String(item.exame.id));
    setUnidadeId(String(item.unidade.id));
    setData(item.data);
    setHorario(item.horario);
    setPrioridade(item.prioridade);
    setJustificativa(item.justificativa);
    setOrientacoes(item.orientacoes || "");
    setEditandoId(item.id);
    setAba("prontuarios");
    setErro("");
    setAviso("");
  }

  function excluirSolicitacao() {
    if (!solicitacaoExcluir) return;
    const pacienteExcluidoId = solicitacaoExcluir.paciente.id;
    setSolicitacoes((atuais) => atuais.filter((item) => item.id !== solicitacaoExcluir.id));
    setPacientes((atuais) => atuais.map((item) => item.id === pacienteExcluidoId ? { ...item, status: "Aguardando análise" } : item));
    setSolicitacaoExcluir(null);
    setAviso("Solicitação removida da lista demonstrativa.");
  }

  function cancelarEdicao() {
    setEditandoId(null);
    setUnidadeId("");
    setData(adicionarDiasISO(1));
    setHorario("");
    setAba("solicitacoes");
    setErro("");
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#F1F6FB] px-4 py-6 text-[#0B1756] sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute -left-40 top-64 h-96 w-96 rounded-full bg-[#D9EAF8]/70" />
      <div className="pointer-events-none absolute -right-48 top-24 h-[34rem] w-[34rem] rounded-full bg-[#D3E5F7]/70" />
      <div className="pointer-events-none absolute right-[12%] top-[1050px] h-56 w-56 rounded-full border-[42px] border-white/80" />

      <div className="relative z-10 mx-auto max-w-[1500px] space-y-6">
        <header className="relative overflow-hidden rounded-[30px] bg-gradient-to-br from-[#174693] via-[#234E96] to-[#151A67] px-6 py-8 text-white shadow-[0_20px_55px_rgba(2,62,138,0.16)] sm:px-9 lg:px-10">
          <div className="pointer-events-none absolute -right-16 -top-32 h-80 w-80 rounded-full bg-white/10" />
          <div className="pointer-events-none absolute left-[42%] top-10 h-56 w-56 rounded-full border-[36px] border-white/[0.05]" />
          <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-semibold">
                <Stethoscope size={14} /> Gestão clínica · Rede UneSUS
              </span>
              <h1 className="mt-4 text-3xl font-bold leading-tight sm:text-4xl">Análise de prontuários e exames</h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-blue-100 sm:text-base">
                Consulte os prontuários encaminhados, confira a indicação clínica e organize a solicitação e o agendamento do exame para cada paciente.
              </p>
            </div>
            <div className="grid w-full max-w-[420px] grid-cols-2 gap-3">
              <HeroInfo icon={<ShieldCheck size={18} />} title="Área profissional" text="Prontuário e encaminhamentos" />
              <HeroInfo icon={<CalendarClock size={18} />} title="Agenda da rede" text="Unidade, data e horário" />
            </div>
          </div>
        </header>

        <div className="flex items-start gap-3 rounded-2xl border border-blue-200 bg-blue-50/90 px-4 py-3 text-sm text-blue-900">
          <Info size={19} className="mt-0.5 shrink-0" />
          <p className="leading-6"><strong>Importante:</strong> o sistema organiza os prontuários e os pedidos recebidos. A escolha ou alteração do exame deve ser validada pelo profissional habilitado, com base na avaliação clínica e no encaminhamento. A tela não faz diagnóstico nem recomenda exames automaticamente.</p>
        </div>

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard icon={<FileHeart size={20} />} label="Prontuários aguardando análise" value={indicadores.pendentes} tone="blue" />
          <MetricCard icon={<AlertCircle size={20} />} label="Prioridade elevada" value={indicadores.prioridade} tone="amber" />
          <MetricCard icon={<CalendarDays size={20} />} label="Solicitações cadastradas" value={indicadores.agendados} tone="green" />
          <MetricCard icon={<Clock3 size={20} />} label="Aguardando confirmação" value={indicadores.confirmacao} tone="slate" />
        </section>

        <section className="overflow-hidden rounded-[26px] border border-[#DCE8F3] bg-white shadow-[0_12px_36px_rgba(2,62,138,0.07)]">
          <div className="grid grid-cols-2 gap-2 p-2 sm:p-3">
            <TabButton active={aba === "prontuarios"} onClick={() => { setAba("prontuarios"); setAviso(""); }} icon={<FileHeart size={17} />}>Prontuários para análise ({pacientes.filter((item) => item.status !== "Exame agendado").length})</TabButton>
            <TabButton active={aba === "solicitacoes"} onClick={() => { setAba("solicitacoes"); setAviso(""); }} icon={<ClipboardList size={17} />}>Solicitações de exames ({solicitacoes.length})</TabButton>
          </div>
        </section>

        {aviso && <div className="flex items-start gap-3 rounded-2xl border border-[#C9DDF0] bg-[#EAF3FA] px-4 py-3 text-sm text-[#174693]"><Info size={18} className="mt-0.5 shrink-0" /><p className="flex-1">{aviso}</p><button type="button" onClick={() => setAviso("")} aria-label="Fechar aviso"><X size={17} /></button></div>}

        {aba === "prontuarios" ? (
          <section className="grid items-start gap-5 xl:grid-cols-[minmax(300px,0.82fr)_minmax(0,1.8fr)]">
            <aside className="overflow-hidden rounded-[24px] border border-[#DCE8F3] bg-white shadow-sm">
              <div className="border-b border-slate-100 p-5">
                <div className="flex items-center gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#EAF1F8] text-[#174693]"><Users size={20} /></span>
                  <div><h2 className="font-bold">Pacientes encaminhados</h2><p className="mt-0.5 text-xs text-slate-500">Selecione um prontuário para analisar.</p></div>
                </div>
                <div className="relative mt-4"><Search size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" /><input value={busca} onChange={(event) => setBusca(event.target.value)} placeholder="Nome, CPF ou prontuário" className="h-11 w-full rounded-xl border border-slate-200 bg-[#F8FAFD] pl-10 pr-3 text-sm outline-none focus:border-[#3563A7] focus:bg-white" /></div>
                <div className="relative mt-3"><Filter size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" /><select value={filtroPrioridade} onChange={(event) => setFiltroPrioridade(event.target.value)} className="h-10 w-full appearance-none rounded-xl border border-slate-200 bg-white pl-10 pr-9 text-sm outline-none focus:border-[#3563A7]"><option>Todas</option><option>Urgente</option><option>Prioritário</option><option>Rotina</option></select><ChevronDown size={15} className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400" /></div>
              </div>
              <div className="max-h-[760px] space-y-2 overflow-y-auto p-3">
                {pacientesFiltrados.map((item) => <PatientListItem key={item.id} patient={item} active={pacienteId === item.id} onClick={() => selecionarPaciente(item)} />)}
                {pacientesFiltrados.length === 0 && <EmptyState icon={<Search size={22} />} title="Nenhum prontuário encontrado" description="Altere a busca ou o filtro de prioridade." />}
              </div>
              <div className="border-t border-slate-100 bg-[#F8FAFD] px-4 py-3 text-xs text-slate-500">{pacientesFiltrados.length} prontuário(s) exibido(s) · Dados demonstrativos</div>
            </aside>

            <div className="space-y-5">
              {pacienteSelecionado ? (
                <>
                  <section className="overflow-hidden rounded-[24px] border border-[#DCE8F3] bg-white shadow-sm">
                    <div className="flex flex-col gap-4 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
                      <div className="flex items-center gap-4">
                        <Avatar name={pacienteSelecionado.nome} large />
                        <div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><h2 className="text-lg font-bold">{pacienteSelecionado.nome}</h2><PriorityBadge value={pacienteSelecionado.prioridade} /></div><p className="mt-1 text-xs text-slate-500">Prontuário {pacienteSelecionado.prontuario} · {pacienteSelecionado.idade} anos · {pacienteSelecionado.sexo}</p><p className="mt-1 text-xs text-slate-500">CPF {pacienteSelecionado.cpf} · Nascimento {pacienteSelecionado.nascimento}</p></div>
                      </div>
                      <span className="inline-flex w-fit items-center gap-2 rounded-full bg-[#EAF3F7] px-3 py-2 text-xs font-semibold text-[#174693]"><FileText size={14} /> {pacienteSelecionado.status}</span>
                    </div>
                    <div className="grid gap-4 p-5 sm:grid-cols-2 sm:p-6">
                      <ClinicalBlock icon={<Activity size={18} />} title="Queixa principal" items={[pacienteSelecionado.queixa]} />
                      <ClinicalBlock icon={<Stethoscope size={18} />} title="Diagnósticos registrados" items={pacienteSelecionado.diagnosticos} />
                      <ClinicalBlock icon={<HeartPulse size={18} />} title="Sintomas relatados" items={pacienteSelecionado.sintomas} />
                      <ClinicalBlock icon={<ClipboardList size={18} />} title="Medicamentos em uso" items={pacienteSelecionado.medicamentos} />
                      <ClinicalBlock icon={<AlertCircle size={18} />} title="Alergias" items={pacienteSelecionado.alergias} warning />
                      <ClinicalBlock icon={<FileText size={18} />} title="Antecedentes clínicos" items={pacienteSelecionado.antecedentes} />
                      <div className="sm:col-span-2"><ClinicalBlock icon={<FileHeart size={18} />} title="Exames anteriores" items={pacienteSelecionado.examesAnteriores} /></div>
                    </div>
                    <div className="mx-5 mb-5 rounded-2xl border border-blue-100 bg-blue-50/70 p-4 sm:mx-6 sm:mb-6">
                      <div className="flex items-center gap-2 text-sm font-bold text-[#174693]"><FileCheck2Icon /> Encaminhamento e indicação registrados</div>
                      <p className="mt-2 text-sm leading-6 text-slate-700">{pacienteSelecionado.indicacao}</p>
                      <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-slate-500"><span>Solicitante: <strong className="text-slate-700">{pacienteSelecionado.solicitante}</strong></span><span>•</span><span>Recebido em {pacienteSelecionado.dataEncaminhamento}</span></div>
                      {pacienteSelecionado.exameSolicitadoId && <p className="mt-2 text-sm text-[#174693]">Exame mencionado no encaminhamento: <strong>{EXAMES.find((item) => item.id === pacienteSelecionado.exameSolicitadoId)?.nome}</strong></p>}
                    </div>
                  </section>

                  <form onSubmit={salvarSolicitacao} className="rounded-[24px] border border-[#DCE8F3] bg-white p-5 shadow-sm sm:p-6">
                    <div className="flex items-start gap-3"><span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#EAF1F8] text-[#174693]"><FlaskConical size={20} /></span><div><h2 className="text-lg font-bold">Definir exame e agendamento</h2><p className="mt-1 text-xs leading-5 text-slate-500">Confira a indicação do prontuário e registre a decisão do profissional responsável.</p></div></div>
                    <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs leading-5 text-amber-900"><strong>Validação clínica obrigatória.</strong> O exame indicado no encaminhamento é exibido como referência. Confirme ou ajuste somente conforme avaliação e responsabilidade profissional; registre a justificativa.</div>

                    <div className="mt-5 grid gap-5 lg:grid-cols-2">
                      <div className="lg:col-span-2"><label className="mb-2 block text-sm font-semibold">Exame a solicitar <span className="text-red-500">*</span></label><div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">{EXAMES.map((item) => { const ativo = exameId === String(item.id); const indicado = pacienteSelecionado.exameSolicitadoId === item.id; return <button key={item.id} type="button" onClick={() => { setExameId(String(item.id)); setUnidadeId(""); setHorario(""); }} className={`rounded-xl border p-3 text-left transition ${ativo ? "border-[#174693] bg-[#EFF5FC] ring-2 ring-[#174693]/10" : "border-slate-200 bg-[#FBFCFE] hover:border-[#B8CEE4]"}`}><span className="flex items-start justify-between gap-2"><span className="text-sm font-bold">{item.nome}</span>{indicado && <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[9px] font-bold text-emerald-800">No pedido</span>}</span><span className="mt-1 block text-xs text-slate-500">{item.categoria}</span>{ativo && <span className="mt-2 flex items-center gap-1 text-xs font-bold text-[#174693]"><Check size={13} /> Selecionado</span>}</button>; })}</div></div>

                      <div><label className="mb-2 block text-sm font-semibold">Prioridade registrada <span className="text-red-500">*</span></label><select value={prioridade} onChange={(event) => setPrioridade(event.target.value)} className="h-12 w-full rounded-xl border border-slate-200 bg-[#F8FAFD] px-3 text-sm outline-none focus:border-[#3563A7]"><option>Rotina</option><option>Prioritário</option><option>Urgente</option><option>Emergência</option></select><p className="mt-2 text-xs text-slate-500">Mantenha a classificação definida na avaliação clínica.</p></div>
                      <div className="lg:col-span-2"><label className="mb-2 block text-sm font-semibold">Justificativa / indicação clínica <span className="text-red-500">*</span></label><textarea value={justificativa} onChange={(event) => setJustificativa(event.target.value)} rows={3} maxLength={700} placeholder="Registre a justificativa conforme avaliação e encaminhamento..." className="w-full resize-y rounded-xl border border-slate-200 bg-[#F8FAFD] px-4 py-3 text-sm outline-none focus:border-[#3563A7] focus:bg-white" /><p className="mt-1 text-right text-xs text-slate-400">{justificativa.length}/700</p></div>

                      <div className="lg:col-span-2"><label className="mb-2 block text-sm font-semibold">Unidade que realizará o exame <span className="text-red-500">*</span></label>{!exameSelecionado ? <EmptyState icon={<Building2 size={20} />} title="Selecione um exame" description="As unidades habilitadas para o procedimento aparecerão aqui." /> : <div className="grid gap-3 md:grid-cols-2">{unidadesDisponiveis.map((item) => { const ativo = unidadeId === String(item.id); return <button key={item.id} type="button" onClick={() => { setUnidadeId(String(item.id)); setHorario(""); }} className={`flex items-start gap-3 rounded-xl border p-4 text-left transition ${ativo ? "border-[#174693] bg-[#EFF5FC] ring-2 ring-[#174693]/10" : "border-slate-200 hover:border-[#B8CEE4]"}`}><span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${ativo ? "bg-[#174693] text-white" : "bg-[#EAF1F8] text-[#174693]"}`}><Building2 size={19} /></span><span className="min-w-0 flex-1"><span className="block text-sm font-bold">{item.nome}</span><span className="mt-1 flex items-center gap-1 text-xs text-slate-500"><MapPin size={12} /> {item.bairro} · {item.endereco}</span>{ativo && <span className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-[#174693]"><Check size={13} /> Unidade selecionada</span>}</span></button>; })}</div>}</div>

                      {unidadeSelecionada && <><div><label className="mb-2 block text-sm font-semibold">Data do exame <span className="text-red-500">*</span></label><div className="relative"><CalendarDays size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#3563A7]" /><input type="date" min={dataLocalISO()} value={data} onChange={(event) => { setData(event.target.value); setHorario(""); }} className="h-12 w-full rounded-xl border border-slate-200 bg-[#F8FAFD] pl-10 pr-3 text-sm outline-none focus:border-[#3563A7]" /></div></div><div><label className="mb-2 block text-sm font-semibold">Horário disponível <span className="text-red-500">*</span></label><div className="grid grid-cols-4 gap-2">{HORARIOS.map((hora) => { const ocupado = horariosOcupados.includes(hora); const ativo = horario === hora; return <button key={hora} type="button" disabled={ocupado} onClick={() => setHorario(hora)} className={`rounded-lg border px-2 py-2.5 text-xs font-bold transition ${ocupado ? "cursor-not-allowed border-slate-100 bg-slate-100 text-slate-300 line-through" : ativo ? "border-[#174693] bg-[#174693] text-white" : "border-slate-200 text-[#174693] hover:border-[#174693] hover:bg-[#EFF5FC]"}`}>{hora}</button>; })}</div><p className="mt-2 text-xs text-slate-500">Horários ocupados na mesma unidade e data ficam indisponíveis.</p></div></>}

                      <div className="lg:col-span-2"><label className="mb-2 block text-sm font-semibold">Orientações ao paciente (opcional)</label><textarea value={orientacoes} onChange={(event) => setOrientacoes(event.target.value)} rows={2} maxLength={500} placeholder="Orientações confirmadas pela unidade, documentos necessários e preparo..." className="w-full resize-y rounded-xl border border-slate-200 bg-[#F8FAFD] px-4 py-3 text-sm outline-none focus:border-[#3563A7]" /><p className="mt-1 text-right text-xs text-slate-400">{orientacoes.length}/500</p></div>
                    </div>

                    {exameSelecionado && <div className="mt-5 flex gap-3 rounded-xl border border-blue-100 bg-blue-50/70 p-4"><Info size={18} className="mt-0.5 shrink-0 text-[#174693]" /><div><p className="text-sm font-semibold text-[#174693]">Orientação geral do exame</p><p className="mt-1 text-sm leading-5 text-slate-600">{exameSelecionado.preparo}</p></div></div>}
                    {erro && <p className="mt-4 flex items-center gap-2 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700"><AlertCircle size={16} /> {erro}</p>}
                    <div className="mt-6 flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:items-center sm:justify-between"><p className="max-w-xl text-xs leading-5 text-slate-500">O registro nesta versão é demonstrativo e fica no estado da página. A gravação definitiva exige integração com a API do UneSUS.</p><div className="flex flex-col gap-2 sm:flex-row"><button type="button" onClick={() => { setExameId(pacienteSelecionado.exameSolicitadoId ? String(pacienteSelecionado.exameSolicitadoId) : ""); setUnidadeId(""); setHorario(""); setErro(""); }} className="rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50">Restaurar pedido</button>{editandoId && <button type="button" onClick={cancelarEdicao} className="rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-600">Cancelar edição</button>}<button type="submit" className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#194391] px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-[#0B1756]"><CheckCircle2 size={17} /> {editandoId ? "Salvar alterações" : "Registrar exame e agendamento"}</button></div></div>
                  </form>
                </>
              ) : <EmptyState icon={<UserRound size={22} />} title="Selecione um prontuário" description="Escolha um paciente na lista para consultar as informações clínicas." />}
            </div>
          </section>
        ) : (
          <section className="overflow-hidden rounded-[24px] border border-[#DCE8F3] bg-white shadow-[0_12px_36px_rgba(2,62,138,0.07)]">
            <div className="flex flex-col gap-4 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6"><div><h2 className="text-xl font-bold">Solicitações de exames</h2><p className="mt-1 text-sm text-slate-500">Acompanhe, edite ou remova os agendamentos registrados.</p></div><button type="button" onClick={() => { setAba("prontuarios"); setEditandoId(null); setAviso(""); }} className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#194391] px-4 py-3 text-sm font-bold text-white hover:bg-[#0B1756]"><ArrowRight size={16} /> Analisar prontuário</button></div>
            <div className="p-5 sm:p-6"><div className="relative max-w-xl"><Search size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" /><input value={busca} onChange={(event) => setBusca(event.target.value)} placeholder="Buscar paciente, prontuário, exame ou unidade" className="h-11 w-full rounded-xl border border-slate-200 bg-[#F8FAFD] pl-10 pr-3 text-sm outline-none focus:border-[#3563A7]" /></div></div>
            <div className="hidden overflow-x-auto border-t border-slate-100 md:block"><table className="w-full min-w-[1050px] text-left"><thead className="bg-[#F7FAFD] text-[11px] uppercase tracking-wide text-slate-500"><tr><th className="px-6 py-4">Paciente / prontuário</th><th className="px-4 py-4">Exame</th><th className="px-4 py-4">Prioridade</th><th className="px-4 py-4">Unidade</th><th className="px-4 py-4">Data e horário</th><th className="px-4 py-4">Situação</th><th className="px-6 py-4 text-right">Ações</th></tr></thead><tbody className="divide-y divide-slate-100">{solicitacoesFiltradas.map((item) => <tr key={item.id} className="hover:bg-[#FAFCFE]"><td className="px-6 py-4"><p className="text-sm font-bold">{item.paciente.nome}</p><p className="mt-1 text-xs text-slate-500">{item.paciente.prontuario}</p></td><td className="px-4 py-4"><p className="text-sm font-semibold">{item.exame.nome}</p><p className="mt-1 text-xs text-slate-500">{item.exame.categoria}</p></td><td className="px-4 py-4"><PriorityBadge value={item.prioridade} /></td><td className="max-w-[230px] px-4 py-4 text-sm">{item.unidade.nome}<p className="mt-1 text-xs text-slate-500">{item.unidade.bairro}</p></td><td className="px-4 py-4 text-sm font-semibold">{formatarData(item.data)}<p className="mt-1 flex items-center gap-1 text-xs font-normal text-slate-500"><Clock3 size={12} /> {item.horario}</p></td><td className="px-4 py-4"><StatusBadge status={item.status} /></td><td className="px-6 py-4"><div className="flex justify-end gap-1"><button type="button" title="Editar" onClick={() => editarSolicitacao(item)} className="rounded-lg p-2 text-[#174693] hover:bg-[#EAF1F8]"><Edit3 size={17} /></button><button type="button" title="Excluir" onClick={() => setSolicitacaoExcluir(item)} className="rounded-lg p-2 text-red-500 hover:bg-red-50"><Trash2 size={17} /></button></div></td></tr>)}</tbody></table>{solicitacoesFiltradas.length === 0 && <EmptyState icon={<Search size={22} />} title="Nenhuma solicitação cadastrada" description="As solicitações registradas a partir dos prontuários aparecerão aqui." />}</div>
            <div className="space-y-3 border-t border-slate-100 p-4 md:hidden">{solicitacoesFiltradas.map((item) => <article key={item.id} className="rounded-2xl border border-slate-200 p-4"><div className="flex items-start justify-between gap-3"><div><p className="font-bold">{item.paciente.nome}</p><p className="mt-1 text-xs text-slate-500">{item.paciente.prontuario}</p></div><StatusBadge status={item.status} /></div><div className="mt-3 space-y-1 text-sm"><p><span className="text-slate-500">Exame: </span>{item.exame.nome}</p><p><span className="text-slate-500">Unidade: </span>{item.unidade.nome}</p><p><span className="text-slate-500">Agendamento: </span>{formatarData(item.data)} às {item.horario}</p></div><div className="mt-3 flex gap-2"><button type="button" onClick={() => editarSolicitacao(item)} className="flex-1 rounded-lg bg-[#EAF1F8] px-3 py-2 text-xs font-semibold text-[#174693]">Editar</button><button type="button" onClick={() => setSolicitacaoExcluir(item)} className="rounded-lg bg-red-50 px-3 py-2 text-red-600"><Trash2 size={16} /></button></div></article>)}{solicitacoesFiltradas.length === 0 && <EmptyState icon={<Search size={22} />} title="Nenhuma solicitação cadastrada" description="As solicitações registradas a partir dos prontuários aparecerão aqui." />}</div>
            <div className="border-t border-slate-100 px-5 py-4 text-xs text-slate-500">Exibindo {solicitacoesFiltradas.length} de {solicitacoes.length} solicitação(ões) · Dados demonstrativos</div>
          </section>
        )}
      </div>

      {solicitacaoExcluir && <Modal title="Excluir solicitação" onClose={() => setSolicitacaoExcluir(null)}><div className="flex gap-3 rounded-xl border border-red-100 bg-red-50 p-4"><AlertCircle size={20} className="mt-0.5 shrink-0 text-red-600" /><p className="text-sm leading-6 text-red-800">Deseja remover a solicitação de <strong>{solicitacaoExcluir.paciente.nome}</strong> para <strong>{solicitacaoExcluir.exame.nome}</strong>? O prontuário voltará para a lista de análise nesta demonstração.</p></div><div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end"><button type="button" onClick={() => setSolicitacaoExcluir(null)} className="rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-600">Manter solicitação</button><button type="button" onClick={excluirSolicitacao} className="rounded-xl bg-red-600 px-4 py-3 text-sm font-bold text-white hover:bg-red-700">Excluir solicitação</button></div></Modal>}
    </main>
  );
}

function HeroInfo({ icon, title, text }) {
  return <div className="flex items-center gap-3 rounded-2xl border border-white/15 bg-white/10 p-3"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">{icon}</span><span><span className="block text-xs font-bold">{title}</span><span className="mt-0.5 block text-[11px] text-blue-100">{text}</span></span></div>;
}

function MetricCard({ icon, label, value, tone }) {
  const tones = { blue: "bg-[#EAF1F8] text-[#174693]", green: "bg-emerald-50 text-emerald-700", amber: "bg-amber-50 text-amber-700", slate: "bg-slate-100 text-slate-600" };
  return <div className="flex items-center gap-4 rounded-2xl border border-[#DCE8F3] bg-white p-5 shadow-[0_8px_24px_rgba(2,62,138,0.04)]"><span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${tones[tone]}`}>{icon}</span><span><span className="block text-2xl font-bold leading-none">{value}</span><span className="mt-2 block text-xs font-medium text-slate-500">{label}</span></span></div>;
}

function TabButton({ active, onClick, icon, children }) {
  return <button type="button" onClick={onClick} className={`flex min-h-12 items-center justify-center gap-2 rounded-xl px-3 py-3 text-sm font-bold transition sm:px-4 ${active ? "bg-[#194391] text-white shadow-sm" : "text-[#174693] hover:bg-[#F0F5FA]"}`}>{icon}{children}</button>;
}

function PatientListItem({ patient, active, onClick }) {
  return <button type="button" onClick={onClick} className={`w-full rounded-2xl border p-4 text-left transition ${active ? "border-[#174693] bg-[#EFF5FC] ring-2 ring-[#174693]/10" : "border-slate-100 bg-white hover:border-[#C7D9EA] hover:bg-[#FAFCFE]"}`}><div className="flex items-start gap-3"><Avatar name={patient.nome} /><span className="min-w-0 flex-1"><span className="flex flex-wrap items-center gap-2"><span className="text-sm font-bold">{patient.nome}</span><PriorityBadge value={patient.prioridade} /></span><span className="mt-1 block text-xs text-slate-500">{patient.prontuario} · {patient.idade} anos</span><span className="mt-2 block truncate text-xs text-slate-600">{patient.queixa}</span><span className="mt-2 block text-[11px] text-[#174693]">{patient.status}</span></span></div></button>;
}

function Avatar({ name, large = false }) {
  return <span className={`flex shrink-0 items-center justify-center rounded-full bg-[#E5EEF8] font-bold text-[#174693] ${large ? "h-14 w-14 text-base" : "h-11 w-11 text-sm"}`}>{iniciais(name)}</span>;
}

function ClinicalBlock({ icon, title, items, warning = false }) {
  return <div className={`rounded-xl border p-4 ${warning ? "border-amber-100 bg-amber-50/50" : "border-slate-100 bg-[#FBFCFE]"}`}><div className={`flex items-center gap-2 text-sm font-bold ${warning ? "text-amber-900" : "text-[#174693]"}`}>{icon}{title}</div><ul className="mt-3 space-y-1.5">{items.map((item, index) => <li key={index} className="flex items-start gap-2 text-xs leading-5 text-slate-600"><span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-current opacity-50" />{item}</li>)}</ul></div>;
}

function PriorityBadge({ value }) {
  const style = value === "Emergência" ? "border-red-200 bg-red-50 text-red-700" : value === "Urgente" ? "border-orange-200 bg-orange-50 text-orange-700" : value === "Prioritário" ? "border-amber-200 bg-amber-50 text-amber-800" : "border-slate-200 bg-slate-50 text-slate-600";
  return <span className={`inline-flex whitespace-nowrap rounded-full border px-2.5 py-1 text-[10px] font-bold ${style}`}>{value}</span>;
}

function StatusBadge({ status }) {
  const style = status === "Confirmado" ? "border-emerald-100 bg-emerald-50 text-emerald-700" : status === "Realizado" ? "border-blue-100 bg-blue-50 text-blue-700" : status === "Cancelado" ? "border-red-100 bg-red-50 text-red-700" : "border-amber-100 bg-amber-50 text-amber-700";
  return <span className={`inline-flex whitespace-nowrap rounded-full border px-2.5 py-1 text-[11px] font-bold ${style}`}>{status}</span>;
}

function EmptyState({ icon, title, description }) {
  return <div className="flex min-h-36 flex-col items-center justify-center rounded-2xl border border-dashed border-[#D6E3F0] bg-[#F8FAFD] px-4 py-7 text-center"><span className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-[#9CB3CB] shadow-sm">{icon}</span><p className="mt-3 text-sm font-bold text-[#174693]">{title}</p><p className="mt-1 text-xs text-slate-500">{description}</p></div>;
}

function FileCheck2Icon() {
  return <CheckCircle2 size={16} />;
}

function Modal({ title, onClose, children }) {
  return <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#06194E]/55 p-4 backdrop-blur-sm" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}><div className="w-full max-w-xl rounded-[24px] bg-white p-5 shadow-2xl sm:p-7"><div className="flex items-center justify-between gap-4"><h2 className="text-lg font-bold text-[#0B1756]">{title}</h2><button type="button" onClick={onClose} aria-label="Fechar" className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"><X size={19} /></button></div><div className="mt-5">{children}</div></div></div>;
}
