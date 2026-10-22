"use client";

import { useState } from "react";
import Link from "next/link";

import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  Eye,
  EyeOff,
  KeyRound,
  LockKeyhole,
  Mail,
  ShieldCheck,
} from "lucide-react";

import AuthShell from "../../components/auth/AuthShell";

export default function RecuperarSenhaPage() {
  const [etapa, setEtapa] = useState(1);

  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [mostrarConfirmacao, setMostrarConfirmacao] = useState(false);

  const [dados, setDados] = useState({
    identificacao: "",
    codigo: "",
    novaSenha: "",
    confirmarSenha: "",
  });

  function enviarIdentificacao(event) {
    event.preventDefault();

    console.log("RECUPERAÇÃO:", dados.identificacao);

    setEtapa(2);
  }

  function confirmarCodigo(event) {
    event.preventDefault();

    console.log("CÓDIGO:", dados.codigo);

    setEtapa(3);
  }

  function alterarSenha(event) {
    event.preventDefault();

    if (dados.novaSenha !== dados.confirmarSenha) {
      alert("As senhas não coincidem.");
      return;
    }

    console.log("NOVA SENHA:", dados.novaSenha);

    setEtapa(4);
  }

  return (
    <AuthShell
      titulo="Recupere seu acesso com segurança."
      descricao="Caso tenha esquecido sua senha, o UneSUS ajuda você a recuperar sua conta de forma simples e segura."
    >
      <div className="w-full max-w-[580px]">

        {/* VOLTAR */}

        {etapa !== 4 && (
          <Link
            href="/publico/login"
            className="
              mb-5
              flex
              w-fit
              items-center
              gap-2
              text-sm
              font-semibold
              text-[#023E8A]
              transition-all
              duration-200
              hover:gap-3
            "
          >
            <ArrowLeft size={17} />

            Voltar para o login
          </Link>
        )}

        {/* PROGRESSO */}

        {etapa < 4 && (
          <div className="mb-6 flex items-center">
            <Etapa
              numero="1"
              ativa={etapa >= 1}
              concluida={etapa > 1}
            />

            <Linha ativa={etapa >= 2} />

            <Etapa
              numero="2"
              ativa={etapa >= 2}
              concluida={etapa > 2}
            />

            <Linha ativa={etapa >= 3} />

            <Etapa
              numero="3"
              ativa={etapa >= 3}
              concluida={false}
            />
          </div>
        )}

        {/* ETAPA 1 */}

        {etapa === 1 && (
          <>
            <div
              className="
                mb-5
                flex
                w-fit
                items-center
                gap-2
                rounded-full
                bg-[#EAF3F7]
                px-4
                py-2
                text-sm
                font-semibold
                text-[#023E8A]
              "
            >
              <ShieldCheck size={16} />

              Recuperação de acesso
            </div>

            <h2 className="text-[42px] font-bold leading-tight text-[#0B1756]">
              Esqueceu sua senha?
            </h2>

            <p className="mt-3 text-base leading-6 text-slate-500">
              Informe seu login ou e-mail cadastrado para receber
              um código de recuperação.
            </p>

            <form
              onSubmit={enviarIdentificacao}
              className="mt-7"
            >
              <label
                htmlFor="identificacao"
                className="
                  mb-2
                  block
                  text-sm
                  font-semibold
                  text-[#0B1756]
                "
              >
                Login ou e-mail
              </label>

              <div className="relative">
                <Mail
                  size={19}
                  className="
                    absolute
                    left-4
                    top-1/2
                    -translate-y-1/2
                    text-slate-400
                  "
                />

                <input
                  id="identificacao"
                  type="text"
                  value={dados.identificacao}
                  onChange={(event) =>
                    setDados({
                      ...dados,
                      identificacao: event.target.value,
                    })
                  }
                  placeholder="Digite seu login ou e-mail"
                  required
                  className={inputClass}
                />
              </div>

              <button
                type="submit"
                className={botaoPrincipal}
              >
                Enviar código

                <ArrowRight size={18} />
              </button>
            </form>

            <div
              className="
                mt-6
                rounded-2xl
                border
                border-[#DCEAF8]
                bg-[#F8FBFE]
                p-[22px]
              "
            >
              <div className="flex items-start gap-3">
                <ShieldCheck
                  size={20}
                  className="
                    mt-0.5
                    shrink-0
                    text-[#023E8A]
                  "
                />

                <div>
                  <p className="text-sm font-semibold text-[#0B1756]">
                    Recuperação segura
                  </p>

                  <p className="mt-1 text-sm leading-5 text-slate-500">
                    O código será enviado apenas para um contato
                    já vinculado à sua conta.
                  </p>
                </div>
              </div>
            </div>
          </>
        )}

        {/* ETAPA 2 */}

        {etapa === 2 && (
          <>
            <div
              className="
                mb-5
                flex
                w-fit
                items-center
                gap-2
                rounded-full
                bg-[#EAF3F7]
                px-4
                py-2
                text-sm
                font-semibold
                text-[#023E8A]
              "
            >
              <KeyRound size={16} />

              Verificação de identidade
            </div>

            <h2 className="text-[42px] font-bold leading-tight text-[#0B1756]">
              Confirme o código
            </h2>

            <p className="mt-3 text-base leading-6 text-slate-500">
              Digite o código de 6 dígitos enviado para o contato
              associado à sua conta.
            </p>

            <form
              onSubmit={confirmarCodigo}
              className="mt-7"
            >
              <label
                htmlFor="codigo"
                className="
                  mb-2
                  block
                  text-sm
                  font-semibold
                  text-[#0B1756]
                "
              >
                Código de recuperação
              </label>

              <input
                id="codigo"
                type="text"
                inputMode="numeric"
                value={dados.codigo}
                onChange={(event) =>
                  setDados({
                    ...dados,
                    codigo: event.target.value
                      .replace(/\D/g, "")
                      .slice(0, 6),
                  })
                }
                placeholder="000000"
                maxLength={6}
                required
                className="
                  h-[58px]
                  w-full
                  rounded-xl
                  border
                  border-slate-200
                  bg-[#F8FAFD]
                  px-4
                  text-center
                  text-xl
                  font-semibold
                  tracking-[10px]
                  text-[#0B1756]
                  outline-none
                  transition
                  placeholder:text-slate-300

                  focus:border-[#3563A7]
                  focus:bg-white
                  focus:ring-4
                  focus:ring-[#3563A7]/10
                "
              />

              <button
                type="submit"
                className={botaoPrincipal}
              >
                Confirmar código

                <ArrowRight size={18} />
              </button>
            </form>

            <div
              className="
                mt-6
                rounded-2xl
                border
                border-[#DCEAF8]
                bg-[#F8FBFE]
                p-[22px]
                text-center
              "
            >
              <p className="text-sm text-slate-500">
                Não recebeu o código?
              </p>

              <button
                type="button"
                className="
                  mt-1
                  text-sm
                  font-semibold
                  text-[#023E8A]
                  hover:underline
                "
              >
                Reenviar código
              </button>
            </div>

            <button
              type="button"
              onClick={() => setEtapa(1)}
              className="
                mt-5
                w-full
                text-center
                text-sm
                font-semibold
                text-slate-500
                transition
                hover:text-[#023E8A]
              "
            >
              Usar outro login ou e-mail
            </button>
          </>
        )}

        {/* ETAPA 3 */}

        {etapa === 3 && (
          <>
            <div
              className="
                mb-5
                flex
                w-fit
                items-center
                gap-2
                rounded-full
                bg-[#EAF3F7]
                px-4
                py-2
                text-sm
                font-semibold
                text-[#023E8A]
              "
            >
              <LockKeyhole size={16} />

              Nova senha
            </div>

            <h2 className="text-[42px] font-bold leading-tight text-[#0B1756]">
              Crie uma nova senha
            </h2>

            <p className="mt-3 text-base leading-6 text-slate-500">
              Escolha uma nova senha para acessar sua conta UneSUS.
            </p>

            <form
              onSubmit={alterarSenha}
              className="mt-7"
            >
              {/* NOVA SENHA */}

              <div>
                <label
                  htmlFor="novaSenha"
                  className="
                    mb-2
                    block
                    text-sm
                    font-semibold
                    text-[#0B1756]
                  "
                >
                  Nova senha
                </label>

                <div className="relative">
                  <LockKeyhole
                    size={19}
                    className="
                      absolute
                      left-4
                      top-1/2
                      -translate-y-1/2
                      text-slate-400
                    "
                  />

                  <input
                    id="novaSenha"
                    type={mostrarSenha ? "text" : "password"}
                    value={dados.novaSenha}
                    onChange={(event) =>
                      setDados({
                        ...dados,
                        novaSenha: event.target.value,
                      })
                    }
                    placeholder="Digite sua nova senha"
                    required
                    className={`${inputClass} pr-12`}
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setMostrarSenha(!mostrarSenha)
                    }
                    className={botaoOlho}
                  >
                    {mostrarSenha ? (
                      <EyeOff size={19} />
                    ) : (
                      <Eye size={19} />
                    )}
                  </button>
                </div>
              </div>

              {/* CONFIRMAR */}

              <div className="mt-5">
                <label
                  htmlFor="confirmarSenha"
                  className="
                    mb-2
                    block
                    text-sm
                    font-semibold
                    text-[#0B1756]
                  "
                >
                  Confirmar nova senha
                </label>

                <div className="relative">
                  <LockKeyhole
                    size={19}
                    className="
                      absolute
                      left-4
                      top-1/2
                      -translate-y-1/2
                      text-slate-400
                    "
                  />

                  <input
                    id="confirmarSenha"
                    type={
                      mostrarConfirmacao
                        ? "text"
                        : "password"
                    }
                    value={dados.confirmarSenha}
                    onChange={(event) =>
                      setDados({
                        ...dados,
                        confirmarSenha: event.target.value,
                      })
                    }
                    placeholder="Repita sua nova senha"
                    required
                    className={`${inputClass} pr-12`}
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setMostrarConfirmacao(
                        !mostrarConfirmacao
                      )
                    }
                    className={botaoOlho}
                  >
                    {mostrarConfirmacao ? (
                      <EyeOff size={19} />
                    ) : (
                      <Eye size={19} />
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className={botaoPrincipal}
              >
                Alterar senha

                <ArrowRight size={18} />
              </button>
            </form>

            <div
              className="
                mt-6
                rounded-2xl
                border
                border-[#DCEAF8]
                bg-[#F8FBFE]
                p-[22px]
              "
            >
              <div className="flex items-start gap-3">
                <ShieldCheck
                  size={20}
                  className="
                    mt-0.5
                    shrink-0
                    text-[#023E8A]
                  "
                />

                <div>
                  <p className="text-sm font-semibold text-[#0B1756]">
                    Proteja sua conta
                  </p>

                  <p className="mt-1 text-sm leading-5 text-slate-500">
                    Evite reutilizar sua senha anterior ou
                    compartilhá-la com outras pessoas.
                  </p>
                </div>
              </div>
            </div>
          </>
        )}

        {/* SUCESSO */}

        {etapa === 4 && (
          <div className="py-7 text-center">
            <div
              className="
                mx-auto
                flex
                h-24
                w-24
                items-center
                justify-center
                rounded-full
                bg-emerald-50
                text-emerald-600
              "
            >
              <CheckCircle2 size={44} />
            </div>

            <h2 className="mt-7 text-[42px] font-bold leading-tight text-[#0B1756]">
              Senha alterada
            </h2>

            <p
              className="
                mx-auto
                mt-3
                max-w-md
                text-base
                leading-6
                text-slate-500
              "
            >
              Sua senha foi atualizada com sucesso.
              Agora você já pode acessar sua conta novamente.
            </p>

            <div
              className="
                mx-auto
                mt-6
                flex
                w-fit
                items-center
                gap-2
                rounded-full
                bg-emerald-50
                px-4
                py-2
                text-sm
                font-semibold
                text-emerald-700
              "
            >
              <Check size={17} />

              Acesso recuperado
            </div>

            <Link
              href="/publico/login"
              className="
                mt-7
                flex
                h-[58px]
                w-full
                items-center
                justify-center
                gap-2
                rounded-xl
                bg-[#023E8A]
                text-base
                font-semibold
                text-white
                shadow-sm
                transition-all
                duration-200

                hover:-translate-y-0.5
                hover:bg-[#0B1756]
                hover:shadow-md
              "
            >
              Ir para o login

              <ArrowRight size={18} />
            </Link>
          </div>
        )}
      </div>
    </AuthShell>
  );
}

const inputClass = `
  h-[58px]
  w-full
  rounded-xl
  border
  border-slate-200
  bg-[#F8FAFD]
  pl-12
  pr-4
  text-base
  text-[#0B1756]
  outline-none
  transition
  placeholder:text-slate-400

  focus:border-[#3563A7]
  focus:bg-white
  focus:ring-4
  focus:ring-[#3563A7]/10
`;

const botaoPrincipal = `
  mt-7
  flex
  h-[58px]
  w-full
  items-center
  justify-center
  gap-2
  rounded-xl
  bg-[#023E8A]
  text-base
  font-semibold
  text-white
  shadow-sm
  transition-all
  duration-200

  hover:-translate-y-0.5
  hover:bg-[#0B1756]
  hover:shadow-md
`;

const botaoOlho = `
  absolute
  right-4
  top-1/2
  -translate-y-1/2
  text-slate-400
  transition
  hover:text-[#023E8A]
`;

function Etapa({
  numero,
  ativa,
  concluida,
}) {
  return (
    <div
      className={`
        flex
        h-9
        w-9
        shrink-0
        items-center
        justify-center
        rounded-full
        text-sm
        font-bold
        transition

        ${
          ativa
            ? "bg-[#023E8A] text-white"
            : "bg-slate-100 text-slate-400"
        }
      `}
    >
      {concluida ? (
        <Check size={15} />
      ) : (
        numero
      )}
    </div>
  );
}

function Linha({ ativa }) {
  return (
    <div
      className={`
        mx-2
        h-[2px]
        flex-1
        transition

        ${
          ativa
            ? "bg-[#023E8A]"
            : "bg-slate-200"
        }
      `}
    />
  );
}