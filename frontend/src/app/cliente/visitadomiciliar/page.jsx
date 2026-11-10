"use client";

import { useEffect, useState } from "react";

/* =========================
   DADOS DEMONSTRATIVOS
   (trocar por chamadas à API quando o back estiver pronto)
========================= */

const HOJE = "2026-10-27";

// Paciente logado: só as visitas dele aparecem nesta tela
const PACIENTE = {
  nome: "Maria Silva",
  cns: "898001234567890",
  telefone: "(11) 91234-5678",
  cep: "09010-000",
  rua: "Rua das Flores",
  numero: "120",
  bairro: "Centro",
};

const visitasIniciais = [
  {
    id: 1,
    motivo: "Dificuldade de locomoção",
    tipo: "Acompanhamento domiciliar",
    data: "2026-10-30",
    horario: "09:00",
    status: "Aguardando correção",
    profissional: "Não definido",
    solicitante: { tipo: "familiar", nome: "Paulo Silva", parentesco: "Filho(a)" },
    contatoAlt: { nome: "", telefone: "" },
    endereco: { cep: "09010-000", rua: "Rua das Flores", numero: "120", bairro: "Centro" },
    mensagemCorrecao:
      "Não foi informado um contato alternativo. Informe nome e telefone de outra pessoa para o caso de não conseguirmos falar com a senhora.",
    historico: [
      "Solicitação enviada por Paulo Silva (filho)",
      "Equipe identificou falta de contato alternativo e devolveu para correção",
    ],
  },
  {
    id: 2,
    motivo: "Avaliação de pressão e medicação",
    tipo: "Avaliação clínica",
    data: "2026-11-04",
    horario: "10:30",
    status: "Agendada",
    profissional: "Carlos Mendes",
    solicitante: { tipo: "proprio" },
    contatoAlt: { nome: "Paulo Silva", telefone: "(11) 98888-0000" },
    endereco: { cep: "09010-000", rua: "Rua das Flores", numero: "120", bairro: "Centro" },
    mensagemCorrecao: "",
    historico: ["Solicitação enviada", "Solicitação aprovada", "Visita agendada com Carlos Mendes"],
  },
  {
    id: 3,
    motivo: "Curativo no tornozelo",
    tipo: "Curativo",
    data: "2026-10-15",
    horario: "14:00",
    status: "Concluída",
    profissional: "Juliana Ribeiro",
    solicitante: { tipo: "proprio" },
    contatoAlt: { nome: "Paulo Silva", telefone: "(11) 98888-0000" },
    endereco: { cep: "09010-000", rua: "Rua das Flores", numero: "120", bairro: "Centro" },
    mensagemCorrecao: "",
    historico: ["Solicitação enviada", "Visita agendada", "Visita concluída"],
  },
];

const TIPOS = [
  { valor: "Visita preventiva", desc: "Acompanhamento de rotina da saúde" },
  { valor: "Acompanhamento domiciliar", desc: "Para quem tem dificuldade de sair de casa" },
  { valor: "Curativo", desc: "Troca ou avaliação de curativos e feridas" },
  { valor: "Avaliação clínica", desc: "Avaliação com médico ou enfermeiro" },
];

const PARENTESCOS = ["Filho(a)", "Cônjuge", "Neto(a)", "Irmão(ã)", "Cuidador(a)", "Vizinho(a)", "Outro"];

const inputCls =
  "w-full rounded-2xl border border-[#C8D8EC] bg-white px-4 py-3 text-sm text-[#0B1756] outline-none transition placeholder:text-slate-400 hover:border-[#3563A7]/70 focus:border-[#023E8A] focus:ring-4 focus:ring-[#3563A7]/15";

/* =========================
   MÁSCARAS E VALIDAÇÕES
========================= */

const soDigitos = (s) => (s || "").replace(/\D/g, "");

const mascaraTelefone = (v) => {
  const d = soDigitos(v).slice(0, 11);
  if (d.length <= 2) return d ? `(${d}` : "";
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
};

const mascaraCEP = (v) => {
  const d = soDigitos(v).slice(0, 8);
  return d.length > 5 ? `${d.slice(0, 5)}-${d.slice(5)}` : d;
};

function formatarData(data) {
  if (!data) return "Data não definida";
  const [a, m, d] = data.split("-");
  return `${d}/${m}/${a}`;
}

