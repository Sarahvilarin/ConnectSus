"use client";

import { useState } from "react";
import {
  Activity,
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronDown,
  ClipboardList,
  HeartPulse,
  Info,
  ShieldCheck,
  Stethoscope,
  Smile,
  Meh,
  Frown,
} from "lucide-react";


const sintomasDisponiveis = [
  "Febre",
  "Falta de ar",
  "Tosse",
  "Náusea",
  "Dor de cabeça",
  "Dor no corpo",
];

const intensidades = [
  {
    nome: "Leve",
    descricao: "Desconforto leve",
    Icone: Smile,
  },
  {
    nome: "Moderada",
    descricao: "Desconforto moderado",
    Icone: Meh,
  },
  {
    nome: "Intensa",
    descricao: "Desconforto intenso",
    Icone: Frown,
  },
];

const condicoesSaude = [
  "Nenhuma das opções",
  "Asma",
  "Diabetes",
  "Hipertensão",
  "Doença cardíaca",
  "Outra condição",
];

const etapas = ["Sintomas", "Revisão", "Orientações"];

export default function Triagem() {
  const [sintomas, setSintomas] = useState("");
  const [inicio, setInicio] = useState("Hoje");
  const [intensidade, setIntensidade] = useState("");
  const [sintomasSelecionados, setSintomasSelecionados] = useState([]);
  const [primeiraVez, setPrimeiraVez] = useState("Sim");
  const [condicao, setCondicao] = useState("");
  const [outraCondicao, setOutraCondicao] = useState("");
  const [dropdownAberto, setDropdownAberto] = useState(false);
  const [etapaAtual, setEtapaAtual] = useState(1);
  const [erro, setErro] = useState("");

  function alternarSintoma(sintoma) {
    setSintomasSelecionados((atuais) =>
      atuais.includes(sintoma)
        ? atuais.filter((item) => item !== sintoma)
        : [...atuais, sintoma]
    );
  }

  function selecionarCondicao(opcao) {
    setCondicao(opcao);
    setDropdownAberto(false);

    if (opcao !== "Outra condição") {
      setOutraCondicao("");
    }
  }

  function continuarAvaliacao(event) {
    event.preventDefault();
    setErro("");

    if (!sintomas.trim()) {
      setErro("Descreva seu principal sintoma para continuar.");
      return;
    }

    if (!inicio || !intensidade) {
      setErro(
        "Informe quando os sintomas começaram e a intensidade do desconforto."
      );
      return;
    }

    if (sintomas.trim().length < 3) {
      setErro("Descreva seu sintoma com um pouco mais de detalhes.");
      return;
    }

    setEtapaAtual(2);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function confirmarAvaliacao() {
    setErro("");
    setEtapaAtual(3);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function voltarEtapa() {
    setErro("");
    setEtapaAtual((atual) => Math.max(1, atual - 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function novaAvaliacao() {
    setSintomas("");
    setInicio("Hoje");
    setIntensidade("");
    setSintomasSelecionados([]);
    setPrimeiraVez("Sim");
    setCondicao("");
    setOutraCondicao("");
    setDropdownAberto(false);
    setEtapaAtual(1);
    setErro("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const condicaoExibida =
    condicao === "Outra condição"
      ? outraCondicao || "Outra condição"
      : condicao || "Não informado";

  return (
    <main className="relative isolate min-h-screen overflow-hidden bg-[#f5faff] text-[#0B1756]">
      {/* Fundo com ilustrações de círculos */}
      <div className="pointer-events-none absolute -right-28 -top-36 z-0 h-[430px] w-[430px] rounded-full bg-[#B8D6FC]/50" />

      <div className="pointer-events-none absolute -left-40 top-10 z-0 h-[330px] w-[330px] rounded-full border-2 border-[#C8DEFF]/60" />

      <div className="pointer-events-none absolute -bottom-36 -left-24 z-0 h-[350px] w-[350px] rounded-full bg-white/50" />

      <div className="pointer-events-none absolute -bottom-40 -right-24 z-0 h-[430px] w-[430px] rounded-full border-[70px] border-[#C5DFFF]/50" />

      {/* Conteúdo da triagem acima do fundo */}
      <div className="relative z-10 mx-auto max-w-[1440px] px-4 py-7 sm:px-6 sm:py-9 lg:px-10 lg:py-10">
        {/* TÍTULO DA PÁGINA */}
        <section className="mb-8 flex flex-col justify-between gap-5 lg:flex-row lg:items-center">
          <div>
            <span className="mb-3 inline-flex items-center gap-2 rounded-full bg-[#3563A7]/15 px-4 py-1.5 text-xs font-bold uppercase tracking-wide text-[#0B1756]">
              <Activity size={15} />
              Triagem de saúde
            </span>

            <h1 className="text-3xl font-extrabold leading-tight tracking-tight text-[#0B1756] sm:text-4xl lg:text-[42px]">
              {etapaAtual === 1 && "Como você está se sentindo?"}
              {etapaAtual === 2 && "Revise suas informações"}
              {etapaAtual === 3 && "Avaliação concluída"}
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-7 text-[#0B1756] sm:text-base">
              {etapaAtual === 1 &&
                "Conte para nós o que você está sentindo e responda às perguntas para organizar as informações iniciais do seu atendimento."}

              {etapaAtual === 2 &&
                "Confira suas respostas e verifique se todas as informações estão corretas."}

              {etapaAtual === 3 &&
                "Você concluiu o preenchimento desta demonstração da triagem."}
            </p>
          </div>

          <div className="flex max-w-md items-start gap-3 rounded-xl border border-[#3563A7]/40 bg-[#3563A7]/10 p-4">
            <Info className="mt-0.5 shrink-0 text-[#023E8A]" size={23} />

            <p className="text-sm leading-6 text-[#0B1756]">
              Esta triagem organiza as informações fornecidas e não substitui a
              avaliação de um profissional de saúde.
            </p>
          </div>
        </section>

        {/* INDICADOR DE ETAPAS */}
        <section className="mb-7 rounded-xl border border-blue-100 bg-white p-4 shadow-sm sm:p-5">
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
                      className={`hidden text-xs font-semibold text-[#0B1756] sm:block sm:text-sm ${
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
          <form onSubmit={continuarAvaliacao}>
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-5 lg:items-stretch">
              {/* FORMULÁRIO PRINCIPAL */}
              <section className="rounded-xl border border-blue-100 bg-white p-5 shadow-sm sm:p-7 lg:col-span-3">
                <div className="mb-7 flex items-center gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#3563A7]/10 text-[#023E8A]">
                    <HeartPulse size={25} />
                  </div>

                  <div>
                    <h2 className="text-xl font-bold text-[#0B1756] sm:text-2xl">
                      Seus sintomas
                    </h2>

                    <p className="mt-1 text-sm text-[#0B1756]">
                      Preencha as informações abaixo.
                    </p>
                  </div>
                </div>

                {/* DESCRIÇÃO DOS SINTOMAS */}
                <div className="mb-7">
                  <label
                    htmlFor="sintomas"
                    className="mb-3 block text-sm font-bold text-[#0B1756] sm:text-base"
                  >
                    Qual é o seu principal sintoma?
                    <span className="ml-1 text-red-500">*</span>
                  </label>

                  <textarea
                    id="sintomas"
                    value={sintomas}
                    onChange={(event) => setSintomas(event.target.value)}
                    maxLength={500}
                    rows={4}
                    required
                    placeholder="Descreva o que você está sentindo..."
                    className="w-full resize-y rounded-lg border border-[#3563A7]/40 bg-white px-4 py-3 text-sm leading-6 text-[#0B1756] outline-none transition placeholder:text-[#0B1756]/50 focus:border-[#023E8A] focus:ring-2 focus:ring-[#3563A7]/30"
                  />

                  <div className="mt-2 flex justify-between gap-3">
                    <p className="text-xs text-[#0B1756]">
                      Seja claro ao descrever os sintomas.
                    </p>

                    <span className="shrink-0 text-xs text-[#0B1756]">
                      {sintomas.length}/500
                    </span>
                  </div>
                </div>

                {/* INÍCIO DOS SINTOMAS */}
                <fieldset className="mb-7">
                  <legend className="mb-3 text-sm font-bold text-[#0B1756] sm:text-base">
                    Quando os sintomas começaram?
                    <span className="ml-1 text-red-500">*</span>
                  </legend>

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                    {["Hoje", "Há 2–3 dias", "Há mais de 3 dias"].map(
                      (opcao) => {
                        const selecionado = inicio === opcao;

                        return (
                          <button
                            key={opcao}
                            type="button"
                            aria-pressed={selecionado}
                            onClick={() => setInicio(opcao)}
                            className={`flex min-h-[54px] items-center justify-center gap-2 rounded-lg border px-3 py-3 text-sm font-medium text-[#0B1756] transition ${
                              selecionado
                                ? "border-[#023E8A] bg-[#3563A7]/15 ring-1 ring-[#023E8A]"
                                : "border-blue-100 bg-white hover:border-[#3563A7] hover:bg-[#3563A7]/10"
                            }`}
                          >
                            <CalendarDays size={17} />
                            {opcao}
                          </button>
                        );
                      }
                    )}
                  </div>
                </fieldset>

                {/* INTENSIDADE */}
                <fieldset className="mb-8">
                  <legend className="mb-3 text-sm font-bold text-[#0B1756] sm:text-base">
                    Qual é a intensidade do desconforto?
                    <span className="ml-1 text-red-500">*</span>
                  </legend>

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                    {intensidades.map((item) => {
                      const Icone = item.Icone;
                      const selecionado = intensidade === item.nome;

                      return (
                        <button
                          key={item.nome}
                          type="button"
                          aria-pressed={selecionado}
                          onClick={() => setIntensidade(item.nome)}
                          className={`flex min-h-[145px] flex-col items-center justify-center rounded-xl border p-4 text-center transition ${
                            selecionado
                              ? "border-[#023E8A] bg-[#3563A7]/15 ring-1 ring-[#023E8A]"
                              : "border-blue-100 bg-[#fbfdff] hover:border-[#3563A7] hover:bg-[#3563A7]/10"
                          }`}
                        >
                          <div
                            className={`mb-3 flex h-11 w-11 items-center justify-center rounded-full ${
                              selecionado
                                ? "bg-[#023E8A] text-white"
                                : "bg-[#3563A7]/15 text-[#023E8A]"
                            }`}
                          >
                            <Icone size={24} />
                          </div>

                          <span className="text-sm font-bold text-[#0B1756]">
                            {item.nome}
                          </span>

                          <span className="mt-1 text-xs text-[#0B1756]">
                            {item.descricao}
                          </span>

                          <span
                            className={`mt-3 flex h-5 w-5 items-center justify-center rounded-full border ${
                              selecionado
                                ? "border-[#023E8A]"
                                : "border-[#3563A7]/50"
                            }`}
                          >
                            {selecionado && (
                              <span className="h-2.5 w-2.5 rounded-full bg-[#023E8A]" />
                            )}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </fieldset>

                {/* SINTOMAS ADICIONAIS */}
                <fieldset>
                  <legend className="mb-4 text-sm font-bold text-[#0B1756] sm:text-base">
                    Você apresenta algum destes sintomas?
                  </legend>

                  <p className="mb-4 text-xs leading-5 text-[#0B1756]">
                    Selecione todas as opções que se aplicam.
                  </p>

                  <div className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
                    {sintomasDisponiveis.map((sintoma) => (
                      <label
                        key={sintoma}
                        className="flex cursor-pointer items-center gap-3 text-sm text-[#0B1756] transition hover:text-[#023E8A] sm:text-base"
                      >
                        <input
                          type="checkbox"
                          checked={sintomasSelecionados.includes(sintoma)}
                          onChange={() => alternarSintoma(sintoma)}
                          className="h-5 w-5 shrink-0 cursor-pointer appearance-none rounded-full border-2 border-[#3563A7] bg-white transition checked:border-[#023E8A] checked:bg-[#023E8A] focus:outline-none focus:ring-2 focus:ring-[#3563A7]/40 focus:ring-offset-2"
                          style={{
                            backgroundImage: sintomasSelecionados.includes(
                              sintoma
                            )
                              ? "radial-gradient(circle, white 0 3px, transparent 3.5px)"
                              : "none",
                          }}
                        />

                        {sintoma}
                      </label>
                    ))}
                  </div>
                </fieldset>
              </section>

              {/* INFORMAÇÕES ADICIONAIS */}
              <aside className="flex h-full flex-col gap-5 lg:col-span-2">
                <section className="rounded-xl border border-blue-100 bg-white p-5 shadow-sm sm:p-6">
                  <div className="mb-7 flex items-center gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#3563A7]/10 text-[#023E8A]">
                      <ClipboardList size={24} />
                    </div>

                    <div>
                      <h2 className="text-xl font-bold text-[#0B1756]">
                        Informações adicionais
                      </h2>

                      <p className="mt-1 text-sm text-[#0B1756]">
                        Conte um pouco mais.
                      </p>
                    </div>
                  </div>

                  {/* PRIMEIRA VEZ */}
                  <fieldset className="mb-7">
                    <legend className="mb-4 text-sm font-bold leading-6 text-[#0B1756]">
                      É a primeira vez que sente esses sintomas?
                    </legend>

                    <div className="flex flex-wrap gap-7">
                      {["Sim", "Não"].map((opcao) => (
                        <label
                          key={opcao}
                          className="flex cursor-pointer items-center gap-3 text-sm text-[#0B1756]"
                        >
                          <input
                            type="radio"
                            name="primeiraVez"
                            value={opcao}
                            checked={primeiraVez === opcao}
                            onChange={(event) =>
                              setPrimeiraVez(event.target.value)
                            }
                            className="h-5 w-5 accent-[#023E8A]"
                          />

                          {opcao}
                        </label>
                      ))}
                    </div>
                  </fieldset>

                  {/* MENU PERSONALIZADO DE CONDIÇÕES */}
                  <div className="mb-7">
                    <label
                      id="condicao-label"
                      className="mb-3 block text-sm font-bold leading-6 text-[#0B1756]"
                    >
                      Você possui alguma condição de saúde relevante?
                    </label>

                    <div className="relative">
                      <button
                        type="button"
                        aria-labelledby="condicao-label"
                        aria-haspopup="listbox"
                        aria-expanded={dropdownAberto}
                        onClick={() => setDropdownAberto((aberto) => !aberto)}
                        className={`flex min-h-[48px] w-full items-center justify-between rounded-lg border bg-white px-4 py-3 text-left text-sm text-[#0B1756] transition focus:outline-none focus:ring-2 focus:ring-[#3563A7]/30 ${
                          dropdownAberto
                            ? "border-[#023E8A] ring-2 ring-[#3563A7]/30"
                            : "border-[#3563A7]/40 hover:border-[#3563A7]"
                        }`}
                      >
                        <span className={condicao ? "" : "opacity-60"}>
                          {condicao || "Opcional"}
                        </span>

                        <ChevronDown
                          size={18}
                          className={`shrink-0 text-[#0B1756] transition-transform ${
                            dropdownAberto ? "rotate-180" : ""
                          }`}
                        />
                      </button>

                      {dropdownAberto && (
                        <>
                          <button
                            type="button"
                            aria-label="Fechar menu de condições"
                            onClick={() => setDropdownAberto(false)}
                            className="fixed inset-0 z-10 cursor-default"
                          />

                          <div
                            role="listbox"
                            aria-labelledby="condicao-label"
                            className="absolute left-0 top-full z-20 mt-2 max-h-60 w-full overflow-y-auto rounded-xl border border-blue-100 bg-white p-1.5 shadow-xl"
                          >
                            <button
                              type="button"
                              role="option"
                              aria-selected={condicao === ""}
                              onClick={() => selecionarCondicao("")}
                              className={`flex w-full items-center justify-between rounded-lg px-3 py-3 text-left text-sm text-[#0B1756] transition ${
                                condicao === ""
                                  ? "bg-[#3563A7]/15 font-semibold"
                                  : "hover:bg-[#3563A7]/10"
                              }`}
                            >
                              Opcional
                              {condicao === "" && (
                                <Check size={17} className="text-[#023E8A]" />
                              )}
                            </button>

                            {condicoesSaude.map((opcao) => {
                              const selecionada = condicao === opcao;

                              return (
                                <button
                                  key={opcao}
                                  type="button"
                                  role="option"
                                  aria-selected={selecionada}
                                  onClick={() => selecionarCondicao(opcao)}
                                  className={`flex w-full items-center justify-between rounded-lg px-3 py-3 text-left text-sm text-[#0B1756] transition ${
                                    selecionada
                                      ? "bg-[#3563A7]/15 font-semibold"
                                      : "hover:bg-[#3563A7]/10"
                                  }`}
                                >
                                  {opcao}

                                  {selecionada && (
                                    <Check
                                      size={17}
                                      className="shrink-0 text-[#023E8A]"
                                    />
                                  )}
                                </button>
                              );
                            })}
                          </div>
                        </>
                      )}
                    </div>

                    {condicao === "Outra condição" && (
                      <div className="mt-3">
                        <label
                          htmlFor="outraCondicao"
                          className="mb-2 block text-sm font-medium text-[#0B1756]"
                        >
                          Qual condição?
                        </label>

                        <input
                          id="outraCondicao"
                          type="text"
                          maxLength={120}
                          value={outraCondicao}
                          onChange={(event) =>
                            setOutraCondicao(event.target.value)
                          }
                          placeholder="Informe a condição de saúde"
                          className="w-full rounded-lg border border-[#3563A7]/40 px-4 py-3 text-sm text-[#0B1756] outline-none transition placeholder:text-[#0B1756]/50 focus:border-[#023E8A] focus:ring-2 focus:ring-[#3563A7]/30"
                        />
                      </div>
                    )}

                    <p className="mt-2 text-xs leading-5 text-[#0B1756]">
                      Campo opcional. Informe apenas o que considerar relevante.
                    </p>
                  </div>

                  {/* AVISO */}
                  <div className="rounded-xl border border-blue-100 bg-gradient-to-br from-[#3563A7]/10 to-white p-4 sm:p-5">
                    <div className="mb-4 flex items-center gap-3">
                      <ShieldCheck
                        size={24}
                        className="shrink-0 text-[#023E8A]"
                      />

                      <h3 className="font-bold text-[#0B1756]">
                        Suas informações
                      </h3>
                    </div>

                    <p className="text-sm leading-6 text-[#0B1756]">
                      Responda com atenção. Estas informações ajudam a
                      organizar o relato para uma avaliação profissional.
                    </p>
                  </div>
                </section>

                {/* PRÓXIMAS ETAPAS */}
                <section className="h-full rounded-xl border border-blue-100 bg-white p-5 shadow-sm sm:p-6">
                  <div className="flex h-full flex-col">
                    <h3 className="mb-8 mt-3 text-lg font-bold text-[#0B1756]">
                      Próximos passos
                    </h3>

                    <div className="flex flex-1 flex-col justify-evenly gap-6 pb-6">
                      {[
                        {
                          numero: 1,
                          titulo: "Responda às perguntas",
                          descricao:
                            "Informe os sintomas e os dados adicionais.",
                        },
                        {
                          numero: 2,
                          titulo: "Revise suas informações",
                          descricao: "Confira as respostas antes de confirmar.",
                        },
                        {
                          numero: 3,
                          titulo: "Consulte as orientações",
                          descricao:
                            "Veja as informações sobre os próximos passos.",
                        },
                      ].map((item) => (
                        <div
                          key={item.numero}
                          className="flex items-start gap-3"
                        >
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#3563A7]/15 text-sm font-bold text-[#0B1756]">
                            {item.numero}
                          </div>

                          <div>
                            <h4 className="text-sm font-bold text-[#0B1756]">
                              {item.titulo}
                            </h4>

                            <p className="mt-1 text-xs leading-5 text-[#0B1756] sm:text-sm">
                              {item.descricao}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>
              </aside>
            </div>

            {/* MENSAGEM DE ERRO */}
            {erro && (
              <div
                role="alert"
                className="mt-5 flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700"
              >
                <Info size={19} className="mt-0.5 shrink-0" />
                <p>{erro}</p>
              </div>
            )}

            {/* BOTÃO CONTINUAR */}
            <div className="mt-7 flex justify-end">
              <button
                type="submit"
                className="inline-flex min-h-[52px] w-full items-center justify-center gap-3 rounded-xl bg-[#023E8A] px-7 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-[#3563A7] focus:outline-none focus:ring-4 focus:ring-[#3563A7]/40 sm:w-auto"
              >
                Continuar avaliação
                <ArrowRight size={21} />
              </button>
            </div>
          </form>
        )}

        {/* ETAPA 2: REVISÃO */}
        {etapaAtual === 2 && (
          <section className="rounded-xl border border-blue-100 bg-white p-5 shadow-sm sm:p-8">
            <div className="mb-7 flex items-center gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#3563A7]/10 text-[#023E8A]">
                <ClipboardList size={26} />
              </div>

              <div>
                <h2 className="text-xl font-bold text-[#0B1756] sm:text-2xl">
                  Confira suas respostas
                </h2>

                <p className="mt-1 text-sm text-[#0B1756]">
                  Verifique as informações antes de confirmar.
                </p>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-xl border border-blue-100 p-5 md:col-span-2">
                <p className="mb-2 text-sm font-semibold text-[#0B1756]">
                  Principal sintoma
                </p>

                <p className="whitespace-pre-wrap break-words text-sm leading-6 text-[#0B1756]">
                  {sintomas}
                </p>
              </div>

              <div className="rounded-xl border border-blue-100 p-5">
                <p className="mb-2 text-sm font-semibold text-[#0B1756]">
                  Início dos sintomas
                </p>

                <p className="font-semibold text-[#0B1756]">{inicio}</p>
              </div>

              <div className="rounded-xl border border-blue-100 p-5">
                <p className="mb-2 text-sm font-semibold text-[#0B1756]">
                  Intensidade
                </p>

                <p className="font-semibold text-[#0B1756]">{intensidade}</p>
              </div>

              <div className="rounded-xl border border-blue-100 p-5">
                <p className="mb-2 text-sm font-semibold text-[#0B1756]">
                  Primeira vez com esses sintomas?
                </p>

                <p className="font-semibold text-[#0B1756]">{primeiraVez}</p>
              </div>

              <div className="rounded-xl border border-blue-100 p-5">
                <p className="mb-2 text-sm font-semibold text-[#0B1756]">
                  Condição de saúde
                </p>

                <p className="break-words font-semibold text-[#0B1756]">
                  {condicaoExibida}
                </p>
              </div>

              <div className="rounded-xl border border-blue-100 p-5 md:col-span-2">
                <p className="mb-3 text-sm font-semibold text-[#0B1756]">
                  Outros sintomas selecionados
                </p>

                {sintomasSelecionados.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {sintomasSelecionados.map((sintoma) => (
                      <span
                        key={sintoma}
                        className="rounded-full bg-[#3563A7]/15 px-3 py-2 text-sm font-medium text-[#0B1756]"
                      >
                        {sintoma}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-[#0B1756]">
                    Nenhum sintoma adicional selecionado.
                  </p>
                )}
              </div>
            </div>

            <div className="mt-7 flex flex-col-reverse justify-between gap-3 sm:flex-row">
              <button
                type="button"
                onClick={voltarEtapa}
                className="inline-flex min-h-[50px] items-center justify-center gap-2 rounded-xl border border-[#023E8A] bg-white px-6 py-3 text-sm font-bold text-[#023E8A] transition hover:bg-[#3563A7]/10 focus:outline-none focus:ring-4 focus:ring-[#3563A7]/30"
              >
                <ArrowLeft size={19} />
                Voltar e editar
              </button>

              <button
                type="button"
                onClick={confirmarAvaliacao}
                className="inline-flex min-h-[50px] items-center justify-center gap-2 rounded-xl bg-[#023E8A] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#3563A7] focus:outline-none focus:ring-4 focus:ring-[#3563A7]/40"
              >
                Confirmar avaliação
                <ArrowRight size={20} />
              </button>
            </div>
          </section>
        )}

        {/* ETAPA 3: CONCLUSÃO */}
        {etapaAtual === 3 && (
          <section className="rounded-xl border border-blue-100 bg-white p-6 text-center shadow-sm sm:p-12">
            <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-[#3563A7]/10 text-[#023E8A]">
              <CheckCircle2 size={46} />
            </div>

            <h2 className="text-2xl font-extrabold text-[#0B1756] sm:text-3xl">
              Preenchimento concluído!
            </h2>

            <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-[#0B1756] sm:text-base">
              Você concluiu as etapas do formulário de triagem. Em um sistema
              real, as respostas precisariam ser encaminhadas de forma segura
              para o fluxo de atendimento apropriado.
            </p>

            <div className="mx-auto mt-7 max-w-xl rounded-xl border border-[#3563A7]/40 bg-[#3563A7]/10 p-5 text-left">
              <div className="flex items-start gap-3">
                <Stethoscope
                  size={25}
                  className="mt-1 shrink-0 text-[#023E8A]"
                />

                <div>
                  <h3 className="font-bold text-[#0B1756]">Importante</h3>

                  <p className="mt-2 text-sm leading-6 text-[#0B1756]">
                    Esta demonstração não fornece diagnóstico, classificação
                    automática de risco ou encaminhamento clínico. Procure um
                    profissional de saúde para receber orientação adequada.
                  </p>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={novaAvaliacao}
              className="mt-8 inline-flex min-h-[50px] items-center justify-center gap-2 rounded-xl bg-[#023E8A] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#3563A7] focus:outline-none focus:ring-4 focus:ring-[#3563A7]/40"
            >
              <Activity size={19} />
              Iniciar nova avaliação
            </button>
          </section>
        )}
      </div>
    </main>
  );
}