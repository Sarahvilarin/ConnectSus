

"use client";



import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import {

  Activity,

  AlertTriangle,

  CalendarDays,

  Check,

  ChevronDown,

  ChevronLeft,

  ChevronRight,

  Hospital,

  Mail,

  Pencil,

  Phone,

  Plane,

  Search,

  Stethoscope,

  Trash2,

  UserPlus,

  X,

  RefreshCw,

  Users,

  UserRoundCheck

} from "lucide-react";

import { api } from "@/lib/api";



const inputCls = "w-full rounded-2xl border border-[#C8D8EC] bg-white px-4 py-3 text-sm text-[#0B1756] outline-none transition placeholder:text-slate-400 focus:border-[#023E8A] focus:ring-4 focus:ring-[#3563A7]/15";



const btnPrimary = "inline-flex items-center justify-center gap-2 rounded-xl bg-[#023E8A] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#0B1756] disabled:opacity-50";



const btnSecondary = "inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50";



const emptyForm = {

  nome_completo: "",

  cpf: "",

  data_nascimento: "",

  email: "",

  telefone: "",

  crm: "",

  uf_crm: "SP",

  senha: "",

  especialidades: [],

  vinculos: []

};



const UFS = [

  "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES",

  "GO", "MA", "MT", "MS", "MG", "PA", "PB", "PR",

  "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC",

  "SP", "SE", "TO"

];



// Constantes do calendário

const nomesMeses = [

  "Janeiro", "Fevereiro", "Março", "Abril",

  "Maio", "Junho", "Julho", "Agosto",

  "Setembro", "Outubro", "Novembro", "Dezembro"

];



const nomesSemana = [

  "Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"

];



const pad = (n) => String(n).padStart(2, "0");



const paraIso = (ano, mes, dia) =>

  `${ano}-${pad(mes + 1)}-${pad(dia)}`;



const dataAtualISO = () => {

  const d = new Date();

  return paraIso(d.getFullYear(), d.getMonth(), d.getDate());

};



const formatarData = (iso) =>

  iso ? iso.split("-").reverse().join("/") : "";



function formatarNome(nome = "") {

  return nome.trim();

}



function iniciais(nome = "") {

  const partes = nome.trim().split(/\s+/);



  return (

    (partes[0]?.[0] || "") +

    (partes.length > 1 ? partes.at(-1)[0] : "")

  ).toUpperCase();

}



function Card({ title, subtitle, children, action }) {

  return (

    <section className="rounded-[22px] border border-[#DCE8F3] bg-white p-5 shadow-[0_12px_36px_rgba(2,62,138,0.07)]">

      <div className="mb-5 flex items-start justify-between gap-3">

        <div>

          <h3 className="text-xl font-bold text-[#0B1756]">

            {title}

          </h3>



          {subtitle && (

            <p className="mt-1 text-sm text-slate-500">

              {subtitle}

            </p>

          )}

        </div>



        {action}

      </div>



      {children}

    </section>

  );

}



function Badge({ children, active }) {

  return (

    <span

      className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${

        active

          ? "border-blue-100 bg-blue-50 text-blue-700"

          : "border-slate-200 bg-slate-50 text-slate-600"

      }`}

    >

      {children}

    </span>

  );

}



function EspecialidadesSelector({ opcoes, selecionadas, onToggle }) {
  const [busca, setBusca] = useState("");

  const normalizar = (valor = "") =>
    String(valor)
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();

  const termo = normalizar(busca.trim());

  const filtradas = opcoes.filter((especialidade) =>
    normalizar(especialidade.nome).includes(termo)
  );

  const selecionadasLista = opcoes.filter((especialidade) =>
    selecionadas.includes(Number(especialidade.id))
  );

  return (
    <fieldset className="min-w-0 rounded-2xl border border-[#DCE8F3] bg-[#F8FBFE] p-4 sm:col-span-2 sm:p-5">
      <legend className="mb-3 text-sm font-bold text-[#0B1756]">
        Especialidades profissionais *
      </legend>

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs leading-5 text-slate-500">
          Selecione todas as áreas em que o profissional poderá atuar.
        </p>

        <span className="inline-flex w-fit shrink-0 items-center rounded-full border border-[#BBD5EA] bg-white px-3 py-1.5 text-xs font-bold text-[#023E8A]">
          {selecionadas.length}{" "}
          {selecionadas.length === 1 ? "selecionada" : "selecionadas"}
        </span>
      </div>

      <div className="relative mb-3">
        <Search
          size={17}
          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#3563A7]"
        />
        <input
          type="search"
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          placeholder="Buscar especialidade..."
          aria-label="Buscar especialidade"
          className={`${inputCls} pl-11`}
        />
      </div>

      {filtradas.length > 0 ? (
        <div className="grid max-h-64 grid-cols-1 gap-2 overflow-y-auto pr-1 sm:grid-cols-2 lg:grid-cols-3">
          {filtradas.map((especialidade) => {
            const id = Number(especialidade.id);
            const ativa = selecionadas.includes(id);

            return (
              <button
                key={especialidade.id}
                type="button"
                aria-pressed={ativa}
                onClick={() => onToggle(id)}
                className={`flex min-h-[58px] min-w-0 items-center gap-3 rounded-xl border px-3 py-3 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#023E8A] focus-visible:ring-offset-2 ${
                  ativa
                    ? "border-[#3563A7] bg-[#EAF3F7] shadow-sm"
                    : "border-[#DCE8F3] bg-white hover:border-[#9DBBDD] hover:bg-[#F4F9FD]"
                }`}
              >
                <span
                  className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition ${
                    ativa
                      ? "border-[#023E8A] bg-[#023E8A] text-white"
                      : "border-slate-300 bg-white text-transparent"
                  }`}
                >
                  {ativa && <Check size={14} strokeWidth={3} />}
                </span>

                <span
                  className={`min-w-0 flex-1 break-words text-sm font-semibold leading-5 ${
                    ativa ? "text-[#023E8A]" : "text-[#334155]"
                  }`}
                >
                  {especialidade.nome}
                </span>
              </button>
            );
          })}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-[#C8D8EC] bg-white px-4 py-6 text-center">
          <p className="text-sm font-semibold text-slate-600">
            {opcoes.length
              ? "Nenhuma especialidade encontrada."
              : "Nenhuma especialidade disponível."}
          </p>
          <p className="mt-1 text-xs text-slate-400">
            {opcoes.length
              ? "Tente pesquisar usando outro termo."
              : "Verifique se as especialidades foram cadastradas no sistema."}
          </p>
        </div>
      )}

      {selecionadasLista.length > 0 && (
        <div className="mt-4 border-t border-[#DCE8F3] pt-4">
          <p className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-500">
            Especialidades selecionadas
          </p>

          <div className="flex flex-wrap gap-2">
            {selecionadasLista.map((especialidade) => (
              <button
                key={especialidade.id}
                type="button"
                onClick={() => onToggle(Number(especialidade.id))}
                title={`Remover ${especialidade.nome}`}
                className="inline-flex max-w-full items-center gap-2 rounded-full border border-[#BBD5EA] bg-white px-3 py-1.5 text-xs font-semibold text-[#023E8A] transition hover:border-red-200 hover:bg-red-50 hover:text-red-700"
              >
                <span className="min-w-0 break-words">
                  {especialidade.nome}
                </span>
                <X size={13} className="shrink-0" />
              </button>
            ))}
          </div>
        </div>
      )}
    </fieldset>
  );
}

