"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  HeartPulse,
  HelpCircle,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Send,
  ShieldCheck,
} from "lucide-react";

export default function ContatoPage() {
  const [enviado, setEnviado] = useState(false);

  const [formulario, setFormulario] = useState({
    nome: "",
    email: "",
    assunto: "",
    mensagem: "",
  });

  function alterarCampo(event) {
    const { name, value } = event.target;

    setFormulario((anterior) => ({
      ...anterior,
      [name]: value,
    }));
  }

  function enviarFormulario(event) {
    event.preventDefault();

    console.log("CONTATO:", formulario);

    setEnviado(true);
  }

  function novaMensagem() {
    setEnviado(false);

    setFormulario({
      nome: "",
      email: "",
      assunto: "",
      mensagem: "",
    });
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#EAF3F7]">
      {/* DECORAÇÕES */}

      <div className="pointer-events-none absolute -right-48 -top-48 h-[500px] w-[500px] rounded-full bg-[#B8D6FC]/30" />

      <div className="pointer-events-none absolute -bottom-44 -left-32 h-[400px] w-[400px] rounded-full border-[55px] border-white/40" />

      {/* CONTEÚDO */}

      <div
        className="
          relative
          z-10
          mx-auto
          max-w-[1300px]
          px-4
          py-8
          sm:px-6
          lg:px-8
        "
      >
        {/* =====================================================
            CABEÇALHO
        ====================================================== */}

        <section
          className="
            mb-7
            flex
            flex-col
            justify-between
            gap-5
            lg:flex-row
            lg:items-end
          "
        >
          <div>
            

            <h1
              className="
                mt-3
                text-3xl
                font-bold
                text-[#0B1756]
                sm:text-4xl
              "
            >
              Estamos aqui para ajudar.
            </h1>

            <p
              className="
                mt-2
                max-w-2xl
                text-sm
                leading-6
                text-slate-500
                sm:text-base
              "
            >
              Tire dúvidas, envie sugestões ou fale com nossa equipe
              sobre o uso da plataforma.
            </p>
          </div>

          <div
            className="
              flex
              w-fit
              items-center
              gap-3
              rounded-2xl
              border
              border-white
              bg-white/80
              px-4
              py-3
              shadow-sm
            "
          >
            <div
              className="
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-xl
                bg-[#EAF3F7]
                text-[#023E8A]
              "
            >
              <Clock3 size={19} />
            </div>

            <div>
              <p className="text-xs text-slate-400">
                Horário de atendimento
              </p>

              <p className="text-sm font-semibold text-[#0B1756]">
                Segunda a sexta, das 8h às 17h
              </p>
            </div>
          </div>
        </section>

        {/* =====================================================
            BLOCO PRINCIPAL
        ====================================================== */}

        <section
          className="
            grid
            overflow-hidden
            rounded-[28px]
            border
            border-white
            bg-white
            shadow-[0_20px_60px_rgba(2,62,138,0.10)]
            lg:grid-cols-[0.9fr_1.1fr]
          "
        >
          {/* =================================================
              IMAGEM
          ================================================== */}

          <div className="relative hidden min-h-[650px] overflow-hidden lg:block">
            <Image
              src="/contato-saude.jpg"
              alt="Profissional de saúde atendendo paciente"
              fill
              priority
              className="object-cover"
            />

            <div
              className="
                absolute
                inset-0
                bg-gradient-to-t
                from-[#06194e]/95
                via-[#023E8A]/35
                to-transparent
              "
            />

            {/* TEXTO SOBRE A FOTO */}

            <div
              className="
                absolute
                bottom-0
                left-0
                right-0
                p-8
                xl:p-10
              "
            >
              <div
                className="
                  flex
                  w-fit
                  items-center
                  gap-2
                  rounded-full
                  border
                  border-white/20
                  bg-white/15
                  px-3
                  py-1.5
                  text-xs
                  font-semibold
                  text-white
                  backdrop-blur-md
                "
              >
                <HeartPulse size={15} />

                Saúde mais perto de você
              </div>

              <h2
                className="
                  mt-4
                  max-w-md
                  text-3xl
                  font-bold
                  leading-tight
                  text-white
                  xl:text-4xl
                "
              >
                Informação também faz parte do cuidado.
              </h2>

              <p
                className="
                  mt-3
                  max-w-md
                  text-sm
                  leading-6
                  text-blue-100
                "
              >
                Nossa equipe está disponível para orientar sobre
                acesso, funcionalidades e serviços do UneSUS.
              </p>

              {/* CONTATOS RÁPIDOS */}

              <div className="mt-6 grid gap-3">
                <ContatoImagem
                  icon={<Phone size={17} />}
                  titulo="Telefone"
                  valor="(11) 0000-0000"
                />

                <ContatoImagem
                  icon={<Mail size={17} />}
                  titulo="E-mail"
                  valor="contato@unesus.com.br"
                />

                <ContatoImagem
                  icon={<MapPin size={17} />}
                  titulo="Atendimento"
                  valor="São Caetano do Sul - SP"
                />
              </div>
            </div>
          </div>

          {/* =================================================
              FORMULÁRIO
          ================================================== */}

          <div
            className="
              flex
              min-h-[650px]
              items-center
              px-5
              py-7
              sm:px-8
              lg:px-10
              xl:px-12
            "
          >
            <div className="w-full">
              {!enviado ? (
                <>
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
                    <Send size={14} />

                    Entre em contato
                  </div>

                  <h2 className="text-3xl font-bold text-[#0B1756]">
                    Envie uma mensagem
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    Preencha os campos abaixo. Informe o máximo de
                    detalhes possível para facilitar o atendimento.
                  </p>

                  {/* FORM */}

                  <form
                    onSubmit={enviarFormulario}
                    className="mt-6"
                  >
                    <div
                      className="
                        grid
                        gap-4
                        sm:grid-cols-2
                      "
                    >
                      <Campo
                        label="Nome completo"
                        name="nome"
                        value={formulario.nome}
                        onChange={alterarCampo}
                        placeholder="Digite seu nome"
                      />

                      <Campo
                        label="E-mail"
                        name="email"
                        type="email"
                        value={formulario.email}
                        onChange={alterarCampo}
                        placeholder="exemplo@email.com"
                      />
                    </div>

                    {/* ASSUNTO */}

                    <div className="mt-4">
                      <label
                        htmlFor="assunto"
                        className="
                          mb-1.5
                          block
                          text-sm
                          font-semibold
                          text-[#0B1756]
                        "
                      >
                        Como podemos ajudar?
                      </label>

                      <select
                        id="assunto"
                        name="assunto"
                        value={formulario.assunto}
                        onChange={alterarCampo}
                        required
                        className="
                          h-12
                          w-full
                          cursor-pointer
                          rounded-xl
                          border
                          border-slate-200
                          bg-[#F8FAFD]
                          px-4
                          text-sm
                          text-[#0B1756]
                          outline-none
                          transition

                          focus:border-[#3563A7]
                          focus:bg-white
                          focus:ring-4
                          focus:ring-[#3563A7]/10
                        "
                      >
                        <option value="">
                          Selecione uma opção
                        </option>

                        <option value="conta">
                          Problema com minha conta
                        </option>

                        <option value="fila">
                          Dúvida sobre fila online
                        </option>

                        <option value="consulta">
                          Dúvida sobre consultas
                        </option>

                        <option value="exame">
                          Dúvida sobre exames
                        </option>

                        <option value="unidade">
                          Informações sobre unidades
                        </option>

                        <option value="acessibilidade">
                          Acessibilidade
                        </option>

                        <option value="sugestao">
                          Sugestão
                        </option>

                        <option value="outro">
                          Outro assunto
                        </option>
                      </select>
                    </div>

                    {/* MENSAGEM */}

                    <div className="mt-4">
                      <div className="mb-1.5 flex items-center justify-between">
                        <label
                          htmlFor="mensagem"
                          className="
                            text-sm
                            font-semibold
                            text-[#0B1756]
                          "
                        >
                          Mensagem
                        </label>

                        <span className="text-xs text-slate-400">
                          {formulario.mensagem.length}/500
                        </span>
                      </div>

                      <textarea
                        id="mensagem"
                        name="mensagem"
                        value={formulario.mensagem}
                        onChange={(event) => {
                          if (event.target.value.length <= 500) {
                            alterarCampo(event);
                          }
                        }}
                        placeholder="Conte para nós como podemos ajudar..."
                        required
                        rows={5}
                        className="
                          w-full
                          resize-none
                          rounded-xl
                          border
                          border-slate-200
                          bg-[#F8FAFD]
                          px-4
                          py-3
                          text-sm
                          leading-6
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

                    {/* SEGURANÇA */}

                    <div
                      className="
                        mt-4
                        flex
                        items-start
                        gap-3
                        rounded-xl
                        border
                        border-[#DCEAF8]
                        bg-[#F8FBFE]
                        p-3.5
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
                        Não envie senhas, informações bancárias ou
                        outros dados confidenciais nesta mensagem.
                      </p>
                    </div>

                    {/* ENVIAR */}

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
                        duration-200

                        hover:-translate-y-0.5
                        hover:bg-[#0B1756]
                        hover:shadow-md
                      "
                    >
                      <Send size={17} />

                      Enviar mensagem
                    </button>
                  </form>
                </>
              ) : (
                /* =============================================
                   SUCESSO
                ============================================= */

                <div className="text-center">
                  <div
                    className="
                      mx-auto
                      flex
                      h-20
                      w-20
                      items-center
                      justify-center
                      rounded-full
                      bg-emerald-50
                      text-emerald-600
                    "
                  >
                    <CheckCircle2 size={38} />
                  </div>

                  <h2
                    className="
                      mt-6
                      text-3xl
                      font-bold
                      text-[#0B1756]
                    "
                  >
                    Mensagem enviada!
                  </h2>

                  <p
                    className="
                      mx-auto
                      mt-2
                      max-w-md
                      text-sm
                      leading-6
                      text-slate-500
                    "
                  >
                    Recebemos sua mensagem. Se necessário, nossa equipe
                    entrará em contato através do e-mail informado.
                  </p>

                  <div
                    className="
                      mx-auto
                      mt-5
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
                    <CheckCircle2 size={16} />

                    Solicitação registrada
                  </div>

                  <button
                    type="button"
                    onClick={novaMensagem}
                    className="
                      mt-7
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
                      transition
                      hover:bg-[#0B1756]
                    "
                  >
                    Enviar outra mensagem

                    <ArrowRight size={17} />
                  </button>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* =====================================================
            CARDS INFERIORES
        ====================================================== */}

        <section
          className="
            mt-6
            grid
            gap-4
            md:grid-cols-3
          "
        >
          {/* AJUDA */}

          <Link
            href="/publico/acessibilidade"
            className="
              group
              flex
              items-center
              gap-4
              rounded-2xl
              border
              border-white
              bg-white/90
              p-5
              shadow-sm
              transition-all
              duration-200

              hover:-translate-y-1
              hover:shadow-md
            "
          >
            <div
              className="
                flex
                h-12
                w-12
                shrink-0
                items-center
                justify-center
                rounded-xl
                bg-[#EAF3F7]
                text-[#023E8A]
              "
            >
              <HelpCircle size={22} />
            </div>

            <div>
              <h3 className="font-semibold text-[#0B1756]">
                Acessibilidade e Ajuda
              </h3>

              <p className="mt-1 text-xs leading-5 text-slate-500">
                Encontre respostas e recursos de acessibilidade.
              </p>
            </div>

            <ArrowRight
              size={17}
              className="
                ml-auto
                shrink-0
                text-slate-300
                transition
                group-hover:translate-x-1
                group-hover:text-[#023E8A]
              "
            />
          </Link>

          {/* UNIDADES */}

          <Link
            href="/publico/unidades"
            className="
              group
              flex
              items-center
              gap-4
              rounded-2xl
              border
              border-white
              bg-white/90
              p-5
              shadow-sm
              transition-all
              duration-200

              hover:-translate-y-1
              hover:shadow-md
            "
          >
            <div
              className="
                flex
                h-12
                w-12
                shrink-0
                items-center
                justify-center
                rounded-xl
                bg-[#EAF3F7]
                text-[#023E8A]
              "
            >
              <MapPin size={22} />
            </div>

            <div>
              <h3 className="font-semibold text-[#0B1756]">
                Unidades de saúde
              </h3>

              <p className="mt-1 text-xs leading-5 text-slate-500">
                Consulte unidades, serviços e informações.
              </p>
            </div>

            <ArrowRight
              size={17}
              className="
                ml-auto
                shrink-0
                text-slate-300
                transition
                group-hover:translate-x-1
                group-hover:text-[#023E8A]
              "
            />
          </Link>

          {/* URGÊNCIA */}

          <div
            className="
              flex
              items-center
              gap-4
              rounded-2xl
              border
              border-[#DCEAF8]
              bg-[#F7FBFF]
              p-5
              shadow-sm
            "
          >
            <div
              className="
                flex
                h-12
                w-12
                shrink-0
                items-center
                justify-center
                rounded-xl
                bg-[#023E8A]
                text-white
              "
            >
              <HeartPulse size={22} />
            </div>

            <div>
              <h3 className="font-semibold text-[#0B1756]">
                Precisa de atendimento?
              </h3>

              <p className="mt-1 text-xs leading-5 text-slate-500">
                Em situações de saúde, procure a unidade adequada
                para o seu atendimento.
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

/* ============================================================
   CAMPO
============================================================ */

function Campo({
  label,
  name,
  value,
  onChange,
  placeholder,
  type = "text",
}) {
  return (
    <div>
      <label
        htmlFor={name}
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

      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required
        className="
          h-12
          w-full
          rounded-xl
          border
          border-slate-200
          bg-[#F8FAFD]
          px-4
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
  );
}

/* ============================================================
   CONTATO SOBRE A IMAGEM
============================================================ */

function ContatoImagem({
  icon,
  titulo,
  valor,
}) {
  return (
    <div
      className="
        flex
        items-center
        gap-3
        rounded-xl
        border
        border-white/15
        bg-white/10
        px-4
        py-3
        backdrop-blur-md
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
          rounded-lg
          bg-white/10
          text-white
        "
      >
        {icon}
      </div>

      <div>
        <p className="text-xs text-blue-100">
          {titulo}
        </p>

        <p className="mt-0.5 text-sm font-semibold text-white">
          {valor}
        </p>
      </div>
    </div>
  );
}