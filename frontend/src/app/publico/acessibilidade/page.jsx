"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import {
  Accessibility,
  Eye,
  Ear,
  Brain,
  HeartHandshake,
  UsersRound,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  CheckCircle2,
  Footprints,
} from "lucide-react";

const recursos = [
  {
    titulo: "Pessoas com deficiência visual",
    descricao:
      "Informações organizadas, compatibilidade com leitores de tela, descrições de imagens e navegação por teclado ajudam a consultar os serviços de saúde.",
    icon: Eye,
    tag: "Acesso à informação",
    cor: "bg-[#EAF3F7]",
    detalhe: "Conteúdo que pode ser percebido sem depender apenas da visão.",
  },
  {
    titulo: "Pessoas com deficiência auditiva",
    descricao:
      "Orientações em texto, conteúdos legendados e comunicação acessível contribuem para que avisos e informações importantes sejam compreendidos.",
    icon: Ear,
    tag: "Comunicação acessível",
    cor: "bg-[#EAF3F7]",
    detalhe: "Mais alternativas para receber e compreender informações.",
  },
  {
    titulo: "Pessoas com deficiência física",
    descricao:
      "Uma navegação simples e informações sobre acessibilidade das unidades podem ajudar no planejamento do atendimento e no deslocamento.",
    icon: Accessibility,
    tag: "Autonomia e mobilidade",
    cor: "bg-[#EAF3F7]",
    detalhe: "Serviços pensados para diferentes condições de mobilidade.",
  },
  {
    titulo: "Pessoas com deficiência intelectual",
    descricao:
      "Linguagem simples, explicações diretas e instruções divididas em etapas tornam os caminhos do sistema mais fáceis de acompanhar.",
    icon: Brain,
    tag: "Compreensão facilitada",
    cor: "bg-[#EAF3F7]",
    detalhe: "Menos barreiras para entender cada etapa.",
  },
  {
    titulo: "Saúde mental e cognição",
    descricao:
      "Uma interface organizada, previsível e acolhedora pode reduzir a confusão e ajudar as pessoas a encontrar informações com mais tranquilidade.",
    icon: HeartHandshake,
    tag: "Navegação acolhedora",
    cor: "bg-[#EAF3F7]",
    detalhe: "Clareza e acolhimento durante a navegação.",
  },
  {
    titulo: "Pessoas idosas",
    descricao:
      "Textos legíveis, botões bem identificados e orientações passo a passo ajudam quem está começando a utilizar serviços digitais.",
    icon: UsersRound,
    tag: "Inclusão digital",
    cor: "bg-[#EAF3F7]",
    detalhe: "Tecnologia mais simples para o dia a dia.",
  },
];

const perguntas = [
  {
    pergunta: "Quem pode solicitar uma visita domiciliar?",
    resposta:
      "A proposta é permitir que familiares, cuidadores ou a própria pessoa sinalizem a necessidade de atendimento em casa quando ela estiver acamada ou tiver dificuldade de locomoção. A avaliação e o encaminhamento devem seguir os critérios e os fluxos da equipe de saúde responsável.",
  },
  {
    pergunta: "Qual é o papel do Agente Comunitário de Saúde (ACS)?",
    resposta:
      "O ACS atua como elo entre a comunidade e a equipe de saúde. Na proposta do UneSUS, a solicitação ficaria direcionada aos agentes para que a necessidade fosse recebida e encaminhada conforme a organização da unidade e os procedimentos definidos pelo município.",
  },
  {
    pergunta: "Solicitar uma visita significa que ela está confirmada?",
    resposta:
      "Não necessariamente. No projeto, a solicitação representa o registro do pedido. A confirmação, a prioridade e o agendamento dependeriam da avaliação da equipe de saúde e da disponibilidade do serviço local.",
  },
  {
    pergunta: "Como encontrar uma unidade de saúde?",
    resposta:
      "Consulte os canais oficiais de saúde do seu município para confirmar endereço, telefone, serviços oferecidos e recursos de acessibilidade disponíveis em cada unidade.",
  },
  {
    pergunta: "O que fazer se eu tiver dificuldade para usar o site?",
    resposta:
      "Você pode pedir apoio a alguém de confiança ou procurar sua unidade de saúde e os canais oficiais do município. O objetivo da página é apresentar as informações de maneira clara e facilitar a identificação do serviço necessário.",
  },
  {
    pergunta: "A página já envia uma solicitação para o ACS?",
    resposta:
      "Não nesta versão demonstrativa. A página apresenta a proposta da funcionalidade; para enviar solicitações reais, o projeto precisaria de integração com o sistema da unidade, regras de encaminhamento e proteção adequada dos dados pessoais.",
  },
];

