import Image from 'next/image'

export default function Page() {
  return (
    <main className="flex flex-col w-screen h-screen justify-center items-center">
      <div className="w-full h-full flex flex-col items-center justify-center">
        <Image
          src="/bg-paper.jpg"
          alt=""
          aria-hidden
          fill
          priority
          sizes="(max-width: 640px) 100vw, 640px"
          className="object-cover object-center -z-10 pointer-events-none"
        />
        <h1 className="bold700 text-5xl text-center animate-pulse">
          Work In Progress …
        </h1>
      </div>
    </main>
  )
}
