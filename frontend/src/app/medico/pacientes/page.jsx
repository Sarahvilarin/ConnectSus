"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { api } from "@/lib/api";
import {
  Activity,
  AlertTriangle,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Clock3,
  ClipboardList,
  FileCheck2,
  FileText,
  HeartPulse,
  Hospital,
  Pill,
  Search,
  ShieldCheck,
  Stethoscope,
  Users,
  X,
} from "lucide-react";

// A tela utiliza exclusivamente registros retornados pela API autenticada.

const ABAS = [
  { id: "Aguardando", nome: "Aguardando" },
  { id: "Em atendimento", nome: "Em atendimento" },
  { id: "Todos", nome: "Todos" },
];

const ORDEM = { Emergência: 0, Urgente: 1, Prioritário: 2, Rotina: 3 };
const CARD = "rounded-[24px] border border-[#DFEAF5] bg-white shadow-[0_5px_18px_rgba(20,55,100,0.04)]";
const STATUS_COR = {
  Aguardando: "border border-amber-200 bg-amber-50 text-amber-800",
  "Em atendimento": "border border-blue-200 bg-blue-50 text-blue-800",
};
const PRIORIDADE_COR = {
  Emergência: "bg-[#0B1756] text-white",
  Urgente: "bg-[#023E8A] text-white",
  Prioritário: "bg-[#EAF3F7] text-[#023E8A]",
  Rotina: "bg-slate-100 text-slate-700",
};

function horaAtual() {
  return new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
}



function Avatar({ nome, grande = false }) {
  return (
    <span className={`inline-flex shrink-0 items-center justify-center rounded-2xl bg-[#EAF3F7] font-bold text-[#0B1756] ${grande ? "h-14 w-14 text-lg" : "h-11 w-11 text-sm"}`}>
      {nome.split(" ").slice(0, 2).map((parte) => parte[0]).join("")}
    </span>
  );
}

function Status({ valor }) {
  return <span className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-[11px] font-semibold ${STATUS_COR[valor] || "bg-slate-100 text-slate-700"}`}><span className="h-1.5 w-1.5 rounded-full bg-current" />{valor}</span>;
}

function Prioridade({ valor }) {
  return <span className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-[11px] font-bold ${PRIORIDADE_COR[valor] || PRIORIDADE_COR.Rotina}`}><span className="h-1.5 w-1.5 rounded-full bg-current" />{valor}</span>;
}

function Metrica({ titulo, numero, legenda, Icone, ativo, onClick }) {
  return (
    <button type="button" onClick={onClick} className={`${CARD} flex min-h-[112px] items-center gap-4 p-5 text-left transition hover:-translate-y-0.5 hover:shadow-lg ${ativo ? "ring-2 ring-[#0B1756]/20" : ""}`}>
      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#EAF3F7] text-[#0B1756]"><Icone size={22} /></span>
      <span className="min-w-0"><span className="block text-[12px] font-semibold text-[#0B1756]">{titulo}</span><span className="block text-2xl font-extrabold leading-tight text-[#0B1756]">{String(numero).padStart(2, "0")}</span><span className="block text-[11px] text-[#3563A7]">{legenda}</span></span>
    </button>
  );
}

function Secao({ titulo, subtitulo, Icone, children }) {
  return (
    <section className="rounded-2xl border border-[#DFEAF5] bg-white p-4 sm:p-5">
      <div className="mb-4 flex items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#EAF3F7] text-[#0B1756]"><Icone size={19} /></span>
        <div><h3 className="text-sm font-bold text-[#0B1756]">{titulo}</h3>{subtitulo && <p className="mt-1 text-xs text-[#52709A]">{subtitulo}</p>}</div>
      </div>
      {children}
    </section>
  );
}

function Info({ titulo, valor }) {
  return <div className="rounded-xl border border-[#DFEAF5] bg-[#F8FBFE] p-3"><p className="text-[10px] font-bold uppercase tracking-wide text-[#52709A]">{titulo}</p><p className="mt-1 break-words text-sm font-semibold text-[#0B1756]">{valor || "Não informado"}</p></div>;
}



