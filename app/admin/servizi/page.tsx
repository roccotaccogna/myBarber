'use client'

import { useEffect, useState } from 'react';
import Link from 'next/link';
import LoadGest from '@/app/_components/LoadGest';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

type Servizio = {
  id: string
  nome: string
  prezzo: number | null
}

export default function GestioneServizi() {
  const [servizi, setServizi] = useState<Servizio[]>([])
  const [prezziModificati, setPrezziModificati] = useState<Record<string, string>>({})
  const [nuovoServizio, setNuovoServizio] = useState('')
  const [nuovoPrezzo, setNuovoPrezzo] = useState('')
  const [nomiModificati, setNomiModificati] = useState<Record<string, string>>({})
  const [modificaAttiva, setModificaAttiva] = useState<Record<string, boolean>>({})
  const [loading, setLoading] = useState(true);
  const [showConfermaNome, setShowConfermaNome] = useState(false)
  const [servizioDaConfermare, setServizioDaConfermare] = useState<string | null>(null)


  useEffect(() => {
    fetch('/admin/servizi/lista')
      .then(res => res.json())
      .then(setServizi)
    setLoading(false)
  }, [])

  // AGGIUNGERE SERVIZIO
  async function aggiungiServizio() {
    if (!nuovoServizio.trim() || !nuovoPrezzo.trim()) return
    const res = await fetch('/admin/servizi/aggiungi', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nome: nuovoServizio, prezzo: parseFloat(nuovoPrezzo) }),
    })
    if (res.ok) {
      const nuovo = await res.json()
      setServizi(prev => {
        const esiste = prev.find(s => s.id === nuovo.id)
        if (esiste) {
          return prev.map(s => s.id === nuovo.id ? nuovo : s)
        }
        return [...prev, nuovo]
      })
      setNuovoServizio('')
      setNuovoPrezzo('')
    }
  }

  // MODIFICARE IL PREZZO
  async function confermaPrezzo(id: string) {
    const prezzo = parseFloat(prezziModificati[id])
    if (isNaN(prezzo)) return

    const res = await fetch('/admin/servizi/aggiorna-prezzo', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, prezzo }),
    })

    if (res.ok) {
      setServizi(prev =>
        prev.map(s => (s.id === id ? { ...s, prezzo } : s))
      )
      setPrezziModificati(prev => ({ ...prev, [id]: '' }))
    }
  }

// MODIFICARE IL NOME DEL SERVIZIO
async function eseguiConfermaNome(id: string) {
  const nome = nomiModificati[id]?.trim()
  if (!nome) return

  const res = await fetch('/admin/servizi/aggiorna-nome', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, nome }),
  })

  if (res.ok) {
    setServizi(prev =>
      prev.map(s => (s.id === id ? { ...s, nome } : s))
    )
    setNomiModificati(prev => ({ ...prev, [id]: '' }))
    setModificaAttiva(prev => ({ ...prev, [id]: false }))
  }

  setShowConfermaNome(false)
  setServizioDaConfermare(null)
}


function attivaModificaNome(id: string, nomeAttuale: string) {
  setModificaAttiva(prev => ({ ...prev, [id]: true }))
  setNomiModificati(prev => ({ ...prev, [id]: nomeAttuale }))
}

