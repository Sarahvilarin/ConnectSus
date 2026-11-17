
"use client";

import {
  UsersRound,
  CalendarCheck,
  FlaskConical,
  BriefcaseMedical,
  Download,
  UserRound,
  Activity,
  Stethoscope,
} from "lucide-react";

const indicadores = [
  {
    titulo: "Total de atendimentos",
    valor: "12.487",
    crescimento: "12%",
    Icone: UsersRound,
  },
  {
    titulo: "Consultas médicas",
    valor: "8.932",
    crescimento: "10%",
    Icone: CalendarCheck,
  },
  {
    titulo: "Exames realizados",
    valor: "2.341",
    crescimento: "8%",
    Icone: FlaskConical,
  },
  {
    titulo: "Visitas domiciliares",
    valor: "214",
    crescimento: "5%",
    Icone: BriefcaseMedical,
  },
];

const tiposAtendimento = [
  { nome: "Consultas médicas", percentual: "71,5%", valor: 71.5 },
  { nome: "Exames", percentual: "18,7%", valor: 18.7 },
  { nome: "Procedimentos", percentual: "6,4%", valor: 6.4 },
  { nome: "Visitas domiciliares", percentual: "1,7%", valor: 1.7 },
  { nome: "Outros", percentual: "1,7%", valor: 1.7 },
];

const coresTipos = ["#023E8A", "#3563A7", "#0B1756", "#9BBCEB", "#C8D8EC"];

const gradienteTipos = (() => {
  let acumulado = 0;

  const trechos = tiposAtendimento.map((tipo, i) => {
    const inicio = acumulado;
    acumulado += tipo.valor;
    return `${coresTipos[i]} ${inicio}% ${acumulado}%`;
  });

  return `conic-gradient(${trechos.join(", ")})`;
})();

const unidades = [
  { nome: "UBS Centro", valor: "3.482", largura: "79%" },
  { nome: "UBS Vila Madalena", valor: "2.971", largura: "65%" },
  { nome: "UBS Jardim das Flores", valor: "2.114", largura: "52%" },
  { nome: "UBS Novo Horizonte", valor: "1.509", largura: "39%" },
  { nome: "Policlínica Municipal", valor: "1.412", largura: "36%" },
];

const exames = [
  { nome: "Hemograma", valor: "642", largura: "80%" },
  { nome: "Raio-X", valor: "518", largura: "63%" },
  { nome: "Ultrassonografia", valor: "436", largura: "55%" },
  { nome: "Eletrocardiograma", valor: "321", largura: "42%" },
  { nome: "Colesterol e triglicerídeos", valor: "298", largura: "38%" },
];

function HeartIcon(props) {
  return <Activity {...props} />;
}

const especialidades = [
  { nome: "Clínica médica", tempo: "32 min", Icone: Stethoscope },
  { nome: "Pediatria", tempo: "28 min", Icone: UserRound },
  { nome: "Ginecologia", tempo: "45 min", Icone: UserRound },
  { nome: "Ortopedia", tempo: "52 min", Icone: Activity },
  { nome: "Cardiologia", tempo: "60 min", Icone: HeartIcon },
];

const faixasEtarias = [
  { faixa: "0 - 12", valor: "1.862", altura: "58%" },
  { faixa: "13 - 18", valor: "1.423", altura: "44%" },
  { faixa: "19 - 39", valor: "3.214", altura: "100%" },
  { faixa: "40 - 59", valor: "2.887", altura: "90%" },
  { faixa: "60+", valor: "2.101", altura: "65%" },
];

function PainelCard({ titulo, children, className = "" }) {
  return (
    <section
      className={`flex min-w-0 flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6 ${className}`}
    >
      <h2 className="mb-5 text-2xl font-bold leading-tight tracking-tight text-[#0B1756]">
        {titulo}
      </h2>

      <div className="flex flex-1 flex-col">{children}</div>
    </section>
  );
}

function IndicadorCard({ titulo, valor, crescimento, Icone }) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#EAF3F7] text-[#3563A7]">
          <Icone size={25} />
        </div>

        <p className="text-base font-semibold text-[#0B1756]">{titulo}</p>
      </div>

      <p className="mt-4 text-2xl font-bold tracking-tight text-[#0B1756]">
        {valor}
      </p>

      <p className="mt-2 text-base font-semibold text-[#3563A7]">
        ↑ {crescimento}
      </p>

      <p className="mt-1 text-xs font-normal text-slate-500">
        em relação ao mês anterior
      </p>
    </article>
  );
}

