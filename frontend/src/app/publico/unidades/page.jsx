"use client";

import { useMemo, useState } from "react";
import Image from "next/image";

import {
  ArrowRight,
  Building2,
  ChevronDown,
  Clock3,
  Filter,
  HeartPulse,
  Hospital,
  MapPin,
  Navigation,
  Phone,
  Search,
  Stethoscope,
  X,
} from "lucide-react";

/* ============================================================
   UNIDADES
============================================================ */

const UNIDADES = [
  {
    id: 1,
    nome: "UBS Santo Antônio",
    tipo: "UBS",
    bairro: "Santo Antônio",
    endereco: "São Caetano do Sul - SP",
    telefone: "(11) 0000-0000",
    horario: "Segunda a sexta, das 7h às 17h",
    descricao:
      "Atendimento de atenção básica, vacinação, acompanhamento e serviços de saúde da família.",
    servicos: [
      "Clínica geral",
      "Vacinação",
      "Enfermagem",
      "Saúde da família",
    ],
  },
  {
    id: 2,
    nome: "UBS Dr. Ivanhoé Esposito",
    tipo: "UBS",
    bairro: "Olímpico",
    endereco: "São Caetano do Sul - SP",
    telefone: "(11) 0000-0000",
    horario: "Segunda a sexta, das 7h às 17h",
    descricao:
      "Unidade de atenção básica com acompanhamento clínico e serviços preventivos.",
    servicos: [
      "Consultas",
      "Vacinação",
      "Curativos",
      "Acompanhamento",
    ],
  },
  {
    id: 3,
    nome: "UBS Maria Corbeta Segato",
    tipo: "UBS",
    bairro: "Prosperidade",
    endereco: "São Caetano do Sul - SP",
    telefone: "(11) 0000-0000",
    horario: "Segunda a sexta, das 7h às 17h",
    descricao:
      "Atendimento básico e acompanhamento da população da região.",
    servicos: [
      "Clínica geral",
      "Enfermagem",
      "Vacinação",
      "Prevenção",
    ],
  },
  {
    id: 4,
    nome: "Hospital Municipal de Emergências Albert Sabin",
    tipo: "Urgência e Emergência",
    bairro: "Santa Paula",
    endereco: "São Caetano do Sul - SP",
    telefone: "(11) 0000-0000",
    horario: "Atendimento 24 horas",
    descricao:
      "Atendimento destinado a situações de urgência e emergência.",
    servicos: [
      "Pronto atendimento",
      "Emergência",
      "Exames",
      "Observação",
    ],
  },
  {
    id: 5,
    nome: "Hospital Municipal Maria Braido",
    tipo: "Hospital Municipal",
    bairro: "Santa Paula",
    endereco: "São Caetano do Sul - SP",
    telefone: "(11) 0000-0000",
    horario: "Atendimento conforme serviço",
    descricao:
      "Hospital municipal com serviços hospitalares e atendimento especializado.",
    servicos: [
      "Internação",
      "Especialidades",
      "Exames",
      "Procedimentos",
    ],
  },
  {
    id: 6,
    nome: "Atende Fácil Saúde Pedro Kassab",
    tipo: "Especialidades",
    bairro: "Centro",
    endereco: "São Caetano do Sul - SP",
    telefone: "(11) 0000-0000",
    horario: "Segunda a sexta",
    descricao:
      "Atendimento especializado e serviços complementares da rede municipal.",
    servicos: [
      "Especialidades",
      "Exames",
      "Avaliações",
      "Atendimento agendado",
    ],
  },
];

const TIPOS = [
  "Todos",
  "UBS",
  "Urgência e Emergência",
  "Hospital Municipal",
  "Especialidades",
];

/* ============================================================
   PÁGINA
============================================================ */

