
"use client";

import { useEffect, useRef, useState } from "react";
import {
  UserRound,
  Pencil,
  LockKeyhole,
  ChevronDown,
  Check,
  Eye,
  EyeOff,
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

      if (options[foco] !== undefined) {
        selecionar(options[foco]);
      }
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
        className={`flex w-full items-center justify-between gap-3 rounded-2xl border bg-[#EAF3F7] px-5 py-4 pr-6 text-left text-sm font-normal text-[#0B1756] outline-none transition ${
          aberto
            ? "border-[#3563A7] ring-4 ring-[#3563A7]/10"
            : "border-[#C8D8E8] hover:border-[#AFC5DC] focus:border-[#3563A7] focus:ring-4 focus:ring-[#3563A7]/10"
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
          className="custom-scrollbar absolute left-0 top-[calc(100%+8px)] z-50 max-h-60 w-full overflow-y-auto overscroll-contain rounded-2xl border border-[#D1DFEA] bg-white p-2 pr-4 shadow-[0_12px_30px_rgba(11,23,86,0.16)]"
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
                    ? "bg-[#023E8A] font-semibold text-white"
                    : emFoco
                      ? "bg-[#EAF3F7] text-[#0B1756]"
                      : "text-[#0B1756] hover:bg-[#EAF3F7]"
                }`}
              >
                <span>{opcao}</span>

                {selecionada && (
                  <Check
                    size={19}
                    strokeWidth={2.2}
                    className="shrink-0 text-white"
                  />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function PerfilMedicoPage() {
  const [nome, setNome] = useState("Dr. Gabriel Henrique Martins");
  const [telefone, setTelefone] = useState("(11) 98765-4321");
  const [email, setEmail] = useState("gabriel.martins@conectasus.com");
  const [foto, setFoto] = useState("");

  const [especialidade, setEspecialidade] = useState("Cardiologia");
  const [crm, setCrm] = useState("123456");
  const [uf, setUf] = useState("SP");
  const [rqe, setRqe] = useState("45678");
  const [unidade, setUnidade] = useState("UBS Centro");
  const [experiencia, setExperiencia] = useState("10 anos");
  const [tipoAtendimento, setTipoAtendimento] = useState(
    "Presencial e teleconsulta"
  );

  const [modal, setModal] = useState("");
  const [mensagem, setMensagem] = useState("");

  // Controle independente da visibilidade de cada senha.
  const [senhasVisiveis, setSenhasVisiveis] = useState({
    atual: false,
    nova: false,
    confirmar: false,
  });

  const [senhaAtual, setSenhaAtual] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [novoEmail, setNovoEmail] = useState(email);

  const [nomeEditado, setNomeEditado] = useState(nome);
  const [telefoneEditado, setTelefoneEditado] = useState(telefone);
  const [especialidadeEditada, setEspecialidadeEditada] =
    useState(especialidade);
  const [crmEditado, setCrmEditado] = useState(crm);
  const [ufEditada, setUfEditada] = useState(uf);
  const [rqeEditado, setRqeEditado] = useState(rqe);
  const [unidadeEditada, setUnidadeEditada] = useState(unidade);
  const [experienciaEditada, setExperienciaEditada] =
    useState(experiencia);
  const [tipoAtendimentoEditado, setTipoAtendimentoEditado] =
    useState(tipoAtendimento);

  const inputFoto = useRef(null);

  const estados = [
    "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES",
    "GO", "MA", "MT", "MS", "MG", "PA", "PB", "PR",
    "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC",
    "SP", "SE", "TO",
  ];

  const tiposAtendimento = [
    "Presencial",
    "Teleconsulta",
    "Presencial e teleconsulta",
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

    if (!especialidadeEditada.trim() || !crmEditado.trim() || !ufEditada) {
      mostrarMensagem("Preencha a especialidade e os dados do CRM.");
      return;
    }

    setNome(nomeEditado.trim());
    setTelefone(telefoneEditado);
    setEspecialidade(especialidadeEditada);
    setCrm(crmEditado.trim());
    setUf(ufEditada);
    setRqe(rqeEditado.trim());
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
    setSenhasVisiveis({
      atual: false,
      nova: false,
      confirmar: false,
    });
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

  function alternarVisibilidade(chave) {
    setSenhasVisiveis((atual) => ({
      ...atual,
      [chave]: !atual[chave],
    }));
  }

  const camposProfissionais = [
    {
      id: "especialidade",
      label: "Especialidade médica",
      value: especialidadeEditada,
      setValue: setEspecialidadeEditada,
      placeholder: "Ex.: Cardiologia",
      required: true,
    },
    {
      id: "crm",
      label: "Número do CRM",
      value: crmEditado,
      setValue: setCrmEditado,
      placeholder: "Digite o número do CRM",
      required: true,
    },
    {
      id: "rqe",
      label: "RQE (se aplicável)",
      value: rqeEditado,
      setValue: setRqeEditado,
      placeholder: "Digite o número do RQE",
      required: false,
    },
  ];

  const inputClass =
    "w-full rounded-2xl border border-[#C8D8E8] bg-[#EAF3F7] px-5 py-4 text-sm font-normal text-[#0B1756] outline-none transition placeholder:text-[#3563A7] focus:border-[#023E8A] focus:ring-4 focus:ring-[#3563A7]/10";

  const labelClass =
    "mb-2 block text-xs font-semibold text-[#0B1756]";

  const cardClass =
    "rounded-[26px] border border-[#D1DFEA] bg-white/90 p-6 shadow-[0_8px_25px_rgba(53,99,167,0.06)] sm:p-8";

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#EAF3F7] font-sans text-[#0B1756]">
      {/* Elementos decorativos */}
      <div className="pointer-events-none absolute -right-28 -top-36 h-[430px] w-[430px] rounded-full bg-[#023E8A]/15" />
      <div className="pointer-events-none absolute -left-40 top-10 h-[330px] w-[330px] rounded-full border-2 border-[#3563A7]/20" />
      <div className="pointer-events-none absolute -bottom-36 -left-24 h-[350px] w-[350px] rounded-full bg-white/50" />
      <div className="pointer-events-none absolute -bottom-40 -right-24 h-[430px] w-[430px] rounded-full border-[70px] border-[#023E8A]/15" />

      <div className="relative z-10 mx-auto w-full max-w-[1600px] px-4 pb-12 pt-3 sm:px-6 sm:pt-4 lg:pt-5 2xl:px-10">
        {/* Cabeçalho */}
        <header className="mb-6 text-left sm:mb-7">
          <h1 className="text-4xl font-bold tracking-tight text-[#0B1756] sm:text-[40px]">
            Gerenciar seu{" "}
            <span className="text-[#3563A7]">Perfil</span>
          </h1>

          <p className="mt-3 max-w-2xl text-base font-normal leading-relaxed text-[#3563A7]">
            Mantenha seus dados pessoais e profissionais atualizados no UneSUS.
          </p>
        </header>

        {/* Resumo do médico */}
        <section className="mb-7 rounded-[26px] border border-[#D1DFEA] bg-white/90 p-6 shadow-[0_8px_25px_rgba(53,99,167,0.06)] sm:p-8 lg:px-10">
          <div className="flex flex-col items-center gap-6 md:flex-row md:gap-8">
            <div className="relative shrink-0">
              <div className="flex h-32 w-32 items-center justify-center overflow-hidden rounded-full bg-[#EAF3F7] ring-8 ring-[#EAF3F7] sm:h-36 sm:w-36">
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
                className="absolute bottom-0 right-0 flex h-11 w-11 items-center justify-center rounded-full border-4 border-white bg-[#023E8A] text-white shadow-lg transition hover:scale-105 hover:bg-[#3563A7]"
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

            <div className="hidden h-32 w-px bg-[#C8D8E8] md:block" />

            <div className="min-w-0 flex-1 text-center md:text-left">
              <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-[#EAF3F7] px-3 py-1.5 text-xs font-semibold text-[#023E8A]">
                Perfil profissional
              </div>

              <h2 className="text-2xl font-bold tracking-tight text-[#0B1756]">
                Olá, {nome.split(" ")[1] || nome.split(" ")[0]}!
              </h2>

              <p className="mt-2 text-base font-normal text-[#3563A7]">
                {especialidade} · CRM {crm}/{uf}
              </p>

              <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <div className="min-w-0 text-left">
                  <p className="text-sm font-normal text-[#3563A7]">
                    Especialidade
                  </p>
                  <p className="mt-1 break-words text-base font-semibold text-[#023E8A]">
                    {especialidade}
                  </p>
                </div>

                <div className="min-w-0 text-left">
                  <p className="text-sm font-normal text-[#3563A7]">
                    Unidade de saúde
                  </p>
                  <p className="mt-1 break-words text-base font-semibold text-[#023E8A]">
                    {unidade}
                  </p>
                </div>

                <div className="min-w-0 text-left">
                  <p className="text-sm font-normal text-[#3563A7]">
                    E-mail profissional
                  </p>
                  <p className="mt-1 break-all text-base font-semibold text-[#023E8A]">
                    {email}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <form onSubmit={salvarDados}>
          <div className="grid items-stretch gap-6 lg:grid-cols-2">
            {/* Dados pessoais */}
            <section className={cardClass}>
              <div className="mb-7">
                <h2 className="text-2xl font-bold tracking-tight text-[#0B1756]">
                  Dados pessoais
                </h2>

                <p className="mt-1 text-sm font-normal text-[#3563A7]">
                  Informações básicas da sua conta.
                </p>
              </div>

              <div className="space-y-5">
                <div>
                  <label htmlFor="nome-medico" className={labelClass}>
                    Nome completo
                  </label>

                  <input
                    id="nome-medico"
                    type="text"
                    value={nomeEditado}
                    onChange={(e) => setNomeEditado(e.target.value)}
                    required
                    placeholder="Digite seu nome completo"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label htmlFor="telefone-medico" className={labelClass}>
                    Telefone
                  </label>

                  <input
                    id="telefone-medico"
                    type="tel"
                    value={telefoneEditado}
                    onChange={(e) => setTelefoneEditado(e.target.value)}
                    placeholder="(11) 99999-9999"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>E-mail cadastrado</label>

                  <div className="flex items-center gap-3 rounded-2xl border border-[#C8D8E8] bg-[#EAF3F7] px-5 py-4">
                    <span className="min-w-0 break-all text-sm font-normal text-[#3563A7]">
                      {email}
                    </span>

                    <button
                      type="button"
                      onClick={() => {
                        setNovoEmail(email);
                        setModal("email");
                      }}
                      className="ml-auto shrink-0 rounded-lg p-2 text-[#023E8A] transition hover:bg-[#EAF3F7]"
                      aria-label="Editar e-mail"
                    >
                      <Pencil size={17} />
                    </button>
                  </div>
                </div>
              </div>
            </section>

            {/* Dados profissionais */}
            <section className={cardClass}>
              <div className="mb-7">
                <h2 className="text-2xl font-bold tracking-tight text-[#0B1756]">
                  Dados profissionais
                </h2>

                <p className="mt-1 text-sm font-normal text-[#3563A7]">
                  Registro e atuação médica.
                </p>
              </div>

              <div className="space-y-5">
                {camposProfissionais.map((campo) => (
                  <div key={campo.id}>
                    <label htmlFor={campo.id} className={labelClass}>
                      {campo.label}
                    </label>

                    <input
                      id={campo.id}
                      type="text"
                      value={campo.value}
                      onChange={(e) => campo.setValue(e.target.value)}
                      placeholder={campo.placeholder}
                      required={campo.required}
                      className={inputClass}
                    />
                  </div>
                ))}

                <div>
                  <label htmlFor="uf-medico" className={labelClass}>
                    UF do CRM
                  </label>

                  <SelectPersonalizado
                    id="uf-medico"
                    value={ufEditada}
                    onChange={setUfEditada}
                    options={estados}
                    required
                  />
                </div>
              </div>
            </section>

            {/* Vínculo profissional */}
            <section className={`${cardClass} lg:col-span-2`}>
              <div className="mb-7">
                <h2 className="text-2xl font-bold tracking-tight text-[#0B1756]">
                  Vínculo profissional
                </h2>

                <p className="mt-1 text-sm font-normal text-[#3563A7]">
                  Informações sobre sua atuação na rede de saúde.
                </p>
              </div>

              <div className="grid gap-5 md:grid-cols-3">
                <div>
                  <label htmlFor="unidade-medico" className={labelClass}>
                    Unidade de saúde
                  </label>

                  <input
                    id="unidade-medico"
                    value={unidadeEditada}
                    onChange={(e) => setUnidadeEditada(e.target.value)}
                    required
                    placeholder="Nome da unidade"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label htmlFor="experiencia-medico" className={labelClass}>
                    Tempo de experiência
                  </label>

                  <input
                    id="experiencia-medico"
                    value={experienciaEditada}
                    onChange={(e) => setExperienciaEditada(e.target.value)}
                    placeholder="Ex.: 5 anos"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label htmlFor="tipo-atendimento" className={labelClass}>
                    Tipo de atendimento
                  </label>

                  <SelectPersonalizado
                    id="tipo-atendimento"
                    value={tipoAtendimentoEditado}
                    onChange={setTipoAtendimentoEditado}
                    options={tiposAtendimento}
                  />
                </div>
              </div>
            </section>

            {/* Segurança */}
            <section className={`${cardClass} lg:col-span-2`}>
              <div className="mb-7">
                <h2 className="text-2xl font-bold tracking-tight text-[#0B1756]">
                  Segurança da conta
                </h2>

                <p className="mt-1 text-sm font-normal text-[#3563A7]">
                  Proteja seus dados de acesso.
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex flex-col gap-4 rounded-[22px] border border-[#D1DFEA] bg-[#EAF3F7] p-5 sm:p-6 xl:flex-row xl:items-center">
                  <div className="min-w-0 flex-1">
                    <h3 className="font-bold text-[#0B1756]">
                      Alterar senha
                    </h3>

                    <p className="mt-1 text-sm leading-relaxed text-[#3563A7]">
                      Atualize sua senha de acesso.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setSenhasVisiveis({
                        atual: false,
                        nova: false,
                        confirmar: false,
                      });
                      setModal("senha");
                    }}
                    className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-2xl border border-[#D1DFEA] bg-white px-5 py-3 text-sm font-semibold text-[#023E8A] transition hover:bg-[#3563A7] hover:text-white"
                  >
                    <LockKeyhole size={18} />
                    Alterar senha
                  </button>
                </div>
              </div>

              <div className="mt-5 rounded-2xl border border-[#C8D8E8] bg-[#EAF3F7] p-4">
                <p className="text-xs font-normal leading-relaxed text-[#3563A7]">
                  Mantenha suas informações profissionais atualizadas. Nunca
                  compartilhe sua senha. Os dados exibidos nesta página são
                  demonstrativos e não estão conectados a um sistema real.
                </p>
              </div>
            </section>
          </div>

          <div className="mt-7 flex justify-end">
            <button
              type="submit"
              className="inline-flex min-h-14 w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-[#3563A7] to-[#023E8A] px-7 py-4 text-sm font-semibold text-white shadow-[0_8px_18px_rgba(53,99,167,0.20)] transition hover:-translate-y-0.5 hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-[#3563A7]/20 sm:w-auto"
            >
              Salvar alterações
            </button>
          </div>
        </form>
      </div>

      {/* Notificação */}
      {mensagem && (
        <div
          role="status"
          className="fixed right-4 top-4 z-[60] flex max-w-[calc(100%-2rem)] items-center gap-3 rounded-2xl border border-[#D1DFEA] bg-white px-5 py-4 text-sm font-normal text-[#0B1756] shadow-xl sm:right-6 sm:top-6"
        >
          <span>{mensagem}</span>

          <button
            type="button"
            onClick={() => setMensagem("")}
            aria-label="Fechar mensagem"
            className="ml-2 rounded-lg p-1 text-[#3563A7] transition hover:bg-[#EAF3F7]"
          >
            Fechar
          </button>
        </div>
      )}

      {/* Modais de segurança e e-mail */}
      {modal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-[#0B1756]/50 p-4 backdrop-blur-sm"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setModal("");
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            className="my-auto w-full max-w-md rounded-[28px] border border-[#D1DFEA] bg-white p-6 shadow-2xl sm:p-8"
          >
            <div className="relative mb-6 flex items-center justify-center">
              <div className="text-center">
                <h2
                  id="modal-title"
                  className="text-xl font-bold text-[#0B1756]"
                >
                  {modal === "senha" ? "Alterar senha" : "Alterar e-mail"}
                </h2>

                <p className="mt-1 text-sm font-normal text-[#3563A7]">
                  {modal === "senha"
                    ? "Atualize sua senha de acesso."
                    : "Atualize seu endereço de e-mail."}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setModal("")}
                aria-label="Fechar janela"
                className="absolute right-0 top-0 rounded-xl p-2 text-[#3563A7] transition hover:bg-[#EAF3F7]"
              >
                ✕
              </button>
            </div>

            {modal === "senha" ? (
              <form onSubmit={alterarSenha} className="space-y-4">
                {[
                  {
                    id: "senha-atual",
                    chave: "atual",
                    label: "Senha atual",
                    value: senhaAtual,
                    setValue: setSenhaAtual,
                    autoComplete: "current-password",
                  },
                  {
                    id: "nova-senha",
                    chave: "nova",
                    label: "Nova senha",
                    value: novaSenha,
                    setValue: setNovaSenha,
                    autoComplete: "new-password",
                  },
                  {
                    id: "confirmar-senha",
                    chave: "confirmar",
                    label: "Confirmar nova senha",
                    value: confirmarSenha,
                    setValue: setConfirmarSenha,
                    autoComplete: "new-password",
                  },
                ].map((campo) => (
                  <div key={campo.id}>
                    <label htmlFor={campo.id} className={labelClass}>
                      {campo.label}
                    </label>

                    <div className="flex items-center rounded-xl border border-[#C8D8E8] bg-[#EAF3F7] pr-3 transition focus-within:border-[#023E8A] focus-within:ring-4 focus-within:ring-[#3563A7]/10">
                      <input
                        id={campo.id}
                        type={
                          senhasVisiveis[campo.chave]
                            ? "text"
                            : "password"
                        }
                        value={campo.value}
                        onChange={(e) => campo.setValue(e.target.value)}
                        autoComplete={campo.autoComplete}
                        className="min-w-0 flex-1 rounded-xl bg-transparent px-4 py-3 text-sm font-normal text-[#0B1756] outline-none"
                        placeholder="Digite sua senha"
                        required
                      />

                      <button
                        type="button"
                        onClick={() => alternarVisibilidade(campo.chave)}
                        aria-label={
                          senhasVisiveis[campo.chave]
                            ? "Ocultar senha"
                            : "Mostrar senha"
                        }
                        title={
                          senhasVisiveis[campo.chave]
                            ? "Ocultar senha"
                            : "Mostrar senha"
                        }
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-[#3563A7] transition hover:bg-[#D5E6F0] hover:text-[#023E8A] focus:outline-none focus:ring-2 focus:ring-[#3563A7]/30"
                      >
                        {senhasVisiveis[campo.chave] ? (
                          <EyeOff size={20} strokeWidth={1.8} />
                        ) : (
                          <Eye size={20} strokeWidth={1.8} />
                        )}
                      </button>
                    </div>
                  </div>
                ))}

                <p className="text-xs font-normal text-[#3563A7]">
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
                  <label htmlFor="email-atual" className={labelClass}>
                    E-mail atual
                  </label>

                  <input
                    id="email-atual"
                    value={email}
                    readOnly
                    className="w-full rounded-xl border border-[#C8D8E8] bg-[#EAF3F7] px-4 py-3 text-sm font-normal text-[#3563A7] outline-none"
                  />
                </div>

                <div>
                  <label htmlFor="novo-email" className={labelClass}>
                    Novo e-mail
                  </label>

                  <input
                    id="novo-email"
                    type="email"
                    value={novoEmail}
                    onChange={(e) => setNovoEmail(e.target.value)}
                    placeholder="seuemail@exemplo.com"
                    required
                    className="w-full rounded-xl border border-[#C8D8E8] bg-[#EAF3F7] px-4 py-3 text-sm font-normal text-[#0B1756] outline-none transition focus:border-[#023E8A] focus:ring-4 focus:ring-[#3563A7]/10"
                  />
                </div>

                <div className="rounded-xl border border-[#C8D8E8] bg-[#EAF3F7] p-4 text-xs font-normal leading-relaxed text-[#3563A7]">
                  Em um sistema real, a alteração deverá ser confirmada por
                  meio de uma verificação de segurança.
                </div>

                <button
                  type="submit"
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#3563A7] px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-[#023E8A]"
                >
                  Confirmar novo e-mail
                </button>
              </form>
            )}
          </section>
        </div>
      )}

      {/* Impede que o navegador exiba um segundo ícone de senha. */}
      <style jsx global>{`
        input[type="password"]::-ms-reveal,
        input[type="password"]::-ms-clear {
          display: none;
        }

        input[type="password"]::-webkit-credentials-auto-fill-button {
          visibility: hidden;
          display: none !important;
          pointer-events: none;
        }
      `}</style>
    </main>
  );
}