function BarrasHorizontais({ itens }) {
  return (
    <div className="flex h-full min-h-[220px] flex-col justify-between gap-4">
      {itens.map((item) => (
        <div
          key={item.nome}
          className="grid grid-cols-[minmax(0,1fr)_minmax(70px,1.2fr)_48px] items-center gap-3 text-sm"
        >
          <span className="min-w-0 font-normal leading-snug text-slate-600">
            {item.nome}
          </span>

          <div className="h-3 overflow-hidden rounded-full bg-[#EAF3F7]">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#3563A7] to-[#023E8A]"
              style={{ width: item.largura }}
            />
          </div>

          <span className="text-right font-semibold text-[#0B1756]">
            {item.valor}
          </span>
        </div>
      ))}
    </div>
  );
}

export default function RelatoriosPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#EEF5F9] font-sans text-[#0B1756]">
      {/* Banner principal */}
<div className="mx-auto w-full max-w-[1600px] px-6 pt-7 2xl:px-10">
  <section className="relative isolate overflow-hidden rounded-[30px] bg-gradient-to-br from-[#174693] via-[#234E96] to-[#151A67] px-6 py-11 text-white shadow-[0_20px_55px_rgba(2,62,138,0.16)] sm:px-9 lg:px-10">

    <div className="pointer-events-none absolute -right-16 -top-36 h-96 w-96 rounded-full border-[48px] border-white/[0.07]" />

    <div className="pointer-events-none absolute right-[28%] top-10 h-52 w-52 rounded-full border-[30px] border-white/[0.05]" />

    <div className="pointer-events-none absolute -bottom-32 left-[38%] h-64 w-64 rounded-full bg-[#78A9E6]/10 blur-2xl" />

    <div className="relative flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
      <div className="max-w-3xl">

        <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-semibold text-blue-50">
          <Activity size={14} />
          ADMINISTRAÇÃO · REDE MUNICIPAL
        </div>

        <h1 className="mt-4 text-3xl font-bold leading-tight sm:text-4xl">
          Relatórios
        </h1>

        <p className="mt-3 max-w-2xl text-sm leading-6 text-blue-100 sm:text-base">
          Dados e estatísticas dos atendimentos.
        </p>

      </div>
    </div>
  </section>
