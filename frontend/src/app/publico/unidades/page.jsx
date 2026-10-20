"use client";

import { useMemo, useState } from "react";
import {
  Search,
  MapPin,
  Phone,
  Clock,
  Map,
  Hospital,
  Stethoscope,
  Building2,
  Navigation,
  HeartPulse,
  X,
  ChevronRight,
  ExternalLink,
} from "lucide-react";


// ============================================================
// DADOS DAS UNIDADES
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
// CATEGORIAS
// ============================================================

const CATEGORIAS = [
  "UBS",
  "Urgência e Emergência",
  "Hospital Municipal",
  "Especialidades",
];


// ============================================================
// NORMALIZA TEXTO
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

  const [unidadeSelecionada, setUnidadeSelecionada] =
    useState(null);

  const [categoriasAbertas, setCategoriasAbertas] =
    useState([]);


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

    return UNIDADES.filter((unidade) => {
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

      return (
        correspondePesquisa &&
        correspondeTipo &&
        correspondeBairro
      );
    });
  }, [pesquisa, tipo, bairro]);


  // ==========================================================
  // ABRIR / FECHAR CATEGORIA
  // ==========================================================

  function alternarCategoria(categoria) {
    setCategoriasAbertas((anteriores) => {
      if (anteriores.includes(categoria)) {
        return anteriores.filter(
          (item) => item !== categoria
        );
      }

      return [
        ...anteriores,
        categoria,
      ];
    });
  }


  // ==========================================================
  // MAPA INDIVIDUAL
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
  // ÍCONE DA UNIDADE
  // ==========================================================

  function iconeTipo(tipoUnidade) {
    if (tipoUnidade === "UBS") {
      return <Stethoscope size={20} />;
    }

    if (
      tipoUnidade === "Hospital Municipal" ||
      tipoUnidade === "Urgência e Emergência"
    ) {
      return <Hospital size={20} />;
    }

    return <Building2 size={20} />;
  }


  // ==========================================================
  // QUANTIDADE POR TIPO
  // ==========================================================

  function quantidadeTipo(tipoUnidade) {
    if (tipoUnidade === "Todos") {
      return UNIDADES.length;
    }

    return UNIDADES.filter(
      (unidade) =>
        unidade.tipo === tipoUnidade
    ).length;
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

      <div className="pointer-events-none absolute -right-28 -top-36 h-[430px] w-[430px] rounded-full bg-[#B8D6FC]/50" />

      <div className="pointer-events-none absolute -left-40 top-10 h-[330px] w-[330px] rounded-full border-2 border-[#C8DEFF]/60" />

      <div className="pointer-events-none absolute -bottom-36 -left-24 h-[350px] w-[350px] rounded-full bg-white/50" />

      <div className="pointer-events-none absolute -bottom-40 -right-24 h-[430px] w-[430px] rounded-full border-[70px] border-[#C5DFFF]/50" />


      {/* =====================================================
          CONTEÚDO
      ====================================================== */}

      <div
        className="
          relative
          z-10
          mx-auto
          max-w-[1400px]
          px-5
          py-6
          md:px-6
        "
      >

        {/* =================================================
            CABEÇALHO
        ================================================== */}

        <section className="mb-5">
          <div
            className="
              flex
              flex-col
              gap-4
              lg:flex-row
              lg:items-end
              lg:justify-between
            "
          >

            <div>

              
              <h1
                className="
                  mt-2
                  text-3xl
                  font-bold
                  text-[#0B1756]
                  lg:text-4xl
                "
              >
                Encontre uma unidade de saúde
              </h1>

              <p
                className="
                  mt-1
                  text-sm
                  text-slate-500
                  md:text-base
                "
              >
                Consulte UBSs, hospitais, urgência e serviços especializados da rede pública.
              </p>

            </div>


            <div
              className="
                w-fit
                rounded-xl
                border
                border-white
                bg-white/80
                px-4
                py-2
                shadow-sm
                backdrop-blur
              "
            >
              <span
                className="
                  text-lg
                  font-bold
                  text-[#023E8A]
                "
              >
                {UNIDADES.length}
              </span>

              <span
                className="
                  ml-1
                  text-sm
                  text-slate-500
                "
              >
                unidades cadastradas
              </span>
            </div>

          </div>
        </section>


        {/* =================================================
            PESQUISA PRINCIPAL
        ================================================== */}

        <section
          className="
            rounded-2xl
            border
            border-white/80
            bg-white/90
            p-4
            shadow-[0_8px_30px_rgba(2,62,138,0.06)]
            backdrop-blur
          "
        >

          <div
            className="
              flex
              flex-col
              gap-3
              lg:flex-row
              lg:items-center
            "
          >

            {/* PESQUISA */}

            <div className="relative flex-1">

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
                type="search"
                value={pesquisa}
                onChange={(e) =>
                  setPesquisa(e.target.value)
                }
                placeholder="Pesquise por unidade, bairro, endereço ou serviço..."
                className="
                  h-11
                  w-full
                  rounded-xl
                  border
                  border-slate-200
                  bg-[#F8FAFD]
                  pl-11
                  pr-10
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

              {pesquisa && (
                <button
                  type="button"
                  onClick={() =>
                    setPesquisa("")
                  }
                  className="
                    absolute
                    right-3
                    top-1/2
                    -translate-y-1/2
                    text-slate-400
                    hover:text-[#023E8A]
                  "
                >
                  <X size={17} />
                </button>
              )}

            </div>


            {/* BAIRRO */}

            <select
              value={bairro}
              onChange={(e) =>
                setBairro(e.target.value)
              }
              className="
                h-11
                min-w-[190px]
                rounded-xl
                border
                border-slate-200
                bg-white
                px-4
                text-sm
                text-[#0B1756]
                outline-none
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


            {/* MAPA */}

            <button
              type="button"
              onClick={abrirMapaGeral}
              className="
                flex
                h-11
                items-center
                justify-center
                gap-2
                rounded-xl
                bg-[#023E8A]
                px-5
                text-sm
                font-semibold
                text-white
                transition
                hover:bg-[#0B1756]
              "
            >
              <Map size={17} />

              Ver mapa
            </button>

          </div>


          {/* =================================================
              TIPOS
          ================================================== */}

          <div
            className="
              mt-3
              flex
              flex-wrap
              gap-2
            "
          >
            {TIPOS.map((item) => {

              const quantidade =
                quantidadeTipo(item);

              return (
                <button
                  key={item}
                  type="button"
                  onClick={() =>
                    setTipo(item)
                  }
                  className={`
                    rounded-lg
                    px-4
                    py-2
                    text-sm
                    font-medium
                    transition

                    ${
                      tipo === item
                        ? `
                          bg-[#023E8A]
                          text-white
                          shadow-sm
                        `
                        : `
                          border
                          border-slate-200
                          bg-white
                          text-slate-600
                          hover:border-[#3563A7]
                          hover:text-[#023E8A]
                        `
                    }
                  `}
                >
                  {item === "Todos"
                    ? "Todas"
                    : item}

                  <span className="ml-2 opacity-70">
                    {quantidade}
                  </span>
                </button>
              );

            })}
          </div>

        </section>


        {/* =================================================
            RESULTADOS
        ================================================== */}

        <div
          className="
            mt-5
            flex
            items-center
            justify-between
          "
        >

          <p
            className="
              text-sm
              font-medium
              text-slate-500
            "
          >
            <span
              className="
                font-bold
                text-[#0B1756]
              "
            >
              {unidadesFiltradas.length}
            </span>

            {" "}

            {unidadesFiltradas.length === 1
              ? "unidade encontrada"
              : "unidades encontradas"}
          </p>

        </div>


        {/* =================================================
            CATEGORIAS
        ================================================== */}

        <div className="mt-5 space-y-8">

          {CATEGORIAS.map((categoria) => {

            const unidadesCategoria =
              unidadesFiltradas.filter(
                (unidade) =>
                  unidade.tipo === categoria
              );

            if (
              unidadesCategoria.length === 0
            ) {
              return null;
            }

            const expandida =
              categoriasAbertas.includes(
                categoria
              );

            const unidadesVisiveis =
              expandida
                ? unidadesCategoria
                : unidadesCategoria.slice(
                    0,
                    3
                  );


            return (
              <section key={categoria}>

                {/* =========================================
                    CABEÇALHO DA CATEGORIA
                ========================================= */}

                <div
                  className="
                    mb-3
                    flex
                    items-end
                    justify-between
                    gap-4
                  "
                >

                  <div>

                    <h2
                      className="
                        text-xl
                        font-bold
                        text-[#0B1756]
                      "
                    >
                      {categoria}
                    </h2>

                    <p
                      className="
                        mt-0.5
                        text-xs
                        text-slate-500
                      "
                    >
                      {unidadesCategoria.length}

                      {" "}

                      {unidadesCategoria.length === 1
                        ? "unidade"
                        : "unidades"}
                    </p>

                  </div>


                  {unidadesCategoria.length > 3 && (
                    <button
                      type="button"
                      onClick={() =>
                        alternarCategoria(
                          categoria
                        )
                      }
                      className="
                        flex
                        items-center
                        gap-1
                        text-sm
                        font-semibold
                        text-[#023E8A]
                        transition
                        hover:text-[#0B1756]
                      "
                    >
                      {expandida
                        ? "Mostrar menos"
                        : "Ver todas"}

                      <ChevronRight
                        size={16}
                        className={
                          expandida
                            ? "rotate-90 transition"
                            : "transition"
                        }
                      />
                    </button>
                  )}

                </div>


                {/* =========================================
                    CARDS
                ========================================= */}

                <div
                  className="
                    grid
                    gap-4
                    md:grid-cols-2
                    xl:grid-cols-3
                  "
                >

                  {unidadesVisiveis.map(
                    (unidade) => (

                      <article
                        key={unidade.id}
                        className="
                          group
                          rounded-2xl
                          border
                          border-white/80
                          bg-white/90
                          p-4
                          shadow-[0_6px_25px_rgba(2,62,138,0.05)]
                          backdrop-blur
                          transition-all
                          duration-300
                          hover:-translate-y-0.5
                          hover:shadow-[0_12px_35px_rgba(2,62,138,0.10)]
                        "
                      >

                        {/* ===============================
                            TOPO
                        =============================== */}

                        <div
                          className="
                            flex
                            items-start
                            justify-between
                            gap-3
                          "
                        >

                          <div
                            className="
                              flex
                              min-w-0
                              gap-3
                            "
                          >

                            <div
                              className="
                                flex
                                h-10
                                w-10
                                shrink-0
                                items-center
                                justify-center
                                rounded-xl
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


                            <div className="min-w-0">

                              <span
                                className="
                                  text-[10px]
                                  font-bold
                                  uppercase
                                  tracking-wider
                                  text-[#3563A7]
                                "
                              >
                                {unidade.tipo}
                              </span>

                              <h3
                                className="
                                  mt-1
                                  line-clamp-2
                                  text-base
                                  font-bold
                                  leading-snug
                                  text-[#0B1756]
                                "
                              >
                                {unidade.nome}
                              </h3>

                            </div>

                          </div>


                          {/* STATUS */}

                          {unidade.atendimento24h && (
                            <span
                              className="
                                shrink-0
                                rounded-full
                                bg-emerald-50
                                px-2.5
                                py-1
                                text-[10px]
                                font-semibold
                                text-emerald-700
                              "
                            >
                              24h
                            </span>
                          )}

                        </div>


                        {/* ===============================
                            INFORMAÇÕES
                        =============================== */}

                        <div
                          className="
                            mt-4
                            space-y-2
                            text-sm
                            text-slate-500
                          "
                        >

                          <div
                            className="
                              flex
                              items-center
                              gap-2
                            "
                          >
                            <MapPin
                              size={15}
                              className="
                                shrink-0
                                text-[#3563A7]
                              "
                            />

                            <span>
                              {unidade.bairro}
                            </span>
                          </div>


                          <div
                            className="
                              flex
                              items-start
                              gap-2
                            "
                          >
                            <Clock
                              size={15}
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

                        </div>


                        {/* ===============================
                            SERVIÇOS
                        =============================== */}

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
                            .map(
                              (servico) => (

                                <span
                                  key={servico}
                                  className="
                                    rounded-md
                                    bg-[#EAF3F7]
                                    px-2
                                    py-1
                                    text-[11px]
                                    font-medium
                                    text-[#023E8A]
                                  "
                                >
                                  {servico}
                                </span>

                              )
                            )}

                        </div>


                        {/* ===============================
                            BOTÕES
                        =============================== */}

                        <div
                          className="
                            mt-4
                            flex
                            gap-2
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
                              flex-1
                              items-center
                              justify-center
                              gap-1
                              rounded-lg
                              bg-[#023E8A]
                              px-3
                              py-2
                              text-sm
                              font-semibold
                              text-white
                              transition
                              hover:bg-[#0B1756]
                            "
                          >
                            Detalhes

                            <ChevronRight
                              size={15}
                            />
                          </button>


                          <button
                            type="button"
                            onClick={() =>
                              abrirMapa(
                                unidade
                              )
                            }
                            title="Como chegar"
                            className="
                              flex
                              items-center
                              justify-center
                              rounded-lg
                              border
                              border-[#023E8A]
                              px-3
                              text-[#023E8A]
                              transition
                              hover:bg-[#EAF3F7]
                            "
                          >
                            <Navigation
                              size={16}
                            />
                          </button>

                        </div>

                      </article>

                    )
                  )}

                </div>

              </section>
            );

          })}

        </div>


        {/* =================================================
            SEM RESULTADOS
        ================================================== */}

        {unidadesFiltradas.length === 0 && (
          <div
            className="
              mt-8
              rounded-2xl
              bg-white/90
              px-6
              py-12
              text-center
              shadow-sm
            "
          >

            <div
              className="
                mx-auto
                flex
                h-14
                w-14
                items-center
                justify-center
                rounded-2xl
                bg-[#EAF3F7]
              "
            >
              <Search
                size={26}
                className="
                  text-[#3563A7]
                "
              />
            </div>

            <h3
              className="
                mt-4
                text-lg
                font-bold
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
              Tente pesquisar outro nome, bairro ou serviço.
            </p>

          </div>
        )}

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
              "
            >
              <X size={20} />
            </button>


            {/* ÍCONE */}

            <div
              className="
                flex
                h-12
                w-12
                items-center
                justify-center
                rounded-xl
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
                mt-4
                text-xs
                font-bold
                uppercase
                tracking-wider
                text-[#3563A7]
              "
            >
              {unidadeSelecionada.tipo}
            </p>


            {/* NOME */}

            <h2
              className="
                mt-1
                pr-12
                text-2xl
                font-bold
                text-[#0B1756]
              "
            >
              {unidadeSelecionada.nome}
            </h2>


            {/* DESCRIÇÃO */}

            <p
              className="
                mt-3
                text-sm
                leading-relaxed
                text-slate-600
              "
            >
              {unidadeSelecionada.descricao}
            </p>


            {/* =================================================
                INFORMAÇÕES
            ================================================== */}

            <div
              className="
                mt-6
                grid
                gap-4
                rounded-2xl
                bg-[#F8FAFD]
                p-5
                md:grid-cols-2
              "
            >

              {/* ENDEREÇO */}

              <div
                className="
                  flex
                  gap-3
                "
              >
                <MapPin
                  size={18}
                  className="
                    mt-0.5
                    shrink-0
                    text-[#023E8A]
                  "
                />

                <div>

                  <p
                    className="
                      text-xs
                      font-semibold
                      uppercase
                      tracking-wide
                      text-slate-400
                    "
                  >
                    Endereço
                  </p>

                  <p
                    className="
                      mt-1
                      text-sm
                      text-[#0B1756]
                    "
                  >
                    {unidadeSelecionada.endereco}
                  </p>

                  <p
                    className="
                      text-sm
                      text-slate-500
                    "
                  >
                    {unidadeSelecionada.bairro}
                  </p>

                </div>
              </div>


              {/* HORÁRIO */}

              <div
                className="
                  flex
                  gap-3
                "
              >
                <Clock
                  size={18}
                  className="
                    mt-0.5
                    shrink-0
                    text-[#023E8A]
                  "
                />

                <div>

                  <p
                    className="
                      text-xs
                      font-semibold
                      uppercase
                      tracking-wide
                      text-slate-400
                    "
                  >
                    Funcionamento
                  </p>

                  <p
                    className="
                      mt-1
                      text-sm
                      text-[#0B1756]
                    "
                  >
                    {unidadeSelecionada.horario}
                  </p>

                </div>
              </div>


              {/* TELEFONE */}

              <div
                className="
                  flex
                  gap-3
                "
              >
                <Phone
                  size={18}
                  className="
                    mt-0.5
                    shrink-0
                    text-[#023E8A]
                  "
                />

                <div>

                  <p
                    className="
                      text-xs
                      font-semibold
                      uppercase
                      tracking-wide
                      text-slate-400
                    "
                  >
                    Telefone
                  </p>

                  <p
                    className="
                      mt-1
                      text-sm
                      text-[#0B1756]
                    "
                  >
                    {unidadeSelecionada.telefone}
                  </p>

                </div>
              </div>


              {/* STATUS */}

              <div
                className="
                  flex
                  gap-3
                "
              >
                <Hospital
                  size={18}
                  className="
                    mt-0.5
                    shrink-0
                    text-[#023E8A]
                  "
                />

                <div>

                  <p
                    className="
                      text-xs
                      font-semibold
                      uppercase
                      tracking-wide
                      text-slate-400
                    "
                  >
                    Atendimento
                  </p>

                  <p
                    className="
                      mt-1
                      text-sm
                      font-medium
                      text-emerald-700
                    "
                  >
                    {unidadeSelecionada.atendimento24h
                      ? "Atendimento 24 horas"
                      : "Em funcionamento"}
                  </p>

                </div>
              </div>

            </div>


            {/* =================================================
                SERVIÇOS
            ================================================== */}

            <div className="mt-6">

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
                        rounded-lg
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


            {/* =================================================
                BOTÕES
            ================================================== */}

            <div
              className="
                mt-7
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

                Ligar
              </a>


              <button
                type="button"
                onClick={abrirMapaGeral}
                className="
                  flex
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                  border
                  border-slate-200
                  px-4
                  py-3
                  font-medium
                  text-slate-600
                  transition
                  hover:bg-slate-50
                "
              >
                <ExternalLink size={18} />

                Mapa geral
              </button>

            </div>

          </div>

        </div>

      )}

    </main>
  );
}