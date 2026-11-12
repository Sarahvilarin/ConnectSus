
"use client";

import { useEffect, useState } from "react";
import { api } from "../../../lib/api";

const atividadesRecentes = [
  {
    titulo: "Novo paciente cadastrado",
    descricao: "Maria Oliveira · UBS Centro",
    horario: "Há 5 minutos",
    icone: "users",
  },
  {
    titulo: "Consulta agendada",
    descricao: "João Santos · UBS Norte",
    horario: "Há 18 minutos",
    icone: "clock",
  },
  {
    titulo: "Atendimento finalizado",
    descricao: "Ana Costa · UBS Centro",
    horario: "Há 32 minutos",
    icone: "check",
  },
  {
    titulo: "Novo exame solicitado",
    descricao: "Carlos Mendes · UBS Sul",
    horario: "Há 46 minutos",
    icone: "hospital",
  },
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
    <article className="group relative overflow-hidden rounded-[24px] border border-[#3563A7]/30 bg-[#023E8A] p-6 shadow-md transition-all duration-500 ease-out hover:-translate-y-2 hover:bg-[#0B1756] hover:shadow-xl">
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

        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/15 text-white transition-all duration-500 group-hover:rotate-6 group-hover:scale-110 group-hover:bg-white/25">
          <Icone tipo={indicador.icone} className="h-7 w-7" />
        </div>
      </div>
    </article>
  );
}

