"use client";

import { useMemo, useState } from "react";
import {
  Search,
  MapPin,
  Phone,
  Clock,
  Map,
  SlidersHorizontal,
  Hospital,
  Stethoscope,
  Building2,
  ExternalLink,
  X,
  Navigation,
  HeartPulse,
  ChevronRight,
  RotateCcw,
  CheckCircle2,
} from "lucide-react";


// ============================================================
// DADOS DAS UNIDADES
// ============================================================
//
// Futuramente você pode retirar daqui e buscar do:
// - backend
// - banco de dados
// - API
// - arquivo JSON
//
// ============================================================

const UNIDADES = [
  {
    id: 1,

    nome: "UBS Santo Antônio",

    tipo: "UBS",

    bairro: "Santo Antônio",

    endereco: "Rua Joaquim Nabuco, 215",

    telefone: "(11) 4223-5479",

    horario: "Segunda a sexta, das 7h às 17h",

    aberto: true,

    atendimento24h: false,

    descricao:
      "Unidade de atenção básica voltada a consultas, prevenção e acompanhamento da saúde da população.",

    servicos: [
      "Clínica geral",
      "Enfermagem",
      "Vacinação",
      "Acompanhamento de saúde",
    ],
  },

  {
    id: 2,

    nome: "UBS Dr. Ivanhoé Esposito",

    tipo: "UBS",

    bairro: "Barcelona",

    endereco: "Rua Flórida, 295",

    telefone: "(11) 4233-7542",

    horario: "Segunda a sexta, das 7h às 17h",

    aberto: true,

    atendimento24h: false,

    descricao:
      "Unidade de atenção primária com atendimento clínico, vacinação e acompanhamento de pacientes.",

    servicos: [
      "Clínica geral",
      "Vacinação",
      "Enfermagem",
      "Prevenção",
    ],
  },

  {
    id: 3,

    nome: "UBS Maria Corbeta Segato",

    tipo: "UBS",

    bairro: "Prosperidade",

    endereco: "Avenida Prosperidade, 671",

    telefone: "(11) 4233-7543",

    horario: "Segunda a sexta, das 7h às 21h",

    aberto: true,

    atendimento24h: false,

    descricao:
      "Unidade básica com horário ampliado para facilitar o acesso da população aos serviços públicos de saúde.",

    servicos: [
      "Consultas",
      "Vacinação",
      "Enfermagem",
      "Acompanhamento",
    ],
  },

  {
    id: 4,

    nome: "Hospital Municipal de Emergências Albert Sabin",

    tipo: "Urgência e Emergência",

    bairro: "Santa Paula",

    endereco: "Rua Aurélia, 101",

    telefone: "(11) 4233-7500",

    horario: "Atendimento 24 horas",

    aberto: true,

    atendimento24h: true,

    descricao:
      "Unidade municipal destinada ao atendimento de situações de urgência e emergência.",

    servicos: [
      "Urgência",
      "Emergência",
      "Atendimento médico",
      "Atendimento 24h",
    ],
  },

  {
    id: 5,

    nome: "Hospital Municipal Maria Braido",

    tipo: "Hospital Municipal",

    bairro: "Santa Paula",

    endereco: "Rua São Paulo, 1840",

    telefone: "(11) 4233-7525",

    horario: "Atendimento 24 horas",

    aberto: true,

    atendimento24h: true,

    descricao:
      "Hospital municipal com serviços hospitalares, internação e atendimentos especializados.",

    servicos: [
      "Internação",
      "Cirurgias",
      "Especialidades",
      "Atendimento hospitalar",
    ],
  },

  {
    id: 6,

    nome: "Atende Fácil Saúde Pedro Kassab",

    tipo: "Especialidades",

    bairro: "Santo Antônio",

    endereco: "Av. Senador Roberto Simonsen, 282",

    telefone: "(11) 4233-8115",

    horario: "Segunda a sexta, das 7h às 19h",

    aberto: true,

    atendimento24h: false,

    descricao:
      "Unidade pública destinada a consultas especializadas, exames e serviços de apoio à saúde.",

    servicos: [
      "Especialidades",
      "Exames",
      "Diagnóstico",
      "Atendimento ambulatorial",
    ],
  },
];


