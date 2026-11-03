"use client";

function Icone({ tipo, className = "h-6 w-6" }) {
  const props = {
    className,
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    viewBox: "0 0 24 24",
  };

  const icones = {
    users: (
      <>
        <path d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="10" cy="7" r="4" />
        <path d="M20 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
      </>
    ),
    activity: (
      <path d="M3 12h4l3-8 4 16 3-8h4" />
    ),
    calendar: (
      <>
        <rect x="3" y="5" width="18" height="16" rx="2" />
        <path d="M16 3v4M8 3v4M3 10h18" />
      </>
    ),
    check: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="m8 12 2.5 2.5L16 9" />
      </>
    ),
    home: (
      <>
        <path d="m3 10 9-7 9 7" />
        <path d="M5 9v12h14V9M9 21v-7h6v7" />
      </>
    ),
    arrow: (
      <path d="M5 12h14M13 6l6 6-6 6" />
    ),
    heart: (
      <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z" />
    ),
  };

  return <svg {...props}>{icones[tipo]}</svg>;
}

const indicadores = [
  {
    titulo: "Atendimentos realizados",
    valor: "128",
    icone: "users",
  },
  {
    titulo: "Pacientes acompanhados",
    valor: "86",
    icone: "activity",
  },
  {
    titulo: "Triagens realizadas",
    valor: "96",
    icone: "check",
  },
  {
    titulo: "Visitas domiciliares",
    valor: "58",
    icone: "home",
  },
];

const dadosSemana = [
  { dia: "Seg", valor: 13 },
  { dia: "Ter", valor: 18 },
  { dia: "Qua", valor: 15 },
  { dia: "Qui", valor: 20 },
  { dia: "Sex", valor: 16 },
  { dia: "Sáb", valor: 8 },
  { dia: "Dom", valor: 4 },
];

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#EEF5F9] text-[#0B1756]">

      {/* DECORAÇÃO DO FUNDO */}
      <div className="pointer-events-none absolute -right-28 -top-36 h-[430px] w-[430px] rounded-full bg-[#3563A7]/20" />
      <div className="pointer-events-none absolute -left-40 top-10 h-[330px] w-[330px] rounded-full border-2 border-[#3563A7]/30" />
      <div className="pointer-events-none absolute -bottom-36 -left-24 h-[350px] w-[350px] rounded-full bg-white/50" />
      <div className="pointer-events-none absolute -bottom-40 -right-24 h-[430px] w-[430px] rounded-full border-[70px] border-[#3563A7]/25" />

      <section className="relative z-10 mx-auto w-full max-w-[1480px] px-4 pb-12 pt-14 sm:px-6 md:px-8 md:pb-16 md:pt-20 lg:px-6 xl:px-8">

        {/* BANNER DE APRESENTAÇÃO - ENFERMAGEM */}
<section className="grid items-center gap-8 lg:grid-cols-[1fr_0.9fr] lg:gap-8">

  {/* TEXTO */}
  <div className="max-w-[570px] -translate-y-20">
  
    <div className="inline-flex items-center gap-2 rounded-full bg-white/80 px-5 py-3 text-sm font-semibold text-[#023E8A] shadow-sm">
      <span className="h-2 w-2 rounded-full bg-[#3563A7]" />
      Área da enfermagem
    </div>

    <h1 className="mt-6 text-4xl font-extrabold leading-tight tracking-tight text-[#0B1756] sm:text-5xl md:text-5xl">
      Cuidado que 
      <br />
      <span className="text-[#023E8A]">
        transforma vidas.
      </span>
    </h1>

    <p className="mt-5 max-w-lg text-base leading-7 text-[#425875] sm:text-lg">
      Acompanhe seus atendimentos e visualize os principais indicadores
      da sua atuação, mantendo o cuidado e a organização em cada etapa.
    </p>
  </div>

  {/* IMAGEM */}
  <div className="relative min-h-[380px] w-full lg:min-h-[500px] lg:w-[150%] lg:-ml-[50%] lg:-translate-y-20">
    <img
      src="/img-dashboard-enfermeiro.jpg"
      alt="Profissional de enfermagem em ambiente de atendimento"
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


