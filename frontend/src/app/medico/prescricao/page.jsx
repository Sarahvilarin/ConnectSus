"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  AlertCircle, ArrowLeft, BadgeCheck, CalendarDays, Check, ChevronDown,
  ClipboardCheck, Clock3, Download, FileCheck2, FileText, HeartPulse,
  Hospital, Loader2, LockKeyhole, Plus, Pill, RefreshCcw, ShieldCheck,
  Stethoscope, Trash2, UserRound, X,
} from "lucide-react";

/*
  UneSUS — Prescrição e Atestados
  Copie este arquivo para src/app/medico/prescricao/page.jsx
  Dependência: npm install jspdf

  Contrato esperado do seu backend AUTENTICADO:
  GET /api/medico/me
  { "id":"...", "nome":"...", "crm":"123456", "uf":"SP",
    "especialidade":"Clínica médica", "unidade":"...", "enderecoUnidade":"..." }

  GET /api/pacientes/:id
  { "id":"...", "nome":"...", "cpf":"...", "nascimento":"YYYY-MM-DD" }

  Ajuste SOMENTE os endpoints/mapeamento se sua API usar outros nomes.
  Não é seguro receber nome/CRM do médico por query string ou usar dados fictícios.
  O PDF local gerado é um RASCUNHO, não é assinado nem registrado no servidor.
*/

const C = { azul: "#023E8A", escuro: "#0B1756", medio: "#3563A7", claro: "#EAF3F7" };
const CARD = "rounded-[26px] bg-white p-5 shadow-[0_12px_36px_rgba(2,62,138,0.075)] sm:p-7";
const INPUT = "mt-2 w-full rounded-xl border border-[#3563A7]/20 bg-[#EAF3F7]/40 px-3.5 py-3 text-sm text-[#0B1756] outline-none transition placeholder:text-[#3563A7]/55 focus:border-[#023E8A] focus:bg-white focus:ring-4 focus:ring-[#3563A7]/10";
const novoMedicamento = () => ({ id: `${Date.now()}-${Math.random()}`, nome: "", concentracao: "", forma: "", dose: "", via: "", frequencia: "", duracao: "", quantidade: "", instrucoes: "" });
const hojeISO = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};
const dataBR = (s) => s ? s.split("-").reverse().join("/") : "—";
const curto = (s) => String(s || "").trim();
const maskCPF = (s) => { const n = String(s || "").replace(/\D/g, ""); return n.length === 11 ? `***.${n.slice(3, 6)}.${n.slice(6, 9)}-**` : "Não informado"; };

function Campo({ label, value, onChange, placeholder, type = "text", required = false, className = "" }) {
  return <label className={`block text-xs font-bold text-[#0B1756] ${className}`}>
    {label}{required && <span className="text-[#023E8A]"> *</span>}
    <input className={INPUT} value={value} onChange={(e) => onChange(e.target.value)} type={type} placeholder={placeholder} required={required} />
  </label>;
}
function Texto({ label, value, onChange, placeholder, rows = 3, className = "" }) {
  return <label className={`block text-xs font-bold text-[#0B1756] ${className}`}>
    {label}
    <textarea className={`${INPUT} resize-y leading-6`} rows={rows} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} />
  </label>;
}
function CabecalhoSecao({ numero, icon: Icon, titulo, descricao, right }) {
  return <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
    <div className="flex items-start gap-3">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#EAF3F7] text-[#023E8A]"><Icon size={21}/></div>
      <div><p className="text-[10px] font-extrabold uppercase tracking-[0.17em] text-[#3563A7]">Etapa {numero}</p><h2 className="mt-0.5 text-base font-extrabold text-[#0B1756]">{titulo}</h2><p className="mt-0.5 text-xs leading-5 text-[#3563A7]">{descricao}</p></div>
    </div>{right}
  </div>;
}
function PerfilLinha({ titulo, valor }) {
  return <div className="min-w-0 rounded-xl border border-[#EAF3F7] bg-white px-4 py-3"><p className="text-[10px] font-semibold uppercase tracking-wider text-[#3563A7]">{titulo}</p><p className="mt-1 break-words text-sm font-bold text-[#0B1756]">{valor || "Não informado"}</p></div>;
}
function Tag({ children }) { return <span className="inline-flex items-center rounded-full bg-[#EAF3F7] px-3 py-1.5 text-[11px] font-semibold text-[#023E8A]">{children}</span>; }