export default function UnidadesPage() {
  const [busca, setBusca] = useState("");
  const [bairro, setBairro] = useState("Todos");
  const [tipo, setTipo] = useState("Todos");

  const [bairroAberto, setBairroAberto] =
    useState(false);

  const [unidadeAberta, setUnidadeAberta] =
    useState(null);

  /* ============================================================
     BAIRROS
  ============================================================ */

  const bairros = useMemo(() => {
    const lista = [
      ...new Set(
        UNIDADES.map(
          (unidade) => unidade.bairro
        )
      ),
    ];

    return [
      "Todos",
      ...lista.sort(),
    ];
  }, []);

  /* ============================================================
     FILTRO
  ============================================================ */

  const unidadesFiltradas = useMemo(() => {
    return UNIDADES.filter((unidade) => {
      const texto = busca.toLowerCase();

      const correspondeBusca =
        unidade.nome
          .toLowerCase()
          .includes(texto) ||
        unidade.bairro
          .toLowerCase()
          .includes(texto) ||
        unidade.tipo
          .toLowerCase()
          .includes(texto);

      const correspondeBairro =
        bairro === "Todos" ||
        unidade.bairro === bairro;

      const correspondeTipo =
        tipo === "Todos" ||
        unidade.tipo === tipo;

      return (
        correspondeBusca &&
        correspondeBairro &&
        correspondeTipo
      );
    });
  }, [busca, bairro, tipo]);

  function limparFiltros() {
    setBusca("");
    setBairro("Todos");
    setTipo("Todos");
    setBairroAberto(false);
  }

  return (
    <main
      className="
        relative
        min-h-screen
        overflow-hidden
        bg-[#F5F9FC]
      "
    >
      {/* =====================================================
          BOLAS DO FUNDO
      ====================================================== */}

      {/* esquerda superior */}

      <div
        className="
          pointer-events-none
          absolute
          -left-[190px]
          top-[390px]
          h-[430px]
          w-[430px]
          rounded-full
          bg-[#D5E8F8]
          opacity-80
        "
      />

      {/* direita superior */}

      <div
        className="
          pointer-events-none
          absolute
          -right-[220px]
          top-[520px]
          h-[560px]
          w-[560px]
          rounded-full
          bg-[#C7DFF4]
          opacity-70
        "
      />

      {/* bolinha branca */}

      <div
        className="
          pointer-events-none
          absolute
          left-[8%]
          top-[970px]
          h-[190px]
          w-[190px]
          rounded-full
          bg-white
          opacity-90
          shadow-[0_25px_70px_rgba(2,62,138,0.05)]
        "
      />

      {/* círculo vazado direita */}

      <div
        className="
          pointer-events-none
          absolute
          right-[5%]
          top-[1120px]
          h-[300px]
          w-[300px]
          rounded-full
          border-[48px]
          border-[#D7E9F8]
          opacity-80
        "
      />

      {/* esquerda meio */}

      <div
        className="
          pointer-events-none
          absolute
          -left-[250px]
          top-[1350px]
          h-[520px]
          w-[520px]
          rounded-full
          bg-[#D8EAF8]
          opacity-75
        "
      />

      {/* bolinha centro */}

      <div
        className="
          pointer-events-none
          absolute
          left-[45%]
          top-[1540px]
          h-[140px]
          w-[140px]
          rounded-full
          bg-[#E3F0FA]
          opacity-80
        "
      />

      {/* bolinha branca direita */}

      <div
        className="
          pointer-events-none
          absolute
          right-[19%]
          top-[1720px]
          h-[180px]
          w-[180px]
          rounded-full
          bg-white
          opacity-90
        "
      />

      {/* direita inferior */}

      <div
        className="
          pointer-events-none
          absolute
          -right-[180px]
          top-[1850px]
          h-[460px]
          w-[460px]
          rounded-full
          bg-[#CBE2F5]
          opacity-70
        "
      />

      {/* esquerda inferior círculo */}

      <div
        className="
          pointer-events-none
          absolute
          left-[3%]
          top-[2070px]
          h-[260px]
          w-[260px]
          rounded-full
          border-[42px]
          border-[#D7E9F8]
          opacity-70
        "
      />

      {/* =====================================================
          CONTEÚDO
      ====================================================== */}

      <div className="relative z-10">

        {/* =====================================================
            HERO
        ====================================================== */}

        <section
          className="
            relative
            overflow-hidden
            bg-[#023E8A]
          "
        >
          {/* IMAGEM */}

          <div className="absolute inset-0">
            <Image
              src="/unidades-hero.jpg"
              alt="Unidade de saúde"
              fill
              priority
              className="object-cover"
            />

            <div
              className="
                absolute
                inset-0
                bg-gradient-to-r
                from-[#06194E]/95
                via-[#023E8A]/80
                to-[#023E8A]/20
              "
            />
          </div>

          {/* bolas do próprio hero */}

          <div
            className="
              pointer-events-none
              absolute
              -right-24
              -top-24
              z-[1]
              h-[320px]
              w-[320px]
              rounded-full
              border-[48px]
              border-white/[0.05]
            "
          />

          <div
            className="
              pointer-events-none
              absolute
              -bottom-32
              left-[35%]
              z-[1]
              h-[300px]
              w-[300px]
              rounded-full
              bg-white/[0.04]
            "
          />

          {/* CONTEÚDO */}

          <div
            className="
              relative
              z-10
              mx-auto
              flex
              min-h-[340px]
              max-w-[1300px]
              items-center
              px-4
              py-12
              sm:px-6
              lg:px-8
            "
          >
            <div className="max-w-2xl">
              <div
                className="
                  flex
                  w-fit
                  items-center
                  gap-2
                  rounded-full
                  border
                  border-white/20
                  bg-white/10
                  px-4
                  py-2
                  text-xs
                  font-semibold
                  text-white
                  backdrop-blur
                "
              >
                <MapPin size={15} />

                Rede pública de saúde
              </div>

              <h1
                className="
                  mt-5
                  text-4xl
                  font-bold
                  leading-tight
                  text-white
                  sm:text-5xl
                "
              >
                Encontre a unidade certa para você.
              </h1>

              <p
                className="
                  mt-4
                  max-w-xl
                  text-sm
                  leading-6
                  text-blue-100
                  sm:text-base
                "
              >
                Consulte unidades, serviços disponíveis,
                horários e informações para encontrar o
                atendimento mais adequado.
              </p>

              <div
                className="
                  mt-6
                  flex
                  flex-wrap
                  gap-3
                "
              >
                <InfoHero
                  icon={<Hospital size={17} />}
                  texto={`${UNIDADES.length} unidades cadastradas`}
                />

                <InfoHero
                  icon={<HeartPulse size={17} />}
                  texto="Rede pública municipal"
                />
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================
            FILTROS
        ====================================================== */}

        <section
          className="
            relative
            z-30
            mx-auto
            -mt-9
            max-w-[1300px]
            px-4
            sm:px-6
            lg:px-8
          "
        >
          <div
            className="
              rounded-[26px]
              border
              border-white
              bg-white
              p-4
              shadow-[0_15px_50px_rgba(2,62,138,0.10)]
              sm:p-5
            "
          >
            {/* BUSCA + BAIRRO */}

            <div
              className="
                grid
                gap-3
                lg:grid-cols-[1fr_300px_auto]
              "
            >
              {/* BUSCA */}

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
                  value={busca}
                  onChange={(event) =>
                    setBusca(
                      event.target.value
                    )
                  }
                  placeholder="Busque por unidade, bairro ou tipo de atendimento..."
                  className="
                    h-12
                    w-full
                    rounded-full
                    border
                    border-slate-200
                    bg-[#F8FAFD]
                    pl-12
                    pr-5
                    text-sm
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

              {/* =================================================
                  BAIRRO
              ================================================== */}

              <div className="relative">
                <button
                  type="button"
                  onClick={() =>
                    setBairroAberto(
                      !bairroAberto
                    )
                  }
                  className={`
                    flex
                    h-12
                    w-full
                    items-center
                    rounded-full
                    border
                    bg-[#F8FAFD]
                    px-4
                    text-left
                    text-sm
                    font-medium
                    text-[#0B1756]
                    outline-none
                    transition-all
                    duration-200

                    ${
                      bairroAberto
                        ? `
                            border-[#3563A7]
                            bg-white
                            ring-4
                            ring-[#3563A7]/10
                          `
                        : `
                            border-slate-200
                            hover:border-[#B5CCE5]
                            hover:bg-white
                          `
                    }
                  `}
                >
                  <MapPin
                    size={18}
                    className="
                      mr-3
                      shrink-0
                      text-[#023E8A]
                    "
                  />

                  <span className="flex-1 truncate">
                    {bairro === "Todos"
                      ? "Todos os bairros"
                      : bairro}
                  </span>

                  <ChevronDown
                    size={18}
                    className={`
                      shrink-0
                      text-[#023E8A]
                      transition-transform
                      duration-200

                      ${
                        bairroAberto
                          ? "rotate-180"
                          : ""
                      }
                    `}
                  />
                </button>

                {/* DROPDOWN */}

                {bairroAberto && (
                  <div
                    className="
                      absolute
                      left-0
                      right-0
                      top-[56px]
                      z-[80]
                      overflow-hidden
                      rounded-[20px]
                      border
                      border-slate-200
                      bg-white
                      p-1.5
                      shadow-[0_18px_50px_rgba(2,62,138,0.18)]
                    "
                  >
                    <div
                      className="
                        max-h-[270px]
                        overflow-y-auto
                      "
                    >
                      {bairros.map((item) => {
                        const ativo =
                          bairro === item;

                        return (
                          <button
                            key={item}
                            type="button"
                            onClick={() => {
                              setBairro(item);
                              setBairroAberto(
                                false
                              );
                            }}
                            className={`
                              flex
                              w-full
                              items-center
                              gap-3
                              rounded-xl
                              px-4
                              py-2.5
                              text-left
                              text-sm
                              transition-all
                              duration-150

                              ${
                                ativo
                                  ? `
                                      bg-[#023E8A]
                                      font-semibold
                                      text-white
                                    `
                                  : `
                                      text-[#0B1756]
                                      hover:bg-[#EAF3F7]
                                      hover:text-[#023E8A]
                                    `
                              }
                            `}
                          >
                            <div
                              className={`
                                flex
                                h-7
                                w-7
                                shrink-0
                                items-center
                                justify-center
                                rounded-lg

                                ${
                                  ativo
                                    ? "bg-white/15"
                                    : "bg-[#EAF3F7]"
                                }
                              `}
                            >
                              <MapPin
                                size={14}
                                className={
                                  ativo
                                    ? "text-white"
                                    : "text-[#023E8A]"
                                }
                              />
                            </div>

                            <span>
                              {item === "Todos"
                                ? "Todos os bairros"
                                : item}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* LIMPAR */}

              <button
                type="button"
                onClick={limparFiltros}
                className="
                  flex
                  h-12
                  items-center
                  justify-center
                  gap-2
                  rounded-full
                  border
                  border-slate-200
                  bg-white
                  px-5
                  text-sm
                  font-semibold
                  text-slate-500
                  transition

                  hover:border-[#023E8A]
                  hover:bg-[#EAF3F7]
                  hover:text-[#023E8A]
                "
              >
                <X size={16} />

                Limpar
              </button>
            </div>

            {/* =================================================
                TIPOS
            ================================================== */}

            <div
              className="
                mt-4
                flex
                gap-2
                overflow-x-auto
                pb-1
              "
            >
              {TIPOS.map((item) => {
                const ativo =
                  tipo === item;

                return (
                  <button
                    key={item}
                    type="button"
                    onClick={() =>
                      setTipo(item)
                    }
                    className={`
                      flex
                      shrink-0
                      items-center
                      gap-2
                      rounded-full
                      px-4
                      py-2
                      text-xs
                      font-semibold
                      transition-all

                      ${
                        ativo
                          ? `
                              bg-[#023E8A]
                              text-white
                              shadow-sm
                            `
                          : `
                              border
                              border-slate-200
                              bg-[#F8FAFD]
                              text-slate-500

                              hover:border-[#C5D8EB]
                              hover:bg-[#EAF3F7]
                              hover:text-[#023E8A]
                            `
                      }
                    `}
                  >
                    {item === "Todos" ? (
                      <Filter size={14} />
                    ) : (
                      iconeTipo(
                        item,
                        14
                      )
                    )}

                    {item}
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* =====================================================
            RESULTADOS
        ====================================================== */}

        <section
          className="
            relative
            mx-auto
            max-w-[1300px]
            px-4
            py-9
            sm:px-6
            lg:px-8
          "
        >
          <div
            className="
              mb-5
              flex
              items-end
              justify-between
              gap-4
            "
          >
            <div>
              <p
                className="
                  text-sm
                  font-semibold
                  text-[#023E8A]
                "
              >
                Unidades encontradas
              </p>

              <h2
                className="
                  mt-1
                  text-2xl
                  font-bold
                  text-[#0B1756]
                "
              >
                {unidadesFiltradas.length}{" "}
                {unidadesFiltradas.length === 1
                  ? "resultado"
                  : "resultados"}
              </h2>
            </div>
          </div>

          {/* CARDS */}

          {unidadesFiltradas.length > 0 ? (
            <div
              className="
                grid
                gap-5
                md:grid-cols-2
                xl:grid-cols-3
              "
            >
              {unidadesFiltradas.map(
                (unidade) => (
                  <UnidadeCard
                    key={unidade.id}
                    unidade={unidade}
                    onAbrir={() =>
                      setUnidadeAberta(
                        unidade
                      )
                    }
                  />
                )
              )}
            </div>
          ) : (
            <div
              className="
                flex
                min-h-[280px]
                flex-col
                items-center
                justify-center
                rounded-[24px]
                border
                border-dashed
                border-slate-300
                bg-white
                text-center
                shadow-sm
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
                  bg-[#EAF3F7]
                  text-[#023E8A]
                "
              >
                <Search size={24} />
              </div>

              <h3
                className="
                  mt-4
                  font-semibold
                  text-[#0B1756]
                "
              >
                Nenhuma unidade encontrada
              </h3>

              <p
                className="
                  mt-1
                  text-sm
                  text-slate-500
                "
              >
                Tente alterar os filtros ou sua busca.
              </p>

              <button
                type="button"
                onClick={limparFiltros}
                className="
                  mt-4
                  rounded-full
                  bg-[#023E8A]
                  px-5
                  py-2.5
                  text-sm
                  font-semibold
                  text-white
                  transition
                  hover:bg-[#0B1756]
                "
              >
                Limpar filtros
              </button>
            </div>
          )}
        </section>
      </div>

      {/* =====================================================
          MODAL
      ====================================================== */}

      {unidadeAberta && (
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
          onClick={() =>
            setUnidadeAberta(null)
          }
        >
          <div
            onClick={(event) =>
              event.stopPropagation()
            }
            className="
              max-h-[90vh]
              w-full
              max-w-2xl
              overflow-y-auto
              rounded-[28px]
              bg-white
              shadow-2xl
            "
          >
            {/* CABEÇALHO */}

            <div
              className="
                flex
                items-start
                justify-between
                border-b
                border-slate-100
                p-6
              "
            >
              <div>
                <div
                  className="
                    mb-2
                    flex
                    w-fit
                    items-center
                    gap-2
                    rounded-full
                    bg-[#EAF3F7]
                    px-3
                    py-1.5
                    text-xs
                    font-semibold
                    text-[#023E8A]
                  "
                >
                  {iconeTipo(
                    unidadeAberta.tipo,
                    14
                  )}

                  {unidadeAberta.tipo}
                </div>

                <h2
                  className="
                    text-2xl
                    font-bold
                    text-[#0B1756]
                  "
                >
                  {unidadeAberta.nome}
                </h2>
              </div>

              <button
                type="button"
                onClick={() =>
                  setUnidadeAberta(null)
                }
                className="
                  flex
                  h-10
                  w-10
                  shrink-0
                  items-center
                  justify-center
                  rounded-full
                  bg-[#F3F7FC]
                  text-[#0B1756]
                  transition
                  hover:bg-[#EAF3F7]
                "
              >
                <X size={19} />
              </button>
            </div>

            {/* CONTEÚDO */}

            <div className="p-6">
              <p
                className="
                  text-sm
                  leading-6
                  text-slate-500
                "
              >
                {unidadeAberta.descricao}
              </p>

              <div
                className="
                  mt-5
                  grid
                  gap-3
                  sm:grid-cols-2
                "
              >
                <Detalhe
                  icon={
                    <MapPin size={18} />
                  }
                  titulo="Localização"
                  texto={`${unidadeAberta.bairro} • ${unidadeAberta.endereco}`}
                />

                <Detalhe
                  icon={
                    <Clock3 size={18} />
                  }
                  titulo="Horário"
                  texto={
                    unidadeAberta.horario
                  }
                />

                <Detalhe
                  icon={
                    <Phone size={18} />
                  }
                  titulo="Telefone"
                  texto={
                    unidadeAberta.telefone
                  }
                />

                <Detalhe
                  icon={
                    <Building2 size={18} />
                  }
                  titulo="Tipo"
                  texto={unidadeAberta.tipo}
                />
              </div>

              {/* SERVIÇOS */}

              <div className="mt-6">
                <h3
                  className="
                    font-semibold
                    text-[#0B1756]
                  "
                >
                  Principais serviços
                </h3>

                <div
                  className="
                    mt-3
                    flex
                    flex-wrap
                    gap-2
                  "
                >
                  {unidadeAberta.servicos.map(
                    (servico) => (
                      <span
                        key={servico}
                        className="
                          rounded-full
                          bg-[#EAF3F7]
                          px-3
                          py-1.5
                          text-xs
                          font-semibold
                          text-[#023E8A]
                        "
                      >
                        {servico}
                      </span>
                    )
                  )}
                </div>
              </div>

              <button
                type="button"
                className="
                  mt-6
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
                  transition
                  hover:bg-[#0B1756]
                "
              >
                <Navigation size={17} />

                Ver localização
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

/* ============================================================
   CARD
============================================================ */

function UnidadeCard({
  unidade,
  onAbrir,
}) {
  return (
    <article
      className="
        group
        relative
        overflow-hidden
        rounded-[22px]
        border
        border-slate-100
        bg-white
        p-5
        shadow-sm
        transition-all
        duration-300

        hover:-translate-y-1
        hover:shadow-[0_15px_40px_rgba(2,62,138,0.12)]
      "
    >
      {/* decoração do card */}

      <div
        className="
          pointer-events-none
          absolute
          -right-12
          -top-12
          h-32
          w-32
          rounded-full
          bg-[#EAF3F7]/60
        "
      />

      <div className="relative z-10">
        {/* TIPO */}

        <div
          className="
            flex
            w-fit
            items-center
            gap-2
            rounded-full
            bg-[#EAF3F7]
            px-3
            py-1.5
            text-xs
            font-semibold
            text-[#023E8A]
          "
        >
          {iconeTipo(
            unidade.tipo,
            14
          )}

          {unidade.tipo}
        </div>

        {/* NOME */}

        <h3
          className="
            mt-4
            min-h-[48px]
            text-lg
            font-bold
            leading-6
            text-[#0B1756]
          "
        >
          {unidade.nome}
        </h3>

        {/* BAIRRO */}

        <div
          className="
            mt-3
            flex
            items-center
            gap-2
            text-sm
            text-slate-500
          "
        >
          <MapPin
            size={16}
            className="
              shrink-0
              text-[#023E8A]
            "
          />

          {unidade.bairro}
        </div>

        {/* HORÁRIO */}

        <div
          className="
            mt-2
            flex
            items-center
            gap-2
            text-sm
            text-slate-500
          "
        >
          <Clock3
            size={16}
            className="
              shrink-0
              text-[#023E8A]
            "
          />

          <span className="line-clamp-1">
            {unidade.horario}
          </span>
        </div>

        {/* DESCRIÇÃO */}

        <p
          className="
            mt-3
            line-clamp-3
            text-sm
            leading-6
            text-slate-500
          "
        >
          {unidade.descricao}
        </p>

        {/* SERVIÇOS */}

        <div
          className="
            mt-4
            flex
            flex-wrap
            gap-1.5
          "
        >
          {unidade.servicos
            .slice(0, 3)
            .map((servico) => (
              <span
                key={servico}
                className="
                  rounded-full
                  bg-[#F3F7FC]
                  px-2.5
                  py-1
                  text-[11px]
                  font-medium
                  text-[#3563A7]
                "
              >
                {servico}
              </span>
            ))}
        </div>

        {/* BOTÃO */}

        <button
          type="button"
          onClick={onAbrir}
          className="
            mt-5
            flex
            w-full
            items-center
            justify-between
            border-t
            border-slate-100
            pt-4
            text-sm
            font-semibold
            text-[#023E8A]
          "
        >
          Ver informações

          <ArrowRight
            size={16}
            className="
              transition-transform
              group-hover:translate-x-1
            "
          />
        </button>
      </div>
    </article>
  );
}

/* ============================================================
   INFO HERO
============================================================ */

function InfoHero({
  icon,
  texto,
}) {
  return (
    <div
      className="
        flex
        items-center
        gap-2
        rounded-full
        border
        border-white/15
        bg-white/10
        px-3
        py-2
        text-xs
        font-medium
        text-white
        backdrop-blur
      "
    >
      {icon}

      {texto}
    </div>
  );
}

/* ============================================================
   DETALHE MODAL
============================================================ */

function Detalhe({
  icon,
  titulo,
  texto,
}) {
  return (
    <div
      className="
        flex
        items-start
        gap-3
        rounded-xl
        bg-[#F8FAFD]
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
          rounded-lg
          bg-[#EAF3F7]
          text-[#023E8A]
        "
      >
        {icon}
      </div>

      <div>
        <p
          className="
            text-xs
            text-slate-400
          "
        >
          {titulo}
        </p>

        <p
          className="
            mt-0.5
            text-sm
            font-semibold
            text-[#0B1756]
          "
        >
          {texto}
        </p>
      </div>
    </div>
  );
}

/* ============================================================
   ÍCONE POR TIPO
============================================================ */

function iconeTipo(
  tipo,
  tamanho = 16
) {
  if (tipo === "UBS") {
    return (
      <Stethoscope
        size={tamanho}
      />
    );
  }

  if (
    tipo ===
    "Urgência e Emergência"
  ) {
    return (
      <HeartPulse
        size={tamanho}
      />
    );
  }

  if (
    tipo ===
    "Hospital Municipal"
  ) {
    return (
      <Hospital
        size={tamanho}
      />
    );
  }

  return (
    <Building2
      size={tamanho}
    />
  );
}