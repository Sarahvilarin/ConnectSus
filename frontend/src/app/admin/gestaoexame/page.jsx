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
    icone: "sangue",
  },
  {
    id: 2,
    nome: "Glicemia",
    categoria: "Laboratorial",
    descricao: "Medição dos níveis de glicose no sangue.",
    icone: "sangue",
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
    descricao: "Avaliação por ultrassonografia.",
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
  const [sucesso, setSucesso] = useState(false);
  const [erroPaciente, setErroPaciente] = useState(false);

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

  return (
    <main
      className="
        relative
        min-h-screen
        overflow-hidden
        bg-[#F4F8FC]
      "
    >
      {/* DECORAÇÕES DE FUNDO */}

      <div
        className="
          pointer-events-none
          absolute
          -right-56
          top-40
          h-[520px]
          w-[520px]
          rounded-full
          bg-[#DCEEFF]/50
          blur-3xl
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          -left-40
          bottom-40
          h-[420px]
          w-[420px]
          rounded-full
          border-[65px]
          border-white/50
        "
      />

      <div
        className="
          relative
          z-10
          mx-auto
          max-w-[1400px]
          px-4
          py-7
          sm:px-6
          lg:px-8
        "
      >
        {/* =====================================================
            HERO
        ====================================================== */}

        <section
          className="
            relative
            overflow-hidden
            rounded-[30px]
            bg-gradient-to-br
            from-[#023E8A]
            via-[#084B9A]
            to-[#0B1756]
            px-6
            py-8
            text-white
            shadow-[0_22px_60px_rgba(2,62,138,0.18)]
            sm:px-8
            lg:px-10
          "
        >
          <div
            className="
              pointer-events-none
              absolute
              -right-24
              -top-32
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
              -bottom-28
              right-[30%]
              h-64
              w-64
              rounded-full
              border-[45px]
              border-white/[0.04]
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
                  backdrop-blur
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
                Localize o paciente pelo CPF, escolha o exame
                e encontre automaticamente as unidades onde
                ele pode ser realizado.
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
        </section>

        {/* =====================================================
            PROGRESSO
        ====================================================== */}

        <section
          className="
            relative
            z-20
            mx-auto
            -mt-5
            grid
            max-w-[1120px]
            gap-3
            px-2
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
            ativa={!!paciente && !exameSelecionado}
          />

          <Etapa
            numero="3"
            titulo="Unidade"
            descricao={
              unidadeSelecionada
                ? unidadeSelecionada.bairro
                : "Escolher local"
            }
            concluida={!!unidadeSelecionada}
            ativa={
              !!exameSelecionado &&
              !unidadeSelecionada
            }
          />
        </section>

        {/* =====================================================
            PACIENTE
        ====================================================== */}

        <section className={`${cardClass} mt-6`}>
          <TituloSecao
            numero="01"
            icon={<UserRound size={21} />}
            titulo="Localizar paciente"
            descricao="Digite o CPF para localizar o cadastro do paciente."
          />

          {!paciente ? (
            <>
              <form
                onSubmit={buscarPaciente}
                className="
                  mt-6
                  grid
                  gap-3
                  lg:grid-cols-[1fr_auto]
                "
              >
                <div className="relative">
                  <Search
                    size={19}
                    className="
                      absolute
                      left-4
                      top-1/2
                      -translate-y-1/2
                      text-slate-400
                    "
                  />

                  <input
                    type="text"
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
                      bg-[#F8FAFD]
                      pl-12
                      pr-4
                      text-base
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
                    items-center
                    justify-center
                    gap-2
                    rounded-2xl
                    bg-[#023E8A]
                    px-8
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
                  border-[#DCEAF8]
                  bg-[#F8FBFE]
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
                    bg-[#EAF3F7]
                    text-[#023E8A]
                  "
                >
                  <ShieldCheck size={16} />
                </div>

                <p className="text-xs text-slate-500">
                  Para testar use{" "}
                  <strong className="text-[#023E8A]">
                    123.456.789-00
                  </strong>
                </p>
              </div>
            </>
          ) : (
            <div
              className="
                relative
                mt-6
                overflow-hidden
                rounded-[22px]
                border
                border-[#D4E5F4]
                bg-gradient-to-r
                from-[#F2F8FD]
                via-white
                to-[#F8FBFE]
                p-5
              "
            >
              <div
                className="
                  pointer-events-none
                  absolute
                  -right-16
                  -top-16
                  h-40
                  w-40
                  rounded-full
                  bg-[#EAF3F7]
                "
              />

              <div
                className="
                  relative
                  z-10
                  flex
                  flex-col
                  gap-4
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
                    bg-[#023E8A]
                    text-xl
                    font-bold
                    text-white
                    shadow-sm
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
                        text-xl
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
                        gap-1.5
                        rounded-full
                        bg-emerald-50
                        px-3
                        py-1
                        text-[11px]
                        font-semibold
                        text-emerald-600
                      "
                    >
                      <CheckCircle2 size={13} />

                      Paciente identificado
                    </span>
                  </div>

                  <div
                    className="
                      mt-4
                      grid
                      gap-2
                      sm:grid-cols-3
                    "
                  >
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
                    shadow-sm
                    transition
                    hover:border-red-200
                    hover:bg-red-50
                    hover:text-red-500
                  "
                >
                  <X size={15} />

                  Trocar paciente
                </button>
              </div>
            </div>
          )}
        </section>

        {/* =====================================================
            EXAMES
        ====================================================== */}

        <section className={`${cardClass} mt-5`}>
          <TituloSecao
            numero="02"
            icon={<FileText size={21} />}
            titulo="Selecione o exame"
            descricao="Escolha o procedimento indicado para o paciente."
          />

          {!paciente ? (
            <Bloqueado
              icon={<UserRound size={26} />}
              titulo="Paciente ainda não selecionado"
              texto="Localize o paciente pelo CPF para liberar esta etapa."
            />
          ) : (
            <div
              className="
                mt-6
                grid
                gap-3
                sm:grid-cols-2
                lg:grid-cols-3
                xl:grid-cols-4
              "
            >
              {TIPOS_EXAME.map((exame) => {
                const selecionado =
                  exameSelecionado?.id === exame.id;

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
                      rounded-[22px]
                      border
                      p-4
                      text-left
                      transition-all
                      duration-200

                      ${
                        selecionado
                          ? "border-[#023E8A] bg-[#EEF6FC] shadow-[0_12px_30px_rgba(2,62,138,0.12)] ring-2 ring-[#023E8A]/10"
                          : "border-slate-200 bg-[#FAFCFE] hover:-translate-y-1 hover:border-[#B7CEE5] hover:bg-white hover:shadow-md"
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
                        bg-[#EAF3F7]/60
                      "
                    />

                    <div
                      className="
                        relative
                        z-10
                      "
                    >
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
                            h-12
                            w-12
                            items-center
                            justify-center
                            rounded-2xl

                            ${
                              selecionado
                                ? "bg-[#023E8A] text-white"
                                : "bg-[#EAF3F7] text-[#023E8A]"
                            }
                          `}
                        >
                          {iconeExame(exame.icone)}
                        </div>

                        {selecionado && (
                          <div
                            className="
                              flex
                              h-7
                              w-7
                              items-center
                              justify-center
                              rounded-full
                              bg-[#023E8A]
                              text-white
                            "
                          >
                            <Check size={15} />
                          </div>
                        )}
                      </div>

                      <p
                        className="
                          mt-4
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
                          bg-[#EAF3F7]
                          px-2.5
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
                          mt-4
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
                            text-[#023E8A]
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
                            group-hover:text-[#023E8A]
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
            UNIDADES
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
              titulo="Escolha a unidade"
              descricao="O sistema mostra somente locais que realizam o exame selecionado."
            />

            {exameSelecionado && (
              <div
                className="
                  flex
                  w-fit
                  items-center
                  gap-2
                  rounded-full
                  border
                  border-[#D7E7F5]
                  bg-[#F3F8FC]
                  px-3
                  py-1.5
                  text-xs
                  font-semibold
                  text-[#023E8A]
                "
              >
                <Building2 size={14} />

                {unidadesDisponiveis.length} unidades
              </div>
            )}
          </div>

          {!exameSelecionado ? (
            <Bloqueado
              icon={<FileText size={26} />}
              titulo="Nenhum exame selecionado"
              texto="Escolha um exame para descobrir onde ele está disponível."
            />
          ) : (
            <div
              className="
                mt-6
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
                      setUnidadeSelecionada(unidade)
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
                          ? "border-[#023E8A] bg-[#EFF7FD] shadow-[0_12px_35px_rgba(2,62,138,0.12)] ring-2 ring-[#023E8A]/10"
                          : "border-slate-200 bg-[#FBFDFE] hover:-translate-y-1 hover:border-[#B7CEE5] hover:bg-white hover:shadow-md"
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
                          gap-3
                        "
                      >
                        <div
                          className={`
                            flex
                            h-12
                            w-12
                            items-center
                            justify-center
                            rounded-2xl

                            ${
                              selecionada
                                ? "bg-[#023E8A] text-white"
                                : "bg-[#EAF3F7] text-[#023E8A]"
                            }
                          `}
                        >
                          <Hospital size={21} />
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
                              bg-[#023E8A]
                              text-white
                            "
                          >
                            <Check size={15} />
                          </div>
                        )}
                      </div>

                      <h3
                        className="
                          mt-4
                          max-w-[90%]
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
                          mt-5
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
                            gap-1.5
                            text-xs
                            font-semibold
                            text-emerald-600
                          "
                        >
                          <CheckCircle2 size={14} />

                          Exame disponível
                        </span>

                        <ArrowRight
                          size={16}
                          className="
                            text-[#023E8A]
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
            CONFIRMAÇÃO
        ====================================================== */}

        {unidadeSelecionada && (
          <section
            className="
              mt-5
              overflow-hidden
              rounded-[26px]
              border
              border-[#CEE1F2]
              bg-white
              shadow-[0_15px_45px_rgba(2,62,138,0.09)]
            "
          >
            <div
              className="
                flex
                items-center
                gap-3
                bg-gradient-to-r
                from-[#EAF3F7]
                to-[#F8FBFE]
                px-5
                py-4
                sm:px-6
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
                  bg-[#023E8A]
                  text-white
                  shadow-sm
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
                  Confira os dados antes de enviar.
                </p>
              </div>
            </div>

            <div className="p-5 sm:p-6">
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
                    bg-[#F8FAFD]
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

              <div
                className="
                  mt-5
                  flex
                  items-start
                  gap-3
                  rounded-xl
                  border
                  border-[#DCEAF8]
                  bg-[#F8FBFE]
                  p-4
                "
              >
                <ShieldCheck
                  size={18}
                  className="
                    mt-0.5
                    shrink-0
                    text-[#023E8A]
                  "
                />

                <p
                  className="
                    text-xs
                    leading-5
                    text-slate-500
                  "
                >
                  Confirme se o paciente, exame e unidade estão corretos
                  antes de registrar a solicitação.
                </p>
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
                  bg-[#023E8A]
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
          MODAL SUCESSO
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
            bg-[#06194E]/60
            p-4
            backdrop-blur-sm
          "
        >
          <div
            className="
              w-full
              max-w-md
              overflow-hidden
              rounded-[30px]
              bg-white
              shadow-2xl
            "
          >
            <div
              className="
                relative
                overflow-hidden
                bg-gradient-to-br
                from-[#023E8A]
                to-[#0B1756]
                px-7
                py-8
                text-center
                text-white
              "
            >
              <div
                className="
                  pointer-events-none
                  absolute
                  -right-14
                  -top-14
                  h-40
                  w-40
                  rounded-full
                  bg-white/10
                "
              />

              <div
                className="
                  relative
                  z-10
                  mx-auto
                  flex
                  h-20
                  w-20
                  items-center
                  justify-center
                  rounded-full
                  bg-white/15
                  backdrop-blur
                "
              >
                <CheckCircle2 size={40} />
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
                Exame solicitado!
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
                A solicitação foi registrada com sucesso.
              </p>
            </div>

            <div className="p-6">
              <div
                className="
                  space-y-3
                  rounded-2xl
                  bg-[#F8FAFD]
                  p-4
                "
              >
                <LinhaResumo
                  label="Paciente"
                  valor={paciente?.nome}
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

              <button
                type="button"
                onClick={() => {
                  setSucesso(false);
                  trocarPaciente();
                }}
                className="
                  mt-6
                  flex
                  h-11
                  w-full
                  items-center
                  justify-center
                  rounded-xl
                  bg-[#023E8A]
                  text-sm
                  font-semibold
                  text-white
                  transition
                  hover:bg-[#0B1756]
                "
              >
                Nova solicitação
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
        border-white/10
        bg-white/10
        p-3
        backdrop-blur
      "
    >
      <div
        className="
          flex
          h-9
          w-9
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
      className={`
        flex
        items-center
        gap-3
        rounded-2xl
        border
        bg-white
        p-4
        shadow-[0_10px_30px_rgba(2,62,138,0.08)]
        transition

        ${
          ativa
            ? "border-[#BDD5EC]"
            : "border-white"
        }
      `}
    >
      <div
        className={`
          flex
          h-10
          w-10
          shrink-0
          items-center
          justify-center
          rounded-xl
          text-sm
          font-bold

          ${
            concluida
              ? "bg-emerald-50 text-emerald-600"
              : ativa
                ? "bg-[#023E8A] text-white"
                : "bg-[#EAF3F7] text-[#023E8A]"
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
        <p className="text-sm font-semibold text-[#0B1756]">
          {titulo}
        </p>

        <p className="mt-0.5 truncate text-xs text-slate-400">
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
    <div
      className="
        flex
        items-center
        gap-3
      "
    >
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
          text-[#023E8A]
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
        rounded-xl
        border
        border-slate-100
        bg-white
        px-3
        py-2.5
        shadow-sm
      "
    >
      <p
        className="
          text-[10px]
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
        mt-6
        flex
        min-h-[180px]
        flex-col
        items-center
        justify-center
        rounded-[22px]
        border
        border-dashed
        border-slate-200
        bg-[#F8FAFD]
        px-4
        text-center
      "
    >
      <div
        className="
          flex
          h-14
          w-14
          items-center
          justify-center
          rounded-2xl
          bg-white
          text-slate-300
          shadow-sm
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
          max-w-sm
          text-xs
          leading-5
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
      <span className="text-[#023E8A]">
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
        bg-white
        p-3
        shadow-sm
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
          text-[#023E8A]
        "
      >
        {icon}
      </div>

      <div className="min-w-0">
        <p
          className="
            text-[10px]
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
        gap-5
        border-b
        border-slate-100
        pb-3
        last:border-none
        last:pb-0
      "
    >
      <span className="text-xs text-slate-400">
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
    return <HeartPulse size={20} />;
  }

  if (tipo === "imagem") {
    return <Building2 size={20} />;
  }

  return <FileText size={20} />;
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
  shadow-[0_12px_40px_rgba(2,62,138,0.07)]
  sm:p-6
`;