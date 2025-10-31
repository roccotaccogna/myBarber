import { createClient } from '@/utils/supabase/server'

export async function POST(req: Request) {
  const { id } = await req.json()
  const supabase = await createClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (!user || authError) {
    return Response.json({ error: 'Utente non autenticato' }, { status: 401 })
  }

  // Verifica che la prenotazione appartenga al barbiere autenticato
  const { data: prenotazione, error: fetchError } = await supabase
    .from('bookings')
    .select('id')
    .eq('id', id)
    .eq('barber_id', user.id)
    .single()

  if (fetchError || !prenotazione) {
    return Response.json({ error: 'Prenotazione non trovata o non autorizzata' }, { status: 403 })
  }

  // Elimina la prenotazione
  const { error: deleteError } = await supabase
    .from('bookings')
    .delete()
    .eq('id', id)

  if (deleteError) {
    return Response.json({ error: deleteError.message }, { status: 500 })
  }

  return Response.json({ success: true })
}
