"use client";

import { useMemo, useState } from "react";

// ======================================================
// DADOS DEMONSTRATIVOS
// ======================================================

const ITENS_POR_PAGINA = 6;

const unidadesIniciais = [
  {
    id: 1,
    nome: "UPA Bangu",
    endereco: "Rua Avaré, 107 — Vila São Pedro",
    pacientes: 42,
    espera: 35,
    status: "Ativa",
  },
  {
    id: 2,
    nome: "UBS Vila Aliança",
    endereco: "Rua do Governo, 450 — Bangu",
    pacientes: 28,
    espera: 22,
    status: "Ativa",
  },
  {
    id: 3,
    nome: "UPA Realengo",
    endereco: "Av. Brasil, 28000 — Realengo",
    pacientes: 35,
    espera: 48,
    status: "Ativa",
  },
  {
    id: 4,
    nome: "UBS Jardim das Flores",
    endereco: "Rua das Flores, 120 — Centro",
    pacientes: 23,
    espera: 18,
    status: "Ativa",
  },
];

const especialidadesIniciais = [
  { id: 1, nome: "Clínico geral", atendimentos: 185, status: "Ativa" },
  { id: 2, nome: "Pediatria", atendimentos: 126, status: "Ativa" },
  { id: 3, nome: "Ginecologia", atendimentos: 84, status: "Ativa" },
  { id: 4, nome: "Odontologia", atendimentos: 62, status: "Ativa" },
  { id: 5, nome: "Ortopedia", atendimentos: 29, status: "Ativa" },
];

const historicoInicial = [
  {
    id: 1,
    senha: "A-084",
    unidade: "UPA Bangu",
    especialidade: "Clínico geral",
    entrada: "08:15",
    saida: "09:02",
    status: "Concluído",
  },
  {
    id: 2,
    senha: "B-021",
    unidade: "UBS Vila Aliança",
    especialidade: "Pediatria",
    entrada: "08:30",
    saida: "09:10",
    status: "Concluído",
  },
  {
    id: 3,
    senha: "A-085",
    unidade: "UPA Realengo",
    especialidade: "Ortopedia",
    entrada: "09:05",
    saida: "—",
    status: "Aguardando",
  },
  {
    id: 4,
    senha: "C-014",
    unidade: "UPA Bangu",
    especialidade: "Ginecologia",
    entrada: "09:20",
    saida: "—",
    status: "Aguardando",
  },
  {
    id: 5,
    senha: "B-022",
    unidade: "UBS Jardim das Flores",
    especialidade: "Clínico geral",
    entrada: "09:35",
    saida: "10:12",
    status: "Concluído",
  },
  {
    id: 6,
    senha: "A-086",
    unidade: "UPA Realengo",
    especialidade: "Pediatria",
    entrada: "10:00",
    saida: "—",
    status: "Cancelado",
  },
];

const demandaSemanal = [
  { dia: "Seg", quantidade: 72 },
  { dia: "Ter", quantidade: 95 },
  { dia: "Qua", quantidade: 83 },
  { dia: "Qui", quantidade: 110 },
  { dia: "Sex", quantidade: 96 },
  { dia: "Sáb", quantidade: 65 },
  { dia: "Dom", quantidade: 48 },
];

// ======================================================
// COMPONENTES AUXILIARES
// ======================================================

function Indicador({ titulo, valor, descricao, variacao }) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_5px_20px_rgba(31,65,119,0.04)]">
      <div>
        <p className="text-sm font-normal text-slate-600">{titulo}</p>

        <h3 className="mt-2 text-3xl font-bold tracking-tight text-[#0B1756]">
          {valor}
        </h3>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-1.5 text-xs">
        {variacao && (
          <span className="font-semibold text-[#168052]">{variacao}</span>
        )}

        <span className="text-sm text-slate-500">{descricao}</span>
      </div>
    </article>
  );
}

