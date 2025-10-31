import Image from 'next/image';

export default function Home() {
  return (
    <div className="relative min-h-screen w-full flex justify-center items-center overflow-hidden">
      {/* Immagine di sfondo */}
      <Image
        src="/assets/hero.jpg" // Sostituisci con il percorso corretto della tua immagine
        alt="Background"
        layout="fill"
        objectFit="cover"
        quality={100}
        className="z-0"
      />
            {/* Overlay scuro sopra l'immagine */}
      <div className="absolute inset-0 bg-black opacity-50 z-0" />

      {/* Testo sopra l'immagine */}
      <div className='flex flex-col items-center text-center'>
        <h1 className="text-white text-5xl font-extrabold z-10 drop-shadow-[2px_2px_0px_black] md:text-8xl">
          MY BARBER
        </h1>
        <h2 className='text-white text-xl font-extrabold z-10 drop-shadow-[2px_2px_0px_black] md:text-3xl'>
          Prenota il tuo taglio di barba e capelli in pochi click
        </h2>
      </div>
    </div>
  );
}
