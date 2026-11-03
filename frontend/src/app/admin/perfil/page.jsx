
"use client";

import { useRef, useState } from "react";
import { UserRound, Pencil, Eye, EyeOff } from "lucide-react";

export default function PerfilAdminPage() {
  const [nome, setNome] = useState("Administrador UneSUS");
  const [telefone, setTelefone] = useState("(11) 98765-4321");
  const [email, setEmail] = useState("admin@unesus.com.br");
  const [foto, setFoto] = useState("");
  const [modal, setModal] = useState("");
  const [mensagem, setMensagem] = useState("");

  const [nomeEditado, setNomeEditado] = useState(nome);
  const [telefoneEditado, setTelefoneEditado] = useState(telefone);
  const [novoEmail, setNovoEmail] = useState(email);

  const [senhaAtual, setSenhaAtual] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");

  const [mostrarSenhas, setMostrarSenhas] = useState({});

  const inputFoto = useRef(null);

  function mostrarMensagem(texto) {
    setMensagem(texto);
    setTimeout(() => setMensagem(""), 3500);
  }

  function salvarDados(e) {
    e.preventDefault();

    if (!nomeEditado.trim()) {
      mostrarMensagem("Informe o nome do administrador.");
      return;
    }

    setNome(nomeEditado.trim());
    setTelefone(telefoneEditado);
    mostrarMensagem("Dados do administrador atualizados!");
  }

  function selecionarFoto(e) {
    const arquivo = e.target.files?.[0];

    if (!arquivo) return;

    if (!arquivo.type.startsWith("image/")) {
      mostrarMensagem("Selecione uma imagem válida.");
      return;
    }

    if (arquivo.size > 5 * 1024 * 1024) {
      mostrarMensagem("A imagem deve ter no máximo 5 MB.");
      return;
    }

    setFoto(URL.createObjectURL(arquivo));
    mostrarMensagem("Foto de perfil atualizada!");
  }

  function alterarEmail(e) {
    e.preventDefault();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(novoEmail.trim())) {
      mostrarMensagem("Informe um e-mail válido.");
      return;
    }

    setEmail(novoEmail.trim());
    setModal("");
    mostrarMensagem("E-mail atualizado na demonstração!");
  }

  function alterarSenha(e) {
    e.preventDefault();

    if (!senhaAtual || !novaSenha || !confirmarSenha) {
      mostrarMensagem("Preencha todos os campos.");
      return;
    }

    if (novaSenha.length < 8) {
      mostrarMensagem("A senha deve ter pelo menos 8 caracteres.");
      return;
    }

    if (novaSenha !== confirmarSenha) {
      mostrarMensagem("As senhas não correspondem.");
      return;
    }

    setSenhaAtual("");
    setNovaSenha("");
    setConfirmarSenha("");
    setMostrarSenhas({});
    setModal("");

    mostrarMensagem("Validação demonstrativa concluída!");
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#EAF3F7] font-sans text-[#0B1756]">

      {/* Elementos decorativos */}
      <div className="pointer-events-none absolute -right-28 -top-36 h-[430px] w-[430px] rounded-full bg-[#023E8A]/15" />

      <div className="pointer-events-none absolute -left-40 top-10 h-[330px] w-[330px] rounded-full border-2 border-[#3563A7]/20" />

      <div className="pointer-events-none absolute -bottom-36 -left-24 h-[350px] w-[350px] rounded-full bg-white/50" />

      <div className="pointer-events-none absolute -bottom-40 -right-24 h-[430px] w-[430px] rounded-full border-[70px] border-[#023E8A]/15" />

      {/* Conteúdo principal */}
      <div className="relative z-10 mx-auto w-full max-w-[1450px] px-5 pb-10 pt-3 sm:px-8 sm:pt-4 lg:px-12 lg:pt-5">

        {/* Cabeçalho */}
        <header className="mb-6 text-left sm:mb-7">
          <h1 className="text-[36px] font-bold tracking-tight sm:text-[40px] md:text-[42px]">
            Gerenciar seu{" "}
            <span className="text-[#3563A7]">Perfil</span>
          </h1>

          <p className="mt-3 max-w-2xl text-base font-normal leading-relaxed text-[#3563A7]">
            Gerencie suas informações e mantenha sua conta administrativa segura no UneSUS.
          </p>
        </header>

        {/* Resumo do administrador */}
        <section className="mb-8 rounded-[26px] border border-[#3563A7]/25 bg-white/90 p-6 shadow-[0_8px_25px_rgba(53,99,167,0.06)] sm:p-8 lg:px-12 lg:py-7">

          <div className="flex flex-col items-center gap-7 md:flex-row md:gap-10">

            <div className="relative shrink-0">
              <div className="flex h-36 w-36 items-center justify-center overflow-hidden rounded-full bg-[#EAF3F7] ring-8 ring-[#EAF3F7] sm:h-44 sm:w-44">

                {foto ? (
                  <img
                    src={foto}
                    alt="Foto do administrador"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <UserRound
                    size={105}
                    strokeWidth={1.4}
                    className="mt-5 text-[#3563A7]"
                    fill="#3563A7"
                  />
                )}

              </div>

              <button
                type="button"
                onClick={() => inputFoto.current?.click()}
                aria-label="Alterar foto"
                className="absolute bottom-0 right-0 flex h-12 w-12 items-center justify-center rounded-full border-4 border-white bg-[#023E8A] text-white shadow-lg transition hover:scale-105 hover:bg-[#3563A7]"
              >
                <Pencil size={19} />
              </button>

              <input
                ref={inputFoto}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={selecionarFoto}
              />
            </div>

            <div className="hidden h-36 w-px bg-[#023E8A] md:block" />

            <div className="min-w-0 flex-1 text-center md:text-left">

              <div className="mb-2 flex flex-wrap items-center justify-center gap-2 md:justify-start">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#EAF3F7] px-3 py-1 text-xs font-semibold text-[#3563A7]">
                  Administrador
                </span>

                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  Conta ativa
                </span>
              </div>

              <h2 className="text-2xl font-bold tracking-tight">
                Olá, {nome.split(" ")[0]}!
              </h2>

              <p className="mt-2 text-sm font-normal text-[#3563A7] sm:text-base">
                Gerencie seus dados de acesso e informações administrativas.
              </p>

              <div className="mt-6 grid gap-5 sm:grid-cols-2 sm:gap-6">

                <div className="flex min-w-0 items-center gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-normal text-[#3563A7]">
                      Nome completo
                    </p>

                    <p className="mt-1 break-words text-base font-semibold text-[#023E8A]">
                      {nome}
                    </p>
                  </div>
                </div>

                <div className="flex min-w-0 items-center gap-3 sm:pl-5">
                  <div className="min-w-0">
                    <p className="text-sm font-normal text-[#3563A7]">
                      E-mail administrativo
                    </p>

                    <p className="mt-1 break-all text-base font-semibold text-[#023E8A]">
                      {email}
                    </p>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </section>

        {/* Cartões principais */}
        <div className="grid items-stretch gap-6 lg:grid-cols-2">

          {/* Dados pessoais */}
          <section className="rounded-[26px] border border-[#3563A7]/25 bg-white/90 p-6 shadow-[0_8px_25px_rgba(53,99,167,0.06)] sm:p-8">

            <div className="mb-7 flex items-center gap-4">
              <div>
                <h2 className="text-2xl font-bold tracking-tight">
                  Dados do administrador
                </h2>

                <p className="mt-1 text-sm font-normal text-[#3563A7]">
                  Atualize suas informações de contato.
                </p>
              </div>
            </div>

            <form onSubmit={salvarDados} className="space-y-5">

              <div>
                <label
                  htmlFor="nome-admin"
                  className="mb-2 block text-xs font-semibold text-[#023E8A]"
                >
                  Nome completo
                </label>

                <input
                  id="nome-admin"
                  type="text"
                  value={nomeEditado}
                  onChange={(e) => setNomeEditado(e.target.value)}
                  required
                  className="w-full rounded-2xl border border-[#3563A7]/35 bg-[#EAF3F7] px-5 py-4 text-sm font-normal outline-none transition focus:border-[#023E8A] focus:ring-4 focus:ring-[#3563A7]/10"
                  placeholder="Digite seu nome completo"
                />
              </div>

              <div>
                <label
                  htmlFor="telefone-admin"
                  className="mb-2 block text-xs font-semibold text-[#023E8A]"
                >
                  Telefone (opcional)
                </label>

                <div className="flex items-center gap-3 rounded-2xl border border-[#3563A7]/35 bg-[#EAF3F7] px-5 focus-within:border-[#023E8A] focus-within:ring-4 focus-within:ring-[#3563A7]/10">
                  <input
                    id="telefone-admin"
                    type="tel"
                    value={telefoneEditado}
                    onChange={(e) => setTelefoneEditado(e.target.value)}
                    placeholder="(11) 99999-9999"
                    className="min-w-0 flex-1 bg-transparent py-4 text-sm font-normal outline-none"
                  />
                </div>
              </div>

              <div className="rounded-2xl border border-[#3563A7]/20 bg-[#EAF3F7] p-4">
                <div className="flex items-start gap-3">
                  <div>
                    <p className="text-base font-semibold text-[#023E8A]">
                      Tipo de acesso
                    </p>

                    <p className="mt-1 text-sm font-normal text-[#3563A7]">
                      Administrador do sistema UneSUS
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex justify-center pt-2 sm:pt-4">
                <button
                  type="submit"
                  className="inline-flex min-h-14 w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-[#023E8A] to-[#3563A7] px-6 py-4 text-sm font-semibold text-white shadow-[0_8px_18px_rgba(53,99,167,0.20)] transition hover:-translate-y-0.5 hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-[#3563A7]/20 sm:max-w-[260px]"
                >
                  Salvar alterações
                </button>
              </div>

            </form>
          </section>

          {/* Segurança */}
          <section className="rounded-[26px] border border-[#3563A7]/25 bg-white/90 p-6 shadow-[0_8px_25px_rgba(53,99,167,0.06)] sm:p-8">

            <div className="mb-7 flex items-center gap-4">
              <div>
                <h2 className="text-2xl font-bold tracking-tight">
                  Segurança da conta
                </h2>

                <p className="mt-1 text-sm font-normal text-[#3563A7]">
                  Proteja seu acesso administrativo.
                </p>
              </div>
            </div>

            <div className="space-y-4">

              {/* Alterar senha */}
              <div className="flex flex-col gap-4 rounded-[22px] border border-[#3563A7]/20 bg-[#EAF3F7] p-5 sm:p-6 xl:flex-row xl:items-center">

                <div className="flex min-w-0 flex-1 items-center gap-4">
                  <div>
                    <h3 className="text-lg font-bold">
                      Alterar senha
                    </h3>

                    <p className="mt-1 text-sm font-normal leading-relaxed text-[#3563A7]">
                      Atualize sua senha de acesso.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setModal("senha")}
                  className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-2xl border border-[#3563A7] bg-white/60 px-5 py-3 text-sm font-semibold text-[#023E8A] transition hover:bg-[#023E8A] hover:text-white"
                >
                  Alterar senha
                </button>
              </div>

              {/* Alterar e-mail */}
              <div className="flex flex-col gap-4 rounded-[22px] border border-[#3563A7]/20 bg-[#EAF3F7] p-5 sm:p-6 xl:flex-row xl:items-center">

                <div className="flex min-w-0 flex-1 items-center gap-4">
                  <div>
                    <h3 className="text-lg font-bold">
                      Alterar e-mail
                    </h3>

                    <p className="mt-1 text-sm font-normal leading-relaxed text-[#3563A7]">
                      Atualize seu e-mail administrativo.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setNovoEmail(email);
                    setModal("email");
                  }}
                  className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-2xl border border-[#3563A7] bg-white/60 px-5 py-3 text-sm font-semibold text-[#023E8A] transition hover:bg-[#023E8A] hover:text-white"
                >
                  Alterar e-mail
                </button>
              </div>

            </div>

            <div className="mt-5 flex items-start gap-3 rounded-2xl border border-[#3563A7]/20 bg-[#EAF3F7] p-4">
              <p className="text-xs font-normal leading-relaxed text-[#3563A7]">
                O acesso administrativo deve ser protegido. Não compartilhe
                suas credenciais com outras pessoas.
              </p>
            </div>

          </section>
        </div>
      </div>

      {/* Notificação */}
      {mensagem && (
        <div
          role="status"
          className="fixed right-4 top-4 z-[60] flex max-w-[calc(100%-2rem)] items-center gap-3 rounded-2xl border border-[#D3E5D9] bg-white px-5 py-4 text-sm font-medium text-[#245D43] shadow-xl sm:right-6 sm:top-6"
        >
          <span>{mensagem}</span>

          <button
            type="button"
            onClick={() => setMensagem("")}
            aria-label="Fechar mensagem"
            className="ml-2 rounded-lg p-1 hover:bg-slate-100"
          >
            <span className="sr-only">Fechar</span>
          </button>
        </div>
      )}

      {/* Janelas de alteração */}
      {modal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-[#0B1756]/50 p-4 backdrop-blur-sm"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) {
              setModal("");
              setMostrarSenhas({});
            }
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            className="my-auto w-full max-w-md rounded-[28px] border border-[#3563A7]/25 bg-white p-6 shadow-2xl sm:p-8"
          >

            <div className="mb-6 text-center">
              <h2
                id="modal-title"
                className="text-2xl font-bold text-[#0B1756]"
              >
                {modal === "senha" ? "Alterar senha" : "Alterar e-mail"}
              </h2>

              <p className="mt-1 text-sm font-normal text-[#3563A7]">
                Atualize seus dados de acesso.
              </p>
            </div>

            {modal === "senha" ? (
              <form onSubmit={alterarSenha} className="space-y-4">

                {[
                  {
                    id: "senha-atual-admin",
                    label: "Senha atual",
                    value: senhaAtual,
                    setValue: setSenhaAtual,
                  },
                  {
                    id: "nova-senha-admin",
                    label: "Nova senha",
                    value: novaSenha,
                    setValue: setNovaSenha,
                  },
                  {
                    id: "confirmar-senha-admin",
                    label: "Confirmar nova senha",
                    value: confirmarSenha,
                    setValue: setConfirmarSenha,
                  },
                ].map((campo) => (
                  <div key={campo.id}>

                    <label
                      htmlFor={campo.id}
                      className="mb-2 block text-xs font-semibold text-[#023E8A]"
                    >
                      {campo.label}
                    </label>

                    <div className="flex items-center rounded-xl border border-[#3563A7]/35 bg-[#EAF3F7] pr-3 transition focus-within:border-[#023E8A] focus-within:ring-4 focus-within:ring-[#3563A7]/10">

                      <input
                        id={campo.id}
                        type={mostrarSenhas[campo.id] ? "text" : "password"}
                        value={campo.value}
                        onChange={(e) => campo.setValue(e.target.value)}
                        autoComplete="new-password"
                        className="min-w-0 flex-1 rounded-xl bg-transparent px-4 py-3 text-sm font-normal text-[#0B1756] outline-none"
                        placeholder="Digite sua senha"
                        required
                      />

                      <button
                        type="button"
                        onClick={() =>
                          setMostrarSenhas((anterior) => ({
                            ...anterior,
                            [campo.id]: !anterior[campo.id],
                          }))
                        }
                        aria-label={
                          mostrarSenhas[campo.id]
                            ? "Ocultar senha"
                            : "Mostrar senha"
                        }
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-[#3563A7] transition hover:bg-[#D8E7F2]"
                      >
                        {mostrarSenhas[campo.id] ? (
                          <Eye size={19} />
                        ) : (
                          <EyeOff size={19} />
                        )}
                      </button>

                    </div>
                  </div>
                ))}

                <p className="text-xs font-normal text-[#3563A7]">
                  Utilize pelo menos 8 caracteres na nova senha.
                </p>

                <button
                  type="submit"
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#023E8A] px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-[#0B1756]"
                >
                  Confirmar alteração
                </button>

              </form>
            ) : (
              <form onSubmit={alterarEmail} className="space-y-5">

                <div>
                  <label
                    htmlFor="email-atual-admin"
                    className="mb-2 block text-xs font-semibold text-[#023E8A]"
                  >
                    E-mail atual
                  </label>

                  <input
                    id="email-atual-admin"
                    value={email}
                    readOnly
                    className="w-full rounded-xl border border-[#3563A7]/20 bg-[#EAF3F7] px-4 py-3 text-sm font-normal text-[#3563A7] outline-none"
                  />
                </div>

                <div>
                  <label
                    htmlFor="novo-email-admin"
                    className="mb-2 block text-xs font-semibold text-[#023E8A]"
                  >
                    Novo e-mail
                  </label>

                  <input
                    id="novo-email-admin"
                    type="email"
                    value={novoEmail}
                    onChange={(e) => setNovoEmail(e.target.value)}
                    placeholder="admin@exemplo.com"
                    required
                    className="w-full rounded-xl border border-[#3563A7]/35 bg-[#EAF3F7] px-4 py-3 text-sm font-normal outline-none transition focus:border-[#023E8A] focus:ring-4 focus:ring-[#3563A7]/10"
                  />
                </div>

                <button
                  type="submit"
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#023E8A] px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-[#0B1756]"
                >
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
