 "use client";

import { useMemo, useState } from "react";
import {
  AlertTriangle, ArrowRight, Building2, Check, CheckCircle2,
  ChevronRight, Clock3, FileCheck2, FileText, HeartPulse,
  Hospital, MapPin, Search, ShieldCheck, Stethoscope, UserRound, X,
} from "lucide-react";

const PACIENTES = [
  { id: 1, nome: "Mariana Silva Costa", cpf: "123.456.789-00", idade: 28 },
  { id: 2, nome: "João Pedro Alves", cpf: "987.654.321-00", idade: 44 },
  { id: 3, nome: "Carlos Eduardo Lima", cpf: "111.222.333-44", idade: 61 },
];

const EXAMES = [
  { id: 1, nome: "Hemograma completo", categoria: "Laboratorial", descricao: "Avaliação geral das células sanguíneas.", tipo: "lab" },
  { id: 2, nome: "Glicemia", categoria: "Laboratorial", descricao: "Medição dos níveis de glicose no sangue.", tipo: "lab" },
  { id: 3, nome: "Urina tipo I", categoria: "Laboratorial", descricao: "Análise laboratorial para investigação clínica.", tipo: "lab" },
  { id: 4, nome: "Raio-X", categoria: "Imagem", descricao: "Exame de imagem para avaliação de estruturas internas.", tipo: "imagem" },
  { id: 5, nome: "Ultrassom", categoria: "Imagem", descricao: "Avaliação de órgãos e tecidos por ultrassonografia.", tipo: "imagem" },
  { id: 6, nome: "Eletrocardiograma", categoria: "Cardiologia", descricao: "Avaliação da atividade elétrica do coração.", tipo: "coracao" },
  { id: 7, nome: "PCR", categoria: "Laboratorial", descricao: "Investigação de processos inflamatórios.", tipo: "lab" },
];

const UNIDADES = [
  { id: 1, nome: "Hospital Municipal de Emergências Albert Sabin", bairro: "Santa Paula", horario: "Atendimento 24 horas", distancia: "1,2 km", exames: [1, 2, 3, 4, 6, 7] },
  { id: 2, nome: "Hospital Municipal Maria Braido", bairro: "Santa Paula", horario: "Conforme atendimento", distancia: "2,4 km", exames: [1, 2, 4, 5, 6] },
  { id: 3, nome: "Atende Fácil Saúde Pedro Kassab", bairro: "Centro", horario: "Segunda a sexta, das 7h às 17h", distancia: "3,1 km", exames: [1, 2, 3, 5, 7] },
];

const cardClass = "rounded-[26px] border border-white/80 bg-white p-5 shadow-[0_12px_36px_rgba(2,62,138,0.07)] sm:p-6";

