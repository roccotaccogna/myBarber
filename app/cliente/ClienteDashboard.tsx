'use client'

import { useEffect, useState } from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { it } from 'date-fns/locale/it'
import { registerLocale } from 'react-datepicker'
registerLocale('it', it)
import LoadGest from '../_components/LoadGest'

import {
  Alert,
  AlertTitle,
} from "@/components/ui/alert";
import { CheckCircle2Icon } from "lucide-react"


interface Barbiere {
  id: string
  nome: string
}

interface OrariDisponibili {
  [barbiereId: string]: string[]
}

export default function ClienteDashboard() {
  const [data, setData] = useState<Date>(new Date())
  const [barbieri, setBarbieri] = useState<Barbiere[]>([])
  const [orari, setOrari] = useState<OrariDisponibili>({})
  const [modalOpen, setModalOpen] = useState(false)
  const [orarioSelezionato, setOrarioSelezionato] = useState<string | null>(null)
  const [barbiereSelezionato, setBarbiereSelezionato] = useState<Barbiere | null>(null)
  const [servizi, setServizi] = useState<{ id: string, nome: string }[]>([])
  const [servizioSelezionato, setServizioSelezionato] = useState<string | null>(null)
  const [loading, setLoading] = useState(true);
  const [prenotazioneConfermata, setPrenotazioneConfermata] = useState(false)

  useEffect(() => {
    async function caricaBarbieri() {
      const res = await fetch('/api/barbieri')
      const result = await res.json()
      setBarbieri(result)
    }
    caricaBarbieri()
  }, [])

  useEffect(() => {
    async function caricaOrari() {
      const dataISO = data.toISOString().split('T')[0]
      const orariPerBarbiere: OrariDisponibili = {}

      for (const barbiere of barbieri) {
        const res = await fetch('/api/disponibili', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            data: dataISO,
            barbiere_id: barbiere.id,
          }),
        })
        const result = await res.json()
        orariPerBarbiere[barbiere.id] = result
      }

      setOrari(orariPerBarbiere)
      setLoading(false)
    }

    if (barbieri.length > 0) {
      caricaOrari()
    }

    if (modalOpen) {
      async function caricaServizi() {
        const res = await fetch('/api/servizi')
        const result = await res.json()
        setServizi(result)
      }
      caricaServizi()
    }
  }, [data, barbieri, modalOpen])

  function filtraOrari(barbiereId: string): string[] {
    const oggiISO = new Date().toISOString().split('T')[0]
    const dataSelezionataISO = data.toISOString().split('T')[0]

    const oraAttuale = new Date()
    const orariBarbiere = orari[barbiereId] || []

    return orariBarbiere.filter(orario => {
      if (dataSelezionataISO !== oggiISO) return true

      const [ore, minuti] = orario.split(':').map(Number)
      const dataOrario = new Date(data.getFullYear(), data.getMonth(), data.getDate(), ore, minuti)

      return dataOrario >= oraAttuale
    })
  }

  return (
    <div className="p-6 max-w-4xl mx-auto min-h-screen mt-20 text-white">
      <h1 className="md:text-5xl text-4xl font-bold mb-4 text-center mt-10">
        Prenota un appuntamento
      </h1>

      {prenotazioneConfermata && (
        <div className="grid w-full max-w-xl items-start gap-4 mx-auto m-6">
          <Alert className='bg-green-600 border border-green-600 text-black'>
            <CheckCircle2Icon className="h-10 w-10" />
            <AlertTitle className="text-md">
              Prenotazione Confermata !
            </AlertTitle>
          </Alert>
        </div>
      )}

      {modalOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg max-w-md w-full text-black">
            <h2 className="text-xl font-bold mb-4">
              Seleziona il servizio
            </h2>

            <select
              className="w-full p-2 border rounded mb-4"
              value={servizioSelezionato ?? ''}
              onChange={(e) => setServizioSelezionato(e.target.value)}
            >
              <option value="" disabled>-- Seleziona --</option>
              {servizi.map(s => (
                <option key={s.id} value={s.id}>{s.nome}</option>
              ))}
            </select>

            <div className="flex gap-4">
              <button
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 w-full cursor-pointer"
                onClick={() => {
                  setModalOpen(false)
                  setServizioSelezionato(null)
                  setOrarioSelezionato(null)
                  setBarbiereSelezionato(null)
                }}
              >
                Annulla
              </button>

            <button
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 w-full cursor-pointer"
              onClick={async () => {
                if (!servizioSelezionato || !barbiereSelezionato || !orarioSelezionato) return

                const res = await fetch('/api/prenota', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    cliente_id: 'uuid-del-cliente',
                    barber_id: barbiereSelezionato.id,
                    service_id: servizioSelezionato,
                    data: data.toISOString().split('T')[0],
                    orario: orarioSelezionato,
                  }),
                })

                if (res.ok) {
                  setPrenotazioneConfermata(true)
                  setModalOpen(false)
                  setServizioSelezionato(null)
                  setTimeout(() => setPrenotazioneConfermata(false), 3000)
                } else {
                  const result = await res.json()
                  alert(result.error || 'Errore nella prenotazione.')
                }
              }}
            >
              Conferma prenotazione
            </button>
            </div>
          </div>
        </div>
      )}



      <div className="mb-6">
        <label className="block mb-2 text-2xl mt-18">
          Seleziona una data:
        </label>
        <DatePicker
          selected={data}
          onChange={(date: Date | null) => {
            if (date instanceof Date) {
              setData(date)
            }
          }}
          dateFormat="dd/MM/yyyy"
          className="p-2 border rounded border-gray-500 text-xl focus:outline-none"
          minDate={new Date()}
          filterDate={(date) => {
            const day = date.getDay()
            return day !== 0 && day !== 1
          }}
          locale="it"
        />
      </div>

    {
      loading ? (
          <div className='mt-24'>
              <LoadGest />
          </div>
      ) : barbieri.length === 0 ? (
        <p className="text-gray-500 mt-4 text-center text-xl">
          Nessun barbiere disponibile per questa data.
        </p>
      ) : (
        barbieri.map(barbiere => {
          const orariValidi = filtraOrari(barbiere.id)
          return (
            <div key={barbiere.id} className="mb-6">
              <h2 className="text-2xl mt-18">
                {barbiere.nome}
              </h2>
              <div className="flex flex-wrap gap-2 mt-2">
                {orariValidi.length > 0 ? (
                  orariValidi.map(orario => (
                    <button
                      key={orario}
                      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 cursor-pointer"
                      onClick={() => {
                        setOrarioSelezionato(orario)
                        setBarbiereSelezionato(barbiere)
                        setModalOpen(true)
                      }}
                    >
                      {orario}
                    </button>
                  ))
                ) : (
                  <p className="text-gray-500 text-center text-xl">
                    Nessun orario disponibile
                  </p>
                )}
              </div>
            </div>
          )
        })
      )
    }
    </div>
  )
}
