'use client'
import { useState, useEffect } from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import Link from 'next/link'
import { registerLocale } from 'react-datepicker'
import { it } from 'date-fns/locale/it'

registerLocale('it', it)

type Persona = { id: string; nome: string; cognome: string }
type Servizio = { id: string; nome: string }

const ORARI = [
    '09:00', 
    '09:40', 
    '10:20', 
    '11:00', 
    '11:40', 
    '12:20', 
    '13:00', 
    '15:00',
    '15:40',
    '16:20',
    '17:00',
    '17:40',
    '18:20'
];

export default function AggiungiPrenotazione() {
  const [clienteQuery, setClienteQuery] = useState('')
  const [barberQuery, setBarberQuery] = useState('')
  const [clienti, setClienti] = useState<Persona[]>([])
  const [barbieri, setBarbieri] = useState<Persona[]>([])
  const [servizi, setServizi] = useState<Servizio[]>([])
  const [clienteId, setClienteId] = useState('')
  const [barberId, setBarberId] = useState('')
  const [serviceId, setServiceId] = useState('')
  const [data, setData] = useState<Date | null>(new Date())
  const [orario, setOrario] = useState('')
  const [dateBloccate, setDateBloccate] = useState<Date[]>([])

  useEffect(() => {
    if (clienteQuery.length > 1) {
      fetch(`/api/clienti?query=${clienteQuery}`)
        .then(res => res.json())
        .then(setClienti)
    }
  }, [clienteQuery])

  // USE EFFECT PER LE DATE
  useEffect(()=> {
    if (!barberId) return
    async function caricaDateBloccate() {
    const res = await fetch('/admin/orari/api/date-bloccate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ barbiere_id: barberId }),
    })
    const dates = await res.json()
    // Normalizza le date a mezzanotte locale
    const parsed = dates.map((d: string) => {
      const date = new Date(d)
      date.setHours(0, 0, 0, 0)
      return date
    })

    setDateBloccate(parsed)
  }
  caricaDateBloccate();
  }, [barberId]);

  // USE EFFECT PER LA RICERCA BARBIERI
  useEffect(() => {
    if (barberQuery.length > 1) {
      fetch(`/api/barbieri?query=${barberQuery}`)
        .then(res => res.json())
        .then(setBarbieri)
    }
  }, [barberQuery])

  // USE EFFECT PER ISERVIZI
  useEffect(() => {
    fetch(`/api/servizi`)
      .then(res => res.json())
      .then(setServizi)
  }, [])

  async function creaPrenotazione() {
    if (!clienteId || !barberId || !serviceId || !data || !orario) {
      alert('Compila tutti i campi')
      return
    }

    const res = await fetch('/admin/prenotazioni/api/aggiungi', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        cliente_id: clienteId,
        barber_id: barberId,
        service_id: serviceId,
        data: data.toISOString().split('T')[0],
        orario,
      }),
    })

    const result = await res.json()

    if (!res.ok) {
    console.error('Errore API:', result)
    alert(`Errore: ${result.error || JSON.stringify(result)}`)
    return
    }

    alert('Prenotazione creata!')
    setClienteId('')
    setBarberId('')
    setServiceId('')
    setData(new Date())
    setOrario('')
    setClienteQuery('')
    setBarberQuery('')
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
    <div className="max-w-xl mx-auto p-6 relative text-white">
      <h2 className="text-4xl md:text-5xl font-bold mb-16 text-center">
        Aggiungi Prenotazione
      </h2>

      {/* Cliente */}
      <input
        value={clienteQuery}
        onChange={e => setClienteQuery(e.target.value)}
        placeholder="Cerca cliente"
        className="border p-3 text-lg rounded w-full mb-2 focus:outline-none"
      />
      {clienti.length > 0 && (
        <div className="border rounded bg-gray-800 shadow absolute text-lg z-10 w-full">
          {clienti.map(c => (
            <div key={c.id} className="p-2 hover:bg-gray-700 cursor-pointer" onClick={() => {
              setClienteId(c.id)
              setClienteQuery(`${c.nome} ${c.cognome}`)
              setClienti([])
            }}>
              {c.nome} {c.cognome}
            </div>
          ))}
        </div>
      )}

      {/* Barbiere */}
      <input
        value={barberQuery}
        onChange={e => setBarberQuery(e.target.value)}
        placeholder="Cerca barbiere"
        className="border p-3 text-lg rounded w-full mb-2 focus:outline-none"
      />
      {barbieri.length > 0 && (
        <div className="border rounded bg-gray-800 shadow absolute text-lg z-10 w-full">
          {barbieri.map(b => (
            <div key={b.id} className="p-2 hover:bg-gray-700 cursor-pointer" onClick={() => {
              setBarberId(b.id)
              setBarberQuery(`${b.nome} ${b.cognome}`)
              setBarbieri([])
            }}>
              {b.nome} {b.cognome}
            </div>
          ))}
        </div>
      )}

      {/* Servizio */}
      <div className="mb-4 mt-10">
        <label className="block mb-1 text-xl">
          Seleziona servizio
        </label>
        <div className="flex flex-wrap gap-2">
          {servizi.map(s => (
            <button
              key={s.id}
              onClick={() => setServiceId(s.id)}
              className={`px-4 py-2 rounded text-lg ${serviceId === s.id ? 'bg-blue-800 text-white' : 'bg-gray-700 hover:bg-gray-600 cursor-pointer'}`}
            >
              {s.nome}
            </button>
          ))}
        </div>
      </div>

      {/* Calendario visivo */}
      <div className="mb-4 mt-10">
        <label className="block mb-1 text-xl">
          Seleziona data
        </label>
        <DatePicker
          selected={data}
          onChange={setData}
          dateFormat="dd/MM/yyyy"
          inline
          minDate={new Date()}
          filterDate={(date) => {
            const normalized = new Date(date)
            normalized.setHours(0, 0, 0, 0)

            const isBloccata = dateBloccate.some(d => d.getTime() === normalized.getTime())
            const day = date.getDay()
            const isWeekend = day === 0 || day === 1

            return !isWeekend && !isBloccata
          }}
          locale="it"
        />
      </div>

      {/* Orario */}
      {data && (
        <div className="mb-4 mt-10">
          <label className="block mb-1 text-xl">
            Seleziona orario
          </label>
          <div className="flex flex-wrap gap-2">
            {ORARI.map(o => (
              <button
                key={o}
                onClick={() => setOrario(o)}
                className={`px-4 py-2 rounded text-lg ${orario === o ? 'bg-blue-800 text-white' : 'bg-gray-700 hover:bg-gray-600 cursor-pointer '}`}
              >
                {o}
              </button>
            ))}
          </div>
        </div>
      )}
      {!data && (
        <p className="text-xl text-gray-500 mb-4">
          Seleziona prima una data per vedere gli orari disponibili
        </p>
      )}

      <button onClick={creaPrenotazione} className="bg-green-600 text-white px-5 py-3 text-xl cursor-pointer rounded hover:bg-green-700 w-full">
        Crea prenotazione
      </button>
    </div>
    </>
  )
}
