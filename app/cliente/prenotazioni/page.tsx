'use client'

import { useEffect, useState } from 'react'
import LoadGest from '@/app/_components/LoadGest'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"


type Persona = { id: string; nome: string; cognome: string }

type Prenotazione = {
  id: string
  data: string
  orario: string
  cliente: Persona
  barbiere: Persona
  servizio: { id: string; nome: string; prezzo: number }
}

function formatData(data: string) {
  const [anno, mese, giorno] = data.split('-')
  return `${giorno}/${mese}/${anno}`
}


export default function PrenotazioniPage() {
  const [prenotazioni, setPrenotazioni] = useState<Prenotazione[]>([])
  const [errore, setErrore] = useState<string | null>(null)
  const [loading, setLoading] = useState(true);
  const [showConfermaEliminazione, setShowConfermaEliminazione] = useState(false)
  const [prenotazioneDaEliminare, setPrenotazioneDaEliminare] = useState<string | null>(null)


  useEffect(() => {
    async function caricaPrenotazioni() {
      const res = await fetch('/api/prenotazioni')
      const result = await res.json()

      if (!res.ok) {
        setErrore(result.error || 'Errore nel caricamento delle prenotazioni')
        return
      }

      setPrenotazioni(result)
      setLoading(false)
    }

    caricaPrenotazioni()
  }, [])

    function chiediConfermaEliminazione(id: string) {
    setPrenotazioneDaEliminare(id)
    setShowConfermaEliminazione(true)
  }

    async function confermaEliminazione(id: string) {
    if (!prenotazioneDaEliminare) return

    const res = await fetch('/admin/prenotazioni/api/elimina', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: prenotazioneDaEliminare }),
    })

    const result = await res.json()
    if (!res.ok) {
      alert(result.error || 'Errore durante l\'eliminazione')
      return
    }

    // ✅ aggiorna la lista
    setPrenotazioni(prev => prev.filter(p => p.id !== id))
    setShowConfermaEliminazione(false)
    setPrenotazioneDaEliminare(null)
  }

  return (
    <div className="max-w-3xl mx-auto p-6 min-h-screen mt-20 text-white">
      <h1 className="md:text-5xl text-4xl font-bold mb-6 text-center">
        Le mie prenotazioni
      </h1>

      <Dialog open={showConfermaEliminazione} onOpenChange={setShowConfermaEliminazione}>
      <DialogContent className="bg-slate-600 text-white">
        <DialogHeader>
          <DialogTitle className='text-2xl font-light'>
            Conferma eliminazione
          </DialogTitle>
        </DialogHeader>
        <p className="mb-4">
          Vuoi davvero eliminare questa prenotazione?
        </p>
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => setShowConfermaEliminazione(false)}
            className='cursor-pointer'
          >
            Annulla
          </Button>
          <Button 
            variant="destructive" 
            onClick={() => confermaEliminazione(prenotazioneDaEliminare!)}
            className='cursor-pointer hover:bg-red-800'
          >
            Elimina
          </Button>
        </DialogFooter>
      </DialogContent>
      </Dialog>


      {errore ? (
        <p className="text-red-600 text-center">{errore}</p>
      ) : prenotazioni.length === 0 ? (
        <p className="text-gray-500 text-center text-4xl">
          Nessuna prenotazione futura trovata.
        </p>
      ) : (
        <ul className="space-y-4">
          {
            loading ? (
              <div className='mt-24'>
                <LoadGest />
              </div>
            ) : (
              prenotazioni.map(p => (
              <li key={p.id} className="border p-4 rounded shadow text-xl">
                <div className='flex justify-start gap-5'>
                  <p className='text-gray-400 gap-3'>
                    Barbiere: 
                  </p>
                  <p className='text-white'>
                    {p.barbiere.nome} {p.barbiere.cognome}
                  </p>
                </div>
                <div className='flex justify-start gap-5'>
                  <p className='text-gray-400 gap-3'>
                    Servizio:
                  </p>
                  <p className='text-white'>
                    {p.servizio.nome}
                  </p>
                </div>
                <div className='flex justify-start gap-5'>
                  <p className='text-gray-400 gap-3'>
                    Prezzo:
                  </p>
                  <p className='text-white'>
                    € {p.servizio.prezzo}
                  </p>
                </div>
                <div className='flex justify-start gap-5'>
                  <p className='text-gray-400 gap-3'>
                    Orario:
                  </p>
                  <p className='text-white'>
                    {typeof p.orario === 'string' ? p.orario.slice(0, 5) : p.orario}
                  </p>
                </div>
                <div className='flex justify-start gap-5'>
                  <p className='text-gray-400 gap-3'>
                    Data:
                  </p>
                  <p className='text-white'>
                    {formatData(p.data)}
                  </p>
                </div>
                <button
                  onClick={() => chiediConfermaEliminazione(p.id)}
                  className="mt-3 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 cursor-pointer"
                >
                  🗑️ Elimina
                </button>
              </li>
          )))
          }
        </ul>
      )}
    </div>
  )
}
