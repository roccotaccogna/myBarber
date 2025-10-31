'use client'
import Link from 'next/link'

export default function GestionePrenotazioni() {
  return (
    <>
        <Link href="/admin">
        <button 
          className='bg-slate-700 text-white rounded-lg p-4 
                      cursor-pointer hover:bg-slate-600 m-5 text-lg'
        >
          Torna indietro 
        </button>
        </Link>
        <div className="max-w-xl mx-auto p-6 text-center min-h-screen text-white">
        <h2 className="text-4xl md:text-5xl font-bold mb-8">
          Gestione Prenotazioni
        </h2>
        <div className="grid gap-4 mt-16">
            <Link href="/admin/prenotazioni/visualizza">
            <button className="bg-blue-600 text-white text-xl cursor-pointer px-5 py-3 rounded hover:bg-blue-700 w-full">
                Visualizza tutte le prenotazioni 📅
            </button>
            </Link>
            <Link href="/admin/prenotazioni/aggiungi">
            <button className="bg-teal-700 text-white text-xl cursor-pointer px-5 py-3 rounded hover:bg-teal-800 w-full">
                Aggiungi prenotazione ➕
            </button>
            </Link>
        </div>
        </div>
    </>
  )
}