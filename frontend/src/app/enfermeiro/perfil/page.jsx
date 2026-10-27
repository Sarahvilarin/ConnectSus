"use client";

import { useEffect, useRef, useState } from "react";
import {
  UserRound,
  Mail,
  Phone,
  ShieldCheck,
  LockKeyhole,
  Pencil,
  Save,
  Eye,
  EyeOff,
  CheckCircle2,
  X,
  KeyRound,
  Building2,
  BadgeCheck,
  BriefcaseMedical,
  MapPin,
  Clock3,
  ClipboardList,
  ChevronDown,
  Check,
  HeartPulse,
  Stethoscope,
} from "lucide-react";


function SelectPersonalizado({
  id,
  value,
  onChange,
  options,
  required = false,
}) {
  const [aberto, setAberto] = useState(false);
  const [foco, setFoco] = useState(0);
  const containerRef = useRef(null);
  const opcoesRef = useRef(null);

  useEffect(() => {
    function fecharFora(event) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setAberto(false);
      }
    }

    document.addEventListener("mousedown", fecharFora);
    document.addEventListener("touchstart", fecharFora);

    return () => {
      document.removeEventListener("mousedown", fecharFora);
      document.removeEventListener("touchstart", fecharFora);
    };
  }, []);

  useEffect(() => {
    if (aberto && opcoesRef.current) {
      const selecionada = opcoesRef.current.querySelector(
        `[data-index="${foco}"]`
      );

      selecionada?.scrollIntoView({ block: "nearest" });
    }
  }, [aberto, foco]);

  function selecionar(opcao) {
    onChange(opcao);
    setAberto(false);
  }

  function navegar(event) {
    if (event.key === "Escape") {
      setAberto(false);
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();

      if (!aberto) {
        setAberto(true);
        setFoco(Math.max(0, options.findIndex((item) => item === value)));
      } else {
        setFoco((atual) => Math.min(atual + 1, options.length - 1));
      }
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();

      if (!aberto) {
        setAberto(true);
        setFoco(Math.max(0, options.findIndex((item) => item === value)));
      } else {
        setFoco((atual) => Math.max(atual - 1, 0));
      }
    }

    if (event.key === "Enter" && aberto) {
      event.preventDefault();
      selecionar(options[foco]);
    }
  }

  return (
    <div ref={containerRef} className="relative w-full">
      <button
        id={id}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={aberto}
        aria-required={required}
        onClick={() => {
          if (!aberto) {
            setFoco(Math.max(0, options.findIndex((item) => item === value)));
          }

          setAberto(!aberto);
        }}
        onKeyDown={navegar}
        className={`flex w-full items-center justify-between gap-3 rounded-2xl border bg-[#F7FAFF] px-5 py-4 pr-6 text-left text-sm font-medium text-[#0B1756] outline-none transition ${
          aberto
            ? "border-[#3563A7] ring-4 ring-[#3563A7]/10"
            : "border-[#CFE0FF] hover:border-[#8EB5ED] focus:border-[#3563A7] focus:ring-4 focus:ring-[#3563A7]/10"
        }`}
      >
        <span className="min-w-0 flex-1 truncate">{value}</span>

        <ChevronDown
          size={19}
          className={`mr-1 shrink-0 text-[#3563A7] transition-transform ${
            aberto ? "rotate-180" : ""
          }`}
        />
      </button>

      {aberto && (
        <div
          ref={opcoesRef}
          role="listbox"
          aria-labelledby={id}
         className="absolute left-0 top-[calc(100%+8px)] z-50 max-h-60 w-full overflow-y-auto overscroll-contain rounded-2xl border border-[#CFE0FF] bg-white p-2 shadow-[0_12px_30px_rgba(11,23,86,0.16)] [scrollbar-color:#858585_#F1F1F1] [scrollbar-width:auto]"
        >
          {options.map((opcao, index) => {
            const selecionada = value === opcao;
            const emFoco = foco === index;

            return (
              <button
                key={opcao}
                type="button"
                role="option"
                aria-selected={selecionada}
                data-index={index}
                onMouseEnter={() => setFoco(index)}
                onClick={() => selecionar(opcao)}
                className={`flex w-full items-center justify-between gap-3 rounded-xl px-4 py-3 text-left text-sm transition ${
                  selecionada
                    ? "bg-[#1D438D] font-semibold text-white"
                    : emFoco
                      ? "bg-[#F0F6FF] text-[#174D9B]"
                      : "text-[#254A88] hover:bg-[#F0F6FF]"
                }`}
              >
                <span>{opcao}</span>

                {selecionada && (
                  <Check size={17} className="shrink-0 text-white" />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function PerfilEnfermeiroPage() {
  const [nome, setNome] = useState("Enf. Mariana Oliveira Santos");
  const [telefone, setTelefone] = useState("(11) 98765-4321");
  const [email, setEmail] = useState("mariana.santos@conectasus.com");
  const [foto, setFoto] = useState("");

  const [categoria, setCategoria] = useState("Enfermeira");
  const [coren, setCoren] = useState("123456");
  const [uf, setUf] = useState("SP");
  const [especialidade, setEspecialidade] = useState("Saúde da Família");
  const [unidade, setUnidade] = useState("UBS Centro");
  const [experiencia, setExperiencia] = useState("8 anos");
  const [tipoAtendimento, setTipoAtendimento] = useState("Presencial");

  const [modal, setModal] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);

  const [senhaAtual, setSenhaAtual] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [novoEmail, setNovoEmail] = useState(email);

  const [nomeEditado, setNomeEditado] = useState(nome);
  const [telefoneEditado, setTelefoneEditado] = useState(telefone);
  const [categoriaEditada, setCategoriaEditada] = useState(categoria);
  const [corenEditado, setCorenEditado] = useState(coren);
  const [ufEditada, setUfEditada] = useState(uf);
  const [especialidadeEditada, setEspecialidadeEditada] =
    useState(especialidade);
  const [unidadeEditada, setUnidadeEditada] = useState(unidade);
  const [experienciaEditada, setExperienciaEditada] = useState(experiencia);
  const [tipoAtendimentoEditado, setTipoAtendimentoEditado] =
    useState(tipoAtendimento);

  const inputFoto = useRef(null);

  const estados = [
    "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO",
    "MA", "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI",
    "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO",
  ];

  const categorias = [
    "Enfermeira",
    "Enfermeiro",
    "Técnica de enfermagem",
    "Técnico de enfermagem",
    "Auxiliar de enfermagem",
  ];

  const especialidades = [
    "Saúde da Família",
    "Saúde Pública",
    "Urgência e Emergência",
    "Terapia Intensiva",
    "Pediatria",
    "Obstetrícia",
    "Saúde Mental",
    "Centro Cirúrgico",
    "Gerontologia",
    "Enfermagem do Trabalho",
    "Outra",
  ];

  const tiposAtendimento = [
    "Presencial",
    "Visita domiciliar",
    "Presencial e visita domiciliar",
  ];

  function mostrarMensagem(texto) {
    setMensagem(texto);
    setTimeout(() => setMensagem(""), 3500);
  }

  function salvarDados(e) {
    e.preventDefault();

    if (!nomeEditado.trim()) {
      mostrarMensagem("Informe seu nome completo.");
      return;
    }

    if (!corenEditado.trim() || !ufEditada || !categoriaEditada) {
      mostrarMensagem("Preencha a categoria e os dados do COREN.");
      return;
    }

    setNome(nomeEditado.trim());
    setTelefone(telefoneEditado);
    setCategoria(categoriaEditada);
    setCoren(corenEditado.trim());
    setUf(ufEditada);
    setEspecialidade(especialidadeEditada);
    setUnidade(unidadeEditada);
    setExperiencia(experienciaEditada);
    setTipoAtendimento(tipoAtendimentoEditado);

    mostrarMensagem("Perfil profissional atualizado com sucesso!");
  }

  function selecionarFoto(e) {
    const arquivo = e.target.files?.[0];

    if (!arquivo) return;

    if (!arquivo.type.startsWith("image/")) {
      mostrarMensagem("Selecione um arquivo de imagem válido.");
      return;
    }

    if (arquivo.size > 5 * 1024 * 1024) {
      mostrarMensagem("A imagem deve ter no máximo 5 MB.");
      return;
    }

    setFoto(URL.createObjectURL(arquivo));
    mostrarMensagem("Foto de perfil atualizada!");
    e.target.value = "";
  }

  function alterarSenha(e) {
    e.preventDefault();

    if (!senhaAtual || !novaSenha || !confirmarSenha) {
      mostrarMensagem("Preencha todos os campos de senha.");
      return;
    }

    if (novaSenha.length < 8) {
      mostrarMensagem("A nova senha deve ter pelo menos 8 caracteres.");
      return;
    }

    if (novaSenha !== confirmarSenha) {
      mostrarMensagem("As senhas não correspondem.");
      return;
    }

    mostrarMensagem("Demonstração: senha validada com sucesso!");

    setSenhaAtual("");
    setNovaSenha("");
    setConfirmarSenha("");
    setModal("");
  }

  function alterarEmail(e) {
    e.preventDefault();

    if (
      !novoEmail.trim() ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(novoEmail)
    ) {
      mostrarMensagem("Informe um endereço de e-mail válido.");
      return;
    }

    setEmail(novoEmail.trim());
    setModal("");
    mostrarMensagem("E-mail atualizado na demonstração!");
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#EAF3F7] text-[#0B1756]">
      {/* Elementos decorativos */}
      <div className="pointer-events-none absolute -right-28 -top-36 h-[430px] w-[430px] rounded-full bg-[#B8D6FC]/50" />
      <div className="pointer-events-none absolute -right-12 -top-20 h-[330px] w-[330px] rounded-full border-[65px] border-white/35" />
      <div className="pointer-events-none absolute -left-40 top-10 h-[330px] w-[330px] rounded-full border-2 border-[#C8DEFF]/60" />
      <div className="pointer-events-none absolute -bottom-36 -left-24 h-[350px] w-[350px] rounded-full bg-white/50" />

      <div className="relative z-10 mx-auto w-full max-w-[1450px] px-5 pb-12 pt-3 sm:px-8 sm:pt-4 lg:px-12 lg:pt-5">
        {/* Cabeçalho */}
        <header className="mb-6 text-left sm:mb-7">
          <h1 className="text-3xl font-extrabold tracking-tight text-[#0B1756] sm:text-4xl md:text-5xl">
            Gerenciar seu{" "}
            <span className="text-[#3563A7]">Perfil</span>
          </h1>

          <p className="mt-3 max-w-2xl text-base leading-relaxed text-[#647EAE] sm:text-lg">
            Mantenha seus dados pessoais e profissionais atualizados no UneSUS.
          </p>
        </header>

        {/* Resumo profissional */}
        <section className="mb-7 rounded-[26px] border border-[#D8E7FF] bg-white/90 p-6 shadow-[0_8px_25px_rgba(53,99,167,0.06)] sm:p-8 lg:px-10">
          <div className="flex flex-col items-center gap-6 md:flex-row md:gap-8">
            <div className="relative shrink-0">
              <div className="flex h-32 w-32 items-center justify-center overflow-hidden rounded-full bg-[#DCEAFF] ring-8 ring-[#F4F8FF] sm:h-36 sm:w-36">
                {foto ? (
                  <img
                    src={foto}
                    alt={`Foto de ${nome}`}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <UserRound
                    size={88}
                    strokeWidth={1.4}
                    className="mt-4 text-[#3563A7]"
                    fill="#3563A7"
                  />
                )}
              </div>

              <button
                type="button"
                onClick={() => inputFoto.current?.click()}
                aria-label="Alterar foto de perfil"
                className="absolute bottom-0 right-0 flex h-11 w-11 items-center justify-center rounded-full border-4 border-white bg-[#0B286F] text-white shadow-lg transition hover:scale-105 hover:bg-[#3563A7]"
              >
                <Pencil size={18} />
              </button>

              <input
                ref={inputFoto}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={selecionarFoto}
              />
            </div>

            <div className="hidden h-32 w-px bg-[#BDD2F5] md:block" />

            <div className="min-w-0 flex-1 text-center md:text-left">
              <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-[#E7F4FF] px-3 py-1.5 text-xs font-semibold text-[#3563A7]">
                <ShieldCheck size={15} />
                Perfil profissional
              </div>

              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
                Olá, {nome.split(" ")[1] || nome.split(" ")[0]}!
              </h2>

              <p className="mt-2 text-sm text-[#647EAE] sm:text-base">
                {categoria} · COREN {coren}/{uf}
              </p>

              <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <div className="flex items-center gap-3 text-left">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#F0F6FF] text-[#3563A7]">
                    <HeartPulse size={22} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-[#6B84B3]">Área de atuação</p>
                    <p className="mt-1 break-words text-sm font-semibold text-[#3563A7]">
                      {especialidade}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-left">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#F0F6FF] text-[#3563A7]">
                    <Building2 size={22} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-[#6B84B3]">Unidade de saúde</p>
                    <p className="mt-1 break-words text-sm font-semibold text-[#3563A7]">
                      {unidade}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-left sm:col-span-2 lg:col-span-1">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#F0F6FF] text-[#3563A7]">
                    <Mail size={22} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-[#6B84B3]">E-mail profissional</p>
                    <p className="mt-1 break-all text-sm font-semibold text-[#3563A7]">
                      {email}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <form onSubmit={salvarDados}>
          <div className="grid items-stretch gap-6 lg:grid-cols-2">
            {/* Dados pessoais */}
            <section className="rounded-[26px] border border-[#D8E7FF] bg-white/90 p-6 shadow-[0_8px_25px_rgba(53,99,167,0.06)] sm:p-8">
              <div className="mb-7 flex items-center gap-4">
                <div className="flex h-[62px] w-[62px] shrink-0 items-center justify-center rounded-full bg-[#E0ECFF] text-[#3563A7]">
                  <UserRound size={31} />
                </div>

                <div>
                  <h2 className="text-xl font-bold tracking-tight sm:text-2xl">
                    Dados pessoais
                  </h2>
                  <p className="mt-1 text-sm text-[#647EAE]">
                    Informações básicas da sua conta.
                  </p>
                </div>
              </div>

              <div className="space-y-5">
                <div>
                  <label
                    htmlFor="nome-enfermeiro"
                    className="mb-2 block text-sm font-semibold text-[#254A88]"
                  >
                    Nome completo
                  </label>

                  <input
                    id="nome-enfermeiro"
                    type="text"
                    value={nomeEditado}
                    onChange={(e) => setNomeEditado(e.target.value)}
                    required
                    placeholder="Digite seu nome completo"
                    className="w-full rounded-2xl border border-[#CFE0FF] bg-[#F7FAFF] px-5 py-4 text-sm font-medium outline-none transition placeholder:text-[#9AAED0] focus:border-[#3563A7] focus:ring-4 focus:ring-[#3563A7]/10"
                  />
                </div>

                <div>
                  <label
                    htmlFor="telefone-enfermeiro"
                    className="mb-2 block text-sm font-semibold text-[#254A88]"
                  >
                    Telefone
                  </label>

                  <div className="flex items-center gap-3 rounded-2xl border border-[#CFE0FF] bg-[#F7FAFF] px-5 focus-within:border-[#3563A7] focus-within:ring-4 focus-within:ring-[#3563A7]/10">
                    <Phone size={20} className="shrink-0 text-[#3563A7]" />

                    <input
                      id="telefone-enfermeiro"
                      type="tel"
                      value={telefoneEditado}
                      onChange={(e) => setTelefoneEditado(e.target.value)}
                      placeholder="(11) 99999-9999"
                      className="min-w-0 flex-1 bg-transparent py-4 text-sm font-medium outline-none placeholder:text-[#9AAED0]"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-[#254A88]">
                    E-mail cadastrado
                  </label>

                  <div className="flex items-center gap-3 rounded-2xl border border-[#E1EAF7] bg-slate-50 px-5 py-4">
                    <Mail size={20} className="shrink-0 text-[#7894BC]" />

                    <span className="min-w-0 break-all text-sm text-[#7189B3]">
                      {email}
                    </span>

                    <button
                      type="button"
                      onClick={() => {
                        setNovoEmail(email);
                        setModal("email");
                      }}
                      className="ml-auto shrink-0 rounded-lg p-2 text-[#3563A7] transition hover:bg-[#E0ECFF]"
                      aria-label="Editar e-mail"
                    >
                      <Pencil size={17} />
                    </button>
                  </div>
                </div>
              </div>
            </section>

            {/* Dados profissionais */}
            <section className="rounded-[26px] border border-[#D8E7FF] bg-white/90 p-6 shadow-[0_8px_25px_rgba(53,99,167,0.06)] sm:p-8">
              <div className="mb-7 flex items-center gap-4">
                <div className="flex h-[62px] w-[62px] shrink-0 items-center justify-center rounded-full bg-[#E0ECFF] text-[#3563A7]">
                  <BriefcaseMedical size={31} />
                </div>

                <div>
                  <h2 className="text-xl font-bold tracking-tight sm:text-2xl">
                    Dados profissionais
                  </h2>
                  <p className="mt-1 text-sm text-[#647EAE]">
                    Registro e qualificação em enfermagem.
                  </p>
                </div>
              </div>

              <div className="space-y-5">
                <div>
                  <label
                    htmlFor="categoria-enfermeiro"
                    className="mb-2 block text-sm font-semibold text-[#254A88]"
                  >
                    Categoria profissional
                  </label>

                  <SelectPersonalizado
                    id="categoria-enfermeiro"
                    value={categoriaEditada}
                    onChange={setCategoriaEditada}
                    options={categorias}
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="coren-enfermeiro"
                    className="mb-2 block text-sm font-semibold text-[#254A88]"
                  >
                    Número do COREN
                  </label>

                  <div className="flex items-center gap-3 rounded-2xl border border-[#CFE0FF] bg-[#F7FAFF] px-4 focus-within:border-[#3563A7] focus-within:ring-4 focus-within:ring-[#3563A7]/10">
                    <BadgeCheck size={20} className="shrink-0 text-[#3563A7]" />

                    <input
                      id="coren-enfermeiro"
                      type="text"
                      value={corenEditado}
                      onChange={(e) => setCorenEditado(e.target.value)}
                      placeholder="Digite o número do COREN"
                      required
                      className="min-w-0 flex-1 bg-transparent py-4 text-sm font-medium outline-none placeholder:text-[#9AAED0]"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="uf-coren"
                    className="mb-2 block text-sm font-semibold text-[#254A88]"
                  >
                    UF do COREN
                  </label>

                  <SelectPersonalizado
                    id="uf-coren"
                    value={ufEditada}
                    onChange={setUfEditada}
                    options={estados}
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="especialidade-enfermeiro"
                    className="mb-2 block text-sm font-semibold text-[#254A88]"
                  >
                    Área de atuação
                  </label>

                  <SelectPersonalizado
                    id="especialidade-enfermeiro"
                    value={especialidadeEditada}
                    onChange={setEspecialidadeEditada}
                    options={especialidades}
                    required
                  />
                </div>
              </div>
            </section>

            {/* Vínculo profissional */}
            <section className="rounded-[26px] border border-[#D8E7FF] bg-white/90 p-6 shadow-[0_8px_25px_rgba(53,99,167,0.06)] sm:p-8 lg:col-span-2">
              <div className="mb-7 flex items-center gap-4">
                <div className="flex h-[62px] w-[62px] shrink-0 items-center justify-center rounded-full bg-[#E0ECFF] text-[#3563A7]">
                  <Building2 size={31} />
                </div>

                <div>
                  <h2 className="text-xl font-bold tracking-tight sm:text-2xl">
                    Vínculo profissional
                  </h2>
                  <p className="mt-1 text-sm text-[#647EAE]">
                    Informações sobre sua atuação na rede de saúde.
                  </p>
                </div>
              </div>

              <div className="grid gap-5 md:grid-cols-3">
                <div>
                  <label
                    htmlFor="unidade-enfermeiro"
                    className="mb-2 block text-sm font-semibold text-[#254A88]"
                  >
                    Unidade de saúde
                  </label>

                  <div className="flex items-center gap-3 rounded-2xl border border-[#CFE0FF] bg-[#F7FAFF] px-4 focus-within:border-[#3563A7] focus-within:ring-4 focus-within:ring-[#3563A7]/10">
                    <MapPin size={20} className="shrink-0 text-[#3563A7]" />

                    <input
                      id="unidade-enfermeiro"
                      value={unidadeEditada}
                      onChange={(e) => setUnidadeEditada(e.target.value)}
                      required
                      placeholder="Nome da unidade"
                      className="min-w-0 flex-1 bg-transparent py-4 text-sm font-medium outline-none placeholder:text-[#9AAED0]"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="experiencia-enfermeiro"
                    className="mb-2 block text-sm font-semibold text-[#254A88]"
                  >
                    Tempo de experiência
                  </label>

                  <div className="flex items-center gap-3 rounded-2xl border border-[#CFE0FF] bg-[#F7FAFF] px-4 focus-within:border-[#3563A7] focus-within:ring-4 focus-within:ring-[#3563A7]/10">
                    <Clock3 size={20} className="shrink-0 text-[#3563A7]" />

                    <input
                      id="experiencia-enfermeiro"
                      value={experienciaEditada}
                      onChange={(e) => setExperienciaEditada(e.target.value)}
                      placeholder="Ex.: 5 anos"
                      className="min-w-0 flex-1 bg-transparent py-4 text-sm font-medium outline-none placeholder:text-[#9AAED0]"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="tipo-atendimento-enfermeiro"
                    className="mb-2 block text-sm font-semibold text-[#254A88]"
                  >
                    Tipo de atendimento
                  </label>

                  <SelectPersonalizado
                    id="tipo-atendimento-enfermeiro"
                    value={tipoAtendimentoEditado}
                    onChange={setTipoAtendimentoEditado}
                    options={tiposAtendimento}
                    required
                  />
                </div>
              </div>
            </section>

            {/* Segurança da conta */}
            <section className="rounded-[26px] border border-[#D8E7FF] bg-white/90 p-6 shadow-[0_8px_25px_rgba(53,99,167,0.06)] sm:p-8 lg:col-span-2">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-[62px] w-[62px] shrink-0 items-center justify-center rounded-full bg-[#E0ECFF] text-[#3563A7]">
                    <ShieldCheck size={31} />
                  </div>

                  <div>
                    <h2 className="text-xl font-bold tracking-tight sm:text-2xl">
                      Segurança da conta
                    </h2>
                    <p className="mt-1 text-sm text-[#647EAE]">
                      Proteja seus dados de acesso.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setModal("senha")}
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-[#3563A7] bg-white px-5 py-3 text-sm font-semibold text-[#23559B] transition hover:bg-[#3563A7] hover:text-white"
                >
                  <LockKeyhole size={18} />
                  Alterar senha
                </button>
              </div>

              <div className="mt-5 flex items-start gap-3 rounded-2xl border border-[#DDEBFA] bg-[#F8FBFF] p-4">
                <ShieldCheck size={21} className="mt-0.5 shrink-0 text-[#3563A7]" />

                <p className="text-xs leading-relaxed text-[#647EAE]">
                  Mantenha seus dados profissionais atualizados e nunca
                  compartilhe sua senha. Os dados desta página são demonstrativos
                  e não estão conectados a um sistema real.
                </p>
              </div>
            </section>
          </div>

          {/* Salvar alterações */}
          <div className="mt-7 flex justify-end">
            <button
              type="submit"
              className="inline-flex min-h-14 w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-[#3563A7] to-[#1760C5] px-7 py-4 text-sm font-semibold text-white shadow-[0_8px_18px_rgba(53,99,167,0.20)] transition hover:-translate-y-0.5 hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-[#3563A7]/20 sm:w-auto"
            >
              <Save size={21} />
              Salvar alterações
            </button>
          </div>
        </form>
      </div>

      {/* Notificação */}
      {mensagem && (
        <div
          role="status"
          className="fixed right-4 top-4 z-[60] flex max-w-[calc(100%-2rem)] items-center gap-3 rounded-2xl border border-[#D3E5D9] bg-white px-5 py-4 text-sm font-medium text-[#245D43] shadow-xl sm:right-6 sm:top-6"
        >
          <CheckCircle2 size={22} className="shrink-0 text-emerald-600" />

          <span>{mensagem}</span>

          <button
            type="button"
            onClick={() => setMensagem("")}
            aria-label="Fechar mensagem"
            className="ml-2 rounded-lg p-1 hover:bg-slate-100"
          >
            <X size={17} />
          </button>
        </div>
      )}

      {/* Modais de segurança */}
      {modal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-[#071638]/50 p-4 backdrop-blur-sm"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setModal("");
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            className="my-auto w-full max-w-md rounded-[28px] border border-[#D8E7FF] bg-white p-6 shadow-2xl sm:p-8"
          >
            <div className="mb-6 flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#EAF3F7] text-[#3563A7]">
                  {modal === "senha" ? (
                    <KeyRound size={25} />
                  ) : (
                    <Mail size={25} />
                  )}
                </div>

                <div>
                  <h2 id="modal-title" className="text-xl font-bold">
                    {modal === "senha" ? "Alterar senha" : "Alterar e-mail"}
                  </h2>

                  <p className="mt-1 text-sm text-[#7189B3]">
                    Atualize seus dados de acesso.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setModal("")}
                aria-label="Fechar janela"
                className="rounded-xl p-2 text-[#647EAE] transition hover:bg-[#EAF3F7]"
              >
                <X size={21} />
              </button>
            </div>

            {modal === "senha" ? (
              <form onSubmit={alterarSenha} className="space-y-4">
                {[
                  {
                    id: "senha-atual-enfermeiro",
                    label: "Senha atual",
                    value: senhaAtual,
                    setValue: setSenhaAtual,
                    autoComplete: "current-password",
                  },
                  {
                    id: "nova-senha-enfermeiro",
                    label: "Nova senha",
                    value: novaSenha,
                    setValue: setNovaSenha,
                    autoComplete: "new-password",
                  },
                  {
                    id: "confirmar-senha-enfermeiro",
                    label: "Confirmar nova senha",
                    value: confirmarSenha,
                    setValue: setConfirmarSenha,
                    autoComplete: "new-password",
                  },
                ].map((campo) => (
                  <div key={campo.id}>
                    <label
                      htmlFor={campo.id}
                      className="mb-2 block text-sm font-semibold text-[#254A88]"
                    >
                      {campo.label}
                    </label>

                    <div className="flex items-center rounded-xl border border-[#CFE0FF] bg-[#F7FAFF] pr-3 focus-within:border-[#3563A7] focus-within:ring-4 focus-within:ring-[#3563A7]/10">
                      <input
                        id={campo.id}
                        type={mostrarSenha ? "text" : "password"}
                        value={campo.value}
                        onChange={(e) => campo.setValue(e.target.value)}
                        autoComplete={campo.autoComplete}
                        className="min-w-0 flex-1 rounded-xl bg-transparent px-4 py-3 text-sm outline-none"
                        placeholder="Digite sua senha"
                        required
                      />

                      <button
                        type="button"
                        onClick={() => setMostrarSenha(!mostrarSenha)}
                        aria-label={
                          mostrarSenha ? "Ocultar senhas" : "Mostrar senhas"
                        }
                        className="rounded-lg p-1 text-[#647EAE] hover:text-[#0B1756]"
                      >
                        {mostrarSenha ? (
                          <EyeOff size={19} />
                        ) : (
                          <Eye size={19} />
                        )}
                      </button>
                    </div>
                  </div>
                ))}

                <p className="text-xs text-[#7189B3]">
                  Utilize pelo menos 8 caracteres para a nova senha.
                </p>

                <button
                  type="submit"
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#3563A7] px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-[#023E8A]"
                >
                  <LockKeyhole size={18} />
                  Confirmar alteração
                </button>
              </form>
            ) : (
              <form onSubmit={alterarEmail} className="space-y-5">
                <div>
                  <label
                    htmlFor="email-atual-enfermeiro"
                    className="mb-2 block text-sm font-semibold text-[#254A88]"
                  >
                    E-mail atual
                  </label>

                  <input
                    id="email-atual-enfermeiro"
                    value={email}
                    readOnly
                    className="w-full rounded-xl border border-[#E1EAF7] bg-slate-50 px-4 py-3 text-sm text-[#7189B3] outline-none"
                  />
                </div>

                <div>
                  <label
                    htmlFor="novo-email-enfermeiro"
                    className="mb-2 block text-sm font-semibold text-[#254A88]"
                  >
                    Novo e-mail
                  </label>

                  <input
                    id="novo-email-enfermeiro"
                    type="email"
                    value={novoEmail}
                    onChange={(e) => setNovoEmail(e.target.value)}
                    placeholder="seuemail@exemplo.com"
                    required
                    className="w-full rounded-xl border border-[#CFE0FF] bg-[#F7FAFF] px-4 py-3 text-sm outline-none transition focus:border-[#3563A7] focus:ring-4 focus:ring-[#3563A7]/10"
                  />
                </div>

                <div className="rounded-xl bg-[#EAF3F7] p-4 text-xs leading-relaxed text-[#536F9D]">
                  Em um sistema real, a alteração deverá ser confirmada por
                  meio de uma verificação de segurança.
                </div>

                <button
                  type="submit"
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#3563A7] px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-[#023E8A]"
                >
                  <Mail size={18} />
                  Confirmar novo e-mail
                </button>
              </form>
            )}
          </section>
        </div>
      )}
    </main>
  );
}
