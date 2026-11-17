
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import {
  ArrowRight,
  Eye,
  EyeOff,
  LockKeyhole,
  ShieldCheck,
  UserRound,
} from "lucide-react";

import AuthShell from "../../components/auth/AuthShell";
import { api } from "../../../lib/api";

export default function LoginPage() {
  const router = useRouter();

  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState("");

  const [dados, setDados] = useState({
    email: "",
    senha: "",
  });

  async function enviarLogin(event) {
    event.preventDefault();

    setErro("");
    setCarregando(true);

    try {
      const resposta = await api("/auth/admin/login", {
        method: "POST",
        body: JSON.stringify(dados),
      });

      localStorage.setItem("unesus_token", resposta.token);

      localStorage.setItem(
        "unesus_administrador",
        JSON.stringify(resposta.administrador)
      );

      router.push("/admin/dashboard");
    } catch (error) {
      setErro(error.message || "Não foi possível realizar o login.");
    } finally {
      setCarregando(false);
    }
  }

  return (
    <AuthShell
      titulo="Gestão da saúde pública em um só lugar."
      descricao="Acesse as ferramentas de gestão, acompanhamento e organização dos serviços de saúde."
    >
      <div className="w-full max-w-[530px]">
        <div
          className="
            mb-4 flex w-fit items-center gap-2 rounded-full
            bg-[#EAF3F7] px-3 py-1.5 text-xs font-semibold
            text-[#023E8A]
          "
        >
          <ShieldCheck size={15} />
          Área Administrativa
        </div>

        <h2 className="text-3xl font-bold text-[#0B1756]">
          Bem-vindo de volta
        </h2>

        <p className="mt-2 text-sm leading-6 text-slate-500">
          Entre com seu e-mail e senha para acessar o painel administrativo.
        </p>

        <div className="my-5 flex items-center gap-3">
          <div className="h-px flex-1 bg-slate-200" />

          <span className="text-xs text-slate-400">
            Acesse com sua conta administrativa
          </span>

          <div className="h-px flex-1 bg-slate-200" />
        </div>

        <form onSubmit={enviarLogin}>
          <div>
            <label
              htmlFor="email"
              className="mb-1.5 block text-sm font-semibold text-[#0B1756]"
            >
              E-mail
            </label>

            <div className="relative">
              <UserRound
                size={18}
                className="
                  absolute left-4 top-1/2 -translate-y-1/2
                  text-slate-400
                "
              />

              <input
                id="email"
                type="email"
                value={dados.email}
                onChange={(event) =>
                  setDados({
                    ...dados,
                    email: event.target.value,
                  })
                }
                placeholder="Digite seu e-mail"
                required
                autoComplete="username"
                className={inputClass}
              />
            </div>
          </div>

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
                  text-xs font-semibold text-[#023E8A]
                  transition hover:underline
                "
              >
                Esqueci minha senha
              </Link>
            </div>

            <div className="relative">
              <LockKeyhole
                size={18}
                className="
                  absolute left-4 top-1/2 -translate-y-1/2
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
                onClick={() => setMostrarSenha(!mostrarSenha)}
                aria-label={
                  mostrarSenha ? "Ocultar senha" : "Mostrar senha"
                }
                className="
                  absolute right-4 top-1/2 -translate-y-1/2
                  text-slate-400 transition hover:text-[#023E8A]
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

          {erro && (
            <p
              role="alert"
              className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-700"
            >
              {erro}
            </p>
          )}

          <button
            type="submit"
            disabled={carregando}
            className="
              mt-6 flex h-12 w-full items-center justify-center gap-2
              rounded-xl bg-[#023E8A] px-5 text-sm font-semibold
              text-white shadow-sm transition-all duration-200
              hover:-translate-y-0.5 hover:bg-[#0B1756]
              hover:shadow-md disabled:cursor-not-allowed
              disabled:opacity-60
            "
          >
            {carregando ? "Entrando..." : "Acessar painel administrativo"}

            {!carregando && <ArrowRight size={17} />}
          </button>
        </form>
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