function diaDaSemana(data) {
  return new Date(`${data}T12:00:00`).getDay();
}

const telefoneValido = (v) => {
  const d = soDigitos(v);
  if (d.length !== 10 && d.length !== 11) return false;
  if (Number(d.slice(0, 2)) < 11) return false; // DDD inválido
  return d.length === 10 || d[2] === "9"; // celular começa com 9
};

const nomeCompleto = (v) => (v || "").trim().split(/\s+/).filter((p) => p.length > 1).length >= 2;

function validar(f) {
  const e = {};

  if (f.solicitanteTipo === "familiar") {
    if (!nomeCompleto(f.solNome)) e.solNome = "Informe o nome e sobrenome de quem está solicitando.";
    if (!f.parentesco) e.parentesco = "Selecione a relação com o paciente.";
  }

  if (!telefoneValido(f.telefone)) e.telefone = "Informe um telefone válido com DDD. Ex.: (11) 91234-5678.";

  if (!nomeCompleto(f.altNome)) e.altNome = "Informe o nome do contato alternativo.";
  if (!telefoneValido(f.altTelefone)) e.altTelefone = "Informe um telefone válido com DDD.";
  else if (soDigitos(f.altTelefone) === soDigitos(f.telefone))
    e.altTelefone = "O contato alternativo deve ser diferente do telefone do paciente.";

  if (soDigitos(f.cep).length !== 8) e.cep = "O CEP deve ter 8 números.";
  if (f.rua.trim().length < 3) e.rua = "Informe o nome da rua ou avenida.";
  if (!f.semNumero && !/^\d+[A-Za-z]?$/.test(f.numero.trim()))
    e.numero = "Informe o número da residência ou marque “Sem número”.";
  if (f.bairro.trim().length < 2) e.bairro = "Informe o bairro.";

  if (!f.tipo) e.tipo = "Escolha o tipo de atendimento.";
  if (f.motivo.trim().length < 10) e.motivo = "Descreva o motivo com um pouco mais de detalhe (mínimo 10 letras).";

  if (!f.data) e.data = "Escolha uma data.";
  else if (f.data <= HOJE) e.data = "Escolha uma data a partir de amanhã.";
  else if ([0, 6].includes(diaDaSemana(f.data))) e.data = "A unidade realiza visitas de segunda a sexta.";

  if (!f.horario) e.horario = "Escolha um horário.";
  else if (f.horario < "08:00" || f.horario > "16:00") e.horario = "Escolha um horário entre 08:00 e 16:00.";

  return e;
}

function formDaVisita(v) {
  const familiar = v?.solicitante?.tipo === "familiar";
  const end = v?.endereco || PACIENTE;
  return {
    solicitanteTipo: familiar ? "familiar" : "proprio",
    solNome: v?.solicitante?.nome || "",
    parentesco: v?.solicitante?.parentesco || "",
    telefone: PACIENTE.telefone,
    altNome: v?.contatoAlt?.nome || "",
    altTelefone: v?.contatoAlt?.telefone || "",
    cep: end.cep,
    rua: end.rua,
    numero: end.numero === "s/n" ? "" : end.numero,
    semNumero: end.numero === "s/n",
    bairro: end.bairro,
    tipo: v?.tipo || "",
    motivo: v?.motivo || "",
    data: v?.data || "",
    horario: v?.horario || "",
  };
}

/* =========================
   COMPONENTES VISUAIS
========================= */

const ESTILO_STATUS = {
  Recebida: ["#EAF3F7", "#000000"],
  "Aguardando correção": ["#3563A7", "#FFFFFF"],
  "Em análise": ["#EAF3F7", "#000000"],
  Agendada: ["#3563A7", "#FFFFFF"],
  "Em atendimento": ["#023E8A", "#FFFFFF"],
  Concluída: ["#023E8A", "#FFFFFF"],
  Cancelada: ["#EAF3F7", "#000000"],
};

function Badge({ status }) {
  const [fundo, texto] = ESTILO_STATUS[status] || ESTILO_STATUS.Recebida;
  return (
    <span
      className="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold"
      style={{ backgroundColor: fundo, color: texto }}
    >
      {status}
    </span>
  );
}

