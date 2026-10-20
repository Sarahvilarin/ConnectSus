"use client";

import { useState } from "react";
import Link from "next/link";

import {
  ArrowRight,
  Check,
  Eye,
  EyeOff,
  FileText,
  HeartPulse,
  LockKeyhole,
  ShieldCheck,
  Stethoscope,
  UserRound,
} from "lucide-react";

export default function LoginPage() {
  const [mostrarSenha, setMostrarSenha] = useState(false);

  const [dadosLogin, setDadosLogin] = useState({
    login: "",
    senha: "",
  });

  // =========================================================
  // ENVIA LOGIN
  // =========================================================

  function enviarLogin(event) {
    event.preventDefault();

    console.log("LOGIN:", {
      login: dadosLogin.login,
      senha: dadosLogin.senha,
    });

    // Depois vamos conectar com o backend
  }

  return (
    <main
      className="
        relative
        min-h-[calc(100vh-96px)]
        overflow-hidden
        bg-[#EAF3F7]
      "
    >
      {/* =====================================================
          FUNDO
      ====================================================== */}

      <div
        className="
          pointer-events-none
          absolute
          -right-32
          -top-40
          h-[430px]
          w-[430px]
          rounded-full
          bg-[#B8D6FC]/40
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          -left-40
          bottom-[-120px]
          h-[320px]
          w-[320px]
          rounded-full
          border-[45px]
          border-white/45
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          right-[15%]
          top-[35%]
          h-40
          w-40
          rounded-full
          border
          border-[#C8DEFF]/50
        "
      />

      {/* =====================================================
          CONTAINER CENTRALIZADO
      ====================================================== */}

      <div
        className="
          relative
          z-10
          mx-auto
          flex
          min-h-[calc(100vh-96px)]
          max-w-6xl
          items-center
          justify-center
          px-4
          py-4
          sm:px-6
        "
      >
        {/* =================================================
            PAINEL
        ================================================== */}

        <div
          className="
            grid
            w-full
            min-h-[520px]
            overflow-hidden
            rounded-[28px]
            border
            border-white/80
            bg-white
            shadow-[0_20px_60px_rgba(2,62,138,0.10)]
            lg:grid-cols-[0.8fr_1.2fr]
          "
        >
          {/* =================================================
              LADO ESQUERDO
          ================================================== */}

          <aside
            className="
              relative
              hidden
              overflow-hidden
              bg-[#023E8A]
              p-8
              text-white
              lg:flex
              lg:flex-col
              lg:justify-between
              xl:p-10
            "
          >
            {/* DECORAÇÕES */}

            <div
              className="
                pointer-events-none
                absolute
                -right-32
                -top-32
                h-[340px]
                w-[340px]
                rounded-full
                bg-[#3563A7]/45
              "
            />

            <div
              className="
                pointer-events-none
                absolute
                -bottom-32
                -left-32
                h-[300px]
                w-[300px]
                rounded-full
                border-[48px]
                border-white/10
              "
            />

            <div
              className="
                pointer-events-none
                absolute
                bottom-24
                right-10
                h-24
                w-24
                rounded-full
                border
                border-white/10
              "
            />

            {/* CONTEÚDO */}

            <div className="relative z-10">

              <div
                className="
                  flex
                  w-fit
                  items-center
                  gap-2
                  rounded-full
                  border
                  border-white/15
                  bg-white/10
                  px-3
                  py-1.5
                  text-xs
                  font-semibold
                "
              >
                <HeartPulse size={15} />

                Área do Paciente
              </div>

              <h1
                className="
                  mt-6
                  max-w-sm
                  text-3xl
                  font-bold
                  leading-tight
                  xl:text-4xl
                "
              >
                Sua saúde mais simples e conectada.
              </h1>

              <p
                className="
                  mt-3
                  max-w-sm
                  text-sm
                  leading-6
                  text-blue-100
                "
              >
                Acesse seus serviços de saúde de forma
                rápida, simples e segura.
              </p>

              {/* RECURSOS */}

              <div className="mt-7 grid gap-3">

                <Recurso
                  icon={
                    <Stethoscope size={17} />
                  }
                  texto="Acompanhe suas consultas"
                />

                <Recurso
                  icon={
                    <FileText size={17} />
                  }
                  texto="Consulte seus exames"
                />

                <Recurso
                  icon={
                    <UserRound size={17} />
                  }
                  texto="Acompanhe sua fila online"
                />

                <Recurso
                  icon={
                    <HeartPulse size={17} />
                  }
                  texto="Realize sua triagem"
                />

              </div>

            </div>


            {/* =================================================
                SEGURANÇA
            ================================================== */}

            <div
              className="
                relative
                z-10
                flex
                items-center
                gap-3
                rounded-2xl
                border
                border-white/10
                bg-white/10
                p-4
                mt-3
              "
            >
              <div
                className="
                  flex
                  h-9
                  w-9
                  shrink-0
                  items-center
                  justify-center
                  rounded-xl
                  bg-white/10
                "
              >
                <ShieldCheck size={19} />
              </div>

              <div>

                <p
                  className="
                    text-sm
                    font-semibold
                  "
                >
                  Ambiente protegido
                </p>

                <p
                  className="
                    mt-0.5
                    text-xs
                    text-blue-100
                  "
                >
                  Seus dados são tratados com segurança.
                </p>

              </div>

            </div>

          </aside>


          {/* =================================================
              FORMULÁRIO
          ================================================== */}

          <section
            className="
              flex
              items-center
              justify-center
              p-5
              sm:p-7
              lg:p-8
              xl:px-12
            "
          >
            <form
              onSubmit={enviarLogin}
              className="
                w-full
                max-w-[520px]
              "
            >
              {/* =================================================
                  TÍTULO
              ================================================== */}

              <div>

                <p
                  className="
                    text-sm
                    font-semibold
                    text-[#023E8A]
                  "
                >
                  Acesso UneSUS
                </p>

                <h2
                  className="
                    mt-1
                    text-3xl
                    font-bold
                    text-[#0B1756]
                  "
                >
                  Entrar na sua conta
                </h2>

                <p
                  className="
                    mt-2
                    text-sm
                    text-slate-500
                  "
                >
                  Informe seu login e sua senha para continuar.
                </p>

              </div>


              {/* =================================================
                  LOGIN
              ================================================== */}

              <div className="mt-7">

                <label
                  htmlFor="login"
                  className="
                    mb-2
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
                    value={dadosLogin.login}
                    onChange={(event) =>
                      setDadosLogin({
                        ...dadosLogin,
                        login: event.target.value,
                      })
                    }
                    placeholder="Digite seu login"
                    autoComplete="username"
                    required
                    className="
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
                    "
                  />

                </div>

              </div>


              {/* =================================================
                  SENHA
              ================================================== */}

              <div className="mt-4">

                <div
                  className="
                    mb-2
                    flex
                    items-center
                    justify-between
                  "
                >

                  <label
                    htmlFor="senha"
                    className="
                      text-sm
                      font-semibold
                      text-[#0B1756]
                    "
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
                    type={
                      mostrarSenha
                        ? "text"
                        : "password"
                    }
                    value={dadosLogin.senha}
                    onChange={(event) =>
                      setDadosLogin({
                        ...dadosLogin,
                        senha: event.target.value,
                      })
                    }
                    placeholder="Digite sua senha"
                    autoComplete="current-password"
                    required
                    className="
                      h-12
                      w-full
                      rounded-xl
                      border
                      border-slate-200
                      bg-[#F8FAFD]
                      pl-11
                      pr-11
                      text-sm
                      text-[#0B1756]
                      outline-none
                      transition
                      placeholder:text-slate-400

                      focus:border-[#3563A7]
                      focus:bg-white
                      focus:ring-4
                      focus:ring-[#3563A7]/10
                    "
                  />


                  {/* MOSTRAR SENHA */}

                  <button
                    type="button"
                    onClick={() =>
                      setMostrarSenha(
                        !mostrarSenha
                      )
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


              {/* =================================================
                  MANTER CONECTADO
              ================================================== */}

              <label
                className="
                  mt-4
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


              {/* =================================================
                  BOTÃO
              ================================================== */}

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


              {/* =================================================
                  CADASTRO
              ================================================== */}

              <p
                className="
                  mt-6
                  text-center
                  text-sm
                  text-slate-500
                "
              >
                Ainda não possui uma conta?

                <Link
                  href="/publico/cadastro"
                  className="
                    ml-1
                    font-semibold
                    text-[#023E8A]
                    transition
                    hover:underline
                  "
                >
                  Cadastre-se
                </Link>
              </p>


              {/* =================================================
                  AVISO
              ================================================== */}

              <div
                className="
                  mt-6
                  flex
                  items-start
                  gap-3
                  rounded-xl
                  border
                  border-[#DCEAF8]
                  bg-[#F6FAFE]
                  p-4
                "
              >
                <ShieldCheck
                  size={18}
                  className="
                    mt-0.5
                    shrink-0
                    text-[#023E8A]
                  "
                />

                <p
                  className="
                    text-xs
                    leading-5
                    text-slate-500
                  "
                >
                  Nunca compartilhe seu login ou sua senha
                  com outras pessoas.
                </p>
              </div>

            </form>

          </section>

        </div>

      </div>

    </main>
  );
}


// ============================================================
// RECURSO
// ============================================================

function Recurso({
  icon,
  texto,
}) {
  return (
    <div
      className="
        flex
        items-center
        gap-3
        rounded-xl
        border
        border-white/10
        bg-white/[0.08]
        px-3
        py-2.5
        transition
        hover:bg-white/[0.13]
      "
    >

      <div
        className="
          flex
          h-8
          w-8
          shrink-0
          items-center
          justify-center
          rounded-lg
          bg-white/10
        "
      >
        {icon}
      </div>

      <span
        className="
          text-sm
          font-medium
          text-white
        "
      >
        {texto}
      </span>

      <Check
        size={15}
        className="
          ml-auto
          shrink-0
          text-blue-200
        "
      />

    </div>
  );
}