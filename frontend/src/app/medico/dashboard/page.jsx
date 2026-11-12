
"use client";

const Icon = ({ name, className = "h-6 w-6" }) => {
  const icons = {
    calendar: (
      <>
        <rect x="3" y="5" width="18" height="16" rx="2" />
        <path d="M16 3v4M8 3v4M3 10h18" />
      </>
    ),
    users: (
      <>
        <path d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="10" cy="7" r="4" />
        <path d="M20 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
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
        <path d="M14 2v6h6M8 13h8M8 17h5" />
      </>
    ),
    activity: (
      <>
        <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
      </>
    ),
    arrow: (
      <>
        <path d="M5 12h14" />
        <path d="m12 5 7 7-7 7" />
      </>
    ),
    check: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="m8 12 2.5 2.5L16 9" />
      </>
    ),
    hospital: (
      <>
        <path d="M3 21h18M5 21V7h14v14M9 7V3h6v4" />
        <path d="M12 10v6M9 13h6" />
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

const indicadores = [
  {
    titulo: "Consultas de hoje",
    valor: "12",
    icon: "calendar",
  },
  {
    titulo: "Aguardando",
    valor: "04",
    icon: "clock",
  },
  {
    titulo: "Em atendimento",
    valor: "02",
    icon: "activity",
  },
  {
    titulo: "Concluídos",
    valor: "08",
    icon: "check",
  },
];

const pacientes = [
  {
    numero: "01",
    nome: "Maria Silva",
    iniciais: "MS",
    horario: "08:30",
    tipo: "Consulta médica",
    status: "Aguardando",
    cor: "bg-amber-50 text-amber-700",
  },
  {
    numero: "02",
    nome: "João Pereira",
    iniciais: "JP",
    horario: "08:45",
    tipo: "Retorno",
    status: "Aguardando",
    cor: "bg-amber-50 text-amber-700",
  },
  {
    numero: "03",
    nome: "Ana Costa",
    iniciais: "AC",
    horario: "09:00",
    tipo: "Consulta médica",
    status: "Em atendimento",
    cor: "bg-blue-50 text-blue-700",
  },
  {
    numero: "04",
    nome: "Carlos Lima",
    iniciais: "CL",
    horario: "09:15",
    tipo: "Avaliação clínica",
    status: "Aguardando",
    cor: "bg-amber-50 text-amber-700",
  },
];

const atalhos = [
  {
    titulo: "Fila de atendimento",
    descricao:
      "Visualize os pacientes que aguardam atendimento e organize a ordem da fila.",
    icon: "users",
    href: "/medico/fila",
  },
  {
    titulo: "Agenda de consultas",
    descricao:
      "Consulte os horários e acompanhe os atendimentos agendados.",
    icon: "calendar",
    href: "/medico/agenda",
  },
  {
    titulo: "Prontuários",
    descricao:
      "Acesse os registros clínicos dos pacientes autorizados.",
    icon: "file",
    href: "/medico/prontuarios",
  },
  {
    titulo: "Exames",
    descricao:
      "Consulte os exames disponíveis para acompanhamento clínico.",
    icon: "activity",
    href: "/medico/exames",
  },
];


function CartaoIndicador({ indicador, index }) {
  return (
    <article
      className="group relative overflow-hidden rounded-[24px] border border-[#3563A7]/30 bg-[#023E8A] p-6 shadow-md transition-all duration-500 ease-out hover:-translate-y-2 hover:bg-[#0B1756] hover:shadow-xl"
      style={{
        animation: "fadeIn 0.7s ease-out both",
        animationDelay: `${index * 0.15}s`,
      }}
    >
      {/* DETALHE DECORATIVO */}
      <div className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full border-[18px] border-white/[0.06] transition-transform duration-700 group-hover:scale-125" />

      <div className="relative z-10 flex items-start justify-between gap-3">
        <div>
          <p className="max-w-[170px] text-sm font-medium leading-relaxed text-white/80">
            {indicador.titulo}
          </p>

          <h3 className="mt-5 text-4xl font-extrabold leading-none tracking-tight text-white transition-all duration-300 group-hover:scale-105">
            {indicador.valor}
          </h3>
        </div>

        {/* ÍCONE */}
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/15 text-white transition-all duration-500 group-hover:rotate-6 group-hover:scale-110 group-hover:bg-white/25">
          <Icon name={indicador.icon} className="h-7 w-7" />
        </div>
      </div>
    </article>
  );
}



export default function DashboardMedico() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#EAF3F7] text-[#0B1756]">
      {/* CÍRCULOS DECORATIVOS DO FUNDO */}

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

      {/* CONTAINER PRINCIPAL — MESMAS MARGENS DO DASHBOARD DO PACIENTE */}

      <div className="relative z-10 mx-auto w-full max-w-[1480px] px-6 pb-16 pt-14 sm:px-6 md:pb-20 md:pt-20 xl:px-8">
        {/* BANNER PRINCIPAL */}

        <section className="grid items-center gap-8 lg:grid-cols-[1fr_0.9fr] lg:gap-8">
          <div className="max-w-[570px] lg:-translate-x-1 lg:-translate-y-9">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/80 px-5 py-3 text-sm font-semibold text-[#023E8A] shadow-sm">
              <span className="h-2 w-2 rounded-full bg-[#3563A7]" />
              Área do profissional
            </div>

            <h1 className="mt-6 text-4xl font-extrabold leading-tight tracking-tight text-[#0B1756] sm:text-5xl md:text-5xl">
              Cuidar melhor,
              <br />
              <span className="text-[#023E8A]">
                com tudo em seu lugar.
              </span>
            </h1>

            <p className="mt-5 max-w-lg text-base leading-7 text-[#425875] sm:text-lg">
              Acompanhe seus atendimentos, organize sua agenda e
              acesse as informações dos pacientes em um só lugar.
            </p>

            <a
              href="/medico/pacientes"
              className="mt-7 inline-flex items-center gap-3 rounded-xl bg-[#023E8A] px-6 py-3.5 text-sm font-semibold text-white shadow-md transition hover:bg-[#0B1756]"
            >
              Ver fila todos os pacientes
              <Icon name="arrow" className="h-4 w-4" />
            </a>
          </div>

          {/* IMAGEM ADMINISTRATIVA */}
     
<div className="relative min-h-[400px] w-full lg:min-h-[520px] lg:w-[150%] lg:-ml-[50%] lg:translate-x-2 lg:-translate-y-20">
  <img
    src="/img-dashboard-medico.jpg"
    alt="Profissional de saúde, painel de fila de atendimento e QR Code"
    className="absolute inset-0 h-full w-full object-cover object-right"
    style={{
      maskImage:
        "linear-gradient(to right, transparent 0%, black 30%, black 94%, transparent 100%)",
      WebkitMaskImage:
        "linear-gradient(to right, transparent 0%, black 30%, black 94%, transparent 100%)",
    }}
  />
</div>
        </section>

        

{/* INDICADORES PRINCIPAIS */}
<section className="mt-6">
  <div className="mb-7">
    <h2 className="text-xl font-extrabold text-[#0B1756] sm:text-3xl">
      Indicadores de atendimento
    </h2>

    <p className="mt-3 max-w-2xl text-base leading-7 text-[#536783]">
      Os números essenciais para acompanhar o dia.
    </p>
  </div>

  <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
    {indicadores.map((indicador, index) => (
      <CartaoIndicador
        key={indicador.titulo}
        indicador={indicador}
        index={index}
      />
    ))}
  </div>
</section>


   {/* AGENDA DO DIA */}

<section className="mt-16 sm:mt-20">
  {/* CABEÇALHO */}
  <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
    <div>

      <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-[#0B1756] sm:text-4xl">
        Agenda do dia
      </h2>

      <p className="mt-2 text-base leading-7 text-[#536783]">
        Organize os horários e acompanhe sua programação de consultas.
      </p>
    </div>

    <div className="flex w-fit items-center gap-3 rounded-2xl border border-[#3563A7]/15 bg-white/80 px-4 py-3">
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#D9EBFF] text-[#023E8A]">
        <Icon name="check" className="h-6 w-6" />
      </div>

      <div>
        <p className="text-xs font-medium text-[#536783]">
          Programação
        </p>
        <p className="text-sm font-extrabold text-[#0B1756]">
          Sábado, 31 de outubro
        </p>
      </div>
    </div>
  </div>

  
{/* CONTEÚDO DA AGENDA */}
<div className="mt-8 grid items-stretch gap-6 lg:grid-cols-[250px_minmax(0,1fr)]">

  {/* RESUMO LATERAL */}
  <aside className="flex flex-col gap-4 lg:h-full">

    {/* CONSULTAS PROGRAMADAS */}
    <div className="flex flex-1 flex-col justify-center rounded-[24px] bg-[#023E8A] p-6 text-white shadow-lg shadow-[#023E8A]/10">
      <p className="text-sm font-medium text-white/75">
        Consultas programadas
      </p>

      <div className="mt-3 flex items-end gap-2">
        <span className="text-5xl font-extrabold tracking-tight">
          12
        </span>
        <span className="mb-1 text-sm text-white/75">
          hoje
        </span>
      </div>

      <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-white/20">
        <div className="h-full w-2/3 rounded-full bg-white" />
      </div>

      <p className="mt-3 text-xs text-white/75">
        8 de 12 consultas concluídas
      </p>
    </div>

    {/* SITUAÇÃO DOS ATENDIMENTOS */}
    <div className="flex flex-1 flex-col justify-center rounded-[24px] border border-[#3563A7]/15 bg-white/85 p-5">
      <p className="text-sm font-bold text-[#0B1756]">
        Situação dos atendimentos
      </p>

      <div className="mt-5 space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
            <span className="text-sm text-[#536783]">
              Concluídas
            </span>
          </div>
          <span className="font-bold text-[#0B1756]">08</span>
        </div>

        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="h-2.5 w-2.5 rounded-full bg-[#023E8A]" />
            <span className="text-sm text-[#536783]">
              Em atendimento
            </span>
          </div>
          <span className="font-bold text-[#0B1756]">02</span>
        </div>

        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="h-2.5 w-2.5 rounded-full bg-amber-500" />
            <span className="text-sm text-[#536783]">
              Aguardando
            </span>
          </div>
          <span className="font-bold text-[#0B1756]">02</span>
        </div>
      </div>
    </div>

    {/* PRÓXIMOS ATENDIMENTOS */}
    <div className="flex flex-1 flex-col justify-center rounded-[24px] border border-[#3563A7]/15 bg-white/85 p-5">
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm font-bold text-[#0B1756]">
          Próximos atendimentos
        </p>

        <span className="rounded-full bg-[#EAF3F7] px-3 py-1 text-xs font-bold text-[#3563A7]">
          Hoje
        </span>
      </div>

      <div className="mt-5 space-y-4">
        {[
          {
            horario: "09:30",
            nome: "Carlos Lima",
            tipo: "Avaliação clínica",
          },
          {
            horario: "10:00",
            nome: "Beatriz Souza",
            tipo: "Consulta médica",
          },
        ].map((item) => (
          <div
            key={item.horario}
            className="flex items-center gap-3"
          >
            <div className="rounded-xl bg-[#EAF3F7] px-3 py-2">
              <span className="text-sm font-extrabold text-[#023E8A]">
                {item.horario}
              </span>
            </div>

            <div className="min-w-0">
              <p className="text-sm font-bold text-[#0B1756]">
                {item.nome}
              </p>
              <p className="mt-0.5 text-xs text-[#536783]">
                {item.tipo}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>

  </aside>

  {/* LINHA DO TEMPO */}
  <div className="h-full min-w-0 rounded-[24px] border border-[#3563A7]/15 bg-white/85 p-5 shadow-sm sm:p-7">

    <div className="flex flex-col gap-2 border-b border-[#3563A7]/10 pb-5 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h3 className="text-lg font-extrabold text-[#0B1756]">
          Horários programados
        </h3>
        <p className="mt-1 text-sm text-[#536783]">
          Acompanhe a sequência das consultas.
        </p>
      </div>

      <span className="w-fit rounded-full bg-[#EAF3F7] px-3 py-1.5 text-xs font-bold text-[#3563A7]">
        08:00 — 10:00
      </span>
    </div>

    <div className="mt-5">
      {[
        {
          horario: "08:00",
          nome: "Maria Silva",
          tipo: "Consulta de rotina",
          status: "Concluída",
          cor: "bg-emerald-50 text-emerald-700",
          marcador: "bg-emerald-500",
          borda: "border-l-emerald-500",
        },
        {
          horario: "08:30",
          nome: "João Pereira",
          tipo: "Consulta de retorno",
          status: "Concluída",
          cor: "bg-emerald-50 text-emerald-700",
          marcador: "bg-emerald-500",
          borda: "border-l-emerald-500",
        },
        {
          horario: "09:00",
          nome: "Ana Costa",
          tipo: "Consulta médica",
          status: "Em atendimento",
          cor: "bg-blue-50 text-blue-700",
          marcador: "bg-[#023E8A]",
          borda: "border-l-[#023E8A]",
        },
        {
          horario: "09:30",
          nome: "Carlos Lima",
          tipo: "Avaliação clínica",
          status: "Aguardando",
          cor: "bg-amber-50 text-amber-700",
          marcador: "bg-amber-500",
          borda: "border-l-amber-500",
        },
        {
          horario: "10:00",
          nome: "Beatriz Souza",
          tipo: "Consulta médica",
          status: "Agendada",
          cor: "bg-[#EAF3F7] text-[#3563A7]",
          marcador: "bg-[#B8D6FC]",
          borda: "border-l-[#B8D6FC]",
        },
      ].map((consulta, index) => (
        <div
          key={consulta.horario}
          className="grid grid-cols-[60px_minmax(0,1fr)] gap-3 sm:grid-cols-[72px_minmax(0,1fr)] sm:gap-5"
        >
          {/* HORÁRIO E MARCADOR */}
          <div className="relative flex flex-col items-center">
            <span className="pt-4 text-sm font-extrabold text-[#023E8A] sm:text-base">
              {consulta.horario}
            </span>

            <span
              className={`relative z-10 mt-3 h-3 w-3 rounded-full ${consulta.marcador} ring-4 ring-white`}
            />

            {index !== 4 && (
              <span className="absolute bottom-0 top-[62px] w-px bg-[#D9E7F5]" />
            )}
          </div>

          {/* BLOCO DA CONSULTA */}
          <div
            className={`mb-4 min-w-0 rounded-xl border border-[#3563A7]/10 border-l-4 ${consulta.borda} bg-white px-4 py-4 transition hover:shadow-sm sm:px-5`}
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <p className="truncate font-bold text-[#0B1756]">
                  {consulta.nome}
                </p>

                <p className="mt-1 text-sm text-[#536783]">
                  {consulta.tipo}
                </p>
              </div>

              <span
                className={`w-fit shrink-0 rounded-lg px-2.5 py-1.5 text-xs font-bold ${consulta.cor}`}
              >
                {consulta.status}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>

</div>


  {/* COMUNICADOS DA UNIDADE */}
<section
  id="fila"
  className="relative mt-8 overflow-hidden rounded-3xl bg-[#0B1756] px-6 py-9 text-white sm:px-9 sm:py-11 lg:px-10"
>
  {/* ELEMENTOS DECORATIVOS */}
  <div className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full border-[35px] border-white/[0.04]" />

  <div className="pointer-events-none absolute -bottom-24 left-[38%] h-56 w-56 rounded-full bg-[#3563A7]/20" />

  <div className="pointer-events-none absolute right-[22%] top-1/2 h-36 w-36 -translate-y-1/2 rounded-full border border-white/[0.06]" />

  <div className="relative z-10">
    {/* CABEÇALHO */}
    <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
      <div>
        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-3 py-1.5 text-xs font-semibold tracking-wide text-[#B8D6FC]">
          <span className="h-2 w-2 rounded-full bg-[#7DB7FF]" />
          INFORMAÇÕES DA UNIDADE
        </div>

        <h2 className="mt-5 text-3xl font-extrabold tracking-tight sm:text-4xl">
          Comunicados
          <br />
          <span className="text-[#8CBFFF]">importantes.</span>
        </h2>

        <p className="mt-4 max-w-xl text-sm leading-7 text-white/65 sm:text-base">
          Fique por dentro das orientações, atualizações e novidades
          que ajudam você a cuidar melhor dos seus pacientes.
        </p>
      </div>

    </div>

    {/* COMUNICADO EM DESTAQUE */}
    <div className="mt-9 rounded-2xl border border-white/10 bg-white/[0.07] p-5 sm:p-6">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
        

        <div className="flex-1">

          <h3 className="mt-3 text-lg font-bold sm:text-xl">
            Orientações para a equipe de atendimento
          </h3>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-white/65">
            Consulte as orientações e atualizações divulgadas pela
            coordenação para acompanhar as informações importantes
            da unidade.
          </p>
        </div>
      </div>
    </div>

    {/* OUTROS COMUNICADOS */}
<div className="mt-6">
  <h3 className="mb-1 text-xs font-bold uppercase tracking-[0.16em] text-white/45">
    Outros avisos
  </h3>

  <div className="divide-y divide-white/10">
    <article className="flex items-center gap-3 py-3">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#3563A7]/25 text-[#8CBFFF]">
        <Icon name="calendar" className="h-4 w-4" />
      </div>

      <div className="min-w-0 flex-1">
        <h4 className="text-sm font-semibold text-white">
          Organização dos atendimentos
        </h4>
        <p className="mt-0.5 text-xs leading-5 text-white/55">
          Orientações sobre a programação dos atendimentos.
        </p>
      </div>

      <span className="hidden text-[11px] text-white/40 sm:block">
        Unidade
      </span>
    </article>

    <article className="flex items-center gap-3 py-3">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#3563A7]/25 text-[#8CBFFF]">
        <Icon name="file" className="h-4 w-4" />
      </div>

      <div className="min-w-0 flex-1">
        <h4 className="text-sm font-semibold text-white">
          Protocolos e orientações
        </h4>
        <p className="mt-0.5 text-xs leading-5 text-white/55">
          Informações e procedimentos atualizados.
        </p>
      </div>

      <span className="hidden text-[11px] text-white/40 sm:block">
        Orientação
      </span>
    </article>

    <article className="flex items-center gap-3 py-3 last:pb-0">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#3563A7]/25 text-[#8CBFFF]">
        <Icon name="activity" className="h-4 w-4" />
      </div>

      <div className="min-w-0 flex-1">
        <h4 className="text-sm font-semibold text-white">
          Campanhas de saúde
        </h4>
        <p className="mt-0.5 text-xs leading-5 text-white/55">
          Campanhas de prevenção e ações da unidade.
        </p>
      </div>

      <span className="hidden text-[11px] text-white/40 sm:block">
        Saúde
      </span>
    </article>
  </div>
</div>
  </div>
</section>
</section>
      </div>
    </main>
  );
}
