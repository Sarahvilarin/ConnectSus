const fila = [
  {
    numero: 1,
    nome: "Maria Silva",
    tipo: "Consulta médica",
    status: "Em atendimento",
  },
  {
    numero: 2,
    nome: "João Pereira",
    tipo: "Consulta médica",
    status: "Em 8 min",
  },
  {
    numero: 3,
    nome: "Ana Costa",
    tipo: "Exames",
    status: "Em 15 min",
  },
  {
    numero: 4,
    nome: "Carlos Lima",
    tipo: "Triagem",
    status: "Em 22 min",
  },
];

function Icone({ tipo, className = "h-8 w-8" }) {
  const props = {
    className,
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    viewBox: "0 0 24 24",
  };

  if (tipo === "users") {
    return (
      <svg {...props}>
        <circle cx="9" cy="7" r="3.5" />
        <path d="M2.5 20v-2a6.5 6.5 0 0 1 13 0v2z" />
        <path d="M16 4a3.5 3.5 0 0 1 0 6.8M18 14a5 5 0 0 1 3.5 4.8V20H18" />
      </svg>
    );
  }

  if (tipo === "clock") {
    return (
      <svg {...props}>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3.5 2" />
      </svg>
    );
  }

  if (tipo === "file") {
    return (
      <svg {...props}>
        <path d="M6 2.5h8l5 5V21H6z" />
        <path d="M14 2.5V8h5M9 13h6M9 17h6" />
      </svg>
    );
  }

  if (tipo === "hospital") {
    return (
      <svg {...props}>
        <path d="M3 21h18M5 21V8h14v13M9 8V3h6v5M12 5v5M9.5 7.5h5" />
        <path d="M8 12h2v2H8zM14 12h2v2h-2zM8 16h2v2H8zM14 16h2v2h-2z" />
      </svg>
    );
  }

  if (tipo === "shield") {
    return (
      <svg {...props}>
        <path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11z" />
        <path d="M12 8v5M12 16h.01" />
      </svg>
    );
  }

  if (tipo === "qr") {
    return (
      <svg {...props}>
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <path d="M6 6h1M17 6h1M6 17h1M14 14h3v3h-3zM19 14v2M14 19h2M19 19h2v2h-2" />
      </svg>
    );
  }

  return null;
}

function CodigoQR() {
  const blocos = Array.from({ length: 225 }, (_, i) => {
    const x = i % 15;
    const y = Math.floor(i / 15);

    const marcador = (ox, oy) => {
      const d = Math.max(Math.abs(x - ox), Math.abs(y - oy));
      return d === 0 || d === 1 || d === 3;
    };

    const superiorEsquerdo = x < 7 && y < 7;
    const superiorDireito = x > 7 && y < 7;
    const inferiorEsquerdo = x < 7 && y > 7;

    const dentroMarcador =
      (superiorEsquerdo && marcador(3, 3)) ||
      (superiorDireito && marcador(11, 3)) ||
      (inferiorEsquerdo && marcador(3, 11));

    const dentroAreaMarcador =
      superiorEsquerdo || superiorDireito || inferiorEsquerdo;

    return (
      dentroMarcador ||
      (!dentroAreaMarcador &&
        ((x * 7 + y * 11 + x * y) % 5 === 0 ||
          (x * 3 + y * 2) % 7 < 2))
    );
  });

  return (
    <div
      aria-label="QR Code ilustrativo"
      className="grid h-[132px] w-[132px] grid-cols-15 gap-[2px] rounded-md bg-white p-1"
    >
      {blocos.map((preenchido, i) => (
        <span
          key={i}
          className={preenchido ? "bg-[#0B1756]" : "bg-white"}
        />
      ))}
    </div>
  );
}

