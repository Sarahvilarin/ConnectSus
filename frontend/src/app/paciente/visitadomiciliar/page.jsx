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

// Use as MESMAS classes de largura/padding do container do seu header,
// assim logo e conteúdo da página ficam alinhados na mesma margem.
const CONTAINER = "mx-auto w-full max-w-[1550px] px-4 sm:px-6 2xl:px-14";

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

const MESES = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];

function BlocoData({ data }) {
  return (
    <div className="flex h-[76px] w-[76px] shrink-0 flex-col items-center justify-center rounded-[24px] bg-[#EAF3F7] text-[#0B1756]">
      <span className="text-3xl font-extrabold leading-none">
        {data.slice(8)}
      </span>

      <span className="mt-1 text-sm font-bold lowercase">
        {MESES[Number(data.slice(5, 7)) - 1]}
      </span>
    </div>
  );
}

function Chip({ children }) {
  return (
    <span className="inline-flex items-center rounded-full bg-[#EAF3F7] px-3 py-1 text-xs font-medium text-[#0B1756]">
      {children}
    </span>
  );
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
      <div className="pointer-events-none fixed -right-40 -top-24 h-[420px] w-[420px] rounded-full bg-[#DCE9FB]/70" />
      <div className="pointer-events-none fixed -left-24 top-24 h-80 w-80 rounded-full border border-[#C8D8EC]/70" />

      <main className={`relative z-10 py-8 ${CONTAINER}`}>
        {/* TOPO */}
        <section className="mb-6 flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-[#DCE9FB] px-3 py-1.5 text-xs font-bold text-[#0B1756]">
              <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 11.5 12 4l9 7.5" />
                <path d="M5 10v10h14V10" />
              </svg>
              Visita domiciliar
            </span>
            <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-[#0B1756] sm:text-4xl lg:text-[42px] lg:leading-tight">
              Minhas visitas
            </h1>
            <p className="mt-3 text-base leading-7 text-slate-600">
              Peça uma visita da equipe de saúde em casa e acompanhe cada etapa por aqui.
            </p>
          </div>

          <div className="flex max-w-md flex-col gap-3 lg:mt-10 lg:items-end">
            <button
              type="button"
              onClick={() => setModal({ tipo: "nova" })}
              className="rounded-2xl bg-[#023E8A] px-6 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#0B1756]"
            >
              + Solicitar visita
            </button>
          </div>
        </section>

        <div className="space-y-4">
          {/* INFORMAÇÕES DO PACIENTE */}
          <section className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <h2 className="text-lg font-bold text-[#0B1756]">Suas informações</h2>
            </div>
            <dl className="mt-3 grid grid-cols-1 gap-3 text-sm sm:grid-cols-2 lg:grid-cols-4">
              {[
                ["Paciente", PACIENTE.nome],
                ["CNS", PACIENTE.cns],
                ["Telefone", PACIENTE.telefone],
                ["Endereço", `${PACIENTE.rua}, ${PACIENTE.numero} · ${PACIENTE.bairro}`],
              ].map(([k, v]) => (
                <div key={k} className="rounded-xl bg-[#F4F8FC] px-4 py-3">
                  <dt className="text-xs font-semibold text-slate-500">{k}</dt>
                  <dd className="mt-1 font-medium text-[#0B1756]">{v}</dd>
                </div>
              ))}
            </dl>
          </section>

          {/* CORREÇÃO PENDENTE */}
          {pendentes.map((v) => (
            <section
              key={v.id}
              className="relative overflow-hidden rounded-2xl border border-[#3563A7]/40 bg-white p-5 pl-7 shadow-[0_10px_30px_rgba(2,62,138,0.10)] sm:p-6 sm:pl-8"
            >
              <span className="absolute inset-y-0 left-0 w-2 bg-gradient-to-b from-[#023E8A] to-[#3563A7]" />
              <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex gap-4">
                  <div className="min-w-0">
                    <Badge status="Aguardando correção" />
                    <h2 className="mt-2 text-xl font-bold text-[#0B1756]">Precisamos de uma correção na sua solicitação</h2>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <Chip>{v.tipo}</Chip>
                      <Chip>{formatarData(v.data)} às {v.horario}</Chip>
                    </div>
                    <blockquote className="mt-4 rounded-xl border-l-4 border-[#3563A7] bg-[#EAF3F7] px-4 py-3 text-sm leading-6 text-[#0B1756]">
                      <span className="mb-1 block text-xs font-bold text-[#3563A7]">Mensagem da equipe</span>
                      {v.mensagemCorrecao}
                    </blockquote>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setModal({ tipo: "corrigir", id: v.id })}
                  className="shrink-0 rounded-xl bg-[#023E8A] px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#0B1756]"
                >
                  Corrigir agora
                </button>
              </div>
            </section>
          ))}

          {/* LISTA */}
          <section className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm sm:p-6">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-2xl font-bold text-[#0B1756]">Suas solicitações</h2>
                <p className="mt-1 text-sm text-slate-500">
                  {lista.length} {lista.length === 1 ? "solicitação" : "solicitações"} nesta lista
                </p>
              </div>
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
              <ul className="space-y-3">
                {lista.map((v) => {
                  return (
                    <li
                      key={v.id}
                      className="group flex flex-col gap-4 rounded-2xl border border-[#E1EAF4] bg-[#FAFCFE] p-4 transition hover:border-[#3563A7]/50 hover:bg-white hover:shadow-md sm:flex-row sm:items-center"
                    >
                      <BlocoData data={v.data} />

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="text-lg font-bold text-[#0B1756]">{v.tipo}</p>
                          <Badge status={v.status} />
                        </div>
                        <p className="mt-1 text-sm text-slate-600">{v.motivo}</p>
                        <div className="mt-2 flex flex-wrap gap-2">
                          <Chip>Às {v.horario}</Chip>
                          <Chip>{v.profissional === "Não definido" ? "Profissional a definir" : v.profissional}</Chip>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => setModal({ tipo: "detalhe", id: v.id })}
                        className="shrink-0 rounded-xl border border-[#C8D8EC] bg-white px-5 py-2.5 text-sm font-semibold text-[#17418E] transition group-hover:border-[#023E8A] hover:bg-[#EAF3F7]"
                      >
                        Ver detalhes
                      </button>
                    </li>
                  );
                })}
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
        </div>
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