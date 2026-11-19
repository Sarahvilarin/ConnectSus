
"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { api } from "@/lib/api";
import {
  CalendarDays,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock,
} from "lucide-react";

/* =========================
   FUNÇÕES AUXILIARES
========================= */

function iniciais(nome = "") {
  return nome
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0])
    .join("")
    .toUpperCase();
}

function dataHoraLocal(valor) {
  if (!valor) return "";

  const data = new Date(valor);

  if (Number.isNaN(data.getTime())) {
    return String(valor).replace(" ", "T").slice(0, 16);
  }

  const local = new Date(
    data.getTime() - data.getTimezoneOffset() * 60000
  );

  return local.toISOString().slice(0, 16);
}

function formatarDataHora(valor) {
  if (!valor) return "Não agendado";

  const data = new Date(String(valor).replace(" ", "T"));

  if (Number.isNaN(data.getTime())) return String(valor);

  return data.toLocaleString("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  });
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

/* =========================
   COMPONENTES VISUAIS
========================= */

function StatusBadge({ status }) {
  const classes = {
    solicitado: "border-amber-200 bg-amber-50 text-amber-800",
    agendado: "border-blue-100 bg-blue-50 text-blue-700",
    em_andamento: "border-violet-100 bg-violet-50 text-violet-700",
    concluido: "border-emerald-100 bg-emerald-50 text-emerald-700",
    cancelado: "border-red-100 bg-red-50 text-red-700",
  };

  return (
    <span
      className={`inline-flex whitespace-nowrap rounded-full border px-3 py-1.5 text-[11px] font-semibold ${
        classes[status] ||
        "border-slate-200 bg-slate-50 text-slate-600"
      }`}
    >
      {statusLabel(status)}
    </span>
  );
}

function Avatar({ name, large = false }) {
  return (
    <span
      className={`flex shrink-0 items-center justify-center rounded-full bg-[#EAF3F7] font-semibold text-[#3563A7] ${
        large ? "h-12 w-12 text-base" : "h-10 w-10 text-sm"
      }`}
    >
      {iniciais(name)}
    </span>
  );
}

function MetricCard({ label, value }) {
  return (
    <div className="flex min-h-[105px] flex-col justify-center rounded-xl border border-[#DCE8F3] bg-white px-4 py-4 shadow-[0_8px_24px_rgba(2,62,138,0.04)]">
      <span className="text-2xl font-bold leading-none text-[#0B1756]">
        {value}
      </span>

      <span className="mt-2 text-xs font-semibold leading-5 text-slate-500">
        {label}
      </span>
    </div>
  );
}

function TabButton({ active, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex min-h-11 items-center justify-center rounded-xl px-3 py-3 text-center text-xs font-semibold transition sm:px-4 sm:text-sm ${
        active
          ? "bg-[#023E8A] text-white shadow-sm"
          : "text-[#3563A7] hover:bg-[#EAF3F7]"
      }`}
    >
      {children}
    </button>
  );
}

function InfoBlock({ title, children }) {
  return (
    <div className="rounded-xl border border-slate-100 bg-[#F8FAFC] p-3">
      <h3 className="text-sm font-bold text-[#3563A7]">
        {title}
      </h3>

      <div className="mt-2 text-xs font-normal leading-5 text-slate-600">
        {children}
      </div>
    </div>
  );
}

function EmptyState({ title, description }) {
  return (
    <div className="flex min-h-32 flex-col items-center justify-center rounded-xl border border-dashed border-[#D6E3F0] bg-[#EEF5F9] px-4 py-6 text-center">
      <p className="text-base font-semibold text-[#3563A7]">
        {title}
      </p>

      <p className="mt-1 text-sm font-normal text-slate-500">
        {description}
      </p>
    </div>
  );
}

/* =========================
   CALENDÁRIO E HORÁRIO
========================= */

const nomesMeses = [
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

const nomesSemana = [
  "Dom",
  "Seg",
  "Ter",
  "Qua",
  "Qui",
  "Sex",
  "Sáb",
];

const pad = (n) => String(n).padStart(2, "0");

const paraIso = (ano, mes, dia) =>
  `${ano}-${pad(mes + 1)}-${pad(dia)}`;

const dataAtualISO = () => {
  const d = new Date();

  return paraIso(
    d.getFullYear(),
    d.getMonth(),
    d.getDate()
  );
};

function formatarDataCalendario(iso) {
  if (!iso) return "";

  const [ano, mes, dia] = iso.split("-");

  return `${dia}/${mes}/${ano}`;
}

/* =========================
   CONTROLE DOS POPUPS
========================= */

function usePopup() {
  const [aberto, setAberto] = useState(false);

  const [pos, setPos] = useState({
    top: 0,
    left: 0,
  });

  const ref = useRef(null);

  useEffect(() => {
    if (!aberto) return;

    const fechar = (e) => {
      if (!e.target?.closest?.("[data-popup]")) {
        setAberto(false);
      }
    };

    window.addEventListener("scroll", fechar, true);
    window.addEventListener("resize", fechar);

    return () => {
      window.removeEventListener("scroll", fechar, true);
      window.removeEventListener("resize", fechar);
    };
  }, [aberto]);

  function alternar(altura, largura, aoAbrir) {
    if (!aberto && ref.current) {
      const r = ref.current.getBoundingClientRect();

      let top = r.bottom + 8;

      if (top + altura > window.innerHeight - 12) {
        const acima = r.top - altura - 8;

        top =
          acima >= 12
            ? acima
            : Math.max(
                12,
                window.innerHeight - altura - 12
              );
      }

      setPos({
        top,
        left: Math.max(
          12,
          Math.min(
            r.left,
            window.innerWidth - largura - 12
          )
        ),
      });

      aoAbrir?.();
    }

    setAberto((a) => !a);
  }

  return {
    aberto,
    setAberto,
    pos,
    ref,
    alternar,
  };
}

/* =========================
   DATE PICKER
========================= */

function DatePicker({ valor, onChange }) {
  const {
    aberto,
    setAberto,
    pos,
    ref,
    alternar,
  } = usePopup();

  const hojeIso = dataAtualISO();

  const [visao, setVisao] = useState(() => {
    const hoje = new Date();

    return {
      ano: hoje.getFullYear(),
      mes: hoje.getMonth(),
    };
  });

  function abrir() {
    alternar(380, 300, () => {
      const base = valor
        ? new Date(`${valor}T00:00:00`)
        : new Date();

      setVisao({
        ano: base.getFullYear(),
        mes: base.getMonth(),
      });
    });
  }

  function mudarMes(delta) {
    setVisao(({ ano, mes }) => {
      const novaData = new Date(
        ano,
        mes + delta,
        1
      );

      return {
        ano: novaData.getFullYear(),
        mes: novaData.getMonth(),
      };
    });
  }

  function escolher(data) {
    onChange(data);
    setAberto(false);
  }

  const primeiroDia = new Date(
    visao.ano,
    visao.mes,
    1
  ).getDay();

  const totalDias = new Date(
    visao.ano,
    visao.mes + 1,
    0
  ).getDate();

  const celulas = [
    ...Array(primeiroDia).fill(null),
    ...Array.from(
      { length: totalDias },
      (_, i) => i + 1
    ),
  ];

  return (
    <div ref={ref} className="relative w-full">

      {/* CAMPO DE DATA */}

      <button
        type="button"
        onClick={abrir}
        aria-haspopup="dialog"
        aria-expanded={aberto}
        className="flex h-11 w-full items-center justify-between rounded-xl border border-[#D5E2F1] bg-white px-4 text-sm text-[#0B1756] shadow-[0_0_0_4px_rgba(53,99,167,0.06)] transition hover:border-[#3563A7]"
      >
        <span
          className={
            valor ? "text-[#0B1756]" : "text-slate-400"
          }
        >
          {valor
            ? formatarDataCalendario(valor)
            : "dd/mm/aaaa"}
        </span>

        <CalendarDays
          size={16}
          className="text-[#023E8A]"
        />
      </button>

      {/* CALENDÁRIO */}

      {aberto && (
        <>
          <button
            type="button"
            aria-label="Fechar calendário"
            onClick={() => setAberto(false)}
            className="fixed inset-0 z-10 cursor-default"
          />

          <div
            data-popup
            role="dialog"
            aria-label="Selecionar data"
            style={{
              top: pos.top,
              left: pos.left,
            }}
            className="fixed z-20 w-[300px] max-w-[calc(100vw-24px)] rounded-2xl border border-[#DCE6F2] bg-white p-4 shadow-[0_16px_35px_rgba(15,35,75,0.20)]"
          >

            {/* CABEÇALHO */}

            <div className="mb-3 flex h-[52px] items-center justify-between rounded-xl bg-[#1D438F] px-3">
              <span className="text-sm font-bold text-white">
                {nomesMeses[visao.mes]} {visao.ano}
              </span>

              <div className="flex items-center gap-1">

                <button
                  type="button"
                  onClick={() => mudarMes(-1)}
                  aria-label="Mês anterior"
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
                >
                  <ChevronLeft size={17} />
                </button>

                <button
                  type="button"
                  onClick={() => mudarMes(1)}
                  aria-label="Próximo mês"
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
                >
                  <ChevronRight size={17} />
                </button>

              </div>
            </div>

            {/* DIAS DA SEMANA */}

            <div className="mb-1 grid grid-cols-7">
              {nomesSemana.map((dia) => (
                <div
                  key={dia}
                  className="flex h-7 items-center justify-center text-xs font-semibold text-[#24477F]"
                >
                  {dia}
                </div>
              ))}
            </div>

            {/* DIAS */}

            <div className="grid grid-cols-7 gap-y-1">
              {celulas.map((dia, index) => {
                if (!dia) {
                  return (
                    <div
                      key={`vazio-${index}`}
                      className="h-8"
                    />
                  );
                }

                const iso = paraIso(
                  visao.ano,
                  visao.mes,
                  dia
                );

                const selecionado = iso === valor;
                const hoje = iso === hojeIso;

                return (
                  <div
                    key={iso}
                    className="flex h-8 items-center justify-center"
                  >
                    <button
                      type="button"
                      onClick={() => escolher(iso)}
                      aria-pressed={selecionado}
                      className={`flex h-8 w-8 items-center justify-center rounded-lg text-xs transition ${
                        selecionado
                          ? "border-2 border-[#1D438F] bg-[#EAF2FC] font-semibold text-[#1D438F]"
                          : hoje
                            ? "font-bold text-[#1D438F]"
                            : "font-medium text-[#101C4A] hover:bg-[#EEF4FA]"
                      }`}
                    >
                      {dia}
                    </button>
                  </div>
                );
              })}
            </div>

            {/* RODAPÉ */}

            <div className="mt-4 flex items-center justify-between border-t border-[#DCE5EF] pt-3">

              <button
                type="button"
                onClick={() => escolher("")}
                className="text-xs font-semibold text-slate-500 transition hover:text-red-600"
              >
                Limpar data
              </button>

              <button
                type="button"
                onClick={() => escolher(hojeIso)}
                className="rounded-lg border border-[#1D438F] bg-white px-3 py-2 text-xs font-semibold text-[#1D438F] transition hover:bg-[#EEF4FA]"
              >
                Hoje
              </button>

            </div>
          </div>
        </>
      )}
    </div>
  );
}

/* =========================
   TIME PICKER
========================= */

function TimePicker({ valor, onChange }) {
  const {
    aberto,
    setAberto,
    pos,
    ref,
    alternar,
  } = usePopup();

  const [horaTemporaria, setHoraTemporaria] =
    useState(valor || "09:00");

  useEffect(() => {
    setHoraTemporaria(valor || "09:00");
  }, [valor]);

  const [hora, minuto] = horaTemporaria.split(":");

  function abrir() {
    alternar(400, 300, () => {
      setHoraTemporaria(valor || "09:00");
    });
  }

  function confirmar() {
    onChange(horaTemporaria);
    setAberto(false);
  }

  function limpar() {
    onChange("");
    setAberto(false);
  }

  return (
    <div ref={ref} className="relative w-full">

      {/* CAMPO DE HORÁRIO */}

      <button
        type="button"
        onClick={abrir}
        aria-haspopup="dialog"
        aria-expanded={aberto}
        className="flex h-11 w-full items-center justify-between rounded-xl border border-[#D5E2F1] bg-white px-4 text-sm text-[#0B1756] shadow-[0_0_0_4px_rgba(53,99,167,0.06)] transition hover:border-[#3563A7]"
      >
        <span
          className={
            valor ? "text-[#0B1756]" : "text-slate-400"
          }
        >
          {valor || "Selecionar horário"}
        </span>

        <Clock
          size={16}
          className="text-[#023E8A]"
        />
      </button>

      {/* SELETOR DE HORÁRIO */}

      {aberto && (
        <>
          <button
            type="button"
            aria-label="Fechar horários"
            onClick={() => setAberto(false)}
            className="fixed inset-0 z-10 cursor-default"
          />

          <div
            data-popup
            role="dialog"
            aria-label="Selecionar horário"
            style={{
              top: pos.top,
              left: pos.left,
            }}
            className="fixed z-20 w-[300px] max-w-[calc(100vw-24px)] rounded-2xl border border-[#DCE6F2] bg-white p-4 shadow-[0_16px_35px_rgba(15,35,75,0.20)]"
          >

            {/* CABEÇALHO */}

            <div className="mb-4 flex h-[52px] items-center justify-between rounded-xl bg-[#1D438F] px-3">

              <span className="text-sm font-bold text-white">
                Selecionar horário
              </span>

              <Clock
                size={18}
                className="text-white"
              />

            </div>

            {/* HORAS E MINUTOS */}

            <div className="grid grid-cols-2 gap-3">

              {/* HORAS */}

              <div>
                <p className="mb-2 text-center text-xs font-semibold text-[#24477F]">
                  Hora
                </p>

                <div className="grid max-h-[160px] grid-cols-3 gap-1 overflow-y-auto rounded-xl border border-[#E1EAF3] bg-[#F8FAFC] p-2">

                  {Array.from(
                    { length: 24 },
                    (_, i) => pad(i)
                  ).map((h) => (
                    <button
                      key={h}
                      type="button"
                      onClick={() =>
                        setHoraTemporaria(
                          `${h}:${minuto}`
                        )
                      }
                      className={`h-9 rounded-lg text-xs transition ${
                        hora === h
                          ? "bg-[#1D438F] font-bold text-white"
                          : "text-[#101C4A] hover:bg-[#EAF2FC]"
                      }`}
                    >
                      {h}
                    </button>
                  ))}

                </div>
              </div>

              {/* MINUTOS */}

              <div>
                <p className="mb-2 text-center text-xs font-semibold text-[#24477F]">
                  Minuto
                </p>

                <div className="grid max-h-[160px] grid-cols-3 gap-1 overflow-y-auto rounded-xl border border-[#E1EAF3] bg-[#F8FAFC] p-2">

                  {Array.from(
                    { length: 60 },
                    (_, i) => pad(i)
                  ).map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() =>
                        setHoraTemporaria(
                          `${hora}:${m}`
                        )
                      }
                      className={`h-9 rounded-lg text-xs transition ${
                        minuto === m
                          ? "bg-[#1D438F] font-bold text-white"
                          : "text-[#101C4A] hover:bg-[#EAF2FC]"
                      }`}
                    >
                      {m}
                    </button>
                  ))}

                </div>
              </div>

            </div>

            {/* HORÁRIO SELECIONADO */}

            <div className="mt-3 rounded-xl bg-[#EEF4FA] py-3 text-center">

              <span className="text-xs font-medium text-slate-500">
                Horário selecionado
              </span>

              <p className="mt-1 text-xl font-bold text-[#1D438F]">
                {horaTemporaria}
              </p>

            </div>

            {/* RODAPÉ */}

            <div className="mt-4 flex items-center justify-between border-t border-[#DCE5EF] pt-3">

              <button
                type="button"
                onClick={limpar}
                className="text-xs font-semibold text-slate-500 transition hover:text-red-600"
              >
                Limpar horário
              </button>

              <button
                type="button"
                onClick={confirmar}
                className="flex items-center gap-1.5 rounded-lg bg-[#1D438F] px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-[#153572]"
              >
                <Check size={14} />
                Confirmar
              </button>

            </div>

          </div>
        </>
      )}
    </div>
  );
}

/* =========================
   PÁGINA PRINCIPAL
========================= */

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

  /* CARREGAR EXAMES */

  const carregarExames = useCallback(async () => {
    setCarregando(true);
    setErro("");

    try {
      const resposta = await api("/api/exames");

      const lista = Array.isArray(resposta)
        ? resposta
        : resposta?.exames || [];

      setExames(lista);

      setSelecionadoId((atual) => {
        if (
          atual &&
          lista.some(
            (item) => Number(item.id) === Number(atual)
          )
        ) {
          return atual;
        }

        return lista[0]?.id ?? null;
      });
    } catch (e) {
      setErro(
        e.message || "Não foi possível carregar os exames."
      );
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => {
    carregarExames();
  }, [carregarExames]);

  /* INDICADORES */

  const pendentes = useMemo(
    () => exames.filter(
      (item) => item.status === "solicitado"
    ),
    [exames]
  );

  const selecionado =
    exames.find(
      (item) =>
        Number(item.id) === Number(selecionadoId)
    ) || null;

  useEffect(() => {
    setDataAgendada(
      selecionado?.data_agendada
        ? dataHoraLocal(selecionado.data_agendada)
        : ""
    );

    setErro("");
  }, [selecionadoId, selecionado?.data_agendada]);

  const listaBase =
    aba === "pendentes" ? pendentes : exames;

  const filtrados = useMemo(() => {
    const termo = busca.trim().toLocaleLowerCase("pt-BR");

    if (!termo) return listaBase;

    return listaBase.filter((item) =>
      [
        item.paciente,
        item.medico,
        item.unidade,
        item.tipo_exame,
        item.paciente_id,
        item.id,
        item.observacoes,
      ].some((valor) =>
        String(valor ?? "")
          .toLocaleLowerCase("pt-BR")
          .includes(termo)
      )
    );
  }, [listaBase, busca]);

  const indicadores = useMemo(
    () => ({
      pendentes: exames.filter(
        (item) => item.status === "solicitado"
      ).length,

      agendados: exames.filter(
        (item) => item.status === "agendado"
      ).length,

      andamento: exames.filter(
        (item) => item.status === "em_andamento"
      ).length,

      concluidos: exames.filter(
        (item) => item.status === "concluido"
      ).length,
    }),
    [exames]
  );

  /* CONTROLE DA DATA E HORÁRIO */

  const dataSelecionada = dataAgendada.slice(0, 10);

  const horarioSelecionado = dataAgendada.slice(11, 16);

  function alterarData(data) {
    setDataAgendada((atual) => {
      if (!data) return "";

      const horario = atual.slice(11, 16) || "09:00";

      return `${data}T${horario}`;
    });

    setErro("");
  }

  function alterarHorario(horario) {
    setDataAgendada((atual) => {
      const data = atual.slice(0, 10);

      if (!data || !horario) return "";

      return `${data}T${horario}`;
    });

    setErro("");
  }

  /* SALVAR AGENDAMENTO */

  async function salvarAgendamento(event) {
    event.preventDefault();

    if (!selecionado) return;

    if (
      !dataAgendada ||
      !dataAgendada.slice(11, 16)
    ) {
      setErro("Informe a data e o horário do exame.");
      return;
    }

    const [ano, mes, dia] = dataAgendada
      .slice(0, 10)
      .split("-")
      .map(Number);

    const [hora, minuto] = dataAgendada
      .slice(11, 16)
      .split(":")
      .map(Number);

    const dataEscolhida = new Date(
      ano,
      mes - 1,
      dia,
      hora,
      minuto
    );

    if (dataEscolhida <= new Date()) {
      setErro(
        "O agendamento precisa ser em uma data e horário futuros."
      );
      return;
    }

    if (
      !["solicitado", "agendado"].includes(
        selecionado.status
      )
    ) {
      setErro(
        "Este exame não pode mais ter o agendamento alterado."
      );
      return;
    }

    setSalvando(true);
    setErro("");
    setAviso("");

    try {
      await api(
        `/api/exames/${selecionado.id}/agendamento`,
        {
          method: "PATCH",
          body: JSON.stringify({
            data_agendada: dataAgendada,
          }),
        }
      );

      setAviso("Agendamento registrado com sucesso.");

      await carregarExames();

      setAba("todos");
    } catch (e) {
      setErro(
        e.message ||
        "Não foi possível registrar o agendamento."
      );
    } finally {
      setSalvando(false);
    }
  }

  /* =========================
     RENDERIZAÇÃO
  ========================= */

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#EEF5F9] px-4 py-6 font-sans text-[#0B1756] sm:px-6 lg:px-8">

      <div className="pointer-events-none absolute -left-40 top-64 h-96 w-96 rounded-full bg-[#D9EAF8]/70" />

      <div className="pointer-events-none absolute -right-48 top-24 h-[34rem] w-[34rem] rounded-full bg-[#D3E5F7]/70" />

      <div className="pointer-events-none absolute right-[12%] top-[1050px] h-56 w-56 rounded-full border-[42px] border-white/80" />

      <div className="relative z-10 mx-auto max-w-[1500px] space-y-5">

        {/* CABEÇALHO */}

        <header className="relative isolate overflow-hidden rounded-[30px] bg-gradient-to-br from-[#174693] via-[#234E96] to-[#151A67] px-6 py-8 text-white shadow-[0_20px_55px_rgba(2,62,138,0.16)] sm:px-9 lg:px-10">

          <div className="pointer-events-none absolute -right-16 -top-36 h-96 w-96 rounded-full border-[48px] border-white/[0.07]" />

          <div className="pointer-events-none absolute right-[28%] top-10 h-52 w-52 rounded-full border-[30px] border-white/[0.05]" />

          <div className="pointer-events-none absolute -bottom-32 left-[38%] h-64 w-64 rounded-full bg-[#78A9E6]/10 blur-2xl" />

          <div className="relative flex flex-col justify-between gap-6 lg:flex-row lg:items-end">

            <div className="max-w-3xl">

              <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-semibold text-blue-50">
                ADMINISTRAÇÃO · GESTÃO DE EXAMES
              </div>

              <h1 className="mt-4 text-3xl font-bold leading-tight sm:text-4xl">
                Análise de prontuários e exames
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-blue-100 sm:text-base">
                Consulte os pedidos de exames registrados, confira as informações disponíveis e organize o agendamento.
              </p>

            </div>

          </div>
        </header>

        {/* AVISO */}

        <div className="rounded-2xl border border-blue-200 bg-blue-50/90 px-4 py-3 text-sm font-normal leading-6 text-[#0B1756]">
          <strong className="font-semibold">
            Importante:
          </strong>{" "}
          esta tela exibe os pedidos registrados no sistema. Os dados clínicos completos do prontuário não são retornados pela API administrativa de exames; a decisão clínica deve permanecer sob responsabilidade do profissional habilitado.
        </div>

        {/* INDICADORES */}

        <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">

          <MetricCard
            label="Pedidos aguardando agendamento"
            value={indicadores.pendentes}
          />

          <MetricCard
            label="Exames agendados"
            value={indicadores.agendados}
          />

          <MetricCard
            label="Em andamento"
            value={indicadores.andamento}
          />

          <MetricCard
            label="Concluídos"
            value={indicadores.concluidos}
          />

        </section>

        {/* ABAS */}

        <section className="overflow-hidden rounded-[22px] border border-[#DCE8F3] bg-white shadow-[0_12px_36px_rgba(2,62,138,0.07)]">

          <div className="grid grid-cols-2 gap-2 p-2 sm:p-3">

            <TabButton
              active={aba === "pendentes"}
              onClick={() => setAba("pendentes")}
            >
              Pedidos aguardando agendamento ({indicadores.pendentes})
            </TabButton>

            <TabButton
              active={aba === "todos"}
              onClick={() => setAba("todos")}
            >
              Todos os exames ({exames.length})
            </TabButton>

          </div>

        </section>

        {/* MENSAGENS */}

        {aviso && (
          <div className="flex items-start justify-between gap-4 rounded-2xl border border-[#C9DDF0] bg-[#EAF3F7] px-4 py-3 text-sm text-[#0B1756]">

            <p className="flex-1">{aviso}</p>

            <button
              type="button"
              onClick={() => setAviso("")}
              className="rounded-lg px-2 py-1 text-xs font-semibold text-[#3563A7] hover:bg-white"
            >
              Fechar
            </button>

          </div>
        )}

        {erro && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {erro}
          </div>
        )}

        {/* LISTAGEM */}

        <section className="overflow-hidden rounded-[22px] border border-[#DCE8F3] bg-white shadow-sm">

          <div className="border-b border-slate-100 p-4 sm:p-5">

            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

              <div>
                <h2 className="text-xl font-bold sm:text-2xl">
                  {aba === "pendentes"
                    ? "Pedidos de exames recebidos"
                    : "Exames registrados"}
                </h2>

                <p className="mt-1 text-sm font-normal text-slate-500">
                  Selecione um registro para consultar os dados e, quando permitido, agendar.
                </p>
              </div>

              <div className="flex w-full gap-2 lg:max-w-[520px]">

                <input
                  value={busca}
                  onChange={(event) =>
                    setBusca(event.target.value)
                  }
                  placeholder="Buscar paciente, CPF, exame ou unidade"
                  className="h-11 min-w-0 flex-1 rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none focus:border-[#3563A7]"
                />

                <button
                  type="button"
                  onClick={carregarExames}
                  disabled={carregando}
                  className="rounded-xl border border-slate-200 px-4 text-xs font-semibold text-[#3563A7] hover:bg-[#EAF3F7] disabled:opacity-50"
                >
                  {carregando ? "Atualizando" : "Atualizar"}
                </button>

              </div>

            </div>

          </div>

          {carregando ? (
            <div className="p-8 text-center text-sm text-slate-500">
              Carregando registros do sistema...
            </div>
          ) : filtrados.length === 0 ? (
            <div className="p-4">
              <EmptyState
                title="Nenhum pedido encontrado"
                description={
                  aba === "pendentes"
                    ? "Não há exames aguardando agendamento no momento."
                    : "Não existem exames registrados ou a busca não encontrou resultados."
                }
              />
            </div>
          ) : (
            <>

              <div className="grid gap-2 border-b border-slate-100 p-3 sm:grid-cols-2 xl:grid-cols-4">

                {filtrados.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setSelecionadoId(item.id)}
                    className={`min-h-[118px] rounded-xl border p-3 text-left transition ${
                      Number(selecionadoId) === Number(item.id)
                        ? "border-[#3563A7] bg-[#EAF3F7] ring-2 ring-[#3563A7]/10"
                        : "border-slate-100 bg-white hover:border-[#3563A7] hover:bg-[#F8FBFD]"
                    }`}
                  >

                    <div className="flex items-start gap-2.5">

                      <Avatar
                        name={item.paciente || "Paciente"}
                      />

                      <span className="min-w-0 flex-1">

                        <span className="block text-sm font-semibold leading-5">
                          {item.paciente ||
                            `Paciente #${item.paciente_id}`}
                        </span>

                        <span className="mt-1 block text-xs text-slate-500">
                          Pedido #{item.id}
                        </span>

                      </span>

                    </div>

                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <StatusBadge status={item.status} />
                    </div>

                    <span className="mt-2 block line-clamp-2 text-xs leading-5 text-slate-600">
                      {item.tipo_exame}
                    </span>

                  </button>
                ))}

              </div>

              <div className="bg-[#EEF5F9] px-4 py-3 text-xs text-slate-500">
                {filtrados.length} registro(s) exibido(s) · Dados carregados do banco de dados
              </div>

            </>
          )}

        </section>

        {/* DETALHES E AGENDAMENTO */}

        {selecionado && (
          <section className="overflow-hidden rounded-[22px] border border-[#DCE8F3] bg-white shadow-sm">

            {/* IDENTIFICAÇÃO */}

            <div className="flex flex-col gap-3 border-b border-slate-100 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">

              <div className="flex min-w-0 items-center gap-3">

                <Avatar
                  name={selecionado.paciente || "Paciente"}
                  large
                />

                <div className="min-w-0">

                  <h2 className="text-lg font-bold sm:text-xl">
                    {selecionado.paciente ||
                      `Paciente #${selecionado.paciente_id}`}
                  </h2>

                  <p className="mt-1 text-xs text-slate-500">
                    Pedido de exame #{selecionado.id} · Paciente ID {selecionado.paciente_id}
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    Solicitante: {selecionado.medico || "Não informado"}
                  </p>

                </div>

              </div>

              <StatusBadge status={selecionado.status} />

            </div>

            {/* INFORMAÇÕES */}

            <div className="grid gap-3 p-4 sm:grid-cols-2 sm:p-5">

              <InfoBlock title="Exame solicitado">
                {selecionado.tipo_exame || "Não informado"}
              </InfoBlock>

              <InfoBlock title="Unidade responsável">
                {selecionado.unidade || "Não informada"}
              </InfoBlock>

              <InfoBlock title="Observações do pedido">
                {selecionado.observacoes ||
                  "Nenhuma observação registrada no pedido."}
              </InfoBlock>

              <InfoBlock title="Consulta vinculada">
                {selecionado.consulta_id
                  ? `Consulta #${selecionado.consulta_id}`
                  : "Nenhuma consulta vinculada"}
              </InfoBlock>

              <InfoBlock title="Data da solicitação">
                {formatarDataHora(selecionado.criado_em)}
              </InfoBlock>

              <InfoBlock title="Data agendada">
                {formatarDataHora(selecionado.data_agendada)}
              </InfoBlock>

              {selecionado.resultado && (
                <div className="sm:col-span-2">
                  <InfoBlock title="Resultado registrado">
                    {selecionado.resultado}
                  </InfoBlock>
                </div>
              )}

            </div>

            {/* FORMULÁRIO DE AGENDAMENTO */}

            <form
              onSubmit={salvarAgendamento}
              className="border-t border-slate-100 p-4 sm:p-5"
            >

              <div>

                <h2 className="text-xl font-bold sm:text-2xl">
                  Agendamento do exame
                </h2>

                <p className="mt-1 text-sm leading-5 text-slate-500">
                  Registre a data e o horário confirmados pela unidade responsável.
                </p>

              </div>

              {["solicitado", "agendado"].includes(
                selecionado.status
              ) ? (
                <>

                  <div className="mt-4 grid gap-4 md:grid-cols-2">

                    {/* DATA E HORÁRIO */}

                    <div>

                      <label className="mb-2 block text-xs font-semibold">
                        Data e horário{" "}
                        <span className="text-red-500">*</span>
                      </label>

                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_135px]">

                        {/* CALENDÁRIO */}

                        <DatePicker
                          valor={dataSelecionada}
                          onChange={alterarData}
                        />

                        {/* HORÁRIO */}

                        <TimePicker
                          valor={horarioSelecionado}
                          onChange={alterarHorario}
                        />

                      </div>

                    </div>

                    {/* INFORMAÇÃO DA UNIDADE */}

                    <div className="flex items-end">

                      <p className="w-full rounded-xl border border-blue-100 bg-blue-50/70 p-3 text-xs leading-5 text-slate-600">
                        A unidade já está vinculada ao pedido original. A API atual não oferece alteração administrativa da unidade nem registro de prioridade.
                      </p>

                    </div>

                  </div>

                  {/* BOTÃO */}

                  <div className="mt-5 flex justify-end border-t border-slate-100 pt-4">

                    <button
                      type="submit"
                      disabled={salvando}
                      className="rounded-xl bg-[#023E8A] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#0B1756] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {salvando
                        ? "Salvando..."
                        : selecionado.status === "agendado"
                          ? "Atualizar agendamento"
                          : "Confirmar agendamento"}
                    </button>

                  </div>

                </>
              ) : (

                <p className="mt-4 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
                  Este exame está com status “{statusLabel(selecionado.status)}” e não pode ser agendado ou alterado por esta tela.
                </p>

              )}

            </form>

          </section>
        )}

      </div>
    </main>
  );
}
