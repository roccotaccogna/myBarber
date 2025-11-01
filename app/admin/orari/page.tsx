'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'

import { Calendar } from "@/components/ui/calendar"
import { it } from "date-fns/locale"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"


type Barbiere = { id: string; nome: string; cognome: string }
type Blocco = {
  id: string
  data: string
  orario: string | null
  motivo: string | null
  barbiere: Barbiere | null
}

const ORARI = [
  '09:00','09:40','10:20','11:00','11:40','12:20',
  '13:00','15:00','15:40','16:20','17:00','17:40','18:20'
]

export default function GestioneOrari() {
  const [barbieri, setBarbieri] = useState<Barbiere[]>([])
  const [barbiereId, setBarbiereId] = useState<string | null>(null)
  const [data, setData] = useState<Date | null>(new Date())
  const [orario, setOrario] = useState<string | null>(null)
  const [motivo, setMotivo] = useState('')
  const [blocchi, setBlocchi] = useState<Blocco[]>([])
  const [dialogOpen, setDialogOpen] = useState(false)
  const [dialogMessage, setDialogMessage] = useState('')
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [bloccoDaEliminare, setBloccoDaEliminare] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/barbieri').then(res => res.json()).then(setBarbieri)
    caricaBlocchi()
  }, [])

  async function caricaBlocchi() {
    const res = await fetch('/admin/orari/api/lista')
    const result = await res.json()
    setBlocchi(result)
  }

async function bloccaOrario() {
  if (!data) {
    setDialogMessage('Seleziona una data')
    setDialogOpen(true)
    return
  }

  const res = await fetch('/admin/orari/api/blocca', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      barbiere_id: barbiereId,
      data: data.toLocaleDateString('it-IT').split('/').reverse().join('-'),
      orario,
      motivo,
    }),
  })

  const result = await res.json()
  if (!res.ok) {
    setDialogMessage(result.error || 'Errore nel blocco')
    setDialogOpen(true)
    return
  }

  setDialogMessage('Blocco salvato con successo!')
  setDialogOpen(true)
  setMotivo('')
  setOrario(null)
  caricaBlocchi()
}


function chiediConfermaEliminazione(id: string) {
  setBloccoDaEliminare(id)
  setConfirmOpen(true)
}

