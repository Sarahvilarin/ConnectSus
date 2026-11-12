
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import {
  ArrowRight,
  Eye,
  EyeOff,
  LockKeyhole,
  UserRound,
} from "lucide-react";

import AuthShell from "../../components/auth/AuthShell";
import { api } from "../../../lib/api";

export default function LoginProfissionalPage() {
  const router = useRouter();

  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState("");

  const [dados, setDados] = useState({
    registro: "",
    senha: "",
  });

  async function enviarLogin(event) {
    event.preventDefault();

    setErro("");
    setCarregando(true);

    try {
      const resposta = await api("/auth/profissional/login", {
        method: "POST",
        body: JSON.stringify(dados),
      });

      localStorage.setItem("unesus_token", resposta.token);

      localStorage.setItem(
        "unesus_profissional",
        JSON.stringify(resposta.profissional)
      );

      if (resposta.tipo === "medico") {
        router.push("/medico/dashboard");
      } else if (resposta.tipo === "enfermeiro") {
        router.push("/enfermeiro/dashboard");
      } else {
        throw new Error("Tipo de profissional não identificado.");
      }
    } catch (error) {
      setErro(error.message || "Não foi possível realizar o login.");
    } finally {
      setCarregando(false);
    }
  }

  return (
    <AuthShell
      titulo="Cuidar de quem cuida também é prioridade."
      descricao="Acesse sua área profissional e gerencie seus atendimentos, pacientes e serviços da rede pública de saúde em um único lugar."
    >
      <div className="w-full max-w-[530px] font-sans">
        <div
          className="
            mb-5 flex w-fit items-center gap-2 rounded-full
            bg-[#EAF3F7] px-3 py-1.5 text-xs font-semibold
            text-[#023E8A]
          "
        >
          Área do Profissional
        </div>

        <h2 className="text-4xl font-bold text-[#0B1756]">
          Bem-vindo de volta
        </h2>

        <p className="mt-3 text-sm font-normal leading-6 text-slate-500">
          Entre com seu CRM ou Coren e senha para acessar sua conta profissional.
        </p>

        <form onSubmit={enviarLogin}>
          <div className="mt-9">
            <label
              htmlFor="registro"
              className="mb-2 block text-xs font-semibold text-[#0B1756]"
            >
              CRM ou Coren
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
                id="registro"
                type="text"
                value={dados.registro}
                onChange={(event) =>
                  setDados({
                    ...dados,
                    registro: event.target.value,
                  })
                }
                placeholder="Digite seu CRM ou Coren"
                required
                autoComplete="username"
                className={inputClass}
              />
            </div>
          </div>

          <div className="mt-6">
            <div className="mb-2 flex items-center justify-between">
              <label
                htmlFor="senha"
                className="text-xs font-semibold text-[#0B1756]"
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

          <label
            className="
              mt-5 flex w-fit cursor-pointer items-center gap-2
              text-sm font-normal text-slate-500
            "
          >
            <input
              type="checkbox"
              className="
                h-4 w-4 cursor-pointer accent-[#023E8A]
              "
            />

            Manter-me conectado
          </label>

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
              mt-8 flex h-12 w-full items-center justify-center gap-2
              rounded-xl bg-[#023E8A] px-5 text-sm font-semibold
              text-white shadow-sm transition-all duration-200
              hover:-translate-y-0.5 hover:bg-[#0B1756]
              hover:shadow-md disabled:cursor-not-allowed
              disabled:opacity-60
            "
          >
            {carregando ? "Entrando..." : "Entrar no UneSUS"}

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
  font-normal
  text-[#0B1756]
  outline-none
  transition
  placeholder:text-slate-400
  focus:border-[#3563A7]
  focus:bg-white
  focus:ring-4
  focus:ring-[#3563A7]/10
`;
