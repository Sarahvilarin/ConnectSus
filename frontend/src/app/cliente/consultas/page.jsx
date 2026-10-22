"use client";

import { useEffect, useState } from "react";
import {
  Activity,
  ArrowLeft,
  ArrowRight,
  Baby,
  Bone,
  Brain,
  Building2,
  CalendarCheck,
  CalendarDays,
  CalendarPlus,
  Check,
  CheckCircle2,
  ClipboardList,
  Clock,
  Eye,
  HeartPulse,
  Hospital,
  Info,
  MapPin,
  RefreshCw,
  ShieldCheck,
  Stethoscope,
  X,
} from "lucide-react";

/*
  PALETA
  Texto:            #0B1756
  Botões:           #023E8A  (hover: #3563A7)
  Destaques/apoio:  #3563A7
*/

const especialidades = [
  { nome: "Clínica geral", Icone: Stethoscope },
  { nome: "Cardiologia", Icone: HeartPulse },
  { nome: "Neurologia", Icone: Brain },
  { nome: "Oftalmologia", Icone: Eye },
  { nome: "Pediatria", Icone: Baby },
  { nome: "Ortopedia", Icone: Bone },
];

const UNIDADES = [
  {
    id: 1,
    nome: "Hospital Municipal de Emergências Albert Sabin",
    bairro: "Santa Paula",
    endereco: "São Caetano do Sul - SP",
    horario: "Atendimento 24 horas",
    distancia: "1,2 km",
    km: 1.2,
    especialidades: [
      "Clínica geral",
      "Cardiologia",
      "Neurologia",
      "Pediatria",
      "Ortopedia",
    ],
  },
  {
    id: 2,
    nome: "Hospital Municipal Maria Braido",
    bairro: "Santa Paula",
    endereco: "São Caetano do Sul - SP",
    horario: "Conforme atendimento",
    distancia: "2,4 km",
    km: 2.4,
    especialidades: [
      "Clínica geral",
      "Oftalmologia",
      "Pediatria",
      "Ortopedia",
    ],
  },
  {
    id: 3,
    nome: "Atende Fácil Saúde Pedro Kassab",
    bairro: "Centro",
    endereco: "São Caetano do Sul - SP",
    horario: "Segunda a sexta, das 7h às 17h",
    distancia: "3,1 km",
    km: 3.1,
    especialidades: [
      "Clínica geral",
      "Cardiologia",
      "Neurologia",
      "Oftalmologia",
    ],
  },
];

const horarios = ["08:00", "09:00", "10:30", "14:00", "15:30", "17:00"];

const etapas = ["Agendamento", "Revisão", "Confirmação"];

const consultasIniciais = [
  {
    id: 1,
    especialidade: "Cardiologia",
    unidade: "Hospital Municipal de Emergências Albert Sabin",
    data: "28 de out, 2026",
    horario: "09:00",
    modalidade: "Presencial",
    status: "Agendada",
  },
  {
    id: 2,
    especialidade: "Clínica geral",
    unidade: "Atende Fácil Saúde Pedro Kassab",
    data: "05 de nov, 2026",
    horario: "14:00",
    modalidade: "Presencial",
    status: "Agendada",
  },
  {
    id: 3,
    especialidade: "Oftalmologia",
    unidade: "Hospital Municipal Maria Braido",
    data: "02 de set, 2026",
    horario: "10:30",
    modalidade: "Presencial",
    status: "Concluída",
  },
  {
    id: 4,
    especialidade: "Ortopedia",
    unidade: "Hospital Municipal de Emergências Albert Sabin",
    data: "15 de ago, 2026",
    horario: "17:00",
    modalidade: "Presencial",
    status: "Cancelada",
  },
];

const estiloStatus = {
  Agendada: { badge: "bg-[#3563A7]/15", ponto: "bg-[#023E8A]" },
  Concluída: { badge: "bg-emerald-100", ponto: "bg-emerald-600" },
  Cancelada: { badge: "bg-red-100", ponto: "bg-red-500" },
};

