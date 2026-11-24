"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  UsersRound,
  CalendarCheck,
  FlaskConical,
  BriefcaseMedical,
  UserRound,
  Activity,
  Stethoscope,
  RefreshCw,
} from "lucide-react";
import { api } from "@/lib/api";

const CORES = ["#023E8A", "#3563A7", "#0B1756", "#9BBCEB", "#C8D8EC"];

function numero(valor) {
  return Number(valor ?? 0).toLocaleString("pt-BR");
}

function PainelCard({ titulo, children, className = "" }) {
  return (
    <section className={`flex min-w-0 flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6 ${className}`}>
      <h2 className="mb-5 text-xl font-bold leading-tight tracking-tight text-[#0B1756]">{titulo}</h2>
      <div className="flex flex-1 flex-col">{children}</div>
    </section>
  );
}

function IndicadorCard({ titulo, valor, Icone, descricao }) {
  return (
    <article className="flex items-center gap-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-[#023E8A]/20 bg-[#023E8A]/[0.08] text-[#023E8A] shadow-[inset_0_1px_0_rgba(255,255,255,0.6)] backdrop-blur-sm">
        <Icone size={26} strokeWidth={2} />
      </div>
      <div className="min-w-0">
        <p className="text-sm font-bold leading-tight text-[#0B1756]">{titulo}</p>
        <p className="mt-1 text-2xl font-extrabold leading-none tracking-tight text-[#0B1756]">{numero(valor)}</p>
        <p className="mt-1.5 text-xs leading-snug text-slate-500">{descricao}</p>
      </div>
    </article>
  );
}

function EstadoGrafico({ texto = "Ainda não há dados disponíveis para este gráfico." }) {
  return (
    <div className="flex min-h-[190px] flex-1 items-center justify-center rounded-xl border border-dashed border-[#C8D8EC] bg-[#F1F6FA] px-5 text-center text-sm text-slate-500">
      {texto}
    </div>
  );
}

function BarrasHorizontais({ itens, nomeKey = "nome", valorKey = "valor" }) {
  if (!itens?.length) return <EstadoGrafico />;
  const maximo = Math.max(...itens.map((item) => Number(item[valorKey] ?? 0)), 1);
  return (
    <div className="flex min-h-[220px] flex-col justify-between gap-4">
      {itens.map((item, index) => {
        const valor = Number(item[valorKey] ?? 0);
        return (
          <div key={item.id ?? item[nomeKey] ?? index} className="grid grid-cols-[minmax(0,1fr)_minmax(70px,1.2fr)_58px] items-center gap-3 text-sm">
            <span className="min-w-0 font-normal leading-snug text-slate-600">{item[nomeKey]}</span>
            <div className="h-3 overflow-hidden rounded-full bg-[#EAF3F7]">
              <div className="h-full rounded-full bg-gradient-to-r from-[#3563A7] to-[#023E8A]" style={{ width: `${(valor / maximo) * 100}%` }} />
            </div>
            <span className="text-right font-semibold text-[#0B1756]">{numero(valor)}</span>
          </div>
        );
      })}
    </div>
  );
}

