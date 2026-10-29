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
      <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8z" />
    ),
    check: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="m8 12 2.5 2.5L16 9" />
      </>
    ),
    shield: (
      <>
        <path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11z" />
        <path d="m9 12 2 2 4-4" />
      </>
    ),
    activity: <path d="M22 12h-4l-3 9L9 3l-3 9H2" />,
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

const servicos = [
  {
  titulo: "Triagem",
  descricao: "Receba orientações para direcionar seu atendimento.",
  icon: "users",
  href: "/cliente/triagem",
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
    titulo: "Minhas consultas",
    descricao:
      "Consulte seus agendamentos e acompanhe seus próximos atendimentos.",
    icon: "calendar",
    href: "/cliente/consultas",
  }
];

const etapas = [
  {
    numero: "01",
    titulo: "Triagem",
    descricao:
      "Coleta de informações para orientar o atendimento conforme as necessidades do paciente.",
    icon: "users",
  },
  {
    numero: "02",
    titulo: "Fila de atendimento",
    descricao:
      "Organização da espera até o momento do atendimento na unidade de saúde.",
    icon: "clock",
  },
  {
    numero: "03",
    titulo: "Consulta",
    descricao:
      "Atendimento com o profissional de saúde para avaliação e orientações.",
    icon: "calendar",
  },
  {
    numero: "04",
    titulo: "Exames",
    descricao:
      "Consulta das informações e dos resultados disponibilizados ao paciente.",
    icon: "file",
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
        {/* BANNER PRINCIPAL — mantido */}
        <section className="grid items-center gap-8 lg:grid-cols-[1fr_1fr] lg:gap-4">
          <div className="max-w-[550px] lg:-translate-x-8">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/80 px-5 py-3 text-sm font-semibold text-[#023E8A] shadow-sm">
              <span className="h-2 w-2 rounded-full bg-[#3563A7]" />
              Área do paciente
            </div>

            <h1 className="mt-6 text-4xl font-extrabold leading-tight tracking-tight text-[#0B1756] sm:text-5xl md:text-5xl">
              Sua saúde,
              <br />
              <span className="text-[#023E8A]">mais perto de você.</span>
            </h1>

            <p className="mt-5 max-w-lg text-base leading-7 text-[#425875] sm:text-lg">
              Acesse seus serviços de saúde, acompanhe seus atendimentos e
              encontre informações importantes para cuidar melhor de você.
            </p>

            <a
              href="#meus-servicos"
              className="mt-7 inline-flex items-center gap-3 rounded-xl bg-[#023E8A] px-6 py-3.5 text-sm font-semibold text-white shadow-md transition hover:bg-[#0B1756]"
            >
              Acessar meus atendimentos
              <Icon name="arrow" className="h-4 w-4" />
            </a>
          </div>

          <div className="relative flex min-h-[300px] items-center justify-center sm:min-h-[380px] lg:min-h-[440px]">
            <div
              aria-hidden="true"
              className="absolute right-8 top-8 h-56 w-56 rounded-full bg-[#B8D6FC]/40 blur-2xl sm:h-72 sm:w-72"
            />

            <img
              src="/"
              alt="Profissionais de saúde em atendimento"
              className="relative z-10 max-h-[440px] w-full object-contain"
            />
          </div>
        </section>

        {/* RESUMO DA SAÚDE */}
        <section className="mt-12 grid gap-5 sm:grid-cols-2 sm:gap-6">
          <a
            href="/cliente/consultas"
            className="group flex items-center gap-5 rounded-[24px] border border-[#3563A7]/15 bg-white/80 p-5 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-md sm:p-6"
          >
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#EAF3F7] text-[#023E8A]">
              <Icon name="calendar" className="h-7 w-7" />
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-[#536783]">
                Acompanhe seus agendamentos
              </p>

              <h2 className="mt-1 text-lg font-extrabold text-[#0B1756] sm:text-xl">
                Próximas consultas
              </h2>
            </div>

            <Icon
              name="arrow"
              className="h-5 w-5 shrink-0 text-[#3563A7] transition-transform group-hover:translate-x-1"
            />
          </a>

          <a
            href="/cliente/exames"
            className="group flex items-center gap-5 rounded-[24px] border border-[#3563A7]/15 bg-white/80 p-5 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-md sm:p-6"
          >
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#EAF3F7] text-[#023E8A]">
              <Icon name="file" className="h-7 w-7" />
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-[#536783]">
                Consulte as informações disponíveis
              </p>

              <h2 className="mt-1 text-lg font-extrabold text-[#0B1756] sm:text-xl">
                Exames e resultados
              </h2>
            </div>

            <Icon
              name="arrow"
              className="h-5 w-5 shrink-0 text-[#3563A7] transition-transform group-hover:translate-x-1"
            />
          </a>
        </section>

        {/* MEUS SERVIÇOS */}
        <section
          id="meus-servicos"
          className="mt-16 scroll-mt-8 sm:mt-20"
        >
          <div>
            <span className="text-sm font-bold uppercase tracking-[0.16em] text-[#3563A7]">
              Acesse quando precisar
            </span>

            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-[#0B1756] sm:text-4xl">
              Meus serviços
            </h2>

            <p className="mt-3 max-w-2xl text-base leading-7 text-[#536783]">
              Encontre os recursos para consultar seus atendimentos e
              acompanhar suas informações de saúde.
            </p>
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

        {/* JORNADA DE SAÚDE */}
        <section className="mt-20 sm:mt-24">
          <div className="max-w-2xl">
            <span className="text-sm font-bold uppercase tracking-[0.16em] text-[#3563A7]">
              Entenda as etapas
            </span>

            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-[#0B1756] sm:text-4xl">
              Acompanhe sua jornada de saúde
            </h2>

            <p className="mt-4 text-base leading-7 text-[#536783]">
              Conheça as principais etapas que podem fazer parte do
              atendimento em uma unidade de saúde.
            </p>
          </div>

          <div className="relative mt-10 overflow-hidden rounded-[28px] border border-[#0B1756]/20 bg-[#0B1756] p-6 shadow-lg shadow-[#0B1756]/10 sm:p-9 lg:p-10">
            <div
              aria-hidden="true"
              className="absolute -right-16 -top-20 h-64 w-64 rounded-full border-[35px] border-white/[0.04]"
            />

            <div
              aria-hidden="true"
              className="absolute -bottom-24 left-[40%] h-48 w-48 rounded-full bg-[#3563A7]/20"
            />

            <div
              aria-hidden="true"
              className="absolute left-[12%] right-[12%] top-[73px] hidden h-[2px] bg-white/25 lg:block"
            />

            <div className="relative grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {etapas.map((etapa) => (
                <article
                  key={etapa.numero}
                  className="group flex flex-col items-center text-center"
                >
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-[#023E8A] shadow-md transition duration-300 group-hover:scale-110 group-hover:shadow-lg">
                    <Icon name={etapa.icon} className="h-7 w-7" />
                  </div>

                  <span className="mt-5 text-xs font-bold uppercase tracking-widest text-[#B8D6FC]">
                    Etapa {etapa.numero}
                  </span>

                  <h3 className="mt-2 text-lg font-bold text-white">
                    {etapa.titulo}
                  </h3>

                  <p className="mt-2 max-w-[230px] text-sm leading-6 text-white/75">
                    {etapa.descricao}
                  </p>
                </article>
              ))}
            </div>

            <div className="relative mt-9 border-t border-white/20 pt-5 text-center">
              <p className="text-xs leading-6 text-white/70">
                As etapas podem variar conforme a necessidade do paciente e
                os serviços oferecidos pela unidade de saúde.
              </p>
            </div>
          </div>
        </section>

{/* ORIENTAÇÕES AO PACIENTE */}
<section className="mt-20 sm:mt-24">
  <div className="mb-9">
    <span className="text-sm font-bold uppercase tracking-[0.16em] text-[#3563A7]">
      Cuidado e organização
    </span>

    <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-[#0B1756] sm:text-4xl">
      Orientações ao paciente
    </h2>

    <p className="mt-4 max-w-2xl text-base leading-7 text-[#536783]">
      Algumas dicas simples para ajudar você a se preparar para o atendimento.
    </p>
  </div>

  <div className="grid gap-8 md:grid-cols-3 md:gap-10">
    {/* Orientação 1 */}
    <article className="flex items-start gap-4">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/70 text-[#023E8A]">
        <Icon name="calendar" className="h-6 w-6" />
      </div>

      <div>
        <h3 className="text-lg font-bold text-[#0B1756]">
          Confira sua consulta
        </h3>

        <p className="mt-2 text-sm leading-6 text-[#536783]">
          Verifique a data, o horário e as orientações do seu agendamento
          antes de sair de casa.
        </p>
      </div>
    </article>

    {/* Orientação 2 */}
    <article className="flex items-start gap-4">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/70 text-[#023E8A]">
        <Icon name="check" className="h-6 w-6" />
      </div>

      <div>
        <h3 className="text-lg font-bold text-[#0B1756]">
          Tenha seus documentos
        </h3>

        <p className="mt-2 text-sm leading-6 text-[#536783]">
          Leve um documento de identificação e, se disponível, seu Cartão SUS.
        </p>
      </div>
    </article>

    {/* Orientação 3 */}
    <article className="flex items-start gap-4">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/70 text-[#023E8A]">
        <Icon name="file" className="h-6 w-6" />
      </div>

      <div>
        <h3 className="text-lg font-bold text-[#0B1756]">
          Organize seus exames
        </h3>

        <p className="mt-2 text-sm leading-6 text-[#536783]">
          Quando necessário, leve pedidos de exames, receitas e outros
          documentos relacionados ao atendimento.
        </p>
      </div>
    </article>
  </div>

  <p className="mt-8 border-t text-center border-[#3563A7]/15 pt-4 text-xs leading-5 text-[#536783]">
    Os documentos necessários podem variar conforme o serviço e a unidade de saúde.
  </p>
</section>

      </div>
    </main>
  );
}