const filtros = ["Todas", "Agendada", "Concluída", "Cancelada"];

export default function Consultas() {
  const [aba, setAba] = useState("agendar");
  const [etapaAtual, setEtapaAtual] = useState(1);
  const [especialidade, setEspecialidade] = useState("");
  const [unidade, setUnidade] = useState(null);
  const modalidade = "Presencial";
  const [dias, setDias] = useState([]);
  const [dia, setDia] = useState(null);
  const [horario, setHorario] = useState("");
  const [motivo, setMotivo] = useState("");
  const [consultas, setConsultas] = useState(consultasIniciais);
  const [filtro, setFiltro] = useState("Todas");
  const [erro, setErro] = useState("");

  // Datas geradas no cliente para evitar diferença entre servidor e navegador
  useEffect(() => {
    const lista = [];
    const hoje = new Date();

    for (let i = 1; lista.length < 7; i++) {
      const d = new Date(hoje);
      d.setDate(hoje.getDate() + i);
      if (d.getDay() === 0) continue; // sem domingos

      lista.push({
        semana: d
          .toLocaleDateString("pt-BR", { weekday: "short" })
          .replace(".", ""),
        numero: d.getDate(),
        mes: d.toLocaleDateString("pt-BR", { month: "short" }).replace(".", ""),
        texto: `${String(d.getDate()).padStart(2, "0")} de ${d
          .toLocaleDateString("pt-BR", { month: "short" })
          .replace(".", "")}, ${d.getFullYear()}`,
      });
    }

    setDias(lista);
  }, []);

  const diaSelecionado = dia !== null ? dias[dia] : null;
  const ativas = consultas.filter((c) => c.status === "Agendada").length;
  const listaFiltrada = consultas.filter(
    (c) => filtro === "Todas" || c.status === filtro
  );

  const unidadesDisponiveis = especialidade
    ? UNIDADES.filter((u) => u.especialidades.includes(especialidade)).sort(
        (a, b) => a.km - b.km
      )
    : [];

  function topo() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function escolherEspecialidade(nome) {
    setEspecialidade(nome);
    setUnidade(null);
  }

  function continuar(event) {
    event.preventDefault();
    setErro("");

    if (!especialidade || !unidade) {
      setErro("Escolha a especialidade e a unidade para continuar.");
      return;
    }

    if (dia === null || !horario) {
      setErro("Selecione a data e o horário da consulta.");
      return;
    }

    setEtapaAtual(2);
    topo();
  }

  function confirmar() {
    setConsultas((atuais) => [
      {
        id: Date.now(),
        especialidade,
        unidade: unidade.nome,
        data: diaSelecionado.texto,
        horario,
        modalidade,
        status: "Agendada",
      },
      ...atuais,
    ]);
    setEtapaAtual(3);
    topo();
  }

  function voltar() {
    setErro("");
    setEtapaAtual((atual) => Math.max(1, atual - 1));
    topo();
  }

  function novoAgendamento(consulta) {
    setEspecialidade(consulta?.especialidade || "");
    setUnidade(UNIDADES.find((u) => u.nome === consulta?.unidade) || null);
    setDia(null);
    setHorario("");
    setMotivo("");
    setErro("");
    setEtapaAtual(1);
    setAba("agendar");
    topo();
  }

  function cancelarConsulta(id) {
    setConsultas((atuais) =>
      atuais.map((c) => (c.id === id ? { ...c, status: "Cancelada" } : c))
    );
  }

  const cardBase = "rounded-xl border border-blue-100 bg-white shadow-sm";
  const botaoPrimario =
    "inline-flex min-h-[50px] items-center justify-center gap-2 rounded-xl bg-[#023E8A] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#3563A7] focus:outline-none focus:ring-4 focus:ring-[#3563A7]/40";
  const botaoSecundario =
    "inline-flex min-h-[50px] items-center justify-center gap-2 rounded-xl border border-[#023E8A] bg-white px-6 py-3 text-sm font-bold text-[#023E8A] transition hover:bg-[#3563A7]/10 focus:outline-none focus:ring-4 focus:ring-[#3563A7]/30";

  return (
    <main className="relative isolate min-h-screen overflow-hidden bg-[#f5faff] text-[#0B1756]">
      {/* Fundo com ilustrações de círculos */}
      <div className="pointer-events-none absolute -right-28 -top-36 z-0 h-[430px] w-[430px] rounded-full bg-[#B8D6FC]/50" />
      <div className="pointer-events-none absolute -left-40 top-10 z-0 h-[330px] w-[330px] rounded-full border-2 border-[#C8DEFF]/60" />
      <div className="pointer-events-none absolute -bottom-36 -left-24 z-0 h-[350px] w-[350px] rounded-full bg-white/50" />
      <div className="pointer-events-none absolute -bottom-40 -right-24 z-0 h-[430px] w-[430px] rounded-full border-[70px] border-[#C5DFFF]/50" />

      <div className="relative z-10 mx-auto max-w-[1440px] px-4 py-7 sm:px-6 sm:py-9 lg:px-10 lg:py-10">
        {/* TÍTULO DA PÁGINA */}
        <section className="mb-8 flex flex-col justify-between gap-5 lg:flex-row lg:items-center">
          <div>
            <span className="mb-3 inline-flex items-center gap-2 rounded-full bg-[#3563A7]/15 px-4 py-1.5 text-xs font-bold uppercase tracking-wide text-[#0B1756]">
              <CalendarDays size={15} />
              Consultas
            </span>

            <h1 className="text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl lg:text-[42px]">
              {aba === "acompanhar" && "Acompanhe suas consultas"}
              {aba === "agendar" && etapaAtual === 1 && "Agende sua consulta"}
              {aba === "agendar" && etapaAtual === 2 && "Revise seu agendamento"}
              {aba === "agendar" && etapaAtual === 3 && "Consulta agendada"}
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-7 sm:text-base">
              {aba === "acompanhar" &&
                "Veja o status dos seus atendimentos, reagende ou cancele quando precisar."}
              {aba === "agendar" &&
                etapaAtual === 1 &&
                "Escolha a especialidade, a unidade mais próxima e o melhor dia e horário para você."}
              {aba === "agendar" &&
                etapaAtual === 2 &&
                "Confira os dados da consulta antes de confirmar."}
              {aba === "agendar" &&
                etapaAtual === 3 &&
                "Seu horário foi reservado nesta demonstração."}
            </p>
          </div>

          <div className="flex max-w-md items-start gap-3 rounded-xl border border-[#3563A7]/40 bg-[#3563A7]/10 p-4">
            <Info className="mt-0.5 shrink-0 text-[#023E8A]" size={23} />
            <p className="text-sm leading-6">
              Chegue com 15 minutos de antecedência nas consultas presenciais e
              leve um documento com foto.
            </p>
          </div>
        </section>

        {/* ABAS */}
        <section className={`${cardBase} mb-7 flex gap-2 p-2`}>
          {[
            { id: "agendar", rotulo: "Agendar consulta", Icone: CalendarPlus },
            {
              id: "acompanhar",
              rotulo: `Minhas consultas (${ativas})`,
              Icone: ClipboardList,
            },
          ].map(({ id, rotulo, Icone }) => (
            <button
              key={id}
              type="button"
              aria-pressed={aba === id}
              onClick={() => setAba(id)}
              className={`flex min-h-[48px] flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-bold transition ${
                aba === id
                  ? "bg-[#023E8A] text-white"
                  : "text-[#0B1756] hover:bg-[#3563A7]/10"
              }`}
            >
              <Icone size={18} />
              {rotulo}
            </button>
          ))}
        </section>

        {/* ===================== ABA: AGENDAR ===================== */}
        {aba === "agendar" && (
          <>
            {/* INDICADOR DE ETAPAS */}
            <section className={`${cardBase} mb-7 p-4 sm:p-5`}>
              <div className="flex items-center">
                {etapas.map((etapa, index) => {
                  const numero = index + 1;
                  const ativa = etapaAtual === numero;
                  const concluida = etapaAtual > numero;

                  return (
                    <div
                      key={etapa}
                      className={`flex min-w-0 items-center ${
                        index < etapas.length - 1 ? "flex-1" : "shrink-0"
                      }`}
                    >
                      <div className="flex min-w-0 items-center gap-2 sm:gap-3">
                        <div
                          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold transition ${
                            ativa || concluida
                              ? "bg-[#023E8A] text-white"
                              : "border border-[#3563A7]/40 bg-white text-[#0B1756]"
                          }`}
                        >
                          {concluida ? <Check size={19} /> : numero}
                        </div>

                        <span
                          className={`hidden text-xs font-semibold sm:block sm:text-sm ${
                            ativa || concluida ? "" : "opacity-60"
                          }`}
                        >
                          {etapa}
                        </span>
                      </div>

                      {index < etapas.length - 1 && (
                        <div
                          className={`mx-2 h-0.5 flex-1 rounded sm:mx-4 ${
                            concluida ? "bg-[#3563A7]" : "bg-blue-100"
                          }`}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </section>

            {/* ETAPA 1 */}
            {etapaAtual === 1 && (
              <form onSubmit={continuar}>
                <div className="grid grid-cols-1 gap-5 lg:grid-cols-5 lg:items-stretch">
                  {/* FORMULÁRIO PRINCIPAL */}
                  <section className={`${cardBase} p-5 sm:p-7 lg:col-span-3`}>
                    <div className="mb-7 flex items-center gap-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#3563A7]/10 text-[#023E8A]">
                        <CalendarPlus size={25} />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold sm:text-2xl">
                          Dados da consulta
                        </h2>
                        <p className="mt-1 text-sm">
                          Preencha as informações abaixo.
                        </p>
                      </div>
                    </div>

                    {/* ESPECIALIDADE */}
                    <fieldset className="mb-7">
                      <legend className="mb-3 text-sm font-bold sm:text-base">
                        Qual especialidade você procura?
                        <span className="ml-1 text-red-500">*</span>
                      </legend>

                      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                        {especialidades.map(({ nome, Icone }) => {
                          const selecionado = especialidade === nome;

                          return (
                            <button
                              key={nome}
                              type="button"
                              aria-pressed={selecionado}
                              onClick={() => escolherEspecialidade(nome)}
                              className={`flex min-h-[110px] flex-col items-center justify-center rounded-xl border p-3 text-center transition ${
                                selecionado
                                  ? "border-[#023E8A] bg-[#3563A7]/15 ring-1 ring-[#023E8A]"
                                  : "border-blue-100 bg-[#fbfdff] hover:border-[#3563A7] hover:bg-[#3563A7]/10"
                              }`}
                            >
                              <div
                                className={`mb-2 flex h-10 w-10 items-center justify-center rounded-full ${
                                  selecionado
                                    ? "bg-[#023E8A] text-white"
                                    : "bg-[#3563A7]/15 text-[#023E8A]"
                                }`}
                              >
                                <Icone size={22} />
                              </div>
                              <span className="text-sm font-bold">{nome}</span>
                            </button>
                          );
                        })}
                      </div>
                    </fieldset>

                    {/* UNIDADE */}
                    <fieldset className="mb-7">
                      <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                        <legend className="text-sm font-bold sm:text-base">
                          Qual unidade mais próxima de você?
                          <span className="ml-1 text-red-500">*</span>
                        </legend>

                        {especialidade && (
                          <span className="w-fit rounded-full bg-[#3563A7]/15 px-3 py-1.5 text-xs font-semibold">
                            {unidadesDisponiveis.length} unidade
                            {unidadesDisponiveis.length === 1 ? "" : "s"} disponíve
                            {unidadesDisponiveis.length === 1 ? "l" : "is"}
                          </span>
                        )}
                      </div>

                      {!especialidade ? (
                        <div className="flex flex-col items-center rounded-xl border border-dashed border-[#3563A7]/40 px-4 py-8 text-center">
                          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#3563A7]/10 text-[#023E8A]">
                            <Hospital size={24} />
                          </div>
                          <p className="text-sm font-bold">
                            Escolha a especialidade primeiro
                          </p>
                          <p className="mt-1 text-xs">
                            As unidades disponíveis aparecerão automaticamente.
                          </p>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                          {unidadesDisponiveis.map((u, i) => {
                            const selecionada = unidade?.id === u.id;

                            return (
                              <button
                                key={u.id}
                                type="button"
                                aria-pressed={selecionada}
                                onClick={() => setUnidade(u)}
                                className={`group relative overflow-hidden rounded-[22px] border p-5 text-left transition-all ${
                                  selecionada
                                    ? "border-[#023E8A] bg-[#3563A7]/15 shadow-[0_10px_28px_rgba(2,62,138,0.12)]"
                                    : "border-blue-100 bg-[#fbfdff] hover:-translate-y-0.5 hover:border-[#3563A7] hover:bg-white hover:shadow-sm"
                                }`}
                              >
                                <div className="pointer-events-none absolute -right-12 -top-12 h-36 w-36 rounded-full bg-[#3563A7]/10" />

                                <div className="relative z-10">
                                  <div className="flex items-start justify-between gap-3">
                                    <div
                                      className={`flex h-12 w-12 items-center justify-center rounded-xl ${
                                        selecionada
                                          ? "bg-[#023E8A] text-white"
                                          : "bg-[#3563A7]/15 text-[#023E8A]"
                                      }`}
                                    >
                                      <Hospital size={22} />
                                    </div>

                                    <div className="flex items-center gap-2">
                                      {i === 0 && (
                                        <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-[11px] font-bold">
                                          Mais próxima
                                        </span>
                                      )}

                                      {selecionada && (
                                        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#023E8A] text-white">
                                          <Check size={14} />
                                        </div>
                                      )}
                                    </div>
                                  </div>

                                  <h3 className="mt-4 text-sm font-bold leading-5">
                                    {u.nome}
                                  </h3>

                                  <div className="mt-4 space-y-2.5 text-sm">
                                    <p className="flex items-center gap-2">
                                      <MapPin size={15} className="shrink-0 text-[#3563A7]" />
                                      {u.bairro}
                                    </p>
                                    <p className="flex items-center gap-2">
                                      <Clock size={15} className="shrink-0 text-[#3563A7]" />
                                      {u.horario}
                                    </p>
                                    <p className="flex items-center gap-2">
                                      <Building2 size={15} className="shrink-0 text-[#3563A7]" />
                                      {u.distancia} de distância
                                    </p>
                                  </div>

                                  <div className="mt-4 flex items-center justify-between border-t border-blue-100 pt-4">
                                    <span className="flex items-center gap-1 text-xs font-semibold text-emerald-600">
                                      <CheckCircle2 size={13} />
                                      Atende {especialidade}
                                    </span>

                                    <ArrowRight
                                      size={15}
                                      className="text-[#023E8A] transition group-hover:translate-x-1"
                                    />
                                  </div>
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </fieldset>

                    {/* DATA */}
                    <fieldset className="mb-7">
                      <legend className="mb-3 text-sm font-bold sm:text-base">
                        Qual dia é melhor para você?
                        <span className="ml-1 text-red-500">*</span>
                      </legend>

                      <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 xl:grid-cols-7">
                        {dias.map((d, i) => {
                          const selecionado = dia === i;

                          return (
                            <button
                              key={d.texto}
                              type="button"
                              aria-pressed={selecionado}
                              onClick={() => setDia(i)}
                              className={`flex flex-col items-center rounded-lg border px-2 py-3 transition ${
                                selecionado
                                  ? "border-[#023E8A] bg-[#023E8A] text-white"
                                  : "border-blue-100 bg-white hover:border-[#3563A7] hover:bg-[#3563A7]/10"
                              }`}
                            >
                              <span className="text-xs font-semibold capitalize">
                                {d.semana}
                              </span>
                              <span className="text-xl font-extrabold">
                                {d.numero}
                              </span>
                              <span className="text-xs capitalize">{d.mes}</span>
                            </button>
                          );
                        })}
                      </div>
                    </fieldset>

                    {/* HORÁRIO */}
                    <fieldset>
                      <legend className="mb-3 text-sm font-bold sm:text-base">
                        Escolha o horário
                        <span className="ml-1 text-red-500">*</span>
                      </legend>

                      <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
                        {horarios.map((h) => {
                          const selecionado = horario === h;

                          return (
                            <button
                              key={h}
                              type="button"
                              aria-pressed={selecionado}
                              onClick={() => setHorario(h)}
                              className={`flex min-h-[46px] items-center justify-center gap-1.5 rounded-lg border px-2 py-2 text-sm font-semibold transition ${
                                selecionado
                                  ? "border-[#023E8A] bg-[#3563A7]/15 ring-1 ring-[#023E8A]"
                                  : "border-blue-100 bg-white hover:border-[#3563A7] hover:bg-[#3563A7]/10"
                              }`}
                            >
                              <Clock size={15} />
                              {h}
                            </button>
                          );
                        })}
                      </div>
                    </fieldset>
                  </section>

                  {/* LATERAL */}
                  <aside className="flex h-full flex-col gap-5 lg:col-span-2">
                    <section className={`${cardBase} p-5 sm:p-6`}>
                      <div className="mb-7 flex items-center gap-3">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#3563A7]/10 text-[#023E8A]">
                          <ClipboardList size={24} />
                        </div>
                        <div>
                          <h2 className="text-xl font-bold">
                            Informações adicionais
                          </h2>
                          <p className="mt-1 text-sm">Conte um pouco mais.</p>
                        </div>
                      </div>

                      {/* MOTIVO */}
                      <div className="mb-7">
                        <label
                          htmlFor="motivo"
                          className="mb-3 block text-sm font-bold leading-6"
                        >
                          Motivo da consulta (opcional)
                        </label>

                        <textarea
                          id="motivo"
                          value={motivo}
                          onChange={(e) => setMotivo(e.target.value)}
                          maxLength={300}
                          rows={4}
                          placeholder="Conte brevemente o motivo..."
                          className="w-full resize-y rounded-lg border border-[#3563A7]/40 bg-white px-4 py-3 text-sm leading-6 outline-none transition placeholder:text-[#0B1756]/50 focus:border-[#023E8A] focus:ring-2 focus:ring-[#3563A7]/30"
                        />

                        <p className="mt-2 text-right text-xs">
                          {motivo.length}/300
                        </p>
                      </div>

                      <div className="rounded-xl border border-blue-100 bg-gradient-to-br from-[#3563A7]/10 to-white p-4 sm:p-5">
                        <div className="mb-3 flex items-center gap-3">
                          <ShieldCheck
                            size={24}
                            className="shrink-0 text-[#023E8A]"
                          />
                          <h3 className="font-bold">Resumo escolhido</h3>
                        </div>

                        <p className="text-sm leading-6">
                          {especialidade || "Especialidade não escolhida"}
                          {unidade && ` · ${unidade.nome}`}
                          <br />
                          {diaSelecionado
                            ? `${diaSelecionado.texto}${horario ? ` às ${horario}` : ""}`
                            : "Data e horário não escolhidos"}
                        </p>
                      </div>
                    </section>

                    {/* PRÓXIMOS PASSOS */}
                    <section className={`${cardBase} flex h-full flex-col p-5 sm:p-6`}>
                      <h3 className="mb-6 mt-1 text-lg font-bold">
                        Próximos passos
                      </h3>

                      <div className="flex flex-1 flex-col justify-evenly gap-6 pb-4">
                        {[
                          {
                            titulo: "Escolha unidade e horário",
                            descricao: "Selecione onde será atendido e quando.",
                          },
                          {
                            titulo: "Revise o agendamento",
                            descricao: "Confira os dados antes de confirmar.",
                          },
                          {
                            titulo: "Acompanhe sua consulta",
                            descricao: "Veja o status em Minhas consultas.",
                          },
                        ].map((item, i) => (
                          <div key={item.titulo} className="flex items-start gap-3">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#3563A7]/15 text-sm font-bold">
                              {i + 1}
                            </div>
                            <div>
                              <h4 className="text-sm font-bold">{item.titulo}</h4>
                              <p className="mt-1 text-xs leading-5 sm:text-sm">
                                {item.descricao}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </section>
                  </aside>
                </div>

                {erro && (
                  <div
                    role="alert"
                    className="mt-5 flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700"
                  >
                    <Info size={19} className="mt-0.5 shrink-0" />
                    <p>{erro}</p>
                  </div>
                )}

                <div className="mt-7 flex justify-end">
                  <button
                    type="submit"
                    className={`${botaoPrimario} w-full gap-3 px-7 sm:w-auto`}
                  >
                    Continuar agendamento
                    <ArrowRight size={21} />
                  </button>
                </div>
              </form>
            )}

            {/* ETAPA 2: REVISÃO */}
            {etapaAtual === 2 && (
              <section className={`${cardBase} p-5 sm:p-8`}>
                <div className="mb-7 flex items-center gap-3">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#3563A7]/10 text-[#023E8A]">
                    <ClipboardList size={26} />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold sm:text-2xl">
                      Confira os dados
                    </h2>
                    <p className="mt-1 text-sm">
                      Verifique as informações antes de confirmar.
                    </p>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  {[
                    ["Especialidade", especialidade],
                    ["Unidade", unidade?.nome],
                    ["Data", diaSelecionado?.texto],
                    ["Horário", horario],
                  ].map(([rotulo, valor]) => (
                    <div
                      key={rotulo}
                      className="rounded-xl border border-blue-100 p-5"
                    >
                      <p className="mb-2 text-sm font-semibold">{rotulo}</p>
                      <p className="font-semibold">{valor}</p>
                    </div>
                  ))}

                  <div className="rounded-xl border border-blue-100 p-5 md:col-span-2">
                    <p className="mb-2 text-sm font-semibold">Motivo</p>
                    <p className="whitespace-pre-wrap break-words text-sm leading-6">
                      {motivo.trim() || "Não informado"}
                    </p>
                  </div>
                </div>

                <div className="mt-7 flex flex-col-reverse justify-between gap-3 sm:flex-row">
                  <button type="button" onClick={voltar} className={botaoSecundario}>
                    <ArrowLeft size={19} />
                    Voltar e editar
                  </button>

                  <button type="button" onClick={confirmar} className={botaoPrimario}>
                    Confirmar agendamento
                    <ArrowRight size={20} />
                  </button>
                </div>
              </section>
            )}

            {/* ETAPA 3: CONFIRMAÇÃO */}
            {etapaAtual === 3 && (
              <section className={`${cardBase} p-6 text-center sm:p-12`}>
                <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-[#3563A7]/10 text-[#023E8A]">
                  <CheckCircle2 size={46} />
                </div>

                <h2 className="text-2xl font-extrabold sm:text-3xl">
                  Agendamento concluído!
                </h2>

                <p className="mx-auto mt-4 max-w-xl text-sm leading-7 sm:text-base">
                  Sua consulta de {especialidade} na {unidade?.nome} está marcada
                  para {diaSelecionado?.texto} às {horario}.
                </p>

                <div className="mx-auto mt-7 max-w-xl rounded-xl border border-[#3563A7]/40 bg-[#3563A7]/10 p-5 text-left">
                  <div className="flex items-start gap-3">
                    <Stethoscope
                      size={25}
                      className="mt-1 shrink-0 text-[#023E8A]"
                    />
                    <div>
                      <h3 className="font-bold">Importante</h3>
                      <p className="mt-2 text-sm leading-6">
                        Esta é uma demonstração: nenhum dado é enviado a uma
                        clínica real. Em caso de urgência, procure um
                        atendimento de emergência.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                  <button
                    type="button"
                    onClick={() => {
                      setAba("acompanhar");
                      topo();
                    }}
                    className={botaoPrimario}
                  >
                    <CalendarCheck size={19} />
                    Ver minhas consultas
                  </button>

                  <button
                    type="button"
                    onClick={() => novoAgendamento()}
                    className={botaoSecundario}
                  >
                    <Activity size={19} />
                    Novo agendamento
                  </button>
                </div>
              </section>
            )}
          </>
        )}

        {/* ===================== ABA: ACOMPANHAR ===================== */}
        {aba === "acompanhar" && (
          <section className={`${cardBase} p-5 sm:p-8`}>
            <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#3563A7]/10 text-[#023E8A]">
                  <CalendarCheck size={26} />
                </div>
                <div>
                  <h2 className="text-xl font-bold sm:text-2xl">
                    Minhas consultas
                  </h2>
                  <p className="mt-1 text-sm">
                    {ativas} consulta{ativas === 1 ? "" : "s"} agendada
                    {ativas === 1 ? "" : "s"}.
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {filtros.map((f) => (
                  <button
                    key={f}
                    type="button"
                    aria-pressed={filtro === f}
                    onClick={() => setFiltro(f)}
                    className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
                      filtro === f
                        ? "border-[#023E8A] bg-[#023E8A] text-white"
                        : "border-blue-100 bg-white hover:border-[#3563A7] hover:bg-[#3563A7]/10"
                    }`}
                  >
                    {f === "Todas" ? f : `${f}s`}
                  </button>
                ))}
              </div>
            </div>

            {listaFiltrada.length === 0 ? (
              <div className="rounded-xl border border-dashed border-[#3563A7]/40 p-10 text-center">
                <p className="font-semibold">Nenhuma consulta encontrada.</p>
                <p className="mt-1 text-sm">
                  Tente outro filtro ou agende uma nova consulta.
                </p>
              </div>
            ) : (
              <div className="grid gap-4">
                {listaFiltrada.map((c) => {
                  const estilo = estiloStatus[c.status];

                  return (
                    <article
                      key={c.id}
                      className="flex flex-col justify-between gap-4 rounded-xl border border-blue-100 p-5 lg:flex-row lg:items-center"
                    >
                      <div className="flex items-start gap-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#3563A7]/10 text-[#023E8A]">
                          <MapPin size={24} />
                        </div>

                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="font-bold">{c.especialidade}</h3>
                            <span
                              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${estilo.badge}`}
                            >
                              <span
                                className={`h-2 w-2 rounded-full ${estilo.ponto}`}
                              />
                              {c.status}
                            </span>
                          </div>

                          <p className="mt-1 text-sm">{c.unidade}</p>

                          <p className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
                            <span className="inline-flex items-center gap-1.5">
                              <CalendarDays size={15} />
                              {c.data}
                            </span>
                            <span className="inline-flex items-center gap-1.5">
                              <Clock size={15} />
                              {c.horario}
                            </span>
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-col gap-2 sm:flex-row">
                        {c.status === "Agendada" && (
                          <button
                            type="button"
                            onClick={() => cancelarConsulta(c.id)}
                            className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl border border-red-200 bg-white px-4 py-2 text-sm font-bold text-red-700 transition hover:bg-red-50"
                          >
                            <X size={17} />
                            Cancelar
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => novoAgendamento(c)}
                          className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl bg-[#023E8A] px-4 py-2 text-sm font-bold text-white transition hover:bg-[#3563A7] focus:outline-none focus:ring-4 focus:ring-[#3563A7]/40"
                        >
                          <RefreshCw size={17} />
                          {c.status === "Agendada" ? "Reagendar" : "Agendar novamente"}
                        </button>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}

            <div className="mt-7 flex justify-end">
              <button
                type="button"
                onClick={() => novoAgendamento()}
                className={botaoSecundario}
              >
                <CalendarPlus size={19} />
                Agendar nova consulta
              </button>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}