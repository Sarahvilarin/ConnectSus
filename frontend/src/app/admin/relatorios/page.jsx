"use client";

import {
  UsersRound,
  CalendarCheck,
  FlaskConical,
  BriefcaseMedical,
  Download,
  CalendarDays,
  ArrowRight,
  Clock3,
  UserRound,
  Activity,
  Stethoscope,
  ClipboardList,
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

function HeartIcon(props) {
  return <Activity {...props} />;
}

function PainelCard({ titulo, children, className = "" }) {
  return (
    <section
      className={`min-w-0 rounded-xl border border-[#CDE6FF] bg-white/65 p-4 sm:p-5 ${className}`}
    >
      <h2 className="mb-4 text-sm font-bold tracking-tight text-[#0B347D] sm:text-base">
        {titulo}
      </h2>
      {children}
    </section>
  );
}

function IndicadorCard({ titulo, valor, crescimento, Icone }) {
  return (
    <article className="rounded-xl border border-[#CDE6FF] bg-white/60 p-4 sm:p-5">
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#D9EDFF] text-[#1764C0]">
          <Icone size={25} />
        </div>
        <p className="text-sm font-medium text-[#164A9B]">{titulo}</p>
      </div>
      <p className="mt-3 text-2xl font-extrabold tracking-tight text-[#103D8D] sm:text-3xl">
        {valor}
      </p>
      <p className="mt-2 text-sm font-semibold text-emerald-600">
        ↑ {crescimento}
      </p>
      <p className="mt-1 text-[11px] text-[#3971B7]">
        em relação ao mês anterior
      </p>
    </article>
  );
}

function BarrasHorizontais({ itens }) {
  return (
    <div className="space-y-4">
      {itens.map((item) => (
        <div
          key={item.nome}
          className="grid grid-cols-[minmax(0,1fr)_minmax(70px,1.2fr)_42px] items-center gap-3 text-xs text-[#164A9B]"
        >
          <span className="min-w-0 leading-snug">{item.nome}</span>
          <div className="h-3 overflow-hidden rounded-full bg-[#E3EFF8]">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#438FE8] to-[#2870C7]"
              style={{ width: item.largura }}
            />
          </div>
          <span className="text-right font-medium">{item.valor}</span>
        </div>
      ))}
    </div>
  );
}

export default function RelatoriosPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-gradient-to-br from-[#EDF9FF] via-[#F7FCFF] to-[#E8F4FF] text-[#0B1756]">
      {/* Banner principal */}
      <section className="relative overflow-hidden border-b border-[#D8ECFF] bg-gradient-to-r from-[#EAF8FF] via-[#E5F5FF] to-[#CDE8FF]">
        <div className="pointer-events-none absolute -right-20 -top-36 h-[400px] w-[400px] rounded-full border-[55px] border-white/30" />
        <div className="mx-auto grid min-h-[260px] max-w-[1600px] items-center gap-5 px-5 py-8 sm:px-8 md:grid-cols-[0.95fr_1.05fr] lg:px-10">
          <div className="relative z-10">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-[#D5ECFF] px-4 py-2 text-[11px] font-bold uppercase tracking-wide text-[#0752B7]">
              <ClipboardList size={15} />
              Administração
            </div>
            <h1 className="text-3xl font-extrabold leading-[1.04] tracking-tight text-[#103D8D] sm:text-4xl lg:text-5xl">
              Relatórios
              <span className="block text-[#2475D1]">
                Dados e estatísticas
              </span>
              <span className="block">dos atendimentos</span>
            </h1>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-[#2768B6] sm:text-base">
              Acompanhe os principais dados e indicadores de atendimentos da
              rede pública de saúde. Aqui você encontra informações sobre filas,
              exames, visitas e muito mais, de forma simples, segura e
              atualizada.
            </p>
          </div>

          <div className="relative flex min-h-[180px] items-center justify-center md:min-h-[250px]">
            <div className="absolute h-52 w-52 rounded-full bg-[#A9D8FF]/70 blur-2xl sm:h-64 sm:w-64" />
            <div className="relative w-full max-w-[540px] rounded-[28px] bg-gradient-to-br from-[#D9EEFF]/70 to-[#B6DBFF]/40 p-4 sm:p-6">
              <div className="absolute -left-3 bottom-5 h-24 w-24 rounded-full bg-[#3E8DE0]/70" />
              <div className="absolute right-2 top-2 h-20 w-20 rounded-full bg-[#2E7DD0]/80" />
              <div className="relative z-10 rotate-[-3deg] rounded-2xl border-[7px] border-[#16447F] bg-white p-4 shadow-[0_18px_35px_rgba(18,69,133,0.22)] sm:p-5">
                <div className="mb-4 flex items-center justify-between">
                  <div className="h-3 w-28 rounded-full bg-[#D8EBFC]" />
                  <div className="h-3 w-12 rounded-full bg-[#E6F2FD]" />
                </div>
                <div className="grid grid-cols-[1.1fr_0.9fr] items-center gap-4">
                  <div className="flex h-24 items-end gap-2 border-b border-[#D9EAF8] px-2 sm:h-32">
                    {[35, 55, 45, 76, 94].map((altura, i) => (
                      <div
                        key={i}
                        className="flex-1 rounded-t-md bg-gradient-to-t from-[#2C70C8] to-[#78B9F5]"
                        style={{ height: `${altura}%` }}
                      />
                    ))}
                  </div>
                  <div className="flex items-center justify-center">
                    <div className="flex h-20 w-20 items-center justify-center rounded-full border-[14px] border-[#2C70C8] border-r-[#B9DEFF] sm:h-24 sm:w-24">
                      <div className="h-5 w-5 rounded-full bg-[#D9EDFF]" />
                    </div>
                  </div>
                </div>
                <div className="mt-4 flex gap-2">
                  <div className="h-2 flex-1 rounded-full bg-[#DCEEFF]" />
                  <div className="h-2 w-1/4 rounded-full bg-[#B7DBFC]" />
                </div>
              </div>
              <div className="absolute -bottom-2 right-0 z-20 rounded-xl border border-white bg-white/90 p-3 shadow-lg sm:right-2">
                <Activity size={28} className="text-[#3285D8]" />
              </div>
              <div className="absolute -left-1 top-2 z-20 rounded-xl border border-white bg-white/90 p-3 shadow-lg">
                <div className="h-2 w-12 rounded-full bg-[#8CC5FA]" />
                <div className="mt-2 h-2 w-8 rounded-full bg-[#C3E3FF]" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Conteúdo dos relatórios */}
      <div className="mx-auto max-w-[1600px] px-4 py-5 sm:px-6 lg:px-9">
        <div className="mb-5 flex flex-wrap items-center justify-end gap-3">
          <div className="flex items-center gap-3 rounded-lg border border-[#C5E2FF] bg-white/75 px-3 py-2.5 text-xs font-medium text-[#164A9B]">
            <CalendarDays size={16} />
            <span>01/05/2025</span>
            <ArrowRight size={15} />
            <span>31/05/2025</span>
            <CalendarDays size={16} />
          </div>
          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-[#1764C0] to-[#0D4EAA] px-4 py-3 text-xs font-bold text-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <Download size={16} />
            Exportar relatório
          </button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {indicadores.map((item) => (
            <IndicadorCard key={item.titulo} {...item} />
          ))}
        </div>

        <div className="mt-5 grid gap-4 xl:grid-cols-3">
          <PainelCard titulo="Atendimentos por tipo">
            <div className="flex flex-col items-center gap-5 sm:flex-row">
              <div
                className="relative h-40 w-40 shrink-0 rounded-full"
                style={{
                  background:
                    "conic-gradient(#1555A7 0% 71.5%, #3D8BE0 71.5% 90.2%, #7CB8F1 90.2% 96.6%, #2C74CE 96.6% 98.3%, #B8DDFB 98.3% 100%)",
                }}
              >
                <div className="absolute inset-[28%] flex flex-col items-center justify-center rounded-full bg-[#F7FCFF] text-center">
                  <strong className="text-xl text-[#103D8D]">12.487</strong>
                  <span className="text-[10px] text-[#3971B7]">
                    atendimentos
                  </span>
                </div>
              </div>
              <div className="w-full space-y-3">
                {tiposAtendimento.map((item, i) => (
                  <div
                    key={item.nome}
                    className="flex items-center gap-2 text-[11px] text-[#164A9B]"
                  >
                    <span
                      className="h-2.5 w-2.5 shrink-0 rounded-full"
                      style={{
                        background: [
                          "#1555A7",
                          "#3D8BE0",
                          "#7CB8F1",
                          "#2C74CE",
                          "#B8DDFB",
                        ][i],
                      }}
                    />
                    <span className="min-w-0 flex-1">{item.nome}</span>
                    <span className="font-medium">{item.percentual}</span>
                  </div>
                ))}
              </div>
            </div>
          </PainelCard>

          <PainelCard titulo="Evolução dos atendimentos">
            <div className="relative h-44 pt-2">
              <div className="absolute inset-x-8 inset-y-3 flex flex-col justify-between">
                {[0, 1, 2, 3, 4].map((n) => (
                  <div key={n} className="border-t border-[#E1EFFB]" />
                ))}
              </div>
              <div className="absolute left-0 top-1 flex h-[90%] flex-col justify-between text-[10px] text-[#3971B7]">
                <span>20.000</span>
                <span>15.000</span>
                <span>10.000</span>
                <span>5.000</span>
                <span>0</span>
              </div>
              <svg
                viewBox="0 0 400 170"
                className="absolute inset-x-8 top-2 h-[85%] w-[calc(100%-2.5rem)] overflow-visible"
                role="img"
                aria-label="Gráfico de evolução mensal dos atendimentos"
              >
                <defs>
                  <linearGradient id="areaRelatorio" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#6BB5F4" stopOpacity=".35" />
                    <stop offset="100%" stopColor="#6BB5F4" stopOpacity=".02" />
                  </linearGradient>
                </defs>
                <path
                  d="M10 126 Q48 111 90 92 T175 96 T260 63 T345 48 L345 155 L10 155 Z"
                  fill="url(#areaRelatorio)"
                />
                <path
                  d="M10 126 Q48 111 90 92 T175 96 T260 63 T345 48"
                  fill="none"
                  stroke="#2479D8"
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
                  <circle key={cx} cx={cx} cy={cy} r="4.5" fill="#2479D8" />
                ))}
              </svg>
              <div className="absolute bottom-0 left-8 right-0 flex justify-between text-[10px] text-[#164A9B]">
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

        <div className="mt-4 grid gap-4 xl:grid-cols-3">
          <PainelCard titulo="Principais exames realizados">
            <BarrasHorizontais itens={exames} />
          </PainelCard>

          <PainelCard titulo="Tempo médio de espera por especialidade">
            <div className="mb-2 grid grid-cols-[1fr_auto] border-b border-[#D7EAFB] pb-2 text-[10px] font-semibold text-[#3971B7]">
              <span>Especialidade</span>
              <span>Tempo médio</span>
            </div>
            <div className="space-y-0.5">
              {especialidades.map(({ nome, tempo, Icone }) => (
                <div
                  key={nome}
                  className="grid grid-cols-[1fr_auto] items-center border-b border-[#E4F0FB] py-2 last:border-0"
                >
                  <div className="flex items-center gap-2 text-xs text-[#164A9B]">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#D8ECFF] text-[#2475D1]">
                      <Icone size={13} />
                    </span>
                    {nome}
                  </div>
                  <span className="text-xs font-medium text-[#164A9B]">
                    {tempo}
                  </span>
                </div>
              ))}
            </div>
          </PainelCard>

          <PainelCard titulo="Faixa etária dos pacientes">
            <div className="flex h-48 items-end justify-around gap-3 border-b border-[#D9EAF8] px-2 pt-3">
              {faixasEtarias.map((item) => (
                <div
                  key={item.faixa}
                  className="flex h-full min-w-0 flex-1 flex-col items-center justify-end"
                >
                  <span className="mb-1 text-[10px] font-medium text-[#164A9B]">
                    {item.valor}
                  </span>
                  <div
                    className="w-full max-w-12 rounded-t-md bg-gradient-to-t from-[#2369BD] to-[#438FE8]"
                    style={{ height: item.altura }}
                  />
                  <span className="mt-2 text-center text-[9px] leading-tight text-[#164A9B]">
                    {item.faixa}
                    <br />
                    anos
                  </span>
                </div>
              ))}
            </div>
          </PainelCard>
        </div>

        <footer className="mt-6 border-t border-[#D7EAFB] py-4 text-center text-xs text-[#6485B7]">
          ConectaSUS © 2025. Dados fictícios para demonstração.
        </footer>
      </div>
    </main>
  );
}