// ============================================================
// TIPOS
// ============================================================

const TIPOS = [
  "Todos",
  "UBS",
  "Urgência e Emergência",
  "Hospital Municipal",
  "Especialidades",
];


// ============================================================
// NORMALIZA TEXTO
// Permite pesquisar com ou sem acento
// ============================================================

function normalizarTexto(texto) {
  return texto
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}


// ============================================================
// PÁGINA
// ============================================================

export default function UnidadesPage() {

  const [pesquisa, setPesquisa] = useState("");

  const [tipo, setTipo] = useState("Todos");

  const [bairro, setBairro] = useState("Todos");

  const [somenteAbertos, setSomenteAbertos] = useState(false);

  const [ordenacao, setOrdenacao] = useState("nome");

  const [unidadeSelecionada, setUnidadeSelecionada] =
    useState(null);


  // ==========================================================
  // BAIRROS
  // ==========================================================

  const bairros = useMemo(() => {
    return [
      "Todos",
      ...new Set(
        UNIDADES
          .map((unidade) => unidade.bairro)
          .sort((a, b) => a.localeCompare(b))
      ),
    ];
  }, []);


  // ==========================================================
  // FILTROS
  // ==========================================================

  const unidadesFiltradas = useMemo(() => {

    const texto = normalizarTexto(pesquisa);

    const resultado = UNIDADES.filter((unidade) => {

      const conteudoPesquisa = normalizarTexto(
        `
        ${unidade.nome}
        ${unidade.tipo}
        ${unidade.bairro}
        ${unidade.endereco}
        ${unidade.servicos.join(" ")}
        `
      );


      const correspondePesquisa =
        conteudoPesquisa.includes(texto);


      const correspondeTipo =
        tipo === "Todos" ||
        unidade.tipo === tipo;


      const correspondeBairro =
        bairro === "Todos" ||
        unidade.bairro === bairro;


      const correspondeAberto =
        !somenteAbertos ||
        unidade.aberto;


      return (
        correspondePesquisa &&
        correspondeTipo &&
        correspondeBairro &&
        correspondeAberto
      );

    });


    // ===========================
    // ORDENAÇÃO
    // ===========================

    if (ordenacao === "nome") {

      resultado.sort((a, b) =>
        a.nome.localeCompare(b.nome)
      );

    }


    if (ordenacao === "bairro") {

      resultado.sort((a, b) =>
        a.bairro.localeCompare(b.bairro)
      );

    }


    if (ordenacao === "tipo") {

      resultado.sort((a, b) =>
        a.tipo.localeCompare(b.tipo)
      );

    }


    return resultado;

  }, [
    pesquisa,
    tipo,
    bairro,
    somenteAbertos,
    ordenacao,
  ]);


  // ==========================================================
  // LIMPAR FILTROS
  // ==========================================================

  function limparFiltros() {

    setPesquisa("");

    setTipo("Todos");

    setBairro("Todos");

    setSomenteAbertos(false);

    setOrdenacao("nome");

  }


  const existemFiltros =
    pesquisa ||
    tipo !== "Todos" ||
    bairro !== "Todos" ||
    somenteAbertos;


  // ==========================================================
  // GOOGLE MAPS
  // ==========================================================

  function abrirMapa(unidade) {

    const enderecoCompleto =
      `${unidade.nome}, ${unidade.endereco}, ` +
      `${unidade.bairro}, São Caetano do Sul - SP`;


    const url =
      `https://www.google.com/maps/search/?api=1&query=` +
      encodeURIComponent(enderecoCompleto);


    window.open(
      url,
      "_blank",
      "noopener,noreferrer"
    );

  }


  // ==========================================================
  // MAPA GERAL
  // ==========================================================

  function abrirMapaGeral() {

    const url =
      "https://www.google.com/maps/search/" +
      "?api=1&query=rede+publica+de+saude+São+Caetano+do+Sul";


    window.open(
      url,
      "_blank",
      "noopener,noreferrer"
    );

  }


  // ==========================================================
  // ÍCONE
  // ==========================================================

  function iconeTipo(tipoUnidade) {

    if (tipoUnidade === "UBS") {

      return <Stethoscope size={22} />;

    }


    if (
      tipoUnidade === "Hospital Municipal" ||
      tipoUnidade === "Urgência e Emergência"
    ) {

      return <Hospital size={22} />;

    }


    return <Building2 size={22} />;

  }


  // ==========================================================
  // RETORNO
  // ==========================================================

  return (

    <main
      className="
        relative
        min-h-screen
        overflow-hidden
        bg-[#EAF3F7]
      "
    >


      {/* =====================================================
          FUNDO COM CÍRCULOS
      ====================================================== */}


      <div
        className="
          pointer-events-none
          absolute
          -right-28
          -top-36
          h-[430px]
          w-[430px]
          rounded-full
          bg-[#B8D6FC]/50
        "
      />


      <div
        className="
          pointer-events-none
          absolute
          -left-40
          top-10
          h-[330px]
          w-[330px]
          rounded-full
          border-2
          border-[#C8DEFF]/60
        "
      />


      <div
        className="
          pointer-events-none
          absolute
          -bottom-36
          -left-24
          h-[350px]
          w-[350px]
          rounded-full
          bg-white/50
        "
      />


      <div
        className="
          pointer-events-none
          absolute
          -bottom-40
          -right-24
          h-[430px]
          w-[430px]
          rounded-full
          border-[70px]
          border-[#C5DFFF]/50
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
          max-w-7xl
          px-5
          py-14
          md:px-6
        "
      >


        {/* =================================================
            TÍTULO
        ================================================== */}


        <section className="mb-10">


          <div
            className="
              inline-flex
              items-center
              gap-2
              rounded-full
              border
              border-[#C8DEFF]
              bg-white/80
              px-4
              py-2
              text-sm
              font-semibold
              text-[#023E8A]
              shadow-sm
              backdrop-blur
            "
          >

            <HeartPulse size={17} />

            Rede Pública Municipal

          </div>


          <h1
            className="
              mt-5
              max-w-3xl
              text-4xl
              font-bold
              leading-tight
              text-[#0B1756]
              md:text-5xl
            "
          >

            Encontre uma unidade pública de saúde

          </h1>


          <p
            className="
              mt-4
              max-w-3xl
              text-lg
              leading-relaxed
              text-slate-600
            "
          >

            Consulte UBSs, hospitais municipais,
            unidades de urgência e serviços especializados
            da rede pública de São Caetano do Sul.

          </p>

        </section>



        {/* =================================================
            BUSCA E FILTROS
        ================================================== */}


        <section
          className="
            rounded-[28px]
            border
            border-white/70
            bg-white/90
            p-5
            shadow-[0_10px_40px_rgba(2,62,138,0.06)]
            backdrop-blur-md
            md:p-7
          "
        >


          {/* BUSCA */}


          <div className="relative">


            <Search
              size={21}
              className="
                absolute
                left-4
                top-1/2
                -translate-y-1/2
                text-slate-400
              "
            />


            <input
              type="search"
              value={pesquisa}
              onChange={(event) =>
                setPesquisa(event.target.value)
              }
              placeholder="Pesquise por unidade, bairro, endereço ou serviço..."
              aria-label="Pesquisar unidades de saúde"
              className="
                w-full
                rounded-2xl
                border
                border-slate-200
                bg-[#F8FAFD]
                py-4
                pl-12
                pr-12
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


            {pesquisa && (

              <button
                type="button"
                onClick={() => setPesquisa("")}
                aria-label="Limpar pesquisa"
                className="
                  absolute
                  right-4
                  top-1/2
                  -translate-y-1/2
                  text-slate-400
                  transition
                  hover:text-[#023E8A]
                "
              >

                <X size={19} />

              </button>

            )}

          </div>



          {/* =================================================
              FILTRO POR TIPO
          ================================================== */}


          <div className="mt-6">


            <div
              className="
                mb-3
                flex
                items-center
                gap-2
                text-sm
                font-semibold
                text-[#0B1756]
              "
            >

              <SlidersHorizontal size={17} />

              Tipo de unidade

            </div>


            <div className="flex flex-wrap gap-2">


              {TIPOS.map((item) => (

                <button
                  key={item}
                  type="button"
                  onClick={() =>
                    setTipo(item)
                  }
                  className={`
                    rounded-full
                    border
                    px-4
                    py-2
                    text-sm
                    font-medium
                    transition-all

                    ${
                      tipo === item

                        ? `
                          border-[#023E8A]
                          bg-[#023E8A]
                          text-white
                          shadow-sm
                        `

                        : `
                          border-slate-200
                          bg-white
                          text-slate-600
                          hover:border-[#3563A7]
                          hover:text-[#023E8A]
                        `
                    }
                  `}
                >

                  {item}

                </button>

              ))}

            </div>

          </div>



          {/* =================================================
              FILTROS SECUNDÁRIOS
          ================================================== */}


          <div
            className="
              mt-6
              flex
              flex-col
              gap-3
              border-t
              border-slate-100
              pt-5
              md:flex-row
              md:items-center
            "
          >


            {/* BAIRRO */}


            <div className="flex-1">


              <label
                htmlFor="bairro"
                className="
                  mb-2
                  block
                  text-xs
                  font-semibold
                  uppercase
                  tracking-wide
                  text-slate-500
                "
              >

                Bairro

              </label>


              <select
                id="bairro"
                value={bairro}
                onChange={(event) =>
                  setBairro(event.target.value)
                }
                className="
                  w-full
                  rounded-xl
                  border
                  border-slate-200
                  bg-white
                  px-4
                  py-3
                  text-sm
                  text-[#0B1756]
                  outline-none
                  transition
                  focus:border-[#3563A7]
                "
              >

                {bairros.map((item) => (

                  <option
                    key={item}
                    value={item}
                  >

                    {item === "Todos"
                      ? "Todos os bairros"
                      : item}

                  </option>

                ))}

              </select>

            </div>



            {/* ORDENAÇÃO */}


            <div className="flex-1">


              <label
                htmlFor="ordenacao"
                className="
                  mb-2
                  block
                  text-xs
                  font-semibold
                  uppercase
                  tracking-wide
                  text-slate-500
                "
              >

                Ordenar por

              </label>


              <select
                id="ordenacao"
                value={ordenacao}
                onChange={(event) =>
                  setOrdenacao(event.target.value)
                }
                className="
                  w-full
                  rounded-xl
                  border
                  border-slate-200
                  bg-white
                  px-4
                  py-3
                  text-sm
                  text-[#0B1756]
                  outline-none
                "
              >

                <option value="nome">
                  Nome
                </option>

                <option value="bairro">
                  Bairro
                </option>

                <option value="tipo">
                  Tipo da unidade
                </option>

              </select>

            </div>



            {/* ABERTO */}


            <div className="md:pt-5">


              <button
                type="button"
                onClick={() =>
                  setSomenteAbertos(
                    !somenteAbertos
                  )
                }
                className={`
                  flex
                  h-[46px]
                  items-center
                  gap-2
                  rounded-xl
                  border
                  px-4
                  text-sm
                  font-semibold
                  transition

                  ${
                    somenteAbertos

                      ? `
                        border-emerald-300
                        bg-emerald-50
                        text-emerald-700
                      `

                      : `
                        border-slate-200
                        bg-white
                        text-slate-600
                        hover:border-slate-300
                      `
                  }
                `}
              >

                <CheckCircle2 size={17} />

                Em funcionamento

              </button>

            </div>


          </div>



          {/* LIMPAR FILTROS */}


          {existemFiltros && (

            <button
              type="button"
              onClick={limparFiltros}
              className="
                mt-5
                flex
                items-center
                gap-2
                text-sm
                font-medium
                text-slate-500
                transition
                hover:text-[#023E8A]
              "
            >

              <RotateCcw size={15} />

              Limpar filtros

            </button>

          )}

        </section>



        {/* =================================================
            RESULTADOS
        ================================================== */}


        <div
          className="
            mt-8
            flex
            flex-col
            gap-3
            sm:flex-row
            sm:items-center
            sm:justify-between
          "
        >


          <div>


            <p
              className="
                text-lg
                font-bold
                text-[#0B1756]
              "
            >

              {unidadesFiltradas.length}

              {unidadesFiltradas.length === 1
                ? " unidade encontrada"
                : " unidades encontradas"}

            </p>


            <p
              className="
                mt-1
                text-sm
                text-slate-500
              "
            >

              Rede pública de saúde de São Caetano do Sul

            </p>

          </div>


          <button
            type="button"
            onClick={abrirMapaGeral}
            className="
              flex
              w-fit
              items-center
              gap-2
              rounded-xl
              border
              border-[#023E8A]
              bg-white/80
              px-4
              py-2.5
              text-sm
              font-semibold
              text-[#023E8A]
              transition
              hover:bg-[#023E8A]
              hover:text-white
            "
          >

            <Map size={17} />

            Ver todas no mapa

          </button>

        </div>



        {/* =================================================
            LISTA + MAPA
        ================================================== */}


        <section
          className="
            mt-6
            grid
            items-start
            gap-7
            lg:grid-cols-[1.15fr_0.85fr]
          "
        >


          {/* =================================================
              LISTA
          ================================================== */}


          <div className="space-y-4">


            {unidadesFiltradas.map((unidade) => (

              <article
                key={unidade.id}
                className="
                  group
                  rounded-[24px]
                  border
                  border-white/80
                  bg-white/90
                  p-5
                  shadow-[0_8px_30px_rgba(2,62,138,0.05)]
                  backdrop-blur
                  transition-all
                  duration-300
                  hover:-translate-y-1
                  hover:shadow-[0_16px_40px_rgba(2,62,138,0.10)]
                  md:p-6
                "
              >


                {/* TOPO */}


                <div
                  className="
                    flex
                    items-start
                    justify-between
                    gap-4
                  "
                >


                  <div className="flex gap-4">


                    {/* ÍCONE */}


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
                        transition
                        group-hover:bg-[#023E8A]
                        group-hover:text-white
                      "
                    >

                      {iconeTipo(
                        unidade.tipo
                      )}

                    </div>



                    {/* TÍTULO */}


                    <div>


                      <span
                        className="
                          text-xs
                          font-bold
                          uppercase
                          tracking-wider
                          text-[#3563A7]
                        "
                      >

                        {unidade.tipo}

                      </span>


                      <h2
                        className="
                          mt-1
                          text-xl
                          font-bold
                          leading-snug
                          text-[#0B1756]
                        "
                      >

                        {unidade.nome}

                      </h2>


                      <p
                        className="
                          mt-1
                          text-sm
                          text-slate-500
                        "
                      >

                        {unidade.bairro}

                      </p>

                    </div>

                  </div>



                  {/* STATUS */}


                  <span
                    className="
                      flex
                      shrink-0
                      items-center
                      gap-1.5
                      rounded-full
                      bg-emerald-50
                      px-3
                      py-1.5
                      text-xs
                      font-semibold
                      text-emerald-700
                    "
                  >

                    <span
                      className="
                        h-2
                        w-2
                        rounded-full
                        bg-emerald-500
                      "
                    />

                    {unidade.atendimento24h
                      ? "24 horas"
                      : "Em funcionamento"}

                  </span>

                </div>



                {/* INFORMAÇÕES */}


                <div
                  className="
                    mt-5
                    grid
                    gap-3
                    text-sm
                    text-slate-600
                  "
                >


                  <div className="flex gap-3">

                    <MapPin
                      size={18}
                      className="
                        mt-0.5
                        shrink-0
                        text-[#3563A7]
                      "
                    />

                    <span>

                      {unidade.endereco}

                    </span>

                  </div>


                  <div className="flex gap-3">

                    <Clock
                      size={18}
                      className="
                        mt-0.5
                        shrink-0
                        text-[#3563A7]
                      "
                    />

                    <span>

                      {unidade.horario}

                    </span>

                  </div>


                  <div className="flex gap-3">

                    <Phone
                      size={18}
                      className="
                        mt-0.5
                        shrink-0
                        text-[#3563A7]
                      "
                    />

                    <span>

                      {unidade.telefone}

                    </span>

                  </div>

                </div>



                {/* SERVIÇOS */}


                <div
                  className="
                    mt-5
                    flex
                    flex-wrap
                    gap-2
                  "
                >

                  {unidade.servicos
                    .slice(0, 4)
                    .map((servico) => (

                      <span
                        key={servico}
                        className="
                          rounded-full
                          bg-[#F1F6FD]
                          px-3
                          py-1
                          text-xs
                          font-medium
                          text-[#3563A7]
                        "
                      >

                        {servico}

                      </span>

                    ))}

                </div>



                {/* BOTÕES */}


                <div
                  className="
                    mt-6
                    flex
                    flex-wrap
                    gap-3
                    border-t
                    border-slate-100
                    pt-5
                  "
                >


                  <button
                    type="button"
                    onClick={() =>
                      setUnidadeSelecionada(
                        unidade
                      )
                    }
                    className="
                      flex
                      items-center
                      gap-2
                      rounded-xl
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

                    Ver detalhes

                    <ChevronRight size={16} />

                  </button>


                  <button
                    type="button"
                    onClick={() =>
                      abrirMapa(unidade)
                    }
                    className="
                      flex
                      items-center
                      gap-2
                      rounded-xl
                      border
                      border-[#023E8A]
                      px-5
                      py-2.5
                      text-sm
                      font-semibold
                      text-[#023E8A]
                      transition
                      hover:bg-[#EAF3F7]
                    "
                  >

                    <Navigation size={16} />

                    Como chegar

                  </button>


                  <a
                    href={`tel:${unidade.telefone.replace(
                      /\D/g,
                      ""
                    )}`}
                    className="
                      flex
                      items-center
                      gap-2
                      rounded-xl
                      border
                      border-slate-200
                      px-5
                      py-2.5
                      text-sm
                      font-medium
                      text-slate-600
                      transition
                      hover:border-slate-300
                      hover:bg-slate-50
                    "
                  >

                    <Phone size={16} />

                    Ligar

                  </a>

                </div>

              </article>

            ))}



            {/* SEM RESULTADOS */}


            {unidadesFiltradas.length === 0 && (

              <div
                className="
                  rounded-[28px]
                  border
                  border-white
                  bg-white/90
                  px-6
                  py-16
                  text-center
                  shadow-sm
                "
              >

                <div
                  className="
                    mx-auto
                    flex
                    h-16
                    w-16
                    items-center
                    justify-center
                    rounded-2xl
                    bg-[#EAF3F7]
                  "
                >

                  <Search
                    size={30}
                    className="text-[#3563A7]"
                  />

                </div>


                <h3
                  className="
                    mt-5
                    text-xl
                    font-bold
                    text-[#0B1756]
                  "
                >

                  Nenhuma unidade encontrada

                </h3>


                <p
                  className="
                    mx-auto
                    mt-2
                    max-w-sm
                    text-sm
                    leading-relaxed
                    text-slate-500
                  "
                >

                  Não encontramos nenhuma unidade com
                  os filtros selecionados.

                </p>


                <button
                  type="button"
                  onClick={limparFiltros}
                  className="
                    mt-5
                    rounded-xl
                    bg-[#023E8A]
                    px-5
                    py-2.5
                    text-sm
                    font-semibold
                    text-white
                  "
                >

                  Limpar filtros

                </button>

              </div>

            )}

          </div>



          {/* =================================================
              MAPA
          ================================================== */}


          <aside
            className="
              hidden
              lg:block
            "
          >


            <div
              className="
                sticky
                top-6
                overflow-hidden
                rounded-[28px]
                border
                border-white/80
                bg-white/90
                p-3
                shadow-[0_10px_40px_rgba(2,62,138,0.07)]
                backdrop-blur
              "
            >


              <div
                className="
                  relative
                  flex
                  h-[620px]
                  flex-col
                  items-center
                  justify-center
                  overflow-hidden
                  rounded-[22px]
                  bg-[#DDECFB]
                  px-8
                  text-center
                "
              >


                {/* CÍRCULOS DO MAPA */}


                <div
                  className="
                    absolute
                    -right-20
                    -top-20
                    h-64
                    w-64
                    rounded-full
                    bg-[#B8D6FC]/60
                  "
                />


                <div
                  className="
                    absolute
                    -bottom-24
                    -left-24
                    h-72
                    w-72
                    rounded-full
                    border-[50px]
                    border-white/40
                  "
                />


                {/* CONTEÚDO */}


                <div
                  className="
                    relative
                    z-10
                  "
                >


                  <div
                    className="
                      mx-auto
                      flex
                      h-20
                      w-20
                      items-center
                      justify-center
                      rounded-3xl
                      bg-white
                      text-[#023E8A]
                      shadow-sm
                    "
                  >

                    <Map size={37} />

                  </div>


                  <h3
                    className="
                      mt-6
                      text-2xl
                      font-bold
                      text-[#0B1756]
                    "
                  >

                    Mapa das unidades

                  </h3>


                  <p
                    className="
                      mx-auto
                      mt-3
                      max-w-xs
                      text-sm
                      leading-relaxed
                      text-slate-600
                    "
                  >

                    Visualize as unidades públicas de saúde
                    de São Caetano do Sul e encontre a melhor
                    rota até o local.

                  </p>


                  <button
                    type="button"
                    onClick={abrirMapaGeral}
                    className="
                      mx-auto
                      mt-6
                      flex
                      items-center
                      justify-center
                      gap-2
                      rounded-xl
                      bg-[#023E8A]
                      px-5
                      py-3
                      font-semibold
                      text-white
                      transition
                      hover:bg-[#0B1756]
                    "
                  >

                    <ExternalLink size={17} />

                    Abrir mapa completo

                  </button>


                  <p
                    className="
                      mt-4
                      text-xs
                      text-slate-500
                    "
                  >

                    O mapa será aberto em uma nova guia.

                  </p>

                </div>

              </div>

            </div>

          </aside>

        </section>

      </div>



      {/* =====================================================
          MODAL
      ====================================================== */}


      {unidadeSelecionada && (

        <div
          className="
            fixed
            inset-0
            z-50
            flex
            items-center
            justify-center
            bg-[#07143C]/45
            p-4
            backdrop-blur-sm
          "
          onClick={() =>
            setUnidadeSelecionada(null)
          }
        >


          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="titulo-unidade"
            onClick={(event) =>
              event.stopPropagation()
            }
            className="
              relative
              max-h-[90vh]
              w-full
              max-w-2xl
              overflow-y-auto
              rounded-[28px]
              bg-white
              p-6
              shadow-2xl
              md:p-8
            "
          >


            {/* FECHAR */}


            <button
              type="button"
              onClick={() =>
                setUnidadeSelecionada(null)
              }
              aria-label="Fechar detalhes"
              className="
                absolute
                right-5
                top-5
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-full
                bg-slate-100
                text-slate-500
                transition
                hover:bg-slate-200
                hover:text-[#0B1756]
              "
            >

              <X size={20} />

            </button>



            {/* ÍCONE */}


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

              {iconeTipo(
                unidadeSelecionada.tipo
              )}

            </div>



            {/* TIPO */}


            <p
              className="
                mt-5
                text-xs
                font-bold
                uppercase
                tracking-widest
                text-[#3563A7]
              "
            >

              {unidadeSelecionada.tipo}

            </p>



            {/* NOME */}


            <h2
              id="titulo-unidade"
              className="
                mt-2
                max-w-xl
                pr-10
                text-2xl
                font-bold
                text-[#0B1756]
                md:text-3xl
              "
            >

              {unidadeSelecionada.nome}

            </h2>



            {/* DESCRIÇÃO */}


            <p
              className="
                mt-4
                leading-relaxed
                text-slate-600
              "
            >

              {unidadeSelecionada.descricao}

            </p>



            {/* DETALHES */}


            <div
              className="
                mt-7
                grid
                gap-4
                rounded-2xl
                bg-[#F8FAFD]
                p-5
              "
            >


              <div className="flex gap-3">

                <MapPin
                  size={20}
                  className="
                    mt-0.5
                    shrink-0
                    text-[#023E8A]
                  "
                />

                <div>

                  <p
                    className="
                      text-sm
                      font-semibold
                      text-[#0B1756]
                    "
                  >
                    Endereço
                  </p>

                  <p
                    className="
                      mt-1
                      text-sm
                      text-slate-500
                    "
                  >

                    {unidadeSelecionada.endereco}
                    {" - "}
                    {unidadeSelecionada.bairro}

                  </p>

                </div>

              </div>



              <div className="flex gap-3">

                <Clock
                  size={20}
                  className="
                    mt-0.5
                    shrink-0
                    text-[#023E8A]
                  "
                />

                <div>

                  <p
                    className="
                      text-sm
                      font-semibold
                      text-[#0B1756]
                    "
                  >
                    Horário
                  </p>

                  <p
                    className="
                      mt-1
                      text-sm
                      text-slate-500
                    "
                  >

                    {unidadeSelecionada.horario}

                  </p>

                </div>

              </div>



              <div className="flex gap-3">

                <Phone
                  size={20}
                  className="
                    mt-0.5
                    shrink-0
                    text-[#023E8A]
                  "
                />

                <div>

                  <p
                    className="
                      text-sm
                      font-semibold
                      text-[#0B1756]
                    "
                  >
                    Telefone
                  </p>

                  <p
                    className="
                      mt-1
                      text-sm
                      text-slate-500
                    "
                  >

                    {unidadeSelecionada.telefone}

                  </p>

                </div>

              </div>

            </div>



            {/* SERVIÇOS */}


            <div className="mt-7">


              <h3
                className="
                  font-bold
                  text-[#0B1756]
                "
              >

                Serviços disponíveis

              </h3>


              <div
                className="
                  mt-3
                  flex
                  flex-wrap
                  gap-2
                "
              >

                {unidadeSelecionada.servicos.map(
                  (servico) => (

                    <span
                      key={servico}
                      className="
                        rounded-full
                        bg-[#EAF3F7]
                        px-3
                        py-1.5
                        text-sm
                        font-medium
                        text-[#023E8A]
                      "
                    >

                      {servico}

                    </span>

                  )
                )}

              </div>

            </div>



            {/* AÇÕES */}


            <div
              className="
                mt-8
                flex
                flex-col
                gap-3
                sm:flex-row
              "
            >


              <button
                type="button"
                onClick={() =>
                  abrirMapa(
                    unidadeSelecionada
                  )
                }
                className="
                  flex
                  flex-1
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                  bg-[#023E8A]
                  py-3
                  font-semibold
                  text-white
                  transition
                  hover:bg-[#0B1756]
                "
              >

                <Navigation size={18} />

                Como chegar

              </button>


              <a
                href={`tel:${unidadeSelecionada.telefone.replace(
                  /\D/g,
                  ""
                )}`}
                className="
                  flex
                  flex-1
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                  border
                  border-[#023E8A]
                  py-3
                  font-semibold
                  text-[#023E8A]
                  transition
                  hover:bg-[#EAF3F7]
                "
              >

                <Phone size={18} />

                Ligar para unidade

              </a>

            </div>

          </div>

        </div>

      )}

    </main>
  );
}