import Image from 'next/image'

export default function Footer() {
  return (
    <footer className="bg-gray-950 p-2 text-center text-white flex flex-wrap items-center justify-between text-lg"
    >
      <div>
        <Image
          alt="whatsapp"
          src="/assets/wa.png"
          width={50}
          height={50}
        />
      </div>

      <p className="px-2">
        © 2025 
          <span className="text-emerald-500 mx-2">MyBarber</span> 
        All rights reserved.
      </p>
    </footer>
  )
}
