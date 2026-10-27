"use client";

const Icon = ({ name, className = "h-6 w-6" }) => {
  const icons = {
    calendar: (
      <>
        <rect x="3" y="5" width="18" height="16" rx="2" />
        <path d="M16 3v4M8 3v4M3 10h18" />
        <path d="m9 15 2 2 4-4" />
      </>
    ),
    clock: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
      </>
    ),
    file: (
      <>
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <path d="M14 2v6h6M8 13h8M8 17h8" />
      </>
    ),
    bell: (
      <>
        <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
        <path d="M10 21h4" />
      </>
    ),
    arrow: (
      <>
        <path d="M5 12h14" />
        <path d="m12 5 7 7-7 7" />
      </>
    ),
    users: (
      <>
        <path d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="10" cy="7" r="4" />
        <path d="M20 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
      </>
    ),
    heart: (
      <>
        <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8z" />
      </>
    ),
    check: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="m8 12 2.5 2.5L16 9" />
      </>
    ),
    map: (
      <>
        <path d="m3 6 6-3 6 3 6-3v15l-6 3-6-3-6 3z" />
        <path d="M9 3v15M15 6v15" />
      </>
    ),
    shield: (
      <>
        <path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11z" />
        <path d="m9 12 2 2 4-4" />
      </>
    ),
    activity: (
      <>
        <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
      </>
    ),
  };

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {icons[name]}
    </svg>
  );
};

const beneficios = [
  {
    icon: "calendar",
    titulo: "Mais organização",
    descricao:
      "Encontre informações sobre seus atendimentos e consulte seus agendamentos em um só lugar.",
  },
  {
    icon: "activity",
    titulo: "Mais acompanhamento",
    descricao:
      "Acompanhe informações sobre consultas, filas e exames disponibilizados para você.",
  },
  {
    icon: "shield",
    titulo: "Mais praticidade",
    descricao:
      "Acesse os serviços disponíveis na plataforma de maneira simples e organizada.",
  },
];

const servicos = [
  {
    titulo: "Minhas consultas",
    descricao:
      "Consulte seus agendamentos e acompanhe seus próximos atendimentos.",
    icon: "calendar",
    href: "/cliente/consultas",
  },
  {
    titulo: "Fila de atendimento",
    descricao:
      "Acompanhe sua posição na fila e consulte atualizações do atendimento.",
    icon: "clock",
    href: "/cliente/fila",
  },
  {
    titulo: "Exames e resultados",
    descricao:
      "Consulte informações sobre seus exames e os resultados disponíveis.",
    icon: "file",
    href: "/cliente/exames",
  },
  {
    titulo: "Meu histórico",
    descricao:
      "Acesse informações sobre os atendimentos que você já realizou.",
    icon: "heart",
    href: "/cliente/historico",
  },
];

