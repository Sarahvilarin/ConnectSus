"use client";

import Image from "next/image";
import Link from "next/link";

import {
  Activity,
  CalendarCheck,
  FileText,
  HeartPulse,
  ShieldCheck,
} from "lucide-react";

export default function AuthShell({
  children,
  titulo,
  descricao,
}) {
  return (
    <main
      className="
        min-h-[calc(100vh-96px)]
        bg-[#EAF3F7]
        px-4
        py-6
        sm:px-6
      "
    >
      <div
        className="
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

            {/* LOGO */}

            <div className="absolute left-7 top-7">
              <Link
                href="/"
                className="
                  flex
                  items-center
                  gap-2
                  rounded-full
                  border
                  border-white/20
                  bg-white/15
                  px-4
                  py-2
                  text-sm
                  font-semibold
                  text-white
                  backdrop-blur-md
                "
              >
                <HeartPulse size={17} />

                UneSUS
              </Link>
            </div>

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
              <div
                className="
                  mb-4
                  flex
                  w-fit
                  items-center
                  gap-2
                  rounded-full
                  border
                  border-white/20
                  bg-white/10
                  px-3
                  py-1.5
                  text-xs
                  font-semibold
                  text-white
                  backdrop-blur
                "
              >
                <ShieldCheck size={15} />

                Saúde digital com segurança
              </div>

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

              <div
                className="
                  mt-6
                  grid
                  max-w-xl
                  grid-cols-2
                  gap-3
                "
              >
                <Beneficio
                  icon={<CalendarCheck size={17} />}
                  texto="Consultas"
                />

                <Beneficio
                  icon={<FileText size={17} />}
                  texto="Exames"
                />

                <Beneficio
                  icon={<Activity size={17} />}
                  texto="Fila online"
                />

                <Beneficio
                  icon={<HeartPulse size={17} />}
                  texto="Triagem digital"
                />
              </div>
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
                pointer-events-none
                absolute
                -right-24
                -top-24
                h-64
                w-64
                rounded-full
                bg-[#EAF3F7]/80
              "
            />

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

function Beneficio({
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
        border-white/15
        bg-white/10
        px-3
        py-2.5
        text-sm
        font-medium
        text-white
        backdrop-blur-sm
      "
    >
      <div
        className="
          flex
          h-8
          w-8
          items-center
          justify-center
          rounded-lg
          bg-white/10
        "
      >
        {icon}
      </div>

      {texto}
    </div>
  );
}