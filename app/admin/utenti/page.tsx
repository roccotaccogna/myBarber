'use client'

import Link from 'next/link';

export default function GestioneUtenti() {
  const sezioni = [
    { nome: 'Elenco clienti registrati 📋', path: '/admin/utenti/clienti' },
    { nome: 'Elenco barbieri attivi ✂️', path: '/admin/utenti/barbieri' },
    { nome: 'Cambia ruolo (cliente ➡️ barbiere) ', path: '/admin/utenti/cambia-ruolo' },
  ]

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
    <div className="max-w-xl mx-auto p-6 min-h-screen text-white">
      <h2 className="text-4xl md:text-5xl font-bold mb-4 text-center">
        Gestione Utenti
      </h2>
    <div className="flex flex-col gap-4 mt-14">
        {sezioni.map(({ nome, path }) => (
          <Link
            key={path}
            href={path}
            className="bg-slate-700 text-white px-4 py-5 rounded hover:bg-blue-700 text-center text-xl"
          >
            {nome}
          </Link>
        ))}
      </div>
    </div>
   </> 
  )
}
