
"use client";

import { useMemo, useState } from "react";
import {
  AlertCircle,
  Activity,
  Check,
  CheckCircle2,
  ChevronDown,
  ClipboardList,
  Clock3,
  FileText,
  Filter,
  HeartPulse,
  Info,
  ListChecks,
  Plus,
  Search,
  ShieldCheck,
  Stethoscope,
  Thermometer,
  UserRound,
  X,
} from "lucide-react";

/* =========================
   DADOS DEMONSTRATIVOS
   Substituir pela API depois
========================= */

const PACIENTES = [
  { id: 1, nome: "Mariana Silva Costa", cpf: "123.456.789-00", idade: 28, sexo: "Feminino" },
  { id: 2, nome: "João Pedro Alves", cpf: "987.654.321-00", idade: 44, sexo: "Masculino" },
  { id: 3, nome: "Carlos Eduardo Lima", cpf: "111.222.333-44", idade: 61, sexo: "Masculino" },
  { id: 4, nome: "Ana Beatriz Martins", cpf: "222.333.444-55", idade: 35, sexo: "Feminino" },
  { id: 5, nome: "Lucas Henrique Souza", cpf: "333.444.555-66", idade: 19, sexo: "Masculino" },
];

const TRIAGENS_INICIAIS = [
  {
    id: 1001,
    paciente: PACIENTES[0],
    data: "2026-11-12",
    horario: "08:15",
    pressao: "120/80",
    frequencia: "78",
    temperatura: "36.5",
    saturacao: "98",
    respiracao: "16",
    glicemia: "92",
    queixa: "Dor de cabeça e tontura",
    sintomas: "Dor na região frontal e tontura leve.",
    inicio: "Hoje pela manhã",
    dor: "Leve",
    historico: "Nega doenças crônicas.",
    alergias: "Não relatadas",
    medicamentos: "Nenhum",
    classificacao: "Pouco urgente",
    observacoes: "Paciente consciente e orientada.",
    status: "Encaminhada ao médico",
  },
  {
    id: 1002,
    paciente: PACIENTES[1],
    data: "2026-11-12",
    horario: "08:40",
    pressao: "130/85",
    frequencia: "88",
    temperatura: "37.2",
    saturacao: "97",
    respiracao: "18",
    glicemia: "",
    queixa: "Dor abdominal",
    sintomas: "Desconforto na região abdominal.",
    inicio: "Há dois dias",
    dor: "Moderada",
    historico: "Hipertensão",
    alergias: "Dipirona",
    medicamentos: "Losartana",
    classificacao: "Urgente",
    observacoes: "Relata piora do desconforto.",
    status: "Aguardando atendimento médico",
  },
  {
    id: 1003,
    paciente: PACIENTES[2],
    data: "2026-11-12",
    horario: "09:10",
    pressao: "118/76",
    frequencia: "74",
    temperatura: "36.4",
    saturacao: "99",
    respiracao: "17",
    glicemia: "105",
    queixa: "Renovação de receita",
    sintomas: "Sem sintomas relatados.",
    inicio: "Não se aplica",
    dor: "Sem dor",
    historico: "Diabetes tipo 2",
    alergias: "Não relatadas",
    medicamentos: "Metformina",
    classificacao: "Não urgente",
    observacoes: "Paciente estável.",
    status: "Encaminhada ao médico",
  },
];

function dataLocalISO() {
  const hoje = new Date();
  const ano = hoje.getFullYear();
  const mes = String(hoje.getMonth() + 1).padStart(2, "0");
  const dia = String(hoje.getDate()).padStart(2, "0");
  return `${ano}-${mes}-${dia}`;
}

function formatarData(valor) {
  if (!valor) return "Não definida";
  const [ano, mes, dia] = valor.split("-");
  return `${dia}/${mes}/${ano}`;
}

