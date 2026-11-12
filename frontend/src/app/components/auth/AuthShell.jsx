
"use client";

import Image from "next/image";

export default function AuthShell({
  children,
  titulo,
  descricao,
}) {
  return (
    <main
      className="
        relative
        isolate
        min-h-[calc(100vh-96px)]
        overflow-hidden
        bg-[#EAF3F7]
        px-4
        py-6
        sm:px-6
      "
    >
      {/* FUNDO COM ILUSTRAÇÕES DE CÍRCULOS */}

      <div className="pointer-events-none absolute -right-24 -top-28 z-0 h-[340px] w-[340px] rounded-full bg-[#B8D6FC]/50" />

      <div className="pointer-events-none absolute -left-32 top-8 z-0 h-[260px] w-[260px] rounded-full border-2 border-[#C8DEFF]/60" />

      <div className="pointer-events-none absolute -bottom-28 -left-20 z-0 h-[280px] w-[280px] rounded-full bg-white/50" />

      <div className="pointer-events-none absolute -bottom-32 -right-20 z-0 h-[340px] w-[340px] rounded-full border-[55px] border-[#C5DFFF]/50" />

      {/* CARTÃO PRINCIPAL */}

      <div
        className="
          relative
          z-10
          mx-auto
          flex
          min-h-[calc(100vh-144px)]
          max-w-[1280px]
          items-center
          justify-center
        "
      >
        <div
          className="
            grid
            w-full
            min-h-[620px]
            overflow-hidden
            rounded-[28px]
            border
            border-white
            bg-white
            shadow-[0_22px_70px_rgba(2,62,138,0.12)]
            lg:grid-cols-[0.95fr_1.05fr]
          "
        >
          {/* IMAGEM */}

          <section className="relative hidden overflow-hidden lg:block">
            <Image
              src="/auth-saude.jpg"
              alt="Atendimento de saúde"
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
                via-[#023E8A]/55
                to-[#023E8A]/10
              "
            />

            {/* CONTEÚDO */}

            <div
              className="
                absolute
                bottom-0
                left-0
                right-0
                p-9
                xl:p-10
              "
            >
              <h1
                className="
                  max-w-xl
                  text-4xl
                  font-bold
                  leading-tight
                  text-white
                  xl:text-[42px]
                "
              >
                {titulo}
              </h1>

              <p
                className="
                  mt-3
                  max-w-lg
                  text-sm
                  leading-6
                  text-blue-100
                  xl:text-base
                "
              >
                {descricao}
              </p>
            </div>
          </section>

          {/* FORMULÁRIO */}

          <section
            className="
              relative
              flex
              items-center
              justify-center
              px-6
              py-8
              sm:px-10
              lg:px-12
              xl:px-14
            "
          >
            <div
              className="
                relative
                z-10
                w-full
                max-w-[500px]
              "
            >
              {children}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
