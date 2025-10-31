import { createClient } from '@/utils/supabase/server'

export async function POST(req: Request) {
  const body = await req.json()
  const { cliente_id, barber_id, service_id, data, orario } = body

  const supabase = await createClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (!user || authError) {
    return Response.json({ error: 'Utente non autenticato' }, { status: 401 })
  }

  // Verifica che il barbiere autenticato stia creando la prenotazione per sé
  if (user.id !== barber_id) {
    return Response.json({ error: 'Non autorizzato a creare prenotazioni per altri barbieri' }, { status: 403 })
  }


  // ✅ Verifica se la giornata è bloccata
  const { data: bloccoGiorno } = await supabase
    .from('orari_bloccati')
    .select('id')
    .eq('data', data)
    .is('orario', null)
    .or(`barbiere_id.is.null,barbiere_id.eq.${barber_id}`)

  if (bloccoGiorno && bloccoGiorno.length > 0) {
    return Response.json({ error: 'Giornata bloccata' }, { status: 409 })
  }

  // ✅ Verifica se l’orario è bloccato
  const { data: bloccoOrario } = await supabase
    .from('orari_bloccati')
    .select('id')
    .eq('data', data)
    .eq('orario', orario)
    .or(`barbiere_id.is.null,barbiere_id.eq.${barber_id}`)

  if (bloccoOrario && bloccoOrario.length > 0) {
    return Response.json({ error: 'Orario bloccato' }, { status: 409 })
  }

  // ✅ Verifica se l’orario è già prenotato
  const { data: esistente } = await supabase
    .from('bookings')
    .select('id')
    .eq('data', data)
    .eq('orario', orario)
    .eq('barber_id', barber_id)
    .single()

  if (esistente) {
    return Response.json({ error: 'Orario già prenotato' }, { status: 409 })
  }
  
  // Crea la prenotazione
  const { error: insertError } = await supabase
    .from('bookings')
    .insert([{
      cliente_id,
      barber_id,
      service_id,
      data,
      orario,
    }])

  if (insertError) {
    return Response.json({ error: insertError.message }, { status: 500 })
  }

  return Response.json({ success: true })
}
