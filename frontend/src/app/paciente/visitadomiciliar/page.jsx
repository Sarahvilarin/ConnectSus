"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { api } from "../../../lib/api";

const CONTAINER = "mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8";
const inputCls = "w-full rounded-2xl border border-[#C8D8EC] bg-white px-4 py-3 text-sm text-[#0B1756] outline-none transition placeholder:text-slate-400 hover:border-[#3563A7]/70 focus:border-[#023E8A] focus:ring-4 focus:ring-[#3563A7]/15";

const STATUS = {
  solicitado: { label: "Solicitada", color: "bg-[#EAF3F7] text-[#0B1756]" },
  agendado: { label: "Agendada", color: "bg-[#DCE9FB] text-[#17418E]" },
  em_andamento: { label: "Em andamento", color: "bg-[#023E8A] text-white" },
  concluido: { label: "Concluída", color: "bg-emerald-100 text-emerald-800" },
  cancelado: { label: "Cancelada", color: "bg-slate-100 text-slate-600" },
};

function formatarData(valor) {
  if (!valor) return "Ainda não agendada";
  const data = new Date(valor);
  if (Number.isNaN(data.getTime())) return "Data não definida";
  return data.toLocaleDateString("pt-BR", { timeZone: "UTC" });
}

function formatarDataHora(valor) {
  if (!valor) return "A definir pela equipe";
  const data = new Date(valor);
  if (Number.isNaN(data.getTime())) return "A definir pela equipe";
  return data.toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" });
}