function GraficoStatus({ itens }) {
  if (!itens?.length) return <EstadoGrafico />;
  const total = itens.reduce((soma, item) => soma + Number(item.total ?? 0), 0);
  if (!total) return <EstadoGrafico />;
  let acumulado = 0;
  const gradiente = itens.map((item, index) => {
    const inicio = acumulado;
    acumulado += (Number(item.total) / total) * 100;
    return `${CORES[index % CORES.length]} ${inicio}% ${acumulado}%`;
  }).join(", ");

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-5 sm:flex-row">
      <div className="relative flex h-44 w-44 shrink-0 items-center justify-center rounded-full" style={{ background: `conic-gradient(${gradiente})` }}>
        <div className="flex h-[112px] w-[112px] flex-col items-center justify-center rounded-full bg-white text-center">
          <strong className="text-xl font-bold leading-tight text-[#0B1756]">{numero(total)}</strong>
          <span className="mt-1 text-[11px] font-semibold leading-none text-slate-500">registros</span>
        </div>
      </div>
      <div className="w-full space-y-3">
        {itens.map((item, index) => (
          <div key={item.status} className="flex items-center gap-2 text-sm">
            <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: CORES[index % CORES.length] }} />
            <span className="min-w-0 flex-1 capitalize text-slate-600">{String(item.status).replaceAll("_", " ")}</span>
            <strong className="text-[#0B1756]">{((Number(item.total) / total) * 100).toFixed(1).replace(".", ",")}%</strong>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function RelatoriosPage() {
  const [dados, setDados] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  const carregarRelatorios = useCallback(async () => {
    try {
      setCarregando(true);
      setErro("");
      const resposta = await api("/api/dashboard/admin");
      setDados(resposta?.dados ?? null);
    } catch (error) {
      setErro(error.message || "Não foi possível carregar os relatórios.");
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => {
    carregarRelatorios();
  }, [carregarRelatorios]);

  const unidades = useMemo(() => (dados?.unidades ?? []).map((unidade) => ({
    id: unidade.id,
    nome: unidade.nome,
    valor: Number(unidade.total_consultas ?? 0),
    pacientes_aguardando: Number(unidade.pacientes_aguardando ?? 0),
  })), [dados]);

  const totalConsultas = (dados?.consultas_por_status ?? []).reduce((soma, item) => soma + Number(item.total ?? 0), 0);
  const totalDomiciliares = (dados?.atendimentos_domiciliares_por_status ?? []).reduce((soma, item) => soma + Number(item.total ?? 0), 0);

  return (
    <main className="min-h-screen overflow-hidden bg-[#EEF5F9] font-sans text-[#0B1756]">
      <div className="mx-auto w-full max-w-[1600px] px-6 pt-7 2xl:px-10">
        <section className="relative isolate overflow-hidden rounded-[30px] bg-gradient-to-br from-[#174693] via-[#234E96] to-[#151A67] px-6 py-11 text-white shadow-[0_20px_55px_rgba(2,62,138,0.16)] sm:px-9 lg:px-10">
          <div className="pointer-events-none absolute -right-16 -top-36 h-96 w-96 rounded-full border-[48px] border-white/[0.07]" />
          <div className="pointer-events-none absolute right-[28%] top-10 h-52 w-52 rounded-full border-[30px] border-white/[0.05]" />
          <div className="pointer-events-none absolute -bottom-32 left-[38%] h-64 w-64 rounded-full bg-[#78A9E6]/10 blur-2xl" />
          <div className="relative flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-semibold text-blue-50">
                <Activity size={14} /> ADMINISTRAÇÃO · REDE MUNICIPAL
              </div>
              <h1 className="mt-4 text-3xl font-bold leading-tight sm:text-4xl">Relatórios</h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-blue-100 sm:text-base">Dados e estatísticas dos atendimentos.</p>
            </div>
            <button type="button" onClick={carregarRelatorios} disabled={carregando} className="inline-flex items-center justify-center gap-2 self-start rounded-xl border border-white/25 bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/20 disabled:opacity-60 sm:self-auto">
              <RefreshCw size={16} className={carregando ? "animate-spin" : ""} /> Atualizar
            </button>
          </div>
        </section>
      </div>

      <div className="mx-auto w-full max-w-[1600px] px-6 py-5 2xl:px-10">
        {erro && <div role="alert" className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{erro}</div>}
        {carregando && !dados ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500">Carregando dados dos relatórios...</div>
        ) : dados ? (
          <>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <IndicadorCard titulo="Pacientes ativos" valor={dados.pacientes_ativos} Icone={UsersRound} descricao="Pacientes com cadastro ativo" />
              <IndicadorCard titulo="Médicos ativos" valor={dados.medicos_ativos} Icone={Stethoscope} descricao="Profissionais com cadastro ativo" />
              <IndicadorCard titulo="Consultas hoje" valor={dados.consultas_hoje} Icone={CalendarCheck} descricao="Consultas pendentes ou confirmadas para hoje" />
              <IndicadorCard titulo="Pacientes aguardando" valor={dados.pacientes_aguardando} Icone={UserRound} descricao="Pacientes atualmente aguardando na fila" />
            </div>

            <div className="mt-5 grid items-stretch gap-4 xl:grid-cols-3">
              <PainelCard titulo="Consultas por situação">
                <GraficoStatus itens={dados.consultas_por_status ?? []} />
              </PainelCard>
              <PainelCard titulo="Atendimentos domiciliares por situação">
                <GraficoStatus itens={dados.atendimentos_domiciliares_por_status ?? []} />
              </PainelCard>
              <PainelCard titulo="Consultas por unidade de saúde">
                <BarrasHorizontais itens={unidades} />
              </PainelCard>
            </div>

            <div className="mt-4 grid gap-4 xl:grid-cols-3">
              <PainelCard titulo="Resumo da rede municipal">
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-xl bg-[#EAF3F7] p-4">
                    <p className="text-xs text-slate-500">Unidades ativas</p>
                    <p className="mt-1 text-2xl font-bold text-[#0B1756]">{numero(dados.unidades_ativas)}</p>
                  </div>
                  <div className="rounded-xl bg-[#EAF3F7] p-4">
                    <p className="text-xs text-slate-500">Consultas registradas</p>
                    <p className="mt-1 text-2xl font-bold text-[#0B1756]">{numero(totalConsultas)}</p>
                  </div>
                  <div className="rounded-xl bg-[#EAF3F7] p-4">
                    <p className="text-xs text-slate-500">Atendimentos domiciliares</p>
                    <p className="mt-1 text-2xl font-bold text-[#0B1756]">{numero(totalDomiciliares)}</p>
                  </div>
                  <div className="rounded-xl bg-[#EAF3F7] p-4">
                    <p className="text-xs text-slate-500">Pacientes na fila</p>
                    <p className="mt-1 text-2xl font-bold text-[#0B1756]">{numero(dados.pacientes_aguardando)}</p>
                  </div>
                </div>
              </PainelCard>
            </div>
          </>
        ) : (
          <EstadoGrafico texto="Não foi possível obter os dados dos relatórios." />
        )}
      </div>
    </main>
  );
}
