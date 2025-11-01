'use client'

import { useEffect, useState } from 'react'
import LoadGest from '../_components/LoadGest'

import { Calendar } from "@/components/ui/calendar"
import { it } from "date-fns/locale"

// import DatePicker from 'react-datepicker'
// import 'react-datepicker/dist/react-datepicker.css'
// import { it } from 'date-fns/locale/it'
// import { registerLocale } from 'react-datepicker'
// registerLocale('it', it)

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface Prenotazione {
  id: string
  cliente_id: string
  cliente: {
    nome: string
    cognome: string
  }
  service_id: string
  servizio: {
    nome: string
  }
  data: string
  orario: string
}


export default function BarberDashboard() {
  const [data, setData] = useState<Date>(new Date())
  const [prenotazioni, setPrenotazioni] = useState<Prenotazione[]>([])
  const [loading, setLoading] = useState(true)
  const [showConfermaEliminazione, setShowConfermaEliminazione] = useState(false)
  const [prenotazioneDaEliminare, setPrenotazioneDaEliminare] = useState<string | null>(null)

  useEffect(() => {
    async function caricaPrenotazioni() {
      setLoading(true)
      const dataISO = data.toLocaleDateString('it-IT').split('/').reverse().join('-')

      const res = await fetch('/barber/prenotazioni', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: dataISO }),
      })

      const result = await res.json()
      if (res.ok) {
        setPrenotazioni(result)
      } else {
        console.error('Errore:', result.error)
        setPrenotazioni([])
      }

      setLoading(false)
    }

    caricaPrenotazioni()
  }, [data])

  // async function eliminaPrenotazione(id: string) {
  //   const conferma = confirm('Vuoi eliminare questa prenotazione?')
  //   if (!conferma) return

  //   const res = await fetch('/api/prenotazioni/elimina', {
  //     method: 'POST',
  //     headers: { 'Content-Type': 'application/json' },
  //     body: JSON.stringify({ id }),
  //   })

  //   const result = await res.json()
  //   if (!res.ok) {
  //     alert(result.error || 'Errore nella cancellazione.')
  //   } else {
  //     setPrenotazioni(prev => prev.filter(p => p.id !== id))
  //   }
  // }
      function chiediConfermaEliminazione(id: string) {
    setPrenotazioneDaEliminare(id)
    setShowConfermaEliminazione(true)
  }

    async function confermaEliminazione(id: string) {
    if (!prenotazioneDaEliminare) return

    const res = await fetch('/api/prenotazioni/elimina', {
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
    <div className="p-6 text-white max-w-4xl mx-auto min-h-screen mt-20 mb-24">
      <h1 className="text-4xl md:text-5xl font-bold mb-14 text-center mt-10">
        Gestione Prenotazioni
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

      <div className="mb-6">
        <label className="block mb-2 text-xl">
          Seleziona una data:
        </label>
        {/* <DatePicker
          selected={data}
          onChange={(date: Date | null) => {
            if (date instanceof Date) {
              setData(date)
            }
          }}
          dateFormat="dd/MM/yyyy"
          className="p-2 border rounded border-gray-400 focus:outline-none text-xl"
          minDate={new Date()}
          filterDate={(date) => {
            const day = date.getDay()
            return day !== 0 && day !== 1
          }}
          locale="it"
        /> */}
          <Calendar
            mode="single"
            selected={data ?? undefined}
            onSelect={(selected) => {
              if (selected) setData(selected)
            }}
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
      </div>

      {loading ? (
        <div className='mt-24'>
          <LoadGest />
        </div>
      ) : prenotazioni.length === 0 ? (
        <p className="text-gray-500 mt-20 text-3xl text-center">
            Nessuna prenotazione per questa data.
        </p>
      ) : (
        <ul className="space-y-4">
          {prenotazioni.map(p => (
            <li key={p.id} className="border p-4 rounded shadow text-xl">
                <div className='flex justify-start gap-5'>
                  <p className='text-gray-400 gap-3'>
                    Orario:
                  </p>
                  <p className='text-white'>
                    {new Date(`1970-01-01T${p.orario}`).toLocaleTimeString('it-IT', {
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: false,
                    })}
                  </p>
                </div>
                
                <div className='flex justify-start gap-5'>
                  <p className='text-gray-400 gap-3'>
                    Cliente:
                  </p>
                  <p className='text-white'>
                    {p.cliente.nome} {p.cliente.cognome}
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
              <button
                onClick={() => chiediConfermaEliminazione(p.id)}
                className="mt-2 px-5 py-2 bg-red-600 text-white rounded hover:bg-red-700 cursor-pointer"
              >
                🗑️ Elimina
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
