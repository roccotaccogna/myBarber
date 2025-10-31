'use client';

import Link from "next/link";
import { useState, useEffect } from "react";
import LoadGest from "@/app/_components/LoadGest";

type Barbiere = {
  id: string
  nome: string
  cognome: string
  telefono: string
}

function ElencoBarbieri() {
    const [barbieri, setBarbieri] = useState<Barbiere[]>([]);
    const [loading, setLoading] = useState(true);
    const [disattivando, setDisattivando] = useState(false);

      useEffect(() => {
        fetch('/admin/utenti/barbieri/api')
        .then(res => res.json())
        .then(data => {
            setBarbieri(data)
            setLoading(false)
        })
        }, []);

    async function disattiva(id: string) {
    setDisattivando(true)
   try {
    const res = await fetch('/admin/utenti/barbieri/api/disattiva', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
    

    if (!res.ok) {
      const err = await res.json()
      throw new Error(err?.error || 'Errore nella disattivazione')
    }

    setBarbieri(prev => prev.filter(b => b.id !== id))
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    alert(err.message || 'Errore imprevisto')
  }
    setDisattivando(false)
  };

  return (
    <>
        <Link href="/admin/utenti">
        <button 
            className='bg-slate-700 text-white rounded-lg p-4 
                        cursor-pointer hover:bg-slate-600 m-5 text-lg'
        >
            Torna indietro 
        </button>
        </Link>

                <div className="max-w-xl mx-auto p-6 min-h-screen text-white">
            <h2 className="text-4xl md:text-5xl text-center font-bold mb-16">
                Barbieri Attivi
            </h2>

            {
                loading ? (
                    <div className='mt-24'>
                        <LoadGest />
                    </div>
                ) 
                : barbieri.length === 0 
                    ? (  <p className="text-center text-3xl text-gray-500">
                            Nessun barbiere trovato
                          </p> 
                      )
                    : (
                        barbieri.map(b => (
                        <div key={b.id} className="border p-3 mb-2 rounded shadow">
                            <p className="text-xl">
                              {b.nome} {b.cognome}
                            </p>
                            <p className="text-md text-gray-600">
                              {b.telefono}
                            </p>
                            <button
                            onClick={() => disattiva(b.id)}
                            disabled={disattivando}
                            className="mt-2 bg-red-600 text-white px-5 py-2 rounded 
                                     hover:bg-red-700 cursor-pointer text-lg"
                            >
                            Disattiva barbiere 🚫
                            </button>
                        </div>
                        )
                    )
                    )
            }
        </div>
    </>
  )
}

export default ElencoBarbieri;