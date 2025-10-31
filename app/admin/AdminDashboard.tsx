'use client'

import Link from 'next/link'

export default function AdminDashboard() {
  const sezioni = [
    { nome: 'Gestione utenti 👥', path: '/admin/utenti' },
    { nome: 'Gestione servizi ✂️', path: '/admin/servizi' },
    { nome: 'Gestione prenotazioni 📅', path: '/admin/prenotazioni' },
    { nome: 'Gestione orari 🕒', path: '/admin/orari' },
    { nome: 'Statistiche e report 📊', path: '/admin/statistiche' },
  ]

  return (
    <div className="max-w-xl mx-auto p-6 min-h-screen text-white">
      <h1 className="mt-24 text-4xl md:text-5xl font-bold my-6 text-center">
        Dashboard Admin
      </h1>
      <div className="flex flex-col gap-4 mt-20">
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
  )
}
