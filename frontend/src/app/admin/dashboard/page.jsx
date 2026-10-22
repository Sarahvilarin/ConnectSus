
const indicadores = [
  {
    titulo: "Atendimentos hoje",
    valor: "248",
    descricao: "Total registrado no dia",
    icone: "users",
  },
  {
    titulo: "Pacientes aguardando",
    valor: "32",
    descricao: "Na fila de atendimento",
    icone: "clock",
  },
  {
    titulo: "Em atendimento",
    valor: "18",
    descricao: "Atendimentos em andamento",
    icone: "activity",
  },
  {
    titulo: "Tempo médio de espera",
    valor: "24 min",
    descricao: "Média de espera dos pacientes",
    icone: "timer",
  },
];

const unidades = [
  { nome: "UBS Centro", total: 96, status: "Fila elevada" },
  { nome: "UBS Norte", total: 72, status: "Em andamento" },
  { nome: "UBS Sul", total: 54, status: "Normal" },
];

function Icone({ tipo, className = "h-6 w-6" }) {
  const props = {
    className,
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    viewBox: "0 0 24 24",
    "aria-hidden": true,
  };

  const desenhos = {
    users: (
      <>
        <circle cx="9" cy="8" r="3" />
        <path d="M3 20v-2a6 6 0 0 1 12 0v2z" />
        <path d="M16 5a3 3 0 0 1 0 6M18 14a5 5 0 0 1 3 4.5V20" />
      </>
    ),
    clock: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
      </>
    ),
    activity: (
      <>
        <path d="M3 12h4l3-8 4 16 3-8h4" />
      </>
    ),
    timer: (
      <>
        <circle cx="12" cy="13" r="8" />
        <path d="M10 2h4M12 5v2M12 13l3-3" />
      </>
    ),
    hospital: (
      <>
        <path d="M3 21h18M5 21V7h14v14M9 7V3h6v4" />
        <path d="M12 9v5M9.5 11.5h5M9 17h2M14 17h2" />
      </>
    ),
    bell: (
      <>
        <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
        <path d="M10 21h4" />
      </>
    ),
    check: (
      <>
        <path d="m5 12 4 4L19 6" />
        <circle cx="12" cy="12" r="10" />
      </>
    ),
    shield: (
      <>
        <path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11z" />
        <path d="m9 12 2 2 4-4" />
      </>
    ),
  };

  return <svg {...props}>{desenhos[tipo]}</svg>;
}

function CartaoIndicador({ indicador }) {
  return (
    <article className="rounded-2xl border border-[#3563A7]/10 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-md sm:p-6">
      <div className="flex items-start justify-between gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#EAF3F7] text-[#023E8A] sm:h-14 sm:w-14">
          <Icone tipo={indicador.icone} className="h-7 w-7" />
        </div>

        <span className="rounded-full bg-[#EAF3F7] px-3 py-1 text-xs font-semibold text-[#3563A7]">
          Hoje
        </span>
      </div>

      <p className="mt-5 text-sm font-medium text-[#0B1756]/65">
        {indicador.titulo}
      </p>

      <p className="mt-2 text-3xl font-extrabold tracking-tight text-[#0B1756] sm:text-4xl">
        {indicador.valor}
      </p>

      <p className="mt-2 text-xs leading-relaxed text-[#0B1756]/55 sm:text-sm">
        {indicador.descricao}
      </p>
    </article>
  );
}

export default function DashboardAdmin() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#EAF3F7] text-[#0B1756]">
      
{/* Fundo com ilustrações de círculos */}
<div className="pointer-events-none absolute -right-28 -top-36 h-[430px] w-[430px] rounded-full bg-[#B8D6FC]/50" />

<div className="pointer-events-none absolute -left-40 top-10 h-[330px] w-[330px] rounded-full border-2 border-[#C8DEFF]/60" />

<div className="pointer-events-none absolute -bottom-36 -left-24 h-[350px] w-[350px] rounded-full bg-white/50" />

<div className="pointer-events-none absolute -bottom-40 -right-24 h-[430px] w-[430px] rounded-full border-[70px] border-[#C5DFFF]/50" />


      <div className="relative z-10 mx-auto max-w-[1600px] space-y-8 px-5 py-7 sm:px-8 sm:py-10 lg:px-12">
        {/* BANNER ADMINISTRATIVO */}
        <section className="relative isolate overflow-hidden rounded-[28px] bg-gradient-to-r from-[#D9EBFF] via-[#EDF6FF] to-white shadow-sm">

          <div className="relative grid min-h-[260px] items-center gap-6 px-6 py-9 sm:px-10 md:min-h-[290px] md:px-12 lg:grid-cols-[1.2fr_0.8fr] lg:px-14">
            {/* Texto */}
            <div className="relative z-10 max-w-2xl lg:translate-x-8">
              <div className="mb-6 inline-flex items-center gap-3 rounded-full bg-white/80 px-5 py-3 text-sm font-semibold text-[#023E8A] shadow-sm">
  <span className="h-3 w-3 rounded-full bg-[#3563A7]" />
  Área administrativa
