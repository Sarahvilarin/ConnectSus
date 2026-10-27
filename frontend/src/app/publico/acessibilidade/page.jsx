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
  HeartPulse,
  Headphones,
  MessageCircle,
  BookOpen,
  HandHeart,
  UserRoundCheck,
  CalendarCheck,
  ClipboardList,
  Footprints,
  CircleHelp,
  House,
} from "lucide-react";

const recursos = [
  {
    titulo: "Pessoas com deficiência visual",
    descricao:
      "Informações organizadas, compatibilidade com leitores de tela, descrições de imagens e navegação por teclado ajudam a consultar os serviços de saúde.",
    icon: Eye,
    tag: "Acesso à informação",
    cor: "bg-blue-50",
    detalhe: "Conteúdo que pode ser percebido sem depender apenas da visão.",
  },
  {
    titulo: "Pessoas com deficiência auditiva",
    descricao:
      "Orientações em texto, conteúdos legendados e comunicação acessível contribuem para que avisos e informações importantes sejam compreendidos.",
    icon: Ear,
    tag: "Comunicação acessível",
    cor: "bg-indigo-50",
    detalhe: "Mais alternativas para receber e compreender informações.",
  },
  {
    titulo: "Pessoas com deficiência física",
    descricao:
      "Uma navegação simples e informações sobre acessibilidade das unidades podem ajudar no planejamento do atendimento e no deslocamento.",
    icon: Accessibility,
    tag: "Autonomia e mobilidade",
    cor: "bg-sky-50",
    detalhe: "Serviços pensados para diferentes condições de mobilidade.",
  },
  {
    titulo: "Pessoas com deficiência intelectual",
    descricao:
      "Linguagem simples, explicações diretas e instruções divididas em etapas tornam os caminhos do sistema mais fáceis de acompanhar.",
    icon: Brain,
    tag: "Compreensão facilitada",
    cor: "bg-violet-50",
    detalhe: "Menos barreiras para entender cada etapa.",
  },
  {
    titulo: "Saúde mental e cognição",
    descricao:
      "Uma interface organizada, previsível e acolhedora pode reduzir a confusão e ajudar as pessoas a encontrar informações com mais tranquilidade.",
    icon: HeartHandshake,
    tag: "Navegação acolhedora",
    cor: "bg-rose-50",
    detalhe: "Clareza e acolhimento durante a navegação.",
  },
  {
    titulo: "Pessoas idosas",
    descricao:
      "Textos legíveis, botões bem identificados e orientações passo a passo ajudam quem está começando a utilizar serviços digitais.",
    icon: UsersRound,
    tag: "Inclusão digital",
    cor: "bg-amber-50",
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
  const [busca, setBusca] = useState("");

  const perguntasFiltradas = perguntas.filter((item) =>
    item.pergunta.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <main className="min-h-screen overflow-hidden bg-[#F5F9FD] text-[#0B1756]">
      {/* APRESENTAÇÃO INICIAL */}
      <section
        id="inicio"
        className="relative isolate overflow-hidden bg-[#F2F7FE]"
      >
        {/* DECORAÇÕES DO FUNDO */}
        <div className="pointer-events-none absolute -left-36 -top-20 -z-10 h-[400px] w-[400px] rounded-full bg-[#DFECFC]/70" />

        <div className="pointer-events-none absolute -top-36 left-[43%] -z-10 h-[440px] w-[440px] rounded-full border-[65px] border-[#D7E7FC]/70" />

        <div className="pointer-events-none absolute -bottom-52 right-[-100px] -z-10 h-[520px] w-[520px] rounded-full bg-[#C5DDFB]/60" />

        {/* CONTEÚDO ALINHADO */}
        <div className="relative mx-auto grid min-h-[400px] w-full max-w-[1500px] grid-cols-1 lg:grid-cols-2">
          {/* CONTEÚDO À ESQUERDA — MANTIDO NO MESMO ALINHAMENTO */}
          <div className="relative z-20 flex flex-col justify-center px-5 py-14 sm:px-8 lg:px-12 lg:py-20 xl:px-12 2xl:px-12">
            <h1 className="max-w-[780px] text-[40px] font-extrabold leading-[1.06] tracking-[-0.045em] text-[#102653] sm:text-5xl lg:text-[48px] xl:text-[60px] 2xl:text-[68px]">
              Cuidado em saúde deve chegar a{" "}
              <span className="text-[#3975CF]">todas as pessoas.</span>
            </h1>

            <p className="mt-7 max-w-[720px] text-base leading-8 text-[#5D79A7] sm:text-lg xl:text-xl">
              O UneSUS busca aproximar pessoas dos serviços de saúde com
              informações claras, recursos inclusivos e caminhos que respeitam
              diferentes necessidades — inclusive de quem tem dificuldade para
              sair de casa.
            </p>

            {/* BOTÕES */}
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="#visita-domiciliar"
                className="group inline-flex min-h-[62px] items-center justify-center gap-4 rounded-[22px] bg-gradient-to-r from-[#3477D8] to-[#28569D] px-6 text-center text-sm font-bold text-white shadow-[0_10px_22px_rgba(44,99,180,0.2)] transition duration-300 hover:-translate-y-1 hover:shadow-lg sm:px-7 sm:text-base"
              >
                Conhecer visita domiciliar
                <ArrowRight
                  size={21}
                  className="shrink-0 transition-transform group-hover:translate-x-1"
                />
              </Link>

              <Link
                href="#recursos"
                className="inline-flex min-h-[62px] items-center justify-center gap-3 rounded-[22px] border border-[#BBD3FA] bg-white/90 px-6 text-sm font-bold text-[#285BA8] transition duration-300 hover:-translate-y-1 hover:bg-white sm:px-7 sm:text-base"
              >
                <Accessibility size={21} />
                Explorar recursos
              </Link>
            </div>

            {/* CARDS INFORMATIVOS */}
            <div className="mt-9 grid grid-cols-3 gap-3 sm:gap-4">
              <div className="flex min-h-[100px] flex-col items-center justify-center gap-3 rounded-[24px] border border-[#DCE8FC] bg-white/90 px-2 py-4 shadow-[0_4px_15px_rgba(49,95,161,0.05)] transition duration-300 hover:-translate-y-1 hover:shadow-md sm:min-h-[112px]">
                <HeartHandshake
                  size={29}
                  strokeWidth={1.8}
                  className="text-[#3475D1]"
                />
                <span className="text-center text-xs font-bold text-[#28569D] sm:text-sm">
                  Acolhimento
                </span>
              </div>

              <div className="flex min-h-[100px] flex-col items-center justify-center gap-3 rounded-[24px] border border-[#DCE8FC] bg-white/90 px-2 py-4 shadow-[0_4px_15px_rgba(49,95,161,0.05)] transition duration-300 hover:-translate-y-1 hover:shadow-md sm:min-h-[112px]">
                <BookOpen
                  size={29}
                  strokeWidth={1.8}
                  className="text-[#3475D1]"
                />
                <span className="text-center text-xs font-bold text-[#28569D] sm:text-sm">
                  Informação clara
                </span>
              </div>

              <div className="flex min-h-[100px] flex-col items-center justify-center gap-3 rounded-[24px] border border-[#DCE8FC] bg-white/90 px-2 py-4 shadow-[0_4px_15px_rgba(49,95,161,0.05)] transition duration-300 hover:-translate-y-1 hover:shadow-md sm:min-h-[112px]">
                <UsersRound
                  size={29}
                  strokeWidth={1.8}
                  className="text-[#3475D1]"
                />
                <span className="text-center text-xs font-bold text-[#28569D] sm:text-sm">
                  Para todos
                </span>
              </div>
            </div>
          </div>

          {/* IMAGEM INICIAL — EXPANDIDA PARA A DIREITA */}
          <div className="relative min-h-[520px] lg:min-h-[750px] lg:mr-[-120px] xl:mr-[-180px] 2xl:mr-[-220px]">
            <div
              className="absolute inset-0 overflow-hidden"
              style={{
                WebkitMaskImage:
                  "linear-gradient(to right, transparent 0%, black 18%, black 100%)",
                maskImage:
                  "linear-gradient(to right, transparent 0%, black 18%, black 100%)",
              }}
            >
          <Image
            src="/acessibilidade_idoso.svg"
            alt="Profissional de saúde acompanhando um idoso em cadeira de rodas"
            fill
            priority
            quality={100}
            sizes="(max-width: 1024px) 100vw, 85vw"
            className="object-cover object-[center_25%] lg:object-[60%_25%]"
          />
            </div>

            {/* CÍRCULO DECORATIVO SUPERIOR */}
            <div className="pointer-events-none absolute -left-16 top-20 z-10 hidden h-64 w-64 rounded-full border-[18px] border-white/50 lg:block" />

            {/* CÍRCULO DECORATIVO INFERIOR */}
            <div className="pointer-events-none absolute -bottom-20 -right-16 z-10 h-[300px] w-[300px] rounded-full bg-[#3975CF]/75 sm:h-[360px] sm:w-[360px]" />

            {/* SELO SUPERIOR */}
            <div className="absolute right-4 top-8 z-20 flex items-center gap-3 rounded-full border border-white/70 bg-white/95 px-4 py-3 shadow-[0_8px_30px_rgba(25,60,110,0.12)] sm:right-8 sm:px-6 sm:py-4 xl:right-12">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#36B982] text-white">
                <CheckCircle2 size={25} />
              </div>

              <div>
                <p className="text-sm font-extrabold text-[#24549B] sm:text-base">
                  Inclusão para todos
                </p>
                <p className="mt-1 text-xs text-[#6D85A8]">
                  Respeito e autonomia
                </p>
              </div>
            </div>

            {/* SELO INFERIOR */}
            <div className="absolute bottom-24 right-4 z-20 flex items-center gap-3 rounded-full border border-white/60 bg-white/95 px-4 py-3 shadow-lg sm:bottom-28 sm:right-8 sm:px-6 sm:py-4 xl:right-12">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#3475D1] text-white">
                <HeartPulse size={27} />
              </div>

              <div>
                <p className="text-sm font-extrabold text-[#24549B] sm:text-base">
                  UneSUS
                </p>
                <p className="mt-1 text-xs text-[#6D85A8]">
                  Saúde mais acessível
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* RECURSOS INCLUSIVOS */}
      <section id="recursos" className="scroll-mt-8 bg-white py-20 sm:py-24">
        <div className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12">
          <div className="mx-auto mb-12 max-w-3xl text-center">
            <span className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#3563A7]">
              Inclusão em cada detalhe
            </span>
            <h2 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl">
              Uma experiência pensada para diferentes necessidades
            </h2>
            <p className="mt-4 text-base leading-7 text-[#71829B]">
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
                  className="group overflow-hidden rounded-[26px] border border-[#DCE8F5] bg-white transition duration-300 hover:-translate-y-1 hover:border-[#9BBCEB] hover:shadow-[0_18px_40px_rgba(53,99,167,0.12)]"
                >
                  <div
                    className={`flex items-center justify-between px-6 py-5 ${recurso.cor}`}
                  >
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-[#3563A7] shadow-sm">
                      <Icone size={29} strokeWidth={1.8} />
                    </div>

                    <span className="rounded-full bg-white/80 px-3 py-1.5 text-xs font-extrabold text-[#3563A7]">
                      0{index + 1}
                    </span>
                  </div>

                  <div className="p-6 sm:p-7">
                    <span className="text-xs font-bold uppercase tracking-wide text-[#3563A7]">
                      {recurso.tag}
                    </span>
                    <h3 className="mt-2 text-xl font-extrabold">
                      {recurso.titulo}
                    </h3>
                    <p className="mt-3 text-sm leading-7 text-[#71829B]">
                      {recurso.descricao}
                    </p>

                    <div className="mt-5 flex items-start gap-3 rounded-xl bg-[#F5F9FD] p-3.5">
                      <CheckCircle2
                        size={18}
                        className="mt-0.5 shrink-0 text-[#3563A7]"
                      />
                      <p className="text-xs font-semibold leading-5 text-[#526D94]">
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
        className="relative scroll-mt-8 overflow-hidden bg-[#EAF3F7] py-20 sm:py-24"
      >
        <div className="pointer-events-none absolute -right-24 top-0 h-80 w-80 rounded-full bg-[#D4E5FB]" />
        <div className="pointer-events-none absolute -bottom-28 -left-16 h-72 w-72 rounded-full border-[40px] border-white/60" />

        <div className="relative mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12">
          <div className="mb-10 flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-[#C8DCF5] bg-white px-4 py-2 text-xs font-extrabold uppercase tracking-[0.14em] text-[#3563A7]">
                <House size={16} />
                Uma das principais propostas do UneSUS
              </span>

              <h2 className="mt-5 max-w-4xl text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
                Visita domiciliar: o cuidado também pode começar em casa.
              </h2>
            </div>
          </div>

          <div className="grid items-stretch gap-7 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="relative overflow-hidden rounded-[30px] bg-[#0B286F] p-7 text-white shadow-xl shadow-blue-900/10 sm:p-10">
              <div className="absolute -right-12 -top-12 h-44 w-44 rounded-full border-[24px] border-white/10" />
              <div className="absolute -bottom-14 right-20 h-36 w-36 rounded-full bg-white/5" />

              <div className="relative">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 text-[#D9E9FF]">
                  <House size={34} />
                </div>

                <p className="mt-7 text-sm font-extrabold uppercase tracking-[0.16em] text-blue-200">
                  Atendimento mais próximo
                </p>

                <h3 className="mt-3 max-w-xl text-2xl font-extrabold leading-tight sm:text-3xl">
                  Para quem não consegue chegar facilmente à unidade de saúde.
                </h3>

                <p className="mt-5 max-w-xl leading-8 text-blue-100">
                  A proposta é oferecer um caminho para registrar a necessidade
                  de uma visita em casa, especialmente para pessoas acamadas ou
                  com dificuldade de locomoção. Assim, familiares e cuidadores
                  teriam uma forma mais clara de comunicar essa necessidade à
                  rede de saúde.
                </p>

                <div className="mt-8 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl border border-white/15 bg-white/10 p-4">
                    <Footprints size={24} className="text-[#C8E1FF]" />
                    <p className="mt-3 font-bold">
                      Dificuldade de locomoção
                    </p>
                    <p className="mt-1 text-sm leading-6 text-blue-100">
                      Pessoas que enfrentam barreiras para se deslocar até a
                      unidade.
                    </p>
                  </div>

                  <div className="rounded-2xl border border-white/15 bg-white/10 p-4">
                    <HeartHandshake size={24} className="text-[#C8E1FF]" />
                    <p className="mt-3 font-bold">Pessoas acamadas</p>
                    <p className="mt-1 text-sm leading-6 text-blue-100">
                      Pessoas que precisam de avaliação sobre atendimento em
                      casa.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col rounded-[30px] border border-[#D6E4F5] bg-white p-7 shadow-[0_20px_60px_rgba(34,77,139,0.08)] sm:p-10">
              <div className="flex items-start gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#EAF3F7] text-[#3563A7]">
                  <UserRoundCheck size={29} />
                </div>

                <div>
                  <span className="text-xs font-extrabold uppercase tracking-[0.14em] text-[#3563A7]">
                    Encaminhamento
                  </span>
                  <h3 className="mt-2 text-2xl font-extrabold">
                    Direcionado aos Agentes Comunitários de Saúde (ACS)
                  </h3>
                </div>
              </div>

              <p className="mt-5 leading-7 text-[#71829B]">
                Os ACS são importantes na ligação entre a comunidade e a equipe
                de saúde. Na proposta do UneSUS, a solicitação seria
                direcionada a esses profissionais para que a necessidade fosse
                recebida e encaminhada conforme o fluxo definido pela unidade.
              </p>

              <div className="mt-7 space-y-5">
                {[
                  {
                    numero: "01",
                    icon: ClipboardList,
                    titulo: "Registrar a necessidade",
                    texto:
                      "A pessoa, familiar ou cuidador informa que existe dificuldade para comparecer presencialmente.",
                  },
                  {
                    numero: "02",
                    icon: UserRoundCheck,
                    titulo: "Direcionar para a equipe responsável",
                    texto:
                      "O pedido é encaminhado aos ACS, conforme a organização e os procedimentos da rede local.",
                  },
                  {
                    numero: "03",
                    icon: CalendarCheck,
                    titulo: "Avaliar e orientar os próximos passos",
                    texto:
                      "A equipe avalia a situação e informa as possibilidades de atendimento, visita ou encaminhamento.",
                  },
                ].map((etapa) => {
                  const Icone = etapa.icon;

                  return (
                    <div key={etapa.numero} className="flex gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#F0F6FC] text-[#3563A7]">
                        <Icone size={23} />
                      </div>

                      <div className="flex-1 border-b border-[#E8EEF7] pb-5 last:border-0 last:pb-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-xs font-extrabold text-[#7191C1]">
                            {etapa.numero}
                          </span>
                          <h4 className="font-extrabold">{etapa.titulo}</h4>
                        </div>

                        <p className="mt-2 text-sm leading-6 text-[#71829B]">
                          {etapa.texto}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-7 flex items-start gap-3 rounded-2xl border border-[#F0DDB5] bg-[#FFF8E9] p-4">
                <CircleHelp
                  size={21}
                  className="mt-0.5 shrink-0 text-[#9B6A1C]"
                />
                <p className="text-sm leading-6 text-[#80622F]">
                  <strong>Importante:</strong> a solicitação não significa
                  confirmação automática da visita. A avaliação, a prioridade e
                  o agendamento dependem da equipe de saúde e dos critérios do
                  serviço local.
                </p>
              </div>

              <a
                href="#ajuda"
                className="mt-7 inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#3563A7] px-5 py-3 font-bold text-white transition hover:bg-[#023E8A]"
              >
                Ver dúvidas frequentes
                <ArrowRight size={18} />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ORIENTAÇÕES PRÁTICAS */}
      <section
        id="orientacoes"
        className="scroll-mt-8 overflow-hidden bg-white py-20 sm:py-24"
      >
        <div className="mx-auto grid max-w-[1400px] items-center gap-12 px-5 sm:px-8 lg:grid-cols-2 lg:gap-16 lg:px-12">
          {/* PAINEL INFORMATIVO À ESQUERDA */}
          <div className="relative">
            <div className="absolute -right-5 -top-5 h-32 w-32 rounded-full bg-[#CFE2FC]/70" />
            <div className="absolute -bottom-5 -left-5 h-28 w-28 rounded-full bg-[#D9EFE9]/70" />

            <div className="relative overflow-hidden rounded-[30px] border border-[#DCE8F5] bg-[#F5F9FD] shadow-[0_20px_60px_rgba(34,77,139,0.10)]">
              <div className="bg-[#3563A7] p-7 text-white sm:p-9">
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/15">
                    <Accessibility size={30} />
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-blue-100">
                      UneSUS
                    </p>
                    <h2 className="text-xl font-extrabold sm:text-2xl">
                      Um acesso para cada pessoa
                    </h2>
                  </div>
                </div>

                <p className="mt-5 leading-7 text-blue-100">
                  A acessibilidade deve considerar diferentes necessidades,
                  oferecendo informações compreensíveis e caminhos para que
                  cada pessoa possa participar com autonomia.
                </p>
              </div>

              <div className="grid gap-3 p-5 sm:grid-cols-2 sm:p-7">
                {[
                  {
                    icon: Eye,
                    titulo: "Perceber",
                    texto: "Informações organizadas e fáceis de localizar.",
                  },
                  {
                    icon: Ear,
                    titulo: "Acompanhar",
                    texto: "Alternativas de comunicação acessível.",
                  },
                  {
                    icon: Brain,
                    titulo: "Entender",
                    texto: "Orientações com linguagem simples.",
                  },
                  {
                    icon: HandHeart,
                    titulo: "Participar",
                    texto: "Autonomia, acolhimento e respeito.",
                  },
                ].map((item) => {
                  const Icone = item.icon;

                  return (
                    <div
                      key={item.titulo}
                      className="rounded-2xl border border-[#E0EAF6] bg-white p-5 transition duration-300 hover:-translate-y-1 hover:border-[#BBD1F0] hover:shadow-md"
                    >
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#EAF3F7] text-[#3563A7]">
                        <Icone size={25} />
                      </div>

                      <h3 className="mt-4 font-extrabold text-[#0B1756]">
                        {item.titulo}
                      </h3>

                      <p className="mt-2 text-sm leading-6 text-[#71829B]">
                        {item.texto}
                      </p>
                    </div>
                  );
                })}
              </div>

              <div className="mx-5 mb-5 flex items-start gap-3 rounded-2xl border border-[#DCE8F5] bg-white p-4 sm:mx-7 sm:mb-7">
                <HeartHandshake
                  size={23}
                  className="mt-0.5 shrink-0 text-[#3563A7]"
                />
                <p className="text-sm leading-6 text-[#5B6F8D]">
                  Cada pessoa merece encontrar informações e serviços de saúde
                  de forma acessível, respeitosa e acolhedora.
                </p>
              </div>
            </div>
          </div>

          {/* FOTO À DIREITA */}
          <div className="relative mx-auto w-full max-w-[650px] lg:mx-0">
            <div className="absolute -right-5 -top-5 h-32 w-32 rounded-full bg-[#CFE2FC]" />
            <div className="absolute -bottom-5 -left-5 h-36 w-36 rounded-full bg-[#D9EFE9]" />

            <div className="relative aspect-[4/5] overflow-hidden rounded-[32px] border-[6px] border-white shadow-[0_24px_65px_rgba(34,77,139,0.16)] sm:aspect-[5/4]">
              <Image
                src="/deficiencia.svg.png"
                alt="Menina utilizando cadeira de rodas em um ambiente acessível"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 45vw"
                className="object-cover object-center"
              />

              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#0B1756]/90 via-[#0B1756]/40 to-transparent p-6 pt-24 sm:p-8 sm:pt-28">
                <span className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/15 px-3 py-2 text-xs font-semibold text-white backdrop-blur-md">
                  <HeartHandshake size={16} />
                  Inclusão e autonomia
                </span>

                <h3 className="mt-4 text-2xl font-extrabold leading-tight text-white sm:text-3xl">
                  Acessibilidade transforma vidas.
                </h3>

                <p className="mt-3 max-w-md text-sm leading-6 text-blue-50 sm:text-base">
                  Um ambiente acessível ajuda a promover mais independência,
                  participação e dignidade.
                </p>
              </div>
            </div>

            {/* SELO FLUTUANTE */}
            <div className="absolute -right-2 top-8 flex items-center gap-3 rounded-2xl border border-[#E0EAF6] bg-white p-3 shadow-[0_10px_30px_rgba(34,77,139,0.12)] sm:-right-4 sm:p-4" />
          </div>
        </div>
      </section>

      {/* CHAMADA FINAL */}
      <section className="relative overflow-hidden bg-[#0B286F] px-5 py-16 text-white sm:px-8 sm:py-20">
        <div className="pointer-events-none absolute -left-16 -top-24 h-64 w-64 rounded-full border-[35px] border-white/10" />
        <div className="pointer-events-none absolute -bottom-24 -right-12 h-72 w-72 rounded-full bg-white/5" />

        <div className="relative mx-auto flex max-w-[1100px] flex-col items-center gap-7 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10">
            <HeartHandshake size={34} />
          </div>

          <h2 className="max-w-3xl text-3xl font-extrabold tracking-tight sm:text-4xl">
            A inclusão começa quando o cuidado considera cada realidade.
          </h2>

          <p className="max-w-2xl leading-7 text-blue-100">
            O UneSUS busca aproximar a população dos serviços de saúde com
            informação, acolhimento e atenção às necessidades de cada pessoa.
          </p>

          <a
            href="#visita-domiciliar"
            className="inline-flex items-center gap-3 rounded-2xl bg-white px-7 py-4 font-extrabold text-[#0B286F] transition hover:-translate-y-0.5 hover:bg-[#EAF3F7]"
          >
            Conhecer a visita domiciliar
            <ArrowRight size={19} />
          </a>
        </div>
      </section>

      {/* PERGUNTAS FREQUENTES */}
      <section id="ajuda" className="bg-[#F5F9FD] py-20 sm:py-24">
        <div className="mx-auto grid max-w-[1400px] gap-12 px-5 sm:px-8 lg:grid-cols-[0.8fr_1.2fr] lg:px-12">
          <div>
            <span className="mt-6 text-xs font-extrabold uppercase tracking-[0.16em] text-[#3563A7]">
              Central de ajuda
            </span>

            <h2 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
              Ficou com alguma dúvida?
            </h2>

            <p className="mt-5 leading-7 text-[#71829B]">
              Consulte as respostas sobre visita domiciliar, acessibilidade e
              formas de encontrar atendimento na rede de saúde.
            </p>

            <div className="mt-7 rounded-[24px] border border-[#DCE8F5] bg-white p-5 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#EAF3F7] text-[#3563A7]">
                  <Headphones size={23} />
                </div>

                <div>
                  <h3 className="font-extrabold">Precisa de orientação?</h3>
                  <p className="mt-1 text-xs leading-5 text-[#71829B]">
                    Procure sua unidade de saúde ou os canais oficiais do
                    município.
                  </p>
                </div>
              </div>

              <a
                href="#inicio"
                className="mt-5 inline-flex items-center gap-2 font-bold text-[#3563A7] transition hover:text-[#023E8A]"
              >
                Voltar ao início
                <ArrowRight size={17} />
              </a>
            </div>
          </div>

          <div>
            <label
              htmlFor="buscar-pergunta"
              className="mb-3 block text-sm font-extrabold"
            >
              O que você precisa saber?
            </label>

            <div className="flex items-center gap-3 rounded-2xl border border-[#D6E4F5] bg-white px-4 py-3.5 shadow-sm focus-within:border-[#3563A7] focus-within:ring-4 focus-within:ring-[#3563A7]/10">
              <MessageCircle
                size={21}
                className="shrink-0 text-[#3563A7]"
              />

              <input
                id="buscar-pergunta"
                type="search"
                value={busca}
                onChange={(e) => {
                  setBusca(e.target.value);
                  setPerguntaAberta(-1);
                }}
                placeholder="Buscar uma pergunta..."
                className="w-full bg-transparent text-sm text-[#0B1756] outline-none placeholder:text-[#9AAAC0]"
              />
            </div>

            <div className="mt-5 space-y-3">
              {perguntasFiltradas.length > 0 ? (
                perguntasFiltradas.map((item, index) => {
                  const aberta = perguntaAberta === index;

                  return (
                    <div
                      key={item.pergunta}
                      className={`overflow-hidden rounded-2xl border bg-white transition ${
                        aberta
                          ? "border-[#AFC9EF] shadow-[0_8px_25px_rgba(53,99,167,0.07)]"
                          : "border-[#DCE8F5] hover:border-[#B9CDE8]"
                      }`}
                    >
                      <button
                        type="button"
                        aria-expanded={aberta}
                        onClick={() =>
                          setPerguntaAberta(aberta ? -1 : index)
                        }
                        className="flex w-full items-center justify-between gap-4 p-5 text-left"
                      >
                        <span className="text-sm font-extrabold leading-6 text-[#0B1756]">
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
                        <div className="border-t border-[#E6EDF7] px-5 pb-5 pt-4 text-sm leading-7 text-[#647EAE]">
                          {item.resposta}
                        </div>
                      )}
                    </div>
                  );
                })
              ) : (
                <div className="rounded-2xl border border-[#DCE8F5] bg-white p-6 text-center">
                  <MessageCircle
                    size={28}
                    className="mx-auto text-[#3563A7]"
                  />
                  <p className="mt-3 font-extrabold">
                    Nenhuma pergunta encontrada
                  </p>
                  <p className="mt-1 text-sm text-[#71829B]">
                    Tente buscar por outro termo.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
