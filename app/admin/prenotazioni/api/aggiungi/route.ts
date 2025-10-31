import { createClient } from '@/utils/supabase/server'

export async function POST(req: Request) {
  const { 
    cliente_id, 
    barber_id, 
    data, 
    orario, 
    service_id 
  } = await req.json()
  const supabase = await createClient()

  // 🔍 Controllo: giornata bloccata per tutti o per il barbiere
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { data: blocchiGiorno, error: errBlocchi } = await supabase
    .from('orari_bloccati')
    .select('id')
    .eq('data', data)
    .is('orario', null)
    .or(`barbiere_id.is.null,barbiere_id.eq.${barber_id}`)
    .limit(1)

  if (blocchiGiorno && blocchiGiorno.length > 0) {
    return Response.json({ error: 'La giornata è bloccata per questo barbiere' }, { status: 409 })
  }

  // Verifica se esiste già una prenotazione per quel barbiere, data e ora
  const { data: esistente, error: checkError } = await supabase
    .from('bookings')
    .select('id')
    .eq('barber_id', barber_id)
    .eq('data', data)
    .eq('orario', orario)
    .single()

  if (checkError?.code !== 'PGRST116' && esistente) {
    return Response.json({ error: 'Orario già occupato per questo barbiere' }, { status: 409 })
  }

  // 🔍 Controllo: orario bloccato per il barbiere o tutti
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { data: blocchiOrario, error: errBlocchiOrario } = await supabase
    .from('orari_bloccati')
    .select('id')
    .eq('data', data)
    .eq('orario', orario)
    .or(`barbiere_id.is.null,barbiere_id.eq.${barber_id}`)
    .limit(1)

  if (blocchiOrario && blocchiOrario.length > 0) {
    return Response.json({ error: 'Orario bloccato per questo barbiere' }, { status: 409 })
  }

      // Controllo: cliente ha già una prenotazione quel giorno
    const { data: doppia, error: doppiaError } = await supabase
      .from('bookings')
      .select('id')
      .eq('cliente_id', cliente_id)
      .eq('data', data)
      .single()

    if (doppiaError?.code !== 'PGRST116' && doppia) {
      return Response.json({ error: 'Il cliente ha già una prenotazione per questo giorno' }, { status: 409 })
    }

  const { error } = await supabase
    .from('bookings')
    .insert({ cliente_id, barber_id, data, orario, service_id })

    if (error) {
      console.error('Errore Supabase:', error.message)
      return Response.json({ error: error.message }, { status: 500 })
    }
    
  return Response.json({ success: true })
}
