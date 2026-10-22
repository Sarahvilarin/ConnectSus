"use client";

import { useMemo, useState } from "react";

import {
  ArrowRight,
  Building2,
  Check,
  CheckCircle2,
  ChevronRight,
  Clock3,
  FileCheck2,
  FileText,
  HeartPulse,
  Hospital,
  MapPin,
  Search,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  UserRound,
  X,
} from "lucide-react";

/* ============================================================
   PACIENTES
============================================================ */

const PACIENTES = [
  {
    id: 1,
    nome: "Mariana Silva Costa",
    cpf: "123.456.789-00",
    nascimento: "18/04/1998",
    idade: 28,
  },
  {
    id: 2,
    nome: "João Pedro Alves",
    cpf: "987.654.321-00",
    nascimento: "10/08/1982",
    idade: 44,
  },
  {
    id: 3,
    nome: "Carlos Eduardo Lima",
    cpf: "111.222.333-44",
    nascimento: "02/02/1965",
    idade: 61,
  },
];

/* ============================================================
   EXAMES
============================================================ */

const TIPOS_EXAME = [
  {
    id: 1,
    nome: "Hemograma completo",
    categoria: "Laboratorial",
    descricao: "Avaliação geral das células sanguíneas.",
    icone: "lab",
  },
  {
    id: 2,
    nome: "Glicemia",
    categoria: "Laboratorial",
    descricao: "Medição dos níveis de glicose no sangue.",
    icone: "lab",
  },
  {
    id: 3,
    nome: "Urina tipo I",
    categoria: "Laboratorial",
    descricao: "Análise laboratorial para investigação clínica.",
    icone: "lab",
  },
  {
    id: 4,
    nome: "Raio-X",
    categoria: "Imagem",
    descricao: "Exame de imagem para avaliação de estruturas internas.",
    icone: "imagem",
  },
  {
    id: 5,
    nome: "Ultrassom",
    categoria: "Imagem",
    descricao: "Avaliação de órgãos e tecidos por ultrassonografia.",
    icone: "imagem",
  },
  {
    id: 6,
    nome: "Eletrocardiograma",
    categoria: "Cardiologia",
    descricao: "Avaliação da atividade elétrica do coração.",
    icone: "coracao",
  },
  {
    id: 7,
    nome: "PCR",
    categoria: "Laboratorial",
    descricao: "Investigação de processos inflamatórios.",
    icone: "lab",
  },
];

/* ============================================================
   UNIDADES
============================================================ */

const UNIDADES = [
  {
    id: 1,
    nome: "Hospital Municipal de Emergências Albert Sabin",
    bairro: "Santa Paula",
    endereco: "São Caetano do Sul - SP",
    horario: "Atendimento 24 horas",
    distancia: "1,2 km",
    exames: [1, 2, 3, 4, 6, 7],
  },
  {
    id: 2,
    nome: "Hospital Municipal Maria Braido",
    bairro: "Santa Paula",
    endereco: "São Caetano do Sul - SP",
    horario: "Conforme atendimento",
    distancia: "2,4 km",
    exames: [1, 2, 4, 5, 6],
  },
  {
    id: 3,
    nome: "Atende Fácil Saúde Pedro Kassab",
    bairro: "Centro",
    endereco: "São Caetano do Sul - SP",
    horario: "Segunda a sexta, das 7h às 17h",
    distancia: "3,1 km",
    exames: [1, 2, 3, 5, 7],
  },
];

/* ============================================================
   PÁGINA
============================================================ */

