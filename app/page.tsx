export default function Page() {
  return (
    <main className="flex flex-col w-screen h-screen justify-center items-center">
      <div
        className="w-full h-full flex flex-col items-center justify-center filter brightness-125 bg-cover bg-center"
        style={{
          backgroundImage: "url('/bg-paper.jpg')",
          filter: 'brightness(1.2)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <h1 className="bold700 text-5xl text-center animate-pulse">
          Work In Progress …
        </h1>
      </div>
    </main>
  )
}
