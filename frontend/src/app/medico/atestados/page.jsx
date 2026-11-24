"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  AlertCircle,
  CalendarDays,
  Check,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  FilePlus2,
  FileText,
  Pill,
  Plus,
  ShieldCheck,
  Stethoscope,
  Trash2,
} from "lucide-react";

const NOMES = {
  "TRI-0841": "Mariana Silva Costa",
  "TRI-0839": "João Pedro Alves",
  "TRI-0835": "Carlos Eduardo Lima",
  "TRI-0828": "Ana Clara Oliveira",
  "TRI-0806": "Lucas Henrique Santos",
  "TRI-0798": "Fernanda Martins Souza",
  "TRI-0782": "Roberto Almeida Santos",
  "TRI-0775": "Beatriz Nascimento Lima",
};

const CAMPO =
  "w-full rounded-xl border border-[#EAF3F7] bg-[#EAF3F7] px-4 py-3 text-sm text-[#0B1756] outline-none transition focus:border-[#023E8A] focus:ring-4 focus:ring-[#3563A7]";

const MESES = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

const DIAS_SEMANA = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

function dataLocalISO(date = new Date()) {
  const ano = date.getFullYear();
  const mes = String(date.getMonth() + 1).padStart(2, "0");
  const dia = String(date.getDate()).padStart(2, "0");
  return `${ano}-${mes}-${dia}`;
}

function converterISOParaData(value) {
  if (!value) return null;
  const [ano, mes, dia] = value.split("-").map(Number);
  if (!ano || !mes || !dia) return null;
  return new Date(ano, mes - 1, dia, 12);
}

function formatarData(value) {
  if (!value) return "";
  const date = converterISOParaData(value);
  if (!date) return "";
  return date.toLocaleDateString("pt-BR");
}

/**
 * Seletor de data padronizado com o calendário do UneSUS:
 * cabeçalho azul, navegação entre meses, grade semanal e botão Hoje.
 */
