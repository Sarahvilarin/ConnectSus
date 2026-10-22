"use client";

import { useState } from "react";
import Link from "next/link";

import {
  ArrowRight,
  Eye,
  EyeOff,
  LockKeyhole,
  ShieldCheck,
  UserRound,
} from "lucide-react";

import AuthShell from "../../components/auth/AuthShell";

export default function LoginPage() {
  const [mostrarSenha, setMostrarSenha] = useState(false);

  const [dados, setDados] = useState({
    login: "",
    senha: "",
  });

  function enviarLogin(event) {
    event.preventDefault();

    console.log("LOGIN:", dados);
  }

  function entrarGov() {
    console.log("LOGIN GOV.BR");
  }

  return (
    <AuthShell
      titulo="Sua saúde, mais próxima de você."
      descricao="Acesse consultas, exames, filas e outros serviços da rede pública de saúde em um único lugar."
    >
      <div className="w-full max-w-[530px]">
        <div
          className="
            mb-4
            flex
            w-fit
            items-center
            gap-2
            rounded-full
            bg-[#EAF3F7]
            px-3
            py-1.5
            text-xs
            font-semibold
            text-[#023E8A]
          "
        >
          <ShieldCheck size={15} />

          Área do Paciente
        </div>

        <h2 className="text-3xl font-bold text-[#0B1756]">
          Bem-vindo de volta
        </h2>

        <p className="mt-2 text-sm leading-6 text-slate-500">
          Entre com seu login e senha para acessar sua conta.
        </p>

        {/* GOV.BR */}

        <button
          type="button"
          onClick={entrarGov}
          className="
            mt-6
            flex
            h-12
            w-full
            items-center
            justify-center
            gap-3
            rounded-xl
            border
            border-[#1351B4]
            bg-white
            px-4
            text-sm
            font-semibold
            text-[#1351B4]
            transition-all
            duration-200
            hover:-translate-y-0.5
            hover:bg-[#F3F7FC]
            hover:shadow-sm
          "
        >
          <span
            className="
              flex
              h-7
              w-7
              items-center
              justify-center
              rounded-full
              bg-[#1351B4]
              text-xs
              font-bold
              text-white
            "
          >
            g
          </span>

          Entrar com Gov.br
        </button>

        {/* DIVISOR */}

        <div className="my-5 flex items-center gap-3">
          <div className="h-px flex-1 bg-slate-200" />

          <span className="text-xs text-slate-400">
            ou use sua conta UneSUS
          </span>

          <div className="h-px flex-1 bg-slate-200" />
        </div>

        <form onSubmit={enviarLogin}>
          {/* LOGIN */}

          <div>
            <label
              htmlFor="login"
              className="
                mb-1.5
                block
                text-sm
                font-semibold
                text-[#0B1756]
              "
            >
              Login
            </label>

            <div className="relative">
              <UserRound
                size={18}
                className="
                  absolute
                  left-4
                  top-1/2
                  -translate-y-1/2
                  text-slate-400
                "
              />

              <input
                id="login"
                type="text"
                value={dados.login}
                onChange={(event) =>
                  setDados({
                    ...dados,
                    login: event.target.value,
                  })
                }
                placeholder="Digite seu login"
                required
                autoComplete="username"
                className={inputClass}
              />
            </div>
          </div>

          {/* SENHA */}

          <div className="mt-4">
            <div className="mb-1.5 flex items-center justify-between">
              <label
                htmlFor="senha"
                className="text-sm font-semibold text-[#0B1756]"
              >
                Senha
              </label>

              <Link
                href="/publico/recuperar-senha"
                className="
                  text-xs
                  font-semibold
                  text-[#023E8A]
                  transition
                  hover:underline
                "
              >
                Esqueci minha senha
              </Link>
            </div>

            <div className="relative">
              <LockKeyhole
                size={18}
                className="
                  absolute
                  left-4
                  top-1/2
                  -translate-y-1/2
                  text-slate-400
                "
              />

              <input
                id="senha"
                type={mostrarSenha ? "text" : "password"}
                value={dados.senha}
                onChange={(event) =>
                  setDados({
                    ...dados,
                    senha: event.target.value,
                  })
                }
                placeholder="Digite sua senha"
                required
                autoComplete="current-password"
                className={`${inputClass} pr-12`}
              />

              <button
                type="button"
                onClick={() =>
                  setMostrarSenha(!mostrarSenha)
                }
                aria-label={
                  mostrarSenha
                    ? "Ocultar senha"
                    : "Mostrar senha"
                }
                className="
                  absolute
                  right-4
                  top-1/2
                  -translate-y-1/2
                  text-slate-400
                  transition
                  hover:text-[#023E8A]
                "
              >
                {mostrarSenha ? (
                  <EyeOff size={18} />
                ) : (
                  <Eye size={18} />
                )}
              </button>
            </div>
          </div>

          {/* MANTER CONECTADO */}

          <label
            className="
              mt-3
              flex
              w-fit
              cursor-pointer
              items-center
              gap-2
              text-sm
              text-slate-500
            "
          >
            <input
              type="checkbox"
              className="
                h-4
                w-4
                cursor-pointer
                accent-[#023E8A]
              "
            />

            Manter-me conectado
          </label>

          {/* BOTÃO */}

          <button
            type="submit"
            className="
              mt-6
              flex
              h-12
              w-full
              items-center
              justify-center
              gap-2
              rounded-xl
              bg-[#023E8A]
              px-5
              text-sm
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
            Entrar no UneSUS

            <ArrowRight size={17} />
          </button>
        </form>

        {/* CADASTRO */}

        <div
          className="
            mt-5
            rounded-xl
            border
            border-[#DCEAF8]
            bg-[#F8FBFE]
            p-4
            text-center
          "
        >
          <p className="text-sm text-slate-500">
            Ainda não possui uma conta?
          </p>

          <Link
            href="/publico/cadastro"
            className="
              mt-1
              inline-block
              text-sm
              font-semibold
              text-[#023E8A]
              transition
              hover:underline
            "
          >
            Criar minha conta
          </Link>
        </div>
      </div>
    </AuthShell>
  );
}

const inputClass = `
  h-12
  w-full
  rounded-xl
  border
  border-slate-200
  bg-[#F8FAFD]
  pl-11
  pr-4
  text-sm
  text-[#0B1756]
  outline-none
  transition
  placeholder:text-slate-400

  focus:border-[#3563A7]
  focus:bg-white
  focus:ring-4
  focus:ring-[#3563A7]/10
`;