{/* INDICADORES */}
<section>

  <div className="mb-7">
    <span className="text-sm font-bold uppercase tracking-[0.16em] text-[#3563A7]">
      Acesse quando precisar
    </span>

    <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-[#0B1756] sm:text-4xl">
      Visão geral dos atendimentos
    </h2>

    <p className="mt-3 max-w-2xl text-base leading-7 text-[#536783]">
      Confira os principais números da sua atuação neste mês.
    </p>
  </div>

  <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">

    {indicadores.map((item, index) => (
      <article
        key={item.titulo}
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
              {item.titulo}
            </p>

            <h3 className="mt-5 text-4xl font-extrabold leading-none tracking-tight text-white transition-all duration-300 group-hover:scale-105">
              {item.valor}
            </h3>

          </div>

          {/* ÍCONE */}
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/15 text-white transition-all duration-500 group-hover:rotate-6 group-hover:scale-110 group-hover:bg-white/25">
            <Icone tipo={item.icone} className="h-7 w-7" />
          </div>

        </div>

      </article>
    ))}

  </div>
</section>


{/* PRODUTIVIDADE E RESUMO */}
<section className="mt-16 grid gap-6 lg:grid-cols-[1.45fr_0.85fr]">

  {/* GRÁFICO DE PRODUTIVIDADE */}
  <article className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-500 ease-out hover:-translate-y-2 hover:border-[#8DB5E8] hover:shadow-2xl sm:p-8">

    <div className="flex flex-wrap items-start justify-between gap-4">

      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-[#3563A7]">
          Desempenho
        </p>

        <h2 className="mt-2 text-2xl font-extrabold text-[#0B1756] transition-colors duration-300 group-hover:text-[#3563A7]">
          Produtividade semanal
        </h2>

        <p className="mt-2 text-sm text-slate-600">
          Número de atendimentos realizados por dia.
        </p>
      </div>

      <div className="rounded-xl bg-[#EAF3F7] px-4 py-2 text-xs font-semibold text-[#023E8A] transition-all duration-300 hover:scale-105 hover:bg-[#D5E9F5]">
        Últimos 7 dias
      </div>

    </div>

    {/* BARRAS */}
    <div className="mt-10 grid h-[230px] grid-cols-7 gap-3">

      {dadosSemana.map((item, index) => (
        <div
          key={item.dia}
          className="group/bar flex flex-col items-center justify-end"
        >

          <span
            className="mb-3 text-xs font-bold text-slate-500 transition-all duration-300 group-hover/bar:scale-125 group-hover/bar:text-[#023E8A]"
            style={{
              animation: "fadeIn 0.7s ease-out both",
              animationDelay: `${index * 0.12}s`,
            }}
          >
            {item.valor}
          </span>

          <div className="flex h-[175px] w-full items-end justify-center overflow-hidden rounded-t-lg bg-[#EAF3F7]">

            <div
              className="w-full max-w-[38px] origin-bottom rounded-t-lg bg-gradient-to-t from-[#023E8A] to-[#8DB5E8] shadow-sm transition-all duration-500 ease-out hover:scale-x-110 hover:brightness-110 hover:shadow-lg"
              style={{
                height: `${(item.valor / 20) * 100}%`,
                animation: "growBar 1.1s cubic-bezier(0.22, 1, 0.36, 1) both",
                animationDelay: `${index * 0.13}s`,
              }}
            />

          </div>

          <span className="mt-3 text-xs font-semibold text-slate-500 transition-colors duration-300 group-hover/bar:text-[#023E8A]">
            {item.dia}
          </span>

        </div>
      ))}

    </div>

    {/* RODAPÉ */}
    <div className="mt-8 flex items-center justify-between border-t border-slate-200 pt-5">

      <div className="flex items-center gap-2">
        <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-[#3563A7]" />

        <span className="text-xs text-slate-600">
          Atendimentos realizados
        </span>
      </div>

      <span className="text-sm font-bold text-[#023E8A] transition-transform duration-300 hover:scale-110">
        94 no total
      </span>

    </div>

  </article>


  {/* DISTRIBUIÇÃO DAS ATIVIDADES */}
  <article
    className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-500 ease-out hover:-translate-y-2 hover:border-[#8DB5E8] hover:shadow-2xl sm:p-8"
    style={{
      animation: "fadeIn 0.9s ease-out both",
      animationDelay: "0.2s",
    }}
  >

    <h2 className="text-2xl font-extrabold text-[#0B1756] transition-colors duration-300 group-hover:text-[#3563A7]">
      Atividades realizadas
    </h2>

    <p className="mt-2 text-sm leading-relaxed text-slate-600">
      Distribuição dos registros entre as principais atividades.
    </p>

    {/* GRÁFICO CIRCULAR */}
    <div className="mt-9 flex items-center justify-center">

      <div
        className="relative flex h-[190px] w-[190px] items-center justify-center rounded-full shadow-lg transition-all duration-700 ease-out hover:scale-110 hover:rotate-6 hover:shadow-xl"
        style={{
          background:
            "conic-gradient(#023E8A 0% 62%, #8DB5E8 62% 100%)",
          animation: "donutEnter 1.2s cubic-bezier(0.22, 1, 0.36, 1) both",
        }}
      >

        <div className="flex h-[142px] w-[142px] flex-col items-center justify-center rounded-full bg-white shadow-inner transition-all duration-500">

          <span
            className="text-4xl font-extrabold text-[#0B1756]"
            style={{
              animation: "fadeIn 1s ease-out both",
              animationDelay: "0.5s",
            }}
          >
            154
          </span>

          <span className="mt-1 text-xs text-slate-500">
            Atividades
          </span>

        </div>

      </div>

    </div>

    {/* LEGENDAS */}
    <div className="mt-9 space-y-4">

      <div className="group/item flex items-center justify-between rounded-xl p-3 transition-all duration-300 hover:translate-x-2 hover:bg-[#EAF3F7]">

        <div className="flex items-center gap-3">
          <span className="h-3 w-3 rounded-full bg-[#023E8A] transition-transform duration-300 group-hover/item:scale-150" />

          <span className="text-sm text-slate-600">
            Triagens
          </span>
        </div>

        <span className="text-base font-bold text-[#0B1756] transition-transform duration-300 group-hover/item:scale-110">
          96
        </span>

      </div>

      <div className="group/item flex items-center justify-between rounded-xl p-3 transition-all duration-300 hover:translate-x-2 hover:bg-[#EAF3F7]">

        <div className="flex items-center gap-3">
          <span className="h-3 w-3 rounded-full bg-[#8DB5E8] transition-transform duration-300 group-hover/item:scale-150" />

          <span className="text-sm text-slate-600">
            Visitas domiciliares
          </span>
        </div>

        <span className="text-base font-bold text-[#0B1756] transition-transform duration-300 group-hover/item:scale-110">
          58
        </span>

      </div>

    </div>

  </article>

</section>

{/* ANIMAÇÕES */}
<style>{`
  @keyframes growBar {
    from {
      transform: scaleY(0);
      opacity: 0.3;
    }
    to {
      transform: scaleY(1);
      opacity: 1;
    }
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(15px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes donutEnter {
    from {
      opacity: 0;
      transform: rotate(-90deg) scale(0.5);
    }
    to {
      opacity: 1;
      transform: rotate(0deg) scale(1);
    }
  }
`}</style>


{/* MENSAGEM FINAL */}
<section className="mt-16 rounded-3xl bg-[#0B1756] px-7 py-8 text-white shadow-sm sm:px-10 sm:py-10">

  <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-center">

    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-white">
      <Icone tipo="heart" className="h-7 w-7" />
    </div>

    <div>

      <h2 className="text-xl font-extrabold text-white sm:text-2xl">
        Cuidado que aproxima, tecnologia que transforma.
      </h2>

      <p className="mt-2 max-w-[850px] text-sm leading-relaxed text-white/75 sm:text-base">
        A UneSUS valoriza o trabalho dos profissionais de saúde
        e acredita que a organização e a tecnologia podem contribuir
        para um atendimento cada vez mais humano.
      </p>

    </div>

  </div>

</section>

      </section>
    </main>
  );
}