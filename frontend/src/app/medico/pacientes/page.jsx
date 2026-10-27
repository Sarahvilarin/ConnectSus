"use client";



import { useMemo, useState, useEffect, useRef } from "react";

import Link from "next/link";

import { Activity, AlertTriangle, ArrowRight, CalendarDays, Check, CheckCircle2, ChevronDown, ChevronRight, Clock3, ClipboardList, FileCheck2, FileHeart, FilePlus2, FileText, HeartPulse, Hospital, MapPin, Pill, Search, ShieldCheck, Stethoscope, Syringe, TestTube2, UserRound, Users, X } from "lucide-react";



// Registros fictícios para demonstração. Substituir por API autorizada.

const PACIENTES_INICIAIS = [

  {id:"TRI-0841",nome:"Mariana Silva Costa",cpf:"***.456.***-00",idade:28,sexo:"Feminino",nascimento:"18/04/1998",exame:"Hemograma completo",categoria:"Laboratorial",prioridade:"Urgente",status:"Aguardando",chegada:"13:08",espera:42,unidade:"UPA Centro",medico:"Dra. Camila Ferreira",resultado:"Aguardando coleta",motivo:"Investigação clínica em atendimento de urgência.",observacoes:"Conferir identificação e pedido médico antes da coleta.",alergias:"Não informado",comorbidades:"Não informado",atendimento:null},

  {id:"TRI-0839",nome:"João Pedro Alves",cpf:"***.654.***-21",idade:44,sexo:"Masculino",nascimento:"10/08/1982",exame:"Eletrocardiograma",categoria:"Cardiologia",prioridade:"Emergência",status:"Em atendimento",chegada:"13:19",espera:31,unidade:"UPA Centro",medico:"Dr. Rafael Mendes",resultado:"Em processamento",motivo:"Avaliação cardíaca solicitada pela equipe assistencial.",observacoes:"Seguir protocolo clínico da unidade.",alergias:"Não informado",comorbidades:"Não informado",atendimento:"13:36"},

  {id:"TRI-0835",nome:"Carlos Eduardo Lima",cpf:"***.222.***-44",idade:61,sexo:"Masculino",nascimento:"02/02/1965",exame:"Raio-X de tórax",categoria:"Imagem",prioridade:"Urgente",status:"Aguardando",chegada:"12:52",espera:58,unidade:"UPA Vila Luzita",medico:"Dra. Beatriz Rocha",resultado:"Aguardando exame",motivo:"Investigação clínica por exame de imagem.",observacoes:"Confirmar incidências conforme pedido médico.",alergias:"Não informado",comorbidades:"Não informado",atendimento:null},

  {id:"TRI-0828",nome:"Ana Clara Oliveira",cpf:"***.913.***-08",idade:35,sexo:"Feminino",nascimento:"21/11/1990",exame:"Glicemia",categoria:"Laboratorial",prioridade:"Prioritário",status:"Aguardando",chegada:"12:34",espera:76,unidade:"UPA Vila Luzita",medico:"Dr. Rafael Mendes",resultado:"Aguardando coleta",motivo:"Dosagem solicitada durante avaliação clínica.",observacoes:"Confirmar identificação e preparo conforme protocolo.",alergias:"Não informado",comorbidades:"Não informado",atendimento:null},

  {id:"TRI-0806",nome:"Lucas Henrique Santos",cpf:"***.731.***-19",idade:19,sexo:"Masculino",nascimento:"07/06/2007",exame:"Ultrassom abdominal",categoria:"Imagem",prioridade:"Prioritário",status:"Atendido",chegada:"10:14",espera:18,unidade:"UPA Centro",medico:"Dra. Camila Ferreira",resultado:"Laudo em elaboração",motivo:"Investigação de sintomas abdominais.",observacoes:"Procedimento registrado; laudo em elaboração.",alergias:"Não informado",comorbidades:"Não informado",atendimento:"10:32"},

  {id:"TRI-0798",nome:"Fernanda Martins Souza",cpf:"***.285.***-67",idade:52,sexo:"Feminino",nascimento:"14/09/1974",exame:"Hemograma completo",categoria:"Laboratorial",prioridade:"Urgente",status:"Atendido",chegada:"09:48",espera:12,unidade:"UPA Vila Luzita",medico:"Dr. Paulo Nogueira",resultado:"Em processamento",motivo:"Avaliação laboratorial em atendimento de urgência.",observacoes:"Coleta registrada pela equipe.",alergias:"Não informado",comorbidades:"Não informado",atendimento:"10:00"},

  {id:"TRI-0782",nome:"Roberto Almeida Santos",cpf:"***.104.***-55",idade:67,sexo:"Masculino",nascimento:"25/01/1959",exame:"Eletrocardiograma",categoria:"Cardiologia",prioridade:"Emergência",status:"Atendido",chegada:"08:26",espera:7,unidade:"UPA Centro",medico:"Dra. Beatriz Rocha",resultado:"Resultado disponível",motivo:"Avaliação cardíaca durante atendimento emergencial.",observacoes:"Procedimento concluído; consultar resultado no sistema integrado.",alergias:"Não informado",comorbidades:"Não informado",atendimento:"08:33"},

  {id:"TRI-0775",nome:"Beatriz Nascimento Lima",cpf:"***.908.***-12",idade:23,sexo:"Feminino",nascimento:"03/03/2003",exame:"Urina tipo I",categoria:"Laboratorial",prioridade:"Prioritário",status:"Atendido",chegada:"08:02",espera:24,unidade:"UPA Vila Luzita",medico:"Dr. Paulo Nogueira",resultado:"Resultado disponível",motivo:"Análise laboratorial solicitada durante atendimento.",observacoes:"Coleta concluída; resultado disponível no módulo de exames.",alergias:"Não informado",comorbidades:"Não informado",atendimento:"08:26"},

];



// ─── data/historico.js ───

// DADOS FICTÍCIOS para demonstração. Nunca use estes registros como prontuários reais.

