"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Activity, AlertTriangle, CalendarDays, Check, ChevronDown, Hospital,
  Mail, Pencil, Phone, Plane, Search, Stethoscope, Trash2, UserPlus, X,
  RefreshCw, Users, UserRoundCheck
} from "lucide-react";
import { api } from "@/lib/api";

const inputCls = "w-full rounded-2xl border border-[#C8D8EC] bg-white px-4 py-3 text-sm text-[#0B1756] outline-none transition placeholder:text-slate-400 focus:border-[#023E8A] focus:ring-4 focus:ring-[#3563A7]/15";
const btnPrimary = "inline-flex items-center justify-center gap-2 rounded-xl bg-[#023E8A] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#0B1756] disabled:opacity-50";
const btnSecondary = "inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50";
const emptyForm = {
  nome_completo: "", cpf: "", data_nascimento: "", email: "", telefone: "",
  crm: "", uf_crm: "SP", senha: "", especialidades: [], vinculos: []
};

function formatarNome(nome = "") { return nome.trim(); }
function iniciais(nome = "") {
  const partes = nome.trim().split(/\s+/);
  return ((partes[0]?.[0] || "") + (partes.length > 1 ? partes.at(-1)[0] : "")).toUpperCase();
}
function Card({ title, subtitle, children, action }) {
  return <section className="rounded-[22px] border border-[#DCE8F3] bg-white p-5 shadow-[0_12px_36px_rgba(2,62,138,0.07)]">
    <div className="mb-5 flex items-start justify-between gap-3"><div><h3 className="text-xl font-bold text-[#0B1756]">{title}</h3>{subtitle && <p className="mt-1 text-sm text-slate-500">{subtitle}</p>}</div>{action}</div>
    {children}
  </section>;
}
function Badge({ children, active }) {
  return <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${active ? "border-blue-100 bg-blue-50 text-blue-700" : "border-slate-200 bg-slate-50 text-slate-600"}`}>{children}</span>;
}
function Modal({ title, onClose, children, onSubmit, saving }) {
  return <div className="fixed inset-0 z-[1000] flex items-end justify-center bg-[#0B1756]/40 p-0 backdrop-blur-sm sm:items-center sm:p-6" onMouseDown={onClose}>
    <form onSubmit={onSubmit} onMouseDown={e => e.stopPropagation()} className="max-h-[92dvh] w-full max-w-3xl space-y-5 overflow-y-auto rounded-t-2xl bg-white p-6 shadow-xl sm:rounded-2xl">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4"><div><h2 className="text-2xl font-bold text-[#0B1756]">{title}</h2><p className="mt-1 text-sm text-slate-500">Preencha os dados profissionais e os vínculos de atendimento.</p></div><button type="button" onClick={onClose} className="rounded-lg p-2 hover:bg-[#EAF3F7]"><X size={20}/></button></div>
      {children}
      <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:justify-end"><button type="button" className={btnSecondary} onClick={onClose}>Cancelar</button><button type="submit" disabled={saving} className={btnPrimary}><Check size={17}/>{saving ? "Salvando..." : "Salvar profissional"}</button></div>
    </form>
  </div>;
}

export default function GestaoEquipe() {
  const [aba, setAba] = useState("geral");
  const [medicos, setMedicos] = useState([]);
  const [especialidades, setEspecialidades] = useState([]);
  const [unidades, setUnidades] = useState([]);
  const [setores, setSetores] = useState([]);
  const [busca, setBusca] = useState("");
  const [filtroEsp, setFiltroEsp] = useState("Todas");
  const [filtroUnidade, setFiltroUnidade] = useState("Todas");
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState("");
  const [aviso, setAviso] = useState("");
  const [modal, setModal] = useState(false);
  const [editando, setEditando] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [erroForm, setErroForm] = useState("");
  const [setoresPorUnidade, setSetoresPorUnidade] = useState({});
  const [vinculoUnidade, setVinculoUnidade] = useState("");
  const [vinculoSetor, setVinculoSetor] = useState("");

  const carregar = useCallback(async () => {
    setCarregando(true); setErro("");
    try {
      const [listaMedicos, listaEspecialidades, listaUnidades, listaSetores] = await Promise.all([
        api("/api/medicos"), api("/api/especialidades"), api("/api/unidades"), api("/api/setores")
      ]);
      const base = Array.isArray(listaMedicos) ? listaMedicos : [];
      const detalhes = await Promise.all(base.map(async m => {
        try { return await api(`/api/medicos/${m.id}`); }
        catch { return m; }
      }));
      setMedicos(detalhes);
      setEspecialidades(Array.isArray(listaEspecialidades) ? listaEspecialidades : []);
      setUnidades(Array.isArray(listaUnidades) ? listaUnidades : []);
      setSetores(Array.isArray(listaSetores) ? listaSetores : []);
    } catch (e) { setErro(e.message || "Não foi possível carregar os profissionais."); }
    finally { setCarregando(false); }
  }, []);

  useEffect(() => { carregar(); }, [carregar]);

  const carregarSetoresUnidade = useCallback(async (unidadeId) => {
    if (!unidadeId || setoresPorUnidade[unidadeId]) return;
    try {
      const dados = await api(`/api/setores/unidade/${unidadeId}`);
      setSetoresPorUnidade(atual => ({ ...atual, [unidadeId]: Array.isArray(dados) ? dados : [] }));
    } catch (e) { setErro(e.message || "Não foi possível carregar os setores da unidade."); }
  }, [setoresPorUnidade]);

  useEffect(() => {
    unidades.forEach(u => carregarSetoresUnidade(u.id));
  }, [unidades, carregarSetoresUnidade]);

  const profissionais = useMemo(() => medicos.map(m => ({
    ...m,
    nome: m.nome_completo || m.nome || "Nome não informado",
    especialidades: Array.isArray(m.especialidades) ? m.especialidades : [],
    vinculos: Array.isArray(m.vinculos) ? m.vinculos : [],
    ativo: Boolean(m.ativo)
  })), [medicos]);

  const totalAtivos = profissionais.filter(p => p.ativo).length;
  const totalInativos = profissionais.length - totalAtivos;
  const especialidadesRepresentadas = new Set(profissionais.flatMap(p => p.especialidades.map(e => e.id))).size;

  const porEspecialidade = useMemo(() => {
    const mapa = new Map();
    profissionais.forEach(p => p.especialidades.forEach(e => mapa.set(e.nome, (mapa.get(e.nome) || 0) + 1)));
    return [...mapa.entries()].sort((a,b) => b[1]-a[1]);
  }, [profissionais]);

  const porUnidade = useMemo(() => {
    const mapa = new Map();
    profissionais.forEach(p => p.vinculos.forEach(v => mapa.set(v.unidade || "Unidade não informada", (mapa.get(v.unidade || "Unidade não informada") || 0) + 1)));
    return [...mapa.entries()].sort((a,b) => b[1]-a[1]);
  }, [profissionais]);

  const lista = profissionais.filter(p => {
    const termo = busca.trim().toLowerCase();
    const nomeOuCrm = !termo || p.nome.toLowerCase().includes(termo) || String(p.crm || "").toLowerCase().includes(termo);
    const temEsp = filtroEsp === "Todas" || p.especialidades.some(e => e.nome === filtroEsp);
    const temUnidade = filtroUnidade === "Todas" || p.vinculos.some(v => Number(v.unidade_id) === Number(filtroUnidade));
    return nomeOuCrm && temEsp && temUnidade;
  });

  function abrirNovo() { setEditando(null); setForm(emptyForm); setErroForm(""); setVinculoUnidade(""); setVinculoSetor(""); setModal(true); }

  async function abrirEdicao(p) {
    setErroForm(""); setEditando(p.id);
    try {
      const detalhe = await api(`/api/medicos/${p.id}`);
      setForm({
        nome_completo: detalhe.nome_completo || "",
        cpf: detalhe.cpf || "",
        data_nascimento: detalhe.data_nascimento || "",
        email: detalhe.email || "",
        telefone: detalhe.telefone || "",
        crm: detalhe.crm || "",
        uf_crm: detalhe.uf_crm || "SP",
        senha: "",
        especialidades: (detalhe.especialidades || []).map(e => Number(e.id)),
        vinculos: (detalhe.vinculos || []).map(v => ({ unidade_id: Number(v.unidade_id), setor_id: Number(v.setor_id) }))
      });
      setModal(true);
    } catch (e) { setErro(e.message || "Não foi possível carregar os dados do médico."); }
  }

  function alternarEspecialidade(id) {
    setForm(f => ({ ...f, especialidades: f.especialidades.includes(Number(id)) ? f.especialidades.filter(x => x !== Number(id)) : [...f.especialidades, Number(id)] }));
  }

  function adicionarVinculo() {
    if (!vinculoUnidade || !vinculoSetor) { setErroForm("Selecione uma unidade e um setor."); return; }
    const novo = { unidade_id: Number(vinculoUnidade), setor_id: Number(vinculoSetor) };
    if (form.vinculos.some(v => v.unidade_id === novo.unidade_id && v.setor_id === novo.setor_id)) { setErroForm("Esse vínculo já foi adicionado."); return; }
    setForm(f => ({ ...f, vinculos: [...f.vinculos, novo] }));
    setVinculoSetor("");
    setErroForm("");
  }

  async function salvar(e) {
    e.preventDefault(); setErroForm("");
    if (form.nome_completo.trim().length < 3) return setErroForm("Informe o nome completo.");
    if (!form.cpf.trim()) return setErroForm("Informe o CPF.");
    if (!form.data_nascimento) return setErroForm("Informe a data de nascimento.");
    if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) return setErroForm("Informe um e-mail válido.");
    if (!form.crm.trim()) return setErroForm("Informe o CRM.");
    if (!form.uf_crm) return setErroForm("Selecione a UF do CRM.");
    if (!editando && !form.senha) return setErroForm("Informe uma senha inicial para o médico.");
    if (!form.especialidades.length) return setErroForm("Selecione pelo menos uma especialidade.");
    if (!form.vinculos.length) return setErroForm("Adicione pelo menos um vínculo com unidade e setor.");
    setSalvando(true);
    try {
      const payload = { ...form, nome_completo: form.nome_completo.trim(), email: form.email.trim(), telefone: form.telefone.trim() || null };
      if (!payload.senha) delete payload.senha;
      if (editando) await api(`/api/medicos/${editando}`, { method: "PUT", body: JSON.stringify(payload) });
      else await api("/api/medicos", { method: "POST", body: JSON.stringify(payload) });
      setModal(false); setAviso(editando ? "Profissional atualizado com sucesso." : "Profissional cadastrado com sucesso.");
      await carregar();
    } catch (e) { setErroForm(e.message || "Não foi possível salvar o profissional."); }
    finally { setSalvando(false); }
  }

  async function alternarStatus(p) {
    try {
      if (p.ativo) await api(`/api/medicos/${p.id}`, { method: "DELETE" });
      else await api(`/api/medicos/${p.id}/reativar`, { method: "PATCH" });
      setAviso(p.ativo ? "Profissional desativado." : "Profissional reativado.");
      await carregar();
    } catch (e) { setErro(e.message || "Não foi possível alterar a situação."); }
  }

  const setoresDisponiveis = setoresPorUnidade[vinculoUnidade] || [];
  const nomeUnidade = id => unidades.find(u => Number(u.id) === Number(id))?.nome || "Unidade não informada";

  return (
    <div className="relative isolate min-h-screen overflow-hidden bg-[#EEF5F9] text-[#0B1756]">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <div className="absolute -left-40 top-64 h-96 w-96 rounded-full bg-[#D9EAF8]/70" />
        <div className="absolute -right-48 top-24 h-[34rem] w-[34rem] rounded-full bg-[#D3E5F7]/70" />
        <div className="absolute right-[12%] top-[950px] h-56 w-56 rounded-full border-[42px] border-white/80" />
      </div>
      <main className="relative z-10 min-h-screen px-4 pb-12 pt-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-[1500px] space-y-6">
          <section className="relative isolate overflow-hidden rounded-[30px] bg-gradient-to-br from-[#174693] via-[#234E96] to-[#151A67] px-6 py-8 text-white shadow-[0_20px_55px_rgba(2,62,138,0.16)] sm:px-9 lg:px-10">
            <div className="pointer-events-none absolute -right-16 -top-36 h-96 w-96 rounded-full border-[48px] border-white/[0.07]" />
            <div className="pointer-events-none absolute right-[28%] top-10 h-52 w-52 rounded-full border-[30px] border-white/[0.05]" />
            <div className="relative z-10 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
              <div className="max-w-3xl">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-semibold text-blue-50"><Hospital size={14}/> ADMINISTRAÇÃO · REDE MUNICIPAL</div>
                <h1 className="mt-4 text-3xl font-bold leading-tight text-white sm:text-4xl">Gestão de equipe</h1>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-blue-100 sm:text-base">Cadastre os profissionais de saúde, acompanhe suas especialidades e unidades de atendimento.</p>
              </div>
              <button type="button" onClick={abrirNovo} className="rounded-2xl bg-white px-5 py-3.5 text-sm font-semibold text-[#0B1756] shadow-sm transition hover:bg-[#EAF3F7]"><UserPlus size={16} className="mr-2 inline-block"/> Novo profissional</button>
            </div>
          </section>

          <section className="overflow-hidden rounded-[22px] border border-[#DCE8F3] bg-white shadow-[0_12px_36px_rgba(2,62,138,0.07)]">
            <div className="grid grid-cols-1 gap-2 p-2 sm:grid-cols-3 sm:p-3">
              {[["geral","Visão geral","Indicadores e panorama"],["profissionais","Profissionais","Cadastro e situação"]].map(([id,titulo,sub]) => (
                <button key={id} type="button" onClick={() => setAba(id)} className={`flex min-h-11 flex-col items-center justify-center rounded-xl px-3 py-3 text-center transition ${aba===id ? "bg-[#023E8A] text-white shadow-sm" : "text-[#3563A7] hover:bg-[#EAF3F7]"}`}>
                  <span className="text-sm font-semibold">{titulo}</span><span className={`mt-0.5 text-xs ${aba===id ? "text-blue-100" : "text-slate-400"}`}>{sub}</span>
                </button>
              ))}
            </div>
          </section>

          {erro && <div role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{erro}</div>}
          {aviso && <div role="status" className="rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-[#0B1756]">{aviso}</div>}

          {aba === "geral" && <>
            <div><h2 className="text-2xl font-bold text-[#0B1756]">Panorama da equipe</h2><p className="mt-1 text-base text-slate-500">Indicadores calculados a partir dos profissionais cadastrados.</p></div>
            <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {[["Profissionais", profissionais.length, "Cadastrados no sistema"],["Ativos", totalAtivos, "Com cadastro ativo"],["Inativos", totalInativos, "Com cadastro desativado"],["Especialidades", especialidadesRepresentadas, "Representadas na equipe"]].map(([t,v,d]) => <div key={t} className="rounded-[22px] border border-[#DCE8F3] bg-white p-5 shadow-[0_12px_36px_rgba(2,62,138,0.07)]"><p className="text-sm font-medium text-slate-500">{t}</p><p className="mt-2 text-3xl font-bold tracking-tight text-[#0B1756]">{carregando ? "—" : v}</p><p className="mt-1 text-xs text-slate-500">{d}</p></div>)}
            </section>
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
              <Card title="Profissionais por especialidade" subtitle="Distribuição da equipe">
                {porEspecialidade.length ? <div className="space-y-4">{porEspecialidade.map(([nome,qtd]) => <div key={nome}><div className="mb-1.5 flex justify-between gap-3 text-sm"><span className="font-medium text-slate-600">{nome}</span><strong>{qtd}</strong></div><div className="h-2 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-[#3563A7]" style={{width:`${qtd/Math.max(...porEspecialidade.map(x=>x[1]))*100}%`}}/></div></div>)}</div> : <p className="text-sm text-slate-400">Ainda não há dados para exibir.</p>}
              </Card>
              <Card title="Profissionais por unidade" subtitle="Onde a equipe atende">
                {porUnidade.length ? <div className="space-y-4">{porUnidade.map(([nome,qtd]) => <div key={nome}><div className="mb-1.5 flex justify-between gap-3 text-sm"><span className="font-medium text-slate-600">{nome}</span><strong>{qtd}</strong></div><div className="h-2 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-[#3563A7]" style={{width:`${qtd/Math.max(...porUnidade.map(x=>x[1]))*100}%`}}/></div></div>)}</div> : <p className="text-sm text-slate-400">Ainda não há dados para exibir.</p>}
              </Card>
            </div>
          </>}

          {aba === "profissionais" && <section className="space-y-5">
            <Card title="Profissionais cadastrados" subtitle="Dados reais dos médicos registrados no sistema" action={<button type="button" onClick={carregar} disabled={carregando} className={btnSecondary}><RefreshCw size={15} className={carregando?"animate-spin":""}/> Atualizar</button>}>
              <div className="grid gap-3 md:grid-cols-3">
                <div className="relative"><Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#0B1756]"/><input className={`${inputCls} pl-11`} value={busca} onChange={e=>setBusca(e.target.value)} placeholder="Buscar por nome ou CRM..."/></div>
                <select className={inputCls} value={filtroEsp} onChange={e=>setFiltroEsp(e.target.value)}><option value="Todas">Todas as especialidades</option>{especialidades.map(e=><option key={e.id} value={e.nome}>{e.nome}</option>)}</select>
                <select className={inputCls} value={filtroUnidade} onChange={e=>setFiltroUnidade(e.target.value)}><option value="Todas">Todas as unidades</option>{unidades.map(u=><option key={u.id} value={u.id}>{u.nome}</option>)}</select>
              </div>
            </Card>
            {carregando ? <p className="py-8 text-center text-sm text-slate-500">Carregando profissionais...</p> : lista.length ? <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
              {lista.map(p=><article key={p.id} className="flex flex-col rounded-[22px] border border-[#DCE8F3] bg-white p-5 shadow-[0_12px_36px_rgba(2,62,138,0.07)]">
                <div className="flex items-start gap-4"><div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#023E8A] text-lg font-bold text-white">{iniciais(p.nome)}</div><div className="min-w-0 flex-1"><h3 className="text-lg font-bold text-[#0B1756]">{p.nome}</h3><p className="mt-1 text-sm font-semibold">CRM {p.crm}/{p.uf_crm}</p></div><Badge active={p.ativo}>{p.ativo?"Ativo":"Inativo"}</Badge></div>
                <div className="mt-5 space-y-2 text-sm text-slate-600"><p className="flex items-center gap-2"><Mail size={15}/>{p.email || "E-mail não informado"}</p><p className="flex items-center gap-2"><Phone size={15}/>{p.telefone || "Telefone não informado"}</p><div className="flex items-start gap-2"><Stethoscope size={15} className="mt-0.5"/><span>{p.especialidades.map(e=>e.nome).join(", ") || "Sem especialidade vinculada"}</span></div><div className="flex items-start gap-2"><Hospital size={15} className="mt-0.5"/><span>{p.vinculos.map(v=>`${v.unidade} — ${v.setor}`).join("; ") || "Sem unidade vinculada"}</span></div></div>
                <div className="mt-5 grid grid-cols-2 gap-2 border-t border-slate-100 pt-4"><button type="button" onClick={()=>abrirEdicao(p)} className={btnPrimary}><Pencil size={15}/> Editar</button><button type="button" onClick={()=>alternarStatus(p)} className={btnSecondary}>{p.ativo?"Desativar":"Reativar"}</button></div>
              </article>)}
            </div> : <div className="rounded-2xl border border-dashed border-slate-200 bg-white px-4 py-10 text-center"><p className="font-semibold text-slate-600">Nenhum profissional encontrado.</p><p className="mt-1 text-sm text-slate-400">Ajuste a busca ou cadastre um novo médico.</p></div>}
          </section>}

          {aba === "afastamentos" && <Card title="Afastamentos" subtitle="Funcionalidade ainda não disponível">
            <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900"><AlertTriangle size={18} className="mt-0.5 shrink-0"/><p>O banco de dados atual não possui tabela de afastamentos e o backend não oferece rotas para registrar, encerrar ou consultar férias e licenças. Essa aba ficará apenas informativa, sem ações que aparentem salvar dados.</p></div>
          </Card>}
        </div>
      </main>

      {modal && <Modal title={editando ? "Editar profissional" : "Novo profissional"} onClose={()=>setModal(false)} onSubmit={salvar} saving={salvando}>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="sm:col-span-2"><span className="mb-1.5 block text-xs font-semibold text-slate-600">Nome completo *</span><input className={inputCls} value={form.nome_completo} onChange={e=>setForm(f=>({...f,nome_completo:e.target.value}))} required/></label>
          <label><span className="mb-1.5 block text-xs font-semibold text-slate-600">CPF *</span><input className={inputCls} value={form.cpf} onChange={e=>setForm(f=>({...f,cpf:e.target.value.replace(/\D/g,"").slice(0,11)}))} required maxLength={11}/></label>
          <label><span className="mb-1.5 block text-xs font-semibold text-slate-600">Data de nascimento *</span><input type="date" className={inputCls} value={form.data_nascimento} onChange={e=>setForm(f=>({...f,data_nascimento:e.target.value}))} required/></label>
          <label><span className="mb-1.5 block text-xs font-semibold text-slate-600">E-mail *</span><input type="email" className={inputCls} value={form.email} onChange={e=>setForm(f=>({...f,email:e.target.value}))} required/></label>
          <label><span className="mb-1.5 block text-xs font-semibold text-slate-600">Telefone</span><input className={inputCls} value={form.telefone} onChange={e=>setForm(f=>({...f,telefone:e.target.value}))}/></label>
          <label><span className="mb-1.5 block text-xs font-semibold text-slate-600">CRM *</span><input className={inputCls} value={form.crm} onChange={e=>setForm(f=>({...f,crm:e.target.value.replace(/\D/g,"")}))} required/></label>
          <label><span className="mb-1.5 block text-xs font-semibold text-slate-600">UF do CRM *</span><select className={inputCls} value={form.uf_crm} onChange={e=>setForm(f=>({...f,uf_crm:e.target.value}))}>{["AC","AL","AP","AM","BA","CE","DF","ES","GO","MA","MT","MS","MG","PA","PB","PR","PE","PI","RJ","RN","RS","RO","RR","SC","SP","SE","TO"].map(uf=><option key={uf}>{uf}</option>)}</select></label>
          {!editando && <label className="sm:col-span-2"><span className="mb-1.5 block text-xs font-semibold text-slate-600">Senha inicial *</span><input type="password" className={inputCls} value={form.senha} onChange={e=>setForm(f=>({...f,senha:e.target.value}))} required/></label>}
          <fieldset className="sm:col-span-2"><legend className="mb-2 text-xs font-semibold text-slate-600">Especialidades * (selecione uma ou mais)</legend><div className="grid gap-2 sm:grid-cols-2">{especialidades.map(es=><label key={es.id} className="flex items-center gap-2 rounded-xl border border-slate-200 p-3 text-sm"><input type="checkbox" checked={form.especialidades.includes(Number(es.id))} onChange={()=>alternarEspecialidade(es.id)}/>{es.nome}</label>)}</div></fieldset>
          <fieldset className="sm:col-span-2"><legend className="mb-2 text-xs font-semibold text-slate-600">Vínculos com unidades e setores *</legend><div className="grid gap-3 sm:grid-cols-[1fr_1fr_auto]"><select className={inputCls} value={vinculoUnidade} onChange={e=>{setVinculoUnidade(e.target.value);setVinculoSetor("");}}><option value="">Selecione a unidade</option>{unidades.map(u=><option key={u.id} value={u.id}>{u.nome}</option>)}</select><select className={inputCls} value={vinculoSetor} onChange={e=>setVinculoSetor(e.target.value)} disabled={!vinculoUnidade}><option value="">Selecione o setor</option>{setoresDisponiveis.map(s=><option key={s.id} value={s.id}>{s.nome}</option>)}</select><button type="button" className={btnSecondary} onClick={adicionarVinculo}>Adicionar</button></div>
            <div className="mt-3 space-y-2">{form.vinculos.map((v,i)=><div key={`${v.unidade_id}-${v.setor_id}`} className="flex items-center justify-between rounded-lg bg-[#EAF3F7] px-3 py-2 text-xs"><span>{nomeUnidade(v.unidade_id)} — {(setoresPorUnidade[v.unidade_id]||[]).find(s=>Number(s.id)===Number(v.setor_id))?.nome || `Setor ${v.setor_id}`}</span><button type="button" onClick={()=>setForm(f=>({...f,vinculos:f.vinculos.filter((_,idx)=>idx!==i)}))} className="text-red-600">Remover</button></div>)}</div>
          </fieldset>
        </div>
        {erroForm && <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{erroForm}</div>}
        {editando && <p className="text-xs text-slate-500">Deixe a senha em branco para manter a senha atual.</p>}
      </Modal>}
    </div>
  );
}
