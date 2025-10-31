import { createClient } from '@/utils/supabase/server'

export async function POST(req: Request) {
  const { data, barbiere_id } = await req.json()
  const supabase = await createClient()

  const ORARI_STANDARD = [
    '09:00','09:40','10:20','11:00','11:40','12:20',
    '13:00','15:00','15:40','16:20','17:00','17:40','18:20'
  ]

  // ✅ BLOCCO GIORNATA INTERA
  const { data: bloccoGiorno } = await supabase
    .from('orari_bloccati')
    .select('id')
    .eq('data', data)
    .is('orario', null)
    .or(`barbiere_id.is.null,barbiere_id.eq.${barbiere_id}`)

  if (bloccoGiorno && bloccoGiorno.length > 0) {
    return Response.json([]) // giornata interamente bloccata
  }

  // Orari già prenotati
  const { data: prenotati } = await supabase
    .from('bookings')
    .select('orario')
    .eq('data', data)
    .eq('barber_id', barbiere_id)

  // Orari bloccati
  const { data: blocchi } = await supabase
    .from('orari_bloccati')
    .select('orario')
    .eq('data', data)
    .or(`barbiere_id.is.null,barbiere_id.eq.${barbiere_id}`)

const orariPrenotati = prenotati?.map(p => {
  const raw = p.orario
  if (!raw) return null

  // Se è stringa tipo '09:00:00', prendi solo 'HH:mm'
  if (typeof raw === 'string') {
    return raw.slice(0, 5)
  }

  // Se è oggetto Date, converti in 'HH:mm'
  const iso = new Date(`1970-01-01T${raw}`).toISOString()
  return iso.slice(11, 16)
}).filter(Boolean) ?? []

console.log('Orari prenotati:', orariPrenotati)
console.log('Controllo orari prenotati per:', { data, barbiere_id })


    const orariBloccati = blocchi?.map(b => String(b.orario).slice(0, 5)).filter(Boolean) ?? []

const orariDisponibili = ORARI_STANDARD
  .filter(o => !orariPrenotati.includes(o))
  .filter(o => !orariBloccati.includes(o))

  return Response.json(orariDisponibili)
}