// Cada campo clínico deve ser obtido de um backend autorizado e auditável.

const HISTORICOS = {

  'TRI-0841': {

    problemas: ['Asma (informação registrada em consulta anterior)'], alergias: ['Dipirona — relato prévio, confirmar'],

    medicamentos: [{nome:'Salbutamol inalatório', posologia:'Conforme prescrição anterior', situacao:'A confirmar'}],

    sinaisVitais: [{rotulo:'PA', valor:'118/76 mmHg'}, {rotulo:'FC',valor:'88 bpm'}, {rotulo:'SpO₂',valor:'98%'}, {rotulo:'Temperatura',valor:'36,7 °C'}],

    consultas: [

      {id:'CON-301',data:'15/09/2026',local:'UBS Santo Antônio',especialidade:'Clínica geral',profissional:'Dra. Helena Dias',queixa:'Tosse e desconforto respiratório',conduta:'Avaliação clínica, orientações e acompanhamento.',situacao:'Concluída'},

      {id:'CON-277',data:'22/07/2026',local:'UBS Santo Antônio',especialidade:'Medicina de família',profissional:'Dr. Ricardo Santos',queixa:'Acompanhamento de rotina',conduta:'Revisão de histórico e medicamentos.',situacao:'Concluída'},

      {id:'CON-241',data:'03/05/2026',local:'UPA Centro',especialidade:'Clínica médica',profissional:'Dra. Helena Dias',queixa:'Dispneia',conduta:'Avaliação e orientação de retorno se necessário.',situacao:'Concluída'},

    ],

    exames: [

      {id:'LAB-301',data:'16/09/2026',nome:'Hemograma completo',situacao:'Resultado disponível',resumo:'Documento disponível no sistema laboratorial; valores não incluídos nesta demonstração.'},

      {id:'IMG-099',data:'04/05/2026',nome:'Raio-X de tórax',situacao:'Laudo disponível',resumo:'Laudo armazenado no serviço responsável (simulado).'},

    ],

    evolucoes: [

      {data:'15/09/2026',tipo:'Evolução médica',autor:'Dra. Helena Dias',texto:'Paciente orientada após avaliação clínica; manter acompanhamento.'},

      {data:'22/07/2026',tipo:'Anotação de enfermagem',autor:'Equipe UBS',texto:'Sinais vitais aferidos durante acolhimento.'},

    ],

    vacinas: [{nome:'Influenza',data:'12/04/2026',situacao:'Registrada'}, {nome:'COVID-19',data:'09/02/2026',situacao:'Registrada'}],

    encaminhamentos: [{data:'15/09/2026',destino:'Pneumologia',motivo:'Avaliação especializada',situacao:'Solicitado'}],

  },

  'TRI-0839': {

    problemas:['Hipertensão arterial (registro anterior; confirmar)'], alergias:[],

    medicamentos:[{nome:'Losartana',posologia:'Conforme receita anterior',situacao:'A confirmar'}],

    sinaisVitais:[{rotulo:'PA',valor:'142/90 mmHg'},{rotulo:'FC',valor:'96 bpm'},{rotulo:'SpO₂',valor:'97%'}],

    consultas:[{id:'CON-288',data:'12/08/2026',local:'UBS Olímpico',especialidade:'Clínica geral',profissional:'Dr. Paulo Nogueira',queixa:'Acompanhamento pressórico',conduta:'Orientações e reavaliação.',situacao:'Concluída'},{id:'CON-202',data:'18/03/2026',local:'UPA Centro',especialidade:'Clínica médica',profissional:'Dra. Beatriz Rocha',queixa:'Dor torácica',conduta:'Avaliação e investigação conforme protocolo.',situacao:'Concluída'}],

    exames:[{id:'EX-211',data:'18/03/2026',nome:'Eletrocardiograma',situacao:'Laudo disponível',resumo:'Laudo disponível no módulo de exames.'}],

    evolucoes:[{data:'12/08/2026',tipo:'Evolução médica',autor:'Dr. Paulo Nogueira',texto:'Registrado acompanhamento da pressão arterial.'}],

    vacinas:[],encaminhamentos:[{data:'12/08/2026',destino:'Cardiologia',motivo:'Seguimento especializado',situacao:'Agendado'}],

  },

};





const HISTORICO_VAZIO = { problemas: [], alergias: [], medicamentos: [], sinaisVitais: [], consultas: [], exames: [], evolucoes: [], vacinas: [], encaminhamentos: [] };

const ORDEM = { Emergência: 0, Urgente: 1, Prioritário: 2 };

const PRIORIDADE_COR = { Emergência: "border-[#0B1756] bg-[#0B1756] text-white", Urgente: "border-[#023E8A]/30 bg-[#023E8A] text-white", Prioritário: "border-[#3563A7]/30 bg-[#EAF3F7] text-[#023E8A]" };

const STATUS_COR = { Aguardando: "border border-[#3563A7]/25 bg-[#EAF3F7] text-[#023E8A]", "Em atendimento": "border border-[#3563A7]/25 bg-[#3563A7]/15 text-[#023E8A]", Atendido: "border border-[#0B1756]/15 bg-white text-[#0B1756]" };

const CARD = "rounded-[26px] border border-white bg-white shadow-[0_12px_36px_rgba(2,62,138,0.07)]";

const ITENS_POR_PAGINA = 10;

const ABAS = [

  { id: "pendentes", nome: "Aguardando" },

  { id: "atendimento", nome: "Em atendimento" },

  { id: "atendidos", nome: "Já atendidos" },

  { id: "todos", nome: "Todos" },

];

const ABAS_FICHA = [

  { id: "resumo", nome: "Visão geral" },

  { id: "consultas", nome: "Consultas anteriores" },

  { id: "exames", nome: "Histórico de exames" },

  { id: "evolucoes", nome: "Evoluções" },

  { id: "outros", nome: "Vacinas e encaminhamentos" },

];



