import Image from 'next/image'
import { Icon } from '@iconify/react'

export default function Page() {
  return (
    <main className="flex flex-col w-screen h-screen justify-center items-center">
      <div
        className="w-full max-w-[640px] h-full p-[3vh] border-2 border-black flex flex-col items-center justify-center"
        style={{
          backgroundImage: "url('/bg-paper.jpg')",
          filter: 'brightness(1.2)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="mb-2 mx-auto aspect-square h-[25vh] max-h-[275px] rounded-full border-2 border-black overflow-hidden">
          <Image
            src="/profile.jpg"
            alt="Profile picture of Alex Passalis"
            loading="eager"
            decoding="async"
            priority
            width={1008}
            height={1344}
            className="w-full h-full object-cover object-center transform scale-125"
          />
        </div>
        <h1 className="bold700 text-3xl text-center">Alex Passalis</h1>
        <h2 className="mb-1 mediumItalic text-xl text-center">
          software developer
        </h2>
        <p className="text-xl">Websites and Automations.</p>

        <section className="mt-[3vh] w-[75%] max-w-[375px] text-white text-2xl flex flex-col gap-[2vh]">
          <a
            href="https://www.linkedin.com/in/alex-passalis"
            className="noise-btn bg-noise p-[1vh] inline-flex justify-center items-center gap-1"
          >
            Linkedin
            <Icon icon="mdi:linkedin" width={35} height={35} />
          </a>
          <a
            href="https://github.com/AlexPassalis"
            className="noise-btn bg-noise p-[1vh] inline-flex justify-center items-center gap-1"
          >
            GitHub
            <Icon icon="mdi:github" width={35} height={35} />
          </a>
          <a
            href="https://www.facebook.com/alexander.passalis/"
            className="noise-btn bg-noise p-[1vh] inline-flex justify-center items-center gap-1"
          >
            Facebook
            <Icon icon="mdi:facebook" width={35} height={35} />
          </a>
          <a
            href="https://www.instagram.com/alex_passalis"
            className="noise-btn bg-noise p-[1vh] inline-flex justify-center items-center gap-1"
          >
            Instagram
            <Icon icon="mdi:instagram" width={35} height={35} />
          </a>
        </section>
      </div>
    </main>
  )
}
