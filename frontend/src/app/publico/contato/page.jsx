"use client";

import { useState } from "react";

import {
  ArrowRight,
  CheckCircle2,
  Clock,
  HeartPulse,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Send,
} from "lucide-react";

export default function ContatoPage() {
  const [enviado, setEnviado] =
    useState(false);

  const [formulario, setFormulario] =
    useState({
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

    console.log(
      "CONTATO:",
      formulario
    );

    setEnviado(true);

    // Futuramente aqui você envia para o backend.
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

      <div className="pointer-events-none absolute -right-32 -top-40 h-[430px] w-[430px] rounded-full bg-[#B8D6FC]/45" />

      <div className="pointer-events-none absolute -left-40 top-28 h-[300px] w-[300px] rounded-full border-2 border-[#C8DEFF]/60" />

      <div className="pointer-events-none absolute -bottom-40 right-10 h-[360px] w-[360px] rounded-full border-[60px] border-white/40" />

      {/* =====================================================
          CONTEÚDO
      ====================================================== */}

      <div
        className="
          relative
          z-10
          mx-auto
          max-w-[1250px]
          px-4
          py-7
          sm:px-6
          lg:px-8
        "
      >
        {/* =================================================
            TOPO
        ================================================== */}

        <section
          className="
            mb-6
            flex
            flex-col
            justify-between
            gap-4
            md:flex-row
            md:items-end
          "
        >
          <div>

            

            <h1
              className="
                mt-3
                text-3xl
                font-bold
                text-[#0B1756]
                md:text-4xl
              "
            >
              Como podemos ajudar?
            </h1>

            <p
              className="
                mt-2
                max-w-2xl
                text-sm
                leading-6
                text-slate-500
                md:text-base
              "
            >
              Fale com nossa equipe para tirar dúvidas,
              enviar sugestões ou solicitar ajuda com o UneSUS.
            </p>

          </div>

          <div
            className="
              flex
              items-center
              gap-2
              rounded-xl
              border
              border-white/80
              bg-white/70
              px-4
              py-2.5
              text-sm
              text-slate-500
              shadow-sm
            "
          >
            <Clock
              size={17}
              className="text-[#023E8A]"
            />

            Atendimento de segunda a sexta
          </div>

        </section>

        {/* =================================================
            GRID
        ================================================== */}

        <section
          className="
            grid
            gap-5
            lg:grid-cols-[0.75fr_1.25fr]
          "
        >
          {/* =================================================
              INFORMAÇÕES
          ================================================== */}

          <div className="grid gap-4">

            <ContatoCard
              icon={<Phone size={20} />}
              titulo="Telefone"
              texto="Fale com nossa equipe de atendimento."
              destaque="(11) 0000-0000"
            />

            <ContatoCard
              icon={<Mail size={20} />}
              titulo="E-mail"
              texto="Envie sua dúvida ou sugestão."
              destaque="contato@unesus.com.br"
            />

            <ContatoCard
              icon={<MapPin size={20} />}
              titulo="Atendimento"
              texto="Rede pública municipal de saúde."
              destaque="São Caetano do Sul - SP"
            />

            {/* AJUDA RÁPIDA */}

            <div
              className="
                relative
                overflow-hidden
                rounded-2xl
                bg-[#023E8A]
                p-5
                text-white
                shadow-sm
              "
            >
              <div
                className="
                  pointer-events-none
                  absolute
                  -right-16
                  -top-20
                  h-48
                  w-48
                  rounded-full
                  bg-white/10
                "
              />

              <div className="relative z-10">

                <div
                  className="
                    flex
                    h-10
                    w-10
                    items-center
                    justify-center
                    rounded-xl
                    bg-white/10
                  "
                >
                  <MessageCircle
                    size={20}
                  />
                </div>

                <h2
                  className="
                    mt-4
                    text-lg
                    font-bold
                  "
                >
                  Precisa de ajuda rápida?
                </h2>

                <p
                  className="
                    mt-1
                    text-sm
                    leading-6
                    text-blue-100
                  "
                >
                  Antes de enviar uma mensagem,
                  você também pode consultar nossa
                  área de acessibilidade e ajuda.
                </p>

                <a
                  href="/publico/acessibilidade"
                  className="
                    mt-4
                    flex
                    w-fit
                    items-center
                    gap-2
                    text-sm
                    font-semibold
                    text-white
                    transition
                    hover:gap-3
                  "
                >
                  Acessar ajuda

                  <ArrowRight size={16} />
                </a>

              </div>
            </div>

          </div>

          {/* =================================================
              FORMULÁRIO
          ================================================== */}

          <div
            className="
              rounded-[26px]
              border
              border-white/80
              bg-white/95
              p-5
              shadow-[0_15px_45px_rgba(2,62,138,0.08)]
              sm:p-7
              lg:p-8
            "
          >
            {!enviado ? (
              <>
                <div>

                  <p
                    className="
                      text-sm
                      font-semibold
                      text-[#023E8A]
                    "
                  >
                    Entre em contato
                  </p>

                  <h2
                    className="
                      mt-1
                      text-2xl
                      font-bold
                      text-[#0B1756]
                    "
                  >
                    Envie uma mensagem
                  </h2>

                  <p
                    className="
                      mt-1
                      text-sm
                      text-slate-500
                    "
                  >
                    Preencha os campos abaixo e nossa equipe
                    poderá retornar seu contato.
                  </p>

                </div>

                <form
                  onSubmit={enviarFormulario}
                  className="mt-6"
                >
                  {/* NOME + EMAIL */}

                  <div
                    className="
                      grid
                      gap-4
                      sm:grid-cols-2
                    "
                  >
                    <Campo
                      label="Nome"
                      name="nome"
                      value={formulario.nome}
                      onChange={alterarCampo}
                      placeholder="Seu nome"
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
                      Assunto
                    </label>

                    <select
                      id="assunto"
                      name="assunto"
                      value={formulario.assunto}
                      onChange={alterarCampo}
                      required
                      className="
                        h-11
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
                        focus:border-[#3563A7]
                        focus:ring-4
                        focus:ring-[#3563A7]/10
                      "
                    >
                      <option value="">
                        Selecione um assunto
                      </option>

                      <option value="duvida">
                        Dúvida sobre o UneSUS
                      </option>

                      <option value="conta">
                        Problema com minha conta
                      </option>

                      <option value="atendimento">
                        Atendimento de saúde
                      </option>

                      <option value="acessibilidade">
                        Acessibilidade
                      </option>

                      <option value="sugestao">
                        Sugestão
                      </option>

                      <option value="outro">
                        Outro
                      </option>
                    </select>

                  </div>

                  {/* MENSAGEM */}

                  <div className="mt-4">

                    <label
                      htmlFor="mensagem"
                      className="
                        mb-1.5
                        block
                        text-sm
                        font-semibold
                        text-[#0B1756]
                      "
                    >
                      Mensagem
                    </label>

                    <textarea
                      id="mensagem"
                      name="mensagem"
                      value={formulario.mensagem}
                      onChange={alterarCampo}
                      placeholder="Explique como podemos ajudar..."
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
                        text-[#0B1756]
                        outline-none
                        transition
                        placeholder:text-slate-400
                        focus:border-[#3563A7]
                        focus:ring-4
                        focus:ring-[#3563A7]/10
                      "
                    />

                  </div>

                  {/* BOTÃO */}

                  <button
                    type="submit"
                    className="
                      mt-5
                      flex
                      h-11
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
                    <Send size={17} />

                    Enviar mensagem
                  </button>

                </form>
              </>
            ) : (

              /* =============================================
                  MENSAGEM ENVIADA
              ============================================== */

              <div
                className="
                  flex
                  min-h-[430px]
                  flex-col
                  items-center
                  justify-center
                  text-center
                "
              >
                <div
                  className="
                    flex
                    h-16
                    w-16
                    items-center
                    justify-center
                    rounded-full
                    bg-emerald-50
                    text-emerald-600
                  "
                >
                  <CheckCircle2
                    size={32}
                  />
                </div>

                <h2
                  className="
                    mt-5
                    text-2xl
                    font-bold
                    text-[#0B1756]
                  "
                >
                  Mensagem enviada
                </h2>

                <p
                  className="
                    mt-2
                    max-w-sm
                    text-sm
                    leading-6
                    text-slate-500
                  "
                >
                  Recebemos sua mensagem. Nossa equipe poderá
                  entrar em contato pelo e-mail informado.
                </p>

                <button
                  type="button"
                  onClick={() => {
                    setEnviado(false);

                    setFormulario({
                      nome: "",
                      email: "",
                      assunto: "",
                      mensagem: "",
                    });
                  }}
                  className="
                    mt-5
                    rounded-xl
                    border
                    border-[#023E8A]
                    px-5
                    py-2.5
                    text-sm
                    font-semibold
                    text-[#023E8A]
                    transition
                    hover:bg-[#EAF3F7]
                  "
                >
                  Enviar outra mensagem
                </button>

              </div>
            )}
          </div>

        </section>

      </div>

    </main>
  );
}


// ============================================================
// CAMPO
// ============================================================

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
          h-11
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
          focus:ring-4
          focus:ring-[#3563A7]/10
        "
      />

    </div>
  );
}


// ============================================================
// CARD DE CONTATO
// ============================================================

function ContatoCard({
  icon,
  titulo,
  texto,
  destaque,
}) {
  return (
    <div
      className="
        flex
        items-center
        gap-4
        rounded-2xl
        border
        border-white/80
        bg-white/90
        p-4
        shadow-sm
        transition-all
        hover:-translate-y-0.5
        hover:shadow-md
      "
    >
      <div
        className="
          flex
          h-11
          w-11
          shrink-0
          items-center
          justify-center
          rounded-xl
          bg-[#EAF3F7]
          text-[#023E8A]
        "
      >
        {icon}
      </div>

      <div className="min-w-0">

        <h2
          className="
            text-sm
            font-bold
            text-[#0B1756]
          "
        >
          {titulo}
        </h2>

        <p
          className="
            mt-0.5
            text-xs
            text-slate-500
          "
        >
          {texto}
        </p>

        <p
          className="
            mt-1
            truncate
            text-sm
            font-semibold
            text-[#023E8A]
          "
        >
          {destaque}
        </p>

      </div>
    </div>
  );
}