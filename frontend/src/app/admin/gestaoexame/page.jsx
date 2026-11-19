"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { api } from "@/lib/api";

function iniciais(nome = "") {
  return nome.split(" ").filter(Boolean).slice(0, 2).map((p) => p[0]).join("").toUpperCase();
}

function dataHoraLocal(valor) {
  if (!valor) return "";
  const data = new Date(valor);
  if (Number.isNaN(data.getTime())) return String(valor).replace(" ", "T").slice(0, 16);
  const local = new Date(data.getTime() - data.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 16);
}

function formatarDataHora(valor) {
  if (!valor) return "Não agendado";
  const data = new Date(String(valor).replace(" ", "T"));
  if (Number.isNaN(data.getTime())) return String(valor);
  return data.toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" });
}

function statusLabel(status) {
  const labels = {
    solicitado: "Aguardando agendamento",
    agendado: "Agendado",
    em_andamento: "Em andamento",
    concluido: "Concluído",
    cancelado: "Cancelado",
  };
  return labels[status] || status || "Não informado";
}

function StatusBadge({ status }) {
  const classes = {
    solicitado: "border-amber-200 bg-amber-50 text-amber-800",
    agendado: "border-blue-100 bg-blue-50 text-blue-700",
    em_andamento: "border-violet-100 bg-violet-50 text-violet-700",
    concluido: "border-emerald-100 bg-emerald-50 text-emerald-700",
    cancelado: "border-red-100 bg-red-50 text-red-700",
  };
  return (
    <span className={`inline-flex whitespace-nowrap rounded-full border px-3 py-1.5 text-[11px] font-semibold ${classes[status] || "border-slate-200 bg-slate-50 text-slate-600"}`}>
      {statusLabel(status)}
    </span>
  );
}

function Avatar({ name, large = false }) {
  return (
    <span className={`flex shrink-0 items-center justify-center rounded-full bg-[#EAF3F7] font-semibold text-[#3563A7] ${large ? "h-12 w-12 text-base" : "h-10 w-10 text-sm"}`}>
      {iniciais(name)}
    </span>
  );
}

function MetricCard({ label, value }) {
  return (
    <div className="flex min-h-[105px] flex-col justify-center rounded-xl border border-[#DCE8F3] bg-white px-4 py-4 shadow-[0_8px_24px_rgba(2,62,138,0.04)]">
      <span className="text-2xl font-bold leading-none text-[#0B1756]">{value}</span>
      <span className="mt-2 text-xs font-semibold leading-5 text-slate-500">{label}</span>
    </div>
  );
}

function TabButton({ active, onClick, children }) {
  return (
    <button type="button" onClick={onClick} className={`flex min-h-11 items-center justify-center rounded-xl px-3 py-3 text-center text-xs font-semibold transition sm:px-4 sm:text-sm ${active ? "bg-[#023E8A] text-white shadow-sm" : "text-[#3563A7] hover:bg-[#EAF3F7]"}`}>
      {children}
    </button>
  );
}

function InfoBlock({ title, children }) {
  return (
    <div className="rounded-xl border border-slate-100 bg-[#F8FAFC] p-3">
      <h3 className="text-sm font-bold text-[#3563A7]">{title}</h3>
      <div className="mt-2 text-xs font-normal leading-5 text-slate-600">{children}</div>
    </div>
  );
}

function EmptyState({ title, description }) {
  return (
    <div className="flex min-h-32 flex-col items-center justify-center rounded-xl border border-dashed border-[#D6E3F0] bg-[#EEF5F9] px-4 py-6 text-center">
      <p className="text-base font-semibold text-[#3563A7]">{title}</p>
      <p className="mt-1 text-sm font-normal text-slate-500">{description}</p>
    </div>
  );
}