export default function Home() {
  const etapas = [
    {
      numero: "01",
      titulo: "Acesse o sistema",
      descricao:
        "Entre na plataforma para encontrar os serviços disponíveis.",
      icone: "users",
    },
    {
      numero: "02",
      titulo: "Faça seu acompanhamento",
      descricao:
        "Consulte as informações da fila e acompanhe seu atendimento.",
      icone: "clock",
    },
    {
      numero: "03",
      titulo: "Tenha mais praticidade",
      descricao:
        "Acesse informações e serviços de forma simples e organizada.",
      icone: "file",
    },
  ];

  const beneficios = [
    {
      titulo: "Mais organização",
      descricao:
        "Informações e atendimentos organizados em um só lugar.",
      icone: "users",
    },
    {
      titulo: "Mais praticidade",
      descricao:
        "Acompanhe as informações da fila com mais facilidade.",
      icone: "clock",
    },
    {
      titulo: "Inclusão para todos",
      descricao:
        "Uma proposta que considera diferentes necessidades de acesso.",
      icone: "hospital",
    },
    {
      titulo: "Cuidado e segurança",
      descricao:
        "Atenção à privacidade e ao uso responsável das informações.",
      icone: "shield",
    },
  ];

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#EAF3F7] text-[#0B1756]">
      {/* Elementos decorativos do fundo */}
      <div className="pointer-events-none absolute -right-28 -top-36 h-[430px] w-[430px] rounded-full bg-[#3563A7]/20" />

      <div className="pointer-events-none absolute -left-40 top-10 h-[330px] w-[330px] rounded-full border-2 border-[#3563A7]/30" />

      <div className="pointer-events-none absolute -bottom-36 -left-24 h-[350px] w-[350px] rounded-full bg-white/50" />

      <div className="pointer-events-none absolute -bottom-40 -right-24 h-[430px] w-[430px] rounded-full border-[70px] border-[#3563A7]/25" />

      <section
        id="inicio"
        className="relative z-10 mx-auto max-w-[1440px] px-5 pb-12 pt-14 sm:px-6 md:px-10 md:pb-16 md:pt-20 lg:px-14"
      >
        {/* BANNER PRINCIPAL */}
        <div className="relative grid items-center gap-10 lg:grid-cols-[1fr_1fr] lg:gap-4"></div>

        <div className="relative grid items-center gap-10 lg:grid-cols-[0.92fr_1.08fr] lg:gap-8">
          {/* Texto principal */}
          
<div className="relative z-10 max-w-[550px] lg:-translate-x-8">
            <div className="mb-6 inline-flex items-center gap-3 rounded-full bg-white/80 px-5 py-3 text-sm font-semibold text-[#023E8A] shadow-sm">
              <span className="h-3 w-3 rounded-full bg-[#3563A7]" />
              SUS digital
            </div>

            <h1 className="text-4xl font-extrabold leading-[1.08] tracking-tight sm:text-5xl md:text-5xl">
              Menos filas
              <br />
              para um SUS
              <br />
              <span className="text-[#023E8A]">mais humano</span>
            </h1>

            <p className="mt-6 max-w-[490px] text-lg leading-relaxed text-[#0B1756]/70 sm:text-xl">
              Triagem inteligente e fila online para um atendimento
              mais ágil e organizado nas unidades de saúde.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <a
                href="#etapas"
                className="inline-flex items-center gap-3 rounded-xl bg-[#023E8A] px-5 py-4 font-bold text-white shadow-lg shadow-[#0B1756]/10 transition hover:bg-[#0B1756] sm:px-6"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-[#023E8A]">
                  ▶
                </span>
                Ver como funciona
              </a>

              <a
                href="/login"
                className="inline-flex items-center gap-3 rounded-xl border border-[#3563A7]/50 bg-white/60 px-5 py-4 font-bold text-[#023E8A] transition hover:bg-white sm:px-6"
              >
                Entrar na fila
              </a>
            </div>
          </div>

          {/* Fila com imagem ao fundo */}
          
{/* IMAGEM À DIREITA */}
<div className="relative z-10 flex w-full min-w-0 items-center justify-center lg:-mr-10 lg:scale-145 lg:origin-center lg:-translate-x-8">
  <img
    src="/img-dashboard.png"
    alt="Profissional de saúde, painel de fila de atendimento e QR Code"
    className="block h-auto w-full object-contain mix-blend-multiply"
  />
</div>
        </div>

        {/* DESTAQUES */}
        <div
  id="unidades"
  className="mt-20 grid gap-5 rounded-2xl bg-white/70 p-5 shadow-sm sm:p-6 md:grid-cols-3 md:gap-0 md:px-7 md:py-8"
>
          <div className="flex items-center gap-4 md:border-r md:border-[#3563A7]/30 md:px-4 lg:px-7">
            <div className="flex h-[58px] w-[58px] shrink-0 items-center justify-center rounded-2xl bg-[#EAF3F7] text-[#023E8A] sm:h-[68px] sm:w-[68px]">
              <Icone tipo="users" className="h-8 w-8 sm:h-9 sm:w-9" />
            </div>
            <div>
              <h3 className="font-extrabold">Fila digital opcional</h3>
              <p className="mt-1 text-sm text-[#0B1756]/65">
                Mais liberdade para o seu atendimento.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 md:border-r md:border-[#3563A7]/30 md:px-4 lg:px-7">
            <div className="flex h-[58px] w-[58px] shrink-0 items-center justify-center rounded-2xl bg-[#EAF3F7] text-[#023E8A] sm:h-[68px] sm:w-[68px]">
              <Icone tipo="qr" className="h-8 w-8 sm:h-9 sm:w-9" />
            </div>
            <div>
              <h3 className="font-extrabold">Check-in por QR Code</h3>
              <p className="mt-1 text-sm text-[#0B1756]/65">
                Mais agilidade e segurança.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 md:px-4 md:pl-7">
            <div className="flex h-[58px] w-[58px] shrink-0 items-center justify-center rounded-2xl bg-[#EAF3F7] text-[#023E8A] sm:h-[68px] sm:w-[68px]">
              <Icone tipo="shield" className="h-8 w-8 sm:h-9 sm:w-9" />
            </div>
            <div>
              <h3 className="font-extrabold">Inclusão sem exclusão</h3>
              <p className="mt-1 text-sm text-[#0B1756]/65">
                Tecnologia a favor de todos.
              </p>
            </div>
          </div>
        </div>

        {/* SOBRE NÓS */}
        
{/* SOBRE NÓS */}
<section
  id="sobre"
  className="mt-16 w-full px- -18"
>
  <div className="grid w-full items-center gap-8 md:grid-cols-2 md:gap-12 lg:gap-16">

    {/* Imagem */}
    <div className="relative h-[260px] overflow-hidden rounded-2xl sm:h-[300px] lg:h-[340px]">
      <img
        src="https://clickpetroleoegas.com.br/wp-content/uploads/2026/04/SUS_ULTRAPASSA_O_BRASIL_E_INSPIRA_REVOLUCAO_NA_SAUDE.jpg"
        alt="Paciente sorrindo durante atendimento médico"
        className="absolute inset-0 h-full w-full object-cover"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-[#0B1756]/70 via-transparent to-transparent" />
    </div>

    {/* Textos */}
    <div className="py-4 md:py-8">
      <span className="inline-flex rounded-full bg-white/70 px-4 py-2 text-sm font-semibold text-[#023E8A]">
        Nossa missão
      </span>

      <h2 className="mt-5 text-3xl font-extrabold leading-tight sm:text-4xl lg:text-5xl">
        Sobre o <span className="text-[#023E8A]">UneSUS</span>
      </h2>

      <p className="mt-6 text-base leading-relaxed text-[#0B1756]/75 sm:text-lg">
        Acreditamos que cuidar da saúde também significa cuidar
        da experiência de cada pessoa durante o atendimento.
      </p>

      <p className="mt-5 text-base leading-relaxed text-[#0B1756]/75 sm:text-lg">
        Por isso, o UneSUS propõe aproximar a tecnologia da
        saúde pública, ajudando a organizar filas, facilitar o
        acesso às informações e tornar o acompanhamento dos
        atendimentos mais simples.
      </p>
    </div>

  </div>
</section>


        {/* COMO FUNCIONA */}
        <section className="mt-16" id="etapas">
          <div className="mb-8">
            <h2 className="text-4xl font-extrabold">
              Como <span className="text-[#023E8A]">funciona?</span>
            </h2>

            <p className="mt-3 text-[#0B1756]/65">
              Um caminho simples para facilitar o acompanhamento do atendimento.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {etapas.map((etapa) => (
              <article
                key={etapa.numero}
                className="relative rounded-2xl border border-[#3563A7]/15 bg-white/90 p-6 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-lg hover:shadow-[#0B1756]/5"
              >
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-extrabold text-[#3563A7]/35">
                    {etapa.numero}
                  </span>

                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#EAF3F7] text-[#023E8A]">
                    <Icone tipo={etapa.icone} className="h-8 w-8" />
                  </div>
                </div>

                <h3 className="mt-5 text-xl font-extrabold">
                  {etapa.titulo}
                </h3>

                <p className="mt-3 leading-relaxed text-[#0B1756]/65">
                  {etapa.descricao}
                </p>
              </article>
            ))}
          </div>
        </section>

        {/* POR QUE ESCOLHER */}
        <section
          id="beneficios"
          className="relative mt-16 overflow-hidden rounded-3xl bg-[#0B1756] px-6 py-10 text-white sm:px-10 sm:py-12"
        >
          <div className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full border-[35px] border-white/[0.04]" />
          <div className="pointer-events-none absolute -bottom-24 left-[40%] h-48 w-48 rounded-full bg-[#3563A7]/20" />

          <div className="relative z-10">
            

            <h2 className="mt-5 max-w-2xl text-3xl font-extrabold sm:text-4xl">
              Por que escolher o UneSUS?
            </h2>

            <p className="mt-4 max-w-2xl leading-relaxed text-white/75">
              A tecnologia pode tornar o caminho até o atendimento mais simples. Nossa proposta é unir organização, praticidade e inclusão sem deixar de lado o cuidado com as pessoas.
            </p>

            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {beneficios.map((beneficio) => (
                <article
                  key={beneficio.titulo}
                  className="rounded-2xl border border-white/10 bg-white/[0.06] p-5 transition duration-200 hover:bg-white/[0.10]"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#3563A7]/40 text-[#EAF3F7]">
                    <Icone tipo={beneficio.icone} className="h-7 w-7" />
                  </div>

                  <h3 className="mt-5 text-lg font-extrabold">
                    {beneficio.titulo}
                  </h3>

                  <p className="mt-3 text-sm leading-relaxed text-white/70">
                    {beneficio.descricao}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}