function Campo({ label, erro, children, className = "" }) {
  return (
    <div className={className}>
      <label className="mb-1.5 block text-xs font-semibold text-slate-600">{label}</label>
      {children}
      {erro && (
        <p role="alert" className="mt-1.5 text-xs font-medium text-rose-600">
          {erro}
        </p>
      )}
    </div>
  );
}

function Modal({ children, onClose, largo = false }) {
  useEffect(() => {
    const fechar = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", fechar);
    return () => window.removeEventListener("keydown", fechar);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#0B1756]/40 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        className={`max-h-[92vh] w-full overflow-y-auto rounded-2xl bg-white p-6 shadow-xl ${
          largo ? "max-w-2xl" : "max-w-md"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}

function CabecalhoModal({ titulo, subtitulo, onClose }) {
  return (
    <div className="mb-5 flex items-start justify-between border-b border-slate-100 pb-4">
      <div>
        <h3 className="text-lg font-bold text-[#0B1756]">{titulo}</h3>
        {subtitulo && <p className="mt-1 text-sm text-slate-500">{subtitulo}</p>}
      </div>
      <button
        type="button"
        onClick={onClose}
        aria-label="Fechar"
        className="rounded-lg p-2 text-xl font-semibold text-slate-500 hover:bg-[#EAF3F7]"
      >
        ×
      </button>
    </div>
  );
}

/* =========================
   FORMULÁRIO (nova solicitação e correção)
========================= */

function FormularioVisita({ inicial, modoCorrecao, onEnviar, onCancelar }) {
  const [f, setF] = useState(inicial);
  const [tocados, setTocados] = useState({});
  const [tentou, setTentou] = useState(false);

  const erros = validar(f);
  const set = (campo, valor) => setF((atual) => ({ ...atual, [campo]: valor }));
  const tocar = (campo) => setTocados((t) => ({ ...t, [campo]: true }));
  const erro = (campo) => (tentou || tocados[campo] ? erros[campo] : undefined);

  const props = (campo, mascara) => ({
    value: f[campo],
    onChange: (e) => set(campo, mascara ? mascara(e.target.value) : e.target.value),
    onBlur: () => tocar(campo),
    className: `${inputCls} ${erro(campo) ? "!border-rose-400" : ""}`,
    "aria-invalid": Boolean(erro(campo)),
  });

  function enviar(e) {
    e.preventDefault();
    setTentou(true);
    if (Object.keys(erros).length) {
      const primeiro = Object.keys(erros)[0];
      document.querySelector(`[data-campo="${primeiro}"]`)?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    onEnviar(f);
  }

  return (
    <form onSubmit={enviar} noValidate className="space-y-6">
      {/* Quem solicita */}
      <fieldset>
        <legend className="mb-2 text-sm font-bold text-[#0B1756]">Quem está fazendo a solicitação?</legend>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {[
            ["proprio", "Eu mesmo (paciente)"],
            ["familiar", "Familiar ou ajudante"],
          ].map(([valor, rotulo]) => (
            <label
              key={valor}
              className={`flex cursor-pointer items-center gap-3 rounded-2xl border px-4 py-3 text-sm font-semibold transition ${
                f.solicitanteTipo === valor
                  ? "border-[#023E8A] bg-[#EAF3F7] text-[#0B1756]"
                  : "border-[#C8D8EC] text-slate-600 hover:border-[#3563A7]"
              }`}
            >
              <input
                type="radio"
                name="solicitante"
                checked={f.solicitanteTipo === valor}
                onChange={() => set("solicitanteTipo", valor)}
                className="accent-[#023E8A]"
              />
              {rotulo}
            </label>
          ))}
        </div>

        {f.solicitanteTipo === "familiar" && (
          <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Campo label="Seu nome completo" erro={erro("solNome")}>
              <input data-campo="solNome" placeholder="Nome e sobrenome" {...props("solNome")} />
            </Campo>
            <Campo label="Sua relação com o paciente" erro={erro("parentesco")}>
              <select data-campo="parentesco" {...props("parentesco")}>
                <option value="">Selecione</option>
                {PARENTESCOS.map((p) => (
                  <option key={p}>{p}</option>
                ))}
              </select>
            </Campo>
          </div>
        )}
      </fieldset>

      {/* Paciente e contatos */}
      <fieldset>
        <legend className="mb-2 text-sm font-bold text-[#0B1756]">Paciente e contatos</legend>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Campo label="Paciente">
            <input value={PACIENTE.nome} readOnly className={`${inputCls} bg-slate-50`} />
          </Campo>
          <Campo label="Cartão Nacional de Saúde (CNS)">
            <input value={PACIENTE.cns} readOnly className={`${inputCls} bg-slate-50`} />
          </Campo>
          <Campo label="Telefone do paciente" erro={erro("telefone")}>
            <input data-campo="telefone" inputMode="tel" placeholder="(11) 91234-5678" {...props("telefone", mascaraTelefone)} />
          </Campo>
          <div className="hidden sm:block" />
          <Campo label="Contato alternativo (nome)" erro={erro("altNome")}>
            <input data-campo="altNome" placeholder="Outra pessoa que possamos ligar" {...props("altNome")} />
          </Campo>
          <Campo label="Contato alternativo (telefone)" erro={erro("altTelefone")}>
            <input data-campo="altTelefone" inputMode="tel" placeholder="(11) 90000-0000" {...props("altTelefone", mascaraTelefone)} />
          </Campo>
        </div>
      </fieldset>

      {/* Endereço */}
      <fieldset>
        <legend className="mb-2 text-sm font-bold text-[#0B1756]">Endereço da visita</legend>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-6">
          <Campo label="CEP" erro={erro("cep")} className="sm:col-span-2">
            <input data-campo="cep" inputMode="numeric" placeholder="00000-000" {...props("cep", mascaraCEP)} />
          </Campo>
          <Campo label="Rua ou avenida" erro={erro("rua")} className="sm:col-span-4">
            <input data-campo="rua" placeholder="Nome da rua" {...props("rua")} />
          </Campo>
          <Campo label="Número" erro={erro("numero")} className="sm:col-span-2">
            <input
              data-campo="numero"
              placeholder="Ex.: 120"
              disabled={f.semNumero}
              {...props("numero")}
              className={`${props("numero").className} disabled:bg-slate-50 disabled:text-slate-400`}
            />
            <label className="mt-2 flex items-center gap-2 text-xs text-slate-600">
              <input
                type="checkbox"
                checked={f.semNumero}
                onChange={(e) => setF((a) => ({ ...a, semNumero: e.target.checked, numero: "" }))}
                className="accent-[#023E8A]"
              />
              Sem número
            </label>
          </Campo>
          <Campo label="Bairro" erro={erro("bairro")} className="sm:col-span-4">
            <input data-campo="bairro" placeholder="Bairro" {...props("bairro")} />
          </Campo>
        </div>
      </fieldset>

      {/* Atendimento */}
      <fieldset>
        <legend className="mb-2 text-sm font-bold text-[#0B1756]">Sobre a visita</legend>

        <div data-campo="tipo" className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {TIPOS.map((t) => (
            <label
              key={t.valor}
              className={`cursor-pointer rounded-2xl border px-4 py-3 transition ${
                f.tipo === t.valor
                  ? "border-[#023E8A] bg-[#EAF3F7]"
                  : "border-[#C8D8EC] hover:border-[#3563A7]"
              }`}
            >
              <input
                type="radio"
                name="tipo"
                checked={f.tipo === t.valor}
                onChange={() => set("tipo", t.valor)}
                className="sr-only"
              />
              <span className="block text-sm font-semibold text-[#0B1756]">{t.valor}</span>
              <span className="mt-0.5 block text-xs text-slate-500">{t.desc}</span>
            </label>
          ))}
        </div>
        {erro("tipo") && <p className="mt-1.5 text-xs font-medium text-rose-600">{erro("tipo")}</p>}

        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Campo label="Motivo da visita" erro={erro("motivo")} className="sm:col-span-2">
            <textarea
              data-campo="motivo"
              rows={3}
              placeholder="Conte o que está acontecendo e do que o paciente precisa"
              {...props("motivo")}
            />
          </Campo>
          <Campo label="Data desejada" erro={erro("data")}>
            <input data-campo="data" type="date" min="2026-10-28" {...props("data")} />
          </Campo>
          <Campo label="Horário desejado (08:00 às 16:00)" erro={erro("horario")}>
            <input data-campo="horario" type="time" min="08:00" max="16:00" {...props("horario")} />
          </Campo>
        </div>
        <p className="mt-2 text-xs text-slate-500">
          A data e o horário são uma preferência. A equipe confirma o agendamento depois da análise.
        </p>
      </fieldset>

      <div className="flex flex-col-reverse gap-2 border-t border-slate-100 pt-4 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={onCancelar}
          className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50"
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="rounded-xl bg-[#023E8A] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#0B1756]"
        >
          {modoCorrecao ? "Reenviar solicitação" : "Enviar solicitação"}
        </button>
      </div>
    </form>
  );
}

/* =========================
   PÁGINA PRINCIPAL
========================= */

export default function MinhasVisitasPage() {
  const [visitas, setVisitas] = useState(visitasIniciais);
  const [filtro, setFiltro] = useState("ativas");
  const [modal, setModal] = useState(null); // {tipo: 'nova'|'corrigir'|'detalhe'|'cancelar', id}
  const [aviso, setAviso] = useState(null);

  const visitaModal = visitas.find((v) => v.id === modal?.id) || null;
  const pendentes = visitas.filter((v) => v.status === "Aguardando correção");
  const FINAIS = ["Concluída", "Cancelada"];

  const lista = visitas
    .filter((v) => (filtro === "ativas" ? !FINAIS.includes(v.status) : FINAIS.includes(v.status)))
    .sort((a, b) => `${a.data} ${a.horario}`.localeCompare(`${b.data} ${b.horario}`));

  function mostrarAviso(texto) {
    setAviso(texto);
    setTimeout(() => setAviso(null), 3500);
  }

  function montarRegistro(f) {
    return {
      tipo: f.tipo,
      motivo: f.motivo.trim(),
      data: f.data,
      horario: f.horario,
      solicitante:
        f.solicitanteTipo === "familiar"
          ? { tipo: "familiar", nome: f.solNome.trim(), parentesco: f.parentesco }
          : { tipo: "proprio" },
      contatoAlt: { nome: f.altNome.trim(), telefone: f.altTelefone },
      endereco: {
        cep: f.cep,
        rua: f.rua.trim(),
        numero: f.semNumero ? "s/n" : f.numero.trim(),
        bairro: f.bairro.trim(),
      },
    };
  }

  function enviarNova(f) {
    const reg = montarRegistro(f);
    const quem = reg.solicitante.tipo === "familiar" ? `${reg.solicitante.nome} (${reg.solicitante.parentesco.toLowerCase()})` : "o paciente";
    setVisitas((atuais) => [
      {
        ...reg,
        id: Math.max(0, ...atuais.map((v) => v.id)) + 1,
        status: "Recebida",
        profissional: "Não definido",
        mensagemCorrecao: "",
        historico: [`Solicitação enviada por ${quem}`, "Aguardando análise da equipe"],
      },
      ...atuais,
    ]);
    setFiltro("ativas");
    setModal(null);
    mostrarAviso("Solicitação enviada. Acompanhe o andamento aqui.");
  }

  function reenviar(f) {
    setVisitas((atuais) =>
      atuais.map((v) =>
        v.id === modal.id
          ? {
              ...v,
              ...montarRegistro(f),
              status: "Em análise",
              mensagemCorrecao: "",
              historico: [...v.historico, "Informações corrigidas e solicitação reenviada"],
            }
          : v
      )
    );
    setModal(null);
    mostrarAviso("Solicitação reenviada para análise.");
  }

  function cancelar() {
    setVisitas((atuais) =>
      atuais.map((v) =>
        v.id === modal.id ? { ...v, status: "Cancelada", historico: [...v.historico, "Visita cancelada pelo paciente"] } : v
      )
    );
    setModal(null);
    mostrarAviso("Visita cancelada.");
  }

  return (
    <div className="min-h-screen bg-[#EEF5F9] font-sans text-[#0B1756]">
      <div className="pointer-events-none fixed -right-36 -top-36 h-96 w-96 rounded-full border-[64px] border-[#D9E8FA]/60" />

      <main className="relative z-10 mx-auto w-full max-w-4xl space-y-6 px-4 py-7 sm:px-6">
        {/* CABEÇALHO */}
        <section className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-[#023E8A] via-[#084B9A] to-[#0B1756] px-7 py-8 shadow-[0_22px_60px_rgba(2,62,138,0.18)] sm:px-10">
          <div className="pointer-events-none absolute -right-24 -top-32 h-80 w-80 rounded-full bg-white/10" />
          <div className="relative z-10 flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
            <div>
              <p className="text-sm text-white/75">Olá, {PACIENTE.nome}</p>
              <h1 className="mt-1 text-3xl font-bold tracking-tight text-white sm:text-4xl">Minhas visitas domiciliares</h1>
              <p className="mt-2 max-w-xl text-sm leading-6 text-white/85">
                Peça uma visita da equipe de saúde em casa e acompanhe cada etapa por aqui.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setModal({ tipo: "nova" })}
              className="shrink-0 rounded-2xl bg-white px-5 py-3.5 text-sm font-semibold text-[#0B1756] shadow-sm transition hover:bg-[#EAF3F7]"
            >
              + Solicitar visita
            </button>
          </div>
        </section>

        {/* CORREÇÃO PENDENTE */}
        {pendentes.map((v) => (
          <section key={v.id} className="rounded-2xl border border-[#3563A7] bg-white p-5 shadow-sm">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <Badge status="Aguardando correção" />
                <h2 className="mt-3 text-lg font-bold text-[#0B1756]">Precisamos de uma correção na sua solicitação</h2>
                <p className="mt-1 text-sm text-slate-500">
                  {v.tipo} · {formatarData(v.data)} às {v.horario}
                </p>
                <p className="mt-3 rounded-xl bg-[#EAF3F7] p-3 text-sm leading-6 text-[#0B1756]">
                  <strong>Mensagem da equipe:</strong> {v.mensagemCorrecao}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setModal({ tipo: "corrigir", id: v.id })}
                className="shrink-0 rounded-xl bg-[#023E8A] px-5 py-3 text-sm font-semibold text-white hover:bg-[#0B1756]"
              >
                Corrigir agora
              </button>
            </div>
          </section>
        ))}

        {/* LISTA */}
        <section className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-2xl font-bold text-[#0B1756]">Suas solicitações</h2>
            <div className="flex rounded-xl bg-slate-100 p-1">
              {[
                ["ativas", "Em andamento"],
                ["historico", "Encerradas"],
              ].map(([val, rotulo]) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setFiltro(val)}
                  className={`rounded-lg px-4 py-2 text-xs font-semibold transition ${
                    filtro === val ? "bg-white text-[#17418E] shadow-sm" : "text-slate-500 hover:text-[#17418E]"
                  }`}
                >
                  {rotulo}
                </button>
              ))}
            </div>
          </div>

          {lista.length ? (
            <ul className="divide-y divide-slate-100">
              {lista.map((v) => (
                <li key={v.id} className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-lg font-semibold text-[#0B1756]">{v.tipo}</p>
                      <Badge status={v.status} />
                    </div>
                    <p className="mt-1 text-sm text-slate-600">{v.motivo}</p>
                    <p className="mt-1 text-sm text-slate-500">
                      {formatarData(v.data)} às {v.horario}
                      {v.profissional !== "Não definido" && ` · com ${v.profissional}`}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setModal({ tipo: "detalhe", id: v.id })}
                    className="shrink-0 rounded-lg border border-[#D5E0ED] px-4 py-2.5 text-sm font-semibold text-[#17418E] hover:bg-[#F2F6FB]"
                  >
                    Ver detalhes
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <div className="rounded-xl border border-dashed border-slate-200 px-4 py-10 text-center">
              <p className="text-sm font-medium text-slate-600">
                {filtro === "ativas" ? "Nenhuma solicitação em andamento" : "Nenhuma visita encerrada ainda"}
              </p>
              {filtro === "ativas" && (
                <button
                  type="button"
                  onClick={() => setModal({ tipo: "nova" })}
                  className="mt-3 text-sm font-semibold text-[#17418E] hover:underline"
                >
                  Solicitar uma visita
                </button>
              )}
            </div>
          )}
        </section>
      </main>

      {/* MODAIS */}
      {modal?.tipo === "nova" && (
        <Modal largo onClose={() => setModal(null)}>
          <CabecalhoModal
            titulo="Solicitar visita domiciliar"
            subtitulo="Preencha os dados abaixo. Quanto mais completo, mais rápido a equipe consegue agendar."
            onClose={() => setModal(null)}
          />
          <FormularioVisita inicial={formDaVisita(null)} onEnviar={enviarNova} onCancelar={() => setModal(null)} />
        </Modal>
      )}

      {modal?.tipo === "corrigir" && visitaModal && (
        <Modal largo onClose={() => setModal(null)}>
          <CabecalhoModal titulo="Corrigir solicitação" subtitulo="Ajuste as informações pedidas e reenvie." onClose={() => setModal(null)} />
          <p className="mb-5 rounded-xl bg-[#EAF3F7] p-3 text-sm leading-6 text-[#0B1756]">
            <strong>Mensagem da equipe:</strong> {visitaModal.mensagemCorrecao}
          </p>
          <FormularioVisita
            modoCorrecao
            inicial={formDaVisita(visitaModal)}
            onEnviar={reenviar}
            onCancelar={() => setModal(null)}
          />
        </Modal>
      )}

      {modal?.tipo === "detalhe" && visitaModal && (
        <Modal onClose={() => setModal(null)}>
          <CabecalhoModal titulo={visitaModal.tipo} subtitulo={`${formatarData(visitaModal.data)} às ${visitaModal.horario}`} onClose={() => setModal(null)} />
          <div className="space-y-5">
            <Badge status={visitaModal.status} />

            <div className="space-y-2 rounded-xl bg-slate-50 p-4 text-sm text-slate-600">
              <p><strong>Motivo:</strong> {visitaModal.motivo}</p>
              <p>
                <strong>Endereço:</strong> {visitaModal.endereco.rua}, {visitaModal.endereco.numero} · {visitaModal.endereco.bairro}
              </p>
              <p><strong>Profissional:</strong> {visitaModal.profissional === "Não definido" ? "A definir" : visitaModal.profissional}</p>
              {visitaModal.solicitante.tipo === "familiar" && (
                <p>
                  <strong>Solicitada por:</strong> {visitaModal.solicitante.nome} ({visitaModal.solicitante.parentesco})
                </p>
              )}
            </div>

            <div>
              <p className="mb-3 text-xs font-semibold text-slate-500">Andamento</p>
              <ol className="space-y-2 border-l-2 border-[#DCE8F8] pl-4 text-sm text-slate-600">
                {visitaModal.historico.map((h, i) => (
                  <li key={i}>{h}</li>
                ))}
              </ol>
            </div>

            {!FINAIS.includes(visitaModal.status) && (
              <div className="flex flex-col gap-2 border-t border-slate-100 pt-4 sm:flex-row sm:justify-end">
                {visitaModal.status === "Aguardando correção" && (
                  <button
                    type="button"
                    onClick={() => setModal({ tipo: "corrigir", id: visitaModal.id })}
                    className="rounded-xl bg-[#023E8A] px-5 py-3 text-sm font-semibold text-white hover:bg-[#0B1756]"
                  >
                    Corrigir solicitação
                  </button>
                )}
                {visitaModal.status !== "Em atendimento" && (
                  <button
                    type="button"
                    onClick={() => setModal({ tipo: "cancelar", id: visitaModal.id })}
                    className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50"
                  >
                    Cancelar visita
                  </button>
                )}
              </div>
            )}
          </div>
        </Modal>
      )}

      {modal?.tipo === "cancelar" && visitaModal && (
        <Modal onClose={() => setModal(null)}>
          <CabecalhoModal titulo="Cancelar esta visita?" onClose={() => setModal(null)} />
          <p className="text-sm leading-6 text-slate-600">
            A visita de {formatarData(visitaModal.data)} às {visitaModal.horario} será cancelada. Para voltar a receber
            atendimento, será preciso fazer uma nova solicitação.
          </p>
          <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={() => setModal({ tipo: "detalhe", id: visitaModal.id })}
              className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50"
            >
              Manter visita
            </button>
            <button
              type="button"
              onClick={cancelar}
              className="rounded-xl bg-[#0B1756] px-5 py-3 text-sm font-semibold text-white hover:bg-[#023E8A]"
            >
              Cancelar visita
            </button>
          </div>
        </Modal>
      )}

      {aviso && (
        <div
          role="status"
          className="fixed bottom-5 left-1/2 z-[60] -translate-x-1/2 rounded-xl bg-[#17418E] px-5 py-3 text-sm font-semibold text-white shadow-lg"
        >
          {aviso}
        </div>
      )}
    </div>
  );
}