export default function AcessibilidadePage() {
  const [perguntaAberta, setPerguntaAberta] = useState(0);

  return (
    <main className="min-h-screen overflow-hidden bg-[#EEF5F9] font-sans text-[#0B1756]">
      {/* APRESENTAÇÃO INICIAL */}
      <section
        id="inicio"
        className="relative isolate overflow-hidden bg-[#EAF3F7]"
      >
        {/* DECORAÇÕES DO FUNDO */}
        <div className="pointer-events-none absolute -left-36 -top-20 -z-10 h-[400px] w-[400px] rounded-full bg-white/40" />

        <div className="pointer-events-none absolute -top-36 left-[43%] -z-10 h-[440px] w-[440px] rounded-full border-[65px] border-white/40" />

        <div className="pointer-events-none absolute -bottom-52 right-[-100px] -z-10 h-[520px] w-[520px] rounded-full bg-white/30" />

        {/* CONTEÚDO PRINCIPAL */}
        <div className="relative mx-auto grid min-h-[540px] w-full max-w-[1400px] items-center gap-6 px-5 py-12 sm:px-8 md:py-14 lg:grid-cols-[0.92fr_1.08fr] lg:gap-4 lg:px-0 lg:py-12">
          {/* TEXTO À ESQUERDA */}
          <div className="relative z-20 flex flex-col justify-center">
            <h1 className="max-w-[580px] text-4xl font-bold leading-[1.08] tracking-tight text-[#0B1756] sm:text-[42px] lg:text-[46px]">
              Cuidado em saúde deve chegar a{" "}
              <span className="text-[#3563A7]">todas as pessoas.</span>
            </h1>

            <p className="mt-6 max-w-[540px] text-base font-normal leading-7 text-slate-600">
              O UneSUS busca aproximar pessoas dos serviços de saúde com
              informações claras, recursos inclusivos e caminhos que respeitam
              diferentes necessidades — inclusive de quem tem dificuldade para
              sair de casa.
            </p>

            {/* BOTÕES */}
            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href="#visita-domiciliar"
                className="group inline-flex min-h-[48px] items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-[#3563A7] to-[#023E8A] px-5 text-center text-sm font-semibold text-white shadow-lg shadow-[#0B1756]/10 transition duration-300 hover:-translate-y-1 hover:shadow-lg sm:px-6"
              >
                Conhecer visita domiciliar
                <ArrowRight
                  size={19}
                  className="shrink-0 transition-transform group-hover:translate-x-1"
                />
              </Link>

              <Link
                href="#recursos"
                className="inline-flex min-h-[48px] items-center justify-center gap-3 rounded-xl border border-[#3563A7]/40 bg-white px-5 text-sm font-semibold text-[#023E8A] transition duration-300 hover:bg-[#EEF5F9] sm:px-6"
              >
                <Accessibility size={20} />
                Explorar recursos
              </Link>
            </div>
          </div>

          {/* IMAGEM À DIREITA */}
          <div className="relative flex min-h-[380px] items-center justify-center lg:min-h-[540px] lg:-mr-8">
            <div
              className="absolute inset-0 mix-blend-multiply"
              style={{
                WebkitMaskImage:
                  "linear-gradient(to right, transparent 0%, black 22%, black 88%, transparent 100%), linear-gradient(to bottom, transparent 0%, black 6%, black 85%, transparent 100%)",
                WebkitMaskComposite: "source-in",
                maskImage:
                  "linear-gradient(to right, transparent 0%, black 22%, black 88%, transparent 100%), linear-gradient(to bottom, transparent 0%, black 6%, black 85%, transparent 100%)",
                maskComposite: "intersect",
              }}
            >
              <div className="relative h-full min-h-[380px] w-full lg:min-h-[540px]">
                <Image
                  src="/conectasus_imagem.svg"
                  alt="Profissional de saúde acompanhando uma pessoa idosa"
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 55vw"
                  className="object-cover object-center"
                />
              </div>
            </div>

            {/* CÍRCULO DECORATIVO SUPERIOR */}
            <div className="pointer-events-none absolute -left-8 top-16 z-10 hidden h-56 w-56 rounded-full border-[18px] border-white/50 lg:block" />
          </div>
        </div>
      </section>

      {/* RECURSOS INCLUSIVOS */}
      <section
        id="recursos"
        className="scroll-mt-8 bg-white py-16 sm:py-20"
      >
        <div className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-0">
          <div className="mx-auto mb-12 max-w-3xl text-center">
            <span className="text-xs font-semibold uppercase tracking-[0.16em] text-[#3563A7]">
              Inclusão em cada detalhe
            </span>

            <h2 className="mt-4 text-2xl font-bold leading-tight tracking-tight text-[#0B1756] sm:text-3xl">
              Uma experiência pensada para diferentes necessidades
            </h2>

            <p className="mt-4 text-base font-normal leading-7 text-slate-600">
              Acessibilidade não é uma solução única. É oferecer diferentes
              formas de encontrar, entender e utilizar as informações e os
              serviços de saúde.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {recursos.map((recurso, index) => {
              const Icone = recurso.icon;

              return (
                <article
                  key={recurso.titulo}
                  className="group overflow-hidden rounded-[26px] border border-slate-200 bg-white transition duration-300 hover:-translate-y-1 hover:border-[#9BBCEB] hover:shadow-[0_18px_40px_rgba(53,99,167,0.12)]"
                >
                  <div
                    className={`flex items-center justify-between px-6 py-5 ${recurso.cor}`}
                  >
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-[#3563A7] shadow-sm">
                      <Icone size={29} strokeWidth={1.8} />
                    </div>

                    <span className="rounded-full bg-white/80 px-3 py-1.5 text-xs font-semibold text-[#3563A7]">
                      0{index + 1}
                    </span>
                  </div>

                  <div className="p-6 sm:p-7">
                    <span className="text-xs font-semibold uppercase tracking-wide text-[#3563A7]">
                      {recurso.tag}
                    </span>

                    <h3 className="mt-2 text-lg font-bold leading-snug text-[#0B1756]">
                      {recurso.titulo}
                    </h3>

                    <p className="mt-3 text-sm font-normal leading-7 text-slate-600">
                      {recurso.descricao}
                    </p>

                    <div className="mt-5 flex items-start gap-3 rounded-xl bg-[#EEF5F9] p-3.5">
                      <CheckCircle2
                        size={18}
                        className="mt-0.5 shrink-0 text-[#3563A7]"
                      />

                      <p className="text-xs font-semibold leading-5 text-slate-600">
                        {recurso.detalhe}
                      </p>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* VISITA DOMICILIAR */}
      <section
        id="visita-domiciliar"
        className="relative scroll-mt-8 overflow-hidden bg-[#EEF5F9] py-16 sm:py-20"
      >
        <div className="pointer-events-none absolute -right-24 top-0 h-80 w-80 rounded-full bg-[#EAF3F7]" />

        <div className="pointer-events-none absolute -bottom-28 -left-16 h-72 w-72 rounded-full border-[40px] border-white/60" />

        <div className="relative mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-0">
          <div className="mb-10">
            <span className="inline-flex items-center rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-[#3563A7]">
              Uma das principais propostas do UneSUS
            </span>

            <h2 className="mt-5 max-w-4xl text-3xl font-bold leading-tight tracking-tight text-[#0B1756] sm:text-[36px] lg:text-[40px]">
              Visita domiciliar: o cuidado também pode começar em casa.
            </h2>
          </div>

          <div className="grid items-stretch gap-7 lg:grid-cols-[1.05fr_0.95fr]">
            {/* CARD À ESQUERDA */}
            <div className="relative overflow-hidden rounded-[30px] bg-[#0B1756] p-7 text-white shadow-xl shadow-blue-900/10 sm:p-10">
              <div className="absolute -right-12 -top-12 h-44 w-44 rounded-full border-[24px] border-white/10" />

              <div className="absolute -bottom-14 right-20 h-36 w-36 rounded-full bg-white/5" />

              <div className="relative flex h-full flex-col">
                <p className="mt-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#EAF3F7]">
                  Atendimento mais próximo
                </p>

                <h3 className="mt-3 max-w-xl text-2xl font-bold leading-tight text-white">
                  Para quem não consegue chegar facilmente à unidade de saúde.
                </h3>

                <p className="mt-5 max-w-xl text-base font-normal leading-7 text-slate-200">
                  A proposta é oferecer um caminho para registrar a necessidade
                  de uma visita em casa, especialmente para pessoas acamadas ou
                  com dificuldade de locomoção. Assim, familiares e cuidadores
                  teriam uma forma mais clara de comunicar essa necessidade à
                  rede de saúde.
                </p>

                <div className="mt-8 grid flex-1 grid-rows-2 gap-3">
                  <div className="flex flex-col justify-center rounded-2xl border border-white/15 bg-white/10 p-4">
                    <Footprints
                      size={24}
                      className="text-[#EAF3F7]"
                    />

                    <p className="mt-3 text-base font-semibold text-white">
                      Dificuldade de locomoção
                    </p>

                    <p className="mt-1 text-sm font-normal leading-6 text-slate-200">
                      Pessoas que enfrentam barreiras para se deslocar até a
                      unidade.
                    </p>
                  </div>

                  <div className="flex flex-col justify-center rounded-2xl border border-white/15 bg-white/10 p-4">
                    <HeartHandshake
                      size={24}
                      className="text-[#EAF3F7]"
                    />

                    <p className="mt-3 text-base font-semibold text-white">
                      Pessoas acamadas
                    </p>

                    <p className="mt-1 text-sm font-normal leading-6 text-slate-200">
                      Pessoas que precisam de avaliação sobre atendimento em
                      casa.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* CARD À DIREITA */}
            <div className="flex flex-col rounded-[30px] border border-slate-200 bg-white p-7 shadow-[0_20px_60px_rgba(34,77,139,0.08)] sm:p-10">
              <div>
                <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[#3563A7]">
                  Encaminhamento
                </span>

                <h3 className="mt-2 text-2xl font-bold leading-tight text-[#0B1756]">
                  Direcionado aos Agentes Comunitários de Saúde (ACS)
                </h3>
              </div>

              <p className="mt-5 text-base font-normal leading-7 text-slate-600">
                Os ACS são importantes na ligação entre a comunidade e a equipe
                de saúde. Na proposta do UneSUS, a solicitação seria
                direcionada a esses profissionais para que a necessidade fosse
                recebida e encaminhada conforme o fluxo definido pela unidade.
              </p>

              <div className="mt-7 space-y-5">
                {[
                  {
                    numero: "01",
                    titulo: "Registrar a necessidade",
                    texto:
                      "A pessoa, familiar ou cuidador informa que existe dificuldade para comparecer presencialmente.",
                  },
                  {
                    numero: "02",
                    titulo: "Direcionar para a equipe responsável",
                    texto:
                      "O pedido é encaminhado aos ACS, conforme a organização e os procedimentos da rede local.",
                  },
                  {
                    numero: "03",
                    titulo: "Avaliar e orientar os próximos passos",
                    texto:
                      "A equipe avalia a situação e informa as possibilidades de atendimento, visita ou encaminhamento.",
                  },
                ].map((etapa) => (
                  <div key={etapa.numero} className="flex gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#EAF3F7]">
                      <span className="text-sm font-semibold text-[#3563A7]">
                        {etapa.numero}
                      </span>
                    </div>

                    <div className="flex-1 border-b border-slate-200 pb-5 last:border-0 last:pb-0">
                      <h4 className="text-base font-semibold text-[#0B1756]">
                        {etapa.titulo}
                      </h4>

                      <p className="mt-2 text-sm font-normal leading-6 text-slate-600">
                        {etapa.texto}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <a
                href="#ajuda"
                className="mt-7 inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#3563A7] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#023E8A]"
              >
                Ver dúvidas frequentes
                <ArrowRight size={18} />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* CHAMADA FINAL */}
      <section className="relative overflow-hidden bg-[#023E8A] px-5 py-16 text-white sm:px-8 sm:py-20">
        <div className="pointer-events-none absolute -left-16 -top-24 h-64 w-64 rounded-full border-[35px] border-white/10" />

        <div className="pointer-events-none absolute -bottom-24 -right-12 h-72 w-72 rounded-full bg-white/5" />

        <div className="relative mx-auto flex max-w-[1100px] flex-col items-center gap-7 text-center">
          <h2 className="max-w-3xl text-3xl font-bold leading-tight tracking-tight text-white sm:text-[36px] lg:text-[40px]">
            A inclusão começa quando o cuidado considera cada realidade.
          </h2>

          <p className="max-w-2xl text-base font-normal leading-7 text-slate-200">
            O UneSUS busca aproximar a população dos serviços de saúde com
            informação, acolhimento e atenção às necessidades de cada pessoa.
          </p>

          <a
            href="/publico/login"
            className="inline-flex items-center gap-3 rounded-2xl bg-white px-7 py-4 text-sm font-semibold text-[#0B1756] transition hover:-translate-y-0.5 hover:bg-[#EAF3F7]"
          >
            Conhecer a visita domiciliar
            <ArrowRight size={19} />
          </a>
        </div>
      </section>

      {/* PERGUNTAS FREQUENTES */}
      <section
        id="ajuda"
        className="bg-[#EEF5F9] py-16 sm:py-20"
      >
        <div className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-0">
          {/* TÍTULO */}
          <div className="mb-10 max-w-3xl">
            <span className="text-xs font-semibold uppercase tracking-[0.16em] text-[#3563A7]">
              Central de ajuda
            </span>

            <h2 className="mt-3 text-2xl font-bold tracking-tight text-[#0B1756] sm:text-3xl">
              Ficou com alguma dúvida?
            </h2>

            <p className="mt-5 text-base font-normal leading-7 text-slate-600">
              Consulte as respostas sobre visita domiciliar, acessibilidade e
              formas de encontrar atendimento na rede de saúde.
            </p>
          </div>

          {/* PERGUNTAS */}
          <div className="space-y-3">
            {perguntas.map((item, index) => {
              const aberta = perguntaAberta === index;

              return (
                <div
                  key={item.pergunta}
                  className={`overflow-hidden rounded-2xl border bg-white transition ${
                    aberta
                      ? "border-[#3563A7] shadow-[0_8px_25px_rgba(53,99,167,0.07)]"
                      : "border-slate-200 hover:border-[#3563A7]"
                  }`}
                >
                  <button
                    type="button"
                    aria-expanded={aberta}
                    onClick={() =>
                      setPerguntaAberta(aberta ? -1 : index)
                    }
                    className="flex w-full items-center justify-between gap-4 p-5 text-left sm:p-6"
                  >
                    <span className="text-base font-semibold leading-6 text-[#0B1756]">
                      {item.pergunta}
                    </span>

                    <span className="shrink-0 text-[#3563A7]">
                      {aberta ? (
                        <ChevronUp size={21} />
                      ) : (
                        <ChevronDown size={21} />
                      )}
                    </span>
                  </button>

                  {aberta && (
                    <div className="border-t border-slate-200 px-5 pb-5 pt-4 text-sm font-normal leading-7 text-slate-600 sm:px-6 sm:pb-6">
                      {item.resposta}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}