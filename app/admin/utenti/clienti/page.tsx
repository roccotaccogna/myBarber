'use client'

import Link from 'next/link';
import { useEffect, useState } from 'react';
import LoadGest from '@/app/_components/LoadGest';

type Cliente = {
  id: string
  nome: string
  cognome: string
  telefono: string
}

function ElencoClienti() {
    const [clienti, setClienti] = useState<Cliente[]>([]);
    const [query, setQuery] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(()=> {
        fetch('/admin/utenti/clienti/api')
        .then(res => res.json())
        .then(data => {
            setClienti(data)
            setLoading(false)
        })
    }, []);

    const clientiFiltrati = clienti.filter(c =>
    `${c.nome} ${c.cognome}`.toLowerCase().includes(query.toLowerCase())
  )

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
            <h2 className="text-4xl md:text-5xl font-bold mb-14 text-center">
                Clienti registrati
            </h2>
                {/* RICERCA x NOME o COGNOME */}
                <input
                    type="text"
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    placeholder="Cerca per nome o cognome"
                    className="border p-2 rounded w-full mb-16 text-xl
                               focus:outline-none border-gray-400"
                />

            {
                loading ? (
                    <div className='mt-24'>
                        <LoadGest />
                    </div>
                ) 
                : clientiFiltrati.length === 0 
                    ? (  <p>Nessun cliente trovato</p> )
                    : (
                        clientiFiltrati.map(c => (
                        <div key={c.id} className="border p-3 mb-2 rounded shadow">
                            <p className="text-xl">
                                {c.nome} {c.cognome}
                            </p>
                            <p className="text-md text-gray-600">
                                {c.telefono}
                            </p>
                        </div>
                        )
                    )
                    )
            }
        </div>
    </>
  )
}

export default ElencoClienti;