function horarioAtual() {
  return new Date().toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function iniciais(nome = "") {
  return nome
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((parte) => parte[0])
    .join("")
    .toUpperCase();
}

/* =========================
   COMPONENTE PRINCIPAL
========================= */

export default function TriagemEnfermagemPage() {
  const [aba, setAba] = useState("nova");
  const [triagens, setTriagens] = useState(TRIAGENS_INICIAIS);

  const [buscaPaciente, setBuscaPaciente] = useState("");
  const [paciente, setPaciente] = useState(null);

  const [pressao, setPressao] = useState("");
  const [frequencia, setFrequencia] = useState("");
  const [temperatura, setTemperatura] = useState("");
  const [saturacao, setSaturacao] = useState("");
  const [respiracao, setRespiracao] = useState("");
  const [glicemia, setGlicemia] = useState("");

  const [queixa, setQueixa] = useState("");
  const [sintomas, setSintomas] = useState("");
  const [inicio, setInicio] = useState("");
  const [dor, setDor] = useState("");
  const [historico, setHistorico] = useState("");
  const [alergias, setAlergias] = useState("");
  const [medicamentos, setMedicamentos] = useState("");

  const [classificacao, setClassificacao] = useState("");
  const [observacoes, setObservacoes] = useState("");

  const [erro, setErro] = useState("");
  const [aviso, setAviso] = useState("");
  const [buscaLista, setBuscaLista] = useState("");
  const [filtroStatus, setFiltroStatus] = useState("Todos");
  const [detalhe, setDetalhe] = useState(null);

  const pacientesEncontrados = useMemo(() => {
    const termo = buscaPaciente.trim().toLowerCase();

    if (!termo || paciente) return [];

    return PACIENTES.filter(
      (item) =>
        item.nome.toLowerCase().includes(termo) ||
        item.cpf.includes(termo)
    );
  }, [buscaPaciente, paciente]);

  const triagensFiltradas = useMemo(() => {
    const termo = buscaLista.trim().toLowerCase();

    return triagens
      .filter(
        (item) =>
          filtroStatus === "Todos" || item.status === filtroStatus
      )
      .filter((item) => {
        if (!termo) return true;

        return (
          item.paciente.nome.toLowerCase().includes(termo) ||
          item.paciente.cpf.includes(termo) ||
          item.classificacao.toLowerCase().includes(termo) ||
          String(item.id).includes(termo)
        );
      })
      .sort((a, b) =>
        `${b.data} ${b.horario}`.localeCompare(`${a.data} ${a.horario}`)
      );
  }, [triagens, buscaLista, filtroStatus]);

  const indicadores = useMemo(() => {
    const hoje = dataLocalISO();
    const doDia = triagens.filter((item) => item.data === hoje);

    return {
      total: doDia.length,
      aguardando: doDia.filter(
        (item) => item.status === "Aguardando atendimento médico"
      ).length,
      encaminhadas: doDia.filter(
        (item) => item.status === "Encaminhada ao médico"
      ).length,
      urgentes: doDia.filter(
        (item) =>
          item.classificacao === "Urgente" ||
          item.classificacao === "Muito urgente"
      ).length,
    };
  }, [triagens]);

  function selecionarPaciente(item) {
    setPaciente(item);
    setBuscaPaciente(item.nome);
    setErro("");
  }

  function limparFormulario() {
    setPaciente(null);
    setBuscaPaciente("");

    setPressao("");
    setFrequencia("");
    setTemperatura("");
    setSaturacao("");
    setRespiracao("");
    setGlicemia("");

    setQueixa("");
    setSintomas("");
    setInicio("");
    setDor("");
    setHistorico("");
    setAlergias("");
    setMedicamentos("");

    setClassificacao("");
    setObservacoes("");
    setErro("");
  }

  function salvarTriagem(event) {
    event.preventDefault();

    if (!paciente) {
      setErro("Selecione um paciente para continuar.");
      return;
    }

    if (
      !pressao ||
      !frequencia ||
      !temperatura ||
      !saturacao ||
      !respiracao
    ) {
      setErro("Preencha os sinais vitais obrigatórios.");
      return;
    }

    if (!queixa.trim() || !classificacao) {
      setErro("Informe a queixa principal e a classificação de risco.");
      return;
    }

    const registro = {
      id: Date.now(),
      paciente,
      data: dataLocalISO(),
      horario: horarioAtual(),
      pressao,
      frequencia,
      temperatura,
      saturacao,
      respiracao,
      glicemia,
      queixa,
      sintomas,
      inicio,
      dor,
      historico,
      alergias,
      medicamentos,
      classificacao,
      observacoes,
      status: "Aguardando atendimento médico",
    };

    setTriagens((atuais) => [registro, ...atuais]);

    setAviso(
      "Triagem registrada e encaminhada para a fila de atendimento médico."
    );

    limparFormulario();
    setAba("lista");
    setBuscaLista("");
    setFiltroStatus("Todos");
  }

  function atualizarStatus(item, status) {
    setTriagens((atuais) =>
      atuais.map((registro) =>
        registro.id === item.id
          ? { ...registro, status }
          : registro
      )
    );

    setDetalhe(null);
    setAviso(`Situação atualizada para "${status}".`);
  }

  const camposPreenchidos = [
    !!paciente,
    !!pressao && !!frequencia && !!temperatura && !!saturacao && !!respiracao,
    !!queixa.trim(),
    !!classificacao,
  ];

  const totalPreenchido = camposPreenchidos.filter(Boolean).length;

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#F1F6FB] text-[#0B1756]">
      <div className="pointer-events-none absolute -left-40 top-72 h-96 w-96 rounded-full bg-[#D9EAF8]/70" />
      <div className="pointer-events-none absolute -right-48 top-24 h-[34rem] w-[34rem] rounded-full bg-[#D3E5F7]/70" />
      <div className="pointer-events-none absolute right-[12%] top-[950px] h-56 w-56 rounded-full border-[42px] border-white/80" />

      <div className="relative z-10 mx-auto w-full max-w-[1550px] px-4 pb-14 pt-7 sm:px-6 lg:px-8">

        {/* CABEÇALHO */}
        <section className="relative overflow-hidden rounded-[30px] bg-gradient-to-br from-[#174693] via-[#234E96] to-[#151A67] px-6 py-8 text-white shadow-[0_20px_55px_rgba(2,62,138,0.16)] sm:px-9 lg:px-10">
          <div className="pointer-events-none absolute -right-16 -top-32 h-80 w-80 rounded-full bg-white/10" />
          <div className="pointer-events-none absolute left-[42%] top-10 h-56 w-56 rounded-full border-[36px] border-white/[0.05]" />

          <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-semibold">
                <Stethoscope size={14} />
                Atendimento clínico · Rede UneSUS
              </span>

              <h1 className="mt-4 text-3xl font-bold leading-tight sm:text-4xl">
                Triagem de Enfermagem
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-blue-100 sm:text-base">
                Registre os sinais vitais, identifique as principais queixas
                e encaminhe as informações do paciente para avaliação médica.
              </p>
            </div>

            <div className="grid w-full max-w-[410px] grid-cols-2 gap-3">
              <HeroInfo
                icon={<ShieldCheck size={18} />}
                titulo="Registro seguro"
                texto="Avaliação inicial"
              />
              <HeroInfo
                icon={<Activity size={18} />}
                titulo="Fluxo clínico"
                texto="Encaminhamento médico"
              />
            </div>
          </div>
        </section>

        {/* INDICADORES */}
        <section className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard
            icon={<ClipboardList size={20} />}
            label="Triagens realizadas hoje"
            value={indicadores.total}
            tone="blue"
          />
          <MetricCard
            icon={<Clock3 size={20} />}
            label="Aguardando atendimento médico"
            value={indicadores.aguardando}
            tone="amber"
          />
          <MetricCard
            icon={<CheckCircle2 size={20} />}
            label="Encaminhadas ao médico"
            value={indicadores.encaminhadas}
            tone="green"
          />
          <MetricCard
            icon={<HeartPulse size={20} />}
            label="Classificadas como urgentes"
            value={indicadores.urgentes}
            tone="red"
          />
        </section>

        {/* ABAS */}
        <section className="mt-6 overflow-hidden rounded-[24px] border border-[#DCE8F3] bg-white shadow-[0_12px_36px_rgba(2,62,138,0.07)]">
          <div className="grid grid-cols-2 gap-2 p-2 sm:p-3">
            <button
              type="button"
              onClick={() => {
                setAba("nova");
                setAviso("");
              }}
              className={`flex min-h-12 items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-bold transition ${
                aba === "nova"
                  ? "bg-[#194391] text-white shadow-sm"
                  : "text-[#174693] hover:bg-[#F0F5FA]"
              }`}
            >
              <Plus size={17} />
              Nova triagem
            </button>

            <button
              type="button"
              onClick={() => {
                setAba("lista");
                setAviso("");
              }}
              className={`flex min-h-12 items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-bold transition ${
                aba === "lista"
                  ? "bg-[#194391] text-white shadow-sm"
                  : "text-[#174693] hover:bg-[#F0F5FA]"
              }`}
            >
              <ListChecks size={17} />
              Triagens realizadas ({triagens.length})
            </button>
          </div>
        </section>

        {/* AVISOS */}
        {aviso && (
          <div className="mt-4 flex items-start gap-3 rounded-2xl border border-[#C9DDF0] bg-[#EAF3FA] px-4 py-3 text-sm text-[#174693]">
            <Info size={18} className="mt-0.5 shrink-0" />
            <p className="flex-1">{aviso}</p>
            <button
              type="button"
              onClick={() => setAviso("")}
              aria-label="Fechar aviso"
            >
              <X size={17} />
            </button>
          </div>
        )}

        {/* FORMULÁRIO */}
        {aba === "nova" ? (
          <form onSubmit={salvarTriagem} className="mt-5">

            

            <div className="grid items-start gap-5 xl:grid-cols-[minmax(0,1.45fr)_minmax(380px,1fr)]">

              {/* COLUNA PRINCIPAL */}
              <div className="space-y-5">

                {/* IDENTIFICAÇÃO */}
                <section className="rounded-[24px] border border-[#DCE8F3] bg-white p-5 shadow-[0_10px_30px_rgba(2,62,138,0.05)] sm:p-7">
                  <SectionHeading
                    number="01"
                    icon={<UserRound size={20} />}
                    title="Identificação do paciente"
                    description="Localize o cadastro da pessoa que será avaliada."
                  />

                  <div className="relative mt-5">
                    <label className="mb-2 block text-sm font-semibold text-[#0B1756]">
                      Buscar por nome ou CPF <span className="text-red-500">*</span>
                    </label>

                    <div className="relative">
                      <Search
                        size={18}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                      />

                      <input
                        value={buscaPaciente}
                        onChange={(event) => {
                          setBuscaPaciente(event.target.value);
                          setPaciente(null);
                          setErro("");
                        }}
                        placeholder="Digite o nome ou CPF do paciente"
                        className="h-13 w-full rounded-xl border border-slate-200 bg-[#F8FAFD] py-3 pl-11 pr-4 text-sm outline-none transition focus:border-[#3563A7] focus:bg-white focus:ring-4 focus:ring-[#3563A7]/10"
                      />

                      {pacientesEncontrados.length > 0 && (
                        <div className="absolute left-0 right-0 top-full z-30 mt-2 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl">
                          {pacientesEncontrados.map((item) => (
                            <button
                              key={item.id}
                              type="button"
                              onClick={() => selecionarPaciente(item)}
                              className="flex w-full items-center gap-3 border-b border-slate-100 px-4 py-3 text-left last:border-0 hover:bg-[#F3F7FC]"
                            >
                              <Avatar nome={item.nome} />
                              <span className="min-w-0 flex-1">
                                <span className="block text-sm font-semibold text-[#0B1756]">
                                  {item.nome}
                                </span>
                                <span className="mt-0.5 block text-xs text-slate-500">
                                  CPF: {item.cpf} · {item.idade} anos
                                </span>
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
                          <p className="font-bold text-[#0B1756]">
                            {paciente.nome}
                          </p>
                          <p className="mt-1 text-xs text-slate-600">
                            CPF: {paciente.cpf} · {paciente.idade} anos · {paciente.sexo}
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            setPaciente(null);
                            setBuscaPaciente("");
                          }}
                          className="rounded-lg border border-emerald-200 bg-white px-3 py-2 text-xs font-semibold text-emerald-800 hover:bg-emerald-100"
                        >
                          Trocar paciente
                        </button>
                      </div>
                    )}
                  </div>
                </section>

                {/* SINAIS VITAIS */}
                <section className="rounded-[24px] border border-[#DCE8F3] bg-white p-5 shadow-[0_10px_30px_rgba(2,62,138,0.05)] sm:p-7">
                  <SectionHeading
                    number="02"
                    icon={<HeartPulse size={20} />}
                    title="Sinais vitais"
                    description="Registre os dados aferidos durante a avaliação inicial."
                  />

                  <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <Field
                      label="Pressão arterial"
                      placeholder="Ex.: 120/80"
                      value={pressao}
                      onChange={setPressao}
                      suffix="mmHg"
                      required
                    />

                    <Field
                      label="Frequência cardíaca"
                      placeholder="Ex.: 80"
                      value={frequencia}
                      onChange={setFrequencia}
                      suffix="bpm"
                      required
                    />

                    <Field
                      label="Temperatura"
                      placeholder="Ex.: 36.5"
                      value={temperatura}
                      onChange={setTemperatura}
                      suffix="°C"
                      required
                    />

                    <Field
                      label="Saturação de oxigênio"
                      placeholder="Ex.: 98"
                      value={saturacao}
                      onChange={setSaturacao}
                      suffix="%"
                      required
                    />

                    <Field
                      label="Frequência respiratória"
                      placeholder="Ex.: 16"
                      value={respiracao}
                      onChange={setRespiracao}
                      suffix="irpm"
                      required
                    />

                    <Field
                      label="Glicemia capilar"
                      placeholder="Ex.: 95"
                      value={glicemia}
                      onChange={setGlicemia}
                      suffix="mg/dL"
                    />
                  </div>

                  <div className="mt-5 rounded-xl border border-[#DCE8F3] bg-[#F8FAFD] p-4">
                    <div className="flex items-start gap-3">
                      <Info size={18} className="mt-0.5 shrink-0 text-[#3563A7]" />
                      <p className="text-xs leading-5 text-slate-500">
                        Registre os valores aferidos e siga o protocolo
                        de avaliação adotado pela unidade de saúde.
                      </p>
                    </div>
                  </div>
                </section>

                {/* AVALIAÇÃO */}
                <section className="rounded-[24px] border border-[#DCE8F3] bg-white p-5 shadow-[0_10px_30px_rgba(2,62,138,0.05)] sm:p-7">
                  <SectionHeading
                    number="03"
                    icon={<FileText size={20} />}
                    title="Avaliação inicial"
                    description="Descreva o motivo da procura e as informações relatadas pelo paciente."
                  />

                  <div className="mt-6 space-y-5">
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-[#0B1756]">
                        Queixa principal <span className="text-red-500">*</span>
                      </label>
                      <input
                        value={queixa}
                        onChange={(event) => setQueixa(event.target.value)}
                        placeholder="Qual o principal motivo da procura pelo atendimento?"
                        className="h-12 w-full rounded-xl border border-slate-200 bg-[#F8FAFD] px-4 text-sm outline-none transition focus:border-[#3563A7] focus:bg-white focus:ring-4 focus:ring-[#3563A7]/10"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-semibold text-[#0B1756]">
                        Descrição dos sintomas
                      </label>
                      <textarea
                        value={sintomas}
                        onChange={(event) => setSintomas(event.target.value)}
                        rows={3}
                        placeholder="Descreva os sintomas apresentados pelo paciente..."
                        className="w-full resize-none rounded-xl border border-slate-200 bg-[#F8FAFD] px-4 py-3 text-sm outline-none transition focus:border-[#3563A7] focus:bg-white focus:ring-4 focus:ring-[#3563A7]/10"
                      />
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className="mb-2 block text-sm font-semibold text-[#0B1756]">
                          Início dos sintomas
                        </label>
                        <input
                          value={inicio}
                          onChange={(event) => setInicio(event.target.value)}
                          placeholder="Ex.: Há dois dias"
                          className="h-12 w-full rounded-xl border border-slate-200 bg-[#F8FAFD] px-4 text-sm outline-none focus:border-[#3563A7] focus:bg-white"
                        />
                      </div>

                      <div>
                        <label className="mb-2 block text-sm font-semibold text-[#0B1756]">
                          Intensidade da dor
                        </label>
                        <select
                          value={dor}
                          onChange={(event) => setDor(event.target.value)}
                          className="h-12 w-full rounded-xl border border-slate-200 bg-[#F8FAFD] px-4 text-sm outline-none focus:border-[#3563A7] focus:bg-white"
                        >
                          <option value="">Selecione</option>
                          <option>Sem dor</option>
                          <option>Leve</option>
                          <option>Moderada</option>
                          <option>Intensa</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className="mb-2 block text-sm font-semibold text-[#0B1756]">
                          Histórico de saúde
                        </label>
                        <textarea
                          value={historico}
                          onChange={(event) => setHistorico(event.target.value)}
                          rows={3}
                          placeholder="Doenças preexistentes e condições relatadas..."
                          className="w-full resize-none rounded-xl border border-slate-200 bg-[#F8FAFD] px-4 py-3 text-sm outline-none focus:border-[#3563A7] focus:bg-white"
                        />
                      </div>

                      <div>
                        <label className="mb-2 block text-sm font-semibold text-[#0B1756]">
                          Alergias
                        </label>
                        <textarea
                          value={alergias}
                          onChange={(event) => setAlergias(event.target.value)}
                          rows={3}
                          placeholder="Alergias relatadas pelo paciente..."
                          className="w-full resize-none rounded-xl border border-slate-200 bg-[#F8FAFD] px-4 py-3 text-sm outline-none focus:border-[#3563A7] focus:bg-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-semibold text-[#0B1756]">
                        Medicamentos em uso
                      </label>
                      <input
                        value={medicamentos}
                        onChange={(event) => setMedicamentos(event.target.value)}
                        placeholder="Informe os medicamentos utilizados, se houver"
                        className="h-12 w-full rounded-xl border border-slate-200 bg-[#F8FAFD] px-4 text-sm outline-none focus:border-[#3563A7] focus:bg-white"
                      />
                    </div>
                  </div>
                </section>

                
              </div>

              {/* COLUNA LATERAL */}
              <aside className="space-y-5 xl:sticky xl:top-5">

                <section className="overflow-hidden rounded-[24px] border border-[#DCE8F3] bg-white shadow-[0_10px_30px_rgba(2,62,138,0.06)]">
                  <div className="bg-gradient-to-r from-[#174693] to-[#234E96] px-5 py-5 text-white">
                    
                    <h3 className="mt-1 text-lg font-bold">
                      Dados do atendimento
                    </h3>
                    <p className="mt-1 text-xs text-blue-100">
                      Confira as informações antes de encaminhar.
                    </p>
                  </div>

                  <div className="p-5">
                    {paciente ? (
                      <div className="flex items-center gap-3 border-b border-slate-100 pb-5">
                        <Avatar nome={paciente.nome} />
                        <div className="min-w-0">
                          <p className="truncate text-sm font-bold text-[#0B1756]">
                            {paciente.nome}
                          </p>
                          <p className="mt-1 text-xs text-slate-500">
                            {paciente.idade} anos · {paciente.sexo}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="rounded-xl bg-[#F8FAFD] p-4 text-center">
                        <UserRound className="mx-auto text-slate-300" size={25} />
                        <p className="mt-2 text-xs text-slate-500">
                          Nenhum paciente selecionado
                        </p>
                      </div>
                    )}

                    <div className="mt-5 space-y-3">
                      <SummaryLine label="Pressão arterial" value={pressao || "—"} />
                      <SummaryLine label="Frequência cardíaca" value={frequencia ? `${frequencia} bpm` : "—"} />
                      <SummaryLine label="Temperatura" value={temperatura ? `${temperatura} °C` : "—"} />
                      <SummaryLine label="Saturação" value={saturacao ? `${saturacao}%` : "—"} />
                      <SummaryLine label="Frequência respiratória" value={respiracao ? `${respiracao} irpm` : "—"} />
                      <SummaryLine label="Glicemia" value={glicemia ? `${glicemia} mg/dL` : "Não informada"} />
                    </div>

                    <div className="mt-5 rounded-xl bg-[#F1F6FB] p-4">
                      <p className="text-xs font-bold text-[#174693]">
                        Classificação de risco
                      </p>
                      <p className="mt-2 text-sm font-bold text-[#0B1756]">
                        {classificacao || "Aguardando classificação"}
                      </p>
                    </div>

                    <div className="mt-5">
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-bold text-[#0B1756]">
                          Progresso do preenchimento
                        </p>
                        <span className="text-xs font-bold text-[#174693]">
                          {totalPreenchido}/4
                        </span>
                      </div>

                      <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
                        <div
                          className="h-full rounded-full bg-[#3563A7] transition-all"
                          style={{ width: `${(totalPreenchido / 4) * 100}%` }}
                        />
                      </div>
                    </div>

                    {erro && (
                      <div className="mt-5 flex gap-2 rounded-xl border border-red-100 bg-red-50 p-3 text-xs leading-5 text-red-700">
                        <AlertCircle size={16} className="mt-0.5 shrink-0" />
                        {erro}
                      </div>
                    )}

                    <button
                      type="submit"
                      className="mt-5 flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#194391] px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-[#0B1756]"
                    >
                      <CheckCircle2 size={18} />
                      Finalizar e encaminhar
                    </button>
                  </div>
                </section>

                {/* CLASSIFICAÇÃO */}
                <section className="rounded-[24px] min-h-[620px] border border-[#DCE8F3] bg-white p-5 shadow-[0_10px_30px_rgba(2,62,138,0.05)] sm:p-7">
                  <SectionHeading
                    number="04"
                    icon={<ShieldCheck size={20} />}
                    title="Classificação e encaminhamento"
                    description="Registre a classificação de risco conforme o protocolo da unidade."
                  />

                  <div className="mt-6">
                    <label className="mb-3 block text-sm font-semibold text-[#0B1756]">
                      Classificação de risco <span className="text-red-500">*</span>
                    </label>

                    <div className="grid gap-3 sm:grid-cols-2">
                      {[
                        {
                          nome: "Não urgente",
                          descricao: "Atendimento conforme fluxo da unidade",
                          cor: "border-blue-200 bg-blue-50 text-blue-800",
                          selecionado: "border-blue-500 bg-blue-100 ring-2 ring-blue-200",
                        },
                        {
                          nome: "Pouco urgente",
                          descricao: "Necessita avaliação, sem urgência aparente",
                          cor: "border-emerald-200 bg-emerald-50 text-emerald-800",
                          selecionado: "border-emerald-500 bg-emerald-100 ring-2 ring-emerald-200",
                        },
                        {
                          nome: "Urgente",
                          descricao: "Necessita avaliação em tempo oportuno",
                          cor: "border-amber-200 bg-amber-50 text-amber-800",
                          selecionado: "border-amber-500 bg-amber-100 ring-2 ring-amber-200",
                        },
                        {
                          nome: "Muito urgente",
                          descricao: "Requer avaliação prioritária imediata",
                          cor: "border-red-200 bg-red-50 text-red-800",
                          selecionado: "border-red-500 bg-red-100 ring-2 ring-red-200",
                        },
                      ].map((item) => (
                        <button
                          key={item.nome}
                          type="button"
                          onClick={() => setClassificacao(item.nome)}
                          className={`rounded-xl border p-4 text-left transition ${
                            classificacao === item.nome
                              ? item.selecionado
                              : `${item.cor} hover:brightness-[0.98]`
                          }`}
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-sm font-bold">
                              {item.nome}
                            </span>
                            {classificacao === item.nome && (
                              <CheckCircle2 size={18} />
                            )}
                          </div>
                          <p className="mt-1 text-xs opacity-80">
                            {item.descricao}
                          </p>
                        </button>
                      ))}
                    </div>

                    <div className="mt-5">
                      <label className="mb-2 block text-sm font-semibold text-[#0B1756]">
                        Observações da enfermagem
                      </label>
                      <textarea
                        value={observacoes}
                        onChange={(event) => setObservacoes(event.target.value)}
                        rows={4}
                        placeholder="Registre outras informações relevantes para o profissional médico..."
                        className="w-full resize-none rounded-xl border border-slate-200 bg-[#F8FAFD] px-4 py-3 text-sm outline-none transition focus:border-[#3563A7] focus:bg-white focus:ring-4 focus:ring-[#3563A7]/10"
                      />
                    </div>
                  </div>
                </section>
              </aside>
            </div>
          </form>
        ) : (

          /* LISTA DE TRIAGENS */
          <section className="mt-5 overflow-hidden rounded-[24px] border border-[#DCE8F3] bg-white shadow-[0_12px_36px_rgba(2,62,138,0.07)]">
            <div className="flex flex-col gap-4 border-b border-slate-100 p-5 sm:p-7 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 className="text-xl font-bold text-[#0B1756]">
                  Histórico de triagens
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Consulte as avaliações realizadas e acompanhe os encaminhamentos.
                </p>
              </div>
            </div>

            <div className="grid gap-3 p-5 sm:grid-cols-[minmax(0,1fr)_250px] sm:p-6">
              <div className="relative">
                <Search
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  value={buscaLista}
                  onChange={(event) => setBuscaLista(event.target.value)}
                  placeholder="Buscar paciente, CPF ou classificação..."
                  className="h-12 w-full rounded-xl border border-slate-200 bg-[#F8FAFD] pl-11 pr-4 text-sm outline-none focus:border-[#3563A7] focus:bg-white focus:ring-4 focus:ring-[#3563A7]/10"
                />
              </div>

              <div className="relative">
                <Filter
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <select
                  value={filtroStatus}
                  onChange={(event) => setFiltroStatus(event.target.value)}
                  className="h-12 w-full appearance-none rounded-xl border border-slate-200 bg-[#F8FAFD] pl-10 pr-9 text-sm text-[#0B1756] outline-none focus:border-[#3563A7]"
                >
                  {[
                    "Todos",
                    "Aguardando atendimento médico",
                    "Encaminhada ao médico",
                  ].map((status) => (
                    <option key={status}>{status}</option>
                  ))}
                </select>
                <ChevronDown
                  size={15}
                  className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-2 px-5 pb-5 sm:px-6">
              <StatusPill
                status="Todos"
                active={filtroStatus === "Todos"}
                onClick={() => setFiltroStatus("Todos")}
              />
              <StatusPill
                status="Aguardando atendimento médico"
                active={filtroStatus === "Aguardando atendimento médico"}
                onClick={() => setFiltroStatus("Aguardando atendimento médico")}
              />
              <StatusPill
                status="Encaminhada ao médico"
                active={filtroStatus === "Encaminhada ao médico"}
                onClick={() => setFiltroStatus("Encaminhada ao médico")}
              />
            </div>

            <div className="hidden overflow-x-auto border-t border-slate-100 md:block">
              <table className="w-full min-w-[950px] text-left">
                <thead className="bg-[#F7FAFD] text-[11px] uppercase tracking-wide text-slate-500">
                  <tr>
                    <th className="px-6 py-4 font-bold">Paciente</th>
                    <th className="px-4 py-4 font-bold">Queixa principal</th>
                    <th className="px-4 py-4 font-bold">Classificação</th>
                    <th className="px-4 py-4 font-bold">Data e horário</th>
                    <th className="px-4 py-4 font-bold">Situação</th>
                    <th className="px-6 py-4 text-right font-bold">Ações</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {triagensFiltradas.map((item) => (
                    <tr key={item.id} className="transition hover:bg-[#FAFCFE]">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <Avatar nome={item.paciente.nome} />
                          <div>
                            <p className="text-sm font-bold text-[#0B1756]">
                              {item.paciente.nome}
                            </p>
                            <p className="mt-0.5 text-xs text-slate-500">
                              {item.paciente.cpf}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="max-w-[210px] px-4 py-4">
                        <p className="text-sm font-semibold text-[#0B1756]">
                          {item.queixa}
                        </p>
                      </td>

                      <td className="px-4 py-4">
                        <RiskBadge classificacao={item.classificacao} />
                      </td>

                      <td className="px-4 py-4">
                        <p className="text-sm font-semibold text-[#0B1756]">
                          {formatarData(item.data)}
                        </p>
                        <p className="mt-0.5 flex items-center gap-1 text-xs text-slate-500">
                          <Clock3 size={12} />
                          {item.horario}
                        </p>
                      </td>

                      <td className="px-4 py-4">
                        <StatusBadge status={item.status} />
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            type="button"
                            onClick={() => setDetalhe(item)}
                            title="Ver detalhes"
                            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-[#174693]"
                          >
                            <Info size={17} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {triagensFiltradas.length === 0 && (
                <EmptyState
                  icon={<Search size={22} />}
                  title="Nenhuma triagem encontrada"
                  description="Altere a busca ou o filtro para consultar outros registros."
                />
              )}
            </div>

            {/* VERSÃO MOBILE */}
            <div className="space-y-3 border-t border-slate-100 p-4 md:hidden">
              {triagensFiltradas.map((item) => (
                <article
                  key={item.id}
                  className="rounded-2xl border border-slate-200 p-4"
                >
                  <div className="flex items-start gap-3">
                    <Avatar nome={item.paciente.nome} />
                    <div className="min-w-0 flex-1">
                      <p className="font-bold text-[#0B1756]">
                        {item.paciente.nome}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        {item.paciente.cpf}
                      </p>
                      <div className="mt-2">
                        <RiskBadge classificacao={item.classificacao} />
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 space-y-2 border-t border-slate-100 pt-3 text-sm">
                    <p>
                      <span className="text-slate-500">Queixa: </span>
                      <strong>{item.queixa}</strong>
                    </p>
                    <p>
                      <span className="text-slate-500">Data: </span>
                      {formatarData(item.data)} às {item.horario}
                    </p>
                    <p>
                      <span className="text-slate-500">Situação: </span>
                      {item.status}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setDetalhe(item)}
                    className="mt-4 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                  >
                    Ver detalhes da triagem
                  </button>
                </article>
              ))}

              {triagensFiltradas.length === 0 && (
                <EmptyState
                  icon={<Search size={22} />}
                  title="Nenhuma triagem encontrada"
                  description="Altere a busca ou o filtro para consultar outros registros."
                />
              )}
            </div>

            <div className="flex items-center justify-between border-t border-slate-100 px-5 py-4 text-xs text-slate-500 sm:px-6">
              <span>
                Exibindo {triagensFiltradas.length} de {triagens.length} triagens
              </span>
              <span>Dados demonstrativos</span>
            </div>
          </section>
        )}
      </div>

      {/* MODAL DE DETALHES */}
      {detalhe && (
        <Modal
          onClose={() => setDetalhe(null)}
          title="Detalhes da triagem"
        >
          <div className="flex items-center gap-3 rounded-xl bg-[#F1F6FB] p-4">
            <Avatar nome={detalhe.paciente.nome} />
            <div>
              <p className="font-bold text-[#0B1756]">
                {detalhe.paciente.nome}
              </p>
              <p className="text-xs text-slate-500">
                {detalhe.paciente.cpf} · {detalhe.paciente.idade} anos
              </p>
            </div>
          </div>

          <div className="mt-5">
            <h3 className="mb-3 text-sm font-bold text-[#174693]">
              Sinais vitais
            </h3>
            <div className="space-y-3">
              <SummaryLine label="Pressão arterial" value={`${detalhe.pressao} mmHg`} />
              <SummaryLine label="Frequência cardíaca" value={`${detalhe.frequencia} bpm`} />
              <SummaryLine label="Temperatura" value={`${detalhe.temperatura} °C`} />
              <SummaryLine label="Saturação" value={`${detalhe.saturacao}%`} />
              <SummaryLine label="Frequência respiratória" value={`${detalhe.respiracao} irpm`} />
              <SummaryLine label="Glicemia" value={detalhe.glicemia ? `${detalhe.glicemia} mg/dL` : "Não informada"} />
            </div>
          </div>

          <div className="mt-5 border-t border-slate-100 pt-5">
            <h3 className="mb-3 text-sm font-bold text-[#174693]">
              Avaliação inicial
            </h3>
            <div className="space-y-3">
              <SummaryLine label="Queixa principal" value={detalhe.queixa} />
              <SummaryLine label="Sintomas" value={detalhe.sintomas || "Não informado"} />
              <SummaryLine label="Início" value={detalhe.inicio || "Não informado"} />
              <SummaryLine label="Intensidade da dor" value={detalhe.dor || "Não informada"} />
              <SummaryLine label="Histórico" value={detalhe.historico || "Não informado"} />
              <SummaryLine label="Alergias" value={detalhe.alergias || "Não informado"} />
              <SummaryLine label="Medicamentos" value={detalhe.medicamentos || "Não informado"} />
              <SummaryLine label="Observações" value={detalhe.observacoes || "Nenhuma"} />
            </div>
          </div>

          <div className="mt-5 rounded-xl bg-[#F1F6FB] p-4">
            <p className="text-xs font-bold text-[#174693]">
              Classificação de risco
            </p>
            <div className="mt-2">
              <RiskBadge classificacao={detalhe.classificacao} />
            </div>
          </div>

          <div className="mt-5 flex flex-wrap justify-end gap-2">
            {detalhe.status !== "Encaminhada ao médico" && (
              <button
                type="button"
                onClick={() =>
                  atualizarStatus(detalhe, "Encaminhada ao médico")
                }
                className="rounded-xl bg-[#194391] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#0B1756]"
              >
                Encaminhar ao médico
              </button>
            )}

            {detalhe.status !== "Aguardando atendimento médico" && (
              <button
                type="button"
                onClick={() =>
                  atualizarStatus(detalhe, "Aguardando atendimento médico")
                }
                className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-[#174693]"
              >
                Aguardando atendimento
              </button>
            )}
          </div>
        </Modal>
      )}
    </main>
  );
}

/* =========================
   COMPONENTES AUXILIARES
========================= */

function HeroInfo({ icon, titulo, texto }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-white/15 bg-white/10 p-3">
      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
        {icon}
      </span>
      <span>
        <span className="block text-xs font-bold">{titulo}</span>
        <span className="mt-0.5 block text-[11px] text-blue-100">
          {texto}
        </span>
      </span>
    </div>
  );
}

function MetricCard({ icon, label, value, tone }) {
  const styles = {
    blue: "bg-[#EAF1F8] text-[#174693]",
    green: "bg-emerald-50 text-emerald-700",
    amber: "bg-amber-50 text-amber-700",
    red: "bg-red-50 text-red-700",
  };

  return (
    <div className="flex items-center gap-4 rounded-2xl border border-[#DCE8F3] bg-white p-5 shadow-[0_8px_24px_rgba(2,62,138,0.04)]">
      <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${styles[tone]}`}>
        {icon}
      </span>
      <span>
        <span className="block text-2xl font-bold leading-none text-[#0B1756]">
          {value}
        </span>
        <span className="mt-2 block text-xs font-medium text-slate-500">
          {label}
        </span>
      </span>
    </div>
  );
}

function Step({ number, title, description, active, done }) {
  return (
    <div className="flex min-w-0 items-center gap-3 rounded-xl bg-[#F8FAFD] px-3 py-3">
      <span
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm font-bold ${
          done
            ? "bg-emerald-500 text-white"
            : active
              ? "bg-[#194391] text-white"
              : "bg-[#E7EFF7] text-[#174693]"
        }`}
      >
        {done ? <Check size={17} /> : number}
      </span>
      <span className="min-w-0">
        <span className="block text-sm font-bold text-[#0B1756]">
          {title}
        </span>
        <span className="block truncate text-xs text-slate-500">
          {description}
        </span>
      </span>
    </div>
  );
}

function SectionHeading({ number, icon, title, description }) {
  return (
    <div className="flex items-center gap-3">
      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#EAF1F8] text-[#174693]">
        {icon}
      </span>
      <span>
        <span className="block text-[10px] font-bold uppercase tracking-[2px] text-[#3563A7]">
          Etapa {number}
        </span>
        <span className="block text-lg font-bold text-[#0B1756]">
          {title}
        </span>
        <span className="mt-0.5 block text-xs text-slate-500">
          {description}
        </span>
      </span>
    </div>
  );
}

function Field({ label, placeholder, value, onChange, suffix, required }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-[#0B1756]">
        {label}
        {required && <span className="text-red-500"> *</span>}
      </label>
      <div className="relative">
        <input
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          className="h-12 w-full rounded-xl border border-slate-200 bg-[#F8FAFD] px-4 pr-16 text-sm outline-none transition focus:border-[#3563A7] focus:bg-white focus:ring-4 focus:ring-[#3563A7]/10"
        />
        {suffix && (
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-medium text-slate-400">
            {suffix}
          </span>
        )}
      </div>
    </div>
  );
}

function Avatar({ nome }) {
  return (
    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#E5EEF8] text-sm font-bold text-[#174693]">
      {iniciais(nome)}
    </span>
  );
}

function SummaryLine({ label, value }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-3 last:border-0 last:pb-0">
      <span className="shrink-0 text-xs text-slate-500">{label}</span>
      <span className="max-w-[65%] text-right text-sm font-semibold text-[#0B1756]">
        {value}
      </span>
    </div>
  );
}

function ChecklistItem({ done, title, description }) {
  return (
    <div className="flex items-start gap-3">
      <span
        className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${
          done
            ? "bg-emerald-100 text-emerald-700"
            : "bg-slate-100 text-slate-400"
        }`}
      >
        {done ? <Check size={14} /> : <Clock3 size={13} />}
      </span>
      <span>
        <span className="block text-sm font-semibold text-[#0B1756]">
          {title}
        </span>
        <span className="mt-0.5 block text-xs text-slate-500">
          {description}
        </span>
      </span>
    </div>
  );
}

function RiskBadge({ classificacao }) {
  const styles = {
    "Não urgente": "border-blue-100 bg-blue-50 text-blue-700",
    "Pouco urgente": "border-emerald-100 bg-emerald-50 text-emerald-700",
    Urgente: "border-amber-100 bg-amber-50 text-amber-700",
    "Muito urgente": "border-red-100 bg-red-50 text-red-700",
  };

  return (
    <span
      className={`inline-flex whitespace-nowrap rounded-full border px-2.5 py-1 text-[11px] font-bold ${
        styles[classificacao] || "border-slate-200 bg-slate-50 text-slate-600"
      }`}
    >
      {classificacao}
    </span>
  );
}

function StatusBadge({ status }) {
  const style =
    status === "Encaminhada ao médico"
      ? "bg-emerald-50 text-emerald-700 border-emerald-100"
      : "bg-amber-50 text-amber-700 border-amber-100";

  return (
    <span className={`inline-flex whitespace-nowrap rounded-full border px-2.5 py-1 text-[11px] font-bold ${style}`}>
      {status}
    </span>
  );
}

function StatusPill({ status, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
        active
          ? "border-[#174693] bg-[#174693] text-white"
          : "border-slate-200 bg-white text-slate-600 hover:border-[#B8CEE4]"
      }`}
    >
      {status}
    </button>
  );
}

function EmptyState({ icon, title, description }) {
  return (
    <div className="flex min-h-36 flex-col items-center justify-center rounded-2xl border border-dashed border-[#D6E3F0] bg-[#F8FAFD] px-4 py-7 text-center">
      <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-[#9CB3CB] shadow-sm">
        {icon}
      </span>
      <p className="mt-3 text-sm font-bold text-[#174693]">{title}</p>
      <p className="mt-1 text-xs text-slate-500">{description}</p>
    </div>
  );
}

function Modal({ title, onClose, children }) {
  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-[#06194E]/55 p-4 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-[24px] bg-white p-5 shadow-2xl sm:p-7">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-lg font-bold text-[#0B1756]">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar"
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
          >
            <X size={19} />
          </button>
        </div>
        <div className="mt-5">{children}</div>
      </div>
    </div>
  );
}