export default function GestaoExamesPage() {
  const [exames, setExames] = useState([]);
  const [selecionadoId, setSelecionadoId] = useState(null);
  const [aba, setAba] = useState("pendentes");
  const [busca, setBusca] = useState("");
  const [dataAgendada, setDataAgendada] = useState("");
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState("");
  const [aviso, setAviso] = useState("");

  const carregarExames = useCallback(async () => {
    setCarregando(true);
    setErro("");
    try {
      const resposta = await api("/api/exames");
      const lista = Array.isArray(resposta) ? resposta : resposta?.exames || [];
      setExames(lista);
      setSelecionadoId((atual) => {
        if (atual && lista.some((item) => Number(item.id) === Number(atual))) return atual;
        return lista[0]?.id ?? null;
      });
    } catch (e) {
      setErro(e.message || "Não foi possível carregar os exames.");
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => {
    carregarExames();
  }, [carregarExames]);

  const pendentes = useMemo(() => exames.filter((item) => item.status === "solicitado"), [exames]);
  const selecionado = exames.find((item) => Number(item.id) === Number(selecionadoId)) || null;

  useEffect(() => {
    setDataAgendada(selecionado?.data_agendada ? dataHoraLocal(selecionado.data_agendada) : "");
    setErro("");
  }, [selecionadoId, selecionado?.data_agendada]);

  const listaBase = aba === "pendentes" ? pendentes : exames;
  const filtrados = useMemo(() => {
    const termo = busca.trim().toLocaleLowerCase("pt-BR");
    if (!termo) return listaBase;
    return listaBase.filter((item) =>
      [item.paciente, item.medico, item.unidade, item.tipo_exame, item.paciente_id, item.id, item.observacoes]
        .some((valor) => String(valor ?? "").toLocaleLowerCase("pt-BR").includes(termo))
    );
  }, [listaBase, busca]);

  const indicadores = useMemo(() => ({
    pendentes: exames.filter((item) => item.status === "solicitado").length,
    agendados: exames.filter((item) => item.status === "agendado").length,
    andamento: exames.filter((item) => item.status === "em_andamento").length,
    concluidos: exames.filter((item) => item.status === "concluido").length,
  }), [exames]);

  async function salvarAgendamento(event) {
    event.preventDefault();
    if (!selecionado) return;
    if (!dataAgendada) {
      setErro("Informe a data e o horário do exame.");
      return;
    }
    if (new Date(dataAgendada) <= new Date()) {
      setErro("O agendamento precisa ser em uma data e horário futuros.");
      return;
    }
    if (!["solicitado", "agendado"].includes(selecionado.status)) {
      setErro("Este exame não pode mais ter o agendamento alterado.");
      return;
    }

    setSalvando(true);
    setErro("");
    setAviso("");
    try {
      await api(`/api/exames/${selecionado.id}/agendamento`, {
        method: "PATCH",
        body: JSON.stringify({ data_agendada: dataAgendada }),
      });
      setAviso("Agendamento registrado com sucesso.");
      await carregarExames();
      setAba("todos");
    } catch (e) {
      setErro(e.message || "Não foi possível registrar o agendamento.");
    } finally {
      setSalvando(false);
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#EEF5F9] px-4 py-6 font-sans text-[#0B1756] sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute -left-40 top-64 h-96 w-96 rounded-full bg-[#D9EAF8]/70" />
      <div className="pointer-events-none absolute -right-48 top-24 h-[34rem] w-[34rem] rounded-full bg-[#D3E5F7]/70" />
      <div className="pointer-events-none absolute right-[12%] top-[1050px] h-56 w-56 rounded-full border-[42px] border-white/80" />

      <div className="relative z-10 mx-auto max-w-[1500px] space-y-5">
        <header className="relative overflow-hidden rounded-[30px] bg-gradient-to-br from-[#3563A7] via-[#023E8A] to-[#0B1756] px-6 py-8 text-white shadow-[0_20px_55px_rgba(2,62,138,0.16)] sm:px-9 lg:px-10">
          <div className="pointer-events-none absolute -right-16 -top-32 h-80 w-80 rounded-full bg-white/10" />
          <div className="pointer-events-none absolute left-[42%] top-10 h-56 w-56 rounded-full border-[36px] border-white/[0.05]" />
          <div className="relative z-10 max-w-3xl">
            <h1 className="text-3xl font-bold leading-tight sm:text-4xl lg:text-[42px]">Análise de prontuários e exames</h1>
            <p className="mt-3 max-w-2xl text-sm font-normal leading-6 text-blue-100 sm:text-base">
              Consulte os pedidos de exames registrados, confira as informações disponíveis e organize o agendamento.
            </p>
          </div>
        </header>

        <div className="rounded-2xl border border-blue-200 bg-blue-50/90 px-4 py-3 text-sm font-normal leading-6 text-[#0B1756]">
          <strong className="font-semibold">Importante:</strong> esta tela exibe os pedidos registrados no sistema. Os dados clínicos completos do prontuário não são retornados pela API administrativa de exames; a decisão clínica deve permanecer sob responsabilidade do profissional habilitado.
        </div>

        <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard label="Pedidos aguardando agendamento" value={indicadores.pendentes} />
          <MetricCard label="Exames agendados" value={indicadores.agendados} />
          <MetricCard label="Em andamento" value={indicadores.andamento} />
          <MetricCard label="Concluídos" value={indicadores.concluidos} />
        </section>

        <section className="overflow-hidden rounded-[22px] border border-[#DCE8F3] bg-white shadow-[0_12px_36px_rgba(2,62,138,0.07)]">
          <div className="grid grid-cols-2 gap-2 p-2 sm:p-3">
            <TabButton active={aba === "pendentes"} onClick={() => setAba("pendentes")}>
              Pedidos aguardando agendamento ({indicadores.pendentes})
            </TabButton>
            <TabButton active={aba === "todos"} onClick={() => setAba("todos")}>
              Todos os exames ({exames.length})
            </TabButton>
          </div>
        </section>

        {aviso && (
          <div className="flex items-start justify-between gap-4 rounded-2xl border border-[#C9DDF0] bg-[#EAF3F7] px-4 py-3 text-sm text-[#0B1756]">
            <p className="flex-1">{aviso}</p>
            <button type="button" onClick={() => setAviso("")} className="rounded-lg px-2 py-1 text-xs font-semibold text-[#3563A7] hover:bg-white">Fechar</button>
          </div>
        )}

        {erro && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{erro}</div>
        )}

        <section className="overflow-hidden rounded-[22px] border border-[#DCE8F3] bg-white shadow-sm">
          <div className="border-b border-slate-100 p-4 sm:p-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 className="text-xl font-bold sm:text-2xl">{aba === "pendentes" ? "Pedidos de exames recebidos" : "Exames registrados"}</h2>
                <p className="mt-1 text-sm font-normal text-slate-500">Selecione um registro para consultar os dados e, quando permitido, agendar.</p>
              </div>
              <div className="flex w-full gap-2 lg:max-w-[520px]">
                <input value={busca} onChange={(event) => setBusca(event.target.value)} placeholder="Buscar paciente, CPF, exame ou unidade" className="h-11 min-w-0 flex-1 rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none focus:border-[#3563A7]" />
                <button type="button" onClick={carregarExames} disabled={carregando} className="rounded-xl border border-slate-200 px-4 text-xs font-semibold text-[#3563A7] hover:bg-[#EAF3F7] disabled:opacity-50">{carregando ? "Atualizando" : "Atualizar"}</button>
              </div>
            </div>
          </div>

          {carregando ? (
            <div className="p-8 text-center text-sm text-slate-500">Carregando registros do sistema...</div>
          ) : filtrados.length === 0 ? (
            <div className="p-4"><EmptyState title="Nenhum pedido encontrado" description={aba === "pendentes" ? "Não há exames aguardando agendamento no momento." : "Não existem exames registrados ou a busca não encontrou resultados."} /></div>
          ) : (
            <>
              <div className="grid gap-2 border-b border-slate-100 p-3 sm:grid-cols-2 xl:grid-cols-4">
                {filtrados.map((item) => (
                  <button key={item.id} type="button" onClick={() => setSelecionadoId(item.id)} className={`min-h-[118px] rounded-xl border p-3 text-left transition ${Number(selecionadoId) === Number(item.id) ? "border-[#3563A7] bg-[#EAF3F7] ring-2 ring-[#3563A7]/10" : "border-slate-100 bg-white hover:border-[#3563A7] hover:bg-[#F8FBFD]"}`}>
                    <div className="flex items-start gap-2.5">
                      <Avatar name={item.paciente || "Paciente"} />
                      <span className="min-w-0 flex-1">
                        <span className="block text-sm font-semibold leading-5">{item.paciente || `Paciente #${item.paciente_id}`}</span>
                        <span className="mt-1 block text-xs text-slate-500">Pedido #{item.id}</span>
                      </span>
                    </div>
                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <StatusBadge status={item.status} />
                    </div>
                    <span className="mt-2 block line-clamp-2 text-xs leading-5 text-slate-600">{item.tipo_exame}</span>
                  </button>
                ))}
              </div>
              <div className="bg-[#EEF5F9] px-4 py-3 text-xs text-slate-500">{filtrados.length} registro(s) exibido(s) · Dados carregados do banco de dados</div>
            </>
          )}
        </section>

        {selecionado && (
          <section className="overflow-hidden rounded-[22px] border border-[#DCE8F3] bg-white shadow-sm">
            <div className="flex flex-col gap-3 border-b border-slate-100 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
              <div className="flex min-w-0 items-center gap-3">
                <Avatar name={selecionado.paciente || "Paciente"} large />
                <div className="min-w-0">
                  <h2 className="text-lg font-bold sm:text-xl">{selecionado.paciente || `Paciente #${selecionado.paciente_id}`}</h2>
                  <p className="mt-1 text-xs text-slate-500">Pedido de exame #{selecionado.id} · Paciente ID {selecionado.paciente_id}</p>
                  <p className="mt-1 text-xs text-slate-500">Solicitante: {selecionado.medico || "Não informado"}</p>
                </div>
              </div>
              <StatusBadge status={selecionado.status} />
            </div>

            <div className="grid gap-3 p-4 sm:grid-cols-2 sm:p-5">
              <InfoBlock title="Exame solicitado">{selecionado.tipo_exame || "Não informado"}</InfoBlock>
              <InfoBlock title="Unidade responsável">{selecionado.unidade || "Não informada"}</InfoBlock>
              <InfoBlock title="Observações do pedido">{selecionado.observacoes || "Nenhuma observação registrada no pedido."}</InfoBlock>
              <InfoBlock title="Consulta vinculada">{selecionado.consulta_id ? `Consulta #${selecionado.consulta_id}` : "Nenhuma consulta vinculada"}</InfoBlock>
              <InfoBlock title="Data da solicitação">{formatarDataHora(selecionado.criado_em)}</InfoBlock>
              <InfoBlock title="Data agendada">{formatarDataHora(selecionado.data_agendada)}</InfoBlock>
              {selecionado.resultado && (
                <div className="sm:col-span-2"><InfoBlock title="Resultado registrado">{selecionado.resultado}</InfoBlock></div>
              )}
            </div>

            <form onSubmit={salvarAgendamento} className="border-t border-slate-100 p-4 sm:p-5">
              <div>
                <h2 className="text-xl font-bold sm:text-2xl">Agendamento do exame</h2>
                <p className="mt-1 text-sm leading-5 text-slate-500">Registre a data e o horário confirmados pela unidade responsável.</p>
              </div>

              {["solicitado", "agendado"].includes(selecionado.status) ? (
                <>
                  <div className="mt-4 grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-xs font-semibold">Data e horário <span className="text-red-500">*</span></label>
                      <input type="datetime-local" required min={new Date(Date.now() + 60000).toISOString().slice(0, 16)} value={dataAgendada} onChange={(event) => setDataAgendada(event.target.value)} className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-[#3563A7]" />
                    </div>
                    <div className="flex items-end">
                      <p className="w-full rounded-xl border border-blue-100 bg-blue-50/70 p-3 text-xs leading-5 text-slate-600">A unidade já está vinculada ao pedido original. A API atual não oferece alteração administrativa da unidade nem registro de prioridade.</p>
                    </div>
                  </div>
                  <div className="mt-5 flex justify-end border-t border-slate-100 pt-4">
                    <button type="submit" disabled={salvando} className="rounded-xl bg-[#023E8A] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#0B1756] disabled:cursor-not-allowed disabled:opacity-60">
                      {salvando ? "Salvando..." : selecionado.status === "agendado" ? "Atualizar agendamento" : "Confirmar agendamento"}
                    </button>
                  </div>
                </>
              ) : (
                <p className="mt-4 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">Este exame está com status “{statusLabel(selecionado.status)}” e não pode ser agendado ou alterado por esta tela.</p>
              )}
            </form>
          </section>
        )}
      </div>
    </main>
  );
}