function StatusBadge({ status }) {
  const item = STATUS[status] || { label: status || "Status indisponível", color: "bg-slate-100 text-slate-600" };
  return <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${item.color}`}>{item.label}</span>;
}

function Modal({ children, onClose }) {
  useEffect(() => {
    const fechar = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", fechar);
    return () => window.removeEventListener("keydown", fechar);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0B1756]/40 p-4 backdrop-blur-sm" onMouseDown={onClose}>
      <div role="dialog" aria-modal="true" className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-xl" onMouseDown={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
}

function Campo({ label, children, erro }) {
  return <div><label className="mb-1.5 block text-xs font-semibold text-slate-600">{label}</label>{children}{erro && <p className="mt-1 text-xs text-rose-600">{erro}</p>}</div>;
}

function enderecoDoPaciente(paciente = {}) {
  return {
    cep: paciente.cep || "",
    rua: paciente.rua || "",
    numero: paciente.numero == null ? "" : String(paciente.numero),
    bairro: paciente.bairro || "",
    complemento: paciente.complemento || "",
  };
}

export default function MinhasVisitasPage() {
  const [paciente, setPaciente] = useState(null);
  const [unidades, setUnidades] = useState([]);
  const [visitas, setVisitas] = useState([]);
  const [filtro, setFiltro] = useState("ativas");
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({ unidade_id: "", motivo: "", ...enderecoDoPaciente() });
  const [carregando, setCarregando] = useState(true);
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState("");
  const [aviso, setAviso] = useState("");

  const carregarDados = useCallback(async () => {
    setCarregando(true);
    setErro("");
    try {
      const [perfilResposta, visitasResposta, unidadesResposta] = await Promise.all([
        api("/pacientes/me"),
        api("/atendimentos-domiciliares/paciente/me"),
        api("/unidades"),
      ]);
      const perfil = perfilResposta?.paciente || perfilResposta;
      const listaVisitas = Array.isArray(visitasResposta) ? visitasResposta : visitasResposta?.atendimentos || [];
      const listaUnidades = Array.isArray(unidadesResposta) ? unidadesResposta : unidadesResposta?.unidades || [];
      setPaciente(perfil);
      setVisitas(listaVisitas);
      setUnidades(listaUnidades.filter((u) => u.ativo !== false && u.ativo !== 0));
      setForm((atual) => ({ ...atual, ...enderecoDoPaciente(perfil) }));
    } catch (e) {
      setErro(e.message || "Não foi possível carregar as informações.");
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => { carregarDados(); }, [carregarDados]);

  const lista = useMemo(() => visitas
    .filter((v) => filtro === "ativas" ? !["concluido", "cancelado"].includes(v.status) : ["concluido", "cancelado"].includes(v.status))
    .sort((a, b) => new Date(b.data_solicitacao || 0) - new Date(a.data_solicitacao || 0)), [visitas, filtro]);

  const visitaSelecionada = visitas.find((v) => String(v.id) === String(modal?.id));
  const atualizarCampo = (campo, valor) => setForm((atual) => ({ ...atual, [campo]: valor }));

  async function enviarSolicitacao(e) {
    e.preventDefault();
    setErro("");
    if (!form.unidade_id || !form.motivo.trim() || !form.rua.trim() || !form.numero.trim() || !form.bairro.trim() || !form.cep.trim()) {
      setErro("Preencha a unidade, o motivo e todos os campos obrigatórios do endereço.");
      return;
    }
    setEnviando(true);
    try {
      await api("/atendimentos-domiciliares", {
        method: "POST",
        body: JSON.stringify({
          unidade_id: Number(form.unidade_id),
          motivo: form.motivo.trim(),
          rua: form.rua.trim(),
          numero: form.numero.trim(),
          bairro: form.bairro.trim(),
          cep: form.cep.replace(/\D/g, ""),
          complemento: form.complemento.trim() || null,
        }),
      });
      setModal(null);
      setFiltro("ativas");
      setAviso("Solicitação enviada. A equipe da unidade fará a análise.");
      setForm((atual) => ({ ...atual, motivo: "" }));
      await carregarDados();
    } catch (e) {
      setErro(e.message || "Não foi possível enviar a solicitação.");
    } finally {
      setEnviando(false);
    }
  }

  async function cancelarSolicitacao(id) {
    setErro("");
    try {
      await api(`/atendimentos-domiciliares/${id}/cancelar`, { method: "PATCH" });
      setModal(null);
      setAviso("Solicitação cancelada.");
      await carregarDados();
    } catch (e) {
      setErro(e.message || "Não foi possível cancelar a solicitação.");
    }
  }

  useEffect(() => {
    if (!aviso) return;
    const timer = setTimeout(() => setAviso(""), 4000);
    return () => clearTimeout(timer);
  }, [aviso]);

  return (
    <div className="min-h-screen bg-[#EEF5F9] font-sans text-[#0B1756]">
      <div className="pointer-events-none fixed -right-40 -top-24 h-[420px] w-[420px] rounded-full bg-[#DCE9FB]/70" />
      <div className="pointer-events-none fixed -left-24 top-24 h-80 w-80 rounded-full border border-[#C8D8EC]/70" />
      <main className={`relative z-10 py-8 ${CONTAINER}`}>
        <section className="mb-6 flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-[#DCE9FB] px-3 py-1.5 text-xs font-bold text-[#0B1756]">Visita domiciliar</span>
            <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-[#0B1756] sm:text-4xl lg:text-[42px]">Minhas visitas</h1>
            <p className="mt-3 text-base leading-7 text-slate-600">Solicite uma visita da equipe de saúde em casa e acompanhe o andamento por aqui.</p>
          </div>
          <button type="button" onClick={() => { setErro(""); setForm((atual) => ({ ...atual, ...enderecoDoPaciente(paciente) })); setModal({ tipo: "nova" }); }} disabled={!paciente} className="rounded-2xl bg-[#023E8A] px-6 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#0B1756] disabled:cursor-not-allowed disabled:opacity-50">+ Solicitar visita</button>
        </section>

        {erro && !modal && <div role="alert" className="mb-5 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{erro}</div>}

        <div className="space-y-6">
          <section className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EAF3F7]">♙</span><h2 className="text-lg font-bold">Suas informações</h2></div>
            {carregando ? <p className="mt-4 text-sm text-slate-500">Carregando seus dados...</p> : paciente ? (
              <dl className="mt-4 grid grid-cols-1 gap-4 text-sm sm:grid-cols-2 lg:grid-cols-4">
                {[["Paciente", paciente.nome_social || paciente.nome_completo || "Não informado"], ["CNS", paciente.cns || "Não informado"], ["Telefone", paciente.telefone || "Não informado"], ["Endereço", [paciente.rua, paciente.numero, paciente.bairro].filter(Boolean).join(", ") || "Endereço não cadastrado"]].map(([k, v]) => <div key={k} className="rounded-xl bg-[#F4F8FC] px-4 py-3"><dt className="text-xs font-semibold text-slate-500">{k}</dt><dd className="mt-1 break-words font-medium">{v}</dd></div>)}
              </dl>
            ) : <p className="mt-4 text-sm text-rose-600">Não foi possível carregar o perfil do paciente.</p>}
          </section>

          <section className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm sm:p-6">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <div><h2 className="text-2xl font-bold">Suas solicitações</h2><p className="mt-1 text-sm text-slate-500">{lista.length} {lista.length === 1 ? "solicitação" : "solicitações"} nesta lista</p></div>
              <div className="flex rounded-xl bg-slate-100 p-1">{[["ativas", "Em andamento"], ["historico", "Encerradas"]].map(([valor, rotulo]) => <button key={valor} type="button" onClick={() => setFiltro(valor)} className={`rounded-lg px-4 py-2 text-xs font-semibold transition ${filtro === valor ? "bg-white text-[#17418E] shadow-sm" : "text-slate-500 hover:text-[#17418E]"}`}>{rotulo}</button>)}</div>
            </div>
            {carregando ? <p className="py-8 text-center text-sm text-slate-500">Carregando solicitações...</p> : lista.length ? (
              <ul className="space-y-3">{lista.map((v) => {
                const agendada = v.data_agendada;
                const podeCancelar = ["solicitado", "agendado"].includes(v.status);
                return <li key={v.id} className="group flex flex-col gap-4 rounded-2xl border border-[#E1EAF4] bg-[#FAFCFE] p-4 transition hover:border-[#3563A7]/50 hover:bg-white hover:shadow-md sm:flex-row sm:items-center">
                  <div className="flex h-[76px] w-[76px] shrink-0 flex-col items-center justify-center rounded-[24px] bg-[#EAF3F7] text-center"><span className="text-xs font-semibold text-slate-500">Pedido</span><span className="text-2xl font-extrabold">#{v.id}</span></div>
                  <div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><p className="text-lg font-bold">{v.unidade || "Unidade não informada"}</p><StatusBadge status={v.status} /></div><p className="mt-1 line-clamp-2 text-sm text-slate-600">{v.motivo}</p><div className="mt-2 flex flex-wrap gap-2 text-xs text-slate-500"><span className="rounded-full bg-[#EAF3F7] px-3 py-1">Solicitada em {formatarData(v.data_solicitacao)}</span>{agendada && <span className="rounded-full bg-[#EAF3F7] px-3 py-1">Agendada: {formatarDataHora(agendada)}</span>}{v.medico && <span className="rounded-full bg-[#EAF3F7] px-3 py-1">Profissional: {v.medico}</span>}</div></div>
                  <button type="button" onClick={() => { setErro(""); setModal({ tipo: "detalhe", id: v.id }); }} className="shrink-0 rounded-xl border border-[#C8D8EC] bg-white px-5 py-2.5 text-sm font-semibold text-[#17418E] transition hover:bg-[#EAF3F7]">Ver detalhes</button>
                </li>;
              })}</ul>
            ) : <div className="rounded-xl border border-dashed border-slate-200 px-4 py-10 text-center"><p className="text-sm font-medium text-slate-600">{filtro === "ativas" ? "Nenhuma solicitação em andamento" : "Nenhuma visita encerrada ainda"}</p>{filtro === "ativas" && <button type="button" onClick={() => setModal({ tipo: "nova" })} className="mt-3 text-sm font-semibold text-[#17418E] hover:underline">Solicitar uma visita</button>}</div>}
          </section>
        </div>
      </main>

      {modal?.tipo === "nova" && <Modal onClose={() => !enviando && setModal(null)}>
        <div className="mb-5 flex items-start justify-between border-b border-slate-100 pb-4"><div><h3 className="text-lg font-bold">Solicitar visita domiciliar</h3><p className="mt-1 text-sm text-slate-500">Informe a unidade, o motivo e confirme o endereço da visita.</p></div><button type="button" onClick={() => setModal(null)} className="rounded-lg p-2 text-xl text-slate-500 hover:bg-[#EAF3F7]">×</button></div>
        <form onSubmit={enviarSolicitacao} className="space-y-4">
          <Campo label="Unidade de saúde"><select required value={form.unidade_id} onChange={(e) => atualizarCampo("unidade_id", e.target.value)} className={inputCls}><option value="">Selecione uma unidade</option>{unidades.map((u) => <option key={u.id} value={u.id}>{u.nome}{u.tipo_unidade ? ` — ${u.tipo_unidade}` : ""}</option>)}</select></Campo>
          {unidades.length === 0 && <p className="text-xs text-amber-700">Nenhuma unidade ativa foi retornada pela API. Verifique o cadastro de unidades.</p>}
          <Campo label="Motivo da visita"><textarea required minLength={5} rows={3} value={form.motivo} onChange={(e) => atualizarCampo("motivo", e.target.value)} placeholder="Descreva por que precisa de atendimento domiciliar" className={inputCls} /></Campo>
          <div className="border-t border-slate-100 pt-4"><h4 className="mb-3 text-sm font-bold">Endereço da visita</h4><div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Campo label="CEP"><input required value={form.cep} onChange={(e) => atualizarCampo("cep", e.target.value)} placeholder="00000-000" className={inputCls} /></Campo>
            <Campo label="Número"><input required value={form.numero} onChange={(e) => atualizarCampo("numero", e.target.value)} className={inputCls} /></Campo>
            <div className="sm:col-span-2"><Campo label="Rua ou avenida"><input required value={form.rua} onChange={(e) => atualizarCampo("rua", e.target.value)} className={inputCls} /></Campo></div>
            <Campo label="Bairro"><input required value={form.bairro} onChange={(e) => atualizarCampo("bairro", e.target.value)} className={inputCls} /></Campo>
            <Campo label="Complemento"><input value={form.complemento} onChange={(e) => atualizarCampo("complemento", e.target.value)} placeholder="Apartamento, bloco, referência..." className={inputCls} /></Campo>
          </div><p className="mt-2 text-xs text-slate-500">Os dados foram preenchidos com o endereço cadastrado. Confira antes de enviar.</p></div>
          {erro && <p role="alert" className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">{erro}</p>}
          <div className="flex flex-col-reverse gap-2 border-t border-slate-100 pt-4 sm:flex-row sm:justify-end"><button type="button" onClick={() => setModal(null)} disabled={enviando} className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600">Voltar</button><button type="submit" disabled={enviando || unidades.length === 0} className="rounded-xl bg-[#023E8A] px-5 py-3 text-sm font-semibold text-white hover:bg-[#0B1756] disabled:opacity-50">{enviando ? "Enviando..." : "Enviar solicitação"}</button></div>
        </form>
      </Modal>}

      {modal?.tipo === "detalhe" && visitaSelecionada && <Modal onClose={() => setModal(null)}>
        <div className="mb-5 flex items-start justify-between border-b border-slate-100 pb-4"><div><h3 className="text-lg font-bold">Solicitação #{visitaSelecionada.id}</h3><p className="mt-1 text-sm text-slate-500">Detalhes do atendimento domiciliar</p></div><button type="button" onClick={() => setModal(null)} className="rounded-lg p-2 text-xl text-slate-500 hover:bg-[#EAF3F7]">×</button></div>
        <div className="space-y-4"><StatusBadge status={visitaSelecionada.status} /><div className="space-y-2 rounded-xl bg-slate-50 p-4 text-sm text-slate-600"><p><strong>Unidade:</strong> {visitaSelecionada.unidade || "Não informada"}</p><p><strong>Motivo:</strong> {visitaSelecionada.motivo}</p><p><strong>Endereço:</strong> {[visitaSelecionada.rua, visitaSelecionada.numero, visitaSelecionada.bairro].filter(Boolean).join(", ")}</p><p><strong>CEP:</strong> {visitaSelecionada.cep || "Não informado"}</p><p><strong>Solicitação:</strong> {formatarData(visitaSelecionada.data_solicitacao)}</p><p><strong>Agendamento:</strong> {formatarDataHora(visitaSelecionada.data_agendada)}</p><p><strong>Profissional:</strong> {visitaSelecionada.medico || "Ainda não definido"}</p>{visitaSelecionada.observacoes && <p><strong>Observações da equipe:</strong> {visitaSelecionada.observacoes}</p>}</div>
          <div className="rounded-xl border border-[#E1EAF4] p-4"><p className="mb-3 text-xs font-semibold text-slate-500">Etapas do atendimento</p><ol className="space-y-2 text-sm">{[["solicitado", "Solicitação recebida"], ["agendado", "Visita agendada"], ["em_andamento", "Atendimento em andamento"], ["concluido", "Atendimento concluído"]].map(([status, label]) => { const ordem = ["solicitado", "agendado", "em_andamento", "concluido"]; const atual = ordem.indexOf(visitaSelecionada.status); const etapa = ordem.indexOf(status); const concluida = atual >= etapa; return <li key={status} className={`flex items-center gap-2 ${concluida ? "font-semibold text-[#17418E]" : "text-slate-400"}`}><span className={`h-2.5 w-2.5 rounded-full ${concluida ? "bg-[#023E8A]" : "bg-slate-200"}`} />{label}</li>; })}</ol>{visitaSelecionada.status === "cancelado" && <p className="mt-3 text-sm font-semibold text-slate-500">Esta solicitação foi cancelada.</p>}</div>
          { ["solicitado", "agendado"].includes(visitaSelecionada.status) && <div className="flex justify-end border-t border-slate-100 pt-4"><button type="button" onClick={() => cancelarSolicitacao(visitaSelecionada.id)} className="rounded-xl border border-rose-200 px-5 py-3 text-sm font-semibold text-rose-700 hover:bg-rose-50">Cancelar solicitação</button></div> }
        </div>
      </Modal>}

      {aviso && <div role="status" className="fixed bottom-5 left-1/2 z-[60] -translate-x-1/2 rounded-xl bg-[#17418E] px-5 py-3 text-sm font-semibold text-white shadow-lg">{aviso}</div>}
    </div>
  );
}