// ELIMINARE SERVIZIO
async function eliminaServizio(id: string) {
  const conferma = confirm('Sei sicuro di voler eliminare questo servizio?')
  if (!conferma) return

  const res = await fetch('/admin/servizi/elimina', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id }),
  })

  if (res.ok) {
    setServizi(prev => prev.filter(s => s.id !== id))
  }
}


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
      <h2 className="text-4xl md:text-5xl font-bold mb-16 text-center">
        Gestione Servizi
      </h2>

      <ul className="space-y-4 mb-10">
        {
          loading ? (
              <div className='mt-24'>
                <LoadGest />
              </div>
          ) : (
          servizi.map(s => (
          <li key={s.id} className="border p-4 rounded">
            <div className="flex justify-between items-center">
              <div className="w-full">
                {modificaAttiva[s.id] ? (
                  <input
                    type="text"
                    value={nomiModificati[s.id] ?? ''}
                    onChange={e =>
                      setNomiModificati(prev => ({
                        ...prev,
                        [s.id]: e.target.value,
                      }))
                    }
                    className="border p-1 rounded w-full font-semibold mb-1 
                              border-gray-400 focus:outline-none"
                  />
                ) : (
                  <p className="text-xl">
                    {s.nome}
                  </p>
                )}
                <p className="text-md text-gray-600">
                  Prezzo attuale: € {s.prezzo?.toFixed(2) ?? '—'}
                </p>
              </div>

              <div className="flex flex-col gap-2 items-end">
                <div className="flex">
                  <input
                    type="text"
                    placeholder="Nuovo prezzo"
                    value={prezziModificati[s.id] ?? ''}
                    onChange={e =>
                      setPrezziModificati(prev => ({
                        ...prev,
                        [s.id]: e.target.value,
                      }))
                    }
                    className="border p-1.5 rounded w-24 focus:outline-none"
                  />
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => confermaPrezzo(s.id)}
                    className="bg-green-700 text-white px-4 py-2 rounded hover:bg-green-800 cursor-pointer"
                  >
                    💵
                  </button>

                  {modificaAttiva[s.id] ? (
                    <button
                      onClick={() => {
                        setServizioDaConfermare(s.id)
                        setShowConfermaNome(true)
                      }}
                      className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700 cursor-pointer"
                    >
                      ✅
                    </button>
                  ) : (
                    <button
                      onClick={() => attivaModificaNome(s.id, s.nome)}
                      className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700 cursor-pointer"
                    >
                      ✏️
                    </button>
                  )}
                  <button
                    onClick={() => eliminaServizio(s.id)}
                    className="bg-red-700 text-white px-4 py-2 rounded hover:bg-red-800 cursor-pointer"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            </div>
          </li>
          ))
        )
        }
      </ul>

      <h3 className="text-4xl md:text-5xl mb-4 mt-10 text-center">
        Aggiungi nuovo servizio
      </h3>
      <div className="flex gap-2 mb-10">
        <input
          type="text"
          value={nuovoServizio}
          onChange={e => setNuovoServizio(e.target.value)}
          placeholder="Nome servizio"
          className="border text-xl p-2 rounded w-full focus:outline-none"
        />
        <input
          type="text"
          value={nuovoPrezzo}
          onChange={e => setNuovoPrezzo(e.target.value)}
          placeholder="Prezzo (€)"
          className="border p-2 text-xl rounded w-32 focus:outline-none"
        />
        <button
          onClick={aggiungiServizio}
          className="bg-blue-700 text-white px-5 py-3 rounded text-lg cursor-pointer hover:bg-blue-800"
        >
          Aggiungi ➕
        </button>
      </div>
    </div>

    <Dialog open={showConfermaNome} onOpenChange={setShowConfermaNome}>
  <DialogContent className="bg-slate-600 text-white">
    <DialogHeader>
      <DialogTitle className="text-2xl font-light">
        Conferma modifica nome
      </DialogTitle>
    </DialogHeader>
    <p className="mb-4">
      Vuoi davvero modificare il nome del servizio?
    </p>
    <DialogFooter>
      <Button
        variant="outline"
        onClick={() => setShowConfermaNome(false)}
        className="cursor-pointer text-lg py-5 px-3"
      >
        Annulla
      </Button>
      <Button
        variant="default"
        onClick={() => servizioDaConfermare && eseguiConfermaNome(servizioDaConfermare)}
        className="cursor-pointer bg-yellow-700 hover:bg-yellow-800 text-white text-lg py-5 px-3"
      >
        Conferma
      </Button>
    </DialogFooter>
  </DialogContent>
    </Dialog>

    </>
  )
}