function Modal({ title, onClose, children, onSubmit, saving }) {
  return (
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center overflow-y-auto bg-[#0B1756]/40 p-3 backdrop-blur-sm sm:p-5"
      onMouseDown={onClose}
    >
      <form
        onSubmit={onSubmit}
        onMouseDown={(e) => e.stopPropagation()}
        className="my-auto flex max-h-[calc(100dvh-1.5rem)] w-full max-w-5xl flex-col overflow-hidden rounded-2xl bg-white shadow-[0_24px_70px_rgba(11,23,86,0.24)] sm:max-h-[calc(100dvh-2.5rem)]"
      >
        <div className="flex shrink-0 items-start justify-between gap-4 border-b border-slate-100 bg-white px-5 py-4 sm:px-7">
          <div className="min-w-0">
            <h2 className="text-xl font-bold text-[#0B1756] sm:text-2xl">
              {title}
            </h2>
            <p className="mt-1 text-sm leading-5 text-slate-500">
              Preencha os dados profissionais e os vínculos de atendimento.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar formulário"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-slate-500 transition hover:bg-[#EAF3F7] hover:text-[#023E8A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#023E8A]"
          >
            <X size={20} />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5 sm:px-7 sm:py-6">
          {children}
        </div>

        <div className="flex shrink-0 flex-col-reverse gap-3 border-t border-slate-100 bg-white px-5 py-4 sm:flex-row sm:justify-end sm:px-7">
          <button
            type="button"
            className={btnSecondary}
            onClick={onClose}
          >
            Cancelar
          </button>

          <button
            type="submit"
            disabled={saving}
            className={btnPrimary}
          >
            <Check size={17} />
            {saving ? "Salvando..." : "Salvar profissional"}
          </button>
        </div>
      </form>
    </div>
  );
}

// Controle de posicionamento dos menus flutuantes

function usePopup() {

  const [aberto, setAberto] = useState(false);

  const [pos, setPos] = useState({

    top: 0,

    left: 0,

    width: 0

  });



  const ref = useRef(null);



  useEffect(() => {

    if (!aberto) return;



    const fechar = (e) =>

      !e.target?.closest?.("[data-popup]") &&

      setAberto(false);



    window.addEventListener("scroll", fechar, true);

    window.addEventListener("resize", fechar);



    return () => {

      window.removeEventListener("scroll", fechar, true);

      window.removeEventListener("resize", fechar);

    };

  }, [aberto]);



  function alternar(altura, minLargura) {

    if (!aberto && ref.current) {

      const r = ref.current.getBoundingClientRect();

      const largura = Math.max(r.width, minLargura);



      let top = r.bottom + 8;



      if (top + altura > window.innerHeight - 12) {

        const acima = r.top - altura - 8;



        top =

          acima >= 12

            ? acima

            : Math.max(12, window.innerHeight - altura - 12);

      }



      setPos({

        top,

        left: Math.max(

          12,

          Math.min(r.left, window.innerWidth - largura - 12)

        ),

        width: largura

      });

    }



    setAberto((a) => !a);

  }



  return {

    aberto,

    setAberto,

    pos,

    ref,

    alternar

  };

}



// Dropdown original

function Dropdown({

  rotulo,

  valor,

  opcoes,

  onChange,

  placeholder = "Selecione",

  desabilitado = false

}) {

  const { aberto, setAberto, pos, ref, alternar } = usePopup();



  const lista = opcoes.map((o) =>

    typeof o === "string"

      ? { valor: o, texto: o }

      : o

  );



  const atual = lista.find((o) => o.valor === valor);



  return (

    <div

      ref={ref}

      className="relative w-full"

      onKeyDown={(e) =>

        e.key === "Escape" && setAberto(false)

      }

    >

      <button

        type="button"

        aria-label={rotulo}

        aria-haspopup="listbox"

        aria-expanded={aberto}

        disabled={desabilitado}

        onClick={() =>

          alternar(Math.min(240, lista.length * 44 + 12), 170)

        }

        className={`flex w-full items-center justify-between gap-3 rounded-2xl border border-[#C9D7EB] px-4 py-3 text-left text-sm outline-none transition focus:ring-4 focus:ring-[#C9D7EB]/30 ${

          desabilitado

            ? "cursor-not-allowed bg-slate-50 text-slate-600"

            : "bg-white text-[#121554] hover:bg-[#EAF3F7]"

        }`}

      >

        <span

          className={`min-w-0 truncate ${

            atual ? "text-[#0B1756]" : "text-slate-400"

          }`}

        >

          {atual ? atual.texto : placeholder}

        </span>



        <ChevronDown

          size={16}

          className={`shrink-0 text-[#023E8A] transition-transform ${

            aberto ? "rotate-180" : ""

          }`}

        />

      </button>



      {aberto && !desabilitado && (

        <>

          <button

            type="button"

            aria-label={`Fechar ${rotulo}`}

            onClick={() => setAberto(false)}

            className="fixed inset-0 z-10 cursor-default"

          />



          <div

            data-popup

            role="listbox"

            aria-label={rotulo}

            style={{

              top: pos.top,

              left: pos.left,

              width: pos.width

            }}

            className="fixed z-20 max-h-60 overflow-y-auto rounded-2xl border border-[#D5E2F1] bg-white p-1.5 shadow-[0_12px_30px_rgba(11,23,86,0.16)]"

          >

            {lista.map((o) => (

              <button

                key={o.valor}

                type="button"

                role="option"

                aria-selected={o.valor === valor}

                onClick={() => {

                  onChange(o.valor);

                  setAberto(false);

                }}

                className={`flex w-full items-center justify-between gap-3 rounded-xl px-3.5 py-2.5 text-left text-sm transition ${

                  o.valor === valor

                    ? "bg-[#023E8A] font-semibold text-white"

                    : "bg-white text-[#0B1756] hover:bg-[#EAF3F7]"

                }`}

              >

                <span>{o.texto}</span>



                {o.valor === valor && (

                  <Check

                    size={16}

                    className="shrink-0 text-white"

                  />

                )}

              </button>

            ))}

          </div>

        </>

      )}

    </div>

  );

}



// CALENDÁRIO PERSONALIZADO

function DatePicker({

  rotulo,

  valor,

  onChange,

  placeholder = "Selecione a data"

}) {

  const { aberto, setAberto, pos, ref, alternar } = usePopup();



  const [visao, setVisao] = useState(() => {

    const hoje = new Date();



    return {

      ano: hoje.getFullYear(),

      mes: hoje.getMonth()

    };

  });



  const hojeIso = dataAtualISO();



  function abrir() {

    alternar(380, 300);



    if (!aberto) {

      const base = valor

        ? new Date(`${valor}T00:00:00`)

        : new Date();



      setVisao({

        ano: base.getFullYear(),

        mes: base.getMonth()

      });

    }

  }



  function mudarMes(delta) {

    setVisao(({ ano, mes }) => {

      const d = new Date(ano, mes + delta, 1);



      return {

        ano: d.getFullYear(),

        mes: d.getMonth()

      };

    });

  }



  function escolher(iso) {

    onChange(iso);

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

    )

  ];



  const setaCls =

    "flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20";



  return (

    <div

      ref={ref}

      className="relative w-full"

      onKeyDown={(e) =>

        e.key === "Escape" && setAberto(false)

      }

    >

      <button

        type="button"

        aria-label={rotulo}

        aria-haspopup="dialog"

        aria-expanded={aberto}

        onClick={abrir}

        className="flex w-full items-center justify-between gap-3 rounded-2xl border border-[#C9D7EB] bg-white px-4 py-3 text-left text-sm text-[#121554] transition hover:bg-[#F8FAFC] focus:outline-none focus:ring-4 focus:ring-[#C9D7EB]/30"

      >

        <span className="min-w-0 truncate">

          {valor ? formatarData(valor) : placeholder}

        </span>



        <CalendarDays

          size={16}

          className="shrink-0 text-[#023E8A]"

        />

      </button>



      {aberto && (

        <>

          <button

            type="button"

            aria-label={`Fechar ${rotulo}`}

            onClick={() => setAberto(false)}

            className="fixed inset-0 z-10 cursor-default"

          />



          <div

            data-popup

            role="dialog"

            aria-label={rotulo}

            style={{

              top: pos.top,

              left: pos.left,

              width: 300

            }}

            className="fixed z-20 max-w-[calc(100vw-1.5rem)] rounded-2xl border border-[#D5E2F1] bg-white p-4 shadow-[0_16px_40px_rgba(11,23,86,0.20)]"

          >

            {/* Cabeçalho do calendário */}

            <div className="mb-3 flex items-center justify-between gap-2 rounded-xl bg-[#023E8A] px-3 py-2.5">

              <p className="text-sm font-bold text-white">

                {nomesMeses[visao.mes]} {visao.ano}

              </p>



              <div className="flex gap-1">

                <button

                  type="button"

                  aria-label="Mês anterior"

                  onClick={() => mudarMes(-1)}

                  className={setaCls}

                >

                  <ChevronLeft size={16} />

                </button>



                <button

                  type="button"

                  aria-label="Próximo mês"

                  onClick={() => mudarMes(1)}

                  className={setaCls}

                >

                  <ChevronRight size={16} />

                </button>

              </div>

            </div>



            {/* Dias da semana */}

            <div className="mb-1 grid grid-cols-7 text-center">

              {nomesSemana.map((dia) => (

                <span

                  key={dia}

                  className="py-1 text-xs font-semibold text-[#023E8A]"

                >

                  {dia}

                </span>

              ))}

            </div>



            {/* Dias do mês */}

            <div className="grid grid-cols-7 gap-1">

              {celulas.map((dia, i) => {

                if (!dia) {

                  return (

                    <span

                      key={`vazio-${i}`}

                      className="h-8"

                    />

                  );

                }



                const iso = paraIso(

                  visao.ano,

                  visao.mes,

                  dia

                );



                return (

                  <button

                    key={iso}

                    type="button"

                    aria-pressed={iso === valor}

                    onClick={() => escolher(iso)}

                    className={`h-8 rounded-lg text-xs font-medium transition ${

                      iso === valor

                        ? "bg-[#023E8A] font-bold text-white shadow-md"

                        : iso === hojeIso

                          ? "border-2 border-[#023E8A] bg-[#EAF3F7] font-extrabold text-[#023E8A]"

                          : "bg-white text-[#0B1756] hover:bg-[#EAF3F7] hover:text-[#023E8A]"

                    }`}

                  >

                    {dia}

                  </button>

                );

              })}

            </div>



            {/* Rodapé */}

            <div className="mt-3 flex items-center justify-between border-t border-slate-200 pt-3 text-xs font-semibold">

              <span />



              <button

                type="button"

                onClick={() => escolher(hojeIso)}

                className="rounded-lg border border-[#023E8A] bg-white px-3 py-2 text-[#023E8A] transition hover:bg-[#EAF3F7]"

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

    setCarregando(true);

    setErro("");



    try {

      const [

        listaMedicos,

        listaEspecialidades,

        listaUnidades,

        listaSetores

      ] = await Promise.all([

        api("/api/medicos"),

        api("/api/especialidades"),

        api("/api/unidades"),

        api("/api/setores")

      ]);



      const base = Array.isArray(listaMedicos)

        ? listaMedicos

        : [];



      const detalhes = await Promise.all(

        base.map(async (m) => {

          try {

            return await api(`/api/medicos/${m.id}`);

          } catch {

            return m;

          }

        })

      );



      setMedicos(detalhes);



      setEspecialidades(

        Array.isArray(listaEspecialidades)

          ? listaEspecialidades

          : []

      );



      setUnidades(

        Array.isArray(listaUnidades)

          ? listaUnidades

          : []

      );



      setSetores(

        Array.isArray(listaSetores)

          ? listaSetores

          : []

      );

    } catch (e) {

      setErro(

        e.message || "Não foi possível carregar os profissionais."

      );

    } finally {

      setCarregando(false);

    }

  }, []);



  useEffect(() => {

    carregar();

  }, [carregar]);



  const carregarSetoresUnidade = useCallback(

    async (unidadeId) => {

      if (!unidadeId || setoresPorUnidade[unidadeId]) return;



      try {

        const dados = await api(

          `/api/setores/unidade/${unidadeId}`

        );



        setSetoresPorUnidade((atual) => ({

          ...atual,

          [unidadeId]: Array.isArray(dados) ? dados : []

        }));

      } catch (e) {

        setErro(

          e.message ||

          "Não foi possível carregar os setores da unidade."

        );

      }

    },

    [setoresPorUnidade]

  );



  useEffect(() => {

    unidades.forEach((u) =>

      carregarSetoresUnidade(u.id)

    );

  }, [unidades, carregarSetoresUnidade]);



  const profissionais = useMemo(

    () =>

      medicos.map((m) => ({

        ...m,

        nome:

          m.nome_completo ||

          m.nome ||

          "Nome não informado",

        especialidades: Array.isArray(m.especialidades)

          ? m.especialidades

          : [],

        vinculos: Array.isArray(m.vinculos)

          ? m.vinculos

          : [],

        ativo: Boolean(m.ativo)

      })),

    [medicos]

  );



  const totalAtivos = profissionais.filter(

    (p) => p.ativo

  ).length;



  const totalInativos =

    profissionais.length - totalAtivos;



  const especialidadesRepresentadas = new Set(

    profissionais.flatMap((p) =>

      p.especialidades.map((e) => e.id)

    )

  ).size;



  const porEspecialidade = useMemo(() => {

    const mapa = new Map();



    profissionais.forEach((p) =>

      p.especialidades.forEach((e) =>

        mapa.set(

          e.nome,

          (mapa.get(e.nome) || 0) + 1

        )

      )

    );



    return [...mapa.entries()].sort(

      (a, b) => b[1] - a[1]

    );

  }, [profissionais]);



  const porUnidade = useMemo(() => {

    const mapa = new Map();



    profissionais.forEach((p) =>

      p.vinculos.forEach((v) =>

        mapa.set(

          v.unidade || "Unidade não informada",

          (mapa.get(v.unidade || "Unidade não informada") || 0) + 1

        )

      )

    );



    return [...mapa.entries()].sort(

      (a, b) => b[1] - a[1]

    );

  }, [profissionais]);



  const lista = profissionais.filter((p) => {

    const termo = busca.trim().toLowerCase();



    const nomeOuCrm =

      !termo ||

      p.nome.toLowerCase().includes(termo) ||

      String(p.crm || "").toLowerCase().includes(termo);



    const temEsp =

      filtroEsp === "Todas" ||

      p.especialidades.some(

        (e) => e.nome === filtroEsp

      );



    const temUnidade =

      filtroUnidade === "Todas" ||

      p.vinculos.some(

        (v) =>

          Number(v.unidade_id) === Number(filtroUnidade)

      );



    return nomeOuCrm && temEsp && temUnidade;

  });



  function abrirNovo() {

    setEditando(null);

    setForm(emptyForm);

    setErroForm("");

    setVinculoUnidade("");

    setVinculoSetor("");

    setModal(true);

  }



  async function abrirEdicao(p) {

    setErroForm("");

    setEditando(p.id);



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

        especialidades: (detalhe.especialidades || []).map(

          (e) => Number(e.id)

        ),

        vinculos: (detalhe.vinculos || []).map((v) => ({

          unidade_id: Number(v.unidade_id),

          setor_id: Number(v.setor_id)

        }))

      });



      setModal(true);

    } catch (e) {

      setErro(

        e.message ||

        "Não foi possível carregar os dados do médico."

      );

    }

  }



  function alternarEspecialidade(id) {

    setForm((f) => ({

      ...f,

      especialidades: f.especialidades.includes(Number(id))

        ? f.especialidades.filter(

            (x) => x !== Number(id)

          )

        : [...f.especialidades, Number(id)]

    }));

  }



  function adicionarVinculo() {

    if (!vinculoUnidade || !vinculoSetor) {

      setErroForm("Selecione uma unidade e um setor.");

      return;

    }



    const novo = {

      unidade_id: Number(vinculoUnidade),

      setor_id: Number(vinculoSetor)

    };



    if (

      form.vinculos.some(

        (v) =>

          v.unidade_id === novo.unidade_id &&

          v.setor_id === novo.setor_id

      )

    ) {

      setErroForm("Esse vínculo já foi adicionado.");

      return;

    }



    setForm((f) => ({

      ...f,

      vinculos: [...f.vinculos, novo]

    }));



    setVinculoSetor("");

    setErroForm("");

  }



  async function salvar(e) {

    e.preventDefault();

    setErroForm("");



    if (form.nome_completo.trim().length < 3)

      return setErroForm("Informe o nome completo.");



    if (!form.cpf.trim())

      return setErroForm("Informe o CPF.");



    if (!form.data_nascimento)

      return setErroForm("Informe a data de nascimento.");



    if (!/^\S+@\S+\.\S+$/.test(form.email.trim()))

      return setErroForm("Informe um e-mail válido.");



    if (!form.crm.trim())

      return setErroForm("Informe o CRM.");



    if (!form.uf_crm)

      return setErroForm("Selecione a UF do CRM.");



    if (!editando && !form.senha)

      return setErroForm("Informe uma senha inicial para o médico.");



    if (!form.especialidades.length)

      return setErroForm("Selecione pelo menos uma especialidade.");



    if (!form.vinculos.length)

      return setErroForm(

        "Adicione pelo menos um vínculo com unidade e setor."

      );



    setSalvando(true);



    try {

      const payload = {

        ...form,

        nome_completo: form.nome_completo.trim(),

        email: form.email.trim(),

        telefone: form.telefone.trim() || null

      };



      if (!payload.senha) delete payload.senha;



      if (editando) {

        await api(`/api/medicos/${editando}`, {

          method: "PUT",

          body: JSON.stringify(payload)

        });

      } else {

        await api("/api/medicos", {

          method: "POST",

          body: JSON.stringify(payload)

        });

      }



      setModal(false);



      setAviso(

        editando

          ? "Profissional atualizado com sucesso."

          : "Profissional cadastrado com sucesso."

      );



      await carregar();

    } catch (e) {

      setErroForm(

        e.message ||

        "Não foi possível salvar o profissional."

      );

    } finally {

      setSalvando(false);

    }

  }



  async function alternarStatus(p) {

    try {

      if (p.ativo) {

        await api(`/api/medicos/${p.id}`, {

          method: "DELETE"

        });

      } else {

        await api(`/api/medicos/${p.id}/reativar`, {

          method: "PATCH"

        });

      }



      setAviso(

        p.ativo

          ? "Profissional desativado."

          : "Profissional reativado."

      );



      await carregar();

    } catch (e) {

      setErro(

        e.message ||

        "Não foi possível alterar a situação."

      );

    }

  }



  const setoresDisponiveis =

    setoresPorUnidade[vinculoUnidade] || [];



  const nomeUnidade = (id) =>

    unidades.find(

      (u) => Number(u.id) === Number(id)

    )?.nome || "Unidade não informada";



  return (

    <div className="relative isolate min-h-screen overflow-hidden bg-[#EEF5F9] text-[#0B1756]">

      <div

        aria-hidden="true"

        className="pointer-events-none absolute inset-0 z-0 overflow-hidden"

      >

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

                <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-semibold text-blue-50">

                  <Hospital size={14} />

                  ADMINISTRAÇÃO · REDE MUNICIPAL

                </div>



                <h1 className="mt-4 text-3xl font-bold leading-tight text-white sm:text-4xl">

                  Gestão de equipe

                </h1>



                <p className="mt-3 max-w-2xl text-sm leading-6 text-blue-100 sm:text-base">

                  Cadastre os profissionais de saúde, acompanhe suas especialidades e unidades de atendimento.

                </p>

              </div>



              <button

                type="button"

                onClick={abrirNovo}

                className="rounded-2xl bg-white px-5 py-3.5 text-sm font-semibold text-[#0B1756] shadow-sm transition hover:bg-[#EAF3F7]"

              >

                <UserPlus size={16} className="mr-2 inline-block" />

                Novo profissional

              </button>

            </div>

          </section>



          <section className="overflow-hidden rounded-[22px] border border-[#DCE8F3] bg-white shadow-[0_12px_36px_rgba(2,62,138,0.07)]">

            <div className="grid grid-cols-1 gap-2 p-2 sm:grid-cols-2 sm:p-3">

              {[

                ["geral", "Visão geral"],

                ["profissionais", "Profissionais"]

              ].map(([id, titulo]) => (

                <button

                  key={id}

                  type="button"

                  onClick={() => setAba(id)}

                  className={`flex h-11 items-center justify-center rounded-xl px-3 text-center text-sm font-semibold transition ${

                    aba === id

                      ? "bg-[#163B85] text-white shadow-sm"

                      : "text-[#3563A7] hover:bg-[#EAF3F7]"

                  }`}

                >

                  {titulo}

                </button>

              ))}

            </div>

          </section>



          {erro && (

            <div

              role="alert"

              className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"

            >

              {erro}

            </div>

          )}



          {aviso && (

            <div

              role="status"

              className="rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-[#0B1756]"

            >

              {aviso}

            </div>

          )}



          {aba === "geral" && (

            <>

              <div>

                <h2 className="text-2xl font-bold text-[#0B1756]">

                  Panorama da equipe

                </h2>



                <p className="mt-1 text-base text-slate-500">

                  Indicadores calculados a partir dos profissionais cadastrados.

                </p>

              </div>



              <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">

                {[

                  ["Profissionais", profissionais.length, "Cadastrados no sistema"],

                  ["Ativos", totalAtivos, "Com cadastro ativo"],

                  ["Inativos", totalInativos, "Com cadastro desativado"],

                  ["Especialidades", especialidadesRepresentadas, "Representadas na equipe"]

                ].map(([t, v, d]) => (

                  <div

                    key={t}

                    className="rounded-[22px] border border-[#DCE8F3] bg-white p-5 shadow-[0_12px_36px_rgba(2,62,138,0.07)]"

                  >

                    <p className="text-sm font-medium text-slate-500">

                      {t}

                    </p>



                    <p className="mt-2 text-3xl font-bold tracking-tight text-[#0B1756]">

                      {carregando ? "—" : v}

                    </p>



                    <p className="mt-1 text-xs text-slate-500">

                      {d}

                    </p>

                  </div>

                ))}

              </section>



              <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">

                <Card

                  title="Profissionais por especialidade"

                  subtitle="Distribuição da equipe"

                >

                  {porEspecialidade.length ? (

                    <div className="space-y-4">

                      {porEspecialidade.map(([nome, qtd]) => (

                        <div key={nome}>

                          <div className="mb-1.5 flex justify-between gap-3 text-sm">

                            <span className="font-medium text-slate-600">

                              {nome}

                            </span>

                            <strong>{qtd}</strong>

                          </div>



                          <div className="h-2 overflow-hidden rounded-full bg-slate-100">

                            <div

                              className="h-full rounded-full bg-[#3563A7]"

                              style={{

                                width: `${qtd / Math.max(...porEspecialidade.map((x) => x[1])) * 100}%`

                              }}

                            />

                          </div>

                        </div>

                      ))}

                    </div>

                  ) : (

                    <p className="text-sm text-slate-400">

                      Ainda não há dados para exibir.

                    </p>

                  )}

                </Card>



                <Card

                  title="Profissionais por unidade"

                  subtitle="Onde a equipe atende"

                >

                  {porUnidade.length ? (

                    <div className="space-y-4">

                      {porUnidade.map(([nome, qtd]) => (

                        <div key={nome}>

                          <div className="mb-1.5 flex justify-between gap-3 text-sm">

                            <span className="font-medium text-slate-600">

                              {nome}

                            </span>

                            <strong>{qtd}</strong>

                          </div>



                          <div className="h-2 overflow-hidden rounded-full bg-slate-100">

                            <div

                              className="h-full rounded-full bg-[#3563A7]"

                              style={{

                                width: `${qtd / Math.max(...porUnidade.map((x) => x[1])) * 100}%`

                              }}

                            />

                          </div>

                        </div>

                      ))}

                    </div>

                  ) : (

                    <p className="text-sm text-slate-400">

                      Ainda não há dados para exibir.

                    </p>

                  )}

                </Card>

              </div>

            </>

          )}



          {aba === "profissionais" && (

            <section className="space-y-5">

              <Card

                title="Profissionais cadastrados"

                subtitle="Dados reais dos médicos registrados no sistema"

                action={

                  <button

                    type="button"

                    onClick={carregar}

                    disabled={carregando}

                    className={btnSecondary}

                  >

                    <RefreshCw

                      size={15}

                      className={carregando ? "animate-spin" : ""}

                    />

                    Atualizar

                  </button>

                }

              >

                <div className="grid gap-3 md:grid-cols-3">

                  <div className="relative">

                    <Search

                      size={18}

                      className="absolute left-4 top-1/2 -translate-y-1/2 text-[#0B1756]"

                    />



                    <input

                      className={`${inputCls} pl-11`}

                      value={busca}

                      onChange={(e) => setBusca(e.target.value)}

                      placeholder="Buscar por nome ou CRM..."

                    />

                  </div>



                  <Dropdown

                    rotulo="Filtrar por especialidade"

                    valor={filtroEsp}

                    onChange={setFiltroEsp}

                    opcoes={[

                      {

                        valor: "Todas",

                        texto: "Todas as especialidades"

                      },

                      ...especialidades.map((e) => ({

                        valor: e.nome,

                        texto: e.nome

                      }))

                    ]}

                  />



                  <Dropdown

                    rotulo="Filtrar por unidade"

                    valor={filtroUnidade}

                    onChange={setFiltroUnidade}

                    opcoes={[

                      {

                        valor: "Todas",

                        texto: "Todas as unidades"

                      },

                      ...unidades.map((u) => ({

                        valor: String(u.id),

                        texto: u.nome

                      }))

                    ]}

                  />

                </div>

              </Card>



              {carregando ? (

                <p className="py-8 text-center text-sm text-slate-500">

                  Carregando profissionais...

                </p>

              ) : lista.length ? (

                <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">

                  {lista.map((p) => (

                    <article

                      key={p.id}

                      className="flex flex-col rounded-[22px] border border-[#DCE8F3] bg-white p-5 shadow-[0_12px_36px_rgba(2,62,138,0.07)]"

                    >

                      <div className="flex items-start gap-4">

                        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#023E8A] text-lg font-bold text-white">

                          {iniciais(p.nome)}

                        </div>



                        <div className="min-w-0 flex-1">

                          <h3 className="text-lg font-bold text-[#0B1756]">

                            {p.nome}

                          </h3>



                          <p className="mt-1 text-sm font-semibold">

                            CRM {p.crm}/{p.uf_crm}

                          </p>

                        </div>



                        <Badge active={p.ativo}>

                          {p.ativo ? "Ativo" : "Inativo"}

                        </Badge>

                      </div>



                      <div className="mt-5 space-y-2 text-sm text-slate-600">

                        <p className="flex items-center gap-2">

                          <Mail size={15} />

                          {p.email || "E-mail não informado"}

                        </p>



                        <p className="flex items-center gap-2">

                          <Phone size={15} />

                          {p.telefone || "Telefone não informado"}

                        </p>



                        <div className="flex items-start gap-2">

                          <Stethoscope size={15} className="mt-0.5" />

                          <span>

                            {p.especialidades.map((e) => e.nome).join(", ") ||

                              "Sem especialidade vinculada"}

                          </span>

                        </div>



                        <div className="flex items-start gap-2">

                          <Hospital size={15} className="mt-0.5" />

                          <span>

                            {p.vinculos.map((v) => `${v.unidade} — ${v.setor}`).join("; ") ||

                              "Sem unidade vinculada"}

                          </span>

                        </div>

                      </div>



                      <div className="mt-5 grid grid-cols-2 gap-2 border-t border-slate-100 pt-4">

                        <button

                          type="button"

                          onClick={() => abrirEdicao(p)}

                          className={btnPrimary}

                        >

                          <Pencil size={15} />

                          Editar

                        </button>



                        <button

                          type="button"

                          onClick={() => alternarStatus(p)}

                          className={btnSecondary}

                        >

                          {p.ativo ? "Desativar" : "Reativar"}

                        </button>

                      </div>

                    </article>

                  ))}

                </div>

              ) : (

                <div className="rounded-2xl border border-dashed border-slate-200 bg-white px-4 py-10 text-center">

                  <p className="font-semibold text-slate-600">

                    Nenhum profissional encontrado.

                  </p>



                  <p className="mt-1 text-sm text-slate-400">

                    Ajuste a busca ou cadastre um novo médico.

                  </p>

                </div>

              )}

            </section>

          )}



          {aba === "afastamentos" && (

            <Card

              title="Afastamentos"

              subtitle="Funcionalidade ainda não disponível"

            >

              <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">

                <AlertTriangle size={18} className="mt-0.5 shrink-0" />



                <p>

                  O banco de dados atual não possui tabela de afastamentos e o backend não oferece rotas para registrar, encerrar ou consultar férias e licenças. Essa aba ficará apenas informativa, sem ações que aparentem salvar dados.

                </p>

              </div>

            </Card>

          )}

        </div>

      </main>



      {modal && (

        <Modal

          title={editando ? "Editar profissional" : "Novo profissional"}

          onClose={() => setModal(false)}

          onSubmit={salvar}

          saving={salvando}

        >

          <div className="grid gap-4 sm:grid-cols-2">

            <label className="sm:col-span-2">

              <span className="mb-1.5 block text-xs font-semibold text-slate-600">

                Nome completo *

              </span>



              <input

                className={inputCls}

                value={form.nome_completo}

                onChange={(e) =>

                  setForm((f) => ({

                    ...f,

                    nome_completo: e.target.value

                  }))

                }

                required

              />

            </label>



            <label>

              <span className="mb-1.5 block text-xs font-semibold text-slate-600">

                CPF *

              </span>



              <input

                className={inputCls}

                value={form.cpf}

                onChange={(e) =>

                  setForm((f) => ({

                    ...f,

                    cpf: e.target.value.replace(/\D/g, "").slice(0, 11)

                  }))

                }

                required

                maxLength={11}

              />

            </label>



            {/* ÚNICA ALTERAÇÃO NO FORMULÁRIO: CALENDÁRIO */}

            <div>

              <span className="mb-1.5 block text-xs font-semibold text-slate-600">

                Data de nascimento *

              </span>



              <DatePicker

                rotulo="Data de nascimento"

                valor={form.data_nascimento}

                placeholder="Selecione a data"

                onChange={(v) =>

                  setForm((f) => ({

                    ...f,

                    data_nascimento: v

                  }))

                }

              />

            </div>



            <label>

              <span className="mb-1.5 block text-xs font-semibold text-slate-600">

                E-mail *

              </span>



              <input

                type="email"

                className={inputCls}

                value={form.email}

                onChange={(e) =>

                  setForm((f) => ({

                    ...f,

                    email: e.target.value

                  }))

                }

                required

              />

            </label>



            <label>

              <span className="mb-1.5 block text-xs font-semibold text-slate-600">

                Telefone

              </span>



              <input

                className={inputCls}

                value={form.telefone}

                onChange={(e) =>

                  setForm((f) => ({

                    ...f,

                    telefone: e.target.value

                  }))

                }

              />

            </label>



            <label>

              <span className="mb-1.5 block text-xs font-semibold text-slate-600">

                CRM *

              </span>



              <input

                className={inputCls}

                value={form.crm}

                onChange={(e) =>

                  setForm((f) => ({

                    ...f,

                    crm: e.target.value.replace(/\D/g, "")

                  }))

                }

                required

              />

            </label>



            <div>

              <span className="mb-1.5 block text-xs font-semibold text-slate-600">

                UF do CRM *

              </span>



              <Dropdown

                rotulo="UF do CRM"

                valor={form.uf_crm}

                onChange={(v) =>

                  setForm((f) => ({

                    ...f,

                    uf_crm: v

                  }))

                }

                opcoes={UFS}

              />

            </div>



            {!editando && (

              <label className="sm:col-span-2">

                <span className="mb-1.5 block text-xs font-semibold text-slate-600">

                  Senha inicial *

                </span>



                <input

                  type="password"

                  className={inputCls}

                  value={form.senha}

                  onChange={(e) =>

                    setForm((f) => ({

                      ...f,

                      senha: e.target.value

                    }))

                  }

                  required

                />

              </label>

            )}



            <EspecialidadesSelector
              opcoes={especialidades}
              selecionadas={form.especialidades}
              onToggle={alternarEspecialidade}
            />



            <fieldset className="sm:col-span-2">

              <legend className="mb-2 text-xs font-semibold text-slate-600">

                Vínculos com unidades e setores *

              </legend>



              <div className="grid gap-3 sm:grid-cols-[1fr_1fr_auto]">

                <Dropdown

                  rotulo="Unidade"

                  valor={vinculoUnidade}

                  placeholder="Selecione a unidade"

                  onChange={(v) => {

                    setVinculoUnidade(v);

                    setVinculoSetor("");

                  }}

                  opcoes={unidades.map((u) => ({

                    valor: String(u.id),

                    texto: u.nome

                  }))}

                />



                <Dropdown

                  rotulo="Setor"

                  valor={vinculoSetor}

                  placeholder="Selecione o setor"

                  desabilitado={!vinculoUnidade}

                  onChange={setVinculoSetor}

                  opcoes={setoresDisponiveis.map((s) => ({

                    valor: String(s.id),

                    texto: s.nome

                  }))}

                />



                <button

                  type="button"

                  className={btnSecondary}

                  onClick={adicionarVinculo}

                >

                  Adicionar

                </button>

              </div>



              <div className="mt-3 space-y-2">

                {form.vinculos.map((v, i) => (

                  <div

                    key={`${v.unidade_id}-${v.setor_id}`}

                    className="flex items-center justify-between rounded-lg bg-[#EAF3F7] px-3 py-2 text-xs"

                  >

                    <span>

                      {nomeUnidade(v.unidade_id)} —{" "}

                      {(setoresPorUnidade[v.unidade_id] || []).find(

                        (s) => Number(s.id) === Number(v.setor_id)

                      )?.nome || `Setor ${v.setor_id}`}

                    </span>



                    <button

                      type="button"

                      onClick={() =>

                        setForm((f) => ({

                          ...f,

                          vinculos: f.vinculos.filter(

                            (_, idx) => idx !== i

                          )

                        }))

                      }

                      className="text-red-600"

                    >

                      Remover

                    </button>

                  </div>

                ))}

              </div>

            </fieldset>

          </div>



          {erroForm && (

            <div

              role="alert"

              className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700"

            >

              {erroForm}

            </div>

          )}



          {editando && (

            <p className="text-xs text-slate-500">

              Deixe a senha em branco para manter a senha atual.

            </p>

          )}

        </Modal>

      )}

    </div>

  );

}
