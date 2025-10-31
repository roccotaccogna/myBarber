"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import LoadGest from "@/app/_components/LoadGest";

import {
  Alert,
  AlertTitle,
} from "@/components/ui/alert";
import { CheckCircle2Icon } from "lucide-react";

type Cliente = {
  id: string
  nome: string
  cognome: string
  telefono: string
}

function CambiaRuolo() {
    const [clienti, setClienti] = useState<Cliente[]>([])
    const [loading, setLoading] = useState(true)
    const [promoting, setPromoting] = useState(false)
    const [ruoloConfermato, setRuoloConfermato] = useState(false)


    useEffect(()=> {
        fetch('/admin/utenti/cambia-ruolo/api')
            .then(res => res.json())
            .then(data => {
                setClienti(data)
                setLoading(false)
            })
    }, []);

  async function promuovi(id: string) {
    setPromoting(true)
    try {
      const res = await fetch('/admin/utenti/cambia-ruolo/api', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || 'Errore nella promozione')

      setClienti(prev => prev.filter(c => c.id !== id))
      // alert('Cliente promosso a barbiere!')
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      alert(err.message)
    }
    setPromoting(false)
  }
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
      <h2 className="text-4xl md:text-5xl font-bold mb-16 text-center">
        Promuovi clienti a barbieri
      </h2>

      {ruoloConfermato && (
        <div className="grid w-full max-w-xl items-start gap-4 mx-auto m-6">
          <Alert className='bg-green-600 border border-green-600 text-black'>
            <CheckCircle2Icon className="h-10 w-10" />
            <AlertTitle className="text-md">
              Cambio ruolo Confermato !
            </AlertTitle>
          </Alert>
        </div>
      )}

      {loading ? (
        <LoadGest />
      ) : clienti.length === 0 ? (
        <p className="text-gray-500 text-center text-2xl">
          Nessun cliente disponibile per la promozione
        </p>
      ) : (
        clienti.map(c => (
          <div key={c.id} className="border p-3 mb-2 rounded shadow">
            <p className="text-xl">
              {c.nome} {c.cognome}
            </p>
            <p className="text-md text-gray-600">
              {c.telefono}
            </p>
            <button
              onClick={
                  () => {
                    promuovi(c.id)
                    setRuoloConfermato(true)
                    setTimeout(() => setRuoloConfermato(false), 3000)
                  }
              }
              disabled={promoting}
              className="mt-2 bg-green-600 text-white px-5 py-2 rounded 
                       hover:bg-green-700 cursor-pointer text-lg"
            >
              Promuovi a barbiere
            </button>
          </div>
        ))
      )}
    </div>
    </>
  )
}

export default CambiaRuolo;