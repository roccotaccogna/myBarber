import { createClient } from '@/utils/supabase/server'

export async function POST(req: Request) {
  const body = await req.json()
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return new Response(JSON.stringify({ error: 'Utente non autenticato' }), { status: 401 })
  }

  const cliente_id = user.id
  const { barber_id, service_id, data, orario } = body

  // ✅ Controllo prenotazione già esistente
  const { data: esistente, error: erroreControllo } = await supabase
    .from('bookings')
    .select('id')
    .eq('cliente_id', cliente_id)
    .eq('data', data)
    .eq('orario', orario)
    .limit(1)

  if (erroreControllo) {
    return new Response(JSON.stringify({ error: erroreControllo.message }), { status: 500 })
  }

  if (esistente && esistente.length > 0) {
    return new Response(JSON.stringify({ error: 'Hai già una prenotazione a quell\'ora.' }), { status: 409 })
  }

  // ✅ Inserimento prenotazione
  const { error } = await supabase
    .from('bookings')
    .insert([{ cliente_id, barber_id, service_id, data, orario }])

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 })
  }

  return new Response(JSON.stringify({ success: true }), { status: 200 })
}