function StatusBadge({ status }) {
  const estilos = {
    Ativa: "bg-green-50 text-green-700",
    Inativa: "bg-slate-100 text-slate-600",
    Concluído: "bg-green-50 text-green-700",
    Aguardando: "bg-blue-50 text-blue-700",
    Cancelado: "bg-red-50 text-red-700",
  };

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1.5 text-xs font-semibold ${
        estilos[status] || "bg-slate-100 text-slate-600"
      }`}
    >
      {status}
    </span>
  );
}

function SecaoTitulo({ titulo, descricao }) {
  return (
    <div className="mb-5">
      <h2 className="text-2xl font-bold text-[#0B1756]">{titulo}</h2>

      {descricao && (
        <p className="mt-1 text-base text-slate-400">{descricao}</p>
      )}
    </div>
  );
}

// ======================================================
// MODAL DE CADASTRO E EDIÇÃO
// ======================================================

function ModalCadastro({ tipo, item, onFechar, onSalvar }) {
  const [nome, setNome] = useState(item?.nome || "");
  const [endereco, setEndereco] = useState(item?.endereco || "");

  const ehUnidade = tipo === "unidade";

  function enviar(e) {
    e.preventDefault();

    if (!nome.trim()) return;

    onSalvar({
      ...item,
      nome: nome.trim(),
      ...(ehUnidade ? { endereco: endereco.trim() } : {}),
    });
  }

  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center bg-[#071638]/55 p-4 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) onFechar();
      }}
    >
      <form
        onSubmit={enviar}
        className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
      >
        <div className="mb-5 flex items-start justify-between gap-3">
          <div>
            <span className="rounded-full bg-[#EAF3F7] px-3 py-1 text-xs font-semibold text-[#3563A7]">
              Gerenciamento
            </span>

            <h2 className="mt-3 text-xl font-bold text-[#0B1756]">
              {item ? "Editar" : "Cadastrar"}{" "}
              {ehUnidade ? "unidade" : "especialidade"}
            </h2>

            <p className="mt-1 text-sm font-normal text-slate-600">
              Preencha as informações abaixo.
            </p>
          </div>

          <button
            type="button"
            onClick={onFechar}
            className="rounded-lg px-3 py-2 text-sm font-semibold text-slate-500 transition hover:bg-[#EAF3F7]"
            aria-label="Fechar"
          >
            Fechar
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="mb-2 block text-xs font-semibold text-[#0B1756]">
              {ehUnidade ? "Nome da unidade" : "Nome da especialidade"}
            </label>

            <input
              autoFocus
              required
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder={
                ehUnidade ? "Ex.: UPA Central" : "Ex.: Cardiologia"
              }
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-[#0B1756] outline-none transition placeholder:text-slate-400 focus:border-[#023E8A] focus:ring-4 focus:ring-[#3563A7]/10"
            />
          </div>

          {ehUnidade && (
            <div>
              <label className="mb-2 block text-xs font-semibold text-[#0B1756]">
                Endereço
              </label>

              <input
                required
                value={endereco}
                onChange={(e) => setEndereco(e.target.value)}
                placeholder="Rua, número e bairro"
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-[#0B1756] outline-none transition placeholder:text-slate-400 focus:border-[#023E8A] focus:ring-4 focus:ring-[#3563A7]/10"
              />
            </div>
          )}
        </div>

        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row">
          <button
            type="button"
            onClick={onFechar}
            className="flex-1 rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-[#0B1756] transition hover:bg-[#EAF3F7]"
          >
            Cancelar
          </button>

          <button
            type="submit"
            className="flex-1 rounded-xl bg-[#3563A7] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#023E8A]"
          >
            Salvar
          </button>
        </div>
      </form>
    </div>
  );
}

// ======================================================
// PÁGINA ADMINISTRATIVA
// ======================================================

export default function FilaOnlineAdminPage() {
  const [unidades, setUnidades] = useState(unidadesIniciais);
  const [especialidades, setEspecialidades] = useState(especialidadesIniciais);
  const [historico] = useState(historicoInicial);

  const [aba, setAba] = useState("visao-geral");

  const [buscaUnidade, setBuscaUnidade] = useState("");
  const [buscaEspecialidade, setBuscaEspecialidade] = useState("");

  const [filtroStatusUnidade, setFiltroStatusUnidade] = useState("Todos");
  const [filtroHistorico, setFiltroHistorico] = useState("Todos");

  const [paginaUnidades, setPaginaUnidades] = useState(1);

  const [modal, setModal] = useState(null);

  // ======================================================
  // INDICADORES
  // ======================================================

  const totalPacientes = unidades.reduce(
    (total, unidade) => total + unidade.pacientes,
    0
  );

  const unidadesAtivas = unidades.filter(
    (unidade) => unidade.status === "Ativa"
  ).length;

  const totalAtendimentos = especialidades.reduce(
    (total, especialidade) => total + especialidade.atendimentos,
    0
  );

  // ======================================================
  // FILTROS E PAGINAÇÃO
  // ======================================================

  const historicoFiltrado = useMemo(() => {
    return historico.filter((registro) => {
      return (
        filtroHistorico === "Todos" ||
        registro.status === filtroHistorico
      );
    });
  }, [historico, filtroHistorico]);

  const unidadesFiltradas = unidades.filter((unidade) => {
    const correspondeBusca = `${unidade.nome} ${unidade.endereco}`
      .toLowerCase()
      .includes(buscaUnidade.toLowerCase());

    const correspondeStatus =
      filtroStatusUnidade === "Todos" ||
      unidade.status === filtroStatusUnidade;

    return correspondeBusca && correspondeStatus;
  });

  const totalPaginas = Math.max(
    1,
    Math.ceil(unidadesFiltradas.length / ITENS_POR_PAGINA)
  );

  const unidadesPaginadas = unidadesFiltradas.slice(
    (paginaUnidades - 1) * ITENS_POR_PAGINA,
    paginaUnidades * ITENS_POR_PAGINA
  );

  const especialidadesFiltradas = especialidades.filter((item) =>
    item.nome.toLowerCase().includes(buscaEspecialidade.toLowerCase())
  );

  // ======================================================
  // CADASTRO E EDIÇÃO
  // ======================================================

  function salvarUnidade(dados) {
    if (dados.id) {
      setUnidades((atuais) =>
        atuais.map((item) =>
          item.id === dados.id ? { ...item, ...dados } : item
        )
      );
    } else {
      setUnidades((atuais) => [
        ...atuais,
        {
          ...dados,
          id: Date.now(),
          pacientes: 0,
          espera: 0,
          status: "Ativa",
        },
      ]);
    }

    setPaginaUnidades(1);
    setModal(null);
  }

  function salvarEspecialidade(dados) {
    if (dados.id) {
      setEspecialidades((atuais) =>
        atuais.map((item) =>
          item.id === dados.id ? { ...item, ...dados } : item
        )
      );
    } else {
      setEspecialidades((atuais) => [
        ...atuais,
        {
          ...dados,
          id: Date.now(),
          atendimentos: 0,
          status: "Ativa",
        },
      ]);
    }

    setModal(null);
  }

  // ======================================================
  // ALTERAÇÃO DE STATUS
  // ======================================================

  function alternarStatusUnidade(id) {
    setUnidades((atuais) =>
      atuais.map((item) =>
        item.id === id
          ? {
              ...item,
              status: item.status === "Ativa" ? "Inativa" : "Ativa",
            }
          : item
      )
    );

    setPaginaUnidades(1);
  }

  function alternarStatusEspecialidade(id) {
    setEspecialidades((atuais) =>
      atuais.map((item) =>
        item.id === id
          ? {
              ...item,
              status: item.status === "Ativa" ? "Inativa" : "Ativa",
            }
          : item
      )
    );
  }

  // ======================================================
  // NAVEGAÇÃO
  // ======================================================

  const abas = [
    { id: "visao-geral", nome: "Visão geral" },
    { id: "historico", nome: "Histórico" },
    { id: "unidades", nome: "Unidades" },
    { id: "especialidades", nome: "Especialidades" },
  ];

  const descricoesAbas = {
    "visao-geral": "Indicadores e panorama",
    historico: "Acompanhamento dos registros",
    unidades: "Gerenciamento das unidades",
    especialidades: "Tipos de atendimento",
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#EEF5F9] font-sans text-[#0B1756]">
      {/* ELEMENTOS DECORATIVOS DE FUNDO */}

      <div className="pointer-events-none absolute -right-28 -top-36 h-[430px] w-[430px] rounded-full bg-[#B8D6FC]/40" />

      <div className="pointer-events-none absolute -left-40 top-10 h-[330px] w-[330px] rounded-full border-2 border-[#C8DEFF]/50" />

      <main className="relative z-10 mx-auto w-full max-w-[1480px] space-y-6 px-4 pb-12 pt-8 sm:px-6 xl:px-8">

        {/* ==================================================
            CABEÇALHO E NAVEGAÇÃO
        ================================================== */}

        <div className="relative mb-14">
          <div className="relative min-h-[230px] overflow-hidden rounded-[30px] bg-gradient-to-br from-[#023E8A] via-[#084B9A] to-[#0B1756] px-7 py-10 shadow-[0_22px_60px_rgba(2,62,138,0.18)] sm:px-10 sm:py-12">

            <div className="pointer-events-none absolute -right-24 -top-32 h-80 w-80 rounded-full bg-white/10" />
            <div className="pointer-events-none absolute -bottom-28 right-[30%] h-64 w-64 rounded-full border-[45px] border-white/[0.04]" />

            <div className="relative z-10 flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h1 className="text-3xl font-bold tracking-tight text-white sm:text-[40px]">
                  Fila Online
                </h1>

                <p className="mt-3 max-w-3xl text-sm font-normal leading-6 text-white/85 sm:text-base">
                  Acompanhe a demanda, os indicadores e o funcionamento das
                  unidades de saúde.
                </p>
              </div>
            </div>
          </div>

          {/* CARDS DE NAVEGAÇÃO */}

          <div className="absolute -bottom-8 left-5 right-5 z-20 grid grid-cols-2 gap-3 sm:left-6 sm:right-6 lg:grid-cols-4">
            {abas.map((item) => {
              const selecionada = aba === item.id;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setAba(item.id)}
                  className={`flex min-h-[90px] flex-col justify-center rounded-2xl border bg-white px-4 py-4 text-left shadow-md transition hover:-translate-y-1 hover:shadow-lg sm:px-5 ${
                    selecionada
                      ? "border-[#3563A7] ring-1 ring-[#3563A7]/20"
                      : "border-slate-200"
                  }`}
                >
                  <span className="text-base font-bold text-[#0B1756]">
                    {item.nome}
                  </span>

                  <span className="mt-2 text-sm font-normal text-[#3563A7]">
                    {descricoesAbas[item.id]}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ==================================================
            VISÃO GERAL
        ================================================== */}

        {aba === "visao-geral" && (
          <div className="space-y-6">

            {/* INDICADORES */}

            <section>
              <div className="mb-4">
                <h2 className="mt-15 text-4xl font-bold text-[#0B1756]">
                  Resumo geral
                </h2>

                <p className="mb-5 mt-1 text-base font-normal text-slate-600">
                  Indicadores gerais das filas de atendimento.
                </p>
              </div>

              <div className="grid grid-cols-2 overflow-hidden rounded-2xl border border-[#3563A7]/30 bg-gradient-to-r from-[#244D91] via-[#3563A7] to-[#0B1756] shadow-md lg:grid-cols-4">

                <div className="border-b border-r border-white/20 px-5 py-5 lg:border-b-0 lg:px-6">
                  <p className="text-base font-semibold text-white">
                    Pacientes aguardando
                  </p>

                  <p className="mt-1 text-4xl font-bold text-white">
                    {totalPacientes}
                  </p>

                  <p className="mt-1 text-sm text-white/75">
                    Nas unidades cadastradas
                  </p>
                </div>

                <div className="border-b border-white/20 px-5 py-5 lg:border-b-0 lg:border-r lg:px-6">
                  <p className="text-base font-semibold text-white">
                    Unidades ativas
                  </p>

                  <p className="mt-1 text-4xl font-bold text-white">
                    {unidadesAtivas}/{unidades.length}
                  </p>

                  <p className="mt-1 text-sm text-white/75">
                    Unidades em funcionamento
                  </p>
                </div>

                <div className="border-r border-white/20 px-5 py-5 lg:px-6">
                  <p className="text-base font-semibold text-white">
                    Espera média
                  </p>

                  <p className="mt-1 text-4xl font-bold text-white">
                    32 min
                  </p>

                  <p className="mt-1 text-sm text-white/75">
                    Estimativa geral das unidades
                  </p>
                </div>

                <div className="px-5 py-5 lg:px-6">
                  <p className="text-base font-semibold text-white">
                    Atendimentos hoje
                  </p>

                  <p className="mt-1 text-4xl font-bold text-white">
                    486
                  </p>

                  <p className="mt-1 text-sm font-semibold text-white/90">
                    +8,5%{" "}
                    <span className="font-normal text-white/75">
                      Total registrado no dia
                    </span>
                  </p>
                </div>

              </div>
            </section>

            {/* DEMANDA E ESPECIALIDADES */}

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.25fr_1fr]">

              {/* PACIENTES POR UNIDADE */}

              <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_5px_20px_rgba(31,65,119,0.04)] sm:p-6">
                <SecaoTitulo
                  titulo="Pacientes por unidade"
                  descricao="Quantidade de pessoas aguardando atendimento."
                />

                <div className="space-y-5">
                  {[...unidades]
                    .sort((a, b) => b.pacientes - a.pacientes)
                    .map((unidade) => {
                      const maior = Math.max(
                        ...unidades.map((item) => item.pacientes),
                        1
                      );

                      return (
                        <div key={unidade.id}>
                          <div className="mb-2 flex items-center justify-between gap-3">
                            <div className="min-w-0">
                              <p className="truncate text-base font-semibold text-[#0B1756]">
                                {unidade.nome}
                              </p>

                              <p className="mt-0.5 text-xs font-normal text-slate-500">
                                Espera estimada: {unidade.espera} minutos
                              </p>
                            </div>

                            <span className="shrink-0 text-sm font-semibold text-[#3563A7]">
                              {unidade.pacientes} pacientes
                            </span>
                          </div>

                          <div className="h-2.5 overflow-hidden rounded-full bg-[#EAF3F7]">
                            <div
                              className="h-full rounded-full bg-[#3563A7] transition-all"
                              style={{
                                width: `${(unidade.pacientes / maior) * 100}%`,
                              }}
                            />
                          </div>
                        </div>
                      );
                    })}
                </div>
              </section>

              {/* ATENDIMENTOS POR ESPECIALIDADE */}

              <section className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
                <SecaoTitulo
                  titulo="Atendimentos por especialidade"
                  descricao="Distribuição da procura por atendimento."
                />

                <div className="space-y-4">
                  {especialidades
                    .slice()
                    .sort((a, b) => b.atendimentos - a.atendimentos)
                    .map((item) => {
                      const maior = Math.max(
                        ...especialidades.map((esp) => esp.atendimentos),
                        1
                      );

                      return (
                        <div key={item.id}>
                          <div className="mb-1.5 flex items-center justify-between gap-3">
                            <span className="text-sm font-normal text-slate-600">
                              {item.nome}
                            </span>

                            <span className="text-sm font-semibold text-[#3563A7]">
                              {item.atendimentos}
                            </span>
                          </div>

                          <div className="h-2 overflow-hidden rounded-full bg-[#EAF3F7]">
                            <div
                              className="h-full rounded-full bg-[#3563A7]"
                              style={{
                                width: `${(item.atendimentos / maior) * 100}%`,
                              }}
                            />
                          </div>
                        </div>
                      );
                    })}
                </div>

                <div className="mt-5 rounded-xl bg-[#EAF3F7] p-3.5">
                  <p className="text-xs font-normal text-slate-600">
                    Total de atendimentos registrados
                  </p>

                  <p className="mt-1 text-2xl font-bold text-[#023E8A]">
                    {totalAtendimentos}
                  </p>
                </div>
              </section>
            </div>

            {/* GRÁFICO SEMANAL */}

            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_5px_20px_rgba(31,65,119,0.04)] sm:p-6">
              <SecaoTitulo
                titulo="Demanda semanal"
                descricao="Quantidade de atendimentos registrados ao longo da semana."
              />

              <div className="flex h-[220px] items-end justify-around gap-3 border-b border-slate-200 pb-2 sm:gap-6">
                {demandaSemanal.map((item) => {
                  const maior = Math.max(
                    ...demandaSemanal.map((dia) => dia.quantidade)
                  );

                  return (
                    <div
                      key={item.dia}
                      className="flex h-full flex-1 flex-col items-center justify-end gap-2"
                    >
                      <span className="text-xs font-semibold text-[#3563A7]">
                        {item.quantidade}
                      </span>

                      <div
                        className="w-full max-w-[54px] rounded-t-lg bg-[#3563A7] transition-all hover:bg-[#023E8A]"
                        style={{
                          height: `${(item.quantidade / maior) * 75}%`,
                          minHeight: "8px",
                        }}
                      />

                      <span className="text-xs font-normal text-slate-500">
                        {item.dia}
                      </span>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* UNIDADES COM MAIOR DEMANDA */}

            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_5px_20px_rgba(31,65,119,0.04)] sm:p-6">
              <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <SecaoTitulo
                  titulo="Unidades com maior demanda"
                  descricao="Unidades com maior número de pacientes aguardando."
                />

                <button
                  type="button"
                  onClick={() => {
                    setAba("unidades");
                    window.scrollTo({
                      top: 0,
                      behavior: "smooth",
                    });
                  }}
                  className="self-start text-sm font-semibold text-[#3563A7] transition hover:text-[#023E8A]"
                >
                  Ver todas as unidades →
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[600px] border-collapse text-left text-sm">
                  <thead className="bg-[#EAF3F7] text-xs uppercase text-slate-600">
                    <tr>
                      <th className="px-4 py-3 font-semibold">Unidade</th>
                      <th className="px-4 py-3 font-semibold">Pacientes</th>
                      <th className="px-4 py-3 font-semibold">Espera média</th>
                      <th className="px-4 py-3 font-semibold">Situação</th>
                    </tr>
                  </thead>

                  <tbody>
                    {[...unidades]
                      .sort((a, b) => b.pacientes - a.pacientes)
                      .slice(0, 4)
                      .map((unidade) => (
                        <tr
                          key={unidade.id}
                          className="border-b border-slate-100 last:border-0"
                        >
                          <td className="px-4 py-4">
                            <p className="text-base font-semibold text-[#0B1756]">
                              {unidade.nome}
                            </p>

                            <p className="mt-1 text-sm font-normal text-slate-500">
                              {unidade.endereco}
                            </p>
                          </td>

                          <td className="px-4 py-4 text-base font-semibold text-[#3563A7]">
                            {unidade.pacientes}
                          </td>

                          <td className="px-4 py-4 text-base font-normal text-slate-600">
                            {unidade.espera} min
                          </td>

                          <td className="px-4 py-4">
                            <StatusBadge status={unidade.status} />
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        )}

        {/* ==================================================
            HISTÓRICO
        ================================================== */}

        {aba === "historico" && (
          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_5px_20px_rgba(31,65,119,0.04)]">

            <div className="border-b border-slate-100 px-5 py-5 sm:px-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <SecaoTitulo
                  titulo="Histórico das filas"
                  descricao="Acompanhe os registros de entrada e saída das filas."
                />

                <select
                  value={filtroHistorico}
                  onChange={(e) => setFiltroHistorico(e.target.value)}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-normal text-[#0B1756] outline-none focus:border-[#023E8A]"
                >
                  <option value="Todos">Todos os status</option>
                  <option value="Aguardando">Aguardando</option>
                  <option value="Concluído">Concluído</option>
                  <option value="Cancelado">Cancelado</option>
                </select>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] border-collapse text-left text-sm">
                <thead className="bg-[#EAF3F7] text-xs uppercase text-slate-600">
                  <tr>
                    <th className="px-5 py-4 font-semibold">Senha</th>
                    <th className="px-5 py-4 font-semibold">Unidade</th>
                    <th className="px-5 py-4 font-semibold">Especialidade</th>
                    <th className="px-5 py-4 font-semibold">Entrada</th>
                    <th className="px-5 py-4 font-semibold">Saída</th>
                    <th className="px-5 py-4 font-semibold">Status</th>
                  </tr>
                </thead>

                <tbody>
                  {historicoFiltrado.map((registro) => (
                    <tr
                      key={registro.id}
                      className="border-b border-slate-100 last:border-0"
                    >
                      <td className="px-5 py-4">
                        <span className="rounded-lg bg-[#EAF3F7] px-3 py-1.5 text-sm font-semibold text-[#023E8A]">
                          {registro.senha}
                        </span>
                      </td>

                      <td className="px-5 py-4 text-base font-semibold text-[#0B1756]">
                        {registro.unidade}
                      </td>

                      <td className="px-5 py-4 text-base font-normal text-slate-600">
                        {registro.especialidade}
                      </td>

                      <td className="px-5 py-4 text-base font-normal text-slate-600">
                        {registro.entrada}
                      </td>

                      <td className="px-5 py-4 text-base font-normal text-slate-600">
                        {registro.saida}
                      </td>

                      <td className="px-5 py-4">
                        <StatusBadge status={registro.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {historicoFiltrado.length === 0 && (
                <div className="py-12 text-center">
                  <p className="text-sm font-semibold text-slate-600">
                    Nenhum registro encontrado.
                  </p>
                </div>
              )}
            </div>

            <div className="border-t border-slate-100 px-5 py-4">
              
            </div>
          </section>
        )}

        {/* ==================================================
            GERENCIAMENTO DE UNIDADES
        ================================================== */}

        {aba === "unidades" && (
          <section
            id="secao-unidades"
            className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_5px_20px_rgba(31,65,119,0.04)]"
          >
            {/* TÍTULO */}

            <div className="border-b border-slate-100 px-5 py-5 sm:px-6">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <SecaoTitulo
                  titulo="Unidades de saúde"
                  descricao="Cadastre, edite ou altere a situação das unidades."
                />

                <button
                  type="button"
                  onClick={() => setModal({ tipo: "unidade", item: null })}
                  className="rounded-xl bg-[#3563A7] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#023E8A]"
                >
                  + Nova unidade
                </button>
              </div>
            </div>

            {/* BARRA DE PESQUISA E FILTROS */}

            <div className="grid grid-cols-1 gap-3 border-b border-slate-100 px-5 py-4 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr] sm:px-6">
              <input
                value={buscaUnidade}
                onChange={(e) => {
                  setBuscaUnidade(e.target.value);
                  setPaginaUnidades(1);
                }}
                placeholder="Buscar unidade ou endereço..."
                className="w-full rounded-xl border border-[#C8D9EB] bg-white px-4 py-3 text-sm text-[#0B1756] outline-none transition placeholder:text-slate-400 focus:border-[#3563A7] focus:ring-2 focus:ring-[#3563A7]/10"
              />

              <FiltroSelect
  value={filtroStatusUnidade}
  onChange={(valor) => {
    setFiltroStatusUnidade(valor);
    setPaginaUnidades(1);
  }}
  placeholder="Todos os status"
  options={[
    { value: "Todos", label: "Todos os status" },
    { value: "Ativa", label: "Ativas" },
    { value: "Inativa", label: "Inativas" },
  ]}
/>
            </div>

            {/* TABELA */}

            <div className="overflow-x-auto">
              <table className="w-full min-w-[850px] border-collapse text-left text-sm">
                <thead className="bg-[#EAF3F7] text-xs uppercase text-slate-600">
                  <tr>
                    <th className="px-5 py-4 font-semibold">Unidade</th>
                    <th className="px-5 py-4 font-semibold">Pacientes</th>
                    <th className="px-5 py-4 font-semibold">Espera média</th>
                    <th className="px-5 py-4 font-semibold">Status</th>
                    <th className="px-5 py-4 text-right font-semibold">
                      Ações
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {unidadesPaginadas.map((unidade) => (
                    <tr
                      key={unidade.id}
                      className="border-b border-slate-100 transition last:border-0 hover:bg-slate-50/70"
                    >
                      <td className="px-5 py-4">
                        <p className="text-base font-semibold text-[#0B1756]">
                          {unidade.nome}
                        </p>

                        <p className="mt-1 text-sm font-normal text-slate-500">
                          {unidade.endereco}
                        </p>
                      </td>

                      <td className="px-5 py-4 text-base font-semibold text-[#3563A7]">
                        {unidade.pacientes}
                      </td>

                      <td className="px-5 py-4 text-base font-normal text-slate-600">
                        {unidade.espera} min
                      </td>

                      <td className="px-5 py-4">
                        <StatusBadge status={unidade.status} />
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              setModal({ tipo: "unidade", item: unidade })
                            }
                            className="rounded-lg border border-[#C8D9EB] px-4 py-2.5 text-sm font-semibold text-[#3563A7] transition hover:bg-[#EAF3F7]"
                          >
                            Editar
                          </button>

                          <button
                            type="button"
                            onClick={() => alternarStatusUnidade(unidade.id)}
                            className="rounded-lg border border-[#C8D9EB] px-4 py-2.5 text-sm font-semibold text-[#3563A7] transition hover:bg-[#EAF3F7]"
                          >
                            {unidade.status === "Ativa"
                              ? "Desativar"
                              : "Ativar"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* NENHUM RESULTADO */}

              {unidadesFiltradas.length === 0 && (
                <div className="py-12 text-center">
                  <p className="text-sm font-semibold text-slate-600">
                    Nenhuma unidade encontrada.
                  </p>
                </div>
              )}
            </div>

            {/* PAGINAÇÃO */}

            <div className="flex flex-col gap-4 border-t border-slate-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-slate-500">
                Mostrando{" "}
                <span className="font-semibold text-[#0B1756]">
                  {unidadesFiltradas.length === 0
                    ? 0
                    : (paginaUnidades - 1) * ITENS_POR_PAGINA + 1}
                </span>{" "}
                a{" "}
                <span className="font-semibold text-[#0B1756]">
                  {Math.min(
                    paginaUnidades * ITENS_POR_PAGINA,
                    unidadesFiltradas.length
                  )}
                </span>{" "}
                de{" "}
                <span className="font-semibold text-[#0B1756]">
                  {unidadesFiltradas.length}
                </span>{" "}
                unidades
              </p>

              <div className="flex items-center justify-end gap-3">
                <button
                  type="button"
                  disabled={paginaUnidades === 1}
                  onClick={() =>
                    setPaginaUnidades((atual) => Math.max(1, atual - 1))
                  }
                  className="rounded-lg border border-[#C8D9EB] px-4 py-2.5 text-sm font-semibold text-[#3563A7] transition hover:bg-[#EAF3F7] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Anterior
                </button>

                <span className="text-sm font-semibold text-[#0B1756]">
                  {paginaUnidades} / {totalPaginas}
                </span>

                <button
                  type="button"
                  disabled={paginaUnidades >= totalPaginas}
                  onClick={() =>
                    setPaginaUnidades((atual) =>
                      Math.min(totalPaginas, atual + 1)
                    )
                  }
                  className="rounded-lg border border-[#C8D9EB] px-4 py-2.5 text-sm font-semibold text-[#3563A7] transition hover:bg-[#EAF3F7] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Próxima
                </button>
              </div>
            </div>
          </section>
        )}

        {/* ==================================================
            GERENCIAMENTO DE ESPECIALIDADES
        ================================================== */}

        {aba === "especialidades" && (
          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_5px_20px_rgba(31,65,119,0.04)]">

            <div className="border-b border-slate-100 px-5 py-5 sm:px-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <SecaoTitulo
                  titulo="Especialidades"
                  descricao="Gerencie os tipos de atendimento disponíveis nas unidades."
                />

                <button
                  type="button"
                  onClick={() =>
                    setModal({ tipo: "especialidade", item: null })
                  }
                  className="rounded-xl bg-[#3563A7] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#023E8A]"
                >
                  + Nova especialidade
                </button>
              </div>
            </div>

            {/* PESQUISA */}

            <div className="border-b border-slate-100 px-5 py-4 sm:px-6">
              <input
                value={buscaEspecialidade}
                onChange={(e) => setBuscaEspecialidade(e.target.value)}
                placeholder="Pesquisar especialidade..."
                className="w-full max-w-md rounded-xl border border-[#C8D9EB] bg-white px-4 py-3 text-sm font-normal text-[#0B1756] outline-none transition placeholder:text-slate-400 focus:border-[#3563A7] focus:ring-2 focus:ring-[#3563A7]/10"
              />
            </div>

            {/* TABELA */}

            <div className="overflow-x-auto">
              <table className="w-full min-w-[620px] border-collapse text-left text-sm">
                <thead className="bg-[#EAF3F7] text-xs uppercase text-slate-600">
                  <tr>
                    <th className="px-5 py-4 font-semibold">Especialidade</th>
                    <th className="px-5 py-4 font-semibold">Atendimentos</th>
                    <th className="px-5 py-4 font-semibold">Status</th>
                    <th className="px-5 py-4 text-right font-semibold">
                      Ações
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {especialidadesFiltradas.map((item) => (
                    <tr
                      key={item.id}
                      className="border-b border-slate-100 last:border-0"
                    >
                      <td className="px-5 py-4">
                        <span className="text-base font-semibold text-[#0B1756]">
                          {item.nome}
                        </span>
                      </td>

                      <td className="px-5 py-4 text-base font-semibold text-[#3563A7]">
                        {item.atendimentos}
                      </td>

                      <td className="px-5 py-4">
                        <StatusBadge status={item.status} />
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              setModal({
                                tipo: "especialidade",
                                item,
                              })
                            }
                            className="rounded-lg border border-[#C8D9EB] px-4 py-2.5 text-sm font-semibold text-[#3563A7] transition hover:bg-[#EAF3F7]"
                          >
                            Editar
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              alternarStatusEspecialidade(item.id)
                            }
                            className="rounded-lg border border-[#C8D9EB] px-4 py-2.5 text-sm font-semibold text-[#3563A7] transition hover:bg-[#EAF3F7]"
                          >
                            {item.status === "Ativa"
                              ? "Desativar"
                              : "Ativar"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {especialidadesFiltradas.length === 0 && (
                <div className="py-12 text-center">
                  <p className="text-sm font-semibold text-slate-600">
                    Nenhuma especialidade encontrada.
                  </p>
                </div>
              )}
            </div>
          </section>
        )}
      </main>

      {/* MODAL */}

      {modal && (
        <ModalCadastro
          tipo={modal.tipo}
          item={modal.item}
          onFechar={() => setModal(null)}
          onSalvar={
            modal.tipo === "unidade"
              ? salvarUnidade
              : salvarEspecialidade
          }
        />
      )}
    </div>
  );
}