export default function DashboardCliente() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#EAF3F7] text-[#0B1756]">
      {/* Círculos decorativos do fundo */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-28 -top-36 h-[430px] w-[430px] rounded-full bg-[#3563A7]/20"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-40 top-10 h-[330px] w-[330px] rounded-full border-2 border-[#3563A7]/30"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-36 -left-24 h-[350px] w-[350px] rounded-full bg-white/50"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-40 -right-24 h-[430px] w-[430px] rounded-full border-[70px] border-[#3563A7]/25"
      />

      <div className="relative z-10 mx-auto max-w-[1440px] px-5 pb-16 pt-14 sm:px-6 md:px-10 md:pb-20 md:pt-20 lg:px-14">
        {/* Banner principal */}
        <section className="grid items-center gap-8 lg:grid-cols-[1fr_1fr] lg:gap-4">
          <div className="max-w-[550px] lg:-translate-x-8">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/80 px-5 py-3 text-sm font-semibold text-[#023E8A] shadow-sm">
              <span className="h-2 w-2 rounded-full bg-[#3563A7]" />
              Área do paciente
            </div>

            <h1 className="mt-6 text-4xl font-extrabold leading-tight tracking-tight text-[#0B1756] sm:text-5xl md:text-5xl">
              Sua saúde,
              <br />
              <span className="text-[#023E8A]">
                mais perto de você.
              </span>
            </h1>

            <p className="mt-5 max-w-lg text-base leading-7 text-[#425875] sm:text-lg">
              Acesse seus serviços de saúde, acompanhe seus atendimentos
              e encontre informações importantes para cuidar melhor de você.
            </p>

            <a
              href="#meus-servicos"
              className="mt-7 inline-flex items-center gap-3 rounded-xl bg-[#023E8A] px-6 py-3.5 text-sm font-semibold text-white shadow-md transition hover:bg-[#0B1756]"
            >
              Acessar meus atendimentos
            </a>
          </div>

          {/* Imagem do banner: coloque seu arquivo na pasta public */}
          <div className="relative flex min-h-[300px] items-center justify-center sm:min-h-[380px] lg:min-h-[440px]">
            <div
              aria-hidden="true"
              className="absolute right-8 top-8 h-56 w-56 rounded-full bg-[#B8D6FC]/40 blur-2xl sm:h-72 sm:w-72"
            />

            <img
              src="/imagem-cliente.png"
              alt="Profissionais de saúde em atendimento"
              className="relative z-10 max-h-[440px] w-full object-contain"
            />
          </div>
        </section>


{/* Informações da plataforma */}
<section className="relative mt-20 overflow-hidden rounded-[30px] bg-[#0B1756] p-7 shadow-lg shadow-[#0B1756]/10 sm:mt-24 sm:p-10 lg:p-12">
  {/* Elementos decorativos */}
  <div
    aria-hidden="true"
    className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full border-[45px] border-white/5"
  />

  <div
    aria-hidden="true"
    className="pointer-events-none absolute -bottom-28 left-1/3 h-64 w-64 rounded-full bg-[#3563A7]/20 blur-2xl"
  />

  <div className="relative z-10 grid items-center gap-10 lg:grid-cols-[1fr_1fr] lg:gap-14">
    {/* Texto principal */}
    <div>
      <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-[#B8D6FC]">
        <Icon name="heart" className="h-4 w-4" />
        UneSUS para você
      </span>

      <h2 className="mt-5 max-w-xl text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-4xl">
        Mais facilidade para acompanhar sua{" "}
        <span className="text-[#B8D6FC]">saúde.</span>
      </h2>

      <p className="mt-5 max-w-xl text-base leading-7 text-white/75">
        Encontre em um só lugar os principais recursos para consultar
        seus atendimentos e acompanhar as informações disponibilizadas
        pela unidade de saúde.
      </p>

      <a
        href="#meus-servicos"
        className="mt-7 inline-flex items-center gap-3 rounded-xl bg-white px-6 py-3.5 text-sm font-bold text-[#0B1756] shadow-sm transition duration-200 hover:-translate-y-0.5 hover:bg-[#EAF3F7] hover:shadow-md"
      >
        Explorar meus serviços
        <Icon name="arrow" className="h-4 w-4" />
      </a>
    </div>

    {/* Recursos disponíveis */}
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="rounded-[22px] border border-white/10 bg-white/[0.08] p-5 transition duration-200 hover:bg-white/[0.13]">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-[#023E8A]">
          <Icon name="calendar" className="h-6 w-6" />
        </div>

        <h3 className="mt-5 text-base font-bold text-white">
          Consultas
        </h3>

        <p className="mt-2 text-sm leading-6 text-white/70">
          Consulte seus agendamentos e próximos atendimentos.
        </p>
      </div>

      <div className="rounded-[22px] border border-white/10 bg-white/[0.08] p-5 transition duration-200 hover:bg-white/[0.13]">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-[#023E8A]">
          <Icon name="clock" className="h-6 w-6" />
        </div>

        <h3 className="mt-5 text-base font-bold text-white">
          Fila de atendimento
        </h3>

        <p className="mt-2 text-sm leading-6 text-white/70">
          Acompanhe sua posição e as atualizações disponíveis.
        </p>
      </div>

      <div className="rounded-[22px] border border-white/10 bg-white/[0.08] p-5 transition duration-200 hover:bg-white/[0.13]">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-[#023E8A]">
          <Icon name="file" className="h-6 w-6" />
        </div>

        <h3 className="mt-5 text-base font-bold text-white">
          Exames
        </h3>

        <p className="mt-2 text-sm leading-6 text-white/70">
          Consulte informações e resultados disponibilizados.
        </p>
      </div>

      <div className="rounded-[22px] border border-white/10 bg-white/[0.08] p-5 transition duration-200 hover:bg-white/[0.13]">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-[#023E8A]">
          <Icon name="heart" className="h-6 w-6" />
        </div>

        <h3 className="mt-5 text-base font-bold text-white">
          Histórico
        </h3>

        <p className="mt-2 text-sm leading-6 text-white/70">
          Acesse informações sobre atendimentos anteriores.
        </p>
      </div>
    </div>
  </div>
</section>


{/* Jornada de saúde */}
<section className="mt-20 sm:mt-24">
  {/* Título */}
  <div className="max-w-2xl">
    <span className="text-sm font-bold uppercase tracking-[0.16em] text-[#3563A7]">
      Entenda as etapas
    </span>

    <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-[#0B1756] sm:text-4xl">
      Acompanhe sua jornada de saúde
    </h2>

    <p className="mt-4 text-base leading-7 text-[#536783]">
      Conheça as principais etapas do atendimento e entenda como cada uma
      contribui para um cuidado mais organizado.
    </p>
  </div>

  {/* Card principal */}
  <div className="relative mt-10 animate-[fadeInUp_0.7s_ease-out_both] overflow-hidden rounded-[28px] border border-[#0B1756]/20 bg-[#0B1756] p-6 shadow-lg shadow-[#0B1756]/10 sm:p-9 lg:p-10">

    {/* Linha que conecta as etapas */}
    <div
      aria-hidden="true"
      className="absolute left-[12%] right-[12%] top-[73px] hidden h-[2px] bg-white/25 lg:block"
    />

    <div className="relative grid gap-8 sm:grid-cols-2 lg:grid-cols-4">

      {/* Etapa 1 */}
      <div className="group flex animate-[fadeInUp_0.6s_ease-out_0.1s_both] flex-col items-center text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-[#023E8A] shadow-md transition duration-300 ease-out group-hover:scale-110 group-hover:shadow-lg">
          <Icon name="users" className="h-7 w-7" />
        </div>

        <span className="mt-5 text-xs font-bold uppercase tracking-widest text-[#B8D6FC]">
          Etapa 01
        </span>

        <h3 className="mt-2 text-lg font-bold text-white">
          Triagem
        </h3>

        <p className="mt-2 max-w-[230px] text-sm leading-6 text-white/75">
          Coleta de informações para orientar o atendimento conforme as
          necessidades do paciente.
        </p>
      </div>

      {/* Etapa 2 */}
      <div className="group flex animate-[fadeInUp_0.6s_ease-out_0.25s_both] flex-col items-center text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-[#023E8A] shadow-md transition duration-300 ease-out group-hover:scale-110 group-hover:shadow-lg">
          <Icon name="clock" className="h-7 w-7" />
        </div>

        <span className="mt-5 text-xs font-bold uppercase tracking-widest text-[#B8D6FC]">
          Etapa 02
        </span>

        <h3 className="mt-2 text-lg font-bold text-white">
          Fila de atendimento
        </h3>

        <p className="mt-2 max-w-[230px] text-sm leading-6 text-white/75">
          Acompanhamento da posição na fila e das informações disponíveis
          sobre a espera.
        </p>
      </div>

      {/* Etapa 3 */}
      <div className="group flex animate-[fadeInUp_0.6s_ease-out_0.4s_both] flex-col items-center text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-[#023E8A] shadow-md transition duration-300 ease-out group-hover:scale-110 group-hover:shadow-lg">
          <Icon name="calendar" className="h-7 w-7" />
        </div>

        <span className="mt-5 text-xs font-bold uppercase tracking-widest text-[#B8D6FC]">
          Etapa 03
        </span>

        <h3 className="mt-2 text-lg font-bold text-white">
          Consulta
        </h3>

        <p className="mt-2 max-w-[230px] text-sm leading-6 text-white/75">
          Atendimento com o profissional de saúde para avaliação e
          orientações ao paciente.
        </p>
      </div>

      {/* Etapa 4 */}
      <div className="group flex animate-[fadeInUp_0.6s_ease-out_0.55s_both] flex-col items-center text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-[#023E8A] shadow-md transition duration-300 ease-out group-hover:scale-110 group-hover:shadow-lg">
          <Icon name="file" className="h-7 w-7" />
        </div>

        <span className="mt-5 text-xs font-bold uppercase tracking-widest text-[#B8D6FC]">
          Etapa 04
        </span>

        <h3 className="mt-2 text-lg font-bold text-white">
          Exames
        </h3>

        <p className="mt-2 max-w-[230px] text-sm leading-6 text-white/75">
          Consulta das informações e dos resultados de exames
          disponibilizados ao paciente.
        </p>
      </div>
    </div>

    {/* Observação */}
    <div className="mt-9 border-t border-white/20 pt-5 text-center">
      <p className="text-sm leading-6 text-white/70">
        As etapas podem variar de acordo com a necessidade do paciente e
        os serviços oferecidos pela unidade de saúde.
      </p>
    </div>
  </div>
</section>



       {/* Serviços do cliente */}
<section id="meus-servicos" className="mt-15 scroll-mt-8 sm:mt-15">
  <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
    <div>
      <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-[#0B1756] sm:text-4xl">
        Meus serviços
      </h2>

      <p className="mt-3 max-w-2xl text-base leading-7 text-[#536783]">
        Acesse as funcionalidades disponíveis para acompanhar seus
        atendimentos e suas informações de saúde.
      </p>
    </div>
  </div>

  <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
    {servicos.map((servico) => (
      <a
        key={servico.titulo}
        href={servico.href}
        className="group flex min-h-[250px] flex-col rounded-[24px] border border-[#3563A7]/30 bg-[#023E8A] p-6 shadow-md transition duration-200 hover:-translate-y-1 hover:bg-[#0B1756] hover:shadow-xl"
      >
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 text-white transition group-hover:bg-white/25">
          <Icon name={servico.icon} className="h-7 w-7" />
        </div>

        <h3 className="mt-6 text-lg font-bold text-white">
          {servico.titulo}
        </h3>

        <p className="mt-2 flex-1 text-sm leading-6 text-white/80">
          {servico.descricao}
        </p>

        <div className="mt-5 flex items-center gap-2 text-sm font-semibold text-white">
          Acessar serviço
          <Icon
            name="arrow"
            className="h-4 w-4 transition-transform group-hover:translate-x-1"
          />
        </div>
      </a>
    ))}
  </div>
</section>

        {/* Orientação ao paciente */}
        <section className="mt-16 rounded-[28px] border border-white/80 bg-white/75 p-6 shadow-sm sm:p-9">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#EAF3F7] text-[#023E8A]">
              <Icon name="map" className="h-7 w-7" />
            </div>

            <div className="flex-1">
              <h2 className="text-xl font-bold text-[#0B1756] sm:text-2xl">
                Precisa encontrar um serviço de saúde?
              </h2>

              <p className="mt-2 max-w-3xl text-sm leading-6 text-[#536783] sm:text-base">
                Consulte as unidades disponíveis e confira os serviços
                oferecidos para encontrar informações sobre o atendimento
                de que você precisa.
              </p>
            </div>

            <a
              href="/cliente/unidades"
              className="inline-flex shrink-0 items-center justify-center gap-2 self-start rounded-xl border border-[#023E8A]/20 bg-white px-5 py-3 text-sm font-semibold text-[#023E8A] transition hover:bg-[#EAF3F7] sm:self-center"
            >
              Consultar unidades
              <Icon name="arrow" className="h-4 w-4" />
            </a>
          </div>
        </section>
      </div>
    </main>
  );
}