function Select({ valor, alterar, titulo, opcoes }) {
  const [aberto, setAberto] = useState(false);
  const containerRef = useRef(null);
  const id = titulo.toLowerCase().replace(/[^a-z0-9]+/g, "-");

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
      <button type="button" aria-label={`${titulo}: ${valor}`} aria-haspopup="listbox" aria-expanded={aberto} aria-controls={`opcoes-${id}`} onClick={() => setAberto((atual) => !atual)} className={`flex h-11 w-full items-center gap-2.5 rounded-2xl border px-3 text-left text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#3563A7]/20 ${aberto ? "border-[#023E8A] bg-[#EAF3F7] text-[#023E8A]" : "border-[#3563A7]/20 bg-white text-[#0B1756] hover:border-[#3563A7]"}`}>
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#EAF3F7] text-[#023E8A]"><AlertTriangle size={16} strokeWidth={1.8} /></span>
        <span className="min-w-0 flex-1 truncate">{valor}</span>
        <ChevronDown size={16} className={`shrink-0 text-[#3563A7] transition-transform ${aberto ? "rotate-180" : ""}`} />
      </button>
      {aberto && <div id={`opcoes-${id}`} role="listbox" aria-label={titulo} className="absolute left-0 right-0 top-[calc(100%+8px)] z-[70] overflow-hidden rounded-[20px] border border-[#EAF3F7] bg-white p-1.5 shadow-[0_20px_55px_rgba(11,23,86,0.18)]">
        <div className="max-h-[280px] space-y-1 overflow-y-auto pr-1">
          {opcoes.map((opcao) => {
            const selecionado = opcao === valor;
            return <button key={opcao} type="button" role="option" aria-selected={selecionado} onClick={() => { alterar(opcao); setAberto(false); }} className={`flex w-full items-center gap-3 rounded-[14px] px-3 py-2.5 text-left text-sm transition ${selecionado ? "bg-[#023E8A] font-bold text-white" : "bg-white font-medium text-[#0B1756] hover:bg-[#EAF3F7]"}`}>
              <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl ${selecionado ? "bg-white/15 text-white" : "bg-[#EAF3F7] text-[#023E8A]"}`}><AlertTriangle size={16} /></span>
              <span className="min-w-0 flex-1">{opcao}</span>
              {selecionado && <Check size={16} />}
            </button>;
          })}
        </div>
      </div>}
    </div>
  );
}

function AtendimentoModal({ paciente, onClose, onFinish, atualizando = false }) {

  const triagem = paciente.triagem || paciente.dadosTriagem || paciente;
  const somenteLeitura = false;
  const valor = (campo) => {
    const dado = triagem[campo];
    if (Array.isArray(dado)) return dado.length ? dado.join("; ") : "Não informado na triagem";
    return dado || "Não informado na triagem";
  };
  const linkDocumento = (tipo) =>
    `/medico/prescricao?paciente=${encodeURIComponent(paciente.pacienteId)}&tipo=${tipo === "medicamento" ? "receita" : tipo}`;

  useEffect(() => {
    const anterior = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    function tecla(event) { if (event.key === "Escape") onClose(); }
    document.addEventListener("keydown", tecla);
    return () => {
      document.body.style.overflow = anterior;
      document.removeEventListener("keydown", tecla);
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0B1756]/65 p-2 backdrop-blur-[3px] sm:p-5" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <section role="dialog" aria-modal="true" aria-labelledby="titulo-atendimento" className="flex max-h-[96vh] w-full max-w-[1120px] flex-col overflow-hidden rounded-[26px] bg-[#F3F7FB] shadow-[0_35px_100px_rgba(11,23,86,0.35)]">
        <header className="relative shrink-0 overflow-hidden bg-gradient-to-br from-[#3563A7] via-[#023E8A] to-[#0B1756] px-5 py-5 text-white sm:px-7">
          <div className="pointer-events-none absolute -right-14 -top-28 h-56 w-56 rounded-full border-[34px] border-white/[0.07]" />
          <div className="relative flex items-start justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3">
              <Avatar nome={paciente.nome} grande />
              <div className="min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-[.16em] text-white/75">Atendimento · {paciente.id}</p>
                <h2 id="titulo-atendimento" className="mt-1 text-xl font-bold sm:text-2xl">{paciente.nome}</h2>
                <p className="mt-1 text-xs text-white/85">{paciente.idade} anos · {paciente.sexo} · {paciente.cpf} · {paciente.unidade}</p>
              </div>
            </div>
            <button type="button" aria-label="Fechar atendimento" onClick={onClose} className="rounded-xl bg-white/15 p-2 transition hover:bg-white/25"><X size={21} /></button>
          </div>
          <div className="relative mt-4 flex flex-wrap items-center gap-2">
            <Prioridade valor={triagem.classificacaoRisco || paciente.prioridade} />
            <Status valor={paciente.status} />
            <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[11px] font-semibold">Chegada às {paciente.chegada}</span>
            {triagem.registradaEm && <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[11px] font-semibold">Triagem: {triagem.registradaEm}</span>}
          </div>
        </header>

        <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-4 py-4 sm:px-6 sm:py-5">
          <div className="rounded-2xl border border-blue-100 bg-blue-50/80 px-4 py-3 text-xs leading-5 text-blue-900">
            <div className="flex items-center gap-2 font-bold"><ClipboardList size={15} /> Dados encaminhados pela triagem</div>
            <p className="mt-1">As informações abaixo devem ser recebidas do registro feito pela equipe de enfermagem. Campos sem registro são exibidos como não informados.</p>
          </div>

          <Secao titulo="Queixa e avaliação inicial" subtitulo="Informações relatadas e registradas durante a triagem" Icone={Stethoscope}>
            <div className="grid gap-3 sm:grid-cols-2">
              <Info titulo="Queixa principal" valor={triagem.queixaPrincipal || paciente.motivo} />
              <Info titulo="Início dos sintomas" valor={valor("inicioSintomas")} />
              <Info titulo="Intensidade da dor" valor={valor("intensidadeDor")} />
              <Info titulo="Classificação de risco" valor={triagem.classificacaoRisco || paciente.prioridade} />
              <div className="sm:col-span-2"><Info titulo="Descrição dos sintomas" valor={valor("descricaoSintomas")} /></div>
              <div className="sm:col-span-2"><Info titulo="Observações da enfermagem" valor={valor("observacoesEnfermagem")} /></div>
            </div>
          </Secao>

          <Secao titulo="Sinais vitais aferidos na triagem" subtitulo="Valores recebidos do acolhimento de enfermagem" Icone={Activity}>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <Info titulo="Pressão arterial" valor={valor("pressaoArterial")} />
              <Info titulo="Frequência cardíaca" valor={valor("frequenciaCardiaca")} />
              <Info titulo="Temperatura" valor={valor("temperatura")} />
              <Info titulo="Saturação de oxigênio" valor={valor("saturacaoOxigenio")} />
              <Info titulo="Frequência respiratória" valor={valor("frequenciaRespiratoria")} />
              <Info titulo="Glicemia capilar" valor={valor("glicemiaCapilar")} />
            </div>
          </Secao>

          <Secao titulo="Histórico informado na triagem" subtitulo="Condições, alergias e medicamentos relatados" Icone={HeartPulse}>
            <div className="grid gap-3 sm:grid-cols-2">
              <Info titulo="Histórico de saúde" valor={triagem.historicoSaude || "Não informado na triagem"} />
              <Info titulo="Alergias" valor={triagem.alergias || "Não informado na triagem"} />
              <div className="sm:col-span-2"><Info titulo="Medicamentos em uso" valor={triagem.medicamentosEmUso || "Não informado na triagem"} /></div>
            </div>
          </Secao>

          <Secao titulo="Prontuário anterior" subtitulo="Esta tela ainda não possui uma rota de histórico clínico anterior" Icone={ClipboardList}>
            <Info titulo="Registros anteriores" valor="Não disponibilizados pela API nesta integração" />
          </Secao>

          <Secao titulo="Ações do atendimento" subtitulo="As telas de prescrição e atestado já existentes serão abertas com o identificador deste paciente" Icone={FileText}>
            <div className="grid gap-3 sm:grid-cols-2">
              <Link href={linkDocumento("medicamento")} className="flex min-h-[76px] items-center gap-3 rounded-2xl bg-[#023E8A] px-4 py-4 text-white transition hover:bg-[#0B1756]">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/15"><Pill size={21} /></span>
                <span className="min-w-0 flex-1"><span className="block text-sm font-bold">Prescrever medicamento</span><span className="mt-1 block text-[11px] text-white/80">Abrir tela de prescrição</span></span>
                <ChevronRight size={18} />
              </Link>
              <Link href={linkDocumento("atestado")} className="flex min-h-[76px] items-center gap-3 rounded-2xl border border-[#3563A7]/20 bg-white px-4 py-4 text-[#0B1756] transition hover:border-[#3563A7] hover:bg-[#F8FBFE]">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#EAF3F7] text-[#023E8A]"><FileCheck2 size={21} /></span>
                <span className="min-w-0 flex-1"><span className="block text-sm font-bold">Emitir atestado</span><span className="mt-1 block text-[11px] text-[#52709A]">Abrir tela de atestado</span></span>
                <ChevronRight size={18} />
              </Link>
            </div>
          </Secao>
        </div>

        <footer className="shrink-0 border-t border-[#DFEAF5] bg-white px-4 py-4 sm:px-6">
          {somenteLeitura ? (
            <div className="flex flex-wrap items-center justify-between gap-3"><p className="text-xs text-emerald-700">Atendimento finalizado · Alta registrada</p><button type="button" onClick={onClose} className="rounded-xl bg-[#023E8A] px-4 py-2.5 text-xs font-bold text-white hover:bg-[#0B1756]">Fechar resumo</button></div>
          ) : (
            <div className="flex flex-col-reverse gap-2 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-[11px] text-[#52709A]">Após concluir as ações necessárias, finalize o atendimento para registrar a alta.</p>
              <div className="flex flex-wrap justify-end gap-2">
                <button type="button" onClick={onClose} className="rounded-xl border border-[#D7E4F1] bg-white px-3.5 py-2.5 text-xs font-bold text-[#0B1756] hover:bg-slate-50">Fechar</button>
                <button type="button" disabled={atualizando} onClick={() => onFinish(paciente.id)} className="inline-flex items-center gap-2 rounded-xl bg-[#0B1756] px-4 py-2.5 text-xs font-bold text-white hover:bg-[#023E8A]"><CheckCircle2 size={15} /> {atualizando ? "Finalizando..." : "Finalizar atendimento"}</button>
              </div>
            </div>
          )}
        </footer>
      </section>
    </div>
  );
}



function dataValida(valor) {
  if (!valor) return null;
  const data = new Date(valor);
  return Number.isNaN(data.getTime()) ? null : data;
}

function idadeEmAnos(dataNascimento) {
  const nascimento = dataValida(dataNascimento);
  if (!nascimento) return null;
  const hoje = new Date();
  let idade = hoje.getFullYear() - nascimento.getFullYear();
  const aniversario = new Date(hoje.getFullYear(), nascimento.getMonth(), nascimento.getDate());
  if (hoje < aniversario) idade -= 1;
  return idade >= 0 ? idade : null;
}

function formatarHora(valor) {
  const data = dataValida(valor);
  return data ? data.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }) : "—";
}

function mapearPrioridade(valor) {
  const mapa = {
    vermelho: "Emergência",
    laranja: "Urgente",
    amarelo: "Prioritário",
    verde: "Rotina",
    azul: "Rotina",
    urgente: "Urgente",
    preferencial: "Prioritário",
    normal: "Rotina",
  };
  return mapa[String(valor || "").toLowerCase()] || "Rotina";
}

function mapearStatus(valor) {
  if (valor === "em_atendimento") return "Em atendimento";
  if (valor === "chamado") return "Aguardando";
  return "Aguardando";
}

function mapearFila(item) {
  const nascimento = item.paciente_data_nascimento || item.data_nascimento;
  const triagem = item.triagem_id ? {
    queixaPrincipal: item.queixa_principal,
    descricaoSintomas: item.sintomas,
    inicioSintomas: item.inicio_sintomas,
    intensidadeDor: item.intensidade_dor,
    pressaoArterial: item.pressao_arterial,
    frequenciaCardiaca: item.frequencia_cardiaca,
    temperatura: item.temperatura,
    saturacaoOxigenio: item.saturacao_oxigenio,
    frequenciaRespiratoria: item.frequencia_respiratoria,
    glicemiaCapilar: item.glicemia,
    classificacaoRisco: item.classificacao_risco,
    observacoesEnfermagem: item.observacoes_triagem,
    registradaEm: formatarHora(item.triagem_criada_em),
  } : null;

  return {
    id: String(item.id),
    filaId: Number(item.id),
    pacienteId: item.paciente_id,
    nome: item.paciente || item.nome_completo || "Paciente sem nome informado",
    cpf: item.paciente_cpf || item.cpf || "Não informado",
    idade: idadeEmAnos(nascimento),
    sexo: item.paciente_sexo || item.sexo || "Não informado",
    chegada: formatarHora(item.entrada_em),
    espera: null,
    unidade: item.unidade || item.nome_unidade || "Unidade não informada",
    unidadeId: Number(item.unidade_id),
    setorId: Number(item.setor_id),
    prioridade: mapearPrioridade(triagem?.classificacaoRisco || item.prioridade),
    status: mapearStatus(item.status),
    motivo: triagem?.queixaPrincipal || "Queixa não registrada na triagem",
    exame: null,
    triagem,
    rawStatus: item.status,
  };
}
export default function PacientesProntoAtendimentoPage() {
  const [pacientes, setPacientes] = useState([]);
  const [aba, setAba] = useState("Aguardando");
  const [busca, setBusca] = useState("");
  const [prioridade, setPrioridade] = useState("Todas as prioridades");
  const [selecionadoId, setSelecionadoId] = useState(null);
  const [pagina, setPagina] = useState(1);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [atualizando, setAtualizando] = useState(false);

  const carregarFila = useCallback(async () => {
    setCarregando(true);
    setErro("");
    try {
      const resposta = await api("/filas/medico/me");
      const registros = Array.isArray(resposta) ? resposta : resposta?.filas || resposta?.data?.filas || [];
      setPacientes(registros.map(mapearFila));
    } catch (error) {
      setErro(error.message || "Não foi possível carregar a fila do pronto atendimento.");
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => { carregarFila(); }, [carregarFila]);

  const totais = useMemo(() => ({
    aguardando: pacientes.filter((p) => p.status === "Aguardando").length,
    atendimento: pacientes.filter((p) => p.status === "Em atendimento").length,
    alta: 0,
    total: pacientes.length,
  }), [pacientes]);

  const lista = useMemo(() => {
    const termo = busca.trim().toLocaleLowerCase("pt-BR");
    return pacientes.filter((p) => {
      const statusOk = aba === "Todos" || p.status === aba;
      const prioridadeOk = prioridade === "Todas as prioridades" || p.prioridade === prioridade;
      const buscaOk = !termo || [p.nome, p.cpf, p.id, p.motivo, p.unidade, p.triagem?.queixaPrincipal, p.triagem?.descricaoSintomas].some((valor) => String(valor || "").toLocaleLowerCase("pt-BR").includes(termo));
      return statusOk && prioridadeOk && buscaOk;
    }).sort((a, b) => (ORDEM[a.prioridade] ?? 9) - (ORDEM[b.prioridade] ?? 9));
  }, [pacientes, aba, prioridade, busca]);

  useEffect(() => { setPagina(1); }, [aba, busca, prioridade]);

  const porPagina = 10;
  const totalPaginas = Math.max(1, Math.ceil(lista.length / porPagina));
  const paginaAtual = Math.min(pagina, totalPaginas);
  const pacientesPagina = lista.slice((paginaAtual - 1) * porPagina, paginaAtual * porPagina);
  const inicio = lista.length ? (paginaAtual - 1) * porPagina + 1 : 0;
  const fim = Math.min(paginaAtual * porPagina, lista.length);
  const selecionado = pacientes.find((p) => p.id === selecionadoId) || null;

  async function atualizarFila(paciente, novoStatus) {
    setAtualizando(true);
    setErro("");
    try {
      await api(`/filas/${paciente.filaId}/status`, {
        method: "PATCH",
        body: JSON.stringify({
          unidade_id: paciente.unidadeId,
          setor_id: paciente.setorId,
          status: novoStatus,
        }),
      });
      setSelecionadoId(null);
      await carregarFila();
    } catch (error) {
      setErro(error.message || "Não foi possível atualizar o atendimento.");
    } finally {
      setAtualizando(false);
    }
  }


  async function abrirAtendimento(paciente) {
    if (
      paciente.rawStatus === "aguardando" ||
      paciente.rawStatus === "chamado"
    ) {
      setAtualizando(true);
      setErro("");

      try {
        const dadosFila = {
          unidade_id: paciente.unidadeId,
          setor_id: paciente.setorId,
        };

        // Primeiro, chama o paciente.
        if (paciente.rawStatus === "aguardando") {
          await api(`/filas/${paciente.filaId}/status`, {
            method: "PATCH",
            body: JSON.stringify({
              ...dadosFila,
              status: "chamado",
            }),
          });
        }

        // Depois, inicia o atendimento.
        await api(`/filas/${paciente.filaId}/status`, {
          method: "PATCH",
          body: JSON.stringify({
            ...dadosFila,
            status: "em_atendimento",
          }),
        });

        await carregarFila();
      } catch (error) {
        setErro(
          error.message || "Não foi possível iniciar o atendimento."
        );
        return;
      } finally {
        setAtualizando(false);
      }
    }

    setSelecionadoId(paciente.id);
  }


  function fecharAtendimento() {
    setSelecionadoId(null);
  }

  async function finalizarRegistro(id) {
    const paciente = pacientes.find((p) => p.id === id);
    if (paciente) await atualizarFila(paciente, "concluido");
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#F1F6FB] px-4 py-6 text-[#0B1756] sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute -left-40 top-64 h-96 w-96 rounded-full bg-[#D9EAF8]/70" />
      <div className="pointer-events-none absolute -right-48 top-24 h-[34rem] w-[34rem] rounded-full bg-[#D3E5F7]/70" />
      <div className="pointer-events-none absolute right-[12%] top-[1050px] h-56 w-56 rounded-full border-[42px] border-white/80" />

      <div className="relative z-10 mx-auto max-w-[1500px] space-y-6">
        <section className="relative isolate overflow-hidden rounded-[30px] bg-gradient-to-br from-[#174693] via-[#234E96] to-[#151A67] px-6 py-8 text-white shadow-[0_20px_55px_rgba(2,62,138,0.16)] sm:px-9 lg:px-10">
          <div className="pointer-events-none absolute -right-16 -top-36 h-96 w-96 rounded-full border-[48px] border-white/[0.07]" />
          <div className="pointer-events-none absolute right-[28%] top-10 h-52 w-52 rounded-full border-[30px] border-white/[0.05]" />
          <div className="pointer-events-none absolute -bottom-32 left-[38%] h-64 w-64 rounded-full bg-[#78A9E6]/10 blur-2xl" />
          <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-[760px]">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-semibold"><Hospital size={15} /> Área médica · Pronto atendimento</span>
              <h1 className="mt-4 text-3xl font-bold leading-tight tracking-tight sm:text-4xl">Central de pronto atendimento</h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-white/90 sm:text-base">Consulte os dados encaminhados pela triagem, acesse as telas de prescrição e atestado e finalize o atendimento.</p>
            </div>
            <div className="grid w-full max-w-[390px] grid-cols-2 gap-3">
              <div className="flex items-center gap-3 rounded-2xl border border-white/20 bg-white/10 p-3"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10"><ShieldCheck size={19} /></span><div><p className="text-xs font-bold">Área profissional</p><p className="mt-0.5 text-[11px] text-white/80">Acesso controlado</p></div></div>
              <div className="flex items-center gap-3 rounded-2xl border border-white/20 bg-white/10 p-3"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10"><Activity size={19} /></span><div><p className="text-xs font-bold">Fluxo rápido</p><p className="mt-0.5 text-[11px] text-white/80">Atender até a alta</p></div></div>
            </div>
          </div>
        </section>

        {erro && <div role="alert" className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{erro}</div>}
        {carregando && <div className="rounded-2xl border border-[#DFEAF5] bg-white px-5 py-6 text-sm text-[#52709A]">Carregando fila do pronto atendimento...</div>}
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <Metrica titulo="Aguardando" numero={totais.aguardando} legenda="Na fila do pronto atendimento" Icone={Clock3} ativo={aba === "Aguardando"} onClick={() => setAba("Aguardando")} />
          <Metrica titulo="Em atendimento" numero={totais.atendimento} legenda="Com profissional" Icone={Stethoscope} ativo={aba === "Em atendimento"} onClick={() => setAba("Em atendimento")} />
          <Metrica titulo="Triagens recebidas" numero={pacientes.filter((p) => p.triagem).length} legenda="Com registro de enfermagem" Icone={ClipboardList} ativo={false} onClick={() => setAba("Todos")} />
          <Metrica titulo="Total no PA" numero={totais.total} legenda="Registros ativos da fila" Icone={Users} ativo={aba === "Todos"} onClick={() => setAba("Todos")} />
        </section>

        <section className={`${CARD} overflow-visible`}>
          <div className="border-b border-[#EAF3F7] px-5 pb-4 pt-5 sm:px-6">
            <div className="mb-4 flex flex-wrap items-start justify-between gap-3"><div><h2 className="text-base font-bold text-[#0B1756]">Pacientes no pronto atendimento</h2><p className="mt-1 text-xs text-[#52709A]">Selecione um paciente para iniciar ou continuar o atendimento.</p></div><span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1.5 text-[10px] font-bold text-amber-800"><AlertTriangle size={13} /> Dados carregados da API</span></div>
            <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_280px]">
              <label className="relative"><span className="sr-only">Buscar paciente</span><Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#52709A]" /><input value={busca} onChange={(e) => setBusca(e.target.value)} placeholder="Buscar por nome, CPF, protocolo, queixa ou unidade" className="h-11 w-full rounded-xl border border-[#D7E4F1] bg-white pl-11 pr-4 text-sm outline-none focus:border-[#3563A7] focus:ring-4 focus:ring-[#3563A7]/10" /></label>
              <Select valor={prioridade} alterar={setPrioridade} titulo="Prioridade" opcoes={["Todas as prioridades", "Emergência", "Urgente", "Prioritário", "Rotina"]} />
            </div>
            <div className="mt-5 flex gap-1 overflow-x-auto border-b border-[#EAF3F7]">{ABAS.map((item) => {
              const count = item.id === "Todos" ? pacientes.length : pacientes.filter((p) => p.status === item.id).length;
              return <button type="button" key={item.id} onClick={() => setAba(item.id)} className={`-mb-px flex shrink-0 items-center gap-2 border-b-[3px] px-3 pb-3 pt-2 text-xs font-bold transition sm:px-4 sm:text-sm ${aba === item.id ? "border-[#0B1756] text-[#0B1756]" : "border-transparent text-[#52709A] hover:text-[#023E8A]"}`}>{item.nome}<span className="rounded-full bg-[#EAF3F7] px-2 py-0.5 text-[10px]">{count}</span></button>;
            })}</div>
          </div>

          <div className="hidden overflow-x-auto lg:block">
            <table className="w-full min-w-[900px] text-left">
              <thead><tr className="bg-[#EAF3F7] text-[11px] uppercase tracking-wide text-[#0B1756]"><th className="px-6 py-4">Paciente</th><th className="px-5 py-4">Queixa / motivo</th><th className="px-5 py-4">Prioridade</th><th className="px-5 py-4">Chegada</th><th className="px-5 py-4">Situação</th><th className="px-6 py-4 text-right">Ação</th></tr></thead>
              <tbody>{pacientesPagina.map((p) => <tr key={p.id} className="border-t border-[#EAF3F7] transition hover:bg-[#F7FAFD]"><td className="px-6 py-4"><div className="flex items-center gap-3"><Avatar nome={p.nome} /><div><p className="font-bold text-[#0B1756]">{p.nome}</p><p className="mt-1 text-xs text-[#52709A]">{p.idade} anos · {p.cpf}</p><p className="mt-1 text-[11px] text-[#52709A]">{p.id} · {p.unidade}</p></div></div></td><td className="max-w-[320px] px-5 py-4"><p className="line-clamp-2 text-sm font-medium text-[#0B1756]">{p.triagem?.queixaPrincipal || p.motivo}</p><p className="mt-1 text-xs text-[#52709A]">{p.exame ? `Solicitação: ${p.exame}` : "Sem solicitação vinculada"}</p></td><td className="px-5 py-4"><Prioridade valor={p.triagem?.classificacaoRisco || p.prioridade} /></td><td className="px-5 py-4"><p className="font-semibold text-[#0B1756]">{p.chegada}</p><p className="mt-1 text-xs text-[#52709A]">{p.status === "Alta" ? `Alta às ${p.altaEm || "—"}` : `Posição ${p.posicao ?? "—"}`}</p></td><td className="px-5 py-4"><Status valor={p.status} /></td><td className="px-6 py-4 text-right"><button type="button" disabled={atualizando} onClick={() => abrirAtendimento(p)} className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2.5 text-xs font-bold transition ${p.status === "Alta" ? "border border-[#D7E4F1] bg-white text-[#0B1756] hover:bg-[#F1F6FB]" : "bg-[#023E8A] text-white hover:bg-[#0B1756]"}`}>{p.status === "Alta" ? "Ver resumo" : p.status === "Aguardando" ? "Atender paciente" : "Continuar atendimento"}<ChevronRight size={15} /></button></td></tr>)}</tbody>
            </table>
          </div>

          <div className="space-y-3 p-4 lg:hidden">{pacientesPagina.map((p) => <article key={p.id} className="rounded-2xl border border-[#D7E4F1] bg-white p-4"><div className="flex items-start gap-3"><Avatar nome={p.nome} /><div className="min-w-0 flex-1"><p className="font-bold text-[#0B1756]">{p.nome}</p><p className="mt-1 text-xs text-[#52709A]">{p.idade} anos · {p.id}</p><p className="mt-1 text-xs text-[#52709A]">{p.unidade}</p></div><Prioridade valor={p.triagem?.classificacaoRisco || p.prioridade} /></div><div className="mt-3 rounded-xl bg-[#F8FBFE] p-3"><p className="text-[10px] font-bold uppercase text-[#52709A]">Queixa / motivo</p><p className="mt-1 text-sm text-[#0B1756]">{p.triagem?.queixaPrincipal || p.motivo}</p></div><div className="mt-3 flex flex-wrap items-center justify-between gap-2"><Status valor={p.status} /><span className="text-xs text-[#52709A]">Chegada {p.chegada}</span></div><button type="button" disabled={atualizando} onClick={() => abrirAtendimento(p)} className="mt-3 flex w-full items-center justify-center gap-1 rounded-xl bg-[#023E8A] px-4 py-3 text-xs font-bold text-white">{p.status === "Alta" ? "Ver resumo" : p.status === "Aguardando" ? "Atender paciente" : "Continuar atendimento"}<ChevronRight size={15} /></button></article>)}</div>

          {!carregando && !lista.length && <div className="px-5 py-14 text-center"><Search className="mx-auto text-[#52709A]" size={28} /><p className="mt-3 text-sm font-bold text-[#0B1756]">Nenhum paciente encontrado</p><p className="mt-1 text-xs text-[#52709A]">Tente outra busca ou ajuste os filtros.</p><button type="button" onClick={() => { setBusca(""); setPrioridade("Todas as prioridades"); }} className="mt-4 text-xs font-bold text-[#023E8A]">Limpar filtros</button></div>}

          <div className="flex flex-col gap-3 border-t border-[#D7E4F1] bg-white px-5 py-4 text-xs text-[#52709A] sm:flex-row sm:items-center sm:justify-between sm:px-6"><div className="flex flex-wrap items-center gap-x-3 gap-y-1"><span>Mostrando <strong>{inicio}–{fim}</strong> de <strong>{lista.length}</strong> paciente(s)</span><span className="rounded-full bg-[#EAF3F7] px-2.5 py-1 font-bold text-[#023E8A]">Até 10 por página</span></div><div className="flex flex-wrap items-center gap-2"><button type="button" disabled={paginaAtual <= 1} onClick={() => setPagina((p) => Math.max(1, p - 1))} className="rounded-xl border border-[#D7E4F1] bg-white px-3 py-2 font-bold text-[#023E8A] hover:bg-[#EAF3F7] disabled:cursor-not-allowed disabled:opacity-40">Anterior</button><span className="min-w-[96px] text-center font-semibold">Página {paginaAtual} de {totalPaginas}</span><button type="button" disabled={paginaAtual >= totalPaginas} onClick={() => setPagina((p) => Math.min(totalPaginas, p + 1))} className="rounded-xl border border-[#D7E4F1] bg-white px-3 py-2 font-bold text-[#023E8A] hover:bg-[#EAF3F7] disabled:cursor-not-allowed disabled:opacity-40">Próxima</button></div><span className="flex items-center gap-1.5"><ShieldCheck size={14} /> Dados reais da fila</span></div>
        </section>

        <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs leading-5 text-amber-900"><strong>Importante:</strong> esta versão demonstra o fluxo e mantém as alterações apenas no estado da página. A listagem real e os dados da triagem dependem da integração com a API autenticada. Prescrições e atestados são abertos nas telas próprias do sistema.</div>
      </div>

      {selecionado && <AtendimentoModal key={selecionado.id} paciente={selecionado} onClose={fecharAtendimento} onFinish={finalizarRegistro} atualizando={atualizando} />}
    </main>
  );
}