export default function GestaoExamePage() {
  const [cpf, setCpf] = useState("");
  const [paciente, setPaciente] = useState(null);
  const [exameSelecionado, setExameSelecionado] = useState(null);
  const [unidadeSelecionada, setUnidadeSelecionada] = useState(null);
  const [observacoes, setObservacoes] = useState("");
  const [erroPaciente, setErroPaciente] = useState(false);

  const [sucesso, setSucesso] = useState(false);

  const unidadesDisponiveis = useMemo(() => {
    if (!exameSelecionado) return [];

    return UNIDADES.filter((unidade) =>
      unidade.exames.includes(exameSelecionado.id)
    );
  }, [exameSelecionado]);

  function formatarCPF(valor) {
    return valor
      .replace(/\D/g, "")
      .slice(0, 11)
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  }

  function buscarPaciente(event) {
    event.preventDefault();

    const encontrado = PACIENTES.find(
      (item) => item.cpf === cpf
    );

    if (!encontrado) {
      setErroPaciente(true);
      setPaciente(null);
      return;
    }

    setErroPaciente(false);
    setPaciente(encontrado);

    setExameSelecionado(null);
    setUnidadeSelecionada(null);
  }

  function trocarPaciente() {
    setCpf("");
    setPaciente(null);
    setExameSelecionado(null);
    setUnidadeSelecionada(null);
    setObservacoes("");
    setErroPaciente(false);
  }

  function solicitarExame() {
    if (
      !paciente ||
      !exameSelecionado ||
      !unidadeSelecionada
    ) {
      return;
    }

    const solicitacao = {
      pacienteId: paciente.id,
      paciente: paciente.nome,
      cpf: paciente.cpf,

      exameId: exameSelecionado.id,
      exame: exameSelecionado.nome,

      unidadeId: unidadeSelecionada.id,
      unidade: unidadeSelecionada.nome,

      observacoes,
      status: "Solicitado",
    };

    console.log("SOLICITAÇÃO:", solicitacao);

    setSucesso(true);
  }

  function novaSolicitacao() {
    setSucesso(false);
    setCpf("");
    setPaciente(null);
    setExameSelecionado(null);
    setUnidadeSelecionada(null);
    setObservacoes("");
    setErroPaciente(false);
  }

  return (
    <main
      className="
        relative
        min-h-screen
        overflow-hidden
        bg-[#EEF5FA]
      "
    >
      {/* =====================================================
          BOLAS GRANDES DO FUNDO
      ====================================================== */}

      <div
        className="
          pointer-events-none
          absolute
          -left-[170px]
          top-[110px]
          h-[420px]
          w-[420px]
          rounded-full
          bg-[#C8E0F5]
          opacity-70
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          -right-[190px]
          top-[230px]
          h-[520px]
          w-[520px]
          rounded-full
          bg-[#BFD9F1]
          opacity-65
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          left-[11%]
          top-[650px]
          h-[200px]
          w-[200px]
          rounded-full
          bg-white
          opacity-80
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          right-[7%]
          top-[900px]
          h-[280px]
          w-[280px]
          rounded-full
          border-[48px]
          border-[#D4E7F7]
          opacity-80
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          -left-[220px]
          top-[1250px]
          h-[500px]
          w-[500px]
          rounded-full
          bg-[#D6E8F7]
          opacity-70
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          right-[18%]
          top-[1600px]
          h-[190px]
          w-[190px]
          rounded-full
          bg-white
          opacity-75
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          -right-[160px]
          top-[1850px]
          h-[420px]
          w-[420px]
          rounded-full
          bg-[#C8DFF4]
          opacity-65
        "
      />

      {/* =====================================================
          CONTEÚDO
      ====================================================== */}

      <div
        className="
          relative
          z-10
          mx-auto
          max-w-[1360px]
          px-4
          pb-14
          pt-7
          sm:px-6
          lg:px-8
        "
      >
        {/* =====================================================
            HERO + ETAPAS
        ====================================================== */}

        <section
          className="
            overflow-hidden
            rounded-[32px]
            bg-white
            shadow-[0_20px_60px_rgba(2,62,138,0.12)]
          "
        >
          {/* HERO */}

          <div
            className="
              relative
              overflow-hidden
              bg-gradient-to-br
              from-[#174693]
              via-[#234E96]
              to-[#151A67]
              px-7
              pb-16
              pt-8
              text-white
              sm:px-10
            "
          >
            {/* BOLAS HERO */}

            <div
              className="
                pointer-events-none
                absolute
                -right-16
                -top-28
                h-80
                w-80
                rounded-full
                bg-white/10
              "
            />

            <div
              className="
                pointer-events-none
                absolute
                left-[37%]
                top-[65px]
                h-52
                w-52
                rounded-full
                border-[34px]
                border-white/[0.045]
              "
            />

            <div
              className="
                pointer-events-none
                absolute
                -bottom-24
                -left-24
                h-64
                w-64
                rounded-full
                bg-[#3F6DB0]/30
              "
            />

            <div
              className="
                relative
                z-10
                flex
                flex-col
                gap-6
                lg:flex-row
                lg:items-end
                lg:justify-between
              "
            >
              <div>
                <div
                  className="
                    flex
                    w-fit
                    items-center
                    gap-2
                    rounded-full
                    border
                    border-white/15
                    bg-white/10
                    px-3
                    py-1.5
                    text-xs
                    font-semibold
                  "
                >
                  <Stethoscope size={15} />

                  Gestão clínica
                </div>

                <h1
                  className="
                    mt-4
                    text-3xl
                    font-bold
                    sm:text-4xl
                  "
                >
                  Solicitação de Exames
                </h1>

                <p
                  className="
                    mt-3
                    max-w-2xl
                    text-sm
                    leading-6
                    text-blue-100
                    sm:text-base
                  "
                >
                  Encontre o paciente, selecione o exame e
                  encaminhe para uma unidade disponível da rede
                  UneSUS.
                </p>
              </div>

              <div
                className="
                  grid
                  w-full
                  max-w-[390px]
                  grid-cols-2
                  gap-3
                "
              >
                <HeroInfo
                  icon={<ShieldCheck size={18} />}
                  titulo="Acesso seguro"
                  texto="Área médica"
                />

                <HeroInfo
                  icon={<HeartPulse size={18} />}
                  titulo="Rede integrada"
                  texto="UneSUS"
                />
              </div>
            </div>
          </div>

          {/* PASSOS */}

          <div
            className="
              relative
              bg-white
              px-5
              pb-5
              sm:px-7
            "
          >
            <div
              className="
                relative
                -mt-8
                rounded-[24px]
                border
                border-slate-100
                bg-white
                p-4
                shadow-[0_14px_40px_rgba(2,62,138,0.11)]
              "
            >
              <div
                className="
                  absolute
                  left-[18%]
                  right-[18%]
                  top-[39px]
                  hidden
                  h-[3px]
                  rounded-full
                  bg-[#D9E6F2]
                  md:block
                "
              />

              <div
                className="
                  grid
                  gap-3
                  md:grid-cols-3
                "
              >
                <Etapa
                  numero="1"
                  titulo="Paciente"
                  descricao={
                    paciente
                      ? paciente.nome
                      : "Buscar pelo CPF"
                  }
                  concluida={!!paciente}
                  ativa={!paciente}
                />

                <Etapa
                  numero="2"
                  titulo="Exame"
                  descricao={
                    exameSelecionado
                      ? exameSelecionado.nome
                      : "Selecionar exame"
                  }
                  concluida={!!exameSelecionado}
                  ativa={
                    !!paciente &&
                    !exameSelecionado
                  }
                />

                <Etapa
                  numero="3"
                  titulo="Unidade"
                  descricao={
                    unidadeSelecionada
                      ? unidadeSelecionada.bairro
                      : "Escolher unidade"
                  }
                  concluida={!!unidadeSelecionada}
                  ativa={
                    !!exameSelecionado &&
                    !unidadeSelecionada
                  }
                />
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================
            ETAPA 1 - PACIENTE
        ====================================================== */}

        <section className={`${cardClass} mt-5`}>
          <TituloSecao
            numero="01"
            icon={<UserRound size={21} />}
            titulo="Localizar paciente"
            descricao="Digite o CPF para localizar o cadastro."
          />

          {!paciente ? (
            <>
              <form
                onSubmit={buscarPaciente}
                className="
                  mt-5
                  flex
                  flex-col
                  gap-3
                  md:flex-row
                "
              >
                <div className="relative flex-1">
                  <Search
                    size={18}
                    className="
                      absolute
                      left-4
                      top-1/2
                      -translate-y-1/2
                      text-slate-400
                    "
                  />

                  <input
                    value={cpf}
                    onChange={(event) => {
                      setCpf(
                        formatarCPF(
                          event.target.value
                        )
                      );

                      setErroPaciente(false);
                    }}
                    placeholder="Digite o CPF do paciente"
                    maxLength={14}
                    className={`
                      h-14
                      w-full
                      rounded-2xl
                      border
                      bg-[#F6F9FC]
                      pl-12
                      pr-4
                      text-sm
                      text-[#0B1756]
                      outline-none
                      transition-all

                      placeholder:text-slate-400

                      ${
                        erroPaciente
                          ? "border-red-300 ring-4 ring-red-50"
                          : "border-slate-200 focus:border-[#3563A7] focus:bg-white focus:ring-4 focus:ring-[#3563A7]/10"
                      }
                    `}
                  />
                </div>

                <button
                  type="submit"
                  className="
                    flex
                    h-14
                    min-w-[200px]
                    items-center
                    justify-center
                    gap-2
                    rounded-2xl
                    bg-[#194391]
                    px-6
                    text-sm
                    font-semibold
                    text-white
                    shadow-sm
                    transition-all
                    hover:-translate-y-0.5
                    hover:bg-[#0B1756]
                    hover:shadow-md
                  "
                >
                  <Search size={17} />

                  Buscar paciente
                </button>
              </form>

              {erroPaciente && (
                <div
                  className="
                    mt-3
                    flex
                    items-center
                    gap-2
                    rounded-xl
                    border
                    border-red-100
                    bg-red-50
                    px-4
                    py-3
                    text-sm
                    text-red-600
                  "
                >
                  <X size={16} />

                  Nenhum paciente encontrado com este CPF.
                </div>
              )}

              <div
                className="
                  mt-4
                  flex
                  items-center
                  gap-3
                  rounded-xl
                  border
                  border-[#DCE9F5]
                  bg-[#F7FAFD]
                  px-4
                  py-3
                "
              >
                <div
                  className="
                    flex
                    h-8
                    w-8
                    items-center
                    justify-center
                    rounded-lg
                    bg-[#E8F2FA]
                    text-[#174693]
                  "
                >
                  <ShieldCheck size={15} />
                </div>

                <p className="text-xs text-slate-500">
                  Para testar, use{" "}
                  <strong className="text-[#174693]">
                    123.456.789-00
                  </strong>
                </p>
              </div>
            </>
          ) : (
            <div
              className="
                mt-5
                flex
                flex-col
                gap-4
                rounded-[22px]
                border
                border-[#D8E6F2]
                bg-[#F8FBFE]
                p-5
                md:flex-row
                md:items-center
              "
            >
              <div
                className="
                  flex
                  h-16
                  w-16
                  shrink-0
                  items-center
                  justify-center
                  rounded-2xl
                  bg-gradient-to-br
                  from-[#174693]
                  to-[#3563A7]
                  text-xl
                  font-bold
                  text-white
                "
              >
                {iniciais(paciente.nome)}
              </div>

              <div className="flex-1">
                <div
                  className="
                    flex
                    flex-wrap
                    items-center
                    gap-2
                  "
                >
                  <h2
                    className="
                      text-lg
                      font-bold
                      text-[#0B1756]
                    "
                  >
                    {paciente.nome}
                  </h2>

                  <span
                    className="
                      flex
                      items-center
                      gap-1
                      rounded-full
                      bg-emerald-50
                      px-2.5
                      py-1
                      text-[11px]
                      font-semibold
                      text-emerald-600
                    "
                  >
                    <CheckCircle2 size={12} />

                    Identificado
                  </span>
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                  <DadoPaciente
                    label="CPF"
                    valor={paciente.cpf}
                  />

                  <DadoPaciente
                    label="Nascimento"
                    valor={paciente.nascimento}
                  />

                  <DadoPaciente
                    label="Idade"
                    valor={`${paciente.idade} anos`}
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={trocarPaciente}
                className="
                  flex
                  h-10
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                  border
                  border-slate-200
                  bg-white
                  px-4
                  text-xs
                  font-semibold
                  text-slate-500
                  transition
                  hover:border-red-200
                  hover:bg-red-50
                  hover:text-red-500
                "
              >
                <X size={14} />

                Trocar paciente
              </button>
            </div>
          )}
        </section>

        {/* =====================================================
            ETAPA 2 - EXAMES
        ====================================================== */}

        <section className={`${cardClass} mt-5`}>
          <TituloSecao
            numero="02"
            icon={<FileText size={21} />}
            titulo="Selecionar exame"
            descricao="Escolha o procedimento indicado."
          />

          {!paciente ? (
            <Bloqueado
              icon={<UserRound size={25} />}
              titulo="Primeiro localize o paciente"
              texto="Depois disso os exames serão liberados."
            />
          ) : (
            <div
              className="
                mt-5
                grid
                gap-3
                sm:grid-cols-2
                lg:grid-cols-3
                xl:grid-cols-4
              "
            >
              {TIPOS_EXAME.map((exame) => {
                const selecionado =
                  exameSelecionado?.id ===
                  exame.id;

                return (
                  <button
                    key={exame.id}
                    type="button"
                    onClick={() => {
                      setExameSelecionado(exame);
                      setUnidadeSelecionada(null);
                    }}
                    className={`
                      group
                      relative
                      overflow-hidden
                      rounded-[20px]
                      border
                      p-4
                      text-left
                      transition-all

                      ${
                        selecionado
                          ? "border-[#174693] bg-[#EEF5FB] shadow-[0_8px_24px_rgba(23,70,147,0.10)]"
                          : "border-slate-200 bg-[#FBFCFE] hover:-translate-y-0.5 hover:border-[#BED2E5] hover:bg-white hover:shadow-sm"
                      }
                    `}
                  >
                    <div
                      className="
                        pointer-events-none
                        absolute
                        -right-8
                        -top-8
                        h-24
                        w-24
                        rounded-full
                        bg-[#EAF3F7]/70
                      "
                    />

                    <div className="relative z-10">
                      <div
                        className="
                          flex
                          items-start
                          justify-between
                          gap-3
                        "
                      >
                        <div
                          className={`
                            flex
                            h-11
                            w-11
                            items-center
                            justify-center
                            rounded-xl

                            ${
                              selecionado
                                ? "bg-[#174693] text-white"
                                : "bg-[#EAF3F7] text-[#174693]"
                            }
                          `}
                        >
                          {iconeExame(exame.icone)}
                        </div>

                        {selecionado && (
                          <div
                            className="
                              flex
                              h-6
                              w-6
                              items-center
                              justify-center
                              rounded-full
                              bg-[#174693]
                              text-white
                            "
                          >
                            <Check size={13} />
                          </div>
                        )}
                      </div>

                      <p
                        className="
                          mt-3
                          text-sm
                          font-bold
                          text-[#0B1756]
                        "
                      >
                        {exame.nome}
                      </p>

                      <span
                        className="
                          mt-1
                          inline-flex
                          rounded-full
                          bg-[#EDF4FA]
                          px-2
                          py-1
                          text-[10px]
                          font-semibold
                          text-[#3563A7]
                        "
                      >
                        {exame.categoria}
                      </span>

                      <p
                        className="
                          mt-3
                          min-h-[40px]
                          text-xs
                          leading-5
                          text-slate-500
                        "
                      >
                        {exame.descricao}
                      </p>

                      <div
                        className="
                          mt-3
                          flex
                          items-center
                          justify-between
                          border-t
                          border-slate-100
                          pt-3
                        "
                      >
                        <span
                          className="
                            text-xs
                            font-semibold
                            text-[#174693]
                          "
                        >
                          {selecionado
                            ? "Selecionado"
                            : "Selecionar"}
                        </span>

                        <ChevronRight
                          size={15}
                          className="
                            text-slate-300
                            transition
                            group-hover:translate-x-1
                          "
                        />
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </section>

        {/* =====================================================
            ETAPA 3 - UNIDADES
        ====================================================== */}

        <section className={`${cardClass} mt-5`}>
          <div
            className="
              flex
              flex-col
              gap-3
              sm:flex-row
              sm:items-center
              sm:justify-between
            "
          >
            <TituloSecao
              numero="03"
              icon={<Hospital size={21} />}
              titulo="Escolher unidade"
              descricao="Mostramos somente unidades que realizam o exame."
            />

            {exameSelecionado && (
              <span
                className="
                  w-fit
                  rounded-full
                  bg-[#EDF5FB]
                  px-3
                  py-1.5
                  text-xs
                  font-semibold
                  text-[#174693]
                "
              >
                {unidadesDisponiveis.length} unidades disponíveis
              </span>
            )}
          </div>

          {!exameSelecionado ? (
            <Bloqueado
              icon={<FileText size={25} />}
              titulo="Escolha o exame primeiro"
              texto="As unidades disponíveis aparecerão automaticamente."
            />
          ) : (
            <div
              className="
                mt-5
                grid
                gap-4
                lg:grid-cols-3
              "
            >
              {unidadesDisponiveis.map((unidade) => {
                const selecionada =
                  unidadeSelecionada?.id ===
                  unidade.id;

                return (
                  <button
                    key={unidade.id}
                    type="button"
                    onClick={() =>
                      setUnidadeSelecionada(
                        unidade
                      )
                    }
                    className={`
                      group
                      relative
                      overflow-hidden
                      rounded-[22px]
                      border
                      p-5
                      text-left
                      transition-all

                      ${
                        selecionada
                          ? "border-[#174693] bg-[#EEF5FB] shadow-[0_10px_28px_rgba(23,70,147,0.10)]"
                          : "border-slate-200 bg-[#FBFCFE] hover:-translate-y-0.5 hover:border-[#BDD2E6] hover:bg-white hover:shadow-sm"
                      }
                    `}
                  >
                    <div
                      className="
                        pointer-events-none
                        absolute
                        -right-12
                        -top-12
                        h-36
                        w-36
                        rounded-full
                        bg-[#EAF3F7]/70
                      "
                    />

                    <div className="relative z-10">
                      <div
                        className="
                          flex
                          items-start
                          justify-between
                          gap-4
                        "
                      >
                        <div
                          className={`
                            flex
                            h-12
                            w-12
                            items-center
                            justify-center
                            rounded-xl

                            ${
                              selecionada
                                ? "bg-[#174693] text-white"
                                : "bg-[#EAF3F7] text-[#174693]"
                            }
                          `}
                        >
                          <Hospital size={20} />
                        </div>

                        {selecionada && (
                          <div
                            className="
                              flex
                              h-7
                              w-7
                              items-center
                              justify-center
                              rounded-full
                              bg-[#174693]
                              text-white
                            "
                          >
                            <Check size={14} />
                          </div>
                        )}
                      </div>

                      <h3
                        className="
                          mt-4
                          text-sm
                          font-bold
                          leading-5
                          text-[#0B1756]
                        "
                      >
                        {unidade.nome}
                      </h3>

                      <div className="mt-4 space-y-2.5">
                        <Info
                          icon={<MapPin size={15} />}
                          texto={unidade.bairro}
                        />

                        <Info
                          icon={<Clock3 size={15} />}
                          texto={unidade.horario}
                        />

                        <Info
                          icon={<Building2 size={15} />}
                          texto={`${unidade.distancia} de distância`}
                        />
                      </div>

                      <div
                        className="
                          mt-4
                          flex
                          items-center
                          justify-between
                          border-t
                          border-slate-100
                          pt-4
                        "
                      >
                        <span
                          className="
                            flex
                            items-center
                            gap-1
                            text-xs
                            font-semibold
                            text-emerald-600
                          "
                        >
                          <CheckCircle2 size={13} />

                          Exame disponível
                        </span>

                        <ArrowRight
                          size={15}
                          className="
                            text-[#174693]
                            transition
                            group-hover:translate-x-1
                          "
                        />
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </section>

        {/* =====================================================
            RESUMO
        ====================================================== */}

        {unidadeSelecionada && (
          <section
            className="
              mt-5
              overflow-hidden
              rounded-[26px]
              border
              border-[#D7E5F1]
              bg-white
              shadow-[0_14px_40px_rgba(2,62,138,0.08)]
            "
          >
            <div
              className="
                flex
                items-center
                gap-3
                bg-[#EEF5FB]
                px-5
                py-4
              "
            >
              <div
                className="
                  flex
                  h-11
                  w-11
                  items-center
                  justify-center
                  rounded-xl
                  bg-[#174693]
                  text-white
                "
              >
                <FileCheck2 size={20} />
              </div>

              <div>
                <h2
                  className="
                    font-bold
                    text-[#0B1756]
                  "
                >
                  Revisar solicitação
                </h2>

                <p className="text-xs text-slate-500">
                  Confira antes de encaminhar.
                </p>
              </div>
            </div>

            <div className="p-5">
              <div
                className="
                  grid
                  gap-3
                  md:grid-cols-3
                "
              >
                <Resumo
                  icon={<UserRound size={17} />}
                  label="Paciente"
                  valor={paciente.nome}
                />

                <Resumo
                  icon={<FileText size={17} />}
                  label="Exame"
                  valor={exameSelecionado.nome}
                />

                <Resumo
                  icon={<Hospital size={17} />}
                  label="Unidade"
                  valor={unidadeSelecionada.nome}
                />
              </div>

              <div className="mt-5">
                <label
                  className="
                    mb-1.5
                    block
                    text-sm
                    font-semibold
                    text-[#0B1756]
                  "
                >
                  Observações médicas
                </label>

                <textarea
                  value={observacoes}
                  onChange={(event) =>
                    setObservacoes(
                      event.target.value
                    )
                  }
                  rows={3}
                  placeholder="Ex.: exame solicitado devido aos sintomas apresentados..."
                  className="
                    w-full
                    resize-none
                    rounded-2xl
                    border
                    border-slate-200
                    bg-[#F7FAFD]
                    px-4
                    py-3
                    text-sm
                    leading-6
                    text-[#0B1756]
                    outline-none
                    transition

                    placeholder:text-slate-400

                    focus:border-[#3563A7]
                    focus:bg-white
                    focus:ring-4
                    focus:ring-[#3563A7]/10
                  "
                />
              </div>

              <button
                type="button"
                onClick={solicitarExame}
                className="
                  mt-5
                  flex
                  h-12
                  w-full
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                  bg-[#174693]
                  text-sm
                  font-semibold
                  text-white
                  shadow-sm
                  transition-all

                  hover:-translate-y-0.5
                  hover:bg-[#0B1756]
                  hover:shadow-md
                "
              >
                <CheckCircle2 size={18} />

                Confirmar solicitação
              </button>
            </div>
          </section>
        )}
      </div>

      {/* =====================================================
          TELA DE SUCESSO
      ====================================================== */}

      {sucesso && (
        <div
          className="
            fixed
            inset-0
            z-[100]
            flex
            items-center
            justify-center
            bg-[#06194E]/65
            p-4
            backdrop-blur-md
          "
        >
          <div
            className="
              relative
              w-full
              max-w-[500px]
              overflow-hidden
              rounded-[32px]
              bg-white
              shadow-[0_30px_100px_rgba(0,0,0,0.30)]
            "
          >
            {/* TOPO */}

            <div
              className="
                relative
                overflow-hidden
                bg-gradient-to-br
                from-[#174693]
                via-[#2255A2]
                to-[#121962]
                px-8
                pb-9
                pt-10
                text-center
                text-white
              "
            >
              {/* DECORAÇÕES */}

              <div
                className="
                  pointer-events-none
                  absolute
                  -right-16
                  -top-16
                  h-44
                  w-44
                  rounded-full
                  bg-white/10
                "
              />

              <div
                className="
                  pointer-events-none
                  absolute
                  -bottom-20
                  -left-16
                  h-40
                  w-40
                  rounded-full
                  bg-[#4F7FC4]/40
                "
              />

              <div
                className="
                  pointer-events-none
                  absolute
                  right-[20%]
                  top-[15px]
                  text-white/20
                "
              >
                <Sparkles size={28} />
              </div>

              {/* CHECK */}

              <div
                className="
                  relative
                  z-10
                  mx-auto
                  flex
                  h-24
                  w-24
                  items-center
                  justify-center
                  rounded-full
                  border
                  border-white/20
                  bg-white/15
                  shadow-[0_12px_35px_rgba(0,0,0,0.15)]
                  backdrop-blur
                "
              >
                <div
                  className="
                    flex
                    h-16
                    w-16
                    items-center
                    justify-center
                    rounded-full
                    bg-white
                    text-emerald-500
                    shadow-md
                  "
                >
                  <Check size={34} strokeWidth={3} />
                </div>
              </div>

              <h2
                className="
                  relative
                  z-10
                  mt-5
                  text-2xl
                  font-bold
                "
              >
                Tudo certo!
              </h2>

              <p
                className="
                  relative
                  z-10
                  mt-2
                  text-sm
                  leading-6
                  text-blue-100
                "
              >
                A solicitação do exame foi registrada com sucesso.
              </p>
            </div>

            {/* CONTEÚDO */}

            <div className="p-6">
              <div
                className="
                  rounded-[20px]
                  border
                  border-[#DFEAF5]
                  bg-[#F8FBFE]
                  p-4
                "
              >
                <LinhaResumo
                  label="Paciente"
                  valor={paciente?.nome}
                />

                <LinhaResumo
                  label="CPF"
                  valor={paciente?.cpf}
                />

                <LinhaResumo
                  label="Exame"
                  valor={exameSelecionado?.nome}
                />

                <LinhaResumo
                  label="Unidade"
                  valor={unidadeSelecionada?.nome}
                />
              </div>

              {/* CONFIRMAÇÃO */}

              <div
                className="
                  mt-4
                  flex
                  items-start
                  gap-3
                  rounded-2xl
                  border
                  border-emerald-100
                  bg-emerald-50
                  p-4
                "
              >
                <div
                  className="
                    flex
                    h-9
                    w-9
                    shrink-0
                    items-center
                    justify-center
                    rounded-full
                    bg-emerald-500
                    text-white
                  "
                >
                  <CheckCircle2 size={17} />
                </div>

                <div>
                  <p
                    className="
                      text-sm
                      font-semibold
                      text-emerald-700
                    "
                  >
                    Solicitação confirmada
                  </p>

                  <p
                    className="
                      mt-1
                      text-xs
                      leading-5
                      text-emerald-600
                    "
                  >
                    O exame foi encaminhado para a unidade selecionada.
                  </p>
                </div>
              </div>

              {/* OK */}

              <button
                type="button"
                onClick={novaSolicitacao}
                className="
                  mt-5
                  flex
                  h-13
                  w-full
                  items-center
                  justify-center
                  gap-2
                  rounded-2xl
                  bg-[#174693]
                  px-5
                  py-3.5
                  text-sm
                  font-bold
                  text-white
                  shadow-[0_8px_20px_rgba(23,70,147,0.18)]
                  transition-all

                  hover:-translate-y-0.5
                  hover:bg-[#0B1756]
                  hover:shadow-[0_12px_26px_rgba(23,70,147,0.22)]
                "
              >
                <Check size={17} />

                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

/* ============================================================
   COMPONENTES
============================================================ */

function HeroInfo({
  icon,
  titulo,
  texto,
}) {
  return (
    <div
      className="
        flex
        items-center
        gap-3
        rounded-2xl
        border
        border-white/15
        bg-white/10
        p-3
      "
    >
      <div
        className="
          flex
          h-10
          w-10
          items-center
          justify-center
          rounded-xl
          bg-white/10
        "
      >
        {icon}
      </div>

      <div>
        <p className="text-xs font-semibold">
          {titulo}
        </p>

        <p className="mt-0.5 text-[11px] text-blue-100">
          {texto}
        </p>
      </div>
    </div>
  );
}

function Etapa({
  numero,
  titulo,
  descricao,
  concluida,
  ativa,
}) {
  return (
    <div
      className="
        relative
        z-10
        flex
        items-center
        gap-3
        rounded-[18px]
        bg-white
        px-3
        py-2
      "
    >
      <div
        className={`
          flex
          h-12
          w-12
          shrink-0
          items-center
          justify-center
          rounded-xl
          text-sm
          font-bold
          transition-all

          ${
            concluida
              ? "bg-emerald-500 text-white"
              : ativa
                ? "bg-[#174693] text-white shadow-[0_6px_18px_rgba(23,70,147,0.20)]"
                : "bg-[#EAF3F7] text-[#174693]"
          }
        `}
      >
        {concluida ? (
          <Check size={18} />
        ) : (
          numero
        )}
      </div>

      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <p
            className="
              text-sm
              font-bold
              text-[#0B1756]
            "
          >
            {titulo}
          </p>

          {ativa && !concluida && (
            <span
              className="
                rounded-full
                bg-[#EAF3F7]
                px-2
                py-0.5
                text-[9px]
                font-semibold
                text-[#174693]
              "
            >
              Atual
            </span>
          )}

          {concluida && (
            <span
              className="
                rounded-full
                bg-emerald-50
                px-2
                py-0.5
                text-[9px]
                font-semibold
                text-emerald-600
              "
            >
              Concluído
            </span>
          )}
        </div>

        <p
          className="
            mt-0.5
            truncate
            text-xs
            text-slate-400
          "
        >
          {descricao}
        </p>
      </div>
    </div>
  );
}

function TituloSecao({
  numero,
  icon,
  titulo,
  descricao,
}) {
  return (
    <div className="flex items-center gap-3">
      <div
        className="
          flex
          h-12
          w-12
          shrink-0
          items-center
          justify-center
          rounded-2xl
          bg-[#EAF3F7]
          text-[#174693]
        "
      >
        {icon}
      </div>

      <div>
        <p
          className="
            text-[10px]
            font-bold
            uppercase
            tracking-[2px]
            text-[#3563A7]
          "
        >
          Etapa {numero}
        </p>

        <h2
          className="
            text-base
            font-bold
            text-[#0B1756]
          "
        >
          {titulo}
        </h2>

        <p
          className="
            mt-0.5
            text-xs
            text-slate-400
          "
        >
          {descricao}
        </p>
      </div>
    </div>
  );
}

function DadoPaciente({
  label,
  valor,
}) {
  return (
    <div
      className="
        rounded-lg
        border
        border-slate-100
        bg-white
        px-3
        py-2
      "
    >
      <p
        className="
          text-[9px]
          uppercase
          tracking-wide
          text-slate-400
        "
      >
        {label}
      </p>

      <p
        className="
          mt-0.5
          text-xs
          font-semibold
          text-[#0B1756]
        "
      >
        {valor}
      </p>
    </div>
  );
}

function Bloqueado({
  icon,
  titulo,
  texto,
}) {
  return (
    <div
      className="
        mt-5
        flex
        min-h-[150px]
        flex-col
        items-center
        justify-center
        rounded-[20px]
        border
        border-dashed
        border-slate-200
        bg-[#F7FAFD]
        text-center
      "
    >
      <div
        className="
          flex
          h-12
          w-12
          items-center
          justify-center
          rounded-xl
          bg-white
          text-slate-300
        "
      >
        {icon}
      </div>

      <p
        className="
          mt-3
          text-sm
          font-semibold
          text-slate-500
        "
      >
        {titulo}
      </p>

      <p
        className="
          mt-1
          text-xs
          text-slate-400
        "
      >
        {texto}
      </p>
    </div>
  );
}

function Info({
  icon,
  texto,
}) {
  return (
    <div
      className="
        flex
        items-center
        gap-2
        text-xs
        text-slate-500
      "
    >
      <span className="text-[#174693]">
        {icon}
      </span>

      {texto}
    </div>
  );
}

function Resumo({
  icon,
  label,
  valor,
}) {
  return (
    <div
      className="
        flex
        items-center
        gap-3
        rounded-xl
        border
        border-slate-100
        bg-[#FBFCFE]
        p-3
      "
    >
      <div
        className="
          flex
          h-9
          w-9
          shrink-0
          items-center
          justify-center
          rounded-lg
          bg-[#EAF3F7]
          text-[#174693]
        "
      >
        {icon}
      </div>

      <div className="min-w-0">
        <p
          className="
            text-[9px]
            uppercase
            tracking-wide
            text-slate-400
          "
        >
          {label}
        </p>

        <p
          className="
            truncate
            text-xs
            font-semibold
            text-[#0B1756]
          "
        >
          {valor}
        </p>
      </div>
    </div>
  );
}

function LinhaResumo({
  label,
  valor,
}) {
  return (
    <div
      className="
        flex
        items-start
        justify-between
        gap-4
        border-b
        border-slate-100
        py-3
        first:pt-0
        last:border-0
        last:pb-0
      "
    >
      <span
        className="
          text-xs
          text-slate-400
        "
      >
        {label}
      </span>

      <span
        className="
          max-w-[260px]
          text-right
          text-sm
          font-semibold
          text-[#0B1756]
        "
      >
        {valor}
      </span>
    </div>
  );
}

function iconeExame(tipo) {
  if (tipo === "coracao") {
    return <HeartPulse size={19} />;
  }

  if (tipo === "imagem") {
    return <Building2 size={19} />;
  }

  return <FileText size={19} />;
}

function iniciais(nome) {
  return nome
    .split(" ")
    .slice(0, 2)
    .map((parte) => parte[0])
    .join("");
}

const cardClass = `
  rounded-[26px]
  border
  border-white
  bg-white
  p-5
  shadow-[0_12px_36px_rgba(2,62,138,0.07)]
  sm:p-6
`;