async function gerarPDF({ tipo, medico, paciente, data, medicamentos, atestado, observacoes, cidade }) {
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF({ format: "a4", unit: "mm", orientation: "portrait" });
  const W = 210, H = 297, M = 19, content = W - M * 2;
  const azul = [2, 62, 138], escuro = [11, 23, 86], medio = [53, 99, 167], claro = [234, 243, 247];
  let y = 46, pagina = 1;
  const txt = (s) => String(s ?? "").trim() || "—";
  function footer() {
    doc.setDrawColor(...claro); doc.line(M, 275, W-M, 275);
    doc.setFont("helvetica", "bold"); doc.setFontSize(7.6); doc.setTextColor(...medio);
    doc.text("RASCUNHO NÃO ASSINADO — NÃO VÁLIDO PARA USO OFICIAL", M, 282);
    doc.setFont("helvetica", "normal"); doc.text(`UneSUS  •  Página ${pagina}`, W-M, 282, { align: "right" });
  }
  function header() {
    doc.setFillColor(...azul); doc.rect(0, 0, W, 35, "F");
    doc.setFont("helvetica", "bold"); doc.setFontSize(19); doc.setTextColor(255,255,255);
    doc.text("UneSUS", M, 16);
    doc.setFont("helvetica", "normal"); doc.setFontSize(9);
    doc.text("Documento clínico • via para conferência", M, 23);
    doc.setFont("helvetica", "bold"); doc.setFontSize(8);
    doc.text("RASCUNHO", W-M, 16, { align: "right" });
    y = 46;
  }
  function space(mm=10) { if (y + mm > 268) { footer(); doc.addPage(); pagina++; header(); } }
  function section(title) {
    space(18);
    doc.setFillColor(...claro); doc.roundedRect(M, y-5, content, 12, 2, 2, "F");
    doc.setTextColor(...escuro); doc.setFont("helvetica", "bold"); doc.setFontSize(10);
    doc.text(title, M+4, y+2.5); y += 18;
  }
  function paragraph(value, size=10, lineHeight=5.6) {
    doc.setFont("helvetica", "normal"); doc.setFontSize(size); doc.setTextColor(...escuro);
    const lines = doc.splitTextToSize(txt(value), content);
    for (const line of lines) { space(7); doc.text(line, M, y); y += lineHeight; }
    y += 2;
  }
  function field(label, value) {
    if (!curto(value)) return;
    doc.setFont("helvetica", "bold"); doc.setFontSize(9); doc.setTextColor(...escuro);
    const l = `${label}: `; const lw = doc.getTextWidth(l);
    doc.setFont("helvetica", "normal");
    const lines = doc.splitTextToSize(txt(value), content-lw-3);
    space(Math.max(7, lines.length*5+2)); doc.setFont("helvetica", "bold"); doc.text(l, M, y);
    doc.setFont("helvetica", "normal"); doc.text(lines, M+lw, y); y+=Math.max(7,lines.length*5+2);
  }
  header();
  doc.setFont("helvetica", "bold"); doc.setFontSize(15); doc.setTextColor(...escuro);
  doc.text(tipo === "receita" ? "PRESCRIÇÃO DE MEDICAMENTOS" : "ATESTADO MÉDICO", M, y); y += 11;
  section("IDENTIFICAÇÃO DO PACIENTE");
  field("Nome", paciente.nome);
  field("CPF", maskCPF(paciente.cpf));
  field("Nascimento", paciente.nascimento ? dataBR(paciente.nascimento) : "");
  section("PROFISSIONAL RESPONSÁVEL");
  field("Médico(a)", medico.nome);
  field("CRM / UF", `${medico.crm} / ${medico.uf}`);
  field("Especialidade", medico.especialidade);
  field("Unidade", medico.unidade);
  field("Local e data", `${curto(cidade || medico.cidade || medico.unidade) || "Local não informado"}, ${dataBR(data)}`);
  if (tipo === "receita") {
    section("PRESCRIÇÃO");
    medicamentos.forEach((m, i) => {
      space(30);
      doc.setFont("helvetica", "bold"); doc.setFontSize(11); doc.setTextColor(...azul);
      const medName = `${i+1}. ${txt(m.nome)}`;
      const nLines = doc.splitTextToSize(medName, content); nLines.forEach((l)=>{ space(7); doc.text(l,M,y); y+=6; });
      field("Apresentação", [m.concentracao,m.forma].filter(Boolean).join(" • "));
      field("Dose e via", [m.dose,m.via].filter(Boolean).join(" / "));
      field("Frequência", m.frequencia);
      field("Duração", m.duracao);
      field("Quantidade", m.quantidade);
      field("Orientações", m.instrucoes);
      y+=5;
    });
    if (curto(observacoes)) { section("ORIENTAÇÕES COMPLEMENTARES"); paragraph(observacoes); }
  } else {
    section("DECLARAÇÃO CLÍNICA");
    paragraph(atestado.texto);
    if (curto(atestado.dias)) field("Período de afastamento (dias)", atestado.dias);
    if (atestado.inicio) field("A partir de", dataBR(atestado.inicio));
  }
  space(45); y += 8;
  doc.setDrawColor(...medio); doc.line(M, y+12, M+105, y+12);
  doc.setFont("helvetica", "bold"); doc.setFontSize(9); doc.setTextColor(...escuro);
  doc.text(txt(medico.nome), M, y+19);
  doc.setFont("helvetica", "normal"); doc.setFontSize(8);
  doc.text(`CRM ${medico.crm}/${medico.uf} • assinatura pendente`, M, y+24);
  footer();
  doc.save(`UneSUS_${tipo === "receita" ? "prescricao" : "atestado"}_RASCUNHO_${data}.pdf`);
}

