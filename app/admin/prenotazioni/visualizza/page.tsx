'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { registerLocale } from 'react-datepicker'
import { it } from 'date-fns/locale/it'
registerLocale('it', it)
import Loading from '@/app/_components/Loading'

type Persona = { id: string; nome: string; cognome: string }
type Prenotazione = {
  id: string
  data: string
  orario: string
  cliente: Persona
  barbiere: Persona // ✅ dopo la mappatura nel backend, ricevi direttamente il profilo
  servizio: { id: string; nome: string }
}

export default function VisualizzaPrenotazioni() {
  const [data, setData] = useState<Date | null>(new Date())
  const [barbieri, setBarbieri] = useState<Persona[]>([])
  const [barbiereId, setBarbiereId] = useState('')
  const [prenotazioni, setPrenotazioni] = useState<Prenotazione[]>([])
  const [loadingData, setLoadingData] = useState(false);
  const [loadingBarbiere, setLoadingBarbiere] = useState(false);

  useEffect(() => {
    fetch('/api/barbieri')
      .then(res => res.json())
      .then(setBarbieri)
  }, [])

  async function cercaPerData() {
    if (!data) return
    setLoadingData(true);
    const res = await fetch('/admin/prenotazioni/api/lista', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data: data.toISOString().split('T')[0] }),
    })
    const result = await res.json()
    setLoadingData(false);
    if (!Array.isArray(result)) {
      alert(result.error || 'Errore nella ricerca per data')
      return
    }
    setPrenotazioni(result)
  }

  async function cercaPerBarbiere() {
    if (!barbiereId) {
      alert('Seleziona un barbiere')
      return
    }
    setLoadingBarbiere(true);
    const res = await fetch('/admin/prenotazioni/api/lista', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ barbiere_id: barbiereId }),
    })
    const result = await res.json()
    setLoadingBarbiere(false);
    if (!Array.isArray(result)) {
      alert(result.error || 'Errore nella ricerca per barbiere')
      return
    }
    setPrenotazioni(result)
  }
  
  async function eliminaPrenotazione(id: string) {
  const conferma = confirm('Sei sicuro di voler eliminare questa prenotazione?')
  if (!conferma) return

  const res = await fetch('/admin/prenotazioni/api/elimina', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id }),
  })

  const result = await res.json()
  if (!res.ok) {
    alert(result.error || 'Errore durante l’eliminazione')
    return
  }

  setPrenotazioni(prev => prev.filter(p => p.id !== id))
}

  return (
    <>
      <Link href="/admin/prenotazioni">
        <button 
          className='bg-slate-700 text-white rounded-lg p-4 
                      cursor-pointer hover:bg-slate-600 m-5 text-lg'
        >
          Torna indietro 
        </button>
      </Link>
    <div className="max-w-6xl mx-auto p-6 text-white">
      <h2 className="text-4xl md:text-5xl font-bold mt-6 mb-14 text-center">
        Visualizza Prenotazioni
      </h2>

      {/* Sezioni di ricerca */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Sezione sinistra: Data */}
        <div>
          <label className="block mb-2 text-xl">
            Seleziona data
          </label>
          <DatePicker
            selected={data}
            onChange={setData}
            dateFormat="dd/MM/yyyy"
            inline
            locale="it"
            minDate={new Date()}
            filterDate={(date) => {
              const day = date.getDay()
              return day !== 0 && day !== 1
            }}
          />
          <button
            onClick={cercaPerData}
            className="mt-4 mb-20 bg-blue-600 text-white text-xl cursor-pointer px-5 py-3 rounded hover:bg-blue-700 w-full"
          >
            {
              loadingData
              ? <Loading />
              : 'Cerca per data'
            }
          </button>
        </div>

        {/* Sezione destra: Barbieri */}
        <div>
          <label className="block mb-2 text-xl">
            Seleziona barbiere
          </label>
          <div className="flex flex-wrap gap-2 mb-4">
            {barbieri.map(b => (
              <button
                key={b.id}
                onClick={() => setBarbiereId(b.id)}
                className={`px-5 py-3 cursor-pointer rounded-full border text-lg ${
                  barbiereId === b.id
                    ? 'bg-green-900 text-white'
                    : 'bg-teal-700 hover:bg-teal-800'
                }`}
              >
                {b.nome} {b.cognome}
              </button>
            ))}
          </div>
          <button
            onClick={cercaPerBarbiere}
            className="bg-green-700 mb-14 text-white px-5 py-3 text-xl cursor-pointer rounded hover:bg-green-700 w-full"
          >
            {
              loadingBarbiere 
              ? <Loading />
              : 'Cerca per barbiere'
            }
          </button>
        </div>
      </div>

      {/* Risultati */}
      <ul className="space-y-4">
        {prenotazioni.length === 0 && (
          <p className="text-center text-gray-500 text-2xl">
            Nessuna prenotazione trovata
          </p>
        )}
        {prenotazioni.map(p => (
          <li 
            key={p.id} 
            className="border p-4 rounded shadow"
          >
            <div className='text-lg'>
              <div className='flex justify-start gap-5'>
                <p className='text-gray-400 gap-3'>
                  Cliente:
                </p>
                <p>
                  {p.cliente.nome} {p.cliente.cognome}
                </p>
              </div>

              <div className='flex justify-start gap-5'>
                <p className='text-gray-400 gap-3'>
                  Barbiere:
                </p>
                <p>
                  {p.barbiere.nome} {p.barbiere.cognome}
                </p>
              </div>

              <div className='flex justify-start gap-5'>
                <p className='text-gray-400 gap-3'>
                  Servizio:
                </p>
                <p>
                  {p.servizio.nome}
                </p>
              </div>

              <div className='flex justify-start gap-5'>
                <p className='text-gray-400 gap-3'>
                  Orario:
                </p>
                <p>
                  {new Date(`1970-01-01T${p.orario}`).toLocaleTimeString('it-IT', {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: false,
                  })}
                </p>
              </div>

              <div className='flex justify-start gap-5'>
                <p className='text-gray-400 gap-3'>
                  Data:
                </p>
                <p>
                  {new Date(p.data).toLocaleDateString('it-IT')}
                </p>
              </div>

            </div>
            
            <div>
              <button
                onClick={() => eliminaPrenotazione(p.id)}
                className="bg-red-600 text-white text-lg mt-3 cursor-pointer px-4 py-2 rounded hover:bg-red-700"
              >
                🗑️ Elimina
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
    </>
  )
}