function DatePicker({ value, onChange, label = "Selecionar data" }) {
  const hoje = new Date();
  const dataSelecionada = converterISOParaData(value);
  const [aberto, setAberto] = useState(false);
  const [mesVisivel, setMesVisivel] = useState(() => {
    const inicial = dataSelecionada || hoje;
    return new Date(inicial.getFullYear(), inicial.getMonth(), 1);
  });
  const containerRef = useRef(null);

  useEffect(() => {
    if (!aberto) return;

    function fecharAoClicarFora(event) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setAberto(false);
      }
    }

    function fecharComEscape(event) {
      if (event.key === "Escape") setAberto(false);
    }

    document.addEventListener("pointerdown", fecharAoClicarFora);
    document.addEventListener("keydown", fecharComEscape);

    return () => {
      document.removeEventListener("pointerdown", fecharAoClicarFora);
      document.removeEventListener("keydown", fecharComEscape);
    };
  }, [aberto]);

  function mudarMes(diferenca) {
    setMesVisivel(
      (atual) =>
        new Date(atual.getFullYear(), atual.getMonth() + diferenca, 1)
    );
  }

  function selecionarData(date) {
    onChange(dataLocalISO(date));
    setAberto(false);
  }

  function selecionarHoje() {
    const agora = new Date();
    setMesVisivel(new Date(agora.getFullYear(), agora.getMonth(), 1));
    selecionarData(agora);
  }

  const ano = mesVisivel.getFullYear();
  const mes = mesVisivel.getMonth();
  const primeiroDia = new Date(ano, mes, 1).getDay();
  const quantidadeDias = new Date(ano, mes + 1, 0).getDate();
  const celulas = [
    ...Array(primeiroDia).fill(null),
    ...Array.from({ length: quantidadeDias }, (_, index) => index + 1),
  ];

  while (celulas.length % 7 !== 0) celulas.push(null);

  const hojeISO = dataLocalISO(hoje);

  return (
    <div ref={containerRef} className="relative w-full">
      <button
        type="button"
        aria-label={label}
        aria-haspopup="dialog"
        aria-expanded={aberto}
        onClick={() => {
          if (!aberto) {
            const base = dataSelecionada || new Date();
            setMesVisivel(
              new Date(base.getFullYear(), base.getMonth(), 1)
            );
          }
          setAberto((atual) => !atual);
        }}
        className={`${CAMPO} flex items-center justify-between gap-3 text-left ${
          value ? "text-[#0B1756]" : "text-slate-400"
        }`}
      >
        <span>{value ? formatarData(value) : "Selecione a data"}</span>
        <CalendarDays
          size={18}
          strokeWidth={1.9}
          className="shrink-0 text-[#1D408F]"
        />
      </button>

      {aberto && (
        <div
          role="dialog"
          aria-label="Calendário para selecionar a data"
          className="absolute left-0 top-[calc(100%+8px)] z-[80] w-[min(300px,calc(100vw-48px))] rounded-2xl border border-[#D6E2F2] bg-white p-4 shadow-[0_12px_30px_rgba(11,23,86,0.16)]"
        >
          <div className="flex h-[52px] items-center justify-between rounded-xl bg-[#1D408F] px-3 text-white">
            <span className="text-sm font-bold">
              {MESES[mes]} {ano}
            </span>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                aria-label="Mês anterior"
                onClick={() => mudarMes(-1)}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 transition hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                type="button"
                aria-label="Próximo mês"
                onClick={() => mudarMes(1)}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 transition hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>

          <div className="mt-3 grid grid-cols-7">
            {DIAS_SEMANA.map((dia) => (
              <span
                key={dia}
                className="flex h-8 items-center justify-center text-[11px] font-bold text-[#1D408F]"
              >
                {dia}
              </span>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-y-1">
            {celulas.map((dia, index) => {
              if (!dia) {
                return <span key={`vazio-${index}`} className="h-9" />;
              }

              const dataCelula = new Date(ano, mes, dia, 12);
              const iso = dataLocalISO(dataCelula);
              const selecionado = iso === value;
              const ehHoje = iso === hojeISO;

              return (
                <button
                  key={iso}
                  type="button"
                  aria-label={`${dia} de ${MESES[mes]} de ${ano}`}
                  aria-pressed={selecionado}
                  onClick={() => selecionarData(dataCelula)}
                  className={`mx-auto flex h-8 w-8 items-center justify-center rounded-lg text-xs transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1D408F] ${
                    selecionado
                      ? "border-2 border-[#1D408F] bg-[#EAF3F7] font-bold text-[#1D408F]"
                      : ehHoje
                        ? "font-bold text-[#1D408F] hover:bg-[#EAF3F7]"
                        : "text-[#0B1756] hover:bg-[#EAF3F7]"
                  }`}
                >
                  {dia}
                </button>
              );
            })}
          </div>

          <div className="mt-3 flex justify-end border-t border-[#DCE6F2] pt-3">
            <button
              type="button"
              onClick={selecionarHoje}
              className="rounded-lg border border-[#1D408F] px-3 py-1.5 text-xs font-semibold text-[#1D408F] transition hover:bg-[#EAF3F7] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1D408F]"
            >
              Hoje
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function PrescricaoContent() {
  const searchParams = useSearchParams();
  const pacienteId = searchParams.get("paciente") || "";
  const paciente = NOMES[pacienteId] || "Paciente não identificado";
  const tipoInicial =
    searchParams.get("tipo") === "atestado" ? "atestado" : "medicamento";

  const [tipo, setTipo] = useState(tipoInicial);
  const [itens, setItens] = useState([
    {
      id: 1,
      medicamento: "",
      apresentacao: "",
      dose: "",
      via: "",
      frequencia: "",
      duracao: "",
      orientacoes: "",
    },
  ]);
  const [textoAtestado, setTextoAtestado] = useState("");
  const [dias, setDias] = useState("");
  const [data, setData] = useState(new Date().toISOString().slice(0, 10));
  const [observacoes, setObservacoes] = useState("");
  const [mensagem, setMensagem] = useState("");

  const incompleto = useMemo(
    () =>
      tipo === "medicamento"
        ? itens.some(
            (item) =>
              !item.medicamento.trim() ||
              !item.dose.trim() ||
              !item.via.trim() ||
              !item.frequencia.trim()
          )
        : !textoAtestado.trim() || !data,
    [itens, tipo, textoAtestado, data]
  );

  function alterarItem(id, chave, valor) {
    setItens((atuais) =>
      atuais.map((item) =>
        item.id === id ? { ...item, [chave]: valor } : item
      )
    );
    setMensagem("");
  }

  function adicionarItem() {
    setItens((atuais) => [
      ...atuais,
      {
        id: Math.max(0, ...atuais.map((item) => item.id)) + 1,
        medicamento: "",
        apresentacao: "",
        dose: "",
        via: "",
        frequencia: "",
        duracao: "",
        orientacoes: "",
      },
    ]);
  }

  function gerarRascunho() {
    if (incompleto) return;

    setMensagem(
      "Rascunho preparado nesta tela. Nenhuma receita ou atestado foi emitido, assinado ou enviado. Para emissão válida, conecte autenticação profissional, assinatura eletrônica, validações e backend."
    );
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#EAF3F7] px-4 pb-16 pt-6 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute -left-[170px] top-28 h-[420px] w-[420px] rounded-full bg-[#EAF3F7]/70" />
      <div className="pointer-events-none absolute -right-44 top-[340px] h-[470px] w-[470px] rounded-full bg-[#EAF3F7]/70" />
      <div className="pointer-events-none absolute left-[8%] top-[940px] h-52 w-52 rounded-full border-[38px] border-[#EAF3F7]/75" />

      <div className="relative z-10 mx-auto max-w-[1120px] space-y-5">
        <section className="relative overflow-hidden rounded-[30px] bg-gradient-to-br from-[#023E8A] via-[#023E8A] to-[#0B1756] px-6 py-8 text-[#023E8A] shadow-[0_20px_60px_rgba(2,62,138,0.12)] sm:px-9">
          <div className="pointer-events-none absolute -right-16 -top-24 h-72 w-72 rounded-full bg-[#EAF3F7]/10" />

          <div className="relative">
            <Link
              href="/medico/pacientes"
              className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#EAF3F7]/20 bg-[#EAF3F7]/10 px-3 py-1.5 text-xs font-semibold hover:bg-[#EAF3F7]/20"
            >
              <ArrowLeft size={15} />
              Voltar para pacientes
            </Link>

            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <span className="inline-flex items-center gap-2 rounded-full bg-[#EAF3F7]/10 px-3 py-1 text-xs font-semibold">
                  <Stethoscope size={14} />
                  Gestão clínica
                </span>
                <h1 className="mt-4 text-3xl font-bold sm:text-4xl">
                  Prescrições e atestados
                </h1>
                <p className="mt-2 text-sm leading-6 text-[#023E8A]">
                  Elabore um rascunho para o paciente, com revisão clínica antes
                  da emissão oficial.
                </p>
              </div>

              <div className="flex items-center gap-3 rounded-2xl border border-[#EAF3F7]/15 bg-[#EAF3F7]/10 px-4 py-3">
                <ShieldCheck size={20} />
                <div>
                  <p className="text-xs font-bold">Ambiente demonstrativo</p>
                  <p className="text-[11px] text-[#023E8A]">
                    Não emite documentos válidos
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="flex items-start gap-3 rounded-2xl border border-[#3563A7] bg-[#EAF3F7] p-4">
          <AlertCircle
            size={21}
            className="mt-0.5 shrink-0 text-[#023E8A]"
          />
          <div>
            <p className="text-sm font-bold text-[#023E8A]">
              Confirme o prontuário e os dados do paciente antes de prescrever
            </p>
            <p className="mt-1 text-xs leading-5 text-[#023E8A]">
              Medicamentos, duração de uso e atestados dependem de avaliação
              profissional. Esta interface prepara apenas rascunhos; não há
              assinatura, validação de CRM, impressão oficial nem armazenamento.
            </p>
          </div>
        </section>

        <section className="rounded-[26px] bg-[#EAF3F7] p-5 shadow-[0_12px_36px_rgba(2,62,138,0.12)] sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-widest text-[#3563A7]">
                Paciente selecionado
              </p>
              <h2 className="mt-1 text-lg font-bold text-[#0B1756]">
                {paciente}
              </h2>
              <p className="mt-1 text-xs text-[#3563A7]">
                Protocolo: {pacienteId || "Não informado"}
              </p>
            </div>
            <Link
              href="/medico/pacientes"
              className="rounded-xl border border-[#EAF3F7] bg-[#EAF3F7] px-4 py-2.5 text-xs font-semibold text-[#023E8A] hover:bg-[#EAF3F7]"
            >
              Trocar paciente
            </Link>
          </div>
        </section>

        <section className="overflow-visible rounded-[26px] bg-[#EAF3F7] shadow-[0_12px_36px_rgba(2,62,138,0.12)]">
          <div className="border-b border-[#EAF3F7] p-5 sm:p-6">
            <h2 className="text-base font-bold text-[#0B1756]">
              Tipo de documento
            </h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => {
                  setTipo("medicamento");
                  setMensagem("");
                }}
                className={`flex items-center gap-3 rounded-2xl border p-4 text-left transition ${
                  tipo === "medicamento"
                    ? "border-[#023E8A] bg-[#EAF3F7] text-[#023E8A]"
                    : "border-[#EAF3F7] bg-white text-[#3563A7] hover:border-[#BBD0E8]"
                }`}
              >
                <Pill size={22} />
                <span className="font-bold">Prescrição de medicamento</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setTipo("atestado");
                  setMensagem("");
                }}
                className={`flex items-center gap-3 rounded-2xl border p-4 text-left transition ${
                  tipo === "atestado"
                    ? "border-[#023E8A] bg-[#EAF3F7] text-[#023E8A]"
                    : "border-[#EAF3F7] bg-white text-[#3563A7] hover:border-[#BBD0E8]"
                }`}
              >
                <FilePlus2 size={22} />
                <span className="font-bold">Atestado médico</span>
              </button>
            </div>
          </div>

          <div className="space-y-5 p-5 sm:p-6">
            {tipo === "medicamento" ? (
              <>
                <div>
                  <h3 className="flex items-center gap-2 text-base font-bold text-[#0B1756]">
                    <ClipboardList size={19} />
                    Medicamentos
                  </h3>
                  <p className="mt-1 text-xs text-[#3563A7]">
                    Registre as informações conforme a decisão clínica. Nenhuma
                    sugestão terapêutica é gerada automaticamente.
                  </p>
                </div>

                {itens.map((item, index) => (
                  <div
                    key={item.id}
                    className="rounded-2xl border border-[#EAF3F7] bg-[#EAF3F7] p-4"
                  >
                    <div className="mb-4 flex items-center justify-between gap-3">
                      <p className="text-sm font-bold text-[#0B1756]">
                        Medicamento {index + 1}
                      </p>
                      {itens.length > 1 && (
                        <button
                          type="button"
                          onClick={() =>
                            setItens((atuais) =>
                              atuais.filter((i) => i.id !== item.id)
                            )
                          }
                          className="flex items-center gap-1 text-xs font-bold text-[#023E8A]"
                        >
                          <Trash2 size={14} />
                          Remover
                        </button>
                      )}
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <Campo
                        label="Nome do medicamento *"
                        value={item.medicamento}
                        onChange={(value) =>
                          alterarItem(item.id, "medicamento", value)
                        }
                        placeholder="Nome informado pelo profissional"
                      />
                      <Campo
                        label="Apresentação / concentração"
                        value={item.apresentacao}
                        onChange={(value) =>
                          alterarItem(item.id, "apresentacao", value)
                        }
                        placeholder="Forma farmacêutica e concentração"
                      />
                      <Campo
                        label="Dose *"
                        value={item.dose}
                        onChange={(value) =>
                          alterarItem(item.id, "dose", value)
                        }
                        placeholder="Dose prescrita"
                      />
                      <Campo
                        label="Via de administração *"
                        value={item.via}
                        onChange={(value) =>
                          alterarItem(item.id, "via", value)
                        }
                        placeholder="Via prescrita"
                      />
                      <Campo
                        label="Frequência *"
                        value={item.frequencia}
                        onChange={(value) =>
                          alterarItem(item.id, "frequencia", value)
                        }
                        placeholder="Intervalo ou horários"
                      />
                      <Campo
                        label="Duração do tratamento"
                        value={item.duracao}
                        onChange={(value) =>
                          alterarItem(item.id, "duracao", value)
                        }
                        placeholder="Duração determinada"
                      />
                    </div>

                    <label className="mt-4 block text-xs font-bold text-[#0B1756]">
                      Orientações adicionais
                      <textarea
                        rows={2}
                        value={item.orientacoes}
                        onChange={(event) =>
                          alterarItem(
                            item.id,
                            "orientacoes",
                            event.target.value
                          )
                        }
                        className={`${CAMPO} mt-2 resize-y`}
                        placeholder="Instruções definidas pelo profissional"
                      />
                    </label>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={adicionarItem}
                  className="inline-flex items-center gap-2 rounded-xl border border-[#EAF3F7] bg-[#EAF3F7] px-4 py-3 text-xs font-bold text-[#023E8A]"
                >
                  <Plus size={16} />
                  Adicionar medicamento
                </button>
              </>
            ) : (
              <>
                <h3 className="flex items-center gap-2 text-base font-bold text-[#0B1756]">
                  <FileText size={19} />
                  Dados do atestado
                </h3>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="block text-xs font-bold text-[#0B1756]">
                    <span>Data *</span>
                    <div className="mt-2">
                      <DatePicker
                        value={data}
                        onChange={(value) => {
                          setData(value);
                          setMensagem("");
                        }}
                        label="Selecionar data do atestado"
                      />
                    </div>
                  </div>

                  <label className="block text-xs font-bold text-[#0B1756]">
                    Dias de afastamento (se aplicável)
                    <input
                      type="number"
                      min="0"
                      max="365"
                      value={dias}
                      onChange={(event) => setDias(event.target.value)}
                      className={`${CAMPO} mt-2`}
                      placeholder="Quantidade de dias"
                    />
                  </label>
                </div>

                <label className="block text-xs font-bold text-[#0B1756]">
                  Texto do atestado *
                  <textarea
                    rows={7}
                    value={textoAtestado}
                    onChange={(event) => {
                      setTextoAtestado(event.target.value);
                      setMensagem("");
                    }}
                    className={`${CAMPO} mt-2 resize-y`}
                    placeholder="Redija o texto do atestado com base no atendimento realizado. Evite incluir informações sensíveis desnecessárias."
                  />
                </label>
              </>
            )}

            <label className="block text-xs font-bold text-[#0B1756]">
              Observações internas (não integram o documento)
              <textarea
                rows={3}
                value={observacoes}
                onChange={(event) => setObservacoes(event.target.value)}
                className={`${CAMPO} mt-2 resize-y`}
                placeholder="Anotações para revisão do profissional"
              />
            </label>

            {mensagem && (
              <div
                role="status"
                className="flex items-start gap-2 rounded-2xl border border-[#3563A7] bg-[#EAF3F7] p-4 text-xs leading-5 text-[#023E8A]"
              >
                <Check className="shrink-0" size={18} />
                {mensagem}
              </div>
            )}

            <div className="flex flex-wrap justify-between gap-3 border-t border-[#EAF3F7] pt-5">
              <Link
                href="/medico/pacientes"
                className="inline-flex items-center gap-2 rounded-xl border border-[#EAF3F7] px-4 py-3 text-xs font-bold text-[#3563A7]"
              >
                <ArrowLeft size={16} />
                Voltar à lista
              </Link>

              <button
                type="button"
                disabled={incompleto}
                onClick={gerarRascunho}
                className="inline-flex items-center gap-2 rounded-xl bg-[#023E8A] px-5 py-3 text-xs font-bold text-[#023E8A] transition hover:bg-[#0B1756] disabled:cursor-not-allowed disabled:bg-[#EAF3F7]"
              >
                <Check size={17} />
                Preparar rascunho para revisão
              </button>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

function Campo({ label, value, onChange, placeholder }) {
  return (
    <label className="block text-xs font-bold text-[#0B1756]">
      {label}
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className={`${CAMPO} mt-2`}
      />
    </label>
  );
}

export default function PrescricaoMedicoPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-[#EAF3F7] p-8 text-[#0B1756]">
          Carregando formulário...
        </main>
      }
    >
      <PrescricaoContent />
    </Suspense>
  );
}