function Tela() {
  const params = useSearchParams();
  const pacienteId = params.get("paciente") || "";
  const [tipo, setTipo] = useState(params.get("tipo") === "atestado" ? "atestado" : "receita");
  const [medico, setMedico] = useState(null);
  const [estadoMedico, setEstadoMedico] = useState("carregando");
  const [erroPerfil, setErroPerfil] = useState("");
  const [paciente, setPaciente] = useState(null);
  const [estadoPaciente, setEstadoPaciente] = useState(pacienteId ? "carregando" : "sem-id");
  const [erroPaciente, setErroPaciente] = useState("");
  const [data, setData] = useState(hojeISO);
  const [cidade, setCidade] = useState("");
  const [medicamentos, setMedicamentos] = useState([novoMedicamento()]);
  const [observacoes, setObservacoes] = useState("");
  const [atestado, setAtestado] = useState({ texto:"", dias:"", inicio:hojeISO() });
  const [confirmei, setConfirmei] = useState(false);
  const [gerando, setGerando] = useState(false);
  const [erroPDF, setErroPDF] = useState("");
  const [mostrarPreview, setMostrarPreview] = useState(true);

  async function carregarMedico(signal) {
    setEstadoMedico("carregando"); setErroPerfil(""); setMedico(null);
    try {
      const res = await fetch("/api/medico/me", { credentials:"include", cache:"no-store", signal });
      if (!res.ok) throw new Error(res.status === 401 ? "Faça login como médico para continuar." : `Não foi possível carregar o perfil médico (${res.status}).`);
      const resposta = await res.json();
      const item = resposta.medico || resposta.usuario || resposta;
      const dado = {
        id:item.id, nome:curto(item.nome || item.name), crm:curto(item.crm || item.registro),
        uf:curto(item.uf || item.crmUf).toUpperCase(),
        especialidade:curto(item.especialidade), unidade:curto(item.unidade?.nome || item.unidade || item.nomeUnidade),
        cidade:curto(item.cidade || item.unidade?.cidade),
      };
      if (!dado.nome || !dado.crm || !/^[A-Z]{2}$/.test(dado.uf)) throw new Error("Seu cadastro médico precisa conter nome, CRM e UF para preparar documentos.");
      setMedico(dado); setEstadoMedico("pronto");
    } catch(e) { if (e.name !== "AbortError") { setErroPerfil(e.message || "Erro ao consultar perfil.");setEstadoMedico("erro"); } }
  }
  useEffect(() => { const c = new AbortController(); carregarMedico(c.signal); return () => c.abort(); }, []);
  useEffect(() => {
    if (!pacienteId) { setEstadoPaciente("sem-id"); return; }
    const c = new AbortController();
    async function carregar() {
      setEstadoPaciente("carregando"); setErroPaciente(""); setPaciente(null);
      try {
        const res = await fetch(`/api/pacientes/${encodeURIComponent(pacienteId)}`, { credentials:"include", cache:"no-store", signal:c.signal });
        if (!res.ok) throw new Error(`Não foi possível consultar o paciente (${res.status}).`);
        const data = await res.json(); const p = data.paciente || data;
        if (!curto(p.nome)) throw new Error("O cadastro do paciente não possui nome.");
        setPaciente({ id:p.id || pacienteId, nome:p.nome, cpf:p.cpf || "", nascimento:p.nascimento || "" });
        setEstadoPaciente("pronto");
      } catch(e) { if(e.name !== "AbortError") {setErroPaciente(e.message || "Erro ao carregar paciente.");setEstadoPaciente("erro");} }
    }
    carregar(); return () => c.abort();
  }, [pacienteId]);

  const prontoDocumento = useMemo(() => {
    if (!medico || !paciente || !data) return false;
    if (tipo === "atestado") return curto(atestado.texto).length >= 20 && (!atestado.dias || (Number(atestado.dias) > 0 && Number.isInteger(Number(atestado.dias))));
    return medicamentos.length > 0 && medicamentos.every((m)=>curto(m.nome)&&curto(m.dose)&&curto(m.via)&&curto(m.frequencia)&&curto(m.duracao));
  }, [medico,paciente,data,tipo,atestado,medicamentos]);
  const podeGerar = prontoDocumento && confirmei && !gerando;
  function alterarMedicamento(id, chave, valor) {
    setMedicamentos((prev)=>prev.map((m)=>m.id===id?{...m,[chave]:valor}:m)); setConfirmei(false);
  }
  function alterarAtestado(chave, valor) {setAtestado((p)=>({...p,[chave]:valor}));setConfirmei(false);}
  async function download() {
    if (!podeGerar) return;
    setGerando(true);setErroPDF("");
    try { await gerarPDF({tipo,medico,paciente,data,medicamentos,atestado,observacoes,cidade}); }
    catch(e){console.error(e);setErroPDF("Falha ao gerar o PDF. Instale a dependência com npm install jspdf e tente novamente.");}
    finally {setGerando(false);}
  }

  return <main className="relative min-h-screen overflow-hidden bg-[#EAF3F7] px-4 pb-16 pt-5 sm:px-6 lg:px-8">
    <div className="pointer-events-none absolute -left-[180px] top-24 h-[420px] w-[420px] rounded-full bg-[#3563A7]/15"/>
    <div className="pointer-events-none absolute -right-[200px] top-[620px] h-[500px] w-[500px] rounded-full bg-[#3563A7]/15"/>
    <div className="pointer-events-none absolute left-[7%] top-[1300px] h-56 w-56 rounded-full border-[40px] border-white/70"/>
    <div className="relative z-10 mx-auto max-w-[1360px] space-y-5">
      <section className="overflow-hidden rounded-[30px] bg-white shadow-[0_18px_50px_rgba(2,62,138,0.12)]">
        <div className="relative overflow-hidden bg-gradient-to-br from-[#3563A7] via-[#023E8A] to-[#0B1756] px-7 pb-10 pt-8 text-white sm:px-10">
          <div className="pointer-events-none absolute -right-16 -top-28 h-72 w-72 rounded-full bg-white/10"/>
          <div className="pointer-events-none absolute left-[38%] top-[50px] h-52 w-52 rounded-full border-[30px] border-white/5"/>
          <div className="pointer-events-none absolute -bottom-24 -left-20 h-56 w-56 rounded-full bg-white/5"/>
          <div className="relative flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <div className="max-w-2xl">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-semibold"><Stethoscope size={14}/> Área médica · Documentos do paciente</span>
              <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">Prescrição e Atestados</h1>
              <p className="mt-3 max-w-xl text-sm leading-6 text-white/90">Prepare um documento clínico com identidade profissional e confira o resultado antes de exportar em PDF A4.</p>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:w-[370px]">
              <div className="flex items-center gap-2 rounded-2xl border border-white/20 bg-white/10 p-3"><ShieldCheck size={20}/><span className="text-xs font-bold">Perfil autenticado<span className="mt-1 block text-[11px] font-normal text-white/80">Dados do sistema</span></span></div>
              <div className="flex items-center gap-2 rounded-2xl border border-white/20 bg-white/10 p-3"><Download size={20}/><span className="text-xs font-bold">PDF profissional<span className="mt-1 block text-[11px] font-normal text-white/80">Prévia e download</span></span></div>
            </div>
          </div>
        </div>
        
      </section>

      <section className={CARD}>
        <CabecalhoSecao numero="01" icon={UserRound} titulo="Identificação segura" descricao="Dados recuperados da sessão médica e do cadastro do paciente." right={<Tag><LockKeyhole size={13} className="mr-1"/> Dados protegidos</Tag>}/>
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="rounded-[22px] border border-[#3563A7]/15 bg-[#EAF3F7]/45 p-4 sm:p-5">
            <div className="mb-4 flex items-center justify-between gap-3"><p className="flex items-center gap-2 text-sm font-extrabold text-[#0B1756]"><Stethoscope size={17} className="text-[#023E8A]"/> Médico responsável</p><span className="rounded-full bg-white px-2.5 py-1 text-[10px] font-semibold text-[#023E8A]">Somente leitura</span></div>
            {estadoMedico==="carregando"?<p className="flex items-center gap-2 py-5 text-sm text-[#3563A7]"><Loader2 size={17} className="animate-spin"/> Carregando médico autenticado...</p>:estadoMedico==="erro"?<div role="alert" className="space-y-3 rounded-xl bg-white p-4"><p className="text-sm font-semibold text-[#0B1756]">{erroPerfil}</p><button type="button" onClick={()=>carregarMedico()} className="inline-flex items-center gap-2 text-xs font-bold text-[#023E8A]"><RefreshCcw size={14}/> Tentar novamente</button></div>:<div className="grid gap-3 sm:grid-cols-2"><PerfilLinha titulo="Nome completo" valor={medico.nome}/><PerfilLinha titulo="Registro profissional" valor={`CRM ${medico.crm}/${medico.uf}`}/><PerfilLinha titulo="Especialidade" valor={medico.especialidade}/><PerfilLinha titulo="Unidade de atendimento" valor={medico.unidade}/></div>}
          </div>
          <div className="rounded-[22px] border border-[#3563A7]/15 bg-[#EAF3F7]/45 p-4 sm:p-5">
            <div className="mb-4 flex items-center justify-between gap-3"><p className="flex items-center gap-2 text-sm font-extrabold text-[#0B1756]"><UserRound size={17} className="text-[#023E8A]"/> Paciente</p><Link href="/medico/pacientes" className="text-xs font-bold text-[#023E8A] hover:underline">Voltar à lista</Link></div>
            {estadoPaciente==="carregando"?<p className="flex items-center gap-2 py-5 text-sm text-[#3563A7]"><Loader2 size={17} className="animate-spin"/> Buscando cadastro do paciente...</p>:estadoPaciente!=="pronto"?<div role="alert" className="rounded-xl bg-white p-4 text-sm text-[#0B1756]">{estadoPaciente==="sem-id"?"Abra esta página pela ficha do paciente para carregar seus dados.":erroPaciente}</div>:<div className="grid gap-3 sm:grid-cols-2"><PerfilLinha titulo="Nome completo" valor={paciente.nome}/><PerfilLinha titulo="CPF" valor={maskCPF(paciente.cpf)}/><PerfilLinha titulo="Nascimento" valor={paciente.nascimento?dataBR(paciente.nascimento):"Não informado"}/><PerfilLinha titulo="Identificador" valor={paciente.id}/></div>}
          </div>
        </div>
      </section>

      <section className={CARD}>
        <CabecalhoSecao numero="02" icon={FileText} titulo="Preparar documento" descricao="Selecione o modelo e preencha o conteúdo de acordo com a avaliação clínica."/>
        <div className="grid gap-3 sm:grid-cols-2">
          {[["receita","Prescrição de medicamentos","Posologia, duração e orientações",Pill],["atestado","Atestado médico","Declaração e afastamento",FileCheck2]].map(([id,nome,desc,Icon])=><button key={id} type="button" onClick={()=>{setTipo(id);setConfirmei(false);}} className={`flex items-center gap-3 rounded-2xl border p-4 text-left transition ${tipo===id?"border-[#023E8A] bg-[#EAF3F7] shadow-[0_6px_20px_rgba(2,62,138,0.08)]":"border-[#3563A7]/20 bg-white hover:bg-[#EAF3F7]/50"}`}><span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${tipo===id?"bg-[#023E8A] text-white":"bg-[#EAF3F7] text-[#023E8A]"}`}><Icon size={20}/></span><span className="flex-1"><b className="block text-sm text-[#0B1756]">{nome}</b><small className="mt-1 block text-xs text-[#3563A7]">{desc}</small></span>{tipo===id&&<Check size={17} className="text-[#023E8A]"/>}</button>)}
        </div>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <Campo label="Data do documento" type="date" value={data} onChange={(v)=>{setData(v);setConfirmei(false);}} required/>
          <Campo label="Cidade (opcional)" value={cidade} onChange={(v)=>{setCidade(v);setConfirmei(false);}} placeholder={medico?.cidade || "Cidade da emissão"}/>
        </div>
        {tipo==="receita"?<div className="mt-5 space-y-4">
          {medicamentos.map((m,idx)=><div key={m.id} className="rounded-[22px] border border-[#3563A7]/15 bg-white p-4 sm:p-5">
            <div className="mb-4 flex items-center justify-between gap-3"><h3 className="flex items-center gap-2 text-sm font-bold text-[#0B1756]"><span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#EAF3F7] text-[#023E8A]">{idx+1}</span> Medicamento {idx+1}</h3>{medicamentos.length>1&&<button type="button" onClick={()=>{setMedicamentos((p)=>p.filter((x)=>x.id!==m.id));setConfirmei(false);}} className="inline-flex items-center gap-1 rounded-lg px-3 py-2 text-xs font-bold text-[#3563A7] hover:bg-[#EAF3F7]"><Trash2 size={14}/> Remover</button>}</div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <Campo label="Nome do medicamento" required value={m.nome} onChange={(v)=>alterarMedicamento(m.id,"nome",v)} placeholder="Nome do medicamento"/>
              <Campo label="Concentração" value={m.concentracao} onChange={(v)=>alterarMedicamento(m.id,"concentracao",v)} placeholder="Ex.: apresentação prescrita"/>
              <Campo label="Forma farmacêutica" value={m.forma} onChange={(v)=>alterarMedicamento(m.id,"forma",v)} placeholder="Comprimido, solução..."/>
              <Campo label="Dose" required value={m.dose} onChange={(v)=>alterarMedicamento(m.id,"dose",v)} placeholder="Dose definida na consulta"/>
              <Campo label="Via de administração" required value={m.via} onChange={(v)=>alterarMedicamento(m.id,"via",v)} placeholder="Via prescrita"/>
              <Campo label="Frequência" required value={m.frequencia} onChange={(v)=>alterarMedicamento(m.id,"frequencia",v)} placeholder="Frequência definida"/>
              <Campo label="Duração" required value={m.duracao} onChange={(v)=>alterarMedicamento(m.id,"duracao",v)} placeholder="Duração do tratamento"/>
              <Campo label="Quantidade" value={m.quantidade} onChange={(v)=>alterarMedicamento(m.id,"quantidade",v)} placeholder="Quantidade total"/>
              <Texto label="Orientações" className="sm:col-span-2 lg:col-span-1" value={m.instrucoes} onChange={(v)=>alterarMedicamento(m.id,"instrucoes",v)} placeholder="Recomendações ao paciente" rows={2}/>
            </div>
          </div>)}
          <button type="button" onClick={()=>{setMedicamentos((p)=>[...p,novoMedicamento()]);setConfirmei(false);}} className="inline-flex items-center gap-2 rounded-xl border border-[#3563A7]/25 bg-[#EAF3F7] px-4 py-3 text-xs font-bold text-[#023E8A] hover:bg-white"><Plus size={16}/> Adicionar medicamento</button>
          <Texto label="Orientações gerais (opcional)" value={observacoes} onChange={(v)=>{setObservacoes(v);setConfirmei(false);}} placeholder="Observações complementares definidas pelo profissional"/>
        </div>:<div className="mt-5 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2"><Campo label="Dias de afastamento" type="number" value={atestado.dias} onChange={(v)=>alterarAtestado("dias",v)} placeholder="Número de dias, se aplicável"/><Campo label="A partir de" type="date" value={atestado.inicio} onChange={(v)=>alterarAtestado("inicio",v)}/></div>
          <Texto label="Texto do atestado (mínimo de 20 caracteres)" rows={7} value={atestado.texto} onChange={(v)=>alterarAtestado("texto",v)} placeholder="Redija o conteúdo após a avaliação médica. Inclua somente informações necessárias e autorizadas para o documento."/>
          <p className="rounded-xl bg-[#EAF3F7] p-3 text-xs leading-5 text-[#3563A7]">O CID e detalhes sensíveis não devem ser inseridos automaticamente no atestado. A inclusão deve respeitar o consentimento do paciente e as regras aplicáveis.</p>
        </div>}
      </section>

      <section className={CARD}>
        <CabecalhoSecao numero="03" icon={ClipboardCheck} titulo="Conferir documento profissional" descricao="Visualize a estrutura do documento A4 antes de exportar o rascunho em PDF." right={<button type="button" onClick={()=>setMostrarPreview((v)=>!v)} className="inline-flex items-center gap-2 rounded-xl bg-[#EAF3F7] px-3 py-2 text-xs font-bold text-[#023E8A]"><ChevronDown size={15} className={mostrarPreview?"rotate-180 transition":"transition"}/>{mostrarPreview?"Ocultar prévia":"Mostrar prévia"}</button>}/>
        {mostrarPreview&&<div className="mx-auto w-full max-w-[690px] rounded-[8px] border border-[#3563A7]/20 bg-white shadow-[0_12px_34px_rgba(2,62,138,0.10)]">
          <div className="flex items-center justify-between gap-3 bg-[#023E8A] px-6 py-5 text-white sm:px-9"><div><p className="text-xl font-extrabold">UneSUS</p><p className="text-[10px] text-white/80">Documento clínico • via para conferência</p></div><span className="rounded-md border border-white/40 px-3 py-1.5 text-[10px] font-bold tracking-widest">RASCUNHO</span></div>
          <div className="min-h-[390px] space-y-5 px-6 py-7 text-[#0B1756] sm:px-9">
            <h3 className="border-b border-[#EAF3F7] pb-4 text-center text-base font-extrabold uppercase tracking-wide">{tipo==="receita"?"Prescrição de medicamentos":"Atestado médico"}</h3>
            <div className="grid gap-3 text-sm sm:grid-cols-2"><div><p className="text-[10px] font-bold uppercase tracking-wide text-[#3563A7]">Paciente</p><p className="mt-1 font-semibold">{paciente?.nome || "Aguardando paciente..."}</p><p className="mt-1 text-xs text-[#3563A7]">CPF: {maskCPF(paciente?.cpf)}</p></div><div><p className="text-[10px] font-bold uppercase tracking-wide text-[#3563A7]">Médico responsável</p><p className="mt-1 font-semibold">{medico?.nome || "Aguardando perfil..."}</p><p className="mt-1 text-xs text-[#3563A7]">{medico?`CRM ${medico.crm}/${medico.uf}`:"Registro não carregado"}</p></div></div>
            <div className="rounded-xl bg-[#EAF3F7]/60 p-4"><p className="text-xs font-bold uppercase text-[#023E8A]">{tipo==="receita"?"Medicamentos prescritos":"Declaração"}</p>{tipo==="receita"?<div className="mt-3 space-y-3">{medicamentos.map((m,i)=><div key={m.id} className="border-b border-[#3563A7]/15 pb-2 last:border-0"><p className="break-words text-sm font-bold">{i+1}. {m.nome||"Medicamento não preenchido"}</p><p className="mt-1 text-xs leading-5 text-[#3563A7]">{[m.concentracao,m.forma,m.dose,m.via,m.frequencia,m.duracao].filter(Boolean).join(" • ")||"Posologia pendente"}</p></div>)}</div>:<p className="mt-3 whitespace-pre-wrap break-words text-sm leading-6">{atestado.texto||"O texto do atestado aparecerá aqui conforme você preencher o formulário."}</p>}</div>
            <p className="text-xs text-[#3563A7]">{cidade||medico?.cidade||medico?.unidade||"Local"}, {dataBR(data)}</p>
            <div className="pt-5"><div className="w-56 border-t border-[#3563A7] pt-2 text-xs font-semibold">{medico?.nome||"Médico responsável"}<p className="mt-1 font-normal text-[#3563A7]">{medico?`CRM ${medico.crm}/${medico.uf}`:"Assinatura pendente"}</p></div></div>
          </div>
          <div className="border-t border-[#EAF3F7] px-6 py-4 text-center text-[10px] font-bold tracking-wide text-[#3563A7] sm:px-9">RASCUNHO NÃO ASSINADO • SEM VALIDADE PARA USO OFICIAL</div>
        </div>}
        <div className="mt-5 flex items-start gap-3 rounded-xl border border-[#3563A7]/20 bg-[#EAF3F7]/60 p-4"><AlertCircle size={19} className="mt-0.5 shrink-0 text-[#023E8A]"/><p className="text-xs leading-5 text-[#0B1756]"><strong>Documento profissional não significa documento assinado.</strong> O PDF terá identificação médica carregada do sistema e layout A4, mas será marcado como rascunho. Emissão oficial requer assinatura eletrônica, registro e validação no servidor.</p></div>
        <label className="mt-5 flex cursor-pointer items-start gap-3 rounded-xl border border-[#3563A7]/20 bg-white p-4 text-sm text-[#0B1756]"><input type="checkbox" checked={confirmei} onChange={(e)=>setConfirmei(e.target.checked)} className="mt-0.5 h-4 w-4 shrink-0 accent-[#023E8A]"/><span>Revisei as informações do paciente, o perfil médico autenticado e o conteúdo clínico do documento.</span></label>
        {!prontoDocumento&&<p className="mt-3 text-xs text-[#3563A7]">Para gerar o PDF, carregue os dados do médico e do paciente e preencha os campos obrigatórios do documento.</p>}
        {erroPDF&&<p role="alert" className="mt-3 text-sm font-bold text-[#0B1756]">{erroPDF}</p>}
        <div className="mt-5 flex flex-col justify-between gap-3 border-t border-[#EAF3F7] pt-5 sm:flex-row sm:items-center"><Link href="/medico/pacientes" className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#3563A7]/20 px-5 py-3 text-sm font-bold text-[#023E8A] hover:bg-[#EAF3F7]"><ArrowLeft size={17}/> Voltar aos pacientes</Link><button type="button" onClick={download} disabled={!podeGerar} className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#023E8A] px-6 py-3.5 text-sm font-bold text-white transition hover:bg-[#0B1756] disabled:cursor-not-allowed disabled:opacity-40">{gerando?<Loader2 size={18} className="animate-spin"/>:<Download size={18}/>} {gerando?"Gerando PDF...":"Gerar e baixar PDF A4"}</button></div>
      </section>
    </div>
  </main>;
}
export default function PrescricaoPage() { return <Suspense fallback={<main className="min-h-screen bg-[#EAF3F7] p-8 text-[#0B1756]">Carregando...</main>}><Tela/></Suspense>; }
