"use client";

import { useState } from "react";
import Link from "next/link";

import {
  ArrowRight,
  Eye,
  EyeOff,
  FileText,
  HeartPulse,
  LockKeyhole,
  Mail,
  Phone,
  ShieldCheck,
  UserRound,
  Check,
} from "lucide-react";

export default function CadastroPage() {
  const [mostrarSenha, setMostrarSenha] =
    useState(false);

  const [mostrarConfirmacao, setMostrarConfirmacao] =
    useState(false);

  const [cadastro, setCadastro] = useState({
    nome: "",
    cpf: "",
    email: "",
    telefone: "",
    senha: "",
    confirmarSenha: "",
  });

  function formatarCPF(valor) {
    return valor
      .replace(/\D/g, "")
      .slice(0, 11)
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  }

  function formatarTelefone(valor) {
    const numeros = valor
      .replace(/\D/g, "")
      .slice(0, 11);

    if (numeros.length <= 10) {
      return numeros
        .replace(/(\d{2})(\d)/, "($1) $2")
        .replace(/(\d{4})(\d)/, "$1-$2");
    }

    return numeros
      .replace(/(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{5})(\d)/, "$1-$2");
  }

  function enviarCadastro(event) {
    event.preventDefault();

    if (
      cadastro.senha !==
      cadastro.confirmarSenha
    ) {
      alert("As senhas não coincidem.");
      return;
    }

    console.log("CADASTRO:", cadastro);
  }

  return (
    <main className="relative min-h-[calc(100vh-96px)] overflow-hidden bg-[#EAF3F7]">

      {/* FUNDO */}

      <div className="pointer-events-none absolute -right-32 -top-40 h-[430px] w-[430px] rounded-full bg-[#B8D6FC]/40" />

      <div className="pointer-events-none absolute -left-40 bottom-[-120px] h-[320px] w-[320px] rounded-full border-[45px] border-white/45" />

      {/* CONTAINER */}

      <div className="relative z-10 mx-auto flex min-h-[calc(100vh-96px)] max-w-6xl items-center justify-center px-4 py-4 sm:px-6">

        <div className="grid w-full min-h-[545px] overflow-hidden rounded-[28px] border border-white/80 bg-white shadow-[0_20px_60px_rgba(2,62,138,0.10)] lg:grid-cols-[0.8fr_1.2fr]">

          {/* LADO ESQUERDO */}

          <aside className="relative hidden overflow-hidden bg-[#023E8A] p-8 text-white lg:flex lg:flex-col lg:justify-between xl:p-10">

            <div className="pointer-events-none absolute -right-32 -top-32 h-[340px] w-[340px] rounded-full bg-[#3563A7]/45" />

            <div className="pointer-events-none absolute -bottom-32 -left-32 h-[300px] w-[300px] rounded-full border-[48px] border-white/10" />

            <div className="relative z-10">

              <div className="flex w-fit items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-semibold">
                <HeartPulse size={15} />
                Primeiro acesso
              </div>

              <h1 className="mt-6 max-w-sm text-3xl font-bold leading-tight xl:text-4xl">
                Faça parte do UneSUS.
              </h1>

              <p className="mt-3 max-w-sm text-sm leading-6 text-blue-100">
                Crie sua conta e tenha acesso aos serviços digitais da
                rede pública de saúde.
              </p>

              <div className="mt-7 grid gap-3">

                <Recurso texto="Acesse suas consultas" />

                <Recurso texto="Acompanhe seus exames" />

                <Recurso texto="Use a fila online" />

                <Recurso texto="Realize sua triagem" />

              </div>

            </div>

            <div className="relative z-10 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/10 p-4 mt-3">

              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10">
                <ShieldCheck size={19} />
              </div>

              <div>
                <p className="text-sm font-semibold">
                  Cadastro seguro
                </p>

                <p className="mt-0.5 text-xs text-blue-100">
                  Seus dados são protegidos e utilizados apenas
                  para os serviços de saúde.
                </p>
              </div>

            </div>

          </aside>

          {/* CADASTRO */}

          <section className="flex items-center justify-center p-5 sm:p-7 lg:p-8 xl:px-12">

            <form
              onSubmit={enviarCadastro}
              className="w-full max-w-[570px]"
            >

              <div>
                <p className="text-sm font-semibold text-[#023E8A]">
                  Primeiro acesso
                </p>

                <h2 className="mt-1 text-3xl font-bold text-[#0B1756]">
                  Crie sua conta
                </h2>

                <p className="mt-2 text-sm text-slate-500">
                  Preencha seus dados para começar a utilizar o UneSUS.
                </p>
              </div>

              {/* CAMPOS */}

              <div className="mt-6 grid gap-x-4 gap-y-4 sm:grid-cols-2">

                <Campo
                  label="Nome completo"
                  icon={<UserRound size={17} />}
                >
                  <input
                    type="text"
                    value={cadastro.nome}
                    onChange={(event) =>
                      setCadastro({
                        ...cadastro,
                        nome: event.target.value,
                      })
                    }
                    placeholder="Seu nome"
                    required
                    className={inputClass}
                  />
                </Campo>

                <Campo
                  label="CPF"
                  icon={<FileText size={17} />}
                >
                  <input
                    type="text"
                    value={cadastro.cpf}
                    onChange={(event) =>
                      setCadastro({
                        ...cadastro,
                        cpf: formatarCPF(
                          event.target.value
                        ),
                      })
                    }
                    placeholder="000.000.000-00"
                    maxLength={14}
                    required
                    className={inputClass}
                  />
                </Campo>

                <Campo
                  label="E-mail"
                  icon={<Mail size={17} />}
                >
                  <input
                    type="email"
                    value={cadastro.email}
                    onChange={(event) =>
                      setCadastro({
                        ...cadastro,
                        email: event.target.value,
                      })
                    }
                    placeholder="nome@email.com"
                    required
                    className={inputClass}
                  />
                </Campo>

                <Campo
                  label="Telefone"
                  icon={<Phone size={17} />}
                >
                  <input
                    type="text"
                    value={cadastro.telefone}
                    onChange={(event) =>
                      setCadastro({
                        ...cadastro,
                        telefone:
                          formatarTelefone(
                            event.target.value
                          ),
                      })
                    }
                    placeholder="(11) 99999-9999"
                    maxLength={15}
                    required
                    className={inputClass}
                  />
                </Campo>

                <Campo
                  label="Senha"
                  icon={<LockKeyhole size={17} />}
                >
                  <input
                    type={
                      mostrarSenha
                        ? "text"
                        : "password"
                    }
                    value={cadastro.senha}
                    onChange={(event) =>
                      setCadastro({
                        ...cadastro,
                        senha: event.target.value,
                      })
                    }
                    placeholder="Crie uma senha"
                    required
                    className={`${inputClass} pr-10`}
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setMostrarSenha(!mostrarSenha)
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#023E8A]"
                  >
                    {mostrarSenha ? (
                      <EyeOff size={17} />
                    ) : (
                      <Eye size={17} />
                    )}
                  </button>

                </Campo>

                <Campo
                  label="Confirmar senha"
                  icon={<LockKeyhole size={17} />}
                >
                  <input
                    type={
                      mostrarConfirmacao
                        ? "text"
                        : "password"
                    }
                    value={
                      cadastro.confirmarSenha
                    }
                    onChange={(event) =>
                      setCadastro({
                        ...cadastro,
                        confirmarSenha:
                          event.target.value,
                      })
                    }
                    placeholder="Repita a senha"
                    required
                    className={`${inputClass} pr-10`}
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setMostrarConfirmacao(
                        !mostrarConfirmacao
                      )
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#023E8A]"
                  >
                    {mostrarConfirmacao ? (
                      <EyeOff size={17} />
                    ) : (
                      <Eye size={17} />
                    )}
                  </button>

                </Campo>

              </div>

              {/* PRIVACIDADE */}

              <label className="mt-5 flex cursor-pointer items-start gap-2.5 text-xs leading-5 text-slate-500">

                <input
                  type="checkbox"
                  required
                  className="mt-0.5 h-4 w-4 shrink-0 accent-[#023E8A]"
                />

                <span>
                  Li e concordo com a{" "}
                  <Link
                    href="/publico/privacidade"
                    className="font-semibold text-[#023E8A] hover:underline"
                  >
                    Política de Privacidade
                  </Link>
                  .
                </span>

              </label>

              {/* BOTÃO */}

              <button
                type="submit"
                className="
                  mt-5
                  flex
                  h-12
                  w-full
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                  bg-[#023E8A]
                  text-sm
                  font-semibold
                  text-white
                  shadow-sm
                  transition-all
                  hover:-translate-y-0.5
                  hover:bg-[#0B1756]
                  hover:shadow-md
                "
              >
                Criar minha conta
                <ArrowRight size={17} />
              </button>

              {/* LOGIN */}

              <p className="mt-5 text-center text-sm text-slate-500">
                Já possui uma conta?

                <Link
                  href="/publico/login"
                  className="ml-1 font-semibold text-[#023E8A] hover:underline"
                >
                  Entrar
                </Link>
              </p>

            </form>

          </section>

        </div>

      </div>

    </main>
  );
}

const inputClass = `
  h-11
  w-full
  rounded-xl
  border
  border-slate-200
  bg-[#F8FAFD]
  pl-10
  pr-3
  text-sm
  text-[#0B1756]
  outline-none
  transition
  placeholder:text-slate-400
  focus:border-[#3563A7]
  focus:ring-4
  focus:ring-[#3563A7]/10
`;

function Campo({
  label,
  icon,
  children,
}) {
  return (
    <div>

      <label className="mb-1.5 block text-xs font-semibold text-[#0B1756]">
        {label}
      </label>

      <div className="relative">

        <div className="pointer-events-none absolute left-3.5 top-1/2 z-10 -translate-y-1/2 text-slate-400">
          {icon}
        </div>

        {children}

      </div>

    </div>
  );
}

function Recurso({ texto }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.08] px-3 py-2.5">

      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10">
        <Check size={14} />
      </div>

      <span className="text-sm font-medium text-white">
        {texto}
      </span>

    </div>
  );
}