"use client";

import { useState } from "react";
import Link from "next/link";

import {
  ArrowRight,
  Eye,
  EyeOff,
  FileText,
  LockKeyhole,
  Mail,
  Phone,
  ShieldCheck,
  UserRound,
} from "lucide-react";

import AuthShell from "../../components/auth/AuthShell";

export default function CadastroPage() {
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [mostrarConfirmacao, setMostrarConfirmacao] = useState(false);

  const [dados, setDados] = useState({
    nome: "",
    cpf: "",
    email: "",
    telefone: "",
    login: "",
    senha: "",
    confirmarSenha: "",
  });

  function alterarCampo(event) {
    const { name, value } = event.target;

    setDados({
      ...dados,
      [name]: value,
    });
  }

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

    if (dados.senha !== dados.confirmarSenha) {
      alert("As senhas não coincidem.");
      return;
    }

    console.log("CADASTRO:", dados);
  }

  return (
    <AuthShell
      titulo="Comece a cuidar da sua saúde de forma mais simples."
      descricao="Crie sua conta e tenha acesso aos serviços digitais disponíveis no UneSUS."
    >
      <div className="w-full max-w-[530px]">

        {/* IDENTIFICAÇÃO */}

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

          Primeiro acesso
        </div>

        {/* TÍTULO */}

        <h2 className="text-3xl font-bold text-[#0B1756]">
          Crie sua conta
        </h2>

        <p className="mt-2 text-sm leading-6 text-slate-500">
          Preencha seus dados para acessar o UneSUS.
        </p>

        {/* FORMULÁRIO */}

        <form
          onSubmit={enviarCadastro}
          className="
            mt-5
            grid
            gap-x-4
            gap-y-4
            sm:grid-cols-2
          "
        >
          {/* NOME */}

          <Campo
            label="Nome completo"
            icon={<UserRound size={18} />}
          >
            <input
              name="nome"
              type="text"
              value={dados.nome}
              onChange={alterarCampo}
              placeholder="Seu nome completo"
              required
              className={inputClass}
            />
          </Campo>

          {/* CPF */}

          <Campo
            label="CPF"
            icon={<FileText size={18} />}
          >
            <input
              name="cpf"
              type="text"
              value={dados.cpf}
              onChange={(event) =>
                setDados({
                  ...dados,
                  cpf: formatarCPF(event.target.value),
                })
              }
              placeholder="000.000.000-00"
              maxLength={14}
              required
              className={inputClass}
            />
          </Campo>

          {/* EMAIL */}

          <Campo
            label="E-mail"
            icon={<Mail size={18} />}
          >
            <input
              name="email"
              type="email"
              value={dados.email}
              onChange={alterarCampo}
              placeholder="exemplo@email.com"
              required
              className={inputClass}
            />
          </Campo>

          {/* TELEFONE */}

          <Campo
            label="Telefone"
            icon={<Phone size={18} />}
          >
            <input
              name="telefone"
              type="text"
              value={dados.telefone}
              onChange={(event) =>
                setDados({
                  ...dados,
                  telefone: formatarTelefone(event.target.value),
                })
              }
              placeholder="(11) 99999-9999"
              maxLength={15}
              required
              className={inputClass}
            />
          </Campo>

          {/* LOGIN */}

          <div className="sm:col-span-2">
            <Campo
              label="Login de acesso"
              icon={<UserRound size={18} />}
            >
              <input
                name="login"
                type="text"
                value={dados.login}
                onChange={alterarCampo}
                placeholder="Ex.: pedro123"
                required
                autoComplete="username"
                className={inputClass}
              />
            </Campo>

            <p className="mt-1.5 text-xs text-slate-400">
              Esse será o login utilizado para acessar sua conta.
            </p>
          </div>

          {/* SENHA */}

          <Campo
            label="Senha"
            icon={<LockKeyhole size={18} />}
          >
            <input
              name="senha"
              type={mostrarSenha ? "text" : "password"}
              value={dados.senha}
              onChange={alterarCampo}
              placeholder="Crie uma senha"
              required
              autoComplete="new-password"
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
                <EyeOff size={18} />
              ) : (
                <Eye size={18} />
              )}
            </button>
          </Campo>

          {/* CONFIRMAR SENHA */}

          <Campo
            label="Confirmar senha"
            icon={<LockKeyhole size={18} />}
          >
            <input
              name="confirmarSenha"
              type={
                mostrarConfirmacao
                  ? "text"
                  : "password"
              }
              value={dados.confirmarSenha}
              onChange={alterarCampo}
              placeholder="Repita sua senha"
              required
              autoComplete="new-password"
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
                <EyeOff size={18} />
              ) : (
                <Eye size={18} />
              )}
            </button>
          </Campo>

          {/* TERMOS */}

          <label
            className="
              flex
              cursor-pointer
              items-start
              gap-2.5
              text-xs
              leading-5
              text-slate-500
              sm:col-span-2
            "
          >
            <input
              type="checkbox"
              required
              className="
                mt-0.5
                h-4
                w-4
                shrink-0
                cursor-pointer
                accent-[#023E8A]
              "
            />

            <span>
              Li e concordo com a{" "}
              <Link
                href="/publico/privacidade"
                className="
                  font-semibold
                  text-[#023E8A]
                  hover:underline
                "
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
              flex
              h-12
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
              duration-200

              hover:-translate-y-0.5
              hover:bg-[#0B1756]
              hover:shadow-md

              sm:col-span-2
            "
          >
            Criar minha conta

            <ArrowRight size={17} />
          </button>
        </form>

        {/* LOGIN */}

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
            Já possui uma conta?
          </p>

          <Link
            href="/publico/login"
            className="
              mt-1
              inline-block
              text-sm
              font-semibold
              text-[#023E8A]
              hover:underline
            "
          >
            Entrar na minha conta
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

const botaoOlho = `
  absolute
  right-4
  top-1/2
  -translate-y-1/2
  text-slate-400
  transition
  hover:text-[#023E8A]
`;

function Campo({
  label,
  icon,
  children,
}) {
  return (
    <div>
      <label
        className="
          mb-1.5
          block
          text-sm
          font-semibold
          text-[#0B1756]
        "
      >
        {label}
      </label>

      <div className="relative">
        <div
          className="
            pointer-events-none
            absolute
            left-4
            top-1/2
            z-10
            -translate-y-1/2
            text-slate-400
          "
        >
          {icon}
        </div>

        {children}
      </div>
    </div>
  );
}