export default function DashboardAdmin() {
  const [dadosDashboard, setDadosDashboard] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    async function carregarDashboard() {
      try {
        const resposta = await api("/dashboard/admin");
        setDadosDashboard(resposta.dados);
      } catch (error) {
        setErro(error.message);
      } finally {
        setCarregando(false);
      }
    }

    carregarDashboard();
  }, []);

  const unidades = dadosDashboard?.unidades ?? [];

  const maiorVolume = Math.max(
    ...unidades.map((unidade) => Number(unidade.total_consultas) || 0),
    1
  );

  const indicadores = [
    {
      titulo: "Pacientes ativos",
      valor: carregando
        ? "..."
        : erro
          ? "—"
          : dadosDashboard?.pacientes_ativos ?? 0,
      icone: "users",
    },
    {
      titulo: "Pacientes aguardando",
      valor: carregando
        ? "..."
        : erro
          ? "—"
          : dadosDashboard?.pacientes_aguardando ?? 0,
      icone: "clock",
    },
    {
      titulo: "Consultas agendadas hoje",
      valor: carregando
        ? "..."
        : erro
          ? "—"
          : dadosDashboard?.consultas_hoje ?? 0,
      icone: "activity",
    },
    {
      titulo: "Médicos ativos",
      valor: carregando
        ? "..."
        : erro
          ? "—"
          : dadosDashboard?.medicos_ativos ?? 0,
      icone: "hospital",
    },
  ];

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#EAF3F7] text-[#0B1756]">

      {/* Fundo com ilustrações de círculos */}
      <div className="pointer-events-none absolute -right-28 -top-36 h-[430px] w-[430px] rounded-full bg-[#B8D6FC]/50" />

      <div className="pointer-events-none absolute -left-40 top-10 h-[330px] w-[330px] rounded-full border-2 border-[#C8DEFF]/60" />

      <div className="pointer-events-none absolute -bottom-36 -left-24 h-[350px] w-[350px] rounded-full bg-white/50" />

      <div className="pointer-events-none absolute -bottom-40 -right-24 h-[430px] w-[430px] rounded-full border-[70px] border-[#C5DFFF]/50" />

      <div className="relative z-10 mx-auto w-full max-w-[1480px] space-y-8 px-6 py-7 sm:py-10 xl:px-8">

        {/* BANNER ADMINISTRATIVO */}
        <section className="grid items-center gap-8 lg:grid-cols-[1fr_0.9fr] lg:gap-8">

          <div className="max-w-[570px] -translate-y-6">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/80 px-5 py-3 text-sm font-semibold text-[#023E8A] shadow-sm">
              <span className="h-2 w-2 rounded-full bg-[#3563A7]" />
              Área administrativa
            </div>

            <h1 className="mt-6 text-4xl font-extrabold leading-tight tracking-tight text-[#0B1756] sm:text-5xl md:text-5xl">
              Gestão inteligente,
              <br />
              <span className="text-[#023E8A]">
                cuidado mais eficiente.
              </span>
            </h1>

            <p className="mt-5 max-w-lg text-base leading-7 text-[#425875] sm:text-lg">
              Acompanhe os principais indicadores e identifique o que
              precisa de atenção nas unidades de saúde.
            </p>
          </div>

          {/* IMAGEM ADMINISTRATIVA */}
          <div className="relative min-h-[380px] w-full lg:min-h-[500px] lg:w-[150%] lg:-ml-[50%] lg:-translate-y-10">
            <img
              src="/img-dashboard-admin.jpeg"
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

        {/* ERRO DE CARREGAMENTO */}
        {erro && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-medium text-red-700">
            Não foi possível carregar os indicadores do dashboard: {erro}
          </div>
        )}

        {/* INDICADORES PRINCIPAIS */}
        <section className="mt-6">
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
              <div>
                <h2 className="text-lg font-extrabold">
                  Resumo das unidades
                </h2>
                <p className="mt-1 text-sm text-[#0B1756]/55">
                  Consultas e pacientes aguardando por unidade.
                </p>
              </div>
            </div>

            <div className="mt-6 space-y-6">
              {carregando ? (
                <p className="py-6 text-center text-sm text-[#0B1756]/55">
                  Carregando unidades...
                </p>
              ) : erro ? (
                <p className="py-6 text-center text-sm text-red-600">
                  Não foi possível carregar as unidades.
                </p>
              ) : unidades.length === 0 ? (
                <div className="rounded-xl border border-dashed border-[#C8D8EC] bg-[#F8FBFE] px-5 py-10 text-center">
                  <p className="font-bold text-[#0B1756]">
                    Nenhuma unidade cadastrada
                  </p>
                  <p className="mt-2 text-sm text-[#0B1756]/55">
                    As unidades aparecerão aqui assim que forem cadastradas no sistema.
                  </p>
                </div>
              ) : (
                unidades.map((unidade) => {
                  const totalConsultas =
                    Number(unidade.total_consultas) || 0;

                  const pacientesAguardando =
                    Number(unidade.pacientes_aguardando) || 0;

                  const percentual =
                    (totalConsultas / maiorVolume) * 100;

                  return (
                    <div key={unidade.id}>
                      <div className="mb-2 flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <p className="font-bold">{unidade.nome}</p>
                          <p className="mt-1 text-sm text-[#0B1756]/60">
                            {unidade.bairro}
                          </p>
                        </div>

                        <div className="text-right">
                          <p className="text-sm font-bold text-[#023E8A]">
                            {totalConsultas} consultas
                          </p>
                          <p className="mt-1 text-xs text-[#0B1756]/60">
                            {pacientesAguardando} aguardando
                          </p>
                        </div>
                      </div>

                      <div
                        className="h-2.5 overflow-hidden rounded-full bg-[#EAF3F7]"
                        role="progressbar"
                        aria-label={`Consultas registradas na ${unidade.nome}`}
                        aria-valuenow={totalConsultas}
                        aria-valuemin={0}
                        aria-valuemax={maiorVolume}
                      >
                        <div
                          className="h-full rounded-full bg-[#3563A7] transition-all duration-500"
                          style={{ width: `${percentual}%` }}
                        />
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </article>

          {/* Alertas e situação do sistema */}
          <div className="flex flex-col gap-5">
            <article className="flex-1 rounded-2xl border border-[#3563A7]/10 bg-white p-5 shadow-sm sm:p-7">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-extrabold">
                    Alertas importantes
                  </h2>
                  <p className="mt-1 text-sm text-[#0B1756]/55">
                    Situações que merecem atenção.
                  </p>
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

            
          </div>
        </section>

        {/* ATIVIDADE RECENTE */}
        <section className="relative overflow-hidden rounded-2xl border border-[#DCE6F0] bg-white p-5 shadow-[0_4px_18px_rgba(11,23,86,0.05)] sm:p-7">

          <div className="mb-7 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-extrabold tracking-tight text-[#0B1756]">
                Atividade recente
              </h2>
              <p className="mt-1 text-sm text-[#718096]">
                Acompanhe as últimas movimentações do sistema.
              </p>
            </div>

            <span className="rounded-full border border-[#D8E8F5] bg-[#F1F7FC] px-4 py-2 text-xs font-bold text-[#356B9E]">
              Hoje
            </span>
          </div>

          <div className="space-y-3">
            {atividadesRecentes.map((atividade, index) => (
              <div
                key={index}
                className="group relative flex items-center gap-4 overflow-hidden rounded-xl border border-[#E8EEF5] bg-white p-4 transition-all duration-200 hover:border-[#BBD3E9] hover:bg-[#F8FBFE]"
              >
                <div className="absolute bottom-0 left-0 top-0 w-1 bg-[#B7D5EC] transition-colors group-hover:bg-[#2875B5]" />

                <div className="min-w-0 flex-1 pl-2">
                  <div className="mb-1.5 flex flex-wrap items-center gap-2">
                    <p className="text-sm font-bold text-[#172B4D]">
                      {atividade.titulo}
                    </p>

                    {index === 0 && (
                      <span className="rounded-md bg-[#EAF4FB] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-[#3475A8]">
                        Mais recente
                      </span>
                    )}
                  </div>

                  <p className="text-xs leading-relaxed text-[#718096] sm:text-sm">
                    {atividade.descricao}
                  </p>
                </div>

                <div className="shrink-0 border-l border-[#E8EEF5] pl-3 text-right">
                  <p className="text-sm font-bold tabular-nums text-[#356B9E]">
                    {atividade.horario}
                  </p>
                  <p className="mt-1 text-[10px] font-medium uppercase tracking-wider text-[#A0AEC0]">
                    Horário
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

      </div>
    </main>
  );
}