function Avatar({ nome, grande = false }) {

  return <span aria-hidden="true" className={`inline-flex shrink-0 items-center justify-center rounded-2xl bg-[#EAF3F7] font-bold text-[#0B1756] ${grande ? "h-14 w-14 text-lg" : "h-11 w-11 text-sm"}`}>

    {nome.split(" ").slice(0, 2).map(s => s[0]).join("")}

  </span>;

}

function Prioridade({ valor }) {

  return <span className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 py-1 text-[11px] font-bold ${PRIORIDADE_COR[valor] || "border-[#3563A7]/20 bg-[#EAF3F7] text-[#0B1756]"}`}><span className="h-1.5 w-1.5 rounded-full bg-current"/>{valor}</span>;

}

function Status({ valor }) {

  return <span className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-[11px] font-semibold ${STATUS_COR[valor] || "bg-[#EAF3F7] text-[#0B1756]"}`}><span className="h-1.5 w-1.5 rounded-full bg-current"/>{valor}</span>;

}

function IconeExame({ categoria }) {

  if (categoria === "Cardiologia") return <HeartPulse size={20}/>;

  if (categoria === "Imagem") return <Activity size={20}/>;

  return <TestTube2 size={20}/>;

}

function Metrica({ titulo, numero, legenda, Icone, cor, ativo, onClick }) {

  return <button type="button" onClick={onClick} className={`${CARD} flex items-center gap-4 p-4 text-left transition hover:-translate-y-0.5 hover:shadow-lg ${ativo ? "ring-2 ring-[#0B1756]/20" : ""}`}>

    <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${cor}`}><Icone size={22}/></span>

    <span className="min-w-0"><span className="block text-[12px] font-semibold text-[#0B1756]">{titulo}</span><span className="block text-2xl font-extrabold leading-tight text-[#0B1756]">{String(numero).padStart(2, "0")}</span><span className="block text-[11px] text-[#0B1756]">{legenda}</span></span>

  </button>;

}

function Campo({ titulo, valor }) {

  return <div className="rounded-xl border border-[#3563A7]/15 bg-white p-3"><p className="text-[10px] font-bold uppercase tracking-wide text-[#0B1756]">{titulo}</p><p className="mt-1 break-words text-sm font-semibold text-[#0B1756]">{valor || "Não informado"}</p></div>;

}

function ListaHistorico({ itens, children, vazio }) {

  if (!itens?.length) return <div className="rounded-2xl border border-dashed border-[#3563A7]/15 bg-white px-5 py-8 text-center text-sm text-[#0B1756]">{vazio || "Nenhum registro incluído nesta demonstração. Isso não significa ausência de histórico clínico."}</div>;

  return <div className="space-y-3">{itens.map((item, indice) => <div key={item.id || `${item.data}-${indice}`} className="rounded-2xl border border-[#3563A7]/15 bg-white p-4">{children(item)}</div>)}</div>;

}

function CabecalhoSecao({ titulo, subtitulo, Icone }) {

  return <div className="mb-4 flex items-start gap-3"><div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#EAF3F7] text-[#0B1756]"><Icone size={20}/></div><div><h3 className="text-base font-bold text-[#0B1756]">{titulo}</h3>{subtitulo && <p className="mt-1 text-xs text-[#0B1756]">{subtitulo}</p>}</div></div>;

}

function Vagas({ items }) {

  return items?.length ? <div className="flex flex-wrap gap-2">{items.map((v, i) => <span key={i} className="rounded-xl border border-[#3563A7]/20 bg-white px-3 py-2 text-xs font-semibold text-[#0B1756]">{v}</span>)}</div> : <p className="text-xs text-[#0B1756]">Sem informações registradas nesta demonstração. Confirmar com o paciente.</p>;

}



function FichaPaciente({ paciente, abaFicha, mudarAba, fechar, atualizarStatus, aviso }) {

  const historico = HISTORICOS[paciente.id] || HISTORICO_VAZIO;

  const consultas = [...historico.consultas].sort((a, b) => b.data.split("/").reverse().join("").localeCompare(a.data.split("/").reverse().join("")));

  const link = (tipo) => `/medico/prescricao?paciente=${encodeURIComponent(paciente.id)}&tipo=${tipo}`;



  useEffect(() => {

    const handleKey = (event) => { if (event.key === "Escape") fechar(); };

    document.addEventListener("keydown", handleKey);

    const anterior = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    return () => { document.removeEventListener("keydown", handleKey); document.body.style.overflow = anterior; };

  }, [fechar]);



  return <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0B1756]/65 p-3 backdrop-blur-[3px] sm:p-6" onMouseDown={e => { if (e.target === e.currentTarget) fechar(); }}>

    <section role="dialog" aria-modal="true" aria-labelledby="modal-ficha-titulo" className="flex max-h-[94vh] w-full max-w-[1040px] flex-col overflow-hidden rounded-[28px] bg-white shadow-[0_35px_100px_rgba(11,23,86,0.35)]">

      <div className="relative shrink-0 overflow-hidden bg-gradient-to-br from-[#3563A7] via-[#023E8A] to-[#0B1756] px-5 py-5 text-white sm:px-7">

        <div className="pointer-events-none absolute -right-16 -top-28 h-56 w-56 rounded-full bg-white/10" />

        <div className="pointer-events-none absolute left-[45%] -bottom-20 h-36 w-36 rounded-full border-[28px] border-white/5" />

        <div className="relative flex items-start justify-between gap-3"><div className="flex min-w-0 items-center gap-3"><span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/15"><UserRound size={24}/></span><div className="min-w-0"><p className="text-[10px] font-bold uppercase tracking-[.18em] text-white/75">Histórico clínico e prontuário · {paciente.id}</p><h2 id="modal-ficha-titulo" className="mt-1 text-xl font-bold leading-tight sm:text-2xl">{paciente.nome}</h2><p className="mt-1 text-xs text-white/85">{paciente.idade} anos · CPF {paciente.cpf} · {paciente.unidade}</p></div></div><button type="button" aria-label="Fechar ficha" onClick={fechar} className="rounded-xl bg-white/15 p-2 transition hover:bg-white/25"><X size={21}/></button></div>

        <div className="relative mt-4 flex flex-wrap items-center gap-2"><Prioridade valor={paciente.prioridade}/><span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[11px] font-semibold">{paciente.status}</span><span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[11px] font-semibold">Exame: {paciente.exame}</span></div>

      </div>



      <div className="flex shrink-0 gap-1 overflow-x-auto border-b border-[#3563A7]/15 bg-white px-3 pt-3 sm:px-6">

        {ABAS_FICHA.map(a => <button key={a.id} type="button" onClick={() => mudarAba(a.id)} className={`shrink-0 border-b-[3px] px-3 pb-3 pt-2 text-xs font-bold transition sm:text-sm ${abaFicha === a.id ? "border-[#0B1756] text-[#0B1756]" : "border-transparent text-[#3563A7] hover:text-[#023E8A]"}`}>{a.nome}</button>)}

      </div>



      <div className="min-h-0 flex-1 overflow-y-auto bg-[#EAF3F7]/45 px-4 py-5 sm:px-7">

        {abaFicha === "resumo" && <div className="space-y-5">

          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4"><Campo titulo="Prioridade clínica" valor={paciente.prioridade}/><Campo titulo="Situação do atendimento" valor={paciente.status}/><Campo titulo="Exame atual" valor={paciente.exame}/><Campo titulo="Resultado" valor={paciente.resultado}/></div>

          <div className="grid gap-4 lg:grid-cols-2">

            <div className="rounded-2xl border border-[#3563A7]/15 bg-[#EAF3F7]/40 p-4"><CabecalhoSecao titulo="Condições e alertas clínicos" subtitulo="Informações de registros anteriores" Icone={HeartPulse}/><p className="mb-2 text-[11px] font-bold uppercase text-[#0B1756]">Alergias registradas</p><Vagas items={historico.alergias}/><p className="mb-2 mt-4 text-[11px] font-bold uppercase text-[#0B1756]">Problemas de saúde</p><Vagas items={historico.problemas}/></div>

            <div className="rounded-2xl border border-[#3563A7]/15 bg-[#EAF3F7]/40 p-4"><CabecalhoSecao titulo="Atendimento atual" subtitulo="Informações da solicitação" Icone={Stethoscope}/><div className="grid gap-2"><Campo titulo="Profissional solicitante" valor={paciente.medico}/><Campo titulo="Chegada" valor={paciente.chegada}/><Campo titulo="Motivo informado" valor={paciente.motivo}/></div></div>

          </div>

          <div className="grid gap-4 lg:grid-cols-2">

            <div className="rounded-2xl border border-[#3563A7]/15 bg-[#EAF3F7]/40 p-4"><CabecalhoSecao titulo="Medicamentos anteriores" Icone={Pill}/><ListaHistorico itens={historico.medicamentos}>{m => <div><p className="font-semibold text-[#0B1756]">{m.nome}</p><p className="mt-1 text-xs text-[#0B1756]">{m.posologia} · {m.situacao}</p></div>}</ListaHistorico></div>

            <div className="rounded-2xl border border-[#3563A7]/15 bg-[#EAF3F7]/40 p-4"><CabecalhoSecao titulo="Últimos sinais vitais registrados" Icone={Activity}/>{historico.sinaisVitais.length ? <div className="grid grid-cols-2 gap-2">{historico.sinaisVitais.map((v,i) => <Campo key={i} titulo={v.rotulo} valor={v.valor}/>)}</div> : <p className="text-sm text-[#0B1756]">Não disponíveis nesta demonstração.</p>}</div>

          </div>

          <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-[#3563A7]/15 bg-white p-4"><CalendarDays size={19} className="text-[#0B1756]"/><div className="flex-1"><p className="text-sm font-bold text-[#0B1756]">Histórico longitudinal</p><p className="text-xs text-[#3563A7]">{historico.consultas.length} consultas, {historico.exames.length} exames e {historico.evolucoes.length} evoluções de demonstração</p></div><button type="button" onClick={() => mudarAba("consultas")} className="inline-flex items-center gap-1 text-xs font-bold text-[#0B1756]">Ver consultas <ArrowRight size={15}/></button></div>

          <div className="rounded-2xl border border-[#3563A7]/15 bg-white p-4 sm:p-5">

            <div className="mb-4 flex flex-wrap items-center justify-between gap-2">

              <div><p className="text-sm font-bold text-[#0B1756]">Últimas consultas</p><p className="mt-0.5 text-xs text-[#3563A7]">Acesso direto aos registros anteriores</p></div>

              <button type="button" onClick={() => mudarAba("consultas")} className="inline-flex items-center gap-1.5 rounded-xl bg-[#EAF3F7] px-3 py-2 text-xs font-bold text-[#023E8A] hover:bg-[#3563A7]/15">Ver histórico completo <ArrowRight size={15}/></button>

            </div>

            {consultas.length ? <div className="grid gap-2 sm:grid-cols-2">{consultas.slice(0, 2).map(c => <button key={c.id} type="button" onClick={() => mudarAba("consultas")} className="rounded-xl border border-[#3563A7]/15 bg-[#EAF3F7]/35 p-3 text-left transition hover:border-[#3563A7]/40 hover:bg-[#EAF3F7]/75"><span className="text-[11px] font-bold text-[#3563A7]">{c.data} · {c.local}</span><p className="mt-1 text-sm font-bold text-[#0B1756]">{c.especialidade}</p><p className="mt-1 line-clamp-2 text-xs leading-5 text-[#3563A7]">{c.queixa}</p></button>)}</div> : <p className="text-xs text-[#3563A7]">Sem consultas anteriores nesta demonstração.</p>}

          </div>

        </div>}

        {abaFicha === "consultas" && <div><CabecalhoSecao titulo="Todas as consultas anteriores" subtitulo="Do registro mais recente para o mais antigo" Icone={CalendarDays}/><ListaHistorico itens={consultas}>{c => <div className="flex gap-3"><span className="mt-1 h-3 w-3 shrink-0 rounded-full bg-[#0B1756] ring-4 ring-[#EAF3F7]"/><div className="flex-1"><div className="flex flex-wrap items-center justify-between gap-2"><p className="font-bold text-[#0B1756]">{c.especialidade}</p><span className="rounded-full bg-white px-3 py-1 text-[11px] font-bold text-[#0B1756]">{c.data}</span></div><p className="mt-1 text-xs text-[#0B1756]">{c.profissional} · {c.local}</p><p className="mt-3 text-sm text-[#0B1756]"><strong>Motivo:</strong> {c.queixa}</p><p className="mt-1 text-sm text-[#0B1756]"><strong>Conduta:</strong> {c.conduta}</p><p className="mt-2 text-[11px] font-semibold text-[#0B1756]">{c.situacao}</p></div></div>}</ListaHistorico></div>}

        {abaFicha === "exames" && <div><CabecalhoSecao titulo="Histórico de exames e resultados" subtitulo="Solicitações anteriores e situação dos laudos" Icone={TestTube2}/><div className="mb-4 rounded-2xl border border-[#3563A7]/20 bg-white p-4"><p className="text-xs font-semibold uppercase text-[#0B1756]">Exame da solicitação atual</p><p className="mt-1 font-bold text-[#0B1756]">{paciente.exame}</p><p className="mt-1 text-sm text-[#0B1756]">{paciente.resultado} · {paciente.categoria}</p></div><ListaHistorico itens={historico.exames}>{e => <div className="flex flex-wrap items-start justify-between gap-2"><div><p className="font-bold text-[#0B1756]">{e.nome}</p><p className="mt-1 text-xs text-[#0B1756]">{e.data} · {e.id}</p><p className="mt-3 text-sm text-[#0B1756]">{e.resumo}</p></div><span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-[#0B1756]">{e.situacao}</span></div>}</ListaHistorico><p className="mt-4 text-xs text-[#0B1756]">Acesso ao arquivo original do laudo dependerá da integração com o serviço responsável.</p></div>}

        {abaFicha === "evolucoes" && <div><CabecalhoSecao titulo="Evoluções e anotações" subtitulo="Registros de médicos e equipes de enfermagem" Icone={ClipboardList}/><ListaHistorico itens={historico.evolucoes}>{e => <div><div className="flex flex-wrap items-center justify-between gap-2"><p className="font-bold text-[#0B1756]">{e.tipo}</p><span className="text-xs font-semibold text-[#0B1756]">{e.data}</span></div><p className="mt-1 text-xs text-[#0B1756]">Responsável: {e.autor}</p><p className="mt-3 text-sm leading-6 text-[#0B1756]">{e.texto}</p></div>}</ListaHistorico></div>}

        {abaFicha === "outros" && <div className="grid gap-4 lg:grid-cols-2"><div><CabecalhoSecao titulo="Vacinação registrada" Icone={Syringe}/><ListaHistorico itens={historico.vacinas}>{v => <div><p className="font-bold text-[#0B1756]">{v.nome}</p><p className="mt-1 text-xs text-[#0B1756]">{v.data} · {v.situacao}</p></div>}</ListaHistorico></div><div><CabecalhoSecao titulo="Encaminhamentos" Icone={Hospital}/><ListaHistorico itens={historico.encaminhamentos}>{e => <div><p className="font-bold text-[#0B1756]">{e.destino}</p><p className="mt-1 text-xs text-[#0B1756]">{e.data} · {e.situacao}</p><p className="mt-2 text-sm text-[#0B1756]">{e.motivo}</p></div>}</ListaHistorico></div></div>}

      </div>

      <div className="shrink-0 border-t border-[#3563A7]/15 bg-white px-4 py-4 sm:px-7">

        {aviso && <p role="status" className="mb-3 rounded-xl bg-white px-3 py-2 text-xs font-semibold text-[#0B1756]">{aviso}</p>}

        <div className="flex flex-wrap items-center gap-2">

          <div className="mr-auto flex flex-wrap items-center gap-2">

            <Link href={link("medicamento")} className="inline-flex items-center gap-2 rounded-xl bg-[#023E8A] px-3.5 py-2.5 text-xs font-bold text-white transition hover:bg-[#0B1756]"><Pill size={16}/> Prescrever medicamento</Link>

            <Link href={link("atestado")} className="inline-flex items-center gap-2 rounded-xl border border-[#3563A7]/15 bg-white px-3.5 py-2.5 text-xs font-bold text-[#0B1756] transition hover:bg-[#EAF3F7]/70"><FilePlus2 size={16}/> Emitir atestado</Link>

          </div>

          {paciente.status !== "Atendido" && <button type="button" onClick={() => atualizarStatus(paciente.id, paciente.status === "Aguardando" ? "Em atendimento" : "Atendido")} className="inline-flex items-center gap-2 rounded-xl border border-[#3563A7]/20 bg-white px-3.5 py-2.5 text-xs font-bold text-[#0B1756] hover:bg-[#EAF3F7]/70">{paciente.status === "Aguardando" ? <Stethoscope size={16}/> : <CheckCircle2 size={16}/>} {paciente.status === "Aguardando" ? "Iniciar atendimento" : "Concluir atendimento"}</button>}

        </div>

        <p className="mt-3 text-[11px] leading-4 text-[#0B1756]">Demonstração: dados fictícios e alterações locais. A prescrição e emissão reais exigem autenticação, autorização profissional, documentos oficiais e integração com backend.</p>

      </div>

    </section>

  </div>;

}



export default function PacientesMedicoPage() {

  const [pacientes, setPacientes] = useState(PACIENTES_INICIAIS);

  const [aba, setAba] = useState("pendentes");

  const [busca, setBusca] = useState("");


  const [prioridade, setPrioridade] = useState("Todas as prioridades");


  const [selecionadoId, setSelecionadoId] = useState(null);

  const [abaFicha, setAbaFicha] = useState("resumo");

  const [aviso, setAviso] = useState("");

  const [pagina, setPagina] = useState(1);


  const totais = useMemo(() => ({ aguardando: pacientes.filter(p => p.status === "Aguardando").length, atendimento: pacientes.filter(p => p.status === "Em atendimento").length, atendidos: pacientes.filter(p => p.status === "Atendido").length, pendentes: pacientes.filter(p => p.status !== "Atendido").length }), [pacientes]);

  const lista = useMemo(() => pacientes.filter(p => {

    const termo = busca.trim().toLocaleLowerCase("pt-BR");

    const statusOk = aba === "todos" || (aba === "pendentes" && p.status === "Aguardando") || (aba === "atendimento" && p.status === "Em atendimento") || (aba === "atendidos" && p.status === "Atendido");

    return statusOk && (prioridade === "Todas as prioridades" || p.prioridade === prioridade) && (!termo || [p.nome, p.cpf, p.id, p.exame].some(x => String(x).toLocaleLowerCase("pt-BR").includes(termo)));

  }).sort((a, b) => (ORDEM[a.prioridade] ?? 9) - (ORDEM[b.prioridade] ?? 9) || b.espera - a.espera), [pacientes, aba, prioridade, busca]);

  // Cada aba e combinação de filtros mostra no máximo 10 registros por página.

  useEffect(() => { setPagina(1); }, [aba, busca, prioridade]);

  const totalPaginas = Math.max(1, Math.ceil(lista.length / ITENS_POR_PAGINA));

  const paginaAtual = Math.min(pagina, totalPaginas);

  const paginaPacientes = lista.slice((paginaAtual - 1) * ITENS_POR_PAGINA, paginaAtual * ITENS_POR_PAGINA);

  const inicio = lista.length ? (paginaAtual - 1) * ITENS_POR_PAGINA + 1 : 0;

  const fim = Math.min(paginaAtual * ITENS_POR_PAGINA, lista.length);

  const selecionado = pacientes.find(p => p.id === selecionadoId) || null;

  function abrirFicha(p) { setSelecionadoId(p.id); setAbaFicha("resumo"); setAviso(""); }

  function fecharFicha() { setSelecionadoId(null); setAviso(""); }

  function atualizarStatus(id, status) {

    const hora = new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });

    setPacientes(atuais => atuais.map(p => p.id === id ? { ...p, status, atendimento: status === "Em atendimento" ? hora : p.atendimento || hora } : p));

    setAviso(`Status alterado para “${status}” nesta demonstração. Não foi salvo no servidor.`);

  }

  return <main className="relative min-h-screen overflow-hidden bg-[#EAF3F7] px-4 pb-14 pt-7 sm:px-6 lg:px-8">

    {/* Bolas decorativas no mesmo padrão da tela de exames */}

    <div className="pointer-events-none absolute -left-[180px] top-[100px] h-[440px] w-[440px] rounded-full bg-[#3563A7]/15"/>

    <div className="pointer-events-none absolute -right-[200px] top-[350px] h-[500px] w-[500px] rounded-full bg-[#3563A7]/15"/>

    <div className="pointer-events-none absolute left-[8%] top-[900px] h-[210px] w-[210px] rounded-full bg-white/70"/>

    <div className="pointer-events-none absolute right-[9%] top-[1050px] h-[270px] w-[270px] rounded-full border-[44px] border-[#3563A7]/15"/>

    <div className="relative z-10 mx-auto max-w-[1360px] space-y-5">

      {/* Mesmo conjunto visual da tela de solicitação de exames */}

      <section className="overflow-hidden rounded-[32px] bg-white shadow-[0_20px_60px_rgba(2,62,138,0.12)]">

        <div className="relative overflow-hidden bg-gradient-to-br from-[#3563A7] via-[#023E8A] to-[#0B1756] px-7 pb-14 pt-8 text-white sm:px-10 sm:pt-9">

          <div className="pointer-events-none absolute -right-16 -top-28 h-80 w-80 rounded-full bg-white/10" />

          <div className="pointer-events-none absolute left-[38%] top-[62px] h-52 w-52 rounded-full border-[34px] border-white/[0.045]" />

          <div className="pointer-events-none absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-[#3563A7]/30" />

          <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">

            <div className="max-w-[730px]">

              <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-semibold">

                <Stethoscope size={15} /> Área médica · Gestão de pacientes

              </span>

              <h1 className="mt-4 text-3xl font-bold leading-tight tracking-tight sm:text-4xl">

                Pacientes e prontuário médico

              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-white/90 sm:text-base">

                Acompanhe os pacientes da unidade, visualize os exames solicitados e consulte

                o histórico clínico completo sem sair desta página.

              </p>

            </div>

            <div className="grid w-full max-w-[390px] grid-cols-2 gap-3">

              <div className="flex items-center gap-3 rounded-2xl border border-white/20 bg-white/10 p-3">

                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10">

                  <ShieldCheck size={19} />

                </span>

                <div><p className="text-xs font-bold">Acesso médico</p><p className="mt-0.5 text-[11px] text-white/80">Prontuário protegido</p></div>

              </div>

              <div className="flex items-center gap-3 rounded-2xl border border-white/20 bg-white/10 p-3">

                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10">

                  <HeartPulse size={19} />

                </span>

                <div><p className="text-xs font-bold">Histórico clínico</p><p className="mt-0.5 text-[11px] text-white/80">Consultas e exames</p></div>

              </div>

            </div>

          </div>

        </div>





      </section>



      <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">

        <Metrica titulo="Aguardando" numero={totais.aguardando} legenda="Pacientes na fila" Icone={Clock3} cor="bg-[#EAF3F7] text-[#0B1756]" ativo={aba === "pendentes"} onClick={() => setAba("pendentes")}/>

        <Metrica titulo="Em atendimento" numero={totais.atendimento} legenda="Atendimento iniciado" Icone={Stethoscope} cor="bg-[#EAF3F7] text-[#0B1756]" ativo={aba === "atendimento"} onClick={() => setAba("atendimento")}/>

        <Metrica titulo="Já atendidos" numero={totais.atendidos} legenda="Registros do dia" Icone={CheckCircle2} cor="bg-[#EAF3F7] text-[#0B1756]" ativo={aba === "atendidos"} onClick={() => setAba("atendidos")}/>

        <Metrica titulo="Total de pacientes" numero={pacientes.length} legenda="Registros disponíveis" Icone={Users} cor="bg-[#EAF3F7] text-[#0B1756]" ativo={aba === "todos"} onClick={() => setAba("todos")}/>

      </section>





      <section className={`${CARD} overflow-visible`}>

        <div className="border-b border-[#EAF3F7] px-5 pb-4 pt-5 sm:px-6"><CabecalhoSecao titulo="Lista de pacientes" subtitulo="Encontre rapidamente quem precisa de atendimento e abra o prontuário completo" Icone={Users}/>

          <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_260px]"><label className="relative"><span className="sr-only">Buscar paciente</span><Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#0B1756]"/><input value={busca} onChange={e => setBusca(e.target.value)} placeholder="Buscar por nome, CPF, exame ou protocolo" className="h-11 w-full rounded-xl border border-[#3563A7]/15 bg-white pl-11 pr-4 text-sm outline-none focus:border-[#3563A7] focus:ring-4 focus:ring-[#3563A7]/15"/></label>

            <Select valor={prioridade} alterar={setPrioridade} titulo="Prioridade" opcoes={["Todas as prioridades", "Emergência", "Urgente", "Prioritário"]}/>

          </div>

          <div className="mt-5 flex gap-1 overflow-x-auto border-b border-[#EAF3F7]">{ABAS.map(a => { const count = a.id === "pendentes" ? totais.aguardando : a.id === "atendimento" ? totais.atendimento : a.id === "atendidos" ? totais.atendidos : pacientes.length; return <button type="button" key={a.id} onClick={() => setAba(a.id)} className={`-mb-px flex shrink-0 items-center gap-2 border-b-[3px] px-3 pb-3 pt-2 text-xs font-bold transition sm:px-4 sm:text-sm ${aba === a.id ? "border-[#0B1756] text-[#0B1756]" : "border-transparent text-[#3563A7] hover:text-[#023E8A]"}`}>{a.nome}<span className={`rounded-full px-2 py-0.5 text-[10px] ${aba === a.id ? "bg-[#EAF3F7]" : "bg-[#EAF3F7]"}`}>{count}</span></button>; })}</div>

        </div>

        <div className="hidden overflow-x-auto lg:block"><table className="w-full min-w-[850px] text-left"><thead><tr className="bg-[#EAF3F7] text-[11px] uppercase tracking-wide text-[#0B1756]"><th className="px-6 py-4">Paciente</th><th className="px-5 py-4">Exame solicitado</th><th className="px-5 py-4">Prioridade</th><th className="px-5 py-4">Chegada</th><th className="px-5 py-4">Situação</th><th className="px-6 py-4 text-right">Prontuário</th></tr></thead><tbody>{paginaPacientes.map(p => <tr key={p.id} className="border-t border-[#EAF3F7] transition hover:bg-[#EAF3F7]/70"><td className="px-6 py-4"><div className="flex items-center gap-3"><Avatar nome={p.nome}/><div><p className="font-bold text-[#0B1756]">{p.nome}</p><p className="mt-1 text-xs text-[#0B1756]">{p.idade} anos · {p.cpf}</p><p className="mt-1 text-[11px] text-[#0B1756]">{p.id}</p></div></div></td><td className="px-5 py-4"><p className="font-semibold text-[#0B1756]">{p.exame}</p><p className="mt-1 text-xs text-[#0B1756]">{p.categoria} · {p.unidade}</p></td><td className="px-5 py-4"><Prioridade valor={p.prioridade}/></td><td className="px-5 py-4"><p className="font-semibold text-[#0B1756]">{p.chegada}</p><p className="mt-1 text-xs text-[#0B1756]">{p.status === "Atendido" ? `Atendido às ${p.atendimento}` : `${p.espera} min registrados`}</p></td><td className="px-5 py-4"><Status valor={p.status}/></td><td className="px-6 py-4 text-right"><button type="button" onClick={() => abrirFicha(p)} className="inline-flex items-center gap-1.5 rounded-xl border border-[#3563A7]/15 bg-white px-3.5 py-2.5 text-xs font-bold text-[#0B1756] transition hover:bg-[#EAF3F7]/70">Ver ficha completa <ChevronRight size={15}/></button></td></tr>)}</tbody></table></div>

        <div className="space-y-3 p-4 lg:hidden">{paginaPacientes.map(p => <article key={p.id} className="rounded-2xl border border-[#3563A7]/15 bg-white p-4"><div className="flex items-start gap-3"><Avatar nome={p.nome}/><div className="min-w-0 flex-1"><p className="font-bold text-[#0B1756]">{p.nome}</p><p className="mt-1 text-xs text-[#0B1756]">{p.idade} anos · {p.id}</p></div><Prioridade valor={p.prioridade}/></div><div className="mt-3 rounded-xl bg-white p-3"><p className="text-[10px] uppercase text-[#0B1756]">Exame solicitado</p><p className="mt-1 font-bold text-[#0B1756]">{p.exame}</p><p className="mt-1 text-xs text-[#0B1756]">{p.categoria} · {p.unidade}</p></div><div className="mt-3 flex items-center justify-between"><Status valor={p.status}/><span className="text-xs text-[#0B1756]">Chegada {p.chegada}</span></div><button type="button" onClick={() => abrirFicha(p)} className="mt-3 flex w-full items-center justify-center gap-1 rounded-xl bg-[#023E8A] px-4 py-3 text-xs font-bold text-white">Ver ficha completa <ChevronRight size={15}/></button></article>)}</div>

        {!lista.length && <div className="px-5 py-14 text-center"><Search className="mx-auto text-[#0B1756]" size={28}/><p className="mt-3 text-sm font-bold text-[#0B1756]">Nenhum paciente encontrado</p><p className="mt-1 text-xs text-[#0B1756]">Tente outra busca ou ajuste os filtros.</p><button type="button" onClick={() => { setBusca(""); setPrioridade("Todas as prioridades"); }} className="mt-4 text-xs font-bold text-[#0B1756]">Limpar filtros</button></div>}

        <div className="flex flex-col gap-3 border-t border-[#3563A7]/15 bg-white px-5 py-4 text-xs text-[#0B1756] sm:flex-row sm:items-center sm:justify-between sm:px-6">

          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">

            <span>Mostrando <strong>{inicio}–{fim}</strong> de <strong>{lista.length}</strong> paciente(s)</span>

            <span className="rounded-full bg-[#EAF3F7] px-2.5 py-1 font-bold text-[#023E8A]">Até 10 por página</span>

          </div>

          <div className="flex flex-wrap items-center gap-2">

            <button type="button" disabled={paginaAtual <= 1} onClick={() => setPagina(p => Math.max(1, p - 1))} className="rounded-xl border border-[#3563A7]/25 bg-white px-3 py-2 font-bold text-[#023E8A] transition hover:bg-[#EAF3F7] disabled:cursor-not-allowed disabled:opacity-40">Anterior</button>

            <span className="min-w-[96px] text-center font-semibold">Página {paginaAtual} de {totalPaginas}</span>

            <button type="button" disabled={paginaAtual >= totalPaginas} onClick={() => setPagina(p => Math.min(totalPaginas, p + 1))} className="rounded-xl border border-[#3563A7]/25 bg-white px-3 py-2 font-bold text-[#023E8A] transition hover:bg-[#EAF3F7] disabled:cursor-not-allowed disabled:opacity-40">Próxima</button>

          </div>

          <span className="flex items-center gap-1.5"><ShieldCheck size={14}/> Dados fictícios nesta demonstração</span>

        </div>

      </section>

    </div>

    {selecionado && <FichaPaciente paciente={selecionado} abaFicha={abaFicha} mudarAba={setAbaFicha} fechar={fecharFicha} atualizarStatus={atualizarStatus} aviso={aviso}/>}

  </main>;

}



function Select({ valor, alterar, titulo, opcoes }) {

  const [aberto, setAberto] = useState(false);

  const containerRef = useRef(null);

  const id = titulo.toLowerCase().replace(/[^a-z0-9]+/g, "-");

  const Icone = AlertTriangle;



  useEffect(() => {

    if (!aberto) return;



    function fecharFora(event) {

      if (!containerRef.current?.contains(event.target)) setAberto(false);

    }

    function fecharEsc(event) {

      if (event.key === "Escape") setAberto(false);

    }



    document.addEventListener("pointerdown", fecharFora);

    document.addEventListener("keydown", fecharEsc);

    return () => {

      document.removeEventListener("pointerdown", fecharFora);

      document.removeEventListener("keydown", fecharEsc);

    };

  }, [aberto]);



  return (

    <div ref={containerRef} className="relative min-w-0">

      <button

        type="button"

        aria-label={`${titulo}: ${valor}`}

        aria-haspopup="listbox"

        aria-expanded={aberto}

        aria-controls={`opcoes-${id}`}

        onClick={() => setAberto((atual) => !atual)}

        className={`flex h-11 w-full items-center gap-2.5 rounded-2xl border px-3 text-left text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#3563A7]/20 ${

          aberto

            ? "border-[#023E8A] bg-[#EAF3F7] text-[#023E8A]"

            : "border-[#3563A7]/20 bg-white text-[#0B1756] hover:border-[#3563A7]"

        }`}

      >

        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#EAF3F7] text-[#023E8A]">

          <Icone size={16} strokeWidth={1.8} />

        </span>

        <span className="min-w-0 flex-1 truncate">{valor}</span>

        <ChevronDown size={16} className={`shrink-0 text-[#3563A7] transition-transform ${aberto ? "rotate-180" : ""}`} />

      </button>



      {aberto && (

        <div

          id={`opcoes-${id}`}

          role="listbox"

          aria-label={titulo}

          className="absolute left-0 right-0 top-[calc(100%+8px)] z-[70] overflow-hidden rounded-[22px] border border-[#EAF3F7] bg-white p-1.5 shadow-[0_20px_55px_rgba(11,23,86,0.18)]"

        >

          <div className="max-h-[280px] space-y-1 overflow-y-auto overscroll-contain pr-1 [scrollbar-color:#3563A7\_#EAF3F7] [scrollbar-width:thin]">

            {opcoes.map((opcao) => {

              const selecionado = opcao === valor;

              return (

                <button

                  key={opcao}

                  type="button"

                  role="option"

                  aria-selected={selecionado}

                  onClick={() => {

                    alterar(opcao);

                    setAberto(false);

                  }}

                  className={`flex w-full items-center gap-3 rounded-[15px] px-3 py-2.5 text-left text-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3563A7] ${

                    selecionado

                      ? "bg-[#023E8A] font-bold text-white"

                      : "bg-white font-medium text-[#0B1756] hover:bg-[#EAF3F7]"

                  }`}

                >

                  <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl ${selecionado ? "bg-white/15 text-white" : "bg-[#EAF3F7] text-[#023E8A]"}`}>

                    <Icone size={17} strokeWidth={1.8} />

                  </span>

                  <span className="min-w-0 flex-1 break-words">{opcao}</span>

                  {selecionado && <Check size={16} className="shrink-0" />}

                </button>

              );

            })}

          </div>

        </div>

      )}

    </div>

  );

}