</div>

              <h1 className="mt-5 max-w-xl text-3xl font-extrabold leading-tight tracking-tight text-[#0B1756] sm:text-4xl md:text-5xl">
                Gestão inteligente,
                <br />
                <span className="text-[#023E8A]">
                  cuidado mais eficiente.
                </span>
              </h1>

              <p className="mt-12 max-w-lg text-base leading-relaxed text-[#0B1756]/70 sm:text-lg">
                Acompanhe os principais indicadores e identifique o que
                precisa de atenção nas unidades de saúde.
              </p>
            </div>



            
            {/* IMAGEM À DIREITA */}
<div className="relative z-10 flex w-full min-w-0 items-center justify-center lg:-mr-10 lg:scale-145 lg:origin-center lg:-translate-x-30">
  <img
    src="/img_dashboard_admin.png"
    alt="Profissional de saúde, painel de fila de atendimento e QR Code"
    className="block h-auto w-full object-contain mix-blend-multiply"
  />
</div>
          </div>
        </section>

        {/* INDICADORES PRINCIPAIS */}
        <section>
          <div className="mb-10">
            <h2 className="text-xl font-extrabold sm:text-3xl">
              Indicadores de atendimento
            </h2>
            <p className="mt-2 text-sm text-[#0B1756]/60 sm:text-base">
              Os números essenciais para acompanhar o dia.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {indicadores.map((indicador) => (
              <CartaoIndicador
                key={indicador.titulo}
                indicador={indicador}
              />
            ))}
          </div>
        </section>

        {/* RESUMO DAS UNIDADES E ALERTAS */}
        <section className="grid items-stretch gap-6 xl:grid-cols-[1.15fr_0.85fr]">
          {/* Unidades */}
          <article className="rounded-2xl border border-[#3563A7]/10 bg-white p-5 shadow-sm sm:p-7">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#EAF3F7] text-[#023E8A]">
                <Icone tipo="hospital" className="h-7 w-7" />
              </div>

              <div>
                <h2 className="text-lg font-extrabold">
                  Resumo das unidades
                </h2>
                <p className="mt-1 text-sm text-[#0B1756]/55">
                  Volume de atendimentos registrados.
                </p>
              </div>
            </div>

            <div className="mt-6 space-y-6">
              {unidades.map((unidade) => (
                <div key={unidade.nome}>
                  <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <p className="font-bold">{unidade.nome}</p>
                      <p className="mt-1 text-sm text-[#0B1756]/60">
                        {unidade.total} atendimentos
                      </p>
                    </div>

                    <span
                      className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
                        unidade.status === "Fila elevada"
                          ? "bg-red-50 text-red-600"
                          : unidade.status === "Normal"
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-blue-50 text-blue-700"
                      }`}
                    >
                      {unidade.status}
                    </span>
                  </div>

                  <div
                    className="h-2.5 overflow-hidden rounded-full bg-[#EAF3F7]"
                    role="progressbar"
                    aria-label={`Volume de atendimentos da ${unidade.nome}`}
                    aria-valuenow={unidade.total}
                    aria-valuemin={0}
                    aria-valuemax={100}
                  >
                    <div
                      className={`h-full rounded-full ${
                        unidade.status === "Fila elevada"
                          ? "bg-[#3563A7]"
                          : "bg-[#6EA5E8]"
                      }`}
                      style={{ width: `${unidade.total}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </article>

          {/* Alertas e situação do sistema */}
          <div className="flex flex-col gap-5">
            <article className="flex-1 rounded-2xl border border-[#3563A7]/10 bg-white p-5 shadow-sm sm:p-7">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#EAF3F7] text-[#023E8A]">
                    <Icone tipo="bell" className="h-6 w-6" />
                  </div>

                  <div>
                    <h2 className="text-lg font-extrabold">
                      Alertas importantes
                    </h2>
                    <p className="mt-1 text-sm text-[#0B1756]/55">
                      Situações que merecem atenção.
                    </p>
                  </div>
                </div>

                <span className="flex h-8 min-w-8 items-center justify-center rounded-full bg-[#EAF3F7] px-2 text-sm font-bold text-[#023E8A]">
                  1
                </span>
              </div>

              <div className="mt-5 flex gap-3 rounded-xl bg-amber-50/80 p-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
                  <span className="text-lg font-extrabold">!</span>
                </div>

                <div>
                  <p className="font-bold text-[#0B1756]">
                    Fila elevada na UBS Centro
                  </p>
                  <p className="mt-1 text-sm leading-relaxed text-[#0B1756]/65">
                    A fila desta unidade precisa de acompanhamento.
                  </p>
                </div>
              </div>
            </article>

            <article className="flex items-center gap-4 rounded-2xl border border-[#3563A7]/10 bg-white p-5 shadow-sm sm:p-6">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                <Icone tipo="check" className="h-7 w-7" />
              </div>

              <div className="min-w-0 flex-1">
                <h2 className="font-extrabold">
                  Situação do sistema
                </h2>
                <p className="mt-1 text-sm text-[#0B1756]/60">
                  Serviços operando normalmente.
                </p>
              </div>

              <span className="shrink-0 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700">
                Operacional
              </span>
            </article>
          </div>
        </section>
      </div>
    </main>
  );
}