export default function GestaoExamePage() {
  const [cpf, setCpf] = useState("");
  const [paciente, setPaciente] = useState(null);
  const [exame, setExame] = useState(null);
  const [unidade, setUnidade] = useState(null);
  const [observacoes, setObservacoes] = useState("");
  const [erro, setErro] = useState("");
  const [confirmado, setConfirmado] = useState(false);
  const [sucesso, setSucesso] = useState(false);

  const unidadesDisponiveis = useMemo(
    () => exame ? UNIDADES.filter((item) => item.exames.includes(exame.id)) : [],
    [exame]
  );

  function formatarCPF(valor) {
    return valor.replace(/\D/g, "").slice(0, 11)
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  }

  function buscarPaciente(event) {
    event.preventDefault();
    const encontrado = PACIENTES.find((item) => item.cpf === cpf);
    if (!encontrado) {
      setErro("Nenhum paciente encontrado com este CPF.");
      setPaciente(null);
      return;
    }
    setErro("");
    setPaciente(encontrado);
    setExame(null);
    setUnidade(null);
    setConfirmado(false);
  }

  function limpar() {
    setCpf("");
    setPaciente(null);
    setExame(null);
    setUnidade(null);
    setObservacoes("");
    setErro("");
    setConfirmado(false);
    setSucesso(false);
  }

  function solicitar() {
    if (!paciente || !exame || !unidade || !confirmado) return;
    const solicitacao = {
      pacienteId: paciente.id,
      paciente: paciente.nome,
      cpf: paciente.cpf,
      exameId: exame.id,
      exame: exame.nome,
      unidadeId: unidade.id,
      unidade: unidade.nome,
      observacoes,
      prioridade: "Emergencial",
      status: "Solicitado",
    };
    console.log("SOLICITAÇÃO DE DEMONSTRAÇÃO:", solicitacao);
    setSucesso(true);
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#EAF3F7]">
      {/* Elementos decorativos do fundo */}
      <div className="pointer-events-none absolute -left-40 top-28 h-[420px] w-[420px] rounded-full bg-[#C8E0F5]/70" />
      <div className="pointer-events-none absolute -right-44 top-64 h-[520px] w-[520px] rounded-full bg-[#BFD9F1]/65" />
      <div className="pointer-events-none absolute left-[10%] top-[850px] h-52 w-52 rounded-full bg-white/80" />
      <div className="pointer-events-none absolute right-[8%] top-[1250px] h-72 w-72 rounded-full border-[48px] border-[#D4E7F7]/80" />

      <div className="relative z-10 mx-auto max-w-[1200px] px-4 pb-14 pt-8 sm:px-6 lg:px-8">
        {/* Alerta */}
        <div role="alert" className="mb-6 flex flex-col gap-3 rounded-2xl border border-amber-300 bg-amber-50 p-4 sm:flex-row sm:items-center">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-200 text-amber-900">
            <AlertTriangle size={22} />
          </div>
          <div className="flex-1">
            <p className="text-sm font-extrabold text-amber-950">Atenção: fluxo exclusivo para exames de urgência e emergência</p>
            <p className="mt-1 text-xs leading-5 text-amber-900 sm:text-sm">
              Utilize somente quando houver indicação clínica para atendimento emergencial. Exames de rotina, check-up, prevenção ou acompanhamento devem seguir o fluxo regular da rede.
            </p>
          </div>
          <span className="w-fit rounded-full border border-amber-300 bg-white px-3 py-2 text-xs font-bold text-amber-900">Uso restrito</span>
        </div>

        {/* Cabeçalho da página */}
        <section className="mb-6 overflow-hidden rounded-[28px] bg-white shadow-[0_16px_48px_rgba(2,62,138,0.10)]">
          <div className="relative overflow-hidden bg-gradient-to-br from-[#174693] via-[#234E96] to-[#151A67] px-6 py-9 text-white sm:px-9 sm:py-10">
            <div className="pointer-events-none absolute -right-16 -top-28 h-80 w-80 rounded-full bg-white/10" />
            <div className="pointer-events-none absolute -bottom-24 -left-20 h-64 w-64 rounded-full bg-[#3F6DB0]/30" />
            <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-2xl">
                <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-semibold">
                  <Stethoscope size={15} /> Área de gestão · Fluxo emergencial
                </span>
                <h1 className="mt-4 text-3xl font-bold leading-tight sm:text-4xl">Solicitação de exames</h1>
                <p className="mt-3 max-w-xl text-sm leading-6 text-blue-100 sm:text-base">
                  Registre exames indicados pela equipe assistencial durante um atendimento de urgência ou emergência.
                </p>
              </div>
              <div className="grid w-full max-w-[360px] grid-cols-2 gap-3">
                <HeroInfo icon={<ShieldCheck size={18} />} title="Acesso seguro" text="Área médica" />
                <HeroInfo icon={<HeartPulse size={18} />} title="Uso emergencial" text="Prioridade clínica" />
              </div>
            </div>
          </div>

          <div className="grid gap-3 p-4 sm:grid-cols-3 sm:p-5">
            <Etapa numero="1" titulo="Paciente" descricao={paciente?.nome || "Buscar pelo CPF"} concluida={!!paciente} ativa={!paciente} />
            <Etapa numero="2" titulo="Exame" descricao={exame?.nome || "Selecionar exame"} concluida={!!exame} ativa={!!paciente && !exame} />
            <Etapa numero="3" titulo="Unidade" descricao={unidade?.bairro || "Escolher unidade"} concluida={!!unidade} ativa={!!exame && !unidade} />
          </div>
        </section>

        {/* Etapa 1 */}
        <section className={cardClass}>
          <TituloSecao numero="01" icon={<UserRound size={21} />} titulo="Localizar paciente" descricao="Digite o CPF para localizar o cadastro." />
          {!paciente ? (
            <>
              <form onSubmit={buscarPaciente} className="mt-5 flex flex-col gap-3 md:flex-row">
                <div className="relative flex-1">
                  <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    value={cpf}
                    onChange={(event) => { setCpf(formatarCPF(event.target.value)); setErro(""); }}
                    placeholder="Digite o CPF do paciente"
                    maxLength={14}
                    className={`h-14 w-full rounded-2xl border bg-[#F7FAFD] pl-12 pr-4 text-sm text-[#0B1756] outline-none transition focus:bg-white focus:ring-4 focus:ring-[#3563A7]/10 ${erro ? "border-red-300" : "border-slate-200 focus:border-[#3563A7]"}`}
                  />
                </div>
                <button type="submit" className="flex h-14 min-w-[190px] items-center justify-center gap-2 rounded-2xl bg-[#194391] px-6 text-sm font-semibold text-white transition hover:bg-[#0B1756]">
                  <Search size={17} /> Buscar paciente
                </button>
              </form>
              {erro && <p className="mt-3 flex items-center gap-2 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600"><X size={16} />{erro}</p>}
              <p className="mt-4 rounded-xl border border-[#DCE9F5] bg-[#F7FAFD] px-4 py-3 text-xs text-slate-500">
                Para testar a demonstração, utilize <strong className="text-[#174693]">123.456.789-00</strong>.
              </p>
            </>
          ) : (
            <div className="mt-5 flex flex-col gap-4 rounded-2xl border border-[#D8E6F2] bg-[#F8FBFE] p-5 md:flex-row md:items-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#174693] text-lg font-bold text-white">{iniciais(paciente.nome)}</div>
              <div className="flex-1">
                <h3 className="font-bold text-[#0B1756]">{paciente.nome}</h3>
                <p className="mt-1 text-xs text-slate-500">CPF: {paciente.cpf} · {paciente.idade} anos</p>
              </div>
              <button type="button" onClick={limpar} className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-600 hover:border-[#3563A7]">Trocar paciente</button>
            </div>
          )}
        </section>

        {/* Etapa 2 */}
        <section className={`${cardClass} mt-5`}>
          <TituloSecao numero="02" icon={<FileText size={21} />} titulo="Selecionar exame emergencial" descricao="Escolha o exame indicado pela equipe assistencial." />
          {!paciente ? <Bloqueado icon={<UserRound size={24} />} titulo="Primeiro localize o paciente" texto="Depois disso, os exames serão liberados." /> : (
            <>
              <div className="mt-5 flex items-start gap-3 rounded-2xl border border-[#D7E5F1] bg-[#F3F8FC] p-4">
                <Stethoscope size={19} className="mt-0.5 shrink-0 text-[#174693]" />
                <div>
                  <p className="text-xs font-bold text-[#0B1756]">A indicação depende da avaliação clínica</p>
                  <p className="mt-1 text-xs leading-5 text-slate-600">O tipo de exame, por si só, não define a prioridade. Utilize este fluxo apenas quando necessário para o atendimento de urgência ou emergência.</p>
                </div>
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {EXAMES.map((item) => {
                  const selecionado = exame?.id === item.id;
                  return (
                    <button key={item.id} type="button" onClick={() => { setExame(item); setUnidade(null); setConfirmado(false); }}
                      className={`group rounded-2xl border p-4 text-left transition hover:-translate-y-0.5 ${selecionado ? "border-[#174693] bg-[#EEF5FB] shadow-sm" : "border-slate-200 bg-[#FBFCFE] hover:border-[#BED2E5]"}`}>
                      <div className="flex items-center justify-between">
                        <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${selecionado ? "bg-[#174693] text-white" : "bg-[#EAF3F7] text-[#174693]"}`}>
                          {item.tipo === "coracao" ? <HeartPulse size={19} /> : item.tipo === "imagem" ? <Building2 size={19} /> : <FileText size={19} />}
                        </div>
                        {selecionado && <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#174693] text-white"><Check size={14} /></span>}
                      </div>
                      <h3 className="mt-3 text-sm font-bold text-[#0B1756]">{item.nome}</h3>
                      <span className="mt-1 inline-flex rounded-full bg-[#EDF4FA] px-2 py-1 text-[10px] font-semibold text-[#3563A7]">{item.categoria}</span>
                      <p className="mt-3 min-h-10 text-xs leading-5 text-slate-500">{item.descricao}</p>
                      <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3 text-xs font-semibold text-[#174693]">
                        {selecionado ? "Selecionado" : "Selecionar"} <ChevronRight size={15} className="transition group-hover:translate-x-1" />
                      </div>
                    </button>
                  );
                })}
              </div>
            </>
          )}
        </section>

        {/* Etapa 3 */}
        <section className={`${cardClass} mt-5`}>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <TituloSecao numero="03" icon={<Hospital size={21} />} titulo="Escolher unidade" descricao="Unidades compatíveis com o exame selecionado." />
            {exame && <span className="w-fit rounded-full bg-[#EDF5FB] px-3 py-1.5 text-xs font-semibold text-[#174693]">{unidadesDisponiveis.length} unidades disponíveis</span>}
          </div>
          {!exame ? <Bloqueado icon={<FileText size={24} />} titulo="Escolha o exame primeiro" texto="As unidades disponíveis aparecerão automaticamente." /> : (
            <div className="mt-5 grid gap-4 lg:grid-cols-3">
              {unidadesDisponiveis.map((item) => {
                const selecionada = unidade?.id === item.id;
                return (
                  <button key={item.id} type="button" onClick={() => { setUnidade(item); setConfirmado(false); }}
                    className={`rounded-2xl border p-5 text-left transition hover:-translate-y-0.5 ${selecionada ? "border-[#174693] bg-[#EEF5FB]" : "border-slate-200 bg-[#FBFCFE] hover:border-[#BED2E5]"}`}>
                    <div className="flex items-center justify-between">
                      <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${selecionada ? "bg-[#174693] text-white" : "bg-[#EAF3F7] text-[#174693]"}`}><Hospital size={20} /></div>
                      {selecionada && <CheckCircle2 size={22} className="text-[#174693]" />}
                    </div>
                    <h3 className="mt-4 text-sm font-bold leading-5 text-[#0B1756]">{item.nome}</h3>
                    <div className="mt-4 space-y-2.5">
                      <Info icon={<MapPin size={15} />} texto={item.bairro} />
                      <Info icon={<Clock3 size={15} />} texto={item.horario} />
                      <Info icon={<Building2 size={15} />} texto={`${item.distancia} de distância`} />
                    </div>
                    <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">
                      <span className="flex items-center gap-1 text-xs font-semibold text-emerald-600"><CheckCircle2 size={13} /> Disponível neste fluxo</span>
                      <ArrowRight size={15} className="text-[#174693]" />
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </section>

        {/* Revisão */}
        {unidade && (
          <section className="mt-5 overflow-hidden rounded-[26px] border border-[#D7E5F1] bg-white shadow-[0_14px_40px_rgba(2,62,138,0.08)]">
            <div className="flex items-center gap-3 bg-[#EEF5FB] px-5 py-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#174693] text-white"><FileCheck2 size={20} /></div>
              <div><h2 className="font-bold text-[#0B1756]">Revisar solicitação emergencial</h2><p className="text-xs text-slate-500">Confira os dados antes de confirmar.</p></div>
            </div>
            <div className="p-5">
              <div className="grid gap-3 md:grid-cols-3">
                <Resumo icon={<UserRound size={17} />} label="Paciente" valor={paciente.nome} />
                <Resumo icon={<FileText size={17} />} label="Exame" valor={exame.nome} />
                <Resumo icon={<Hospital size={17} />} label="Unidade" valor={unidade.nome} />
              </div>
              <label className="mt-5 block text-sm font-semibold text-[#0B1756]">
                Observações médicas
                <textarea value={observacoes} onChange={(event) => setObservacoes(event.target.value)} rows={3}
                  placeholder="Descreva brevemente o quadro clínico que justifica a solicitação..."
                  className="mt-2 w-full resize-none rounded-2xl border border-slate-200 bg-[#F7FAFD] px-4 py-3 text-sm font-normal text-[#0B1756] outline-none focus:border-[#3563A7] focus:bg-white focus:ring-4 focus:ring-[#3563A7]/10" />
              </label>
              <div className="mt-5 rounded-2xl border-2 border-amber-300 bg-amber-50 p-4 sm:p-5">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-200 text-amber-900"><AlertTriangle size={21} /></div>
                  <div>
                    <p className="text-sm font-extrabold text-amber-950">Confirmação de uso emergencial</p>
                    <p className="mt-1 text-xs leading-5 text-amber-900">Confirme somente se o exame foi indicado para apoiar um atendimento de urgência ou emergência. Não utilize este fluxo para exames de rotina.</p>
                  </div>
                </div>
                <label className="mt-4 flex cursor-pointer items-start gap-3 rounded-xl border border-amber-200 bg-white p-3 text-sm text-slate-800">
                  <input type="checkbox" checked={confirmado} onChange={(event) => setConfirmado(event.target.checked)} className="mt-0.5 h-4 w-4 shrink-0 accent-[#174693]" />
                  <span><strong>Confirmo</strong> que esta solicitação corresponde a uma necessidade de urgência ou emergência e foi indicada conforme avaliação clínica.</span>
                </label>
              </div>
              <button type="button" onClick={solicitar} disabled={!confirmado}
                className="mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#174693] text-sm font-semibold text-white transition hover:bg-[#0B1756] disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500">
                <CheckCircle2 size={18} /> Confirmar exame de urgência/emergência
              </button>
              <p className="mt-3 text-center text-xs text-slate-400">Demonstração visual: a confirmação não envia nem salva dados no sistema.</p>
            </div>
          </section>
        )}
      </div>

      {sucesso && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#06194E]/65 p-4 backdrop-blur-sm">
          <div className="w-full max-w-[480px] overflow-hidden rounded-[28px] bg-white shadow-2xl">
            <div className="bg-gradient-to-br from-[#174693] to-[#151A67] px-7 py-9 text-center text-white">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-white/15"><div className="flex h-14 w-14 items-center justify-center rounded-full bg-white text-emerald-500"><Check size={30} strokeWidth={3} /></div></div>
              <h2 className="mt-5 text-2xl font-bold">Demonstração concluída</h2>
              <p className="mt-2 text-sm text-blue-100">Os dados foram validados nesta tela, mas a solicitação ainda não foi enviada nem registrada no sistema.</p>
            </div>
            <div className="p-6">
              <div className="rounded-2xl border border-[#DFEAF5] bg-[#F8FBFE] p-4">
                <LinhaResumo label="Paciente" valor={paciente?.nome} />
                <LinhaResumo label="Exame" valor={exame?.nome} />
                <LinhaResumo label="Unidade" valor={unidade?.nome} />
                <LinhaResumo label="Prioridade" valor="Emergencial" />
              </div>
              <button type="button" onClick={limpar} className="mt-5 w-full rounded-2xl bg-[#174693] px-5 py-3.5 text-sm font-bold text-white hover:bg-[#0B1756]">Finalizar</button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

function HeroInfo({ icon, title, text }) {
  return <div className="flex items-center gap-3 rounded-2xl border border-white/15 bg-white/10 p-3"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">{icon}</div><div><p className="text-xs font-semibold">{title}</p><p className="mt-0.5 text-[11px] text-blue-100">{text}</p></div></div>;
}

function Etapa({ numero, titulo, descricao, concluida, ativa }) {
  return <div className="flex min-w-0 items-center gap-3 rounded-2xl border border-slate-100 bg-white px-3 py-3">
    <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-sm font-bold ${concluida ? "bg-emerald-500 text-white" : ativa ? "bg-[#174693] text-white" : "bg-[#EAF3F7] text-[#174693]"}`}>{concluida ? <Check size={18} /> : numero}</div>
    <div className="min-w-0"><p className="text-sm font-bold text-[#0B1756]">{titulo}</p><p className="truncate text-xs text-slate-400">{descricao}</p></div>
  </div>;
}

function TituloSecao({ numero, icon, titulo, descricao }) {
  return <div className="flex items-center gap-3"><div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#EAF3F7] text-[#174693]">{icon}</div><div><p className="text-[10px] font-bold uppercase tracking-[2px] text-[#3563A7]">Etapa {numero}</p><h2 className="text-base font-bold text-[#0B1756]">{titulo}</h2><p className="mt-0.5 text-xs text-slate-400">{descricao}</p></div></div>;
}

function Bloqueado({ icon, titulo, texto }) {
  return <div className="mt-5 flex min-h-[145px] flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-[#F7FAFD] text-center"><div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-slate-300">{icon}</div><p className="mt-3 text-sm font-semibold text-slate-500">{titulo}</p><p className="mt-1 text-xs text-slate-400">{texto}</p></div>;
}

function Info({ icon, texto }) {
  return <div className="flex items-center gap-2 text-xs text-slate-500"><span className="text-[#174693]">{icon}</span>{texto}</div>;
}

function Resumo({ icon, label, valor }) {
  return <div className="flex min-w-0 items-center gap-3 rounded-xl border border-slate-100 bg-[#FBFCFE] p-3"><div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#EAF3F7] text-[#174693]">{icon}</div><div className="min-w-0"><p className="text-[9px] uppercase text-slate-400">{label}</p><p className="break-words text-xs font-semibold text-[#0B1756]">{valor}</p></div></div>;
}

function LinhaResumo({ label, valor }) {
  return <div className="flex justify-between gap-4 border-b border-slate-100 py-3 last:border-0"><span className="text-xs text-slate-400">{label}</span><span className="text-right text-sm font-semibold text-[#0B1756]">{valor}</span></div>;
}

function iniciais(nome) {
  return nome.split(" ").slice(0, 2).map((parte) => parte[0]).join("");
}