async function confermaEliminazione() {
  if (!bloccoDaEliminare) return

  const res = await fetch('/admin/orari/api/elimina', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id: bloccoDaEliminare }),
  })

  const result = await res.json()
  setConfirmOpen(false)
  setBloccoDaEliminare(null)

  if (!res.ok) {
    setDialogMessage(result.error || 'Errore nella cancellazione')
    setDialogOpen(true)
    return
  }

  caricaBlocchi()
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
    <div className="max-w-4xl mx-auto p-6 text-white">
      <h2 className="text-4xl md:text-5xl font-bold mb-14 text-center">
        Gestione Orari
      </h2>

      {/* Form blocco */}
      <div className="border p-4 rounded shadow mb-8">
        <h3 className="text-2xl mb-6 text-center">
          Blocca orario o giornata
        </h3>

        <label className="block mb-2 text-xl">
          Barbiere (opzionale)
        </label>

        <select
          value={barbiereId || ''}
          onChange={e => setBarbiereId(e.target.value || null)}
          className="border text-lg p-3 rounded bg-gray-800 hover:bg-gray-700 w-full mb-4"
        >
          <option 
            value=""
          >
            Tutti i barbieri
          </option>

          {barbieri.map(b => (
            <option 
              key={b.id} 
              value={b.id}
            >
              {b.nome} {b.cognome}
            </option>
          ))}
        </select>

        <label className="block mb-2 mt-4 text-lg">
          Data
        </label>

        <Calendar
          mode="single"
          selected={data ?? undefined}
          onSelect={(selected) => setData(selected ?? null)}
          required={false}
          locale={it}
          disabled={(date) => {
            const today = new Date()
            today.setHours(0, 0, 0, 0)
            const normalized = new Date(date)
            normalized.setHours(0, 0, 0, 0)
            const isPast = normalized < today
            const day = date.getDay()
            const isWeekend = day === 0 || day === 1
            return isPast || isWeekend
          }}
          className='rounded-md border'
          classNames={{
            day: "rounded-full w-10 h-10 flex items-center justify-center text-sm",
            caption_label: "text-xl"
          }}
        />

        <label className="block mb-2 mt-10 text-lg">
          Orario (opzionale)
        </label>
        <div className="flex flex-wrap gap-2 mb-4">
          {ORARI.map(o => (
            <button
              key={o}
              onClick={() => setOrario(orario === o ? null : o)}
              className={`px-4 py-2 rounded text-lg ${
                orario === o ? 'bg-teal-800 text-white' : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {o}
            </button>
          ))}
        </div>

        <label className="block mb-2 mt-10 text-lg">
          Motivo (opzionale)
        </label>
        <input
          type="text"
          value={motivo}
          onChange={e => setMotivo(e.target.value)}
          className="border p-2 rounded w-full mb-10 focus:outline-none"
        />

        <button
          onClick={bloccaOrario}
          className="bg-red-600 text-white text-xl px-4 py-2 rounded 
                    hover:bg-red-700 w-full cursor-pointer"
        >
          Blocca
        </button>
      </div>

      {/* Lista blocchi */}
      <h3 className="text-2xl my-14 text-center">
        Blocchi attivi
      </h3>
      <ul className="space-y-3 mb-20">
        {blocchi.length === 0 && (
          <p className="text-gray-500 text-center text-2xl mt-10">
            Nessun blocco registrato
          </p>
        )}
        {blocchi.map(b => (
          <li key={b.id} className="border p-3 rounded flex justify-between items-center">
            <div className='text-lg'>
              <div className='flex justify-start gap-5'>
                <p className='text-gray-400 gap-3'>
                  Data:
                </p>
                <p>
                  {new Date(b.data).toLocaleDateString('it-IT')}
                </p>
              </div>

              <div className='flex justify-start gap-5'>
                <p className='text-gray-400 gap-3'>
                  Orario:
                </p>
                <p>
                  {b.orario
                    ? new Date(`1970-01-01T${b.orario}`).toLocaleTimeString('it-IT', {
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: false,
                      })
                    : 'Tutto il giorno'}
                </p>
              </div>

              <div className='flex justify-start gap-5'>
                <p className='text-gray-400 gap-3'>
                  Barbiere:
                </p>
                <p>
                  {b.barbiere ? `${b.barbiere.nome} ${b.barbiere.cognome}` : 'Tutti'}
                </p>
              </div>

              {
                b.motivo && 
                <div className='flex justify-start gap-5'>
                  <p className='text-gray-400 gap-3'>
                    Motivo:
                  </p>
                  <p>
                    {b.motivo}
                  </p>
                </div>
              }
            </div>
            <button
              onClick={() => chiediConfermaEliminazione(b.id)}
              className="bg-teal-900 hover:bg-teal-800 cursor-pointer text-lg px-4 py-2 rounded"
            >
              Elimina
            </button>
          </li>
        ))}
      </ul>

      {/* Dialog messaggi */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="text-white">
          <DialogHeader>
            <DialogTitle className="text-xl">Messaggio</DialogTitle>
          </DialogHeader>
          <p className="text-lg">{dialogMessage}</p>
          <DialogFooter>
            <Button 
              onClick={() => setDialogOpen(false)}
              className='hover:bg-blue-600 cursor-pointer'
            >
              OK
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog conferma eliminazione */}
      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent className="text-white">
          <DialogHeader>
            <DialogTitle className="text-xl">Conferma eliminazione</DialogTitle>
          </DialogHeader>
          <p className="text-lg">Vuoi davvero eliminare questo blocco?</p>
          <DialogFooter className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setConfirmOpen(false)
                setBloccoDaEliminare(null)
              }}
            >
              Annulla
            </Button>
            <Button
              className="bg-red-600 hover:bg-red-700 text-white"
              onClick={confermaEliminazione}
            >
              Elimina
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
    </>
  )
}