</div>

      {/* Conteúdo dos relatórios */}
      <div className="mx-auto w-full max-w-[1600px] px-6 py-5 2xl:px-10">
        

        {/* Indicadores */}
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {indicadores.map((item) => (
            <IndicadorCard key={item.titulo} {...item} />
          ))}
        </div>

        {/* Primeira linha de gráficos */}
        <div className="mt-5 grid items-stretch gap-4 xl:grid-cols-3">
          <PainelCard titulo="Atendimentos por tipo">
            <div className="flex flex-1 flex-col items-center justify-center gap-5 sm:flex-row">
              <div
                className="relative flex h-44 w-44 shrink-0 items-center justify-center rounded-full"
                style={{ background: gradienteTipos }}
              >
                <div className="flex h-[112px] w-[112px] flex-col items-center justify-center rounded-full bg-white text-center">
                  <strong className="text-xl font-bold leading-tight text-[#0B1756]">
                    12.487
                  </strong>

                  <span className="mt-1 text-[11px] font-semibold leading-none text-slate-500">
                    atendimentos
                  </span>
                </div>
              </div>

              <div className="w-full space-y-3">
                {tiposAtendimento.map((item, i) => (
                  <div
                    key={item.nome}
                    className="flex items-center gap-2 text-sm"
                  >
                    <span
                      className="h-2.5 w-2.5 shrink-0 rounded-full"
                      style={{ background: coresTipos[i] }}
                    />

                    <span className="min-w-0 flex-1 font-normal text-slate-600">
                      {item.nome}
                    </span>

                    <span className="font-semibold text-[#0B1756]">
                      {item.percentual}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </PainelCard>

          <PainelCard titulo="Evolução dos atendimentos">
            <div className="relative h-44 flex-1 pt-2">
              <div className="absolute inset-x-10 inset-y-3 flex flex-col justify-between">
                {[0, 1, 2, 3, 4].map((n) => (
                  <div key={n} className="border-t border-slate-100" />
                ))}
              </div>

              <div className="absolute left-0 top-1 flex h-[90%] flex-col justify-between text-xs font-normal text-slate-500">
                <span>20.000</span>
                <span>15.000</span>
                <span>10.000</span>
                <span>5.000</span>
                <span>0</span>
              </div>

              <svg
                viewBox="0 0 400 170"
                className="absolute inset-x-10 top-2 h-[85%] w-[calc(100%-3rem)] overflow-visible"
                role="img"
                aria-label="Gráfico de evolução mensal dos atendimentos"
              >
                <defs>
                  <linearGradient
                    id="areaRelatorio"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="0%"
                      stopColor="#3563A7"
                      stopOpacity=".35"
                    />

                    <stop
                      offset="100%"
                      stopColor="#3563A7"
                      stopOpacity=".02"
                    />
                  </linearGradient>
                </defs>

                <path
                  d="M10 126 Q48 111 90 92 T175 96 T260 63 T345 48 L345 155 L10 155 Z"
                  fill="url(#areaRelatorio)"
                />

                <path
                  d="M10 126 Q48 111 90 92 T175 96 T260 63 T345 48"
                  fill="none"
                  stroke="#3563A7"
                  strokeWidth="3"
                  strokeLinecap="round"
                />

                {[
                  [10, 126],
                  [90, 92],
                  [175, 96],
                  [260, 63],
                  [345, 48],
                ].map(([cx, cy]) => (
                  <circle
                    key={cx}
                    cx={cx}
                    cy={cy}
                    r="4.5"
                    fill="#3563A7"
                  />
                ))}
              </svg>

              <div className="absolute bottom-0 left-10 right-0 flex justify-between text-xs font-normal text-slate-600">
                {["Jan", "Fev", "Mar", "Abr", "Mai"].map((mes) => (
                  <span key={mes}>{mes}</span>
                ))}
              </div>
            </div>
          </PainelCard>

          <PainelCard titulo="Atendimentos por unidade de saúde">
            <BarrasHorizontais itens={unidades} />
          </PainelCard>
        </div>

        {/* Segunda linha de gráficos */}
        <div className="mt-4 grid items-stretch gap-4 xl:grid-cols-3">
          <PainelCard titulo="Principais exames realizados">
            <BarrasHorizontais itens={exames} />
          </PainelCard>

          <PainelCard titulo="Tempo médio de espera por especialidade">
            <div className="mb-2 grid grid-cols-[1fr_auto] border-b border-slate-200 pb-2 text-xs font-semibold text-slate-500">
              <span>Especialidade</span>
              <span>Tempo médio</span>
            </div>

            <div className="flex flex-1 flex-col justify-between">
              {especialidades.map(({ nome, tempo, Icone }) => (
                <div
                  key={nome}
                  className="grid grid-cols-[1fr_auto] items-center border-b border-slate-100 py-2 last:border-0"
                >
                  <div className="flex items-center gap-3 text-sm font-normal text-slate-600">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#EAF3F7] text-[#3563A7]">
                      <Icone size={15} />
                    </span>

                    {nome}
                  </div>

                  <span className="text-sm font-semibold text-[#0B1756]">
                    {tempo}
                  </span>
                </div>
              ))}
            </div>
          </PainelCard>

          <PainelCard titulo="Faixa etária dos pacientes">
            <div className="flex h-48 flex-1 items-end justify-around gap-3 border-b border-slate-200 px-2 pt-3">
              {faixasEtarias.map((item) => (
                <div
                  key={item.faixa}
                  className="flex h-full min-w-0 flex-1 flex-col items-center justify-end"
                >
                  <span className="mb-1 text-xs font-semibold text-[#0B1756]">
                    {item.valor}
                  </span>

                  <div
                    className="w-full max-w-12 rounded-t-md bg-gradient-to-t from-[#023E8A] to-[#3563A7]"
                    style={{ height: item.altura }}
                  />

                  <span className="mt-2 text-center text-xs font-normal leading-tight text-slate-600">
                    {item.faixa}
                    <br />
                    anos
                  </span>
                </div>
              ))}
            </div>
          </PainelCard>
        </div>
      </div>
    </main>
  );
}
